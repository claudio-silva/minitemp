# minitemp

##### Tiny, Fast and Flexible Template Engine, using Embedded Javascript.

This is a variant of the traditional EJS templating system that is compatible with it at the basic syntax level while providing additional features.

It allows your site or application to render templates in the browser (client-side) or in the server (with Node.js) using an enhanced dialect of JavaScript as the templating language.

Compared to other template systems, this library is very small and lightweight, but it's also very fast and has enough features for most templating needs. Furthermore, it allows you to easily extended it to suit your own needs.

### Features

##### Feature highlights

- It's TINY! (~3Kb minified; ~2Kb with gzip compression).
- It's FAST! It compiles templates to pure javascript and automatically caches them.
- It's compatible with the EJS syntax.
- It has no dependencies.
- Provides a jQuery plugin (if jQuery is available).
- Runs in the browser or in the server (Node.js).
- Supports AMD, CommonJS and browser globals.
- It's extensible! - add your own templating helper functions and language extensions (macros).

##### Other features

- Supports *macros*, which allow javascript language extensions.
- Supports *contexts*, which function as global scopes for code running inside templates. They allow sharing data and functions between templates without touching the browser's global scope.
- It has a small built-in API of utility/helper functions that you can use on your templates.
- It can output both raw HTML (if explicitly stated) or secure escaped strings, which protect your app from code injection attacks or undesirable HTML formatting embedded in user-provided content.
- The start and end tags can be configured (ex. use `{{ }}` instead of `<% %>`).

## EJS Syntax

#### Embedded javascript statements

`<%` javascript code `%>`

##### Examples

The right way:

```
<div><% if (x > y) { %><p>It's bigger</p><% } else ++x %></div>
```

Don't do this:

```
<div><% if (x > y) %><p>It's bigger</p><% else ++x %></div>
```

> While omitting curly brackets may work sometimes, it's risky. Always use them to enclose blocks in conditions, loops and other javascript control flow structures.

Expressions are ignored. For example, the following will be evaluated as a statement and its value discarded:

```
<div><% 'Hello' %></div>
```



#### Output safe (HTML encoded) text from javascript

`<%=` javascript expression `%>`

###### Example

```
<p>Hello <%= person.name %></p>
<div><%= person.isNice ? "Thank your for coming" : "" %></div>
```

#### Output raw HTML from javascript

`<%==` javascript expression `%>`  
or  
`<%-` javascript expression `%>`

###### Example

```
Hello <%== '<b>' + person.name + '</b>' %>
```

#### Comments

`<%#` any text `%>`  

These comments will not generate any output.

###### Example

```
<%# Main Section %>
<h1>Title</h1>
```


## Installation

#### Installing with [bower](http://github.com/bower/bower)

You can use Bower for installing the librar for client-side use.

    $ bower install minitemp
    
#### Installing with [npm](https://www.npmjs.org/)

You can use npm for installing the library for server-side use.

    $ npm install minitemp
    
#### Installing manually
  
Download the source code and copy the `minitemp.min.js` file into your project.

---
#### Loading the script

##### Client-side - as a global script

You can load the script directly with a `<script>` tag or you may use a script loader.

The minitemp API will be available as a global `minitemp` object.

##### Client-side - as an AMD module

```javascript
define (['minitemp'], function (minitemp) {
  // your code here});
```

##### Client-side or Server-side - as a CommonJS module

```javascript
var minitemp = require('minitemp');
```

> You can load the library as a CommonJS module either client-side (using Browserify or any other CommonJS loader) or server-side (in Node.js).

## Using the jQuery plugin, client-side

Syntax:

```javascript
$ (target).render (source, data)
```
    
- `data` is an optional object who's content will be available as pseudo-global variables for javascript code running in the template.
- The target selector supports any CSS selector.
- There are three syntaxes for the source expression, which allows selecting from three types of template sources. See below.
- Minitemp compiles and caches the templates using the source expression as a cache key.

#### Rendering an external template

Specify the relative or absolute URL of the template file as the source argument.

###### Example

```javascript
$ ('#targetElement').render ('fileUrl.ejs', data);
```

#### Rendering a template embedded in a DOM element

The source template expression supports only a single id (ex: `'#id'`) or class (ex: `'.class'`) CSS selector.

###### Example

```javascript
$ ('#targetElement').render ('#sourceTemplate', data);
```

or

```javascript
$ ('#targetElement').render ('.sourceTemplate', data);
```

#### Rendering a precompiled string template

To render a named template, specify the template name prefixed by `@` as the source expression.
```javascript
// On startup
minitemp.defineTemplate ('templateName', templateStr);

// Somewhere else
$ ('#targetElement').render ('@templateName', data);
```


## Using minitemp without jQuery, client-side

#### Rendering a string template

```javascript
var template = '<p>Hello <%=name %>, how are you?</p>';
var html = minitemp.render (template, data);
// Do something with the resulting html.
```

> Warning: when directly rendering string templates, the resulting compiled templates are not cached, as there is no key to save/retrieve them from the cache. Therefore, performance will be lower.

#### Rendering an external template into a DOM element

```javascript
minitemp.renderFile (url, data, function (err, html) {
	if (err) throw err;
	document.getElementById('target').innerHTML = html;
});
```

#### Rendering a template embedded in a DOM element into another DOM element

```javascript
// On startup:

// Get the template's HTML.
var templateStr = document.getElementById('sourceTemplate').innerHTML;
 // Precompile the template.
minitemp.defineTemplate ('templateName', templateStr);

// Somewhere else:

// Render the template into a string.
var html = minitemp.renderTemplate('templateName', data);
// Inject the rendered HTML into a DOM element.
document.getElementById('target').innerHTML = html;
```

#### Loading external templates

Minitemp provides a `load` function, which you can use to load template files without using jQuery.

###### Example

```javascript
minitemp.load (url, function (err, template)
{
  if (err) throw (err);
  else {
    // Do something with the template.
  }
});
```

> This same function can also be used server-side. It either uses `XMLHttpRequest` on the browser or the Node.js API on the server.

#### Compiling templates

You can convert an HTML template into an optimized javascript function, which can be used for directly rendering the template.

```javascript
var compiled = minitemp.compile (template);
```

To render it, call:

```javascript
var html = compiled (data);
```

## Using minitemp on the server, with Node.js

You can render templates into HTML strings, which can then be sent to the browser using your framework of choice (ex. Express).

#### Example using the Express 4 framework

```javascript
app.route('/dogs')

  .get (function (req, res, next)
  {
    minitemp.renderFile ('dogs.ejs', data,
      function (err, html)
      {
	    if (err) throw err;
	    else res.send (html);
	  });
  });

```

#### Rendering a string template

```javascript
var template = '<p>Hello <%=name %>, how are you?</p>';
var html = minitemp.render (template, data);
// Send the resulting html to the browser.
```

> Warning: when directly rendering string templates, the resulting compiled templates are not cached, as there is no key to save/retrieve them from the cache. Therefore, performance will be lower.

#### Rendering an external template

```javascript
minitemp.renderFile (url, data, function (err, html) {
	if (err) handle_the_error();
	else do_something(); // Send the resulting html to the browser.
});
```

#### Rendering a precompiled template

```javascript
// On startup:

 // Precompile the template.
minitemp.defineTemplate ('templateName', "<p>This is <%=name %>'s template</p>");

// Somewhere else:

// Render the template into a string.
var html = minitemp.renderTemplate('templateName', data);
// Send the resulting html to the browser.
```


## Options

At any time, you may specify one or more options for configuring the minitemp engine.

```javascript
minitemp.options (options);
```
    
### Available options

##### open: String

Redefines the open tag character sequence. Defaults to `<%`.

##### close: String

Redefines the close tag character sequence. Defaults to `%>`.

##### context: Object

Properties of this object will be available as globals for code runnning in the template.  
By setting the same context for multiple instances of MinTemp, you can share data or utility functions between them.

## The utility API

Minitemp provides several utility functions that can be called inside your templates.

#### `e` (string)

Escapes an HTML fragment. Equivalent to `<%= string =%>`.

#### `ea` (string)

Escapes an HTML attribute value.  
This is faster than `e()` and generates shorter strings, as it avoids some HTML encodings that are not needed for attributes.  
Always use with the `<%- %>` raw output tags.

###### Example:
	
```html
<div title="<%- ea(title) %>">Hello</div>
```

#### `attr` (name:string, value:any[, args:Array][, defaultValue:any])

```
@param {string} name        Attribute name.
@param {*}      value       Attribute value.
@param {Array}  args        Arguments to be injected into the attribute value replacing ? placeholders.
@param {*}      defaultVal  Value to be used when the value argument is empty.
```

Outputs a complete HTML attribute by specifying its name and its value.
If the value is empty, the whole attribute won't be generated.

This also helps generating attributes with dynamic values by allowing a list of
arguments to be injected into the attribute value.

###### Example:
	
```
<div <%- attr ('onclick', info && 'showDetail(?,?)', [id, price]) %>> Click me! </div>
```

#### `showIf` (condition:boolean)

If the condition expression is false, it hides the element where this expression lies by outputting a `style="display:none"` attribute.

###### Example:
	
```
<div <%- showIf (isSenior (my.age)) %> class="warning">You are old.</div>
```

#### `dynalist` (map:Object, separator:string)

```
@param {Object.<string,boolean>} map        A map of strings to boolean values.
@param {string=}                 separator  List items separator; defaults to a space.
```

Concatenates the names of each key in a given object who's value is truthy.  
It can be used, for instance, to generate dynamic CSS class lists.

###### Example:
	
```
<div class="header <%= dynalist ({active: isActive, first: isFirst()})">
```

### Macros

Macros are JavaScript language extensions that are available only inside templates.

Minitemp comes with a single built-in macro: the `for (var in array)` statement.

Unlike the standard javascript `for (v in a)` statement, when this macro is used inside a template, it is converted into an array looping construct like this:

```javascript
for (var i = 0, m = a.length, v; v = a[i], i < m; ++i)
```
    
The generated code is very similar to what you would have to manually write on each loop of your templates, but the macro is shorter and more readable.

> This macro implements functionality similar to the proposed ES6 `for (v of a)` statement, but it uses current javascript syntax. This way, an IDE (like WebStorm with the EJS plugin) doesn't display any syntax error warnings on those statements.

#### Macros limitations

Macros can only be applied to javascript source code inside tagged blocks. They cannot span multiple blocks or target the HTML code.

#### Defining your own macros

Each macro can be defined by an array containg a regular expression and a substitution expression.

To add your own application-specific macros to the minitemp engine, push them into the `macros` property.

###### Example:

An example macro for an `ifSet (variable) stringExp` construct, which outputs a string only if the specified variable is defined:

```javascript
minitemp.macros.push([/ifSet\s*\((.*?)\)(.*)/g, 'typeof $1 != "undefined" ? $2 : ""']);
var output = minitemp.render ('<p><%= ifSet(name) 'Hello ' + name %></p>', {name: 'John'});
```

## More examples

Additional examples are available on the `tests` folder.

## How to build the library

If you make changes to the source code, you may rebuild the minified javascript file using [Grunt](http://gruntjs.com).

You'll need to checkout the full source code (not the one installed via Bower) and you must have NodeJS and Grunt installed.

To install the build tool, on the project folder type `npm install` on the command line.

Now, whenever you need to rebuild the library, simply type `grunt`.

## History

 Version | Date       | Description
---------|------------|---------------------------------
 v2.1.0  | 2014-04-01 | Universal Module Loader support.
 v2.0.0  | 2014-03-31 | jQuery plugin. API-breaking changes.
 v1.0.0  | 2014-03-23 | Initial release.

## License

The MIT License (MIT)

Copyright (c) 2014 Cláudio Silva

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
