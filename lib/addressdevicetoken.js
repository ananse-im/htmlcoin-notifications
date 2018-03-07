'use strict';
var bitcore = require('htmlcoin-lib');
var async = require('async');
var fs = require('fs');

var fbadmin = require('firebase-admin');
var Pushy = require('pushy');

var TYPE_BLOCK = "block";
var TYPE_TRANSACTION = "transaction";
var pushyAPI;

function AddressDeviceTokenController(options) {
    this.node = options.node;
    this.addressDeviceTokenService = options.addressDeviceTokenService

    var serviceAccount = require(options.firebaseConfigPath);
    fbadmin.initializeApp({
        credential: fbadmin.credential.cert(serviceAccount)
    });

    var pushySecretApiKey = fs.readFileSync(options.pushySecretApiKey, 'utf8');
    pushyAPI = new Pushy(pushySecretApiKey);

    this.node.services.htmlcoind.on('tx', this.transactionEventHandler.bind(this));
    this.node.services.htmlcoind.on('block', this.blockEventHandler.bind(this));
}

AddressDeviceTokenController.prototype.transactionEventHandler = function(txBuffer) {
    var self = this;
    var tx = bitcore.Transaction();
    tx.fromBuffer(txBuffer);
    // var hash = bitcore.crypto.Hash.sha256sha256(message);
    // var txid = bitcore.util.buffer.reverse(hash).toString('hex');

    var addresses = this.node.services.htmlcoind._getAddressesFromTransaction(tx);

    for (var i = 0; i < addresses.length; i++) {
      var address = addresses[i];

      // send notification
      this.sendNotification(address, tx.id, TYPE_TRANSACTION);
    }
};

AddressDeviceTokenController.prototype.blockEventHandler = function(hashBuffer) {
    var self = this;
    self.node.services.htmlcoind.getBlock(hashBuffer.toString('hex'), function (err, block) {

        if (err) {
            return err;
        }

        if (!block.transactions) {
            return false;
        }

        for(var i = 0; i < block.transactions.length; i++) {
            var tx = block.transactions[i];
            var addresses = self.node.services.htmlcoind._getAddressesFromTransaction(tx);

            for (var j = 0; j < addresses.length; j++) {
              var address = addresses[j];

              // send notification
              self.sendNotification(address, tx.id, TYPE_BLOCK);
            }
        }

    });
}

AddressDeviceTokenController.prototype.createOrUpdateDeviceToken = function(req, res) {
  var self = this;
  var addresses = req.body.addresses;
  var deviceToken = req.body.deviceToken;
  var platform = req.body.platform || "android";

  async.each(addresses,
    function(addr, callback){
        self.addressDeviceTokenService.createOrUpdateDeviceToken(addr, deviceToken, platform, function (err, info) {
            callback();
        });
    },
    function(err){
        if( err ) {
            console.log('Update token failed');
        } else {
            console.log('Update token successfully');
        }

        res.json({result: true});
    }
  );
};

AddressDeviceTokenController.prototype.createOrUpdatePushyDeviceToken = function(req, res) {
    var self = this;
    var addresses = req.body.addresses;
    var pushyDeviceToken = req.body.pushyDeviceToken;
    var platform = req.body.platform || "android";

    async.each(addresses,
      function(addr, callback){
          self.addressDeviceTokenService.createOrUpdatePushyDeviceToken(addr, pushyDeviceToken, platform, function (err, info) {
              callback();
          });
      },
      function(err){
          if( err ) {
              console.log('Update pushy token failed');
          } else {
              console.log('Update pushy token successfully');
          }

          res.json({result: true});
      }
    );
};

AddressDeviceTokenController.prototype.deletePushyDeviceToken = function(req, res) {
    var self = this;
    var addresses = req.body.addresses;

    async.each(addresses,
      function(addr, callback){
          self.addressDeviceTokenService.deletePushyDeviceToken(addr, function (err, info) {
              callback();
          });
      },
      function(err){
          if( err ) {
              console.log('Delete pushy token failed');
          } else {
              console.log('Delete pushy token successfully');
          }

          res.json({result: true});
      }
    );
};


AddressDeviceTokenController.prototype.getBodyString = function(type) {
    var bodyString = "New Transaction";
    if (type == TYPE_BLOCK) {
        bodyString = "Transaction is confirmed";
    }

    return bodyString;
}

AddressDeviceTokenController.prototype.sendNotification = function(addr, txid, type) {
    var self = this;
    this.addressDeviceTokenService.getDeviceTokenByAddress(addr, function(deviceTokenRes){
        if (deviceTokenRes == null) return;

        if (deviceTokenRes.isPlayServicesAvailable == null || deviceTokenRes.isPlayServicesAvailable == true) {
            var deviceToken = deviceTokenRes.deviceToken;
            self.sendFirebaseNotification(deviceToken, addr, txid, type);
        } else {
            var deviceToken = deviceTokenRes.pushyDeviceToken;
            self.sendPushyNotification(deviceToken, addr, txid, type);
        }
    });
}

AddressDeviceTokenController.prototype.sendFirebaseNotification = function(deviceToken, addr, txid, type) {
    var self = this;
    if (deviceToken == null || deviceToken == "") return;

    var payload = {
        notification: {
        title: "HTMLCOIN",
        body: self.getBodyString(type)
        },
        data: {
        type: type,
        address: addr,
        txid: txid
        }
    };

    // Send a message to the device
    fbadmin.messaging().sendToDevice(deviceToken, payload)
        .then(function(response) {
            console.log("Successfully sent message:", addr);
        })
        .catch(function(error) {
            console.log("Error sending message:", error);
        });
}

AddressDeviceTokenController.prototype.sendPushyNotification = function(deviceToken, addr, txid, type) {
    var self = this;

    if (deviceToken == null || deviceToken == "") return;

    var data = {
        type: type,
        address: addr,
        txid: txid,
        body: self.getBodyString(type)
    };

    // Insert target device token(s) here
    var to = [deviceToken];

    var options = {
        notification: {
            title: "HTMLCOIN",
            body: self.getBodyString(type)
        },
    };

    // https://pushy.me/docs/api/send-notifications
    pushyAPI.sendPushNotification(data, to, options, function (err, id) {
        // Log errors to console
        if (err) {
            return console.log('Fatal Error', err);
        }

        // Log success
        console.log('Push sent successfully! (ID: ' + id + ')');
    });
}

module.exports = AddressDeviceTokenController;