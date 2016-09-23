
var util = require("./util");

// see 743709-SO_-_PROJETO_II__2016_1.pdf
var config = {
  numprocesses: 15,// processos pra criar e botar na fila
  strategies: ["first fit", "best fit", "worst fit", "next fit"],//estratégias de alocação
  currentstrategy: 1,// estratégia selecionada'
  memorysizemb: 100,// tamanho da memória de simulação
  sistopmemorymb: 10,// memória gasta com o SO
  processmemoryrangemb: [1, 35],// ranges de tamanho de memória dos processos
  timebetweenprocrangesec: [1, 10],// range de tempo entre as alocações
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
  lastallocation:0,
  init: function (config) {
    
    // select the strategy to use 
    simulation.strategy=config.strategies[config.currentstrategy];
    
    // all the process that will ever exists
    var i = config.numprocesses;
    while (i--) {
      simulation.processqueue.push({
        queuedat: new Date().getTime(),
        duration: util.rangeutil(config.timeprocdurationrangesec),
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
  },
  step:function(){
    if(simulation.running){
      // how to simulate: 
      // 1 - take one process from the simulation.processqueue
      
      // 2 - check if now is greater (later) than last allocation + now
      // 2.1 - if not, yeld
      // 2.2 - if yes, pop() the queue 
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

window.simulation=simulation;