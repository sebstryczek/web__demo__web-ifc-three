import "./style.css";

import * as UI from "tweakpane";
// @ts-expect-error
import * as TweakpaneFileImportPlugin from "tweakpane-plugin-file-import";

import { ifcCategories } from "./constants/ifcCategories";
import { IfcManager } from "./ifc-manager";
import { ThreeScene } from "./scene";
import { CategoryName } from "./types/categoryId";

const baseScene = new ThreeScene();
const ifcManager = new IfcManager(baseScene.scene);

const pane = new UI.Pane();
pane.registerPlugin(TweakpaneFileImportPlugin);

const ifcCategoryNames = Object.keys(ifcCategories) as Array<CategoryName>;

const UI_STATE = {
  file: "",
  ...ifcCategoryNames.reduce(
    (accumulator, name) => ({ ...accumulator, [name]: true }),
    {} as Record<string, boolean>,
  ),
};

const parameters = {
  amountOfDuplicates: 1,
};

const handleOnFileSelected = async (event: UI.TpChangeEvent<unknown>) => {
  const file = event.value as File;

  fileInput.disabled = true;

  await ifcManager.loadIFC(file);

  (Object.keys(UI_STATE) as Array<keyof typeof UI_STATE>).forEach((name) => {
    if (name === "file") {
      return;
    }

    pane.addInput(UI_STATE, name).on("change", (event) => {
      const value = event.value as boolean;

      if (value === true) {
        ifcManager.showCategory(name);
      } else {
        ifcManager.hideCategory(name);
      }
    });
  });

  pane.addSeparator();

  pane.addInput(parameters, "amountOfDuplicates", {
    min: 1,
    max: 1000,
    step: 1,
  });

  pane.addButton({ title: "Add IFC duplicate" }).on("click", async () => {
    for (let index = 0; index < parameters.amountOfDuplicates; index++) {
      ifcManager.loadIFC(file);
    }
  });
};

const fileInput = pane
  .addInput(UI_STATE, "file", {
    view: "file-input",
    lineCount: 1,
    filetypes: [".ifc"],
  })
  .on("change", handleOnFileSelected);
