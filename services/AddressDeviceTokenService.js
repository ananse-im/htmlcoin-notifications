var Common = require('../lib/common');
var async = require('async');

function AddressDeviceTokenService(options) {

    this.common = new Common({log: options.node.log});
    this.addressDeviceTokenRepository = options.addressDeviceTokenRepository;
}

AddressDeviceTokenService.prototype.createOrUpdateDeviceToken = function(addr, token, next) {
  var self = this;
  return self.addressDeviceTokenRepository.createOrUpdateAddressDeviceToken({
                            address: addr,
                            deviceToken: token
                        }, function (err, res) {
                            return next(err, res);
                        });
}

AddressDeviceTokenService.prototype.getDeviceTokenByAddress = function(addr, next) {
    var self = this;
    self.addressDeviceTokenRepository.findDeviceTokenByAddress(addr, function(err, res){
        if (res != null) {
            return next(res.deviceToken);
        } else {
            return next(null);
        }

    });
}

module.exports = AddressDeviceTokenService;