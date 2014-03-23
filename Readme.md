# minitemp

##### Javascript Mini Template Engine

This is a variant of the traditional EJS templating system that is compatible with it at the basic syntax level while providing additional features.

It allows your site or application to render templates in the browser (client-side) using an enhanced dialect of JavaScript as the templating language.

Compared to other template systems, this library is very small and lightweight, but it's also very fast and has enough features for most templating needs. Furthermore, it allows you to easily extended it to suit your needs.

### Features

- Compatible with EJS syntax.
- Has no dependencies.
- It's tiny (~2.6Kb minified; even less with gzip compression).
- It's FAST! It compiles templates to pure javascript.
- The start and end tags can be configured (ex. you may use `{{ }}` instead of `<% %>`).
- Outputs raw HTML (if explicitly stated) or secure escaped strings, protecting your app from code injection attacks or undesirable HTML formatting embedded in user-provided content.
- Supports macros that allow javascript language extensions.
- Supports *contexts*, which function as global scopes for code running inside templates. They allow sharing data and functions between templates without touching the browser's global scope.
- It has an integrated API of utility/helper functions for use on your templates.
- It's extensible! - add your own templating helper functions and language extensions (macros).

## Installation

#### Install with [bower](http://github.com/bower/bower):

    $ bower install minitemp
    
#### Install manually:
  
  Download the source code and copy the `minitemp.min.js` file into your project.

## Syntax

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

Expressions are ignored:

```
<div><% 'Hello' %></div>
```

This will be evaluated as a statement.

#### Escaped output from javascript

`<%=` javascript expression `%>`

##### Example

```
<p>Hello <%= person.name %></p>
<div><%= person.isNice ? "Thank your for coming" : "" %></div>
```

#### Unescaped (raw) output from javascript

`<%==` javascript expression `%>`  
or  
`<%-` javascript expression `%>`

##### Example

```
Hello <%== '<b>' + person.name + '</b>' %>
```

#### Comments

`<%#` any text `%>`  

These comments will not generate any output.

##### Example

```
<%# Main Section %>
<h1>Title</h1>
```

## Examples

Additional examples are available on the `tests` folder.

## Rebuilding the library

If you make changes to the source code, you may rebuild the minified javascript file using [Grunt](http://gruntjs.com).

You'll need to checkout the full source code (not the one installed via Bower) and you must have NodeJS and Grunt installed.

To install the build tool, on the project folder type `npm install` on the command line.

Now, whenever you need to rebuild the library, simply type `grunt`.

## History

 Version | Date       | Description
---------|------------|----------------------------
 v0.0.1  | 2014-03-23 | Initial release.

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
