import { mainInit, mainWorld, releaseInit, resetWorld } from "../Core";
import { coreRenderContext } from "../Core/Context/RenderContext";
import { coreSetup, systemContext } from "../Core/CoreSetup";
import { editorUIContext, editorEventContext } from "./EditorContext";
import { updateEntityList, addNewEntity } from "./EditorEntityListManager";
import { EditorSystemRegister } from "./EditorSystemRegister";
import { EditorCamTagAppendSystem } from "./System/EditorCamTagAppendSystem";
import { EditorInspectorSystem } from "./System/EditorInspectorSystem";

let platState = false;

export const editorInit = () => {
  console.log("Editor Started");

  // Editor initialization.

  coreRenderContext.mainCanvas = document.getElementById(
    "mainCanvas"
  ) as HTMLCanvasElement;
  editorUIContext.entityLists = document.getElementsByClassName(
    "entityList"
  ) as HTMLCollectionOf<HTMLDivElement>;
  editorUIContext.entityInspector = document.getElementsByClassName(
    "entityInspector"
  ) as HTMLCollectionOf<HTMLDivElement>;
  editorUIContext.playButton = document.getElementById(
    "playButton"
  ) as HTMLButtonElement;

  editorUIContext.entityNameInput = document.getElementById(
    "entityName"
  ) as HTMLInputElement;
  editorUIContext.createEntityButton = document.getElementById(
    "createEntityButton"
  ) as HTMLButtonElement;

  // Disable right click for main canvas.
  coreRenderContext.mainCanvas.oncontextmenu = () => false;

  // Register main world entity change.
  mainWorld.onEntityChanged.push(updateEntityList);
  // Register entity selected event.
  editorEventContext.onEntitySelected.push(
    EditorInspectorSystem.updateEntityInspector
  );

  // Core setup.
  coreSetup();

  // Editor start.
  systemContext.editorStart();

  // Register Editor System.
  new EditorSystemRegister(coreRenderContext.mainCanvas).register(mainWorld);

  // Setup editor scene camera.
  try {
    mainWorld.registerSystem(EditorCamTagAppendSystem);
  } catch (error) {
    console.error(error);
  }

  // Setup play button.
  setupPlayButton();

  // Setup create entity button.
  setupCreateEntityButton();

  // White Dwarf Engine initialization.
  mainInit();

  // Resize .
  onResize();
};
const onResize = () => {
  // Resize mainCanvas.
  if (coreRenderContext.mainCanvas) {
    coreRenderContext.mainCanvas.width =
      coreRenderContext.mainCanvas.clientWidth;
    coreRenderContext.mainCanvas.height =
      coreRenderContext.mainCanvas.clientHeight;
  }
};

const setupPlayButton = () => {
  editorUIContext.playButton?.addEventListener("click", () => {
    if (!platState) {
      if (editorUIContext.playButton) {
        editorUIContext.playButton.innerHTML = "Stop";
      }

      editorPlay();

      platState = true;
    } else {
      if (editorUIContext.playButton) {
        editorUIContext.playButton.innerHTML = "Play";
      }

      editorStop();

      platState = false;
    }
  });
};

const setupCreateEntityButton = () => {
  editorUIContext.createEntityButton?.addEventListener("click", () => {
    if (editorUIContext.entityNameInput) {
      addNewEntity(editorUIContext.entityNameInput.value);
      editorUIContext.entityNameInput.value = "";
    } else {
      addNewEntity();
    }
  });
};

const editorPlay = () => {
  // Reset the main world.
  resetWorld();

  // Register main world entity change.
  mainWorld.onEntityChanged.push(updateEntityList);

  // Call release init.
  releaseInit();
};

const editorStop = () => {
  // Reset the main world.
  resetWorld();

  // Register main world entity change.
  mainWorld.onEntityChanged.push(updateEntityList);

  // Call editor init.// Core setup.
  coreSetup();

  // Editor start.
  systemContext.editorStart();

  // Register Editor System.
  if (coreRenderContext.mainCanvas) {
    new EditorSystemRegister(coreRenderContext.mainCanvas).register(mainWorld);
  }
  // Setup editor scene camera.
  try {
    mainWorld.registerSystem(EditorCamTagAppendSystem);
  } catch (error) {
    console.error(error);
  }

  // White Dwarf Engine initialization.
  mainInit();
};

window.onload = editorInit;
window.onresize = onResize;
