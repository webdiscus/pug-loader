(()=>{var r={884:r=>{var e={"pug-compile":"",a:10,b:"abc"};function n(a){var r=""+a,e=t.exec(r);if(!e)return a;var n,o,s,i="";for(n=e.index,o=0;n<r.length;n++){switch(r.charCodeAt(n)){case 34:s="&quot;";break;case 38:s="&amp;";break;case 60:s="&lt;";break;case 62:s="&gt;";break;default:continue}o!==n&&(i+=r.substring(o,n)),o=n+1,i+=s}return o!==n?i+r.substring(o,n):i}var t=/["&<>]/;r.exports=function(r){var t,o="",s={...e,...r};return function(a,r){o=o+"<h1>Hello world!</h1><span>Param[a]: "+n(null==(t=a)?"":t)+"</span><span>Param[b]: "+n(null==(t=r)?"":t)+"</span>"}.call(this,"a"in s?s.a:"undefined"!=typeof a?a:void 0,"b"in s?s.b:"undefined"!=typeof b?b:void 0),o}},407:a=>{a.exports="<h1>Hello world!</h1><span>Param[a]: 20</span><span>Param[b]: def</span>"}},e={};function n(a){var t=e[a];if(void 0!==t)return t.exports;var o=e[a]={exports:{}};return r[a](o,o.exports,n),o.exports}(()=>{const a=n(884)(),r=n(407);console.log(a+r)})()})();