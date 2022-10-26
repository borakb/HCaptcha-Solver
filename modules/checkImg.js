const fs = require("fs");
const jimp = require("jimp");
const { Tensor, InferenceSession } = require("onnxruntime-node");
const softmax = require("softmax-fn")

// const labels = {
//     0: "airplane",
//     1: "bicycle",
//     2: "boat",
//     3: "motorbus",
//     4: "motorcycle",
//     5: "seaplane",
//     6: "train",
//     7: "truck"
// }
let labels = fs.readFileSync("./lib/labels.txt", "utf-8");
labels = labels.split("\n");

const loadImageFromPath = async (path, dims) => {

    const imgData = await jimp.read(path).then(x => x.resize(dims[2], dims[3]));

    return imgData;

};

const imageDataToTensor = async (image, dims) => {

    var imageBufferData = image.bitmap.data;
    const [redArray, greenArray, blueArray] = new Array(new Array(), new Array(), new Array());

    let l = imageBufferData.length;

    for (let i = 0; i < l; i+=4) {


        redArray.push(imageBufferData[i]);
        greenArray.push(imageBufferData[i+1]);
        blueArray.push(imageBufferData[i+2]);


    }

    const transposedData = redArray.concat(greenArray).concat(blueArray);

    const transposedDataLength = transposedData.length;

    const float32Data = new Float32Array(dims[1] * dims[2] * dims[3]);

    for (let i = 0; i < transposedDataLength; i++) {
        float32Data[i] = transposedData[i];
    }

    const inputTensor = new Tensor("float32", float32Data, dims);

    return inputTensor;

}

const getImageTensorFromPath = async (path, dims) => {

    const image = await loadImageFromPath(path, dims); 

    const imageTensor = await imageDataToTensor(image, dims);

    return imageTensor;

}

const runInference = async (session, preprocessedData) => {

    const feeds = {};

    feeds[session.inputNames[0]] = preprocessedData;

    const outputData = await session.run(feeds);

    const output = outputData[session.outputNames[0]];
    const dataArr = Array.prototype.slice.call(output.data);

    const soft = softmax(dataArr);

    return soft;

}

const runInferenceWrapper = async (preprocessedData) => {
    const session = await InferenceSession.create("./lib/model.onnx");

    let results = await runInference(session, preprocessedData);

    return results;
}

module.exports = async (uri) => {
    
    const tensor = await getImageTensorFromPath(uri, [1, 3, 300, 300]);

    const x = await runInferenceWrapper(tensor);

    // console.log(x);

    const max = Math.max(...x);

    const i = x.indexOf(max);

    console.log("Most probable: ", labels[i]);
    return labels[i];

};