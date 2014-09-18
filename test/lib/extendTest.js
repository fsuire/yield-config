var _path = (process.env.COVER)? '../../lib-cov' : '../../lib';

var extend = require(_path + '/extend'),
    assert = require("assert"),
    _ = require('lodash');

describe('lib/extend', function() {

    var destination, source;


    it('should extends a destination object, without overriding the destination object (it should just adds new stuff in the destination object', function() {

        destination = {
            second: ['one', 'two'],
            third: {
                one: 1,
                two: 2
            }
        };
        source = {
            first: 'does not exist',
            second: ['three', 'four'],
            third: {
                one: 'one',
                three: 3,
                four: 4
            }
        };

        extend(destination, source);

        assert.equal(typeof destination.first, 'string');
        assert.equal( _.isEqual( destination.second, ['one', 'two', 'three', 'four'] ), true);
        assert.equal( _.isEqual( destination.third, {one: 1, two: 2, three: 3, four: 4} ), true);

    });

    it('should extends a destination object, and overrides the source object', function() {

        destination = {
            second: ['one', 'two'],
            third: {
                one: 1,
                two: 2
            }
        };
        source = {
            first: 'does not exist',
            second: 'second',
            third: 'third'
        };

        extend(destination, source, true);

        assert.equal(typeof destination.first, 'string');
        assert.equal( destination.second, 'second');
        assert.equal( destination.third, 'third');

    });

});
