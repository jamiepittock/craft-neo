/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Configurator = __webpack_require__(1);
	
	var _Configurator2 = _interopRequireDefault(_Configurator);
	
	var _Input = __webpack_require__(23);
	
	var _Input2 = _interopRequireDefault(_Input);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	window.Neo = {
		Configurator: _Configurator2.default,
		Input: _Input2.default
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	__webpack_require__(3);
	
	var _garnish = __webpack_require__(4);
	
	var _garnish2 = _interopRequireDefault(_garnish);
	
	var _craft = __webpack_require__(5);
	
	var _craft2 = _interopRequireDefault(_craft);
	
	var _BlockType = __webpack_require__(6);
	
	var _BlockType2 = _interopRequireDefault(_BlockType);
	
	var _configurator = __webpack_require__(18);
	
	var _configurator2 = _interopRequireDefault(_configurator);
	
	__webpack_require__(14);
	
	__webpack_require__(19);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _garnish2.default.Base.extend({
	
		_defaults: {
			namespace: '',
			blockTypes: []
		},
	
		_blockTypes: [],
	
		init: function init() {
			var _this = this;
	
			var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
			settings = Object.assign({}, this._defaults, settings);
	
			// Setup <input> field information
			this.inputNamePrefix = settings.namespace;
			this.inputIdPrefix = _craft2.default.formatInputId(this.inputNamePrefix);
	
			// Initialise the configurator template
			this.$field = (0, _jquery2.default)('#' + this.inputIdPrefix + '-neo-configurator');
			this.$inputContainer = this.$field.children('.field').children('.input');
			this.$inputContainer.html((0, _configurator2.default)());
	
			this.$container = this.$field.find('.input').first();
	
			this.$blockTypesContainer = this.$container.children('.block-types').children();
			this.$fieldLayoutContainer = this.$container.children('.field-layout').children();
	
			var $blockTypeItemsContainer = this.$blockTypesContainer.children('.items');
			this.$itemsContainer = $blockTypeItemsContainer.children('.blocktypes');
			this.$addItemButton = $blockTypeItemsContainer.children('.btn.add');
	
			this.$fieldsContainer = this.$fieldLayoutContainer.children('.items');
	
			this._blockTypeSort = new _garnish2.default.DragSort(null, {
				handle: '[data-neo="button.move"]',
				axis: 'y',
				magnetStrength: 4,
				helperLagBase: 1.5,
				onSortChange: function onSortChange() {
					return _this._updateBlockTypeOrder();
				}
			});
	
			this._setContainerHeight();
	
			this.addListener(this.$blockTypesContainer, 'resize', '@setContainerHeight');
			this.addListener(this.$fieldLayoutContainer, 'resize', '@setContainerHeight');
			this.addListener(this.$addItemButton, 'click', '@newBlockType');
		},
		addBlockType: function addBlockType(blockType) {
			var index = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];
	
			if (index >= 0 && index < this._blockTypes.length) {
				this._blockTypes = this._blockTypes.splice(index, 0, blockType);
				blockType.$container.insertAt(index, this.$itemsContainer);
			} else {
				this._blockTypes.push(blockType);
				this.$itemsContainer.append(blockType.$container);
			}
	
			this._blockTypeSort.addItems(blockType.$container);
	
			this.$fieldsContainer.append(blockType.getFieldLayout().$container);
			this.$fieldLayoutContainer.removeClass('hidden');
	
			this.trigger('addBlockType', {
				blockType: blockType,
				index: index
			});
	
			this._setContainerHeight();
		},
		removeBlockType: function removeBlockType(blockType) {
			this._blockTypes = this._blockTypes.filter(function (b) {
				return b !== blockType;
			});
	
			this._blockTypeSort.removeItems(blockType.$container);
	
			blockType.$container.remove();
			blockType.getFieldLayout().$container.remove();
	
			if (this._blockTypes.length === 0) {
				this.$fieldLayoutContainer.addClass('hidden');
			}
	
			this.trigger('removeBlockType', {
				blockType: blockType
			});
	
			this._setContainerHeight();
		},
		getBlockTypes: function getBlockTypes() {
			return Array.from(this._blockTypes);
		},
		getBlockTypeByElement: function getBlockTypeByElement($element) {
			return this._blockTypes.find(function (blockType) {
				return blockType.$container.is($element);
			});
		},
		_updateBlockTypeOrder: function _updateBlockTypeOrder() {
			var _this2 = this;
	
			var blockTypes = [];
	
			this._blockTypeSort.$items.each(function (index, element) {
				var blockType = _this2.getBlockTypeByElement(element);
				blockTypes.push(blockType);
			});
	
			this._blockTypes = blockTypes;
		},
		_setContainerHeight: function _setContainerHeight() {
			var maxColHeight = Math.max(400, this.$blockTypesContainer.height(), this.$fieldLayoutContainer.height());
	
			this.$container.height(maxColHeight);
		},
		'@newBlockType': function newBlockType() {
			var _this3 = this;
	
			var blockType = new _BlockType2.default();
			var settingsModal = blockType.getSettingsModal();
	
			blockType.on('delete', function (e) {
				return _this3.removeBlockType(blockType);
			});
	
			var onSave = function onSave(e) {
				_this3.addBlockType(blockType);
				settingsModal.off('save', onSave);
			};
	
			var onFadeOut = function onFadeOut(e) {
				settingsModal.enableDeleteButton();
				settingsModal.off('fadeOut', onFadeOut);
			};
	
			settingsModal.on('save', onSave);
			settingsModal.on('fadeOut', onFadeOut);
	
			settingsModal.show();
		},
		'@setContainerHeight': function setContainerHeight() {
			var _this4 = this;
	
			setTimeout(function () {
				return _this4._setContainerHeight();
			}, 1);
		}
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// @see http://stackoverflow.com/a/12903503/556609
	_jquery2.default.fn.insertAt = function (index, $parent) {
		return this.each(function () {
			if (index === 0) {
				$parent.prepend(this);
			} else {
				$parent.children().eq(index - 1).after(this);
			}
		});
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = Garnish;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = Craft;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _garnish = __webpack_require__(4);
	
	var _garnish2 = _interopRequireDefault(_garnish);
	
	var _craft = __webpack_require__(5);
	
	var _craft2 = _interopRequireDefault(_craft);
	
	var _SettingsModal = __webpack_require__(7);
	
	var _SettingsModal2 = _interopRequireDefault(_SettingsModal);
	
	var _FieldLayout = __webpack_require__(15);
	
	var _FieldLayout2 = _interopRequireDefault(_FieldLayout);
	
	var _blocktype = __webpack_require__(17);
	
	var _blocktype2 = _interopRequireDefault(_blocktype);
	
	__webpack_require__(14);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _garnish2.default.Base.extend({
	
		_totalNewBlockTypes: 0,
		_parsed: false,
	
		init: function init(name, handle) {
			var _this = this;
	
			var id = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
			var errors = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
	
			this._errors = errors;
			this._settingsModal = new _SettingsModal2.default();
			this._fieldLayout = new _FieldLayout2.default();
	
			this._settingsModal.on('save', function (e) {
				_this.name = e.name;
				_this.handle = e.handle;
			});
	
			this._settingsModal.on('delete', function (e) {
				return _this.trigger('delete');
			});
	
			this.id = id;
			this.name = name;
			this.handle = handle;
	
			var context = {
				id: this.id,
				name: this.name,
				handle: this.handle,
				errors: this._errors
			};
	
			this.$container = (0, _jquery2.default)((0, _blocktype2.default)(context));
	
			var $itemNeo = this.$container.find('[data-neo]');
	
			this.$name = $itemNeo.filter('[data-neo="text.name"]');
			this.$nameInput = $itemNeo.filter('[data-neo="input.name"]');
			this.$handle = $itemNeo.filter('[data-neo="text.handle"]');
			this.$handleInput = $itemNeo.filter('[data-neo="input.handle"]');
			this.$moveBtn = $itemNeo.filter('[data-neo="button.move"]');
			this.$settingsBtn = $itemNeo.filter('[data-neo="button.settings"]');
	
			this.addListener(this.$settingsBtn, 'click', '@edit');
	
			this._parsed = true;
		},
	
	
		get id() {
			return this._id;
		},
	
		set id(id) {
			id = parseInt(id);
			this._id = isNaN(id) ? 'new' + this._totalNewBlockTypes++ : id;
	
			if (this._parsed) {
				this.$nameInput.prop('blockType[' + this._id + '][name]');
				this.$handleInput.prop('blockType[' + this._id + '][handle]');
			}
		},
	
		get name() {
			return this._name;
		},
	
		set name(name) {
			this._name = name;
			this._settingsModal.name = name;
	
			if (this._parsed) {
				this.$name.text(this._name);
				this.$nameInput.val(this._name);
			}
		},
	
		get handle() {
			return this._handle;
		},
	
		set handle(handle) {
			this._handle = handle;
			this._settingsModal.handle = handle;
	
			if (this._parsed) {
				this.$handle.text(this._handle);
				this.$handleInput.val(this._handle);
			}
		},
	
		getErrors: function getErrors() {
			return Array.from(this._errors);
		},
		getSettingsModal: function getSettingsModal() {
			return this._settingsModal;
		},
		getFieldLayout: function getFieldLayout() {
			return this._fieldLayout;
		},
		'@edit': function edit(e) {
			e.preventDefault();
	
			this._settingsModal.name = this._name;
			this._settingsModal.handle = this._handle;
	
			this._settingsModal.show();
		}
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _garnish = __webpack_require__(4);
	
	var _garnish2 = _interopRequireDefault(_garnish);
	
	var _craft = __webpack_require__(5);
	
	var _craft2 = _interopRequireDefault(_craft);
	
	var _settingsmodal = __webpack_require__(8);
	
	var _settingsmodal2 = _interopRequireDefault(_settingsmodal);
	
	__webpack_require__(14);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _garnish2.default.Modal.extend({
		init: function init() {
			this.base();
	
			this.$form = (0, _jquery2.default)((0, _settingsmodal2.default)());
	
			var $formNeo = this.$form.find('[data-neo]');
	
			this.$nameInput = $formNeo.filter('[data-neo="input.name"]');
			this.$handleInput = $formNeo.filter('[data-neo="input.handle"]');
			this.$cancelBtn = $formNeo.filter('[data-neo="button.cancel"]');
			this.$deleteBtn = $formNeo.filter('[data-neo="button.delete"]');
	
			this.$form.appendTo(_garnish2.default.$bod);
			this.setContainer(this.$form);
	
			this._handleGenerator = new _craft2.default.HandleGenerator(this.$nameInput, this.$handleInput);
	
			this.addListener(this.$cancelBtn, 'click', 'hide');
			this.addListener(this.$form, 'submit', '@save');
			this.addListener(this.$deleteBtn, 'click', '@delete');
		},
	
	
		get name() {
			return this._name;
		},
	
		set name(name) {
			this._name = name;
	
			this.$nameInput.val(this._name);
		},
	
		get handle() {
			return this._handle;
		},
	
		set handle(handle) {
			this._handle = handle;
	
			this.$handleInput.val(this._handle);
		},
	
		show: function show() {
			var _this = this;
	
			if (!_garnish2.default.isMobileBrowser()) {
				setTimeout(function () {
					return _this.$nameInput.focus();
				}, 100);
			}
	
			this.base();
		},
		enableDeleteButton: function enableDeleteButton() {
			this.$deleteBtn.removeClass('hidden');
		},
		_destroy: function _destroy() {
			this.$container.remove();
			this.$shade.remove();
		},
		'@save': function save(e) {
			e.preventDefault();
	
			// Prevent multi form submits with the return key
			if (!this.visible) return;
	
			if (this._handleGenerator.listening) {
				// Give the handle a chance to catch up with the input
				this._handleGenerator.updateTarget();
			}
	
			// Basic validation
			var name = _craft2.default.trim(this.$nameInput.val());
			var handle = _craft2.default.trim(this.$handleInput.val());
	
			if (!name) {
				_garnish2.default.shake(this.$form);
			} else {
				if (!handle) {
					handle = this._handleGenerator.generateTargetValue(name);
	
					this.$handleInput.val(handle);
				}
	
				this.hide();
	
				this.trigger('save', {
					name: name,
					handle: handle
				});
			}
		},
		'@delete': function _delete(e) {
			var _this2 = this;
	
			e.preventDefault();
	
			if (confirm(_craft2.default.t('Are you sure you want to delete this block type?'))) {
				this.on('fadeOut', function (e) {
					return _this2._destroy();
				});
	
				this.hide();
	
				this.trigger('delete');
			}
		}
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var twig = __webpack_require__(9).twig,
	    template = twig({id:"C:\\Users\\Benjamin\\Documents\\Web\\craft-neo\\craft\\plugins\\neo\\resources\\src\\configurator\\blocktype\\settingsmodal.twig", data:[{"type":"logic","token":{"type":"Twig.logic.type.set","key":"uid","expression":[{"type":"Twig.expression.type._function","fn":"uniqueId","params":[{"type":"Twig.expression.type.parameter.start","value":"(","match":["("]},{"type":"Twig.expression.type.parameter.end","value":")","match":[")"],"expression":false}]}]}},{"type":"raw","value":"\r\n\r\n<form class=\"modal fitted\">\r\n\t<div class=\"body\">\r\n\t\t<div class=\"field\">\r\n\t\t\t<div class=\"heading\">\r\n\t\t\t\t<label for=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"uid","match":["uid"]}]},{"type":"raw","value":"-name\">"},{"type":"output","stack":[{"type":"Twig.expression.type.string","value":"Name"},{"type":"Twig.expression.type.filter","value":"t","match":["|t","t"]}]},{"type":"raw","value":"</label>\r\n\t\t\t\t<div class=\"instructions\">\r\n\t\t\t\t\t<p>"},{"type":"output","stack":[{"type":"Twig.expression.type.string","value":"What this block type will be called in the CP."},{"type":"Twig.expression.type.filter","value":"t","match":["|t","t"]}]},{"type":"raw","value":"</p>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"input\">\r\n\t\t\t\t<input type=\"text\" class=\"text fullwidth\" id=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"uid","match":["uid"]}]},{"type":"raw","value":"-name\" data-neo=\"input.name\">\r\n\t\t\t\t<ul class=\"errors\" style=\"display: none;\"></ul>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"field\">\r\n\t\t\t<div class=\"heading\">\r\n\t\t\t\t<label for=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"uid","match":["uid"]}]},{"type":"raw","value":"-handle\">"},{"type":"output","stack":[{"type":"Twig.expression.type.string","value":"Handle"},{"type":"Twig.expression.type.filter","value":"t","match":["|t","t"]}]},{"type":"raw","value":"</label>\r\n\t\t\t\t<div class=\"instructions\">\r\n\t\t\t\t\t<p>"},{"type":"output","stack":[{"type":"Twig.expression.type.string","value":"How you'll refer to this block type in the templates."},{"type":"Twig.expression.type.filter","value":"t","match":["|t","t"]}]},{"type":"raw","value":"</p>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"input\">\r\n\t\t\t\t<input type=\"text\" class=\"text fullwidth code\" id=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"uid","match":["uid"]}]},{"type":"raw","value":"-handle\" data-neo=\"input.handle\">\r\n\t\t\t\t<ul class=\"errors\" style=\"display: none;\"></ul>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<a class=\"error left hidden\" style=\"line-height: 30px;\" data-neo=\"button.delete\">"},{"type":"output","stack":[{"type":"Twig.expression.type.string","value":"Delete"},{"type":"Twig.expression.type.filter","value":"t","match":["|t","t"]}]},{"type":"raw","value":"</a>\r\n\t\t<div class=\"buttons right\" style=\"margin-top: 0;\">\r\n\t\t\t<div class=\"btn\" data-neo=\"button.cancel\">"},{"type":"output","stack":[{"type":"Twig.expression.type.string","value":"Cancel"},{"type":"Twig.expression.type.filter","value":"t","match":["|t","t"]}]},{"type":"raw","value":"</div>\r\n\t\t\t<input type=\"submit\" class=\"btn submit\">\r\n\t\t</div>\r\n\t</div>\r\n</form>\r\n"}], allowInlineIncludes: true});
	
	module.exports = function(context) { return template.render(context); }

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/**
	 * Twig.js 0.8.8
	 *
	 * @copyright 2011-2015 John Roepke and the Twig.js Contributors
	 * @license   Available under the BSD 2-Clause License
	 * @link      https://github.com/justjohn/twig.js
	 */
	var Twig=function(Twig){Twig.VERSION="0.8.8";return Twig}(Twig||{});var Twig=function(Twig){"use strict";Twig.trace=false;Twig.debug=false;Twig.cache=true;Twig.placeholders={parent:"{{|PARENT|}}"};Twig.indexOf=function(arr,searchElement){if(Array.prototype.hasOwnProperty("indexOf")){return arr.indexOf(searchElement)}if(arr===void 0||arr===null){throw new TypeError}var t=Object(arr);var len=t.length>>>0;if(len===0){return-1}var n=0;if(arguments.length>0){n=Number(arguments[1]);if(n!==n){n=0}else if(n!==0&&n!==Infinity&&n!==-Infinity){n=(n>0||-1)*Math.floor(Math.abs(n))}}if(n>=len){return-1}var k=n>=0?n:Math.max(len-Math.abs(n),0);for(;k<len;k++){if(k in t&&t[k]===searchElement){return k}}if(arr==searchElement){return 0}return-1};Twig.forEach=function(arr,callback,thisArg){if(Array.prototype.forEach){return arr.forEach(callback,thisArg)}var T,k;if(arr==null){throw new TypeError(" this is null or not defined")}var O=Object(arr);var len=O.length>>>0;if({}.toString.call(callback)!="[object Function]"){throw new TypeError(callback+" is not a function")}if(thisArg){T=thisArg}k=0;while(k<len){var kValue;if(k in O){kValue=O[k];callback.call(T,kValue,k,O)}k++}};Twig.merge=function(target,source,onlyChanged){Twig.forEach(Object.keys(source),function(key){if(onlyChanged&&!(key in target)){return}target[key]=source[key]});return target};Twig.Error=function(message){this.message=message;this.name="TwigException";this.type="TwigException"};Twig.Error.prototype.toString=function(){var output=this.name+": "+this.message;return output};Twig.log={trace:function(){if(Twig.trace&&console){console.log(Array.prototype.slice.call(arguments))}},debug:function(){if(Twig.debug&&console){console.log(Array.prototype.slice.call(arguments))}}};if(typeof console!=="undefined"){if(typeof console.error!=="undefined"){Twig.log.error=function(){console.error.apply(console,arguments)}}else if(typeof console.log!=="undefined"){Twig.log.error=function(){console.log.apply(console,arguments)}}}else{Twig.log.error=function(){}}Twig.ChildContext=function(context){var ChildContext=function ChildContext(){};ChildContext.prototype=context;return new ChildContext};Twig.token={};Twig.token.type={output:"output",logic:"logic",comment:"comment",raw:"raw",output_whitespace_pre:"output_whitespace_pre",output_whitespace_post:"output_whitespace_post",output_whitespace_both:"output_whitespace_both",logic_whitespace_pre:"logic_whitespace_pre",logic_whitespace_post:"logic_whitespace_post",logic_whitespace_both:"logic_whitespace_both"};Twig.token.definitions=[{type:Twig.token.type.raw,open:"{% raw %}",close:"{% endraw %}"},{type:Twig.token.type.raw,open:"{% verbatim %}",close:"{% endverbatim %}"},{type:Twig.token.type.output_whitespace_pre,open:"{{-",close:"}}"},{type:Twig.token.type.output_whitespace_post,open:"{{",close:"-}}"},{type:Twig.token.type.output_whitespace_both,open:"{{-",close:"-}}"},{type:Twig.token.type.logic_whitespace_pre,open:"{%-",close:"%}"},{type:Twig.token.type.logic_whitespace_post,open:"{%",close:"-%}"},{type:Twig.token.type.logic_whitespace_both,open:"{%-",close:"-%}"},{type:Twig.token.type.output,open:"{{",close:"}}"},{type:Twig.token.type.logic,open:"{%",close:"%}"},{type:Twig.token.type.comment,open:"{#",close:"#}"}];Twig.token.strings=['"',"'"];Twig.token.findStart=function(template){var output={position:null,close_position:null,def:null},i,token_template,first_key_position,close_key_position;for(i=0;i<Twig.token.definitions.length;i++){token_template=Twig.token.definitions[i];first_key_position=template.indexOf(token_template.open);close_key_position=template.indexOf(token_template.close);Twig.log.trace("Twig.token.findStart: ","Searching for ",token_template.open," found at ",first_key_position);if(first_key_position>=0){if(token_template.open.length!==token_template.close.length){if(close_key_position<0){continue}}}if(first_key_position>=0&&(output.position===null||first_key_position<output.position)){output.position=first_key_position;output.def=token_template;output.close_position=close_key_position}else if(first_key_position>=0&&output.position!==null&&first_key_position===output.position){if(token_template.open.length>output.def.open.length){output.position=first_key_position;output.def=token_template;output.close_position=close_key_position}else if(token_template.open.length===output.def.open.length){if(token_template.close.length>output.def.close.length){if(close_key_position>=0&&close_key_position<output.close_position){output.position=first_key_position;output.def=token_template;output.close_position=close_key_position}}else if(close_key_position>=0&&close_key_position<output.close_position){output.position=first_key_position;output.def=token_template;output.close_position=close_key_position}}}}delete output["close_position"];return output};Twig.token.findEnd=function(template,token_def,start){var end=null,found=false,offset=0,str_pos=null,str_found=null,pos=null,end_offset=null,this_str_pos=null,end_str_pos=null,i,l;while(!found){str_pos=null;str_found=null;pos=template.indexOf(token_def.close,offset);if(pos>=0){end=pos;found=true}else{throw new Twig.Error("Unable to find closing bracket '"+token_def.close+"'"+" opened near template position "+start)}if(token_def.type===Twig.token.type.comment){break}if(token_def.type===Twig.token.type.raw){break}l=Twig.token.strings.length;for(i=0;i<l;i+=1){this_str_pos=template.indexOf(Twig.token.strings[i],offset);if(this_str_pos>0&&this_str_pos<pos&&(str_pos===null||this_str_pos<str_pos)){str_pos=this_str_pos;str_found=Twig.token.strings[i]}}if(str_pos!==null){end_offset=str_pos+1;end=null;found=false;while(true){end_str_pos=template.indexOf(str_found,end_offset);if(end_str_pos<0){throw"Unclosed string in template"}if(template.substr(end_str_pos-1,1)!=="\\"){offset=end_str_pos+1;break}else{end_offset=end_str_pos+1}}}}return end};Twig.tokenize=function(template){var tokens=[],error_offset=0,found_token=null,end=null;while(template.length>0){found_token=Twig.token.findStart(template);Twig.log.trace("Twig.tokenize: ","Found token: ",found_token);if(found_token.position!==null){if(found_token.position>0){tokens.push({type:Twig.token.type.raw,value:template.substring(0,found_token.position)})}template=template.substr(found_token.position+found_token.def.open.length);error_offset+=found_token.position+found_token.def.open.length;end=Twig.token.findEnd(template,found_token.def,error_offset);Twig.log.trace("Twig.tokenize: ","Token ends at ",end);tokens.push({type:found_token.def.type,value:template.substring(0,end).trim()});if(template.substr(end+found_token.def.close.length,1)==="\n"){switch(found_token.def.type){case"logic_whitespace_pre":case"logic_whitespace_post":case"logic_whitespace_both":case"logic":end+=1;break}}template=template.substr(end+found_token.def.close.length);error_offset+=end+found_token.def.close.length}else{tokens.push({type:Twig.token.type.raw,value:template});template=""}}return tokens};Twig.compile=function(tokens){try{var output=[],stack=[],intermediate_output=[],token=null,logic_token=null,unclosed_token=null,prev_token=null,prev_output=null,prev_intermediate_output=null,prev_template=null,next_token=null,tok_output=null,type=null,open=null,next=null;var compile_output=function(token){Twig.expression.compile.apply(this,[token]);if(stack.length>0){intermediate_output.push(token)}else{output.push(token)}};var compile_logic=function(token){logic_token=Twig.logic.compile.apply(this,[token]);type=logic_token.type;open=Twig.logic.handler[type].open;next=Twig.logic.handler[type].next;Twig.log.trace("Twig.compile: ","Compiled logic token to ",logic_token," next is: ",next," open is : ",open);if(open!==undefined&&!open){prev_token=stack.pop();prev_template=Twig.logic.handler[prev_token.type];if(Twig.indexOf(prev_template.next,type)<0){throw new Error(type+" not expected after a "+prev_token.type)}prev_token.output=prev_token.output||[];prev_token.output=prev_token.output.concat(intermediate_output);intermediate_output=[];tok_output={type:Twig.token.type.logic,token:prev_token};if(stack.length>0){intermediate_output.push(tok_output)}else{output.push(tok_output)}}if(next!==undefined&&next.length>0){Twig.log.trace("Twig.compile: ","Pushing ",logic_token," to logic stack.");if(stack.length>0){prev_token=stack.pop();prev_token.output=prev_token.output||[];prev_token.output=prev_token.output.concat(intermediate_output);stack.push(prev_token);intermediate_output=[]}stack.push(logic_token)}else if(open!==undefined&&open){tok_output={type:Twig.token.type.logic,token:logic_token};if(stack.length>0){intermediate_output.push(tok_output)}else{output.push(tok_output)}}};while(tokens.length>0){token=tokens.shift();prev_output=output[output.length-1];prev_intermediate_output=intermediate_output[intermediate_output.length-1];next_token=tokens[0];Twig.log.trace("Compiling token ",token);switch(token.type){case Twig.token.type.raw:if(stack.length>0){intermediate_output.push(token)}else{output.push(token)}break;case Twig.token.type.logic:compile_logic.call(this,token);break;case Twig.token.type.comment:break;case Twig.token.type.output:compile_output.call(this,token);break;case Twig.token.type.logic_whitespace_pre:case Twig.token.type.logic_whitespace_post:case Twig.token.type.logic_whitespace_both:case Twig.token.type.output_whitespace_pre:case Twig.token.type.output_whitespace_post:case Twig.token.type.output_whitespace_both:if(token.type!==Twig.token.type.output_whitespace_post&&token.type!==Twig.token.type.logic_whitespace_post){if(prev_output){if(prev_output.type===Twig.token.type.raw){output.pop();if(prev_output.value.match(/^\s*$/)===null){prev_output.value=prev_output.value.trim();output.push(prev_output)}}}if(prev_intermediate_output){if(prev_intermediate_output.type===Twig.token.type.raw){intermediate_output.pop();if(prev_intermediate_output.value.match(/^\s*$/)===null){prev_intermediate_output.value=prev_intermediate_output.value.trim();intermediate_output.push(prev_intermediate_output)}}}}switch(token.type){case Twig.token.type.output_whitespace_pre:case Twig.token.type.output_whitespace_post:case Twig.token.type.output_whitespace_both:compile_output.call(this,token);break;case Twig.token.type.logic_whitespace_pre:case Twig.token.type.logic_whitespace_post:case Twig.token.type.logic_whitespace_both:compile_logic.call(this,token);break}if(token.type!==Twig.token.type.output_whitespace_pre&&token.type!==Twig.token.type.logic_whitespace_pre){if(next_token){if(next_token.type===Twig.token.type.raw){tokens.shift();if(next_token.value.match(/^\s*$/)===null){next_token.value=next_token.value.trim();tokens.unshift(next_token)}}}}break}Twig.log.trace("Twig.compile: "," Output: ",output," Logic Stack: ",stack," Pending Output: ",intermediate_output)}if(stack.length>0){unclosed_token=stack.pop();throw new Error("Unable to find an end tag for "+unclosed_token.type+", expecting one of "+unclosed_token.next)}return output}catch(ex){Twig.log.error("Error compiling twig template "+this.id+": ");if(ex.stack){Twig.log.error(ex.stack)}else{Twig.log.error(ex.toString())}if(this.options.rethrow)throw ex}};Twig.parse=function(tokens,context){try{var output=[],chain=true,that=this;Twig.forEach(tokens,function parseToken(token){Twig.log.debug("Twig.parse: ","Parsing token: ",token);switch(token.type){case Twig.token.type.raw:output.push(Twig.filters.raw(token.value));break;case Twig.token.type.logic:var logic_token=token.token,logic=Twig.logic.parse.apply(that,[logic_token,context,chain]);if(logic.chain!==undefined){chain=logic.chain}if(logic.context!==undefined){context=logic.context}if(logic.output!==undefined){output.push(logic.output)}break;case Twig.token.type.comment:break;case Twig.token.type.output_whitespace_pre:case Twig.token.type.output_whitespace_post:case Twig.token.type.output_whitespace_both:case Twig.token.type.output:Twig.log.debug("Twig.parse: ","Output token: ",token.stack);output.push(Twig.expression.parse.apply(that,[token.stack,context]));break}});return Twig.output.apply(this,[output])}catch(ex){Twig.log.error("Error parsing twig template "+this.id+": ");if(ex.stack){Twig.log.error(ex.stack)}else{Twig.log.error(ex.toString())}if(this.options.rethrow)throw ex;if(Twig.debug){return ex.toString()}}};Twig.prepare=function(data){var tokens,raw_tokens;Twig.log.debug("Twig.prepare: ","Tokenizing ",data);raw_tokens=Twig.tokenize.apply(this,[data]);Twig.log.debug("Twig.prepare: ","Compiling ",raw_tokens);tokens=Twig.compile.apply(this,[raw_tokens]);Twig.log.debug("Twig.prepare: ","Compiled ",tokens);return tokens};Twig.output=function(output){if(!this.options.autoescape){return output.join("")}var strategy="html";if(typeof this.options.autoescape=="string")strategy=this.options.autoescape;var escaped_output=[];Twig.forEach(output,function(str){if(str&&(str.twig_markup!==true&&str.twig_markup!=strategy)){str=Twig.filters.escape(str,[strategy])}escaped_output.push(str)});return Twig.Markup(escaped_output.join(""))};Twig.Templates={loaders:{},registry:{}};Twig.validateId=function(id){if(id==="prototype"){throw new Twig.Error(id+" is not a valid twig identifier")}else if(Twig.cache&&Twig.Templates.registry.hasOwnProperty(id)){throw new Twig.Error("There is already a template with the ID "+id)}return true};Twig.Templates.registerLoader=function(method_name,func,scope){if(typeof func!=="function"){throw new Twig.Error("Unable to add loader for "+method_name+": Invalid function reference given.")}if(scope){func=func.bind(scope)}this.loaders[method_name]=func};Twig.Templates.unRegisterLoader=function(method_name){if(this.isRegisteredLoader(method_name)){delete this.loaders[method_name]}};Twig.Templates.isRegisteredLoader=function(method_name){return this.loaders.hasOwnProperty(method_name)};Twig.Templates.save=function(template){if(template.id===undefined){throw new Twig.Error("Unable to save template with no id")}Twig.Templates.registry[template.id]=template};Twig.Templates.load=function(id){if(!Twig.Templates.registry.hasOwnProperty(id)){return null}return Twig.Templates.registry[id]};Twig.Templates.loadRemote=function(location,params,callback,error_callback){var loader;if(params.async===undefined){params.async=true}if(params.id===undefined){params.id=location}if(Twig.cache&&Twig.Templates.registry.hasOwnProperty(params.id)){if(typeof callback==="function"){callback(Twig.Templates.registry[params.id])}return Twig.Templates.registry[params.id]}loader=this.loaders[params.method]||this.loaders.fs;return loader.apply(null,arguments)};function is(type,obj){var clas=Object.prototype.toString.call(obj).slice(8,-1);return obj!==undefined&&obj!==null&&clas===type}Twig.Template=function(params){var data=params.data,id=params.id,blocks=params.blocks,macros=params.macros||{},base=params.base,path=params.path,url=params.url,name=params.name,method=params.method,options=params.options;this.id=id;this.method=method;this.base=base;this.path=path;this.url=url;this.name=name;this.macros=macros;this.options=options;this.reset(blocks);if(is("String",data)){this.tokens=Twig.prepare.apply(this,[data])}else{this.tokens=data}if(id!==undefined){Twig.Templates.save(this)}};Twig.Template.prototype.reset=function(blocks){Twig.log.debug("Twig.Template.reset","Reseting template "+this.id);this.blocks={};this.importedBlocks=[];this.originalBlockTokens={};this.child={blocks:blocks||{}};this.extend=null};Twig.Template.prototype.render=function(context,params){params=params||{};var output,url;this.context=context||{};this.reset();if(params.blocks){this.blocks=params.blocks}if(params.macros){this.macros=params.macros}output=Twig.parse.apply(this,[this.tokens,this.context]);if(this.extend){var ext_template;if(this.options.allowInlineIncludes){ext_template=Twig.Templates.load(this.extend);if(ext_template){ext_template.options=this.options}}if(!ext_template){url=parsePath(this,this.extend);ext_template=Twig.Templates.loadRemote(url,{method:this.getLoaderMethod(),base:this.base,async:false,id:url,options:this.options})}this.parent=ext_template;return this.parent.render(this.context,{blocks:this.blocks})}if(params.output=="blocks"){return this.blocks}else if(params.output=="macros"){return this.macros}else{return output}};Twig.Template.prototype.importFile=function(file){var url,sub_template;if(!this.url&&this.options.allowInlineIncludes){file=this.path?this.path+"/"+file:file;sub_template=Twig.Templates.load(file);if(!sub_template){sub_template=Twig.Templates.loadRemote(url,{id:file,method:this.getLoaderMethod(),async:false,options:this.options});if(!sub_template){throw new Twig.Error("Unable to find the template "+file)}}sub_template.options=this.options;return sub_template}url=parsePath(this,file);sub_template=Twig.Templates.loadRemote(url,{method:this.getLoaderMethod(),base:this.base,async:false,options:this.options,id:url});return sub_template};Twig.Template.prototype.importBlocks=function(file,override){var sub_template=this.importFile(file),context=this.context,that=this,key;override=override||false;sub_template.render(context);Twig.forEach(Object.keys(sub_template.blocks),function(key){if(override||that.blocks[key]===undefined){that.blocks[key]=sub_template.blocks[key];that.importedBlocks.push(key)}})};Twig.Template.prototype.importMacros=function(file){var url=parsePath(this,file);var remoteTemplate=Twig.Templates.loadRemote(url,{method:this.getLoaderMethod(),async:false,id:url});return remoteTemplate};Twig.Template.prototype.getLoaderMethod=function(){if(this.path){return"fs"}if(this.url){return"ajax"}return this.method||"fs"};Twig.Template.prototype.compile=function(options){return Twig.compiler.compile(this,options)};Twig.Markup=function(content,strategy){if(typeof strategy=="undefined"){strategy=true}if(typeof content==="string"&&content.length>0){content=new String(content);content.twig_markup=strategy}return content};function parsePath(template,file){var namespaces=null;if(typeof template==="object"&&typeof template.options==="object"){namespaces=template.options.namespaces}if(typeof namespaces==="object"&&file.indexOf("::")>0){for(var k in namespaces){if(namespaces.hasOwnProperty(k)){file=file.replace(k+"::",namespaces[k])}}return file}return relativePath(template,file)}function relativePath(template,file){var base,base_path,sep_chr="/",new_path=[],val;if(template.url){if(typeof template.base!=="undefined"){base=template.base+(template.base.charAt(template.base.length-1)==="/"?"":"/")}else{base=template.url}}else if(template.path){var path=__webpack_require__(11),sep=path.sep||sep_chr,relative=new RegExp("^\\.{1,2}"+sep.replace("\\","\\\\"));file=file.replace(/\//g,sep);if(template.base!==undefined&&file.match(relative)==null){file=file.replace(template.base,"");base=template.base+sep}else{base=path.normalize(template.path)}base=base.replace(sep+sep,sep);sep_chr=sep}else if((template.name||template.id)&&template.method&&template.method!=="fs"&&template.method!=="ajax"){base=template.base||template.name||template.id}else{throw new Twig.Error("Cannot extend an inline template.")}base_path=base.split(sep_chr);base_path.pop();base_path=base_path.concat(file.split(sep_chr));while(base_path.length>0){val=base_path.shift();if(val=="."){}else if(val==".."&&new_path.length>0&&new_path[new_path.length-1]!=".."){new_path.pop()}else{new_path.push(val)}}return new_path.join(sep_chr)}return Twig}(Twig||{});(function(Twig){"use strict";Twig.Templates.registerLoader("ajax",function(location,params,callback,error_callback){var template,xmlhttp,precompiled=params.precompiled;if(typeof XMLHttpRequest==="undefined"){throw new Twig.Error("Unsupported platform: Unable to do ajax requests "+'because there is no "XMLHTTPRequest" implementation')}xmlhttp=new XMLHttpRequest;xmlhttp.onreadystatechange=function(){var data=null;if(xmlhttp.readyState===4){if(xmlhttp.status===200||window.cordova&&xmlhttp.status==0){Twig.log.debug("Got template ",xmlhttp.responseText);if(precompiled===true){data=JSON.parse(xmlhttp.responseText)}else{data=xmlhttp.responseText}params.url=location;params.data=data;template=new Twig.Template(params);if(typeof callback==="function"){callback(template)}}else{if(typeof error_callback==="function"){error_callback(xmlhttp)}}}};xmlhttp.open("GET",location,!!params.async);xmlhttp.send();if(params.async){return true}else{return template}})})(Twig);(function(Twig){"use strict";var fs,path;try{fs=__webpack_require__(13);path=__webpack_require__(11)}catch(e){}Twig.Templates.registerLoader("fs",function(location,params,callback,error_callback){var template,data=null,precompiled=params.precompiled;if(!fs||!path){throw new Twig.Error("Unsupported platform: Unable to load from file "+'because there is no "fs" or "path" implementation')}var loadTemplateFn=function(err,data){if(err){if(typeof error_callback==="function"){error_callback(err)}return}if(precompiled===true){data=JSON.parse(data)}params.data=data;params.path=location;template=new Twig.Template(params);if(typeof callback==="function"){callback(template)}};if(params.async){fs.stat(location,function(err,stats){if(err||!stats.isFile()){throw new Twig.Error("Unable to find template file "+location)}fs.readFile(location,"utf8",loadTemplateFn)});return true}else{if(!fs.statSync(location).isFile()){throw new Twig.Error("Unable to find template file "+location)}data=fs.readFileSync(location,"utf8");loadTemplateFn(undefined,data);return template}})})(Twig);(function(){"use strict";if(!String.prototype.trim){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}}if(!Object.keys)Object.keys=function(o){if(o!==Object(o)){throw new TypeError("Object.keys called on non-object")}var ret=[],p;for(p in o)if(Object.prototype.hasOwnProperty.call(o,p))ret.push(p);return ret}})();var Twig=function(Twig){Twig.lib={};var sprintfLib=function(){var re={not_string:/[^s]/,number:/[diefg]/,json:/[j]/,not_json:/[^j]/,text:/^[^\x25]+/,modulo:/^\x25{2}/,placeholder:/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,key:/^([a-z_][a-z_\d]*)/i,key_access:/^\.([a-z_][a-z_\d]*)/i,index_access:/^\[(\d+)\]/,sign:/^[\+\-]/};function sprintf(){var key=arguments[0],cache=sprintf.cache;if(!(cache[key]&&cache.hasOwnProperty(key))){cache[key]=sprintf.parse(key)}return sprintf.format.call(null,cache[key],arguments)}sprintf.format=function(parse_tree,argv){var cursor=1,tree_length=parse_tree.length,node_type="",arg,output=[],i,k,match,pad,pad_character,pad_length,is_positive=true,sign="";for(i=0;i<tree_length;i++){node_type=get_type(parse_tree[i]);if(node_type==="string"){output[output.length]=parse_tree[i]}else if(node_type==="array"){match=parse_tree[i];if(match[2]){arg=argv[cursor];for(k=0;k<match[2].length;k++){if(!arg.hasOwnProperty(match[2][k])){throw new Error(sprintf("[sprintf] property '%s' does not exist",match[2][k]))}arg=arg[match[2][k]]}}else if(match[1]){arg=argv[match[1]]}else{arg=argv[cursor++]}if(get_type(arg)=="function"){arg=arg()}if(re.not_string.test(match[8])&&re.not_json.test(match[8])&&(get_type(arg)!="number"&&isNaN(arg))){throw new TypeError(sprintf("[sprintf] expecting number but found %s",get_type(arg)))}if(re.number.test(match[8])){is_positive=arg>=0}switch(match[8]){case"b":arg=arg.toString(2);break;case"c":arg=String.fromCharCode(arg);break;case"d":case"i":arg=parseInt(arg,10);break;case"j":arg=JSON.stringify(arg,null,match[6]?parseInt(match[6]):0);break;case"e":arg=match[7]?arg.toExponential(match[7]):arg.toExponential();break;case"f":arg=match[7]?parseFloat(arg).toFixed(match[7]):parseFloat(arg);break;case"g":arg=match[7]?parseFloat(arg).toPrecision(match[7]):parseFloat(arg);break;case"o":arg=arg.toString(8);break;case"s":arg=(arg=String(arg))&&match[7]?arg.substring(0,match[7]):arg;break;case"u":arg=arg>>>0;break;case"x":arg=arg.toString(16);break;case"X":arg=arg.toString(16).toUpperCase();break}if(re.json.test(match[8])){output[output.length]=arg}else{if(re.number.test(match[8])&&(!is_positive||match[3])){sign=is_positive?"+":"-";arg=arg.toString().replace(re.sign,"")}else{sign=""}pad_character=match[4]?match[4]==="0"?"0":match[4].charAt(1):" ";pad_length=match[6]-(sign+arg).length;pad=match[6]?pad_length>0?str_repeat(pad_character,pad_length):"":"";output[output.length]=match[5]?sign+arg+pad:pad_character==="0"?sign+pad+arg:pad+sign+arg}}}return output.join("")};sprintf.cache={};sprintf.parse=function(fmt){var _fmt=fmt,match=[],parse_tree=[],arg_names=0;while(_fmt){if((match=re.text.exec(_fmt))!==null){parse_tree[parse_tree.length]=match[0]}else if((match=re.modulo.exec(_fmt))!==null){parse_tree[parse_tree.length]="%"}else if((match=re.placeholder.exec(_fmt))!==null){if(match[2]){arg_names|=1;var field_list=[],replacement_field=match[2],field_match=[];if((field_match=re.key.exec(replacement_field))!==null){field_list[field_list.length]=field_match[1];while((replacement_field=replacement_field.substring(field_match[0].length))!==""){if((field_match=re.key_access.exec(replacement_field))!==null){field_list[field_list.length]=field_match[1]}else if((field_match=re.index_access.exec(replacement_field))!==null){field_list[field_list.length]=field_match[1]}else{throw new SyntaxError("[sprintf] failed to parse named argument key")}}}else{throw new SyntaxError("[sprintf] failed to parse named argument key")}match[2]=field_list}else{arg_names|=2}if(arg_names===3){throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported")}parse_tree[parse_tree.length]=match}else{throw new SyntaxError("[sprintf] unexpected placeholder")}_fmt=_fmt.substring(match[0].length)}return parse_tree};var vsprintf=function(fmt,argv,_argv){_argv=(argv||[]).slice(0);_argv.splice(0,0,fmt);return sprintf.apply(null,_argv)};function get_type(variable){return Object.prototype.toString.call(variable).slice(8,-1).toLowerCase()}function str_repeat(input,multiplier){return Array(multiplier+1).join(input)}return{sprintf:sprintf,vsprintf:vsprintf}}();var sprintf=sprintfLib.sprintf;var vsprintf=sprintfLib.vsprintf;Twig.lib.sprintf=sprintf;Twig.lib.vsprintf=vsprintf;(function(){var shortDays="Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",");var fullDays="Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(",");var shortMonths="Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(",");var fullMonths="January,February,March,April,May,June,July,August,September,October,November,December".split(",");function getOrdinalFor(intNum){return(intNum=Math.abs(intNum)%100)%10==1&&intNum!=11?"st":intNum%10==2&&intNum!=12?"nd":intNum%10==3&&intNum!=13?"rd":"th"}function getISO8601Year(aDate){var d=new Date(aDate.getFullYear()+1,0,4);if((d-aDate)/864e5<7&&(aDate.getDay()+6)%7<(d.getDay()+6)%7)return d.getFullYear();if(aDate.getMonth()>0||aDate.getDate()>=4)return aDate.getFullYear();return aDate.getFullYear()-((aDate.getDay()+6)%7-aDate.getDate()>2?1:0)}function getISO8601Week(aDate){var d=new Date(getISO8601Year(aDate),0,4);d.setDate(d.getDate()-(d.getDay()+6)%7);return parseInt((aDate-d)/6048e5)+1}Twig.lib.formatDate=function(date,format){if(typeof format!=="string"||/^\s*$/.test(format))return date+"";var jan1st=new Date(date.getFullYear(),0,1);var me=date;return format.replace(/[dDjlNSwzWFmMntLoYyaABgGhHisuU]/g,function(option){switch(option){case"d":return("0"+me.getDate()).replace(/^.+(..)$/,"$1");case"D":return shortDays[me.getDay()];case"j":return me.getDate();case"l":return fullDays[me.getDay()];case"N":return(me.getDay()+6)%7+1;case"S":return getOrdinalFor(me.getDate());case"w":return me.getDay();case"z":return Math.ceil((jan1st-me)/864e5);case"W":return("0"+getISO8601Week(me)).replace(/^.(..)$/,"$1");case"F":return fullMonths[me.getMonth()];case"m":return("0"+(me.getMonth()+1)).replace(/^.+(..)$/,"$1");case"M":return shortMonths[me.getMonth()];case"n":return me.getMonth()+1;case"t":return new Date(me.getFullYear(),me.getMonth()+1,-1).getDate();case"L":return new Date(me.getFullYear(),1,29).getDate()==29?1:0;case"o":return getISO8601Year(me);case"Y":return me.getFullYear();case"y":return(me.getFullYear()+"").replace(/^.+(..)$/,"$1");case"a":return me.getHours()<12?"am":"pm";case"A":return me.getHours()<12?"AM":"PM";case"B":return Math.floor(((me.getUTCHours()+1)%24+me.getUTCMinutes()/60+me.getUTCSeconds()/3600)*1e3/24);case"g":return me.getHours()%12!=0?me.getHours()%12:12;case"G":return me.getHours();case"h":return("0"+(me.getHours()%12!=0?me.getHours()%12:12)).replace(/^.+(..)$/,"$1");case"H":return("0"+me.getHours()).replace(/^.+(..)$/,"$1");case"i":return("0"+me.getMinutes()).replace(/^.+(..)$/,"$1");case"s":return("0"+me.getSeconds()).replace(/^.+(..)$/,"$1");case"u":return me.getMilliseconds();case"U":return me.getTime()/1e3}})}})();Twig.lib.strip_tags=function(input,allowed){allowed=(((allowed||"")+"").toLowerCase().match(/<[a-z][a-z0-9]*>/g)||[]).join("");var tags=/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,commentsAndPhpTags=/<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;return input.replace(commentsAndPhpTags,"").replace(tags,function($0,$1){return allowed.indexOf("<"+$1.toLowerCase()+">")>-1?$0:""})};Twig.lib.parseISO8601Date=function(s){var re=/(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(\.\d+)?(Z|([+-])(\d\d):(\d\d))/;var d=[];d=s.match(re);if(!d){throw"Couldn't parse ISO 8601 date string '"+s+"'"}var a=[1,2,3,4,5,6,10,11];for(var i in a){d[a[i]]=parseInt(d[a[i]],10)}d[7]=parseFloat(d[7]);var ms=Date.UTC(d[1],d[2]-1,d[3],d[4],d[5],d[6]);if(d[7]>0){ms+=Math.round(d[7]*1e3)}if(d[8]!="Z"&&d[10]){var offset=d[10]*60*60*1e3;if(d[11]){offset+=d[11]*60*1e3}if(d[9]=="-"){ms-=offset}else{ms+=offset}}return new Date(ms)};Twig.lib.strtotime=function(text,now){var parsed,match,today,year,date,days,ranges,len,times,regex,i,fail=false;if(!text){return fail}text=text.replace(/^\s+|\s+$/g,"").replace(/\s{2,}/g," ").replace(/[\t\r\n]/g,"").toLowerCase();match=text.match(/^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);if(match&&match[2]===match[4]){if(match[1]>1901){switch(match[2]){case"-":{if(match[3]>12||match[5]>31){return fail}return new Date(match[1],parseInt(match[3],10)-1,match[5],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}case".":{return fail}case"/":{if(match[3]>12||match[5]>31){return fail}return new Date(match[1],parseInt(match[3],10)-1,match[5],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}}}else if(match[5]>1901){switch(match[2]){case"-":{if(match[3]>12||match[1]>31){return fail}return new Date(match[5],parseInt(match[3],10)-1,match[1],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}case".":{if(match[3]>12||match[1]>31){return fail}return new Date(match[5],parseInt(match[3],10)-1,match[1],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}case"/":{if(match[1]>12||match[3]>31){return fail}return new Date(match[5],parseInt(match[1],10)-1,match[3],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}}}else{switch(match[2]){case"-":{if(match[3]>12||match[5]>31||match[1]<70&&match[1]>38){return fail}year=match[1]>=0&&match[1]<=38?+match[1]+2e3:match[1];return new Date(year,parseInt(match[3],10)-1,match[5],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}case".":{if(match[5]>=70){if(match[3]>12||match[1]>31){return fail}return new Date(match[5],parseInt(match[3],10)-1,match[1],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}if(match[5]<60&&!match[6]){if(match[1]>23||match[3]>59){return fail}today=new Date;return new Date(today.getFullYear(),today.getMonth(),today.getDate(),match[1]||0,match[3]||0,match[5]||0,match[9]||0)/1e3}return fail}case"/":{if(match[1]>12||match[3]>31||match[5]<70&&match[5]>38){return fail}year=match[5]>=0&&match[5]<=38?+match[5]+2e3:match[5];return new Date(year,parseInt(match[1],10)-1,match[3],match[6]||0,match[7]||0,match[8]||0,match[9]||0)/1e3}case":":{if(match[1]>23||match[3]>59||match[5]>59){return fail}today=new Date;return new Date(today.getFullYear(),today.getMonth(),today.getDate(),match[1]||0,match[3]||0,match[5]||0)/1e3}}}}if(text==="now"){return now===null||isNaN(now)?(new Date).getTime()/1e3|0:now|0}if(!isNaN(parsed=Date.parse(text))){return parsed/1e3|0;
	}if(match=text.match(/^([0-9]{4}-[0-9]{2}-[0-9]{2})[ t]([0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?)([\+-][0-9]{2}(:[0-9]{2})?|z)/)){if(match[4]=="z"){match[4]="Z"}else if(match[4].match(/^([\+-][0-9]{2})$/)){match[4]=match[4]+":00"}if(!isNaN(parsed=Date.parse(match[1]+"T"+match[2]+match[4]))){return parsed/1e3|0}}date=now?new Date(now*1e3):new Date;days={sun:0,mon:1,tue:2,wed:3,thu:4,fri:5,sat:6};ranges={yea:"FullYear",mon:"Month",day:"Date",hou:"Hours",min:"Minutes",sec:"Seconds"};function lastNext(type,range,modifier){var diff,day=days[range];if(typeof day!=="undefined"){diff=day-date.getDay();if(diff===0){diff=7*modifier}else if(diff>0&&type==="last"){diff-=7}else if(diff<0&&type==="next"){diff+=7}date.setDate(date.getDate()+diff)}}function process(val){var splt=val.split(" "),type=splt[0],range=splt[1].substring(0,3),typeIsNumber=/\d+/.test(type),ago=splt[2]==="ago",num=(type==="last"?-1:1)*(ago?-1:1);if(typeIsNumber){num*=parseInt(type,10)}if(ranges.hasOwnProperty(range)&&!splt[1].match(/^mon(day|\.)?$/i)){return date["set"+ranges[range]](date["get"+ranges[range]]()+num)}if(range==="wee"){return date.setDate(date.getDate()+num*7)}if(type==="next"||type==="last"){lastNext(type,range,num)}else if(!typeIsNumber){return false}return true}times="(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec"+"|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?"+"|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)";regex="([+-]?\\d+\\s"+times+"|"+"(last|next)\\s"+times+")(\\sago)?";match=text.match(new RegExp(regex,"gi"));if(!match){return fail}for(i=0,len=match.length;i<len;i++){if(!process(match[i])){return fail}}return date.getTime()/1e3};Twig.lib.is=function(type,obj){var clas=Object.prototype.toString.call(obj).slice(8,-1);return obj!==undefined&&obj!==null&&clas===type};Twig.lib.copy=function(src){var target={},key;for(key in src)target[key]=src[key];return target};Twig.lib.replaceAll=function(string,search,replace){return string.split(search).join(replace)};Twig.lib.chunkArray=function(arr,size){var returnVal=[],x=0,len=arr.length;if(size<1||!Twig.lib.is("Array",arr)){return[]}while(x<len){returnVal.push(arr.slice(x,x+=size))}return returnVal};Twig.lib.round=function round(value,precision,mode){var m,f,isHalf,sgn;precision|=0;m=Math.pow(10,precision);value*=m;sgn=value>0|-(value<0);isHalf=value%1===.5*sgn;f=Math.floor(value);if(isHalf){switch(mode){case"PHP_ROUND_HALF_DOWN":value=f+(sgn<0);break;case"PHP_ROUND_HALF_EVEN":value=f+f%2*sgn;break;case"PHP_ROUND_HALF_ODD":value=f+!(f%2);break;default:value=f+(sgn>0)}}return(isHalf?value:Math.round(value))/m};Twig.lib.max=function max(){var ar,retVal,i=0,n=0,argv=arguments,argc=argv.length,_obj2Array=function(obj){if(Object.prototype.toString.call(obj)==="[object Array]"){return obj}else{var ar=[];for(var i in obj){if(obj.hasOwnProperty(i)){ar.push(obj[i])}}return ar}},_compare=function(current,next){var i=0,n=0,tmp=0,nl=0,cl=0;if(current===next){return 0}else if(typeof current==="object"){if(typeof next==="object"){current=_obj2Array(current);next=_obj2Array(next);cl=current.length;nl=next.length;if(nl>cl){return 1}else if(nl<cl){return-1}for(i=0,n=cl;i<n;++i){tmp=_compare(current[i],next[i]);if(tmp==1){return 1}else if(tmp==-1){return-1}}return 0}return-1}else if(typeof next==="object"){return 1}else if(isNaN(next)&&!isNaN(current)){if(current==0){return 0}return current<0?1:-1}else if(isNaN(current)&&!isNaN(next)){if(next==0){return 0}return next>0?1:-1}if(next==current){return 0}return next>current?1:-1};if(argc===0){throw new Error("At least one value should be passed to max()")}else if(argc===1){if(typeof argv[0]==="object"){ar=_obj2Array(argv[0])}else{throw new Error("Wrong parameter count for max()")}if(ar.length===0){throw new Error("Array must contain at least one element for max()")}}else{ar=argv}retVal=ar[0];for(i=1,n=ar.length;i<n;++i){if(_compare(retVal,ar[i])==1){retVal=ar[i]}}return retVal};Twig.lib.min=function min(){var ar,retVal,i=0,n=0,argv=arguments,argc=argv.length,_obj2Array=function(obj){if(Object.prototype.toString.call(obj)==="[object Array]"){return obj}var ar=[];for(var i in obj){if(obj.hasOwnProperty(i)){ar.push(obj[i])}}return ar},_compare=function(current,next){var i=0,n=0,tmp=0,nl=0,cl=0;if(current===next){return 0}else if(typeof current==="object"){if(typeof next==="object"){current=_obj2Array(current);next=_obj2Array(next);cl=current.length;nl=next.length;if(nl>cl){return 1}else if(nl<cl){return-1}for(i=0,n=cl;i<n;++i){tmp=_compare(current[i],next[i]);if(tmp==1){return 1}else if(tmp==-1){return-1}}return 0}return-1}else if(typeof next==="object"){return 1}else if(isNaN(next)&&!isNaN(current)){if(current==0){return 0}return current<0?1:-1}else if(isNaN(current)&&!isNaN(next)){if(next==0){return 0}return next>0?1:-1}if(next==current){return 0}return next>current?1:-1};if(argc===0){throw new Error("At least one value should be passed to min()")}else if(argc===1){if(typeof argv[0]==="object"){ar=_obj2Array(argv[0])}else{throw new Error("Wrong parameter count for min()")}if(ar.length===0){throw new Error("Array must contain at least one element for min()")}}else{ar=argv}retVal=ar[0];for(i=1,n=ar.length;i<n;++i){if(_compare(retVal,ar[i])==-1){retVal=ar[i]}}return retVal};return Twig}(Twig||{});var Twig=function(Twig){"use strict";Twig.logic={};Twig.logic.type={if_:"Twig.logic.type.if",endif:"Twig.logic.type.endif",for_:"Twig.logic.type.for",endfor:"Twig.logic.type.endfor",else_:"Twig.logic.type.else",elseif:"Twig.logic.type.elseif",set:"Twig.logic.type.set",setcapture:"Twig.logic.type.setcapture",endset:"Twig.logic.type.endset",filter:"Twig.logic.type.filter",endfilter:"Twig.logic.type.endfilter",shortblock:"Twig.logic.type.shortblock",block:"Twig.logic.type.block",endblock:"Twig.logic.type.endblock",extends_:"Twig.logic.type.extends",use:"Twig.logic.type.use",include:"Twig.logic.type.include",spaceless:"Twig.logic.type.spaceless",endspaceless:"Twig.logic.type.endspaceless",macro:"Twig.logic.type.macro",endmacro:"Twig.logic.type.endmacro",import_:"Twig.logic.type.import",from:"Twig.logic.type.from",embed:"Twig.logic.type.embed",endembed:"Twig.logic.type.endembed"};Twig.logic.definitions=[{type:Twig.logic.type.if_,regex:/^if\s+([\s\S]+)$/,next:[Twig.logic.type.else_,Twig.logic.type.elseif,Twig.logic.type.endif],open:true,compile:function(token){var expression=token.match[1];token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;delete token.match;return token},parse:function(token,context,chain){var output="",result=Twig.expression.parse.apply(this,[token.stack,context]);chain=true;if(result){chain=false;output=Twig.parse.apply(this,[token.output,context])}return{chain:chain,output:output}}},{type:Twig.logic.type.elseif,regex:/^elseif\s+([^\s].*)$/,next:[Twig.logic.type.else_,Twig.logic.type.elseif,Twig.logic.type.endif],open:false,compile:function(token){var expression=token.match[1];token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;delete token.match;return token},parse:function(token,context,chain){var output="";if(chain&&Twig.expression.parse.apply(this,[token.stack,context])===true){chain=false;output=Twig.parse.apply(this,[token.output,context])}return{chain:chain,output:output}}},{type:Twig.logic.type.else_,regex:/^else$/,next:[Twig.logic.type.endif,Twig.logic.type.endfor],open:false,parse:function(token,context,chain){var output="";if(chain){output=Twig.parse.apply(this,[token.output,context])}return{chain:chain,output:output}}},{type:Twig.logic.type.endif,regex:/^endif$/,next:[],open:false},{type:Twig.logic.type.for_,regex:/^for\s+([a-zA-Z0-9_,\s]+)\s+in\s+([^\s].*?)(?:\s+if\s+([^\s].*))?$/,next:[Twig.logic.type.else_,Twig.logic.type.endfor],open:true,compile:function(token){var key_value=token.match[1],expression=token.match[2],conditional=token.match[3],kv_split=null;token.key_var=null;token.value_var=null;if(key_value.indexOf(",")>=0){kv_split=key_value.split(",");if(kv_split.length===2){token.key_var=kv_split[0].trim();token.value_var=kv_split[1].trim()}else{throw new Twig.Error("Invalid expression in for loop: "+key_value)}}else{token.value_var=key_value}token.expression=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;if(conditional){token.conditional=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:conditional}]).stack}delete token.match;return token},parse:function(token,context,continue_chain){var result=Twig.expression.parse.apply(this,[token.expression,context]),output=[],len,index=0,keyset,that=this,conditional=token.conditional,buildLoop=function(index,len){var isConditional=conditional!==undefined;return{index:index+1,index0:index,revindex:isConditional?undefined:len-index,revindex0:isConditional?undefined:len-index-1,first:index===0,last:isConditional?undefined:index===len-1,length:isConditional?undefined:len,parent:context}},loop=function(key,value){var inner_context=Twig.ChildContext(context);inner_context[token.value_var]=value;if(token.key_var){inner_context[token.key_var]=key}inner_context.loop=buildLoop(index,len);if(conditional===undefined||Twig.expression.parse.apply(that,[conditional,inner_context])){output.push(Twig.parse.apply(that,[token.output,inner_context]));index+=1}delete inner_context["loop"];delete inner_context[token.value_var];delete inner_context[token.key_var];Twig.merge(context,inner_context,true)};if(Twig.lib.is("Array",result)){len=result.length;Twig.forEach(result,function(value){var key=index;loop(key,value)})}else if(Twig.lib.is("Object",result)){if(result._keys!==undefined){keyset=result._keys}else{keyset=Object.keys(result)}len=keyset.length;Twig.forEach(keyset,function(key){if(key==="_keys")return;loop(key,result[key])})}continue_chain=output.length===0;return{chain:continue_chain,output:Twig.output.apply(this,[output])}}},{type:Twig.logic.type.endfor,regex:/^endfor$/,next:[],open:false},{type:Twig.logic.type.set,regex:/^set\s+([a-zA-Z0-9_,\s]+)\s*=\s*([\s\S]+)$/,next:[],open:true,compile:function(token){var key=token.match[1].trim(),expression=token.match[2],expression_stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;token.key=key;token.expression=expression_stack;delete token.match;return token},parse:function(token,context,continue_chain){var value=Twig.expression.parse.apply(this,[token.expression,context]),key=token.key;context[key]=value;return{chain:continue_chain,context:context}}},{type:Twig.logic.type.setcapture,regex:/^set\s+([a-zA-Z0-9_,\s]+)$/,next:[Twig.logic.type.endset],open:true,compile:function(token){var key=token.match[1].trim();token.key=key;delete token.match;return token},parse:function(token,context,continue_chain){var value=Twig.parse.apply(this,[token.output,context]),key=token.key;this.context[key]=value;context[key]=value;return{chain:continue_chain,context:context}}},{type:Twig.logic.type.endset,regex:/^endset$/,next:[],open:false},{type:Twig.logic.type.filter,regex:/^filter\s+(.+)$/,next:[Twig.logic.type.endfilter],open:true,compile:function(token){var expression="|"+token.match[1].trim();token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;delete token.match;return token},parse:function(token,context,chain){var unfiltered=Twig.parse.apply(this,[token.output,context]),stack=[{type:Twig.expression.type.string,value:unfiltered}].concat(token.stack);var output=Twig.expression.parse.apply(this,[stack,context]);return{chain:chain,output:output}}},{type:Twig.logic.type.endfilter,regex:/^endfilter$/,next:[],open:false},{type:Twig.logic.type.block,regex:/^block\s+([a-zA-Z0-9_]+)$/,next:[Twig.logic.type.endblock],open:true,compile:function(token){token.block=token.match[1].trim();delete token.match;return token},parse:function(token,context,chain){var block_output,output,isImported=this.importedBlocks.indexOf(token.block)>-1,hasParent=this.blocks[token.block]&&this.blocks[token.block].indexOf(Twig.placeholders.parent)>-1;if(this.blocks[token.block]===undefined||isImported||hasParent||context.loop||token.overwrite){if(token.expression){block_output=Twig.expression.parse.apply(this,[{type:Twig.expression.type.string,value:Twig.expression.parse.apply(this,[token.output,context])},context])}else{block_output=Twig.expression.parse.apply(this,[{type:Twig.expression.type.string,value:Twig.parse.apply(this,[token.output,context])},context])}if(isImported){this.importedBlocks.splice(this.importedBlocks.indexOf(token.block),1)}if(hasParent){this.blocks[token.block]=Twig.Markup(this.blocks[token.block].replace(Twig.placeholders.parent,block_output))}else{this.blocks[token.block]=block_output}this.originalBlockTokens[token.block]={type:token.type,block:token.block,output:token.output,overwrite:true}}if(this.child.blocks[token.block]){output=this.child.blocks[token.block]}else{output=this.blocks[token.block]}return{chain:chain,output:output}}},{type:Twig.logic.type.shortblock,regex:/^block\s+([a-zA-Z0-9_]+)\s+(.+)$/,next:[],open:true,compile:function(token){token.expression=token.match[2].trim();token.output=Twig.expression.compile({type:Twig.expression.type.expression,value:token.expression}).stack;token.block=token.match[1].trim();delete token.match;return token},parse:function(token,context,chain){return Twig.logic.handler[Twig.logic.type.block].parse.apply(this,arguments)}},{type:Twig.logic.type.endblock,regex:/^endblock(?:\s+([a-zA-Z0-9_]+))?$/,next:[],open:false},{type:Twig.logic.type.extends_,regex:/^extends\s+(.+)$/,next:[],open:true,compile:function(token){var expression=token.match[1].trim();delete token.match;token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;return token},parse:function(token,context,chain){var file=Twig.expression.parse.apply(this,[token.stack,context]);this.extend=file;return{chain:chain,output:""}}},{type:Twig.logic.type.use,regex:/^use\s+(.+)$/,next:[],open:true,compile:function(token){var expression=token.match[1].trim();delete token.match;token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;return token},parse:function(token,context,chain){var file=Twig.expression.parse.apply(this,[token.stack,context]);this.importBlocks(file);return{chain:chain,output:""}}},{type:Twig.logic.type.include,regex:/^include\s+(ignore missing\s+)?(.+?)\s*(?:with\s+([\S\s]+?))?\s*(only)?$/,next:[],open:true,compile:function(token){var match=token.match,includeMissing=match[1]!==undefined,expression=match[2].trim(),withContext=match[3],only=match[4]!==undefined&&match[4].length;delete token.match;token.only=only;token.includeMissing=includeMissing;token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;if(withContext!==undefined){token.withStack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:withContext.trim()}]).stack}return token},parse:function(token,context,chain){var innerContext={},withContext,i,template;if(!token.only){innerContext=Twig.ChildContext(context)}if(token.withStack!==undefined){withContext=Twig.expression.parse.apply(this,[token.withStack,context]);for(i in withContext){if(withContext.hasOwnProperty(i))innerContext[i]=withContext[i]}}var file=Twig.expression.parse.apply(this,[token.stack,innerContext]);if(file instanceof Twig.Template){template=file}else{template=this.importFile(file)}return{chain:chain,output:template.render(innerContext)}}},{type:Twig.logic.type.spaceless,regex:/^spaceless$/,next:[Twig.logic.type.endspaceless],open:true,parse:function(token,context,chain){var unfiltered=Twig.parse.apply(this,[token.output,context]),rBetweenTagSpaces=/>\s+</g,output=unfiltered.replace(rBetweenTagSpaces,"><").trim();return{chain:chain,output:output}}},{type:Twig.logic.type.endspaceless,regex:/^endspaceless$/,next:[],open:false},{type:Twig.logic.type.macro,regex:/^macro\s+([a-zA-Z0-9_]+)\s*\(\s*((?:[a-zA-Z0-9_]+(?:,\s*)?)*)\s*\)$/,next:[Twig.logic.type.endmacro],open:true,compile:function(token){var macroName=token.match[1],parameters=token.match[2].split(/[\s,]+/);for(var i=0;i<parameters.length;i++){for(var j=0;j<parameters.length;j++){if(parameters[i]===parameters[j]&&i!==j){throw new Twig.Error("Duplicate arguments for parameter: "+parameters[i])}}}token.macroName=macroName;token.parameters=parameters;delete token.match;return token},parse:function(token,context,chain){var template=this;this.macros[token.macroName]=function(){var macroContext={_self:template.macros};for(var i=0;i<token.parameters.length;i++){var prop=token.parameters[i];if(typeof arguments[i]!=="undefined"){macroContext[prop]=arguments[i]}else{macroContext[prop]=undefined}}return Twig.parse.apply(template,[token.output,macroContext])};return{chain:chain,output:""}}},{type:Twig.logic.type.endmacro,regex:/^endmacro$/,next:[],open:false},{type:Twig.logic.type.import_,regex:/^import\s+(.+)\s+as\s+([a-zA-Z0-9_]+)$/,next:[],open:true,compile:function(token){var expression=token.match[1].trim(),contextName=token.match[2].trim();delete token.match;token.expression=expression;token.contextName=contextName;token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;return token},parse:function(token,context,chain){if(token.expression!=="_self"){var file=Twig.expression.parse.apply(this,[token.stack,context]);var template=this.importFile(file||token.expression);context[token.contextName]=template.render({},{output:"macros"})}else{context[token.contextName]=this.macros}return{chain:chain,output:""}}},{type:Twig.logic.type.from,regex:/^from\s+(.+)\s+import\s+([a-zA-Z0-9_, ]+)$/,next:[],open:true,compile:function(token){var expression=token.match[1].trim(),macroExpressions=token.match[2].trim().split(/[ ,]+/),macroNames={};for(var i=0;i<macroExpressions.length;i++){var res=macroExpressions[i];var macroMatch=res.match(/^([a-zA-Z0-9_]+)\s+(.+)\s+as\s+([a-zA-Z0-9_]+)$/);if(macroMatch){macroNames[macroMatch[1].trim()]=macroMatch[2].trim()}else if(res.match(/^([a-zA-Z0-9_]+)$/)){macroNames[res]=res}else{}}delete token.match;token.expression=expression;token.macroNames=macroNames;token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;return token},parse:function(token,context,chain){var macros;if(token.expression!=="_self"){var file=Twig.expression.parse.apply(this,[token.stack,context]);var template=this.importFile(file||token.expression);macros=template.render({},{output:"macros"})}else{macros=this.macros}for(var macroName in token.macroNames){if(macros.hasOwnProperty(macroName)){context[token.macroNames[macroName]]=macros[macroName]}}return{chain:chain,output:""}}},{type:Twig.logic.type.embed,regex:/^embed\s+(ignore missing\s+)?(.+?)\s*(?:with\s+(.+?))?\s*(only)?$/,next:[Twig.logic.type.endembed],open:true,compile:function(token){var match=token.match,includeMissing=match[1]!==undefined,expression=match[2].trim(),withContext=match[3],only=match[4]!==undefined&&match[4].length;delete token.match;token.only=only;token.includeMissing=includeMissing;token.stack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:expression}]).stack;if(withContext!==undefined){token.withStack=Twig.expression.compile.apply(this,[{type:Twig.expression.type.expression,value:withContext.trim()}]).stack}return token},parse:function(token,context,chain){var innerContext={},withContext,i,template;if(!token.only){for(i in context){if(context.hasOwnProperty(i))innerContext[i]=context[i]}}if(token.withStack!==undefined){withContext=Twig.expression.parse.apply(this,[token.withStack,context]);for(i in withContext){if(withContext.hasOwnProperty(i))innerContext[i]=withContext[i]}}var file=Twig.expression.parse.apply(this,[token.stack,innerContext]);if(file instanceof Twig.Template){template=file}else{template=this.importFile(file)}this.blocks={};var output=Twig.parse.apply(this,[token.output,innerContext]);return{chain:chain,output:template.render(innerContext,{blocks:this.blocks})}}},{type:Twig.logic.type.endembed,regex:/^endembed$/,next:[],open:false}];Twig.logic.handler={};Twig.logic.extendType=function(type,value){value=value||"Twig.logic.type"+type;Twig.logic.type[type]=value};Twig.logic.extend=function(definition){if(!definition.type){throw new Twig.Error("Unable to extend logic definition. No type provided for "+definition)}else{Twig.logic.extendType(definition.type)}Twig.logic.handler[definition.type]=definition};while(Twig.logic.definitions.length>0){Twig.logic.extend(Twig.logic.definitions.shift())}Twig.logic.compile=function(raw_token){var expression=raw_token.value.trim(),token=Twig.logic.tokenize.apply(this,[expression]),token_template=Twig.logic.handler[token.type];if(token_template.compile){token=token_template.compile.apply(this,[token]);Twig.log.trace("Twig.logic.compile: ","Compiled logic token to ",token)}return token};Twig.logic.tokenize=function(expression){var token={},token_template_type=null,token_type=null,token_regex=null,regex_array=null,regex=null,match=null;expression=expression.trim();for(token_template_type in Twig.logic.handler){if(Twig.logic.handler.hasOwnProperty(token_template_type)){token_type=Twig.logic.handler[token_template_type].type;token_regex=Twig.logic.handler[token_template_type].regex;regex_array=[];if(token_regex instanceof Array){regex_array=token_regex}else{regex_array.push(token_regex)}while(regex_array.length>0){regex=regex_array.shift();match=regex.exec(expression.trim());if(match!==null){token.type=token_type;token.match=match;Twig.log.trace("Twig.logic.tokenize: ","Matched a ",token_type," regular expression of ",match);return token}}}}throw new Twig.Error("Unable to parse '"+expression.trim()+"'")};Twig.logic.parse=function(token,context,chain){var output="",token_template;context=context||{};Twig.log.debug("Twig.logic.parse: ","Parsing logic token ",token);token_template=Twig.logic.handler[token.type];if(token_template.parse){output=token_template.parse.apply(this,[token,context,chain])}return output};return Twig}(Twig||{});var Twig=function(Twig){"use strict";Twig.expression={};Twig.expression.reservedWords=["true","false","null","TRUE","FALSE","NULL","_context"];Twig.expression.type={comma:"Twig.expression.type.comma",operator:{unary:"Twig.expression.type.operator.unary",binary:"Twig.expression.type.operator.binary"},string:"Twig.expression.type.string",bool:"Twig.expression.type.bool",array:{start:"Twig.expression.type.array.start",end:"Twig.expression.type.array.end"},object:{start:"Twig.expression.type.object.start",end:"Twig.expression.type.object.end"},parameter:{start:"Twig.expression.type.parameter.start",end:"Twig.expression.type.parameter.end"},key:{period:"Twig.expression.type.key.period",brackets:"Twig.expression.type.key.brackets"},filter:"Twig.expression.type.filter",_function:"Twig.expression.type._function",variable:"Twig.expression.type.variable",number:"Twig.expression.type.number",_null:"Twig.expression.type.null",context:"Twig.expression.type.context",test:"Twig.expression.type.test"};Twig.expression.set={operations:[Twig.expression.type.filter,Twig.expression.type.operator.unary,Twig.expression.type.operator.binary,Twig.expression.type.array.end,Twig.expression.type.object.end,Twig.expression.type.parameter.end,Twig.expression.type.comma,Twig.expression.type.test],expressions:[Twig.expression.type._function,Twig.expression.type.bool,Twig.expression.type.string,Twig.expression.type.variable,Twig.expression.type.number,Twig.expression.type._null,Twig.expression.type.context,Twig.expression.type.parameter.start,Twig.expression.type.array.start,Twig.expression.type.object.start]};Twig.expression.set.operations_extended=Twig.expression.set.operations.concat([Twig.expression.type.key.period,Twig.expression.type.key.brackets]);Twig.expression.fn={compile:{push:function(token,stack,output){output.push(token)},push_both:function(token,stack,output){output.push(token);stack.push(token)}},parse:{push:function(token,stack,context){stack.push(token)},push_value:function(token,stack,context){stack.push(token.value)}}};Twig.expression.definitions=[{type:Twig.expression.type.test,regex:/^is\s+(not)?\s*([a-zA-Z_][a-zA-Z0-9_]*)/,next:Twig.expression.set.operations.concat([Twig.expression.type.parameter.start]),compile:function(token,stack,output){token.filter=token.match[2];token.modifier=token.match[1];delete token.match;delete token.value;output.push(token)},parse:function(token,stack,context){var value=stack.pop(),params=token.params&&Twig.expression.parse.apply(this,[token.params,context]),result=Twig.test(token.filter,value,params);if(token.modifier=="not"){stack.push(!result)}else{stack.push(result)}}},{type:Twig.expression.type.comma,regex:/^,/,next:Twig.expression.set.expressions.concat([Twig.expression.type.array.end,Twig.expression.type.object.end]),compile:function(token,stack,output){var i=stack.length-1,stack_token;delete token.match;delete token.value;for(;i>=0;i--){stack_token=stack.pop();if(stack_token.type===Twig.expression.type.object.start||stack_token.type===Twig.expression.type.parameter.start||stack_token.type===Twig.expression.type.array.start){stack.push(stack_token);break}output.push(stack_token)}output.push(token)}},{type:Twig.expression.type.operator.binary,regex:/(^[\+\-~%\?\:]|^[!=]==?|^[!<>]=?|^\*\*?|^\/\/?|^and\s+|^or\s+|^in\s+|^not in\s+|^\.\.)/,next:Twig.expression.set.expressions.concat([Twig.expression.type.operator.unary]),compile:function(token,stack,output){delete token.match;token.value=token.value.trim();var value=token.value,operator=Twig.expression.operator.lookup(value,token);Twig.log.trace("Twig.expression.compile: ","Operator: ",operator," from ",value);while(stack.length>0&&(stack[stack.length-1].type==Twig.expression.type.operator.unary||stack[stack.length-1].type==Twig.expression.type.operator.binary)&&(operator.associativity===Twig.expression.operator.leftToRight&&operator.precidence>=stack[stack.length-1].precidence||operator.associativity===Twig.expression.operator.rightToLeft&&operator.precidence>stack[stack.length-1].precidence)){var temp=stack.pop();output.push(temp)}if(value===":"){if(stack[stack.length-1]&&stack[stack.length-1].value==="?"){}else{var key_token=output.pop();if(key_token.type===Twig.expression.type.string||key_token.type===Twig.expression.type.variable){token.key=key_token.value}else if(key_token.type===Twig.expression.type.number){token.key=key_token.value.toString()}else if(key_token.type===Twig.expression.type.parameter.end&&key_token.expression){token.params=key_token.params}else{throw new Twig.Error("Unexpected value before ':' of "+key_token.type+" = "+key_token.value)}output.push(token);return}}else{stack.push(operator)}},parse:function(token,stack,context){if(token.key){stack.push(token)}else if(token.params){token.key=Twig.expression.parse.apply(this,[token.params,context]);stack.push(token);delete token.params}else{Twig.expression.operator.parse(token.value,stack)}}},{type:Twig.expression.type.operator.unary,regex:/(^not\s+)/,next:Twig.expression.set.expressions,compile:function(token,stack,output){delete token.match;token.value=token.value.trim();var value=token.value,operator=Twig.expression.operator.lookup(value,token);Twig.log.trace("Twig.expression.compile: ","Operator: ",operator," from ",value);while(stack.length>0&&(stack[stack.length-1].type==Twig.expression.type.operator.unary||stack[stack.length-1].type==Twig.expression.type.operator.binary)&&(operator.associativity===Twig.expression.operator.leftToRight&&operator.precidence>=stack[stack.length-1].precidence||operator.associativity===Twig.expression.operator.rightToLeft&&operator.precidence>stack[stack.length-1].precidence)){var temp=stack.pop();output.push(temp)}stack.push(operator)},parse:function(token,stack,context){Twig.expression.operator.parse(token.value,stack)}},{type:Twig.expression.type.string,regex:/^(["'])(?:(?=(\\?))\2[\s\S])*?\1/,next:Twig.expression.set.operations,compile:function(token,stack,output){var value=token.value;delete token.match;if(value.substring(0,1)==='"'){value=value.replace('\\"','"')}else{value=value.replace("\\'","'")}token.value=value.substring(1,value.length-1).replace(/\\n/g,"\n").replace(/\\r/g,"\r");Twig.log.trace("Twig.expression.compile: ","String value: ",token.value);output.push(token)},parse:Twig.expression.fn.parse.push_value},{type:Twig.expression.type.parameter.start,regex:/^\(/,next:Twig.expression.set.expressions.concat([Twig.expression.type.parameter.end]),compile:Twig.expression.fn.compile.push_both,parse:Twig.expression.fn.parse.push},{type:Twig.expression.type.parameter.end,regex:/^\)/,next:Twig.expression.set.operations_extended,compile:function(token,stack,output){var stack_token,end_token=token;stack_token=stack.pop();while(stack.length>0&&stack_token.type!=Twig.expression.type.parameter.start){output.push(stack_token);stack_token=stack.pop()}var param_stack=[];while(token.type!==Twig.expression.type.parameter.start){param_stack.unshift(token);token=output.pop()}param_stack.unshift(token);var is_expression=false;token=output[output.length-1];if(token===undefined||token.type!==Twig.expression.type._function&&token.type!==Twig.expression.type.filter&&token.type!==Twig.expression.type.test&&token.type!==Twig.expression.type.key.brackets&&token.type!==Twig.expression.type.key.period){end_token.expression=true;param_stack.pop();param_stack.shift();end_token.params=param_stack;output.push(end_token)}else{end_token.expression=false;token.params=param_stack}},parse:function(token,stack,context){var new_array=[],array_ended=false,value=null;if(token.expression){value=Twig.expression.parse.apply(this,[token.params,context]);stack.push(value)}else{while(stack.length>0){value=stack.pop();if(value&&value.type&&value.type==Twig.expression.type.parameter.start){array_ended=true;break}new_array.unshift(value)}if(!array_ended){throw new Twig.Error("Expected end of parameter set.")}stack.push(new_array)}}},{type:Twig.expression.type.array.start,regex:/^\[/,next:Twig.expression.set.expressions.concat([Twig.expression.type.array.end]),compile:Twig.expression.fn.compile.push_both,parse:Twig.expression.fn.parse.push},{type:Twig.expression.type.array.end,regex:/^\]/,next:Twig.expression.set.operations_extended,compile:function(token,stack,output){var i=stack.length-1,stack_token;for(;i>=0;i--){stack_token=stack.pop();if(stack_token.type===Twig.expression.type.array.start){break}output.push(stack_token)}output.push(token)},parse:function(token,stack,context){var new_array=[],array_ended=false,value=null;while(stack.length>0){value=stack.pop();if(value.type&&value.type==Twig.expression.type.array.start){array_ended=true;break}new_array.unshift(value)}if(!array_ended){throw new Twig.Error("Expected end of array.")}stack.push(new_array)}},{type:Twig.expression.type.object.start,regex:/^\{/,next:Twig.expression.set.expressions.concat([Twig.expression.type.object.end]),compile:Twig.expression.fn.compile.push_both,parse:Twig.expression.fn.parse.push},{type:Twig.expression.type.object.end,regex:/^\}/,next:Twig.expression.set.operations_extended,compile:function(token,stack,output){var i=stack.length-1,stack_token;for(;i>=0;i--){stack_token=stack.pop();if(stack_token&&stack_token.type===Twig.expression.type.object.start){break}output.push(stack_token)}output.push(token)},parse:function(end_token,stack,context){var new_object={},object_ended=false,token=null,token_key=null,has_value=false,value=null;while(stack.length>0){token=stack.pop();if(token&&token.type&&token.type===Twig.expression.type.object.start){object_ended=true;break}if(token&&token.type&&(token.type===Twig.expression.type.operator.binary||token.type===Twig.expression.type.operator.unary)&&token.key){if(!has_value){throw new Twig.Error("Missing value for key '"+token.key+"' in object definition.");
	}new_object[token.key]=value;if(new_object._keys===undefined)new_object._keys=[];new_object._keys.unshift(token.key);value=null;has_value=false}else{has_value=true;value=token}}if(!object_ended){throw new Twig.Error("Unexpected end of object.")}stack.push(new_object)}},{type:Twig.expression.type.filter,regex:/^\|\s?([a-zA-Z_][a-zA-Z0-9_\-]*)/,next:Twig.expression.set.operations_extended.concat([Twig.expression.type.parameter.start]),compile:function(token,stack,output){token.value=token.match[1];output.push(token)},parse:function(token,stack,context){var input=stack.pop(),params=token.params&&Twig.expression.parse.apply(this,[token.params,context]);stack.push(Twig.filter.apply(this,[token.value,input,params]))}},{type:Twig.expression.type._function,regex:/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/,next:Twig.expression.type.parameter.start,transform:function(match,tokens){return"("},compile:function(token,stack,output){var fn=token.match[1];token.fn=fn;delete token.match;delete token.value;output.push(token)},parse:function(token,stack,context){var params=token.params&&Twig.expression.parse.apply(this,[token.params,context]),fn=token.fn,value;if(Twig.functions[fn]){value=Twig.functions[fn].apply(this,params)}else if(typeof context[fn]=="function"){value=context[fn].apply(context,params)}else{throw new Twig.Error(fn+" function does not exist and is not defined in the context")}stack.push(value)}},{type:Twig.expression.type.variable,regex:/^[a-zA-Z_][a-zA-Z0-9_]*/,next:Twig.expression.set.operations_extended.concat([Twig.expression.type.parameter.start]),compile:Twig.expression.fn.compile.push,validate:function(match,tokens){return Twig.indexOf(Twig.expression.reservedWords,match[0])<0},parse:function(token,stack,context){var value=Twig.expression.resolve(context[token.value],context);stack.push(value)}},{type:Twig.expression.type.key.period,regex:/^\.([a-zA-Z0-9_]+)/,next:Twig.expression.set.operations_extended.concat([Twig.expression.type.parameter.start]),compile:function(token,stack,output){token.key=token.match[1];delete token.match;delete token.value;output.push(token)},parse:function(token,stack,context){var params=token.params&&Twig.expression.parse.apply(this,[token.params,context]),key=token.key,object=stack.pop(),value;if(object===null||object===undefined){if(this.options.strict_variables){throw new Twig.Error("Can't access a key "+key+" on an null or undefined object.")}else{return null}}var capitalize=function(value){return value.substr(0,1).toUpperCase()+value.substr(1)};if(typeof object==="object"&&key in object){value=object[key]}else if(object["get"+capitalize(key)]!==undefined){value=object["get"+capitalize(key)]}else if(object["is"+capitalize(key)]!==undefined){value=object["is"+capitalize(key)]}else{value=null}stack.push(Twig.expression.resolve(value,object,params))}},{type:Twig.expression.type.key.brackets,regex:/^\[([^\]]*)\]/,next:Twig.expression.set.operations_extended.concat([Twig.expression.type.parameter.start]),compile:function(token,stack,output){var match=token.match[1];delete token.value;delete token.match;token.stack=Twig.expression.compile({value:match}).stack;output.push(token)},parse:function(token,stack,context){var params=token.params&&Twig.expression.parse.apply(this,[token.params,context]),key=Twig.expression.parse.apply(this,[token.stack,context]),object=stack.pop(),value;if(object===null||object===undefined){if(this.options.strict_variables){throw new Twig.Error("Can't access a key "+key+" on an null or undefined object.")}else{return null}}if(typeof object==="object"&&key in object){value=object[key]}else{value=null}stack.push(Twig.expression.resolve(value,object,params))}},{type:Twig.expression.type._null,regex:/^(null|NULL|none|NONE)/,next:Twig.expression.set.operations,compile:function(token,stack,output){delete token.match;token.value=null;output.push(token)},parse:Twig.expression.fn.parse.push_value},{type:Twig.expression.type.context,regex:/^_context/,next:Twig.expression.set.operations_extended.concat([Twig.expression.type.parameter.start]),compile:Twig.expression.fn.compile.push,parse:function(token,stack,context){stack.push(context)}},{type:Twig.expression.type.number,regex:/^\-?\d+(\.\d+)?/,next:Twig.expression.set.operations,compile:function(token,stack,output){token.value=Number(token.value);output.push(token)},parse:Twig.expression.fn.parse.push_value},{type:Twig.expression.type.bool,regex:/^(true|TRUE|false|FALSE)/,next:Twig.expression.set.operations,compile:function(token,stack,output){token.value=token.match[0].toLowerCase()==="true";delete token.match;output.push(token)},parse:Twig.expression.fn.parse.push_value}];Twig.expression.resolve=function(value,context,params){if(typeof value=="function"){return value.apply(context,params||[])}else{return value}};Twig.expression.handler={};Twig.expression.extendType=function(type){Twig.expression.type[type]="Twig.expression.type."+type};Twig.expression.extend=function(definition){if(!definition.type){throw new Twig.Error("Unable to extend logic definition. No type provided for "+definition)}Twig.expression.handler[definition.type]=definition};while(Twig.expression.definitions.length>0){Twig.expression.extend(Twig.expression.definitions.shift())}Twig.expression.tokenize=function(expression){var tokens=[],exp_offset=0,next=null,type,regex,regex_array,token_next,match_found,invalid_matches=[],match_function;match_function=function(){var match=Array.prototype.slice.apply(arguments),string=match.pop(),offset=match.pop();Twig.log.trace("Twig.expression.tokenize","Matched a ",type," regular expression of ",match);if(next&&Twig.indexOf(next,type)<0){invalid_matches.push(type+" cannot follow a "+tokens[tokens.length-1].type+" at template:"+exp_offset+" near '"+match[0].substring(0,20)+"...'");return match[0]}if(Twig.expression.handler[type].validate&&!Twig.expression.handler[type].validate(match,tokens)){return match[0]}invalid_matches=[];tokens.push({type:type,value:match[0],match:match});match_found=true;next=token_next;exp_offset+=match[0].length;if(Twig.expression.handler[type].transform){return Twig.expression.handler[type].transform(match,tokens)}return""};Twig.log.debug("Twig.expression.tokenize","Tokenizing expression ",expression);while(expression.length>0){expression=expression.trim();for(type in Twig.expression.handler){if(Twig.expression.handler.hasOwnProperty(type)){token_next=Twig.expression.handler[type].next;regex=Twig.expression.handler[type].regex;if(regex instanceof Array){regex_array=regex}else{regex_array=[regex]}match_found=false;while(regex_array.length>0){regex=regex_array.pop();expression=expression.replace(regex,match_function)}if(match_found){break}}}if(!match_found){if(invalid_matches.length>0){throw new Twig.Error(invalid_matches.join(" OR "))}else{throw new Twig.Error("Unable to parse '"+expression+"' at template position"+exp_offset)}}}Twig.log.trace("Twig.expression.tokenize","Tokenized to ",tokens);return tokens};Twig.expression.compile=function(raw_token){var expression=raw_token.value,tokens=Twig.expression.tokenize(expression),token=null,output=[],stack=[],token_template=null;Twig.log.trace("Twig.expression.compile: ","Compiling ",expression);while(tokens.length>0){token=tokens.shift();token_template=Twig.expression.handler[token.type];Twig.log.trace("Twig.expression.compile: ","Compiling ",token);token_template.compile&&token_template.compile(token,stack,output);Twig.log.trace("Twig.expression.compile: ","Stack is",stack);Twig.log.trace("Twig.expression.compile: ","Output is",output)}while(stack.length>0){output.push(stack.pop())}Twig.log.trace("Twig.expression.compile: ","Final output is",output);raw_token.stack=output;delete raw_token.value;return raw_token};Twig.expression.parse=function(tokens,context){var that=this;if(!(tokens instanceof Array)){tokens=[tokens]}var stack=[],token_template=null;Twig.forEach(tokens,function(token){token_template=Twig.expression.handler[token.type];token_template.parse&&token_template.parse.apply(that,[token,stack,context])});return stack.pop()};return Twig}(Twig||{});var Twig=function(Twig){"use strict";Twig.expression.operator={leftToRight:"leftToRight",rightToLeft:"rightToLeft"};var containment=function(a,b){if(b.indexOf!==undefined){return a===b||a!==""&&b.indexOf(a)>-1}else{var el;for(el in b){if(b.hasOwnProperty(el)&&b[el]===a){return true}}return false}};Twig.expression.operator.lookup=function(operator,token){switch(operator){case"..":case"not in":case"in":token.precidence=20;token.associativity=Twig.expression.operator.leftToRight;break;case",":token.precidence=18;token.associativity=Twig.expression.operator.leftToRight;break;case"?":case":":token.precidence=16;token.associativity=Twig.expression.operator.rightToLeft;break;case"or":token.precidence=14;token.associativity=Twig.expression.operator.leftToRight;break;case"and":token.precidence=13;token.associativity=Twig.expression.operator.leftToRight;break;case"==":case"!=":token.precidence=9;token.associativity=Twig.expression.operator.leftToRight;break;case"<":case"<=":case">":case">=":token.precidence=8;token.associativity=Twig.expression.operator.leftToRight;break;case"~":case"+":case"-":token.precidence=6;token.associativity=Twig.expression.operator.leftToRight;break;case"//":case"**":case"*":case"/":case"%":token.precidence=5;token.associativity=Twig.expression.operator.leftToRight;break;case"not":token.precidence=3;token.associativity=Twig.expression.operator.rightToLeft;break;default:throw new Twig.Error(operator+" is an unknown operator.")}token.operator=operator;return token};Twig.expression.operator.parse=function(operator,stack){Twig.log.trace("Twig.expression.operator.parse: ","Handling ",operator);var a,b,c;switch(operator){case":":break;case"?":c=stack.pop();b=stack.pop();a=stack.pop();if(a){stack.push(b)}else{stack.push(c)}break;case"+":b=parseFloat(stack.pop());a=parseFloat(stack.pop());stack.push(a+b);break;case"-":b=parseFloat(stack.pop());a=parseFloat(stack.pop());stack.push(a-b);break;case"*":b=parseFloat(stack.pop());a=parseFloat(stack.pop());stack.push(a*b);break;case"/":b=parseFloat(stack.pop());a=parseFloat(stack.pop());stack.push(a/b);break;case"//":b=parseFloat(stack.pop());a=parseFloat(stack.pop());stack.push(parseInt(a/b));break;case"%":b=parseFloat(stack.pop());a=parseFloat(stack.pop());stack.push(a%b);break;case"~":b=stack.pop();a=stack.pop();stack.push((a!=null?a.toString():"")+(b!=null?b.toString():""));break;case"not":case"!":stack.push(!stack.pop());break;case"<":b=stack.pop();a=stack.pop();stack.push(a<b);break;case"<=":b=stack.pop();a=stack.pop();stack.push(a<=b);break;case">":b=stack.pop();a=stack.pop();stack.push(a>b);break;case">=":b=stack.pop();a=stack.pop();stack.push(a>=b);break;case"===":b=stack.pop();a=stack.pop();stack.push(a===b);break;case"==":b=stack.pop();a=stack.pop();stack.push(a==b);break;case"!==":b=stack.pop();a=stack.pop();stack.push(a!==b);break;case"!=":b=stack.pop();a=stack.pop();stack.push(a!=b);break;case"or":b=stack.pop();a=stack.pop();stack.push(a||b);break;case"and":b=stack.pop();a=stack.pop();stack.push(a&&b);break;case"**":b=stack.pop();a=stack.pop();stack.push(Math.pow(a,b));break;case"not in":b=stack.pop();a=stack.pop();stack.push(!containment(a,b));break;case"in":b=stack.pop();a=stack.pop();stack.push(containment(a,b));break;case"..":b=stack.pop();a=stack.pop();stack.push(Twig.functions.range(a,b));break;default:throw new Twig.Error(operator+" is an unknown operator.")}};return Twig}(Twig||{});var Twig=function(Twig){function is(type,obj){var clas=Object.prototype.toString.call(obj).slice(8,-1);return obj!==undefined&&obj!==null&&clas===type}Twig.filters={upper:function(value){if(typeof value!=="string"){return value}return value.toUpperCase()},lower:function(value){if(typeof value!=="string"){return value}return value.toLowerCase()},capitalize:function(value){if(typeof value!=="string"){return value}return value.substr(0,1).toUpperCase()+value.toLowerCase().substr(1)},title:function(value){if(typeof value!=="string"){return value}return value.toLowerCase().replace(/(^|\s)([a-z])/g,function(m,p1,p2){return p1+p2.toUpperCase()})},length:function(value){if(Twig.lib.is("Array",value)||typeof value==="string"){return value.length}else if(Twig.lib.is("Object",value)){if(value._keys===undefined){return Object.keys(value).length}else{return value._keys.length}}else{return 0}},reverse:function(value){if(is("Array",value)){return value.reverse()}else if(is("String",value)){return value.split("").reverse().join("")}else if(is("Object",value)){var keys=value._keys||Object.keys(value).reverse();value._keys=keys;return value}},sort:function(value){if(is("Array",value)){return value.sort()}else if(is("Object",value)){delete value._keys;var keys=Object.keys(value),sorted_keys=keys.sort(function(a,b){var a1,a2;if(value[a]>value[b]==!(value[a]<=value[b])){return value[a]>value[b]?1:value[a]<value[b]?-1:0}else if(!isNaN(a1=parseFloat(value[a]))&&!isNaN(b1=parseFloat(value[b]))){return a1>b1?1:a1<b1?-1:0}else if(typeof value[a]=="string"){return value[a]>value[b].toString()?1:value[a]<value[b].toString()?-1:0}else if(typeof value[b]=="string"){return value[a].toString()>value[b]?1:value[a].toString()<value[b]?-1:0}else{return null}});value._keys=sorted_keys;return value}},keys:function(value){if(value===undefined||value===null){return}var keyset=value._keys||Object.keys(value),output=[];Twig.forEach(keyset,function(key){if(key==="_keys")return;if(value.hasOwnProperty(key)){output.push(key)}});return output},url_encode:function(value){if(value===undefined||value===null){return}var result=encodeURIComponent(value);result=result.replace("'","%27");return result},join:function(value,params){if(value===undefined||value===null){return}var join_str="",output=[],keyset=null;if(params&&params[0]){join_str=params[0]}if(is("Array",value)){output=value}else{keyset=value._keys||Object.keys(value);Twig.forEach(keyset,function(key){if(key==="_keys")return;if(value.hasOwnProperty(key)){output.push(value[key])}})}return output.join(join_str)},"default":function(value,params){if(params!==undefined&&params.length>1){throw new Twig.Error("default filter expects one argument")}if(value===undefined||value===null||value===""){if(params===undefined){return""}return params[0]}else{return value}},json_encode:function(value){if(value===undefined||value===null){return"null"}else if(typeof value=="object"&&is("Array",value)){output=[];Twig.forEach(value,function(v){output.push(Twig.filters.json_encode(v))});return"["+output.join(",")+"]"}else if(typeof value=="object"){var keyset=value._keys||Object.keys(value),output=[];Twig.forEach(keyset,function(key){output.push(JSON.stringify(key)+":"+Twig.filters.json_encode(value[key]))});return"{"+output.join(",")+"}"}else{return JSON.stringify(value)}},merge:function(value,params){var obj=[],arr_index=0,keyset=[];if(!is("Array",value)){obj={}}else{Twig.forEach(params,function(param){if(!is("Array",param)){obj={}}})}if(!is("Array",obj)){obj._keys=[]}if(is("Array",value)){Twig.forEach(value,function(val){if(obj._keys)obj._keys.push(arr_index);obj[arr_index]=val;arr_index++})}else{keyset=value._keys||Object.keys(value);Twig.forEach(keyset,function(key){obj[key]=value[key];obj._keys.push(key);var int_key=parseInt(key,10);if(!isNaN(int_key)&&int_key>=arr_index){arr_index=int_key+1}})}Twig.forEach(params,function(param){if(is("Array",param)){Twig.forEach(param,function(val){if(obj._keys)obj._keys.push(arr_index);obj[arr_index]=val;arr_index++})}else{keyset=param._keys||Object.keys(param);Twig.forEach(keyset,function(key){if(!obj[key])obj._keys.push(key);obj[key]=param[key];var int_key=parseInt(key,10);if(!isNaN(int_key)&&int_key>=arr_index){arr_index=int_key+1}})}});if(params.length===0){throw new Twig.Error("Filter merge expects at least one parameter")}return obj},date:function(value,params){var date=Twig.functions.date(value);var format=params&&params.length?params[0]:"F j, Y H:i";return Twig.lib.formatDate(date,format)},date_modify:function(value,params){if(value===undefined||value===null){return}if(params===undefined||params.length!==1){throw new Twig.Error("date_modify filter expects 1 argument")}var modifyText=params[0],time;if(Twig.lib.is("Date",value)){time=Twig.lib.strtotime(modifyText,value.getTime()/1e3)}if(Twig.lib.is("String",value)){time=Twig.lib.strtotime(modifyText,Twig.lib.strtotime(value))}if(Twig.lib.is("Number",value)){time=Twig.lib.strtotime(modifyText,value)}return new Date(time*1e3)},replace:function(value,params){if(value===undefined||value===null){return}var pairs=params[0],tag;for(tag in pairs){if(pairs.hasOwnProperty(tag)&&tag!=="_keys"){value=Twig.lib.replaceAll(value,tag,pairs[tag])}}return value},format:function(value,params){if(value===undefined||value===null){return}return Twig.lib.vsprintf(value,params)},striptags:function(value){if(value===undefined||value===null){return}return Twig.lib.strip_tags(value)},escape:function(value,params){if(value===undefined||value===null){return}var strategy="html";if(params&&params.length&&params[0]!==true)strategy=params[0];if(strategy=="html"){var raw_value=value.toString().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");return Twig.Markup(raw_value,"html")}else if(strategy=="js"){var raw_value=value.toString();var result="";for(var i=0;i<raw_value.length;i++){if(raw_value[i].match(/^[a-zA-Z0-9,\._]$/))result+=raw_value[i];else{var char_code=raw_value.charCodeAt(i);if(char_code<128)result+="\\x"+char_code.toString(16).toUpperCase();else result+=Twig.lib.sprintf("\\u%04s",char_code.toString(16).toUpperCase())}}return Twig.Markup(result,"js")}else if(strategy=="css"){var raw_value=value.toString();var result="";for(var i=0;i<raw_value.length;i++){if(raw_value[i].match(/^[a-zA-Z0-9]$/))result+=raw_value[i];else{var char_code=raw_value.charCodeAt(i);result+="\\"+char_code.toString(16).toUpperCase()+" "}}return Twig.Markup(result,"css")}else if(strategy=="url"){var result=Twig.filters.url_encode(value);return Twig.Markup(result,"url")}else if(strategy=="html_attr"){var raw_value=value.toString();var result="";for(var i=0;i<raw_value.length;i++){if(raw_value[i].match(/^[a-zA-Z0-9,\.\-_]$/))result+=raw_value[i];else if(raw_value[i].match(/^[&<>"]$/))result+=raw_value[i].replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");else{var char_code=raw_value.charCodeAt(i);if(char_code<=31&&char_code!=9&&char_code!=10&&char_code!=13)result+="&#xFFFD;";else if(char_code<128)result+=Twig.lib.sprintf("&#x%02s;",char_code.toString(16).toUpperCase());else result+=Twig.lib.sprintf("&#x%04s;",char_code.toString(16).toUpperCase())}}return Twig.Markup(result,"html_attr")}else{throw new Twig.Error("escape strategy unsupported")}},e:function(value,params){return Twig.filters.escape(value,params)},nl2br:function(value){if(value===undefined||value===null){return}var linebreak_tag="BACKSLASH_n_replace",br="<br />"+linebreak_tag;value=Twig.filters.escape(value).replace(/\r\n/g,br).replace(/\r/g,br).replace(/\n/g,br);value=Twig.lib.replaceAll(value,linebreak_tag,"\n");return Twig.Markup(value)},number_format:function(value,params){var number=value,decimals=params&&params[0]?params[0]:undefined,dec=params&&params[1]!==undefined?params[1]:".",sep=params&&params[2]!==undefined?params[2]:",";number=(number+"").replace(/[^0-9+\-Ee.]/g,"");var n=!isFinite(+number)?0:+number,prec=!isFinite(+decimals)?0:Math.abs(decimals),s="",toFixedFix=function(n,prec){var k=Math.pow(10,prec);return""+Math.round(n*k)/k};s=(prec?toFixedFix(n,prec):""+Math.round(n)).split(".");if(s[0].length>3){s[0]=s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g,sep)}if((s[1]||"").length<prec){s[1]=s[1]||"";s[1]+=new Array(prec-s[1].length+1).join("0")}return s.join(dec)},trim:function(value,params){if(value===undefined||value===null){return}var str=Twig.filters.escape(""+value),whitespace;if(params&&params[0]){whitespace=""+params[0]}else{whitespace=" \n\r	\f            ​\u2028\u2029　"}for(var i=0;i<str.length;i++){if(whitespace.indexOf(str.charAt(i))===-1){str=str.substring(i);break}}for(i=str.length-1;i>=0;i--){if(whitespace.indexOf(str.charAt(i))===-1){str=str.substring(0,i+1);break}}return whitespace.indexOf(str.charAt(0))===-1?str:""},truncate:function(value,params){var length=30,preserve=false,separator="...";value=value+"";if(params){if(params[0]){length=params[0]}if(params[1]){preserve=params[1]}if(params[2]){separator=params[2]}}if(value.length>length){if(preserve){length=value.indexOf(" ",length);if(length===-1){return value}}value=value.substr(0,length)+separator}return value},slice:function(value,params){if(value===undefined||value===null){return}if(params===undefined||params.length<1){throw new Twig.Error("slice filter expects at least 1 argument")}var start=params[0]||0;var length=params.length>1?params[1]:value.length;var startIndex=start>=0?start:Math.max(value.length+start,0);if(Twig.lib.is("Array",value)){var output=[];for(var i=startIndex;i<startIndex+length&&i<value.length;i++){output.push(value[i])}return output}else if(Twig.lib.is("String",value)){return value.substr(startIndex,length)}else{throw new Twig.Error("slice filter expects value to be an array or string")}},abs:function(value){if(value===undefined||value===null){return}return Math.abs(value)},first:function(value){if(is("Array",value)){return value[0]}else if(is("Object",value)){if("_keys"in value){return value[value._keys[0]]}}else if(typeof value==="string"){return value.substr(0,1)}return},split:function(value,params){if(value===undefined||value===null){return}if(params===undefined||params.length<1||params.length>2){throw new Twig.Error("split filter expects 1 or 2 argument")}if(Twig.lib.is("String",value)){var delimiter=params[0],limit=params[1],split=value.split(delimiter);if(limit===undefined){return split}else if(limit<0){return value.split(delimiter,split.length+limit)}else{var limitedSplit=[];if(delimiter==""){while(split.length>0){var temp="";for(var i=0;i<limit&&split.length>0;i++){temp+=split.shift()}limitedSplit.push(temp)}}else{for(var i=0;i<limit-1&&split.length>0;i++){limitedSplit.push(split.shift())}if(split.length>0){limitedSplit.push(split.join(delimiter))}}return limitedSplit}}else{throw new Twig.Error("split filter expects value to be a string")}},last:function(value){if(Twig.lib.is("Object",value)){var keys;if(value._keys===undefined){keys=Object.keys(value)}else{keys=value._keys}return value[keys[keys.length-1]]}return value[value.length-1]},raw:function(value){return Twig.Markup(value)},batch:function(items,params){var size=params.shift(),fill=params.shift(),result,last,missing;if(!Twig.lib.is("Array",items)){throw new Twig.Error("batch filter expects items to be an array")}if(!Twig.lib.is("Number",size)){throw new Twig.Error("batch filter expects size to be a number")}size=Math.ceil(size);result=Twig.lib.chunkArray(items,size);if(fill&&items.length%size!=0){last=result.pop();missing=size-last.length;while(missing--){last.push(fill)}result.push(last)}return result},round:function(value,params){params=params||[];var precision=params.length>0?params[0]:0,method=params.length>1?params[1]:"common";value=parseFloat(value);if(precision&&!Twig.lib.is("Number",precision)){throw new Twig.Error("round filter expects precision to be a number")}if(method==="common"){return Twig.lib.round(value,precision)}if(!Twig.lib.is("Function",Math[method])){throw new Twig.Error("round filter expects method to be 'floor', 'ceil', or 'common'")}return Math[method](value*Math.pow(10,precision))/Math.pow(10,precision)}};Twig.filter=function(filter,value,params){if(!Twig.filters[filter]){throw"Unable to find filter "+filter}return Twig.filters[filter].apply(this,[value,params])};Twig.filter.extend=function(filter,definition){Twig.filters[filter]=definition};return Twig}(Twig||{});var Twig=function(Twig){function is(type,obj){var clas=Object.prototype.toString.call(obj).slice(8,-1);return obj!==undefined&&obj!==null&&clas===type}Twig.functions={range:function(low,high,step){var matrix=[];var inival,endval,plus;var walker=step||1;var chars=false;if(!isNaN(low)&&!isNaN(high)){inival=parseInt(low,10);endval=parseInt(high,10)}else if(isNaN(low)&&isNaN(high)){chars=true;inival=low.charCodeAt(0);endval=high.charCodeAt(0)}else{inival=isNaN(low)?0:low;endval=isNaN(high)?0:high}plus=inival>endval?false:true;if(plus){while(inival<=endval){matrix.push(chars?String.fromCharCode(inival):inival);inival+=walker}}else{while(inival>=endval){matrix.push(chars?String.fromCharCode(inival):inival);inival-=walker}}return matrix},cycle:function(arr,i){var pos=i%arr.length;return arr[pos]},dump:function(){var EOL="\n",indentChar="  ",indentTimes=0,out="",args=Array.prototype.slice.call(arguments),indent=function(times){var ind="";while(times>0){times--;ind+=indentChar}return ind},displayVar=function(variable){out+=indent(indentTimes);if(typeof variable==="object"){dumpVar(variable)}else if(typeof variable==="function"){out+="function()"+EOL}else if(typeof variable==="string"){out+="string("+variable.length+') "'+variable+'"'+EOL}else if(typeof variable==="number"){out+="number("+variable+")"+EOL}else if(typeof variable==="boolean"){out+="bool("+variable+")"+EOL}},dumpVar=function(variable){var i;if(variable===null){out+="NULL"+EOL}else if(variable===undefined){out+="undefined"+EOL}else if(typeof variable==="object"){out+=indent(indentTimes)+typeof variable;indentTimes++;out+="("+function(obj){var size=0,key;for(key in obj){if(obj.hasOwnProperty(key)){size++}}return size}(variable)+") {"+EOL;for(i in variable){out+=indent(indentTimes)+"["+i+"]=> "+EOL;displayVar(variable[i])}indentTimes--;out+=indent(indentTimes)+"}"+EOL}else{displayVar(variable)}};if(args.length==0)args.push(this.context);Twig.forEach(args,function(variable){dumpVar(variable)});return out},date:function(date,time){var dateObj;if(date===undefined){dateObj=new Date}else if(Twig.lib.is("Date",date)){dateObj=date}else if(Twig.lib.is("String",date)){if(date.match(/^[0-9]+$/)){dateObj=new Date(date*1e3)}else{dateObj=new Date(Twig.lib.strtotime(date)*1e3)}}else if(Twig.lib.is("Number",date)){dateObj=new Date(date*1e3)}else{throw new Twig.Error("Unable to parse date "+date)}return dateObj},block:function(block){if(this.originalBlockTokens[block]){return Twig.logic.parse.apply(this,[this.originalBlockTokens[block],this.context]).output}else{return this.blocks[block]}},parent:function(){return Twig.placeholders.parent},attribute:function(object,method,params){if(Twig.lib.is("Object",object)){if(object.hasOwnProperty(method)){if(typeof object[method]==="function"){return object[method].apply(undefined,params)}else{return object[method]}}}return object[method]||undefined},max:function(values){if(Twig.lib.is("Object",values)){delete values["_keys"];return Twig.lib.max(values)}return Twig.lib.max.apply(null,arguments)},min:function(values){if(Twig.lib.is("Object",values)){delete values["_keys"];return Twig.lib.min(values)}return Twig.lib.min.apply(null,arguments)},template_from_string:function(template){if(template===undefined){template=""}return new Twig.Template({options:this.options,data:template})},random:function(value){var LIMIT_INT31=2147483648;function getRandomNumber(n){var random=Math.floor(Math.random()*LIMIT_INT31);var limits=[0,n];var min=Math.min.apply(null,limits),max=Math.max.apply(null,limits);return min+Math.floor((max-min+1)*random/LIMIT_INT31)}if(Twig.lib.is("Number",value)){return getRandomNumber(value)}if(Twig.lib.is("String",value)){return value.charAt(getRandomNumber(value.length-1))}if(Twig.lib.is("Array",value)){return value[getRandomNumber(value.length-1)]}if(Twig.lib.is("Object",value)){var keys=Object.keys(value);return value[keys[getRandomNumber(keys.length-1)]]}return getRandomNumber(LIMIT_INT31-1)}};Twig._function=function(_function,value,params){if(!Twig.functions[_function]){throw"Unable to find function "+_function}return Twig.functions[_function](value,params)};Twig._function.extend=function(_function,definition){Twig.functions[_function]=definition};return Twig}(Twig||{});var Twig=function(Twig){"use strict";Twig.tests={empty:function(value){if(value===null||value===undefined)return true;if(typeof value==="number")return false;if(value.length&&value.length>0)return false;for(var key in value){if(value.hasOwnProperty(key))return false}return true},odd:function(value){return value%2===1},even:function(value){return value%2===0},divisibleby:function(value,params){return value%params[0]===0},defined:function(value){return value!==undefined},none:function(value){return value===null},"null":function(value){return this.none(value)},sameas:function(value,params){return value===params[0]},iterable:function(value){return value&&(Twig.lib.is("Array",value)||Twig.lib.is("Object",value))}};Twig.test=function(test,value,params){if(!Twig.tests[test]){throw"Test "+test+" is not defined."}return Twig.tests[test](value,params)};Twig.test.extend=function(test,definition){Twig.tests[test]=definition};return Twig}(Twig||{});var Twig=function(Twig){"use strict";Twig.exports={VERSION:Twig.VERSION};Twig.exports.twig=function twig(params){"use strict";var id=params.id,options={strict_variables:params.strict_variables||false,autoescape:params.autoescape!=null&&params.autoescape||false,allowInlineIncludes:params.allowInlineIncludes||false,rethrow:params.rethrow||false,namespaces:params.namespaces};if(Twig.cache&&id){Twig.validateId(id)}if(params.debug!==undefined){Twig.debug=params.debug}if(params.trace!==undefined){Twig.trace=params.trace}if(params.data!==undefined){return new Twig.Template({data:params.data,path:params.hasOwnProperty("path")?params.path:undefined,module:params.module,id:id,options:options})}else if(params.ref!==undefined){if(params.id!==undefined){throw new Twig.Error("Both ref and id cannot be set on a twig.js template.")}return Twig.Templates.load(params.ref)}else if(params.method!==undefined){if(!Twig.Templates.isRegisteredLoader(params.method)){throw new Twig.Error('Loader for "'+params.method+'" is not defined.')}return Twig.Templates.loadRemote(params.name||params.href||params.path||id||undefined,{id:id,method:params.method,base:params.base,module:params.module,precompiled:params.precompiled,async:params.async,options:options},params.load,params.error)}else if(params.href!==undefined){return Twig.Templates.loadRemote(params.href,{id:id,method:"ajax",base:params.base,module:params.module,precompiled:params.precompiled,async:params.async,options:options},params.load,params.error)}else if(params.path!==undefined){return Twig.Templates.loadRemote(params.path,{id:id,method:"fs",base:params.base,module:params.module,precompiled:params.precompiled,async:params.async,options:options},params.load,params.error)}};Twig.exports.extendFilter=function(filter,definition){Twig.filter.extend(filter,definition)};Twig.exports.extendFunction=function(fn,definition){Twig._function.extend(fn,definition)};Twig.exports.extendTest=function(test,definition){Twig.test.extend(test,definition)};Twig.exports.extendTag=function(definition){Twig.logic.extend(definition)};Twig.exports.extend=function(fn){fn(Twig)};Twig.exports.compile=function(markup,options){var id=options.filename,path=options.filename,template;template=new Twig.Template({data:markup,path:path,id:id,options:options.settings["twig options"]});return function(context){return template.render(context)}};Twig.exports.renderFile=function(path,options,fn){if(typeof options==="function"){fn=options;options={}}options=options||{};var settings=options.settings||{};var params={path:path,base:settings.views,load:function(template){fn(null,template.render(options))}};var view_options=settings["twig options"];if(view_options){for(var option in view_options){if(view_options.hasOwnProperty(option)){params[option]=view_options[option]}}}Twig.exports.twig(params)};Twig.exports.__express=Twig.exports.renderFile;Twig.exports.cache=function(cache){Twig.cache=cache};return Twig}(Twig||{});
	var Twig=function(Twig){Twig.compiler={module:{}};Twig.compiler.compile=function(template,options){var tokens=JSON.stringify(template.tokens),id=template.id,output;if(options.module){if(Twig.compiler.module[options.module]===undefined){throw new Twig.Error("Unable to find module type "+options.module)}output=Twig.compiler.module[options.module](id,tokens,options.twig)}else{output=Twig.compiler.wrap(id,tokens)}return output};Twig.compiler.module={amd:function(id,tokens,pathToTwig){return'define(["'+pathToTwig+'"], function (Twig) {\n	var twig, templates;\ntwig = Twig.twig;\ntemplates = '+Twig.compiler.wrap(id,tokens)+"\n	return templates;\n});"},node:function(id,tokens){return'var twig = require("twig").twig;\n'+"exports.template = "+Twig.compiler.wrap(id,tokens)},cjs2:function(id,tokens,pathToTwig){return'module.declare([{ twig: "'+pathToTwig+'" }], function (require, exports, module) {\n'+'	var twig = require("twig").twig;\n'+"	exports.template = "+Twig.compiler.wrap(id,tokens)+"\n});"}};Twig.compiler.wrap=function(id,tokens){return'twig({id:"'+id.replace('"','\\"')+'", data:'+tokens+", precompiled: true});\n"};return Twig}(Twig||{});if(typeof module!=="undefined"&&module.declare){module.declare([],function(require,exports,module){for(key in Twig.exports){if(Twig.exports.hasOwnProperty(key)){exports[key]=Twig.exports[key]}}})}else if(true){!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return Twig.exports}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))}else if(typeof module!=="undefined"&&module.exports){module.exports=Twig.exports}else{window.twig=Twig.exports.twig;window.Twig=Twig.exports}
	//# sourceMappingURL=twig.min.js.map
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 11 */
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
	
	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }
	
	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }
	
	  return parts;
	}
	
	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};
	
	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;
	
	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();
	
	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }
	
	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }
	
	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)
	
	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');
	
	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};
	
	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';
	
	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');
	
	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }
	
	  return (isAbsolute ? '/' : '') + path;
	};
	
	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};
	
	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};
	
	
	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);
	
	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }
	
	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }
	
	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }
	
	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));
	
	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }
	
	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }
	
	  outputParts = outputParts.concat(toParts.slice(samePartsLength));
	
	  return outputParts.join('/');
	};
	
	exports.sep = '/';
	exports.delimiter = ':';
	
	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];
	
	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }
	
	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }
	
	  return root + dir;
	};
	
	
	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};
	
	
	exports.extname = function(path) {
	  return splitPath(path)[3];
	};
	
	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}
	
	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 12 */
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
/* 13 */
/***/ function(module, exports) {



/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _twig = __webpack_require__(9);
	
	var _twig2 = _interopRequireDefault(_twig);
	
	var _craft = __webpack_require__(5);
	
	var _craft2 = _interopRequireDefault(_craft);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_twig2.default.extendFilter('t', function (label, placeholders) {
		return _craft2.default.t(label, placeholders);
	});
	
	var id = 0;
	_twig2.default.extendFunction('uniqueId', function () {
		return 'uid' + id++;
	});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _garnish = __webpack_require__(4);
	
	var _garnish2 = _interopRequireDefault(_garnish);
	
	var _craft = __webpack_require__(5);
	
	var _craft2 = _interopRequireDefault(_craft);
	
	var _fieldlayout = __webpack_require__(16);
	
	var _fieldlayout2 = _interopRequireDefault(_fieldlayout);
	
	__webpack_require__(14);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _garnish2.default.Base.extend({
		init: function init() {
			this.$container = (0, _jquery2.default)((0, _fieldlayout2.default)());
		},
		addFieldGroup: function addFieldGroup(group) {},
		removeFieldGroup: function removeFieldGroup(group) {},
		addField: function addField(field, group) {},
		removeField: function removeField(field) {},
		addTab: function addTab(tab) {},
		removeTab: function removeTab(tab) {},
		useField: function useField(field, tabId) {}
	});

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var twig = __webpack_require__(9).twig,
	    template = twig({id:"C:\\Users\\Benjamin\\Documents\\Web\\craft-neo\\craft\\plugins\\neo\\resources\\src\\configurator\\fieldlayout\\fieldlayout.twig", data:[{"type":"raw","value":"<div class=\"fieldlayoutform\">\r\n\t<h2>"},{"type":"output","stack":[{"type":"Twig.expression.type.string","value":"Design your field layout"},{"type":"Twig.expression.type.filter","value":"t","match":["|t","t"]}]},{"type":"raw","value":"</h2>\r\n\t"},{"type":"logic","token":{"type":"Twig.logic.type.if","stack":[{"type":"Twig.expression.type.variable","value":"instructions","match":["instructions"]},{"type":"Twig.expression.type.test","filter":"defined"}],"output":[{"type":"raw","value":"\r\n\t\t<div class=\"instructions\">"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"instructions","match":["instructions"]},{"type":"Twig.expression.type.filter","value":"md","match":["|md","md"]}]},{"type":"raw","value":"</div>\r\n\t"}]}},{"type":"raw","value":"\r\n\r\n\t<div class=\"fld-tabs\" data-neo-fields=\"container.fields\"></div>\r\n\r\n\t<div class=\"newtabbtn-container\">\r\n\t\t<div class=\"btn add icon\" data-neo-fields=\"button.newTab\">"},{"type":"output","stack":[{"type":"Twig.expression.type.string","value":"New Tab"},{"type":"Twig.expression.type.filter","value":"t","match":["|t","t"]}]},{"type":"raw","value":"</div>\r\n\t\t<h3>"},{"type":"output","stack":[{"type":"Twig.expression.type.string","value":"&hellip;Or use one of your field groups as a starting point:"},{"type":"Twig.expression.type.filter","value":"t","match":["|t","t"]}]},{"type":"raw","value":"</h3>\r\n\t</div>\r\n\r\n\t<div class=\"unusedfields\" data-neo-fields=\"container.availableFields\"></div>\r\n</div>\r\n"}], allowInlineIncludes: true});
	
	module.exports = function(context) { return template.render(context); }

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var twig = __webpack_require__(9).twig,
	    template = twig({id:"C:\\Users\\Benjamin\\Documents\\Web\\craft-neo\\craft\\plugins\\neo\\resources\\src\\configurator\\blocktype\\blocktype.twig", data:[{"type":"raw","value":"<div class=\"neoconfigitem nci-blocktype"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"errors","match":["errors"]},{"type":"Twig.expression.type.filter","value":"length","match":["|length","length"]},{"type":"Twig.expression.type.number","value":0,"match":["0",null]},{"type":"Twig.expression.type.operator.binary","value":">","precidence":8,"associativity":"leftToRight","operator":">"},{"type":"Twig.expression.type.string","value":" error"},{"type":"Twig.expression.type.string","value":""},{"type":"Twig.expression.type.operator.binary","value":"?","precidence":16,"associativity":"rightToLeft","operator":"?"}]},{"type":"raw","value":"\">\r\n\t<div class=\"name\" data-neo=\"text.name\">"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"name","match":["name"]}]},{"type":"raw","value":"</div>\r\n\t<div class=\"handle code\" data-neo=\"text.handle\">"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"handle","match":["handle"]}]},{"type":"raw","value":"</div>\r\n\t<div class=\"actions\">\r\n\t\t<a class=\"move icon\" title=\""},{"type":"output","stack":[{"type":"Twig.expression.type.string","value":"Reorder"},{"type":"Twig.expression.type.filter","value":"t","match":["|t","t"]}]},{"type":"raw","value":"\" role=\"button\" data-neo=\"button.move\"></a>\r\n\t\t<a class=\"settings icon"},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"errors","match":["errors"]},{"type":"Twig.expression.type.filter","value":"length","match":["|length","length"]},{"type":"Twig.expression.type.number","value":0,"match":["0",null]},{"type":"Twig.expression.type.operator.binary","value":">","precidence":8,"associativity":"leftToRight","operator":">"},{"type":"Twig.expression.type.string","value":" error"},{"type":"Twig.expression.type.string","value":""},{"type":"Twig.expression.type.operator.binary","value":"?","precidence":16,"associativity":"rightToLeft","operator":"?"}]},{"type":"raw","value":"\" title=\""},{"type":"output","stack":[{"type":"Twig.expression.type.string","value":"Settings"},{"type":"Twig.expression.type.filter","value":"t","match":["|t","t"]}]},{"type":"raw","value":"\" role=\"button\" data-neo=\"button.settings\"></a>\r\n\t</div>\r\n\t<input class=\"hidden\" name=\"blockTypes["},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"id","match":["id"]}]},{"type":"raw","value":"][name]\" value=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"name","match":["name"]}]},{"type":"raw","value":"\" data-neo=\"input.name\">\r\n\t<input class=\"hidden\" name=\"blockTypes["},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"id","match":["id"]}]},{"type":"raw","value":"][handle]\" value=\""},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"handle","match":["handle"]}]},{"type":"raw","value":"\" data-neo=\"input.handle\">\r\n</div>\r\n"}], allowInlineIncludes: true});
	
	module.exports = function(context) { return template.render(context); }

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var twig = __webpack_require__(9).twig,
	    template = twig({id:"C:\\Users\\Benjamin\\Documents\\Web\\craft-neo\\craft\\plugins\\neo\\resources\\src\\configurator\\configurator.twig", data:[{"type":"raw","value":"<div class=\"nc-sidebar block-types\">\r\n\t<div class=\"col-inner-container\">\r\n\t\t<div class=\"heading\">\r\n\t\t\t<h5>"},{"type":"output","stack":[{"type":"Twig.expression.type.string","value":"Block Types"},{"type":"Twig.expression.type.filter","value":"t","match":["|t","t"]}]},{"type":"raw","value":"</h5>\r\n\t\t</div>\r\n\t\t<div class=\"items\">\r\n\t\t\t<div class=\"blocktypes\"></div>\r\n\t\t\t<div class=\"btn add icon\">"},{"type":"output","stack":[{"type":"Twig.expression.type.string","value":"New block type"},{"type":"Twig.expression.type.filter","value":"t","match":["|t","t"]}]},{"type":"raw","value":"</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n<div class=\"field-layout\">\r\n\t<div class=\"col-inner-container hidden\">\r\n\t\t<div class=\"heading\">\r\n\t\t\t<h5>"},{"type":"output","stack":[{"type":"Twig.expression.type.string","value":"Field Layout"},{"type":"Twig.expression.type.filter","value":"t","match":["|t","t"]}]},{"type":"raw","value":"</h5>\r\n\t\t</div>\r\n\t\t<div class=\"items\"></div>\r\n\t</div>\r\n</div>\r\n"}], allowInlineIncludes: true});
	
	module.exports = function(context) { return template.render(context); }

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(20);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(22)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./configurator.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./configurator.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(21)();
	// imports
	exports.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Coming+Soon);", ""]);
	
	// module
	exports.push([module.id, ".neo-configurator > .field {\n  max-width: none; }\n  .neo-configurator > .field > .input {\n    position: relative;\n    overflow: hidden;\n    border: 1px solid #e3e5e8;\n    border-radius: 3px;\n    box-shadow: 0 0 5px rgba(51, 170, 255, 0);\n    transition: box-shadow linear 0.1s; }\n    body.ltr .neo-configurator > .field > .input {\n      padding-left: 200px; }\n    body.rtl .neo-configurator > .field > .input {\n      padding-right: 200px; }\n\n.neo-configurator .nc-sidebar {\n  position: absolute;\n  top: 0;\n  margin: 0;\n  border: none;\n  width: 200px;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.03);\n  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.06); }\n  body.ltr .neo-configurator .nc-sidebar {\n    left: 0; }\n  body.rtl .neo-configurator .nc-sidebar {\n    right: 0; }\n  .neo-configurator .nc-sidebar .items {\n    margin-top: -1px;\n    padding-top: 1px; }\n    .neo-configurator .nc-sidebar .items .btn {\n      margin: 14px; }\n\n.neo-configurator .field-layout {\n  position: relative;\n  height: 100%; }\n\n.neo-configurator .nc-sidebar > .col-inner-container > .heading,\n.neo-configurator .field-layout > .col-inner-container > .heading {\n  margin: 0;\n  padding: 7px 14px 6px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.06);\n  background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.03)); }\n\n.neoconfigitem {\n  user-select: none;\n  cursor: default;\n  position: relative;\n  margin-top: -1px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.06); }\n  body.ltr .neoconfigitem {\n    padding: 11px 45px 10px 14px; }\n  body.rtl .neoconfigitem {\n    padding: 11px 14px 10px 45px; }\n  .neoconfigitem.sel {\n    background: rgba(0, 0, 0, 0.05); }\n  .neoconfigitem.error {\n    background: rgba(255, 0, 0, 0.1); }\n    .neoconfigitem.error.sel {\n      background: rgba(200, 0, 0, 0.2); }\n  .neoconfigitem .handle {\n    font-size: 11px;\n    color: #8f98a3; }\n  .neoconfigitem .actions {\n    position: absolute;\n    top: 10px;\n    width: 24px; }\n    body.ltr .neoconfigitem .actions {\n      right: 0; }\n    body.rtl .neoconfigitem .actions {\n      left: 0; }\n    .neoconfigitem .actions .icon {\n      display: block;\n      margin-bottom: 1px;\n      text-align: center; }\n      .neoconfigitem .actions .icon.settings::before {\n        color: rgba(0, 0, 0, 0.2); }\n      .neoconfigitem .actions .icon.settings.error::before {\n        color: #da5a47; }\n      .neoconfigitem .actions .icon.settings:not(.disabled):hover::before {\n        color: #0d78f2; }\n", ""]);
	
	// exports


/***/ },
/* 21 */
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
/* 22 */
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
		var sourceMap = obj.sourceMap;
	
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
		var media = obj.media;
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _jquery = __webpack_require__(2);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _garnish = __webpack_require__(4);
	
	var _garnish2 = _interopRequireDefault(_garnish);
	
	var _craft = __webpack_require__(5);
	
	var _craft2 = _interopRequireDefault(_craft);
	
	__webpack_require__(24);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _garnish2.default.Base.extend({
		init: function init() {}
	});

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(25);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(22)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/sass-loader/index.js!./input.scss", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/sass-loader/index.js!./input.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(21)();
	// imports
	
	
	// module
	exports.push([module.id, "", ""]);
	
	// exports


/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map