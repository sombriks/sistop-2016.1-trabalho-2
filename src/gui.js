var PIXI = require("pixi.js");

var barramemo = require("./gui-barramemoria");
var barraproc = require("./gui-barraprocessos");

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

// create the root of the scene graph
var stage = new PIXI.Container();

barramemo.insert(stage, renderer);
barraproc.insert(stage, renderer);

function step(sim) {

  barramemo.step(sim);
  barraproc.step(sim);

  renderer.render(stage);
}

exports.renderer = renderer;
exports.step = step;