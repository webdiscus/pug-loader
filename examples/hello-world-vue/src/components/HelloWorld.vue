<template lang='pug'>
  mixin code
    pre.language-
      code
        block

  h1 Why is this Pug loader best for Vue?

  include:markdown compare.md

  h1 How to use Pug with Vue

  p Install the Pug loader:
  +code
    :highlight
      npm i --save-dev @webdiscus/pug-loader

  p Change your #[i vue.config.js] according to the following minimal configuration:
  +code
    include:highlight(js) ../../vue.config.js

  h1 Usage Pug in Vue template

  p With #[code @webdiscus/pug-loader] you can use an indent in template. Enjoy it!
  div Component #[i HelloWorld.vue]
  +code
    :highlight(pug)
      <templatе lang='pug'>
        h1 Hello Pug!
        p Paragraph
      </templatе>

  h2 Highlight code syntax in Pug

  p See more details for #[code: a(href="https://webdiscus.github.io/pug-loader/pug-filters/highlight.html") :highlight] filter.

  i JavaScript
  +code
    :highlight(js)
      const arr = [1, 2, 'banana'];

  i HTML
  +code
    :highlight(html)
      <!-- Comment -->
      <div class="container">
        <p>Paragraph</p>
      </div>

  h2 Markdown in Pug

  p See more details for #[code: a(href="https://webdiscus.github.io/pug-loader/pug-filters/markdown.html") :markdown] filter.
  :markdown
    **Bold** _Italic_

    ### Highlight code syntax in `markdown`
    _JavaScript_
    ```js
      const arr = [1, 2, 'banana'];
    ```

  h1 Usage Pug in JavaScript

  i App.vue
  +code
    include:highlight(html) ../App.vue
</template>

<style>
  code[class*="language-"],
  pre[class*="language-"] {
    line-height: 1 !important;
  }

  body {
    font-family: Helvetica, Arial, sans-serif;
  }

  /* markdown table */
  table {
    display: block;
    width: 100%;
    width: max-content;
    max-width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    border: 1px solid #ccc;
  }
  table tbody tr {
    display: table-row;
    border-top: 1px solid #ccc;
  }
  table th {
    padding: 15px 10px;
  }
  table td {
    padding: 5px 10px;
    border-left: 1px solid #ccc;
  }
  table th:not(:first-of-type),
  table td:not(:first-of-type) {
    border-left: 1px solid #ccc;
  }
</style>
