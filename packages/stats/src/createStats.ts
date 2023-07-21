import { createFpsStats } from "./createFpsStats";
import { createMemoryStats } from "./createMemoryStats";
import { createRendererStats } from "./createRendererStats";

const STATS_PANEL_HEIGHT = 48;

const createStats = ({ renderer }: { renderer: THREE.WebGLRenderer }) => {
  const rendererStats = createRendererStats({ renderer });
  rendererStats.dom.style.top = "0px";

  const fpsStats = createFpsStats();
  fpsStats.dom.style.top = `${STATS_PANEL_HEIGHT}px`;

  const memoryStats = createMemoryStats();
  memoryStats.dom.style.top = `${STATS_PANEL_HEIGHT * 2}px`;

  return {
    update: () => {
      fpsStats.update();
      memoryStats.update();
      rendererStats.update();
    },
  };
};

export { createStats };
