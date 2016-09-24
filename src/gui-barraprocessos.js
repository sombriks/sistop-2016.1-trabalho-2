
var PIXI = require("pixi.js");

var style = {
  font: 'bold 36px Mono',
  fill: '#FFFFFF',
  stroke: '#0000FF',
  strokeThickness: 5
};

var processos = new PIXI.Text('Processos', style);

var lista = new PIXI.Text('', {
  font: 'bold Mono 12px',
  fill: '#FFFFFF',
  wordWrap: true,
  wordWrapWidth: 440
})

exports.insert = function (stage, renderer) {

  processos.x = renderer.width / 3;
  processos.y = 50;
  stage.addChild(processos);

  lista.x = renderer.width / 3;
  lista.y = 100;
  stage.addChild(lista);
};

exports.step = function (sim) {
  lista.text = "\n";
  var i = sim.processqueue.length;
  while (i--) {
    var p = sim.processqueue[i];
    lista.text += "MB: " + p.memoryused;
    lista.text += " DT: " + p.duration_time;
    lista.text += " WT: " + p.creation_time + "\n";
  }
}