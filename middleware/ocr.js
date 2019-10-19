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
            const textResult = detections[0].description.split('\n')
            const content = []
            let isItem = false
            for (let i = 0; i < textResult.length; i++) {
                if (textResult[i].includes('HARGA')) isItem = false
                if (isItem) content.push(textResult[i])
                if (textResult[i].includes('12240')) isItem = true
            }

            const itemName = []
            const priceQty = []
            let date = []
            let transId = []
            for (let i = 0; i < content.length; i++) {
                if (content[i].match(/\d\.\d.\d+ \d+\/\w+\/\d{2}/)) {
                    transId.push(content[i].match(/\d\.\d.\d+ \d+\/\w+\/\d{2}/)[0])
                } else if (content[i].match(/\d{1,2}\.\d{1,2}\.\d{1,2}-\d{1,2}:\d{1,2}/)) {
                    date.push(content[i].match(/\d{1,2}\.\d{1,2}\.\d{1,2}-\d{1,2}:\d{1,2}/)[0])
                } else if (content[i].match(/^(([A-Za-z]|[0-9]|[\.]){2,}\ ?)+ \D+/)) {
                    itemName.push(content[i].match(/^(([A-Za-z]|[0-9]|[\.]){2,}\ ?)+ \D+/)[0])
                } else if (content[i].match(/\d \d{3,}/)) {
                    priceQty.push(content[i].match(/\d \d{3,}/)[0])
                }
            }
            const items = []
            priceQty.forEach((item, index) => {
                let a = item.split(' ')
                if (itemName[index]) {
                    items.push({ name: itemName[index], qty: a[0], price: a[1] })
                }
            })
            let mydate = date[0]
            let dateConvert = mydate.split('-')[0]
            let time = mydate.split('-')[1]

            let day = dateConvert.split('.')[0]
            let month = dateConvert.split('.')[1]
            let year = dateConvert.split('.')[2]

            let minute = time.split(':')[0]
            let second = time.split(':')[1]

            let newDate = new Date(`${month} ${day} ${year} ${minute}:${second} UTC`);

            const filteredResult = {
                transId: transId[0],
                date: newDate,
                items
            }
            req.body.receipt_id = filteredResult.transId
            req.body.date = filteredResult.date
            req.body.items = filteredResult.items
            next()
        })
        .catch(next)
}



module.exports = processText