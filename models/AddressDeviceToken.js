const mongoose = require('mongoose');

const addressDeviceTokenSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        index: true
    },
    deviceToken: {
        type: String,
        required: true,
        index: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const AddressDeviceToken = mongoose.model('AddressDeviceToken', addressDeviceTokenSchema);

module.exports = AddressDeviceToken;