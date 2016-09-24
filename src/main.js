
var util = require("./util");

var gui = require("./gui");

document.body.style="margin:0px;padding:0px;overflow:hidden";
document.body.appendChild(gui.renderer.view);

// see 743709-SO_-_PROJETO_II__2016_1.pdf
var config = {
  numprocesses: 25,// processos pra criar e botar na fila
  strategies: ["first fit", "best fit", "worst fit", "next fit"],//estratégias de alocação
  currentstrategy: 0,// estratégia selecionada'
  memorysizemb: 120,// tamanho da memória de simulação
  sistopmemorymb: 10,// memória gasta com o SO
  processmemoryrangemb: [1, 35],// ranges de tamanho de memória dos processos
  timeproccreationrangesec: [1, 5],// range de tempo de criação de cada processo'
  timeprocdurationrangesec: [3, 8]// range de duração de cada processos
};

//console.log(config)

var simulation = {
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
      memostart: simulation.memorymap.memoend,
      memoend: config.memorysizemb
    };
    // last used node
    simulation.lastnode = simulation.memorymap;
  },
  step: function () {
    if (simulation.running) {
      var proc = simulation.processqueue.pop()
      if (proc) {
        if (simulation.lastallocation + proc.creation_time <= new Date().getTime()) {
          proc.created_at = new Date(proc.creation_time + new Date().getTime());
          if (util.allocate(proc, simulation)) {
            simulation.lastallocation = proc.created_at.getTime();
            console.log("process created:");
            console.log(proc)
          } else {
            // unable to alloc, try again later
            simulation.processqueue.push(proc);
          }
        } else {
          // this not the time to allocate this one
          simulation.processqueue.push(proc);
        }
      } else {
        console.log("queue empty");
      }
      // let's try to release memory
      var next = simulation.memorymap;
      var prev = simulation.memorymap;
      while (next) {
        if (next.label != "free" && next.label != "SO") {
          // so this node has a process
          var pr = next.process;
          // check if the process finished to execute
          var t1 = pr.duration_time + pr.created_at.getTime();
          if (t1 <= new Date().getTime()) {
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
    }
    gui.step(simulation);
    requestAnimationFrame(simulation.step);
  },
  addproc2queue: function (config) {
    simulation.processqueue.push({
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

console.log(simulation);

window.simulation = simulation;

simulation.running = true;