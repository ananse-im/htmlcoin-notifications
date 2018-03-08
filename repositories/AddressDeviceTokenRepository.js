const async = require('async');
const mongoose = require('mongoose');
const AddressDeviceToken = require('../models/AddressDeviceToken');

function AddressDeviceTokenRepository () {}

AddressDeviceTokenRepository.prototype.createOrUpdateAddressDeviceToken = function (data, next) {

    return AddressDeviceToken.findOneAndUpdate({address: data.address}, data, {upsert: true, new: true}, function(err, row) {
        return next(err, row);
    });
};

AddressDeviceTokenRepository.prototype.findDeviceTokenByAddress = function (addr, next) {
    return AddressDeviceToken.findOne({address: addr}, function(err, row) {
        return next(err, row);
    });
};

AddressDeviceTokenRepository.prototype.findDevicesTokenByAddresses = function (addresses, next) {
    return AddressDeviceToken.find()
        .where("address")
        .in(addresses)
        .exec(function(err, row) {
            return next(err, row);
        });
};

module.exports = AddressDeviceTokenRepository;