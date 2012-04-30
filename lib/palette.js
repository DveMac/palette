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

  function forEach(array, action) {
    for (var i = 0, len = array.length; i < len; i++) {
      action(array[i]);
    }
  }

  function map(array, func, scope) {
    var result = [];
    forEach(array, function (element) {
      result.push(func.call(scope || this, element));
    });
    return result;
  }

  function range(from, to) {
    var r=[];
    if (to === undefined) { to = from; from = 1; }
    if (from > to) { var t = from; from = to; to = t; }
    while(from <= to) { r.push(from++); }
    return r;
  }

  function ensureArg(val, type, def, min, max){
    var v =  typeof val === type && val || def;
    v = min !== undefined && v < min ? min : v; 
    v = max !== undefined && v > min ? max : v; 
    return v;
  }

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

  // Colour
  // ---------

  // #### Constructor
  var Colour = function(rgb){
    this.rgb = rgb;
  };

  Colour.prototype = {

    validateHex: function(hex) {
      if (typeof hex === "string" && (/#[0-9A-F]{3,6}/gi).test(hex)) { 
        if(hex.length < 7) { hex = hex.slice(0,4) + hex.slice(1,3); }
        return hex;
      }
      return '#FFFFFF';
    },

    fromHexColour: function(hex) {
      hex = this.validateHex(hex).slice(-6);
      return new Colour(map(range(0,2), function(i) { 
        return number.hexdec(hex.substr(i*2,2)); 
      }));
    },

    toHexColour: function() {
      return '#' + map(this.rgb, function(c){
        return number.dechex(c);
      }).join('');
    },

    mixWithHexColour: function(mix) {
      mix = new Colour().fromHexColour(mix);
      return new Colour(map(range(0,2), function(i){
        return Math.round((this.rgb[i] + mix.rgb[i]) / 2);
      }, this));
    }

  };

  // Palette
  // -------

  // #### Constructor
  var Palette = function() {
  };

  Palette.prototype = {

    randomColour: function (mixer) {
      return new Colour(number.randoms(255, 3)).mixWithHexColour(mixer);
    },

    randomColours: function (num, mixer) {
      return map(range(num || 1), function() { return this.randomColour(mixer); }, this);
    },

    colourFromText: function(text, mixer, spec) { 
      spec = ensureArg(spec,"number",10,2,10);

      var hash = exports.md5(text),
          calc = function(i){
            var base = number.hexdec(hash.substr(spec*i,spec));
            return ~~(base / (number.hexdec(number.padLeft('F', spec) ))*255);
          };

      return new Colour(map(range(0,2),calc)).mixWithHexColour(mixer);
    }

  };

  // export as singleton
  exports.Palette = new Palette();
  exports.Colour = Colour;

}(typeof exports === 'object' && exports || this));
