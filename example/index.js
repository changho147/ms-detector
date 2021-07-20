import * as Detector from "../lib/detector.js"

let text = "Lorem";
Detector.set("TEXT", text);

text = "Ipsum";
const isChangedText = Detector.detect("TEXT", text);

// true
console.log(isChangedText);

let obj = {A: "Lorem", B: "Ipsum"};
Detector.set("OBJ", obj);

obj.B = "Lorem";
obj.A = "Ipsum";
const isChangedObj = Detector.detect("OBJ", obj);

// true
console.log(isChangedObj);

