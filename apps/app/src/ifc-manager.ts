import { Matrix4 } from "three";
import * as THREE from "three";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";
import { IfcModel } from "web-ifc-three/IFC/BaseDefinitions";
import { Subset } from "web-ifc-three/IFC/components/subsets/SubsetManager";
import { IFCLoader } from "web-ifc-three/IFCLoader";

import { ifcCategories } from "./constants/ifcCategories";
import { CategoryName } from "./types/categoryId";

class IfcManager {
  private scene: THREE.Scene;
  private ifcModels: Array<IfcModel> = [];
  private ifcLoader: IFCLoader;

  private offset = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.ifcLoader = new IFCLoader();
    this.setupIfcLoader();
  }

  private async setupIfcLoader() {
    // await this.ifcLoader.ifcManager.useWebWorkers(
    //   true,
    //   "web-ifc-three/IFCWorker.js",
    // );

    await this.ifcLoader.ifcManager.setWasmPath(
      "./web-ifc-three/web-ifc-0.0.42/",
    );

    await this.ifcLoader.ifcManager.parser.setupOptionalCategories({
      [ifcCategories.IFCSPACE]: true,
      [ifcCategories.IFCOPENINGELEMENT]: true,
      // IFCBOUNDINGBOX: false,
      // IFCGEOMETRICCURVESET: false,
    });

    this.ifcLoader.ifcManager.setupThreeMeshBVH(
      computeBoundsTree,
      disposeBoundsTree,
      acceleratedRaycast,
    );
  }

  private subsets: Partial<Record<CategoryName, Subset>> = {};

  public async loadIFC(file: Blob | MediaSource) {
    const start = window.performance.now();

    const ifcURL = URL.createObjectURL(file);
    this.ifcLoader.ifcManager.setOnProgress((event) =>
      console.log(`Loading progress: ${event.loaded}/${event.total}`),
    );

    const firstModel = this.ifcModels.length === 0;

    this.ifcLoader.ifcManager.useFragments = true;
    await this.ifcLoader.ifcManager.applyWebIfcConfig({
      COORDINATE_TO_ORIGIN: firstModel,
      USE_FAST_BOOLS: false,
    });

    // @ts-expect-error loadAsync exists
    const ifcModel = await this.ifcLoader.loadAsync(ifcURL);

    // const version = this.ifcLoader.ifcManager.ifcAPI.GetVersion(); // Verify how to use it when using multithreading
    // console.log(`IFC version: ${version}`);

    const unsupportedTypes =
      this.ifcLoader.ifcManager.ifcAPI.wasmModule.GetUnsupportedTypes();
    console.error(unsupportedTypes);

    if (firstModel) {
      const matrixArray =
        await this.ifcLoader.ifcManager.ifcAPI.GetCoordinationMatrix(
          ifcModel.modelID,
        );
      const matrix = new Matrix4().fromArray(matrixArray);
      this.ifcLoader.ifcManager.setupCoordinationMatrix(matrix);
    }

    if (this.ifcModels.length === 0) {
      this.ifcModels.push(ifcModel);
    } else {
      const offsetX = THREE.MathUtils.randInt(0, 100);
      const offsetY = THREE.MathUtils.randInt(0, 100);
      const offsetZ = THREE.MathUtils.randInt(0, 100);
      ifcModel.position.set(offsetX, offsetY, offsetZ);
      this.scene.add(ifcModel);
    }

    const stop = window.performance.now();

    console.log(`Time Taken to load = ${(stop - start) / 1000} seconds`);

    this.setupCategories(Object.keys(ifcCategories) as Array<CategoryName>);
  }

  // private getCategoryName(category: CategoryId) {
  //   const names = Object.keys(categories) as Array<keyof typeof categories>;
  //   return names.find((name) => categories[name] === category);
  // }

  // private async getAll(category: CategoryId) {
  //   const manager = this.ifcLoader.ifcManager;
  //   return manager.getAllItemsOfType(0, category, false);
  // }

  private async newSubsetOfType(categoryName: CategoryName) {
    const categoryId = ifcCategories[categoryName];
    const ids = await this.ifcLoader.ifcManager.getAllItemsOfType(
      0,
      categoryId,
      false,
    );

    return this.ifcLoader.ifcManager.createSubset({
      modelID: 0,
      scene: this.scene,
      ids,
      removePrevious: true,
      customID: categoryName,
    });
  }

  async setupCategories(categories: Array<CategoryName>) {
    for (const category of categories) {
      this.subsets[category] = await this.newSubsetOfType(category);
    }
  }

  public showCategory(categoryName: CategoryName) {
    // const categoryId = ifcCategories[categoryName];
    const subset = this.subsets[categoryName];

    if (subset !== undefined) {
      this.scene.add(subset);
    }
  }

  public hideCategory(categoryName: CategoryName) {
    // const categoryId = ifcCategories[categoryName];
    const subset = this.subsets[categoryName];

    if (subset !== undefined) {
      subset.removeFromParent();
    }
  }
}

export { IfcManager };
