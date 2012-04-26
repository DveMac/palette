/*global require:true */
var palette = require('../lib/palette.js');

exports['awesome'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'no args': function(test) {
    test.expect(1);
    // tests here
    test.equal(palette.awesome(), 'awesome', 'should be awesome.');
    test.done();
  }
};
