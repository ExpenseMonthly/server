const mongoose = require('mongoose')
const Schema = mongoose.Schema

const voucerSchema = new Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    image: {
        type: String,
        required: [true, 'image is required']
    },
    expire_date: {
        type: Date,
        required: [true, 'expire_date is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    point: {
        type: Number,
        default: 5
    }
}, {
    timestamps: true
})

const Voucer = mongoose.model('Voucer', voucerSchema)

module.exports = Voucer
