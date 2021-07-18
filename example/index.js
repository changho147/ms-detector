import * as Detector from "../lib/detector.js"

let text = "Lorem";
Detector.set("TEXT", text);

text = "Ipsum";
const isChangedText = Detector.detect("TEXT", text);

// true
console.log(isChangedText);

let obj = {A: "Lorem", B: "Ipsum"};
Detector.set("OBJ", obj);

obj.C = "Text";
const isChangedObj = Detector.detect("OBJ", obj, {length: true});

// true
console.log(isChangedObj);