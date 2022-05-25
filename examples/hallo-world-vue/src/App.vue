<template>
  <HelloWorld />
  <div v-html='html'></div>
</template>

<script>
  import HelloWorld from './components/HelloWorld.vue'

  // import Pug as template function
  import tmpl from './views/demo.pug';

  // define custom data used in Pug template
  const locals = { colors: ['red', 'green', 'blue'] };
  // pass custom data in Pug template
  const rawHtml = tmpl(locals);

  export default {
    name: 'App',
    components: {
      HelloWorld
    },
    data() {
      return {
        html: rawHtml
      }
    }
  }
</script>
