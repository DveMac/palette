/*global require:true */
var palette = require('../lib/palette.js');

exports['Palette'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'randomColour': function(test) {
    test.expect(1);
    // tests here
    test.equal(palette.randomColour().length, 7, 'Colour string length should be 7.');
    test.done();
  }
};
