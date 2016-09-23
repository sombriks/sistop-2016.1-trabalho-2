
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
    return 1;
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
  }
}

module.exports = utilities;