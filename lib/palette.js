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

  Object.prototype.ensure = function(idx, type, def, min, max){
    var val = this[idx];
    var v =  typeof val === type && val || def;
    v = min !== undefined && v < min ? min : v; 
    v = max !== undefined && v > min ? max : v; 
    return v;
  };

  var number = {

    random: function(max) {
      return Math.round(Math.random() * max);
    },

    randoms: function(max, count) {
      var r = [];
      count = count || 1;
      while(count--) { r.push(number.random(max)); }
      return r;
    },

    dechex: function(dec){
      return dec.toString(16);
    },

    hexdec: function(hex){
      hex = hex.substr(0,2) === '0x' ? hex : '0x' + hex;
      return parseInt(hex, 16);
    },

    padLeft: function(pad, len, str) {
      str = str || ''; 
      return (new Array(len+1).join(pad) + str).slice(-1*len);
    }

  };

  var Colour = function(rgb){
    this.rgb = rgb;
  };

  Colour.prototype = {

    isValidHex: function(hex) {
      return typeof hex === "string" && (/#[0-9A-F]{6}/gi).test(hex);
    },

    fromHexColour: function(hex) {
      if(this.isValidHex(hex)) {
        hex = hex.slice(-6);
        return new Colour([hex.slice(0,2),hex.slice(2,2),hex.slice(4,2)]);
      }
      return null;
    },

    mixWithHexColour: function(mix) {
      var r=[], t;
      mix = !this.isValidHex(mix) ? 'FFFFFF' : mix.replace('#', '').substr(0,6);
      for(var i=0; i<3; i++){
        t = Math.round((this.rgb[i] + number.hexdec(mix.substr(i*2, 2)) ) / 2);
        r.push(t);
      }
      return new Colour(r);
    }

  };

  // Constructor
  // ---------
  var Palette = function() {
  };

  Palette.prototype = {

    randomColour: function (mixer) {
      var rgb = number.randoms(255, 3);
      return new Colour(rgb).mixWithHexColour(mixer);
    },

    randomColours: function (num, mixer) {
      var rgb, r= [];
      num = num || 1;
      while(num--) {
        rgb = number.randoms(255, 3);
        r.push(new Colour(rgb).mixWithHexColour(mixer));
      }
      return r;
    },

    colourFromText: function(text, spec, mixer) { 
      spec = arguments.ensure(1,"number",10,2,10);

      var hash = exports.md5(text), rgb = [];

      for(var i=0; i<3; i++){
        var base = number.hexdec(hash.substr(spec*i,spec));
        rgb[i] = ~~(base / (number.hexdec(number.padLeft('F', spec) ))*255);
      }

      return new Colour(rgb).mixWithHexColour(mixer);
    }

  };

  // export as singleton
  exports.Palette = new Palette();

}(typeof exports === 'object' && exports || this));
