(()=>{"use strict";var e={0:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});const r=e=>{let[,t]=/([a-f\d]{3,6})/i.exec(e)||[],r=t?t.length:0;if(3===r)t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2];else if(6!==r)return[0,0,0];let n=parseInt(t,16);return[n>>16&255,n>>8&255,255&n]},n=(e,t,r)=>t>e?t:e>r?r:e,o=(e,t,r)=>{let n=e.indexOf(t);if(n<0)return e;let o=t.length,i=0,l="";for(;~n;)l+=e.slice(i,n)+r,i=n+o,n=e.indexOf(t,i);return l+e.slice(i)},i=(e=>{const t=e=>!!l.find((t=>e.test(t))),r="undefined"!=typeof process?process:{},{stdout:n,platform:o}=r,i=r.env||{},l=r.argv||[],s="FORCE_COLOR"in i,g=i.FORCE_COLOR,c="true"===g||parseInt(g)>0,a="NO_COLOR"in i||s&&!c||t(/^-{1,2}(no-color|color=false|color=never)$/),p=s&&c||t(/^-{1,2}(color|color=true|color=always)$/),u=n&&"isTTY"in n&&/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(i.TERM);return!a&&(p||u||"win32"===o||"CI"in i)})(),l={open:"",close:""},s=i?(e,t)=>({open:`[${e}m`,close:`[${t}m`}):()=>l,g=i?e=>({open:`[38;5;${e}m`,close:"[39m"}):()=>l,c=i?e=>({open:`[48;5;${e}m`,close:"[49m"}):()=>l,a=i?(e,t,r)=>({open:`[38;2;${e};${t};${r}m`,close:"[39m"}):()=>l,p=i?(e,t,r)=>({open:`[48;2;${e};${t};${r}m`,close:"[49m"}):()=>l,u={visible:l,reset:s(0,0),inverse:s(7,27),hidden:s(8,28),bold:s(1,22),dim:s(2,22),faint:s(2,22),italic:s(3,23),underline:s(4,24),doubleUnderline:s(21,24),strikethrough:s(9,29),strike:s(9,29),frame:s(51,54),encircle:s(52,54),overline:s(53,55),black:s(30,39),red:s(31,39),green:s(32,39),yellow:s(33,39),blue:s(34,39),magenta:s(35,39),cyan:s(36,39),white:s(37,39),gray:s(90,39),grey:s(90,39),blackBright:s(90,39),redBright:s(91,39),greenBright:s(92,39),yellowBright:s(93,39),blueBright:s(94,39),magentaBright:s(95,39),cyanBright:s(96,39),whiteBright:s(97,39),bgBlack:s(40,49),bgRed:s(41,49),bgGreen:s(42,49),bgYellow:s(43,49),bgBlue:s(44,49),bgMagenta:s(45,49),bgCyan:s(46,49),bgWhite:s(47,49),bgBlackBright:s(100,49),bgRedBright:s(101,49),bgGreenBright:s(102,49),bgYellowBright:s(103,49),bgBlueBright:s(104,49),bgMagentaBright:s(105,49),bgCyanBright:s(106,49),bgWhiteBright:s(107,49)},{defineProperty:b,defineProperties:f,setPrototypeOf:d}=Object,h=/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,B=/(\r*\n)/g,x=function(){const e=e=>e;return e.strip=e=>e.replace(h,""),e.extend=t=>{for(let e in t){let n=t[e],o=null!=n.open?n:a(...r(n));y[e]={get(){const t=v(this,o);return b(this,e,{value:t}),t}}}$=f((()=>{}),y),d(e,$)},e.extend(u),e},v=({props:e},{open:t,close:r})=>{const n=(e,...t)=>O(e,t,n.props);let o=t,i=r;return void 0!==e&&(o=e.openStack+t,i=r+e.closeStack),d(n,$),n.props={open:t,close:r,openStack:o,closeStack:i,parent:e},n.open=o,n.close=i,n},O=(e,t,r)=>{if(!e)return"";const{openStack:n,closeStack:i}=r;let l=null!=e.raw?String.raw(e,...t):e;if(~l.indexOf(""))for(;void 0!==r;)l=o(l,r.close,r.open),r=r.parent;return~l.indexOf("\n")&&(l=l.replace(B,i+"$1"+n)),n+l+i},m={ansi:e=>g(n(e,0,255)),bgAnsi:e=>c(n(e,0,255)),hex:e=>a(...r(e)),bgHex:e=>p(...r(e)),rgb:(e,t,r)=>a(n(e,0,255),n(t,0,255),n(r,0,255)),bgRgb:(e,t,r)=>p(n(e,0,255),n(t,0,255),n(r,0,255))},y={};let $;for(let e in m)y[e]={get(){return(...t)=>v(this,m[e](...t))}};y.ansi256=y.fg=y.ansi,y.bgAnsi256=y.bg=y.bgAnsi;const k=new x;t.Ansis=x,t.default=k},773:(e,t,r)=>{const n=r(0);e.exports=n.default,e.exports.Ansis=n.Ansis}},t={};!function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,r),i.exports}(773)})();