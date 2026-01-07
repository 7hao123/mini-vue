import { createRenderer } from "../../lib/guide-mini-vue.esm.js";
// import { App } from "./App.js";
console.log(PIXI);

const game = new PIXI.Application({
  width: 800,
  height: 600,
});

document.body.appendChild(game.view);

const renderer = createRenderer({
  createElement(type) {},
  patchProp(el, key) {},
  insert(el, parent) {},
});

renderer.createApp(App).mount(game.stage);
// const rootContainer = document.querySelector("#app");
// createApp(App).mount(rootContainer);
