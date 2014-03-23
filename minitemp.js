/**
 * Copyright 2014 Cláudio Silva, all rights reserved.
 * https://github.com/claudio-silva/minitemp
 */

//------------------------------------------------------------------------------
// Pseudoglobal utility functions for use on templates.
//------------------------------------------------------------------------------

/**
 * @name e
 * Escapes an HTML fragment. Equivalent to <%= string =%>.
 * @type function(string)
 */
/**
 * @name ea
 * Escapes an HTML attribute value.
 * @type function(string)
 */
/**
 * @name attr
 * Outputs a complete HTML attribute by specifying its name and its value.
 * If the value is empty, the whole attribute won't be generated.
 * This also helps generating attributes with dynamic values by allowing a list of
 * arguments to be injected into the attribute value.
 * @type {function(string,*,Array=,*=)}
 * @param {string} name Attribute name.
 * @param {*} value Attribute value.
 * @param {Array} args Arguments to be injected into the attribute value replacing ? placeholders.
 * @param {*} defaultVal Value to be used when the value argument is empty.
 */
/**
 * If the condition expression is false, it hides the element where this expression lies by outputting a style="display:none" attribute.
 * @name showIf
 * @type {function(string):string}
 * @param {boolean} test Condition.
 */
/**
 * @name dynalist
 * Concatenates the names of each key in a given object who's value is truthy.
 * It can be used, for instance, to generate dynamic CSS class lists.
 * @type function(!Object,string=)
 * @param {Object.<string,boolean>} map A map of strings to boolean values.
 * @param {string=} sep List items separator; defaults to a space.
 */
/**
 * @name sprintf
 * Interpolates values into a string.
 * Values to be interpolated into the template are specified as extra arguments.
 * @type function(!string)
 * @param {string} template A text in which placeholders are specified using question marks. Ex: "Hello ?, you age is ?."
 */

//------------------------------------------------------------------------------

(function ()
{
  /**
   * True if the script is running under Node.js.
   * @type {boolean}
   */
  var isModeJS = typeof(process) != 'undefined' && process.title == 'node';

  var cache = {};
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  /**
   * Utility functions for use on templates.
   */
  var API =
  {
    e:        function (html)
    {
      return String (html).replace (/[&<>"'\/]/g, function (s) { return entityMap[s] });
    },
    ea:       function (str)
    {
      return str.replace (/"/g, '&quot;')
    },
    attr:     function (name, value, args, defaultVal)
    {
      var v = value != null && value !== '' ? sprintf.apply (null, [value].concat (args)) : defaultVal || '';
      return v ? name + '="' + API.ea (v) + '"' : '';
    },
    showIf:   function (test)
    {
      return test ? '' : 'style="display:none"'
    },
    dynalist: function (map, sep)
    {
      var c = [];
      for (var k in map)
        if (map.hasOwnProperty (k) && map[k])
          c.push (k);
      return c.join (sep === undefined ? ' ' : '');
    },
    sprintf: sprintf
  };

  var macros = [
    [/for\s*\(\s*(\w+)\s+in\s+(.+?)\)/g, 'for (var _$1=0, __$1=$2.length, $1; $1=$2[_$1], _$1<__$1; ++_$1)']
  ];

  /**
   * Global options you may share between templates.
   */
  var Options = {
    /**
     * Defines the open tag character sequence.
     * @type {String}
     */
    open:    '<%',
    /**
     * Defines the close tag character sequence.
     * @type {String}
     */
    close:   '%>',
    /**
     * Properties of this object will be available as globals for code runnning in the template.
     * By setting the same context for multiple instances of MinTemp, you can share data or utility functions between them.
     * @type {String}
     */
    context: {}
  };

  var _export = isModeJS ? module.exports : window.minitemp = {};

  /* Export public API */
  _export.render = render;
  _export.renderFile = renderFile;
  _export.renderTemplate = renderFile;
  _export.precompile = precompile;
  _export.compile = compile;
  _export.config = config;
  _export.API = API;
  _export.macros = macros;
  _export.load = load;

  /** @type {Options} */
  var options;
  /** @type {RegExp} */
  var MATCH_EXP;

  // Initialize with default options.
  config ();

  /**
   * Sets default options for the template engine.
   * @public
   * @param {Options?} opt Global options you may share between templates.
   */
  function config (opt)
  {
    opt = opt || {};
    inherit (opt, Options);
    options = opt;

    MATCH_EXP = new RegExp (opt.open + '([^\\s\\w}]+)?\\s*([\\s\\S]*?)\\s*' + opt.close, 'g');
  }

  /**
   * Renders a template from the specified file.
   * @public
   * @param {string} url An URL (relative or absolute) or a file path (if running on Node.js).
   * @param {Object|null} data Data to make available to the template's embedded script.
   * @param {function(Object,string?)} callback A Node.js-style callback  with parameters (err, data)
   * that will receive the rendered template as an HTML string.
   */
  function renderFile (url, data, callback)
  {
    load (url, function (err, template)
    {
      if (err) callback (err);
      else {
        var compiled = getCompiled (url, template);
        try {
          callback (null, compiled (data || {}, options.context, API));
        }
        catch (err) {
          callback (err);
        }
      }
    });
  }

  /**
   * Renders a template from the specified string.
   * @public
   * @param {string} template The template as an an HTML string.
   * @param {Object?} data Data to make available to the template's embedded script.
   * Note: the template will be recompiled every time it is rendered.
   */
  function render (template, data)
  {
    return compile (template) (data || {});
  }

  /**
   * Renders a template from the specified string.
   * @public
   * @param {string?} name An unique name used for caching the compiled template.
   * @param {Object?} data Data to make available to the template's embedded script.
   */
  function renderTemplate (name, data)
  {
    var compiled = cache[name];
    if (!compiled)
      throw new Error (sprintf ('Template ? not found', name));
    return compiled (data || {});
  }

  /**
   * Compiles and caches a template for late use with renderTemplate().
   * @public
   * @param {string} name An unique name used for caching the compiled template.
   * @param {string} template The template an an HTML string.
   */
  function precompile (name, template)
  {
    return cache[name] = compile (template);
  }

  //------- PRIVATE -----------------------------------------------------------------------------

  /**
   * Gets the compiled function for the specified template from the cache of, if not cached yet,
   * compiles it now and caches it.
   * @param {string} key The cache key.
   * @param {string} template The template as a string.
   * @returns {Function}
   */
  function getCompiled (key, template)
  {
    var fn = cache[key];
    if (fn) return fn;
    return cache[key] = compile (template);
  }

  /**
   * Compiles a template into an executable function.
   * @param {string} src
   * @returns {Function}
   */
  function compile (src)
  {
    var out = []
      , exps = []
      , step1 = src.replace (MATCH_EXP,
        function (a, tagType, content)
        {
          if (content instanceof Function)
            content = content ();
          content = content == null ? '' : String (content); // 0 value is untouched.
          if (content)
            switch (tagType || '') {
              case '': // Javascript statement.
                exps.push (applyMacros (content));
                break;
              case '=': // Escaped output.
                exps.push ('$o.push(e(' + content + '));');
                break;
              case '==': // Raw output.
              case '-':  // visionmedia/ejs compatibility.
                exps.push ('$o.push(' + content + ');');
                break;
              case '#': // Comment; output nothing.
                exps.push (''); //must add empty string or output will be broken
                break;
              default:
                throw new Error ('Unknown template tag ' + options.open + tagType);
            }
          return '§§';
        })
      , strs = step1.split (/§§/g);
    for (var i = 0, m = strs.length; i < m; ++i) {
      out.push ("$o.push('" + strs[i].replace (/\n/g, '\\n').replace (/'/g, "\\'") + "');");
      if (i < m - 1 && exps[i])
        out.push (exps[i]);
    }
    return createCompiledTemplate (out.join ('\n'));
  }

  function applyMacros (code)
  {
    for (var i = 0, m = macros.length; i < m; ++i)
      code = code.replace (macros[i][0], macros[i][1]);
    return code;
  }

  function createCompiledTemplate (code)
  {
    try {
      var fn = Function ('scope', 'context', 'API', 'var $o=[];\nwith (API) with (context) with (scope) {\n' + code + '\n}\nreturn $o.join("")');
      return function (scope)
      {
        return fn (scope || {}, options.context, API);
      }
    }
    catch (err) {
      console.log ("\nCompiled template:\n");
      console.log (code);
      throw err;
    }
  }

  /**
   * Loads the file at the specified path or URL.
   * @param {string} url
   * @param {function(Object,string?)} callback A function with parameters (err, data).
   */
  function load (url, callback)
  {
    if (typeof $ != 'undefined')
      return $.get (url).then (
        function (data) { callback (null, data) },
        function (err) { callback (err) }
      );

    if (isModeJS) {
      var fs = require ('fs');
      fs.readFile (url, callback);
    }
    else if (typeof XMLHttpRequest != 'undefined') {
      var xhr = new XMLHttpRequest ();
      xhr.onreadystatechange = function ()
      {
        if (xhr.readyState === 4) {
          if (xhr.status === 200)
            callback (null, xhr.responseText);
          else callback (xhr);
        }
      };
      xhr.open ("GET", url, true);
      xhr.send ();
    }
    else throw new Error ('No API is available for loading files');
  }

  function inherit (o, type)
  {
    if (o)
      for (var k in type)
        if (type.hasOwnProperty (k) && o[k] === undefined)
          o[k] = type[k];
  }

  /**
   * Interpolates values into a string.
   * Values to be interpolated into the template are specified as extra arguments.
   * @type function(!string)
   * @param {string} str A text in which placeholders are specified using question marks. Ex: "Hello ?, you age is ?."
   */
  function sprintf (str)
  {
    var i = 1,
      args = arguments;
    return typeof str == 'string' ? str.replace (/\?/g, function () { return args[i++] }) : '';
  }

}) ();