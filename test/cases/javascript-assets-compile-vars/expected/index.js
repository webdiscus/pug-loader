(()=>{var t={207:(t,e,n)=>{var r={globalVar:"Global Title!",a:7,b:"zzz"};function i(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var i=typeof e;return"object"!==i&&"function"!==i||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=s(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}function a(t,e){return Array.isArray(t)?function(t,e){for(var n,r="",i="",o=Array.isArray(e),l=0;l<t.length;l++)(n=a(t[l]))&&(o&&e[l]&&(n=s(n)),r=r+i+n,i=" ");return r}(t,e):t&&"object"==typeof t?function(t){var e="",n="";for(var r in t)r&&t[r]&&o.call(t,r)&&(e=e+n+r,n=" ");return e}(t):t||""}function s(t){var e=""+t,n=l.exec(e);if(!n)return t;var r,i,a,s="";for(r=n.index,i=0;r<e.length;r++){switch(e.charCodeAt(r)){case 34:a="&quot;";break;case 38:a="&amp;";break;case 60:a="&lt;";break;case 62:a="&gt;";break;default:continue}i!==r&&(s+=e.substring(i,r)),i=r+1,s+=a}return i!==r?s+e.substring(i,r):s}var o=Object.prototype.hasOwnProperty,l=/["&<>]/;t.exports=function(t){var e,o="",l={},u={...r,...t};return function(t,r,u,c,d){o=o+'<!DOCTYPE html><html lang="en"><head><title>'+s(null==(e=d)?"":e)+"</title></head></html>",l.test=e=function(t){this&&this.block,this&&this.attributes;const[n,r]=t.items;o=o+'<b class="val">'+s(null==(e=r)?"":e)+'</b><b class="func-res">'+s(null==(e=n(r))?"":e)+"</b>"},o+="<body>";const f=r.item1,v=r[t],p=r.item1,y=(0,c[u].items[0])(c[u].items[1]);o=o+"<img"+i("src",n(768)("./image.png"),!0,!0)+"><div>key: "+s(null==(e=t)?"":e)+'</div><div class="value1">'+s(null==(e=f)?"":e)+'</div><div class="value2">'+s(null==(e=v)?"":e)+"</div><div"+i("class",a(["value3",p],[!1,!0]),!1,!0)+'></div><div class="value4">'+s(null==(e=y)?"":e)+"</div>",l.test(c[u]),o+="</body>"}.call(this,"_KEY_"in u?u._KEY_:"undefined"!=typeof _KEY_?_KEY_:void 0,"_OBJ_"in u?u._OBJ_:"undefined"!=typeof _OBJ_?_OBJ_:void 0,"dataId"in u?u.dataId:"undefined"!=typeof dataId?dataId:void 0,"testItems"in u?u.testItems:"undefined"!=typeof testItems?testItems:void 0,"title"in u?u.title:"undefined"!=typeof title?title:void 0),o}},768:(t,e,n)=>{var r={"./image.png":48,"./page.pug":207};function i(t){var e=a(t);return n(e)}function a(t){if(!n.o(r,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return r[t]}i.keys=function(){return Object.keys(r)},i.resolve=a,t.exports=i,i.id=768},48:(t,e,n)=>{"use strict";t.exports=n.p+"assets/images/image.697ef306.png"}},e={};function n(r){var i=e[r];if(void 0!==i)return i.exports;var a=e[r]={exports:{}};return t[r](a,a.exports,n),a.exports}n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.p="",(()=>{const t=n(207)({_KEY_:"item1",_OBJ_:{item1:"AAA"},dataId:"testData",testItems:{testData:{items:[t=>"abc_"+t,"123"]}}});console.log(t)})()})();