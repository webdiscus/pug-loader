(()=>{var e={728:e=>{function t(e){var t=""+e,a=n.exec(t);if(!a)return e;var o,r,i,l="";for(o=a.index,r=0;o<t.length;o++){switch(t.charCodeAt(o)){case 34:i="&quot;";break;case 38:i="&amp;";break;case 60:i="&lt;";break;case 62:i="&gt;";break;default:continue}r!==o&&(l+=t.substring(r,o)),r=o+1,l+=i}return r!==o?l+t.substring(r,o):l}var n=/["&<>]/,o={title:"Neu option data",text:"Hello world!",compile:"",a:20,b:"def"};e.exports=e=>function(e){var n,o="",r=e||{};return function(e,a,r,i){o=o+"<h1>"+t(null==(n=i)?"":n)+"</h1><p>"+t(null==(n=r)?"":n)+"</p><span>Param[a]: "+t(null==(n=e)?"":n)+"</span><span>Param[b]: "+t(null==(n=a)?"":n)+"</span>"}.call(this,"a"in r?r.a:"undefined"!=typeof a?a:void 0,"b"in r?r.b:"undefined"!=typeof b?b:void 0,"text"in r?r.text:"undefined"!=typeof text?text:void 0,"title"in r?r.title:"undefined"!=typeof title?title:void 0),o}(Object.assign(o,e))},329:e=>{e.exports="<h1>Neu option data</h1><p>Hello world!</p><span>Param[a]: 10</span><span>Param[b]: abc</span>"}},t={};function n(a){var o=t[a];if(void 0!==o)return o.exports;var r=t[a]={exports:{}};return e[a](r,r.exports,n),r.exports}(()=>{const e=n(329),t=n(728);console.log(e),console.log(t())})()})();