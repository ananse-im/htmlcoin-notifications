var Common = require('../lib/common');
var async = require('async');

function AddressDeviceTokenService(options) {

    this.common = new Common({log: options.node.log});
    this.addressDeviceTokenRepository = options.addressDeviceTokenRepository;
}

AddressDeviceTokenService.prototype.createOrUpdateDeviceToken = function(addr, token, platform, next) {
  var self = this;
  return self.addressDeviceTokenRepository.createOrUpdateAddressDeviceToken({
                            address: addr,
                            deviceToken: token,
                            platform: platform
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

AddressDeviceTokenService.prototype.createOrUpdatePushyDeviceToken = function(addr, token, platform, next) {
    var self = this;
    return self.addressDeviceTokenRepository.createOrUpdateAddressDeviceToken({
                            address: addr,
                            pushyDeviceToken: token,
                            platform: platform
                        }, function (err, res) {
                            return next(err, res);
                        });
}

AddressDeviceTokenService.prototype.getPushyDeviceTokenByAddress = function(addr, next) {
    var self = this;
    self.addressDeviceTokenRepository.findDeviceTokenByAddress(addr, function(err, res){
        if (res != null) {
            return next(res.pushyDeviceToken);
        } else {
            return next(null);
        }

    });
}


module.exports = AddressDeviceTokenService;