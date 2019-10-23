const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    receipt_id: {
        type: String,
        validate: [{
            /* istanbul ignore next */
            validator: function recieptUnique(receipt_id) {
                return Transaction.findOne({ receipt_id: this.receipt_id })
                    /* istanbul ignore next */
                    .then(function (transaction) {
                        /* istanbul ignore next */
                        if (transaction) {
                            /* istanbul ignore next */
                            return false;
                        } else {
                            /* istanbul ignore next */
                            return true;
                        }``
                    })
                    /* istanbul ignore next */
                    .catch(function (err) {
                        return false;
                    })
            },
            /* istanbul ignore next */
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'userid is required']
    }
}, {
    timestamps: true,
    versionKey: false,
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
