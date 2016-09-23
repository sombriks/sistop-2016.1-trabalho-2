
module.exports = {
  rangeutil: function (range) {
    var a = range[0];
    var b = range[1];
    return Math.floor(a + Math.random() * (b - a));
  }
}