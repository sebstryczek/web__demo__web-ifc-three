import * as THREE from "three";

const createRendererStats = ({ renderer }: { renderer: THREE.WebGLRenderer }) => {
  const element = document.createElement("div");

  element.style.position = "fixed";
  element.style.top = "0px";
  element.style.left = "0px";
  element.style.background = "black";
  element.style.color = "white";
  element.style.fontFamily = " Arial";
  element.style.fontSize = "0.8rem";
  element.style.height = "48px";
  element.style.lineHeight = "48px";
  element.style.padding = "0 12px";

  document.body.append(element);

  return {
    dom: element,
    update: () => {
      element.innerHTML = "STATS:" + JSON.stringify(renderer.info.render);
    },
  };
};

export { createRendererStats };
