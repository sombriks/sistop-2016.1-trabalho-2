
var PIXI = require("pixi.js");

var style = {
  font: 'bold 36px Mono',
  fill: '#FFFFFF',
  stroke: '#0000FF',
  strokeThickness: 5
};

var processos = new PIXI.Text('Processos', style);

var filaproc = new PIXI.Text('', {
  font: 'bold Mono 12px',
  fill: '#FFFFFF',
  wordWrap: true,
  wordWrapWidth: 440
});

var memoproc = new PIXI.Text('', {
  font: 'bold Mono 12px',
  fill: '#FFFFFF',
  wordWrap: true,
  wordWrapWidth: 440
});

exports.insert = function (stage, renderer) {

  processos.x = 200;
  processos.y = 50;
  stage.addChild(processos);

  filaproc.x = 350;
  filaproc.y = 100;
  stage.addChild(filaproc);

  memoproc.x = 100;
  memoproc.y = 100;
  stage.addChild(memoproc);
};

exports.step = function (sim) {

  filaproc.text = "Processos na fila:\n";
  if(sim.memoryfull)
    filaproc.text+="<"+sim.memoryfull+">\n"
  var i = sim.processqueue.length;
  while (i--) {
    var p = sim.processqueue[i];
    filaproc.text += "[PROCESS#"+p.key+"]\n";
    filaproc.text += "Memory: " + p.memoryused+" MB\n";
    filaproc.text += "Duration: " + p.duration_time/1000+" s\n";
    filaproc.text += "Wait: " + p.creation_time/1000+" s\n";
  }

  memoproc.text = "Processos em execução:\n";
  var next = sim.memorymap;
  while (next) {
    if (next.label == "SO")
      memoproc.text += "[SO] ";
    else if (next.label == "free")
      memoproc.text += "[FREE] ";
    else {
      var p = next.process;
      var ms = (new Date().getTime() - p.finish_at.getTime());
      var s = Math.floor(ms / 1000);
      memoproc.text += "[PROCESS#"+p.key+"] T: " + s + " s "
    }
    memoproc.text += next.memostart + " MB - " + next.memoend + " MB\n";
    next = next.next;
  }
}