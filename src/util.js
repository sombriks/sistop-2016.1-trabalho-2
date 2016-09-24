
var utilities = {
  rangeutil: function (range) {
    var a = range[0];
    var b = range[1];
    return Math.floor(a + Math.random() * (b - a));
  },
  allocate: function (proc, simu) {
    switch (simu.strategy) {
      case "first fit":
        return utilities.firstfit(proc, simu);
      case "best fit":
        return utilities.bestfit(proc, simu);
      case "worst fit":
        return utilities.worstfit(proc, simu);
      case "next fit":
        return utilities.nextfit(proc, simu);
      default:
        console.log("no allocation strategy defined!");
        return 0;
    }
  },
  firstfit: function (proc, simu) {
    console.log("using first fit:");
    // start from the begining of the memory map
    var next = simu.memorymap;
    while (next) {
      if (next.label == "free") {
        if (next.memoend - next.memostart >= proc.memoryused) {
          utilities.mapproc(proc, simu, next);
          simu.lastnode = next;
          return 1;
        }
      }
      next = next.next;
    }
    console.log("there is no available memory");
    return 0;
  },
  bestfit: function (proc, simu) {
    console.log("using best fit:");
    return 1;
  },
  worstfit: function (proc, simu) {
    console.log("using worst fit:");
    return 1;
  },
  nextfit: function (proc, simu) {
    console.log("using next fit:");
    return 1;
  },
  mapproc: function (proc, simu, nodemap) {
    // assume nodemap is free and proc fits on the node
    nodemap.label = "proc-" + proc.created_at;
    nodemap.process = proc;
    proc.nodemap=nodemap;
    // allocate
    var i = nodemap.memostart + proc.memoryused;
    while (i--) {
      simu.physicalmemory[i].free = false;
    }
    // check if there is remaining memory
    if (nodemap.memoend > nodemap.memostart + proc.memoryused) {
      var newnode = {
        memostart: nodemap.memostart + proc.memoryused,
        memoend: nodemap.memoend,
        label: "free",
      };
      nodemap.memoend = nodemap.memostart + proc.memoryused;
      // time to link it back
      if (nodemap.next)
        newnode.next = nodemap.next;
      nodemap.next = newnode;
    }
  },
  releaseproc: function (simu, nodemap) {
    nodemap.label = "free"
    var i = nodemap.memoend;
    while (i-- > nodemap.memostart) {
      simu.physicalmemory[i].free = true;
    }
    delete nodemap.process.nodemap;
    delete nodemap.process;
  },
  freememory: function (simu) {
    var next = simulation.memorymap;
    var prev = simulation.memorymap;
    while (next) {
      if (prev != next && prev.label == "free" && next.label == "free") {
        prev.memoend = next.memoend;
        prev.next = next.next;
        next = prev;
        // free memory merged
        console.log("free memory merged: ");
        console.log(next);
      }
      prev = next;
      next = next.next;
    }
  }
}

module.exports = utilities;