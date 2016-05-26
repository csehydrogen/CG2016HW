/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(1);

	__webpack_require__(5);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./node_modules/css-loader/index.js!./main.css", function() {
				var newContent = require("!!./node_modules/css-loader/index.js!./main.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "html {\n  height: 100%;\n}\n\nbody {\n  height: 100%;\n  margin: 0;\n}\n\n#canvas-main {\n  width: 100%;\n  height: 100%;\n}\n\n#instruction {\n  position: fixed;\n  right: 0;\n  top: 0;\n  margin: 0;\n  background: white;\n}\n\n#model-input {\n  position: fixed;\n  left: 0;\n  top: 0;\n  margin: 0;\n  background: white;\n}\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _shader = __webpack_require__(6);

	var _shader2 = _interopRequireDefault(_shader);

	var _shader3 = __webpack_require__(7);

	var _shader4 = _interopRequireDefault(_shader3);

	var _trombone = __webpack_require__(8);

	var _trombone2 = _interopRequireDefault(_trombone);

	var _coke_bottle = __webpack_require__(9);

	var _coke_bottle2 = _interopRequireDefault(_coke_bottle);

	var _klein_bottle = __webpack_require__(10);

	var _klein_bottle2 = _interopRequireDefault(_klein_bottle);

	var _cube = __webpack_require__(11);

	var _cube2 = _interopRequireDefault(_cube);

	var _glMatrix = __webpack_require__(12);

	var _stringbuilder = __webpack_require__(22);

	var _stringbuilder2 = _interopRequireDefault(_stringbuilder);

	var _BSP = __webpack_require__(105);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var gl = null;

	var showWire = false;
	var showMesh = true;
	var showTranslucent = false;
	var spanFPS = null;
	window.addEventListener("load", init);
	function init() {
	  var canvas = document.getElementById("canvas-main");

	  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	  if (!gl) {
	    alert("Unable to initialize WebGL. Your browser may not support it.");
	    return;
	  }

	  canvas.addEventListener("mousedown", mousedownListener);
	  canvas.addEventListener("mouseup", mouseupListener);
	  canvas.addEventListener("mousemove", mousemoveListener);
	  window.addEventListener("keydown", keydownListener);
	  window.addEventListener("keyup", keyupListener);

	  document.getElementById("apply").addEventListener("click", parseModel);
	  document.getElementById("trombone").addEventListener("click", function () {
	    document.getElementById("model").value = _trombone2.default;
	  });
	  document.getElementById("coke_bottle").addEventListener("click", function () {
	    document.getElementById("model").value = _coke_bottle2.default;
	  });
	  document.getElementById("klein_bottle").addEventListener("click", function () {
	    document.getElementById("model").value = _klein_bottle2.default;
	  });
	  document.getElementById("cube").addEventListener("click", function () {
	    document.getElementById("model").value = _cube2.default;
	  });
	  document.getElementById("translucent").addEventListener("change", function (e) {
	    showTranslucent = e.target.checked;
	  });
	  document.getElementById("wire").addEventListener("change", function (e) {
	    showWire = e.target.checked;
	  });
	  document.getElementById("mesh").addEventListener("change", function (e) {
	    showMesh = e.target.checked;
	  });
	  document.getElementById("adjust_view").addEventListener("click", function () {
	    pRadius = mRadius * 3;
	    fovy = Math.PI / 4;
	    _glMatrix.mat4.identity(pMatCur);
	  });
	  spanFPS = document.getElementById("fps");

	  gl.clearColor(1.0, 1.0, 0.9, 1.0);
	  gl.enable(gl.BLEND);
	  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	  initShaders();
	  initBuffers();

	  setInterval(drawScene, 33);
	}

	var aVertexPosition = null;
	var aVertexColor = null;
	var aVertexNormal = null;
	var aVertexPhong = null;
	var uPMatrix = null;
	var uMVMatrix = null;
	var uNMatrix = null;
	var uView = null;
	var uRadius = null;
	function initShaders() {
	  var shaderProgram = gl.createProgram();
	  gl.attachShader(shaderProgram, getShader(_shader2.default, gl.FRAGMENT_SHADER));
	  gl.attachShader(shaderProgram, getShader(_shader4.default, gl.VERTEX_SHADER));
	  gl.linkProgram(shaderProgram);
	  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	    alert("Unable to initialize the shader program.");
	    return;
	  }
	  gl.useProgram(shaderProgram);

	  aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	  gl.enableVertexAttribArray(aVertexPosition);
	  aVertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor");
	  gl.enableVertexAttribArray(aVertexColor);
	  aVertexNormal = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	  gl.enableVertexAttribArray(aVertexNormal);
	  aVertexPhong = gl.getAttribLocation(shaderProgram, "aVertexPhong");
	  gl.enableVertexAttribArray(aVertexPhong);
	  uPMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");
	  uMVMatrix = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	  uNMatrix = gl.getUniformLocation(shaderProgram, "uNMatrix");
	  uView = gl.getUniformLocation(shaderProgram, "uView");
	  uRadius = gl.getUniformLocation(shaderProgram, "uRadius");
	}

	function getShader(source, type) {
	  var shader = gl.createShader(type);
	  gl.shaderSource(shader, source);
	  gl.compileShader(shader);
	  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
	    return null;
	  }
	  return shader;
	}

	var mRadius = 0;
	var bufVertexPosition = null;
	var bufVertexColor = null;
	var bufVertexNormal = null;
	var bufVertexPhong = null;
	function initBuffers() {
	  bufVertexPosition = gl.createBuffer();
	  bufVertexColor = gl.createBuffer();
	  bufVertexNormal = gl.createBuffer();
	  bufVertexPhong = gl.createBuffer();
	}

	var bspTree = null;
	function parseModel() {
	  var raw = document.getElementById("model").value,
	      i,
	      j,
	      k,
	      t;
	  var type, n, m, c, s, r, p;
	  raw = raw.replace(/#.*/g, "").trim().split(/\s*\n\s*/);
	  i = 0;
	  if (raw[i++] === "BSPLINE") {
	    type = 0;
	  } else {
	    // "CATMULL_ROM"
	    type = 1;
	  }
	  n = parseInt(raw[i++]); // number of cross sections
	  m = parseInt(raw[i++]); // number of control points per cross section
	  c = []; // control points, c[i][j][k] = ith section, jth point, kth dimension
	  s = []; // scale
	  r = []; // rotation
	  p = []; // position
	  function parseLine(line) {
	    return line.split(" ").map(parseFloat);
	  }
	  for (j = 0; j < n; ++j) {
	    t = [];
	    for (k = 0; k < m; ++k) {
	      t.push(parseLine(raw[i++]));
	    }
	    c.push(t);
	    s.push(parseLine(raw[i++]));
	    r.push(parseLine(raw[i++]));
	    p.push(parseLine(raw[i++]));
	  }

	  // get position of point at v [0,1) of u ~ u+3 th cross section
	  var getPointsOnCrossSection;
	  if (type == 0) {
	    getPointsOnCrossSection = function getPointsOnCrossSection(u, v) {
	      v *= m;
	      var b = Math.floor(v),
	          o = v - b,
	          o2 = o * o,
	          o3 = o2 * o,
	          c0 = (1 - 3 * o + 3 * o2 - o3) / 6,
	          c1 = (4 - 6 * o2 + 3 * o3) / 6,
	          c2 = (1 + 3 * o + 3 * o2 - 3 * o3) / 6,
	          c3 = o3 / 6,
	          xs = [],
	          zs = [];
	      for (var ui = u; ui < u + 4; ++ui) {
	        var _p = c[ui],
	            p0 = _p[b],
	            p1 = _p[(b + 1) % m],
	            p2 = _p[(b + 2) % m],
	            p3 = _p[(b + 3) % m];
	        xs.push(c0 * p0[0] + c1 * p1[0] + c2 * p2[0] + c3 * p3[0]);
	        zs.push(c0 * p0[1] + c1 * p1[1] + c2 * p2[1] + c3 * p3[1]);
	      }
	      return [xs, zs];
	    };
	  } else {
	    getPointsOnCrossSection = function getPointsOnCrossSection(u, v) {
	      v *= m;
	      var b = Math.floor(v),
	          o = v - b,
	          oi = 1 - o,
	          c0 = oi * oi * oi,
	          c1 = 3 * o * oi * oi,
	          c2 = 3 * o * o * oi,
	          c3 = o * o * o,
	          xs = [],
	          zs = [];
	      for (var ui = u; ui < u + 4; ++ui) {
	        var _p2 = c[ui],
	            p0 = _p2[b],
	            p1 = _p2[(b + 1) % m],
	            p2 = _p2[(b + 2) % m],
	            p3 = _p2[(b + 3) % m];
	        xs.push(c0 * p1[0] + c1 * (p1[0] + (p2[0] - p0[0]) / 6) + c2 * (p2[0] + (p1[0] - p3[0]) / 6) + c3 * p2[0]);
	        zs.push(c0 * p1[1] + c1 * (p1[1] + (p2[1] - p0[1]) / 6) + c2 * (p2[1] + (p1[1] - p3[1]) / 6) + c3 * p2[1]);
	      }
	      return [xs, zs];
	    };
	  }

	  // get position of point at (u, v) (both [0, 1)) on surface
	  function getPointOnSurface(u, v) {
	    u *= n - 3;
	    var ub = Math.floor(u),
	        uo = u - ub,
	        a = getPointsOnCrossSection(ub, v);
	    // a will contain x z s px py pz
	    a.push([]);a.push([]);a.push([]);a.push([]);
	    for (var ui = ub; ui < ub + 4; ++ui) {
	      a[2].push(s[ui][0]);
	      a[3].push(p[ui][0]);
	      a[4].push(p[ui][1]);
	      a[5].push(p[ui][2]);
	    }
	    var uoi = 1 - uo,
	        c0 = uoi * uoi * uoi,
	        c1 = 3 * uo * uoi * uoi,
	        c2 = 3 * uo * uo * uoi,
	        c3 = uo * uo * uo;
	    var b = a.map(function (p) {
	      var p0 = p[1],
	          p1 = p[1] + (p[2] - p[0]) / 6,
	          p2 = p[2] + (p[1] - p[3]) / 6,
	          p3 = p[2];
	      return c0 * p0 + c1 * p1 + c2 * p2 + c3 * p3;
	    });

	    var qs = [];
	    for (var ui = ub; ui < ub + 4; ++ui) {
	      var q = _glMatrix.quat.create();
	      _glMatrix.quat.setAxisAngle(q, _glMatrix.vec3.fromValues(r[ui][1], r[ui][2], r[ui][3]), r[ui][0]);
	      qs.push(q);
	    }

	    function quatCM(x, y, z) {
	      var dq = _glMatrix.quat.create();
	      _glMatrix.quat.invert(dq, qs[x]);
	      _glMatrix.quat.mul(dq, dq, qs[z]);
	      var axis = _glMatrix.vec3.create();
	      var angle = _glMatrix.quat.getAxisAngle(axis, dq);
	      _glMatrix.quat.setAxisAngle(dq, axis, angle / 6);
	      _glMatrix.quat.mul(dq, qs[y], dq);
	      return dq;
	    }

	    var qs1 = quatCM(0, 1, 2);
	    var qs2 = quatCM(3, 2, 1);
	    qs[0] = qs[1];qs[1] = qs1;
	    qs[3] = qs[2];qs[2] = qs2;
	    for (var i = 0; i < 3; ++i) {
	      for (var j = 0; j < 3 - i; ++j) {
	        _glMatrix.quat.slerp(qs[j], qs[j], qs[j + 1], uo);
	      }
	    }

	    var ret = _glMatrix.vec3.fromValues(b[0] * b[2], 0, b[1] * b[2]);
	    _glMatrix.vec3.transformQuat(ret, ret, qs[0]);
	    _glMatrix.vec3.add(ret, ret, _glMatrix.vec3.fromValues(b[3], b[4], b[5]));
	    return ret;
	  }

	  var density = parseInt(document.getElementById("density").value);
	  var ci = (n - 3) * density,
	      cj = m * density;

	  var alpha = 1;
	  if (showTranslucent) {
	    alpha = 0.5;
	  }

	  var vertices = [];
	  var radius = 0,
	      ns = [],
	      cs = [];
	  for (var i = 0; i < ci; ++i) {
	    var t = [],
	        tn = [],
	        tc = [];
	    for (var j = 0; j < cj; ++j) {
	      var v = getPointOnSurface(i / ci, j / cj);
	      radius = Math.max(radius, _glMatrix.vec3.len(v));
	      t.push(v);
	      tn.push(_glMatrix.vec3.create());
	      var cx = Math.sin(i / ci * Math.PI * 2) / 2 + 0.5;
	      var cy = Math.sin(j / cj * Math.PI * 2) / 2 + 0.5;
	      tc.push(_glMatrix.vec4.fromValues(cx, cy, 0.5, alpha));
	    }
	    vertices.push(t);
	    ns.push(tn);
	    cs.push(tc);
	  }

	  var t0 = _glMatrix.vec3.create(),
	      t1 = _glMatrix.vec3.create();
	  for (var i = 1; i < ci; ++i) {
	    for (var j = 0; j < cj; ++j) {
	      var x0 = i - 1,
	          x1 = i,
	          y0 = j,
	          y1 = (j + 1) % cj;
	      _glMatrix.vec3.sub(t0, vertices[x0][y1], vertices[x0][y0]);
	      _glMatrix.vec3.sub(t1, vertices[x1][y0], vertices[x0][y0]);
	      _glMatrix.vec3.cross(t0, t0, t1);
	      _glMatrix.vec3.normalize(t0, t0);
	      _glMatrix.vec3.add(ns[x0][y0], ns[x0][y0], t0);
	      _glMatrix.vec3.add(ns[x0][y1], ns[x0][y1], t0);
	      _glMatrix.vec3.add(ns[x1][y0], ns[x1][y0], t0);

	      _glMatrix.vec3.sub(t0, vertices[x0][y1], vertices[x1][y0]);
	      _glMatrix.vec3.sub(t1, vertices[x1][y1], vertices[x1][y0]);
	      _glMatrix.vec3.cross(t0, t0, t1);
	      _glMatrix.vec3.normalize(t0, t0);
	      _glMatrix.vec3.add(ns[x1][y0], ns[x1][y0], t0);
	      _glMatrix.vec3.add(ns[x0][y1], ns[x0][y1], t0);
	      _glMatrix.vec3.add(ns[x1][y1], ns[x1][y1], t0);
	    }
	  }

	  for (var i = 0; i < ci; ++i) {
	    for (var j = 0; j < cj; ++j) {
	      _glMatrix.vec3.normalize(ns[i][j], ns[i][j]);
	    }
	  }

	  var ts = [],
	      ks = _glMatrix.vec4.fromValues(0.6, 0.2, 0.2, 1);
	  for (var i = 1; i < ci; ++i) {
	    for (var j = 0; j < cj; ++j) {
	      var _x = i - 1,
	          _x2 = i,
	          _y = j,
	          _y2 = (j + 1) % cj;

	      ts.push(new _BSP.Triangle([vertices[_x][_y], vertices[_x][_y2], vertices[_x2][_y]], [ns[_x][_y], ns[_x][_y2], ns[_x2][_y]], [cs[_x][_y], cs[_x][_y2], cs[_x2][_y]], [ks, ks, ks]));

	      ts.push(new _BSP.Triangle([vertices[_x2][_y], vertices[_x][_y2], vertices[_x2][_y2]], [ns[_x2][_y], ns[_x][_y2], ns[_x2][_y2]], [cs[_x2][_y], cs[_x][_y2], cs[_x2][_y2]], [ks, ks, ks]));
	    }
	  }

	  var cubeP = [[[-1, -1, +1], [+1, -1, +1], [+1, +1, +1]], [[-1, -1, +1], [+1, +1, +1], [-1, +1, +1]], [[-1, -1, -1], [-1, +1, -1], [+1, +1, -1]], [[-1, -1, -1], [+1, +1, -1], [+1, -1, -1]], [[-1, +1, -1], [-1, +1, +1], [+1, +1, +1]], [[-1, +1, -1], [+1, +1, +1], [+1, +1, -1]], [[-1, -1, -1], [+1, -1, -1], [+1, -1, +1]], [[-1, -1, -1], [+1, -1, +1], [-1, -1, +1]], [[+1, -1, -1], [+1, +1, -1], [+1, +1, +1]], [[+1, -1, -1], [+1, +1, +1], [+1, -1, +1]], [[-1, -1, -1], [-1, -1, +1], [-1, +1, +1]], [[-1, -1, -1], [-1, +1, +1], [-1, +1, -1]]];
	  var cubeN = [[0, 0, +1], [0, 0, +1], [0, 0, -1], [0, 0, -1], [0, +1, 0], [0, +1, 0], [0, -1, 0], [0, -1, 0], [+1, 0, 0], [+1, 0, 0], [-1, 0, 0], [-1, 0, 0]];
	  var scale, ofs, c, k;
	  function arr2vecT(arr) {
	    var v = _glMatrix.vec3.fromValues(arr[0], arr[1], arr[2]);
	    _glMatrix.vec3.scale(v, v, scale);
	    _glMatrix.vec3.add(v, v, ofs);
	    return v;
	  }
	  function arr2vec(arr) {
	    return _glMatrix.vec3.fromValues(arr[0], arr[1], arr[2]);
	  }
	  function addCube() {
	    for (i = 0; i < 12; ++i) {
	      ts.push(new _BSP.Triangle([arr2vecT(cubeP[i][0]), arr2vecT(cubeP[i][1]), arr2vecT(cubeP[i][2])], [arr2vec(cubeN[i]), arr2vec(cubeN[i]), arr2vec(cubeN[i])], [c, c, c], [k, k, k]));
	    }
	  }

	  scale = radius / 2, ofs = _glMatrix.vec3.fromValues(-radius / 4, radius / 4, -radius / 4);
	  c = _glMatrix.vec4.fromValues(0.3, 0.3, 0.3, 0.5);
	  k = _glMatrix.vec4.fromValues(0.9, 0.1, 0.0, 1);
	  addCube();

	  // ruby
	  scale = radius / 4, ofs = _glMatrix.vec3.fromValues(0, radius, radius);
	  c = _glMatrix.vec4.fromValues(1.0, 0.2, 0.3, alpha);
	  k = _glMatrix.vec4.fromValues(0.2, 0.0, 0.8, 16);
	  addCube();

	  // rubber
	  scale = radius / 4, ofs = _glMatrix.vec3.fromValues(0, -radius, radius);
	  c = _glMatrix.vec4.fromValues(0.3, 0.3, 0.3, alpha);
	  k = _glMatrix.vec4.fromValues(0.9, 0.1, 0.0, 1);
	  addCube();

	  // mirror
	  scale = radius / 4, ofs = _glMatrix.vec3.fromValues(radius, 0, radius);
	  c = _glMatrix.vec4.fromValues(1.0, 1.0, 1.0, alpha);
	  k = _glMatrix.vec4.fromValues(0.0, 0.0, 1.0, 64);
	  addCube();

	  // plastic
	  scale = radius / 4, ofs = _glMatrix.vec3.fromValues(0, 0, radius);
	  c = _glMatrix.vec4.fromValues(0.4, 0.4, 1.0, alpha);
	  k = _glMatrix.vec4.fromValues(0.2, 0.4, 0.4, 4);
	  addCube();

	  // metal
	  scale = radius / 4, ofs = _glMatrix.vec3.fromValues(-radius, 0, radius);
	  c = _glMatrix.vec4.fromValues(1.0, 1.0, 1.0, alpha);
	  k = _glMatrix.vec4.fromValues(0.1, 0.1, 0.8, 32);
	  addCube();

	  bspTree = new _BSP.BSPTree(ts);
	  mRadius = radius;
	}

	var isMouseDown = false;
	var mouseStart = _glMatrix.vec3.create(),
	    mouseCur = _glMatrix.vec3.create();
	var pMatBase = _glMatrix.mat4.create(),
	    pMatCur = _glMatrix.mat4.create();
	function mousedownListener(e) {
	  isMouseDown = true;
	  getMouseCoord(mouseStart);
	  getMouseCoord(mouseCur);
	  _glMatrix.mat4.copy(pMatBase, pMatCur);
	}
	function mouseupListener(e) {
	  isMouseDown = false;
	}
	function mousemoveListener(e) {
	  if (isMouseDown) {
	    getMouseCoord(mouseCur);
	    setpMatCur();
	  }
	}
	function getMouseCoord(c) {
	  var rect = gl.canvas.getBoundingClientRect();
	  var a = gl.canvas.clientHeight / 2;
	  var x = (event.clientX - rect.left - gl.canvas.clientWidth / 2) / a;
	  var y = -(event.clientY - rect.top - gl.canvas.clientHeight / 2) / a;
	  var r = Math.max(1, Math.sqrt(x * x + y * y));
	  x /= r;y /= r;
	  var z = Math.sqrt(1 - Math.min(1, x * x + y * y));
	  _glMatrix.vec3.set(c, x, y, z);
	}
	function setpMatCur() {
	  var axis3 = _glMatrix.vec3.create();
	  _glMatrix.vec3.cross(axis3, mouseStart, mouseCur);
	  var angle = Math.atan(_glMatrix.vec3.len(axis3) / _glMatrix.vec3.dot(mouseStart, mouseCur));
	  if (angle < 0) angle += Math.PI;
	  var r = _glMatrix.mat4.create();
	  _glMatrix.mat4.rotate(r, r, angle, axis3);
	  _glMatrix.mat4.mul(pMatCur, r, pMatBase);
	}

	var keystate = {};
	function keydownListener(e) {
	  if (!e.metaKey) {
	    keystate[e.keyCode] = true;
	  }
	}
	function keyupListener(e) {
	  keystate[e.keyCode] = false;
	}

	function resize() {
	  var realToCSSPixels = window.devicePixelRatio || 1;
	  var width = Math.floor(gl.canvas.clientWidth * realToCSSPixels);
	  var height = Math.floor(gl.canvas.clientHeight * realToCSSPixels);
	  if (gl.canvas.width !== width || gl.canvas.height !== height) {
	    gl.canvas.width = width;
	    gl.canvas.height = height;
	    gl.viewport(0, 0, width, height);
	  }
	}

	var lastTime = null;
	var pRadius = 50,
	    fovy = Math.PI / 4;
	function animate() {
	  var currentTime = Date.now();
	  if (lastTime) {
	    var delta = (currentTime - lastTime) / 1000;
	    if (keystate[87] /*w*/) pTranslate([0, -mRadius / 1 * delta, 0]);
	    if (keystate[83] /*s*/) pTranslate([0, mRadius / 1 * delta, 0]);
	    if (keystate[65] /*a*/) pTranslate([mRadius / 1 * delta, 0, 0]);
	    if (keystate[68] /*d*/) pTranslate([-mRadius / 1 * delta, 0, 0]);
	    if (keystate[82] /*r*/) pRadius -= mRadius / 1 * delta;
	    if (keystate[84] /*t*/) pRadius += mRadius / 1 * delta;
	    if (keystate[70] /*f*/) fovy -= Math.PI / 8 * delta;
	    if (keystate[71] /*g*/) fovy += Math.PI / 8 * delta;
	    spanFPS.innerHTML = Math.floor(1 / delta) + " fps";
	  }
	  lastTime = currentTime;
	}
	function pTranslate(v) {
	  var t = _glMatrix.mat4.create();
	  _glMatrix.mat4.translate(t, t, v);
	  _glMatrix.mat4.mul(pMatCur, t, pMatCur);
	}

	function setUniforms() {
	  gl.uniformMatrix4fv(uMVMatrix, false, mvMat);
	  var nMat = _glMatrix.mat4.create();
	  _glMatrix.mat4.invert(nMat, mvMat);
	  _glMatrix.mat4.transpose(nMat, nMat);
	  gl.uniformMatrix4fv(uNMatrix, false, nMat);
	}

	function drawScene() {
	  resize();

	  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	  if (bspTree == null) return;

	  var pMat = _glMatrix.mat4.create();
	  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	  _glMatrix.mat4.perspective(pMat, fovy, aspect, 0.1, 1000.0);
	  _glMatrix.mat4.translate(pMat, pMat, [0, 0, -pRadius]);
	  _glMatrix.mat4.mul(pMat, pMat, pMatCur);
	  gl.uniformMatrix4fv(uPMatrix, false, pMat);

	  setUniforms();

	  var vMat = _glMatrix.mat4.create();
	  _glMatrix.mat4.invert(vMat, pMatCur);
	  _glMatrix.mat4.translate(vMat, vMat, [0, 0, pRadius]);
	  var v = _glMatrix.vec4.fromValues(0, 0, 0, 1);
	  _glMatrix.vec4.transformMat4(v, v, vMat);
	  var v3 = _glMatrix.vec3.fromValues(v[0], v[1], v[2]);
	  gl.uniform3fv(uView, v3);
	  gl.uniform1f(uRadius, mRadius);

	  var ts = bspTree.depthOrder(v3);

	  if (showMesh) {
	    var arrVertexPosition = [];
	    var arrVertexColor = [];
	    var arrVertexNormal = [];
	    var arrVertexPhong = [];
	    for (var i = 0; i < ts.length; ++i) {
	      for (var j = 0; j < 3; ++j) {
	        Array.prototype.push.apply(arrVertexPosition, ts[i].p[j]);
	        Array.prototype.push.apply(arrVertexColor, ts[i].c[j]);
	        Array.prototype.push.apply(arrVertexNormal, ts[i].n[j]);
	        Array.prototype.push.apply(arrVertexPhong, ts[i].k[j]);
	      }
	    }
	    gl.bindBuffer(gl.ARRAY_BUFFER, bufVertexPosition);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrVertexPosition), gl.STATIC_DRAW);
	    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
	    gl.bindBuffer(gl.ARRAY_BUFFER, bufVertexColor);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrVertexColor), gl.STATIC_DRAW);
	    gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);
	    gl.bindBuffer(gl.ARRAY_BUFFER, bufVertexNormal);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrVertexNormal), gl.STATIC_DRAW);
	    gl.vertexAttribPointer(aVertexNormal, 3, gl.FLOAT, false, 0, 0);
	    gl.bindBuffer(gl.ARRAY_BUFFER, bufVertexPhong);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrVertexPhong), gl.STATIC_DRAW);
	    gl.vertexAttribPointer(aVertexPhong, 4, gl.FLOAT, false, 0, 0);
	    if (ts.length > 0) {
	      gl.drawArrays(gl.TRIANGLES, 0, ts.length * 3);
	    }
	  }

	  if (showWire) {
	    var arrWireVertexPosition = [];
	    var arrWireVertexColor = [];
	    var arrWireVertexNormal = [];
	    var arrWireVertexPhong = [];
	    for (var i = 0; i < ts.length; ++i) {
	      for (var j = 0; j < 3; ++j) {
	        Array.prototype.push.apply(arrWireVertexPosition, ts[i].p[j]);
	        Array.prototype.push.apply(arrWireVertexPosition, ts[i].p[(j + 1) % 3]);
	        Array.prototype.push.apply(arrWireVertexColor, ts[i].c[j]);
	        Array.prototype.push.apply(arrWireVertexColor, ts[i].c[(j + 1) % 3]);
	        Array.prototype.push.apply(arrWireVertexNormal, ts[i].n[j]);
	        Array.prototype.push.apply(arrWireVertexNormal, ts[i].n[(j + 1) % 3]);
	        Array.prototype.push.apply(arrWireVertexPhong, ts[i].k[j]);
	        Array.prototype.push.apply(arrWireVertexPhong, ts[i].k[(j + 1) % 3]);
	      }
	    }
	    gl.bindBuffer(gl.ARRAY_BUFFER, bufVertexPosition);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrWireVertexPosition), gl.STATIC_DRAW);
	    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
	    gl.bindBuffer(gl.ARRAY_BUFFER, bufVertexColor);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrWireVertexColor), gl.STATIC_DRAW);
	    gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);
	    gl.bindBuffer(gl.ARRAY_BUFFER, bufVertexNormal);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrWireVertexNormal), gl.STATIC_DRAW);
	    gl.vertexAttribPointer(aVertexNormal, 3, gl.FLOAT, false, 0, 0);
	    gl.bindBuffer(gl.ARRAY_BUFFER, bufVertexPhong);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrWireVertexPhong), gl.STATIC_DRAW);
	    gl.vertexAttribPointer(aVertexPhong, 4, gl.FLOAT, false, 0, 0);
	    if (ts.length > 0) {
	      gl.drawArrays(gl.LINES, 0, ts.length * 6);
	    }
	  }

	  animate();
	}

	var mvMat = _glMatrix.mat4.create();
	var mvStack = [];
	function pushMatrix() {
	  mvStack.push(_glMatrix.mat4.clone(mvMat));
	}
	function popMatrix() {
	  mvMat = mvStack.pop();
	}
	function translate(v) {
	  _glMatrix.mat4.translate(mvMat, mvMat, v);
	}
	function rotate(rad, axis) {
	  _glMatrix.mat4.rotate(mvMat, mvMat, rad, axis);
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = "uniform highp vec3 uView;\nuniform highp float uRadius;\n\nvarying highp vec3 vPosition;\nvarying highp vec4 vColor;\nvarying highp vec3 vNormal;\nvarying highp vec4 vPhong;\n\nstruct Light {\n  highp vec3 position;\n  highp vec3 color;\n};\n\nconst int nLight = 5;\n\nLight light[nLight];\n\nvoid main() {\n  highp float d = uRadius * 3.0;\n  light[0] = Light(vec3(0, 0, d), vec3(1, 1, 1));\n  light[1] = Light(vec3(d, d, -d), vec3(1, 1, 0));\n  light[2] = Light(vec3(-d, d, -d), vec3(1, 0, 0));\n  light[3] = Light(vec3(-d, -d, -d), vec3(0, 1, 0));\n  light[4] = Light(vec3(d, -d, -d), vec3(0, 0, 1));\n  highp vec3 N = normalize(vNormal);\n  highp vec3 V = normalize(uView - vPosition);\n  highp vec3 I = vPhong.x * vec3(1, 1, 1);\n  for (int i = 0; i < nLight; ++i) {\n    highp vec3 L = normalize(light[i].position - vPosition);\n    highp vec3 R = 2.0 * dot(L, N) * N - L;\n    I += (\n      vPhong.y * max(dot(N, L), 0.0) +\n      vPhong.z * pow(max(dot(R, V), 0.0), vPhong.w)\n    ) * light[i].color;\n  }\n  gl_FragColor = vec4(I * vColor.xyz, vColor.a);\n}\n"

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = "attribute vec3 aVertexPosition;\nattribute vec4 aVertexColor;\nattribute vec3 aVertexNormal;\nattribute vec4 aVertexPhong;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform mat4 uNMatrix;\n\nvarying vec3 vPosition;\nvarying vec4 vColor;\nvarying vec3 vNormal;\nvarying vec4 vPhong;\n\nvoid main() {\n  vPosition = (uMVMatrix * vec4(aVertexPosition, 1.0)).xyz;\n  vColor = aVertexColor;\n  vNormal = (uNMatrix * vec4(aVertexNormal, 0.0)).xyz;\n  vPhong = aVertexPhong;\n\n  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n}\n"

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = "BSPLINE\n40\n4\n\n5 5\n-5 5\n-5 -5\n5 -5\n4\n0 0 0 0\n0 42 0\n\n5 5\n-5 5\n-5 -5\n5 -5\n3\n0 0 0 0\n0 40 0\n\n5 5\n-5 5\n-5 -5\n5 -5\n2\n0 0 0 0\n0 35 0\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n1\n0 0 0 0\n0 20 0\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.8\n0 0 0 0\n0 -10 0\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.8\n0 0 0 0\n0 -50 0\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.8\n-1.570796 0 0 1\n-13 -63 0\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.8\n-3.141592 0 0 1\n-26 -50 0\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.8\n-3.141592 0 0 1\n-26 -10 0\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.8\n-3.141592 0 0 1\n-26 0 0\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.7\n0 0 0 1\n-26 0 0\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.6\n0 0 0 1\n-26 70 0\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.5\n0 0 0 1\n-26 120 0\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.5\n1.570796 1 0 0\n-26 130 -10\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.5\n3.141592 1 0 0\n-26 120 -20\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.5\n3.141592 1 0 0\n-26 70 -20\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.5\n3.141592 1 0 0\n-26 0 -20\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.65\n3.141592 1 0 0\n-26 -10 -20\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.5\n3.141592 1 0 0\n-26 -12 -20\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.3\n3.141592 1 0 0\n-26 5 -20\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.3\n1.570796 1 0 0\n-26 5 -20\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.3\n1.570796 1 0 0\n-26 5 0\n\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.3\n1.570796 1 0 0\n-26 5 -20\n\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.1\n0 1 0 0\n-26 5 -20\n\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.1\n0 1 0 0\n-26 13 -20\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.3\n1.570796 1 0 0\n-26 15 -20\n\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.3\n1.570796 1 0 0\n-26 15 0\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.1\n0 1 0 0\n-26 15 0\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.1\n0 0 0 0\n-26 -5 0\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.3\n1.570796 0 0 1\n-26 -5 0\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.3\n1.570796 0 0 1\n0 -5 0\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.1\n0 0 0 1\n0 -5 0\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.1\n0 0 0 1\n0 -35 0\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.3\n1.570796 0 0 1\n0 -35 0\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.3\n1.570796 0 0 1\n-26 -35 0\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.1\n0 0 0 1\n-26 -35 0\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.1\n0 0 0 1\n-26 -45 0\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.3\n1.570796 0 0 1\n-26 -45 0\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.3\n1.570796 0 0 1\n0 -45 0\n\n\n5 5\n-5 5\n-5 -5\n5 -5\n0.1\n0 0 0 1\n0 -45 0\n"

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = "BSPLINE # Curve type (BSPLINE or CATMULL_ROM)\n16 # The number of cross sections.\n30 # The number of control points per cross section\n\n# Cross Section 16\n10.0000 0.00000 # The 2D position of control points\n9.78148 2.07912\n9.13545 4.06737\n8.09017 5.87785\n6.69131 7.43145\n5.00000 8.66025\n3.09017 9.51057\n1.04528 9.94522\n-1.04529 9.94522\n-3.09017 9.51056\n-5.00000 8.66025\n-6.69131 7.43145\n-8.09017 5.87785\n-9.13546 4.06737\n-9.78148 2.07912\n-10.0000 0.00000\n-9.78148 -2.07912\n-9.13545 -4.06737\n-8.09017 -5.87785\n-6.69131 -7.43145\n-5.00000 -8.66025\n-3.09017 -9.51057\n-1.04528 -9.94522\n1.04528 -9.94522\n3.09017 -9.51056\n5.00000 -8.66025\n6.69131 -7.43145\n8.09017 -5.87785\n9.13546 -4.06737\n9.78148 -2.07912\n0.04 # Scaling factor\n-1.57 0 0 1 # Rotation\n5 22 0 # Position \n\n# Cross Section 15\n10.0000 0.00000 # The 2D position of control points\n9.78148 2.07912\n9.13545 4.06737\n8.09017 5.87785\n6.69131 7.43145\n5.00000 8.66025\n3.09017 9.51057\n1.04528 9.94522\n-1.04529 9.94522\n-3.09017 9.51056\n-5.00000 8.66025\n-6.69131 7.43145\n-8.09017 5.87785\n-9.13546 4.06737\n-9.78148 2.07912\n-10.0000 0.00000\n-9.78148 -2.07912\n-9.13545 -4.06737\n-8.09017 -5.87785\n-6.69131 -7.43145\n-5.00000 -8.66025\n-3.09017 -9.51057\n-1.04528 -9.94522\n1.04528 -9.94522\n3.09017 -9.51056\n5.00000 -8.66025\n6.69131 -7.43145\n8.09017 -5.87785\n9.13546 -4.06737\n9.78148 -2.07912\n0.04 # Scaling factor\n-1.57 0 0 1 # Rotation\n1 22 0 # Position \n\n# Cross Section 14\n10.0000 0.00000 # The 2D position of control points\n9.78148 2.07912\n9.13545 4.06737\n8.09017 5.87785\n6.69131 7.43145\n5.00000 8.66025\n3.09017 9.51057\n1.04528 9.94522\n-1.04529 9.94522\n-3.09017 9.51056\n-5.00000 8.66025\n-6.69131 7.43145\n-8.09017 5.87785\n-9.13546 4.06737\n-9.78148 2.07912\n-10.0000 0.00000\n-9.78148 -2.07912\n-9.13545 -4.06737\n-8.09017 -5.87785\n-6.69131 -7.43145\n-5.00000 -8.66025\n-3.09017 -9.51057\n-1.04528 -9.94522\n1.04528 -9.94522\n3.09017 -9.51056\n5.00000 -8.66025\n6.69131 -7.43145\n8.09017 -5.87785\n9.13546 -4.06737\n9.78148 -2.07912\n0.04 # Scaling factor\n0.0 1 0 0 # Rotation\n0 20 0 # Position \n\n# Cross Section 13\n10.0000 0.00000 # The 2D position of control points\n9.78148 2.07912\n9.13545 4.06737\n8.09017 5.87785\n6.69131 7.43145\n5.00000 8.66025\n3.09017 9.51057\n1.04528 9.94522\n-1.04529 9.94522\n-3.09017 9.51056\n-5.00000 8.66025\n-6.69131 7.43145\n-8.09017 5.87785\n-9.13546 4.06737\n-9.78148 2.07912\n-10.0000 0.00000\n-9.78148 -2.07912\n-9.13545 -4.06737\n-8.09017 -5.87785\n-6.69131 -7.43145\n-5.00000 -8.66025\n-3.09017 -9.51057\n-1.04528 -9.94522\n1.04528 -9.94522\n3.09017 -9.51056\n5.00000 -8.66025\n6.69131 -7.43145\n8.09017 -5.87785\n9.13546 -4.06737\n9.78148 -2.07912\n0.04 # Scaling factor\n0.0 1 0 0 # Rotation\n0 14 0 # Position \n\n# Cross Section 12\n10.0000 0.00000 # The 2D position of control points\n9.78148 2.07912\n9.13545 4.06737\n8.09017 5.87785\n6.69131 7.43145\n5.00000 8.66025\n3.09017 9.51057\n1.04528 9.94522\n-1.04529 9.94522\n-3.09017 9.51056\n-5.00000 8.66025\n-6.69131 7.43145\n-8.09017 5.87785\n-9.13546 4.06737\n-9.78148 2.07912\n-10.0000 0.00000\n-9.78148 -2.07912\n-9.13545 -4.06737\n-8.09017 -5.87785\n-6.69131 -7.43145\n-5.00000 -8.66025\n-3.09017 -9.51057\n-1.04528 -9.94522\n1.04528 -9.94522\n3.09017 -9.51056\n5.00000 -8.66025\n6.69131 -7.43145\n8.09017 -5.87785\n9.13546 -4.06737\n9.78148 -2.07912\n0.15# Scaling factor\n0.0 1 0 0 # Rotation\n0 14 0 # Position \n\n# Cross Section 11\n10.0000 0.00000 # The 2D position of control points\n9.78148 2.07912\n9.13545 4.06737\n8.09017 5.87785\n6.69131 7.43145\n5.00000 8.66025\n3.09017 9.51057\n1.04528 9.94522\n-1.04529 9.94522\n-3.09017 9.51056\n-5.00000 8.66025\n-6.69131 7.43145\n-8.09017 5.87785\n-9.13546 4.06737\n-9.78148 2.07912\n-10.0000 0.00000\n-9.78148 -2.07912\n-9.13545 -4.06737\n-8.09017 -5.87785\n-6.69131 -7.43145\n-5.00000 -8.66025\n-3.09017 -9.51057\n-1.04528 -9.94522\n1.04528 -9.94522\n3.09017 -9.51056\n5.00000 -8.66025\n6.69131 -7.43145\n8.09017 -5.87785\n9.13546 -4.06737\n9.78148 -2.07912\n0.15# Scaling factor\n0.0 1 0 0 # Rotation\n0 13 0 # Position \n\n# Cross Section 10\n10.0000 0.00000 # The 2D position of control points\n9.78148 2.07912\n9.13545 4.06737\n8.09017 5.87785\n6.69131 7.43145\n5.00000 8.66025\n3.09017 9.51057\n1.04528 9.94522\n-1.04529 9.94522\n-3.09017 9.51056\n-5.00000 8.66025\n-6.69131 7.43145\n-8.09017 5.87785\n-9.13546 4.06737\n-9.78148 2.07912\n-10.0000 0.00000\n-9.78148 -2.07912\n-9.13545 -4.06737\n-8.09017 -5.87785\n-6.69131 -7.43145\n-5.00000 -8.66025\n-3.09017 -9.51057\n-1.04528 -9.94522\n1.04528 -9.94522\n3.09017 -9.51056\n5.00000 -8.66025\n6.69131 -7.43145\n8.09017 -5.87785\n9.13546 -4.06737\n9.78148 -2.07912\n0.12 # Scaling factor\n0.0 1 0 0 # Rotation\n0 13 0 # Position \n\n# Cross Section 09\n10.0000 0.00000 # The 2D position of control points\n9.78148 2.07912\n9.13545 4.06737\n8.09017 5.87785\n6.69131 7.43145\n5.00000 8.66025\n3.09017 9.51057\n1.04528 9.94522\n-1.04529 9.94522\n-3.09017 9.51056\n-5.00000 8.66025\n-6.69131 7.43145\n-8.09017 5.87785\n-9.13546 4.06737\n-9.78148 2.07912\n-10.0000 0.00000\n-9.78148 -2.07912\n-9.13545 -4.06737\n-8.09017 -5.87785\n-6.69131 -7.43145\n-5.00000 -8.66025\n-3.09017 -9.51057\n-1.04528 -9.94522\n1.04528 -9.94522\n3.09017 -9.51056\n5.00000 -8.66025\n6.69131 -7.43145\n8.09017 -5.87785\n9.13546 -4.06737\n9.78148 -2.07912\n0.2 # Scaling factor\n0.0 1 0 0 # Rotation\n0 5 0 # Position \n\n# Cross Section 08\n10.0000 0.00000 # The 2D position of control points\n9.78148 2.07912\n9.13545 4.06737\n8.09017 5.87785\n6.69131 7.43145\n5.00000 8.66025\n3.09017 9.51057\n1.04528 9.94522\n-1.04529 9.94522\n-3.09017 9.51056\n-5.00000 8.66025\n-6.69131 7.43145\n-8.09017 5.87785\n-9.13546 4.06737\n-9.78148 2.07912\n-10.0000 0.00000\n-9.78148 -2.07912\n-9.13545 -4.06737\n-8.09017 -5.87785\n-6.69131 -7.43145\n-5.00000 -8.66025\n-3.09017 -9.51057\n-1.04528 -9.94522\n1.04528 -9.94522\n3.09017 -9.51056\n5.00000 -8.66025\n6.69131 -7.43145\n8.09017 -5.87785\n9.13546 -4.06737\n9.78148 -2.07912\n0.4 # Scaling factor\n0.0 1 0 0 # Rotation\n0 0 0 # Position \n\n# Cross Section 07\n10.0000 0.00000 # The 2D position of control points\n9.78148 2.07912\n9.13545 4.06737\n8.09017 5.87785\n6.69131 7.43145\n5.00000 8.66025\n3.09017 9.51057\n1.04528 9.94522\n-1.04529 9.94522\n-3.09017 9.51056\n-5.00000 8.66025\n-6.69131 7.43145\n-8.09017 5.87785\n-9.13546 4.06737\n-9.78148 2.07912\n-10.0000 0.00000\n-9.78148 -2.07912\n-9.13545 -4.06737\n-8.09017 -5.87785\n-6.69131 -7.43145\n-5.00000 -8.66025\n-3.09017 -9.51057\n-1.04528 -9.94522\n1.04528 -9.94522\n3.09017 -9.51056\n5.00000 -8.66025\n6.69131 -7.43145\n8.09017 -5.87785\n9.13546 -4.06737\n9.78148 -2.07912\n0.5 # Scaling factor\n0.0 1 0 0 # Rotation\n0 -5 0 # Position \n\n# Cross Section 06\n10.0000 0.00000 # The 2D position of control points\n9.78148 2.07912\n9.13545 4.06737\n8.09017 5.87785\n6.69131 7.43145\n5.00000 8.66025\n3.09017 9.51057\n1.04528 9.94522\n-1.04529 9.94522\n-3.09017 9.51056\n-5.00000 8.66025\n-6.69131 7.43145\n-8.09017 5.87785\n-9.13546 4.06737\n-9.78148 2.07912\n-10.0000 0.00000\n-9.78148 -2.07912\n-9.13545 -4.06737\n-8.09017 -5.87785\n-6.69131 -7.43145\n-5.00000 -8.66025\n-3.09017 -9.51057\n-1.04528 -9.94522\n1.04528 -9.94522\n3.09017 -9.51056\n5.00000 -8.66025\n6.69131 -7.43145\n8.09017 -5.87785\n9.13546 -4.06737\n9.78148 -2.07912\n0.45 # Scaling factor\n0.6 0 1 0 # Rotation\n0 -9 0 # Position \n\n# Cross Section 05\n9.50000 0.00000 #1 (9.5)\n9.78148 2.07912\n9.13545 4.06737\n7.68566 5.58396 #4 (9.5)\n6.02217 6.66883 #5\n4.75000 8.22724 #6 (9.5)\n3.09017 9.51057\n1.04528 9.94522\n-0.99302 9.44796 #9 (9.5)\n-2.78115 8.55951 #10\n-4.75000 8.22724 #11 (9.5)\n-6.69131 7.43145\n-8.09017 5.87785\n-8.67868 3.86400 #14 (9.5)\n-8.80333 1.87120 #15\n-9.50000 0.00000 #16 (9.5)\n-9.78148 -2.07912\n-9.13545 -4.06737\n-7.68566 -5.58396 #19 (9.5)\n-6.02217 -6.66883 #20\n-4.75000 -8.22724 #21 (9.5)\n-3.09017 -9.51057\n-1.04528 -9.94522\n0.99302 -9.44796 #24 (9.5)\n2.78115 -8.55951 #25\n4.75000 -8.22724 #26 (9.5)\n6.69131 -7.43145\n8.09017 -5.87785\n8.67868 -3.86400 #29 (9.5)\n8.80333 -1.87120 #30\n0.4 # Scaling factor\n0.6 0 1 0 # Rotation\n0 -13 0 # Position \n\n# Cross Section 04\n9.50000 0.00000 #1 (9.5)\n9.78148 2.07912\n9.13545 4.06737\n7.68566 5.58396 #4 (9.5)\n6.02217 6.66883 #5\n4.75000 8.22724 #6 (9.5)\n3.09017 9.51057\n1.04528 9.94522\n-0.99302 9.44796 #9 (9.5)\n-2.78115 8.55951 #10\n-4.75000 8.22724 #11 (9.5)\n-6.69131 7.43145\n-8.09017 5.87785\n-8.67868 3.86400 #14 (9.5)\n-8.80333 1.87120 #15\n-9.50000 0.00000 #16 (9.5)\n-9.78148 -2.07912\n-9.13545 -4.06737\n-7.68566 -5.58396 #19 (9.5)\n-6.02217 -6.66883 #20\n-4.75000 -8.22724 #21 (9.5)\n-3.09017 -9.51057\n-1.04528 -9.94522\n0.99302 -9.44796 #24 (9.5)\n2.78115 -8.55951 #25\n4.75000 -8.22724 #26 (9.5)\n6.69131 -7.43145\n8.09017 -5.87785\n8.67868 -3.86400 #29 (9.5)\n8.80333 -1.87120 #30\n0.48 # Scaling factor\n0.3 0 1 0 # Rotation\n0 -17 0 # Position \n\n# Cross Section 03\n9.50000 0.00000 #1 (9.5)\n9.78148 2.07912\n9.13545 4.06737\n7.68566 5.58396 #4 (9.5)\n6.02217 6.66883 #5\n4.75000 8.22724 #6 (9.5)\n3.09017 9.51057\n1.04528 9.94522\n-0.99302 9.44796 #9 (9.5)\n-2.78115 8.55951 #10\n-4.75000 8.22724 #11 (9.5)\n-6.69131 7.43145\n-8.09017 5.87785\n-8.67868 3.86400 #14 (9.5)\n-8.80333 1.87120 #15\n-9.50000 0.00000 #16 (9.5)\n-9.78148 -2.07912\n-9.13545 -4.06737\n-7.68566 -5.58396 #19 (9.5)\n-6.02217 -6.66883 #20\n-4.75000 -8.22724 #21 (9.5)\n-3.09017 -9.51057\n-1.04528 -9.94522\n0.99302 -9.44796 #24 (9.5)\n2.78115 -8.55951 #25\n4.75000 -8.22724 #26 (9.5)\n6.69131 -7.43145\n8.09017 -5.87785\n8.67868 -3.86400 #29 (9.5)\n8.80333 -1.87120 #30\n0.5 # Scaling factor\n0.0 1 0 0 # Rotation\n0 -21 0 # Position \n\n# Cross Section 02\n10.0000 0.00000 # The 2D position of control points\n9.78148 2.07912\n9.13545 4.06737\n8.09017 5.87785\n6.69131 7.43145\n5.00000 8.66025\n3.09017 9.51057\n1.04528 9.94522\n-1.04529 9.94522\n-3.09017 9.51056\n-5.00000 8.66025\n-6.69131 7.43145\n-8.09017 5.87785\n-9.13546 4.06737\n-9.78148 2.07912\n-10.0000 0.00000\n-9.78148 -2.07912\n-9.13545 -4.06737\n-8.09017 -5.87785\n-6.69131 -7.43145\n-5.00000 -8.66025\n-3.09017 -9.51057\n-1.04528 -9.94522\n1.04528 -9.94522\n3.09017 -9.51056\n5.00000 -8.66025\n6.69131 -7.43145\n8.09017 -5.87785\n9.13546 -4.06737\n9.78148 -2.07912\n0.4 # Scaling factor\n0.0 1 0 0 # Rotation\n0 -23 0 # Position \n\n# Cross Section 01\n10.0000 0.00000 # The 2D position of control points\n9.78148 2.07912\n9.13545 4.06737\n8.09017 5.87785\n6.69131 7.43145\n5.00000 8.66025\n3.09017 9.51057\n1.04528 9.94522\n-1.04529 9.94522\n-3.09017 9.51056\n-5.00000 8.66025\n-6.69131 7.43145\n-8.09017 5.87785\n-9.13546 4.06737\n-9.78148 2.07912\n-10.0000 0.00000\n-9.78148 -2.07912\n-9.13545 -4.06737\n-8.09017 -5.87785\n-6.69131 -7.43145\n-5.00000 -8.66025\n-3.09017 -9.51057\n-1.04528 -9.94522\n1.04528 -9.94522\n3.09017 -9.51056\n5.00000 -8.66025\n6.69131 -7.43145\n8.09017 -5.87785\n9.13546 -4.06737\n9.78148 -2.07912\n0.0 # Scaling factor\n0.0 1 0 0 # Rotation\n0 -23 0 # Position \n"

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "BSPLINE\n11\n4\n\n1 0\n0 1\n-1 0\n0 -1\n5\n-3.14 0 0 1\n0 10 0\n\n1 0\n0 1\n-1 0\n0 -1\n10\n-3.14 0 0 1\n0 5 0\n\n1 0\n0 1\n-1 0\n0 -1\n5\n-3.14 0 0 1\n0 0 0\n\n1 0\n0 1\n-1 0\n0 -1\n3\n-3.14 0 0 1\n0 5 0\n\n1 0\n0 1\n-1 0\n0 -1\n3\n-3.14 0 0 1\n5 10 0\n\n1 0\n0 1\n-1 0\n0 -1\n3\n-3.14 0 0 1\n10 15 0\n\n1 0\n0 1\n-1 0\n0 -1\n3\n-1.57 0 0 1\n5 20 0\n\n1 0\n0 1\n-1 0\n0 -1\n3\n0 0 0 0\n0 15 0\n\n1 0\n0 1\n-1 0\n0 -1\n5\n0 0 0 0\n0 10 0\n\n1 0\n0 1\n-1 0\n0 -1\n10\n0 0 0 0\n0 5 0\n\n1 0\n0 1\n-1 0\n0 -1\n5\n0 0 0 0\n0 0 0\n"

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = "BSPLINE\n15\n16\n\n10 10\n10 5\n10 0\n10 -5\n10 -10\n5 -10\n0 -10\n-5 -10\n-10 -10\n-10 -5\n-10 0\n-10 5\n-10 10\n-5 10\n0 10\n5 10\n0\n0 0 0 0\n0 -10 0\n\n10 10\n10 5\n10 0\n10 -5\n10 -10\n5 -10\n0 -10\n-5 -10\n-10 -10\n-10 -5\n-10 0\n-10 5\n-10 10\n-5 10\n0 10\n5 10\n0\n0 0 0 0\n0 -10 0\n\n10 10\n14 5\n10 0\n7.5 -2.5\n5 -5\n2.5 -7.5\n0 -10\n-2.5 -7.5\n-5 -5\n-7.5 -2.5\n-10 0\n-14 5\n-10 10\n-5 13\n0 5\n5 13\n0.6\n0 0 0 0\n0 -10 -1\n\n10 10\n14 5\n10 0\n7.5 -2.5\n5 -5\n2.5 -7.5\n0 -10\n-2.5 -7.5\n-5 -5\n-7.5 -2.5\n-10 0\n-14 5\n-10 10\n-5 13\n0 5\n5 13\n0.6\n0 0 0 0\n0 -7 -1\n\n10 10\n10 5\n10 0\n10 -5\n10 -10\n5 -10\n0 -10\n-5 -10\n-10 -10\n-10 -5\n-10 0\n-10 5\n-10 10\n-5 10\n0 10\n5 10\n0.9\n0 0 0 0\n0 -7 0\n\n10 10\n12 5\n10 0\n12 -5\n10 -10\n5 -12\n0 -10\n-5 -12\n-10 -10\n-12 -5\n-10 0\n-12 5\n-10 10\n-5 12\n0 10\n5 12\n0.9\n0 0 0 0\n0 -10 0\n\n10 10\n12 5\n10 0\n12 -5\n10 -10\n5 -12\n0 -10\n-5 -12\n-10 -10\n-12 -5\n-10 0\n-12 5\n-10 10\n-5 12\n0 10\n5 12\n1\n0 0 0 0\n0 -10 0\n\n10 10\n12 5\n10 0\n12 -5\n10 -10\n5 -12\n0 -10\n-5 -12\n-10 -10\n-12 -5\n-10 0\n-12 5\n-10 10\n-5 12\n0 10\n5 12\n1\n0 0 0 0\n0 10 0\n\n10 10\n12 5\n10 0\n12 -5\n10 -10\n5 -12\n0 -10\n-5 -12\n-10 -10\n-12 -5\n-10 0\n-12 5\n-10 10\n-5 12\n0 10\n5 12\n0.9\n0 0 0 0\n0 10 0\n\n10 10\n10 5\n10 0\n10 -5\n10 -10\n5 -10\n0 -10\n-5 -10\n-10 -10\n-10 -5\n-10 0\n-10 5\n-10 10\n-5 10\n0 10\n5 10\n0.9\n0 0 0 0\n0 7 0\n\n10 10\n14 5\n10 0\n7.5 -2.5\n5 -5\n2.5 -7.5\n0 -10\n-2.5 -7.5\n-5 -5\n-7.5 -2.5\n-10 0\n-14 5\n-10 10\n-5 13\n0 5\n5 13\n0.6\n0 0 0 0\n0 7 -1\n\n10 10\n14 5\n10 0\n7.5 -2.5\n5 -5\n2.5 -7.5\n0 -10\n-2.5 -7.5\n-5 -5\n-7.5 -2.5\n-10 0\n-14 5\n-10 10\n-5 13\n0 5\n5 13\n0.6\n0 0 0 0\n0 10 -1\n\n10 10\n10 5\n10 0\n10 -5\n10 -10\n5 -10\n0 -10\n-5 -10\n-10 -10\n-10 -5\n-10 0\n-10 5\n-10 10\n-5 10\n0 10\n5 10\n0\n0 0 0 0\n0 10 0\n\n10 10\n10 5\n10 0\n10 -5\n10 -10\n5 -10\n0 -10\n-5 -10\n-10 -10\n-10 -5\n-10 0\n-10 5\n-10 10\n-5 10\n0 10\n5 10\n0\n0 0 0 0\n0 10 0\n\n10 10\n10 5\n10 0\n10 -5\n10 -10\n5 -10\n0 -10\n-5 -10\n-10 -10\n-10 -5\n-10 0\n-10 5\n-10 10\n-5 10\n0 10\n5 10\n0\n0 0 0 0\n0 10 0"

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview gl-matrix - High performance matrix and vector operations
	 * @author Brandon Jones
	 * @author Colin MacKenzie IV
	 * @version 2.3.2
	 */

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */
	// END HEADER

	exports.glMatrix = __webpack_require__(13);
	exports.mat2 = __webpack_require__(14);
	exports.mat2d = __webpack_require__(15);
	exports.mat3 = __webpack_require__(16);
	exports.mat4 = __webpack_require__(17);
	exports.quat = __webpack_require__(18);
	exports.vec2 = __webpack_require__(21);
	exports.vec3 = __webpack_require__(19);
	exports.vec4 = __webpack_require__(20);

/***/ },
/* 13 */
/***/ function(module, exports) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	/**
	 * @class Common utilities
	 * @name glMatrix
	 */
	var glMatrix = {};

	// Configuration Constants
	glMatrix.EPSILON = 0.000001;
	glMatrix.ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
	glMatrix.RANDOM = Math.random;
	glMatrix.ENABLE_SIMD = false;

	// Capability detection
	glMatrix.SIMD_AVAILABLE = (glMatrix.ARRAY_TYPE === Float32Array) && ('SIMD' in this);
	glMatrix.USE_SIMD = glMatrix.ENABLE_SIMD && glMatrix.SIMD_AVAILABLE;

	/**
	 * Sets the type of array used when creating new vectors and matrices
	 *
	 * @param {Type} type Array type, such as Float32Array or Array
	 */
	glMatrix.setMatrixArrayType = function(type) {
	    glMatrix.ARRAY_TYPE = type;
	}

	var degree = Math.PI / 180;

	/**
	* Convert Degree To Radian
	*
	* @param {Number} Angle in Degrees
	*/
	glMatrix.toRadian = function(a){
	     return a * degree;
	}

	/**
	 * Tests whether or not the arguments have approximately the same value, within an absolute
	 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less 
	 * than or equal to 1.0, and a relative tolerance is used for larger values)
	 * 
	 * @param {Number} a The first number to test.
	 * @param {Number} b The second number to test.
	 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
	 */
	glMatrix.equals = function(a, b) {
		return Math.abs(a - b) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a), Math.abs(b));
	}

	module.exports = glMatrix;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(13);

	/**
	 * @class 2x2 Matrix
	 * @name mat2
	 */
	var mat2 = {};

	/**
	 * Creates a new identity mat2
	 *
	 * @returns {mat2} a new 2x2 matrix
	 */
	mat2.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    return out;
	};

	/**
	 * Creates a new mat2 initialized with values from an existing matrix
	 *
	 * @param {mat2} a matrix to clone
	 * @returns {mat2} a new 2x2 matrix
	 */
	mat2.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    return out;
	};

	/**
	 * Copy the values from one mat2 to another
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	mat2.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    return out;
	};

	/**
	 * Set a mat2 to the identity matrix
	 *
	 * @param {mat2} out the receiving matrix
	 * @returns {mat2} out
	 */
	mat2.identity = function(out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    return out;
	};

	/**
	 * Create a new mat2 with the given values
	 *
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m10 Component in column 1, row 0 position (index 2)
	 * @param {Number} m11 Component in column 1, row 1 position (index 3)
	 * @returns {mat2} out A new 2x2 matrix
	 */
	mat2.fromValues = function(m00, m01, m10, m11) {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = m00;
	    out[1] = m01;
	    out[2] = m10;
	    out[3] = m11;
	    return out;
	};

	/**
	 * Set the components of a mat2 to the given values
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m10 Component in column 1, row 0 position (index 2)
	 * @param {Number} m11 Component in column 1, row 1 position (index 3)
	 * @returns {mat2} out
	 */
	mat2.set = function(out, m00, m01, m10, m11) {
	    out[0] = m00;
	    out[1] = m01;
	    out[2] = m10;
	    out[3] = m11;
	    return out;
	};


	/**
	 * Transpose the values of a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	mat2.transpose = function(out, a) {
	    // If we are transposing ourselves we can skip a few steps but have to cache some values
	    if (out === a) {
	        var a1 = a[1];
	        out[1] = a[2];
	        out[2] = a1;
	    } else {
	        out[0] = a[0];
	        out[1] = a[2];
	        out[2] = a[1];
	        out[3] = a[3];
	    }
	    
	    return out;
	};

	/**
	 * Inverts a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	mat2.invert = function(out, a) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

	        // Calculate the determinant
	        det = a0 * a3 - a2 * a1;

	    if (!det) {
	        return null;
	    }
	    det = 1.0 / det;
	    
	    out[0] =  a3 * det;
	    out[1] = -a1 * det;
	    out[2] = -a2 * det;
	    out[3] =  a0 * det;

	    return out;
	};

	/**
	 * Calculates the adjugate of a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	mat2.adjoint = function(out, a) {
	    // Caching this value is nessecary if out == a
	    var a0 = a[0];
	    out[0] =  a[3];
	    out[1] = -a[1];
	    out[2] = -a[2];
	    out[3] =  a0;

	    return out;
	};

	/**
	 * Calculates the determinant of a mat2
	 *
	 * @param {mat2} a the source matrix
	 * @returns {Number} determinant of a
	 */
	mat2.determinant = function (a) {
	    return a[0] * a[3] - a[2] * a[1];
	};

	/**
	 * Multiplies two mat2's
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the first operand
	 * @param {mat2} b the second operand
	 * @returns {mat2} out
	 */
	mat2.multiply = function (out, a, b) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
	    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
	    out[0] = a0 * b0 + a2 * b1;
	    out[1] = a1 * b0 + a3 * b1;
	    out[2] = a0 * b2 + a2 * b3;
	    out[3] = a1 * b2 + a3 * b3;
	    return out;
	};

	/**
	 * Alias for {@link mat2.multiply}
	 * @function
	 */
	mat2.mul = mat2.multiply;

	/**
	 * Rotates a mat2 by the given angle
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2} out
	 */
	mat2.rotate = function (out, a, rad) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
	        s = Math.sin(rad),
	        c = Math.cos(rad);
	    out[0] = a0 *  c + a2 * s;
	    out[1] = a1 *  c + a3 * s;
	    out[2] = a0 * -s + a2 * c;
	    out[3] = a1 * -s + a3 * c;
	    return out;
	};

	/**
	 * Scales the mat2 by the dimensions in the given vec2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the matrix to rotate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat2} out
	 **/
	mat2.scale = function(out, a, v) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
	        v0 = v[0], v1 = v[1];
	    out[0] = a0 * v0;
	    out[1] = a1 * v0;
	    out[2] = a2 * v1;
	    out[3] = a3 * v1;
	    return out;
	};

	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2.identity(dest);
	 *     mat2.rotate(dest, dest, rad);
	 *
	 * @param {mat2} out mat2 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2} out
	 */
	mat2.fromRotation = function(out, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad);
	    out[0] = c;
	    out[1] = s;
	    out[2] = -s;
	    out[3] = c;
	    return out;
	}

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2.identity(dest);
	 *     mat2.scale(dest, dest, vec);
	 *
	 * @param {mat2} out mat2 receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat2} out
	 */
	mat2.fromScaling = function(out, v) {
	    out[0] = v[0];
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = v[1];
	    return out;
	}

	/**
	 * Returns a string representation of a mat2
	 *
	 * @param {mat2} mat matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	mat2.str = function (a) {
	    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	};

	/**
	 * Returns Frobenius norm of a mat2
	 *
	 * @param {mat2} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	mat2.frob = function (a) {
	    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
	};

	/**
	 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
	 * @param {mat2} L the lower triangular matrix 
	 * @param {mat2} D the diagonal matrix 
	 * @param {mat2} U the upper triangular matrix 
	 * @param {mat2} a the input matrix to factorize
	 */

	mat2.LDU = function (L, D, U, a) { 
	    L[2] = a[2]/a[0]; 
	    U[0] = a[0]; 
	    U[1] = a[1]; 
	    U[3] = a[3] - L[2] * U[1]; 
	    return [L, D, U];       
	}; 

	/**
	 * Adds two mat2's
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the first operand
	 * @param {mat2} b the second operand
	 * @returns {mat2} out
	 */
	mat2.add = function(out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    out[2] = a[2] + b[2];
	    out[3] = a[3] + b[3];
	    return out;
	};

	/**
	 * Subtracts matrix b from matrix a
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the first operand
	 * @param {mat2} b the second operand
	 * @returns {mat2} out
	 */
	mat2.subtract = function(out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    out[2] = a[2] - b[2];
	    out[3] = a[3] - b[3];
	    return out;
	};

	/**
	 * Alias for {@link mat2.subtract}
	 * @function
	 */
	mat2.sub = mat2.subtract;

	/**
	 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {mat2} a The first matrix.
	 * @param {mat2} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	mat2.exactEquals = function (a, b) {
	    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
	};

	/**
	 * Returns whether or not the matrices have approximately the same elements in the same position.
	 *
	 * @param {mat2} a The first matrix.
	 * @param {mat2} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	mat2.equals = function (a, b) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
	    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
	    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
	            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
	            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
	            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
	};

	/**
	 * Multiply each element of the matrix by a scalar.
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the matrix to scale
	 * @param {Number} b amount to scale the matrix's elements by
	 * @returns {mat2} out
	 */
	mat2.multiplyScalar = function(out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    out[2] = a[2] * b;
	    out[3] = a[3] * b;
	    return out;
	};

	/**
	 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
	 *
	 * @param {mat2} out the receiving vector
	 * @param {mat2} a the first operand
	 * @param {mat2} b the second operand
	 * @param {Number} scale the amount to scale b's elements by before adding
	 * @returns {mat2} out
	 */
	mat2.multiplyScalarAndAdd = function(out, a, b, scale) {
	    out[0] = a[0] + (b[0] * scale);
	    out[1] = a[1] + (b[1] * scale);
	    out[2] = a[2] + (b[2] * scale);
	    out[3] = a[3] + (b[3] * scale);
	    return out;
	};

	module.exports = mat2;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(13);

	/**
	 * @class 2x3 Matrix
	 * @name mat2d
	 * 
	 * @description 
	 * A mat2d contains six elements defined as:
	 * <pre>
	 * [a, c, tx,
	 *  b, d, ty]
	 * </pre>
	 * This is a short form for the 3x3 matrix:
	 * <pre>
	 * [a, c, tx,
	 *  b, d, ty,
	 *  0, 0, 1]
	 * </pre>
	 * The last row is ignored so the array is shorter and operations are faster.
	 */
	var mat2d = {};

	/**
	 * Creates a new identity mat2d
	 *
	 * @returns {mat2d} a new 2x3 matrix
	 */
	mat2d.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(6);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    out[4] = 0;
	    out[5] = 0;
	    return out;
	};

	/**
	 * Creates a new mat2d initialized with values from an existing matrix
	 *
	 * @param {mat2d} a matrix to clone
	 * @returns {mat2d} a new 2x3 matrix
	 */
	mat2d.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(6);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    return out;
	};

	/**
	 * Copy the values from one mat2d to another
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the source matrix
	 * @returns {mat2d} out
	 */
	mat2d.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    return out;
	};

	/**
	 * Set a mat2d to the identity matrix
	 *
	 * @param {mat2d} out the receiving matrix
	 * @returns {mat2d} out
	 */
	mat2d.identity = function(out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    out[4] = 0;
	    out[5] = 0;
	    return out;
	};

	/**
	 * Create a new mat2d with the given values
	 *
	 * @param {Number} a Component A (index 0)
	 * @param {Number} b Component B (index 1)
	 * @param {Number} c Component C (index 2)
	 * @param {Number} d Component D (index 3)
	 * @param {Number} tx Component TX (index 4)
	 * @param {Number} ty Component TY (index 5)
	 * @returns {mat2d} A new mat2d
	 */
	mat2d.fromValues = function(a, b, c, d, tx, ty) {
	    var out = new glMatrix.ARRAY_TYPE(6);
	    out[0] = a;
	    out[1] = b;
	    out[2] = c;
	    out[3] = d;
	    out[4] = tx;
	    out[5] = ty;
	    return out;
	};

	/**
	 * Set the components of a mat2d to the given values
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {Number} a Component A (index 0)
	 * @param {Number} b Component B (index 1)
	 * @param {Number} c Component C (index 2)
	 * @param {Number} d Component D (index 3)
	 * @param {Number} tx Component TX (index 4)
	 * @param {Number} ty Component TY (index 5)
	 * @returns {mat2d} out
	 */
	mat2d.set = function(out, a, b, c, d, tx, ty) {
	    out[0] = a;
	    out[1] = b;
	    out[2] = c;
	    out[3] = d;
	    out[4] = tx;
	    out[5] = ty;
	    return out;
	};

	/**
	 * Inverts a mat2d
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the source matrix
	 * @returns {mat2d} out
	 */
	mat2d.invert = function(out, a) {
	    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
	        atx = a[4], aty = a[5];

	    var det = aa * ad - ab * ac;
	    if(!det){
	        return null;
	    }
	    det = 1.0 / det;

	    out[0] = ad * det;
	    out[1] = -ab * det;
	    out[2] = -ac * det;
	    out[3] = aa * det;
	    out[4] = (ac * aty - ad * atx) * det;
	    out[5] = (ab * atx - aa * aty) * det;
	    return out;
	};

	/**
	 * Calculates the determinant of a mat2d
	 *
	 * @param {mat2d} a the source matrix
	 * @returns {Number} determinant of a
	 */
	mat2d.determinant = function (a) {
	    return a[0] * a[3] - a[1] * a[2];
	};

	/**
	 * Multiplies two mat2d's
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the first operand
	 * @param {mat2d} b the second operand
	 * @returns {mat2d} out
	 */
	mat2d.multiply = function (out, a, b) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
	        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
	    out[0] = a0 * b0 + a2 * b1;
	    out[1] = a1 * b0 + a3 * b1;
	    out[2] = a0 * b2 + a2 * b3;
	    out[3] = a1 * b2 + a3 * b3;
	    out[4] = a0 * b4 + a2 * b5 + a4;
	    out[5] = a1 * b4 + a3 * b5 + a5;
	    return out;
	};

	/**
	 * Alias for {@link mat2d.multiply}
	 * @function
	 */
	mat2d.mul = mat2d.multiply;

	/**
	 * Rotates a mat2d by the given angle
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2d} out
	 */
	mat2d.rotate = function (out, a, rad) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
	        s = Math.sin(rad),
	        c = Math.cos(rad);
	    out[0] = a0 *  c + a2 * s;
	    out[1] = a1 *  c + a3 * s;
	    out[2] = a0 * -s + a2 * c;
	    out[3] = a1 * -s + a3 * c;
	    out[4] = a4;
	    out[5] = a5;
	    return out;
	};

	/**
	 * Scales the mat2d by the dimensions in the given vec2
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to translate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat2d} out
	 **/
	mat2d.scale = function(out, a, v) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
	        v0 = v[0], v1 = v[1];
	    out[0] = a0 * v0;
	    out[1] = a1 * v0;
	    out[2] = a2 * v1;
	    out[3] = a3 * v1;
	    out[4] = a4;
	    out[5] = a5;
	    return out;
	};

	/**
	 * Translates the mat2d by the dimensions in the given vec2
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to translate
	 * @param {vec2} v the vec2 to translate the matrix by
	 * @returns {mat2d} out
	 **/
	mat2d.translate = function(out, a, v) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
	        v0 = v[0], v1 = v[1];
	    out[0] = a0;
	    out[1] = a1;
	    out[2] = a2;
	    out[3] = a3;
	    out[4] = a0 * v0 + a2 * v1 + a4;
	    out[5] = a1 * v0 + a3 * v1 + a5;
	    return out;
	};

	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.rotate(dest, dest, rad);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2d} out
	 */
	mat2d.fromRotation = function(out, rad) {
	    var s = Math.sin(rad), c = Math.cos(rad);
	    out[0] = c;
	    out[1] = s;
	    out[2] = -s;
	    out[3] = c;
	    out[4] = 0;
	    out[5] = 0;
	    return out;
	}

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.scale(dest, dest, vec);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat2d} out
	 */
	mat2d.fromScaling = function(out, v) {
	    out[0] = v[0];
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = v[1];
	    out[4] = 0;
	    out[5] = 0;
	    return out;
	}

	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.translate(dest, dest, vec);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {vec2} v Translation vector
	 * @returns {mat2d} out
	 */
	mat2d.fromTranslation = function(out, v) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    out[4] = v[0];
	    out[5] = v[1];
	    return out;
	}

	/**
	 * Returns a string representation of a mat2d
	 *
	 * @param {mat2d} a matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	mat2d.str = function (a) {
	    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
	                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
	};

	/**
	 * Returns Frobenius norm of a mat2d
	 *
	 * @param {mat2d} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	mat2d.frob = function (a) { 
	    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
	}; 

	/**
	 * Adds two mat2d's
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the first operand
	 * @param {mat2d} b the second operand
	 * @returns {mat2d} out
	 */
	mat2d.add = function(out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    out[2] = a[2] + b[2];
	    out[3] = a[3] + b[3];
	    out[4] = a[4] + b[4];
	    out[5] = a[5] + b[5];
	    return out;
	};

	/**
	 * Subtracts matrix b from matrix a
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the first operand
	 * @param {mat2d} b the second operand
	 * @returns {mat2d} out
	 */
	mat2d.subtract = function(out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    out[2] = a[2] - b[2];
	    out[3] = a[3] - b[3];
	    out[4] = a[4] - b[4];
	    out[5] = a[5] - b[5];
	    return out;
	};

	/**
	 * Alias for {@link mat2d.subtract}
	 * @function
	 */
	mat2d.sub = mat2d.subtract;

	/**
	 * Multiply each element of the matrix by a scalar.
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to scale
	 * @param {Number} b amount to scale the matrix's elements by
	 * @returns {mat2d} out
	 */
	mat2d.multiplyScalar = function(out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    out[2] = a[2] * b;
	    out[3] = a[3] * b;
	    out[4] = a[4] * b;
	    out[5] = a[5] * b;
	    return out;
	};

	/**
	 * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
	 *
	 * @param {mat2d} out the receiving vector
	 * @param {mat2d} a the first operand
	 * @param {mat2d} b the second operand
	 * @param {Number} scale the amount to scale b's elements by before adding
	 * @returns {mat2d} out
	 */
	mat2d.multiplyScalarAndAdd = function(out, a, b, scale) {
	    out[0] = a[0] + (b[0] * scale);
	    out[1] = a[1] + (b[1] * scale);
	    out[2] = a[2] + (b[2] * scale);
	    out[3] = a[3] + (b[3] * scale);
	    out[4] = a[4] + (b[4] * scale);
	    out[5] = a[5] + (b[5] * scale);
	    return out;
	};

	/**
	 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {mat2d} a The first matrix.
	 * @param {mat2d} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	mat2d.exactEquals = function (a, b) {
	    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
	};

	/**
	 * Returns whether or not the matrices have approximately the same elements in the same position.
	 *
	 * @param {mat2d} a The first matrix.
	 * @param {mat2d} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	mat2d.equals = function (a, b) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
	    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
	    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
	            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
	            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
	            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
	            Math.abs(a4 - b4) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
	            Math.abs(a5 - b5) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a5), Math.abs(b5)));
	};

	module.exports = mat2d;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(13);

	/**
	 * @class 3x3 Matrix
	 * @name mat3
	 */
	var mat3 = {};

	/**
	 * Creates a new identity mat3
	 *
	 * @returns {mat3} a new 3x3 matrix
	 */
	mat3.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(9);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 1;
	    out[5] = 0;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 1;
	    return out;
	};

	/**
	 * Copies the upper-left 3x3 values into the given mat3.
	 *
	 * @param {mat3} out the receiving 3x3 matrix
	 * @param {mat4} a   the source 4x4 matrix
	 * @returns {mat3} out
	 */
	mat3.fromMat4 = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[4];
	    out[4] = a[5];
	    out[5] = a[6];
	    out[6] = a[8];
	    out[7] = a[9];
	    out[8] = a[10];
	    return out;
	};

	/**
	 * Creates a new mat3 initialized with values from an existing matrix
	 *
	 * @param {mat3} a matrix to clone
	 * @returns {mat3} a new 3x3 matrix
	 */
	mat3.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(9);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    return out;
	};

	/**
	 * Copy the values from one mat3 to another
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	mat3.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    return out;
	};

	/**
	 * Create a new mat3 with the given values
	 *
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m02 Component in column 0, row 2 position (index 2)
	 * @param {Number} m10 Component in column 1, row 0 position (index 3)
	 * @param {Number} m11 Component in column 1, row 1 position (index 4)
	 * @param {Number} m12 Component in column 1, row 2 position (index 5)
	 * @param {Number} m20 Component in column 2, row 0 position (index 6)
	 * @param {Number} m21 Component in column 2, row 1 position (index 7)
	 * @param {Number} m22 Component in column 2, row 2 position (index 8)
	 * @returns {mat3} A new mat3
	 */
	mat3.fromValues = function(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
	    var out = new glMatrix.ARRAY_TYPE(9);
	    out[0] = m00;
	    out[1] = m01;
	    out[2] = m02;
	    out[3] = m10;
	    out[4] = m11;
	    out[5] = m12;
	    out[6] = m20;
	    out[7] = m21;
	    out[8] = m22;
	    return out;
	};

	/**
	 * Set the components of a mat3 to the given values
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m02 Component in column 0, row 2 position (index 2)
	 * @param {Number} m10 Component in column 1, row 0 position (index 3)
	 * @param {Number} m11 Component in column 1, row 1 position (index 4)
	 * @param {Number} m12 Component in column 1, row 2 position (index 5)
	 * @param {Number} m20 Component in column 2, row 0 position (index 6)
	 * @param {Number} m21 Component in column 2, row 1 position (index 7)
	 * @param {Number} m22 Component in column 2, row 2 position (index 8)
	 * @returns {mat3} out
	 */
	mat3.set = function(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
	    out[0] = m00;
	    out[1] = m01;
	    out[2] = m02;
	    out[3] = m10;
	    out[4] = m11;
	    out[5] = m12;
	    out[6] = m20;
	    out[7] = m21;
	    out[8] = m22;
	    return out;
	};

	/**
	 * Set a mat3 to the identity matrix
	 *
	 * @param {mat3} out the receiving matrix
	 * @returns {mat3} out
	 */
	mat3.identity = function(out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 1;
	    out[5] = 0;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 1;
	    return out;
	};

	/**
	 * Transpose the values of a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	mat3.transpose = function(out, a) {
	    // If we are transposing ourselves we can skip a few steps but have to cache some values
	    if (out === a) {
	        var a01 = a[1], a02 = a[2], a12 = a[5];
	        out[1] = a[3];
	        out[2] = a[6];
	        out[3] = a01;
	        out[5] = a[7];
	        out[6] = a02;
	        out[7] = a12;
	    } else {
	        out[0] = a[0];
	        out[1] = a[3];
	        out[2] = a[6];
	        out[3] = a[1];
	        out[4] = a[4];
	        out[5] = a[7];
	        out[6] = a[2];
	        out[7] = a[5];
	        out[8] = a[8];
	    }
	    
	    return out;
	};

	/**
	 * Inverts a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	mat3.invert = function(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2],
	        a10 = a[3], a11 = a[4], a12 = a[5],
	        a20 = a[6], a21 = a[7], a22 = a[8],

	        b01 = a22 * a11 - a12 * a21,
	        b11 = -a22 * a10 + a12 * a20,
	        b21 = a21 * a10 - a11 * a20,

	        // Calculate the determinant
	        det = a00 * b01 + a01 * b11 + a02 * b21;

	    if (!det) { 
	        return null; 
	    }
	    det = 1.0 / det;

	    out[0] = b01 * det;
	    out[1] = (-a22 * a01 + a02 * a21) * det;
	    out[2] = (a12 * a01 - a02 * a11) * det;
	    out[3] = b11 * det;
	    out[4] = (a22 * a00 - a02 * a20) * det;
	    out[5] = (-a12 * a00 + a02 * a10) * det;
	    out[6] = b21 * det;
	    out[7] = (-a21 * a00 + a01 * a20) * det;
	    out[8] = (a11 * a00 - a01 * a10) * det;
	    return out;
	};

	/**
	 * Calculates the adjugate of a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	mat3.adjoint = function(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2],
	        a10 = a[3], a11 = a[4], a12 = a[5],
	        a20 = a[6], a21 = a[7], a22 = a[8];

	    out[0] = (a11 * a22 - a12 * a21);
	    out[1] = (a02 * a21 - a01 * a22);
	    out[2] = (a01 * a12 - a02 * a11);
	    out[3] = (a12 * a20 - a10 * a22);
	    out[4] = (a00 * a22 - a02 * a20);
	    out[5] = (a02 * a10 - a00 * a12);
	    out[6] = (a10 * a21 - a11 * a20);
	    out[7] = (a01 * a20 - a00 * a21);
	    out[8] = (a00 * a11 - a01 * a10);
	    return out;
	};

	/**
	 * Calculates the determinant of a mat3
	 *
	 * @param {mat3} a the source matrix
	 * @returns {Number} determinant of a
	 */
	mat3.determinant = function (a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2],
	        a10 = a[3], a11 = a[4], a12 = a[5],
	        a20 = a[6], a21 = a[7], a22 = a[8];

	    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
	};

	/**
	 * Multiplies two mat3's
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @returns {mat3} out
	 */
	mat3.multiply = function (out, a, b) {
	    var a00 = a[0], a01 = a[1], a02 = a[2],
	        a10 = a[3], a11 = a[4], a12 = a[5],
	        a20 = a[6], a21 = a[7], a22 = a[8],

	        b00 = b[0], b01 = b[1], b02 = b[2],
	        b10 = b[3], b11 = b[4], b12 = b[5],
	        b20 = b[6], b21 = b[7], b22 = b[8];

	    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
	    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
	    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

	    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
	    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
	    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

	    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
	    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
	    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
	    return out;
	};

	/**
	 * Alias for {@link mat3.multiply}
	 * @function
	 */
	mat3.mul = mat3.multiply;

	/**
	 * Translate a mat3 by the given vector
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to translate
	 * @param {vec2} v vector to translate by
	 * @returns {mat3} out
	 */
	mat3.translate = function(out, a, v) {
	    var a00 = a[0], a01 = a[1], a02 = a[2],
	        a10 = a[3], a11 = a[4], a12 = a[5],
	        a20 = a[6], a21 = a[7], a22 = a[8],
	        x = v[0], y = v[1];

	    out[0] = a00;
	    out[1] = a01;
	    out[2] = a02;

	    out[3] = a10;
	    out[4] = a11;
	    out[5] = a12;

	    out[6] = x * a00 + y * a10 + a20;
	    out[7] = x * a01 + y * a11 + a21;
	    out[8] = x * a02 + y * a12 + a22;
	    return out;
	};

	/**
	 * Rotates a mat3 by the given angle
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat3} out
	 */
	mat3.rotate = function (out, a, rad) {
	    var a00 = a[0], a01 = a[1], a02 = a[2],
	        a10 = a[3], a11 = a[4], a12 = a[5],
	        a20 = a[6], a21 = a[7], a22 = a[8],

	        s = Math.sin(rad),
	        c = Math.cos(rad);

	    out[0] = c * a00 + s * a10;
	    out[1] = c * a01 + s * a11;
	    out[2] = c * a02 + s * a12;

	    out[3] = c * a10 - s * a00;
	    out[4] = c * a11 - s * a01;
	    out[5] = c * a12 - s * a02;

	    out[6] = a20;
	    out[7] = a21;
	    out[8] = a22;
	    return out;
	};

	/**
	 * Scales the mat3 by the dimensions in the given vec2
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to rotate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat3} out
	 **/
	mat3.scale = function(out, a, v) {
	    var x = v[0], y = v[1];

	    out[0] = x * a[0];
	    out[1] = x * a[1];
	    out[2] = x * a[2];

	    out[3] = y * a[3];
	    out[4] = y * a[4];
	    out[5] = y * a[5];

	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    return out;
	};

	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.translate(dest, dest, vec);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {vec2} v Translation vector
	 * @returns {mat3} out
	 */
	mat3.fromTranslation = function(out, v) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 1;
	    out[5] = 0;
	    out[6] = v[0];
	    out[7] = v[1];
	    out[8] = 1;
	    return out;
	}

	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.rotate(dest, dest, rad);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat3} out
	 */
	mat3.fromRotation = function(out, rad) {
	    var s = Math.sin(rad), c = Math.cos(rad);

	    out[0] = c;
	    out[1] = s;
	    out[2] = 0;

	    out[3] = -s;
	    out[4] = c;
	    out[5] = 0;

	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 1;
	    return out;
	}

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.scale(dest, dest, vec);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat3} out
	 */
	mat3.fromScaling = function(out, v) {
	    out[0] = v[0];
	    out[1] = 0;
	    out[2] = 0;

	    out[3] = 0;
	    out[4] = v[1];
	    out[5] = 0;

	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 1;
	    return out;
	}

	/**
	 * Copies the values from a mat2d into a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat2d} a the matrix to copy
	 * @returns {mat3} out
	 **/
	mat3.fromMat2d = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = 0;

	    out[3] = a[2];
	    out[4] = a[3];
	    out[5] = 0;

	    out[6] = a[4];
	    out[7] = a[5];
	    out[8] = 1;
	    return out;
	};

	/**
	* Calculates a 3x3 matrix from the given quaternion
	*
	* @param {mat3} out mat3 receiving operation result
	* @param {quat} q Quaternion to create matrix from
	*
	* @returns {mat3} out
	*/
	mat3.fromQuat = function (out, q) {
	    var x = q[0], y = q[1], z = q[2], w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,

	        xx = x * x2,
	        yx = y * x2,
	        yy = y * y2,
	        zx = z * x2,
	        zy = z * y2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;

	    out[0] = 1 - yy - zz;
	    out[3] = yx - wz;
	    out[6] = zx + wy;

	    out[1] = yx + wz;
	    out[4] = 1 - xx - zz;
	    out[7] = zy - wx;

	    out[2] = zx - wy;
	    out[5] = zy + wx;
	    out[8] = 1 - xx - yy;

	    return out;
	};

	/**
	* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
	*
	* @param {mat3} out mat3 receiving operation result
	* @param {mat4} a Mat4 to derive the normal matrix from
	*
	* @returns {mat3} out
	*/
	mat3.normalFromMat4 = function (out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32,

	        // Calculate the determinant
	        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	    if (!det) { 
	        return null; 
	    }
	    det = 1.0 / det;

	    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

	    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

	    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

	    return out;
	};

	/**
	 * Returns a string representation of a mat3
	 *
	 * @param {mat3} mat matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	mat3.str = function (a) {
	    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
	                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
	                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
	};

	/**
	 * Returns Frobenius norm of a mat3
	 *
	 * @param {mat3} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	mat3.frob = function (a) {
	    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
	};

	/**
	 * Adds two mat3's
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @returns {mat3} out
	 */
	mat3.add = function(out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    out[2] = a[2] + b[2];
	    out[3] = a[3] + b[3];
	    out[4] = a[4] + b[4];
	    out[5] = a[5] + b[5];
	    out[6] = a[6] + b[6];
	    out[7] = a[7] + b[7];
	    out[8] = a[8] + b[8];
	    return out;
	};

	/**
	 * Subtracts matrix b from matrix a
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @returns {mat3} out
	 */
	mat3.subtract = function(out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    out[2] = a[2] - b[2];
	    out[3] = a[3] - b[3];
	    out[4] = a[4] - b[4];
	    out[5] = a[5] - b[5];
	    out[6] = a[6] - b[6];
	    out[7] = a[7] - b[7];
	    out[8] = a[8] - b[8];
	    return out;
	};

	/**
	 * Alias for {@link mat3.subtract}
	 * @function
	 */
	mat3.sub = mat3.subtract;

	/**
	 * Multiply each element of the matrix by a scalar.
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to scale
	 * @param {Number} b amount to scale the matrix's elements by
	 * @returns {mat3} out
	 */
	mat3.multiplyScalar = function(out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    out[2] = a[2] * b;
	    out[3] = a[3] * b;
	    out[4] = a[4] * b;
	    out[5] = a[5] * b;
	    out[6] = a[6] * b;
	    out[7] = a[7] * b;
	    out[8] = a[8] * b;
	    return out;
	};

	/**
	 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
	 *
	 * @param {mat3} out the receiving vector
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @param {Number} scale the amount to scale b's elements by before adding
	 * @returns {mat3} out
	 */
	mat3.multiplyScalarAndAdd = function(out, a, b, scale) {
	    out[0] = a[0] + (b[0] * scale);
	    out[1] = a[1] + (b[1] * scale);
	    out[2] = a[2] + (b[2] * scale);
	    out[3] = a[3] + (b[3] * scale);
	    out[4] = a[4] + (b[4] * scale);
	    out[5] = a[5] + (b[5] * scale);
	    out[6] = a[6] + (b[6] * scale);
	    out[7] = a[7] + (b[7] * scale);
	    out[8] = a[8] + (b[8] * scale);
	    return out;
	};

	/*
	 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {mat3} a The first matrix.
	 * @param {mat3} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	mat3.exactEquals = function (a, b) {
	    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && 
	           a[3] === b[3] && a[4] === b[4] && a[5] === b[5] &&
	           a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
	};

	/**
	 * Returns whether or not the matrices have approximately the same elements in the same position.
	 *
	 * @param {mat3} a The first matrix.
	 * @param {mat3} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	mat3.equals = function (a, b) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8];
	    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = a[6], b7 = b[7], b8 = b[8];
	    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
	            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
	            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
	            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
	            Math.abs(a4 - b4) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
	            Math.abs(a5 - b5) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
	            Math.abs(a6 - b6) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
	            Math.abs(a7 - b7) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
	            Math.abs(a8 - b8) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a8), Math.abs(b8)));
	};


	module.exports = mat3;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(13);

	/**
	 * @class 4x4 Matrix
	 * @name mat4
	 */
	var mat4 = {
	  scalar: {},
	  SIMD: {},
	};

	/**
	 * Creates a new identity mat4
	 *
	 * @returns {mat4} a new 4x4 matrix
	 */
	mat4.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(16);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

	/**
	 * Creates a new mat4 initialized with values from an existing matrix
	 *
	 * @param {mat4} a matrix to clone
	 * @returns {mat4} a new 4x4 matrix
	 */
	mat4.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(16);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

	/**
	 * Copy the values from one mat4 to another
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

	/**
	 * Create a new mat4 with the given values
	 *
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m02 Component in column 0, row 2 position (index 2)
	 * @param {Number} m03 Component in column 0, row 3 position (index 3)
	 * @param {Number} m10 Component in column 1, row 0 position (index 4)
	 * @param {Number} m11 Component in column 1, row 1 position (index 5)
	 * @param {Number} m12 Component in column 1, row 2 position (index 6)
	 * @param {Number} m13 Component in column 1, row 3 position (index 7)
	 * @param {Number} m20 Component in column 2, row 0 position (index 8)
	 * @param {Number} m21 Component in column 2, row 1 position (index 9)
	 * @param {Number} m22 Component in column 2, row 2 position (index 10)
	 * @param {Number} m23 Component in column 2, row 3 position (index 11)
	 * @param {Number} m30 Component in column 3, row 0 position (index 12)
	 * @param {Number} m31 Component in column 3, row 1 position (index 13)
	 * @param {Number} m32 Component in column 3, row 2 position (index 14)
	 * @param {Number} m33 Component in column 3, row 3 position (index 15)
	 * @returns {mat4} A new mat4
	 */
	mat4.fromValues = function(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
	    var out = new glMatrix.ARRAY_TYPE(16);
	    out[0] = m00;
	    out[1] = m01;
	    out[2] = m02;
	    out[3] = m03;
	    out[4] = m10;
	    out[5] = m11;
	    out[6] = m12;
	    out[7] = m13;
	    out[8] = m20;
	    out[9] = m21;
	    out[10] = m22;
	    out[11] = m23;
	    out[12] = m30;
	    out[13] = m31;
	    out[14] = m32;
	    out[15] = m33;
	    return out;
	};

	/**
	 * Set the components of a mat4 to the given values
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m02 Component in column 0, row 2 position (index 2)
	 * @param {Number} m03 Component in column 0, row 3 position (index 3)
	 * @param {Number} m10 Component in column 1, row 0 position (index 4)
	 * @param {Number} m11 Component in column 1, row 1 position (index 5)
	 * @param {Number} m12 Component in column 1, row 2 position (index 6)
	 * @param {Number} m13 Component in column 1, row 3 position (index 7)
	 * @param {Number} m20 Component in column 2, row 0 position (index 8)
	 * @param {Number} m21 Component in column 2, row 1 position (index 9)
	 * @param {Number} m22 Component in column 2, row 2 position (index 10)
	 * @param {Number} m23 Component in column 2, row 3 position (index 11)
	 * @param {Number} m30 Component in column 3, row 0 position (index 12)
	 * @param {Number} m31 Component in column 3, row 1 position (index 13)
	 * @param {Number} m32 Component in column 3, row 2 position (index 14)
	 * @param {Number} m33 Component in column 3, row 3 position (index 15)
	 * @returns {mat4} out
	 */
	mat4.set = function(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
	    out[0] = m00;
	    out[1] = m01;
	    out[2] = m02;
	    out[3] = m03;
	    out[4] = m10;
	    out[5] = m11;
	    out[6] = m12;
	    out[7] = m13;
	    out[8] = m20;
	    out[9] = m21;
	    out[10] = m22;
	    out[11] = m23;
	    out[12] = m30;
	    out[13] = m31;
	    out[14] = m32;
	    out[15] = m33;
	    return out;
	};


	/**
	 * Set a mat4 to the identity matrix
	 *
	 * @param {mat4} out the receiving matrix
	 * @returns {mat4} out
	 */
	mat4.identity = function(out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

	/**
	 * Transpose the values of a mat4 not using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.scalar.transpose = function(out, a) {
	    // If we are transposing ourselves we can skip a few steps but have to cache some values
	    if (out === a) {
	        var a01 = a[1], a02 = a[2], a03 = a[3],
	            a12 = a[6], a13 = a[7],
	            a23 = a[11];

	        out[1] = a[4];
	        out[2] = a[8];
	        out[3] = a[12];
	        out[4] = a01;
	        out[6] = a[9];
	        out[7] = a[13];
	        out[8] = a02;
	        out[9] = a12;
	        out[11] = a[14];
	        out[12] = a03;
	        out[13] = a13;
	        out[14] = a23;
	    } else {
	        out[0] = a[0];
	        out[1] = a[4];
	        out[2] = a[8];
	        out[3] = a[12];
	        out[4] = a[1];
	        out[5] = a[5];
	        out[6] = a[9];
	        out[7] = a[13];
	        out[8] = a[2];
	        out[9] = a[6];
	        out[10] = a[10];
	        out[11] = a[14];
	        out[12] = a[3];
	        out[13] = a[7];
	        out[14] = a[11];
	        out[15] = a[15];
	    }

	    return out;
	};

	/**
	 * Transpose the values of a mat4 using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.SIMD.transpose = function(out, a) {
	    var a0, a1, a2, a3,
	        tmp01, tmp23,
	        out0, out1, out2, out3;

	    a0 = SIMD.Float32x4.load(a, 0);
	    a1 = SIMD.Float32x4.load(a, 4);
	    a2 = SIMD.Float32x4.load(a, 8);
	    a3 = SIMD.Float32x4.load(a, 12);

	    tmp01 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
	    tmp23 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
	    out0  = SIMD.Float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
	    out1  = SIMD.Float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);
	    SIMD.Float32x4.store(out, 0,  out0);
	    SIMD.Float32x4.store(out, 4,  out1);

	    tmp01 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
	    tmp23 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
	    out2  = SIMD.Float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
	    out3  = SIMD.Float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);
	    SIMD.Float32x4.store(out, 8,  out2);
	    SIMD.Float32x4.store(out, 12, out3);

	    return out;
	};

	/**
	 * Transpse a mat4 using SIMD if available and enabled
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.transpose = glMatrix.USE_SIMD ? mat4.SIMD.transpose : mat4.scalar.transpose;

	/**
	 * Inverts a mat4 not using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.scalar.invert = function(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32,

	        // Calculate the determinant
	        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	    if (!det) {
	        return null;
	    }
	    det = 1.0 / det;

	    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
	    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
	    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
	    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
	    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
	    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
	    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

	    return out;
	};

	/**
	 * Inverts a mat4 using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.SIMD.invert = function(out, a) {
	  var row0, row1, row2, row3,
	      tmp1,
	      minor0, minor1, minor2, minor3,
	      det,
	      a0 = SIMD.Float32x4.load(a, 0),
	      a1 = SIMD.Float32x4.load(a, 4),
	      a2 = SIMD.Float32x4.load(a, 8),
	      a3 = SIMD.Float32x4.load(a, 12);

	  // Compute matrix adjugate
	  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
	  row1 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
	  row0 = SIMD.Float32x4.shuffle(tmp1, row1, 0, 2, 4, 6);
	  row1 = SIMD.Float32x4.shuffle(row1, tmp1, 1, 3, 5, 7);
	  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
	  row3 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
	  row2 = SIMD.Float32x4.shuffle(tmp1, row3, 0, 2, 4, 6);
	  row3 = SIMD.Float32x4.shuffle(row3, tmp1, 1, 3, 5, 7);

	  tmp1   = SIMD.Float32x4.mul(row2, row3);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
	  minor0 = SIMD.Float32x4.mul(row1, tmp1);
	  minor1 = SIMD.Float32x4.mul(row0, tmp1);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
	  minor0 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row1, tmp1), minor0);
	  minor1 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor1);
	  minor1 = SIMD.Float32x4.swizzle(minor1, 2, 3, 0, 1);

	  tmp1   = SIMD.Float32x4.mul(row1, row2);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
	  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor0);
	  minor3 = SIMD.Float32x4.mul(row0, tmp1);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
	  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row3, tmp1));
	  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor3);
	  minor3 = SIMD.Float32x4.swizzle(minor3, 2, 3, 0, 1);

	  tmp1   = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(row1, 2, 3, 0, 1), row3);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
	  row2   = SIMD.Float32x4.swizzle(row2, 2, 3, 0, 1);
	  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor0);
	  minor2 = SIMD.Float32x4.mul(row0, tmp1);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
	  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row2, tmp1));
	  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor2);
	  minor2 = SIMD.Float32x4.swizzle(minor2, 2, 3, 0, 1);

	  tmp1   = SIMD.Float32x4.mul(row0, row1);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
	  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor2);
	  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row2, tmp1), minor3);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
	  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row3, tmp1), minor2);
	  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row2, tmp1));

	  tmp1   = SIMD.Float32x4.mul(row0, row3);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
	  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row2, tmp1));
	  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor2);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
	  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor1);
	  minor2 = SIMD.Float32x4.sub(minor2, SIMD.Float32x4.mul(row1, tmp1));

	  tmp1   = SIMD.Float32x4.mul(row0, row2);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
	  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor1);
	  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row1, tmp1));
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
	  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row3, tmp1));
	  minor3 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor3);

	  // Compute matrix determinant
	  det   = SIMD.Float32x4.mul(row0, minor0);
	  det   = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(det, 2, 3, 0, 1), det);
	  det   = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(det, 1, 0, 3, 2), det);
	  tmp1  = SIMD.Float32x4.reciprocalApproximation(det);
	  det   = SIMD.Float32x4.sub(
	               SIMD.Float32x4.add(tmp1, tmp1),
	               SIMD.Float32x4.mul(det, SIMD.Float32x4.mul(tmp1, tmp1)));
	  det   = SIMD.Float32x4.swizzle(det, 0, 0, 0, 0);
	  if (!det) {
	      return null;
	  }

	  // Compute matrix inverse
	  SIMD.Float32x4.store(out, 0,  SIMD.Float32x4.mul(det, minor0));
	  SIMD.Float32x4.store(out, 4,  SIMD.Float32x4.mul(det, minor1));
	  SIMD.Float32x4.store(out, 8,  SIMD.Float32x4.mul(det, minor2));
	  SIMD.Float32x4.store(out, 12, SIMD.Float32x4.mul(det, minor3));
	  return out;
	}

	/**
	 * Inverts a mat4 using SIMD if available and enabled
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.invert = glMatrix.USE_SIMD ? mat4.SIMD.invert : mat4.scalar.invert;

	/**
	 * Calculates the adjugate of a mat4 not using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.scalar.adjoint = function(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

	    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
	    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
	    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
	    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
	    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
	    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
	    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
	    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
	    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
	    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
	    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
	    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
	    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
	    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
	    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
	    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
	    return out;
	};

	/**
	 * Calculates the adjugate of a mat4 using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.SIMD.adjoint = function(out, a) {
	  var a0, a1, a2, a3;
	  var row0, row1, row2, row3;
	  var tmp1;
	  var minor0, minor1, minor2, minor3;

	  var a0 = SIMD.Float32x4.load(a, 0);
	  var a1 = SIMD.Float32x4.load(a, 4);
	  var a2 = SIMD.Float32x4.load(a, 8);
	  var a3 = SIMD.Float32x4.load(a, 12);

	  // Transpose the source matrix.  Sort of.  Not a true transpose operation
	  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
	  row1 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
	  row0 = SIMD.Float32x4.shuffle(tmp1, row1, 0, 2, 4, 6);
	  row1 = SIMD.Float32x4.shuffle(row1, tmp1, 1, 3, 5, 7);

	  tmp1 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
	  row3 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
	  row2 = SIMD.Float32x4.shuffle(tmp1, row3, 0, 2, 4, 6);
	  row3 = SIMD.Float32x4.shuffle(row3, tmp1, 1, 3, 5, 7);

	  tmp1   = SIMD.Float32x4.mul(row2, row3);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
	  minor0 = SIMD.Float32x4.mul(row1, tmp1);
	  minor1 = SIMD.Float32x4.mul(row0, tmp1);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
	  minor0 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row1, tmp1), minor0);
	  minor1 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor1);
	  minor1 = SIMD.Float32x4.swizzle(minor1, 2, 3, 0, 1);

	  tmp1   = SIMD.Float32x4.mul(row1, row2);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
	  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor0);
	  minor3 = SIMD.Float32x4.mul(row0, tmp1);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
	  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row3, tmp1));
	  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor3);
	  minor3 = SIMD.Float32x4.swizzle(minor3, 2, 3, 0, 1);

	  tmp1   = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(row1, 2, 3, 0, 1), row3);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
	  row2   = SIMD.Float32x4.swizzle(row2, 2, 3, 0, 1);
	  minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor0);
	  minor2 = SIMD.Float32x4.mul(row0, tmp1);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
	  minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row2, tmp1));
	  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor2);
	  minor2 = SIMD.Float32x4.swizzle(minor2, 2, 3, 0, 1);

	  tmp1   = SIMD.Float32x4.mul(row0, row1);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
	  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor2);
	  minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row2, tmp1), minor3);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
	  minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row3, tmp1), minor2);
	  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row2, tmp1));

	  tmp1   = SIMD.Float32x4.mul(row0, row3);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
	  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row2, tmp1));
	  minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor2);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
	  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor1);
	  minor2 = SIMD.Float32x4.sub(minor2, SIMD.Float32x4.mul(row1, tmp1));

	  tmp1   = SIMD.Float32x4.mul(row0, row2);
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
	  minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor1);
	  minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row1, tmp1));
	  tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
	  minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row3, tmp1));
	  minor3 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor3);

	  SIMD.Float32x4.store(out, 0,  minor0);
	  SIMD.Float32x4.store(out, 4,  minor1);
	  SIMD.Float32x4.store(out, 8,  minor2);
	  SIMD.Float32x4.store(out, 12, minor3);
	  return out;
	};

	/**
	 * Calculates the adjugate of a mat4 using SIMD if available and enabled
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	 mat4.adjoint = glMatrix.USE_SIMD ? mat4.SIMD.adjoint : mat4.scalar.adjoint;

	/**
	 * Calculates the determinant of a mat4
	 *
	 * @param {mat4} a the source matrix
	 * @returns {Number} determinant of a
	 */
	mat4.determinant = function (a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32;

	    // Calculate the determinant
	    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	};

	/**
	 * Multiplies two mat4's explicitly using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand, must be a Float32Array
	 * @param {mat4} b the second operand, must be a Float32Array
	 * @returns {mat4} out
	 */
	mat4.SIMD.multiply = function (out, a, b) {
	    var a0 = SIMD.Float32x4.load(a, 0);
	    var a1 = SIMD.Float32x4.load(a, 4);
	    var a2 = SIMD.Float32x4.load(a, 8);
	    var a3 = SIMD.Float32x4.load(a, 12);

	    var b0 = SIMD.Float32x4.load(b, 0);
	    var out0 = SIMD.Float32x4.add(
	                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 0, 0, 0, 0), a0),
	                   SIMD.Float32x4.add(
	                       SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 1, 1, 1, 1), a1),
	                       SIMD.Float32x4.add(
	                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 2, 2, 2, 2), a2),
	                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 3, 3, 3, 3), a3))));
	    SIMD.Float32x4.store(out, 0, out0);

	    var b1 = SIMD.Float32x4.load(b, 4);
	    var out1 = SIMD.Float32x4.add(
	                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 0, 0, 0, 0), a0),
	                   SIMD.Float32x4.add(
	                       SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 1, 1, 1, 1), a1),
	                       SIMD.Float32x4.add(
	                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 2, 2, 2, 2), a2),
	                           SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 3, 3, 3, 3), a3))));
	    SIMD.Float32x4.store(out, 4, out1);

	    var b2 = SIMD.Float32x4.load(b, 8);
	    var out2 = SIMD.Float32x4.add(
	                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 0, 0, 0, 0), a0),
	                   SIMD.Float32x4.add(
	                       SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 1, 1, 1, 1), a1),
	                       SIMD.Float32x4.add(
	                               SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 2, 2, 2, 2), a2),
	                               SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 3, 3, 3, 3), a3))));
	    SIMD.Float32x4.store(out, 8, out2);

	    var b3 = SIMD.Float32x4.load(b, 12);
	    var out3 = SIMD.Float32x4.add(
	                   SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 0, 0, 0, 0), a0),
	                   SIMD.Float32x4.add(
	                        SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 1, 1, 1, 1), a1),
	                        SIMD.Float32x4.add(
	                            SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 2, 2, 2, 2), a2),
	                            SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 3, 3, 3, 3), a3))));
	    SIMD.Float32x4.store(out, 12, out3);

	    return out;
	};

	/**
	 * Multiplies two mat4's explicitly not using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	mat4.scalar.multiply = function (out, a, b) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

	    // Cache only the current line of the second matrix
	    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
	    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

	    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
	    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

	    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
	    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

	    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
	    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
	    return out;
	};

	/**
	 * Multiplies two mat4's using SIMD if available and enabled
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	mat4.multiply = glMatrix.USE_SIMD ? mat4.SIMD.multiply : mat4.scalar.multiply;

	/**
	 * Alias for {@link mat4.multiply}
	 * @function
	 */
	mat4.mul = mat4.multiply;

	/**
	 * Translate a mat4 by the given vector not using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to translate
	 * @param {vec3} v vector to translate by
	 * @returns {mat4} out
	 */
	mat4.scalar.translate = function (out, a, v) {
	    var x = v[0], y = v[1], z = v[2],
	        a00, a01, a02, a03,
	        a10, a11, a12, a13,
	        a20, a21, a22, a23;

	    if (a === out) {
	        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
	        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
	        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
	        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
	    } else {
	        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
	        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
	        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

	        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
	        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
	        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

	        out[12] = a00 * x + a10 * y + a20 * z + a[12];
	        out[13] = a01 * x + a11 * y + a21 * z + a[13];
	        out[14] = a02 * x + a12 * y + a22 * z + a[14];
	        out[15] = a03 * x + a13 * y + a23 * z + a[15];
	    }

	    return out;
	};

	/**
	 * Translates a mat4 by the given vector using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to translate
	 * @param {vec3} v vector to translate by
	 * @returns {mat4} out
	 */
	mat4.SIMD.translate = function (out, a, v) {
	    var a0 = SIMD.Float32x4.load(a, 0),
	        a1 = SIMD.Float32x4.load(a, 4),
	        a2 = SIMD.Float32x4.load(a, 8),
	        a3 = SIMD.Float32x4.load(a, 12),
	        vec = SIMD.Float32x4(v[0], v[1], v[2] , 0);

	    if (a !== out) {
	        out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; out[3] = a[3];
	        out[4] = a[4]; out[5] = a[5]; out[6] = a[6]; out[7] = a[7];
	        out[8] = a[8]; out[9] = a[9]; out[10] = a[10]; out[11] = a[11];
	    }

	    a0 = SIMD.Float32x4.mul(a0, SIMD.Float32x4.swizzle(vec, 0, 0, 0, 0));
	    a1 = SIMD.Float32x4.mul(a1, SIMD.Float32x4.swizzle(vec, 1, 1, 1, 1));
	    a2 = SIMD.Float32x4.mul(a2, SIMD.Float32x4.swizzle(vec, 2, 2, 2, 2));

	    var t0 = SIMD.Float32x4.add(a0, SIMD.Float32x4.add(a1, SIMD.Float32x4.add(a2, a3)));
	    SIMD.Float32x4.store(out, 12, t0);

	    return out;
	};

	/**
	 * Translates a mat4 by the given vector using SIMD if available and enabled
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to translate
	 * @param {vec3} v vector to translate by
	 * @returns {mat4} out
	 */
	mat4.translate = glMatrix.USE_SIMD ? mat4.SIMD.translate : mat4.scalar.translate;

	/**
	 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to scale
	 * @param {vec3} v the vec3 to scale the matrix by
	 * @returns {mat4} out
	 **/
	mat4.scalar.scale = function(out, a, v) {
	    var x = v[0], y = v[1], z = v[2];

	    out[0] = a[0] * x;
	    out[1] = a[1] * x;
	    out[2] = a[2] * x;
	    out[3] = a[3] * x;
	    out[4] = a[4] * y;
	    out[5] = a[5] * y;
	    out[6] = a[6] * y;
	    out[7] = a[7] * y;
	    out[8] = a[8] * z;
	    out[9] = a[9] * z;
	    out[10] = a[10] * z;
	    out[11] = a[11] * z;
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

	/**
	 * Scales the mat4 by the dimensions in the given vec3 using vectorization
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to scale
	 * @param {vec3} v the vec3 to scale the matrix by
	 * @returns {mat4} out
	 **/
	mat4.SIMD.scale = function(out, a, v) {
	    var a0, a1, a2;
	    var vec = SIMD.Float32x4(v[0], v[1], v[2], 0);

	    a0 = SIMD.Float32x4.load(a, 0);
	    SIMD.Float32x4.store(
	        out, 0, SIMD.Float32x4.mul(a0, SIMD.Float32x4.swizzle(vec, 0, 0, 0, 0)));

	    a1 = SIMD.Float32x4.load(a, 4);
	    SIMD.Float32x4.store(
	        out, 4, SIMD.Float32x4.mul(a1, SIMD.Float32x4.swizzle(vec, 1, 1, 1, 1)));

	    a2 = SIMD.Float32x4.load(a, 8);
	    SIMD.Float32x4.store(
	        out, 8, SIMD.Float32x4.mul(a2, SIMD.Float32x4.swizzle(vec, 2, 2, 2, 2)));

	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

	/**
	 * Scales the mat4 by the dimensions in the given vec3 using SIMD if available and enabled
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to scale
	 * @param {vec3} v the vec3 to scale the matrix by
	 * @returns {mat4} out
	 */
	mat4.scale = glMatrix.USE_SIMD ? mat4.SIMD.scale : mat4.scalar.scale;

	/**
	 * Rotates a mat4 by the given angle around the given axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @param {vec3} axis the axis to rotate around
	 * @returns {mat4} out
	 */
	mat4.rotate = function (out, a, rad, axis) {
	    var x = axis[0], y = axis[1], z = axis[2],
	        len = Math.sqrt(x * x + y * y + z * z),
	        s, c, t,
	        a00, a01, a02, a03,
	        a10, a11, a12, a13,
	        a20, a21, a22, a23,
	        b00, b01, b02,
	        b10, b11, b12,
	        b20, b21, b22;

	    if (Math.abs(len) < glMatrix.EPSILON) { return null; }

	    len = 1 / len;
	    x *= len;
	    y *= len;
	    z *= len;

	    s = Math.sin(rad);
	    c = Math.cos(rad);
	    t = 1 - c;

	    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
	    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
	    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

	    // Construct the elements of the rotation matrix
	    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
	    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
	    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

	    // Perform rotation-specific matrix multiplication
	    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
	    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
	    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
	    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
	    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
	    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
	    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
	    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
	    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
	    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
	    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
	    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

	    if (a !== out) { // If the source and destination differ, copy the unchanged last row
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }
	    return out;
	};

	/**
	 * Rotates a matrix by the given angle around the X axis not using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.scalar.rotateX = function (out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11];

	    if (a !== out) { // If the source and destination differ, copy the unchanged rows
	        out[0]  = a[0];
	        out[1]  = a[1];
	        out[2]  = a[2];
	        out[3]  = a[3];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    out[4] = a10 * c + a20 * s;
	    out[5] = a11 * c + a21 * s;
	    out[6] = a12 * c + a22 * s;
	    out[7] = a13 * c + a23 * s;
	    out[8] = a20 * c - a10 * s;
	    out[9] = a21 * c - a11 * s;
	    out[10] = a22 * c - a12 * s;
	    out[11] = a23 * c - a13 * s;
	    return out;
	};

	/**
	 * Rotates a matrix by the given angle around the X axis using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.SIMD.rotateX = function (out, a, rad) {
	    var s = SIMD.Float32x4.splat(Math.sin(rad)),
	        c = SIMD.Float32x4.splat(Math.cos(rad));

	    if (a !== out) { // If the source and destination differ, copy the unchanged rows
	      out[0]  = a[0];
	      out[1]  = a[1];
	      out[2]  = a[2];
	      out[3]  = a[3];
	      out[12] = a[12];
	      out[13] = a[13];
	      out[14] = a[14];
	      out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    var a_1 = SIMD.Float32x4.load(a, 4);
	    var a_2 = SIMD.Float32x4.load(a, 8);
	    SIMD.Float32x4.store(out, 4,
	                         SIMD.Float32x4.add(SIMD.Float32x4.mul(a_1, c), SIMD.Float32x4.mul(a_2, s)));
	    SIMD.Float32x4.store(out, 8,
	                         SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_2, c), SIMD.Float32x4.mul(a_1, s)));
	    return out;
	};

	/**
	 * Rotates a matrix by the given angle around the X axis using SIMD if availabe and enabled
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.rotateX = glMatrix.USE_SIMD ? mat4.SIMD.rotateX : mat4.scalar.rotateX;

	/**
	 * Rotates a matrix by the given angle around the Y axis not using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.scalar.rotateY = function (out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11];

	    if (a !== out) { // If the source and destination differ, copy the unchanged rows
	        out[4]  = a[4];
	        out[5]  = a[5];
	        out[6]  = a[6];
	        out[7]  = a[7];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    out[0] = a00 * c - a20 * s;
	    out[1] = a01 * c - a21 * s;
	    out[2] = a02 * c - a22 * s;
	    out[3] = a03 * c - a23 * s;
	    out[8] = a00 * s + a20 * c;
	    out[9] = a01 * s + a21 * c;
	    out[10] = a02 * s + a22 * c;
	    out[11] = a03 * s + a23 * c;
	    return out;
	};

	/**
	 * Rotates a matrix by the given angle around the Y axis using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.SIMD.rotateY = function (out, a, rad) {
	    var s = SIMD.Float32x4.splat(Math.sin(rad)),
	        c = SIMD.Float32x4.splat(Math.cos(rad));

	    if (a !== out) { // If the source and destination differ, copy the unchanged rows
	        out[4]  = a[4];
	        out[5]  = a[5];
	        out[6]  = a[6];
	        out[7]  = a[7];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    var a_0 = SIMD.Float32x4.load(a, 0);
	    var a_2 = SIMD.Float32x4.load(a, 8);
	    SIMD.Float32x4.store(out, 0,
	                         SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_0, c), SIMD.Float32x4.mul(a_2, s)));
	    SIMD.Float32x4.store(out, 8,
	                         SIMD.Float32x4.add(SIMD.Float32x4.mul(a_0, s), SIMD.Float32x4.mul(a_2, c)));
	    return out;
	};

	/**
	 * Rotates a matrix by the given angle around the Y axis if SIMD available and enabled
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	 mat4.rotateY = glMatrix.USE_SIMD ? mat4.SIMD.rotateY : mat4.scalar.rotateY;

	/**
	 * Rotates a matrix by the given angle around the Z axis not using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.scalar.rotateZ = function (out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7];

	    if (a !== out) { // If the source and destination differ, copy the unchanged last row
	        out[8]  = a[8];
	        out[9]  = a[9];
	        out[10] = a[10];
	        out[11] = a[11];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    out[0] = a00 * c + a10 * s;
	    out[1] = a01 * c + a11 * s;
	    out[2] = a02 * c + a12 * s;
	    out[3] = a03 * c + a13 * s;
	    out[4] = a10 * c - a00 * s;
	    out[5] = a11 * c - a01 * s;
	    out[6] = a12 * c - a02 * s;
	    out[7] = a13 * c - a03 * s;
	    return out;
	};

	/**
	 * Rotates a matrix by the given angle around the Z axis using SIMD
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.SIMD.rotateZ = function (out, a, rad) {
	    var s = SIMD.Float32x4.splat(Math.sin(rad)),
	        c = SIMD.Float32x4.splat(Math.cos(rad));

	    if (a !== out) { // If the source and destination differ, copy the unchanged last row
	        out[8]  = a[8];
	        out[9]  = a[9];
	        out[10] = a[10];
	        out[11] = a[11];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    var a_0 = SIMD.Float32x4.load(a, 0);
	    var a_1 = SIMD.Float32x4.load(a, 4);
	    SIMD.Float32x4.store(out, 0,
	                         SIMD.Float32x4.add(SIMD.Float32x4.mul(a_0, c), SIMD.Float32x4.mul(a_1, s)));
	    SIMD.Float32x4.store(out, 4,
	                         SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_1, c), SIMD.Float32x4.mul(a_0, s)));
	    return out;
	};

	/**
	 * Rotates a matrix by the given angle around the Z axis if SIMD available and enabled
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	 mat4.rotateZ = glMatrix.USE_SIMD ? mat4.SIMD.rotateZ : mat4.scalar.rotateZ;

	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, dest, vec);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {vec3} v Translation vector
	 * @returns {mat4} out
	 */
	mat4.fromTranslation = function(out, v) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = v[0];
	    out[13] = v[1];
	    out[14] = v[2];
	    out[15] = 1;
	    return out;
	}

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.scale(dest, dest, vec);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {vec3} v Scaling vector
	 * @returns {mat4} out
	 */
	mat4.fromScaling = function(out, v) {
	    out[0] = v[0];
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = v[1];
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = v[2];
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	}

	/**
	 * Creates a matrix from a given angle around a given axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotate(dest, dest, rad, axis);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @param {vec3} axis the axis to rotate around
	 * @returns {mat4} out
	 */
	mat4.fromRotation = function(out, rad, axis) {
	    var x = axis[0], y = axis[1], z = axis[2],
	        len = Math.sqrt(x * x + y * y + z * z),
	        s, c, t;

	    if (Math.abs(len) < glMatrix.EPSILON) { return null; }

	    len = 1 / len;
	    x *= len;
	    y *= len;
	    z *= len;

	    s = Math.sin(rad);
	    c = Math.cos(rad);
	    t = 1 - c;

	    // Perform rotation-specific matrix multiplication
	    out[0] = x * x * t + c;
	    out[1] = y * x * t + z * s;
	    out[2] = z * x * t - y * s;
	    out[3] = 0;
	    out[4] = x * y * t - z * s;
	    out[5] = y * y * t + c;
	    out[6] = z * y * t + x * s;
	    out[7] = 0;
	    out[8] = x * z * t + y * s;
	    out[9] = y * z * t - x * s;
	    out[10] = z * z * t + c;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	}

	/**
	 * Creates a matrix from the given angle around the X axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateX(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.fromXRotation = function(out, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad);

	    // Perform axis-specific matrix multiplication
	    out[0]  = 1;
	    out[1]  = 0;
	    out[2]  = 0;
	    out[3]  = 0;
	    out[4] = 0;
	    out[5] = c;
	    out[6] = s;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = -s;
	    out[10] = c;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	}

	/**
	 * Creates a matrix from the given angle around the Y axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateY(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.fromYRotation = function(out, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad);

	    // Perform axis-specific matrix multiplication
	    out[0]  = c;
	    out[1]  = 0;
	    out[2]  = -s;
	    out[3]  = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = s;
	    out[9] = 0;
	    out[10] = c;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	}

	/**
	 * Creates a matrix from the given angle around the Z axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateZ(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.fromZRotation = function(out, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad);

	    // Perform axis-specific matrix multiplication
	    out[0]  = c;
	    out[1]  = s;
	    out[2]  = 0;
	    out[3]  = 0;
	    out[4] = -s;
	    out[5] = c;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	}

	/**
	 * Creates a matrix from a quaternion rotation and vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     var quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @returns {mat4} out
	 */
	mat4.fromRotationTranslation = function (out, q, v) {
	    // Quaternion math
	    var x = q[0], y = q[1], z = q[2], w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,

	        xx = x * x2,
	        xy = x * y2,
	        xz = x * z2,
	        yy = y * y2,
	        yz = y * z2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;

	    out[0] = 1 - (yy + zz);
	    out[1] = xy + wz;
	    out[2] = xz - wy;
	    out[3] = 0;
	    out[4] = xy - wz;
	    out[5] = 1 - (xx + zz);
	    out[6] = yz + wx;
	    out[7] = 0;
	    out[8] = xz + wy;
	    out[9] = yz - wx;
	    out[10] = 1 - (xx + yy);
	    out[11] = 0;
	    out[12] = v[0];
	    out[13] = v[1];
	    out[14] = v[2];
	    out[15] = 1;

	    return out;
	};

	/**
	 * Returns the translation vector component of a transformation
	 *  matrix. If a matrix is built with fromRotationTranslation,
	 *  the returned vector will be the same as the translation vector
	 *  originally supplied.
	 * @param  {vec3} out Vector to receive translation component
	 * @param  {mat4} mat Matrix to be decomposed (input)
	 * @return {vec3} out
	 */
	mat4.getTranslation = function (out, mat) {
	  out[0] = mat[12];
	  out[1] = mat[13];
	  out[2] = mat[14];

	  return out;
	};

	/**
	 * Returns a quaternion representing the rotational component
	 *  of a transformation matrix. If a matrix is built with
	 *  fromRotationTranslation, the returned quaternion will be the
	 *  same as the quaternion originally supplied.
	 * @param {quat} out Quaternion to receive the rotation component
	 * @param {mat4} mat Matrix to be decomposed (input)
	 * @return {quat} out
	 */
	mat4.getRotation = function (out, mat) {
	  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
	  var trace = mat[0] + mat[5] + mat[10];
	  var S = 0;

	  if (trace > 0) { 
	    S = Math.sqrt(trace + 1.0) * 2;
	    out[3] = 0.25 * S;
	    out[0] = (mat[6] - mat[9]) / S;
	    out[1] = (mat[8] - mat[2]) / S; 
	    out[2] = (mat[1] - mat[4]) / S; 
	  } else if ((mat[0] > mat[5])&(mat[0] > mat[10])) { 
	    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
	    out[3] = (mat[6] - mat[9]) / S;
	    out[0] = 0.25 * S;
	    out[1] = (mat[1] + mat[4]) / S; 
	    out[2] = (mat[8] + mat[2]) / S; 
	  } else if (mat[5] > mat[10]) { 
	    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
	    out[3] = (mat[8] - mat[2]) / S;
	    out[0] = (mat[1] + mat[4]) / S; 
	    out[1] = 0.25 * S;
	    out[2] = (mat[6] + mat[9]) / S; 
	  } else { 
	    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
	    out[3] = (mat[1] - mat[4]) / S;
	    out[0] = (mat[8] + mat[2]) / S;
	    out[1] = (mat[6] + mat[9]) / S;
	    out[2] = 0.25 * S;
	  }

	  return out;
	};

	/**
	 * Creates a matrix from a quaternion rotation, vector translation and vector scale
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     var quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *     mat4.scale(dest, scale)
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @param {vec3} s Scaling vector
	 * @returns {mat4} out
	 */
	mat4.fromRotationTranslationScale = function (out, q, v, s) {
	    // Quaternion math
	    var x = q[0], y = q[1], z = q[2], w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,

	        xx = x * x2,
	        xy = x * y2,
	        xz = x * z2,
	        yy = y * y2,
	        yz = y * z2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2,
	        sx = s[0],
	        sy = s[1],
	        sz = s[2];

	    out[0] = (1 - (yy + zz)) * sx;
	    out[1] = (xy + wz) * sx;
	    out[2] = (xz - wy) * sx;
	    out[3] = 0;
	    out[4] = (xy - wz) * sy;
	    out[5] = (1 - (xx + zz)) * sy;
	    out[6] = (yz + wx) * sy;
	    out[7] = 0;
	    out[8] = (xz + wy) * sz;
	    out[9] = (yz - wx) * sz;
	    out[10] = (1 - (xx + yy)) * sz;
	    out[11] = 0;
	    out[12] = v[0];
	    out[13] = v[1];
	    out[14] = v[2];
	    out[15] = 1;

	    return out;
	};

	/**
	 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     mat4.translate(dest, origin);
	 *     var quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *     mat4.scale(dest, scale)
	 *     mat4.translate(dest, negativeOrigin);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @param {vec3} s Scaling vector
	 * @param {vec3} o The origin vector around which to scale and rotate
	 * @returns {mat4} out
	 */
	mat4.fromRotationTranslationScaleOrigin = function (out, q, v, s, o) {
	  // Quaternion math
	  var x = q[0], y = q[1], z = q[2], w = q[3],
	      x2 = x + x,
	      y2 = y + y,
	      z2 = z + z,

	      xx = x * x2,
	      xy = x * y2,
	      xz = x * z2,
	      yy = y * y2,
	      yz = y * z2,
	      zz = z * z2,
	      wx = w * x2,
	      wy = w * y2,
	      wz = w * z2,

	      sx = s[0],
	      sy = s[1],
	      sz = s[2],

	      ox = o[0],
	      oy = o[1],
	      oz = o[2];

	  out[0] = (1 - (yy + zz)) * sx;
	  out[1] = (xy + wz) * sx;
	  out[2] = (xz - wy) * sx;
	  out[3] = 0;
	  out[4] = (xy - wz) * sy;
	  out[5] = (1 - (xx + zz)) * sy;
	  out[6] = (yz + wx) * sy;
	  out[7] = 0;
	  out[8] = (xz + wy) * sz;
	  out[9] = (yz - wx) * sz;
	  out[10] = (1 - (xx + yy)) * sz;
	  out[11] = 0;
	  out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
	  out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
	  out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
	  out[15] = 1;

	  return out;
	};

	/**
	 * Calculates a 4x4 matrix from the given quaternion
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat} q Quaternion to create matrix from
	 *
	 * @returns {mat4} out
	 */
	mat4.fromQuat = function (out, q) {
	    var x = q[0], y = q[1], z = q[2], w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,

	        xx = x * x2,
	        yx = y * x2,
	        yy = y * y2,
	        zx = z * x2,
	        zy = z * y2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;

	    out[0] = 1 - yy - zz;
	    out[1] = yx + wz;
	    out[2] = zx - wy;
	    out[3] = 0;

	    out[4] = yx - wz;
	    out[5] = 1 - xx - zz;
	    out[6] = zy + wx;
	    out[7] = 0;

	    out[8] = zx + wy;
	    out[9] = zy - wx;
	    out[10] = 1 - xx - yy;
	    out[11] = 0;

	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;

	    return out;
	};

	/**
	 * Generates a frustum matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {Number} left Left bound of the frustum
	 * @param {Number} right Right bound of the frustum
	 * @param {Number} bottom Bottom bound of the frustum
	 * @param {Number} top Top bound of the frustum
	 * @param {Number} near Near bound of the frustum
	 * @param {Number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.frustum = function (out, left, right, bottom, top, near, far) {
	    var rl = 1 / (right - left),
	        tb = 1 / (top - bottom),
	        nf = 1 / (near - far);
	    out[0] = (near * 2) * rl;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = (near * 2) * tb;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = (right + left) * rl;
	    out[9] = (top + bottom) * tb;
	    out[10] = (far + near) * nf;
	    out[11] = -1;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = (far * near * 2) * nf;
	    out[15] = 0;
	    return out;
	};

	/**
	 * Generates a perspective projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} fovy Vertical field of view in radians
	 * @param {number} aspect Aspect ratio. typically viewport width/height
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.perspective = function (out, fovy, aspect, near, far) {
	    var f = 1.0 / Math.tan(fovy / 2),
	        nf = 1 / (near - far);
	    out[0] = f / aspect;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = f;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = (far + near) * nf;
	    out[11] = -1;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = (2 * far * near) * nf;
	    out[15] = 0;
	    return out;
	};

	/**
	 * Generates a perspective projection matrix with the given field of view.
	 * This is primarily useful for generating projection matrices to be used
	 * with the still experiemental WebVR API.
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.perspectiveFromFieldOfView = function (out, fov, near, far) {
	    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
	        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
	        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
	        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
	        xScale = 2.0 / (leftTan + rightTan),
	        yScale = 2.0 / (upTan + downTan);

	    out[0] = xScale;
	    out[1] = 0.0;
	    out[2] = 0.0;
	    out[3] = 0.0;
	    out[4] = 0.0;
	    out[5] = yScale;
	    out[6] = 0.0;
	    out[7] = 0.0;
	    out[8] = -((leftTan - rightTan) * xScale * 0.5);
	    out[9] = ((upTan - downTan) * yScale * 0.5);
	    out[10] = far / (near - far);
	    out[11] = -1.0;
	    out[12] = 0.0;
	    out[13] = 0.0;
	    out[14] = (far * near) / (near - far);
	    out[15] = 0.0;
	    return out;
	}

	/**
	 * Generates a orthogonal projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} left Left bound of the frustum
	 * @param {number} right Right bound of the frustum
	 * @param {number} bottom Bottom bound of the frustum
	 * @param {number} top Top bound of the frustum
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.ortho = function (out, left, right, bottom, top, near, far) {
	    var lr = 1 / (left - right),
	        bt = 1 / (bottom - top),
	        nf = 1 / (near - far);
	    out[0] = -2 * lr;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = -2 * bt;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 2 * nf;
	    out[11] = 0;
	    out[12] = (left + right) * lr;
	    out[13] = (top + bottom) * bt;
	    out[14] = (far + near) * nf;
	    out[15] = 1;
	    return out;
	};

	/**
	 * Generates a look-at matrix with the given eye position, focal point, and up axis
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {vec3} eye Position of the viewer
	 * @param {vec3} center Point the viewer is looking at
	 * @param {vec3} up vec3 pointing up
	 * @returns {mat4} out
	 */
	mat4.lookAt = function (out, eye, center, up) {
	    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
	        eyex = eye[0],
	        eyey = eye[1],
	        eyez = eye[2],
	        upx = up[0],
	        upy = up[1],
	        upz = up[2],
	        centerx = center[0],
	        centery = center[1],
	        centerz = center[2];

	    if (Math.abs(eyex - centerx) < glMatrix.EPSILON &&
	        Math.abs(eyey - centery) < glMatrix.EPSILON &&
	        Math.abs(eyez - centerz) < glMatrix.EPSILON) {
	        return mat4.identity(out);
	    }

	    z0 = eyex - centerx;
	    z1 = eyey - centery;
	    z2 = eyez - centerz;

	    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	    z0 *= len;
	    z1 *= len;
	    z2 *= len;

	    x0 = upy * z2 - upz * z1;
	    x1 = upz * z0 - upx * z2;
	    x2 = upx * z1 - upy * z0;
	    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	    if (!len) {
	        x0 = 0;
	        x1 = 0;
	        x2 = 0;
	    } else {
	        len = 1 / len;
	        x0 *= len;
	        x1 *= len;
	        x2 *= len;
	    }

	    y0 = z1 * x2 - z2 * x1;
	    y1 = z2 * x0 - z0 * x2;
	    y2 = z0 * x1 - z1 * x0;

	    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	    if (!len) {
	        y0 = 0;
	        y1 = 0;
	        y2 = 0;
	    } else {
	        len = 1 / len;
	        y0 *= len;
	        y1 *= len;
	        y2 *= len;
	    }

	    out[0] = x0;
	    out[1] = y0;
	    out[2] = z0;
	    out[3] = 0;
	    out[4] = x1;
	    out[5] = y1;
	    out[6] = z1;
	    out[7] = 0;
	    out[8] = x2;
	    out[9] = y2;
	    out[10] = z2;
	    out[11] = 0;
	    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
	    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
	    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
	    out[15] = 1;

	    return out;
	};

	/**
	 * Returns a string representation of a mat4
	 *
	 * @param {mat4} mat matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	mat4.str = function (a) {
	    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
	                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
	                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' +
	                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
	};

	/**
	 * Returns Frobenius norm of a mat4
	 *
	 * @param {mat4} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	mat4.frob = function (a) {
	    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
	};

	/**
	 * Adds two mat4's
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	mat4.add = function(out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    out[2] = a[2] + b[2];
	    out[3] = a[3] + b[3];
	    out[4] = a[4] + b[4];
	    out[5] = a[5] + b[5];
	    out[6] = a[6] + b[6];
	    out[7] = a[7] + b[7];
	    out[8] = a[8] + b[8];
	    out[9] = a[9] + b[9];
	    out[10] = a[10] + b[10];
	    out[11] = a[11] + b[11];
	    out[12] = a[12] + b[12];
	    out[13] = a[13] + b[13];
	    out[14] = a[14] + b[14];
	    out[15] = a[15] + b[15];
	    return out;
	};

	/**
	 * Subtracts matrix b from matrix a
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	mat4.subtract = function(out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    out[2] = a[2] - b[2];
	    out[3] = a[3] - b[3];
	    out[4] = a[4] - b[4];
	    out[5] = a[5] - b[5];
	    out[6] = a[6] - b[6];
	    out[7] = a[7] - b[7];
	    out[8] = a[8] - b[8];
	    out[9] = a[9] - b[9];
	    out[10] = a[10] - b[10];
	    out[11] = a[11] - b[11];
	    out[12] = a[12] - b[12];
	    out[13] = a[13] - b[13];
	    out[14] = a[14] - b[14];
	    out[15] = a[15] - b[15];
	    return out;
	};

	/**
	 * Alias for {@link mat4.subtract}
	 * @function
	 */
	mat4.sub = mat4.subtract;

	/**
	 * Multiply each element of the matrix by a scalar.
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to scale
	 * @param {Number} b amount to scale the matrix's elements by
	 * @returns {mat4} out
	 */
	mat4.multiplyScalar = function(out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    out[2] = a[2] * b;
	    out[3] = a[3] * b;
	    out[4] = a[4] * b;
	    out[5] = a[5] * b;
	    out[6] = a[6] * b;
	    out[7] = a[7] * b;
	    out[8] = a[8] * b;
	    out[9] = a[9] * b;
	    out[10] = a[10] * b;
	    out[11] = a[11] * b;
	    out[12] = a[12] * b;
	    out[13] = a[13] * b;
	    out[14] = a[14] * b;
	    out[15] = a[15] * b;
	    return out;
	};

	/**
	 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
	 *
	 * @param {mat4} out the receiving vector
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @param {Number} scale the amount to scale b's elements by before adding
	 * @returns {mat4} out
	 */
	mat4.multiplyScalarAndAdd = function(out, a, b, scale) {
	    out[0] = a[0] + (b[0] * scale);
	    out[1] = a[1] + (b[1] * scale);
	    out[2] = a[2] + (b[2] * scale);
	    out[3] = a[3] + (b[3] * scale);
	    out[4] = a[4] + (b[4] * scale);
	    out[5] = a[5] + (b[5] * scale);
	    out[6] = a[6] + (b[6] * scale);
	    out[7] = a[7] + (b[7] * scale);
	    out[8] = a[8] + (b[8] * scale);
	    out[9] = a[9] + (b[9] * scale);
	    out[10] = a[10] + (b[10] * scale);
	    out[11] = a[11] + (b[11] * scale);
	    out[12] = a[12] + (b[12] * scale);
	    out[13] = a[13] + (b[13] * scale);
	    out[14] = a[14] + (b[14] * scale);
	    out[15] = a[15] + (b[15] * scale);
	    return out;
	};

	/**
	 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {mat4} a The first matrix.
	 * @param {mat4} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	mat4.exactEquals = function (a, b) {
	    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && 
	           a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && 
	           a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] &&
	           a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
	};

	/**
	 * Returns whether or not the matrices have approximately the same elements in the same position.
	 *
	 * @param {mat4} a The first matrix.
	 * @param {mat4} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	mat4.equals = function (a, b) {
	    var a0  = a[0],  a1  = a[1],  a2  = a[2],  a3  = a[3],
	        a4  = a[4],  a5  = a[5],  a6  = a[6],  a7  = a[7], 
	        a8  = a[8],  a9  = a[9],  a10 = a[10], a11 = a[11], 
	        a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];

	    var b0  = b[0],  b1  = b[1],  b2  = b[2],  b3  = b[3],
	        b4  = b[4],  b5  = b[5],  b6  = b[6],  b7  = b[7], 
	        b8  = b[8],  b9  = b[9],  b10 = b[10], b11 = b[11], 
	        b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

	    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
	            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
	            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
	            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
	            Math.abs(a4 - b4) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
	            Math.abs(a5 - b5) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
	            Math.abs(a6 - b6) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
	            Math.abs(a7 - b7) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
	            Math.abs(a8 - b8) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a8), Math.abs(b8)) &&
	            Math.abs(a9 - b9) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a9), Math.abs(b9)) &&
	            Math.abs(a10 - b10) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a10), Math.abs(b10)) &&
	            Math.abs(a11 - b11) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a11), Math.abs(b11)) &&
	            Math.abs(a12 - b12) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a12), Math.abs(b12)) &&
	            Math.abs(a13 - b13) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a13), Math.abs(b13)) &&
	            Math.abs(a14 - b14) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a14), Math.abs(b14)) &&
	            Math.abs(a15 - b15) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a15), Math.abs(b15)));
	};



	module.exports = mat4;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(13);
	var mat3 = __webpack_require__(16);
	var vec3 = __webpack_require__(19);
	var vec4 = __webpack_require__(20);

	/**
	 * @class Quaternion
	 * @name quat
	 */
	var quat = {};

	/**
	 * Creates a new identity quat
	 *
	 * @returns {quat} a new quaternion
	 */
	quat.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    return out;
	};

	/**
	 * Sets a quaternion to represent the shortest rotation from one
	 * vector to another.
	 *
	 * Both vectors are assumed to be unit length.
	 *
	 * @param {quat} out the receiving quaternion.
	 * @param {vec3} a the initial vector
	 * @param {vec3} b the destination vector
	 * @returns {quat} out
	 */
	quat.rotationTo = (function() {
	    var tmpvec3 = vec3.create();
	    var xUnitVec3 = vec3.fromValues(1,0,0);
	    var yUnitVec3 = vec3.fromValues(0,1,0);

	    return function(out, a, b) {
	        var dot = vec3.dot(a, b);
	        if (dot < -0.999999) {
	            vec3.cross(tmpvec3, xUnitVec3, a);
	            if (vec3.length(tmpvec3) < 0.000001)
	                vec3.cross(tmpvec3, yUnitVec3, a);
	            vec3.normalize(tmpvec3, tmpvec3);
	            quat.setAxisAngle(out, tmpvec3, Math.PI);
	            return out;
	        } else if (dot > 0.999999) {
	            out[0] = 0;
	            out[1] = 0;
	            out[2] = 0;
	            out[3] = 1;
	            return out;
	        } else {
	            vec3.cross(tmpvec3, a, b);
	            out[0] = tmpvec3[0];
	            out[1] = tmpvec3[1];
	            out[2] = tmpvec3[2];
	            out[3] = 1 + dot;
	            return quat.normalize(out, out);
	        }
	    };
	})();

	/**
	 * Sets the specified quaternion with values corresponding to the given
	 * axes. Each axis is a vec3 and is expected to be unit length and
	 * perpendicular to all other specified axes.
	 *
	 * @param {vec3} view  the vector representing the viewing direction
	 * @param {vec3} right the vector representing the local "right" direction
	 * @param {vec3} up    the vector representing the local "up" direction
	 * @returns {quat} out
	 */
	quat.setAxes = (function() {
	    var matr = mat3.create();

	    return function(out, view, right, up) {
	        matr[0] = right[0];
	        matr[3] = right[1];
	        matr[6] = right[2];

	        matr[1] = up[0];
	        matr[4] = up[1];
	        matr[7] = up[2];

	        matr[2] = -view[0];
	        matr[5] = -view[1];
	        matr[8] = -view[2];

	        return quat.normalize(out, quat.fromMat3(out, matr));
	    };
	})();

	/**
	 * Creates a new quat initialized with values from an existing quaternion
	 *
	 * @param {quat} a quaternion to clone
	 * @returns {quat} a new quaternion
	 * @function
	 */
	quat.clone = vec4.clone;

	/**
	 * Creates a new quat initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {quat} a new quaternion
	 * @function
	 */
	quat.fromValues = vec4.fromValues;

	/**
	 * Copy the values from one quat to another
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the source quaternion
	 * @returns {quat} out
	 * @function
	 */
	quat.copy = vec4.copy;

	/**
	 * Set the components of a quat to the given values
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {quat} out
	 * @function
	 */
	quat.set = vec4.set;

	/**
	 * Set a quat to the identity quaternion
	 *
	 * @param {quat} out the receiving quaternion
	 * @returns {quat} out
	 */
	quat.identity = function(out) {
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 1;
	    return out;
	};

	/**
	 * Sets a quat from the given angle and rotation axis,
	 * then returns it.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {vec3} axis the axis around which to rotate
	 * @param {Number} rad the angle in radians
	 * @returns {quat} out
	 **/
	quat.setAxisAngle = function(out, axis, rad) {
	    rad = rad * 0.5;
	    var s = Math.sin(rad);
	    out[0] = s * axis[0];
	    out[1] = s * axis[1];
	    out[2] = s * axis[2];
	    out[3] = Math.cos(rad);
	    return out;
	};

	/**
	 * Gets the rotation axis and angle for a given
	 *  quaternion. If a quaternion is created with
	 *  setAxisAngle, this method will return the same
	 *  values as providied in the original parameter list
	 *  OR functionally equivalent values.
	 * Example: The quaternion formed by axis [0, 0, 1] and
	 *  angle -90 is the same as the quaternion formed by
	 *  [0, 0, 1] and 270. This method favors the latter.
	 * @param  {vec3} out_axis  Vector receiving the axis of rotation
	 * @param  {quat} q     Quaternion to be decomposed
	 * @return {Number}     Angle, in radians, of the rotation
	 */
	quat.getAxisAngle = function(out_axis, q) {
	    var rad = Math.acos(q[3]) * 2.0;
	    var s = Math.sin(rad / 2.0);
	    if (s != 0.0) {
	        out_axis[0] = q[0] / s;
	        out_axis[1] = q[1] / s;
	        out_axis[2] = q[2] / s;
	    } else {
	        // If s is zero, return any axis (no rotation - axis does not matter)
	        out_axis[0] = 1;
	        out_axis[1] = 0;
	        out_axis[2] = 0;
	    }
	    return rad;
	};

	/**
	 * Adds two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {quat} out
	 * @function
	 */
	quat.add = vec4.add;

	/**
	 * Multiplies two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {quat} out
	 */
	quat.multiply = function(out, a, b) {
	    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
	        bx = b[0], by = b[1], bz = b[2], bw = b[3];

	    out[0] = ax * bw + aw * bx + ay * bz - az * by;
	    out[1] = ay * bw + aw * by + az * bx - ax * bz;
	    out[2] = az * bw + aw * bz + ax * by - ay * bx;
	    out[3] = aw * bw - ax * bx - ay * by - az * bz;
	    return out;
	};

	/**
	 * Alias for {@link quat.multiply}
	 * @function
	 */
	quat.mul = quat.multiply;

	/**
	 * Scales a quat by a scalar number
	 *
	 * @param {quat} out the receiving vector
	 * @param {quat} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {quat} out
	 * @function
	 */
	quat.scale = vec4.scale;

	/**
	 * Rotates a quaternion by the given angle about the X axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	quat.rotateX = function (out, a, rad) {
	    rad *= 0.5; 

	    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
	        bx = Math.sin(rad), bw = Math.cos(rad);

	    out[0] = ax * bw + aw * bx;
	    out[1] = ay * bw + az * bx;
	    out[2] = az * bw - ay * bx;
	    out[3] = aw * bw - ax * bx;
	    return out;
	};

	/**
	 * Rotates a quaternion by the given angle about the Y axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	quat.rotateY = function (out, a, rad) {
	    rad *= 0.5; 

	    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
	        by = Math.sin(rad), bw = Math.cos(rad);

	    out[0] = ax * bw - az * by;
	    out[1] = ay * bw + aw * by;
	    out[2] = az * bw + ax * by;
	    out[3] = aw * bw - ay * by;
	    return out;
	};

	/**
	 * Rotates a quaternion by the given angle about the Z axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	quat.rotateZ = function (out, a, rad) {
	    rad *= 0.5; 

	    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
	        bz = Math.sin(rad), bw = Math.cos(rad);

	    out[0] = ax * bw + ay * bz;
	    out[1] = ay * bw - ax * bz;
	    out[2] = az * bw + aw * bz;
	    out[3] = aw * bw - az * bz;
	    return out;
	};

	/**
	 * Calculates the W component of a quat from the X, Y, and Z components.
	 * Assumes that quaternion is 1 unit in length.
	 * Any existing W component will be ignored.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate W component of
	 * @returns {quat} out
	 */
	quat.calculateW = function (out, a) {
	    var x = a[0], y = a[1], z = a[2];

	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
	    return out;
	};

	/**
	 * Calculates the dot product of two quat's
	 *
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {Number} dot product of a and b
	 * @function
	 */
	quat.dot = vec4.dot;

	/**
	 * Performs a linear interpolation between two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {quat} out
	 * @function
	 */
	quat.lerp = vec4.lerp;

	/**
	 * Performs a spherical linear interpolation between two quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {quat} out
	 */
	quat.slerp = function (out, a, b, t) {
	    // benchmarks:
	    //    http://jsperf.com/quaternion-slerp-implementations

	    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
	        bx = b[0], by = b[1], bz = b[2], bw = b[3];

	    var        omega, cosom, sinom, scale0, scale1;

	    // calc cosine
	    cosom = ax * bx + ay * by + az * bz + aw * bw;
	    // adjust signs (if necessary)
	    if ( cosom < 0.0 ) {
	        cosom = -cosom;
	        bx = - bx;
	        by = - by;
	        bz = - bz;
	        bw = - bw;
	    }
	    // calculate coefficients
	    if ( (1.0 - cosom) > 0.000001 ) {
	        // standard case (slerp)
	        omega  = Math.acos(cosom);
	        sinom  = Math.sin(omega);
	        scale0 = Math.sin((1.0 - t) * omega) / sinom;
	        scale1 = Math.sin(t * omega) / sinom;
	    } else {        
	        // "from" and "to" quaternions are very close 
	        //  ... so we can do a linear interpolation
	        scale0 = 1.0 - t;
	        scale1 = t;
	    }
	    // calculate final values
	    out[0] = scale0 * ax + scale1 * bx;
	    out[1] = scale0 * ay + scale1 * by;
	    out[2] = scale0 * az + scale1 * bz;
	    out[3] = scale0 * aw + scale1 * bw;
	    
	    return out;
	};

	/**
	 * Performs a spherical linear interpolation with two control points
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {quat} c the third operand
	 * @param {quat} d the fourth operand
	 * @param {Number} t interpolation amount
	 * @returns {quat} out
	 */
	quat.sqlerp = (function () {
	  var temp1 = quat.create();
	  var temp2 = quat.create();
	  
	  return function (out, a, b, c, d, t) {
	    quat.slerp(temp1, a, d, t);
	    quat.slerp(temp2, b, c, t);
	    quat.slerp(out, temp1, temp2, 2 * t * (1 - t));
	    
	    return out;
	  };
	}());

	/**
	 * Calculates the inverse of a quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate inverse of
	 * @returns {quat} out
	 */
	quat.invert = function(out, a) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
	        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
	        invDot = dot ? 1.0/dot : 0;
	    
	    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

	    out[0] = -a0*invDot;
	    out[1] = -a1*invDot;
	    out[2] = -a2*invDot;
	    out[3] = a3*invDot;
	    return out;
	};

	/**
	 * Calculates the conjugate of a quat
	 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate conjugate of
	 * @returns {quat} out
	 */
	quat.conjugate = function (out, a) {
	    out[0] = -a[0];
	    out[1] = -a[1];
	    out[2] = -a[2];
	    out[3] = a[3];
	    return out;
	};

	/**
	 * Calculates the length of a quat
	 *
	 * @param {quat} a vector to calculate length of
	 * @returns {Number} length of a
	 * @function
	 */
	quat.length = vec4.length;

	/**
	 * Alias for {@link quat.length}
	 * @function
	 */
	quat.len = quat.length;

	/**
	 * Calculates the squared length of a quat
	 *
	 * @param {quat} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 * @function
	 */
	quat.squaredLength = vec4.squaredLength;

	/**
	 * Alias for {@link quat.squaredLength}
	 * @function
	 */
	quat.sqrLen = quat.squaredLength;

	/**
	 * Normalize a quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quaternion to normalize
	 * @returns {quat} out
	 * @function
	 */
	quat.normalize = vec4.normalize;

	/**
	 * Creates a quaternion from the given 3x3 rotation matrix.
	 *
	 * NOTE: The resultant quaternion is not normalized, so you should be sure
	 * to renormalize the quaternion yourself where necessary.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {mat3} m rotation matrix
	 * @returns {quat} out
	 * @function
	 */
	quat.fromMat3 = function(out, m) {
	    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
	    // article "Quaternion Calculus and Fast Animation".
	    var fTrace = m[0] + m[4] + m[8];
	    var fRoot;

	    if ( fTrace > 0.0 ) {
	        // |w| > 1/2, may as well choose w > 1/2
	        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
	        out[3] = 0.5 * fRoot;
	        fRoot = 0.5/fRoot;  // 1/(4w)
	        out[0] = (m[5]-m[7])*fRoot;
	        out[1] = (m[6]-m[2])*fRoot;
	        out[2] = (m[1]-m[3])*fRoot;
	    } else {
	        // |w| <= 1/2
	        var i = 0;
	        if ( m[4] > m[0] )
	          i = 1;
	        if ( m[8] > m[i*3+i] )
	          i = 2;
	        var j = (i+1)%3;
	        var k = (i+2)%3;
	        
	        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
	        out[i] = 0.5 * fRoot;
	        fRoot = 0.5 / fRoot;
	        out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
	        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
	        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
	    }
	    
	    return out;
	};

	/**
	 * Returns a string representation of a quatenion
	 *
	 * @param {quat} vec vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	quat.str = function (a) {
	    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	};

	/**
	 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {quat} a The first quaternion.
	 * @param {quat} b The second quaternion.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	quat.exactEquals = vec4.exactEquals;

	/**
	 * Returns whether or not the quaternions have approximately the same elements in the same position.
	 *
	 * @param {quat} a The first vector.
	 * @param {quat} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	quat.equals = vec4.equals;

	module.exports = quat;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(13);

	/**
	 * @class 3 Dimensional Vector
	 * @name vec3
	 */
	var vec3 = {};

	/**
	 * Creates a new, empty vec3
	 *
	 * @returns {vec3} a new 3D vector
	 */
	vec3.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(3);
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	    return out;
	};

	/**
	 * Creates a new vec3 initialized with values from an existing vector
	 *
	 * @param {vec3} a vector to clone
	 * @returns {vec3} a new 3D vector
	 */
	vec3.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(3);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    return out;
	};

	/**
	 * Creates a new vec3 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @returns {vec3} a new 3D vector
	 */
	vec3.fromValues = function(x, y, z) {
	    var out = new glMatrix.ARRAY_TYPE(3);
	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    return out;
	};

	/**
	 * Copy the values from one vec3 to another
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the source vector
	 * @returns {vec3} out
	 */
	vec3.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    return out;
	};

	/**
	 * Set the components of a vec3 to the given values
	 *
	 * @param {vec3} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @returns {vec3} out
	 */
	vec3.set = function(out, x, y, z) {
	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    return out;
	};

	/**
	 * Adds two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.add = function(out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    out[2] = a[2] + b[2];
	    return out;
	};

	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.subtract = function(out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    out[2] = a[2] - b[2];
	    return out;
	};

	/**
	 * Alias for {@link vec3.subtract}
	 * @function
	 */
	vec3.sub = vec3.subtract;

	/**
	 * Multiplies two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.multiply = function(out, a, b) {
	    out[0] = a[0] * b[0];
	    out[1] = a[1] * b[1];
	    out[2] = a[2] * b[2];
	    return out;
	};

	/**
	 * Alias for {@link vec3.multiply}
	 * @function
	 */
	vec3.mul = vec3.multiply;

	/**
	 * Divides two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.divide = function(out, a, b) {
	    out[0] = a[0] / b[0];
	    out[1] = a[1] / b[1];
	    out[2] = a[2] / b[2];
	    return out;
	};

	/**
	 * Alias for {@link vec3.divide}
	 * @function
	 */
	vec3.div = vec3.divide;

	/**
	 * Math.ceil the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to ceil
	 * @returns {vec3} out
	 */
	vec3.ceil = function (out, a) {
	    out[0] = Math.ceil(a[0]);
	    out[1] = Math.ceil(a[1]);
	    out[2] = Math.ceil(a[2]);
	    return out;
	};

	/**
	 * Math.floor the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to floor
	 * @returns {vec3} out
	 */
	vec3.floor = function (out, a) {
	    out[0] = Math.floor(a[0]);
	    out[1] = Math.floor(a[1]);
	    out[2] = Math.floor(a[2]);
	    return out;
	};

	/**
	 * Returns the minimum of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.min = function(out, a, b) {
	    out[0] = Math.min(a[0], b[0]);
	    out[1] = Math.min(a[1], b[1]);
	    out[2] = Math.min(a[2], b[2]);
	    return out;
	};

	/**
	 * Returns the maximum of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.max = function(out, a, b) {
	    out[0] = Math.max(a[0], b[0]);
	    out[1] = Math.max(a[1], b[1]);
	    out[2] = Math.max(a[2], b[2]);
	    return out;
	};

	/**
	 * Math.round the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to round
	 * @returns {vec3} out
	 */
	vec3.round = function (out, a) {
	    out[0] = Math.round(a[0]);
	    out[1] = Math.round(a[1]);
	    out[2] = Math.round(a[2]);
	    return out;
	};

	/**
	 * Scales a vec3 by a scalar number
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec3} out
	 */
	vec3.scale = function(out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    out[2] = a[2] * b;
	    return out;
	};

	/**
	 * Adds two vec3's after scaling the second operand by a scalar value
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec3} out
	 */
	vec3.scaleAndAdd = function(out, a, b, scale) {
	    out[0] = a[0] + (b[0] * scale);
	    out[1] = a[1] + (b[1] * scale);
	    out[2] = a[2] + (b[2] * scale);
	    return out;
	};

	/**
	 * Calculates the euclidian distance between two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} distance between a and b
	 */
	vec3.distance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1],
	        z = b[2] - a[2];
	    return Math.sqrt(x*x + y*y + z*z);
	};

	/**
	 * Alias for {@link vec3.distance}
	 * @function
	 */
	vec3.dist = vec3.distance;

	/**
	 * Calculates the squared euclidian distance between two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	vec3.squaredDistance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1],
	        z = b[2] - a[2];
	    return x*x + y*y + z*z;
	};

	/**
	 * Alias for {@link vec3.squaredDistance}
	 * @function
	 */
	vec3.sqrDist = vec3.squaredDistance;

	/**
	 * Calculates the length of a vec3
	 *
	 * @param {vec3} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	vec3.length = function (a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2];
	    return Math.sqrt(x*x + y*y + z*z);
	};

	/**
	 * Alias for {@link vec3.length}
	 * @function
	 */
	vec3.len = vec3.length;

	/**
	 * Calculates the squared length of a vec3
	 *
	 * @param {vec3} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	vec3.squaredLength = function (a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2];
	    return x*x + y*y + z*z;
	};

	/**
	 * Alias for {@link vec3.squaredLength}
	 * @function
	 */
	vec3.sqrLen = vec3.squaredLength;

	/**
	 * Negates the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to negate
	 * @returns {vec3} out
	 */
	vec3.negate = function(out, a) {
	    out[0] = -a[0];
	    out[1] = -a[1];
	    out[2] = -a[2];
	    return out;
	};

	/**
	 * Returns the inverse of the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to invert
	 * @returns {vec3} out
	 */
	vec3.inverse = function(out, a) {
	  out[0] = 1.0 / a[0];
	  out[1] = 1.0 / a[1];
	  out[2] = 1.0 / a[2];
	  return out;
	};

	/**
	 * Normalize a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to normalize
	 * @returns {vec3} out
	 */
	vec3.normalize = function(out, a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2];
	    var len = x*x + y*y + z*z;
	    if (len > 0) {
	        //TODO: evaluate use of glm_invsqrt here?
	        len = 1 / Math.sqrt(len);
	        out[0] = a[0] * len;
	        out[1] = a[1] * len;
	        out[2] = a[2] * len;
	    }
	    return out;
	};

	/**
	 * Calculates the dot product of two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	vec3.dot = function (a, b) {
	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	};

	/**
	 * Computes the cross product of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	vec3.cross = function(out, a, b) {
	    var ax = a[0], ay = a[1], az = a[2],
	        bx = b[0], by = b[1], bz = b[2];

	    out[0] = ay * bz - az * by;
	    out[1] = az * bx - ax * bz;
	    out[2] = ax * by - ay * bx;
	    return out;
	};

	/**
	 * Performs a linear interpolation between two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec3} out
	 */
	vec3.lerp = function (out, a, b, t) {
	    var ax = a[0],
	        ay = a[1],
	        az = a[2];
	    out[0] = ax + t * (b[0] - ax);
	    out[1] = ay + t * (b[1] - ay);
	    out[2] = az + t * (b[2] - az);
	    return out;
	};

	/**
	 * Performs a hermite interpolation with two control points
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {vec3} c the third operand
	 * @param {vec3} d the fourth operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec3} out
	 */
	vec3.hermite = function (out, a, b, c, d, t) {
	  var factorTimes2 = t * t,
	      factor1 = factorTimes2 * (2 * t - 3) + 1,
	      factor2 = factorTimes2 * (t - 2) + t,
	      factor3 = factorTimes2 * (t - 1),
	      factor4 = factorTimes2 * (3 - 2 * t);
	  
	  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
	  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
	  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
	  
	  return out;
	};

	/**
	 * Performs a bezier interpolation with two control points
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {vec3} c the third operand
	 * @param {vec3} d the fourth operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec3} out
	 */
	vec3.bezier = function (out, a, b, c, d, t) {
	  var inverseFactor = 1 - t,
	      inverseFactorTimesTwo = inverseFactor * inverseFactor,
	      factorTimes2 = t * t,
	      factor1 = inverseFactorTimesTwo * inverseFactor,
	      factor2 = 3 * t * inverseFactorTimesTwo,
	      factor3 = 3 * factorTimes2 * inverseFactor,
	      factor4 = factorTimes2 * t;
	  
	  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
	  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
	  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
	  
	  return out;
	};

	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec3} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec3} out
	 */
	vec3.random = function (out, scale) {
	    scale = scale || 1.0;

	    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
	    var z = (glMatrix.RANDOM() * 2.0) - 1.0;
	    var zScale = Math.sqrt(1.0-z*z) * scale;

	    out[0] = Math.cos(r) * zScale;
	    out[1] = Math.sin(r) * zScale;
	    out[2] = z * scale;
	    return out;
	};

	/**
	 * Transforms the vec3 with a mat4.
	 * 4th vector component is implicitly '1'
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec3} out
	 */
	vec3.transformMat4 = function(out, a, m) {
	    var x = a[0], y = a[1], z = a[2],
	        w = m[3] * x + m[7] * y + m[11] * z + m[15];
	    w = w || 1.0;
	    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
	    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
	    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
	    return out;
	};

	/**
	 * Transforms the vec3 with a mat3.
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {mat4} m the 3x3 matrix to transform with
	 * @returns {vec3} out
	 */
	vec3.transformMat3 = function(out, a, m) {
	    var x = a[0], y = a[1], z = a[2];
	    out[0] = x * m[0] + y * m[3] + z * m[6];
	    out[1] = x * m[1] + y * m[4] + z * m[7];
	    out[2] = x * m[2] + y * m[5] + z * m[8];
	    return out;
	};

	/**
	 * Transforms the vec3 with a quat
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {quat} q quaternion to transform with
	 * @returns {vec3} out
	 */
	vec3.transformQuat = function(out, a, q) {
	    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

	    var x = a[0], y = a[1], z = a[2],
	        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

	        // calculate quat * vec
	        ix = qw * x + qy * z - qz * y,
	        iy = qw * y + qz * x - qx * z,
	        iz = qw * z + qx * y - qy * x,
	        iw = -qx * x - qy * y - qz * z;

	    // calculate result * inverse quat
	    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	    return out;
	};

	/**
	 * Rotate a 3D vector around the x-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	vec3.rotateX = function(out, a, b, c){
	   var p = [], r=[];
		  //Translate point to the origin
		  p[0] = a[0] - b[0];
		  p[1] = a[1] - b[1];
	  	p[2] = a[2] - b[2];

		  //perform rotation
		  r[0] = p[0];
		  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
		  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

		  //translate to correct position
		  out[0] = r[0] + b[0];
		  out[1] = r[1] + b[1];
		  out[2] = r[2] + b[2];

	  	return out;
	};

	/**
	 * Rotate a 3D vector around the y-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	vec3.rotateY = function(out, a, b, c){
	  	var p = [], r=[];
	  	//Translate point to the origin
	  	p[0] = a[0] - b[0];
	  	p[1] = a[1] - b[1];
	  	p[2] = a[2] - b[2];
	  
	  	//perform rotation
	  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
	  	r[1] = p[1];
	  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
	  
	  	//translate to correct position
	  	out[0] = r[0] + b[0];
	  	out[1] = r[1] + b[1];
	  	out[2] = r[2] + b[2];
	  
	  	return out;
	};

	/**
	 * Rotate a 3D vector around the z-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	vec3.rotateZ = function(out, a, b, c){
	  	var p = [], r=[];
	  	//Translate point to the origin
	  	p[0] = a[0] - b[0];
	  	p[1] = a[1] - b[1];
	  	p[2] = a[2] - b[2];
	  
	  	//perform rotation
	  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
	  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
	  	r[2] = p[2];
	  
	  	//translate to correct position
	  	out[0] = r[0] + b[0];
	  	out[1] = r[1] + b[1];
	  	out[2] = r[2] + b[2];
	  
	  	return out;
	};

	/**
	 * Perform some operation over an array of vec3s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	vec3.forEach = (function() {
	    var vec = vec3.create();

	    return function(a, stride, offset, count, fn, arg) {
	        var i, l;
	        if(!stride) {
	            stride = 3;
	        }

	        if(!offset) {
	            offset = 0;
	        }
	        
	        if(count) {
	            l = Math.min((count * stride) + offset, a.length);
	        } else {
	            l = a.length;
	        }

	        for(i = offset; i < l; i += stride) {
	            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
	            fn(vec, vec, arg);
	            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
	        }
	        
	        return a;
	    };
	})();

	/**
	 * Get the angle between two 3D vectors
	 * @param {vec3} a The first operand
	 * @param {vec3} b The second operand
	 * @returns {Number} The angle in radians
	 */
	vec3.angle = function(a, b) {
	   
	    var tempA = vec3.fromValues(a[0], a[1], a[2]);
	    var tempB = vec3.fromValues(b[0], b[1], b[2]);
	 
	    vec3.normalize(tempA, tempA);
	    vec3.normalize(tempB, tempB);
	 
	    var cosine = vec3.dot(tempA, tempB);

	    if(cosine > 1.0){
	        return 0;
	    } else {
	        return Math.acos(cosine);
	    }     
	};

	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec3} vec vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	vec3.str = function (a) {
	    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
	};

	/**
	 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {vec3} a The first vector.
	 * @param {vec3} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	vec3.exactEquals = function (a, b) {
	    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
	};

	/**
	 * Returns whether or not the vectors have approximately the same elements in the same position.
	 *
	 * @param {vec3} a The first vector.
	 * @param {vec3} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	vec3.equals = function (a, b) {
	    var a0 = a[0], a1 = a[1], a2 = a[2];
	    var b0 = b[0], b1 = b[1], b2 = b[2];
	    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
	            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
	            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)));
	};

	module.exports = vec3;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(13);

	/**
	 * @class 4 Dimensional Vector
	 * @name vec4
	 */
	var vec4 = {};

	/**
	 * Creates a new, empty vec4
	 *
	 * @returns {vec4} a new 4D vector
	 */
	vec4.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    return out;
	};

	/**
	 * Creates a new vec4 initialized with values from an existing vector
	 *
	 * @param {vec4} a vector to clone
	 * @returns {vec4} a new 4D vector
	 */
	vec4.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    return out;
	};

	/**
	 * Creates a new vec4 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {vec4} a new 4D vector
	 */
	vec4.fromValues = function(x, y, z, w) {
	    var out = new glMatrix.ARRAY_TYPE(4);
	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    out[3] = w;
	    return out;
	};

	/**
	 * Copy the values from one vec4 to another
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the source vector
	 * @returns {vec4} out
	 */
	vec4.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    return out;
	};

	/**
	 * Set the components of a vec4 to the given values
	 *
	 * @param {vec4} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {vec4} out
	 */
	vec4.set = function(out, x, y, z, w) {
	    out[0] = x;
	    out[1] = y;
	    out[2] = z;
	    out[3] = w;
	    return out;
	};

	/**
	 * Adds two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.add = function(out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    out[2] = a[2] + b[2];
	    out[3] = a[3] + b[3];
	    return out;
	};

	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.subtract = function(out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    out[2] = a[2] - b[2];
	    out[3] = a[3] - b[3];
	    return out;
	};

	/**
	 * Alias for {@link vec4.subtract}
	 * @function
	 */
	vec4.sub = vec4.subtract;

	/**
	 * Multiplies two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.multiply = function(out, a, b) {
	    out[0] = a[0] * b[0];
	    out[1] = a[1] * b[1];
	    out[2] = a[2] * b[2];
	    out[3] = a[3] * b[3];
	    return out;
	};

	/**
	 * Alias for {@link vec4.multiply}
	 * @function
	 */
	vec4.mul = vec4.multiply;

	/**
	 * Divides two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.divide = function(out, a, b) {
	    out[0] = a[0] / b[0];
	    out[1] = a[1] / b[1];
	    out[2] = a[2] / b[2];
	    out[3] = a[3] / b[3];
	    return out;
	};

	/**
	 * Alias for {@link vec4.divide}
	 * @function
	 */
	vec4.div = vec4.divide;

	/**
	 * Math.ceil the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to ceil
	 * @returns {vec4} out
	 */
	vec4.ceil = function (out, a) {
	    out[0] = Math.ceil(a[0]);
	    out[1] = Math.ceil(a[1]);
	    out[2] = Math.ceil(a[2]);
	    out[3] = Math.ceil(a[3]);
	    return out;
	};

	/**
	 * Math.floor the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to floor
	 * @returns {vec4} out
	 */
	vec4.floor = function (out, a) {
	    out[0] = Math.floor(a[0]);
	    out[1] = Math.floor(a[1]);
	    out[2] = Math.floor(a[2]);
	    out[3] = Math.floor(a[3]);
	    return out;
	};

	/**
	 * Returns the minimum of two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.min = function(out, a, b) {
	    out[0] = Math.min(a[0], b[0]);
	    out[1] = Math.min(a[1], b[1]);
	    out[2] = Math.min(a[2], b[2]);
	    out[3] = Math.min(a[3], b[3]);
	    return out;
	};

	/**
	 * Returns the maximum of two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	vec4.max = function(out, a, b) {
	    out[0] = Math.max(a[0], b[0]);
	    out[1] = Math.max(a[1], b[1]);
	    out[2] = Math.max(a[2], b[2]);
	    out[3] = Math.max(a[3], b[3]);
	    return out;
	};

	/**
	 * Math.round the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to round
	 * @returns {vec4} out
	 */
	vec4.round = function (out, a) {
	    out[0] = Math.round(a[0]);
	    out[1] = Math.round(a[1]);
	    out[2] = Math.round(a[2]);
	    out[3] = Math.round(a[3]);
	    return out;
	};

	/**
	 * Scales a vec4 by a scalar number
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec4} out
	 */
	vec4.scale = function(out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    out[2] = a[2] * b;
	    out[3] = a[3] * b;
	    return out;
	};

	/**
	 * Adds two vec4's after scaling the second operand by a scalar value
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec4} out
	 */
	vec4.scaleAndAdd = function(out, a, b, scale) {
	    out[0] = a[0] + (b[0] * scale);
	    out[1] = a[1] + (b[1] * scale);
	    out[2] = a[2] + (b[2] * scale);
	    out[3] = a[3] + (b[3] * scale);
	    return out;
	};

	/**
	 * Calculates the euclidian distance between two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} distance between a and b
	 */
	vec4.distance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1],
	        z = b[2] - a[2],
	        w = b[3] - a[3];
	    return Math.sqrt(x*x + y*y + z*z + w*w);
	};

	/**
	 * Alias for {@link vec4.distance}
	 * @function
	 */
	vec4.dist = vec4.distance;

	/**
	 * Calculates the squared euclidian distance between two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	vec4.squaredDistance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1],
	        z = b[2] - a[2],
	        w = b[3] - a[3];
	    return x*x + y*y + z*z + w*w;
	};

	/**
	 * Alias for {@link vec4.squaredDistance}
	 * @function
	 */
	vec4.sqrDist = vec4.squaredDistance;

	/**
	 * Calculates the length of a vec4
	 *
	 * @param {vec4} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	vec4.length = function (a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2],
	        w = a[3];
	    return Math.sqrt(x*x + y*y + z*z + w*w);
	};

	/**
	 * Alias for {@link vec4.length}
	 * @function
	 */
	vec4.len = vec4.length;

	/**
	 * Calculates the squared length of a vec4
	 *
	 * @param {vec4} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	vec4.squaredLength = function (a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2],
	        w = a[3];
	    return x*x + y*y + z*z + w*w;
	};

	/**
	 * Alias for {@link vec4.squaredLength}
	 * @function
	 */
	vec4.sqrLen = vec4.squaredLength;

	/**
	 * Negates the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to negate
	 * @returns {vec4} out
	 */
	vec4.negate = function(out, a) {
	    out[0] = -a[0];
	    out[1] = -a[1];
	    out[2] = -a[2];
	    out[3] = -a[3];
	    return out;
	};

	/**
	 * Returns the inverse of the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to invert
	 * @returns {vec4} out
	 */
	vec4.inverse = function(out, a) {
	  out[0] = 1.0 / a[0];
	  out[1] = 1.0 / a[1];
	  out[2] = 1.0 / a[2];
	  out[3] = 1.0 / a[3];
	  return out;
	};

	/**
	 * Normalize a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to normalize
	 * @returns {vec4} out
	 */
	vec4.normalize = function(out, a) {
	    var x = a[0],
	        y = a[1],
	        z = a[2],
	        w = a[3];
	    var len = x*x + y*y + z*z + w*w;
	    if (len > 0) {
	        len = 1 / Math.sqrt(len);
	        out[0] = x * len;
	        out[1] = y * len;
	        out[2] = z * len;
	        out[3] = w * len;
	    }
	    return out;
	};

	/**
	 * Calculates the dot product of two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	vec4.dot = function (a, b) {
	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
	};

	/**
	 * Performs a linear interpolation between two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec4} out
	 */
	vec4.lerp = function (out, a, b, t) {
	    var ax = a[0],
	        ay = a[1],
	        az = a[2],
	        aw = a[3];
	    out[0] = ax + t * (b[0] - ax);
	    out[1] = ay + t * (b[1] - ay);
	    out[2] = az + t * (b[2] - az);
	    out[3] = aw + t * (b[3] - aw);
	    return out;
	};

	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec4} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec4} out
	 */
	vec4.random = function (out, scale) {
	    scale = scale || 1.0;

	    //TODO: This is a pretty awful way of doing this. Find something better.
	    out[0] = glMatrix.RANDOM();
	    out[1] = glMatrix.RANDOM();
	    out[2] = glMatrix.RANDOM();
	    out[3] = glMatrix.RANDOM();
	    vec4.normalize(out, out);
	    vec4.scale(out, out, scale);
	    return out;
	};

	/**
	 * Transforms the vec4 with a mat4.
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec4} out
	 */
	vec4.transformMat4 = function(out, a, m) {
	    var x = a[0], y = a[1], z = a[2], w = a[3];
	    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
	    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
	    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
	    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
	    return out;
	};

	/**
	 * Transforms the vec4 with a quat
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to transform
	 * @param {quat} q quaternion to transform with
	 * @returns {vec4} out
	 */
	vec4.transformQuat = function(out, a, q) {
	    var x = a[0], y = a[1], z = a[2],
	        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

	        // calculate quat * vec
	        ix = qw * x + qy * z - qz * y,
	        iy = qw * y + qz * x - qx * z,
	        iz = qw * z + qx * y - qy * x,
	        iw = -qx * x - qy * y - qz * z;

	    // calculate result * inverse quat
	    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	    out[3] = a[3];
	    return out;
	};

	/**
	 * Perform some operation over an array of vec4s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	vec4.forEach = (function() {
	    var vec = vec4.create();

	    return function(a, stride, offset, count, fn, arg) {
	        var i, l;
	        if(!stride) {
	            stride = 4;
	        }

	        if(!offset) {
	            offset = 0;
	        }
	        
	        if(count) {
	            l = Math.min((count * stride) + offset, a.length);
	        } else {
	            l = a.length;
	        }

	        for(i = offset; i < l; i += stride) {
	            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
	            fn(vec, vec, arg);
	            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
	        }
	        
	        return a;
	    };
	})();

	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec4} vec vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	vec4.str = function (a) {
	    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	};

	/**
	 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {vec4} a The first vector.
	 * @param {vec4} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	vec4.exactEquals = function (a, b) {
	    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
	};

	/**
	 * Returns whether or not the vectors have approximately the same elements in the same position.
	 *
	 * @param {vec4} a The first vector.
	 * @param {vec4} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	vec4.equals = function (a, b) {
	    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
	    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
	    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
	            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
	            Math.abs(a2 - b2) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
	            Math.abs(a3 - b3) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
	};

	module.exports = vec4;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(13);

	/**
	 * @class 2 Dimensional Vector
	 * @name vec2
	 */
	var vec2 = {};

	/**
	 * Creates a new, empty vec2
	 *
	 * @returns {vec2} a new 2D vector
	 */
	vec2.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(2);
	    out[0] = 0;
	    out[1] = 0;
	    return out;
	};

	/**
	 * Creates a new vec2 initialized with values from an existing vector
	 *
	 * @param {vec2} a vector to clone
	 * @returns {vec2} a new 2D vector
	 */
	vec2.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(2);
	    out[0] = a[0];
	    out[1] = a[1];
	    return out;
	};

	/**
	 * Creates a new vec2 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @returns {vec2} a new 2D vector
	 */
	vec2.fromValues = function(x, y) {
	    var out = new glMatrix.ARRAY_TYPE(2);
	    out[0] = x;
	    out[1] = y;
	    return out;
	};

	/**
	 * Copy the values from one vec2 to another
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the source vector
	 * @returns {vec2} out
	 */
	vec2.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    return out;
	};

	/**
	 * Set the components of a vec2 to the given values
	 *
	 * @param {vec2} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @returns {vec2} out
	 */
	vec2.set = function(out, x, y) {
	    out[0] = x;
	    out[1] = y;
	    return out;
	};

	/**
	 * Adds two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.add = function(out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    return out;
	};

	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.subtract = function(out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    return out;
	};

	/**
	 * Alias for {@link vec2.subtract}
	 * @function
	 */
	vec2.sub = vec2.subtract;

	/**
	 * Multiplies two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.multiply = function(out, a, b) {
	    out[0] = a[0] * b[0];
	    out[1] = a[1] * b[1];
	    return out;
	};

	/**
	 * Alias for {@link vec2.multiply}
	 * @function
	 */
	vec2.mul = vec2.multiply;

	/**
	 * Divides two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.divide = function(out, a, b) {
	    out[0] = a[0] / b[0];
	    out[1] = a[1] / b[1];
	    return out;
	};

	/**
	 * Alias for {@link vec2.divide}
	 * @function
	 */
	vec2.div = vec2.divide;

	/**
	 * Math.ceil the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to ceil
	 * @returns {vec2} out
	 */
	vec2.ceil = function (out, a) {
	    out[0] = Math.ceil(a[0]);
	    out[1] = Math.ceil(a[1]);
	    return out;
	};

	/**
	 * Math.floor the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to floor
	 * @returns {vec2} out
	 */
	vec2.floor = function (out, a) {
	    out[0] = Math.floor(a[0]);
	    out[1] = Math.floor(a[1]);
	    return out;
	};

	/**
	 * Returns the minimum of two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.min = function(out, a, b) {
	    out[0] = Math.min(a[0], b[0]);
	    out[1] = Math.min(a[1], b[1]);
	    return out;
	};

	/**
	 * Returns the maximum of two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.max = function(out, a, b) {
	    out[0] = Math.max(a[0], b[0]);
	    out[1] = Math.max(a[1], b[1]);
	    return out;
	};

	/**
	 * Math.round the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to round
	 * @returns {vec2} out
	 */
	vec2.round = function (out, a) {
	    out[0] = Math.round(a[0]);
	    out[1] = Math.round(a[1]);
	    return out;
	};

	/**
	 * Scales a vec2 by a scalar number
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec2} out
	 */
	vec2.scale = function(out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    return out;
	};

	/**
	 * Adds two vec2's after scaling the second operand by a scalar value
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec2} out
	 */
	vec2.scaleAndAdd = function(out, a, b, scale) {
	    out[0] = a[0] + (b[0] * scale);
	    out[1] = a[1] + (b[1] * scale);
	    return out;
	};

	/**
	 * Calculates the euclidian distance between two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} distance between a and b
	 */
	vec2.distance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1];
	    return Math.sqrt(x*x + y*y);
	};

	/**
	 * Alias for {@link vec2.distance}
	 * @function
	 */
	vec2.dist = vec2.distance;

	/**
	 * Calculates the squared euclidian distance between two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	vec2.squaredDistance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1];
	    return x*x + y*y;
	};

	/**
	 * Alias for {@link vec2.squaredDistance}
	 * @function
	 */
	vec2.sqrDist = vec2.squaredDistance;

	/**
	 * Calculates the length of a vec2
	 *
	 * @param {vec2} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	vec2.length = function (a) {
	    var x = a[0],
	        y = a[1];
	    return Math.sqrt(x*x + y*y);
	};

	/**
	 * Alias for {@link vec2.length}
	 * @function
	 */
	vec2.len = vec2.length;

	/**
	 * Calculates the squared length of a vec2
	 *
	 * @param {vec2} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	vec2.squaredLength = function (a) {
	    var x = a[0],
	        y = a[1];
	    return x*x + y*y;
	};

	/**
	 * Alias for {@link vec2.squaredLength}
	 * @function
	 */
	vec2.sqrLen = vec2.squaredLength;

	/**
	 * Negates the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to negate
	 * @returns {vec2} out
	 */
	vec2.negate = function(out, a) {
	    out[0] = -a[0];
	    out[1] = -a[1];
	    return out;
	};

	/**
	 * Returns the inverse of the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to invert
	 * @returns {vec2} out
	 */
	vec2.inverse = function(out, a) {
	  out[0] = 1.0 / a[0];
	  out[1] = 1.0 / a[1];
	  return out;
	};

	/**
	 * Normalize a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to normalize
	 * @returns {vec2} out
	 */
	vec2.normalize = function(out, a) {
	    var x = a[0],
	        y = a[1];
	    var len = x*x + y*y;
	    if (len > 0) {
	        //TODO: evaluate use of glm_invsqrt here?
	        len = 1 / Math.sqrt(len);
	        out[0] = a[0] * len;
	        out[1] = a[1] * len;
	    }
	    return out;
	};

	/**
	 * Calculates the dot product of two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	vec2.dot = function (a, b) {
	    return a[0] * b[0] + a[1] * b[1];
	};

	/**
	 * Computes the cross product of two vec2's
	 * Note that the cross product must by definition produce a 3D vector
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec3} out
	 */
	vec2.cross = function(out, a, b) {
	    var z = a[0] * b[1] - a[1] * b[0];
	    out[0] = out[1] = 0;
	    out[2] = z;
	    return out;
	};

	/**
	 * Performs a linear interpolation between two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec2} out
	 */
	vec2.lerp = function (out, a, b, t) {
	    var ax = a[0],
	        ay = a[1];
	    out[0] = ax + t * (b[0] - ax);
	    out[1] = ay + t * (b[1] - ay);
	    return out;
	};

	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec2} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec2} out
	 */
	vec2.random = function (out, scale) {
	    scale = scale || 1.0;
	    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
	    out[0] = Math.cos(r) * scale;
	    out[1] = Math.sin(r) * scale;
	    return out;
	};

	/**
	 * Transforms the vec2 with a mat2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat2} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat2 = function(out, a, m) {
	    var x = a[0],
	        y = a[1];
	    out[0] = m[0] * x + m[2] * y;
	    out[1] = m[1] * x + m[3] * y;
	    return out;
	};

	/**
	 * Transforms the vec2 with a mat2d
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat2d} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat2d = function(out, a, m) {
	    var x = a[0],
	        y = a[1];
	    out[0] = m[0] * x + m[2] * y + m[4];
	    out[1] = m[1] * x + m[3] * y + m[5];
	    return out;
	};

	/**
	 * Transforms the vec2 with a mat3
	 * 3rd vector component is implicitly '1'
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat3} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat3 = function(out, a, m) {
	    var x = a[0],
	        y = a[1];
	    out[0] = m[0] * x + m[3] * y + m[6];
	    out[1] = m[1] * x + m[4] * y + m[7];
	    return out;
	};

	/**
	 * Transforms the vec2 with a mat4
	 * 3rd vector component is implicitly '0'
	 * 4th vector component is implicitly '1'
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat4 = function(out, a, m) {
	    var x = a[0], 
	        y = a[1];
	    out[0] = m[0] * x + m[4] * y + m[12];
	    out[1] = m[1] * x + m[5] * y + m[13];
	    return out;
	};

	/**
	 * Perform some operation over an array of vec2s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	vec2.forEach = (function() {
	    var vec = vec2.create();

	    return function(a, stride, offset, count, fn, arg) {
	        var i, l;
	        if(!stride) {
	            stride = 2;
	        }

	        if(!offset) {
	            offset = 0;
	        }
	        
	        if(count) {
	            l = Math.min((count * stride) + offset, a.length);
	        } else {
	            l = a.length;
	        }

	        for(i = offset; i < l; i += stride) {
	            vec[0] = a[i]; vec[1] = a[i+1];
	            fn(vec, vec, arg);
	            a[i] = vec[0]; a[i+1] = vec[1];
	        }
	        
	        return a;
	    };
	})();

	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec2} vec vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	vec2.str = function (a) {
	    return 'vec2(' + a[0] + ', ' + a[1] + ')';
	};

	/**
	 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
	 *
	 * @param {vec2} a The first vector.
	 * @param {vec2} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	vec2.exactEquals = function (a, b) {
	    return a[0] === b[0] && a[1] === b[1];
	};

	/**
	 * Returns whether or not the vectors have approximately the same elements in the same position.
	 *
	 * @param {vec2} a The first vector.
	 * @param {vec2} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	vec2.equals = function (a, b) {
	    var a0 = a[0], a1 = a[1];
	    var b0 = b[0], b1 = b[1];
	    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
	            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)));
	};

	module.exports = vec2;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = __webpack_require__(23);

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/*!
	 * StringBuilder
	 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */
	var XRegExp = __webpack_require__(25).XRegExp
	  , stream = __webpack_require__(26)
	  , async = __webpack_require__(47)
	  , util = __webpack_require__(49)
	  , utils = __webpack_require__(51)
	  , Append = __webpack_require__(101)
	  , Insert = __webpack_require__(102)
	  , Replace = __webpack_require__(103);

	/**
	 * XRegExp for formats
	 * 
	 */
	var regexLib = {
		format: '{(?<arg>\\d+)(:(?<format>[^{}]+))?}'
	};

	var _config = { };

	/**
	 * Initialize a new StringBuilder with `options`
	 * 
	 * defaults options:
	 *  - newline='\n'
	 *
	 * @param {Object} options
	 */
	var StringBuilder = module.exports = function StringBuilder(options) {
		var self = this;

		stream.Stream.call(self)

		var ops = options || {};

		if (_config.newline === undefined) {
			var isWindows = process.platform == 'win32';
			_config.newline = isWindows ? '\r\n' : '\n';
		}

		self.newline = ops.newline || _config.newline;
		
		self.instructions = [];   // instruction to build
		self.index = 0;           // index of instruction
			
		self.version = __webpack_require__(104).version;

		return self;
	};

	// inherits base
	util.inherits(StringBuilder, stream.Stream)

	/** 
	 * Configure all instance of StringBuilder with `ops`
	 *
	 * @param {Object} ops
	 */
	StringBuilder.prototype.configure = function(ops) {
		var self = this

		if (ops.newline !== undefined) {
			_config.newline = ops.newline	;
		}
			
		return self;
	};

	/** 
	 * Add instruction into the StringBuilder 
	 *
	 * @param {Object} instruction
	 */
	StringBuilder.prototype.add = function(instruction, type) {
		var self = this
		  , current;
		
		if (type === null && !(/^[air]{1}$/i).test(type) ) {
			type = getTypeInstruction(instruction);
		}

		// if still undefined so, nothing to do
		if (type === null || type === '') return self;

		current = self.instructions[self.index];

		if (current == undefined) { // the first time
			self.instructions[self.index]  = { type:type,  items: [instruction]}
			return self;
		}

		// `Append` all in one
		if (type === 'a' && current.type === 'a') {
			current.items.push(instruction);
			return self; 
		}	

		self.instructions[++self.index]  = { type:type,  items: [instruction]}
		
		return self;
	};

	/**
	 * Append `arguments`
	 * 
	 * @return {[type]} [description]
	 */
	StringBuilder.prototype.append = function() {
		var self = this;
		
		self.add( new Append( arguments ), 'a' );

		return self; 
	};

	/**
	 * Append a new lines after the arguments
	 * 
	 * @return {StringBuilder}        it self
	 */
	StringBuilder.prototype.appendLine = function() {
		var self = this;
		
		var first = arguments[0] || ''; 

		if (typeof first !== 'string') {
			throw new Error('The first args can\'t be an ' + typeof first);
		}

		arguments[0] =  first !== undefined
						 ? first.concat(self.newline)
				 		 : self.newline;
	    
		self.add( new Append( arguments ), 'a' );
		//self.append(self.newline);

		return self;
	};

	/**
	 *	Insert the `value` at `position`
	 * 
	 * @param  {[type]} value
	 * @param  {[type]} position
	 * @return {StringBuilder}        it self
	 */
	StringBuilder.prototype.insert = function(value, position) {
		var self = this;
		
		return self.add( new Insert(value, position), 'i' );
	};

	/**
	 * Replace `searchvalue` with `newvalue` at before
	 * 
	 * @param  {Object} searchvalue 
	 * @param  {String} newvalue    
	 * @return {StringBuilder}        it self
	 */
	StringBuilder.prototype.replace = function(searchvalue, newvalue) {
		var self = this;
		
		return self.add( new Replace(searchvalue, newvalue), 'r' );
	};

	/**
	 * Overrides toString
	 */
	StringBuilder.prototype.build = function(fn) {
		var self = this;

		var wfall = [];

		wfall.push(function(callback){
			callback(null, '');
		});

		self.instructions.forEach(function(inst){
			if (inst.type === 'a') {
				wfall.push(function(result, callback){
					buildAppends(
						inst.items, 
						function(err, builded) {
							callback(null, result + builded);
						}
					);
				});
			} else if ((/^[ir]{1}$/i).test(inst.type)) {
				var item = inst.items[0];

				if (item != undefined) {
					wfall.push(function(result, callback){
						item.build.apply(item, [result, callback]);
					});
				}

			}
		});

		async.waterfall(
			wfall,
			function(err, result){
				if (err) fn && fn(err)
				fn(null, result);
			}
		);
	};

	/**
	 * Implemet the flush
	 */
	StringBuilder.prototype._flush = function(clean, type) {
		var self = this;

		self.build(function(err, data){
			if (err) {
				self.emit.apply(self, 'error', err);
			} else {
				self.emit.apply(self, [type, data]);
			}

			if (clean) {

			}
		});

		return self;
	};

	/**
	 * Flush the data on the stream an `clean`? the cuerrent
	 * buffer
	 *
	 * @param {Bollean} clean
	 */
	StringBuilder.prototype.flush = function(clean) {
		var self = this;

		clean = clean || false;

	    self._flush(clean, 'data');

		return self;
	};

	/**
	 *
	StringBuilder.prototype.end = function() {
		var self = this;

		self._flush(true, 'end');

		return self;
	};*/

	/**
	 * Write into `stream` the result of the StringBuilder
	 *
	 * @param {Stream} stream
	 * @param {Function} fn
	 */
	StringBuilder.prototype.writeStream = function(stream, fn) {
		var self =  this;

		self.build(function(err, results) {
			if (err) { fn && fn(err) }
			stream.write(results);
		    fn && fn(null, results);
		});

		return self;
	};

	/**
	 * Install the `feature` into Node.js
	 */
	StringBuilder.extend = function(feature) {
		var self = this;
		
		if (feature && feature.toLowerCase() === 'string') {
			extendString();
		}

		return self;
	};

	/**
	 * Overrides toString
	 */
	StringBuilder.prototype.toString = function(fn) {
		var self = this;

		if (fn && typeof fn === 'function') {
			self.build(fn)
		}

		return '[Object StringBuilder]';
	};

	/**
	 * Return the type of `instruction`
	 *   a == 'Append'
	 *   i == 'Insert'
	 *   R == 'Replace'
	 * 
	 *
	 * @param {Object} instruction
	 */
	function getTypeInstruction(instruction) {

		if(false === (this instanceof Append)) {
	        return 'a';
	    }

	    if(false === (this instanceof Insert)) {
	        return 'i';
	    }

	    if(false === (this instanceof Replace)) {
	        return 'r';
	    }

	    return '';
	}

	/**
	 * Build all `items` Append on parallel
	 */
	function buildAppends(items, fn) {
		//console.log(items);
		
		var fns = items.map(function(item){
			return function(callback){
				buildAppend.apply(item, [item, callback]);
			}
		});

		async.parallel(
			fns,
			function(err, results) {
				if (err) fn && fn(err)

				fn(null, results.join(''))
			}
		);

	}

	/**
	 * Build and Append
	 */
	function buildAppend(append, fn){
			
		if ( utils.hasArgs(append.format) ) {
			
			var result = utils.replaceArgs(append.format, append.values);
			
			fn(null, result);
		} else {
			if (true === (append.format instanceof StringBuilder)) {
				append.format.build(fn);
			} else {
				fn(null, append.format.toString());	
			}
		}
	}

	/**
	 * Extends the String object
	 */
	function extendString() {
		
		if (String.format === undefined  && String.prototype.format === undefined) {
			String.format = function() {
				if (arguments === undefined || arguments.length === 0) {
					return '';
				}

				if (arguments.length === 1) {
					return arguments[0];
				}

				var str = arguments[0];
				var values = [];

				for (var i = 1; i < arguments.length; i++) {
					values[i-1] = arguments[i]
				};

				if (utils.hasArgs(str) ) {
					return utils.replaceArgs(str, values);
				}

				return str;
			}

			String.prototype.format = function() {
				var self = String(this);

				if (arguments === undefined || arguments.length === 0) {
					return self;
				}

				var args = [];
				args[0] =  self;

				for (var i=0; i < arguments.length;i++) {
					args[i+1] = arguments[i]
				}
				
				return String.format.apply(null, args);
			}
		}

		if ( String.prototype.toTitleCase === undefined  
			&& String.prototype.toCamelCase === undefined
			&& String.prototype.toJsonCase === undefined) {

			String.prototype.toTitleCase = function(clean) {
				return utils.toTitleCase(String(this), clean);
			}

			String.prototype.toCamelCase = function(clean) {
				return utils.toCamelCase(String(this), clean);
			}

			String.prototype.toJsonCase = function(clean) {
				return utils.toJsonCase(String(this), clean);
			}
		}
		

	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24)))

/***/ },
/* 24 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	
	/***** xregexp.js *****/

	/*!
	 * XRegExp v2.0.0
	 * (c) 2007-2012 Steven Levithan <http://xregexp.com/>
	 * MIT License
	 */

	/**
	 * XRegExp provides augmented, extensible JavaScript regular expressions. You get new syntax,
	 * flags, and methods beyond what browsers support natively. XRegExp is also a regex utility belt
	 * with tools to make your client-side grepping simpler and more powerful, while freeing you from
	 * worrying about pesky cross-browser inconsistencies and the dubious `lastIndex` property. See
	 * XRegExp's documentation (http://xregexp.com/) for more details.
	 * @module xregexp
	 * @requires N/A
	 */
	var XRegExp;

	// Avoid running twice; that would reset tokens and could break references to native globals
	XRegExp = XRegExp || (function (undef) {
	    "use strict";

	/*--------------------------------------
	 *  Private variables
	 *------------------------------------*/

	    var self,
	        addToken,
	        add,

	// Optional features; can be installed and uninstalled
	        features = {
	            natives: false,
	            extensibility: false
	        },

	// Store native methods to use and restore ("native" is an ES3 reserved keyword)
	        nativ = {
	            exec: RegExp.prototype.exec,
	            test: RegExp.prototype.test,
	            match: String.prototype.match,
	            replace: String.prototype.replace,
	            split: String.prototype.split
	        },

	// Storage for fixed/extended native methods
	        fixed = {},

	// Storage for cached regexes
	        cache = {},

	// Storage for addon tokens
	        tokens = [],

	// Token scopes
	        defaultScope = "default",
	        classScope = "class",

	// Regexes that match native regex syntax
	        nativeTokens = {
	            // Any native multicharacter token in default scope (includes octals, excludes character classes)
	            "default": /^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/,
	            // Any native multicharacter token in character class scope (includes octals)
	            "class": /^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/
	        },

	// Any backreference in replacement strings
	        replacementToken = /\$(?:{([\w$]+)}|(\d\d?|[\s\S]))/g,

	// Any character with a later instance in the string
	        duplicateFlags = /([\s\S])(?=[\s\S]*\1)/g,

	// Any greedy/lazy quantifier
	        quantifier = /^(?:[?*+]|{\d+(?:,\d*)?})\??/,

	// Check for correct `exec` handling of nonparticipating capturing groups
	        compliantExecNpcg = nativ.exec.call(/()??/, "")[1] === undef,

	// Check for flag y support (Firefox 3+)
	        hasNativeY = RegExp.prototype.sticky !== undef,

	// Used to kill infinite recursion during XRegExp construction
	        isInsideConstructor = false,

	// Storage for known flags, including addon flags
	        registeredFlags = "gim" + (hasNativeY ? "y" : "");

	/*--------------------------------------
	 *  Private helper functions
	 *------------------------------------*/

	/**
	 * Attaches XRegExp.prototype properties and named capture supporting data to a regex object.
	 * @private
	 * @param {RegExp} regex Regex to augment.
	 * @param {Array} captureNames Array with capture names, or null.
	 * @param {Boolean} [isNative] Whether the regex was created by `RegExp` rather than `XRegExp`.
	 * @returns {RegExp} Augmented regex.
	 */
	    function augment(regex, captureNames, isNative) {
	        var p;
	        // Can't auto-inherit these since the XRegExp constructor returns a nonprimitive value
	        for (p in self.prototype) {
	            if (self.prototype.hasOwnProperty(p)) {
	                regex[p] = self.prototype[p];
	            }
	        }
	        regex.xregexp = {captureNames: captureNames, isNative: !!isNative};
	        return regex;
	    }

	/**
	 * Returns native `RegExp` flags used by a regex object.
	 * @private
	 * @param {RegExp} regex Regex to check.
	 * @returns {String} Native flags in use.
	 */
	    function getNativeFlags(regex) {
	        //return nativ.exec.call(/\/([a-z]*)$/i, String(regex))[1];
	        return (regex.global     ? "g" : "") +
	               (regex.ignoreCase ? "i" : "") +
	               (regex.multiline  ? "m" : "") +
	               (regex.extended   ? "x" : "") + // Proposed for ES6, included in AS3
	               (regex.sticky     ? "y" : ""); // Proposed for ES6, included in Firefox 3+
	    }

	/**
	 * Copies a regex object while preserving special properties for named capture and augmenting with
	 * `XRegExp.prototype` methods. The copy has a fresh `lastIndex` property (set to zero). Allows
	 * adding and removing flags while copying the regex.
	 * @private
	 * @param {RegExp} regex Regex to copy.
	 * @param {String} [addFlags] Flags to be added while copying the regex.
	 * @param {String} [removeFlags] Flags to be removed while copying the regex.
	 * @returns {RegExp} Copy of the provided regex, possibly with modified flags.
	 */
	    function copy(regex, addFlags, removeFlags) {
	        if (!self.isRegExp(regex)) {
	            throw new TypeError("type RegExp expected");
	        }
	        var flags = nativ.replace.call(getNativeFlags(regex) + (addFlags || ""), duplicateFlags, "");
	        if (removeFlags) {
	            // Would need to escape `removeFlags` if this was public
	            flags = nativ.replace.call(flags, new RegExp("[" + removeFlags + "]+", "g"), "");
	        }
	        if (regex.xregexp && !regex.xregexp.isNative) {
	            // Compiling the current (rather than precompilation) source preserves the effects of nonnative source flags
	            regex = augment(self(regex.source, flags),
	                            regex.xregexp.captureNames ? regex.xregexp.captureNames.slice(0) : null);
	        } else {
	            // Augment with `XRegExp.prototype` methods, but use native `RegExp` (avoid searching for special tokens)
	            regex = augment(new RegExp(regex.source, flags), null, true);
	        }
	        return regex;
	    }

	/*
	 * Returns the last index at which a given value can be found in an array, or `-1` if it's not
	 * present. The array is searched backwards.
	 * @private
	 * @param {Array} array Array to search.
	 * @param {*} value Value to locate in the array.
	 * @returns {Number} Last zero-based index at which the item is found, or -1.
	 */
	    function lastIndexOf(array, value) {
	        var i = array.length;
	        if (Array.prototype.lastIndexOf) {
	            return array.lastIndexOf(value); // Use the native method if available
	        }
	        while (i--) {
	            if (array[i] === value) {
	                return i;
	            }
	        }
	        return -1;
	    }

	/**
	 * Determines whether an object is of the specified type.
	 * @private
	 * @param {*} value Object to check.
	 * @param {String} type Type to check for, in lowercase.
	 * @returns {Boolean} Whether the object matches the type.
	 */
	    function isType(value, type) {
	        return Object.prototype.toString.call(value).toLowerCase() === "[object " + type + "]";
	    }

	/**
	 * Prepares an options object from the given value.
	 * @private
	 * @param {String|Object} value Value to convert to an options object.
	 * @returns {Object} Options object.
	 */
	    function prepareOptions(value) {
	        value = value || {};
	        if (value === "all" || value.all) {
	            value = {natives: true, extensibility: true};
	        } else if (isType(value, "string")) {
	            value = self.forEach(value, /[^\s,]+/, function (m) {
	                this[m] = true;
	            }, {});
	        }
	        return value;
	    }

	/**
	 * Runs built-in/custom tokens in reverse insertion order, until a match is found.
	 * @private
	 * @param {String} pattern Original pattern from which an XRegExp object is being built.
	 * @param {Number} pos Position to search for tokens within `pattern`.
	 * @param {Number} scope Current regex scope.
	 * @param {Object} context Context object assigned to token handler functions.
	 * @returns {Object} Object with properties `output` (the substitution string returned by the
	 *   successful token handler) and `match` (the token's match array), or null.
	 */
	    function runTokens(pattern, pos, scope, context) {
	        var i = tokens.length,
	            result = null,
	            match,
	            t;
	        // Protect against constructing XRegExps within token handler and trigger functions
	        isInsideConstructor = true;
	        // Must reset `isInsideConstructor`, even if a `trigger` or `handler` throws
	        try {
	            while (i--) { // Run in reverse order
	                t = tokens[i];
	                if ((t.scope === "all" || t.scope === scope) && (!t.trigger || t.trigger.call(context))) {
	                    t.pattern.lastIndex = pos;
	                    match = fixed.exec.call(t.pattern, pattern); // Fixed `exec` here allows use of named backreferences, etc.
	                    if (match && match.index === pos) {
	                        result = {
	                            output: t.handler.call(context, match, scope),
	                            match: match
	                        };
	                        break;
	                    }
	                }
	            }
	        } catch (err) {
	            throw err;
	        } finally {
	            isInsideConstructor = false;
	        }
	        return result;
	    }

	/**
	 * Enables or disables XRegExp syntax and flag extensibility.
	 * @private
	 * @param {Boolean} on `true` to enable; `false` to disable.
	 */
	    function setExtensibility(on) {
	        self.addToken = addToken[on ? "on" : "off"];
	        features.extensibility = on;
	    }

	/**
	 * Enables or disables native method overrides.
	 * @private
	 * @param {Boolean} on `true` to enable; `false` to disable.
	 */
	    function setNatives(on) {
	        RegExp.prototype.exec = (on ? fixed : nativ).exec;
	        RegExp.prototype.test = (on ? fixed : nativ).test;
	        String.prototype.match = (on ? fixed : nativ).match;
	        String.prototype.replace = (on ? fixed : nativ).replace;
	        String.prototype.split = (on ? fixed : nativ).split;
	        features.natives = on;
	    }

	/*--------------------------------------
	 *  Constructor
	 *------------------------------------*/

	/**
	 * Creates an extended regular expression object for matching text with a pattern. Differs from a
	 * native regular expression in that additional syntax and flags are supported. The returned object
	 * is in fact a native `RegExp` and works with all native methods.
	 * @class XRegExp
	 * @constructor
	 * @param {String|RegExp} pattern Regex pattern string, or an existing `RegExp` object to copy.
	 * @param {String} [flags] Any combination of flags:
	 *   <li>`g` - global
	 *   <li>`i` - ignore case
	 *   <li>`m` - multiline anchors
	 *   <li>`n` - explicit capture
	 *   <li>`s` - dot matches all (aka singleline)
	 *   <li>`x` - free-spacing and line comments (aka extended)
	 *   <li>`y` - sticky (Firefox 3+ only)
	 *   Flags cannot be provided when constructing one `RegExp` from another.
	 * @returns {RegExp} Extended regular expression object.
	 * @example
	 *
	 * // With named capture and flag x
	 * date = XRegExp('(?<year>  [0-9]{4}) -?  # year  \n\
	 *                 (?<month> [0-9]{2}) -?  # month \n\
	 *                 (?<day>   [0-9]{2})     # day   ', 'x');
	 *
	 * // Passing a regex object to copy it. The copy maintains special properties for named capture,
	 * // is augmented with `XRegExp.prototype` methods, and has a fresh `lastIndex` property (set to
	 * // zero). Native regexes are not recompiled using XRegExp syntax.
	 * XRegExp(/regex/);
	 */
	    self = function (pattern, flags) {
	        if (self.isRegExp(pattern)) {
	            if (flags !== undef) {
	                throw new TypeError("can't supply flags when constructing one RegExp from another");
	            }
	            return copy(pattern);
	        }
	        // Tokens become part of the regex construction process, so protect against infinite recursion
	        // when an XRegExp is constructed within a token handler function
	        if (isInsideConstructor) {
	            throw new Error("can't call the XRegExp constructor within token definition functions");
	        }

	        var output = [],
	            scope = defaultScope,
	            tokenContext = {
	                hasNamedCapture: false,
	                captureNames: [],
	                hasFlag: function (flag) {
	                    return flags.indexOf(flag) > -1;
	                }
	            },
	            pos = 0,
	            tokenResult,
	            match,
	            chr;
	        pattern = pattern === undef ? "" : String(pattern);
	        flags = flags === undef ? "" : String(flags);

	        if (nativ.match.call(flags, duplicateFlags)) { // Don't use test/exec because they would update lastIndex
	            throw new SyntaxError("invalid duplicate regular expression flag");
	        }
	        // Strip/apply leading mode modifier with any combination of flags except g or y: (?imnsx)
	        pattern = nativ.replace.call(pattern, /^\(\?([\w$]+)\)/, function ($0, $1) {
	            if (nativ.test.call(/[gy]/, $1)) {
	                throw new SyntaxError("can't use flag g or y in mode modifier");
	            }
	            flags = nativ.replace.call(flags + $1, duplicateFlags, "");
	            return "";
	        });
	        self.forEach(flags, /[\s\S]/, function (m) {
	            if (registeredFlags.indexOf(m[0]) < 0) {
	                throw new SyntaxError("invalid regular expression flag " + m[0]);
	            }
	        });

	        while (pos < pattern.length) {
	            // Check for custom tokens at the current position
	            tokenResult = runTokens(pattern, pos, scope, tokenContext);
	            if (tokenResult) {
	                output.push(tokenResult.output);
	                pos += (tokenResult.match[0].length || 1);
	            } else {
	                // Check for native tokens (except character classes) at the current position
	                match = nativ.exec.call(nativeTokens[scope], pattern.slice(pos));
	                if (match) {
	                    output.push(match[0]);
	                    pos += match[0].length;
	                } else {
	                    chr = pattern.charAt(pos);
	                    if (chr === "[") {
	                        scope = classScope;
	                    } else if (chr === "]") {
	                        scope = defaultScope;
	                    }
	                    // Advance position by one character
	                    output.push(chr);
	                    ++pos;
	                }
	            }
	        }

	        return augment(new RegExp(output.join(""), nativ.replace.call(flags, /[^gimy]+/g, "")),
	                       tokenContext.hasNamedCapture ? tokenContext.captureNames : null);
	    };

	/*--------------------------------------
	 *  Public methods/properties
	 *------------------------------------*/

	// Installed and uninstalled states for `XRegExp.addToken`
	    addToken = {
	        on: function (regex, handler, options) {
	            options = options || {};
	            if (regex) {
	                tokens.push({
	                    pattern: copy(regex, "g" + (hasNativeY ? "y" : "")),
	                    handler: handler,
	                    scope: options.scope || defaultScope,
	                    trigger: options.trigger || null
	                });
	            }
	            // Providing `customFlags` with null `regex` and `handler` allows adding flags that do
	            // nothing, but don't throw an error
	            if (options.customFlags) {
	                registeredFlags = nativ.replace.call(registeredFlags + options.customFlags, duplicateFlags, "");
	            }
	        },
	        off: function () {
	            throw new Error("extensibility must be installed before using addToken");
	        }
	    };

	/**
	 * Extends or changes XRegExp syntax and allows custom flags. This is used internally and can be
	 * used to create XRegExp addons. `XRegExp.install('extensibility')` must be run before calling
	 * this function, or an error is thrown. If more than one token can match the same string, the last
	 * added wins.
	 * @memberOf XRegExp
	 * @param {RegExp} regex Regex object that matches the new token.
	 * @param {Function} handler Function that returns a new pattern string (using native regex syntax)
	 *   to replace the matched token within all future XRegExp regexes. Has access to persistent
	 *   properties of the regex being built, through `this`. Invoked with two arguments:
	 *   <li>The match array, with named backreference properties.
	 *   <li>The regex scope where the match was found.
	 * @param {Object} [options] Options object with optional properties:
	 *   <li>`scope` {String} Scopes where the token applies: 'default', 'class', or 'all'.
	 *   <li>`trigger` {Function} Function that returns `true` when the token should be applied; e.g.,
	 *     if a flag is set. If `false` is returned, the matched string can be matched by other tokens.
	 *     Has access to persistent properties of the regex being built, through `this` (including
	 *     function `this.hasFlag`).
	 *   <li>`customFlags` {String} Nonnative flags used by the token's handler or trigger functions.
	 *     Prevents XRegExp from throwing an invalid flag error when the specified flags are used.
	 * @example
	 *
	 * // Basic usage: Adds \a for ALERT character
	 * XRegExp.addToken(
	 *   /\\a/,
	 *   function () {return '\\x07';},
	 *   {scope: 'all'}
	 * );
	 * XRegExp('\\a[\\a-\\n]+').test('\x07\n\x07'); // -> true
	 */
	    self.addToken = addToken.off;

	/**
	 * Caches and returns the result of calling `XRegExp(pattern, flags)`. On any subsequent call with
	 * the same pattern and flag combination, the cached copy is returned.
	 * @memberOf XRegExp
	 * @param {String} pattern Regex pattern string.
	 * @param {String} [flags] Any combination of XRegExp flags.
	 * @returns {RegExp} Cached XRegExp object.
	 * @example
	 *
	 * while (match = XRegExp.cache('.', 'gs').exec(str)) {
	 *   // The regex is compiled once only
	 * }
	 */
	    self.cache = function (pattern, flags) {
	        var key = pattern + "/" + (flags || "");
	        return cache[key] || (cache[key] = self(pattern, flags));
	    };

	/**
	 * Escapes any regular expression metacharacters, for use when matching literal strings. The result
	 * can safely be used at any point within a regex that uses any flags.
	 * @memberOf XRegExp
	 * @param {String} str String to escape.
	 * @returns {String} String with regex metacharacters escaped.
	 * @example
	 *
	 * XRegExp.escape('Escaped? <.>');
	 * // -> 'Escaped\?\ <\.>'
	 */
	    self.escape = function (str) {
	        return nativ.replace.call(str, /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	    };

	/**
	 * Executes a regex search in a specified string. Returns a match array or `null`. If the provided
	 * regex uses named capture, named backreference properties are included on the match array.
	 * Optional `pos` and `sticky` arguments specify the search start position, and whether the match
	 * must start at the specified position only. The `lastIndex` property of the provided regex is not
	 * used, but is updated for compatibility. Also fixes browser bugs compared to the native
	 * `RegExp.prototype.exec` and can be used reliably cross-browser.
	 * @memberOf XRegExp
	 * @param {String} str String to search.
	 * @param {RegExp} regex Regex to search with.
	 * @param {Number} [pos=0] Zero-based index at which to start the search.
	 * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
	 *   only. The string `'sticky'` is accepted as an alternative to `true`.
	 * @returns {Array} Match array with named backreference properties, or null.
	 * @example
	 *
	 * // Basic use, with named backreference
	 * var match = XRegExp.exec('U+2620', XRegExp('U\\+(?<hex>[0-9A-F]{4})'));
	 * match.hex; // -> '2620'
	 *
	 * // With pos and sticky, in a loop
	 * var pos = 2, result = [], match;
	 * while (match = XRegExp.exec('<1><2><3><4>5<6>', /<(\d)>/, pos, 'sticky')) {
	 *   result.push(match[1]);
	 *   pos = match.index + match[0].length;
	 * }
	 * // result -> ['2', '3', '4']
	 */
	    self.exec = function (str, regex, pos, sticky) {
	        var r2 = copy(regex, "g" + (sticky && hasNativeY ? "y" : ""), (sticky === false ? "y" : "")),
	            match;
	        r2.lastIndex = pos = pos || 0;
	        match = fixed.exec.call(r2, str); // Fixed `exec` required for `lastIndex` fix, etc.
	        if (sticky && match && match.index !== pos) {
	            match = null;
	        }
	        if (regex.global) {
	            regex.lastIndex = match ? r2.lastIndex : 0;
	        }
	        return match;
	    };

	/**
	 * Executes a provided function once per regex match.
	 * @memberOf XRegExp
	 * @param {String} str String to search.
	 * @param {RegExp} regex Regex to search with.
	 * @param {Function} callback Function to execute for each match. Invoked with four arguments:
	 *   <li>The match array, with named backreference properties.
	 *   <li>The zero-based match index.
	 *   <li>The string being traversed.
	 *   <li>The regex object being used to traverse the string.
	 * @param {*} [context] Object to use as `this` when executing `callback`.
	 * @returns {*} Provided `context` object.
	 * @example
	 *
	 * // Extracts every other digit from a string
	 * XRegExp.forEach('1a2345', /\d/, function (match, i) {
	 *   if (i % 2) this.push(+match[0]);
	 * }, []);
	 * // -> [2, 4]
	 */
	    self.forEach = function (str, regex, callback, context) {
	        var pos = 0,
	            i = -1,
	            match;
	        while ((match = self.exec(str, regex, pos))) {
	            callback.call(context, match, ++i, str, regex);
	            pos = match.index + (match[0].length || 1);
	        }
	        return context;
	    };

	/**
	 * Copies a regex object and adds flag `g`. The copy maintains special properties for named
	 * capture, is augmented with `XRegExp.prototype` methods, and has a fresh `lastIndex` property
	 * (set to zero). Native regexes are not recompiled using XRegExp syntax.
	 * @memberOf XRegExp
	 * @param {RegExp} regex Regex to globalize.
	 * @returns {RegExp} Copy of the provided regex with flag `g` added.
	 * @example
	 *
	 * var globalCopy = XRegExp.globalize(/regex/);
	 * globalCopy.global; // -> true
	 */
	    self.globalize = function (regex) {
	        return copy(regex, "g");
	    };

	/**
	 * Installs optional features according to the specified options.
	 * @memberOf XRegExp
	 * @param {Object|String} options Options object or string.
	 * @example
	 *
	 * // With an options object
	 * XRegExp.install({
	 *   // Overrides native regex methods with fixed/extended versions that support named
	 *   // backreferences and fix numerous cross-browser bugs
	 *   natives: true,
	 *
	 *   // Enables extensibility of XRegExp syntax and flags
	 *   extensibility: true
	 * });
	 *
	 * // With an options string
	 * XRegExp.install('natives extensibility');
	 *
	 * // Using a shortcut to install all optional features
	 * XRegExp.install('all');
	 */
	    self.install = function (options) {
	        options = prepareOptions(options);
	        if (!features.natives && options.natives) {
	            setNatives(true);
	        }
	        if (!features.extensibility && options.extensibility) {
	            setExtensibility(true);
	        }
	    };

	/**
	 * Checks whether an individual optional feature is installed.
	 * @memberOf XRegExp
	 * @param {String} feature Name of the feature to check. One of:
	 *   <li>`natives`
	 *   <li>`extensibility`
	 * @returns {Boolean} Whether the feature is installed.
	 * @example
	 *
	 * XRegExp.isInstalled('natives');
	 */
	    self.isInstalled = function (feature) {
	        return !!(features[feature]);
	    };

	/**
	 * Returns `true` if an object is a regex; `false` if it isn't. This works correctly for regexes
	 * created in another frame, when `instanceof` and `constructor` checks would fail.
	 * @memberOf XRegExp
	 * @param {*} value Object to check.
	 * @returns {Boolean} Whether the object is a `RegExp` object.
	 * @example
	 *
	 * XRegExp.isRegExp('string'); // -> false
	 * XRegExp.isRegExp(/regex/i); // -> true
	 * XRegExp.isRegExp(RegExp('^', 'm')); // -> true
	 * XRegExp.isRegExp(XRegExp('(?s).')); // -> true
	 */
	    self.isRegExp = function (value) {
	        return isType(value, "regexp");
	    };

	/**
	 * Retrieves the matches from searching a string using a chain of regexes that successively search
	 * within previous matches. The provided `chain` array can contain regexes and objects with `regex`
	 * and `backref` properties. When a backreference is specified, the named or numbered backreference
	 * is passed forward to the next regex or returned.
	 * @memberOf XRegExp
	 * @param {String} str String to search.
	 * @param {Array} chain Regexes that each search for matches within preceding results.
	 * @returns {Array} Matches by the last regex in the chain, or an empty array.
	 * @example
	 *
	 * // Basic usage; matches numbers within <b> tags
	 * XRegExp.matchChain('1 <b>2</b> 3 <b>4 a 56</b>', [
	 *   XRegExp('(?is)<b>.*?</b>'),
	 *   /\d+/
	 * ]);
	 * // -> ['2', '4', '56']
	 *
	 * // Passing forward and returning specific backreferences
	 * html = '<a href="http://xregexp.com/api/">XRegExp</a>\
	 *         <a href="http://www.google.com/">Google</a>';
	 * XRegExp.matchChain(html, [
	 *   {regex: /<a href="([^"]+)">/i, backref: 1},
	 *   {regex: XRegExp('(?i)^https?://(?<domain>[^/?#]+)'), backref: 'domain'}
	 * ]);
	 * // -> ['xregexp.com', 'www.google.com']
	 */
	    self.matchChain = function (str, chain) {
	        return (function recurseChain(values, level) {
	            var item = chain[level].regex ? chain[level] : {regex: chain[level]},
	                matches = [],
	                addMatch = function (match) {
	                    matches.push(item.backref ? (match[item.backref] || "") : match[0]);
	                },
	                i;
	            for (i = 0; i < values.length; ++i) {
	                self.forEach(values[i], item.regex, addMatch);
	            }
	            return ((level === chain.length - 1) || !matches.length) ?
	                    matches :
	                    recurseChain(matches, level + 1);
	        }([str], 0));
	    };

	/**
	 * Returns a new string with one or all matches of a pattern replaced. The pattern can be a string
	 * or regex, and the replacement can be a string or a function to be called for each match. To
	 * perform a global search and replace, use the optional `scope` argument or include flag `g` if
	 * using a regex. Replacement strings can use `${n}` for named and numbered backreferences.
	 * Replacement functions can use named backreferences via `arguments[0].name`. Also fixes browser
	 * bugs compared to the native `String.prototype.replace` and can be used reliably cross-browser.
	 * @memberOf XRegExp
	 * @param {String} str String to search.
	 * @param {RegExp|String} search Search pattern to be replaced.
	 * @param {String|Function} replacement Replacement string or a function invoked to create it.
	 *   Replacement strings can include special replacement syntax:
	 *     <li>$$ - Inserts a literal '$'.
	 *     <li>$&, $0 - Inserts the matched substring.
	 *     <li>$` - Inserts the string that precedes the matched substring (left context).
	 *     <li>$' - Inserts the string that follows the matched substring (right context).
	 *     <li>$n, $nn - Where n/nn are digits referencing an existent capturing group, inserts
	 *       backreference n/nn.
	 *     <li>${n} - Where n is a name or any number of digits that reference an existent capturing
	 *       group, inserts backreference n.
	 *   Replacement functions are invoked with three or more arguments:
	 *     <li>The matched substring (corresponds to $& above). Named backreferences are accessible as
	 *       properties of this first argument.
	 *     <li>0..n arguments, one for each backreference (corresponding to $1, $2, etc. above).
	 *     <li>The zero-based index of the match within the total search string.
	 *     <li>The total string being searched.
	 * @param {String} [scope='one'] Use 'one' to replace the first match only, or 'all'. If not
	 *   explicitly specified and using a regex with flag `g`, `scope` is 'all'.
	 * @returns {String} New string with one or all matches replaced.
	 * @example
	 *
	 * // Regex search, using named backreferences in replacement string
	 * var name = XRegExp('(?<first>\\w+) (?<last>\\w+)');
	 * XRegExp.replace('John Smith', name, '${last}, ${first}');
	 * // -> 'Smith, John'
	 *
	 * // Regex search, using named backreferences in replacement function
	 * XRegExp.replace('John Smith', name, function (match) {
	 *   return match.last + ', ' + match.first;
	 * });
	 * // -> 'Smith, John'
	 *
	 * // Global string search/replacement
	 * XRegExp.replace('RegExp builds RegExps', 'RegExp', 'XRegExp', 'all');
	 * // -> 'XRegExp builds XRegExps'
	 */
	    self.replace = function (str, search, replacement, scope) {
	        var isRegex = self.isRegExp(search),
	            search2 = search,
	            result;
	        if (isRegex) {
	            if (scope === undef && search.global) {
	                scope = "all"; // Follow flag g when `scope` isn't explicit
	            }
	            // Note that since a copy is used, `search`'s `lastIndex` isn't updated *during* replacement iterations
	            search2 = copy(search, scope === "all" ? "g" : "", scope === "all" ? "" : "g");
	        } else if (scope === "all") {
	            search2 = new RegExp(self.escape(String(search)), "g");
	        }
	        result = fixed.replace.call(String(str), search2, replacement); // Fixed `replace` required for named backreferences, etc.
	        if (isRegex && search.global) {
	            search.lastIndex = 0; // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
	        }
	        return result;
	    };

	/**
	 * Splits a string into an array of strings using a regex or string separator. Matches of the
	 * separator are not included in the result array. However, if `separator` is a regex that contains
	 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
	 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
	 * cross-browser.
	 * @memberOf XRegExp
	 * @param {String} str String to split.
	 * @param {RegExp|String} separator Regex or string to use for separating the string.
	 * @param {Number} [limit] Maximum number of items to include in the result array.
	 * @returns {Array} Array of substrings.
	 * @example
	 *
	 * // Basic use
	 * XRegExp.split('a b c', ' ');
	 * // -> ['a', 'b', 'c']
	 *
	 * // With limit
	 * XRegExp.split('a b c', ' ', 2);
	 * // -> ['a', 'b']
	 *
	 * // Backreferences in result array
	 * XRegExp.split('..word1..', /([a-z]+)(\d+)/i);
	 * // -> ['..', 'word', '1', '..']
	 */
	    self.split = function (str, separator, limit) {
	        return fixed.split.call(str, separator, limit);
	    };

	/**
	 * Executes a regex search in a specified string. Returns `true` or `false`. Optional `pos` and
	 * `sticky` arguments specify the search start position, and whether the match must start at the
	 * specified position only. The `lastIndex` property of the provided regex is not used, but is
	 * updated for compatibility. Also fixes browser bugs compared to the native
	 * `RegExp.prototype.test` and can be used reliably cross-browser.
	 * @memberOf XRegExp
	 * @param {String} str String to search.
	 * @param {RegExp} regex Regex to search with.
	 * @param {Number} [pos=0] Zero-based index at which to start the search.
	 * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
	 *   only. The string `'sticky'` is accepted as an alternative to `true`.
	 * @returns {Boolean} Whether the regex matched the provided value.
	 * @example
	 *
	 * // Basic use
	 * XRegExp.test('abc', /c/); // -> true
	 *
	 * // With pos and sticky
	 * XRegExp.test('abc', /c/, 0, 'sticky'); // -> false
	 */
	    self.test = function (str, regex, pos, sticky) {
	        // Do this the easy way :-)
	        return !!self.exec(str, regex, pos, sticky);
	    };

	/**
	 * Uninstalls optional features according to the specified options.
	 * @memberOf XRegExp
	 * @param {Object|String} options Options object or string.
	 * @example
	 *
	 * // With an options object
	 * XRegExp.uninstall({
	 *   // Restores native regex methods
	 *   natives: true,
	 *
	 *   // Disables additional syntax and flag extensions
	 *   extensibility: true
	 * });
	 *
	 * // With an options string
	 * XRegExp.uninstall('natives extensibility');
	 *
	 * // Using a shortcut to uninstall all optional features
	 * XRegExp.uninstall('all');
	 */
	    self.uninstall = function (options) {
	        options = prepareOptions(options);
	        if (features.natives && options.natives) {
	            setNatives(false);
	        }
	        if (features.extensibility && options.extensibility) {
	            setExtensibility(false);
	        }
	    };

	/**
	 * Returns an XRegExp object that is the union of the given patterns. Patterns can be provided as
	 * regex objects or strings. Metacharacters are escaped in patterns provided as strings.
	 * Backreferences in provided regex objects are automatically renumbered to work correctly. Native
	 * flags used by provided regexes are ignored in favor of the `flags` argument.
	 * @memberOf XRegExp
	 * @param {Array} patterns Regexes and strings to combine.
	 * @param {String} [flags] Any combination of XRegExp flags.
	 * @returns {RegExp} Union of the provided regexes and strings.
	 * @example
	 *
	 * XRegExp.union(['a+b*c', /(dogs)\1/, /(cats)\1/], 'i');
	 * // -> /a\+b\*c|(dogs)\1|(cats)\2/i
	 *
	 * XRegExp.union([XRegExp('(?<pet>dogs)\\k<pet>'), XRegExp('(?<pet>cats)\\k<pet>')]);
	 * // -> XRegExp('(?<pet>dogs)\\k<pet>|(?<pet>cats)\\k<pet>')
	 */
	    self.union = function (patterns, flags) {
	        var parts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g,
	            numCaptures = 0,
	            numPriorCaptures,
	            captureNames,
	            rewrite = function (match, paren, backref) {
	                var name = captureNames[numCaptures - numPriorCaptures];
	                if (paren) { // Capturing group
	                    ++numCaptures;
	                    if (name) { // If the current capture has a name
	                        return "(?<" + name + ">";
	                    }
	                } else if (backref) { // Backreference
	                    return "\\" + (+backref + numPriorCaptures);
	                }
	                return match;
	            },
	            output = [],
	            pattern,
	            i;
	        if (!(isType(patterns, "array") && patterns.length)) {
	            throw new TypeError("patterns must be a nonempty array");
	        }
	        for (i = 0; i < patterns.length; ++i) {
	            pattern = patterns[i];
	            if (self.isRegExp(pattern)) {
	                numPriorCaptures = numCaptures;
	                captureNames = (pattern.xregexp && pattern.xregexp.captureNames) || [];
	                // Rewrite backreferences. Passing to XRegExp dies on octals and ensures patterns
	                // are independently valid; helps keep this simple. Named captures are put back
	                output.push(self(pattern.source).source.replace(parts, rewrite));
	            } else {
	                output.push(self.escape(pattern));
	            }
	        }
	        return self(output.join("|"), flags);
	    };

	/**
	 * The XRegExp version number.
	 * @static
	 * @memberOf XRegExp
	 * @type String
	 */
	    self.version = "2.0.0";

	/*--------------------------------------
	 *  Fixed/extended native methods
	 *------------------------------------*/

	/**
	 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
	 * bugs in the native `RegExp.prototype.exec`. Calling `XRegExp.install('natives')` uses this to
	 * override the native method. Use via `XRegExp.exec` without overriding natives.
	 * @private
	 * @param {String} str String to search.
	 * @returns {Array} Match array with named backreference properties, or null.
	 */
	    fixed.exec = function (str) {
	        var match, name, r2, origLastIndex, i;
	        if (!this.global) {
	            origLastIndex = this.lastIndex;
	        }
	        match = nativ.exec.apply(this, arguments);
	        if (match) {
	            // Fix browsers whose `exec` methods don't consistently return `undefined` for
	            // nonparticipating capturing groups
	            if (!compliantExecNpcg && match.length > 1 && lastIndexOf(match, "") > -1) {
	                r2 = new RegExp(this.source, nativ.replace.call(getNativeFlags(this), "g", ""));
	                // Using `str.slice(match.index)` rather than `match[0]` in case lookahead allowed
	                // matching due to characters outside the match
	                nativ.replace.call(String(str).slice(match.index), r2, function () {
	                    var i;
	                    for (i = 1; i < arguments.length - 2; ++i) {
	                        if (arguments[i] === undef) {
	                            match[i] = undef;
	                        }
	                    }
	                });
	            }
	            // Attach named capture properties
	            if (this.xregexp && this.xregexp.captureNames) {
	                for (i = 1; i < match.length; ++i) {
	                    name = this.xregexp.captureNames[i - 1];
	                    if (name) {
	                        match[name] = match[i];
	                    }
	                }
	            }
	            // Fix browsers that increment `lastIndex` after zero-length matches
	            if (this.global && !match[0].length && (this.lastIndex > match.index)) {
	                this.lastIndex = match.index;
	            }
	        }
	        if (!this.global) {
	            this.lastIndex = origLastIndex; // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
	        }
	        return match;
	    };

	/**
	 * Fixes browser bugs in the native `RegExp.prototype.test`. Calling `XRegExp.install('natives')`
	 * uses this to override the native method.
	 * @private
	 * @param {String} str String to search.
	 * @returns {Boolean} Whether the regex matched the provided value.
	 */
	    fixed.test = function (str) {
	        // Do this the easy way :-)
	        return !!fixed.exec.call(this, str);
	    };

	/**
	 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
	 * bugs in the native `String.prototype.match`. Calling `XRegExp.install('natives')` uses this to
	 * override the native method.
	 * @private
	 * @param {RegExp} regex Regex to search with.
	 * @returns {Array} If `regex` uses flag g, an array of match strings or null. Without flag g, the
	 *   result of calling `regex.exec(this)`.
	 */
	    fixed.match = function (regex) {
	        if (!self.isRegExp(regex)) {
	            regex = new RegExp(regex); // Use native `RegExp`
	        } else if (regex.global) {
	            var result = nativ.match.apply(this, arguments);
	            regex.lastIndex = 0; // Fixes IE bug
	            return result;
	        }
	        return fixed.exec.call(regex, this);
	    };

	/**
	 * Adds support for `${n}` tokens for named and numbered backreferences in replacement text, and
	 * provides named backreferences to replacement functions as `arguments[0].name`. Also fixes
	 * browser bugs in replacement text syntax when performing a replacement using a nonregex search
	 * value, and the value of a replacement regex's `lastIndex` property during replacement iterations
	 * and upon completion. Note that this doesn't support SpiderMonkey's proprietary third (`flags`)
	 * argument. Calling `XRegExp.install('natives')` uses this to override the native method. Use via
	 * `XRegExp.replace` without overriding natives.
	 * @private
	 * @param {RegExp|String} search Search pattern to be replaced.
	 * @param {String|Function} replacement Replacement string or a function invoked to create it.
	 * @returns {String} New string with one or all matches replaced.
	 */
	    fixed.replace = function (search, replacement) {
	        var isRegex = self.isRegExp(search), captureNames, result, str, origLastIndex;
	        if (isRegex) {
	            if (search.xregexp) {
	                captureNames = search.xregexp.captureNames;
	            }
	            if (!search.global) {
	                origLastIndex = search.lastIndex;
	            }
	        } else {
	            search += "";
	        }
	        if (isType(replacement, "function")) {
	            result = nativ.replace.call(String(this), search, function () {
	                var args = arguments, i;
	                if (captureNames) {
	                    // Change the `arguments[0]` string primitive to a `String` object that can store properties
	                    args[0] = new String(args[0]);
	                    // Store named backreferences on the first argument
	                    for (i = 0; i < captureNames.length; ++i) {
	                        if (captureNames[i]) {
	                            args[0][captureNames[i]] = args[i + 1];
	                        }
	                    }
	                }
	                // Update `lastIndex` before calling `replacement`.
	                // Fixes IE, Chrome, Firefox, Safari bug (last tested IE 9, Chrome 17, Firefox 11, Safari 5.1)
	                if (isRegex && search.global) {
	                    search.lastIndex = args[args.length - 2] + args[0].length;
	                }
	                return replacement.apply(null, args);
	            });
	        } else {
	            str = String(this); // Ensure `args[args.length - 1]` will be a string when given nonstring `this`
	            result = nativ.replace.call(str, search, function () {
	                var args = arguments; // Keep this function's `arguments` available through closure
	                return nativ.replace.call(String(replacement), replacementToken, function ($0, $1, $2) {
	                    var n;
	                    // Named or numbered backreference with curly brackets
	                    if ($1) {
	                        /* XRegExp behavior for `${n}`:
	                         * 1. Backreference to numbered capture, where `n` is 1+ digits. `0`, `00`, etc. is the entire match.
	                         * 2. Backreference to named capture `n`, if it exists and is not a number overridden by numbered capture.
	                         * 3. Otherwise, it's an error.
	                         */
	                        n = +$1; // Type-convert; drop leading zeros
	                        if (n <= args.length - 3) {
	                            return args[n] || "";
	                        }
	                        n = captureNames ? lastIndexOf(captureNames, $1) : -1;
	                        if (n < 0) {
	                            throw new SyntaxError("backreference to undefined group " + $0);
	                        }
	                        return args[n + 1] || "";
	                    }
	                    // Else, special variable or numbered backreference (without curly brackets)
	                    if ($2 === "$") return "$";
	                    if ($2 === "&" || +$2 === 0) return args[0]; // $&, $0 (not followed by 1-9), $00
	                    if ($2 === "`") return args[args.length - 1].slice(0, args[args.length - 2]);
	                    if ($2 === "'") return args[args.length - 1].slice(args[args.length - 2] + args[0].length);
	                    // Else, numbered backreference (without curly brackets)
	                    $2 = +$2; // Type-convert; drop leading zero
	                    /* XRegExp behavior:
	                     * - Backreferences without curly brackets end after 1 or 2 digits. Use `${..}` for more digits.
	                     * - `$1` is an error if there are no capturing groups.
	                     * - `$10` is an error if there are less than 10 capturing groups. Use `${1}0` instead.
	                     * - `$01` is equivalent to `$1` if a capturing group exists, otherwise it's an error.
	                     * - `$0` (not followed by 1-9), `$00`, and `$&` are the entire match.
	                     * Native behavior, for comparison:
	                     * - Backreferences end after 1 or 2 digits. Cannot use backreference to capturing group 100+.
	                     * - `$1` is a literal `$1` if there are no capturing groups.
	                     * - `$10` is `$1` followed by a literal `0` if there are less than 10 capturing groups.
	                     * - `$01` is equivalent to `$1` if a capturing group exists, otherwise it's a literal `$01`.
	                     * - `$0` is a literal `$0`. `$&` is the entire match.
	                     */
	                    if (!isNaN($2)) {
	                        if ($2 > args.length - 3) {
	                            throw new SyntaxError("backreference to undefined group " + $0);
	                        }
	                        return args[$2] || "";
	                    }
	                    throw new SyntaxError("invalid token " + $0);
	                });
	            });
	        }
	        if (isRegex) {
	            if (search.global) {
	                search.lastIndex = 0; // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
	            } else {
	                search.lastIndex = origLastIndex; // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
	            }
	        }
	        return result;
	    };

	/**
	 * Fixes browser bugs in the native `String.prototype.split`. Calling `XRegExp.install('natives')`
	 * uses this to override the native method. Use via `XRegExp.split` without overriding natives.
	 * @private
	 * @param {RegExp|String} separator Regex or string to use for separating the string.
	 * @param {Number} [limit] Maximum number of items to include in the result array.
	 * @returns {Array} Array of substrings.
	 */
	    fixed.split = function (separator, limit) {
	        if (!self.isRegExp(separator)) {
	            return nativ.split.apply(this, arguments); // use faster native method
	        }
	        var str = String(this),
	            origLastIndex = separator.lastIndex,
	            output = [],
	            lastLastIndex = 0,
	            lastLength;
	        /* Values for `limit`, per the spec:
	         * If undefined: pow(2,32) - 1
	         * If 0, Infinity, or NaN: 0
	         * If positive number: limit = floor(limit); if (limit >= pow(2,32)) limit -= pow(2,32);
	         * If negative number: pow(2,32) - floor(abs(limit))
	         * If other: Type-convert, then use the above rules
	         */
	        limit = (limit === undef ? -1 : limit) >>> 0;
	        self.forEach(str, separator, function (match) {
	            if ((match.index + match[0].length) > lastLastIndex) { // != `if (match[0].length)`
	                output.push(str.slice(lastLastIndex, match.index));
	                if (match.length > 1 && match.index < str.length) {
	                    Array.prototype.push.apply(output, match.slice(1));
	                }
	                lastLength = match[0].length;
	                lastLastIndex = match.index + lastLength;
	            }
	        });
	        if (lastLastIndex === str.length) {
	            if (!nativ.test.call(separator, "") || lastLength) {
	                output.push("");
	            }
	        } else {
	            output.push(str.slice(lastLastIndex));
	        }
	        separator.lastIndex = origLastIndex;
	        return output.length > limit ? output.slice(0, limit) : output;
	    };

	/*--------------------------------------
	 *  Built-in tokens
	 *------------------------------------*/

	// Shortcut
	    add = addToken.on;

	/* Letter identity escapes that natively match literal characters: \p, \P, etc.
	 * Should be SyntaxErrors but are allowed in web reality. XRegExp makes them errors for cross-
	 * browser consistency and to reserve their syntax, but lets them be superseded by XRegExp addons.
	 */
	    add(/\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4})|x(?![\dA-Fa-f]{2}))/,
	        function (match, scope) {
	            // \B is allowed in default scope only
	            if (match[1] === "B" && scope === defaultScope) {
	                return match[0];
	            }
	            throw new SyntaxError("invalid escape " + match[0]);
	        },
	        {scope: "all"});

	/* Empty character class: [] or [^]
	 * Fixes a critical cross-browser syntax inconsistency. Unless this is standardized (per the spec),
	 * regex syntax can't be accurately parsed because character class endings can't be determined.
	 */
	    add(/\[(\^?)]/,
	        function (match) {
	            // For cross-browser compatibility with ES3, convert [] to \b\B and [^] to [\s\S].
	            // (?!) should work like \b\B, but is unreliable in Firefox
	            return match[1] ? "[\\s\\S]" : "\\b\\B";
	        });

	/* Comment pattern: (?# )
	 * Inline comments are an alternative to the line comments allowed in free-spacing mode (flag x).
	 */
	    add(/(?:\(\?#[^)]*\))+/,
	        function (match) {
	            // Keep tokens separated unless the following token is a quantifier
	            return nativ.test.call(quantifier, match.input.slice(match.index + match[0].length)) ? "" : "(?:)";
	        });

	/* Named backreference: \k<name>
	 * Backreference names can use the characters A-Z, a-z, 0-9, _, and $ only.
	 */
	    add(/\\k<([\w$]+)>/,
	        function (match) {
	            var index = isNaN(match[1]) ? (lastIndexOf(this.captureNames, match[1]) + 1) : +match[1],
	                endIndex = match.index + match[0].length;
	            if (!index || index > this.captureNames.length) {
	                throw new SyntaxError("backreference to undefined group " + match[0]);
	            }
	            // Keep backreferences separate from subsequent literal numbers
	            return "\\" + index + (
	                endIndex === match.input.length || isNaN(match.input.charAt(endIndex)) ? "" : "(?:)"
	            );
	        });

	/* Whitespace and line comments, in free-spacing mode (aka extended mode, flag x) only.
	 */
	    add(/(?:\s+|#.*)+/,
	        function (match) {
	            // Keep tokens separated unless the following token is a quantifier
	            return nativ.test.call(quantifier, match.input.slice(match.index + match[0].length)) ? "" : "(?:)";
	        },
	        {
	            trigger: function () {
	                return this.hasFlag("x");
	            },
	            customFlags: "x"
	        });

	/* Dot, in dotall mode (aka singleline mode, flag s) only.
	 */
	    add(/\./,
	        function () {
	            return "[\\s\\S]";
	        },
	        {
	            trigger: function () {
	                return this.hasFlag("s");
	            },
	            customFlags: "s"
	        });

	/* Named capturing group; match the opening delimiter only: (?<name>
	 * Capture names can use the characters A-Z, a-z, 0-9, _, and $ only. Names can't be integers.
	 * Supports Python-style (?P<name> as an alternate syntax to avoid issues in recent Opera (which
	 * natively supports the Python-style syntax). Otherwise, XRegExp might treat numbered
	 * backreferences to Python-style named capture as octals.
	 */
	    add(/\(\?P?<([\w$]+)>/,
	        function (match) {
	            if (!isNaN(match[1])) {
	                // Avoid incorrect lookups, since named backreferences are added to match arrays
	                throw new SyntaxError("can't use integer as capture name " + match[0]);
	            }
	            this.captureNames.push(match[1]);
	            this.hasNamedCapture = true;
	            return "(";
	        });

	/* Numbered backreference or octal, plus any following digits: \0, \11, etc.
	 * Octals except \0 not followed by 0-9 and backreferences to unopened capture groups throw an
	 * error. Other matches are returned unaltered. IE <= 8 doesn't support backreferences greater than
	 * \99 in regex syntax.
	 */
	    add(/\\(\d+)/,
	        function (match, scope) {
	            if (!(scope === defaultScope && /^[1-9]/.test(match[1]) && +match[1] <= this.captureNames.length) &&
	                    match[1] !== "0") {
	                throw new SyntaxError("can't use octal escape or backreference to undefined group " + match[0]);
	            }
	            return match[0];
	        },
	        {scope: "all"});

	/* Capturing group; match the opening parenthesis only.
	 * Required for support of named capturing groups. Also adds explicit capture mode (flag n).
	 */
	    add(/\((?!\?)/,
	        function () {
	            if (this.hasFlag("n")) {
	                return "(?:";
	            }
	            this.captureNames.push(null);
	            return "(";
	        },
	        {customFlags: "n"});

	/*--------------------------------------
	 *  Expose XRegExp
	 *------------------------------------*/

	// For CommonJS enviroments
	    if (true) {
	        exports.XRegExp = self;
	    }

	    return self;

	}());


	/***** unicode-base.js *****/

	/*!
	 * XRegExp Unicode Base v1.0.0
	 * (c) 2008-2012 Steven Levithan <http://xregexp.com/>
	 * MIT License
	 * Uses Unicode 6.1 <http://unicode.org/>
	 */

	/**
	 * Adds support for the `\p{L}` or `\p{Letter}` Unicode category. Addon packages for other Unicode
	 * categories, scripts, blocks, and properties are available separately. All Unicode tokens can be
	 * inverted using `\P{..}` or `\p{^..}`. Token names are case insensitive, and any spaces, hyphens,
	 * and underscores are ignored.
	 * @requires XRegExp
	 */
	(function (XRegExp) {
	    "use strict";

	    var unicode = {};

	/*--------------------------------------
	 *  Private helper functions
	 *------------------------------------*/

	// Generates a standardized token name (lowercase, with hyphens, spaces, and underscores removed)
	    function slug(name) {
	        return name.replace(/[- _]+/g, "").toLowerCase();
	    }

	// Expands a list of Unicode code points and ranges to be usable in a regex character class
	    function expand(str) {
	        return str.replace(/\w{4}/g, "\\u$&");
	    }

	// Adds leading zeros if shorter than four characters
	    function pad4(str) {
	        while (str.length < 4) {
	            str = "0" + str;
	        }
	        return str;
	    }

	// Converts a hexadecimal number to decimal
	    function dec(hex) {
	        return parseInt(hex, 16);
	    }

	// Converts a decimal number to hexadecimal
	    function hex(dec) {
	        return parseInt(dec, 10).toString(16);
	    }

	// Inverts a list of Unicode code points and ranges
	    function invert(range) {
	        var output = [],
	            lastEnd = -1,
	            start;
	        XRegExp.forEach(range, /\\u(\w{4})(?:-\\u(\w{4}))?/, function (m) {
	            start = dec(m[1]);
	            if (start > (lastEnd + 1)) {
	                output.push("\\u" + pad4(hex(lastEnd + 1)));
	                if (start > (lastEnd + 2)) {
	                    output.push("-\\u" + pad4(hex(start - 1)));
	                }
	            }
	            lastEnd = dec(m[2] || m[1]);
	        });
	        if (lastEnd < 0xFFFF) {
	            output.push("\\u" + pad4(hex(lastEnd + 1)));
	            if (lastEnd < 0xFFFE) {
	                output.push("-\\uFFFF");
	            }
	        }
	        return output.join("");
	    }

	// Generates an inverted token on first use
	    function cacheInversion(item) {
	        return unicode["^" + item] || (unicode["^" + item] = invert(unicode[item]));
	    }

	/*--------------------------------------
	 *  Core functionality
	 *------------------------------------*/

	    XRegExp.install("extensibility");

	/**
	 * Adds to the list of Unicode properties that XRegExp regexes can match via \p{..} or \P{..}.
	 * @memberOf XRegExp
	 * @param {Object} pack Named sets of Unicode code points and ranges.
	 * @param {Object} [aliases] Aliases for the primary token names.
	 * @example
	 *
	 * XRegExp.addUnicodePackage({
	 *   XDigit: '0030-00390041-00460061-0066' // 0-9A-Fa-f
	 * }, {
	 *   XDigit: 'Hexadecimal'
	 * });
	 */
	    XRegExp.addUnicodePackage = function (pack, aliases) {
	        var p;
	        if (!XRegExp.isInstalled("extensibility")) {
	            throw new Error("extensibility must be installed before adding Unicode packages");
	        }
	        if (pack) {
	            for (p in pack) {
	                if (pack.hasOwnProperty(p)) {
	                    unicode[slug(p)] = expand(pack[p]);
	                }
	            }
	        }
	        if (aliases) {
	            for (p in aliases) {
	                if (aliases.hasOwnProperty(p)) {
	                    unicode[slug(aliases[p])] = unicode[slug(p)];
	                }
	            }
	        }
	    };

	/* Adds data for the Unicode `Letter` category. Addon packages include other categories, scripts,
	 * blocks, and properties.
	 */
	    XRegExp.addUnicodePackage({
	        L: "0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE0370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05270531-055605590561-058705D0-05EA05F0-05F20620-064A066E066F0671-06D306D506E506E606EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA07F407F507FA0800-0815081A082408280840-085808A008A2-08AC0904-0939093D09500958-09610971-09770979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10CF10CF20D05-0D0C0D0E-0D100D12-0D3A0D3D0D4E0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E460E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EC60EDC-0EDF0F000F40-0F470F49-0F6C0F88-0F8C1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10A0-10C510C710CD10D0-10FA10FC-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317D717DC1820-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541AA71B05-1B331B45-1B4B1B83-1BA01BAE1BAF1BBA-1BE51C00-1C231C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF11CF51CF61D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209C21022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E218321842C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2CF22CF32D00-2D252D272D2D2D30-2D672D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2E2F300530063031-3035303B303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31BA31F0-31FF3400-4DB54E00-9FCCA000-A48CA4D0-A4FDA500-A60CA610-A61FA62AA62BA640-A66EA67F-A697A6A0-A6E5A717-A71FA722-A788A78B-A78EA790-A793A7A0-A7AAA7F8-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2A9CFAA00-AA28AA40-AA42AA44-AA4BAA60-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADB-AADDAAE0-AAEAAAF2-AAF4AB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2EABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC"
	    }, {
	        L: "Letter"
	    });

	/* Adds Unicode property syntax to XRegExp: \p{..}, \P{..}, \p{^..}
	 */
	    XRegExp.addToken(
	        /\\([pP]){(\^?)([^}]*)}/,
	        function (match, scope) {
	            var inv = (match[1] === "P" || match[2]) ? "^" : "",
	                item = slug(match[3]);
	            // The double negative \P{^..} is invalid
	            if (match[1] === "P" && match[2]) {
	                throw new SyntaxError("invalid double negation \\P{^");
	            }
	            if (!unicode.hasOwnProperty(item)) {
	                throw new SyntaxError("invalid or unknown Unicode property " + match[0]);
	            }
	            return scope === "class" ?
	                    (inv ? cacheInversion(item) : unicode[item]) :
	                    "[" + inv + unicode[item] + "]";
	        },
	        {scope: "all"}
	    );

	}(XRegExp));


	/***** unicode-categories.js *****/

	/*!
	 * XRegExp Unicode Categories v1.2.0
	 * (c) 2010-2012 Steven Levithan <http://xregexp.com/>
	 * MIT License
	 * Uses Unicode 6.1 <http://unicode.org/>
	 */

	/**
	 * Adds support for all Unicode categories (aka properties) E.g., `\p{Lu}` or
	 * `\p{Uppercase Letter}`. Token names are case insensitive, and any spaces, hyphens, and
	 * underscores are ignored.
	 * @requires XRegExp, XRegExp Unicode Base
	 */
	(function (XRegExp) {
	    "use strict";

	    if (!XRegExp.addUnicodePackage) {
	        throw new ReferenceError("Unicode Base must be loaded before Unicode Categories");
	    }

	    XRegExp.install("extensibility");

	    XRegExp.addUnicodePackage({
	        //L: "", // Included in the Unicode Base addon
	        Ll: "0061-007A00B500DF-00F600F8-00FF01010103010501070109010B010D010F01110113011501170119011B011D011F01210123012501270129012B012D012F01310133013501370138013A013C013E014001420144014601480149014B014D014F01510153015501570159015B015D015F01610163016501670169016B016D016F0171017301750177017A017C017E-0180018301850188018C018D019201950199-019B019E01A101A301A501A801AA01AB01AD01B001B401B601B901BA01BD-01BF01C601C901CC01CE01D001D201D401D601D801DA01DC01DD01DF01E101E301E501E701E901EB01ED01EF01F001F301F501F901FB01FD01FF02010203020502070209020B020D020F02110213021502170219021B021D021F02210223022502270229022B022D022F02310233-0239023C023F0240024202470249024B024D024F-02930295-02AF037103730377037B-037D039003AC-03CE03D003D103D5-03D703D903DB03DD03DF03E103E303E503E703E903EB03ED03EF-03F303F503F803FB03FC0430-045F04610463046504670469046B046D046F04710473047504770479047B047D047F0481048B048D048F04910493049504970499049B049D049F04A104A304A504A704A904AB04AD04AF04B104B304B504B704B904BB04BD04BF04C204C404C604C804CA04CC04CE04CF04D104D304D504D704D904DB04DD04DF04E104E304E504E704E904EB04ED04EF04F104F304F504F704F904FB04FD04FF05010503050505070509050B050D050F05110513051505170519051B051D051F05210523052505270561-05871D00-1D2B1D6B-1D771D79-1D9A1E011E031E051E071E091E0B1E0D1E0F1E111E131E151E171E191E1B1E1D1E1F1E211E231E251E271E291E2B1E2D1E2F1E311E331E351E371E391E3B1E3D1E3F1E411E431E451E471E491E4B1E4D1E4F1E511E531E551E571E591E5B1E5D1E5F1E611E631E651E671E691E6B1E6D1E6F1E711E731E751E771E791E7B1E7D1E7F1E811E831E851E871E891E8B1E8D1E8F1E911E931E95-1E9D1E9F1EA11EA31EA51EA71EA91EAB1EAD1EAF1EB11EB31EB51EB71EB91EBB1EBD1EBF1EC11EC31EC51EC71EC91ECB1ECD1ECF1ED11ED31ED51ED71ED91EDB1EDD1EDF1EE11EE31EE51EE71EE91EEB1EED1EEF1EF11EF31EF51EF71EF91EFB1EFD1EFF-1F071F10-1F151F20-1F271F30-1F371F40-1F451F50-1F571F60-1F671F70-1F7D1F80-1F871F90-1F971FA0-1FA71FB0-1FB41FB61FB71FBE1FC2-1FC41FC61FC71FD0-1FD31FD61FD71FE0-1FE71FF2-1FF41FF61FF7210A210E210F2113212F21342139213C213D2146-2149214E21842C30-2C5E2C612C652C662C682C6A2C6C2C712C732C742C76-2C7B2C812C832C852C872C892C8B2C8D2C8F2C912C932C952C972C992C9B2C9D2C9F2CA12CA32CA52CA72CA92CAB2CAD2CAF2CB12CB32CB52CB72CB92CBB2CBD2CBF2CC12CC32CC52CC72CC92CCB2CCD2CCF2CD12CD32CD52CD72CD92CDB2CDD2CDF2CE12CE32CE42CEC2CEE2CF32D00-2D252D272D2DA641A643A645A647A649A64BA64DA64FA651A653A655A657A659A65BA65DA65FA661A663A665A667A669A66BA66DA681A683A685A687A689A68BA68DA68FA691A693A695A697A723A725A727A729A72BA72DA72F-A731A733A735A737A739A73BA73DA73FA741A743A745A747A749A74BA74DA74FA751A753A755A757A759A75BA75DA75FA761A763A765A767A769A76BA76DA76FA771-A778A77AA77CA77FA781A783A785A787A78CA78EA791A793A7A1A7A3A7A5A7A7A7A9A7FAFB00-FB06FB13-FB17FF41-FF5A",
	        Lu: "0041-005A00C0-00D600D8-00DE01000102010401060108010A010C010E01100112011401160118011A011C011E01200122012401260128012A012C012E01300132013401360139013B013D013F0141014301450147014A014C014E01500152015401560158015A015C015E01600162016401660168016A016C016E017001720174017601780179017B017D018101820184018601870189-018B018E-0191019301940196-0198019C019D019F01A001A201A401A601A701A901AC01AE01AF01B1-01B301B501B701B801BC01C401C701CA01CD01CF01D101D301D501D701D901DB01DE01E001E201E401E601E801EA01EC01EE01F101F401F6-01F801FA01FC01FE02000202020402060208020A020C020E02100212021402160218021A021C021E02200222022402260228022A022C022E02300232023A023B023D023E02410243-02460248024A024C024E03700372037603860388-038A038C038E038F0391-03A103A3-03AB03CF03D2-03D403D803DA03DC03DE03E003E203E403E603E803EA03EC03EE03F403F703F903FA03FD-042F04600462046404660468046A046C046E04700472047404760478047A047C047E0480048A048C048E04900492049404960498049A049C049E04A004A204A404A604A804AA04AC04AE04B004B204B404B604B804BA04BC04BE04C004C104C304C504C704C904CB04CD04D004D204D404D604D804DA04DC04DE04E004E204E404E604E804EA04EC04EE04F004F204F404F604F804FA04FC04FE05000502050405060508050A050C050E05100512051405160518051A051C051E05200522052405260531-055610A0-10C510C710CD1E001E021E041E061E081E0A1E0C1E0E1E101E121E141E161E181E1A1E1C1E1E1E201E221E241E261E281E2A1E2C1E2E1E301E321E341E361E381E3A1E3C1E3E1E401E421E441E461E481E4A1E4C1E4E1E501E521E541E561E581E5A1E5C1E5E1E601E621E641E661E681E6A1E6C1E6E1E701E721E741E761E781E7A1E7C1E7E1E801E821E841E861E881E8A1E8C1E8E1E901E921E941E9E1EA01EA21EA41EA61EA81EAA1EAC1EAE1EB01EB21EB41EB61EB81EBA1EBC1EBE1EC01EC21EC41EC61EC81ECA1ECC1ECE1ED01ED21ED41ED61ED81EDA1EDC1EDE1EE01EE21EE41EE61EE81EEA1EEC1EEE1EF01EF21EF41EF61EF81EFA1EFC1EFE1F08-1F0F1F18-1F1D1F28-1F2F1F38-1F3F1F48-1F4D1F591F5B1F5D1F5F1F68-1F6F1FB8-1FBB1FC8-1FCB1FD8-1FDB1FE8-1FEC1FF8-1FFB21022107210B-210D2110-211221152119-211D212421262128212A-212D2130-2133213E213F214521832C00-2C2E2C602C62-2C642C672C692C6B2C6D-2C702C722C752C7E-2C802C822C842C862C882C8A2C8C2C8E2C902C922C942C962C982C9A2C9C2C9E2CA02CA22CA42CA62CA82CAA2CAC2CAE2CB02CB22CB42CB62CB82CBA2CBC2CBE2CC02CC22CC42CC62CC82CCA2CCC2CCE2CD02CD22CD42CD62CD82CDA2CDC2CDE2CE02CE22CEB2CED2CF2A640A642A644A646A648A64AA64CA64EA650A652A654A656A658A65AA65CA65EA660A662A664A666A668A66AA66CA680A682A684A686A688A68AA68CA68EA690A692A694A696A722A724A726A728A72AA72CA72EA732A734A736A738A73AA73CA73EA740A742A744A746A748A74AA74CA74EA750A752A754A756A758A75AA75CA75EA760A762A764A766A768A76AA76CA76EA779A77BA77DA77EA780A782A784A786A78BA78DA790A792A7A0A7A2A7A4A7A6A7A8A7AAFF21-FF3A",
	        Lt: "01C501C801CB01F21F88-1F8F1F98-1F9F1FA8-1FAF1FBC1FCC1FFC",
	        Lm: "02B0-02C102C6-02D102E0-02E402EC02EE0374037A0559064006E506E607F407F507FA081A0824082809710E460EC610FC17D718431AA71C78-1C7D1D2C-1D6A1D781D9B-1DBF2071207F2090-209C2C7C2C7D2D6F2E2F30053031-3035303B309D309E30FC-30FEA015A4F8-A4FDA60CA67FA717-A71FA770A788A7F8A7F9A9CFAA70AADDAAF3AAF4FF70FF9EFF9F",
	        Lo: "00AA00BA01BB01C0-01C3029405D0-05EA05F0-05F20620-063F0641-064A066E066F0671-06D306D506EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA0800-08150840-085808A008A2-08AC0904-0939093D09500958-09610972-09770979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10CF10CF20D05-0D0C0D0E-0D100D12-0D3A0D3D0D4E0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E450E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EDC-0EDF0F000F40-0F470F49-0F6C0F88-0F8C1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10D0-10FA10FD-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317DC1820-18421844-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541B05-1B331B45-1B4B1B83-1BA01BAE1BAF1BBA-1BE51C00-1C231C4D-1C4F1C5A-1C771CE9-1CEC1CEE-1CF11CF51CF62135-21382D30-2D672D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE3006303C3041-3096309F30A1-30FA30FF3105-312D3131-318E31A0-31BA31F0-31FF3400-4DB54E00-9FCCA000-A014A016-A48CA4D0-A4F7A500-A60BA610-A61FA62AA62BA66EA6A0-A6E5A7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2AA00-AA28AA40-AA42AA44-AA4BAA60-AA6FAA71-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADBAADCAAE0-AAEAAAF2AB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2EABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA6DFA70-FAD9FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF66-FF6FFF71-FF9DFFA0-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
	        M: "0300-036F0483-04890591-05BD05BF05C105C205C405C505C70610-061A064B-065F067006D6-06DC06DF-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0859-085B08E4-08FE0900-0903093A-093C093E-094F0951-0957096209630981-098309BC09BE-09C409C709C809CB-09CD09D709E209E30A01-0A030A3C0A3E-0A420A470A480A4B-0A4D0A510A700A710A750A81-0A830ABC0ABE-0AC50AC7-0AC90ACB-0ACD0AE20AE30B01-0B030B3C0B3E-0B440B470B480B4B-0B4D0B560B570B620B630B820BBE-0BC20BC6-0BC80BCA-0BCD0BD70C01-0C030C3E-0C440C46-0C480C4A-0C4D0C550C560C620C630C820C830CBC0CBE-0CC40CC6-0CC80CCA-0CCD0CD50CD60CE20CE30D020D030D3E-0D440D46-0D480D4A-0D4D0D570D620D630D820D830DCA0DCF-0DD40DD60DD8-0DDF0DF20DF30E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F3E0F3F0F71-0F840F860F870F8D-0F970F99-0FBC0FC6102B-103E1056-1059105E-10601062-10641067-106D1071-10741082-108D108F109A-109D135D-135F1712-17141732-1734175217531772177317B4-17D317DD180B-180D18A91920-192B1930-193B19B0-19C019C819C91A17-1A1B1A55-1A5E1A60-1A7C1A7F1B00-1B041B34-1B441B6B-1B731B80-1B821BA1-1BAD1BE6-1BF31C24-1C371CD0-1CD21CD4-1CE81CED1CF2-1CF41DC0-1DE61DFC-1DFF20D0-20F02CEF-2CF12D7F2DE0-2DFF302A-302F3099309AA66F-A672A674-A67DA69FA6F0A6F1A802A806A80BA823-A827A880A881A8B4-A8C4A8E0-A8F1A926-A92DA947-A953A980-A983A9B3-A9C0AA29-AA36AA43AA4CAA4DAA7BAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1AAEB-AAEFAAF5AAF6ABE3-ABEAABECABEDFB1EFE00-FE0FFE20-FE26",
	        Mn: "0300-036F0483-04870591-05BD05BF05C105C205C405C505C70610-061A064B-065F067006D6-06DC06DF-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0859-085B08E4-08FE0900-0902093A093C0941-0948094D0951-095709620963098109BC09C1-09C409CD09E209E30A010A020A3C0A410A420A470A480A4B-0A4D0A510A700A710A750A810A820ABC0AC1-0AC50AC70AC80ACD0AE20AE30B010B3C0B3F0B41-0B440B4D0B560B620B630B820BC00BCD0C3E-0C400C46-0C480C4A-0C4D0C550C560C620C630CBC0CBF0CC60CCC0CCD0CE20CE30D41-0D440D4D0D620D630DCA0DD2-0DD40DD60E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F71-0F7E0F80-0F840F860F870F8D-0F970F99-0FBC0FC6102D-10301032-10371039103A103D103E10581059105E-10601071-1074108210851086108D109D135D-135F1712-17141732-1734175217531772177317B417B517B7-17BD17C617C9-17D317DD180B-180D18A91920-19221927192819321939-193B1A171A181A561A58-1A5E1A601A621A65-1A6C1A73-1A7C1A7F1B00-1B031B341B36-1B3A1B3C1B421B6B-1B731B801B811BA2-1BA51BA81BA91BAB1BE61BE81BE91BED1BEF-1BF11C2C-1C331C361C371CD0-1CD21CD4-1CE01CE2-1CE81CED1CF41DC0-1DE61DFC-1DFF20D0-20DC20E120E5-20F02CEF-2CF12D7F2DE0-2DFF302A-302D3099309AA66FA674-A67DA69FA6F0A6F1A802A806A80BA825A826A8C4A8E0-A8F1A926-A92DA947-A951A980-A982A9B3A9B6-A9B9A9BCAA29-AA2EAA31AA32AA35AA36AA43AA4CAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1AAECAAEDAAF6ABE5ABE8ABEDFB1EFE00-FE0FFE20-FE26",
	        Mc: "0903093B093E-09400949-094C094E094F0982098309BE-09C009C709C809CB09CC09D70A030A3E-0A400A830ABE-0AC00AC90ACB0ACC0B020B030B3E0B400B470B480B4B0B4C0B570BBE0BBF0BC10BC20BC6-0BC80BCA-0BCC0BD70C01-0C030C41-0C440C820C830CBE0CC0-0CC40CC70CC80CCA0CCB0CD50CD60D020D030D3E-0D400D46-0D480D4A-0D4C0D570D820D830DCF-0DD10DD8-0DDF0DF20DF30F3E0F3F0F7F102B102C10311038103B103C105610571062-10641067-106D108310841087-108C108F109A-109C17B617BE-17C517C717C81923-19261929-192B193019311933-193819B0-19C019C819C91A19-1A1B1A551A571A611A631A641A6D-1A721B041B351B3B1B3D-1B411B431B441B821BA11BA61BA71BAA1BAC1BAD1BE71BEA-1BEC1BEE1BF21BF31C24-1C2B1C341C351CE11CF21CF3302E302FA823A824A827A880A881A8B4-A8C3A952A953A983A9B4A9B5A9BAA9BBA9BD-A9C0AA2FAA30AA33AA34AA4DAA7BAAEBAAEEAAEFAAF5ABE3ABE4ABE6ABE7ABE9ABEAABEC",
	        Me: "0488048920DD-20E020E2-20E4A670-A672",
	        N: "0030-003900B200B300B900BC-00BE0660-066906F0-06F907C0-07C90966-096F09E6-09EF09F4-09F90A66-0A6F0AE6-0AEF0B66-0B6F0B72-0B770BE6-0BF20C66-0C6F0C78-0C7E0CE6-0CEF0D66-0D750E50-0E590ED0-0ED90F20-0F331040-10491090-10991369-137C16EE-16F017E0-17E917F0-17F91810-18191946-194F19D0-19DA1A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C5920702074-20792080-20892150-21822185-21892460-249B24EA-24FF2776-27932CFD30073021-30293038-303A3192-31953220-32293248-324F3251-325F3280-328932B1-32BFA620-A629A6E6-A6EFA830-A835A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
	        Nd: "0030-00390660-066906F0-06F907C0-07C90966-096F09E6-09EF0A66-0A6F0AE6-0AEF0B66-0B6F0BE6-0BEF0C66-0C6F0CE6-0CEF0D66-0D6F0E50-0E590ED0-0ED90F20-0F291040-10491090-109917E0-17E91810-18191946-194F19D0-19D91A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C59A620-A629A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
	        Nl: "16EE-16F02160-21822185-218830073021-30293038-303AA6E6-A6EF",
	        No: "00B200B300B900BC-00BE09F4-09F90B72-0B770BF0-0BF20C78-0C7E0D70-0D750F2A-0F331369-137C17F0-17F919DA20702074-20792080-20892150-215F21892460-249B24EA-24FF2776-27932CFD3192-31953220-32293248-324F3251-325F3280-328932B1-32BFA830-A835",
	        P: "0021-00230025-002A002C-002F003A003B003F0040005B-005D005F007B007D00A100A700AB00B600B700BB00BF037E0387055A-055F0589058A05BE05C005C305C605F305F40609060A060C060D061B061E061F066A-066D06D40700-070D07F7-07F90830-083E085E0964096509700AF00DF40E4F0E5A0E5B0F04-0F120F140F3A-0F3D0F850FD0-0FD40FD90FDA104A-104F10FB1360-13681400166D166E169B169C16EB-16ED1735173617D4-17D617D8-17DA1800-180A194419451A1E1A1F1AA0-1AA61AA8-1AAD1B5A-1B601BFC-1BFF1C3B-1C3F1C7E1C7F1CC0-1CC71CD32010-20272030-20432045-20512053-205E207D207E208D208E2329232A2768-277527C527C627E6-27EF2983-299829D8-29DB29FC29FD2CF9-2CFC2CFE2CFF2D702E00-2E2E2E30-2E3B3001-30033008-30113014-301F3030303D30A030FBA4FEA4FFA60D-A60FA673A67EA6F2-A6F7A874-A877A8CEA8CFA8F8-A8FAA92EA92FA95FA9C1-A9CDA9DEA9DFAA5C-AA5FAADEAADFAAF0AAF1ABEBFD3EFD3FFE10-FE19FE30-FE52FE54-FE61FE63FE68FE6AFE6BFF01-FF03FF05-FF0AFF0C-FF0FFF1AFF1BFF1FFF20FF3B-FF3DFF3FFF5BFF5DFF5F-FF65",
	        Pd: "002D058A05BE140018062010-20152E172E1A2E3A2E3B301C303030A0FE31FE32FE58FE63FF0D",
	        Ps: "0028005B007B0F3A0F3C169B201A201E2045207D208D23292768276A276C276E27702772277427C527E627E827EA27EC27EE2983298529872989298B298D298F299129932995299729D829DA29FC2E222E242E262E283008300A300C300E3010301430163018301A301DFD3EFE17FE35FE37FE39FE3BFE3DFE3FFE41FE43FE47FE59FE5BFE5DFF08FF3BFF5BFF5FFF62",
	        Pe: "0029005D007D0F3B0F3D169C2046207E208E232A2769276B276D276F27712773277527C627E727E927EB27ED27EF298429862988298A298C298E2990299229942996299829D929DB29FD2E232E252E272E293009300B300D300F3011301530173019301B301E301FFD3FFE18FE36FE38FE3AFE3CFE3EFE40FE42FE44FE48FE5AFE5CFE5EFF09FF3DFF5DFF60FF63",
	        Pi: "00AB2018201B201C201F20392E022E042E092E0C2E1C2E20",
	        Pf: "00BB2019201D203A2E032E052E0A2E0D2E1D2E21",
	        Pc: "005F203F20402054FE33FE34FE4D-FE4FFF3F",
	        Po: "0021-00230025-0027002A002C002E002F003A003B003F0040005C00A100A700B600B700BF037E0387055A-055F058905C005C305C605F305F40609060A060C060D061B061E061F066A-066D06D40700-070D07F7-07F90830-083E085E0964096509700AF00DF40E4F0E5A0E5B0F04-0F120F140F850FD0-0FD40FD90FDA104A-104F10FB1360-1368166D166E16EB-16ED1735173617D4-17D617D8-17DA1800-18051807-180A194419451A1E1A1F1AA0-1AA61AA8-1AAD1B5A-1B601BFC-1BFF1C3B-1C3F1C7E1C7F1CC0-1CC71CD3201620172020-20272030-2038203B-203E2041-20432047-205120532055-205E2CF9-2CFC2CFE2CFF2D702E002E012E06-2E082E0B2E0E-2E162E182E192E1B2E1E2E1F2E2A-2E2E2E30-2E393001-3003303D30FBA4FEA4FFA60D-A60FA673A67EA6F2-A6F7A874-A877A8CEA8CFA8F8-A8FAA92EA92FA95FA9C1-A9CDA9DEA9DFAA5C-AA5FAADEAADFAAF0AAF1ABEBFE10-FE16FE19FE30FE45FE46FE49-FE4CFE50-FE52FE54-FE57FE5F-FE61FE68FE6AFE6BFF01-FF03FF05-FF07FF0AFF0CFF0EFF0FFF1AFF1BFF1FFF20FF3CFF61FF64FF65",
	        S: "0024002B003C-003E005E0060007C007E00A2-00A600A800A900AC00AE-00B100B400B800D700F702C2-02C502D2-02DF02E5-02EB02ED02EF-02FF03750384038503F60482058F0606-0608060B060E060F06DE06E906FD06FE07F609F209F309FA09FB0AF10B700BF3-0BFA0C7F0D790E3F0F01-0F030F130F15-0F170F1A-0F1F0F340F360F380FBE-0FC50FC7-0FCC0FCE0FCF0FD5-0FD8109E109F1390-139917DB194019DE-19FF1B61-1B6A1B74-1B7C1FBD1FBF-1FC11FCD-1FCF1FDD-1FDF1FED-1FEF1FFD1FFE20442052207A-207C208A-208C20A0-20B9210021012103-21062108210921142116-2118211E-2123212521272129212E213A213B2140-2144214A-214D214F2190-2328232B-23F32400-24262440-244A249C-24E92500-26FF2701-27672794-27C427C7-27E527F0-29822999-29D729DC-29FB29FE-2B4C2B50-2B592CE5-2CEA2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB300430123013302030363037303E303F309B309C319031913196-319F31C0-31E33200-321E322A-324732503260-327F328A-32B032C0-32FE3300-33FF4DC0-4DFFA490-A4C6A700-A716A720A721A789A78AA828-A82BA836-A839AA77-AA79FB29FBB2-FBC1FDFCFDFDFE62FE64-FE66FE69FF04FF0BFF1C-FF1EFF3EFF40FF5CFF5EFFE0-FFE6FFE8-FFEEFFFCFFFD",
	        Sm: "002B003C-003E007C007E00AC00B100D700F703F60606-060820442052207A-207C208A-208C21182140-2144214B2190-2194219A219B21A021A321A621AE21CE21CF21D221D421F4-22FF2308-230B23202321237C239B-23B323DC-23E125B725C125F8-25FF266F27C0-27C427C7-27E527F0-27FF2900-29822999-29D729DC-29FB29FE-2AFF2B30-2B442B47-2B4CFB29FE62FE64-FE66FF0BFF1C-FF1EFF5CFF5EFFE2FFE9-FFEC",
	        Sc: "002400A2-00A5058F060B09F209F309FB0AF10BF90E3F17DB20A0-20B9A838FDFCFE69FF04FFE0FFE1FFE5FFE6",
	        Sk: "005E006000A800AF00B400B802C2-02C502D2-02DF02E5-02EB02ED02EF-02FF0375038403851FBD1FBF-1FC11FCD-1FCF1FDD-1FDF1FED-1FEF1FFD1FFE309B309CA700-A716A720A721A789A78AFBB2-FBC1FF3EFF40FFE3",
	        So: "00A600A900AE00B00482060E060F06DE06E906FD06FE07F609FA0B700BF3-0BF80BFA0C7F0D790F01-0F030F130F15-0F170F1A-0F1F0F340F360F380FBE-0FC50FC7-0FCC0FCE0FCF0FD5-0FD8109E109F1390-1399194019DE-19FF1B61-1B6A1B74-1B7C210021012103-210621082109211421162117211E-2123212521272129212E213A213B214A214C214D214F2195-2199219C-219F21A121A221A421A521A7-21AD21AF-21CD21D021D121D321D5-21F32300-2307230C-231F2322-2328232B-237B237D-239A23B4-23DB23E2-23F32400-24262440-244A249C-24E92500-25B625B8-25C025C2-25F72600-266E2670-26FF2701-27672794-27BF2800-28FF2B00-2B2F2B452B462B50-2B592CE5-2CEA2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB300430123013302030363037303E303F319031913196-319F31C0-31E33200-321E322A-324732503260-327F328A-32B032C0-32FE3300-33FF4DC0-4DFFA490-A4C6A828-A82BA836A837A839AA77-AA79FDFDFFE4FFE8FFEDFFEEFFFCFFFD",
	        Z: "002000A01680180E2000-200A20282029202F205F3000",
	        Zs: "002000A01680180E2000-200A202F205F3000",
	        Zl: "2028",
	        Zp: "2029",
	        C: "0000-001F007F-009F00AD03780379037F-0383038B038D03A20528-05300557055805600588058B-058E059005C8-05CF05EB-05EF05F5-0605061C061D06DD070E070F074B074C07B2-07BF07FB-07FF082E082F083F085C085D085F-089F08A108AD-08E308FF097809800984098D098E0991099209A909B109B3-09B509BA09BB09C509C609C909CA09CF-09D609D8-09DB09DE09E409E509FC-0A000A040A0B-0A0E0A110A120A290A310A340A370A3A0A3B0A3D0A43-0A460A490A4A0A4E-0A500A52-0A580A5D0A5F-0A650A76-0A800A840A8E0A920AA90AB10AB40ABA0ABB0AC60ACA0ACE0ACF0AD1-0ADF0AE40AE50AF2-0B000B040B0D0B0E0B110B120B290B310B340B3A0B3B0B450B460B490B4A0B4E-0B550B58-0B5B0B5E0B640B650B78-0B810B840B8B-0B8D0B910B96-0B980B9B0B9D0BA0-0BA20BA5-0BA70BAB-0BAD0BBA-0BBD0BC3-0BC50BC90BCE0BCF0BD1-0BD60BD8-0BE50BFB-0C000C040C0D0C110C290C340C3A-0C3C0C450C490C4E-0C540C570C5A-0C5F0C640C650C70-0C770C800C810C840C8D0C910CA90CB40CBA0CBB0CC50CC90CCE-0CD40CD7-0CDD0CDF0CE40CE50CF00CF3-0D010D040D0D0D110D3B0D3C0D450D490D4F-0D560D58-0D5F0D640D650D76-0D780D800D810D840D97-0D990DB20DBC0DBE0DBF0DC7-0DC90DCB-0DCE0DD50DD70DE0-0DF10DF5-0E000E3B-0E3E0E5C-0E800E830E850E860E890E8B0E8C0E8E-0E930E980EA00EA40EA60EA80EA90EAC0EBA0EBE0EBF0EC50EC70ECE0ECF0EDA0EDB0EE0-0EFF0F480F6D-0F700F980FBD0FCD0FDB-0FFF10C610C8-10CC10CE10CF1249124E124F12571259125E125F1289128E128F12B112B612B712BF12C112C612C712D7131113161317135B135C137D-137F139A-139F13F5-13FF169D-169F16F1-16FF170D1715-171F1737-173F1754-175F176D17711774-177F17DE17DF17EA-17EF17FA-17FF180F181A-181F1878-187F18AB-18AF18F6-18FF191D-191F192C-192F193C-193F1941-1943196E196F1975-197F19AC-19AF19CA-19CF19DB-19DD1A1C1A1D1A5F1A7D1A7E1A8A-1A8F1A9A-1A9F1AAE-1AFF1B4C-1B4F1B7D-1B7F1BF4-1BFB1C38-1C3A1C4A-1C4C1C80-1CBF1CC8-1CCF1CF7-1CFF1DE7-1DFB1F161F171F1E1F1F1F461F471F4E1F4F1F581F5A1F5C1F5E1F7E1F7F1FB51FC51FD41FD51FDC1FF01FF11FF51FFF200B-200F202A-202E2060-206F20722073208F209D-209F20BA-20CF20F1-20FF218A-218F23F4-23FF2427-243F244B-245F27002B4D-2B4F2B5A-2BFF2C2F2C5F2CF4-2CF82D262D28-2D2C2D2E2D2F2D68-2D6E2D71-2D7E2D97-2D9F2DA72DAF2DB72DBF2DC72DCF2DD72DDF2E3C-2E7F2E9A2EF4-2EFF2FD6-2FEF2FFC-2FFF3040309730983100-3104312E-3130318F31BB-31BF31E4-31EF321F32FF4DB6-4DBF9FCD-9FFFA48D-A48FA4C7-A4CFA62C-A63FA698-A69EA6F8-A6FFA78FA794-A79FA7AB-A7F7A82C-A82FA83A-A83FA878-A87FA8C5-A8CDA8DA-A8DFA8FC-A8FFA954-A95EA97D-A97FA9CEA9DA-A9DDA9E0-A9FFAA37-AA3FAA4EAA4FAA5AAA5BAA7C-AA7FAAC3-AADAAAF7-AB00AB07AB08AB0FAB10AB17-AB1FAB27AB2F-ABBFABEEABEFABFA-ABFFD7A4-D7AFD7C7-D7CAD7FC-F8FFFA6EFA6FFADA-FAFFFB07-FB12FB18-FB1CFB37FB3DFB3FFB42FB45FBC2-FBD2FD40-FD4FFD90FD91FDC8-FDEFFDFEFDFFFE1A-FE1FFE27-FE2FFE53FE67FE6C-FE6FFE75FEFD-FF00FFBF-FFC1FFC8FFC9FFD0FFD1FFD8FFD9FFDD-FFDFFFE7FFEF-FFFBFFFEFFFF",
	        Cc: "0000-001F007F-009F",
	        Cf: "00AD0600-060406DD070F200B-200F202A-202E2060-2064206A-206FFEFFFFF9-FFFB",
	        Co: "E000-F8FF",
	        Cs: "D800-DFFF",
	        Cn: "03780379037F-0383038B038D03A20528-05300557055805600588058B-058E059005C8-05CF05EB-05EF05F5-05FF0605061C061D070E074B074C07B2-07BF07FB-07FF082E082F083F085C085D085F-089F08A108AD-08E308FF097809800984098D098E0991099209A909B109B3-09B509BA09BB09C509C609C909CA09CF-09D609D8-09DB09DE09E409E509FC-0A000A040A0B-0A0E0A110A120A290A310A340A370A3A0A3B0A3D0A43-0A460A490A4A0A4E-0A500A52-0A580A5D0A5F-0A650A76-0A800A840A8E0A920AA90AB10AB40ABA0ABB0AC60ACA0ACE0ACF0AD1-0ADF0AE40AE50AF2-0B000B040B0D0B0E0B110B120B290B310B340B3A0B3B0B450B460B490B4A0B4E-0B550B58-0B5B0B5E0B640B650B78-0B810B840B8B-0B8D0B910B96-0B980B9B0B9D0BA0-0BA20BA5-0BA70BAB-0BAD0BBA-0BBD0BC3-0BC50BC90BCE0BCF0BD1-0BD60BD8-0BE50BFB-0C000C040C0D0C110C290C340C3A-0C3C0C450C490C4E-0C540C570C5A-0C5F0C640C650C70-0C770C800C810C840C8D0C910CA90CB40CBA0CBB0CC50CC90CCE-0CD40CD7-0CDD0CDF0CE40CE50CF00CF3-0D010D040D0D0D110D3B0D3C0D450D490D4F-0D560D58-0D5F0D640D650D76-0D780D800D810D840D97-0D990DB20DBC0DBE0DBF0DC7-0DC90DCB-0DCE0DD50DD70DE0-0DF10DF5-0E000E3B-0E3E0E5C-0E800E830E850E860E890E8B0E8C0E8E-0E930E980EA00EA40EA60EA80EA90EAC0EBA0EBE0EBF0EC50EC70ECE0ECF0EDA0EDB0EE0-0EFF0F480F6D-0F700F980FBD0FCD0FDB-0FFF10C610C8-10CC10CE10CF1249124E124F12571259125E125F1289128E128F12B112B612B712BF12C112C612C712D7131113161317135B135C137D-137F139A-139F13F5-13FF169D-169F16F1-16FF170D1715-171F1737-173F1754-175F176D17711774-177F17DE17DF17EA-17EF17FA-17FF180F181A-181F1878-187F18AB-18AF18F6-18FF191D-191F192C-192F193C-193F1941-1943196E196F1975-197F19AC-19AF19CA-19CF19DB-19DD1A1C1A1D1A5F1A7D1A7E1A8A-1A8F1A9A-1A9F1AAE-1AFF1B4C-1B4F1B7D-1B7F1BF4-1BFB1C38-1C3A1C4A-1C4C1C80-1CBF1CC8-1CCF1CF7-1CFF1DE7-1DFB1F161F171F1E1F1F1F461F471F4E1F4F1F581F5A1F5C1F5E1F7E1F7F1FB51FC51FD41FD51FDC1FF01FF11FF51FFF2065-206920722073208F209D-209F20BA-20CF20F1-20FF218A-218F23F4-23FF2427-243F244B-245F27002B4D-2B4F2B5A-2BFF2C2F2C5F2CF4-2CF82D262D28-2D2C2D2E2D2F2D68-2D6E2D71-2D7E2D97-2D9F2DA72DAF2DB72DBF2DC72DCF2DD72DDF2E3C-2E7F2E9A2EF4-2EFF2FD6-2FEF2FFC-2FFF3040309730983100-3104312E-3130318F31BB-31BF31E4-31EF321F32FF4DB6-4DBF9FCD-9FFFA48D-A48FA4C7-A4CFA62C-A63FA698-A69EA6F8-A6FFA78FA794-A79FA7AB-A7F7A82C-A82FA83A-A83FA878-A87FA8C5-A8CDA8DA-A8DFA8FC-A8FFA954-A95EA97D-A97FA9CEA9DA-A9DDA9E0-A9FFAA37-AA3FAA4EAA4FAA5AAA5BAA7C-AA7FAAC3-AADAAAF7-AB00AB07AB08AB0FAB10AB17-AB1FAB27AB2F-ABBFABEEABEFABFA-ABFFD7A4-D7AFD7C7-D7CAD7FC-D7FFFA6EFA6FFADA-FAFFFB07-FB12FB18-FB1CFB37FB3DFB3FFB42FB45FBC2-FBD2FD40-FD4FFD90FD91FDC8-FDEFFDFEFDFFFE1A-FE1FFE27-FE2FFE53FE67FE6C-FE6FFE75FEFDFEFEFF00FFBF-FFC1FFC8FFC9FFD0FFD1FFD8FFD9FFDD-FFDFFFE7FFEF-FFF8FFFEFFFF"
	    }, {
	        //L: "Letter", // Included in the Unicode Base addon
	        Ll: "Lowercase_Letter",
	        Lu: "Uppercase_Letter",
	        Lt: "Titlecase_Letter",
	        Lm: "Modifier_Letter",
	        Lo: "Other_Letter",
	        M: "Mark",
	        Mn: "Nonspacing_Mark",
	        Mc: "Spacing_Mark",
	        Me: "Enclosing_Mark",
	        N: "Number",
	        Nd: "Decimal_Number",
	        Nl: "Letter_Number",
	        No: "Other_Number",
	        P: "Punctuation",
	        Pd: "Dash_Punctuation",
	        Ps: "Open_Punctuation",
	        Pe: "Close_Punctuation",
	        Pi: "Initial_Punctuation",
	        Pf: "Final_Punctuation",
	        Pc: "Connector_Punctuation",
	        Po: "Other_Punctuation",
	        S: "Symbol",
	        Sm: "Math_Symbol",
	        Sc: "Currency_Symbol",
	        Sk: "Modifier_Symbol",
	        So: "Other_Symbol",
	        Z: "Separator",
	        Zs: "Space_Separator",
	        Zl: "Line_Separator",
	        Zp: "Paragraph_Separator",
	        C: "Other",
	        Cc: "Control",
	        Cf: "Format",
	        Co: "Private_Use",
	        Cs: "Surrogate",
	        Cn: "Unassigned"
	    });

	}(XRegExp));


	/***** unicode-scripts.js *****/

	/*!
	 * XRegExp Unicode Scripts v1.2.0
	 * (c) 2010-2012 Steven Levithan <http://xregexp.com/>
	 * MIT License
	 * Uses Unicode 6.1 <http://unicode.org/>
	 */

	/**
	 * Adds support for all Unicode scripts in the Basic Multilingual Plane (U+0000-U+FFFF).
	 * E.g., `\p{Latin}`. Token names are case insensitive, and any spaces, hyphens, and underscores
	 * are ignored.
	 * @requires XRegExp, XRegExp Unicode Base
	 */
	(function (XRegExp) {
	    "use strict";

	    if (!XRegExp.addUnicodePackage) {
	        throw new ReferenceError("Unicode Base must be loaded before Unicode Scripts");
	    }

	    XRegExp.install("extensibility");

	    XRegExp.addUnicodePackage({
	        Arabic: "0600-06040606-060B060D-061A061E0620-063F0641-064A0656-065E066A-066F0671-06DC06DE-06FF0750-077F08A008A2-08AC08E4-08FEFB50-FBC1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFCFE70-FE74FE76-FEFC",
	        Armenian: "0531-05560559-055F0561-0587058A058FFB13-FB17",
	        Balinese: "1B00-1B4B1B50-1B7C",
	        Bamum: "A6A0-A6F7",
	        Batak: "1BC0-1BF31BFC-1BFF",
	        Bengali: "0981-09830985-098C098F09900993-09A809AA-09B009B209B6-09B909BC-09C409C709C809CB-09CE09D709DC09DD09DF-09E309E6-09FB",
	        Bopomofo: "02EA02EB3105-312D31A0-31BA",
	        Braille: "2800-28FF",
	        Buginese: "1A00-1A1B1A1E1A1F",
	        Buhid: "1740-1753",
	        Canadian_Aboriginal: "1400-167F18B0-18F5",
	        Cham: "AA00-AA36AA40-AA4DAA50-AA59AA5C-AA5F",
	        Cherokee: "13A0-13F4",
	        Common: "0000-0040005B-0060007B-00A900AB-00B900BB-00BF00D700F702B9-02DF02E5-02E902EC-02FF0374037E038503870589060C061B061F06400660-066906DD096409650E3F0FD5-0FD810FB16EB-16ED173517361802180318051CD31CE11CE9-1CEC1CEE-1CF31CF51CF62000-200B200E-2064206A-20702074-207E2080-208E20A0-20B92100-21252127-2129212C-21312133-214D214F-215F21892190-23F32400-24262440-244A2460-26FF2701-27FF2900-2B4C2B50-2B592E00-2E3B2FF0-2FFB3000-300430063008-30203030-3037303C-303F309B309C30A030FB30FC3190-319F31C0-31E33220-325F327F-32CF3358-33FF4DC0-4DFFA700-A721A788-A78AA830-A839FD3EFD3FFDFDFE10-FE19FE30-FE52FE54-FE66FE68-FE6BFEFFFF01-FF20FF3B-FF40FF5B-FF65FF70FF9EFF9FFFE0-FFE6FFE8-FFEEFFF9-FFFD",
	        Coptic: "03E2-03EF2C80-2CF32CF9-2CFF",
	        Cyrillic: "0400-04840487-05271D2B1D782DE0-2DFFA640-A697A69F",
	        Devanagari: "0900-09500953-09630966-09770979-097FA8E0-A8FB",
	        Ethiopic: "1200-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A135D-137C1380-13992D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDEAB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2E",
	        Georgian: "10A0-10C510C710CD10D0-10FA10FC-10FF2D00-2D252D272D2D",
	        Glagolitic: "2C00-2C2E2C30-2C5E",
	        Greek: "0370-03730375-0377037A-037D038403860388-038A038C038E-03A103A3-03E103F0-03FF1D26-1D2A1D5D-1D611D66-1D6A1DBF1F00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FC41FC6-1FD31FD6-1FDB1FDD-1FEF1FF2-1FF41FF6-1FFE2126",
	        Gujarati: "0A81-0A830A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABC-0AC50AC7-0AC90ACB-0ACD0AD00AE0-0AE30AE6-0AF1",
	        Gurmukhi: "0A01-0A030A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A3C0A3E-0A420A470A480A4B-0A4D0A510A59-0A5C0A5E0A66-0A75",
	        Han: "2E80-2E992E9B-2EF32F00-2FD5300530073021-30293038-303B3400-4DB54E00-9FCCF900-FA6DFA70-FAD9",
	        Hangul: "1100-11FF302E302F3131-318E3200-321E3260-327EA960-A97CAC00-D7A3D7B0-D7C6D7CB-D7FBFFA0-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
	        Hanunoo: "1720-1734",
	        Hebrew: "0591-05C705D0-05EA05F0-05F4FB1D-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FB4F",
	        Hiragana: "3041-3096309D-309F",
	        Inherited: "0300-036F04850486064B-0655065F0670095109521CD0-1CD21CD4-1CE01CE2-1CE81CED1CF41DC0-1DE61DFC-1DFF200C200D20D0-20F0302A-302D3099309AFE00-FE0FFE20-FE26",
	        Javanese: "A980-A9CDA9CF-A9D9A9DEA9DF",
	        Kannada: "0C820C830C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBC-0CC40CC6-0CC80CCA-0CCD0CD50CD60CDE0CE0-0CE30CE6-0CEF0CF10CF2",
	        Katakana: "30A1-30FA30FD-30FF31F0-31FF32D0-32FE3300-3357FF66-FF6FFF71-FF9D",
	        Kayah_Li: "A900-A92F",
	        Khmer: "1780-17DD17E0-17E917F0-17F919E0-19FF",
	        Lao: "0E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB90EBB-0EBD0EC0-0EC40EC60EC8-0ECD0ED0-0ED90EDC-0EDF",
	        Latin: "0041-005A0061-007A00AA00BA00C0-00D600D8-00F600F8-02B802E0-02E41D00-1D251D2C-1D5C1D62-1D651D6B-1D771D79-1DBE1E00-1EFF2071207F2090-209C212A212B2132214E2160-21882C60-2C7FA722-A787A78B-A78EA790-A793A7A0-A7AAA7F8-A7FFFB00-FB06FF21-FF3AFF41-FF5A",
	        Lepcha: "1C00-1C371C3B-1C491C4D-1C4F",
	        Limbu: "1900-191C1920-192B1930-193B19401944-194F",
	        Lisu: "A4D0-A4FF",
	        Malayalam: "0D020D030D05-0D0C0D0E-0D100D12-0D3A0D3D-0D440D46-0D480D4A-0D4E0D570D60-0D630D66-0D750D79-0D7F",
	        Mandaic: "0840-085B085E",
	        Meetei_Mayek: "AAE0-AAF6ABC0-ABEDABF0-ABF9",
	        Mongolian: "1800180118041806-180E1810-18191820-18771880-18AA",
	        Myanmar: "1000-109FAA60-AA7B",
	        New_Tai_Lue: "1980-19AB19B0-19C919D0-19DA19DE19DF",
	        Nko: "07C0-07FA",
	        Ogham: "1680-169C",
	        Ol_Chiki: "1C50-1C7F",
	        Oriya: "0B01-0B030B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3C-0B440B470B480B4B-0B4D0B560B570B5C0B5D0B5F-0B630B66-0B77",
	        Phags_Pa: "A840-A877",
	        Rejang: "A930-A953A95F",
	        Runic: "16A0-16EA16EE-16F0",
	        Samaritan: "0800-082D0830-083E",
	        Saurashtra: "A880-A8C4A8CE-A8D9",
	        Sinhala: "0D820D830D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60DCA0DCF-0DD40DD60DD8-0DDF0DF2-0DF4",
	        Sundanese: "1B80-1BBF1CC0-1CC7",
	        Syloti_Nagri: "A800-A82B",
	        Syriac: "0700-070D070F-074A074D-074F",
	        Tagalog: "1700-170C170E-1714",
	        Tagbanwa: "1760-176C176E-177017721773",
	        Tai_Le: "1950-196D1970-1974",
	        Tai_Tham: "1A20-1A5E1A60-1A7C1A7F-1A891A90-1A991AA0-1AAD",
	        Tai_Viet: "AA80-AAC2AADB-AADF",
	        Tamil: "0B820B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BBE-0BC20BC6-0BC80BCA-0BCD0BD00BD70BE6-0BFA",
	        Telugu: "0C01-0C030C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D-0C440C46-0C480C4A-0C4D0C550C560C580C590C60-0C630C66-0C6F0C78-0C7F",
	        Thaana: "0780-07B1",
	        Thai: "0E01-0E3A0E40-0E5B",
	        Tibetan: "0F00-0F470F49-0F6C0F71-0F970F99-0FBC0FBE-0FCC0FCE-0FD40FD90FDA",
	        Tifinagh: "2D30-2D672D6F2D702D7F",
	        Vai: "A500-A62B",
	        Yi: "A000-A48CA490-A4C6"
	    });

	}(XRegExp));


	/***** unicode-blocks.js *****/

	/*!
	 * XRegExp Unicode Blocks v1.2.0
	 * (c) 2010-2012 Steven Levithan <http://xregexp.com/>
	 * MIT License
	 * Uses Unicode 6.1 <http://unicode.org/>
	 */

	/**
	 * Adds support for all Unicode blocks in the Basic Multilingual Plane (U+0000-U+FFFF). Unicode
	 * blocks use the prefix "In". E.g., `\p{InBasicLatin}`. Token names are case insensitive, and any
	 * spaces, hyphens, and underscores are ignored.
	 * @requires XRegExp, XRegExp Unicode Base
	 */
	(function (XRegExp) {
	    "use strict";

	    if (!XRegExp.addUnicodePackage) {
	        throw new ReferenceError("Unicode Base must be loaded before Unicode Blocks");
	    }

	    XRegExp.install("extensibility");

	    XRegExp.addUnicodePackage({
	        InBasic_Latin: "0000-007F",
	        InLatin_1_Supplement: "0080-00FF",
	        InLatin_Extended_A: "0100-017F",
	        InLatin_Extended_B: "0180-024F",
	        InIPA_Extensions: "0250-02AF",
	        InSpacing_Modifier_Letters: "02B0-02FF",
	        InCombining_Diacritical_Marks: "0300-036F",
	        InGreek_and_Coptic: "0370-03FF",
	        InCyrillic: "0400-04FF",
	        InCyrillic_Supplement: "0500-052F",
	        InArmenian: "0530-058F",
	        InHebrew: "0590-05FF",
	        InArabic: "0600-06FF",
	        InSyriac: "0700-074F",
	        InArabic_Supplement: "0750-077F",
	        InThaana: "0780-07BF",
	        InNKo: "07C0-07FF",
	        InSamaritan: "0800-083F",
	        InMandaic: "0840-085F",
	        InArabic_Extended_A: "08A0-08FF",
	        InDevanagari: "0900-097F",
	        InBengali: "0980-09FF",
	        InGurmukhi: "0A00-0A7F",
	        InGujarati: "0A80-0AFF",
	        InOriya: "0B00-0B7F",
	        InTamil: "0B80-0BFF",
	        InTelugu: "0C00-0C7F",
	        InKannada: "0C80-0CFF",
	        InMalayalam: "0D00-0D7F",
	        InSinhala: "0D80-0DFF",
	        InThai: "0E00-0E7F",
	        InLao: "0E80-0EFF",
	        InTibetan: "0F00-0FFF",
	        InMyanmar: "1000-109F",
	        InGeorgian: "10A0-10FF",
	        InHangul_Jamo: "1100-11FF",
	        InEthiopic: "1200-137F",
	        InEthiopic_Supplement: "1380-139F",
	        InCherokee: "13A0-13FF",
	        InUnified_Canadian_Aboriginal_Syllabics: "1400-167F",
	        InOgham: "1680-169F",
	        InRunic: "16A0-16FF",
	        InTagalog: "1700-171F",
	        InHanunoo: "1720-173F",
	        InBuhid: "1740-175F",
	        InTagbanwa: "1760-177F",
	        InKhmer: "1780-17FF",
	        InMongolian: "1800-18AF",
	        InUnified_Canadian_Aboriginal_Syllabics_Extended: "18B0-18FF",
	        InLimbu: "1900-194F",
	        InTai_Le: "1950-197F",
	        InNew_Tai_Lue: "1980-19DF",
	        InKhmer_Symbols: "19E0-19FF",
	        InBuginese: "1A00-1A1F",
	        InTai_Tham: "1A20-1AAF",
	        InBalinese: "1B00-1B7F",
	        InSundanese: "1B80-1BBF",
	        InBatak: "1BC0-1BFF",
	        InLepcha: "1C00-1C4F",
	        InOl_Chiki: "1C50-1C7F",
	        InSundanese_Supplement: "1CC0-1CCF",
	        InVedic_Extensions: "1CD0-1CFF",
	        InPhonetic_Extensions: "1D00-1D7F",
	        InPhonetic_Extensions_Supplement: "1D80-1DBF",
	        InCombining_Diacritical_Marks_Supplement: "1DC0-1DFF",
	        InLatin_Extended_Additional: "1E00-1EFF",
	        InGreek_Extended: "1F00-1FFF",
	        InGeneral_Punctuation: "2000-206F",
	        InSuperscripts_and_Subscripts: "2070-209F",
	        InCurrency_Symbols: "20A0-20CF",
	        InCombining_Diacritical_Marks_for_Symbols: "20D0-20FF",
	        InLetterlike_Symbols: "2100-214F",
	        InNumber_Forms: "2150-218F",
	        InArrows: "2190-21FF",
	        InMathematical_Operators: "2200-22FF",
	        InMiscellaneous_Technical: "2300-23FF",
	        InControl_Pictures: "2400-243F",
	        InOptical_Character_Recognition: "2440-245F",
	        InEnclosed_Alphanumerics: "2460-24FF",
	        InBox_Drawing: "2500-257F",
	        InBlock_Elements: "2580-259F",
	        InGeometric_Shapes: "25A0-25FF",
	        InMiscellaneous_Symbols: "2600-26FF",
	        InDingbats: "2700-27BF",
	        InMiscellaneous_Mathematical_Symbols_A: "27C0-27EF",
	        InSupplemental_Arrows_A: "27F0-27FF",
	        InBraille_Patterns: "2800-28FF",
	        InSupplemental_Arrows_B: "2900-297F",
	        InMiscellaneous_Mathematical_Symbols_B: "2980-29FF",
	        InSupplemental_Mathematical_Operators: "2A00-2AFF",
	        InMiscellaneous_Symbols_and_Arrows: "2B00-2BFF",
	        InGlagolitic: "2C00-2C5F",
	        InLatin_Extended_C: "2C60-2C7F",
	        InCoptic: "2C80-2CFF",
	        InGeorgian_Supplement: "2D00-2D2F",
	        InTifinagh: "2D30-2D7F",
	        InEthiopic_Extended: "2D80-2DDF",
	        InCyrillic_Extended_A: "2DE0-2DFF",
	        InSupplemental_Punctuation: "2E00-2E7F",
	        InCJK_Radicals_Supplement: "2E80-2EFF",
	        InKangxi_Radicals: "2F00-2FDF",
	        InIdeographic_Description_Characters: "2FF0-2FFF",
	        InCJK_Symbols_and_Punctuation: "3000-303F",
	        InHiragana: "3040-309F",
	        InKatakana: "30A0-30FF",
	        InBopomofo: "3100-312F",
	        InHangul_Compatibility_Jamo: "3130-318F",
	        InKanbun: "3190-319F",
	        InBopomofo_Extended: "31A0-31BF",
	        InCJK_Strokes: "31C0-31EF",
	        InKatakana_Phonetic_Extensions: "31F0-31FF",
	        InEnclosed_CJK_Letters_and_Months: "3200-32FF",
	        InCJK_Compatibility: "3300-33FF",
	        InCJK_Unified_Ideographs_Extension_A: "3400-4DBF",
	        InYijing_Hexagram_Symbols: "4DC0-4DFF",
	        InCJK_Unified_Ideographs: "4E00-9FFF",
	        InYi_Syllables: "A000-A48F",
	        InYi_Radicals: "A490-A4CF",
	        InLisu: "A4D0-A4FF",
	        InVai: "A500-A63F",
	        InCyrillic_Extended_B: "A640-A69F",
	        InBamum: "A6A0-A6FF",
	        InModifier_Tone_Letters: "A700-A71F",
	        InLatin_Extended_D: "A720-A7FF",
	        InSyloti_Nagri: "A800-A82F",
	        InCommon_Indic_Number_Forms: "A830-A83F",
	        InPhags_pa: "A840-A87F",
	        InSaurashtra: "A880-A8DF",
	        InDevanagari_Extended: "A8E0-A8FF",
	        InKayah_Li: "A900-A92F",
	        InRejang: "A930-A95F",
	        InHangul_Jamo_Extended_A: "A960-A97F",
	        InJavanese: "A980-A9DF",
	        InCham: "AA00-AA5F",
	        InMyanmar_Extended_A: "AA60-AA7F",
	        InTai_Viet: "AA80-AADF",
	        InMeetei_Mayek_Extensions: "AAE0-AAFF",
	        InEthiopic_Extended_A: "AB00-AB2F",
	        InMeetei_Mayek: "ABC0-ABFF",
	        InHangul_Syllables: "AC00-D7AF",
	        InHangul_Jamo_Extended_B: "D7B0-D7FF",
	        InHigh_Surrogates: "D800-DB7F",
	        InHigh_Private_Use_Surrogates: "DB80-DBFF",
	        InLow_Surrogates: "DC00-DFFF",
	        InPrivate_Use_Area: "E000-F8FF",
	        InCJK_Compatibility_Ideographs: "F900-FAFF",
	        InAlphabetic_Presentation_Forms: "FB00-FB4F",
	        InArabic_Presentation_Forms_A: "FB50-FDFF",
	        InVariation_Selectors: "FE00-FE0F",
	        InVertical_Forms: "FE10-FE1F",
	        InCombining_Half_Marks: "FE20-FE2F",
	        InCJK_Compatibility_Forms: "FE30-FE4F",
	        InSmall_Form_Variants: "FE50-FE6F",
	        InArabic_Presentation_Forms_B: "FE70-FEFF",
	        InHalfwidth_and_Fullwidth_Forms: "FF00-FFEF",
	        InSpecials: "FFF0-FFFF"
	    });

	}(XRegExp));


	/***** unicode-properties.js *****/

	/*!
	 * XRegExp Unicode Properties v1.0.0
	 * (c) 2012 Steven Levithan <http://xregexp.com/>
	 * MIT License
	 * Uses Unicode 6.1 <http://unicode.org/>
	 */

	/**
	 * Adds Unicode properties necessary to meet Level 1 Unicode support (detailed in UTS#18 RL1.2).
	 * Includes code points from the Basic Multilingual Plane (U+0000-U+FFFF) only. Token names are
	 * case insensitive, and any spaces, hyphens, and underscores are ignored.
	 * @requires XRegExp, XRegExp Unicode Base
	 */
	(function (XRegExp) {
	    "use strict";

	    if (!XRegExp.addUnicodePackage) {
	        throw new ReferenceError("Unicode Base must be loaded before Unicode Properties");
	    }

	    XRegExp.install("extensibility");

	    XRegExp.addUnicodePackage({
	        Alphabetic: "0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE03450370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05270531-055605590561-058705B0-05BD05BF05C105C205C405C505C705D0-05EA05F0-05F20610-061A0620-06570659-065F066E-06D306D5-06DC06E1-06E806ED-06EF06FA-06FC06FF0710-073F074D-07B107CA-07EA07F407F507FA0800-0817081A-082C0840-085808A008A2-08AC08E4-08E908F0-08FE0900-093B093D-094C094E-09500955-09630971-09770979-097F0981-09830985-098C098F09900993-09A809AA-09B009B209B6-09B909BD-09C409C709C809CB09CC09CE09D709DC09DD09DF-09E309F009F10A01-0A030A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A3E-0A420A470A480A4B0A4C0A510A59-0A5C0A5E0A70-0A750A81-0A830A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD-0AC50AC7-0AC90ACB0ACC0AD00AE0-0AE30B01-0B030B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D-0B440B470B480B4B0B4C0B560B570B5C0B5D0B5F-0B630B710B820B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BBE-0BC20BC6-0BC80BCA-0BCC0BD00BD70C01-0C030C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D-0C440C46-0C480C4A-0C4C0C550C560C580C590C60-0C630C820C830C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD-0CC40CC6-0CC80CCA-0CCC0CD50CD60CDE0CE0-0CE30CF10CF20D020D030D05-0D0C0D0E-0D100D12-0D3A0D3D-0D440D46-0D480D4A-0D4C0D4E0D570D60-0D630D7A-0D7F0D820D830D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60DCF-0DD40DD60DD8-0DDF0DF20DF30E01-0E3A0E40-0E460E4D0E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB90EBB-0EBD0EC0-0EC40EC60ECD0EDC-0EDF0F000F40-0F470F49-0F6C0F71-0F810F88-0F970F99-0FBC1000-10361038103B-103F1050-10621065-1068106E-1086108E109C109D10A0-10C510C710CD10D0-10FA10FC-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A135F1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA16EE-16F01700-170C170E-17131720-17331740-17531760-176C176E-1770177217731780-17B317B6-17C817D717DC1820-18771880-18AA18B0-18F51900-191C1920-192B1930-19381950-196D1970-19741980-19AB19B0-19C91A00-1A1B1A20-1A5E1A61-1A741AA71B00-1B331B35-1B431B45-1B4B1B80-1BA91BAC-1BAF1BBA-1BE51BE7-1BF11C00-1C351C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF31CF51CF61D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209C21022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E2160-218824B6-24E92C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2CF22CF32D00-2D252D272D2D2D30-2D672D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2DE0-2DFF2E2F3005-30073021-30293031-30353038-303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31BA31F0-31FF3400-4DB54E00-9FCCA000-A48CA4D0-A4FDA500-A60CA610-A61FA62AA62BA640-A66EA674-A67BA67F-A697A69F-A6EFA717-A71FA722-A788A78B-A78EA790-A793A7A0-A7AAA7F8-A801A803-A805A807-A80AA80C-A827A840-A873A880-A8C3A8F2-A8F7A8FBA90A-A92AA930-A952A960-A97CA980-A9B2A9B4-A9BFA9CFAA00-AA36AA40-AA4DAA60-AA76AA7AAA80-AABEAAC0AAC2AADB-AADDAAE0-AAEFAAF2-AAF5AB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2EABC0-ABEAAC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1D-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
	        Uppercase: "0041-005A00C0-00D600D8-00DE01000102010401060108010A010C010E01100112011401160118011A011C011E01200122012401260128012A012C012E01300132013401360139013B013D013F0141014301450147014A014C014E01500152015401560158015A015C015E01600162016401660168016A016C016E017001720174017601780179017B017D018101820184018601870189-018B018E-0191019301940196-0198019C019D019F01A001A201A401A601A701A901AC01AE01AF01B1-01B301B501B701B801BC01C401C701CA01CD01CF01D101D301D501D701D901DB01DE01E001E201E401E601E801EA01EC01EE01F101F401F6-01F801FA01FC01FE02000202020402060208020A020C020E02100212021402160218021A021C021E02200222022402260228022A022C022E02300232023A023B023D023E02410243-02460248024A024C024E03700372037603860388-038A038C038E038F0391-03A103A3-03AB03CF03D2-03D403D803DA03DC03DE03E003E203E403E603E803EA03EC03EE03F403F703F903FA03FD-042F04600462046404660468046A046C046E04700472047404760478047A047C047E0480048A048C048E04900492049404960498049A049C049E04A004A204A404A604A804AA04AC04AE04B004B204B404B604B804BA04BC04BE04C004C104C304C504C704C904CB04CD04D004D204D404D604D804DA04DC04DE04E004E204E404E604E804EA04EC04EE04F004F204F404F604F804FA04FC04FE05000502050405060508050A050C050E05100512051405160518051A051C051E05200522052405260531-055610A0-10C510C710CD1E001E021E041E061E081E0A1E0C1E0E1E101E121E141E161E181E1A1E1C1E1E1E201E221E241E261E281E2A1E2C1E2E1E301E321E341E361E381E3A1E3C1E3E1E401E421E441E461E481E4A1E4C1E4E1E501E521E541E561E581E5A1E5C1E5E1E601E621E641E661E681E6A1E6C1E6E1E701E721E741E761E781E7A1E7C1E7E1E801E821E841E861E881E8A1E8C1E8E1E901E921E941E9E1EA01EA21EA41EA61EA81EAA1EAC1EAE1EB01EB21EB41EB61EB81EBA1EBC1EBE1EC01EC21EC41EC61EC81ECA1ECC1ECE1ED01ED21ED41ED61ED81EDA1EDC1EDE1EE01EE21EE41EE61EE81EEA1EEC1EEE1EF01EF21EF41EF61EF81EFA1EFC1EFE1F08-1F0F1F18-1F1D1F28-1F2F1F38-1F3F1F48-1F4D1F591F5B1F5D1F5F1F68-1F6F1FB8-1FBB1FC8-1FCB1FD8-1FDB1FE8-1FEC1FF8-1FFB21022107210B-210D2110-211221152119-211D212421262128212A-212D2130-2133213E213F21452160-216F218324B6-24CF2C00-2C2E2C602C62-2C642C672C692C6B2C6D-2C702C722C752C7E-2C802C822C842C862C882C8A2C8C2C8E2C902C922C942C962C982C9A2C9C2C9E2CA02CA22CA42CA62CA82CAA2CAC2CAE2CB02CB22CB42CB62CB82CBA2CBC2CBE2CC02CC22CC42CC62CC82CCA2CCC2CCE2CD02CD22CD42CD62CD82CDA2CDC2CDE2CE02CE22CEB2CED2CF2A640A642A644A646A648A64AA64CA64EA650A652A654A656A658A65AA65CA65EA660A662A664A666A668A66AA66CA680A682A684A686A688A68AA68CA68EA690A692A694A696A722A724A726A728A72AA72CA72EA732A734A736A738A73AA73CA73EA740A742A744A746A748A74AA74CA74EA750A752A754A756A758A75AA75CA75EA760A762A764A766A768A76AA76CA76EA779A77BA77DA77EA780A782A784A786A78BA78DA790A792A7A0A7A2A7A4A7A6A7A8A7AAFF21-FF3A",
	        Lowercase: "0061-007A00AA00B500BA00DF-00F600F8-00FF01010103010501070109010B010D010F01110113011501170119011B011D011F01210123012501270129012B012D012F01310133013501370138013A013C013E014001420144014601480149014B014D014F01510153015501570159015B015D015F01610163016501670169016B016D016F0171017301750177017A017C017E-0180018301850188018C018D019201950199-019B019E01A101A301A501A801AA01AB01AD01B001B401B601B901BA01BD-01BF01C601C901CC01CE01D001D201D401D601D801DA01DC01DD01DF01E101E301E501E701E901EB01ED01EF01F001F301F501F901FB01FD01FF02010203020502070209020B020D020F02110213021502170219021B021D021F02210223022502270229022B022D022F02310233-0239023C023F0240024202470249024B024D024F-02930295-02B802C002C102E0-02E40345037103730377037A-037D039003AC-03CE03D003D103D5-03D703D903DB03DD03DF03E103E303E503E703E903EB03ED03EF-03F303F503F803FB03FC0430-045F04610463046504670469046B046D046F04710473047504770479047B047D047F0481048B048D048F04910493049504970499049B049D049F04A104A304A504A704A904AB04AD04AF04B104B304B504B704B904BB04BD04BF04C204C404C604C804CA04CC04CE04CF04D104D304D504D704D904DB04DD04DF04E104E304E504E704E904EB04ED04EF04F104F304F504F704F904FB04FD04FF05010503050505070509050B050D050F05110513051505170519051B051D051F05210523052505270561-05871D00-1DBF1E011E031E051E071E091E0B1E0D1E0F1E111E131E151E171E191E1B1E1D1E1F1E211E231E251E271E291E2B1E2D1E2F1E311E331E351E371E391E3B1E3D1E3F1E411E431E451E471E491E4B1E4D1E4F1E511E531E551E571E591E5B1E5D1E5F1E611E631E651E671E691E6B1E6D1E6F1E711E731E751E771E791E7B1E7D1E7F1E811E831E851E871E891E8B1E8D1E8F1E911E931E95-1E9D1E9F1EA11EA31EA51EA71EA91EAB1EAD1EAF1EB11EB31EB51EB71EB91EBB1EBD1EBF1EC11EC31EC51EC71EC91ECB1ECD1ECF1ED11ED31ED51ED71ED91EDB1EDD1EDF1EE11EE31EE51EE71EE91EEB1EED1EEF1EF11EF31EF51EF71EF91EFB1EFD1EFF-1F071F10-1F151F20-1F271F30-1F371F40-1F451F50-1F571F60-1F671F70-1F7D1F80-1F871F90-1F971FA0-1FA71FB0-1FB41FB61FB71FBE1FC2-1FC41FC61FC71FD0-1FD31FD61FD71FE0-1FE71FF2-1FF41FF61FF72071207F2090-209C210A210E210F2113212F21342139213C213D2146-2149214E2170-217F218424D0-24E92C30-2C5E2C612C652C662C682C6A2C6C2C712C732C742C76-2C7D2C812C832C852C872C892C8B2C8D2C8F2C912C932C952C972C992C9B2C9D2C9F2CA12CA32CA52CA72CA92CAB2CAD2CAF2CB12CB32CB52CB72CB92CBB2CBD2CBF2CC12CC32CC52CC72CC92CCB2CCD2CCF2CD12CD32CD52CD72CD92CDB2CDD2CDF2CE12CE32CE42CEC2CEE2CF32D00-2D252D272D2DA641A643A645A647A649A64BA64DA64FA651A653A655A657A659A65BA65DA65FA661A663A665A667A669A66BA66DA681A683A685A687A689A68BA68DA68FA691A693A695A697A723A725A727A729A72BA72DA72F-A731A733A735A737A739A73BA73DA73FA741A743A745A747A749A74BA74DA74FA751A753A755A757A759A75BA75DA75FA761A763A765A767A769A76BA76DA76F-A778A77AA77CA77FA781A783A785A787A78CA78EA791A793A7A1A7A3A7A5A7A7A7A9A7F8-A7FAFB00-FB06FB13-FB17FF41-FF5A",
	        White_Space: "0009-000D0020008500A01680180E2000-200A20282029202F205F3000",
	        Noncharacter_Code_Point: "FDD0-FDEFFFFEFFFF",
	        Default_Ignorable_Code_Point: "00AD034F115F116017B417B5180B-180D200B-200F202A-202E2060-206F3164FE00-FE0FFEFFFFA0FFF0-FFF8",
	        // \p{Any} matches a code unit. To match any code point via surrogate pairs, use (?:[\0-\uD7FF\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF])
	        Any: "0000-FFFF", // \p{^Any} compiles to [^\u0000-\uFFFF]; [\p{^Any}] to []
	        Ascii: "0000-007F",
	        // \p{Assigned} is equivalent to \p{^Cn}
	        //Assigned: XRegExp("[\\p{^Cn}]").source.replace(/[[\]]|\\u/g, "") // Negation inside a character class triggers inversion
	        Assigned: "0000-0377037A-037E0384-038A038C038E-03A103A3-05270531-05560559-055F0561-05870589058A058F0591-05C705D0-05EA05F0-05F40600-06040606-061B061E-070D070F-074A074D-07B107C0-07FA0800-082D0830-083E0840-085B085E08A008A2-08AC08E4-08FE0900-09770979-097F0981-09830985-098C098F09900993-09A809AA-09B009B209B6-09B909BC-09C409C709C809CB-09CE09D709DC09DD09DF-09E309E6-09FB0A01-0A030A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A3C0A3E-0A420A470A480A4B-0A4D0A510A59-0A5C0A5E0A66-0A750A81-0A830A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABC-0AC50AC7-0AC90ACB-0ACD0AD00AE0-0AE30AE6-0AF10B01-0B030B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3C-0B440B470B480B4B-0B4D0B560B570B5C0B5D0B5F-0B630B66-0B770B820B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BBE-0BC20BC6-0BC80BCA-0BCD0BD00BD70BE6-0BFA0C01-0C030C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D-0C440C46-0C480C4A-0C4D0C550C560C580C590C60-0C630C66-0C6F0C78-0C7F0C820C830C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBC-0CC40CC6-0CC80CCA-0CCD0CD50CD60CDE0CE0-0CE30CE6-0CEF0CF10CF20D020D030D05-0D0C0D0E-0D100D12-0D3A0D3D-0D440D46-0D480D4A-0D4E0D570D60-0D630D66-0D750D79-0D7F0D820D830D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60DCA0DCF-0DD40DD60DD8-0DDF0DF2-0DF40E01-0E3A0E3F-0E5B0E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB90EBB-0EBD0EC0-0EC40EC60EC8-0ECD0ED0-0ED90EDC-0EDF0F00-0F470F49-0F6C0F71-0F970F99-0FBC0FBE-0FCC0FCE-0FDA1000-10C510C710CD10D0-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A135D-137C1380-139913A0-13F41400-169C16A0-16F01700-170C170E-17141720-17361740-17531760-176C176E-1770177217731780-17DD17E0-17E917F0-17F91800-180E1810-18191820-18771880-18AA18B0-18F51900-191C1920-192B1930-193B19401944-196D1970-19741980-19AB19B0-19C919D0-19DA19DE-1A1B1A1E-1A5E1A60-1A7C1A7F-1A891A90-1A991AA0-1AAD1B00-1B4B1B50-1B7C1B80-1BF31BFC-1C371C3B-1C491C4D-1C7F1CC0-1CC71CD0-1CF61D00-1DE61DFC-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FC41FC6-1FD31FD6-1FDB1FDD-1FEF1FF2-1FF41FF6-1FFE2000-2064206A-20712074-208E2090-209C20A0-20B920D0-20F02100-21892190-23F32400-24262440-244A2460-26FF2701-2B4C2B50-2B592C00-2C2E2C30-2C5E2C60-2CF32CF9-2D252D272D2D2D30-2D672D6F2D702D7F-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2DE0-2E3B2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB3000-303F3041-30963099-30FF3105-312D3131-318E3190-31BA31C0-31E331F0-321E3220-32FE3300-4DB54DC0-9FCCA000-A48CA490-A4C6A4D0-A62BA640-A697A69F-A6F7A700-A78EA790-A793A7A0-A7AAA7F8-A82BA830-A839A840-A877A880-A8C4A8CE-A8D9A8E0-A8FBA900-A953A95F-A97CA980-A9CDA9CF-A9D9A9DEA9DFAA00-AA36AA40-AA4DAA50-AA59AA5C-AA7BAA80-AAC2AADB-AAF6AB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2EABC0-ABEDABF0-ABF9AC00-D7A3D7B0-D7C6D7CB-D7FBD800-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1D-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBC1FBD3-FD3FFD50-FD8FFD92-FDC7FDF0-FDFDFE00-FE19FE20-FE26FE30-FE52FE54-FE66FE68-FE6BFE70-FE74FE76-FEFCFEFFFF01-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDCFFE0-FFE6FFE8-FFEEFFF9-FFFD"
	    });

	}(XRegExp));


	/***** matchrecursive.js *****/

	/*!
	 * XRegExp.matchRecursive v0.2.0
	 * (c) 2009-2012 Steven Levithan <http://xregexp.com/>
	 * MIT License
	 */

	(function (XRegExp) {
	    "use strict";

	/**
	 * Returns a match detail object composed of the provided values.
	 * @private
	 */
	    function row(value, name, start, end) {
	        return {value:value, name:name, start:start, end:end};
	    }

	/**
	 * Returns an array of match strings between outermost left and right delimiters, or an array of
	 * objects with detailed match parts and position data. An error is thrown if delimiters are
	 * unbalanced within the data.
	 * @memberOf XRegExp
	 * @param {String} str String to search.
	 * @param {String} left Left delimiter as an XRegExp pattern.
	 * @param {String} right Right delimiter as an XRegExp pattern.
	 * @param {String} [flags] Flags for the left and right delimiters. Use any of: `gimnsxy`.
	 * @param {Object} [options] Lets you specify `valueNames` and `escapeChar` options.
	 * @returns {Array} Array of matches, or an empty array.
	 * @example
	 *
	 * // Basic usage
	 * var str = '(t((e))s)t()(ing)';
	 * XRegExp.matchRecursive(str, '\\(', '\\)', 'g');
	 * // -> ['t((e))s', '', 'ing']
	 *
	 * // Extended information mode with valueNames
	 * str = 'Here is <div> <div>an</div></div> example';
	 * XRegExp.matchRecursive(str, '<div\\s*>', '</div>', 'gi', {
	 *   valueNames: ['between', 'left', 'match', 'right']
	 * });
	 * // -> [
	 * // {name: 'between', value: 'Here is ',       start: 0,  end: 8},
	 * // {name: 'left',    value: '<div>',          start: 8,  end: 13},
	 * // {name: 'match',   value: ' <div>an</div>', start: 13, end: 27},
	 * // {name: 'right',   value: '</div>',         start: 27, end: 33},
	 * // {name: 'between', value: ' example',       start: 33, end: 41}
	 * // ]
	 *
	 * // Omitting unneeded parts with null valueNames, and using escapeChar
	 * str = '...{1}\\{{function(x,y){return y+x;}}';
	 * XRegExp.matchRecursive(str, '{', '}', 'g', {
	 *   valueNames: ['literal', null, 'value', null],
	 *   escapeChar: '\\'
	 * });
	 * // -> [
	 * // {name: 'literal', value: '...', start: 0, end: 3},
	 * // {name: 'value',   value: '1',   start: 4, end: 5},
	 * // {name: 'literal', value: '\\{', start: 6, end: 8},
	 * // {name: 'value',   value: 'function(x,y){return y+x;}', start: 9, end: 35}
	 * // ]
	 *
	 * // Sticky mode via flag y
	 * str = '<1><<<2>>><3>4<5>';
	 * XRegExp.matchRecursive(str, '<', '>', 'gy');
	 * // -> ['1', '<<2>>', '3']
	 */
	    XRegExp.matchRecursive = function (str, left, right, flags, options) {
	        flags = flags || "";
	        options = options || {};
	        var global = flags.indexOf("g") > -1,
	            sticky = flags.indexOf("y") > -1,
	            basicFlags = flags.replace(/y/g, ""), // Flag y controlled internally
	            escapeChar = options.escapeChar,
	            vN = options.valueNames,
	            output = [],
	            openTokens = 0,
	            delimStart = 0,
	            delimEnd = 0,
	            lastOuterEnd = 0,
	            outerStart,
	            innerStart,
	            leftMatch,
	            rightMatch,
	            esc;
	        left = XRegExp(left, basicFlags);
	        right = XRegExp(right, basicFlags);

	        if (escapeChar) {
	            if (escapeChar.length > 1) {
	                throw new SyntaxError("can't use more than one escape character");
	            }
	            escapeChar = XRegExp.escape(escapeChar);
	            // Using XRegExp.union safely rewrites backreferences in `left` and `right`
	            esc = new RegExp(
	                "(?:" + escapeChar + "[\\S\\s]|(?:(?!" + XRegExp.union([left, right]).source + ")[^" + escapeChar + "])+)+",
	                flags.replace(/[^im]+/g, "") // Flags gy not needed here; flags nsx handled by XRegExp
	            );
	        }

	        while (true) {
	            // If using an escape character, advance to the delimiter's next starting position,
	            // skipping any escaped characters in between
	            if (escapeChar) {
	                delimEnd += (XRegExp.exec(str, esc, delimEnd, "sticky") || [""])[0].length;
	            }
	            leftMatch = XRegExp.exec(str, left, delimEnd);
	            rightMatch = XRegExp.exec(str, right, delimEnd);
	            // Keep the leftmost match only
	            if (leftMatch && rightMatch) {
	                if (leftMatch.index <= rightMatch.index) {
	                    rightMatch = null;
	                } else {
	                    leftMatch = null;
	                }
	            }
	            /* Paths (LM:leftMatch, RM:rightMatch, OT:openTokens):
	            LM | RM | OT | Result
	            1  | 0  | 1  | loop
	            1  | 0  | 0  | loop
	            0  | 1  | 1  | loop
	            0  | 1  | 0  | throw
	            0  | 0  | 1  | throw
	            0  | 0  | 0  | break
	            * Doesn't include the sticky mode special case
	            * Loop ends after the first completed match if `!global` */
	            if (leftMatch || rightMatch) {
	                delimStart = (leftMatch || rightMatch).index;
	                delimEnd = delimStart + (leftMatch || rightMatch)[0].length;
	            } else if (!openTokens) {
	                break;
	            }
	            if (sticky && !openTokens && delimStart > lastOuterEnd) {
	                break;
	            }
	            if (leftMatch) {
	                if (!openTokens) {
	                    outerStart = delimStart;
	                    innerStart = delimEnd;
	                }
	                ++openTokens;
	            } else if (rightMatch && openTokens) {
	                if (!--openTokens) {
	                    if (vN) {
	                        if (vN[0] && outerStart > lastOuterEnd) {
	                            output.push(row(vN[0], str.slice(lastOuterEnd, outerStart), lastOuterEnd, outerStart));
	                        }
	                        if (vN[1]) {
	                            output.push(row(vN[1], str.slice(outerStart, innerStart), outerStart, innerStart));
	                        }
	                        if (vN[2]) {
	                            output.push(row(vN[2], str.slice(innerStart, delimStart), innerStart, delimStart));
	                        }
	                        if (vN[3]) {
	                            output.push(row(vN[3], str.slice(delimStart, delimEnd), delimStart, delimEnd));
	                        }
	                    } else {
	                        output.push(str.slice(innerStart, delimStart));
	                    }
	                    lastOuterEnd = delimEnd;
	                    if (!global) {
	                        break;
	                    }
	                }
	            } else {
	                throw new Error("string contains unbalanced delimiters");
	            }
	            // If the delimiter matched an empty string, avoid an infinite loop
	            if (delimStart === delimEnd) {
	                ++delimEnd;
	            }
	        }

	        if (global && !sticky && vN && vN[0] && str.length > lastOuterEnd) {
	            output.push(row(vN[0], str.slice(lastOuterEnd), lastOuterEnd, str.length));
	        }

	        return output;
	    };

	}(XRegExp));


	/***** build.js *****/

	/*!
	 * XRegExp.build v0.1.0
	 * (c) 2012 Steven Levithan <http://xregexp.com/>
	 * MIT License
	 * Inspired by RegExp.create by Lea Verou <http://lea.verou.me/>
	 */

	(function (XRegExp) {
	    "use strict";

	    var subparts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g,
	        parts = XRegExp.union([/\({{([\w$]+)}}\)|{{([\w$]+)}}/, subparts], "g");

	/**
	 * Strips a leading `^` and trailing unescaped `$`, if both are present.
	 * @private
	 * @param {String} pattern Pattern to process.
	 * @returns {String} Pattern with edge anchors removed.
	 */
	    function deanchor(pattern) {
	        var startAnchor = /^(?:\(\?:\))?\^/, // Leading `^` or `(?:)^` (handles /x cruft)
	            endAnchor = /\$(?:\(\?:\))?$/; // Trailing `$` or `$(?:)` (handles /x cruft)
	        if (endAnchor.test(pattern.replace(/\\[\s\S]/g, ""))) { // Ensure trailing `$` isn't escaped
	            return pattern.replace(startAnchor, "").replace(endAnchor, "");
	        }
	        return pattern;
	    }

	/**
	 * Converts the provided value to an XRegExp.
	 * @private
	 * @param {String|RegExp} value Value to convert.
	 * @returns {RegExp} XRegExp object with XRegExp syntax applied.
	 */
	    function asXRegExp(value) {
	        return XRegExp.isRegExp(value) ?
	                (value.xregexp && !value.xregexp.isNative ? value : XRegExp(value.source)) :
	                XRegExp(value);
	    }

	/**
	 * Builds regexes using named subpatterns, for readability and pattern reuse. Backreferences in the
	 * outer pattern and provided subpatterns are automatically renumbered to work correctly. Native
	 * flags used by provided subpatterns are ignored in favor of the `flags` argument.
	 * @memberOf XRegExp
	 * @param {String} pattern XRegExp pattern using `{{name}}` for embedded subpatterns. Allows
	 *   `({{name}})` as shorthand for `(?<name>{{name}})`. Patterns cannot be embedded within
	 *   character classes.
	 * @param {Object} subs Lookup object for named subpatterns. Values can be strings or regexes. A
	 *   leading `^` and trailing unescaped `$` are stripped from subpatterns, if both are present.
	 * @param {String} [flags] Any combination of XRegExp flags.
	 * @returns {RegExp} Regex with interpolated subpatterns.
	 * @example
	 *
	 * var time = XRegExp.build('(?x)^ {{hours}} ({{minutes}}) $', {
	 *   hours: XRegExp.build('{{h12}} : | {{h24}}', {
	 *     h12: /1[0-2]|0?[1-9]/,
	 *     h24: /2[0-3]|[01][0-9]/
	 *   }, 'x'),
	 *   minutes: /^[0-5][0-9]$/
	 * });
	 * time.test('10:59'); // -> true
	 * XRegExp.exec('10:59', time).minutes; // -> '59'
	 */
	    XRegExp.build = function (pattern, subs, flags) {
	        var inlineFlags = /^\(\?([\w$]+)\)/.exec(pattern),
	            data = {},
	            numCaps = 0, // Caps is short for captures
	            numPriorCaps,
	            numOuterCaps = 0,
	            outerCapsMap = [0],
	            outerCapNames,
	            sub,
	            p;

	        // Add flags within a leading mode modifier to the overall pattern's flags
	        if (inlineFlags) {
	            flags = flags || "";
	            inlineFlags[1].replace(/./g, function (flag) {
	                flags += (flags.indexOf(flag) > -1 ? "" : flag); // Don't add duplicates
	            });
	        }

	        for (p in subs) {
	            if (subs.hasOwnProperty(p)) {
	                // Passing to XRegExp enables entended syntax for subpatterns provided as strings
	                // and ensures independent validity, lest an unescaped `(`, `)`, `[`, or trailing
	                // `\` breaks the `(?:)` wrapper. For subpatterns provided as regexes, it dies on
	                // octals and adds the `xregexp` property, for simplicity
	                sub = asXRegExp(subs[p]);
	                // Deanchoring allows embedding independently useful anchored regexes. If you
	                // really need to keep your anchors, double them (i.e., `^^...$$`)
	                data[p] = {pattern: deanchor(sub.source), names: sub.xregexp.captureNames || []};
	            }
	        }

	        // Passing to XRegExp dies on octals and ensures the outer pattern is independently valid;
	        // helps keep this simple. Named captures will be put back
	        pattern = asXRegExp(pattern);
	        outerCapNames = pattern.xregexp.captureNames || [];
	        pattern = pattern.source.replace(parts, function ($0, $1, $2, $3, $4) {
	            var subName = $1 || $2, capName, intro;
	            if (subName) { // Named subpattern
	                if (!data.hasOwnProperty(subName)) {
	                    throw new ReferenceError("undefined property " + $0);
	                }
	                if ($1) { // Named subpattern was wrapped in a capturing group
	                    capName = outerCapNames[numOuterCaps];
	                    outerCapsMap[++numOuterCaps] = ++numCaps;
	                    // If it's a named group, preserve the name. Otherwise, use the subpattern name
	                    // as the capture name
	                    intro = "(?<" + (capName || subName) + ">";
	                } else {
	                    intro = "(?:";
	                }
	                numPriorCaps = numCaps;
	                return intro + data[subName].pattern.replace(subparts, function (match, paren, backref) {
	                    if (paren) { // Capturing group
	                        capName = data[subName].names[numCaps - numPriorCaps];
	                        ++numCaps;
	                        if (capName) { // If the current capture has a name, preserve the name
	                            return "(?<" + capName + ">";
	                        }
	                    } else if (backref) { // Backreference
	                        return "\\" + (+backref + numPriorCaps); // Rewrite the backreference
	                    }
	                    return match;
	                }) + ")";
	            }
	            if ($3) { // Capturing group
	                capName = outerCapNames[numOuterCaps];
	                outerCapsMap[++numOuterCaps] = ++numCaps;
	                if (capName) { // If the current capture has a name, preserve the name
	                    return "(?<" + capName + ">";
	                }
	            } else if ($4) { // Backreference
	                return "\\" + outerCapsMap[+$4]; // Rewrite the backreference
	            }
	            return $0;
	        });

	        return XRegExp(pattern, flags);
	    };

	}(XRegExp));


	/***** prototypes.js *****/

	/*!
	 * XRegExp Prototype Methods v1.0.0
	 * (c) 2012 Steven Levithan <http://xregexp.com/>
	 * MIT License
	 */

	/**
	 * Adds a collection of methods to `XRegExp.prototype`. RegExp objects copied by XRegExp are also
	 * augmented with any `XRegExp.prototype` methods. Hence, the following work equivalently:
	 *
	 * XRegExp('[a-z]', 'ig').xexec('abc');
	 * XRegExp(/[a-z]/ig).xexec('abc');
	 * XRegExp.globalize(/[a-z]/i).xexec('abc');
	 */
	(function (XRegExp) {
	    "use strict";

	/**
	 * Copy properties of `b` to `a`.
	 * @private
	 * @param {Object} a Object that will receive new properties.
	 * @param {Object} b Object whose properties will be copied.
	 */
	    function extend(a, b) {
	        for (var p in b) {
	            if (b.hasOwnProperty(p)) {
	                a[p] = b[p];
	            }
	        }
	        //return a;
	    }

	    extend(XRegExp.prototype, {

	/**
	 * Implicitly calls the regex's `test` method with the first value in the provided arguments array.
	 * @memberOf XRegExp.prototype
	 * @param {*} context Ignored. Accepted only for congruity with `Function.prototype.apply`.
	 * @param {Array} args Array with the string to search as its first value.
	 * @returns {Boolean} Whether the regex matched the provided value.
	 * @example
	 *
	 * XRegExp('[a-z]').apply(null, ['abc']); // -> true
	 */
	        apply: function (context, args) {
	            return this.test(args[0]);
	        },

	/**
	 * Implicitly calls the regex's `test` method with the provided string.
	 * @memberOf XRegExp.prototype
	 * @param {*} context Ignored. Accepted only for congruity with `Function.prototype.call`.
	 * @param {String} str String to search.
	 * @returns {Boolean} Whether the regex matched the provided value.
	 * @example
	 *
	 * XRegExp('[a-z]').call(null, 'abc'); // -> true
	 */
	        call: function (context, str) {
	            return this.test(str);
	        },

	/**
	 * Implicitly calls {@link #XRegExp.forEach}.
	 * @memberOf XRegExp.prototype
	 * @example
	 *
	 * XRegExp('\\d').forEach('1a2345', function (match, i) {
	 *   if (i % 2) this.push(+match[0]);
	 * }, []);
	 * // -> [2, 4]
	 */
	        forEach: function (str, callback, context) {
	            return XRegExp.forEach(str, this, callback, context);
	        },

	/**
	 * Implicitly calls {@link #XRegExp.globalize}.
	 * @memberOf XRegExp.prototype
	 * @example
	 *
	 * var globalCopy = XRegExp('regex').globalize();
	 * globalCopy.global; // -> true
	 */
	        globalize: function () {
	            return XRegExp.globalize(this);
	        },

	/**
	 * Implicitly calls {@link #XRegExp.exec}.
	 * @memberOf XRegExp.prototype
	 * @example
	 *
	 * var match = XRegExp('U\\+(?<hex>[0-9A-F]{4})').xexec('U+2620');
	 * match.hex; // -> '2620'
	 */
	        xexec: function (str, pos, sticky) {
	            return XRegExp.exec(str, this, pos, sticky);
	        },

	/**
	 * Implicitly calls {@link #XRegExp.test}.
	 * @memberOf XRegExp.prototype
	 * @example
	 *
	 * XRegExp('c').xtest('abc'); // -> true
	 */
	        xtest: function (str, pos, sticky) {
	            return XRegExp.test(str, this, pos, sticky);
	        }

	    });

	}(XRegExp));



/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	module.exports = Stream;

	var EE = __webpack_require__(27).EventEmitter;
	var inherits = __webpack_require__(28);

	inherits(Stream, EE);
	Stream.Readable = __webpack_require__(29);
	Stream.Writable = __webpack_require__(43);
	Stream.Duplex = __webpack_require__(44);
	Stream.Transform = __webpack_require__(45);
	Stream.PassThrough = __webpack_require__(46);

	// Backwards-compat with node 0.4.x
	Stream.Stream = Stream;



	// old-style streams.  Note that the pipe method (the only relevant
	// part of this class) is overridden in the Readable class.

	function Stream() {
	  EE.call(this);
	}

	Stream.prototype.pipe = function(dest, options) {
	  var source = this;

	  function ondata(chunk) {
	    if (dest.writable) {
	      if (false === dest.write(chunk) && source.pause) {
	        source.pause();
	      }
	    }
	  }

	  source.on('data', ondata);

	  function ondrain() {
	    if (source.readable && source.resume) {
	      source.resume();
	    }
	  }

	  dest.on('drain', ondrain);

	  // If the 'end' option is not supplied, dest.end() will be called when
	  // source gets the 'end' or 'close' events.  Only dest.end() once.
	  if (!dest._isStdio && (!options || options.end !== false)) {
	    source.on('end', onend);
	    source.on('close', onclose);
	  }

	  var didOnEnd = false;
	  function onend() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    dest.end();
	  }


	  function onclose() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    if (typeof dest.destroy === 'function') dest.destroy();
	  }

	  // don't leave dangling pipes when there are errors.
	  function onerror(er) {
	    cleanup();
	    if (EE.listenerCount(this, 'error') === 0) {
	      throw er; // Unhandled stream error in pipe.
	    }
	  }

	  source.on('error', onerror);
	  dest.on('error', onerror);

	  // remove all the event listeners that were added.
	  function cleanup() {
	    source.removeListener('data', ondata);
	    dest.removeListener('drain', ondrain);

	    source.removeListener('end', onend);
	    source.removeListener('close', onclose);

	    source.removeListener('error', onerror);
	    dest.removeListener('error', onerror);

	    source.removeListener('end', cleanup);
	    source.removeListener('close', cleanup);

	    dest.removeListener('close', cleanup);
	  }

	  source.on('end', cleanup);
	  source.on('close', cleanup);

	  dest.on('close', cleanup);

	  dest.emit('pipe', source);

	  // Allow for unix-like usage: A.pipe(B).pipe(C)
	  return dest;
	};


/***/ },
/* 27 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 28 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(30);
	exports.Stream = __webpack_require__(26);
	exports.Readable = exports;
	exports.Writable = __webpack_require__(39);
	exports.Duplex = __webpack_require__(38);
	exports.Transform = __webpack_require__(41);
	exports.PassThrough = __webpack_require__(42);


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	module.exports = Readable;

	/*<replacement>*/
	var isArray = __webpack_require__(31);
	/*</replacement>*/


	/*<replacement>*/
	var Buffer = __webpack_require__(32).Buffer;
	/*</replacement>*/

	Readable.ReadableState = ReadableState;

	var EE = __webpack_require__(27).EventEmitter;

	/*<replacement>*/
	if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
	  return emitter.listeners(type).length;
	};
	/*</replacement>*/

	var Stream = __webpack_require__(26);

	/*<replacement>*/
	var util = __webpack_require__(36);
	util.inherits = __webpack_require__(28);
	/*</replacement>*/

	var StringDecoder;


	/*<replacement>*/
	var debug = __webpack_require__(37);
	if (debug && debug.debuglog) {
	  debug = debug.debuglog('stream');
	} else {
	  debug = function () {};
	}
	/*</replacement>*/


	util.inherits(Readable, Stream);

	function ReadableState(options, stream) {
	  var Duplex = __webpack_require__(38);

	  options = options || {};

	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;

	  this.buffer = [];
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = null;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;


	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex)
	    this.objectMode = this.objectMode || !!options.readableObjectMode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;

	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;

	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;

	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    if (!StringDecoder)
	      StringDecoder = __webpack_require__(40).StringDecoder;
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}

	function Readable(options) {
	  var Duplex = __webpack_require__(38);

	  if (!(this instanceof Readable))
	    return new Readable(options);

	  this._readableState = new ReadableState(options, this);

	  // legacy
	  this.readable = true;

	  Stream.call(this);
	}

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function(chunk, encoding) {
	  var state = this._readableState;

	  if (util.isString(chunk) && !state.objectMode) {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = new Buffer(chunk, encoding);
	      encoding = '';
	    }
	  }

	  return readableAddChunk(this, state, chunk, encoding, false);
	};

	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function(chunk) {
	  var state = this._readableState;
	  return readableAddChunk(this, state, chunk, '', true);
	};

	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (util.isNullOrUndefined(chunk)) {
	    state.reading = false;
	    if (!state.ended)
	      onEofChunk(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var e = new Error('stream.unshift() after end event');
	      stream.emit('error', e);
	    } else {
	      if (state.decoder && !addToFront && !encoding)
	        chunk = state.decoder.write(chunk);

	      if (!addToFront)
	        state.reading = false;

	      // if we want the data now, just emit it.
	      if (state.flowing && state.length === 0 && !state.sync) {
	        stream.emit('data', chunk);
	        stream.read(0);
	      } else {
	        // update the buffer info.
	        state.length += state.objectMode ? 1 : chunk.length;
	        if (addToFront)
	          state.buffer.unshift(chunk);
	        else
	          state.buffer.push(chunk);

	        if (state.needReadable)
	          emitReadable(stream);
	      }

	      maybeReadMore(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }

	  return needMoreData(state);
	}



	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended &&
	         (state.needReadable ||
	          state.length < state.highWaterMark ||
	          state.length === 0);
	}

	// backwards compatibility.
	Readable.prototype.setEncoding = function(enc) {
	  if (!StringDecoder)
	    StringDecoder = __webpack_require__(40).StringDecoder;
	  this._readableState.decoder = new StringDecoder(enc);
	  this._readableState.encoding = enc;
	  return this;
	};

	// Don't raise the hwm > 128MB
	var MAX_HWM = 0x800000;
	function roundUpToNextPowerOf2(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2
	    n--;
	    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
	    n++;
	  }
	  return n;
	}

	function howMuchToRead(n, state) {
	  if (state.length === 0 && state.ended)
	    return 0;

	  if (state.objectMode)
	    return n === 0 ? 0 : 1;

	  if (isNaN(n) || util.isNull(n)) {
	    // only flow one buffer at a time
	    if (state.flowing && state.buffer.length)
	      return state.buffer[0].length;
	    else
	      return state.length;
	  }

	  if (n <= 0)
	    return 0;

	  // If we're asking for more than the target buffer level,
	  // then raise the water mark.  Bump up to the next highest
	  // power of 2, to prevent increasing it excessively in tiny
	  // amounts.
	  if (n > state.highWaterMark)
	    state.highWaterMark = roundUpToNextPowerOf2(n);

	  // don't have that much.  return null, unless we've ended.
	  if (n > state.length) {
	    if (!state.ended) {
	      state.needReadable = true;
	      return 0;
	    } else
	      return state.length;
	  }

	  return n;
	}

	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function(n) {
	  debug('read', n);
	  var state = this._readableState;
	  var nOrig = n;

	  if (!util.isNumber(n) || n > 0)
	    state.emittedReadable = false;

	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 &&
	      state.needReadable &&
	      (state.length >= state.highWaterMark || state.ended)) {
	    debug('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended)
	      endReadable(this);
	    else
	      emitReadable(this);
	    return null;
	  }

	  n = howMuchToRead(n, state);

	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0)
	      endReadable(this);
	    return null;
	  }

	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.

	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;
	  debug('need readable', doRead);

	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug('length less than watermark', doRead);
	  }

	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading) {
	    doRead = false;
	    debug('reading or ended', doRead);
	  }

	  if (doRead) {
	    debug('do read');
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0)
	      state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	  }

	  // If _read pushed data synchronously, then `reading` will be false,
	  // and we need to re-evaluate how much data we can return to the user.
	  if (doRead && !state.reading)
	    n = howMuchToRead(nOrig, state);

	  var ret;
	  if (n > 0)
	    ret = fromList(n, state);
	  else
	    ret = null;

	  if (util.isNull(ret)) {
	    state.needReadable = true;
	    n = 0;
	  }

	  state.length -= n;

	  // If we have nothing in the buffer, then we want to know
	  // as soon as we *do* get something into the buffer.
	  if (state.length === 0 && !state.ended)
	    state.needReadable = true;

	  // If we tried to read() past the EOF, then emit end on the next tick.
	  if (nOrig !== n && state.ended && state.length === 0)
	    endReadable(this);

	  if (!util.isNull(ret))
	    this.emit('data', ret);

	  return ret;
	};

	function chunkInvalid(state, chunk) {
	  var er = null;
	  if (!util.isBuffer(chunk) &&
	      !util.isString(chunk) &&
	      !util.isNullOrUndefined(chunk) &&
	      !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}


	function onEofChunk(stream, state) {
	  if (state.decoder && !state.ended) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;

	  // emit 'readable' now to make sure it gets picked up.
	  emitReadable(stream);
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync)
	      process.nextTick(function() {
	        emitReadable_(stream);
	      });
	    else
	      emitReadable_(stream);
	  }
	}

	function emitReadable_(stream) {
	  debug('emit readable');
	  stream.emit('readable');
	  flow(stream);
	}


	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    process.nextTick(function() {
	      maybeReadMore_(stream, state);
	    });
	  }
	}

	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended &&
	         state.length < state.highWaterMark) {
	    debug('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;
	    else
	      len = state.length;
	  }
	  state.readingMore = false;
	}

	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function(n) {
	  this.emit('error', new Error('not implemented'));
	};

	Readable.prototype.pipe = function(dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;

	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;
	  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

	  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
	              dest !== process.stdout &&
	              dest !== process.stderr;

	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted)
	    process.nextTick(endFn);
	  else
	    src.once('end', endFn);

	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    debug('onunpipe');
	    if (readable === src) {
	      cleanup();
	    }
	  }

	  function onend() {
	    debug('onend');
	    dest.end();
	  }

	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);

	  function cleanup() {
	    debug('cleanup');
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);
	    src.removeListener('data', ondata);

	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (state.awaitDrain &&
	        (!dest._writableState || dest._writableState.needDrain))
	      ondrain();
	  }

	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug('ondata');
	    var ret = dest.write(chunk);
	    if (false === ret) {
	      debug('false write response, pause',
	            src._readableState.awaitDrain);
	      src._readableState.awaitDrain++;
	      src.pause();
	    }
	  }

	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (EE.listenerCount(dest, 'error') === 0)
	      dest.emit('error', er);
	  }
	  // This is a brutally ugly hack to make sure that our error handler
	  // is attached before any userland ones.  NEVER DO THIS.
	  if (!dest._events || !dest._events.error)
	    dest.on('error', onerror);
	  else if (isArray(dest._events.error))
	    dest._events.error.unshift(onerror);
	  else
	    dest._events.error = [onerror, dest._events.error];



	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);

	  function unpipe() {
	    debug('unpipe');
	    src.unpipe(dest);
	  }

	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);

	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    debug('pipe resume');
	    src.resume();
	  }

	  return dest;
	};

	function pipeOnDrain(src) {
	  return function() {
	    var state = src._readableState;
	    debug('pipeOnDrain', state.awaitDrain);
	    if (state.awaitDrain)
	      state.awaitDrain--;
	    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
	      state.flowing = true;
	      flow(src);
	    }
	  };
	}


	Readable.prototype.unpipe = function(dest) {
	  var state = this._readableState;

	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0)
	    return this;

	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes)
	      return this;

	    if (!dest)
	      dest = state.pipes;

	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	    if (dest)
	      dest.emit('unpipe', this);
	    return this;
	  }

	  // slow case. multiple pipe destinations.

	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;

	    for (var i = 0; i < len; i++)
	      dests[i].emit('unpipe', this);
	    return this;
	  }

	  // try to find the right one.
	  var i = indexOf(state.pipes, dest);
	  if (i === -1)
	    return this;

	  state.pipes.splice(i, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1)
	    state.pipes = state.pipes[0];

	  dest.emit('unpipe', this);

	  return this;
	};

	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function(ev, fn) {
	  var res = Stream.prototype.on.call(this, ev, fn);

	  // If listening to data, and it has not explicitly been paused,
	  // then call resume to start the flow of data on the next tick.
	  if (ev === 'data' && false !== this._readableState.flowing) {
	    this.resume();
	  }

	  if (ev === 'readable' && this.readable) {
	    var state = this._readableState;
	    if (!state.readableListening) {
	      state.readableListening = true;
	      state.emittedReadable = false;
	      state.needReadable = true;
	      if (!state.reading) {
	        var self = this;
	        process.nextTick(function() {
	          debug('readable nexttick read 0');
	          self.read(0);
	        });
	      } else if (state.length) {
	        emitReadable(this, state);
	      }
	    }
	  }

	  return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function() {
	  var state = this._readableState;
	  if (!state.flowing) {
	    debug('resume');
	    state.flowing = true;
	    if (!state.reading) {
	      debug('resume read 0');
	      this.read(0);
	    }
	    resume(this, state);
	  }
	  return this;
	};

	function resume(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    process.nextTick(function() {
	      resume_(stream, state);
	    });
	  }
	}

	function resume_(stream, state) {
	  state.resumeScheduled = false;
	  stream.emit('resume');
	  flow(stream);
	  if (state.flowing && !state.reading)
	    stream.read(0);
	}

	Readable.prototype.pause = function() {
	  debug('call pause flowing=%j', this._readableState.flowing);
	  if (false !== this._readableState.flowing) {
	    debug('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  return this;
	};

	function flow(stream) {
	  var state = stream._readableState;
	  debug('flow', state.flowing);
	  if (state.flowing) {
	    do {
	      var chunk = stream.read();
	    } while (null !== chunk && state.flowing);
	  }
	}

	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function(stream) {
	  var state = this._readableState;
	  var paused = false;

	  var self = this;
	  stream.on('end', function() {
	    debug('wrapped end');
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length)
	        self.push(chunk);
	    }

	    self.push(null);
	  });

	  stream.on('data', function(chunk) {
	    debug('wrapped data');
	    if (state.decoder)
	      chunk = state.decoder.write(chunk);
	    if (!chunk || !state.objectMode && !chunk.length)
	      return;

	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });

	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
	      this[i] = function(method) { return function() {
	        return stream[method].apply(stream, arguments);
	      }}(i);
	    }
	  }

	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach(events, function(ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });

	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function(n) {
	    debug('wrapped _read', n);
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };

	  return self;
	};



	// exposed for testing purposes only.
	Readable._fromList = fromList;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	function fromList(n, state) {
	  var list = state.buffer;
	  var length = state.length;
	  var stringMode = !!state.decoder;
	  var objectMode = !!state.objectMode;
	  var ret;

	  // nothing in the list, definitely empty.
	  if (list.length === 0)
	    return null;

	  if (length === 0)
	    ret = null;
	  else if (objectMode)
	    ret = list.shift();
	  else if (!n || n >= length) {
	    // read it all, truncate the array.
	    if (stringMode)
	      ret = list.join('');
	    else
	      ret = Buffer.concat(list, length);
	    list.length = 0;
	  } else {
	    // read just some of it.
	    if (n < list[0].length) {
	      // just take a part of the first list item.
	      // slice is the same for buffers and strings.
	      var buf = list[0];
	      ret = buf.slice(0, n);
	      list[0] = buf.slice(n);
	    } else if (n === list[0].length) {
	      // first list is a perfect match
	      ret = list.shift();
	    } else {
	      // complex case.
	      // we have enough to cover it, but it spans past the first buffer.
	      if (stringMode)
	        ret = '';
	      else
	        ret = new Buffer(n);

	      var c = 0;
	      for (var i = 0, l = list.length; i < l && c < n; i++) {
	        var buf = list[0];
	        var cpy = Math.min(n - c, buf.length);

	        if (stringMode)
	          ret += buf.slice(0, cpy);
	        else
	          buf.copy(ret, c, 0, cpy);

	        if (cpy < buf.length)
	          list[0] = buf.slice(cpy);
	        else
	          list.shift();

	        c += cpy;
	      }
	    }
	  }

	  return ret;
	}

	function endReadable(stream) {
	  var state = stream._readableState;

	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0)
	    throw new Error('endReadable called on non-empty stream');

	  if (!state.endEmitted) {
	    state.ended = true;
	    process.nextTick(function() {
	      // Check that we didn't get one last unshift.
	      if (!state.endEmitted && state.length === 0) {
	        state.endEmitted = true;
	        stream.readable = false;
	        stream.emit('end');
	      }
	    });
	  }
	}

	function forEach (xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	function indexOf (xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24)))

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(33)
	var ieee754 = __webpack_require__(34)
	var isArray = __webpack_require__(35)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var rootParent = {}

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }

	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    this.length = 0
	    this.parent = undefined
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }

	  // Unusual.
	  return fromObject(this, arg)
	}

	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)

	  that.write(string, encoding)
	  return that
	}

	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

	  if (isArray(object)) return fromArray(that, object)

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }

	  if (object.length) return fromArrayLike(that, object)

	  return fromJsonObject(that, object)
	}

	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}

	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}

	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	} else {
	  // pre-set for values that may exist in the future
	  Buffer.prototype.length = undefined
	  Buffer.prototype.parent = undefined
	}

	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent

	  return that
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break

	    ++i
	  }

	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

	  if (list.length === 0) {
	    return new Buffer(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }

	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0

	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }

	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'binary':
	        return binaryWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }

	  return len
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new RangeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set

	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32).Buffer, (function() { return this; }())))

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 34 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 35 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.

	function isArray(arg) {
	  if (Array.isArray) {
	    return Array.isArray(arg);
	  }
	  return objectToString(arg) === '[object Array]';
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = Buffer.isBuffer;

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32).Buffer))

/***/ },
/* 37 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// a duplex stream is just a stream that is both readable and writable.
	// Since JS doesn't have multiple prototypal inheritance, this class
	// prototypally inherits from Readable, and then parasitically from
	// Writable.

	module.exports = Duplex;

	/*<replacement>*/
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	}
	/*</replacement>*/


	/*<replacement>*/
	var util = __webpack_require__(36);
	util.inherits = __webpack_require__(28);
	/*</replacement>*/

	var Readable = __webpack_require__(30);
	var Writable = __webpack_require__(39);

	util.inherits(Duplex, Readable);

	forEach(objectKeys(Writable.prototype), function(method) {
	  if (!Duplex.prototype[method])
	    Duplex.prototype[method] = Writable.prototype[method];
	});

	function Duplex(options) {
	  if (!(this instanceof Duplex))
	    return new Duplex(options);

	  Readable.call(this, options);
	  Writable.call(this, options);

	  if (options && options.readable === false)
	    this.readable = false;

	  if (options && options.writable === false)
	    this.writable = false;

	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false)
	    this.allowHalfOpen = false;

	  this.once('end', onend);
	}

	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended)
	    return;

	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  process.nextTick(this.end.bind(this));
	}

	function forEach (xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24)))

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// A bit simpler than readable streams.
	// Implement an async ._write(chunk, cb), and it'll handle all
	// the drain event emission and buffering.

	module.exports = Writable;

	/*<replacement>*/
	var Buffer = __webpack_require__(32).Buffer;
	/*</replacement>*/

	Writable.WritableState = WritableState;


	/*<replacement>*/
	var util = __webpack_require__(36);
	util.inherits = __webpack_require__(28);
	/*</replacement>*/

	var Stream = __webpack_require__(26);

	util.inherits(Writable, Stream);

	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	}

	function WritableState(options, stream) {
	  var Duplex = __webpack_require__(38);

	  options = options || {};

	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex)
	    this.objectMode = this.objectMode || !!options.writableObjectMode;

	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;

	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;

	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;

	  // a flag to see when we're in the middle of a write.
	  this.writing = false;

	  // when true all writes will be buffered until .uncork() call
	  this.corked = 0;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;

	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function(er) {
	    onwrite(stream, er);
	  };

	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;

	  // the amount that is being written when _write is called.
	  this.writelen = 0;

	  this.buffer = [];

	  // number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted
	  this.pendingcb = 0;

	  // emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams
	  this.prefinished = false;

	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;
	}

	function Writable(options) {
	  var Duplex = __webpack_require__(38);

	  // Writable ctor is applied to Duplexes, though they're not
	  // instanceof Writable, they're instanceof Readable.
	  if (!(this instanceof Writable) && !(this instanceof Duplex))
	    return new Writable(options);

	  this._writableState = new WritableState(options, this);

	  // legacy.
	  this.writable = true;

	  Stream.call(this);
	}

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function() {
	  this.emit('error', new Error('Cannot pipe. Not readable.'));
	};


	function writeAfterEnd(stream, state, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  process.nextTick(function() {
	    cb(er);
	  });
	}

	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	  if (!util.isBuffer(chunk) &&
	      !util.isString(chunk) &&
	      !util.isNullOrUndefined(chunk) &&
	      !state.objectMode) {
	    var er = new TypeError('Invalid non-string/buffer chunk');
	    stream.emit('error', er);
	    process.nextTick(function() {
	      cb(er);
	    });
	    valid = false;
	  }
	  return valid;
	}

	Writable.prototype.write = function(chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;

	  if (util.isFunction(encoding)) {
	    cb = encoding;
	    encoding = null;
	  }

	  if (util.isBuffer(chunk))
	    encoding = 'buffer';
	  else if (!encoding)
	    encoding = state.defaultEncoding;

	  if (!util.isFunction(cb))
	    cb = function() {};

	  if (state.ended)
	    writeAfterEnd(this, state, cb);
	  else if (validChunk(this, state, chunk, cb)) {
	    state.pendingcb++;
	    ret = writeOrBuffer(this, state, chunk, encoding, cb);
	  }

	  return ret;
	};

	Writable.prototype.cork = function() {
	  var state = this._writableState;

	  state.corked++;
	};

	Writable.prototype.uncork = function() {
	  var state = this._writableState;

	  if (state.corked) {
	    state.corked--;

	    if (!state.writing &&
	        !state.corked &&
	        !state.finished &&
	        !state.bufferProcessing &&
	        state.buffer.length)
	      clearBuffer(this, state);
	  }
	};

	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode &&
	      state.decodeStrings !== false &&
	      util.isString(chunk)) {
	    chunk = new Buffer(chunk, encoding);
	  }
	  return chunk;
	}

	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk(state, chunk, encoding);
	  if (util.isBuffer(chunk))
	    encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;

	  state.length += len;

	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret)
	    state.needDrain = true;

	  if (state.writing || state.corked)
	    state.buffer.push(new WriteReq(chunk, encoding, cb));
	  else
	    doWrite(stream, state, false, len, chunk, encoding, cb);

	  return ret;
	}

	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (writev)
	    stream._writev(chunk, state.onwrite);
	  else
	    stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}

	function onwriteError(stream, state, sync, er, cb) {
	  if (sync)
	    process.nextTick(function() {
	      state.pendingcb--;
	      cb(er);
	    });
	  else {
	    state.pendingcb--;
	    cb(er);
	  }

	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}

	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}

	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;

	  onwriteStateUpdate(state);

	  if (er)
	    onwriteError(stream, state, sync, er, cb);
	  else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(stream, state);

	    if (!finished &&
	        !state.corked &&
	        !state.bufferProcessing &&
	        state.buffer.length) {
	      clearBuffer(stream, state);
	    }

	    if (sync) {
	      process.nextTick(function() {
	        afterWrite(stream, state, finished, cb);
	      });
	    } else {
	      afterWrite(stream, state, finished, cb);
	    }
	  }
	}

	function afterWrite(stream, state, finished, cb) {
	  if (!finished)
	    onwriteDrain(stream, state);
	  state.pendingcb--;
	  cb();
	  finishMaybe(stream, state);
	}

	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}


	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;

	  if (stream._writev && state.buffer.length > 1) {
	    // Fast case, write everything using _writev()
	    var cbs = [];
	    for (var c = 0; c < state.buffer.length; c++)
	      cbs.push(state.buffer[c].callback);

	    // count the one we are adding, as well.
	    // TODO(isaacs) clean this up
	    state.pendingcb++;
	    doWrite(stream, state, true, state.length, state.buffer, '', function(err) {
	      for (var i = 0; i < cbs.length; i++) {
	        state.pendingcb--;
	        cbs[i](err);
	      }
	    });

	    // Clear buffer
	    state.buffer = [];
	  } else {
	    // Slow case, write chunks one-by-one
	    for (var c = 0; c < state.buffer.length; c++) {
	      var entry = state.buffer[c];
	      var chunk = entry.chunk;
	      var encoding = entry.encoding;
	      var cb = entry.callback;
	      var len = state.objectMode ? 1 : chunk.length;

	      doWrite(stream, state, false, len, chunk, encoding, cb);

	      // if we didn't call the onwrite immediately, then
	      // it means that we need to wait until it does.
	      // also, that means that the chunk and cb are currently
	      // being processed, so move the buffer counter past them.
	      if (state.writing) {
	        c++;
	        break;
	      }
	    }

	    if (c < state.buffer.length)
	      state.buffer = state.buffer.slice(c);
	    else
	      state.buffer.length = 0;
	  }

	  state.bufferProcessing = false;
	}

	Writable.prototype._write = function(chunk, encoding, cb) {
	  cb(new Error('not implemented'));

	};

	Writable.prototype._writev = null;

	Writable.prototype.end = function(chunk, encoding, cb) {
	  var state = this._writableState;

	  if (util.isFunction(chunk)) {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (util.isFunction(encoding)) {
	    cb = encoding;
	    encoding = null;
	  }

	  if (!util.isNullOrUndefined(chunk))
	    this.write(chunk, encoding);

	  // .end() fully uncorks
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }

	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished)
	    endWritable(this, state, cb);
	};


	function needFinish(stream, state) {
	  return (state.ending &&
	          state.length === 0 &&
	          !state.finished &&
	          !state.writing);
	}

	function prefinish(stream, state) {
	  if (!state.prefinished) {
	    state.prefinished = true;
	    stream.emit('prefinish');
	  }
	}

	function finishMaybe(stream, state) {
	  var need = needFinish(stream, state);
	  if (need) {
	    if (state.pendingcb === 0) {
	      prefinish(stream, state);
	      state.finished = true;
	      stream.emit('finish');
	    } else
	      prefinish(stream, state);
	  }
	  return need;
	}

	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished)
	      process.nextTick(cb);
	    else
	      stream.once('finish', cb);
	  }
	  state.ended = true;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24)))

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var Buffer = __webpack_require__(32).Buffer;

	var isBufferEncoding = Buffer.isEncoding
	  || function(encoding) {
	       switch (encoding && encoding.toLowerCase()) {
	         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
	         default: return false;
	       }
	     }


	function assertEncoding(encoding) {
	  if (encoding && !isBufferEncoding(encoding)) {
	    throw new Error('Unknown encoding: ' + encoding);
	  }
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters. CESU-8 is handled as part of the UTF-8 encoding.
	//
	// @TODO Handling all encodings inside a single object makes it very difficult
	// to reason about this code, so it should be split up in the future.
	// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
	// points as used by CESU-8.
	var StringDecoder = exports.StringDecoder = function(encoding) {
	  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
	  assertEncoding(encoding);
	  switch (this.encoding) {
	    case 'utf8':
	      // CESU-8 represents each of Surrogate Pair by 3-bytes
	      this.surrogateSize = 3;
	      break;
	    case 'ucs2':
	    case 'utf16le':
	      // UTF-16 represents each of Surrogate Pair by 2-bytes
	      this.surrogateSize = 2;
	      this.detectIncompleteChar = utf16DetectIncompleteChar;
	      break;
	    case 'base64':
	      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
	      this.surrogateSize = 3;
	      this.detectIncompleteChar = base64DetectIncompleteChar;
	      break;
	    default:
	      this.write = passThroughWrite;
	      return;
	  }

	  // Enough space to store all bytes of a single character. UTF-8 needs 4
	  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
	  this.charBuffer = new Buffer(6);
	  // Number of bytes received for the current incomplete multi-byte character.
	  this.charReceived = 0;
	  // Number of bytes expected for the current incomplete multi-byte character.
	  this.charLength = 0;
	};


	// write decodes the given buffer and returns it as JS string that is
	// guaranteed to not contain any partial multi-byte characters. Any partial
	// character found at the end of the buffer is buffered up, and will be
	// returned when calling write again with the remaining bytes.
	//
	// Note: Converting a Buffer containing an orphan surrogate to a String
	// currently works, but converting a String to a Buffer (via `new Buffer`, or
	// Buffer#write) will replace incomplete surrogates with the unicode
	// replacement character. See https://codereview.chromium.org/121173009/ .
	StringDecoder.prototype.write = function(buffer) {
	  var charStr = '';
	  // if our last write ended with an incomplete multibyte character
	  while (this.charLength) {
	    // determine how many remaining bytes this buffer has to offer for this char
	    var available = (buffer.length >= this.charLength - this.charReceived) ?
	        this.charLength - this.charReceived :
	        buffer.length;

	    // add the new bytes to the char buffer
	    buffer.copy(this.charBuffer, this.charReceived, 0, available);
	    this.charReceived += available;

	    if (this.charReceived < this.charLength) {
	      // still not enough chars in this buffer? wait for more ...
	      return '';
	    }

	    // remove bytes belonging to the current character from the buffer
	    buffer = buffer.slice(available, buffer.length);

	    // get the character that was split
	    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

	    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	    var charCode = charStr.charCodeAt(charStr.length - 1);
	    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	      this.charLength += this.surrogateSize;
	      charStr = '';
	      continue;
	    }
	    this.charReceived = this.charLength = 0;

	    // if there are no more bytes in this buffer, just emit our char
	    if (buffer.length === 0) {
	      return charStr;
	    }
	    break;
	  }

	  // determine and set charLength / charReceived
	  this.detectIncompleteChar(buffer);

	  var end = buffer.length;
	  if (this.charLength) {
	    // buffer the incomplete character bytes we got
	    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
	    end -= this.charReceived;
	  }

	  charStr += buffer.toString(this.encoding, 0, end);

	  var end = charStr.length - 1;
	  var charCode = charStr.charCodeAt(end);
	  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	    var size = this.surrogateSize;
	    this.charLength += size;
	    this.charReceived += size;
	    this.charBuffer.copy(this.charBuffer, size, 0, size);
	    buffer.copy(this.charBuffer, 0, 0, size);
	    return charStr.substring(0, end);
	  }

	  // or just emit the charStr
	  return charStr;
	};

	// detectIncompleteChar determines if there is an incomplete UTF-8 character at
	// the end of the given buffer. If so, it sets this.charLength to the byte
	// length that character, and sets this.charReceived to the number of bytes
	// that are available for this character.
	StringDecoder.prototype.detectIncompleteChar = function(buffer) {
	  // determine how many bytes we have to check at the end of this buffer
	  var i = (buffer.length >= 3) ? 3 : buffer.length;

	  // Figure out if one of the last i bytes of our buffer announces an
	  // incomplete char.
	  for (; i > 0; i--) {
	    var c = buffer[buffer.length - i];

	    // See http://en.wikipedia.org/wiki/UTF-8#Description

	    // 110XXXXX
	    if (i == 1 && c >> 5 == 0x06) {
	      this.charLength = 2;
	      break;
	    }

	    // 1110XXXX
	    if (i <= 2 && c >> 4 == 0x0E) {
	      this.charLength = 3;
	      break;
	    }

	    // 11110XXX
	    if (i <= 3 && c >> 3 == 0x1E) {
	      this.charLength = 4;
	      break;
	    }
	  }
	  this.charReceived = i;
	};

	StringDecoder.prototype.end = function(buffer) {
	  var res = '';
	  if (buffer && buffer.length)
	    res = this.write(buffer);

	  if (this.charReceived) {
	    var cr = this.charReceived;
	    var buf = this.charBuffer;
	    var enc = this.encoding;
	    res += buf.slice(0, cr).toString(enc);
	  }

	  return res;
	};

	function passThroughWrite(buffer) {
	  return buffer.toString(this.encoding);
	}

	function utf16DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 2;
	  this.charLength = this.charReceived ? 2 : 0;
	}

	function base64DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 3;
	  this.charLength = this.charReceived ? 3 : 0;
	}


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.


	// a transform stream is a readable/writable stream where you do
	// something with the data.  Sometimes it's called a "filter",
	// but that's not a great name for it, since that implies a thing where
	// some bits pass through, and others are simply ignored.  (That would
	// be a valid example of a transform, of course.)
	//
	// While the output is causally related to the input, it's not a
	// necessarily symmetric or synchronous transformation.  For example,
	// a zlib stream might take multiple plain-text writes(), and then
	// emit a single compressed chunk some time in the future.
	//
	// Here's how this works:
	//
	// The Transform stream has all the aspects of the readable and writable
	// stream classes.  When you write(chunk), that calls _write(chunk,cb)
	// internally, and returns false if there's a lot of pending writes
	// buffered up.  When you call read(), that calls _read(n) until
	// there's enough pending readable data buffered up.
	//
	// In a transform stream, the written data is placed in a buffer.  When
	// _read(n) is called, it transforms the queued up data, calling the
	// buffered _write cb's as it consumes chunks.  If consuming a single
	// written chunk would result in multiple output chunks, then the first
	// outputted bit calls the readcb, and subsequent chunks just go into
	// the read buffer, and will cause it to emit 'readable' if necessary.
	//
	// This way, back-pressure is actually determined by the reading side,
	// since _read has to be called to start processing a new chunk.  However,
	// a pathological inflate type of transform can cause excessive buffering
	// here.  For example, imagine a stream where every byte of input is
	// interpreted as an integer from 0-255, and then results in that many
	// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
	// 1kb of data being output.  In this case, you could write a very small
	// amount of input, and end up with a very large amount of output.  In
	// such a pathological inflating mechanism, there'd be no way to tell
	// the system to stop doing the transform.  A single 4MB write could
	// cause the system to run out of memory.
	//
	// However, even in such a pathological case, only a single written chunk
	// would be consumed, and then the rest would wait (un-transformed) until
	// the results of the previous transformed chunk were consumed.

	module.exports = Transform;

	var Duplex = __webpack_require__(38);

	/*<replacement>*/
	var util = __webpack_require__(36);
	util.inherits = __webpack_require__(28);
	/*</replacement>*/

	util.inherits(Transform, Duplex);


	function TransformState(options, stream) {
	  this.afterTransform = function(er, data) {
	    return afterTransform(stream, er, data);
	  };

	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	}

	function afterTransform(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;

	  var cb = ts.writecb;

	  if (!cb)
	    return stream.emit('error', new Error('no writecb in Transform class'));

	  ts.writechunk = null;
	  ts.writecb = null;

	  if (!util.isNullOrUndefined(data))
	    stream.push(data);

	  if (cb)
	    cb(er);

	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}


	function Transform(options) {
	  if (!(this instanceof Transform))
	    return new Transform(options);

	  Duplex.call(this, options);

	  this._transformState = new TransformState(options, this);

	  // when the writable side finishes, then flush out anything remaining.
	  var stream = this;

	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;

	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;

	  this.once('prefinish', function() {
	    if (util.isFunction(this._flush))
	      this._flush(function(er) {
	        done(stream, er);
	      });
	    else
	      done(stream);
	  });
	}

	Transform.prototype.push = function(chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex.prototype.push.call(this, chunk, encoding);
	};

	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform.prototype._transform = function(chunk, encoding, cb) {
	  throw new Error('not implemented');
	};

	Transform.prototype._write = function(chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform ||
	        rs.needReadable ||
	        rs.length < rs.highWaterMark)
	      this._read(rs.highWaterMark);
	  }
	};

	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform.prototype._read = function(n) {
	  var ts = this._transformState;

	  if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};


	function done(stream, er) {
	  if (er)
	    return stream.emit('error', er);

	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  var ts = stream._transformState;

	  if (ws.length)
	    throw new Error('calling transform done when ws.length != 0');

	  if (ts.transforming)
	    throw new Error('calling transform done when still transforming');

	  return stream.push(null);
	}


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// a passthrough stream.
	// basically just the most minimal sort of Transform stream.
	// Every written chunk gets output as-is.

	module.exports = PassThrough;

	var Transform = __webpack_require__(41);

	/*<replacement>*/
	var util = __webpack_require__(36);
	util.inherits = __webpack_require__(28);
	/*</replacement>*/

	util.inherits(PassThrough, Transform);

	function PassThrough(options) {
	  if (!(this instanceof PassThrough))
	    return new PassThrough(options);

	  Transform.call(this, options);
	}

	PassThrough.prototype._transform = function(chunk, encoding, cb) {
	  cb(null, chunk);
	};


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(39)


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(38)


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(41)


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(42)


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, setImmediate) {/*global setImmediate: false, setTimeout: false, console: false */
	(function () {

	    var async = {};

	    // global on the server, window in the browser
	    var root, previous_async;

	    root = this;
	    if (root != null) {
	      previous_async = root.async;
	    }

	    async.noConflict = function () {
	        root.async = previous_async;
	        return async;
	    };

	    function only_once(fn) {
	        var called = false;
	        return function() {
	            if (called) throw new Error("Callback was already called.");
	            called = true;
	            fn.apply(root, arguments);
	        }
	    }

	    //// cross-browser compatiblity functions ////

	    var _each = function (arr, iterator) {
	        if (arr.forEach) {
	            return arr.forEach(iterator);
	        }
	        for (var i = 0; i < arr.length; i += 1) {
	            iterator(arr[i], i, arr);
	        }
	    };

	    var _map = function (arr, iterator) {
	        if (arr.map) {
	            return arr.map(iterator);
	        }
	        var results = [];
	        _each(arr, function (x, i, a) {
	            results.push(iterator(x, i, a));
	        });
	        return results;
	    };

	    var _reduce = function (arr, iterator, memo) {
	        if (arr.reduce) {
	            return arr.reduce(iterator, memo);
	        }
	        _each(arr, function (x, i, a) {
	            memo = iterator(memo, x, i, a);
	        });
	        return memo;
	    };

	    var _keys = function (obj) {
	        if (Object.keys) {
	            return Object.keys(obj);
	        }
	        var keys = [];
	        for (var k in obj) {
	            if (obj.hasOwnProperty(k)) {
	                keys.push(k);
	            }
	        }
	        return keys;
	    };

	    //// exported async module functions ////

	    //// nextTick implementation with browser-compatible fallback ////
	    if (typeof process === 'undefined' || !(process.nextTick)) {
	        if (typeof setImmediate === 'function') {
	            async.nextTick = function (fn) {
	                // not a direct alias for IE10 compatibility
	                setImmediate(fn);
	            };
	            async.setImmediate = async.nextTick;
	        }
	        else {
	            async.nextTick = function (fn) {
	                setTimeout(fn, 0);
	            };
	            async.setImmediate = async.nextTick;
	        }
	    }
	    else {
	        async.nextTick = process.nextTick;
	        if (typeof setImmediate !== 'undefined') {
	            async.setImmediate = function (fn) {
	              // not a direct alias for IE10 compatibility
	              setImmediate(fn);
	            };
	        }
	        else {
	            async.setImmediate = async.nextTick;
	        }
	    }

	    async.each = function (arr, iterator, callback) {
	        callback = callback || function () {};
	        if (!arr.length) {
	            return callback();
	        }
	        var completed = 0;
	        _each(arr, function (x) {
	            iterator(x, only_once(function (err) {
	                if (err) {
	                    callback(err);
	                    callback = function () {};
	                }
	                else {
	                    completed += 1;
	                    if (completed >= arr.length) {
	                        callback(null);
	                    }
	                }
	            }));
	        });
	    };
	    async.forEach = async.each;

	    async.eachSeries = function (arr, iterator, callback) {
	        callback = callback || function () {};
	        if (!arr.length) {
	            return callback();
	        }
	        var completed = 0;
	        var iterate = function () {
	            iterator(arr[completed], function (err) {
	                if (err) {
	                    callback(err);
	                    callback = function () {};
	                }
	                else {
	                    completed += 1;
	                    if (completed >= arr.length) {
	                        callback(null);
	                    }
	                    else {
	                        iterate();
	                    }
	                }
	            });
	        };
	        iterate();
	    };
	    async.forEachSeries = async.eachSeries;

	    async.eachLimit = function (arr, limit, iterator, callback) {
	        var fn = _eachLimit(limit);
	        fn.apply(null, [arr, iterator, callback]);
	    };
	    async.forEachLimit = async.eachLimit;

	    var _eachLimit = function (limit) {

	        return function (arr, iterator, callback) {
	            callback = callback || function () {};
	            if (!arr.length || limit <= 0) {
	                return callback();
	            }
	            var completed = 0;
	            var started = 0;
	            var running = 0;

	            (function replenish () {
	                if (completed >= arr.length) {
	                    return callback();
	                }

	                while (running < limit && started < arr.length) {
	                    started += 1;
	                    running += 1;
	                    iterator(arr[started - 1], function (err) {
	                        if (err) {
	                            callback(err);
	                            callback = function () {};
	                        }
	                        else {
	                            completed += 1;
	                            running -= 1;
	                            if (completed >= arr.length) {
	                                callback();
	                            }
	                            else {
	                                replenish();
	                            }
	                        }
	                    });
	                }
	            })();
	        };
	    };


	    var doParallel = function (fn) {
	        return function () {
	            var args = Array.prototype.slice.call(arguments);
	            return fn.apply(null, [async.each].concat(args));
	        };
	    };
	    var doParallelLimit = function(limit, fn) {
	        return function () {
	            var args = Array.prototype.slice.call(arguments);
	            return fn.apply(null, [_eachLimit(limit)].concat(args));
	        };
	    };
	    var doSeries = function (fn) {
	        return function () {
	            var args = Array.prototype.slice.call(arguments);
	            return fn.apply(null, [async.eachSeries].concat(args));
	        };
	    };


	    var _asyncMap = function (eachfn, arr, iterator, callback) {
	        var results = [];
	        arr = _map(arr, function (x, i) {
	            return {index: i, value: x};
	        });
	        eachfn(arr, function (x, callback) {
	            iterator(x.value, function (err, v) {
	                results[x.index] = v;
	                callback(err);
	            });
	        }, function (err) {
	            callback(err, results);
	        });
	    };
	    async.map = doParallel(_asyncMap);
	    async.mapSeries = doSeries(_asyncMap);
	    async.mapLimit = function (arr, limit, iterator, callback) {
	        return _mapLimit(limit)(arr, iterator, callback);
	    };

	    var _mapLimit = function(limit) {
	        return doParallelLimit(limit, _asyncMap);
	    };

	    // reduce only has a series version, as doing reduce in parallel won't
	    // work in many situations.
	    async.reduce = function (arr, memo, iterator, callback) {
	        async.eachSeries(arr, function (x, callback) {
	            iterator(memo, x, function (err, v) {
	                memo = v;
	                callback(err);
	            });
	        }, function (err) {
	            callback(err, memo);
	        });
	    };
	    // inject alias
	    async.inject = async.reduce;
	    // foldl alias
	    async.foldl = async.reduce;

	    async.reduceRight = function (arr, memo, iterator, callback) {
	        var reversed = _map(arr, function (x) {
	            return x;
	        }).reverse();
	        async.reduce(reversed, memo, iterator, callback);
	    };
	    // foldr alias
	    async.foldr = async.reduceRight;

	    var _filter = function (eachfn, arr, iterator, callback) {
	        var results = [];
	        arr = _map(arr, function (x, i) {
	            return {index: i, value: x};
	        });
	        eachfn(arr, function (x, callback) {
	            iterator(x.value, function (v) {
	                if (v) {
	                    results.push(x);
	                }
	                callback();
	            });
	        }, function (err) {
	            callback(_map(results.sort(function (a, b) {
	                return a.index - b.index;
	            }), function (x) {
	                return x.value;
	            }));
	        });
	    };
	    async.filter = doParallel(_filter);
	    async.filterSeries = doSeries(_filter);
	    // select alias
	    async.select = async.filter;
	    async.selectSeries = async.filterSeries;

	    var _reject = function (eachfn, arr, iterator, callback) {
	        var results = [];
	        arr = _map(arr, function (x, i) {
	            return {index: i, value: x};
	        });
	        eachfn(arr, function (x, callback) {
	            iterator(x.value, function (v) {
	                if (!v) {
	                    results.push(x);
	                }
	                callback();
	            });
	        }, function (err) {
	            callback(_map(results.sort(function (a, b) {
	                return a.index - b.index;
	            }), function (x) {
	                return x.value;
	            }));
	        });
	    };
	    async.reject = doParallel(_reject);
	    async.rejectSeries = doSeries(_reject);

	    var _detect = function (eachfn, arr, iterator, main_callback) {
	        eachfn(arr, function (x, callback) {
	            iterator(x, function (result) {
	                if (result) {
	                    main_callback(x);
	                    main_callback = function () {};
	                }
	                else {
	                    callback();
	                }
	            });
	        }, function (err) {
	            main_callback();
	        });
	    };
	    async.detect = doParallel(_detect);
	    async.detectSeries = doSeries(_detect);

	    async.some = function (arr, iterator, main_callback) {
	        async.each(arr, function (x, callback) {
	            iterator(x, function (v) {
	                if (v) {
	                    main_callback(true);
	                    main_callback = function () {};
	                }
	                callback();
	            });
	        }, function (err) {
	            main_callback(false);
	        });
	    };
	    // any alias
	    async.any = async.some;

	    async.every = function (arr, iterator, main_callback) {
	        async.each(arr, function (x, callback) {
	            iterator(x, function (v) {
	                if (!v) {
	                    main_callback(false);
	                    main_callback = function () {};
	                }
	                callback();
	            });
	        }, function (err) {
	            main_callback(true);
	        });
	    };
	    // all alias
	    async.all = async.every;

	    async.sortBy = function (arr, iterator, callback) {
	        async.map(arr, function (x, callback) {
	            iterator(x, function (err, criteria) {
	                if (err) {
	                    callback(err);
	                }
	                else {
	                    callback(null, {value: x, criteria: criteria});
	                }
	            });
	        }, function (err, results) {
	            if (err) {
	                return callback(err);
	            }
	            else {
	                var fn = function (left, right) {
	                    var a = left.criteria, b = right.criteria;
	                    return a < b ? -1 : a > b ? 1 : 0;
	                };
	                callback(null, _map(results.sort(fn), function (x) {
	                    return x.value;
	                }));
	            }
	        });
	    };

	    async.auto = function (tasks, callback) {
	        callback = callback || function () {};
	        var keys = _keys(tasks);
	        if (!keys.length) {
	            return callback(null);
	        }

	        var results = {};

	        var listeners = [];
	        var addListener = function (fn) {
	            listeners.unshift(fn);
	        };
	        var removeListener = function (fn) {
	            for (var i = 0; i < listeners.length; i += 1) {
	                if (listeners[i] === fn) {
	                    listeners.splice(i, 1);
	                    return;
	                }
	            }
	        };
	        var taskComplete = function () {
	            _each(listeners.slice(0), function (fn) {
	                fn();
	            });
	        };

	        addListener(function () {
	            if (_keys(results).length === keys.length) {
	                callback(null, results);
	                callback = function () {};
	            }
	        });

	        _each(keys, function (k) {
	            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
	            var taskCallback = function (err) {
	                var args = Array.prototype.slice.call(arguments, 1);
	                if (args.length <= 1) {
	                    args = args[0];
	                }
	                if (err) {
	                    var safeResults = {};
	                    _each(_keys(results), function(rkey) {
	                        safeResults[rkey] = results[rkey];
	                    });
	                    safeResults[k] = args;
	                    callback(err, safeResults);
	                    // stop subsequent errors hitting callback multiple times
	                    callback = function () {};
	                }
	                else {
	                    results[k] = args;
	                    async.setImmediate(taskComplete);
	                }
	            };
	            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
	            var ready = function () {
	                return _reduce(requires, function (a, x) {
	                    return (a && results.hasOwnProperty(x));
	                }, true) && !results.hasOwnProperty(k);
	            };
	            if (ready()) {
	                task[task.length - 1](taskCallback, results);
	            }
	            else {
	                var listener = function () {
	                    if (ready()) {
	                        removeListener(listener);
	                        task[task.length - 1](taskCallback, results);
	                    }
	                };
	                addListener(listener);
	            }
	        });
	    };

	    async.waterfall = function (tasks, callback) {
	        callback = callback || function () {};
	        if (tasks.constructor !== Array) {
	          var err = new Error('First argument to waterfall must be an array of functions');
	          return callback(err);
	        }
	        if (!tasks.length) {
	            return callback();
	        }
	        var wrapIterator = function (iterator) {
	            return function (err) {
	                if (err) {
	                    callback.apply(null, arguments);
	                    callback = function () {};
	                }
	                else {
	                    var args = Array.prototype.slice.call(arguments, 1);
	                    var next = iterator.next();
	                    if (next) {
	                        args.push(wrapIterator(next));
	                    }
	                    else {
	                        args.push(callback);
	                    }
	                    async.setImmediate(function () {
	                        iterator.apply(null, args);
	                    });
	                }
	            };
	        };
	        wrapIterator(async.iterator(tasks))();
	    };

	    var _parallel = function(eachfn, tasks, callback) {
	        callback = callback || function () {};
	        if (tasks.constructor === Array) {
	            eachfn.map(tasks, function (fn, callback) {
	                if (fn) {
	                    fn(function (err) {
	                        var args = Array.prototype.slice.call(arguments, 1);
	                        if (args.length <= 1) {
	                            args = args[0];
	                        }
	                        callback.call(null, err, args);
	                    });
	                }
	            }, callback);
	        }
	        else {
	            var results = {};
	            eachfn.each(_keys(tasks), function (k, callback) {
	                tasks[k](function (err) {
	                    var args = Array.prototype.slice.call(arguments, 1);
	                    if (args.length <= 1) {
	                        args = args[0];
	                    }
	                    results[k] = args;
	                    callback(err);
	                });
	            }, function (err) {
	                callback(err, results);
	            });
	        }
	    };

	    async.parallel = function (tasks, callback) {
	        _parallel({ map: async.map, each: async.each }, tasks, callback);
	    };

	    async.parallelLimit = function(tasks, limit, callback) {
	        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
	    };

	    async.series = function (tasks, callback) {
	        callback = callback || function () {};
	        if (tasks.constructor === Array) {
	            async.mapSeries(tasks, function (fn, callback) {
	                if (fn) {
	                    fn(function (err) {
	                        var args = Array.prototype.slice.call(arguments, 1);
	                        if (args.length <= 1) {
	                            args = args[0];
	                        }
	                        callback.call(null, err, args);
	                    });
	                }
	            }, callback);
	        }
	        else {
	            var results = {};
	            async.eachSeries(_keys(tasks), function (k, callback) {
	                tasks[k](function (err) {
	                    var args = Array.prototype.slice.call(arguments, 1);
	                    if (args.length <= 1) {
	                        args = args[0];
	                    }
	                    results[k] = args;
	                    callback(err);
	                });
	            }, function (err) {
	                callback(err, results);
	            });
	        }
	    };

	    async.iterator = function (tasks) {
	        var makeCallback = function (index) {
	            var fn = function () {
	                if (tasks.length) {
	                    tasks[index].apply(null, arguments);
	                }
	                return fn.next();
	            };
	            fn.next = function () {
	                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
	            };
	            return fn;
	        };
	        return makeCallback(0);
	    };

	    async.apply = function (fn) {
	        var args = Array.prototype.slice.call(arguments, 1);
	        return function () {
	            return fn.apply(
	                null, args.concat(Array.prototype.slice.call(arguments))
	            );
	        };
	    };

	    var _concat = function (eachfn, arr, fn, callback) {
	        var r = [];
	        eachfn(arr, function (x, cb) {
	            fn(x, function (err, y) {
	                r = r.concat(y || []);
	                cb(err);
	            });
	        }, function (err) {
	            callback(err, r);
	        });
	    };
	    async.concat = doParallel(_concat);
	    async.concatSeries = doSeries(_concat);

	    async.whilst = function (test, iterator, callback) {
	        if (test()) {
	            iterator(function (err) {
	                if (err) {
	                    return callback(err);
	                }
	                async.whilst(test, iterator, callback);
	            });
	        }
	        else {
	            callback();
	        }
	    };

	    async.doWhilst = function (iterator, test, callback) {
	        iterator(function (err) {
	            if (err) {
	                return callback(err);
	            }
	            if (test()) {
	                async.doWhilst(iterator, test, callback);
	            }
	            else {
	                callback();
	            }
	        });
	    };

	    async.until = function (test, iterator, callback) {
	        if (!test()) {
	            iterator(function (err) {
	                if (err) {
	                    return callback(err);
	                }
	                async.until(test, iterator, callback);
	            });
	        }
	        else {
	            callback();
	        }
	    };

	    async.doUntil = function (iterator, test, callback) {
	        iterator(function (err) {
	            if (err) {
	                return callback(err);
	            }
	            if (!test()) {
	                async.doUntil(iterator, test, callback);
	            }
	            else {
	                callback();
	            }
	        });
	    };

	    async.queue = function (worker, concurrency) {
	        if (concurrency === undefined) {
	            concurrency = 1;
	        }
	        function _insert(q, data, pos, callback) {
	          if(data.constructor !== Array) {
	              data = [data];
	          }
	          _each(data, function(task) {
	              var item = {
	                  data: task,
	                  callback: typeof callback === 'function' ? callback : null
	              };

	              if (pos) {
	                q.tasks.unshift(item);
	              } else {
	                q.tasks.push(item);
	              }

	              if (q.saturated && q.tasks.length === concurrency) {
	                  q.saturated();
	              }
	              async.setImmediate(q.process);
	          });
	        }

	        var workers = 0;
	        var q = {
	            tasks: [],
	            concurrency: concurrency,
	            saturated: null,
	            empty: null,
	            drain: null,
	            push: function (data, callback) {
	              _insert(q, data, false, callback);
	            },
	            unshift: function (data, callback) {
	              _insert(q, data, true, callback);
	            },
	            process: function () {
	                if (workers < q.concurrency && q.tasks.length) {
	                    var task = q.tasks.shift();
	                    if (q.empty && q.tasks.length === 0) {
	                        q.empty();
	                    }
	                    workers += 1;
	                    var next = function () {
	                        workers -= 1;
	                        if (task.callback) {
	                            task.callback.apply(task, arguments);
	                        }
	                        if (q.drain && q.tasks.length + workers === 0) {
	                            q.drain();
	                        }
	                        q.process();
	                    };
	                    var cb = only_once(next);
	                    worker(task.data, cb);
	                }
	            },
	            length: function () {
	                return q.tasks.length;
	            },
	            running: function () {
	                return workers;
	            }
	        };
	        return q;
	    };

	    async.cargo = function (worker, payload) {
	        var working     = false,
	            tasks       = [];

	        var cargo = {
	            tasks: tasks,
	            payload: payload,
	            saturated: null,
	            empty: null,
	            drain: null,
	            push: function (data, callback) {
	                if(data.constructor !== Array) {
	                    data = [data];
	                }
	                _each(data, function(task) {
	                    tasks.push({
	                        data: task,
	                        callback: typeof callback === 'function' ? callback : null
	                    });
	                    if (cargo.saturated && tasks.length === payload) {
	                        cargo.saturated();
	                    }
	                });
	                async.setImmediate(cargo.process);
	            },
	            process: function process() {
	                if (working) return;
	                if (tasks.length === 0) {
	                    if(cargo.drain) cargo.drain();
	                    return;
	                }

	                var ts = typeof payload === 'number'
	                            ? tasks.splice(0, payload)
	                            : tasks.splice(0);

	                var ds = _map(ts, function (task) {
	                    return task.data;
	                });

	                if(cargo.empty) cargo.empty();
	                working = true;
	                worker(ds, function () {
	                    working = false;

	                    var args = arguments;
	                    _each(ts, function (data) {
	                        if (data.callback) {
	                            data.callback.apply(null, args);
	                        }
	                    });

	                    process();
	                });
	            },
	            length: function () {
	                return tasks.length;
	            },
	            running: function () {
	                return working;
	            }
	        };
	        return cargo;
	    };

	    var _console_fn = function (name) {
	        return function (fn) {
	            var args = Array.prototype.slice.call(arguments, 1);
	            fn.apply(null, args.concat([function (err) {
	                var args = Array.prototype.slice.call(arguments, 1);
	                if (typeof console !== 'undefined') {
	                    if (err) {
	                        if (console.error) {
	                            console.error(err);
	                        }
	                    }
	                    else if (console[name]) {
	                        _each(args, function (x) {
	                            console[name](x);
	                        });
	                    }
	                }
	            }]));
	        };
	    };
	    async.log = _console_fn('log');
	    async.dir = _console_fn('dir');
	    /*async.info = _console_fn('info');
	    async.warn = _console_fn('warn');
	    async.error = _console_fn('error');*/

	    async.memoize = function (fn, hasher) {
	        var memo = {};
	        var queues = {};
	        hasher = hasher || function (x) {
	            return x;
	        };
	        var memoized = function () {
	            var args = Array.prototype.slice.call(arguments);
	            var callback = args.pop();
	            var key = hasher.apply(null, args);
	            if (key in memo) {
	                callback.apply(null, memo[key]);
	            }
	            else if (key in queues) {
	                queues[key].push(callback);
	            }
	            else {
	                queues[key] = [callback];
	                fn.apply(null, args.concat([function () {
	                    memo[key] = arguments;
	                    var q = queues[key];
	                    delete queues[key];
	                    for (var i = 0, l = q.length; i < l; i++) {
	                      q[i].apply(null, arguments);
	                    }
	                }]));
	            }
	        };
	        memoized.memo = memo;
	        memoized.unmemoized = fn;
	        return memoized;
	    };

	    async.unmemoize = function (fn) {
	      return function () {
	        return (fn.unmemoized || fn).apply(null, arguments);
	      };
	    };

	    async.times = function (count, iterator, callback) {
	        var counter = [];
	        for (var i = 0; i < count; i++) {
	            counter.push(i);
	        }
	        return async.map(counter, iterator, callback);
	    };

	    async.timesSeries = function (count, iterator, callback) {
	        var counter = [];
	        for (var i = 0; i < count; i++) {
	            counter.push(i);
	        }
	        return async.mapSeries(counter, iterator, callback);
	    };

	    async.compose = function (/* functions... */) {
	        var fns = Array.prototype.reverse.call(arguments);
	        return function () {
	            var that = this;
	            var args = Array.prototype.slice.call(arguments);
	            var callback = args.pop();
	            async.reduce(fns, args, function (newargs, fn, cb) {
	                fn.apply(that, newargs.concat([function () {
	                    var err = arguments[0];
	                    var nextargs = Array.prototype.slice.call(arguments, 1);
	                    cb(err, nextargs);
	                }]))
	            },
	            function (err, results) {
	                callback.apply(that, [err].concat(results));
	            });
	        };
	    };

	    var _applyEach = function (eachfn, fns /*args...*/) {
	        var go = function () {
	            var that = this;
	            var args = Array.prototype.slice.call(arguments);
	            var callback = args.pop();
	            return eachfn(fns, function (fn, cb) {
	                fn.apply(that, args.concat([cb]));
	            },
	            callback);
	        };
	        if (arguments.length > 2) {
	            var args = Array.prototype.slice.call(arguments, 2);
	            return go.apply(this, args);
	        }
	        else {
	            return go;
	        }
	    };
	    async.applyEach = doParallel(_applyEach);
	    async.applyEachSeries = doSeries(_applyEach);

	    async.forever = function (fn, callback) {
	        function next(err) {
	            if (err) {
	                if (callback) {
	                    return callback(err);
	                }
	                throw err;
	            }
	            fn(next);
	        }
	        next();
	    };

	    // AMD / RequireJS
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return async;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	    // Node.js
	    else if (typeof module !== 'undefined' && module.exports) {
	        module.exports = async;
	    }
	    // included directly via <script> tag
	    else {
	        root.async = async;
	    }

	}());

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24), __webpack_require__(48).setImmediate))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(24).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(48).setImmediate, __webpack_require__(48).clearImmediate))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(50);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(28);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(24)))

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * StringBuilder.utils
	 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */
	 var formatter = __webpack_require__(52)
	   , args = __webpack_require__(99)
	   , convert = __webpack_require__(100);


	/**
	 * Expose functionality
	 */
	exports.format = formatter.format;

	exports.replaceArgs = args.replace;
	exports.hasArgs = args.hasArgs;

	exports.toTitleCase = convert.toTitleCase;
	exports.toCamelCase = convert.toCamelCase;
	exports.toJsonCase = convert.toJsonCase;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * StringBuilder.utils.formatter
	 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */
	 var numeral = __webpack_require__(53)
	   , moment = __webpack_require__(54);


	/**
	 * Expose functionality
	 */
	exports.format = format;

	/**
	 * Format the `fmat` with `value`
	 */
	function format(fmat, value) {

		if (typeof value === 'number') {
			return numeral(value).format(fmat);
		} else if (true === (value instanceof Date )) {
			return moment(value).format(fmat);
		}

		return value;
	}

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// numeral.js
	// version : 1.4.8
	// author : Adam Draper
	// license : MIT
	// http://adamwdraper.github.com/Numeral-js/

	(function () {

	    /************************************
	        Constants
	    ************************************/

	    var numeral,
	        VERSION = '1.4.8',
	        // internal storage for language config files
	        languages = {},
	        currentLanguage = 'en',
	        zeroFormat = null,
	        // check for nodeJS
	        hasModule = (typeof module !== 'undefined' && module.exports);


	    /************************************
	        Constructors
	    ************************************/


	    // Numeral prototype object
	    function Numeral (number) {
	        this._n = number;
	    }

	    /**
	     * Implementation of toFixed() that treats floats more like decimals
	     *
	     * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
	     * problems for accounting- and finance-related software.
	     */
	    function toFixed (value, precision, optionals) {
	        var power = Math.pow(10, precision),
	            output;

	        // Multiply up by precision, round accurately, then divide and use native toFixed():
	        output = (Math.round(value * power) / power).toFixed(precision);

	        if (optionals) {
	            var optionalsRegExp = new RegExp('0{1,' + optionals + '}$');
	            output = output.replace(optionalsRegExp, '');
	        }

	        return output;
	    }

	    /************************************
	        Formatting
	    ************************************/

	    // determine what type of formatting we need to do
	    function formatNumeral (n, format) {
	        var output;

	        // figure out what kind of format we are dealing with
	        if (format.indexOf('$') > -1) { // currency!!!!!
	            output = formatCurrency(n, format);
	        } else if (format.indexOf('%') > -1) { // percentage
	            output = formatPercentage(n, format);
	        } else if (format.indexOf(':') > -1) { // time
	            output = formatTime(n, format);
	        } else { // plain ol' numbers or bytes
	            output = formatNumber(n, format);
	        }

	        // return string
	        return output;
	    }

	    // revert to number
	    function unformatNumeral (n, string) {
	        if (string.indexOf(':') > -1) {
	            n._n = unformatTime(string);
	        } else {
	            if (string === zeroFormat) {
	                n._n = 0;
	            } else {
	                var stringOriginal = string;
	                if (languages[currentLanguage].delimiters.decimal !== '.') {
	                    string = string.replace(/\./g,'').replace(languages[currentLanguage].delimiters.decimal, '.');
	                }

	                // see if abbreviations are there so that we can multiply to the correct number
	                var thousandRegExp = new RegExp(languages[currentLanguage].abbreviations.thousand + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$'),
	                    millionRegExp = new RegExp(languages[currentLanguage].abbreviations.million + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$'),
	                    billionRegExp = new RegExp(languages[currentLanguage].abbreviations.billion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$'),
	                    trillionRegExp = new RegExp(languages[currentLanguage].abbreviations.trillion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');

	                // see if bytes are there so that we can multiply to the correct number
	                var prefixes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
	                    bytesMultiplier = false;

	                for (var power = 0; power <= prefixes.length; power++) {
	                    bytesMultiplier = (string.indexOf(prefixes[power]) > -1) ? Math.pow(1024, power + 1) : false;

	                    if (bytesMultiplier) {
	                        break;
	                    }
	                }

	                // do some math to create our number
	                n._n = ((bytesMultiplier) ? bytesMultiplier : 1) * ((stringOriginal.match(thousandRegExp)) ? Math.pow(10, 3) : 1) * ((stringOriginal.match(millionRegExp)) ? Math.pow(10, 6) : 1) * ((stringOriginal.match(billionRegExp)) ? Math.pow(10, 9) : 1) * ((stringOriginal.match(trillionRegExp)) ? Math.pow(10, 12) : 1) * ((string.indexOf('%') > -1) ? 0.01 : 1) * Number(((string.indexOf('(') > -1) ? '-' : '') + string.replace(/[^0-9\.-]+/g, ''));

	                // round if we are talking about bytes
	                n._n = (bytesMultiplier) ? Math.ceil(n._n) : n._n;
	            }
	        }
	        return n._n;
	    }

	    function formatCurrency (n, format) {
	        var prependSymbol = (format.indexOf('$') <= 1) ? true : false;

	        // remove $ for the moment
	        var space = '';

	        // check for space before or after currency
	        if (format.indexOf(' $') > -1) {
	            space = ' ';
	            format = format.replace(' $', '');
	        } else if (format.indexOf('$ ') > -1) {
	            space = ' ';
	            format = format.replace('$ ', '');
	        } else {
	            format = format.replace('$', '');
	        }

	        // format the number
	        var output = formatNumeral(n, format);

	        // position the symbol
	        if (prependSymbol) {
	            if (output.indexOf('(') > -1 || output.indexOf('-') > -1) {
	                output = output.split('');
	                output.splice(1, 0, languages[currentLanguage].currency.symbol + space);
	                output = output.join('');
	            } else {
	                output = languages[currentLanguage].currency.symbol + space + output;
	            }
	        } else {
	            if (output.indexOf(')') > -1) {
	                output = output.split('');
	                output.splice(-1, 0, space + languages[currentLanguage].currency.symbol);
	                output = output.join('');
	            } else {
	                output = output + space + languages[currentLanguage].currency.symbol;
	            }
	        }

	        return output;
	    }

	    function formatPercentage (n, format) {
	        var space = '';
	        // check for space before %
	        if (format.indexOf(' %') > -1) {
	            space = ' ';
	            format = format.replace(' %', '');
	        } else {
	            format = format.replace('%', '');
	        }

	        n._n = n._n * 100;
	        var output = formatNumeral(n, format);
	        if (output.indexOf(')') > -1 ) {
	            output = output.split('');
	            output.splice(-1, 0, space + '%');
	            output = output.join('');
	        } else {
	            output = output + space + '%';
	        }
	        return output;
	    }

	    function formatTime (n, format) {
	        var hours = Math.floor(n._n/60/60),
	            minutes = Math.floor((n._n - (hours * 60 * 60))/60),
	            seconds = Math.round(n._n - (hours * 60 * 60) - (minutes * 60));
	        return hours + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds);
	    }

	    function unformatTime (string) {
	        var timeArray = string.split(':'),
	            seconds = 0;
	        // turn hours and minutes into seconds and add them all up
	        if (timeArray.length === 3) {
	            // hours
	            seconds = seconds + (Number(timeArray[0]) * 60 * 60);
	            // minutes
	            seconds = seconds + (Number(timeArray[1]) * 60);
	            // seconds
	            seconds = seconds + Number(timeArray[2]);
	        } else if (timeArray.lenght === 2) {
	            // minutes
	            seconds = seconds + (Number(timeArray[0]) * 60);
	            // seconds
	            seconds = seconds + Number(timeArray[1]);
	        }
	        return Number(seconds);
	    }

	    function formatNumber (n, format) {
	        var negP = false,
	            optDec = false,
	            abbr = '',
	            bytes = '',
	            ord = '',
	            abs = Math.abs(n._n);

	        // check if number is zero and a custom zero format has been set
	        if (n._n === 0 && zeroFormat !== null) {
	            return zeroFormat;
	        } else {
	            // see if we should use parentheses for negative number
	            if (format.indexOf('(') > -1) {
	                negP = true;
	                format = format.slice(1, -1);
	            }

	            // see if abbreviation is wanted
	            if (format.indexOf('a') > -1) {
	                // check for space before abbreviation
	                if (format.indexOf(' a') > -1) {
	                    abbr = ' ';
	                    format = format.replace(' a', '');
	                } else {
	                    format = format.replace('a', '');
	                }

	                if (abs >= Math.pow(10, 12)) {
	                    // trillion
	                    abbr = abbr + languages[currentLanguage].abbreviations.trillion;
	                    n._n = n._n / Math.pow(10, 12);
	                } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) {
	                    // billion
	                    abbr = abbr + languages[currentLanguage].abbreviations.billion;
	                    n._n = n._n / Math.pow(10, 9);
	                } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
	                    // million
	                    abbr = abbr + languages[currentLanguage].abbreviations.million;
	                    n._n = n._n / Math.pow(10, 6);
	                } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
	                    // thousand
	                    abbr = abbr + languages[currentLanguage].abbreviations.thousand;
	                    n._n = n._n / Math.pow(10, 3);
	                }
	            }

	            // see if we are formatting bytes
	            if (format.indexOf('b') > -1) {
	                // check for space before
	                if (format.indexOf(' b') > -1) {
	                    bytes = ' ';
	                    format = format.replace(' b', '');
	                } else {
	                    format = format.replace('b', '');
	                }

	                var prefixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
	                    min,
	                    max;

	                for (var power = 0; power <= prefixes.length; power++) {
	                    min = Math.pow(1024, power);
	                    max = Math.pow(1024, power+1);

	                    if (n._n >= min && n._n < max) {
	                        bytes = bytes + prefixes[power];
	                        if (min > 0) {
	                            n._n = n._n / min;
	                        }
	                        break;
	                    }
	                }
	            }

	            // see if ordinal is wanted
	            if (format.indexOf('o') > -1) {
	                // check for space before
	                if (format.indexOf(' o') > -1) {
	                    ord = ' ';
	                    format = format.replace(' o', '');
	                } else {
	                    format = format.replace('o', '');
	                }

	                ord = ord + languages[currentLanguage].ordinal(n._n);
	            }

	            if (format.indexOf('[.]') > -1) {
	                optDec = true;
	                format = format.replace('[.]', '.');
	            }

	            var w = n._n.toString().split('.')[0],
	                precision = format.split('.')[1],
	                thousands = format.indexOf(','),
	                d = '',
	                neg = false;

	            if (precision) {
	                if (precision.indexOf('[') > -1) {
	                    precision = precision.replace(']', '');
	                    precision = precision.split('[');
	                    d = toFixed(n._n, (precision[0].length + precision[1].length), precision[1].length);
	                } else {
	                    d = toFixed(n._n, precision.length);
	                }

	                w = d.split('.')[0];

	                if (d.split('.')[1].length) {
	                    d = languages[currentLanguage].delimiters.decimal + d.split('.')[1];
	                } else {
	                    d = '';
	                }

	                if (optDec && Number(d.slice(1)) === 0) {
	                    d = '';
	                }
	            } else {
	                w = toFixed(n._n, null);
	            }

	            // format number
	            if (w.indexOf('-') > -1) {
	                w = w.slice(1);
	                neg = true;
	            }

	            if (thousands > -1) {
	                w = w.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + languages[currentLanguage].delimiters.thousands);
	            }

	            if (format.indexOf('.') === 0) {
	                w = '';
	            }

	            return ((negP && neg) ? '(' : '') + ((!negP && neg) ? '-' : '') + w + d + ((ord) ? ord : '') + ((abbr) ? abbr : '') + ((bytes) ? bytes : '') + ((negP && neg) ? ')' : '');
	        }
	    }

	    /************************************
	        Top Level Functions
	    ************************************/

	    numeral = function (input) {
	        if (numeral.isNumeral(input)) {
	            input = input.value();
	        } else if (!Number(input)) {
	            input = 0;
	        }

	        return new Numeral(Number(input));
	    };

	    // version number
	    numeral.version = VERSION;

	    // compare numeral object
	    numeral.isNumeral = function (obj) {
	        return obj instanceof Numeral;
	    };

	    // This function will load languages and then set the global language.  If
	    // no arguments are passed in, it will simply return the current global
	    // language key.
	    numeral.language = function (key, values) {
	        if (!key) {
	            return currentLanguage;
	        }

	        if (key && !values) {
	            if(!languages[key]) {
	                throw new Error('Unknown language : ' + key);
	            }
	            currentLanguage = key;
	        }

	        if (values || !languages[key]) {
	            loadLanguage(key, values);
	        }

	        return numeral;
	    };

	    numeral.language('en', {
	        delimiters: {
	            thousands: ',',
	            decimal: '.'
	        },
	        abbreviations: {
	            thousand: 'k',
	            million: 'm',
	            billion: 'b',
	            trillion: 't'
	        },
	        ordinal: function (number) {
	            var b = number % 10;
	            return (~~ (number % 100 / 10) === 1) ? 'th' :
	                (b === 1) ? 'st' :
	                (b === 2) ? 'nd' :
	                (b === 3) ? 'rd' : 'th';
	        },
	        currency: {
	            symbol: '$'
	        }
	    });

	    numeral.zeroFormat = function (format) {
	        if (typeof(format) === 'string') {
	            zeroFormat = format;
	        } else {
	            zeroFormat = null;
	        }
	    };

	    /************************************
	        Helpers
	    ************************************/

	    function loadLanguage(key, values) {
	        languages[key] = values;
	    }


	    /************************************
	        Numeral Prototype
	    ************************************/


	    numeral.fn = Numeral.prototype = {

	        clone : function () {
	            return numeral(this);
	        },

	        format : function (inputString) {
	            return formatNumeral(this, inputString ? inputString : numeral.defaultFormat);
	        },

	        unformat : function (inputString) {
	            return unformatNumeral(this, inputString ? inputString : numeral.defaultFormat);
	        },

	        value : function () {
	            return this._n;
	        },

	        valueOf : function () {
	            return this._n;
	        },

	        set : function (value) {
	            this._n = Number(value);
	            return this;
	        },

	        add : function (value) {
	            this._n = this._n + Number(value);
	            return this;
	        },

	        subtract : function (value) {
	            this._n = this._n - Number(value);
	            return this;
	        },

	        multiply : function (value) {
	            this._n = this._n * Number(value);
	            return this;
	        },

	        divide : function (value) {
	            this._n = this._n / Number(value);
	            return this;
	        },

	        difference : function (value) {
	            var difference = this._n - Number(value);

	            if (difference < 0) {
	                difference = -difference;
	            }

	            return difference;
	        }

	    };

	    /************************************
	        Exposing Numeral
	    ************************************/

	    // CommonJS module is defined
	    if (hasModule) {
	        module.exports = numeral;
	    }

	    /*global ender:false */
	    if (typeof ender === 'undefined') {
	        // here, `this` means `window` in the browser, or `global` on the server
	        // add `numeral` as a global object via a string identifier,
	        // for Closure Compiler 'advanced' mode
	        this['numeral'] = numeral;
	    }

	    /*global define:false */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return numeral;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	}).call(this);


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// moment.js
	// version : 2.0.0
	// author : Tim Wood
	// license : MIT
	// momentjs.com

	(function (undefined) {

	    /************************************
	        Constants
	    ************************************/

	    var moment,
	        VERSION = "2.0.0",
	        round = Math.round, i,
	        // internal storage for language config files
	        languages = {},

	        // check for nodeJS
	        hasModule = (typeof module !== 'undefined' && module.exports),

	        // ASP.NET json date format regex
	        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,

	        // format tokens
	        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,
	        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

	        // parsing tokens
	        parseMultipleFormatChunker = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,

	        // parsing token regexes
	        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
	        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
	        parseTokenThreeDigits = /\d{3}/, // 000 - 999
	        parseTokenFourDigits = /\d{1,4}/, // 0 - 9999
	        parseTokenSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
	        parseTokenWord = /[0-9]*[a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF]+\s*?[\u0600-\u06FF]+/i, // any word (or two) characters or numbers including two word month in arabic.
	        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i, // +00:00 -00:00 +0000 -0000 or Z
	        parseTokenT = /T/i, // T (ISO seperator)
	        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

	        // preliminary iso regex
	        // 0000-00-00 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000
	        isoRegex = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,
	        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

	        // iso time formats and regexes
	        isoTimes = [
	            ['HH:mm:ss.S', /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
	            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
	            ['HH:mm', /(T| )\d\d:\d\d/],
	            ['HH', /(T| )\d\d/]
	        ],

	        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
	        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

	        // getter and setter names
	        proxyGettersAndSetters = 'Month|Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
	        unitMillisecondFactors = {
	            'Milliseconds' : 1,
	            'Seconds' : 1e3,
	            'Minutes' : 6e4,
	            'Hours' : 36e5,
	            'Days' : 864e5,
	            'Months' : 2592e6,
	            'Years' : 31536e6
	        },

	        // format function strings
	        formatFunctions = {},

	        // tokens to ordinalize and pad
	        ordinalizeTokens = 'DDD w W M D d'.split(' '),
	        paddedTokens = 'M D H h m s w W'.split(' '),

	        formatTokenFunctions = {
	            M    : function () {
	                return this.month() + 1;
	            },
	            MMM  : function (format) {
	                return this.lang().monthsShort(this, format);
	            },
	            MMMM : function (format) {
	                return this.lang().months(this, format);
	            },
	            D    : function () {
	                return this.date();
	            },
	            DDD  : function () {
	                return this.dayOfYear();
	            },
	            d    : function () {
	                return this.day();
	            },
	            dd   : function (format) {
	                return this.lang().weekdaysMin(this, format);
	            },
	            ddd  : function (format) {
	                return this.lang().weekdaysShort(this, format);
	            },
	            dddd : function (format) {
	                return this.lang().weekdays(this, format);
	            },
	            w    : function () {
	                return this.week();
	            },
	            W    : function () {
	                return this.isoWeek();
	            },
	            YY   : function () {
	                return leftZeroFill(this.year() % 100, 2);
	            },
	            YYYY : function () {
	                return leftZeroFill(this.year(), 4);
	            },
	            YYYYY : function () {
	                return leftZeroFill(this.year(), 5);
	            },
	            a    : function () {
	                return this.lang().meridiem(this.hours(), this.minutes(), true);
	            },
	            A    : function () {
	                return this.lang().meridiem(this.hours(), this.minutes(), false);
	            },
	            H    : function () {
	                return this.hours();
	            },
	            h    : function () {
	                return this.hours() % 12 || 12;
	            },
	            m    : function () {
	                return this.minutes();
	            },
	            s    : function () {
	                return this.seconds();
	            },
	            S    : function () {
	                return ~~(this.milliseconds() / 100);
	            },
	            SS   : function () {
	                return leftZeroFill(~~(this.milliseconds() / 10), 2);
	            },
	            SSS  : function () {
	                return leftZeroFill(this.milliseconds(), 3);
	            },
	            Z    : function () {
	                var a = -this.zone(),
	                    b = "+";
	                if (a < 0) {
	                    a = -a;
	                    b = "-";
	                }
	                return b + leftZeroFill(~~(a / 60), 2) + ":" + leftZeroFill(~~a % 60, 2);
	            },
	            ZZ   : function () {
	                var a = -this.zone(),
	                    b = "+";
	                if (a < 0) {
	                    a = -a;
	                    b = "-";
	                }
	                return b + leftZeroFill(~~(10 * a / 6), 4);
	            },
	            X    : function () {
	                return this.unix();
	            }
	        };

	    function padToken(func, count) {
	        return function (a) {
	            return leftZeroFill(func.call(this, a), count);
	        };
	    }
	    function ordinalizeToken(func) {
	        return function (a) {
	            return this.lang().ordinal(func.call(this, a));
	        };
	    }

	    while (ordinalizeTokens.length) {
	        i = ordinalizeTokens.pop();
	        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i]);
	    }
	    while (paddedTokens.length) {
	        i = paddedTokens.pop();
	        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
	    }
	    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


	    /************************************
	        Constructors
	    ************************************/

	    function Language() {

	    }

	    // Moment prototype object
	    function Moment(config) {
	        extend(this, config);
	    }

	    // Duration Constructor
	    function Duration(duration) {
	        var data = this._data = {},
	            years = duration.years || duration.year || duration.y || 0,
	            months = duration.months || duration.month || duration.M || 0,
	            weeks = duration.weeks || duration.week || duration.w || 0,
	            days = duration.days || duration.day || duration.d || 0,
	            hours = duration.hours || duration.hour || duration.h || 0,
	            minutes = duration.minutes || duration.minute || duration.m || 0,
	            seconds = duration.seconds || duration.second || duration.s || 0,
	            milliseconds = duration.milliseconds || duration.millisecond || duration.ms || 0;

	        // representation for dateAddRemove
	        this._milliseconds = milliseconds +
	            seconds * 1e3 + // 1000
	            minutes * 6e4 + // 1000 * 60
	            hours * 36e5; // 1000 * 60 * 60
	        // Because of dateAddRemove treats 24 hours as different from a
	        // day when working around DST, we need to store them separately
	        this._days = days +
	            weeks * 7;
	        // It is impossible translate months into days without knowing
	        // which months you are are talking about, so we have to store
	        // it separately.
	        this._months = months +
	            years * 12;

	        // The following code bubbles up values, see the tests for
	        // examples of what that means.
	        data.milliseconds = milliseconds % 1000;
	        seconds += absRound(milliseconds / 1000);

	        data.seconds = seconds % 60;
	        minutes += absRound(seconds / 60);

	        data.minutes = minutes % 60;
	        hours += absRound(minutes / 60);

	        data.hours = hours % 24;
	        days += absRound(hours / 24);

	        days += weeks * 7;
	        data.days = days % 30;

	        months += absRound(days / 30);

	        data.months = months % 12;
	        years += absRound(months / 12);

	        data.years = years;
	    }


	    /************************************
	        Helpers
	    ************************************/


	    function extend(a, b) {
	        for (var i in b) {
	            if (b.hasOwnProperty(i)) {
	                a[i] = b[i];
	            }
	        }
	        return a;
	    }

	    function absRound(number) {
	        if (number < 0) {
	            return Math.ceil(number);
	        } else {
	            return Math.floor(number);
	        }
	    }

	    // left zero fill a number
	    // see http://jsperf.com/left-zero-filling for performance comparison
	    function leftZeroFill(number, targetLength) {
	        var output = number + '';
	        while (output.length < targetLength) {
	            output = '0' + output;
	        }
	        return output;
	    }

	    // helper function for _.addTime and _.subtractTime
	    function addOrSubtractDurationFromMoment(mom, duration, isAdding) {
	        var ms = duration._milliseconds,
	            d = duration._days,
	            M = duration._months,
	            currentDate;

	        if (ms) {
	            mom._d.setTime(+mom + ms * isAdding);
	        }
	        if (d) {
	            mom.date(mom.date() + d * isAdding);
	        }
	        if (M) {
	            currentDate = mom.date();
	            mom.date(1)
	                .month(mom.month() + M * isAdding)
	                .date(Math.min(currentDate, mom.daysInMonth()));
	        }
	    }

	    // check if is an array
	    function isArray(input) {
	        return Object.prototype.toString.call(input) === '[object Array]';
	    }

	    // compare two arrays, return the number of differences
	    function compareArrays(array1, array2) {
	        var len = Math.min(array1.length, array2.length),
	            lengthDiff = Math.abs(array1.length - array2.length),
	            diffs = 0,
	            i;
	        for (i = 0; i < len; i++) {
	            if (~~array1[i] !== ~~array2[i]) {
	                diffs++;
	            }
	        }
	        return diffs + lengthDiff;
	    }


	    /************************************
	        Languages
	    ************************************/


	    Language.prototype = {
	        set : function (config) {
	            var prop, i;
	            for (i in config) {
	                prop = config[i];
	                if (typeof prop === 'function') {
	                    this[i] = prop;
	                } else {
	                    this['_' + i] = prop;
	                }
	            }
	        },

	        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
	        months : function (m) {
	            return this._months[m.month()];
	        },

	        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
	        monthsShort : function (m) {
	            return this._monthsShort[m.month()];
	        },

	        monthsParse : function (monthName) {
	            var i, mom, regex, output;

	            if (!this._monthsParse) {
	                this._monthsParse = [];
	            }

	            for (i = 0; i < 12; i++) {
	                // make the regex if we don't have it already
	                if (!this._monthsParse[i]) {
	                    mom = moment([2000, i]);
	                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
	                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
	                }
	                // test the regex
	                if (this._monthsParse[i].test(monthName)) {
	                    return i;
	                }
	            }
	        },

	        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
	        weekdays : function (m) {
	            return this._weekdays[m.day()];
	        },

	        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
	        weekdaysShort : function (m) {
	            return this._weekdaysShort[m.day()];
	        },

	        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
	        weekdaysMin : function (m) {
	            return this._weekdaysMin[m.day()];
	        },

	        _longDateFormat : {
	            LT : "h:mm A",
	            L : "MM/DD/YYYY",
	            LL : "MMMM D YYYY",
	            LLL : "MMMM D YYYY LT",
	            LLLL : "dddd, MMMM D YYYY LT"
	        },
	        longDateFormat : function (key) {
	            var output = this._longDateFormat[key];
	            if (!output && this._longDateFormat[key.toUpperCase()]) {
	                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
	                    return val.slice(1);
	                });
	                this._longDateFormat[key] = output;
	            }
	            return output;
	        },

	        meridiem : function (hours, minutes, isLower) {
	            if (hours > 11) {
	                return isLower ? 'pm' : 'PM';
	            } else {
	                return isLower ? 'am' : 'AM';
	            }
	        },

	        _calendar : {
	            sameDay : '[Today at] LT',
	            nextDay : '[Tomorrow at] LT',
	            nextWeek : 'dddd [at] LT',
	            lastDay : '[Yesterday at] LT',
	            lastWeek : '[last] dddd [at] LT',
	            sameElse : 'L'
	        },
	        calendar : function (key, mom) {
	            var output = this._calendar[key];
	            return typeof output === 'function' ? output.apply(mom) : output;
	        },

	        _relativeTime : {
	            future : "in %s",
	            past : "%s ago",
	            s : "a few seconds",
	            m : "a minute",
	            mm : "%d minutes",
	            h : "an hour",
	            hh : "%d hours",
	            d : "a day",
	            dd : "%d days",
	            M : "a month",
	            MM : "%d months",
	            y : "a year",
	            yy : "%d years"
	        },
	        relativeTime : function (number, withoutSuffix, string, isFuture) {
	            var output = this._relativeTime[string];
	            return (typeof output === 'function') ?
	                output(number, withoutSuffix, string, isFuture) :
	                output.replace(/%d/i, number);
	        },
	        pastFuture : function (diff, output) {
	            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
	            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
	        },

	        ordinal : function (number) {
	            return this._ordinal.replace("%d", number);
	        },
	        _ordinal : "%d",

	        preparse : function (string) {
	            return string;
	        },

	        postformat : function (string) {
	            return string;
	        },

	        week : function (mom) {
	            return weekOfYear(mom, this._week.dow, this._week.doy);
	        },
	        _week : {
	            dow : 0, // Sunday is the first day of the week.
	            doy : 6  // The week that contains Jan 1st is the first week of the year.
	        }
	    };

	    // Loads a language definition into the `languages` cache.  The function
	    // takes a key and optionally values.  If not in the browser and no values
	    // are provided, it will load the language file module.  As a convenience,
	    // this function also returns the language values.
	    function loadLang(key, values) {
	        values.abbr = key;
	        if (!languages[key]) {
	            languages[key] = new Language();
	        }
	        languages[key].set(values);
	        return languages[key];
	    }

	    // Determines which language definition to use and returns it.
	    //
	    // With no parameters, it will return the global language.  If you
	    // pass in a language key, such as 'en', it will return the
	    // definition for 'en', so long as 'en' has already been loaded using
	    // moment.lang.
	    function getLangDefinition(key) {
	        if (!key) {
	            return moment.fn._lang;
	        }
	        if (!languages[key] && hasModule) {
	            __webpack_require__(55)("./" + key);
	        }
	        return languages[key];
	    }


	    /************************************
	        Formatting
	    ************************************/


	    function removeFormattingTokens(input) {
	        if (input.match(/\[.*\]/)) {
	            return input.replace(/^\[|\]$/g, "");
	        }
	        return input.replace(/\\/g, "");
	    }

	    function makeFormatFunction(format) {
	        var array = format.match(formattingTokens), i, length;

	        for (i = 0, length = array.length; i < length; i++) {
	            if (formatTokenFunctions[array[i]]) {
	                array[i] = formatTokenFunctions[array[i]];
	            } else {
	                array[i] = removeFormattingTokens(array[i]);
	            }
	        }

	        return function (mom) {
	            var output = "";
	            for (i = 0; i < length; i++) {
	                output += typeof array[i].call === 'function' ? array[i].call(mom, format) : array[i];
	            }
	            return output;
	        };
	    }

	    // format date using native date object
	    function formatMoment(m, format) {
	        var i = 5;

	        function replaceLongDateFormatTokens(input) {
	            return m.lang().longDateFormat(input) || input;
	        }

	        while (i-- && localFormattingTokens.test(format)) {
	            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
	        }

	        if (!formatFunctions[format]) {
	            formatFunctions[format] = makeFormatFunction(format);
	        }

	        return formatFunctions[format](m);
	    }


	    /************************************
	        Parsing
	    ************************************/


	    // get the regex to find the next token
	    function getParseRegexForToken(token) {
	        switch (token) {
	        case 'DDDD':
	            return parseTokenThreeDigits;
	        case 'YYYY':
	            return parseTokenFourDigits;
	        case 'YYYYY':
	            return parseTokenSixDigits;
	        case 'S':
	        case 'SS':
	        case 'SSS':
	        case 'DDD':
	            return parseTokenOneToThreeDigits;
	        case 'MMM':
	        case 'MMMM':
	        case 'dd':
	        case 'ddd':
	        case 'dddd':
	        case 'a':
	        case 'A':
	            return parseTokenWord;
	        case 'X':
	            return parseTokenTimestampMs;
	        case 'Z':
	        case 'ZZ':
	            return parseTokenTimezone;
	        case 'T':
	            return parseTokenT;
	        case 'MM':
	        case 'DD':
	        case 'YY':
	        case 'HH':
	        case 'hh':
	        case 'mm':
	        case 'ss':
	        case 'M':
	        case 'D':
	        case 'd':
	        case 'H':
	        case 'h':
	        case 'm':
	        case 's':
	            return parseTokenOneOrTwoDigits;
	        default :
	            return new RegExp(token.replace('\\', ''));
	        }
	    }

	    // function to convert string input to date
	    function addTimeToArrayFromToken(token, input, config) {
	        var a, b,
	            datePartArray = config._a;

	        switch (token) {
	        // MONTH
	        case 'M' : // fall through to MM
	        case 'MM' :
	            datePartArray[1] = (input == null) ? 0 : ~~input - 1;
	            break;
	        case 'MMM' : // fall through to MMMM
	        case 'MMMM' :
	            a = getLangDefinition(config._l).monthsParse(input);
	            // if we didn't find a month name, mark the date as invalid.
	            if (a != null) {
	                datePartArray[1] = a;
	            } else {
	                config._isValid = false;
	            }
	            break;
	        // DAY OF MONTH
	        case 'D' : // fall through to DDDD
	        case 'DD' : // fall through to DDDD
	        case 'DDD' : // fall through to DDDD
	        case 'DDDD' :
	            if (input != null) {
	                datePartArray[2] = ~~input;
	            }
	            break;
	        // YEAR
	        case 'YY' :
	            datePartArray[0] = ~~input + (~~input > 68 ? 1900 : 2000);
	            break;
	        case 'YYYY' :
	        case 'YYYYY' :
	            datePartArray[0] = ~~input;
	            break;
	        // AM / PM
	        case 'a' : // fall through to A
	        case 'A' :
	            config._isPm = ((input + '').toLowerCase() === 'pm');
	            break;
	        // 24 HOUR
	        case 'H' : // fall through to hh
	        case 'HH' : // fall through to hh
	        case 'h' : // fall through to hh
	        case 'hh' :
	            datePartArray[3] = ~~input;
	            break;
	        // MINUTE
	        case 'm' : // fall through to mm
	        case 'mm' :
	            datePartArray[4] = ~~input;
	            break;
	        // SECOND
	        case 's' : // fall through to ss
	        case 'ss' :
	            datePartArray[5] = ~~input;
	            break;
	        // MILLISECOND
	        case 'S' :
	        case 'SS' :
	        case 'SSS' :
	            datePartArray[6] = ~~ (('0.' + input) * 1000);
	            break;
	        // UNIX TIMESTAMP WITH MS
	        case 'X':
	            config._d = new Date(parseFloat(input) * 1000);
	            break;
	        // TIMEZONE
	        case 'Z' : // fall through to ZZ
	        case 'ZZ' :
	            config._useUTC = true;
	            a = (input + '').match(parseTimezoneChunker);
	            if (a && a[1]) {
	                config._tzh = ~~a[1];
	            }
	            if (a && a[2]) {
	                config._tzm = ~~a[2];
	            }
	            // reverse offsets
	            if (a && a[0] === '+') {
	                config._tzh = -config._tzh;
	                config._tzm = -config._tzm;
	            }
	            break;
	        }

	        // if the input is null, the date is not valid
	        if (input == null) {
	            config._isValid = false;
	        }
	    }

	    // convert an array to a date.
	    // the array should mirror the parameters below
	    // note: all values past the year are optional and will default to the lowest possible value.
	    // [year, month, day , hour, minute, second, millisecond]
	    function dateFromArray(config) {
	        var i, date, input = [];

	        if (config._d) {
	            return;
	        }

	        for (i = 0; i < 7; i++) {
	            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
	        }

	        // add the offsets to the time to be parsed so that we can have a clean array for checking isValid
	        input[3] += config._tzh || 0;
	        input[4] += config._tzm || 0;

	        date = new Date(0);

	        if (config._useUTC) {
	            date.setUTCFullYear(input[0], input[1], input[2]);
	            date.setUTCHours(input[3], input[4], input[5], input[6]);
	        } else {
	            date.setFullYear(input[0], input[1], input[2]);
	            date.setHours(input[3], input[4], input[5], input[6]);
	        }

	        config._d = date;
	    }

	    // date from string and format string
	    function makeDateFromStringAndFormat(config) {
	        // This array is used to make a Date, either with `new Date` or `Date.UTC`
	        var tokens = config._f.match(formattingTokens),
	            string = config._i,
	            i, parsedInput;

	        config._a = [];

	        for (i = 0; i < tokens.length; i++) {
	            parsedInput = (getParseRegexForToken(tokens[i]).exec(string) || [])[0];
	            if (parsedInput) {
	                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
	            }
	            // don't parse if its not a known token
	            if (formatTokenFunctions[tokens[i]]) {
	                addTimeToArrayFromToken(tokens[i], parsedInput, config);
	            }
	        }
	        // handle am pm
	        if (config._isPm && config._a[3] < 12) {
	            config._a[3] += 12;
	        }
	        // if is 12 am, change hours to 0
	        if (config._isPm === false && config._a[3] === 12) {
	            config._a[3] = 0;
	        }
	        // return
	        dateFromArray(config);
	    }

	    // date from string and array of format strings
	    function makeDateFromStringAndArray(config) {
	        var tempConfig,
	            tempMoment,
	            bestMoment,

	            scoreToBeat = 99,
	            i,
	            currentDate,
	            currentScore;

	        while (config._f.length) {
	            tempConfig = extend({}, config);
	            tempConfig._f = config._f.pop();
	            makeDateFromStringAndFormat(tempConfig);
	            tempMoment = new Moment(tempConfig);

	            if (tempMoment.isValid()) {
	                bestMoment = tempMoment;
	                break;
	            }

	            currentScore = compareArrays(tempConfig._a, tempMoment.toArray());

	            if (currentScore < scoreToBeat) {
	                scoreToBeat = currentScore;
	                bestMoment = tempMoment;
	            }
	        }

	        extend(config, bestMoment);
	    }

	    // date from iso format
	    function makeDateFromString(config) {
	        var i,
	            string = config._i;
	        if (isoRegex.exec(string)) {
	            config._f = 'YYYY-MM-DDT';
	            for (i = 0; i < 4; i++) {
	                if (isoTimes[i][1].exec(string)) {
	                    config._f += isoTimes[i][0];
	                    break;
	                }
	            }
	            if (parseTokenTimezone.exec(string)) {
	                config._f += " Z";
	            }
	            makeDateFromStringAndFormat(config);
	        } else {
	            config._d = new Date(string);
	        }
	    }

	    function makeDateFromInput(config) {
	        var input = config._i,
	            matched = aspNetJsonRegex.exec(input);

	        if (input === undefined) {
	            config._d = new Date();
	        } else if (matched) {
	            config._d = new Date(+matched[1]);
	        } else if (typeof input === 'string') {
	            makeDateFromString(config);
	        } else if (isArray(input)) {
	            config._a = input.slice(0);
	            dateFromArray(config);
	        } else {
	            config._d = input instanceof Date ? new Date(+input) : new Date(input);
	        }
	    }


	    /************************************
	        Relative Time
	    ************************************/


	    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
	        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
	    }

	    function relativeTime(milliseconds, withoutSuffix, lang) {
	        var seconds = round(Math.abs(milliseconds) / 1000),
	            minutes = round(seconds / 60),
	            hours = round(minutes / 60),
	            days = round(hours / 24),
	            years = round(days / 365),
	            args = seconds < 45 && ['s', seconds] ||
	                minutes === 1 && ['m'] ||
	                minutes < 45 && ['mm', minutes] ||
	                hours === 1 && ['h'] ||
	                hours < 22 && ['hh', hours] ||
	                days === 1 && ['d'] ||
	                days <= 25 && ['dd', days] ||
	                days <= 45 && ['M'] ||
	                days < 345 && ['MM', round(days / 30)] ||
	                years === 1 && ['y'] || ['yy', years];
	        args[2] = withoutSuffix;
	        args[3] = milliseconds > 0;
	        args[4] = lang;
	        return substituteTimeAgo.apply({}, args);
	    }


	    /************************************
	        Week of Year
	    ************************************/


	    // firstDayOfWeek       0 = sun, 6 = sat
	    //                      the day of the week that starts the week
	    //                      (usually sunday or monday)
	    // firstDayOfWeekOfYear 0 = sun, 6 = sat
	    //                      the first week is the week that contains the first
	    //                      of this day of the week
	    //                      (eg. ISO weeks use thursday (4))
	    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
	        var end = firstDayOfWeekOfYear - firstDayOfWeek,
	            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day();


	        if (daysToDayOfWeek > end) {
	            daysToDayOfWeek -= 7;
	        }

	        if (daysToDayOfWeek < end - 7) {
	            daysToDayOfWeek += 7;
	        }

	        return Math.ceil(moment(mom).add('d', daysToDayOfWeek).dayOfYear() / 7);
	    }


	    /************************************
	        Top Level Functions
	    ************************************/

	    function makeMoment(config) {
	        var input = config._i,
	            format = config._f;

	        if (input === null || input === '') {
	            return null;
	        }

	        if (typeof input === 'string') {
	            config._i = input = getLangDefinition().preparse(input);
	        }

	        if (moment.isMoment(input)) {
	            config = extend({}, input);
	            config._d = new Date(+input._d);
	        } else if (format) {
	            if (isArray(format)) {
	                makeDateFromStringAndArray(config);
	            } else {
	                makeDateFromStringAndFormat(config);
	            }
	        } else {
	            makeDateFromInput(config);
	        }

	        return new Moment(config);
	    }

	    moment = function (input, format, lang) {
	        return makeMoment({
	            _i : input,
	            _f : format,
	            _l : lang,
	            _isUTC : false
	        });
	    };

	    // creating with utc
	    moment.utc = function (input, format, lang) {
	        return makeMoment({
	            _useUTC : true,
	            _isUTC : true,
	            _l : lang,
	            _i : input,
	            _f : format
	        });
	    };

	    // creating with unix timestamp (in seconds)
	    moment.unix = function (input) {
	        return moment(input * 1000);
	    };

	    // duration
	    moment.duration = function (input, key) {
	        var isDuration = moment.isDuration(input),
	            isNumber = (typeof input === 'number'),
	            duration = (isDuration ? input._data : (isNumber ? {} : input)),
	            ret;

	        if (isNumber) {
	            if (key) {
	                duration[key] = input;
	            } else {
	                duration.milliseconds = input;
	            }
	        }

	        ret = new Duration(duration);

	        if (isDuration && input.hasOwnProperty('_lang')) {
	            ret._lang = input._lang;
	        }

	        return ret;
	    };

	    // version number
	    moment.version = VERSION;

	    // default format
	    moment.defaultFormat = isoFormat;

	    // This function will load languages and then set the global language.  If
	    // no arguments are passed in, it will simply return the current global
	    // language key.
	    moment.lang = function (key, values) {
	        var i;

	        if (!key) {
	            return moment.fn._lang._abbr;
	        }
	        if (values) {
	            loadLang(key, values);
	        } else if (!languages[key]) {
	            getLangDefinition(key);
	        }
	        moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
	    };

	    // returns language data
	    moment.langData = function (key) {
	        if (key && key._lang && key._lang._abbr) {
	            key = key._lang._abbr;
	        }
	        return getLangDefinition(key);
	    };

	    // compare moment object
	    moment.isMoment = function (obj) {
	        return obj instanceof Moment;
	    };

	    // for typechecking Duration objects
	    moment.isDuration = function (obj) {
	        return obj instanceof Duration;
	    };


	    /************************************
	        Moment Prototype
	    ************************************/


	    moment.fn = Moment.prototype = {

	        clone : function () {
	            return moment(this);
	        },

	        valueOf : function () {
	            return +this._d;
	        },

	        unix : function () {
	            return Math.floor(+this._d / 1000);
	        },

	        toString : function () {
	            return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
	        },

	        toDate : function () {
	            return this._d;
	        },

	        toJSON : function () {
	            return moment.utc(this).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	        },

	        toArray : function () {
	            var m = this;
	            return [
	                m.year(),
	                m.month(),
	                m.date(),
	                m.hours(),
	                m.minutes(),
	                m.seconds(),
	                m.milliseconds()
	            ];
	        },

	        isValid : function () {
	            if (this._isValid == null) {
	                if (this._a) {
	                    this._isValid = !compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray());
	                } else {
	                    this._isValid = !isNaN(this._d.getTime());
	                }
	            }
	            return !!this._isValid;
	        },

	        utc : function () {
	            this._isUTC = true;
	            return this;
	        },

	        local : function () {
	            this._isUTC = false;
	            return this;
	        },

	        format : function (inputString) {
	            var output = formatMoment(this, inputString || moment.defaultFormat);
	            return this.lang().postformat(output);
	        },

	        add : function (input, val) {
	            var dur;
	            // switch args to support add('s', 1) and add(1, 's')
	            if (typeof input === 'string') {
	                dur = moment.duration(+val, input);
	            } else {
	                dur = moment.duration(input, val);
	            }
	            addOrSubtractDurationFromMoment(this, dur, 1);
	            return this;
	        },

	        subtract : function (input, val) {
	            var dur;
	            // switch args to support subtract('s', 1) and subtract(1, 's')
	            if (typeof input === 'string') {
	                dur = moment.duration(+val, input);
	            } else {
	                dur = moment.duration(input, val);
	            }
	            addOrSubtractDurationFromMoment(this, dur, -1);
	            return this;
	        },

	        diff : function (input, units, asFloat) {
	            var that = this._isUTC ? moment(input).utc() : moment(input).local(),
	                zoneDiff = (this.zone() - that.zone()) * 6e4,
	                diff, output;

	            if (units) {
	                // standardize on singular form
	                units = units.replace(/s$/, '');
	            }

	            if (units === 'year' || units === 'month') {
	                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
	                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
	                output += ((this - moment(this).startOf('month')) - (that - moment(that).startOf('month'))) / diff;
	                if (units === 'year') {
	                    output = output / 12;
	                }
	            } else {
	                diff = (this - that) - zoneDiff;
	                output = units === 'second' ? diff / 1e3 : // 1000
	                    units === 'minute' ? diff / 6e4 : // 1000 * 60
	                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
	                    units === 'day' ? diff / 864e5 : // 1000 * 60 * 60 * 24
	                    units === 'week' ? diff / 6048e5 : // 1000 * 60 * 60 * 24 * 7
	                    diff;
	            }
	            return asFloat ? output : absRound(output);
	        },

	        from : function (time, withoutSuffix) {
	            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
	        },

	        fromNow : function (withoutSuffix) {
	            return this.from(moment(), withoutSuffix);
	        },

	        calendar : function () {
	            var diff = this.diff(moment().startOf('day'), 'days', true),
	                format = diff < -6 ? 'sameElse' :
	                diff < -1 ? 'lastWeek' :
	                diff < 0 ? 'lastDay' :
	                diff < 1 ? 'sameDay' :
	                diff < 2 ? 'nextDay' :
	                diff < 7 ? 'nextWeek' : 'sameElse';
	            return this.format(this.lang().calendar(format, this));
	        },

	        isLeapYear : function () {
	            var year = this.year();
	            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	        },

	        isDST : function () {
	            return (this.zone() < moment([this.year()]).zone() ||
	                this.zone() < moment([this.year(), 5]).zone());
	        },

	        day : function (input) {
	            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
	            return input == null ? day :
	                this.add({ d : input - day });
	        },

	        startOf: function (units) {
	            units = units.replace(/s$/, '');
	            // the following switch intentionally omits break keywords
	            // to utilize falling through the cases.
	            switch (units) {
	            case 'year':
	                this.month(0);
	                /* falls through */
	            case 'month':
	                this.date(1);
	                /* falls through */
	            case 'week':
	            case 'day':
	                this.hours(0);
	                /* falls through */
	            case 'hour':
	                this.minutes(0);
	                /* falls through */
	            case 'minute':
	                this.seconds(0);
	                /* falls through */
	            case 'second':
	                this.milliseconds(0);
	                /* falls through */
	            }

	            // weeks are a special case
	            if (units === 'week') {
	                this.day(0);
	            }

	            return this;
	        },

	        endOf: function (units) {
	            return this.startOf(units).add(units.replace(/s?$/, 's'), 1).subtract('ms', 1);
	        },

	        isAfter: function (input, units) {
	            units = typeof units !== 'undefined' ? units : 'millisecond';
	            return +this.clone().startOf(units) > +moment(input).startOf(units);
	        },

	        isBefore: function (input, units) {
	            units = typeof units !== 'undefined' ? units : 'millisecond';
	            return +this.clone().startOf(units) < +moment(input).startOf(units);
	        },

	        isSame: function (input, units) {
	            units = typeof units !== 'undefined' ? units : 'millisecond';
	            return +this.clone().startOf(units) === +moment(input).startOf(units);
	        },

	        zone : function () {
	            return this._isUTC ? 0 : this._d.getTimezoneOffset();
	        },

	        daysInMonth : function () {
	            return moment.utc([this.year(), this.month() + 1, 0]).date();
	        },

	        dayOfYear : function (input) {
	            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
	            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
	        },

	        isoWeek : function (input) {
	            var week = weekOfYear(this, 1, 4);
	            return input == null ? week : this.add("d", (input - week) * 7);
	        },

	        week : function (input) {
	            var week = this.lang().week(this);
	            return input == null ? week : this.add("d", (input - week) * 7);
	        },

	        // If passed a language key, it will set the language for this
	        // instance.  Otherwise, it will return the language configuration
	        // variables for this instance.
	        lang : function (key) {
	            if (key === undefined) {
	                return this._lang;
	            } else {
	                this._lang = getLangDefinition(key);
	                return this;
	            }
	        }
	    };

	    // helper for adding shortcuts
	    function makeGetterAndSetter(name, key) {
	        moment.fn[name] = moment.fn[name + 's'] = function (input) {
	            var utc = this._isUTC ? 'UTC' : '';
	            if (input != null) {
	                this._d['set' + utc + key](input);
	                return this;
	            } else {
	                return this._d['get' + utc + key]();
	            }
	        };
	    }

	    // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
	    for (i = 0; i < proxyGettersAndSetters.length; i ++) {
	        makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ''), proxyGettersAndSetters[i]);
	    }

	    // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
	    makeGetterAndSetter('year', 'FullYear');

	    // add plural methods
	    moment.fn.days = moment.fn.day;
	    moment.fn.weeks = moment.fn.week;
	    moment.fn.isoWeeks = moment.fn.isoWeek;

	    /************************************
	        Duration Prototype
	    ************************************/


	    moment.duration.fn = Duration.prototype = {
	        weeks : function () {
	            return absRound(this.days() / 7);
	        },

	        valueOf : function () {
	            return this._milliseconds +
	              this._days * 864e5 +
	              this._months * 2592e6;
	        },

	        humanize : function (withSuffix) {
	            var difference = +this,
	                output = relativeTime(difference, !withSuffix, this.lang());

	            if (withSuffix) {
	                output = this.lang().pastFuture(difference, output);
	            }

	            return this.lang().postformat(output);
	        },

	        lang : moment.fn.lang
	    };

	    function makeDurationGetter(name) {
	        moment.duration.fn[name] = function () {
	            return this._data[name];
	        };
	    }

	    function makeDurationAsGetter(name, factor) {
	        moment.duration.fn['as' + name] = function () {
	            return +this / factor;
	        };
	    }

	    for (i in unitMillisecondFactors) {
	        if (unitMillisecondFactors.hasOwnProperty(i)) {
	            makeDurationAsGetter(i, unitMillisecondFactors[i]);
	            makeDurationGetter(i.toLowerCase());
	        }
	    }

	    makeDurationAsGetter('Weeks', 6048e5);


	    /************************************
	        Default Lang
	    ************************************/


	    // Set default language, other languages will inherit from English.
	    moment.lang('en', {
	        ordinal : function (number) {
	            var b = number % 10,
	                output = (~~ (number % 100 / 10) === 1) ? 'th' :
	                (b === 1) ? 'st' :
	                (b === 2) ? 'nd' :
	                (b === 3) ? 'rd' : 'th';
	            return number + output;
	        }
	    });


	    /************************************
	        Exposing Moment
	    ************************************/


	    // CommonJS module is defined
	    if (hasModule) {
	        module.exports = moment;
	    }
	    /*global ender:false */
	    if (typeof ender === 'undefined') {
	        // here, `this` means `window` in the browser, or `global` on the server
	        // add `moment` as a global object via a string identifier,
	        // for Closure Compiler "advanced" mode
	        this['moment'] = moment;
	    }
	    /*global define:false */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return moment;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	}).call(this);


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./ar": 56,
		"./ar-ma": 57,
		"./ar-ma.js": 57,
		"./ar.js": 56,
		"./bg": 58,
		"./bg.js": 58,
		"./ca": 59,
		"./ca.js": 59,
		"./cs": 60,
		"./cs.js": 60,
		"./cv": 61,
		"./cv.js": 61,
		"./da": 62,
		"./da.js": 62,
		"./de": 63,
		"./de.js": 63,
		"./en-ca": 64,
		"./en-ca.js": 64,
		"./en-gb": 65,
		"./en-gb.js": 65,
		"./eo": 66,
		"./eo.js": 66,
		"./es": 67,
		"./es.js": 67,
		"./et": 68,
		"./et.js": 68,
		"./eu": 69,
		"./eu.js": 69,
		"./fi": 70,
		"./fi.js": 70,
		"./fr": 71,
		"./fr-ca": 72,
		"./fr-ca.js": 72,
		"./fr.js": 71,
		"./gl": 73,
		"./gl.js": 73,
		"./he": 74,
		"./he.js": 74,
		"./hu": 75,
		"./hu.js": 75,
		"./id": 76,
		"./id.js": 76,
		"./is": 77,
		"./is.js": 77,
		"./it": 78,
		"./it.js": 78,
		"./ja": 79,
		"./ja.js": 79,
		"./ko": 80,
		"./ko.js": 80,
		"./lv": 81,
		"./lv.js": 81,
		"./nb": 82,
		"./nb.js": 82,
		"./ne": 83,
		"./ne.js": 83,
		"./nl": 84,
		"./nl.js": 84,
		"./pl": 85,
		"./pl.js": 85,
		"./pt": 86,
		"./pt-br": 87,
		"./pt-br.js": 87,
		"./pt.js": 86,
		"./ro": 88,
		"./ro.js": 88,
		"./ru": 89,
		"./ru.js": 89,
		"./sl": 90,
		"./sl.js": 90,
		"./sv": 91,
		"./sv.js": 91,
		"./th": 92,
		"./th.js": 92,
		"./tr": 93,
		"./tr.js": 93,
		"./tzm": 94,
		"./tzm-la": 95,
		"./tzm-la.js": 95,
		"./tzm.js": 94,
		"./uk": 96,
		"./uk.js": 96,
		"./zh-cn": 97,
		"./zh-cn.js": 97,
		"./zh-tw": 98,
		"./zh-tw.js": 98
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 55;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : Arabic (ar)
	// author : Abdel Said : https://github.com/abdelsaid

	__webpack_require__(54).lang('ar', {
	    months : "كانون الثاني_ﺶﺑﺎﻃ_آذار_نيسان_أيار_حزيران_تموز_آب_أيلول_تشرين الأول_تشرين الثاني_كانون الأول".split("_"),
	    monthsShort : "كانون الثاني_ﺶﺑﺎﻃ_آذار_نيسان_أيار_حزيران_تموز_آب_أيلول_تشرين الأول_تشرين الثاني_كانون الأول".split("_"),
	    weekdays : "الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
	    weekdaysShort : "احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),
	    weekdaysMin : "ح_ن_ث_ر_خ_ج_س".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD/MM/YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay: "[اليوم على الساعة] LT",
	        nextDay: '[غدا على الساعة] LT',
	        nextWeek: 'dddd [على الساعة] LT',
	        lastDay: '[أمس على الساعة] LT',
	        lastWeek: 'dddd [على الساعة] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : "في %s",
	        past : "منذ %s",
	        s : "ثوان",
	        m : "دقيقة",
	        mm : "%d دقائق",
	        h : "ساعة",
	        hh : "%d ساعات",
	        d : "يوم",
	        dd : "%d أيام",
	        M : "شهر",
	        MM : "%d أشهر",
	        y : "سنة",
	        yy : "%d سنوات"
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : Moroccan Arabic (ar-ma)
	// author : ElFadili Yassine : https://github.com/ElFadiliY
	// author : Abdel Said : https://github.com/abdelsaid

	__webpack_require__(54).lang('ar-ma', {
	    months : "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
	    monthsShort : "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
	    weekdays : "الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
	    weekdaysShort : "احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),
	    weekdaysMin : "ح_ن_ث_ر_خ_ج_س".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD/MM/YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay: "[اليوم على الساعة] LT",
	        nextDay: '[غدا على الساعة] LT',
	        nextWeek: 'dddd [على الساعة] LT',
	        lastDay: '[أمس على الساعة] LT',
	        lastWeek: 'dddd [على الساعة] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : "في %s",
	        past : "منذ %s",
	        s : "ثوان",
	        m : "دقيقة",
	        mm : "%d دقائق",
	        h : "ساعة",
	        hh : "%d ساعات",
	        d : "يوم",
	        dd : "%d أيام",
	        M : "شهر",
	        MM : "%d أشهر",
	        y : "سنة",
	        yy : "%d سنوات"
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : bulgarian (bg)
	// author : Krasen Borisov : https://github.com/kraz

	__webpack_require__(54).lang('bg', {
	    months : "януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),
	    monthsShort : "янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),
	    weekdays : "неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),
	    weekdaysShort : "нед_пон_вто_сря_чет_пет_съб".split("_"),
	    weekdaysMin : "нд_пн_вт_ср_чт_пт_сб".split("_"),
	    longDateFormat : {
	        LT : "h:mm",
	        L : "D.MM.YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd, D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay : '[Днес в] LT',
	        nextDay : '[Утре в] LT',
	        nextWeek : 'dddd [в] LT',
	        lastDay : '[Вчера в] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	            case 0:
	            case 3:
	            case 6:
	                return '[В изминалата] dddd [в] LT';
	            case 1:
	            case 2:
	            case 4:
	            case 5:
	                return '[В изминалия] dddd [в] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "след %s",
	        past : "преди %s",
	        s : "няколко секунди",
	        m : "минута",
	        mm : "%d минути",
	        h : "час",
	        hh : "%d часа",
	        d : "ден",
	        dd : "%d дни",
	        M : "месец",
	        MM : "%d месеца",
	        y : "година",
	        yy : "%d години"
	    },
	    ordinal : function (number) {
	        var lastDigit = number % 10,
	            last2Digits = number % 100;
	        if (number === 0) {
	            return number + '-ев';
	        } else if (last2Digits === 0) {
	            return number + '-ен';
	        } else if (last2Digits > 10 && last2Digits < 20) {
	            return number + '-ти';
	        } else if (lastDigit === 1) {
	            return number + '-ви';
	        } else if (lastDigit === 2) {
	            return number + '-ри';
	        } else if (lastDigit === 7 || lastDigit === 8) {
	            return number + '-ми';
	        } else {
	            return number + '-ти';
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : catalan (ca)
	// author : Juan G. Hurtado : https://github.com/juanghurtado

	__webpack_require__(54).lang('ca', {
	    months : "Gener_Febrer_Març_Abril_Maig_Juny_Juliol_Agost_Setembre_Octubre_Novembre_Desembre".split("_"),
	    monthsShort : "Gen._Febr._Mar._Abr._Mai._Jun._Jul._Ag._Set._Oct._Nov._Des.".split("_"),
	    weekdays : "Diumenge_Dilluns_Dimarts_Dimecres_Dijous_Divendres_Dissabte".split("_"),
	    weekdaysShort : "Dg._Dl._Dt._Dc._Dj._Dv._Ds.".split("_"),
	    weekdaysMin : "Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),
	    longDateFormat : {
	        LT : "H:mm",
	        L : "DD/MM/YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay : function () {
	            return '[avui a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        nextDay : function () {
	            return '[demà a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        lastDay : function () {
	            return '[ahir a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        lastWeek : function () {
	            return '[el] dddd [passat a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "en %s",
	        past : "fa %s",
	        s : "uns segons",
	        m : "un minut",
	        mm : "%d minuts",
	        h : "una hora",
	        hh : "%d hores",
	        d : "un dia",
	        dd : "%d dies",
	        M : "un mes",
	        MM : "%d mesos",
	        y : "un any",
	        yy : "%d anys"
	    },
	    ordinal : '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : czech (cs)
	// author : petrbela : https://github.com/petrbela

	var months = "leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_"),
	    monthsShort = "led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_");

	function plural(n) {
	    return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
	}

	function translate(number, withoutSuffix, key, isFuture) {
	    var result = number + " ";
	    switch (key) {
	    case 's':  // a few seconds / in a few seconds / a few seconds ago
	        return (withoutSuffix || isFuture) ? 'pár vteřin' : 'pár vteřinami';
	    case 'm':  // a minute / in a minute / a minute ago
	        return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
	    case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
	        if (withoutSuffix || isFuture) {
	            return result + (plural(number) ? 'minuty' : 'minut');
	        } else {
	            return result + 'minutami';
	        }
	        break;
	    case 'h':  // an hour / in an hour / an hour ago
	        return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
	    case 'hh': // 9 hours / in 9 hours / 9 hours ago
	        if (withoutSuffix || isFuture) {
	            return result + (plural(number) ? 'hodiny' : 'hodin');
	        } else {
	            return result + 'hodinami';
	        }
	        break;
	    case 'd':  // a day / in a day / a day ago
	        return (withoutSuffix || isFuture) ? 'den' : 'dnem';
	    case 'dd': // 9 days / in 9 days / 9 days ago
	        if (withoutSuffix || isFuture) {
	            return result + (plural(number) ? 'dny' : 'dní');
	        } else {
	            return result + 'dny';
	        }
	        break;
	    case 'M':  // a month / in a month / a month ago
	        return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
	    case 'MM': // 9 months / in 9 months / 9 months ago
	        if (withoutSuffix || isFuture) {
	            return result + (plural(number) ? 'měsíce' : 'měsíců');
	        } else {
	            return result + 'měsíci';
	        }
	        break;
	    case 'y':  // a year / in a year / a year ago
	        return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
	    case 'yy': // 9 years / in 9 years / 9 years ago
	        if (withoutSuffix || isFuture) {
	            return result + (plural(number) ? 'roky' : 'let');
	        } else {
	            return result + 'lety';
	        }
	        break;
	    }
	}

	__webpack_require__(54).lang('cs', {
	    months : months,
	    monthsShort : monthsShort,
	    monthsParse : (function (months, monthsShort) {
	        var i, _monthsParse = [];
	        for (i = 0; i < 12; i++) {
	            // use custom parser to solve problem with July (červenec)
	            _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
	        }
	        return _monthsParse;
	    }(months, monthsShort)),
	    weekdays : "neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),
	    weekdaysShort : "ne_po_út_st_čt_pá_so".split("_"),
	    weekdaysMin : "ne_po_út_st_čt_pá_so".split("_"),
	    longDateFormat : {
	        LT: "H:mm",
	        L : "DD.MM.YYYY",
	        LL : "D. MMMM YYYY",
	        LLL : "D. MMMM YYYY LT",
	        LLLL : "dddd D. MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay: "[dnes v] LT",
	        nextDay: '[zítra v] LT',
	        nextWeek: function () {
	            switch (this.day()) {
	            case 0:
	                return '[v neděli v] LT';
	            case 1:
	            case 2:
	                return '[v] dddd [v] LT';
	            case 3:
	                return '[ve středu v] LT';
	            case 4:
	                return '[ve čtvrtek v] LT';
	            case 5:
	                return '[v pátek v] LT';
	            case 6:
	                return '[v sobotu v] LT';
	            }
	        },
	        lastDay: '[včera v] LT',
	        lastWeek: function () {
	            switch (this.day()) {
	            case 0:
	                return '[minulou neděli v] LT';
	            case 1:
	            case 2:
	                return '[minulé] dddd [v] LT';
	            case 3:
	                return '[minulou středu v] LT';
	            case 4:
	            case 5:
	                return '[minulý] dddd [v] LT';
	            case 6:
	                return '[minulou sobotu v] LT';
	            }
	        },
	        sameElse: "L"
	    },
	    relativeTime : {
	        future : "za %s",
	        past : "před %s",
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : chuvash (cv)
	// author : Anatoly Mironov : https://github.com/mirontoli


	__webpack_require__(54).lang('cv', {
	    months : "кăрлач_нарăс_пуш_ака_май_çĕртме_утă_çурла_авăн_юпа_чӳк_раштав".split("_"),
	    monthsShort : "кăр_нар_пуш_ака_май_çĕр_утă_çур_ав_юпа_чӳк_раш".split("_"),
	    weekdays : "вырсарникун_тунтикун_ытларикун_юнкун_кĕçнерникун_эрнекун_шăматкун".split("_"),
	    weekdaysShort : "выр_тун_ытл_юн_кĕç_эрн_шăм".split("_"),
	    weekdaysMin : "вр_тн_ыт_юн_кç_эр_шм".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD-MM-YYYY",
	        LL : "YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ]",
	        LLL : "YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT",
	        LLLL : "dddd, YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT"
	    },
	    calendar : {
	        sameDay: '[Паян] LT [сехетре]',
	        nextDay: '[Ыран] LT [сехетре]',
	        lastDay: '[Ĕнер] LT [сехетре]',
	        nextWeek: '[Çитес] dddd LT [сехетре]',
	        lastWeek: '[Иртнĕ] dddd LT [сехетре]',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : function (output) {
	            var affix = /сехет$/i.exec(output) ? "рен" : /çул$/i.exec(output) ? "тан" : "ран";
	            return output + affix;
	        },
	        past : "%s каялла",
	        s : "пĕр-ик çеккунт",
	        m : "пĕр минут",
	        mm : "%d минут",
	        h : "пĕр сехет",
	        hh : "%d сехет",
	        d : "пĕр кун",
	        dd : "%d кун",
	        M : "пĕр уйăх",
	        MM : "%d уйăх",
	        y : "пĕр çул",
	        yy : "%d çул"
	    },
	    ordinal : '%d-мĕш',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : danish (da)
	// author : Ulrik Nielsen : https://github.com/mrbase

	__webpack_require__(54).lang('da', {
	    months : "Januar_Februar_Marts_April_Maj_Juni_Juli_August_September_Oktober_November_December".split("_"),
	    monthsShort : "Jan_Feb_Mar_Apr_Maj_Jun_Jul_Aug_Sep_Okt_Nov_Dec".split("_"),
	    weekdays : "Søndag_Mandag_Tirsdag_Onsdag_Torsdag_Fredag_Lørdag".split("_"),
	    weekdaysShort : "Søn_Man_Tir_Ons_Tor_Fre_Lør".split("_"),
	    weekdaysMin : "Sø_Ma_Ti_On_To_Fr_Lø".split("_"),
	    longDateFormat : {
	        LT : "h:mm A",
	        L : "DD/MM/YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY h:mm A",
	        LLLL : "dddd D. MMMM, YYYY h:mm A"
	    },
	    calendar : {
	        sameDay : '[I dag kl.] LT',
	        nextDay : '[I morgen kl.] LT',
	        nextWeek : 'dddd [kl.] LT',
	        lastDay : '[I går kl.] LT',
	        lastWeek : '[sidste] dddd [kl] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "om %s",
	        past : "%s siden",
	        s : "få sekunder",
	        m : "minut",
	        mm : "%d minutter",
	        h : "time",
	        hh : "%d timer",
	        d : "dag",
	        dd : "%d dage",
	        M : "månede",
	        MM : "%d måneder",
	        y : "år",
	        yy : "%d år"
	    },
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : german (de)
	// author : lluchs : https://github.com/lluchs

	__webpack_require__(54).lang('de', {
	    months : "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
	    monthsShort : "Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
	    weekdays : "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
	    weekdaysShort : "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
	    weekdaysMin : "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
	    longDateFormat : {
	        LT: "H:mm U\\hr",
	        L : "DD.MM.YYYY",
	        LL : "D. MMMM YYYY",
	        LLL : "D. MMMM YYYY LT",
	        LLLL : "dddd, D. MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay: "[Heute um] LT",
	        sameElse: "L",
	        nextDay: '[Morgen um] LT',
	        nextWeek: 'dddd [um] LT',
	        lastDay: '[Gestern um] LT',
	        lastWeek: '[letzten] dddd [um] LT'
	    },
	    relativeTime : {
	        future : "in %s",
	        past : "vor %s",
	        s : "ein paar Sekunden",
	        m : "einer Minute",
	        mm : "%d Minuten",
	        h : "einer Stunde",
	        hh : "%d Stunden",
	        d : "einem Tag",
	        dd : "%d Tagen",
	        M : "einem Monat",
	        MM : "%d Monaten",
	        y : "einem Jahr",
	        yy : "%d Jahren"
	    },
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : canadian english (en-ca)
	// author : Jonathan Abourbih : https://github.com/jonbca

	__webpack_require__(54).lang('en-ca', {
	    months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
	    monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
	    weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
	    weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
	    weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
	    longDateFormat : {
	        LT : "h:mm A",
	        L : "YYYY-MM-DD",
	        LL : "D MMMM, YYYY",
	        LLL : "D MMMM, YYYY LT",
	        LLLL : "dddd, D MMMM, YYYY LT"
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "in %s",
	        past : "%s ago",
	        s : "a few seconds",
	        m : "a minute",
	        mm : "%d minutes",
	        h : "an hour",
	        hh : "%d hours",
	        d : "a day",
	        dd : "%d days",
	        M : "a month",
	        MM : "%d months",
	        y : "a year",
	        yy : "%d years"
	    },
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~ (number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    }
	});


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : great britain english (en-gb)
	// author : Chris Gedrim : https://github.com/chrisgedrim

	__webpack_require__(54).lang('en-gb', {
	    months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
	    monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
	    weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
	    weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
	    weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
	    longDateFormat : {
	        LT : "h:mm A",
	        L : "DD/MM/YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd, D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "in %s",
	        past : "%s ago",
	        s : "a few seconds",
	        m : "a minute",
	        mm : "%d minutes",
	        h : "an hour",
	        hh : "%d hours",
	        d : "a day",
	        dd : "%d days",
	        M : "a month",
	        MM : "%d months",
	        y : "a year",
	        yy : "%d years"
	    },
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~ (number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : esperanto (eo)
	// author : Colin Dean : https://github.com/colindean
	// komento: Mi estas malcerta se mi korekte traktis akuzativojn en tiu traduko.
	//          Se ne, bonvolu korekti kaj avizi min por ke mi povas lerni!

	__webpack_require__(54).lang('eo', {
	    months : "januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),
	    monthsShort : "jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),
	    weekdays : "Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split("_"),
	    weekdaysShort : "Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split("_"),
	    weekdaysMin : "Di_Lu_Ma_Me_Ĵa_Ve_Sa".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "YYYY-MM-DD",
	        LL : "D-\\an \\de MMMM, YYYY",
	        LLL : "D-\\an \\de MMMM, YYYY LT",
	        LLLL : "dddd, \\l\\a D-\\an \\d\\e MMMM, YYYY LT"
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'p.t.m.' : 'P.T.M.';
	        } else {
	            return isLower ? 'a.t.m.' : 'A.T.M.';
	        }
	    },
	    calendar : {
	        sameDay : '[Hodiaŭ je] LT',
	        nextDay : '[Morgaŭ je] LT',
	        nextWeek : 'dddd [je] LT',
	        lastDay : '[Hieraŭ je] LT',
	        lastWeek : '[pasinta] dddd [je] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "je %s",
	        past : "antaŭ %s",
	        s : "sekundoj",
	        m : "minuto",
	        mm : "%d minutoj",
	        h : "horo",
	        hh : "%d horoj",
	        d : "tago",//ne 'diurno', ĉar estas uzita por proksimumo
	        dd : "%d tagoj",
	        M : "monato",
	        MM : "%d monatoj",
	        y : "jaro",
	        yy : "%d jaroj"
	    },
	    ordinal : "%da",
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : spanish (es)
	// author : Julio Napurí : https://github.com/julionc

	__webpack_require__(54).lang('es', {
	    months : "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),
	    monthsShort : "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),
	    weekdays : "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
	    weekdaysShort : "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
	    weekdaysMin : "Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),
	    longDateFormat : {
	        LT : "H:mm",
	        L : "DD/MM/YYYY",
	        LL : "D \\de MMMM \\de YYYY",
	        LLL : "D \\de MMMM \\de YYYY LT",
	        LLLL : "dddd, D \\de MMMM \\de YYYY LT"
	    },
	    calendar : {
	        sameDay : function () {
	            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextDay : function () {
	            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastDay : function () {
	            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastWeek : function () {
	            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "en %s",
	        past : "hace %s",
	        s : "unos segundos",
	        m : "un minuto",
	        mm : "%d minutos",
	        h : "una hora",
	        hh : "%d horas",
	        d : "un día",
	        dd : "%d días",
	        M : "un mes",
	        MM : "%d meses",
	        y : "un año",
	        yy : "%d años"
	    },
	    ordinal : '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : estonian (et)
	// author : Henry Kehlmann : https://github.com/madhenry

	function translateSeconds(number, withoutSuffix, key, isFuture) {
	    return (isFuture || withoutSuffix) ? 'paari sekundi' : 'paar sekundit';
	}

	__webpack_require__(54).lang('et', {
	    months        : "jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),
	    monthsShort   : "jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),
	    weekdays      : "pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),
	    weekdaysShort : "P_E_T_K_N_R_L".split("_"),
	    weekdaysMin   : "P_E_T_K_N_R_L".split("_"),
	    longDateFormat : {
	        LT   : "H:mm",
	        L    : "DD.MM.YYYY",
	        LL   : "D. MMMM YYYY",
	        LLL  : "D. MMMM YYYY LT",
	        LLLL : "dddd, D. MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay  : '[Täna,] LT',
	        nextDay  : '[Homme,] LT',
	        nextWeek : '[Järgmine] dddd LT',
	        lastDay  : '[Eile,] LT',
	        lastWeek : '[Eelmine] dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "%s pärast",
	        past   : "%s tagasi",
	        s      : translateSeconds,
	        m      : "minut",
	        mm     : "%d minutit",
	        h      : "tund",
	        hh     : "%d tundi",
	        d      : "päev",
	        dd     : "%d päeva",
	        M      : "kuu",
	        MM     : "%d kuud",
	        y      : "aasta",
	        yy     : "%d aastat"
	    },
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : euskara (eu)
	// author : Eneko Illarramendi : https://github.com/eillarra

	__webpack_require__(54).lang('eu', {
	    months : "urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),
	    monthsShort : "urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),
	    weekdays : "igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),
	    weekdaysShort : "ig._al._ar._az._og._ol._lr.".split("_"),
	    weekdaysMin : "ig_al_ar_az_og_ol_lr".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "YYYY-MM-DD",
	        LL : "YYYYko MMMMren D[a]",
	        LLL : "YYYYko MMMMren D[a] LT",
	        LLLL : "dddd, YYYYko MMMMren D[a] LT",
	        l : "YYYY-M-D",
	        ll : "YYYYko MMM D[a]",
	        lll : "YYYYko MMM D[a] LT",
	        llll : "ddd, YYYYko MMM D[a] LT"
	    },
	    calendar : {
	        sameDay : '[gaur] LT[etan]',
	        nextDay : '[bihar] LT[etan]',
	        nextWeek : 'dddd LT[etan]',
	        lastDay : '[atzo] LT[etan]',
	        lastWeek : '[aurreko] dddd LT[etan]',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "%s barru",
	        past : "duela %s",
	        s : "segundo batzuk",
	        m : "minutu bat",
	        mm : "%d minutu",
	        h : "ordu bat",
	        hh : "%d ordu",
	        d : "egun bat",
	        dd : "%d egun",
	        M : "hilabete bat",
	        MM : "%d hilabete",
	        y : "urte bat",
	        yy : "%d urte"
	    },
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : finnish (fi)
	// author : Tarmo Aidantausta : https://github.com/bleadof

	var numbers_past = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' '),
	    numbers_future = ['nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden',
	                      numbers_past[7], numbers_past[8], numbers_past[9]];

	function translate(number, withoutSuffix, key, isFuture) {
	    var result = "";
	    switch (key) {
	    case 's':
	        return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
	    case 'm':
	        return isFuture ? 'minuutin' : 'minuutti';
	    case 'mm':
	        result = isFuture ? 'minuutin' : 'minuuttia';
	        break;
	    case 'h':
	        return isFuture ? 'tunnin' : 'tunti';
	    case 'hh':
	        result = isFuture ? 'tunnin' : 'tuntia';
	        break;
	    case 'd':
	        return isFuture ? 'päivän' : 'päivä';
	    case 'dd':
	        result = isFuture ? 'päivän' : 'päivää';
	        break;
	    case 'M':
	        return isFuture ? 'kuukauden' : 'kuukausi';
	    case 'MM':
	        result = isFuture ? 'kuukauden' : 'kuukautta';
	        break;
	    case 'y':
	        return isFuture ? 'vuoden' : 'vuosi';
	    case 'yy':
	        result = isFuture ? 'vuoden' : 'vuotta';
	        break;
	    }
	    result = verbal_number(number, isFuture) + " " + result;
	    return result;
	}

	function verbal_number(number, isFuture) {
	    return number < 10 ? (isFuture ? numbers_future[number] : numbers_past[number]) : number;
	}

	__webpack_require__(54).lang('fi', {
	    months : "tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),
	    monthsShort : "tam_hel_maa_huh_tou_kes_hei_elo_syy_lok_mar_jou".split("_"),
	    weekdays : "sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),
	    weekdaysShort : "su_ma_ti_ke_to_pe_la".split("_"),
	    weekdaysMin : "su_ma_ti_ke_to_pe_la".split("_"),
	    longDateFormat : {
	        LT : "HH.mm",
	        L : "DD.MM.YYYY",
	        LL : "Do MMMM[ta] YYYY",
	        LLL : "Do MMMM[ta] YYYY, [klo] LT",
	        LLLL : "dddd, Do MMMM[ta] YYYY, [klo] LT",
	        l : "D.M.YYYY",
	        ll : "Do MMM YYYY",
	        lll : "Do MMM YYYY, [klo] LT",
	        llll : "ddd, Do MMM YYYY, [klo] LT"
	    },
	    calendar : {
	        sameDay : '[tänään] [klo] LT',
	        nextDay : '[huomenna] [klo] LT',
	        nextWeek : 'dddd [klo] LT',
	        lastDay : '[eilen] [klo] LT',
	        lastWeek : '[viime] dddd[na] [klo] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "%s päästä",
	        past : "%s sitten",
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinal : "%d.",
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : french (fr)
	// author : John Fischer : https://github.com/jfroffice

	__webpack_require__(54).lang('fr', {
	    months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
	    monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
	    weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
	    weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
	    weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD/MM/YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay: "[Aujourd'hui à] LT",
	        nextDay: '[Demain à] LT',
	        nextWeek: 'dddd [à] LT',
	        lastDay: '[Hier à] LT',
	        lastWeek: 'dddd [dernier à] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : "dans %s",
	        past : "il y a %s",
	        s : "quelques secondes",
	        m : "une minute",
	        mm : "%d minutes",
	        h : "une heure",
	        hh : "%d heures",
	        d : "un jour",
	        dd : "%d jours",
	        M : "un mois",
	        MM : "%d mois",
	        y : "un an",
	        yy : "%d ans"
	    },
	    ordinal : function (number) {
	        return number + (number === 1 ? 'er' : 'ème');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : canadian french (fr-ca)
	// author : Jonathan Abourbih : https://github.com/jonbca

	__webpack_require__(54).lang('fr-ca', {
	    months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
	    monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
	    weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
	    weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
	    weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "YYYY-MM-DD",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay: "[Aujourd'hui à] LT",
	        nextDay: '[Demain à] LT',
	        nextWeek: 'dddd [à] LT',
	        lastDay: '[Hier à] LT',
	        lastWeek: 'dddd [dernier à] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : "dans %s",
	        past : "il y a %s",
	        s : "quelques secondes",
	        m : "une minute",
	        mm : "%d minutes",
	        h : "une heure",
	        hh : "%d heures",
	        d : "un jour",
	        dd : "%d jours",
	        M : "un mois",
	        MM : "%d mois",
	        y : "un an",
	        yy : "%d ans"
	    },
	    ordinal : function (number) {
	        return number + (number === 1 ? 'er' : 'ème');
	    }
	});


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : galician (gl)
	// author : Juan G. Hurtado : https://github.com/juanghurtado

	__webpack_require__(54).lang('gl', {
	    months : "Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Octubro_Novembro_Decembro".split("_"),
	    monthsShort : "Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),
	    weekdays : "Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),
	    weekdaysShort : "Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),
	    weekdaysMin : "Do_Lu_Ma_Mé_Xo_Ve_Sá".split("_"),
	    longDateFormat : {
	        LT : "H:mm",
	        L : "DD/MM/YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay : function () {
	            return '[hoxe ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
	        },
	        nextDay : function () {
	            return '[mañá ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
	        },
	        lastDay : function () {
	            return '[onte ' + ((this.hours() !== 1) ? 'á' : 'a') + '] LT';
	        },
	        lastWeek : function () {
	            return '[o] dddd [pasado ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "en %s",
	        past : "fai %s",
	        s : "uns segundo",
	        m : "un minuto",
	        mm : "%d minutos",
	        h : "unha hora",
	        hh : "%d horas",
	        d : "un día",
	        dd : "%d días",
	        M : "un mes",
	        MM : "%d meses",
	        y : "un ano",
	        yy : "%d anos"
	    },
	    ordinal : '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : Hebrew (he)
	// author : Tomer Cohen : https://github.com/tomer
	// author : Moshe Simantov : https://github.com/DevelopmentIL

	__webpack_require__(54).lang('he', {
	    months : "ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),
	    monthsShort : "ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),
	    weekdays : "ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),
	    weekdaysShort : "א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),
	    weekdaysMin : "א_ב_ג_ד_ה_ו_ש".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD/MM/YYYY",
	        LL : "D [ב]MMMM YYYY",
	        LLL : "D [ב]MMMM YYYY LT",
	        LLLL : "dddd, D [ב]MMMM YYYY LT",
	        l : "D/M/YYYY",
	        ll : "D MMM YYYY",
	        lll : "D MMM YYYY LT",
	        llll : "ddd, D MMM YYYY LT"
	    },
	    calendar : {
	        sameDay : '[היום ב־]LT',
	        nextDay : '[מחר ב־]LT',
	        nextWeek : 'dddd [בשעה] LT',
	        lastDay : '[אתמול ב־]LT',
	        lastWeek : '[ביום] dddd [האחרון בשעה] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "בעוד %s",
	        past : "לפני %s",
	        s : "מספר שניות",
	        m : "דקה",
	        mm : "%d דקות",
	        h : "שעה",
	        hh : "%d שעות",
	        d : "יום",
	        dd : "%d ימים",
	        M : "חודש",
	        MM : "%d חודשים",
	        y : "שנה",
	        yy : "%d שנים"
	    }
	});


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : hungarian (hu)
	// author : Adam Brunner : https://github.com/adambrunner

	var weekEndings = 'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');

	function translate(number, withoutSuffix, key, isFuture) {
	    var num = number,
	        suffix;

	    switch (key) {
	    case 's':
	        return (isFuture || withoutSuffix) ? 'néhány másodperc' : 'néhány másodperce';
	    case 'm':
	        return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
	    case 'mm':
	        return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
	    case 'h':
	        return 'egy' + (isFuture || withoutSuffix ? ' óra' : ' órája');
	    case 'hh':
	        return num + (isFuture || withoutSuffix ? ' óra' : ' órája');
	    case 'd':
	        return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
	    case 'dd':
	        return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
	    case 'M':
	        return 'egy' + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
	    case 'MM':
	        return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
	    case 'y':
	        return 'egy' + (isFuture || withoutSuffix ? ' év' : ' éve');
	    case 'yy':
	        return num + (isFuture || withoutSuffix ? ' év' : ' éve');
	    }

	    return '';
	}

	function week(isFuture) {
	    return (isFuture ? '' : 'múlt ') + '[' + weekEndings[this.day()] + '] LT[-kor]';
	}

	__webpack_require__(54).lang('hu', {
	    months : "január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),
	    monthsShort : "jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),
	    weekdays : "vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),
	    weekdaysShort : "v_h_k_sze_cs_p_szo".split("_"),
	    longDateFormat : {
	        LT : "H:mm",
	        L : "YYYY.MM.DD.",
	        LL : "YYYY. MMMM D.",
	        LLL : "YYYY. MMMM D., LT",
	        LLLL : "YYYY. MMMM D., dddd LT"
	    },
	    calendar : {
	        sameDay : '[ma] LT[-kor]',
	        nextDay : '[holnap] LT[-kor]',
	        nextWeek : function () {
	            return week.call(this, true);
	        },
	        lastDay : '[tegnap] LT[-kor]',
	        lastWeek : function () {
	            return week.call(this, false);
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "%s múlva",
	        past : "%s",
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : Bahasa Indonesia (id)
	// author : Mohammad Satrio Utomo : https://github.com/tyok
	// reference: http://id.wikisource.org/wiki/Pedoman_Umum_Ejaan_Bahasa_Indonesia_yang_Disempurnakan

	__webpack_require__(54).lang('id', {
	    months : "Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),
	    monthsShort : "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),
	    weekdays : "Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),
	    weekdaysShort : "Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),
	    weekdaysMin : "Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),
	    longDateFormat : {
	        LT : "HH.mm",
	        L : "DD/MM/YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY [pukul] LT",
	        LLLL : "dddd, D MMMM YYYY [pukul] LT"
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'pagi';
	        } else if (hours < 15) {
	            return 'siang';
	        } else if (hours < 19) {
	            return 'sore';
	        } else {
	            return 'malam';
	        }
	    },
	    calendar : {
	        sameDay : '[Hari ini pukul] LT',
	        nextDay : '[Besok pukul] LT',
	        nextWeek : 'dddd [pukul] LT',
	        lastDay : '[Kemarin pukul] LT',
	        lastWeek : 'dddd [lalu pukul] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "dalam %s",
	        past : "%s yang lalu",
	        s : "beberapa detik",
	        m : "semenit",
	        mm : "%d menit",
	        h : "sejam",
	        hh : "%d jam",
	        d : "sehari",
	        dd : "%d hari",
	        M : "sebulan",
	        MM : "%d bulan",
	        y : "setahun",
	        yy : "%d tahun"
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : icelandic (is)
	// author : Hinrik Örn Sigurðsson : https://github.com/hinrik

	function plural(n) {
	    if (n % 100 === 11) {
	        return true;
	    } else if (n % 10 === 1) {
	        return false;
	    }
	    return true;
	}

	function translate(number, withoutSuffix, key, isFuture) {
	    var result = number + " ";
	    switch (key) {
	    case 's':
	        return withoutSuffix || isFuture ? 'nokkrar sekúndur' : 'nokkrum sekúndum';
	    case 'm':
	        return withoutSuffix ? 'mínúta' : 'mínútu';
	    case 'mm':
	        if (plural(number)) {
	            return result + (withoutSuffix || isFuture ? 'mínútur' : 'mínútum');
	        } else if (withoutSuffix) {
	            return result + 'mínúta';
	        }
	        return result + 'mínútu';
	    case 'hh':
	        if (plural(number)) {
	            return result + (withoutSuffix || isFuture ? 'klukkustundir' : 'klukkustundum');
	        }
	        return result + 'klukkustund';
	    case 'd':
	        if (withoutSuffix) {
	            return 'dagur';
	        }
	        return isFuture ? 'dag' : 'degi';
	    case 'dd':
	        if (plural(number)) {
	            if (withoutSuffix) {
	                return result + 'dagar';
	            }
	            return result + (isFuture ? 'daga' : 'dögum');
	        } else if (withoutSuffix) {
	            return result + 'dagur';
	        }
	        return result + (isFuture ? 'dag' : 'degi');
	    case 'M':
	        if (withoutSuffix) {
	            return 'mánuður';
	        }
	        return isFuture ? 'mánuð' : 'mánuði';
	    case 'MM':
	        if (plural(number)) {
	            if (withoutSuffix) {
	                return result + 'mánuðir';
	            }
	            return result + (isFuture ? 'mánuði' : 'mánuðum');
	        } else if (withoutSuffix) {
	            return result + 'mánuður';
	        }
	        return result + (isFuture ? 'mánuð' : 'mánuði');
	    case 'y':
	        return withoutSuffix || isFuture ? 'ár' : 'ári';
	    case 'yy':
	        if (plural(number)) {
	            return result + (withoutSuffix || isFuture ? 'ár' : 'árum');
	        }
	        return result + (withoutSuffix || isFuture ? 'ár' : 'ári');
	    }
	}

	__webpack_require__(54).lang('is', {
	    months : "janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),
	    monthsShort : "jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),
	    weekdays : "sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),
	    weekdaysShort : "sun_mán_þri_mið_fim_fös_lau".split("_"),
	    weekdaysMin : "Su_Má_Þr_Mi_Fi_Fö_La".split("_"),
	    longDateFormat : {
	        LT : "H:mm",
	        L : "DD/MM/YYYY",
	        LL : "D. MMMM YYYY",
	        LLL : "D. MMMM YYYY [kl.] LT",
	        LLLL : "dddd, D. MMMM YYYY [kl.] LT"
	    },
	    calendar : {
	        sameDay : '[í dag kl.] LT',
	        nextDay : '[á morgun kl.] LT',
	        nextWeek : 'dddd [kl.] LT',
	        lastDay : '[í gær kl.] LT',
	        lastWeek : '[síðasta] dddd [kl.] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "eftir %s",
	        past : "fyrir %s síðan",
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : "klukkustund",
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : italian (it)
	// author : Lorenzo : https://github.com/aliem

	__webpack_require__(54).lang('it', {
	    months : "Gennaio_Febbraio_Marzo_Aprile_Maggio_Giugno_Luglio_Agosto_Settembre_Ottobre_Novembre_Dicembre".split("_"),
	    monthsShort : "Gen_Feb_Mar_Apr_Mag_Giu_Lug_Ago_Set_Ott_Nov_Dic".split("_"),
	    weekdays : "Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),
	    weekdaysShort : "Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),
	    weekdaysMin : "D_L_Ma_Me_G_V_S".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD/MM/YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd, D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay: '[Oggi alle] LT',
	        nextDay: '[Domani alle] LT',
	        nextWeek: 'dddd [alle] LT',
	        lastDay: '[Ieri alle] LT',
	        lastWeek: '[lo scorso] dddd [alle] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : "in %s",
	        past : "%s fa",
	        s : "secondi",
	        m : "un minuto",
	        mm : "%d minuti",
	        h : "un'ora",
	        hh : "%d ore",
	        d : "un giorno",
	        dd : "%d giorni",
	        M : "un mese",
	        MM : "%d mesi",
	        y : "un anno",
	        yy : "%d anni"
	    },
	    ordinal: '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : japanese (ja)
	// author : LI Long : https://github.com/baryon

	__webpack_require__(54).lang('ja', {
	    months : "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
	    monthsShort : "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
	    weekdays : "日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),
	    weekdaysShort : "日_月_火_水_木_金_土".split("_"),
	    weekdaysMin : "日_月_火_水_木_金_土".split("_"),
	    longDateFormat : {
	        LT : "Ah時m分",
	        L : "YYYY/MM/DD",
	        LL : "YYYY年M月D日",
	        LLL : "YYYY年M月D日LT",
	        LLLL : "YYYY年M月D日LT dddd"
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return "午前";
	        } else {
	            return "午後";
	        }
	    },
	    calendar : {
	        sameDay : '[今日] LT',
	        nextDay : '[明日] LT',
	        nextWeek : '[来週]dddd LT',
	        lastDay : '[昨日] LT',
	        lastWeek : '[前週]dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "%s後",
	        past : "%s前",
	        s : "数秒",
	        m : "1分",
	        mm : "%d分",
	        h : "1時間",
	        hh : "%d時間",
	        d : "1日",
	        dd : "%d日",
	        M : "1ヶ月",
	        MM : "%dヶ月",
	        y : "1年",
	        yy : "%d年"
	    }
	});


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : korean (ko)
	// author : Kyungwook, Park : https://github.com/kyungw00k

	__webpack_require__(54).lang('ko', {
	    months : "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
	    monthsShort : "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
	    weekdays : "일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),
	    weekdaysShort : "일_월_화_수_목_금_토".split("_"),
	    weekdaysMin : "일_월_화_수_목_금_토".split("_"),
	    longDateFormat : {
	        LT : "A h시 mm분",
	        L : "YYYY.MM.DD",
	        LL : "YYYY년 MMMM D일",
	        LLL : "YYYY년 MMMM D일 LT",
	        LLLL : "YYYY년 MMMM D일 dddd LT"
	    },
	    meridiem : function (hour, minute, isUpper) {
	        return hour < 12 ? '오전' : '오후';
	    },
	    calendar : {
	        sameDay : '오늘 LT',
	        nextDay : '내일 LT',
	        nextWeek : 'dddd LT',
	        lastDay : '어제 LT',
	        lastWeek : '지난주 dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "%s 후",
	        past : "%s 전",
	        s : "몇초",
	        ss : "%d초",
	        m : "일분",
	        mm : "%d분",
	        h : "한시간",
	        hh : "%d시간",
	        d : "하루",
	        dd : "%d일",
	        M : "한달",
	        MM : "%d달",
	        y : "일년",
	        yy : "%d년"
	    },
	    ordinal : '%d일'
	});


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : latvian (lv)
	// author : Kristaps Karlsons : https://github.com/skakri

	var units = {
	    'mm': 'minūti_minūtes_minūte_minūtes',
	    'hh': 'stundu_stundas_stunda_stundas',
	    'dd': 'dienu_dienas_diena_dienas',
	    'MM': 'mēnesi_mēnešus_mēnesis_mēneši',
	    'yy': 'gadu_gadus_gads_gadi'
	};

	function format(word, number, withoutSuffix) {
	    var forms = word.split('_');
	    if (withoutSuffix) {
	        return number % 10 === 1 && number !== 11 ? forms[2] : forms[3];
	    } else {
	        return number % 10 === 1 && number !== 11 ? forms[0] : forms[1];
	    }
	}

	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    return number + ' ' + format(units[key], number, withoutSuffix);
	}

	__webpack_require__(54).lang('lv', {
	    months : "janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),
	    monthsShort : "jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),
	    weekdays : "svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),
	    weekdaysShort : "Sv_P_O_T_C_Pk_S".split("_"),
	    weekdaysMin : "Sv_P_O_T_C_Pk_S".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "YYYY.MM.DD.",
	        LL : "YYYY. [gada] D. MMMM",
	        LLL : "YYYY. [gada] D. MMMM, LT",
	        LLLL : "YYYY. [gada] D. MMMM, dddd, LT"
	    },
	    calendar : {
	        sameDay : '[Šodien pulksten] LT',
	        nextDay : '[Rīt pulksten] LT',
	        nextWeek : 'dddd [pulksten] LT',
	        lastDay : '[Vakar pulksten] LT',
	        lastWeek : '[Pagājušā] dddd [pulksten] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "%s vēlāk",
	        past : "%s agrāk",
	        s : "dažas sekundes",
	        m : "minūti",
	        mm : relativeTimeWithPlural,
	        h : "stundu",
	        hh : relativeTimeWithPlural,
	        d : "dienu",
	        dd : relativeTimeWithPlural,
	        M : "mēnesi",
	        MM : relativeTimeWithPlural,
	        y : "gadu",
	        yy : relativeTimeWithPlural
	    },
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : norwegian bokmål (nb)
	// author : Espen Hovlandsdal : https://github.com/rexxars

	__webpack_require__(54).lang('nb', {
	    months : "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
	    monthsShort : "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
	    weekdays : "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
	    weekdaysShort : "søn_man_tir_ons_tor_fre_lør".split("_"),
	    weekdaysMin : "sø_ma_ti_on_to_fr_lø".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "YYYY-MM-DD",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay: '[I dag klokken] LT',
	        nextDay: '[I morgen klokken] LT',
	        nextWeek: 'dddd [klokken] LT',
	        lastDay: '[I går klokken] LT',
	        lastWeek: '[Forrige] dddd [klokken] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : "om %s",
	        past : "for %s siden",
	        s : "noen sekunder",
	        m : "ett minutt",
	        mm : "%d minutter",
	        h : "en time",
	        hh : "%d timer",
	        d : "en dag",
	        dd : "%d dager",
	        M : "en måned",
	        MM : "%d måneder",
	        y : "ett år",
	        yy : "%d år"
	    },
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : nepali/nepalese
	// author : suvash : https://github.com/suvash

	var symbolMap = {
	    '1': '१',
	    '2': '२',
	    '3': '३',
	    '4': '४',
	    '5': '५',
	    '6': '६',
	    '7': '७',
	    '8': '८',
	    '9': '९',
	    '0': '०'
	},
	numberMap = {
	    '१': '1',
	    '२': '2',
	    '३': '3',
	    '४': '4',
	    '५': '5',
	    '६': '6',
	    '७': '7',
	    '८': '8',
	    '९': '9',
	    '०': '0'
	};

	__webpack_require__(54).lang('ne', {
	    months : 'जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर'.split("_"),
	    monthsShort : 'जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.'.split("_"),
	    weekdays : 'आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार'.split("_"),
	    weekdaysShort : 'आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.'.split("_"),
	    weekdaysMin : 'आइ._सो._मङ्_बु._बि._शु._श.'.split("_"),
	    longDateFormat : {
	        LT : "Aको h:mm बजे",
	        L : "DD/MM/YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY, LT",
	        LLLL : "dddd, D MMMM YYYY, LT"
	    },
	    preparse: function (string) {
	        return string.replace(/[१२३४५६७८९०]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 3) {
	            return "राती";
	        } else if (hour < 10) {
	            return "बिहान";
	        } else if (hour < 15) {
	            return "दिउँसो";
	        } else if (hour < 18) {
	            return "बेलुका";
	        } else if (hour < 20) {
	            return "साँझ";
	        } else {
	            return "राती";
	        }
	    },
	    calendar : {
	        sameDay : '[आज] LT',
	        nextDay : '[भोली] LT',
	        nextWeek : '[आउँदो] dddd[,] LT',
	        lastDay : '[हिजो] LT',
	        lastWeek : '[गएको] dddd[,] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "%sमा",
	        past : "%s अगाडी",
	        s : "केही समय",
	        m : "एक मिनेट",
	        mm : "%d मिनेट",
	        h : "एक घण्टा",
	        hh : "%d घण्टा",
	        d : "एक दिन",
	        dd : "%d दिन",
	        M : "एक महिना",
	        MM : "%d महिना",
	        y : "एक बर्ष",
	        yy : "%d बर्ष"
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : dutch (nl)
	// author : Joris Röling : https://github.com/jjupiter

	var monthsShortWithDots = "jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),
	    monthsShortWithoutDots = "jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_");

	__webpack_require__(54).lang('nl', {
	    months : "januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShortWithoutDots[m.month()];
	        } else {
	            return monthsShortWithDots[m.month()];
	        }
	    },
	    weekdays : "zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),
	    weekdaysShort : "zo._ma._di._wo._do._vr._za.".split("_"),
	    weekdaysMin : "Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD-MM-YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay: '[Vandaag om] LT',
	        nextDay: '[Morgen om] LT',
	        nextWeek: 'dddd [om] LT',
	        lastDay: '[Gisteren om] LT',
	        lastWeek: '[afgelopen] dddd [om] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : "over %s",
	        past : "%s geleden",
	        s : "een paar seconden",
	        m : "één minuut",
	        mm : "%d minuten",
	        h : "één uur",
	        hh : "%d uur",
	        d : "één dag",
	        dd : "%d dagen",
	        M : "één maand",
	        MM : "%d maanden",
	        y : "één jaar",
	        yy : "%d jaar"
	    },
	    ordinal : function (number) {
	        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : polish (pl)
	// author : Rafal Hirsz : https://github.com/evoL

	function plural(n) {
	    return (n % 10 < 5) && (n % 10 > 1) && (~~(n / 10) !== 1);
	}

	function translate(number, withoutSuffix, key) {
	    var result = number + " ";
	    switch (key) {
	    case 'm':
	        return withoutSuffix ? 'minuta' : 'minutę';
	    case 'mm':
	        return result + (plural(number) ? 'minuty' : 'minut');
	    case 'h':
	        return withoutSuffix  ? 'godzina'  : 'godzinę';
	    case 'hh':
	        return result + (plural(number) ? 'godziny' : 'godzin');
	    case 'MM':
	        return result + (plural(number) ? 'miesiące' : 'miesięcy');
	    case 'yy':
	        return result + (plural(number) ? 'lata' : 'lat');
	    }
	}

	__webpack_require__(54).lang('pl', {
	    months : "styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_"),
	    monthsShort : "sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),
	    weekdays : "niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),
	    weekdaysShort : "nie_pon_wt_śr_czw_pt_sb".split("_"),
	    weekdaysMin : "N_Pn_Wt_Śr_Cz_Pt_So".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD-MM-YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd, D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay: '[Dziś o] LT',
	        nextDay: '[Jutro o] LT',
	        nextWeek: '[W] dddd [o] LT',
	        lastDay: '[Wczoraj o] LT',
	        lastWeek: function () {
	            switch (this.day()) {
	            case 0:
	                return '[W zeszłą niedzielę o] LT';
	            case 3:
	                return '[W zeszłą środę o] LT';
	            case 6:
	                return '[W zeszłą sobotę o] LT';
	            default:
	                return '[W zeszły] dddd [o] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : "za %s",
	        past : "%s temu",
	        s : "kilka sekund",
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : "1 dzień",
	        dd : '%d dni',
	        M : "miesiąc",
	        MM : translate,
	        y : "rok",
	        yy : translate
	    },
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : portuguese (pt)
	// author : Jefferson : https://github.com/jalex79

	__webpack_require__(54).lang('pt', {
	    months : "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),
	    monthsShort : "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),
	    weekdays : "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),
	    weekdaysShort : "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
	    weekdaysMin : "Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD/MM/YYYY",
	        LL : "D \\de MMMM \\de YYYY",
	        LLL : "D \\de MMMM \\de YYYY LT",
	        LLLL : "dddd, D \\de MMMM \\de YYYY LT"
	    },
	    calendar : {
	        sameDay: '[Hoje às] LT',
	        nextDay: '[Amanhã às] LT',
	        nextWeek: 'dddd [às] LT',
	        lastDay: '[Ontem às] LT',
	        lastWeek: function () {
	            return (this.day() === 0 || this.day() === 6) ?
	                '[Último] dddd [às] LT' : // Saturday + Sunday
	                '[Última] dddd [às] LT'; // Monday - Friday
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : "em %s",
	        past : "%s atrás",
	        s : "segundos",
	        m : "um minuto",
	        mm : "%d minutos",
	        h : "uma hora",
	        hh : "%d horas",
	        d : "um dia",
	        dd : "%d dias",
	        M : "um mês",
	        MM : "%d meses",
	        y : "um ano",
	        yy : "%d anos"
	    },
	    ordinal : '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : brazilian portuguese (pt-br)
	// author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira

	__webpack_require__(54).lang('pt-br', {
	    months : "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),
	    monthsShort : "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),
	    weekdays : "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),
	    weekdaysShort : "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
	    weekdaysMin : "Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD/MM/YYYY",
	        LL : "D \\de MMMM \\de YYYY",
	        LLL : "D \\de MMMM \\de YYYY LT",
	        LLLL : "dddd, D \\de MMMM \\de YYYY LT"
	    },
	    calendar : {
	        sameDay: '[Hoje às] LT',
	        nextDay: '[Amanhã às] LT',
	        nextWeek: 'dddd [às] LT',
	        lastDay: '[Ontem às] LT',
	        lastWeek: function () {
	            return (this.day() === 0 || this.day() === 6) ?
	                '[Último] dddd [às] LT' : // Saturday + Sunday
	                '[Última] dddd [às] LT'; // Monday - Friday
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : "em %s",
	        past : "%s atrás",
	        s : "segundos",
	        m : "um minuto",
	        mm : "%d minutos",
	        h : "uma hora",
	        hh : "%d horas",
	        d : "um dia",
	        dd : "%d dias",
	        M : "um mês",
	        MM : "%d meses",
	        y : "um ano",
	        yy : "%d anos"
	    },
	    ordinal : '%dº'
	});


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : romanian (ro)
	// author : Vlad Gurdiga : https://github.com/gurdiga
	// author : Valentin Agachi : https://github.com/avaly

	__webpack_require__(54).lang('ro', {
	    months : "Ianuarie_Februarie_Martie_Aprilie_Mai_Iunie_Iulie_August_Septembrie_Octombrie_Noiembrie_Decembrie".split("_"),
	    monthsShort : "Ian_Feb_Mar_Apr_Mai_Iun_Iul_Aug_Sep_Oct_Noi_Dec".split("_"),
	    weekdays : "Duminică_Luni_Marţi_Miercuri_Joi_Vineri_Sâmbătă".split("_"),
	    weekdaysShort : "Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),
	    weekdaysMin : "Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),
	    longDateFormat : {
	        LT : "H:mm",
	        L : "DD/MM/YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY H:mm",
	        LLLL : "dddd, D MMMM YYYY H:mm"
	    },
	    calendar : {
	        sameDay: "[azi la] LT",
	        nextDay: '[mâine la] LT',
	        nextWeek: 'dddd [la] LT',
	        lastDay: '[ieri la] LT',
	        lastWeek: '[fosta] dddd [la] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : "peste %s",
	        past : "%s în urmă",
	        s : "câteva secunde",
	        m : "un minut",
	        mm : "%d minute",
	        h : "o oră",
	        hh : "%d ore",
	        d : "o zi",
	        dd : "%d zile",
	        M : "o lună",
	        MM : "%d luni",
	        y : "un an",
	        yy : "%d ani"
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : russian (ru)
	// author : Viktorminator : https://github.com/Viktorminator

	var pluralRules = [
	    function (n) { return ((n % 10 === 1) && (n % 100 !== 11)); },
	    function (n) { return ((n % 10) >= 2 && (n % 10) <= 4 && ((n % 10) % 1) === 0) && ((n % 100) < 12 || (n % 100) > 14); },
	    function (n) { return ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9 && ((n % 10) % 1) === 0) || ((n % 100) >= 11 && (n % 100) <= 14 && ((n % 100) % 1) === 0)); },
	    function (n) { return true; }
	];

	function plural(word, num) {
	    var forms = word.split('_'),
	    minCount = Math.min(pluralRules.length, forms.length),
	    i = -1;

	    while (++i < minCount) {
	        if (pluralRules[i](num)) {
	            return forms[i];
	        }
	    }
	    return forms[minCount - 1];
	}

	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    var format = {
	        'mm': 'минута_минуты_минут_минуты',
	        'hh': 'час_часа_часов_часа',
	        'dd': 'день_дня_дней_дня',
	        'MM': 'месяц_месяца_месяцев_месяца',
	        'yy': 'год_года_лет_года'
	    };
	    if (key === 'm') {
	        return withoutSuffix ? 'минута' : 'минуту';
	    }
	    else {
	        return number + ' ' + plural(format[key], +number);
	    }
	}

	function monthsCaseReplace(m, format) {
	    var months = {
	        'nominative': 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
	        'accusative': 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_')
	    },

	    nounCase = (/D[oD]? *MMMM?/).test(format) ?
	        'accusative' :
	        'nominative';

	    return months[nounCase][m.month()];
	}

	function weekdaysCaseReplace(m, format) {
	    var weekdays = {
	        'nominative': 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
	        'accusative': 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_')
	    },

	    nounCase = (/\[ ?[Вв] ?(?:прошлую|следующую)? ?\] ?dddd/).test(format) ?
	        'accusative' :
	        'nominative';

	    return weekdays[nounCase][m.day()];
	}

	__webpack_require__(54).lang('ru', {
	    months : monthsCaseReplace,
	    monthsShort : "янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),
	    weekdays : weekdaysCaseReplace,
	    weekdaysShort : "вск_пнд_втр_срд_чтв_птн_сбт".split("_"),
	    weekdaysMin : "вс_пн_вт_ср_чт_пт_сб".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD.MM.YYYY",
	        LL : "D MMMM YYYY г.",
	        LLL : "D MMMM YYYY г., LT",
	        LLLL : "dddd, D MMMM YYYY г., LT"
	    },
	    calendar : {
	        sameDay: '[Сегодня в] LT',
	        nextDay: '[Завтра в] LT',
	        lastDay: '[Вчера в] LT',
	        nextWeek: function () {
	            return this.day() === 2 ? '[Во] dddd [в] LT' : '[В] dddd [в] LT';
	        },
	        lastWeek: function () {
	            switch (this.day()) {
	            case 0:
	                return '[В прошлое] dddd [в] LT';
	            case 1:
	            case 2:
	            case 4:
	                return '[В прошлый] dddd [в] LT';
	            case 3:
	            case 5:
	            case 6:
	                return '[В прошлую] dddd [в] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    // It needs checking (adding) russian plurals and cases.
	    relativeTime : {
	        future : "через %s",
	        past : "%s назад",
	        s : "несколько секунд",
	        m : relativeTimeWithPlural,
	        mm : relativeTimeWithPlural,
	        h : "час",
	        hh : relativeTimeWithPlural,
	        d : "день",
	        dd : relativeTimeWithPlural,
	        M : "месяц",
	        MM : relativeTimeWithPlural,
	        y : "год",
	        yy : relativeTimeWithPlural
	    },
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : slovenian (sl)
	// author : Robert Sedovšek : https://github.com/sedovsek

	function translate(number, withoutSuffix, key) {
	    var result = number + " ";
	    switch (key) {
	    case 'm':
	        return withoutSuffix ? 'ena minuta' : 'eno minuto';
	    case 'mm':
	        if (number === 1) {
	            result += 'minuta';
	        } else if (number === 2) {
	            result += 'minuti';
	        } else if (number === 3 || number === 4) {
	            result += 'minute';
	        } else {
	            result += 'minut';
	        }
	        return result;
	    case 'h':
	        return withoutSuffix ? 'ena ura' : 'eno uro';
	    case 'hh':
	        if (number === 1) {
	            result += 'ura';
	        } else if (number === 2) {
	            result += 'uri';
	        } else if (number === 3 || number === 4) {
	            result += 'ure';
	        } else {
	            result += 'ur';
	        }
	        return result;
	    case 'dd':
	        if (number === 1) {
	            result += 'dan';
	        } else {
	            result += 'dni';
	        }
	        return result;
	    case 'MM':
	        if (number === 1) {
	            result += 'mesec';
	        } else if (number === 2) {
	            result += 'meseca';
	        } else if (number === 3 || number === 4) {
	            result += 'mesece';
	        } else {
	            result += 'mesecev';
	        }
	        return result;
	    case 'yy':
	        if (number === 1) {
	            result += 'leto';
	        } else if (number === 2) {
	            result += 'leti';
	        } else if (number === 3 || number === 4) {
	            result += 'leta';
	        } else {
	            result += 'let';
	        }
	        return result;
	    }
	}

	__webpack_require__(54).lang('sl', {
	    months : "januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),
	    monthsShort : "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),
	    weekdays : "nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),
	    weekdaysShort : "ned._pon._tor._sre._čet._pet._sob.".split("_"),
	    weekdaysMin : "ne_po_to_sr_če_pe_so".split("_"),
	    longDateFormat : {
	        LT : "H:mm",
	        L : "DD. MM. YYYY",
	        LL : "D. MMMM YYYY",
	        LLL : "D. MMMM YYYY LT",
	        LLLL : "dddd, D. MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay  : '[danes ob] LT',
	        nextDay  : '[jutri ob] LT',

	        nextWeek : function () {
	            switch (this.day()) {
	            case 0:
	                return '[v] [nedeljo] [ob] LT';
	            case 3:
	                return '[v] [sredo] [ob] LT';
	            case 6:
	                return '[v] [soboto] [ob] LT';
	            case 1:
	            case 2:
	            case 4:
	            case 5:
	                return '[v] dddd [ob] LT';
	            }
	        },
	        lastDay  : '[včeraj ob] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	            case 0:
	            case 3:
	            case 6:
	                return '[prejšnja] dddd [ob] LT';
	            case 1:
	            case 2:
	            case 4:
	            case 5:
	                return '[prejšnji] dddd [ob] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "čez %s",
	        past   : "%s nazaj",
	        s      : "nekaj sekund",
	        m      : translate,
	        mm     : translate,
	        h      : translate,
	        hh     : translate,
	        d      : "en dan",
	        dd     : translate,
	        M      : "en mesec",
	        MM     : translate,
	        y      : "eno leto",
	        yy     : translate
	    },
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : swedish (sv)
	// author : Jens Alm : https://github.com/ulmus

	__webpack_require__(54).lang('sv', {
	    months : "januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),
	    monthsShort : "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
	    weekdays : "söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),
	    weekdaysShort : "sön_mån_tis_ons_tor_fre_lör".split("_"),
	    weekdaysMin : "sö_må_ti_on_to_fr_lö".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "YYYY-MM-DD",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay: '[Idag klockan] LT',
	        nextDay: '[Imorgon klockan] LT',
	        lastDay: '[Igår klockan] LT',
	        nextWeek: 'dddd [klockan] LT',
	        lastWeek: '[Förra] dddd[en klockan] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : "om %s",
	        past : "för %s sedan",
	        s : "några sekunder",
	        m : "en minut",
	        mm : "%d minuter",
	        h : "en timme",
	        hh : "%d timmar",
	        d : "en dag",
	        dd : "%d dagar",
	        M : "en månad",
	        MM : "%d månader",
	        y : "ett år",
	        yy : "%d år"
	    },
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~ (number % 100 / 10) === 1) ? 'e' :
	            (b === 1) ? 'a' :
	            (b === 2) ? 'a' :
	            (b === 3) ? 'e' : 'e';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : thai (th)
	// author : Kridsada Thanabulpong : https://github.com/sirn

	__webpack_require__(54).lang('th', {
	    months : "มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),
	    monthsShort : "มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา".split("_"),
	    weekdays : "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),
	    weekdaysShort : "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"), // yes, three characters difference
	    weekdaysMin : "อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),
	    longDateFormat : {
	        LT : "H นาฬิกา m นาที",
	        L : "YYYY/MM/DD",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY เวลา LT",
	        LLLL : "วันddddที่ D MMMM YYYY เวลา LT"
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return "ก่อนเที่ยง";
	        } else {
	            return "หลังเที่ยง";
	        }
	    },
	    calendar : {
	        sameDay : '[วันนี้ เวลา] LT',
	        nextDay : '[พรุ่งนี้ เวลา] LT',
	        nextWeek : 'dddd[หน้า เวลา] LT',
	        lastDay : '[เมื่อวานนี้ เวลา] LT',
	        lastWeek : '[วัน]dddd[ที่แล้ว เวลา] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "อีก %s",
	        past : "%sที่แล้ว",
	        s : "ไม่กี่วินาที",
	        m : "1 นาที",
	        mm : "%d นาที",
	        h : "1 ชั่วโมง",
	        hh : "%d ชั่วโมง",
	        d : "1 วัน",
	        dd : "%d วัน",
	        M : "1 เดือน",
	        MM : "%d เดือน",
	        y : "1 ปี",
	        yy : "%d ปี"
	    }
	});


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : turkish (tr)
	// authors : Erhan Gundogan : https://github.com/erhangundogan,
	//           Burak Yiğit Kaya: https://github.com/BYK

	var suffixes = {
	    1: "'inci",
	    5: "'inci",
	    8: "'inci",
	    70: "'inci",
	    80: "'inci",

	    2: "'nci",
	    7: "'nci",
	    20: "'nci",
	    50: "'nci",

	    3: "'üncü",
	    4: "'üncü",
	    100: "'üncü",

	    6: "'ncı",

	    9: "'uncu",
	    10: "'uncu",
	    30: "'uncu",

	    60: "'ıncı",
	    90: "'ıncı"
	};

	__webpack_require__(54).lang('tr', {
	    months : "Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),
	    monthsShort : "Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),
	    weekdays : "Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),
	    weekdaysShort : "Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),
	    weekdaysMin : "Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD.MM.YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd, D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay : '[bugün saat] LT',
	        nextDay : '[yarın saat] LT',
	        nextWeek : '[haftaya] dddd [saat] LT',
	        lastDay : '[dün] LT',
	        lastWeek : '[geçen hafta] dddd [saat] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "%s sonra",
	        past : "%s önce",
	        s : "birkaç saniye",
	        m : "bir dakika",
	        mm : "%d dakika",
	        h : "bir saat",
	        hh : "%d saat",
	        d : "bir gün",
	        dd : "%d gün",
	        M : "bir ay",
	        MM : "%d ay",
	        y : "bir yıl",
	        yy : "%d yıl"
	    },
	    ordinal : function (number) {
	        if (number === 0) {  // special case for zero
	            return number + "'ıncı";
	        }
	        var a = number % 10,
	            b = number % 100 - a,
	            c = number >= 100 ? 100 : null;

	        return number + (suffixes[a] || suffixes[b] || suffixes[c]);
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : Morocco Central Atlas Tamaziɣt (tzm)
	// author : Abdel Said : https://github.com/abdelsaid

	__webpack_require__(54).lang('tzm', {
	    months : "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),
	    monthsShort : "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),
	    weekdays : "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
	    weekdaysShort : "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
	    weekdaysMin : "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD/MM/YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay: "[ⴰⵙⴷⵅ ⴴ] LT",
	        nextDay: '[ⴰⵙⴽⴰ ⴴ] LT',
	        nextWeek: 'dddd [ⴴ] LT',
	        lastDay: '[ⴰⵚⴰⵏⵜ ⴴ] LT',
	        lastWeek: 'dddd [ⴴ] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : "ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",
	        past : "ⵢⴰⵏ %s",
	        s : "ⵉⵎⵉⴽ",
	        m : "ⵎⵉⵏⵓⴺ",
	        mm : "%d ⵎⵉⵏⵓⴺ",
	        h : "ⵙⴰⵄⴰ",
	        hh : "%d ⵜⴰⵙⵙⴰⵄⵉⵏ",
	        d : "ⴰⵙⵙ",
	        dd : "%d oⵙⵙⴰⵏ",
	        M : "ⴰⵢoⵓⵔ",
	        MM : "%d ⵉⵢⵢⵉⵔⵏ",
	        y : "ⴰⵙⴳⴰⵙ",
	        yy : "%d ⵉⵙⴳⴰⵙⵏ"
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : Morocco Central Atlas Tamaziɣt in Latin (tzm-la)
	// author : Abdel Said : https://github.com/abdelsaid

	__webpack_require__(54).lang('tzm-la', {
	    months : "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),
	    monthsShort : "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),
	    weekdays : "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
	    weekdaysShort : "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
	    weekdaysMin : "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD/MM/YYYY",
	        LL : "D MMMM YYYY",
	        LLL : "D MMMM YYYY LT",
	        LLLL : "dddd D MMMM YYYY LT"
	    },
	    calendar : {
	        sameDay: "[asdkh g] LT",
	        nextDay: '[aska g] LT',
	        nextWeek: 'dddd [g] LT',
	        lastDay: '[assant g] LT',
	        lastWeek: 'dddd [g] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : "dadkh s yan %s",
	        past : "yan %s",
	        s : "imik",
	        m : "minuḍ",
	        mm : "%d minuḍ",
	        h : "saɛa",
	        hh : "%d tassaɛin",
	        d : "ass",
	        dd : "%d ossan",
	        M : "ayowr",
	        MM : "%d iyyirn",
	        y : "asgas",
	        yy : "%d isgasn"
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : ukrainian (uk)
	// author : zemlanin : https://github.com/zemlanin
	var pluralRules = [
	    function (n) { return ((n % 10 === 1) && (n % 100 !== 11)); },
	    function (n) { return ((n % 10) >= 2 && (n % 10) <= 4 && ((n % 10) % 1) === 0) && ((n % 100) < 12 || (n % 100) > 14); },
	    function (n) { return ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9 && ((n % 10) % 1) === 0) || ((n % 100) >= 11 && (n % 100) <= 14 && ((n % 100) % 1) === 0)); },
	    function (n) { return true; }
	];

	function plural(word, num) {
	    var forms = word.split('_'),
	    minCount = Math.min(pluralRules.length, forms.length),
	    i = -1;

	    while (++i < minCount) {
	        if (pluralRules[i](num)) {
	            return forms[i];
	        }
	    }
	    return forms[minCount - 1];
	}

	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    var format = {
	        'mm': 'хвилина_хвилини_хвилин_хвилини',
	        'hh': 'година_години_годин_години',
	        'dd': 'день_дня_днів_дня',
	        'MM': 'місяць_місяця_місяців_місяця',
	        'yy': 'рік_року_років_року'
	    };
	    if (key === 'm') {
	        return withoutSuffix ? 'хвилина' : 'хвилину';
	    }
	    else {
	        return number + ' ' + plural(format[key], +number);
	    }
	}

	function monthsCaseReplace(m, format) {
	    var months = {
	        'nominative': 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_'),
	        'accusative': 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_')
	    },

	    nounCase = (/D[oD]? *MMMM?/).test(format) ?
	        'accusative' :
	        'nominative';

	    return months[nounCase][m.month()];
	}

	function weekdaysCaseReplace(m, format) {
	    var weekdays = {
	        'nominative': 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
	        'accusative': 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_')
	    },

	    nounCase = (/\[ ?[Вв] ?(?:попередню|наступну)? ?\] ?dddd/).test(format) ?
	        'accusative' :
	        'nominative';

	    return weekdays[nounCase][m.day()];
	}

	__webpack_require__(54).lang('uk', {
	    months : monthsCaseReplace,
	    monthsShort : "січ_лют_бер_кві_тра_чер_лип_сер_вер_жов_лис_гру".split("_"),
	    weekdays : weekdaysCaseReplace,
	    weekdaysShort : "нед_пон_вів_срд_чет_птн_суб".split("_"),
	    weekdaysMin : "нд_пн_вт_ср_чт_пт_сб".split("_"),
	    longDateFormat : {
	        LT : "HH:mm",
	        L : "DD.MM.YYYY",
	        LL : "D MMMM YYYY г.",
	        LLL : "D MMMM YYYY г., LT",
	        LLLL : "dddd, D MMMM YYYY г., LT"
	    },
	    calendar : {
	        sameDay: '[Сьогодні в] LT',
	        nextDay: '[Завтра в] LT',
	        lastDay: '[Вчора в] LT',
	        nextWeek: function () {
	            return this.day() === 2 ? '[У] dddd [в] LT' : '[В] dddd [в] LT';
	        },
	        lastWeek: function () {
	            switch (this.day()) {
	            case 0:
	            case 3:
	            case 5:
	            case 6:
	                return '[В минулу] dddd [в] LT';
	            case 1:
	            case 2:
	            case 4:
	                return '[В минулий] dddd [в] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    // It needs checking (adding) ukrainan plurals and cases.
	    relativeTime : {
	        future : "через %s",
	        past : "%s тому",
	        s : "декілька секунд",
	        m : relativeTimeWithPlural,
	        mm : relativeTimeWithPlural,
	        h : "годину",
	        hh : relativeTimeWithPlural,
	        d : "день",
	        dd : relativeTimeWithPlural,
	        M : "місяць",
	        MM : relativeTimeWithPlural,
	        y : "рік",
	        yy : relativeTimeWithPlural
	    },
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : chinese
	// author : suupic : https://github.com/suupic

	__webpack_require__(54).lang('zh-cn', {
	    months : "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
	    monthsShort : "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
	    weekdays : "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
	    weekdaysShort : "周日_周一_周二_周三_周四_周五_周六".split("_"),
	    weekdaysMin : "日_一_二_三_四_五_六".split("_"),
	    longDateFormat : {
	        LT : "Ah点mm",
	        L : "YYYY年MMMD日",
	        LL : "YYYY年MMMD日",
	        LLL : "YYYY年MMMD日LT",
	        LLLL : "YYYY年MMMD日ddddLT",
	        l : "YYYY年MMMD日",
	        ll : "YYYY年MMMD日",
	        lll : "YYYY年MMMD日LT",
	        llll : "YYYY年MMMD日ddddLT"
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 9) {
	            return "早上";
	        } else if (hour < 11 && minute < 30) {
	            return "上午";
	        } else if (hour < 13 && minute < 30) {
	            return "中午";
	        } else if (hour < 18) {
	            return "下午";
	        } else {
	            return "晚上";
	        }
	    },
	    calendar : {
	        sameDay : '[今天]LT',
	        nextDay : '[明天]LT',
	        nextWeek : '[下]ddddLT',
	        lastDay : '[昨天]LT',
	        lastWeek : '[上]ddddLT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "%s内",
	        past : "%s前",
	        s : "几秒",
	        m : "1分钟",
	        mm : "%d分钟",
	        h : "1小时",
	        hh : "%d小时",
	        d : "1天",
	        dd : "%d天",
	        M : "1个月",
	        MM : "%d个月",
	        y : "1年",
	        yy : "%d年"
	    }
	});


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	// moment.js language configuration
	// language : traditional chinese (zh-tw)
	// author : Ben : https://github.com/ben-lin

	__webpack_require__(54).lang('zh-tw', {
	    months : "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
	    monthsShort : "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
	    weekdays : "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
	    weekdaysShort : "週日_週一_週二_週三_週四_週五_週六".split("_"),
	    weekdaysMin : "日_一_二_三_四_五_六".split("_"),
	    longDateFormat : {
	        LT : "Ah點mm",
	        L : "YYYY年MMMD日",
	        LL : "YYYY年MMMD日",
	        LLL : "YYYY年MMMD日LT",
	        LLLL : "YYYY年MMMD日ddddLT",
	        l : "YYYY年MMMD日",
	        ll : "YYYY年MMMD日",
	        lll : "YYYY年MMMD日LT",
	        llll : "YYYY年MMMD日ddddLT"
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 9) {
	            return "早上";
	        } else if (hour < 11 && minute < 30) {
	            return "上午";
	        } else if (hour < 13 && minute < 30) {
	            return "中午";
	        } else if (hour < 18) {
	            return "下午";
	        } else {
	            return "晚上";
	        }
	    },
	    calendar : {
	        sameDay : '[今天]LT',
	        nextDay : '[明天]LT',
	        nextWeek : '[下]ddddLT',
	        lastDay : '[昨天]LT',
	        lastWeek : '[上]ddddLT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "%s內",
	        past : "%s前",
	        s : "幾秒",
	        m : "一分鐘",
	        mm : "%d分鐘",
	        h : "一小時",
	        hh : "%d小時",
	        d : "一天",
	        dd : "%d天",
	        M : "一個月",
	        MM : "%d個月",
	        y : "一年",
	        yy : "%d年"
	    }
	});


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * StringBuilder.utils.args
	 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */
	var XRegExp = __webpack_require__(25).XRegExp
	  , formatter = __webpack_require__(52);

	/**
	 * XRegExp for formats
	 *
	 */
	var regexLib = {
		format: '{(?<arg>\\d+)(:(?<format>[^{}]+))?}'
	};

	/**
	 * Expose functionality
	 */
	exports.replace = replace;
	exports.hasArgs = hasArgs;


	/**
	 * Define if the `str` contains formats
	 *
	 * @param  {String}  srt
	 * @return {Boolean}
	 */
	function hasArgs(srt) {
		var r = new XRegExp(regexLib.format, 'g');

		return r.test( srt );
	}

	/**
	 * Replace `args` into `str`
	 *
	 * @param {String} str
	 * @param {Array} args
	 */
	function replace(str, args) {
		//return str;

		var tokens = getTokens(str, args)
			result = []
			index = 0;

		// asume that tokens is sortered by index
		tokens.forEach(function(item){
			result.push(str.substring(index, item.index));

			if (item.format !== undefined) {
				result.push(formatter.format(item.format, item.value));
			} else {
				result.push(item.value);
			}

			index = item.index + item.arg.length;
		});

		if (index < str.length) {
			result.push(str.substring(index));
		}

		return result
				.join('')
				.replace(/{{/g, '{')  // clean {{
				.replace(/}}/g, '}'); // clean }}
	}

	/**
	 * Extract the arguments from the `srt`
	 *
	 * @param  {String} str
	 * @param  {Array} args
	 * @return {Array}
	 */
	function getTokens(str, args) {
		var res = []
		  , r = new XRegExp(regexLib.format, 'g');

		XRegExp.forEach(str, r, function(match){
			if (true === isReallyAnArg(str, match)) {
				res.push({
					  index: match.index
					, arg: match[0]
					, format: match.format
					, value: args[match.arg]
				});
			}
		});

		return res;
	}

	/**
	 * Define if the `match` is really and argument from `str`
	 *
	 * NOTE: This functions can be replaced for an regex lookbeighn implementarion
	 *
	 * @param  {String}  str
	 * @param  {Object}  match
	 * @return {Boolean}
	 */
	function isReallyAnArg(str, match) {
		var im = true
		  , value = match[0];

		if (match.index > 0) {
			im = str[match.index-1] !== '{';
		}

		if (!im) {
			return false;
		}

		if ( (match.index+value.length) < str.length ) {
			im = str[match.index+value.length+1] !== '}';
		}

		return im;
	}


/***/ },
/* 100 */
/***/ function(module, exports) {

	/*!
	 * StringBuilder.utils.convert
	 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
	 * MIT Licensed
	 */

	/**
	 * Expose functionality
	 */
	exports.toTitleCase = toTitleCase;
	exports.toCamelCase = toTitleCase;
	exports.toJsonCase = toJsonCase;


	/**
	 * Return the `str` to title case
	 * Example:
	 *  'foo bar' => FooBar
	 *  'foo_bar' => FooBar
	 *  
	 * @param  {String} str
	 * @param  {Boolean} clean remove spaces or _ default as true
	 * @return {String}    
	 */
	function toTitleCase(str, clean) {
		clean = clean || true;

		var res = str.toLowerCase().replace(/(?:^|\s|_)\w/g, function(match) {
	        return match.toUpperCase();
	    });

		if (true === clean){
			return res.replace(/(\s|_)+/g, '');
		}

		return res;
	}

	/**
	 * Return the `str` to json case
	 * Example:
	 *  'foo bar' => fooBar
	 *  'foo_bar' => fooBar
	 * 
	 * @param  {String} str
	 * @param  {Boolean} clean remove spaces or _ default as true
	 * @return {String}    
	 */
	function toJsonCase(str, clean) {
		var titleCase = toTitleCase(str, clean);

		return titleCase.substring(0, 1).toLowerCase() + titleCase.substring(1);
	}


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * StringBuilder.Append
	 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
	 * MIT Licensed
	 */

	 /**
	 * Module dependencies.
	 */
	var XRegExp = __webpack_require__(25).XRegExp;

	/**
	 * XRegExp for formats
	 */
	var regexLib = {
		format: '{(?<arg>\\d+)(:(?<format>[^{}]+))?}'
	};

	/**
	 * Initialize a new Append with `args`
	 * 
	 *
	 * @param {Object} args
	 */
	var Append = module.exports = function Append(args) {
		var self = this;

		//console.log(args);

		args = args || arguments;
		
		self.format = args[0];
		self.values = [];

		//console.log(self.format);

		for (var i = 1; i < args.length; i++) {
			self.values[i-1] = args[i]
		};

		//console.log(self.values);

		return self;
	}

	Append.prototype.constructor = Append;


/***/ },
/* 102 */
/***/ function(module, exports) {

	/*!
	 * StringBuilder.Insert
	 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
	 * MIT Licensed
	 */

	 /**
	 * Initialize a new Insert instruction
	 * 
	 *
	 * @param {Object} options
	 */
	var Insert = module.exports = function Insert(value, position) {
		var self = this;

		self.value = value || '';
		self.position = position || 0;
		
		return self;
	}

	Insert.prototype.constructor = Insert;

	/**
	 * Build this Insert
	 *
	 * @param {Function} fn
	 */
	Insert.prototype.build = function(str, fn){
		var self = this;

		var result = [str.slice(0, self.position), self.value, str.slice(self.position)].join('')
		
		fn && fn(null, result);

		return self;
	};

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * StringBuilder.Replace
	 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
	 * MIT Licensed
	 */

	var XRegExp = __webpack_require__(25).XRegExp;

	/**
	 * Initialize a new Replace instruction
	 * 
	 * @param {Object} searchvalue
	 * @param {Object} newvalue
	 */
	var Replace = module.exports = function Replace(searchvalue, newvalue) {
		var self = this;

		self.searchvalue = searchvalue || '';
		self.args = newvalue || '';
		
		return self;
	}

	Replace.prototype.constructor = Replace;

	/**
	 * Build this Replace
	 *
	 * @param {Function} fn
	 */
	Replace.prototype.build = function(str, fn){
		var self = this;

		var result = str.replace(self.searchvalue, self.args);
		
		fn && fn(null, result);

		return self;
	};

/***/ },
/* 104 */
/***/ function(module, exports) {

	module.exports = {
		"Stability": 2,
		"_args": [
			[
				"stringbuilder",
				"/Users/csehydrogen/Desktop/CG/CG2016HW/hw3"
			]
		],
		"_from": "stringbuilder@latest",
		"_id": "stringbuilder@0.0.11",
		"_inCache": true,
		"_installable": true,
		"_location": "/stringbuilder",
		"_nodeVersion": "0.12.7",
		"_npmUser": {
			"email": "dcardev@gmail.com",
			"name": "delmosaurio"
		},
		"_npmVersion": "2.14.0",
		"_phantomChildren": {},
		"_requested": {
			"name": "stringbuilder",
			"raw": "stringbuilder",
			"rawSpec": "",
			"scope": null,
			"spec": "latest",
			"type": "tag"
		},
		"_requiredBy": [
			"/"
		],
		"_resolved": "https://registry.npmjs.org/stringbuilder/-/stringbuilder-0.0.11.tgz",
		"_shasum": "747f74de7d64b929e2e75bb85a98ee6bc3be3b0e",
		"_shrinkwrap": null,
		"_spec": "stringbuilder",
		"_where": "/Users/csehydrogen/Desktop/CG/CG2016HW/hw3",
		"author": {
			"email": "delmosaurio@gmail.com",
			"name": "Delmo Carrozzo"
		},
		"bugs": {
			"url": "https://github.com/delmosaurio/stringbuilder/issues"
		},
		"contributors": [
			{
				"email": "delmosaurio@gmail.com",
				"name": "Delmo"
			},
			{
				"email": "svstanev@gmail.com",
				"name": "Svetoslav Stanev"
			}
		],
		"dependencies": {
			"async": "~0.2.7",
			"moment": "~2.0.0",
			"numeral": "~1.4.8",
			"xregexp": "~2.0.0"
		},
		"description": "An String Builder for Node.js",
		"devDependencies": {
			"chai": "^3.2.0",
			"mocha": "^2.3.0"
		},
		"directories": {},
		"dist": {
			"shasum": "747f74de7d64b929e2e75bb85a98ee6bc3be3b0e",
			"tarball": "https://registry.npmjs.org/stringbuilder/-/stringbuilder-0.0.11.tgz"
		},
		"gitHead": "2de2b4e533332cfcea5991b9d69a446f1b78132a",
		"homepage": "https://github.com/delmosaurio/stringbuilder#readme",
		"keywords": [
			"string builder",
			"string",
			"builder",
			"regex",
			"format",
			"string format"
		],
		"license": "MIT",
		"main": "index.js",
		"maintainers": [
			{
				"email": "delmosaurio@gmail.com",
				"name": "delmosaurio"
			}
		],
		"name": "stringbuilder",
		"optionalDependencies": {},
		"readme": "ERROR: No README data found!",
		"repository": {
			"type": "git",
			"url": "git+https://github.com/delmosaurio/stringbuilder.git"
		},
		"scripts": {
			"test": "make test"
		},
		"version": "0.0.11"
	};

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _glMatrix = __webpack_require__(12);

	var eps = 1e-2;

	// p: vec3 array of len 3, points
	// n: vec3 array of len 3, normals
	// c: vec4 array of len 3, color
	// k: vec4 array of len 3, shading parameters
	// ax+b represent plane including triangle
	var Triangle = function Triangle(p, n, c, k) {
	  var i, t;
	  this.p = p;
	  this.n = n;
	  this.c = c;
	  this.k = k;
	  this.a = _glMatrix.vec3.create();
	  t = _glMatrix.vec3.create();
	  _glMatrix.vec3.sub(this.a, p[1], p[0]);
	  _glMatrix.vec3.sub(t, p[2], p[0]);
	  _glMatrix.vec3.cross(this.a, this.a, t);
	  _glMatrix.vec3.normalize(this.a, this.a);
	  this.b = -_glMatrix.vec3.dot(this.a, this.p[0]);
	};

	Triangle.prototype.area = function () {
	  var a = _glMatrix.vec3.create(),
	      b = _glMatrix.vec3.create();
	  _glMatrix.vec3.sub(a, this.p[1], this.p[0]);
	  _glMatrix.vec3.sub(b, this.p[2], this.p[0]);
	  _glMatrix.vec3.cross(a, a, b);
	  return _glMatrix.vec3.len(a) / 2;
	};

	// return ax+b for given vec3 x
	Triangle.prototype.plane = function (x) {
	  return _glMatrix.vec3.dot(this.a, x) + this.b;
	};

	// this as plane, return weight of intersection point in line p0 - p1
	Triangle.prototype.intersect = function (p0, p1) {
	  var dp = _glMatrix.vec3.create();
	  return -(_glMatrix.vec3.dot(this.a, p0) + this.b) / _glMatrix.vec3.dot(_glMatrix.vec3.sub(dp, p1, p0), this.a);
	};

	// given triangle that as plane, divide this into triangles, and push to l, m, and r
	Triangle.prototype.divide = function (that, l, m, r) {
	  var s, cNeg, cZero, cPos, i, t;
	  var p, n, c, k, ofs, ts;

	  s = [];
	  cNeg = cZero = cPos = 0;
	  for (i = 0; i < 3; ++i) {
	    t = that.plane(this.p[i]);
	    if (t < -eps) {
	      s.push(-1);
	      ++cNeg;
	    } else if (t > eps) {
	      s.push(1);
	      ++cPos;
	    } else {
	      s.push(0);
	      ++cZero;
	    }
	  }

	  if (cZero == 3) {
	    m.push(this);
	  } else if (cPos == 0) {
	    l.push(this);
	  } else if (cNeg == 0) {
	    r.push(this);
	  } else if (cZero == 1) {
	    for (i = 0; i < 3; ++i) {
	      if (s[i] == 0) {
	        ofs = i;
	        break;
	      }
	    }
	    p = [];n = [];c = [];k = [];
	    for (i = 0; i < 3; ++i) {
	      p.push(this.p[(ofs + i) % 3]);
	      n.push(this.n[(ofs + i) % 3]);
	      c.push(this.c[(ofs + i) % 3]);
	      k.push(this.k[(ofs + i) % 3]);
	    }
	    t = that.intersect(p[1], p[2]);
	    p.push(_glMatrix.vec3.create());
	    _glMatrix.vec3.lerp(p[3], p[1], p[2], t);
	    n.push(_glMatrix.vec3.create());
	    _glMatrix.vec3.lerp(n[3], n[1], n[2], t);
	    _glMatrix.vec3.normalize(n[3], n[3]);
	    c.push(_glMatrix.vec4.create());
	    _glMatrix.vec4.lerp(c[3], c[1], c[2], t);
	    k.push(_glMatrix.vec4.create());
	    _glMatrix.vec4.lerp(k[3], k[1], k[2], t);
	    ts = [];
	    ts.push(new Triangle([p[0], p[1], p[3]], [n[0], n[1], n[3]], [c[0], c[1], c[3]], [k[0], k[1], k[3]]));
	    ts.push(new Triangle([p[0], p[3], p[2]], [n[0], n[3], n[2]], [c[0], c[3], c[2]], [k[0], k[3], k[2]]));
	    if (s[(ofs + 1) % 3] < 0) {
	      l.push(ts[0]);
	      r.push(ts[1]);
	    } else {
	      r.push(ts[0]);
	      l.push(ts[1]);
	    }
	  } else {
	    for (i = 0; i < 3; ++i) {
	      if (s[(i + 1) % 3] * s[(i + 2) % 3] > 0) {
	        ofs = i;
	        break;
	      }
	    }
	    p = [];n = [];c = [];k = [];
	    for (i = 0; i < 3; ++i) {
	      p.push(this.p[(ofs + i) % 3]);
	      n.push(this.n[(ofs + i) % 3]);
	      c.push(this.c[(ofs + i) % 3]);
	      k.push(this.k[(ofs + i) % 3]);
	    }
	    t = that.intersect(p[0], p[1]);
	    p.push(_glMatrix.vec3.create());
	    _glMatrix.vec3.lerp(p[3], p[0], p[1], t);
	    n.push(_glMatrix.vec3.create());
	    _glMatrix.vec3.lerp(n[3], n[0], n[1], t);
	    _glMatrix.vec3.normalize(n[3], n[3]);
	    c.push(_glMatrix.vec4.create());
	    _glMatrix.vec4.lerp(c[3], c[0], c[1], t);
	    k.push(_glMatrix.vec4.create());
	    _glMatrix.vec4.lerp(k[3], k[0], k[1], t);
	    t = that.intersect(p[0], p[2]);
	    p.push(_glMatrix.vec3.create());
	    _glMatrix.vec3.lerp(p[4], p[0], p[2], t);
	    n.push(_glMatrix.vec3.create());
	    _glMatrix.vec3.lerp(n[4], n[0], n[2], t);
	    _glMatrix.vec3.normalize(n[4], n[4]);
	    c.push(_glMatrix.vec4.create());
	    _glMatrix.vec4.lerp(c[4], c[0], c[2], t);
	    k.push(_glMatrix.vec4.create());
	    _glMatrix.vec4.lerp(k[4], k[0], k[2], t);
	    ts = [];
	    ts.push(new Triangle([p[0], p[3], p[4]], [n[0], n[3], n[4]], [c[0], c[3], c[4]], [k[0], k[3], k[4]]));
	    ts.push(new Triangle([p[1], p[2], p[3]], [n[1], n[2], n[3]], [c[1], c[2], c[3]], [k[1], k[2], k[3]]));
	    ts.push(new Triangle([p[2], p[4], p[3]], [n[2], n[4], n[3]], [c[2], c[4], c[3]], [k[2], k[4], k[3]]));
	    if (s[ofs] < 0) {
	      l.push(ts[0]);
	      r.push(ts[1]);
	      r.push(ts[2]);
	    } else {
	      r.push(ts[0]);
	      l.push(ts[1]);
	      l.push(ts[2]);
	    }
	  }
	};

	var BSPTree = function BSPTree(ts) {
	  var i, j, l, m, r, n, ts0, area, maxArea;

	  ts0 = [];
	  maxArea = Number.MIN_VALUE;
	  for (j = 0; j < ts.length; ++j) {
	    if (_glMatrix.vec3.len(ts[j].a) < eps) continue;
	    area = ts[j].area();
	    if (maxArea < area) {
	      maxArea = area;
	      i = ts0.length;
	    }
	    ts0.push(ts[j]);
	  }
	  ts = ts0;

	  l = [];m = [ts[i]];r = [];
	  for (j = 0; j < ts.length; ++j) {
	    if (i == j) continue;
	    ts[j].divide(ts[i], l, m, r);
	  }
	  this.m = m;
	  this.l = this.r = null;
	  if (l.length > 0) {
	    this.l = new BSPTree(l);
	  }
	  if (r.length > 0) {
	    this.r = new BSPTree(r);
	  }
	};

	BSPTree.prototype.depthOrder = function (v) {
	  var ts = [];
	  this.traversal(v, ts);
	  return ts;
	};

	BSPTree.prototype.traversal = function (v, ts) {
	  var l, r;
	  if (this.m[0].plane(v) > 0) {
	    l = this.l;
	    r = this.r;
	  } else {
	    l = this.r;
	    r = this.l;
	  }
	  if (l != null) {
	    l.traversal(v, ts);
	  }
	  Array.prototype.push.apply(ts, this.m);
	  if (r != null) {
	    r.traversal(v, ts);
	  }
	};

	exports.Triangle = Triangle;
	exports.BSPTree = BSPTree;

/***/ }
/******/ ]);