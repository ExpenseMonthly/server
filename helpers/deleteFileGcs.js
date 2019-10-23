const { Storage } = require('@google-cloud/storage');

function deletFile(fileName) {
    const storage = new Storage({
        projectId: process.env.GCLOUD_PROJECT,
        keyFilename: process.env.KEYFILE_PATH
    })

    const CLOUD_BUCKET = process.env.GCLOUD_BUCKET

    storage
        .bucket(CLOUD_BUCKET)
        .file(fileName)
        .delete()
}

module.exports = deletFile