import * as Detector from "../lib/detector.js"

let obj = {name: "NAME", age: 15};
Detector.set("OBJ", obj);

obj.name = "NAMES";
obj.age = 20;
obj.gender = "male";

const detected = Detector.detect("OBJ", obj, {size: true, excludes: ["age"]});
console.log(detected);
console.log(detected);





