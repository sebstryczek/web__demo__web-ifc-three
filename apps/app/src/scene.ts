import { createStats } from "stats";
import {
  AmbientLight,
  Color,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class ThreeScene {
  private canvas: HTMLCanvasElement;

  private _scene: Scene;
  get scene() {
    return this._scene;
  }

  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private controls: OrbitControls;
  private stats: { update: () => void };
  private grid: GridHelper;

  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
    if (canvas === null) {
      throw new Error("Could not find canvas element");
    }

    this.canvas = canvas;

    this._scene = new Scene();
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.renderer = new WebGLRenderer({
      antialias: true,
      canvas,
    });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.grid = new GridHelper();
    this.setupScene();

    this.stats = createStats({ renderer: this.renderer });
  }

  setupScene() {
    this.setupBasics();
    this.setupLights();
    this.setupWindowResize();
    this.setupAnimation();
    this.setupCamera();
    this.scene.add(this.grid);
  }

  setupAnimation = () => {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    if (this.stats !== undefined) {
      this.stats.update();
    }

    requestAnimationFrame(this.setupAnimation);
  };

  setupBasics() {
    this.scene.background = new Color("#FBFAF5");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.camera.position.z = 5;
  }

  setupLights() {
    const directionalLight1 = new DirectionalLight("#ffeeff", 0.8);
    directionalLight1.position.set(1, 1, 1);
    this.scene.add(directionalLight1);
    const directionalLight2 = new DirectionalLight("#ffffff", 0.8);
    directionalLight2.position.set(-1, 0.5, -1);
    this.scene.add(directionalLight2);
    const ambientLight = new AmbientLight("#ffffee", 0.25);
    this.scene.add(ambientLight);
  }

  setupWindowResize() {
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  setupCamera() {
    this.camera.position.set(10, 10, 10);
    this.controls.target.set(0, 0, 0);
  }
}
