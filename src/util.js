
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
    var next = simu.memorymap;
    var best;
    while (next) {
      if (next.label == "free") {
        if (next.memoend - next.memostart >= proc.memoryused) {
          if (!best || (next.memoend - next.memostart < best.memoend - best.memostart)) {
            best = next;
          }
        }
      }
      next = next.next;
    }
    if (best) {
      utilities.mapproc(proc, simu, best);
      simu.lastnode = best;
      return 1;
    }
    console.log("there is no available memory");
    return 0;
  },
  worstfit: function (proc, simu) {
    console.log("using worst fit:");
    var next = simu.memorymap;
    var worst;
    while (next) {
      if (next.label == "free") {
        if (next.memoend - next.memostart > proc.memoryused) {
          if (!worst || (next.memoend - next.memostart > worst.memoend - worst.memostart)) {
            worst = next;
          }
        }
      }
      next = next.next;
    }
    if (worst) {
      utilities.mapproc(proc, simu, worst);
      simu.lastnode = worst;
      return 1;
    }
    console.log("there is no available memory");
    return 0;
  },
  nextfit: function (proc, simu) {
    console.log("using next fit:");
    var next = simu.lastnode;
    var worst;
    while (next) {
      if (next.label == "free") {
        if (next.memoend - next.memostart > proc.memoryused) {
          if (!worst || (next.memoend - next.memostart > worst.memoend - worst.memostart)) {
            worst = next;
          }
        }
      }
      next = next.next;
    }
    if (worst) {
      utilities.mapproc(proc, simu, worst);
      simu.lastnode = worst;
      return 1;
    } else {
      // put lastnode in the begining
      simul.lastnode = simu.memorymap;
    }
    console.log("there is no available memory");
    return 0;
  },
  mapproc: function (proc, simu, nodemap) {
    // assume nodemap is free and proc fits on the node
    nodemap.label = "proc#" + proc.key;
    nodemap.process = proc;
    proc.nodemap = nodemap;
    // allocate
    var i = nodemap.memostart + proc.memoryused;
    while (i-- > nodemap.memostart) {
      simu.physicalmemory[i].free = false;
    }
    // check if there is remaining memory
    if (nodemap.memoend > nodemap.memostart + proc.memoryused) {
      var newnode = {
        memostart: nodemap.memostart + proc.memoryused + 1,
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
    var i = nodemap.memoend;
    while (i-- > nodemap.memostart) {
      simu.physicalmemory[i].free = true;
    }
    delete nodemap.process.nodemap;
    delete nodemap.process;
    nodemap.label = "free"
  },
  freememory: function (simu) {
    var next = simu.memorymap.next;
    var prev = simu.memorymap;
    while (next) {
      if (prev != next && prev.label == "free" && next.label == "free") {
        prev.memoend = next.memoend;
        prev.next = next.next;
        next = prev;
        delete next.process;
        // free memory merged
        console.log("free memory merged: ");
        // console.log(next);
      }
      prev = next;
      next = next.next;
    }
  },
  calculateusedmemory: function (simu) {
    var used = 0;
    var free = 0;
    var i = simu.physicalmemory.length;
    while (i--) {
      if (simu.physicalmemory[i].free)
        free++;
      else
        used++;
    }
    return {
      used: used,
      free: free,
      pct: (100 * (used / (used + free))).toFixed(0) + "%"
    }
  },
  calculatemediaespera: function (simu) {
    if(simu.finishedprocess.length==0)
      return " - ";
    var i = simu.finishedprocess.length;
    var tempos = 0;
    while (i-- > 0) {
      var p = simu.finishedprocess[i];
      tempos += p.finish_at - p.queued_at;
    }
    return (tempos / simu.finishedprocess.length).toFixed(0) + " ms";
  }
}

module.exports = utilities;