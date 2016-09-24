
var PIXI = require("pixi.js");

var style = {
  font: 'bold 36px Mono',
  fill: '#FFFFFF',
  stroke: '#0000FF',
  strokeThickness: 5
};

var processos = new PIXI.Text('Processos', style);

exports.insert = function (stage, renderer) {
  processos.x = renderer.width / 3;
  processos.y = 50;
  stage.addChild(processos);
};

exports.step=function(sim){
  var i = sim.processqueue.length;
  
}