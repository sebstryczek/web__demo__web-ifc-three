import Stats from "three/examples/jsm/libs/stats.module.js";

const createMemoryStats = () => {
  const stats = new Stats();
  stats.showPanel(2);
  document.body.append(stats.dom);

  return stats;
};

export { createMemoryStats };
