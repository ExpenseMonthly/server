const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
    receipt_id: {
        type: String,
        required: [true, 'receipt_id is required']
    },
    date: {
        type: Date,
        required: [true, 'date is required']
    },
    items: {
        type: Array,
        required: [true, 'items is required']
    },
    image_url: {
        type: String,
        required: [true, 'image_url is required']
    },
    userid: {
        type: String,
        required: [true, 'userid is required']
    }
}, {
    timestamps: true
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
