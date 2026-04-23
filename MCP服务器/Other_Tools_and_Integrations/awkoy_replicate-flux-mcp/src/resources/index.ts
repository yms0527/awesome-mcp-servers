import { registerImageListResource } from "./imageList.js";
import { registerPreditionListResource } from "./predictionList.js";
import { registerSvgListResource } from "./svgList.js";

export const registerAllResources = () => {
  registerImageListResource();
  registerPreditionListResource();
  registerSvgListResource();
};
