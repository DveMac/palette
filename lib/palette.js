/*
 * palette
 * https://github.com/dvemac/palette
 *
 * Copyright (c) 2012 Dve
 * Licensed under the MIT license.
 */

(function (exports) {
  'use strict';

  // Utility methods
  // ------------

  var utils = {

    wholeNumber: function(max) {
      return Math.round(Math.random() * max);
    },

    wholeNumberList: function(max, count) {
      var r = [];
      count = count || 1;
      while(count--) { r.push(utils.wholeNumber(max)); }
      return r;
    },

    ensure: function(val, type, def, min, max){
      var v =  typeof val === type && val || def;
      v = min !== undefined && v < min ? min : v; 
      v = max !== undefined && v > min ? max : v; 
      return v;
    },

    dechex: function(dec){
      return Number(dec).toString(16);
    },

    hexdec: function(hex){
      hex = hex.substr(0,2) === '0x' ? hex : '0x' + hex;
      return Number(hex);
    },

    padLeft: function(pad, len, str) {
      str = str || ''; 
      return (new Array(len+1).join(pad) + str).slice(-1*len);
    },

    mixColour: function(rgb, mix){
      var r='#',t;

      mix = mix === undefined ? 'FFFFFF' : mix.replace('#', '').substr(0,6);

      for(var i=0; i<3; i++){
        t = Math.round((rgb[i] + utils.hexdec(mix.substr(i*2, 2)) ) / 2);
        r += utils.dechex(t);
      }

      return r;
    }

  };

  // Constructor
  // ---------
  var Palette = function() {
  };

  Palette.prototype = {

    randomColour: function (mixer) {
      var rgb = utils.wholeNumberList(255, 3), r = '#', t;

      return utils.mixColout(rgb, mixer);
    },

    colourFromText: function(text, spec, mixer) { 

      spec = utils.ensure(spec, "number", 10, 2, 10);

      var hash = exports.md5(text),
          rgb = [];

      for(var i=0; i<3; i++){
        var base = utils.hexdec(hash.substr(spec*i,spec));
        rgb[i] = ~~(base / (utils.hexdec(utils.padLeft('F', spec) ))*255);
      }

      return utils.mixColour(rgb, mixer);
    }

  };

  // export as singleton
  exports.Palette = new Palette();

}(typeof exports === 'object' && exports || this));
