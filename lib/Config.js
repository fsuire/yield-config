var fs = require('fs');
var extend = require('./extend');

var readdir = function(path) {
    return function(fn) {
        fs.readdir(path, function(err, data) {
            fn(err, data);
        });
    };
};

var readFile = function(path) {
    return function(fn) {
        fs.readFile(path, function(err, data) {
            fn(err, data);
        });
    };
};



var Config = function *(directory, environment) {

    this._directory = directory;
    this.environment = false;

    if(typeof environment === 'string') {
        this.environment = environment;
    }


    this.config = yield this.loadConfigDirectory(directory);

    return this;
};

Config.prototype.loadConfigDirectory = function *(directory) {

    var config = {};
    var envFiles = {};
    var files = yield readdir(directory);

    for(var i in files) {
        var file = files[i];

        if (file.charAt(0) === '~') {
            continue;
        }

        var splittedname = file.split('.');
        if (splittedname[splittedname.length - 1] !== 'json') {
            continue;
        }
        splittedname.pop();

        if (splittedname.length > 2) {
            continue;
        }

        if (splittedname.length === 1) {
            var json = {};
            json[splittedname[0]] = JSON.parse(yield readFile(this._directory + '/' + file));
            extend(config, json, false);
        }

        if (this.environment && splittedname[1] === this.environment) {
            envFiles[splittedname[0]] = JSON.parse(yield readFile(this._directory + '/' + file));
        }

    }


    for(var i in envFiles) {
        var json = {};
        json[i] = envFiles[i];
        extend(config, json, true);
    }

    return config;
};

Config.prototype.get = function(what, defaultValue) {
    var pathElements = what.split('/').reverse(),
        returns = this.config;

    while (pathElements.length > 0 && typeof returns !== 'undefined') {
        var index = pathElements.pop();
        returns = returns[index];
    }

    if(typeof returns === 'undefined') {
        returns = defaultValue;
    }

    return returns;
};


module.exports = Config;