
var util = require("./util");

var gui = require("./gui");

var angular = require("angular");

document.body.style = "margin:0px;padding:0px;overflow:hidden";
document.body.appendChild(gui.renderer.view);

// see 743709-SO_-_PROJETO_II__2016_1.pdf
var config = {
  numprocesses: 40,// processos pra criar e botar na fila
  strategies: ["first fit", "best fit", "worst fit", "next fit"],//estratégias de alocação
  currentstrategy: 0,// estratégia selecionada'
  memorysizemb: 50,// tamanho da memória de simulação
  sistopmemorymb: 10,// memória gasta com o SO
  processmemoryrangemb: [1, 1],// ranges de tamanho de memória dos processos
  timeproccreationrangesec: [1, 2],// range de tempo de criação de cada processo'
  timeprocdurationrangesec: [1, 80]// range de duração de cada processos
};


var saved = localStorage.getItem("config-simumemoria");
if (saved)
  config = JSON.parse(saved);

//console.log(config)

var simulation = {
  onestep: false,
  procseed: 100,
  running: false,
  processqueue: [],
  physicalmemory: [],
  osmemory: [],
  memorymap: {},
  lastallocation: 0,
  strategy: null,
  init: function (config) {

    // select the strategy to use 
    simulation.strategy = config.strategies[config.currentstrategy];

    // all the process that will ever exists
    var i = config.numprocesses;
    while (i--) {
      simulation.addproc2queue(config);
    }

    // building the 'physical' memory
    var j = config.memorysizemb;
    while (j--) {
      simulation.physicalmemory.push({
        free: true
      });
    }

    // we put the SO in the very first addresses 
    var k = -1;
    while (++k < config.sistopmemorymb) {
      simulation.osmemory.push(simulation.physicalmemory[k]);
      simulation.physicalmemory[k].free = false;
    }

    // put the SO and the free memory in the linked list
    simulation.memorymap.label = "SO";
    simulation.memorymap.memostart = 0;
    simulation.memorymap.memoend = config.sistopmemorymb;
    simulation.memorymap.next = {
      label: "free",
      memostart: simulation.memorymap.memoend + 1,
      memoend: config.memorysizemb
    };
    // last used node
    simulation.lastnode = simulation.memorymap;
  },
  step: function () {
    if (simulation.running || simulation.onestep) {
      // start by taing one process
      var proc = simulation.processqueue.pop();
      if (proc) {
        if (simulation.lastallocation + proc.creation_time <= new Date().getTime()) {
          proc.created_at = new Date();
          proc.finish_at = new Date(proc.created_at.getTime() + proc.duration_time);
          if (util.allocate(proc, simulation)) {
            simulation.lastallocation = proc.created_at.getTime();
            console.log("process created:");
            // console.log(proc)
            delete simulation.memoryfull;
          } else {
            // unable to alloc, try again later
            simulation.processqueue.push(proc);
            simulation.memoryfull = "Waiting memory release";
          }
        } else {
          // this not the time to allocate this one
          simulation.processqueue.push(proc);
        }
        simulation.epqueue = false;
      } else {
        if (!simulation.epqueue) {
          console.log("queue empty");
          simulation.epqueue = true;
          // avoid endless print
        }
      }
      // let's try to release memory
      var next = simulation.memorymap;
      var prev = simulation.memorymap;
      while (next) {
        if (next.label != "free" && next.label != "SO") {
          // so this node has a process
          var pr = next.process;
          // check if the process finished to execute
          if (pr.finish_at < new Date()) {
            console.log("process ended: ")
            console.log(pr);
            util.releaseproc(simulation, next);
            simulation.lastnode = prev;
          }
        }
        prev = next;
        next = next.next;
      }
      // now we'll look for two consecutives free blocks
      util.freememory(simulation);
      simulation.onestep = false;
    }
    gui.step(simulation, util);
    requestAnimationFrame(simulation.step);
  },
  addproc2queue: function (config) {
    simulation.processqueue.push({
      key: simulation.procseed++,
      queued_at: new Date(),
      duration_time: util.rangeutil(config.timeprocdurationrangesec) * 1000,
      creation_time: util.rangeutil(config.timeproccreationrangesec) * 1000,
      memoryused: util.rangeutil(config.processmemoryrangemb)
    });
  }
};

console.log("Starting simulation:");

simulation.init(config);

simulation.step();

window.simulation = simulation;

// simulation.running = true;

angular.module("simulacao-memoria", []).controller("configctl", function ($scope) {

  $scope.simulation = simulation;

  $scope.config = config;

  $scope.restart = function () {
    localStorage.setItem("config-simumemoria", JSON.stringify($scope.config));
    window.location.reload();
  };

});