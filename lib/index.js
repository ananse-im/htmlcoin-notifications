'use strict';

var Writable = require('stream').Writable;
var bodyParser = require('body-parser');
var compression = require('compression');
var BaseService = require('./service');
var inherits = require('util').inherits;
var Db = require('../components/Db');
var morgan = require('morgan');
var bitcore = require('htmlcoin-lib');
var _ = bitcore.deps._;
var $ = bitcore.util.preconditions;
var Transaction = bitcore.Transaction;
var EventEmitter = require('events').EventEmitter;
var async = require('async');

var AddressDeviceTokenRepository = require('../repositories/AddressDeviceTokenRepository');
var AddressDeviceTokenService = require('../services/AddressDeviceTokenService');
var AddressDeviceTokenController = require('./addressdevicetoken');

var NotificationAPI = function(options) {
    BaseService.call(this, options);

    var self = this;

    this.dbConfig = options.db;

    if (!_.isUndefined(options.routePrefix)) {
        this.routePrefix = options.routePrefix;
    } else {
        this.routePrefix = this.name;
    }

    if (this.dbConfig) {

        this.db = new Db(this.node, this.dbConfig);

        this.db.connect(function (err) {

            if (err) {
                return self.node.log.error('db.connect error');
            }
        });

    } else {
        self.node.log.warn('dbConfig is empty');
    }

    this.addressDeviceTokenRepository = new AddressDeviceTokenRepository();
    this.addressDeviceTokenService = new AddressDeviceTokenService({node: this.node, addressDeviceTokenRepository: this.addressDeviceTokenRepository});
    this.addressDeviceTokenController = new AddressDeviceTokenController({
        node: this.node,
        addressDeviceTokenService: this.addressDeviceTokenService,
        firebaseConfigPath: options.firebaseConfigPath
    });
}

NotificationAPI.dependencies = ['htmlcoind', 'web'];

inherits(NotificationAPI, BaseService);

NotificationAPI.prototype.getRoutePrefix = function() {
   return this.routePrefix;
};

NotificationAPI.prototype.start = function(callback) {
    var self = this;

    setImmediate(callback);
}

NotificationAPI.prototype.setupRoutes = function(app) {
    var self = this;

    //Enable compression
  app.use(compression());

  //Enable urlencoded data
  app.use(bodyParser.urlencoded({extended: true}));

  //Enable CORS
  app.use(function(req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Content-Length, Cache-Control, cf-connecting-ip');

    var method = req.method && req.method.toUpperCase && req.method.toUpperCase();

    if (method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
    } else {
      next();
    }
  });

  /**
   * Address Device Token
   */
  app.post('/devicetoken/create', this.addressDeviceTokenController.createOrUpdateDeviceToken.bind(this.addressDeviceTokenController));

  // Not Found
  app.use(function(req, res) {
    res.status(404).jsonp({
      status: 404,
      url: req.originalUrl,
      error: 'Not found'
    });
  });
}

module.exports = NotificationAPI;
