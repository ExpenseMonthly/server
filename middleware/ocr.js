// const functions = require('firebase-functions');

const Vision = require('@google-cloud/vision');
const client = new Vision.ImageAnnotatorClient();


const GOOGLE_BUCKET = process.env.GCLOUD_BUCKET

function processText(req, res, next) {
    if (typeof req.file ===  'undefined') return next()
    let data1 = [];
    let data2 = [];
    const filename = req.file.cloudStorageObject;
    client.textDetection(`gs://${GOOGLE_BUCKET}/${filename}`)
        .then(([result]) => {
            const detections = result.textAnnotations
            // console.log('Text:');
            const textResult = detections[0].description.split('\n')
            // console.log(textResult)
            const items = []
            let isItem = false
            for (let i = 0; i < textResult.length; i++) {
                if (textResult[i].includes('HARGA')) isItem = false
                if (isItem) items.push(textResult[i])
                if (textResult[i].includes('12240')) isItem = true
            }

            items.forEach(item => {
                data1.push(item);
                data2.push(item.split(' '));
            })
            req.file.data1 = data1;
            req.file.data2 = data2;
            next()
        })
        .catch(next)
}



module.exports = processText