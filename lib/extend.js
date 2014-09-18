
var _ = require('lodash');

var extend = function(destination, source, overload){

    _.forEach(source, function(value, key){

        if(typeof destination[key] === 'undefined'){
            destination[key] = value;
        }

        else if( destination[key] instanceof Array && value instanceof Array ) {
            destination[key] = _.unique( _.union(destination[key], value) );
        }

        else if( destination[key] instanceof Object && value instanceof Object ) {
            extend.call(this, destination[key], value, overload);
        }

        else if(overload) {
            destination[key] = value;
        }

    }, this);

};

module.exports = extend;
