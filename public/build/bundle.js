var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function l(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function c(t,n){t.appendChild(n)}function i(t,n,e){t.insertBefore(n,e||null)}function a(t){t.parentNode.removeChild(t)}function s(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function u(t){return document.createElement(t)}function h(t){return document.createTextNode(t)}function f(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function d(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}let m;function g(t){m=t}const p=[],y=[],b=[],v=[],w=Promise.resolve();let $=!1;function x(t){b.push(t)}const k=new Set;let M=0;function _(){const t=m;do{for(;M<p.length;){const t=p[M];M++,g(t),A(t.$$)}for(g(null),p.length=0,M=0;y.length;)y.pop()();for(let t=0;t<b.length;t+=1){const n=b[t];k.has(n)||(k.add(n),n())}b.length=0}while(p.length);for(;v.length;)v.pop()();$=!1,k.clear(),g(t)}function A(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(x)}}const S=new Set;function E(t,n){-1===t.$$.dirty[0]&&(p.push(t),$||($=!0,w.then(_)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function T(l,c,i,s,u,h,f,d=[-1]){const p=m;g(l);const y=l.$$={fragment:null,ctx:null,props:h,update:t,not_equal:u,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(c.context||(p?p.$$.context:[])),callbacks:e(),dirty:d,skip_bound:!1,root:c.target||p.$$.root};f&&f(y.root);let b=!1;if(y.ctx=i?i(l,c.props||{},((t,n,...e)=>{const o=e.length?e[0]:n;return y.ctx&&u(y.ctx[t],y.ctx[t]=o)&&(!y.skip_bound&&y.bound[t]&&y.bound[t](o),b&&E(l,t)),n})):[],y.update(),b=!0,o(y.before_update),y.fragment=!!s&&s(y.ctx),c.target){if(c.hydrate){const t=function(t){return Array.from(t.childNodes)}(c.target);y.fragment&&y.fragment.l(t),t.forEach(a)}else y.fragment&&y.fragment.c();c.intro&&((v=l.$$.fragment)&&v.i&&(S.delete(v),v.i(w))),function(t,e,l,c){const{fragment:i,on_mount:a,on_destroy:s,after_update:u}=t.$$;i&&i.m(e,l),c||x((()=>{const e=a.map(n).filter(r);s?s.push(...e):o(e),t.$$.on_mount=[]})),u.forEach(x)}(l,c.target,c.anchor,c.customElement),_()}var v,w;g(p)}function O(t,n){const e=t.split("\n"),o={height:e.length,width:e.reduce(((t,n)=>Math.max(t,n.length)),0)};return o.cells=Array(o.height).fill().map(((t,n)=>Array(o.width).fill().map(((t,o)=>" "===e[n][o]?{char:" "}:{char:e[n][o]||" "})))),n.forEach((t=>{const n=e[t.line].indexOf(t.text);if(-1!==n)for(let e=n;e<n+t.text.length;e++)t.func&&(o.cells[t.line][e].func=t.func),t.href&&(o.cells[t.line][e].href=t.href)})),o}const j=O("\nWILLOW VEYTSMAN        she/they\n\nabout projects contact personal\n".trim(),[{text:"about",func:"about",line:2},{text:"projects",func:"projects",line:2},{text:"contact",func:"contact",line:2},{text:"personal",func:"personal",line:2}]),I=O("\nABOUT ME                   back\n\n(this is mostly a placeholder\nuntil I figure out something\nbetter)\n\nWelcome to my site! My name is\nWillow. I'm eighteen and I live\nin Brooklyn, New York. I\nrecently graduated Stuyvesant\nHigh School and will be\nstudying at the University of\nRochester this fall.\n\nMy hobbies include all things\ncomputers, playing the flute,\nplaying Minecraft, crocheting,\nbiking, skiing, and, recently,\ndoing some makeup every now and\nthen. Hopefully, by the time\nyou're reading this, I've\nbecome much better at that.\n".trim(),[{text:"back",func:"home",line:0}]),C=O("\nPROJECTS                   back\n\n(My GitHub)\n\nStuyActivities -> a site that\nmanages club activity for the\nover 3000 students at\nStuyvesant High School. Created\nas part of the Student Union IT\nDepartment\n\ntoday.stuysu.org -> a site that\ndisplays important day-to-day\ninfo for Stuyvesant students.\n\n(Student Union IT GitHub)\n\nProjects for school -> TODO\n\nSmall project archive -> TODO\n".trim(),[{text:"back",func:"home",line:0},{text:"(My GitHub)",href:"https://github.com/willowiscool",line:2},{text:"StuyActivities",href:"https://stuyactivities.org",line:4},{text:"today.stuysu.org",href:"https://today.stuysu.org",line:10},{text:"(Student Union IT GitHub)",href:"https://github.com/stuysu",line:14}]),H=O("\nCONTACT ME            back\n\nemail -> vityavv@gmail.com\ngithub -> willowiscool\ndiscord -> willow#2639\ninstagram -> willowis.cool\n".trim(),[{text:"back",func:"home",line:0},{text:"vityavv@gmail.com",href:"mailto:vityavv@gmail.com",line:2},{text:"willowiscool",href:"https://github.com/willowiscool",line:3},{text:"willowis.cool",href:"https://instagram.com/willowis.cool",line:5}]),N=O("\nComing Soon!\n\n    home\n".trim(),[{text:"home",func:"home",line:2}]);function z(t,n,e){const o=t.slice();return o[9]=n[e],o}function U(t,n,e){const o=t.slice();return o[12]=n[e],o}function W(t){let n,e,o=t[12].char+"";return{c(){n=u("span"),e=h(o),f(n,"class","svelte-112zgn7")},m(t,o){i(t,n,o),c(n,e)},p(t,n){1&n&&o!==(o=t[12].char+"")&&d(e,o)},d(t){t&&a(n)}}}function G(t){let n,e,o=t[12].char+"";return{c(){n=u("span"),e=h(o),f(n,"class","defaultpointer svelte-112zgn7")},m(t,o){i(t,n,o),c(n,e)},p(t,n){1&n&&o!==(o=t[12].char+"")&&d(e,o)},d(t){t&&a(n)}}}function L(t){let n,e,o,r,l=t[12].char+"";function s(){return t[3](t[12])}return{c(){n=u("button"),e=h(l),f(n,"class","svelte-112zgn7")},m(t,l){var a,u,h,f;i(t,n,l),c(n,e),o||(u="click",h=s,(a=n).addEventListener(u,h,f),r=()=>a.removeEventListener(u,h,f),o=!0)},p(n,o){t=n,1&o&&l!==(l=t[12].char+"")&&d(e,l)},d(t){t&&a(n),o=!1,r()}}}function P(t){let n,e,o,r=t[12].char+"";return{c(){n=u("a"),e=h(r),f(n,"href",o=t[12].href),f(n,"class","svelte-112zgn7")},m(t,o){i(t,n,o),c(n,e)},p(t,l){1&l&&r!==(r=t[12].char+"")&&d(e,r),1&l&&o!==(o=t[12].href)&&f(n,"href",o)},d(t){t&&a(n)}}}function B(t){let n;function e(t,n){return t[12].href?P:t[12].func?L:" "===t[12].char||" "===t[12].char?G:W}let o=e(t),r=o(t);return{c(){r.c(),n=h("")},m(t,e){r.m(t,e),i(t,n,e)},p(t,l){o===(o=e(t))&&r?r.p(t,l):(r.d(1),r=o(t),r&&(r.c(),r.m(n.parentNode,n)))},d(t){r.d(t),t&&a(n)}}}function D(t){let n,e,o=t[9],r=[];for(let n=0;n<o.length;n+=1)r[n]=B(U(t,o,n));return{c(){for(let t=0;t<r.length;t+=1)r[t].c();n=h(" "),e=u("br")},m(t,o){for(let n=0;n<r.length;n+=1)r[n].m(t,o);i(t,n,o),i(t,e,o)},p(t,e){if(7&e){let l;for(o=t[9],l=0;l<o.length;l+=1){const c=U(t,o,l);r[l]?r[l].p(c,e):(r[l]=B(c),r[l].c(),r[l].m(n.parentNode,n))}for(;l<r.length;l+=1)r[l].d(1);r.length=o.length}},d(t){s(r,t),t&&a(n),t&&a(e)}}}function R(n){let e,o,r=n[0].cells,l=[];for(let t=0;t<r.length;t+=1)l[t]=D(z(n,r,t));return{c(){e=u("div"),o=u("div");for(let t=0;t<l.length;t+=1)l[t].c();f(o,"id","noshrink"),f(o,"class","svelte-112zgn7"),f(e,"id","container"),f(e,"class","svelte-112zgn7")},m(t,n){i(t,e,n),c(e,o);for(let t=0;t<l.length;t+=1)l[t].m(o,null)},p(t,[n]){if(7&n){let e;for(r=t[0].cells,e=0;e<r.length;e+=1){const c=z(t,r,e);l[e]?l[e].p(c,n):(l[e]=D(c),l[e].c(),l[e].m(o,null))}for(;e<l.length;e+=1)l[e].d(1);l.length=r.length}},i:t,o:t,d(t){t&&a(e),s(l,t)}}}const Y="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=!@#$%^&*()_+`~,./<>?[]{}|";function q(t){return new Promise((n=>setTimeout(n,t)))}function J(t,n,e){const o={home:j,about:I,projects:C,contact:H,personal:N},r=document.createElement("canvas").getContext("2d");r.font="20px Inconsolata";const l=r.measureText(" "),c=Math.ceil(window.innerWidth/l.width),i=Math.ceil(window.innerHeight/20);let a={width:c,height:i,cells:Array(i).fill().map((t=>Array(c).fill().map((t=>({char:Y[Math.floor(Math.random()*Y.length)]})))))};async function s(t,n={}){const o=Math.floor(a.height/2-t.height/2),r=Math.floor(a.width/2-t.width/2),l=100,c=t=>Math.floor(Array(t/2).fill().map((t=>Math.random())).reduce(((t,n)=>t+n),0)+Math.random()*(t/2)),i=Array(a.height).fill().map((t=>Array(a.width).fill().map((t=>{let n=c(l);n>50&&(n=l-n);let e=c(l);return e<50&&(e=l-e),{change1:n,change2:e}}))));for(let n=0;n<l;n++){for(let l=0;l<a.cells.length;l++)for(let c=0;c<a.cells[l].length;c++)i[l][c].change1===n&&(e(0,a.cells[l][c].char=Y[Math.floor(Math.random()*Y.length)],a),e(0,a.cells[l][c].func=void 0,a),e(0,a.cells[l][c].href=void 0,a)),i[l][c].change2===n&&(e(0,a.cells[l][c].char=" ",a),l-o>=0&&l-o<t.height&&c-r>=0&&c-r<t.width&&e(0,a.cells[l][c]=Object.assign({},t.cells[l-o][c-r]),a));await q(50),e(0,a)}}s(j);return[a,o,s,t=>s(o[t.func])]}return new class extends class{$destroy(){!function(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),T(this,t,J,R,l,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
