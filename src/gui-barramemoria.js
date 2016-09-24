var PIXI = require("pixi.js");

var style = {
  font: 'bold 36px Mono',
  fill: '#FFFFFF',
  stroke: '#0000FF',
  strokeThickness: 5
};

var pxheight;// = renderer.height - 120;

var pxwidth;// = renderer.width / 15;

var titulomemoria = new PIXI.Text('Memória', style);

var barramemoria = new PIXI.Graphics();

exports.insert = function (stage, renderer) {

  pxheight = renderer.height - 120;

  pxwidth = renderer.width / 15;

  titulomemoria.x = renderer.width / 20;
  titulomemoria.y = 50;
  barramemoria.position.x = renderer.width / 18;
  barramemoria.position.y = 100;
  stage.addChild(titulomemoria);
  stage.addChild(barramemoria);
};

exports.step = function (sim) {

  barramemoria.clear();

  // define detalhes do "pincel"
  barramemoria.beginFill(0x000000);
  barramemoria.lineStyle(2, 0xFFFFFF, 1);

  barramemoria.drawRoundedRect(0, 0, pxwidth, pxheight, 5);

  barramemoria.lineStyle(0);
  var i = sim.physicalmemory.length;
  var mbsize = pxheight / i;
  while (i--) {
    var mb = sim.physicalmemory[i];
    barramemoria.beginFill(mb.free ? 0x000000 : 0xFFFFFF);
    barramemoria.drawRect(0, i * mbsize, pxwidth, mbsize);
  }

  var next = sim.memorymap;
  while (next) {
    var procsize = (next.memoend - next.memostart) * mbsize
    if (next.label == "SO") {
      barramemoria.beginFill(0x505050);
      barramemoria.drawRect(0, next.memostart * mbsize, pxwidth, procsize);
    } else if (next.process) {
      var color = (next.process.created_at.getTime() % 0xAAAAAA) + 100;
      barramemoria.beginFill(color);
      barramemoria.drawRect(0, next.memostart * mbsize, pxwidth, procsize);
    }
    next = next.next;
  }

  // fecha a pincelada
  barramemoria.endFill();
};