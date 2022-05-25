<template>
  <HelloWorld />
  <div v-html='demo'></div>
</template>

<script>
  import HelloWorld from './components/HelloWorld.vue'

  // import Pug as template function
  import demoTmpl from './views/demo.pug';

  // define custom data used in Pug template
  const locals = { colors: ['red', 'green', 'blue'] };
  // pass custom data in Pug template
  const demoHtml = demoTmpl(locals);

  export default {
    name: 'App',
    components: {
      HelloWorld
    },
    data() {
      return {
        demo: demoHtml
      }
    }
  }
</script>
