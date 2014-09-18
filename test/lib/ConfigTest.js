var _path = (process.env.COVER)? '../../lib-cov' : '../../lib';

var proxyquire =  require('proxyquire');
var Config = proxyquire(_path + '/Config', {
    'fs': {

        'readdir': function(path, cb) {
            var err = null;
            var response = [];

            switch(path) {
                case '/my/fake/directory' :
                    response.push('myconfig.json');
                    response.push('myconfig.test.json');
                    response.push('~myconfig.json');
                    response.push('notAjsonFile.png');
                    response.push('myconfig.test.anotherDot.json');
                    break;
                default:
                    err = new Error('Error !');
                    break;
            }

            cb(err, response);
        },

        'readFile': function(path, cb) {
            var err = null;
            var response;

            switch(path) {
                case '/my/fake/directory/myconfig.json' :
                    response = JSON.stringify({
                        one: 'not overloaded',
                        two: 'not overloaded'
                    });
                    break;
                case '/my/fake/directory/myconfig.test.json' :
                    response = JSON.stringify({
                        two: 'overloaded'
                    });
                    break;
                default:
                    err = new Error('Error !');
                    break;
            }

            cb(err, response);
        }
    }
});

var assert = require('assert'),
    sinon = require('sinon'),
    _ = require('lodash'),
    co = require('co');


// ---------------------------------------------------------------------------------------------------------------------
// ---- TEST
// ---------------------------------------------------------------------------------------------------------------------


describe('lib/Config', function() {



    // -----------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    it('should create a config without using a specified environment', function(done) {

        co(function *() {
            config = yield new Config('/my/fake/directory');

            assert.equal(_.isEqual(config.config, { myconfig: { one: 'not overloaded', two: 'not overloaded' } }), true);
        })(done);


    });

    // -----------------------------------------------------------------------------------------------------------------

    it('should create a config using a specified environment', function(done) {

        co(function *() {
            config = yield new Config('/my/fake/directory', 'test');

            assert.equal(_.isEqual(config.config, { myconfig: { one: 'not overloaded', two: 'overloaded' } }), true);
        })(done);


    });

    // -----------------------------------------------------------------------------------------------------------------

    it('should get something in a Config instance', function(done) {

        co(function *() {
            config = yield new Config('/my/fake/directory', 'test');

            assert.equal(config.get('myconfig/two', 'default'), 'overloaded');
        })(done);


    });

    // -----------------------------------------------------------------------------------------------------------------

    it('should get a default value when nothing is found in a Config instance', function(done) {

        co(function *() {
            config = yield new Config('/my/fake/directory', 'test');

            assert.equal(config.get('myconfig/three'), undefined);
            assert.equal(config.get('myconfig/three', 'default'), 'default');
        })(done);


    });


});