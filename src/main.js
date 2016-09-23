
var util = require("./util");

// see 743709-SO_-_PROJETO_II__2016_1.pdf
var config = {
  numprocesses: 15,// processos pra criar e botar na fila
  strategies: ["first fit", "best fit", "worst fit", "next fit"],//estratégias de alocação
  currentstrategy: 0,// estratégia selecionada'
  memorysizemb: 100,// tamanho da memória de simulação
  sistopmemorymb: 10,// memória gasta com o SO
  processmemoryrangemb: [1, 35],// ranges de tamanho de memória dos processos
  timeproccreationrangesec: [1, 10],// range de tempo de criação de cada processo'
  timeprocdurationrangesec: [3, 30],// range de duração de cada processos
  simulationstepsec: 1// sleep da simulação em segundos
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
      simulation.processqueue.push({
        queued_at: new Date(),
        duration_time: util.rangeutil(config.timeprocdurationrangesec) * 1000,
        creation_time: util.rangeutil(config.timeproccreationrangesec) * 1000,
        memoryused: util.rangeutil(config.processmemoryrangemb)
      });
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
    simulation.memorymap.memoend = config.sistopmemorymb - 1;
    simulation.memorymap.next = {
      label: "free",
      memostart: simulation.memorymap.memoend + 1,
      memoend: config.memorysizemb - 1
    };
    // last used node
    simulation.lastnode=simulation.memorymap;
  },
  step: function () {
    if (simulation.running) {
      var proc = simulation.processqueue.pop()
      if (proc) {
        if (simulation.lastallocation + proc.creation_time <= new Date().getTime()) {
          proc.created_at = new Date(proc.creation_time + new Date().getTime());
          if(util.allocate(proc,simulation)){
            simulation.lastallocation = proc.created_at.getTime();
            console.log(proc)
          }else{
            // unable to alloc, try again later
            simulation.processqueue.push(proc);
          }
        } else {
          simulation.processqueue.push(proc);
        }
      }else{
        console.log("queue empty");
      }
      // 3 - look for allocation strategy
      // 3.1 - if there is no available node according to memory map, push() back and yeld 
      // 3.1 - if there is a node, allocate process and add it to memory map
      // 4 - look the memory map and look for ended process
      // 4.1 - if there is no ended process, yeld 
      // 4.2 - if found, remove if from memmap and free memory
      // 5 - look for two consecutive free nodes
      // 5.1 - if there is no consecutive nodes, yed
      // 5.2 - if found, merge those nodes and back to 5

    }
    requestAnimationFrame(simulation.step);
  }
};

simulation.init(config);

simulation.step();

console.log(simulation);

window.simulation = simulation;

simulation.running=true;