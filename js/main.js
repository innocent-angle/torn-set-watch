import SetBuilder from "./set-builder.js";

const setBuilder = new SetBuilder();

await setBuilder.init();
setBuilder.generateSetItems();
setBuilder.startScanning();