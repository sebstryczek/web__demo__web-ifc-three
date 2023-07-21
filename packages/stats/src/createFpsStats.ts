import Stats from "three/examples/jsm/libs/stats.module.js";

const createFpsStats = () => {
  const stats = new Stats();
  stats.showPanel(0);
  document.body.append(stats.dom);

  return stats;
};

export { createFpsStats };
