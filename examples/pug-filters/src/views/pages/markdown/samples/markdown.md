**You can use HTML tags in markdown**

<center>Here is used the HTML tag - <b>center</b></center>

```html
<center>Here is used the HTML tag - <b>center</b></center>
```

**Markdown**
```md
# hello world

you can write text [with links](http://example.com) inline or [link references][1].

* one _thing_ has *em*phasis
* two __things__ are **bold**

[1]: http://example.com

hello world
===========

<this_is inline="xml"></this_is>

> markdown is so cool
  so are code segments

1. one thing (yeah!)
2. two thing `i can write code`, and `more` wipee!
```

**HTML**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Title</title>
    <style>body {width: 500px;}</style>
    <script type="application/javascript">
      function $init() {return true;}
    </script>
  </head>

  <body>
    <p checked class="title" id="title">Title</p>
    <!-- here goes the rest of the page -->
  </body>
</html>
```

**SVG**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 170">
  <path fill="#fff" d="M55.37 131.5H48.4v9.13h6.97c1.67 0 2.92-.4 3.78-1.22.85
    -.8 1.28-1.92 1.28-3.33s-.43-2.54-1.28-3.35c-.86-.8-2.12-1.2-3.78-1.2m29.52
    6.4c.3-.53.47-1.2.47-2.04 0-1.35-.45-2.4-1.37-3.2-.92-.76-2.14-1.15-3.65
    -10.05h2.8v21.2h-2.4"/>
<svg/>
```

**Pug**
```pug
mixin pet(name)
  li.pet= name

ul
  each val in ['cat', 'dog']
    +pet(val)

script.
  console.log('This is coffee script');
```

**CSS**
```css
@font-face {
  font-family: Chunkfive; src: url('Chunkfive.otf');
}

body, .usertext {
  color: #F0F0F0; background: #600;
  font-family: Chunkfive, sans;
  --heading-1: 30px/32px Helvetica, sans-serif;
}

@import url(print.css);
@media print {
  a[href^=http]::after {
    content: attr(href)
  }
}
```

**SCSS**
```scss
@import "compass/reset";

// variables
$colorGreen: #008000;
$colorGreenDark: darken($colorGreen, 10);

@mixin button($color:green) {
    @if ($color == green) {
        background-color: #008000;
    }
    @else if ($color == red) {
        background-color: #B22222;
    }
}

button {
    @include button(red);
}
```

**JavaScript**
```js
function initHighlight(block, cls) {
  try {
    if (cls.search(/\bno\-highlight\b/) != -1)
      return process(block, true, 0x0F) + ` class="${cls}"`;
  } catch (e) {
    // handle exception
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    if (checkCondition(classes[i]) === undefined)
      console.log('undefined');
  }

  return block;
}

export initHighlight;
```

**PHP**
```php
namespace Location\Web;

abstract class URI extends BaseURI
{
    abstract function test();
    public static $list = [];

    /**
     * Returns a URI
     * @return URI
     */
    static public function _factory($stats = array(), $uri = 'http')
    {
        $uri = explode(':', $uri, 0b10);
        $scheme = isset($uri[1]) ? $uri[1] : '';

        // Security check
        if (!ctype_alnum($scheme)) {
            throw new UriException('Illegal scheme');
        }

        return [
            'uri'   => $uri,
            'value' => null,
        ];
    }
}
```

**SQL**
```sql
CREATE TABLE "topic" (
    "id" integer NOT NULL PRIMARY KEY,
    "forum_id" integer NOT NULL,
    "subject" varchar(255) NOT NULL
);
ALTER TABLE "topic"
ADD CONSTRAINT forum_id FOREIGN KEY ("forum_id")
REFERENCES "forum" ("id");

SELECT forum_id, subject FROM topic WHERE id = 123
```

**undefined**
```
const arr = [1, 2, 'banana'];
const strings = arr.filter((item) => typeof item === 'string');
```
