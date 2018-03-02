const mongoose = require('mongoose');

const addressDeviceTokenSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        index: true
    },
    platform: {
        type: String,
        required: false,
        index: false
    },
    deviceToken: {
        type: String,
        required: false,
        index: false
    },
    pushyDeviceToken: {
        type: String,
        required: false,
        index: false
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const AddressDeviceToken = mongoose.model('AddressDeviceToken', addressDeviceTokenSchema);

module.exports = AddressDeviceToken;