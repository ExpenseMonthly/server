const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    receipt_id: {
        type: String,
        validate: [{
            validator: function recieptUnique(receipt_id) {
                return Transaction.findOne({ receipt_id: this.receipt_id })
                    .then(function (transaction) {
                        if (transaction) {
                            return false;
                        } else {
                            return true;
                        }
                    })
                    .catch(function (err) {
                        return false;
                    })
            },
            message: props => `Can't add same receipt, this receipt already been input before.`
        }]
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
        // required: [true, 'image_url is required']
    },
    userid: {
        type: String,
        required: [true, 'userid is required']
    }
}, {
    timestamps: true,
    versionKey: false,
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
