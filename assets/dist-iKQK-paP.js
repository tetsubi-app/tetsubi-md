import{N as e,P as t,V as n}from"./ParseError-m8LVIMfr.js";import{fi as r,li as i,ui as a}from"./actions-C7cIXQEG.js";var o=`-ms-`,s=`-moz-`,c=`-webkit-`,l=`comm`,u=`rule`,d=`decl`,f=`@import`,p=`@namespace`,m=`@keyframes`,h=`@layer`,g=Math.abs,_=String.fromCharCode,v=Object.assign;function y(e,t){return w(e,0)^45?(((t<<2^w(e,0))<<2^w(e,1))<<2^w(e,2))<<2^w(e,3):0}function b(e){return e.trim()}function x(e,t){return(e=t.exec(e))?e[0]:e}function S(e,t,n){return e.replace(t,n)}function C(e,t,n){return e.indexOf(t,n)}function w(e,t){return e.charCodeAt(t)|0}function T(e,t,n){return e.slice(t,n)}function E(e){return e.length}function D(e){return e.length}function O(e,t){return t.push(e),e}function k(e,t){return e.map(t).join(``)}function A(e,t){return e.filter(function(e){return!x(e,t)})}var j=1,M=1,N=0,P=0,F=0,I=``;function L(e,t,n,r,i,a,o,s){return{value:e,root:t,parent:n,type:r,props:i,children:a,line:j,column:M,length:o,return:``,siblings:s}}function R(e,t){return v(L(``,null,null,``,null,null,0,e.siblings),e,{length:-e.length},t)}function z(e){for(;e.root;)e=R(e.root,{children:[e]});O(e,e.siblings)}function ee(){return F}function te(){return F=P>0?w(I,--P):0,M--,F===10&&(M=1,j--),F}function B(){return F=P<N?w(I,P++):0,M++,F===10&&(M=1,j++),F}function V(){return w(I,P)}function ne(){return P}function re(e,t){return T(I,e,t)}function ie(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function ae(e){return j=M=1,N=E(I=e),P=0,[]}function oe(e){return I=``,e}function se(e){return b(re(P-1,ue(e===91?e+2:e===40?e+1:e)))}function ce(e){for(;(F=V())&&F<33;)B();return ie(e)>2||ie(F)>3?``:` `}function le(e,t){for(;--t&&B()&&!(F<48||F>102||F>57&&F<65||F>70&&F<97););return re(e,ne()+(t<6&&V()==32&&B()==32))}function ue(e){for(;B();)switch(F){case e:return P;case 34:case 39:e!==34&&e!==39&&ue(F);break;case 40:e===41&&ue(e);break;case 92:B()}return P}function de(e,t){for(;B()&&e+F!==57&&(e+F!==84||V()!==47););return`/*`+re(t,P-1)+`*`+_(e===47?e:B())}function fe(e){for(;!ie(V());)B();return re(e,P)}function pe(e){return oe(me(``,null,null,null,[``],e=ae(e),0,[0],e))}function me(e,t,n,r,i,a,o,s,c){for(var l=0,u=0,d=o,f=0,p=0,m=0,h=1,v=1,y=1,b=0,x=``,D=i,k=a,A=r,j=x;v;)switch(m=b,b=B()){case 40:if(m!=108&&w(j,d-1)==58){C(j+=S(se(b),`&`,`&\f`),`&\f`,g(l?s[l-1]:0))!=-1&&(y=-1);break}case 34:case 39:case 91:j+=se(b);break;case 9:case 10:case 13:case 32:j+=ce(m);break;case 92:j+=le(ne()-1,7);continue;case 47:switch(V()){case 42:case 47:O(ge(de(B(),ne()),t,n,c),c),(ie(m||1)==5||ie(V()||1)==5)&&E(j)&&T(j,-1,void 0)!==` `&&(j+=` `);break;default:j+=`/`}break;case 123*h:s[l++]=E(j)*y;case 125*h:case 59:case 0:switch(b){case 0:case 125:v=0;case 59+u:y==-1&&(j=S(j,/\f/g,``)),p>0&&(E(j)-d||h===0&&m===47)&&O(p>32?_e(j+`;`,r,n,d-1,c):_e(S(j,` `,``)+`;`,r,n,d-2,c),c);break;case 59:j+=`;`;default:if(O(A=he(j,t,n,l,u,i,s,x,D=[],k=[],d,a),a),b===123){if(u===0)me(j,t,A,A,D,a,d,s,k);else{switch(f){case 99:if(w(j,3)===110)break;case 108:if(w(j,2)===97)break;default:u=0;case 100:case 109:case 115:}u?me(e,A,A,r&&O(he(e,A,A,0,0,i,s,x,i,D=[],d,k),k),i,k,d,s,r?D:k):me(j,A,A,A,[``],k,0,s,k)}}}l=u=p=0,h=y=1,x=j=``,d=o;break;case 58:d=1+E(j),p=m;default:if(h<1){if(b==123)--h;else if(b==125&&h++==0&&te()==125)continue}switch(j+=_(b),b*h){case 38:y=u>0?1:(j+=`\f`,-1);break;case 44:s[l++]=(E(j)-1)*y,y=1;break;case 64:V()===45&&(j+=se(B())),f=V(),u=d=E(x=j+=fe(ne())),b++;break;case 45:m===45&&E(j)==2&&(h=0)}}return a}function he(e,t,n,r,i,a,o,s,c,l,d,f){for(var p=i-1,m=i===0?a:[``],h=D(m),_=0,v=0,y=0;_<r;++_)for(var x=0,C=T(e,p+1,p=g(v=o[_])),w=e;x<h;++x)(w=b(v>0?m[x]+` `+C:S(C,/&\f/g,m[x])))&&(c[y++]=w);return L(e,t,n,i===0?u:s,c,l,d,f)}function ge(e,t,n,r){return L(e,t,n,l,_(ee()),T(e,2,-2),0,r)}function _e(e,t,n,r,i){return L(e,t,n,d,T(e,0,r),T(e,r+1,-1),r,i)}function ve(e,t,n){switch(y(e,t)){case 5103:return c+`print-`+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:case 6391:case 5879:case 5623:case 6135:case 4599:return c+e+e;case 4855:return c+e.replace(`add`,`source-over`).replace(`substract`,`source-out`).replace(`intersect`,`source-in`).replace(`exclude`,`xor`)+e;case 4789:return s+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return c+e+s+e+o+e+e;case 5936:switch(w(e,t+11)){case 114:return c+e+o+S(e,/[svh]\w+-[tblr]{2}/,`tb`)+e;case 108:return c+e+o+S(e,/[svh]\w+-[tblr]{2}/,`tb-rl`)+e;case 45:return c+e+o+S(e,/[svh]\w+-[tblr]{2}/,`lr`)+e}case 6828:case 4268:case 2903:return c+e+o+e+e;case 6165:return c+e+o+`flex-`+e+e;case 5187:return c+e+S(e,/(\w+).+(:[^]+)/,c+`box-$1$2`+o+`flex-$1$2`)+e;case 5443:return c+e+o+`flex-item-`+S(e,/flex-|-self/g,``)+(x(e,/flex-|baseline/)?``:o+`grid-row-`+S(e,/flex-|-self/g,``))+e;case 4675:return c+e+o+`flex-line-pack`+S(e,/align-content|flex-|-self/g,``)+e;case 5548:return c+e+o+S(e,`shrink`,`negative`)+e;case 5292:return c+e+o+S(e,`basis`,`preferred-size`)+e;case 6060:return c+`box-`+S(e,`-grow`,``)+c+e+o+S(e,`grow`,`positive`)+e;case 4554:return c+S(e,/([^-])(transform)/g,`$1`+c+`$2`)+e;case 6187:return S(S(S(e,/(zoom-|grab)/,c+`$1`),/(image-set)/,c+`$1`),e,``)+e;case 5495:case 3959:return S(e,/(image-set\([^]*)/,c+"$1$`$1");case 4968:return S(S(e,/(.+:)(flex-)?(.*)/,c+`box-pack:$3`+o+`flex-pack:$3`),/space-between/,`justify`)+c+e+e;case 4200:if(!x(e,/flex-|baseline/))return o+`grid-column-align`+T(e,t)+e;break;case 2592:case 3360:return o+S(e,`template-`,``)+e;case 4384:case 3616:return n&&n.some(function(e,n){return t=n,x(e.props,/grid-\w+-end/)})?~C(e+(n=n[t].value),`span`,0)?e:o+S(e,`-start`,``)+e+o+`grid-row-span:`+(~C(n,`span`,0)?x(n,/\d+/):+x(n,/\d+/)-x(e,/\d+/))+`;`:o+S(e,`-start`,``)+e;case 4896:case 4128:return n&&n.some(function(e){return x(e.props,/grid-\w+-start/)})?e:o+S(S(e,`-end`,`-span`),`span `,``)+e;case 4095:case 3583:case 4068:case 2532:return S(e,/(.+)-inline(.+)/,c+`$1$2`)+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(E(e)-1-t>6)switch(w(e,t+1)){case 109:if(w(e,t+4)!==45)break;case 102:return S(e,/(.+:)(.+)-([^]+)/,`$1`+c+`$2-$3$1`+s+(w(e,t+3)==108?`$3`:`$2-$3`))+e;case 115:return~C(e,`stretch`,0)?ve(S(e,`stretch`,`fill-available`),t,n)+e:e}break;case 5152:case 5920:return S(e,/(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/,function(t,n,r,i,a,s,c){return o+n+`:`+r+c+(i?o+n+`-span:`+(a?s:+s-r)+c:``)+e});case 4949:if(w(e,t+6)===121)return S(e,`:`,`:`+c)+e;break;case 6444:switch(w(e,w(e,14)===45?18:11)){case 120:return S(e,/(.+:)([^;\s!]+)(;|(\s+)?!.+)?/,`$1`+c+(w(e,14)===45?`inline-`:``)+`box$3$1`+c+`$2$3$1`+o+`$2box$3`)+e;case 100:return S(e,`:`,`:`+o)+e}break;case 5719:case 2647:case 2135:case 3927:case 2391:return S(e,`scroll-`,`scroll-snap-`)+e}return e}function ye(e,t){for(var n=``,r=0;r<e.length;r++)n+=t(e[r],r,e,t)||``;return n}function be(e,t,n,r){switch(e.type){case h:if(e.children.length)break;case f:case p:case d:return e.return=e.return||e.value;case l:return``;case m:return e.return=e.value+`{`+ye(e.children,r)+`}`;case u:if(!E(e.value=e.props.join(`,`)))return``}return E(n=ye(e.children,r))?e.return=e.value+`{`+n+`}`:``}function xe(e){var t=D(e);return function(n,r,i,a){for(var o=``,s=0;s<t;s++)o+=e[s](n,r,i,a)||``;return o}}function Se(e){return function(t){t.root||(t=t.return)&&e(t)}}function Ce(e,t,n,r){if(e.length>-1&&!e.return)switch(e.type){case d:e.return=ve(e.value,e.length,n);return;case m:return ye([R(e,{value:S(e.value,`@`,`@`+c)})],r);case u:if(e.length)return k(n=e.props,function(t){switch(x(t,r=/(::plac\w+|:read-\w+)/)){case`:read-only`:case`:read-write`:z(R(e,{props:[S(t,/:(read-\w+)/,`:`+s+`$1`)]})),z(R(e,{props:[t]})),v(e,{props:A(n,r)});break;case`::placeholder`:z(R(e,{props:[S(t,/:(plac\w+)/,`:`+c+`input-$1`)]})),z(R(e,{props:[S(t,/:(plac\w+)/,`:`+s+`$1`)]})),z(R(e,{props:[S(t,/:(plac\w+)/,o+`input-$1`)]})),z(R(e,{props:[t]})),v(e,{props:A(n,r)})}return``})}}var we=r();e();var H=n(a());function Te(e,...t){return Error(`An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#${e} for more information.${t.length>0?` Args: ${t.join(`, `)}`:``}`)}var U=t!==void 0&&({}.REACT_APP_SC_ATTR||{}.SC_ATTR)||`data-styled`,Ee=`active`,De=`data-styled-version`,Oe=`6.6.0`,ke=`/*!sc*/
`,Ae=typeof window<`u`&&typeof document<`u`;if(!H.createContext)throw Te(19);function je(e){if(t!==void 0){let t={}[e];if(t!==void 0&&t!==``)return t!==`false`}}var Me=!!(typeof SC_DISABLE_SPEEDY==`boolean`?SC_DISABLE_SPEEDY:je(`REACT_APP_SC_DISABLE_SPEEDY`)??je(`SC_DISABLE_SPEEDY`)??(t!==void 0&&!1)),Ne=`sc-keyframes-`,Pe=new Map,Fe=new Map,Ie=1,Le=e=>{if(Pe.has(e))return Pe.get(e);for(;Fe.has(Ie);)Ie++;let t=Ie++;return Pe.set(e,t),Fe.set(t,e),t},Re=e=>Fe.get(e),ze=(e,t)=>{Ie=t+1,Pe.set(e,t),Fe.set(t,e)},Be=Object.freeze([]),Ve=Object.freeze({});function He(e,t,n=Ve){return e.theme!==n.theme&&e.theme||t||n.theme}var Ue=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,We=/(^-|-$)/g;function Ge(e){return e.replace(Ue,`-`).replace(We,``)}var Ke=/(a)(d)/gi,qe=e=>String.fromCharCode(e+(e>25?39:97));function Je(e){let t,n=``;for(t=Math.abs(e);t>52;t=t/52|0)n=qe(t%52)+n;return(qe(t%52)+n).replace(Ke,`$1-$2`)}var Ye=5381,Xe=(e,t)=>{let n=t.length;for(;n;)e=33*e^t.charCodeAt(--n);return e},Ze=e=>Xe(Ye,e);function Qe(e){return Je(Ze(e)>>>0)}function $e(e){return e.displayName||e.name||`Component`}function et(e){return typeof e==`string`&&!0}function tt(e){return et(e)?`styled.${e}`:`Styled(${$e(e)})`}var nt=Symbol.for(`react.memo`),rt=Symbol.for(`react.forward_ref`),it={contextType:!0,defaultProps:!0,displayName:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,propTypes:!0,type:!0},at={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},ot={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},st={[rt]:{$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},[nt]:ot};function ct(e){return(`type`in(t=e)&&t.type.$$typeof)===nt?ot:`$$typeof`in e?st[e.$$typeof]:it;var t}var lt=Object.defineProperty,ut=Object.getOwnPropertyNames,dt=Object.getOwnPropertySymbols,ft=Object.getOwnPropertyDescriptor,pt=Object.getPrototypeOf,mt=Object.prototype;function ht(e,t,n){if(typeof t!=`string`){let r=pt(t);r&&r!==mt&&ht(e,r,n);let i=ut(t).concat(dt(t)),a=ct(e),o=ct(t);for(let r=0;r<i.length;++r){let s=i[r];if(!(s in at||n&&n[s]||o&&s in o||a&&s in a)){let n=ft(t,s);try{lt(e,s,n)}catch{}}}}return e}function gt(e){return typeof e==`function`}var _t=Symbol.for(`react.forward_ref`);function vt(e){return e!=null&&(typeof e==`object`||typeof e==`function`)&&e.$$typeof===_t&&`styledComponentId`in e}function yt(e,t){return e&&t?e+` `+t:e||t||``}function bt(e,t){return e.join(t||``)}function xt(e){return typeof e==`object`&&!!e&&e.constructor.name===Object.name&&!(`props`in e&&e.$$typeof)}function St(e,t,n=!1){if(!n&&!xt(e)&&!Array.isArray(e))return t;if(Array.isArray(t))for(let n=0;n<t.length;n++)e[n]=St(e[n],t[n]);else if(xt(t))for(let n in t)e[n]=St(e[n],t[n]);return e}function Ct(e,t){Object.defineProperty(e,"toString",{value:t})}var wt=class{constructor(e){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=e,this._cGroup=0,this._cIndex=0}indexOfGroup(e){if(e===this._cGroup)return this._cIndex;let t=this._cIndex;if(e>this._cGroup)for(let n=this._cGroup;n<e;n++)t+=this.groupSizes[n];else for(let n=this._cGroup-1;n>=e;n--)t-=this.groupSizes[n];return this._cGroup=e,this._cIndex=t,t}insertRules(e,t){if(e>=this.groupSizes.length){let t=this.groupSizes,n=t.length,r=n;for(;e>=r;)if(r<<=1,r<0)throw Te(16,`${e}`);this.groupSizes=new Uint32Array(r),this.groupSizes.set(t),this.length=r;for(let e=n;e<r;e++)this.groupSizes[e]=0}let n=this.indexOfGroup(e+1),r=0;for(let i=0,a=t.length;i<a;i++)this.tag.insertRule(n,t[i])&&(this.groupSizes[e]++,n++,r++);r>0&&this._cGroup>e&&(this._cIndex+=r)}clearGroup(e){if(e<this.length){let t=this.groupSizes[e],n=this.indexOfGroup(e),r=n+t;this.groupSizes[e]=0;for(let e=n;e<r;e++)this.tag.deleteRule(n);t>0&&this._cGroup>e&&(this._cIndex-=t)}}getGroup(e){let t=``;if(e>=this.length||this.groupSizes[e]===0)return t;let n=this.groupSizes[e],r=this.indexOfGroup(e),i=r+n;for(let e=r;e<i;e++)t+=this.tag.getRule(e)+ke;return t}},Tt=`style[${U}][${De}="${Oe}"]`,Et=RegExp(`^${U}\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)`),Dt=e=>typeof ShadowRoot<`u`&&e instanceof ShadowRoot||`host`in e&&e.nodeType===11,Ot=e=>{if(!e)return document;if(Dt(e))return e;if(`getRootNode`in e){let t=e.getRootNode();if(Dt(t))return t}return document},kt=(e,t,n)=>{let r=n.split(`,`),i;for(let n=0,a=r.length;n<a;n++)(i=r[n])&&e.registerName(t,i)},At=(e,t)=>{let n=(t.textContent??``).split(ke),r=[];for(let t=0,i=n.length;t<i;t++){let i=n[t].trim();if(!i)continue;let a=i.match(Et);if(a){let t=0|parseInt(a[1],10),n=a[2];t!==0&&(ze(n,t),kt(e,n,a[3]),e.getTag().insertRules(t,r)),r.length=0}else r.push(i)}},jt=e=>{let t=Ot(e.options.target).querySelectorAll(Tt);for(let n=0,r=t.length;n<r;n++){let r=t[n];r&&r.getAttribute(U)!==Ee&&(At(e,r),r.parentNode&&r.parentNode.removeChild(r))}},Mt=!1;function Nt(){if(!1!==Mt)return Mt;if(typeof document<`u`){let e=document.head.querySelector(`meta[property="csp-nonce"]`);if(e)return Mt=e.nonce||e.getAttribute(`content`)||void 0;let t=document.head.querySelector(`meta[name="sc-nonce"]`);if(t)return Mt=t.getAttribute(`content`)||void 0}return Mt=typeof __webpack_nonce__<`u`?__webpack_nonce__:void 0}var Pt=(e,t)=>{if(typeof document>`u`)throw Te(20);let n=document.head,r=e||n,i=document.createElement(`style`),a=(e=>{let t=Array.from(e.querySelectorAll(`style[${U}]`));return t[t.length-1]})(r),o=a===void 0?null:a.nextSibling;i.setAttribute(U,Ee),i.setAttribute(De,Oe);let s=t||Nt();return s&&i.setAttribute(`nonce`,s),r.insertBefore(i,o),i},Ft=class{constructor(e,t){this.element=Pt(e,t),this.element.appendChild(document.createTextNode(``)),this.sheet=(e=>{if(e.sheet)return e.sheet;let t=e.getRootNode().styleSheets??document.styleSheets;for(let n=0,r=t.length;n<r;n++){let r=t[n];if(r.ownerNode===e)return r}throw Te(17)})(this.element),this.length=0}insertRule(e,t){try{return this.sheet.insertRule(t,e),this.length++,!0}catch{return!1}}deleteRule(e){this.sheet.deleteRule(e),this.length--}getRule(e){let t=this.sheet.cssRules[e];return t&&t.cssText?t.cssText:``}},It=class{constructor(e,t){this.element=Pt(e,t),this.nodes=this.element.childNodes,this.length=0}insertRule(e,t){if(e<=this.length&&e>=0){let n=document.createTextNode(t);return this.element.insertBefore(n,this.nodes[e]||null),this.length++,!0}return!1}deleteRule(e){this.element.removeChild(this.nodes[e]),this.length--}getRule(e){return e<this.length?this.nodes[e].textContent:``}},Lt=Ae,Rt={isServer:!Ae,useCSSOMInjection:!Me},zt=class e{static registerId(e){return Le(e)}constructor(e=Ve,t={},n){this.options=Object.assign(Object.assign({},Rt),e),this.gs=t,this.keyframeIds=new Set,this.names=new Map(n),this.server=!!e.isServer,!this.server&&Ae&&Lt&&(Lt=!1,jt(this)),Ct(this,()=>(e=>{let t=e.getTag(),{length:n}=t,r=``;for(let i=0;i<n;i++){let n=Re(i);if(n===void 0)continue;let a=e.names.get(n);if(a===void 0||!a.size)continue;let o=t.getGroup(i);if(o.length===0)continue;let s=U+`.g`+i+`[id="`+n+`"]`,c=``;for(let e of a)e.length>0&&(c+=e+`,`);r+=o+s+`{content:"`+c+`"}/*!sc*/
`}return r})(this))}rehydrate(){!this.server&&Ae&&jt(this)}reconstructWithOptions(t,n=!0){let r=new e(Object.assign(Object.assign({},this.options),t),this.gs,n&&this.names||void 0);return r.keyframeIds=new Set(this.keyframeIds),!this.server&&Ae&&t.target!==this.options.target&&Ot(this.options.target)!==Ot(t.target)&&jt(r),r}allocateGSInstance(e){return this.gs[e]=(this.gs[e]||0)+1}getTag(){return this.tag||=(e=(({useCSSOMInjection:e,target:t,nonce:n})=>e?new Ft(t,n):new It(t,n))(this.options),new wt(e));var e}hasNameForId(e,t){var n;return(n=this.names.get(e)?.has(t))!=null&&n}registerName(e,t){Le(e),e.startsWith(Ne)&&this.keyframeIds.add(e);let n=this.names.get(e);n?n.add(t):this.names.set(e,new Set([t]))}insertRules(e,t,n){this.registerName(e,t),this.getTag().insertRules(Le(e),n)}clearNames(e){this.names.has(e)&&this.names.get(e).clear()}clearRules(e){this.getTag().clearGroup(Le(e)),this.clearNames(e)}clearTag(){this.tag=void 0}},Bt=new WeakSet,Vt={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexShrink:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,scale:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1};function Ht(e,t){return t==null||typeof t==`boolean`||t===``?``:typeof t!=`number`||t===0||e in Vt||e.startsWith(`--`)?String(t).trim():t+`px`}var Ut=47;function Wt(e){if(e.charCodeAt(0)===45&&e.charCodeAt(1)===45)return e;let t=``;for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);t+=r>=65&&r<=90?`-`+String.fromCharCode(r+32):e[n]}return t.startsWith(`ms-`)?`-`+t:t}var Gt=Symbol.for(`sc-keyframes`);function Kt(e){return typeof e==`object`&&!!e&&Gt in e}function qt(e){return gt(e)&&!(e.prototype&&e.prototype.isReactComponent)}var Jt=e=>e==null||!1===e||e===``,Yt=Symbol.for(`react.client.reference`);function Xt(e){return e.$$typeof===Yt}function Zt(e,t){for(let n in e){let r=e[n];e.hasOwnProperty(n)&&!Jt(r)&&(Array.isArray(r)&&Bt.has(r)||gt(r)?t.push(Wt(n)+`:`,r,`;`):xt(r)?(t.push(n+` {`),Zt(r,t),t.push(`}`)):t.push(Wt(n)+`: `+Ht(n,r)+`;`))}}function Qt(e,t,n,r,i=[]){if(Jt(e))return i;let a=typeof e;if(a===`string`)return i.push(e),i;if(a===`function`)return Xt(e)?i:qt(e)&&t?Qt(e(t),t,n,r,i):(i.push(e),i);if(Array.isArray(e)){for(let a=0;a<e.length;a++)Qt(e[a],t,n,r,i);return i}return vt(e)?(i.push(`.${e.styledComponentId}`),i):Kt(e)?(n?(e.inject(n,r),i.push(e.getName(r))):i.push(e),i):Xt(e)?i:xt(e)&&e.toString===Object.prototype.toString?(Zt(e,i),i):(i.push(e.toString()),i)}var $t=Ze(Oe),en=class{constructor(e,t,n){this.rules=e,this.componentId=t,this.baseHash=Xe($t,t),this.baseStyle=n,zt.registerId(t)}generateAndInjectStyles(e,t,n){let r=this.baseStyle?this.baseStyle.generateAndInjectStyles(e,t,n):``;{let i=``;for(let r=0;r<this.rules.length;r++){let a=this.rules[r];if(typeof a==`string`)i+=a;else if(a){if(qt(a)){let r=a(e);typeof r==`string`?i+=r:r!=null&&!1!==r&&(i+=bt(Qt(r,e,t,n)))}else i+=bt(Qt(a,e,t,n))}}if(i){this.dynamicNameCache||=new Map;let e=n.hash?n.hash+i:i,a=this.dynamicNameCache.get(e);if(!a){if(a=Je(Xe(Xe(this.baseHash,n.hash),i)>>>0),this.dynamicNameCache.size>=200){let e=this.dynamicNameCache.keys().next().value;e!==void 0&&this.dynamicNameCache.delete(e)}this.dynamicNameCache.set(e,a)}if(!t.hasNameForId(this.componentId,a)){let e=n(i,`.`+a,void 0,this.componentId);t.insertRules(this.componentId,a,e)}r=yt(r,a)}}return r}},tn=/&/g;function nn(e,t){let n=0;for(;--t>=0&&e.charCodeAt(t)===92;)n++;return!(1&~n)}function rn(e){let t=e.length,n=``,r=0,i=0,a=0,o=!1,s=!1;for(let c=0;c<t;c++){let l=e.charCodeAt(c);if(a!==0||o||l!==Ut||e.charCodeAt(c+1)!==42){if(o)l===42&&e.charCodeAt(c+1)===Ut&&(o=!1,c++);else if(l!==34&&l!==39||nn(e,c)){if(a===0){if(l===123)i++;else if(l===125){if(i--,i<0){s=!0;let n=c+1;for(;n<t;){let t=e.charCodeAt(n);if(t===59||t===10)break;n++}n<t&&e.charCodeAt(n)===59&&n++,i=0,c=n-1,r=n;continue}i===0&&(n+=e.substring(r,c+1),r=c+1)}else l===59&&i===0&&(n+=e.substring(r,c+1),r=c+1)}}else a===0?a=l:a===l&&(a=0)}else o=!0,c++}return s||i!==0||a!==0?(r<t&&i===0&&a===0&&(n+=e.substring(r)),n):e}function an(e,t){let n=t+` `,r=`,`+n;for(let i=0;i<e.length;i++){let a=e[i];if(a.type===`rule`){a.value=(n+a.value).replaceAll(`,`,r);let e=a.props,t=[];for(let r=0;r<e.length;r++)t[r]=n+e[r];a.props=t}Array.isArray(a.children)&&a.type!==`@keyframes`&&an(a.children,t)}return e}function on({options:e=Ve,plugins:t=Be}=Ve){let n,r,i,a=(e,t,i)=>i.startsWith(r)&&i.endsWith(r)&&i.replaceAll(r,``).length>0?`.${n}`:e,o=t.slice();o.push(e=>{e.type===`rule`&&e.value.includes(`&`)&&(i||=RegExp(`\\${r}\\b`,`g`),e.props[0]=e.props[0].replace(tn,r).replace(i,a))}),e.prefix&&o.push(Ce),o.push(be);let s=[],c=xe(o.concat(Se(e=>s.push(e)))),l=(t,a=``,o=``,l=`&`)=>{n=l,r=a,i=void 0;let u=function(e){let t=e.indexOf(`//`)!==-1,n=e.indexOf(`}`)!==-1;if(!t&&!n)return e;if(!t)return rn(e);let r=e.length,i=``,a=0,o=0,s=0,c=0,l=0,u=!1;for(;o<r;){let t=e.charCodeAt(o);if(t!==34&&t!==39||nn(e,o)){if(s===0){if(t===Ut&&o+1<r&&e.charCodeAt(o+1)===42){for(o+=2;o+1<r&&(e.charCodeAt(o)!==42||e.charCodeAt(o+1)!==Ut);)o++;o+=2}else if(t!==40){if(t!==41){if(c>0)o++;else if(t===42&&o+1<r&&e.charCodeAt(o+1)===Ut)i+=e.substring(a,o),o+=2,a=o,u=!0;else if(t===Ut&&o+1<r&&e.charCodeAt(o+1)===Ut){for(i+=e.substring(a,o);o<r&&e.charCodeAt(o)!==10;)o++;a=o,u=!0}else t===123?l++:t===125&&l--,o++}else c>0&&c--,o++}else c++,o++}else o++}else s===0?s=t:s===t&&(s=0),o++}return u?(a<r&&(i+=e.substring(a)),l===0?i:rn(i)):l===0?e:rn(e)}(t),d=pe(o||a?o+` `+a+` { `+u+` }`:u);return e.namespace&&(d=an(d,e.namespace)),s=[],ye(d,c),s},u=e,d=Ye;for(let e=0;e<t.length;e++)t[e].name||Te(15),d=Xe(d,t[e].name);return u!=null&&u.namespace&&(d=Xe(d,u.namespace)),u!=null&&u.prefix&&(d=Xe(d,`p`)),l.hash=d===Ye?``:d.toString(),l}var sn=new zt,cn=on(),ln=H.createContext({shouldForwardProp:void 0,styleSheet:sn,stylis:cn,stylisPlugins:void 0});ln.Consumer;function un(){return H.useContext(ln)}var dn=H.createContext(void 0);dn.Consumer;var fn={};function pn(e,t){let n=typeof e==`string`?Ge(e):`sc`;fn[n]=(fn[n]||0)+1;let r=n+`-`+Qe(Oe+n+fn[n]);return t?t+`-`+r:r}function mn(e,t,n){let r=vt(e),i=e,a=!et(e),{attrs:o=Be,componentId:s=pn(t.displayName,t.parentComponentId),displayName:c=tt(e)}=t,l=t.displayName&&t.componentId?Ge(t.displayName)+`-`+t.componentId:t.componentId||s,u=r&&i.attrs?i.attrs.concat(o).filter(Boolean):o,{shouldForwardProp:d}=t;if(r&&i.shouldForwardProp){let e=i.shouldForwardProp;if(t.shouldForwardProp){let n=t.shouldForwardProp;d=(t,r)=>e(t,r)&&n(t,r)}else d=e}let f=new en(n,l,r?i.componentStyle:void 0);function p(e,t){return function(e,t,n){let{attrs:r,componentStyle:i,defaultProps:a,foldedComponentIds:o,styledComponentId:s,target:c}=e,l=H.useContext(dn),u=un(),d=e.shouldForwardProp||u.shouldForwardProp,f=He(t,l,a)||Ve,[p,m]=function(e,t,n){let r=Object.assign(Object.assign({},t),{className:void 0,theme:n}),i=null,a=e.length>1;for(let t=0;t<e.length;t++){let n=e[t],o=gt(n)?n(a?Object.assign({},r):r):n;for(let e in o)e===`className`?r.className=yt(r.className,o[e]):e===`style`?r.style=Object.assign(Object.assign({},r.style),o[e]):o[e]===void 0?e in r&&(r[e]!==void 0&&(i||=[]).push(e),r[e]=void 0):r[e]=o[e]}return`className`in t&&typeof t.className==`string`&&(r.className=yt(r.className,t.className)),[r,i]}(r,t,f),h=i.generateAndInjectStyles(p,u.styleSheet,u.stylis),g=p.as||c,_=et(g),v=function(e,t,n,r,i,a){let o={};for(let s in e)s[0]===`$`||s===`as`||s===`theme`&&e.theme===n||(s===`forwardedAs`?e.forwardedAs!==void 0&&(o.as=e.forwardedAs):e[s]===void 0?s===`className`||i||a!==null&&a.indexOf(s)!==-1||r&&!r(s,t)||(o[s]=void 0):r&&!r(s,t)||(o[s]=e[s]));return o}(p,g,f,d,_,m),y=yt(o,s);return h&&(y+=` `+h),p.className&&(y+=` `+p.className),v[_&&g.includes(`-`)?`class`:`className`]=y,n&&(v.ref=n),(0,H.createElement)(g,v)}(m,e,t)}p.displayName=c;let m=H.forwardRef(p);return m.attrs=u,m.componentStyle=f,m.displayName=c,m.shouldForwardProp=d,m.foldedComponentIds=r?yt(i.foldedComponentIds,i.styledComponentId):``,m.styledComponentId=l,m.target=r?i.target:e,Object.defineProperty(m,"defaultProps",{get(){return this._foldedDefaultProps},set(e){this._foldedDefaultProps=r?function(e,...t){for(let n of t)St(e,n,!0);return e}({},i.defaultProps,e):e}}),Ct(m,()=>`.${m.styledComponentId}`),a&&ht(m,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0}),m}var hn=new Set(`a.abbr.address.area.article.aside.audio.b.bdi.bdo.blockquote.body.button.br.canvas.caption.cite.code.col.colgroup.data.datalist.dd.del.details.dfn.dialog.div.dl.dt.em.embed.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.header.hgroup.hr.html.i.iframe.img.input.ins.kbd.label.legend.li.main.map.mark.menu.meter.nav.object.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.slot.small.span.strong.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.u.ul.var.video.wbr.circle.clipPath.defs.ellipse.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feDistantLight.feDropShadow.feFlood.feFuncA.feFuncB.feFuncG.feFuncR.feGaussianBlur.feImage.feMerge.feMergeNode.feMorphology.feOffset.fePointLight.feSpecularLighting.feSpotLight.feTile.feTurbulence.filter.foreignObject.g.image.line.linearGradient.marker.mask.path.pattern.polygon.polyline.radialGradient.rect.stop.svg.switch.symbol.text.textPath.tspan.use`.split(`.`));function gn(e,t){let n=[e[0]];for(let r=0,i=t.length;r<i;r+=1)n.push(t[r],e[r+1]);return n}var _n=e=>(Bt.add(e),e);function W(e,...t){if(gt(e)||xt(e))return _n(Qt(gn(Be,[e,...t])));let n=e;return t.length===0&&n.length===1&&typeof n[0]==`string`?Qt(n):_n(Qt(gn(n,t)))}function vn(e,t,n=Ve){if(!t)throw Te(1,t);let r=(r,...i)=>e(t,n,W(r,...i));return r.attrs=r=>vn(e,t,Object.assign(Object.assign({},n),{attrs:Array.prototype.concat(n.attrs,r).filter(Boolean)})),r.withConfig=r=>vn(e,t,Object.assign(Object.assign({},n),r)),r}var yn=e=>vn(mn,e),G=yn;hn.forEach(e=>{G[e]=yn(e)}),`${U}`,`${U}`,`${U}`;var bn=`4px 4px 10px 0 rgba(0, 0, 0, 0.35)`,xn=`inset 2px 2px 3px rgba(0,0,0,0.2)`,K=()=>W`
  -webkit-text-fill-color: ${({theme:e})=>e.materialTextDisabled};
  color: ${({theme:e})=>e.materialTextDisabled};
  text-shadow: 1px 1px ${({theme:e})=>e.materialTextDisabledShadow};
  /* filter: grayscale(100%); */
`,q=({background:e=`material`,color:t=`materialText`}={})=>W`
  box-sizing: border-box;
  display: inline-block;
  background: ${({theme:t})=>t[e]};
  color: ${({theme:e})=>e[t]};
`,Sn=({mainColor:e=`black`,secondaryColor:t=`transparent`,pixelSize:n=2})=>W`
  background-image: ${[`linear-gradient(
      45deg,
      ${e} 25%,
      transparent 25%,
      transparent 75%,
      ${e} 75%
    )`,`linear-gradient(
      45deg,
      ${e} 25%,
      transparent 25%,
      transparent 75%,
      ${e} 75%
    )`].join(`,`)};
  background-color: ${t};
  background-size: ${`${n*2}px ${n*2}px`};
  background-position: 0 0, ${`${n}px ${n}px`};
`,Cn=()=>W`
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  color: ${({theme:e})=>e.materialText};
  background: ${({$disabled:e,theme:t})=>e?t.flatLight:t.canvas};
  border: 2px solid ${({theme:e})=>e.canvas};
  outline: 2px solid ${({theme:e})=>e.flatDark};
  outline-offset: -4px;
`,wn={button:{topLeftOuter:`borderLightest`,topLeftInner:`borderLight`,bottomRightInner:`borderDark`,bottomRightOuter:`borderDarkest`},buttonPressed:{topLeftOuter:`borderDarkest`,topLeftInner:`borderDark`,bottomRightInner:`borderLight`,bottomRightOuter:`borderLightest`},buttonThin:{topLeftOuter:`borderLightest`,topLeftInner:null,bottomRightInner:null,bottomRightOuter:`borderDark`},buttonThinPressed:{topLeftOuter:`borderDark`,topLeftInner:null,bottomRightInner:null,bottomRightOuter:`borderLightest`},field:{topLeftOuter:`borderDark`,topLeftInner:`borderDarkest`,bottomRightInner:`borderLight`,bottomRightOuter:`borderLightest`},grouping:{topLeftOuter:`borderDark`,topLeftInner:`borderLightest`,bottomRightInner:`borderDark`,bottomRightOuter:`borderLightest`},status:{topLeftOuter:`borderDark`,topLeftInner:null,bottomRightInner:null,bottomRightOuter:`borderLightest`},window:{topLeftOuter:`borderLight`,topLeftInner:`borderLightest`,bottomRightInner:`borderDark`,bottomRightOuter:`borderDarkest`}},Tn=({theme:e,topLeftInner:t,bottomRightInner:n,hasShadow:r=!1,hasInsetShadow:i=!1})=>[r?bn:!1,i?xn:!1,t!==null&&`inset 1px 1px 0px 1px ${e[t]}`,n!==null&&`inset -1px -1px 0 1px ${e[n]}`].filter(Boolean).join(`, `),J=({invert:e=!1,style:t=`button`}={})=>{let n={topLeftOuter:e?`bottomRightOuter`:`topLeftOuter`,topLeftInner:e?`bottomRightInner`:`topLeftInner`,bottomRightInner:e?`topLeftInner`:`bottomRightInner`,bottomRightOuter:e?`topLeftOuter`:`bottomRightOuter`};return W`
    border-style: solid;
    border-width: 2px;
    border-left-color: ${({theme:e})=>e[wn[t][n.topLeftOuter]]};
    border-top-color: ${({theme:e})=>e[wn[t][n.topLeftOuter]]};
    border-right-color: ${({theme:e})=>e[wn[t][n.bottomRightOuter]]};
    border-bottom-color: ${({theme:e})=>e[wn[t][n.bottomRightOuter]]};
    box-shadow: ${({theme:e,shadow:r})=>Tn({theme:e,topLeftInner:wn[t][n.topLeftInner],bottomRightInner:wn[t][n.bottomRightInner],hasShadow:r})};
  `},En=()=>W`
  outline: 2px dotted ${({theme:e})=>e.materialText};
`,Dn=typeof btoa<`u`?btoa:e=>we.Buffer.from(e).toString(`base64`),On=(e,t=0)=>`url(data:image/svg+xml;base64,${Dn(`<svg height="26" width="26" viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g transform="rotate(${t} 13 13)">
      <polygon fill="${e}" points="6,10 20,10 13,17"/>
    </g>
  </svg>`)})`,kn=(e=`default`)=>W`
  ::-webkit-scrollbar {
    width: 26px;
    height: 26px;
  }
  ::-webkit-scrollbar-track {
    ${({theme:t})=>Sn({mainColor:e===`flat`?t.flatLight:t.material,secondaryColor:e===`flat`?t.canvas:t.borderLightest})}
  }
  ::-webkit-scrollbar-thumb {
    ${q()}
    ${e===`flat`?Cn():J({style:`window`})}
      outline-offset: -2px;
  }

  ::-webkit-scrollbar-corner {
    background-color: ${({theme:e})=>e.material};
  }
  ::-webkit-scrollbar-button {
    ${q()}
    ${e===`flat`?Cn():J({style:`window`})}
      display: block;
    outline-offset: -2px;
    height: 26px;
    width: 26px;
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: 0 0;
  }
  ::-webkit-scrollbar-button:active,
  ::-webkit-scrollbar-button:active {
    background-position: 0 1px;
    ${e==="default"?J({style:`window`,invert:!0}):``}
  }

  ::-webkit-scrollbar-button:horizontal:increment:start,
  ::-webkit-scrollbar-button:horizontal:decrement:end,
  ::-webkit-scrollbar-button:vertical:increment:start,
  ::-webkit-scrollbar-button:vertical:decrement:end {
    display: none;
  }

  ::-webkit-scrollbar-button:horizontal:decrement {
    background-image: ${({theme:e})=>On(e.materialText,90)};
  }

  ::-webkit-scrollbar-button:horizontal:increment {
    background-image: ${({theme:e})=>On(e.materialText,270)};
  }

  ::-webkit-scrollbar-button:vertical:decrement {
    background-image: ${({theme:e})=>On(e.materialText,180)};
  }

  ::-webkit-scrollbar-button:vertical:increment {
    background-image: ${({theme:e})=>On(e.materialText,0)};
  }
`,An=G.a`
  color: ${({theme:e})=>e.anchor};
  font-size: inherit;
  text-decoration: ${({underline:e})=>e?`underline`:`none`};
  &:visited {
    color: ${({theme:e})=>e.anchorVisited};
  }
`,jn=(0,H.forwardRef)(({children:e,underline:t=!0,...n},r)=>H.createElement(An,{ref:r,underline:t,...n},e));jn.displayName=`Anchor`;var Mn=G.header`
  ${J()};
  ${q()};

  position: ${e=>e.position??(e.fixed?`fixed`:`absolute`)};
  top: 0;
  right: 0;
  left: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
`,Nn=(0,H.forwardRef)(({children:e,fixed:t=!0,position:n=`fixed`,...r},i)=>H.createElement(Mn,{fixed:t,position:t===!1?void 0:n,ref:i,...r},e));Nn.displayName=`AppBar`;var Pn=()=>{};function Fn(e,t,n){return n!==null&&e>n?n:t!==null&&e<t?t:e}function In(e){if(Math.abs(e)<1){let t=e.toExponential().split(`e-`),n=t[0].split(`.`)[1];return(n?n.length:0)+parseInt(t[1],10)}let t=e.toString().split(`.`)[1];return t?t.length:0}function Ln(e,t,n){let r=Math.round((e-n)/t)*t+n;return Number(r.toFixed(In(t)))}function Y(e){return typeof e==`number`?`${e}px`:e}var Rn=G.div`
  display: inline-block;
  box-sizing: border-box;
  object-fit: contain;
  ${({size:e})=>`
    height: ${e};
    width: ${e};
    `}
  border-radius: ${({square:e})=>e?0:`50%`};
  overflow: hidden;
  ${({noBorder:e,theme:t})=>!e&&`
    border-top: 2px solid ${t.borderDark};
    border-left: 2px solid ${t.borderDark};
    border-bottom: 2px solid ${t.borderLightest};
    border-right: 2px solid ${t.borderLightest};
    background: ${t.material};
  `}
  ${({src:e})=>!e&&`
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-weight: bold;
    font-size: 1rem;
  `}
`,zn=G.img`
  display: block;
  object-fit: contain;
  width: 100%;
  height: 100%;
`,Bn=(0,H.forwardRef)(({alt:e=``,children:t,noBorder:n=!1,size:r=35,square:i=!1,src:a,...o},s)=>H.createElement(Rn,{noBorder:n,ref:s,size:Y(r),square:i,src:a,...o},a?H.createElement(zn,{src:a,alt:e}):t));Bn.displayName=`Avatar`;var X={sm:`28px`,md:`36px`,lg:`44px`},Vn=W`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: ${({size:e=`md`})=>X[e]};
  width: ${({fullWidth:e,size:t=`md`,square:n})=>e?`100%`:n?X[t]:`auto`};
  padding: ${({square:e})=>e?0:`0 10px`};
  font-size: 1rem;
  user-select: none;
  &:active {
    padding-top: ${({disabled:e})=>!e&&`2px`};
  }
  padding-top: ${({active:e,disabled:t})=>e&&!t&&`2px`};
  &:after {
    content: '';
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
  &:not(:disabled) {
    cursor: pointer;
  }
  font-family: inherit;
`,Hn=G.button`
  ${({active:e,disabled:t,primary:n,theme:r,variant:i})=>i===`flat`?W`
          ${Cn()}
          ${n?`
          border: 2px solid ${r.checkmark};
            outline: 2px solid ${r.flatDark};
            outline-offset: -4px;
          `:`
          border: 2px solid ${r.flatDark};
            outline: 2px solid transparent;
            outline-offset: -4px;
          `}
          &:focus:after, &:active:after {
            ${!e&&!t&&En}
            outline-offset: -4px;
          }
        `:i===`menu`||i===`thin`?W`
          ${q()};
          border: 2px solid transparent;
          &:hover,
          &:focus {
            ${!t&&!e&&J({style:`buttonThin`})}
          }
          &:active {
            ${!t&&J({style:`buttonThinPressed`})}
          }
          ${e&&J({style:`buttonThinPressed`})}
          ${t&&K()}
        `:W`
          ${q()};
          border: none;
          ${t&&K()}
          ${e?Sn({mainColor:r.material,secondaryColor:r.borderLightest}):``}
          &:before {
            box-sizing: border-box;
            content: '';
            position: absolute;
            ${n?W`
                  left: 2px;
                  top: 2px;
                  width: calc(100% - 4px);
                  height: calc(100% - 4px);
                  outline: 2px solid ${r.borderDarkest};
                `:W`
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                `}

            ${J(e?{style:i===`raised`?`window`:`button`,invert:!0}:{style:i===`raised`?`window`:`button`,invert:!1})}
          }
          &:active:before {
            ${!t&&J({style:i===`raised`?`window`:`button`,invert:!0})}
          }
          &:focus:after,
          &:active:after {
            ${!e&&!t&&En}
            outline-offset: -8px;
          }
          &:active:focus:after,
          &:active:after {
            top: ${e?`0`:`1px`};
          }
        `}
  ${Vn}
`,Un=(0,H.forwardRef)(({onClick:e,disabled:t=!1,children:n,type:r=`button`,fullWidth:i=!1,size:a=`md`,square:o=!1,active:s=!1,onTouchStart:c=Pn,primary:l=!1,variant:u=`default`,...d},f)=>H.createElement(Hn,{active:s,disabled:t,$disabled:t,fullWidth:i,onClick:t?void 0:e,onTouchStart:c,primary:l,ref:f,size:a,square:o,type:r,variant:u,...d},n));Un.displayName=`Button`;function Z({defaultValue:e,onChange:t,onChangePropName:n=`onChange`,readOnly:r,value:i,valuePropName:a=`value`}){let o=i!==void 0,[s,c]=(0,H.useState)(e),l=(0,H.useCallback)(e=>{o||c(e)},[o]);if(o&&typeof t!=`function`&&!r){let e=`Warning: You provided a \`${a}\` prop to a component without an \`${n}\` handler.${a===`value`?`This will render a read-only field. If the field should be mutable use \`defaultValue\`. Otherwise, set either \`${n}\` or \`readOnly\`.`:`This breaks the component state. You must provide an \`${n}\` function that updates \`${a}\`.`}`;console.warn(e)}return[o?i:s,l]}var Wn=G.li`
  box-sizing: border-box;

  display: flex;
  align-items: center;
  position: relative;
  height: ${e=>X[e.size]};
  width: ${e=>e.square?X[e.size]:`auto`};
  padding: 0 8px;
  font-size: 1rem;
  white-space: nowrap;
  justify-content: ${e=>e.square?`space-around`:`space-between`};
  text-align: center;
  line-height: ${e=>X[e.size]};
  color: ${({theme:e})=>e.materialText};
  pointer-events: ${({$disabled:e})=>e?`none`:`auto`};
  font-weight: ${({primary:e})=>e?`bold`:`normal`};
  &:hover {
    ${({theme:e,$disabled:t})=>!t&&`
        color: ${e.materialTextInvert};
        background: ${e.hoverBackground};
      `}

    cursor: default;
  }
  ${e=>e.$disabled&&K()}
`,Gn=(0,H.forwardRef)(({size:e=`lg`,disabled:t,square:n,children:r,onClick:i,primary:a,...o},s)=>H.createElement(Wn,{$disabled:t,size:e,square:n,onClick:t?void 0:i,primary:a,role:`menuitem`,ref:s,"aria-disabled":t,...o},r));Gn.displayName=`MenuListItem`;var Kn=G.ul.attrs(()=>({role:`menu`}))`
  box-sizing: border-box;
  width: ${e=>e.fullWidth?`100%`:`auto`};
  padding: 4px;
  ${J({style:`window`})}
  ${q()}
  ${e=>e.inline&&`
    display: inline-flex;
    align-items: center;
  `}
  list-style: none;
  position: relative;
`;Kn.displayName=`MenuList`;var qn=G.input`
  position: absolute;
  left: 0;
  margin: 0;
  width: ${20}px;
  height: ${20}px;
  opacity: 0;
  z-index: -1;
`,Jn=G.label`
  display: inline-flex;
  align-items: center;
  position: relative;
  margin: 8px 0;
  cursor: ${({$disabled:e})=>e?`auto`:`pointer`};
  user-select: none;
  font-size: 1rem;
  color: ${({theme:e})=>e.materialText};
  ${e=>e.$disabled&&K()}

  ${Wn} & {
    margin: 0;
    height: 100%;
  }
  ${Wn}:hover & {
    ${({$disabled:e,theme:t})=>!e&&W`
        color: ${t.materialTextInvert};
      `};
  }
`,Yn=G.span`
  display: inline-block;
  line-height: 1;
  padding: 2px;
  ${qn}:focus ~ & {
    ${En}
  }
  ${qn}:not(:disabled) ~ &:active {
    ${En}
  }
`,Q=G.div`
  position: relative;
  box-sizing: border-box;
  padding: 2px;
  font-size: 1rem;
  border-style: solid;
  border-width: 2px;
  border-left-color: ${({theme:e})=>e.borderDark};
  border-top-color: ${({theme:e})=>e.borderDark};
  border-right-color: ${({theme:e})=>e.borderLightest};
  border-bottom-color: ${({theme:e})=>e.borderLightest};
  line-height: 1.5;
  &:before {
    position: absolute;
    left: 0;
    top: 0;
    content: '';
    width: calc(100% - 4px);
    height: calc(100% - 4px);

    border-style: solid;
    border-width: 2px;
    border-left-color: ${({theme:e})=>e.borderDarkest};
    border-top-color: ${({theme:e})=>e.borderDarkest};
    border-right-color: ${({theme:e})=>e.borderLight};
    border-bottom-color: ${({theme:e})=>e.borderLight};

    pointer-events: none;
    ${e=>e.shadow&&`box-shadow:inset 2px 2px 3px rgba(0,0,0,0.2);`}
  }
`,Xn=G.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 4px;
  overflow: auto;
  ${kn()}
`,Zn=(0,H.forwardRef)(({children:e,shadow:t=!0,...n},r)=>H.createElement(Q,{ref:r,shadow:t,...n},H.createElement(Xn,null,e)));Zn.displayName=`ScrollView`;var Qn=W`
  width: ${20}px;
  height: ${20}px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-right: 0.5rem;
`,$n=G(Q)`
  ${Qn}
  width: ${20}px;
  height: ${20}px;
  background: ${({$disabled:e,theme:t})=>e?t.material:t.canvas};
  &:before {
    box-shadow: none;
  }
`,er=G.div`
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  background: ${({$disabled:e,theme:t})=>e?t.flatLight:t.canvas};
  ${Qn}
  width: ${16}px;
  height: ${16}px;
  outline: none;
  border: 2px solid ${({theme:e})=>e.flatDark};
  background: ${({$disabled:e,theme:t})=>e?t.flatLight:t.canvas};
`,tr=G.span.attrs(()=>({"data-testid":`checkmarkIcon`}))`
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;
  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 50%;
    top: calc(50% - 1px);
    width: 3px;
    height: 7px;

    border: solid
      ${({$disabled:e,theme:t})=>e?t.checkmarkDisabled:t.checkmark};
    border-width: 0 3px 3px 0;
    transform: translate(-50%, -50%) rotate(45deg);

    border-color: ${e=>e.$disabled?e.theme.checkmarkDisabled:e.theme.checkmark};
  }
`,nr=G.span.attrs(()=>({"data-testid":`indeterminateIcon`}))`
  display: inline-block;
  position: relative;

  width: 100%;
  height: 100%;

  &:after {
    content: '';
    display: block;

    width: 100%;
    height: 100%;

    ${({$disabled:e,theme:t})=>Sn({mainColor:e?t.checkmarkDisabled:t.checkmark})}
    background-position: 0px 0px, 2px 2px;
  }
`,rr={flat:er,default:$n},ir=(0,H.forwardRef)(({checked:e,className:t=``,defaultChecked:n=!1,disabled:r=!1,indeterminate:i=!1,label:a=``,onChange:o=Pn,style:s={},value:c,variant:l=`default`,...u},d)=>{let[f,p]=Z({defaultValue:n,onChange:o,readOnly:u.readOnly??r,value:e}),m=(0,H.useCallback)(e=>{let t=e.target.checked;p(t),o(e)},[o,p]),h=rr[l],g=null;return i?g=nr:f&&(g=tr),H.createElement(Jn,{$disabled:r,className:t,style:s},H.createElement(qn,{disabled:r,onChange:r?void 0:m,readOnly:r,type:`checkbox`,value:c,checked:f,"data-indeterminate":i,ref:d,...u}),H.createElement(h,{$disabled:r,role:`presentation`},g&&H.createElement(g,{$disabled:r,variant:l})),a&&H.createElement(Yn,null,a))});ir.displayName=`Checkbox`;var ar=G.div`
  ${({orientation:e,theme:t,size:n=`100%`})=>e===`vertical`?`
    height: ${Y(n)};
    border-left: 2px solid ${t.borderDark};
    border-right: 2px solid ${t.borderLightest};
    margin: 0;
    `:`
    width: ${Y(n)};
    border-bottom: 2px solid ${t.borderLightest};
    border-top: 2px solid ${t.borderDark};
    margin: 0;
    `}
`;ar.displayName=`Separator`;var or=G(Hn)`
  padding-left: 8px;
`,sr=G(ar)`
  height: 21px;
  position: relative;
  top: 0;
`,cr=G.input`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  z-index: 1;
  cursor: pointer;
  &:disabled {
    cursor: default;
  }
`,lr=G.div`
  box-sizing: border-box;
  height: 19px;
  display: inline-block;
  width: 35px;
  margin-right: 5px;

  background: ${({color:e})=>e};

  ${({$disabled:e})=>e?W`
          border: 2px solid ${({theme:e})=>e.materialTextDisabled};
          filter: drop-shadow(
            1px 1px 0px ${({theme:e})=>e.materialTextDisabledShadow}
          );
        `:W`
          border: 2px solid ${({theme:e})=>e.materialText};
        `}
  ${cr}:focus:not(:active) + &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    ${En}
    outline-offset: -8px;
  }
`,ur=G.span`
  width: 0px;
  height: 0px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  display: inline-block;
  margin-left: 6px;

  ${({$disabled:e})=>e?W`
          border-top: 6px solid ${({theme:e})=>e.materialTextDisabled};
          filter: drop-shadow(
            1px 1px 0px ${({theme:e})=>e.materialTextDisabledShadow}
          );
        `:W`
          border-top: 6px solid ${({theme:e})=>e.materialText};
        `}
  &:after {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: ${({variant:e})=>e===`flat`?`6px`:`8px`};
    right: 8px;
    width: 16px;
    height: 19px;
  }
`,dr=(0,H.forwardRef)(({value:e,defaultValue:t,onChange:n=Pn,disabled:r=!1,variant:i=`default`,...a},o)=>{let[s,c]=Z({defaultValue:t,onChange:n,readOnly:a.readOnly??r,value:e});return H.createElement(or,{disabled:r,as:`div`,variant:i,size:`md`},H.createElement(cr,{onChange:e=>{let t=e.target.value;c(t),n(e)},readOnly:r,disabled:r,value:s??`#008080`,type:`color`,ref:o,...a}),H.createElement(lr,{$disabled:r,color:s??`#008080`,role:`presentation`}),i==="default"&&H.createElement(sr,{orientation:`vertical`}),H.createElement(ur,{$disabled:r,variant:i}))});dr.displayName=`ColorInput`;var fr=G.div`
  position: relative;
  --react95-digit-primary-color: #ff0102;
  --react95-digit-secondary-color: #740201;
  --react95-digit-bg-color: #000000;

  ${({pixelSize:e})=>W`
    width: ${11*e}px;
    height: ${21*e}px;
    margin: ${e}px;

    span,
    span:before,
    span:after {
      box-sizing: border-box;
      display: inline-block;
      position: absolute;
    }
    span.active,
    span.active:before,
    span.active:after {
      background: var(--react95-digit-primary-color);
    }
    span:not(.active),
    span:not(.active):before,
    span:not(.active):after {
      ${Sn({mainColor:`var(--react95-digit-bg-color)`,secondaryColor:`var(--react95-digit-secondary-color)`,pixelSize:e})}
    }

    span.horizontal,
    span.horizontal:before,
    span.horizontal:after {
      height: ${e}px;
      border-left: ${e}px solid var(--react95-digit-bg-color);
      border-right: ${e}px solid var(--react95-digit-bg-color);
    }
    span.horizontal.active,
    span.horizontal.active:before,
    span.horizontal.active:after {
      height: ${e}px;
      border-left: ${e}px solid var(--react95-digit-primary-color);
      border-right: ${e}px solid var(--react95-digit-primary-color);
    }
    span.horizontal {
      left: ${e}px;
      width: ${9*e}px;
    }
    span.horizontal:before {
      content: '';
      width: 100%;
      top: ${e}px;
      left: ${0}px;
    }
    span.horizontal:after {
      content: '';
      width: calc(100% - ${e*2}px);
      top: ${2*e}px;
      left: ${e}px;
    }
    span.horizontal.top {
      top: 0;
    }
    span.horizontal.bottom {
      bottom: 0;
      transform: rotateX(180deg);
    }

    span.center,
    span.center:before,
    span.center:after {
      height: ${e}px;
      border-left: ${e}px solid var(--react95-digit-bg-color);
      border-right: ${e}px solid var(--react95-digit-bg-color);
    }
    span.center.active,
    span.center.active:before,
    span.center.active:after {
      border-left: ${e}px solid var(--react95-digit-primary-color);
      border-right: ${e}px solid var(--react95-digit-primary-color);
    }
    span.center {
      top: 50%;
      transform: translateY(-50%);
      left: ${e}px;
      width: ${9*e}px;
    }
    span.center:before,
    span.center:after {
      content: '';
      width: 100%;
    }
    span.center:before {
      top: ${e}px;
    }
    span.center:after {
      bottom: ${e}px;
    }

    span.vertical,
    span.vertical:before,
    span.vertical:after {
      width: ${e}px;
      border-top: ${e}px solid var(--react95-digit-bg-color);
      border-bottom: ${e}px solid var(--react95-digit-bg-color);
    }
    span.vertical {
      height: ${11*e}px;
    }
    span.vertical.left {
      left: 0;
    }
    span.vertical.right {
      right: 0;
      transform: rotateY(180deg);
    }
    span.vertical.top {
      top: 0px;
    }
    span.vertical.bottom {
      bottom: 0px;
    }
    span.vertical:before {
      content: '';
      height: 100%;
      top: ${0}px;
      left: ${e}px;
    }
    span.vertical:after {
      content: '';
      height: calc(100% - ${e*2}px);
      top: ${e}px;
      left: ${e*2}px;
    }
  `}
`,pr=[`horizontal top`,`center`,`horizontal bottom`,`vertical top left`,`vertical top right`,`vertical bottom left`,`vertical bottom right`],mr=[[1,0,1,1,1,1,1],[0,0,0,0,1,0,1],[1,1,1,0,1,1,0],[1,1,1,0,1,0,1],[0,1,0,1,1,0,1],[1,1,1,1,0,0,1],[1,1,1,1,0,1,1],[1,0,0,0,1,0,1],[1,1,1,1,1,1,1],[1,1,1,1,1,0,1]];function hr({digit:e=0,pixelSize:t=2,...n}){let r=mr[Number(e)].map((e,t)=>e?`${pr[t]} active`:pr[t]);return H.createElement(fr,{pixelSize:t,...n},r.map((e,t)=>H.createElement(`span`,{className:e,key:t})))}var gr=G.div`
  ${J({style:`status`})}
  display: inline-flex;
  background: #000000;
`,_r={sm:1,md:2,lg:3,xl:4},vr=(0,H.forwardRef)(({value:e=0,minLength:t=3,size:n=`md`,...r},i)=>{let a=(0,H.useMemo)(()=>e.toString().padStart(t,`0`).split(``),[t,e]);return H.createElement(gr,{ref:i,...r},a.map((e,t)=>H.createElement(hr,{digit:e,pixelSize:_r[n],key:t})))});vr.displayName=`Counter`;var yr=W`
  display: flex;
  align-items: center;
  width: ${({fullWidth:e})=>e?`100%`:`auto`};
  min-height: ${X.md};
`,br=G(Q).attrs({"data-testid":`variant-default`})`
  ${yr}
  background: ${({$disabled:e,theme:t})=>e?t.material:t.canvas};
`,xr=G.div.attrs({"data-testid":`variant-flat`})`
  ${Cn()}
  ${yr}
  position: relative;
`,Sr=W`
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background: none;
  font-size: 1rem;
  min-height: 27px;
  font-family: inherit;
  color: ${({theme:e})=>e.canvasText};
  ${({disabled:e,variant:t})=>t!==`flat`&&e&&K()}
`,Cr=G.input`
  ${Sr}
  padding: 0 8px;
`,wr=G.textarea`
  ${Sr}
  padding: 8px;
  resize: none;
  ${({variant:e})=>kn(e)}
`,Tr=(0,H.forwardRef)(({className:e,disabled:t=!1,fullWidth:n,onChange:r=Pn,shadow:i=!0,style:a,variant:o=`default`,...s},c)=>{let l=o===`flat`?xr:br,u=(0,H.useMemo)(()=>s.multiline?H.createElement(wr,{disabled:t,onChange:t?void 0:r,readOnly:t,ref:c,variant:o,...s}):H.createElement(Cr,{disabled:t,onChange:t?void 0:r,readOnly:t,ref:c,type:s.type??`text`,variant:o,...s}),[t,r,s,c,o]);return H.createElement(l,{className:e,fullWidth:n,$disabled:t,shadow:i,style:a},u)});Tr.displayName=`TextInput`;var Er=G.div`
  display: inline-flex;
  align-items: center;
`,Dr=G(Un)`
  width: 30px;
  padding: 0;
  flex-shrink: 0;

  ${({variant:e})=>e===`flat`?W`
          height: calc(50% - 1px);
        `:W`
          height: 50%;
        `}
`,Or=G.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;

  ${({variant:e})=>e===`flat`?W`
          height: calc(${X.md} - 4px);
        `:W`
          height: ${X.md};
          margin-left: 2px;
        `}
`,kr=G.span`
  width: 0px;
  height: 0px;
  display: inline-block;
  ${({invert:e})=>e?W`
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 4px solid ${({theme:e})=>e.materialText};
        `:W`
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid ${({theme:e})=>e.materialText};
        `}
  ${Dr}:disabled & {
    filter: drop-shadow(
      1px 1px 0px ${({theme:e})=>e.materialTextDisabledShadow}
    );
    ${({invert:e})=>e?W`
            border-bottom-color: ${({theme:e})=>e.materialTextDisabled};
          `:W`
            border-top-color: ${({theme:e})=>e.materialTextDisabled};
          `}
  }
`,Ar=(0,H.forwardRef)(({className:e,defaultValue:t,disabled:n=!1,max:r,min:i,onChange:a,readOnly:o,step:s=1,style:c,value:l,variant:u=`default`,width:d,...f},p)=>{let[m,h]=Z({defaultValue:t,onChange:a,readOnly:o,value:l}),g=(0,H.useCallback)(e=>{let t=parseFloat(e.target.value);h(t)},[h]),_=(0,H.useCallback)(e=>{let t=Fn(parseFloat(((m??0)+e).toFixed(2)),i??null,r??null);h(t),a?.(t)},[r,i,a,h,m]),v=(0,H.useCallback)(()=>{m!==void 0&&a?.(m)},[a,m]),y=(0,H.useCallback)(()=>{_(s)},[_,s]),b=(0,H.useCallback)(()=>{_(-s)},[_,s]),x=u===`flat`?`flat`:`raised`;return H.createElement(Er,{className:e,style:{...c,width:d===void 0?`auto`:Y(d)},...f},H.createElement(Tr,{value:m,variant:u,onChange:g,disabled:n,type:`number`,readOnly:o,ref:p,fullWidth:!0,onBlur:v}),H.createElement(Or,{variant:u},H.createElement(Dr,{"data-testid":`increment`,variant:x,disabled:n||o,onClick:y},H.createElement(kr,{invert:!0})),H.createElement(Dr,{"data-testid":`decrement`,variant:x,disabled:n||o,onClick:b},H.createElement(kr,null))))});Ar.displayName=`NumberInput`;function jr(){let e=``;for(let t=0;t<10;t+=1)e+=`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`[Math.floor(Math.random()*62)];return e}var Mr=e=>(0,H.useMemo)(()=>e??jr(),[e]),Nr=W`
  box-sizing: border-box;
  padding-left: 4px;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
  line-height: 100%;
`,Pr=W`
  background: ${({theme:e})=>e.hoverBackground};
  color: ${({theme:e})=>e.canvasTextInvert};
`,Fr=G.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  &:focus {
    outline: none;
  }
`,Ir=G.div`
  ${Nr}
  padding-right: 8px;
  align-items: center;
  display: flex;
  height: calc(100% - 4px);
  width: calc(100% - 4px);
  margin: 0 2px;
  border: 2px solid transparent;
  ${Fr}:focus & {
    ${Pr}
    border: 2px dotted ${({theme:e})=>e.focusSecondary};
  }
`,Lr=W`
  height: ${X.md};
  display: inline-block;
  color: ${({$disabled:e=!1,theme:t})=>e?K():t.canvasText};
  font-size: 1rem;
  cursor: ${({$disabled:e})=>e?`default`:`pointer`};
`,Rr=G(Q)`
  ${Lr}
  background: ${({$disabled:e=!1,theme:t})=>e?t.material:t.canvas};
  &:focus {
    outline: 0;
  }
`,zr=G.div`
  ${Cn()}
  ${Lr}
  background: ${({$disabled:e=!1,theme:t})=>e?t.flatLight:t.canvas};
`,Br=G.select`
  -moz-appearance: none;
  -webkit-appearance: none;
  display: block;
  width: 100%;
  height: 100%;
  color: inherit;
  font-size: 1rem;
  border: 0;
  margin: 0;
  background: none;
  -webkit-tap-highlight-color: transparent;
  border-radius: 0;
  padding-right: 30px;
  ${Nr}
  cursor: pointer;
  &:disabled {
    ${K()};
    background: ${({theme:e})=>e.material};
    cursor: default;
  }
`,Vr=G(Hn).attrs(()=>({"aria-hidden":`true`}))`
  width: 30px;
  padding: 0;
  flex-shrink: 0;
  ${({variant:e=`default`})=>e===`flat`?W`
          height: 100%;
          margin-right: 0;
        `:W`
          height: 100%;
        `}
  ${({native:e=!1,variant:t=`default`})=>e&&(t===`flat`?`
      position: absolute;
      right: 0;
      height: 100%;
      `:`
    position: absolute;
    top: 2px;
    right: 2px;
    height: calc(100% - 4px);
    `)}
    pointer-events: ${({$disabled:e=!1,native:t=!1})=>e||t?`none`:`auto`}
`,Hr=G.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  display: inline-block;
  border-top: 6px solid
    ${({$disabled:e=!1,theme:t})=>e?t.materialTextDisabled:t.materialText};
  ${({$disabled:e=!1,theme:t})=>e&&`
    filter: drop-shadow(1px 1px 0px ${t.materialTextDisabledShadow});
    border-top-color: ${t.materialTextDisabled};
    `}
  ${Vr}:active & {
    margin-top: 2px;
  }
`,Ur=G.ul`
  box-sizing: border-box;

  font-size: 1rem;
  position: absolute;
  transform: translateY(100%);
  left: 0;
  background: ${({theme:e})=>e.canvas};
  padding: 2px;
  border-top: none;
  cursor: default;
  z-index: 1;
  cursor: pointer;
  box-shadow: ${bn};
  ${({variant:e=`default`})=>e===`flat`?W`
          bottom: 2px;
          width: 100%;
          border: 2px solid ${({theme:e})=>e.flatDark};
        `:W`
          bottom: -2px;
          width: calc(100% - 2px);
          border: 2px solid ${({theme:e})=>e.borderDarkest};
        `}
  ${({variant:e=`default`})=>kn(e)}
`,Wr=G.li`
  box-sizing: border-box;

  width: 100%;
  padding-left: 8px;

  height: calc(${X.md} - 4px);
  line-height: calc(${X.md} - 4px);
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({theme:e})=>e.canvasText};
  &:focus {
    outline: 0;
  }
  ${({active:e})=>e?Pr:``}
  user-select: none;
`,Gr=[],Kr=({className:e,defaultValue:t,disabled:n,native:r,onChange:i,options:a=Gr,readOnly:o,style:s,value:c,variant:l,width:u})=>{let d=(0,H.useMemo)(()=>a.filter(Boolean),[a]),[f,p]=Z({defaultValue:t??d?.[0]?.value,onChange:i,readOnly:o,value:c}),m=!(n||o),h=(0,H.useMemo)(()=>({className:e,style:{...s,width:u}}),[e,s,u]),g=(0,H.useMemo)(()=>H.createElement(Vr,{as:`div`,"data-testid":`select-button`,$disabled:n,native:r,tabIndex:-1,variant:l===`flat`?`flat`:`raised`},H.createElement(Hr,{"data-testid":`select-icon`,$disabled:n})),[n,r,l]),_=(0,H.useMemo)(()=>l===`flat`?zr:Rr,[l]);return(0,H.useMemo)(()=>({isEnabled:m,options:d,value:f,setValue:p,wrapperProps:h,DropdownButton:g,Wrapper:_}),[g,_,m,d,p,f,h])},qr={ARROW_DOWN:`ArrowDown`,ARROW_LEFT:`ArrowLeft`,ARROW_RIGHT:`ArrowRight`,ARROW_UP:`ArrowUp`,END:`End`,ENTER:`Enter`,ESC:`Escape`,HOME:`Home`,SPACE:`Space`,TAB:`Tab`},Jr=1e3,Yr=({onBlur:e,onChange:t,onClose:n,onFocus:r,onKeyDown:i,onMouseDown:a,onOpen:o,open:s,options:c,readOnly:l,value:u,selectRef:d,setValue:f,wrapperRef:p})=>{let m=(0,H.useRef)(null),h=(0,H.useRef)([]),g=(0,H.useRef)(0),_=(0,H.useRef)(0),v=(0,H.useRef)(),y=(0,H.useRef)(`search`),b=(0,H.useRef)(``),x=(0,H.useRef)(),[S,C]=Z({defaultValue:!1,onChange:o,onChangePropName:`onOpen`,readOnly:l,value:s,valuePropName:`open`}),w=(0,H.useMemo)(()=>{let e=c.findIndex(e=>e.value===u);return g.current=Fn(e,0,null),c[e]},[c,u]),[T,E]=(0,H.useState)(c[0]),D=(0,H.useCallback)(e=>{let t=m.current,n=h.current[e];if(!n||!t){v.current=e;return}v.current=void 0;let r=t.clientHeight,i=t.scrollTop,a=t.scrollTop+r,o=n.offsetTop,s=n.offsetHeight,c=n.offsetTop+n.offsetHeight;o<i&&t.scrollTo(0,o),c>a&&t.scrollTo(0,o-r+s),n.focus({preventScroll:!0})},[m]),O=(0,H.useCallback)((e,{scroll:t}={})=>{let n=c.length-1,r;switch(e){case`first`:r=0;break;case`last`:r=n;break;case`next`:r=Fn(_.current+1,0,n);break;case`previous`:r=Fn(_.current-1,0,n);break;case`selected`:r=Fn(g.current??0,0,n);break;default:r=e}_.current=r,E(c[r]),t&&D(r)},[_,c,D]),k=(0,H.useCallback)(({fromEvent:e})=>{C(!0),O(`selected`,{scroll:!0}),o?.({fromEvent:e})},[O,o,C]),A=(0,H.useCallback)(()=>{y.current=`search`,b.current=``,clearTimeout(x.current)},[]),j=(0,H.useCallback)(({focusSelect:e,fromEvent:t})=>{var r;n?.({fromEvent:t}),C(!1),E(c[0]),A(),v.current=void 0,e&&((r=d.current)==null||r.focus())},[A,n,c,d,C]),M=(0,H.useCallback)(({fromEvent:e})=>{S?j({focusSelect:!1,fromEvent:e}):k({fromEvent:e})},[j,k,S]),N=(0,H.useCallback)((e,{fromEvent:n})=>{g.current!==e&&(g.current=e,f(c[e].value),t?.(c[e],{fromEvent:n}))},[t,c,f]),P=(0,H.useCallback)(({focusSelect:e,fromEvent:t})=>{N(_.current,{fromEvent:t}),j({focusSelect:e,fromEvent:t})},[j,N]),F=(0,H.useCallback)((e,{fromEvent:t,select:n})=>{switch(y.current===`cycleFirstLetter`&&e!==b.current&&(y.current=`search`),e===b.current?y.current=`cycleFirstLetter`:b.current+=e,y.current){case`search`:{let r=c.findIndex(e=>e.label?.toLocaleUpperCase().indexOf(b.current)===0);r<0&&(r=c.findIndex(t=>t.label?.toLocaleUpperCase().indexOf(e)===0),b.current=e),r>=0&&(n?N(r,{fromEvent:t}):O(r,{scroll:!0}));break}case`cycleFirstLetter`:{let r=n?g.current??-1:_.current,i=c.findIndex((t,n)=>n>r&&t.label?.toLocaleUpperCase().indexOf(e)===0);i<0&&(i=c.findIndex(t=>t.label?.toLocaleUpperCase().indexOf(e)===0)),i>=0&&(n?N(i,{fromEvent:t}):O(i,{scroll:!0}));break}}clearTimeout(x.current),x.current=setTimeout(()=>{y.current===`search`&&(b.current=``)},Jr)},[O,c,N]),I=(0,H.useCallback)(e=>{var t;e.button===0&&(e.preventDefault(),(t=d.current)==null||t.focus(),M({fromEvent:e}),a?.(e))},[a,d,M]),L=(0,H.useCallback)(e=>{P({focusSelect:!0,fromEvent:e})},[P]),R=(0,H.useCallback)(e=>{let{altKey:t,code:n,ctrlKey:r,metaKey:i,shiftKey:a}=e,{ARROW_DOWN:o,ARROW_UP:s,END:c,ENTER:l,ESC:u,HOME:d,SPACE:f,TAB:p}=qr,m=t||r||i||a;if(!(n===p&&(t||r||i)||n!==p&&m))switch(n){case o:if(e.preventDefault(),!S){k({fromEvent:e});return}O(`next`,{scroll:!0});break;case s:if(e.preventDefault(),!S){k({fromEvent:e});return}O(`previous`,{scroll:!0});break;case c:if(e.preventDefault(),!S){k({fromEvent:e});return}O(`last`,{scroll:!0});break;case l:if(!S)return;e.preventDefault(),P({focusSelect:!0,fromEvent:e});break;case u:if(!S)return;e.preventDefault(),j({focusSelect:!0,fromEvent:e});break;case d:if(e.preventDefault(),!S){k({fromEvent:e});return}O(`first`,{scroll:!0});break;case f:e.preventDefault(),S?P({focusSelect:!0,fromEvent:e}):k({fromEvent:e});break;case p:if(!S)return;a||e.preventDefault(),P({focusSelect:!a,fromEvent:e});break;default:!m&&n.match(/^Key/)&&(e.preventDefault(),e.stopPropagation(),F(n.replace(/^Key/,``),{select:!S,fromEvent:e}))}},[O,j,S,k,F,P]),z=(0,H.useCallback)(e=>{R(e),i?.(e)},[R,i]),ee=(0,H.useCallback)(e=>{O(e)},[O]),te=(0,H.useCallback)(t=>{S||(A(),e?.(t))},[A,e,S]),B=(0,H.useCallback)(e=>{A(),r?.(e)},[A,r]),V=(0,H.useCallback)(e=>{m.current=e,v.current!==void 0&&D(v.current)},[D]),ne=(0,H.useCallback)((e,t)=>{h.current[t]=e,v.current===t&&D(v.current)},[D]);return(0,H.useEffect)(()=>{if(!S)return()=>{};let e=e=>{let t=e.target;p.current?.contains(t)||(e.preventDefault(),j({focusSelect:!1,fromEvent:e}))};return document.addEventListener(`mousedown`,e),()=>{document.removeEventListener(`mousedown`,e)}},[j,S,p]),(0,H.useMemo)(()=>({activeOption:T,handleActivateOptionIndex:ee,handleBlur:te,handleButtonKeyDown:z,handleDropdownKeyDown:R,handleFocus:B,handleMouseDown:I,handleOptionClick:L,handleSetDropdownRef:V,handleSetOptionRef:ne,open:S,selectedOption:w}),[T,ee,te,z,B,R,I,L,V,ne,S,w])},Xr=(0,H.forwardRef)(({className:e,defaultValue:t,disabled:n,onChange:r,options:i,readOnly:a,style:o,value:s,variant:c,width:l,...u},d)=>{let{isEnabled:f,options:p,setValue:m,value:h,DropdownButton:g,Wrapper:_}=Kr({defaultValue:t,disabled:n,native:!0,onChange:r,options:i,readOnly:a,value:s,variant:c}),v=(0,H.useCallback)(e=>{let t=p.find(t=>t.value===e.target.value);t&&(m(t.value),r?.(t,{fromEvent:e}))},[r,p,m]);return H.createElement(_,{className:e,style:{...o,width:l}},H.createElement(Fr,null,H.createElement(Br,{...u,disabled:n,onChange:f?v:Pn,ref:d,value:h},p.map((e,t)=>H.createElement(`option`,{key:`${e.value}-${t}`,value:e.value},e.label??e.value))),g))});Xr.displayName=`SelectNative`;function Zr({activateOptionIndex:e,active:t,index:n,onClick:r,option:i,selected:a,setRef:o}){let s=(0,H.useCallback)(()=>{e(n)},[e,n]),c=(0,H.useCallback)(e=>{o(e,n)},[n,o]),l=Mr();return H.createElement(Wr,{active:t,"aria-selected":a?`true`:void 0,"data-value":i.value,id:l,onClick:r,onMouseEnter:s,ref:c,role:`option`,tabIndex:0},i.label)}function Qr({"aria-label":e,"aria-labelledby":t,className:n,defaultValue:r,disabled:i=!1,formatDisplay:a,inputProps:o,labelId:s,menuMaxHeight:c,name:l,onBlur:u,onChange:d,onClose:f,onFocus:p,onKeyDown:m,onMouseDown:h,onOpen:g,open:_,options:v,readOnly:y,shadow:b=!0,style:x,variant:S=`default`,value:C,width:w=`auto`,...T},E){let{isEnabled:D,options:O,setValue:k,value:A,wrapperProps:j,DropdownButton:M,Wrapper:N}=Kr({className:n,defaultValue:r,disabled:i,native:!1,onChange:d,options:v,style:x,readOnly:y,value:C,variant:S,width:w}),P=(0,H.useRef)(null),F=(0,H.useRef)(null),I=(0,H.useRef)(null),{activeOption:L,handleActivateOptionIndex:R,handleBlur:z,handleButtonKeyDown:ee,handleDropdownKeyDown:te,handleFocus:B,handleMouseDown:V,handleOptionClick:ne,handleSetDropdownRef:re,handleSetOptionRef:ie,open:ae,selectedOption:oe}=Yr({onBlur:u,onChange:d,onClose:f,onFocus:p,onKeyDown:m,onMouseDown:h,onOpen:g,open:_,options:O,value:A,selectRef:F,setValue:k,wrapperRef:I});(0,H.useImperativeHandle)(E,()=>({focus:e=>{var t;(t=F.current)==null||t.focus(e)},node:P.current,value:String(A)}),[A]);let se=(0,H.useMemo)(()=>oe?typeof a==`function`?a(oe):oe.label:``,[a,oe]),ce=D?1:void 0,le=(0,H.useMemo)(()=>c?{overflow:`auto`,maxHeight:c}:void 0,[c]),ue=Mr(),de=(0,H.useMemo)(()=>O.map((e,t)=>{let n=`${A}-${t}`,r=e===L,i=e===oe;return H.createElement(Zr,{activateOptionIndex:R,active:r,index:t,key:n,onClick:ne,option:e,selected:i,setRef:ie})}),[L,R,ne,ie,O,oe,A]);return H.createElement(N,{...j,$disabled:i,ref:I,shadow:b,style:{...x,width:w}},H.createElement(`input`,{name:l,ref:P,type:`hidden`,value:String(A),...o}),H.createElement(Fr,{"aria-disabled":i,"aria-expanded":ae,"aria-haspopup":`listbox`,"aria-label":e,"aria-labelledby":t??s,"aria-owns":D&&ae?ue:void 0,onBlur:z,onFocus:B,onKeyDown:ee,onMouseDown:D?V:h,ref:F,role:`button`,tabIndex:ce,...T},H.createElement(Ir,null,se),M),D&&ae&&H.createElement(Ur,{id:ue,onKeyDown:te,ref:re,role:`listbox`,style:le,tabIndex:0,variant:S},de))}var $r=(0,H.forwardRef)(Qr);$r.displayName=`Select`;var ei=G.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${e=>e.noPadding?`0`:`4px`};
`,ti=(0,H.forwardRef)(function({children:e,noPadding:t=!1,...n},r){return H.createElement(ei,{noPadding:t,ref:r,...n},e)});ti.displayName=`Toolbar`;var ni=G.div`
  padding: 16px;
`,ri=(0,H.forwardRef)(function({children:e,...t},n){return H.createElement(ni,{ref:n,...t},e)});ri.displayName=`WindowContent`;var ii=G.div`
  height: 33px;
  line-height: 33px;
  padding-left: 0.25rem;
  padding-right: 3px;
  font-weight: bold;
  border: 2px solid ${({theme:e})=>e.material};
  ${({active:e})=>e===!1?W`
          background: ${({theme:e})=>e.headerNotActiveBackground};
          color: ${({theme:e})=>e.headerNotActiveText};
        `:W`
          background: ${({theme:e})=>e.headerBackground};
          color: ${({theme:e})=>e.headerText};
        `}

  ${Hn} {
    padding-left: 0;
    padding-right: 0;
    height: 27px;
    width: 31px;
  }
`,ai=(0,H.forwardRef)(function({active:e=!0,children:t,...n},r){return H.createElement(ii,{active:e,ref:r,...n},t)});ai.displayName=`WindowHeader`;var oi=G.div`
  position: relative;
  padding: 4px;
  font-size: 1rem;
  ${J({style:`window`})}
  ${q()}
`,si=G.span`
  ${({theme:e})=>W`
    display: inline-block;
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 25px;
    height: 25px;
    background-image: linear-gradient(
      135deg,
      ${e.borderLightest} 16.67%,
      ${e.material} 16.67%,
      ${e.material} 33.33%,
      ${e.borderDark} 33.33%,
      ${e.borderDark} 50%,
      ${e.borderLightest} 50%,
      ${e.borderLightest} 66.67%,
      ${e.material} 66.67%,
      ${e.material} 83.33%,
      ${e.borderDark} 83.33%,
      ${e.borderDark} 100%
    );
    background-size: 8.49px 8.49px;
    clip-path: polygon(100% 0px, 0px 100%, 100% 100%);
    cursor: nwse-resize;
  `}
`,ci=(0,H.forwardRef)(({children:e,resizable:t=!1,resizeRef:n,shadow:r=!0,...i},a)=>H.createElement(oi,{ref:a,shadow:r,...i},e,t&&H.createElement(si,{"data-testid":`resizeHandle`,ref:n})));ci.displayName=`Window`;var li=G(Zn)`
  width: 234px;
  margin: 1rem 0;
  background: ${({theme:e})=>e.canvas};
`,ui=G.div`
  display: flex;
  background: ${({theme:e})=>e.materialDark};
  color: #dfe0e3;
`,di=G.div`
  display: flex;
  flex-wrap: wrap;
`,$=G.div`
  text-align: center;
  height: 1.5em;
  line-height: 1.5em;
  width: 14.28%;
`,fi=G.span`
  cursor: pointer;

  background: ${({active:e,theme:t})=>e?t.hoverBackground:`transparent`};
  color: ${({active:e,theme:t})=>e?t.canvasTextInvert:t.canvasText};

  &:hover {
    border: 2px dashed
      ${({theme:e,active:t})=>t?`none`:e.materialDark};
  }
`,pi=[{value:0,label:`January`},{value:1,label:`February`},{value:2,label:`March`},{value:3,label:`April`},{value:4,label:`May`},{value:5,label:`June`},{value:6,label:`July`},{value:7,label:`August`},{value:8,label:`September`},{value:9,label:`October`},{value:10,label:`November`},{value:11,label:`December`}];function mi(e,t){return new Date(e,t+1,0).getDate()}function hi(e,t,n){return new Date(e,t,n).getDay()}function gi(e){let t=new Date(Date.parse(e));return{day:t.getUTCDate(),month:t.getUTCMonth(),year:t.getUTCFullYear()}}var _i=(0,H.forwardRef)(({className:e,date:t=new Date().toISOString(),onAccept:n,onCancel:r,shadow:i=!0},a)=>{let[o,s]=(0,H.useState)(()=>gi(t)),{year:c,month:l,day:u}=o,d=(0,H.useCallback)(({value:e})=>{s(t=>({...t,month:e}))},[]),f=(0,H.useCallback)(e=>{s(t=>({...t,year:e}))},[]),p=(0,H.useCallback)(e=>{s(t=>({...t,day:e}))},[]),m=(0,H.useCallback)(()=>{let e=[o.year,o.month+1,o.day].map(e=>String(e).padStart(2,`0`)).join(`-`);n?.(e)},[o.day,o.month,o.year,n]),h=(0,H.useMemo)(()=>{let e=Array.from({length:42}),t=hi(c,l,1),n=u,r=mi(c,l);return n=n<r?n:r,e.forEach((i,a)=>{if(a>=t&&a<r+t){let r=a-t+1;e[a]=H.createElement($,{key:a,onClick:()=>{p(r)}},H.createElement(fi,{active:r===n},r))}else e[a]=H.createElement($,{key:a})}),e},[u,p,l,c]);return H.createElement(ci,{className:e,ref:a,shadow:i,style:{margin:20}},H.createElement(ai,null,H.createElement(`span`,{role:`img`,"aria-label":`📆`},`📆`),`Date`),H.createElement(ri,null,H.createElement(ti,{noPadding:!0,style:{justifyContent:`space-between`}},H.createElement($r,{options:pi,value:l,onChange:d,width:128,menuMaxHeight:200}),H.createElement(Ar,{value:c,onChange:f,width:100})),H.createElement(li,null,H.createElement(ui,null,H.createElement($,null,`S`),H.createElement($,null,`M`),H.createElement($,null,`T`),H.createElement($,null,`W`),H.createElement($,null,`T`),H.createElement($,null,`F`),H.createElement($,null,`S`)),H.createElement(di,null,h)),H.createElement(ti,{noPadding:!0,style:{justifyContent:`space-between`}},H.createElement(Un,{fullWidth:!0,onClick:r,disabled:!r},`Cancel`),H.createElement(Un,{fullWidth:!0,onClick:n?m:void 0,disabled:!n},`OK`))))});_i.displayName=`DatePicker`;var vi=e=>{switch(e){case`status`:case`well`:return W`
        ${J({style:`status`})}
      `;case`window`:case`outside`:return W`
        ${J({style:`window`})}
      `;case`field`:return W`
        ${J({style:`field`})}
      `;default:return W`
        ${J()}
      `}},yi=G.div`
  position: relative;
  font-size: 1rem;
  ${({variant:e})=>vi(e)}
  ${({variant:e})=>q(e===`field`?{background:`canvas`,color:`canvasText`}:void 0)}
`,bi=(0,H.forwardRef)(({children:e,shadow:t=!1,variant:n=`window`,...r},i)=>H.createElement(yi,{ref:i,shadow:t,variant:n,...r},e));bi.displayName=`Frame`;var xi=G.fieldset`
  position: relative;
  border: 2px solid
    ${({theme:e,variant:t})=>t===`flat`?e.flatDark:e.borderLightest};
  padding: 16px;
  margin-top: 8px;
  font-size: 1rem;
  color: ${({theme:e})=>e.materialText};
  ${({variant:e})=>e!==`flat`&&W`
      box-shadow: -1px -1px 0 1px ${({theme:e})=>e.borderDark},
        inset -1px -1px 0 1px ${({theme:e})=>e.borderDark};
    `}
  ${e=>e.$disabled&&K()}
`,Si=G.legend`
  display: flex;
  position: absolute;
  top: 0;
  left: 8px;
  transform: translateY(calc(-50% - 2px));
  padding: 0 8px;

  font-size: 1rem;
  background: ${({theme:e,variant:t})=>t===`flat`?e.canvas:e.material};
`,Ci=(0,H.forwardRef)(({label:e,disabled:t=!1,variant:n=`default`,children:r,...i},a)=>H.createElement(xi,{"aria-disabled":t,$disabled:t,variant:n,ref:a,...i},e&&H.createElement(Si,{variant:n},e),r));Ci.displayName=`GroupBox`;var wi=G.div`
  ${({theme:e,size:t=`100%`})=>`
  display: inline-block;
  box-sizing: border-box;
  height: ${Y(t)};
  width: 5px;
  border-top: 2px solid ${e.borderLightest};
  border-left: 2px solid ${e.borderLightest};
  border-bottom: 2px solid ${e.borderDark};
  border-right: 2px solid ${e.borderDark};
  background: ${e.material};
`}
`;wi.displayName=`Handle`;var Ti=`url('data:image/gif;base64,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')`,Ei=G.div`
  display: inline-block;
  height: ${({size:e})=>Y(e)};
  width: ${({size:e})=>Y(e)};
`,Di=G.span`
  display: block;
  background: ${Ti};
  background-size: cover;
  width: 100%;
  height: 100%;
`,Oi=(0,H.forwardRef)(({size:e=30,...t},n)=>H.createElement(Ei,{size:e,ref:n,...t},H.createElement(Di,null)));Oi.displayName=`Hourglass`;var ki=G.div`
  position: relative;
  display: inline-block;
  padding-bottom: 26px;
`,Ai=G.div`
  position: relative;
`,ji=G.div`
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 195px;
  height: 155px;
  padding: 12px;
  background: ${({theme:e})=>e.material};
  border-top: 4px solid ${({theme:e})=>e.borderLightest};
  border-left: 4px solid ${({theme:e})=>e.borderLightest};
  border-bottom: 4px solid ${({theme:e})=>e.borderDark};
  border-right: 4px solid ${({theme:e})=>e.borderDark};

  outline: 1px dotted ${({theme:e})=>e.material};
  outline-offset: -3px;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    outline: 1px dotted ${({theme:e})=>e.material};
  }
  box-shadow: 1px 1px 0 1px ${({theme:e})=>e.borderDarkest};

  &:after {
    content: '';
    display: inline-block;
    position: absolute;
    bottom: 4px;
    right: 12px;
    width: 10px;
    border-top: 2px solid #4d9046;
    border-bottom: 2px solid #07ff00;
  }
`,Mi=G(Q).attrs(()=>({"data-testid":`background`}))`
  width: 100%;
  height: 100%;
`,Ni=G.div`
  box-sizing: border-box;
  position: absolute;
  top: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);
  height: 10px;
  width: 50%;
  background: ${({theme:e})=>e.material};
  border-left: 2px solid ${({theme:e})=>e.borderLightest};
  border-bottom: 2px solid ${({theme:e})=>e.borderDarkest};
  border-right: 2px solid ${({theme:e})=>e.borderDarkest};
  box-shadow: inset 0px 0px 0px 2px ${({theme:e})=>e.borderDark};

  &:before {
    content: '';
    position: absolute;
    top: calc(100% + 2px);
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 8px;
    background: ${({theme:e})=>e.material};
    border-left: 2px solid ${({theme:e})=>e.borderLightest};
    border-right: 2px solid ${({theme:e})=>e.borderDarkest};
    box-shadow: inset 0px 0px 0px 2px ${({theme:e})=>e.borderDark};
  }
  &:after {
    content: '';
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    width: 150%;
    height: 4px;
    background: ${({theme:e})=>e.material};
    border: 2px solid ${({theme:e})=>e.borderDark};
    border-bottom: none;
    box-shadow: inset 1px 1px 0px 1px ${({theme:e})=>e.borderLightest},
      1px 1px 0 1px ${({theme:e})=>e.borderDarkest};
  }
`,Pi=(0,H.forwardRef)(({backgroundStyles:e,children:t,...n},r)=>H.createElement(ki,{ref:r,...n},H.createElement(Ai,null,H.createElement(ji,null,H.createElement(Mi,{style:e},t)),H.createElement(Ni,null))));Pi.displayName=`Monitor`;var Fi=G.div`
  display: inline-block;
  height: ${X.md};
  width: 100%;
`,Ii=G(Q)`
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
  padding: 0;
  overflow: hidden;
  &:before {
    z-index: 1;
  }
`,Li=W`
  width: calc(100% - 4px);
  height: calc(100% - 4px);

  display: flex;
  align-items: center;
  justify-content: space-around;
`,Ri=G.div`
  position: relative;
  top: 4px;
  ${Li}
  background: ${({theme:e})=>e.canvas};
  color: #000;
  margin-left: 2px;
  margin-top: -2px;
  color: ${({theme:e})=>e.materialText};
`,zi=G.div`
  position: absolute;
  top: 2px;
  left: 2px;
  ${Li}
  color: ${({theme:e})=>e.materialTextInvert};
  background: ${({theme:e})=>e.progress};
  clip-path: polygon(
    0 0,
    ${({value:e=0})=>e}% 0,
    ${({value:e=0})=>e}% 100%,
    0 100%
  );
  transition: 0.4s linear clip-path;
`,Bi=G.div`
  width: calc(100% - 6px);
  height: calc(100% - 8px);
  position: absolute;
  left: 3px;
  top: 4px;
  box-sizing: border-box;
  display: inline-flex;
`,Vi=17,Hi=G.span`
  display: inline-block;
  width: ${Vi}px;
  box-sizing: border-box;
  height: 100%;
  background: ${({theme:e})=>e.progress};
  border-color: ${({theme:e})=>e.material};
  border-width: 0px 1px;
  border-style: solid;
`,Ui=(0,H.forwardRef)(({hideValue:e=!1,shadow:t=!0,value:n,variant:r=`default`,...i},a)=>{let o=e?null:`${n}%`,s=(0,H.useRef)(null),[c,l]=(0,H.useState)([]),u=(0,H.useCallback)(()=>{if(!s.current||n===void 0)return;let e=s.current.getBoundingClientRect().width,t=Math.round(n/100*e/Vi);l(Array.from({length:t}))},[n]);return(0,H.useEffect)(()=>(u(),window.addEventListener(`resize`,u),()=>window.removeEventListener(`resize`,u)),[u]),H.createElement(Fi,{"aria-valuenow":n===void 0?void 0:Math.round(n),ref:a,role:`progressbar`,variant:r,...i},H.createElement(Ii,{variant:r,shadow:t},r==="default"?H.createElement(H.Fragment,null,H.createElement(Ri,{"data-testid":`defaultProgress1`},o),H.createElement(zi,{"data-testid":`defaultProgress2`,value:n},o)):H.createElement(Bi,{ref:s,"data-testid":`tileProgress`},c.map((e,t)=>H.createElement(Hi,{key:t})))))});Ui.displayName=`ProgressBar`;var Wi=W`
  width: ${20}px;
  height: ${20}px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-right: 0.5rem;
`,Gi=G(Q)`
  ${Wi}
  background: ${({$disabled:e,theme:t})=>e?t.material:t.canvas};

  &:before {
    content: '';
    position: absolute;
    left: 0px;
    top: 0px;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    border-radius: 50%;
    box-shadow: none;
  }
`,Ki=G.div`
  ${Cn()}
  ${Wi}
  outline: none;
  background: ${({$disabled:e,theme:t})=>e?t.flatLight:t.canvas};
  &:before {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    border: 2px solid ${({theme:e})=>e.flatDark};
    border-radius: 50%;
  }
`,qi=G.span.attrs(()=>({"data-testid":`checkmarkIcon`}))`
  position: absolute;
  content: '';
  display: inline-block;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: ${e=>e.$disabled?e.theme.checkmarkDisabled:e.theme.checkmark};
`,Ji={flat:Ki,default:Gi},Yi=(0,H.forwardRef)(({checked:e,className:t=``,disabled:n=!1,label:r=``,onChange:i,style:a={},variant:o=`default`,...s},c)=>{let l=Ji[o];return H.createElement(Jn,{$disabled:n,className:t,style:a},H.createElement(l,{$disabled:n,role:`presentation`},e&&H.createElement(qi,{$disabled:n,variant:o})),H.createElement(qn,{disabled:n,onChange:n?void 0:i,readOnly:n,type:`radio`,checked:e,ref:c,...s}),r&&H.createElement(Yn,null,r))});Yi.displayName=`Radio`;var Xi=typeof window<`u`?H.useLayoutEffect:H.useEffect;function Zi(e){let t=H.useRef(e);return Xi(()=>{t.current=e}),H.useCallback((...e)=>(0,t.current)(...e),[])}function Qi(e,t){typeof e==`function`?e(t):e&&(e.current=t)}function $i(e,t){return(0,H.useMemo)(()=>e==null&&t==null?null:n=>{Qi(e,n),Qi(t,n)},[e,t])}var ea=n(i(),1),ta=!0,na=!1,ra,ia={text:!0,search:!0,url:!0,tel:!0,email:!0,password:!0,number:!0,date:!0,month:!0,week:!0,time:!0,datetime:!0,"datetime-local":!0};function aa(e){if(`type`in e){let{type:t,tagName:n}=e;if(n===`INPUT`&&ia[t]&&!e.readOnly||n===`TEXTAREA`&&!e.readOnly)return!0}return!!(`isContentEditable`in e&&e.isContentEditable)}function oa(e){e.metaKey||e.altKey||e.ctrlKey||(ta=!0)}function sa(){ta=!1}function ca(){this.visibilityState===`hidden`&&na&&(ta=!0)}function la(e){e.addEventListener(`keydown`,oa,!0),e.addEventListener(`mousedown`,sa,!0),e.addEventListener(`pointerdown`,sa,!0),e.addEventListener(`touchstart`,sa,!0),e.addEventListener(`visibilitychange`,ca,!0)}function ua(e){let{target:t}=e;try{return t.matches(`:focus-visible`)}catch{}return ta||aa(t)}function da(){na=!0,window.clearTimeout(ra),ra=window.setTimeout(()=>{na=!1},100)}function fa(){return{isFocusVisible:ua,onBlurVisible:da,ref:(0,H.useCallback)(e=>{let t=(0,ea.findDOMNode)(e);t!=null&&la(t.ownerDocument)},[])}}function pa(e,t,n){return(n-t)*e+t}function ma(e,t){if(t!==void 0&&`changedTouches`in e){for(let n=0;n<e.changedTouches.length;n+=1){let r=e.changedTouches[n];if(r.identifier===t)return{x:r.clientX,y:r.clientY}}return!1}return`clientX`in e&&{x:e.clientX,y:e.clientY}}function ha(e){return e&&e.ownerDocument||document}function ga(e,t){let{index:n}=e.reduce((e,n,r)=>{let i=Math.abs(t-n);return e===null||i<e.distance||i===e.distance?{distance:i,index:r}:e},null)??{};return n??-1}var _a=G.div`
  display: inline-block;
  position: relative;
  touch-action: none;
  &:before {
    content: '';
    display: inline-block;
    position: absolute;
    top: -2px;
    left: -15px;
    width: calc(100% + 30px);
    height: ${({hasMarks:e})=>e?`41px`:`39px`};
    ${({isFocused:e,theme:t})=>e&&`
        outline: 2px dotted ${t.materialText};
        `}
  }

  ${({orientation:e,size:t})=>e===`vertical`?W`
          height: ${t};
          margin-right: 1.5rem;
          &:before {
            left: -6px;
            top: -15px;
            height: calc(100% + 30px);
            width: ${({hasMarks:e})=>e?`41px`:`39px`};
          }
        `:W`
          width: ${t};
          margin-bottom: 1.5rem;
          &:before {
            top: -2px;
            left: -15px;
            width: calc(100% + 30px);
            height: ${({hasMarks:e})=>e?`41px`:`39px`};
          }
        `}

  pointer-events: ${({$disabled:e})=>e?`none`:`auto`};
`,va=()=>W`
  position: absolute;
  ${({orientation:e})=>e===`vertical`?W`
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          height: 100%;
          width: 8px;
        `:W`
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 8px;
          width: 100%;
        `}
`,ya=G(Q)`
  ${va()}
`,ba=G(Q)`
  ${va()}

  border-left-color: ${({theme:e})=>e.flatLight};
  border-top-color: ${({theme:e})=>e.flatLight};
  border-right-color: ${({theme:e})=>e.canvas};
  border-bottom-color: ${({theme:e})=>e.canvas};
  &:before {
    border-left-color: ${({theme:e})=>e.flatDark};
    border-top-color: ${({theme:e})=>e.flatDark};
    border-right-color: ${({theme:e})=>e.flatLight};
    border-bottom-color: ${({theme:e})=>e.flatLight};
  }
`,xa=G.span`
  position: relative;
  ${({orientation:e})=>e===`vertical`?W`
          width: 32px;
          height: 18px;
          right: 2px;
          transform: translateY(-50%);
        `:W`
          height: 32px;
          width: 18px;
          top: 2px;
          transform: translateX(-50%);
        `}
  ${({variant:e})=>e===`flat`?W`
          ${Cn()}
          outline: 2px solid ${({theme:e})=>e.flatDark};
          background: ${({theme:e})=>e.flatLight};
        `:W`
          ${q()}
          ${J()}
          &:focus {
            outline: none;
          }
        `}
    ${({$disabled:e,theme:t})=>e&&Sn({mainColor:t.material,secondaryColor:t.borderLightest})}
`,Sa=6,Ca=G.span`
  display: inline-block;
  position: absolute;

  ${({orientation:e})=>e===`vertical`?W`
          right: ${-8}px;
          bottom: 0px;
          transform: translateY(1px);
          width: ${Sa}px;
          border-bottom: 2px solid ${({theme:e})=>e.materialText};
        `:W`
          bottom: ${-6}px;
          height: ${Sa}px;
          transform: translateX(-1px);
          border-left: 1px solid ${({theme:e})=>e.materialText};
          border-right: 1px solid ${({theme:e})=>e.materialText};
        `}

  color:  ${({theme:e})=>e.materialText};
  ${({$disabled:e,theme:t})=>e&&W`
      ${K()}
      box-shadow: 1px 1px 0px ${t.materialTextDisabledShadow};
      border-color: ${t.materialTextDisabled};
    `}
`,wa=G.div`
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: 1;
  font-size: 0.875rem;

  ${({orientation:e})=>e===`vertical`?W`
          transform: translate(${8}px, ${7}px);
        `:W`
          transform: translate(-0.5ch, calc(100% + 2px));
        `}
`,Ta=(0,H.forwardRef)(({defaultValue:e,disabled:t=!1,marks:n=!1,max:r=100,min:i=0,name:a,onChange:o,onChangeCommitted:s,onMouseDown:c,orientation:l=`horizontal`,size:u=`100%`,step:d=1,value:f,variant:p=`default`,...m},h)=>{let g=p===`flat`?ba:ya,_=l===`vertical`,[v=i,y]=Z({defaultValue:e,onChange:o??s,value:f}),{isFocusVisible:b,onBlurVisible:x,ref:S}=fa(),[C,w]=(0,H.useState)(!1),T=(0,H.useRef)(),E=(0,H.useRef)(null),D=$i(h,$i(S,T)),O=Zi(e=>{b(e)&&w(!0)}),k=Zi(()=>{C!==!1&&(w(!1),x())}),A=(0,H.useRef)(),j=(0,H.useMemo)(()=>n===!0&&Number.isFinite(d)?[...Array(Math.round((r-i)/d)+1)].map((e,t)=>({label:void 0,value:i+d*t})):Array.isArray(n)?n:[],[n,r,i,d]),M=Zi(e=>{let t=(r-i)/10,n=j.map(e=>e.value),a=n.indexOf(v),c=0;switch(e.key){case`Home`:c=i;break;case`End`:c=r;break;case`PageUp`:d&&(c=v+t);break;case`PageDown`:d&&(c=v-t);break;case`ArrowRight`:case`ArrowUp`:c=d?v+d:n[a+1]||n[n.length-1];break;case`ArrowLeft`:case`ArrowDown`:c=d?v-d:n[a-1]||n[0];break;default:return}e.preventDefault(),d&&(c=Ln(c,d,i)),c=Fn(c,i,r),y(c),w(!0),o?.(c),s?.(c)}),N=(0,H.useCallback)(e=>{if(!T.current)return 0;let t=T.current.getBoundingClientRect(),n;n=_?(t.bottom-e.y)/t.height:(e.x-t.left)/t.width;let a;if(a=pa(n,i,r),d)a=Ln(a,d,i);else{let e=j.map(e=>e.value);a=e[ga(e,a)]}return a=Fn(a,i,r),a},[j,r,i,d,_]),P=Zi(e=>{var t;let n=ma(e,A.current);if(!n)return;let r=N(n);(t=E.current)==null||t.focus(),y(r),w(!0),o?.(r)}),F=Zi(e=>{let t=ma(e,A.current);if(!t)return;let n=N(t);s?.(n),A.current=void 0;let r=ha(T.current);r.removeEventListener(`mousemove`,P),r.removeEventListener(`mouseup`,F),r.removeEventListener(`touchmove`,P),r.removeEventListener(`touchend`,F)}),I=Zi(e=>{var t;c?.(e),e.preventDefault(),(t=E.current)==null||t.focus(),w(!0);let n=ma(e,A.current);if(n){let e=N(n);y(e),o?.(e)}let r=ha(T.current);r.addEventListener(`mousemove`,P),r.addEventListener(`mouseup`,F)}),L=Zi(e=>{var t;e.preventDefault();let n=e.changedTouches[0];n!=null&&(A.current=n.identifier),(t=E.current)==null||t.focus(),w(!0);let r=ma(e,A.current);if(r){let e=N(r);y(e),o?.(e)}let i=ha(T.current);i.addEventListener(`touchmove`,P),i.addEventListener(`touchend`,F)});return(0,H.useEffect)(()=>{let{current:e}=T;e?.addEventListener(`touchstart`,L);let t=ha(e);return()=>{e?.removeEventListener(`touchstart`,L),t.removeEventListener(`mousemove`,P),t.removeEventListener(`mouseup`,F),t.removeEventListener(`touchmove`,P),t.removeEventListener(`touchend`,F)}},[F,P,L]),H.createElement(_a,{$disabled:t,hasMarks:!!j.length,isFocused:C,onMouseDown:I,orientation:l,ref:D,size:Y(u),...m},H.createElement(`input`,{disabled:t,name:a,type:`hidden`,value:v??0}),j&&j.map(e=>H.createElement(Ca,{$disabled:t,"data-testid":`tick`,key:e.value/(r-i)*100,orientation:l,style:{[_?`bottom`:`left`]:`${(e.value-i)/(r-i)*100}%`}},e.label&&H.createElement(wa,{"aria-hidden":!0,"data-testid":`mark`,orientation:l},e.label))),H.createElement(g,{orientation:l,variant:p}),H.createElement(xa,{$disabled:t,"aria-disabled":t?!0:void 0,"aria-orientation":l,"aria-valuemax":r,"aria-valuemin":i,"aria-valuenow":v,onBlur:k,onFocus:O,onKeyDown:M,orientation:l,ref:E,role:`slider`,style:{[_?`bottom`:`left`]:`${(_?-100:0)+100*(v-i)/(r-i)}%`},tabIndex:t?void 0:0,variant:p}))});Ta.displayName=`Slider`;var Ea=G.tbody`
  background: ${({theme:e})=>e.canvas};
  display: table-row-group;
  box-shadow: ${xn};
  overflow-y: auto;
`,Da=(0,H.forwardRef)(function({children:e,...t},n){return H.createElement(Ea,{ref:n,...t},e)});Da.displayName=`TableBody`;var Oa=G.td`
  padding: 0 8px;
`,ka=(0,H.forwardRef)(function({children:e,...t},n){return H.createElement(Oa,{ref:n,...t},e)});ka.displayName=`TableDataCell`;var Aa=G.thead`
  display: table-header-group;
`,ja=(0,H.forwardRef)(function({children:e,...t},n){return H.createElement(Aa,{ref:n,...t},e)});ja.displayName=`TableHead`;var Ma=G.th`
  position: relative;
  padding: 0 8px;
  display: table-cell;
  vertical-align: inherit;
  background: ${({theme:e})=>e.material};
  cursor: default;
  user-select: none;
  &:before {
    box-sizing: border-box;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    ${J()}

    border-left: none;
    border-top: none;
  }
  ${({$disabled:e})=>!e&&W`
      &:active {
        &:before {
          ${J({invert:!0,style:`window`})}
          border-left: none;
          border-top: none;
          padding-top: 2px;
        }

        & > div {
          position: relative;
          top: 2px;
        }
      }
    `}

  color: ${({theme:e})=>e.materialText};
  ${({$disabled:e})=>e&&K()}
  &:hover {
    color: ${({theme:e})=>e.materialText};
    ${({$disabled:e})=>e&&K()}
  }
`,Na=(0,H.forwardRef)(function({disabled:e=!1,children:t,onClick:n,onTouchStart:r=Pn,sort:i,...a},o){let s=i===`asc`?`ascending`:i===`desc`?`descending`:void 0;return H.createElement(Ma,{$disabled:e,"aria-disabled":e,"aria-sort":s,onClick:e?void 0:n,onTouchStart:e?void 0:r,ref:o,...a},H.createElement(`div`,null,t))});Na.displayName=`TableHeadCell`;var Pa=G.tr`
  color: inherit;
  display: table-row;
  height: calc(${X.md} - 2px);
  line-height: calc(${X.md} - 2px);
  vertical-align: middle;
  outline: none;

  color: ${({theme:e})=>e.canvasText};
  &:hover {
    background: ${({theme:e})=>e.hoverBackground};
    color: ${({theme:e})=>e.canvasTextInvert};
  }
`,Fa=(0,H.forwardRef)(function({children:e,...t},n){return H.createElement(Pa,{ref:n,...t},e)});Fa.displayName=`TableRow`;var Ia=G.table`
  display: table;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 1rem;
`,La=G(Q)`
  &:before {
    box-shadow: none;
  }
`,Ra=(0,H.forwardRef)(({children:e,...t},n)=>H.createElement(La,null,H.createElement(Ia,{ref:n,...t},e)));Ra.displayName=`Table`;var za=G.button`
  ${q()}
  ${J()}
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  height: ${X.md};
  line-height: ${X.md};
  padding: 0 8px;
  border-bottom: none;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  margin: 0 0 -2px 0;
  cursor: default;
  color: ${({theme:e})=>e.materialText};
  user-select: none;
  font-family: inherit;
  &:focus:after,
  &:active:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    ${En}
    outline-offset: -6px;
  }
  ${e=>e.selected&&`
    z-index: 1;
    height: calc(${X.md} + 4px);
    top: -4px;
    margin-bottom: -6px;
    padding: 0 16px;
    margin-left: -8px;
    &:not(:last-child) {
      margin-right: -8px;
    }
  `}
  &:before {
    content: '';
    position: absolute;
    width: calc(100% - 4px);
    height: 6px;
    background: ${({theme:e})=>e.material};
    bottom: -4px;
    left: 2px;
  }
`,Ba=(0,H.forwardRef)(({value:e,onClick:t,selected:n=!1,children:r,...i},a)=>H.createElement(za,{"aria-selected":n,selected:n,onClick:n=>t?.(e,n),ref:a,role:`tab`,...i},r));Ba.displayName=`Tab`;var Va=G.div`
  ${q()}
  ${J()}
  position: relative;
  display: block;
  height: 100%;
  padding: 16px;
  font-size: 1rem;
`,Ha=(0,H.forwardRef)(({children:e,...t},n)=>H.createElement(Va,{ref:n,...t},e));Ha.displayName=`TabBody`;var Ua=G.div`
  position: relative;
  ${({isMultiRow:e,theme:t})=>e&&`
  button {
    flex-grow: 1;
  }
  button:last-child:before {
    border-right: 2px solid ${t.borderDark};
  }
  `}
`,Wa=G.div.attrs(()=>({"data-testid":`tab-row`}))`
  position: relative;
  display: flex;
  flex-wrap: no-wrap;
  text-align: left;
  left: 8px;
  width: calc(100% - 8px);

  &:not(:first-child):before {
    content: '';
    position: absolute;
    right: 0;
    left: 0;
    height: 100%;
    border-right: 2px solid ${({theme:e})=>e.borderDarkest};
    border-left: 2px solid ${({theme:e})=>e.borderLightest};
  }
`;function Ga(e,t){let n=[];for(let r=t;r>0;--r)n.push(e.splice(0,Math.ceil(e.length/r)));return n}var Ka=(0,H.forwardRef)(({value:e,onChange:t=Pn,children:n,rows:r=1,...i},a)=>{let o=(0,H.useMemo)(()=>{let i=Ga(H.Children.map(n,n=>{if(!H.isValidElement(n))return null;let r={selected:n.props.value===e,onClick:t};return H.cloneElement(n,r)})??[],r).map((e,t)=>({key:t,tabs:e})),a=i.findIndex(e=>e.tabs.some(e=>e.props.selected));return i.push(i.splice(a,1)[0]),i},[n,t,r,e]);return H.createElement(Ua,{...i,isMultiRow:r>1,role:`tablist`,ref:a},o.map(e=>H.createElement(Wa,{key:e.key},e.tabs)))});Ka.displayName=`Tabs`;var qa=[`blur`,`focus`],Ja=[`click`,`contextmenu`,`doubleclick`,`drag`,`dragend`,`dragenter`,`dragexit`,`dragleave`,`dragover`,`dragstart`,`drop`,`mousedown`,`mouseenter`,`mouseleave`,`mousemove`,`mouseout`,`mouseover`,`mouseup`];function Ya(e){return`nativeEvent`in e&&qa.includes(e.type)}function Xa(e){return`nativeEvent`in e&&Ja.includes(e.type)}var Za={top:`top: -4px;
        left: 50%;
        transform: translate(-50%, -100%);`,bottom:`bottom: -4px;
           left: 50%;
           transform: translate(-50%, 100%);`,left:`left: -4px;
         top: 50%;
         transform: translate(-100%, -50%);`,right:`right: -4px;
          top: 50%;
          transform: translate(100%, -50%);`},Qa=G.span`
  position: absolute;

  z-index: 1;
  display: ${e=>e.show?`block`:`none`};
  padding: 4px;
  border: 2px solid ${({theme:e})=>e.borderDarkest};
  background: ${({theme:e})=>e.tooltip};
  box-shadow: ${bn};
  text-align: center;
  font-size: 1rem;
  ${e=>Za[e.position]}
`,$a=G.div`
  position: relative;
  display: inline-block;
  white-space: nowrap;
`,eo=(0,H.forwardRef)(({className:e,children:t,disableFocusListener:n=!1,disableMouseListener:r=!1,enterDelay:i=1e3,leaveDelay:a=0,onBlur:o,onClose:s,onFocus:c,onMouseEnter:l,onMouseLeave:u,onOpen:d,style:f,text:p,position:m=`top`,...h},g)=>{let[_,v]=(0,H.useState)(!1),[y,b]=(0,H.useState)(),[x,S]=(0,H.useState)(),C=!n,w=!r,T=e=>{window.clearTimeout(y),window.clearTimeout(x);let t=window.setTimeout(()=>{v(!0),d?.(e)},i);b(t)},E=e=>{e.persist(),Ya(e)?c?.(e):Xa(e)&&l?.(e),T(e)},D=e=>{window.clearTimeout(y),window.clearTimeout(x);let t=window.setTimeout(()=>{v(!1),s?.(e)},a);S(t)},O=e=>{e.persist(),Ya(e)?o?.(e):Xa(e)&&u?.(e),D(e)},k=C?O:void 0,A=C?E:void 0,j=w?E:void 0,M=w?O:void 0,N=C?0:void 0;return H.createElement($a,{"data-testid":`tooltip-wrapper`,onBlur:k,onFocus:A,onMouseEnter:j,onMouseLeave:M,tabIndex:N},H.createElement(Qa,{className:e,"data-testid":`tooltip`,position:m,ref:g,show:_,style:f,...h},p),t)});eo.displayName=`Tooltip`;var to=G(Yn)`
  white-space: nowrap;
`,no=W`
  :focus {
    outline: none;
  }

  ${({$disabled:e})=>e?`cursor: default;`:W`
          cursor: pointer;

          :focus {
            ${to} {
              background: ${({theme:e})=>e.hoverBackground};
              color: ${({theme:e})=>e.materialTextInvert};
              outline: 2px dotted ${({theme:e})=>e.focusSecondary};
            }
          }
        `}
`,ro=G.ul`
  position: relative;
  isolation: isolate;

  ${({isRootLevel:e})=>e&&W`
      &:before {
        content: '';
        position: absolute;
        top: 20px;
        bottom: 0;
        left: 5.5px;
        width: 1px;
        border-left: 2px dashed ${({theme:e})=>e.borderDark};
      }
    `}

  ul {
    padding-left: 19.5px;
  }

  li {
    position: relative;

    &:before {
      content: '';
      position: absolute;
      top: 17.5px;
      left: 5.5px;
      width: 22px;
      border-top: 2px dashed ${({theme:e})=>e.borderDark};
      font-size: 12px;
    }
  }
`,io=G.li`
  position: relative;
  padding-left: ${({hasItems:e})=>e?`0`:`13px`};

  ${({isRootLevel:e})=>e?W`
          &:last-child {
            &:after {
              content: '';
              position: absolute;
              top: 19.5px;
              left: 1px;
              bottom: 0;
              width: 10px;
              background: ${({theme:e})=>e.material};
            }
          }
        `:W`
          &:last-child {
            &:after {
              content: '';
              position: absolute;
              z-index: 1;
              top: 19.5px;
              bottom: 0;
              left: 1.5px;
              width: 10px;
              background: ${({theme:e})=>e.material};
            }
          }
        `}

  & > details > ul {
    &:after {
      content: '';
      position: absolute;
      top: -18px;
      bottom: 0;
      left: 25px;
      border-left: 2px dashed ${({theme:e})=>e.borderDark};
    }
  }
`,ao=G.details`
  position: relative;
  z-index: 2;

  &[open] > summary:before {
    content: '-';
  }
`,oo=G.summary`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  color: ${({theme:e})=>e.materialText};
  user-select: none;
  padding-left: 18px;
  ${no};

  &::-webkit-details-marker {
    display: none;
  }

  &:before {
    content: '+';
    position: absolute;
    left: 0;
    display: block;
    width: 8px;
    height: 9px;
    border: 2px solid #808080;
    padding-left: 1px;
    background-color: #fff;
    line-height: 8px;
    text-align: center;
  }
`,so=G(Jn)`
  position: relative;
  z-index: 1;
  background: none;
  border: 0;
  font-family: inherit;
  padding-top: 8px;
  padding-bottom: 8px;
  margin: 0;
  ${no};
`,co=G.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 6px;
`;function lo(e,t){return e.includes(t)?e.filter(e=>e!==t):[...e,t]}function uo(e){e.preventDefault()}function fo({className:e,disabled:t,expanded:n,innerRef:r,level:i,select:a,selected:o,style:s,tree:c=[]}){let l=i===0,u=(0,H.useCallback)(r=>{let c=!!(r.items&&r.items.length>0),u=n.includes(r.id),d=(t||r.disabled)??!1,f=d?uo:e=>a(e,r),p=d?uo:e=>a(e,r),m=o===r.id,h=H.createElement(co,{"aria-hidden":!0},r.icon);return H.createElement(io,{key:r.label,isRootLevel:l,role:`treeitem`,"aria-expanded":u,"aria-selected":m,hasItems:c},c?H.createElement(ao,{open:u},H.createElement(oo,{onClick:f,$disabled:d},H.createElement(so,{$disabled:d},h,H.createElement(to,null,r.label))),u&&H.createElement(fo,{className:e,disabled:d,expanded:n,level:i+1,select:a,selected:o,style:s,tree:r.items??[]})):H.createElement(so,{as:`button`,$disabled:d,onClick:p},h,H.createElement(to,null,r.label)))},[e,t,n,l,i,a,o,s]);return H.createElement(ro,{className:l?e:void 0,style:l?s:void 0,ref:l?r:void 0,role:l?`tree`:`group`,isRootLevel:l},c.map(u))}function po({className:e,defaultExpanded:t=[],defaultSelected:n,disabled:r=!1,expanded:i,onNodeSelect:a,onNodeToggle:o,selected:s,style:c,tree:l=[]},u){let[d,f]=Z({defaultValue:t,onChange:o,onChangePropName:`onNodeToggle`,value:i,valuePropName:`expanded`}),[p,m]=Z({defaultValue:n,onChange:a,onChangePropName:`onNodeSelect`,value:s,valuePropName:`selected`}),h=(0,H.useCallback)((e,t)=>{o&&o(e,lo(d,t)),f(e=>lo(e,t))},[d,o,f]),g=(0,H.useCallback)((e,t)=>{m(t),a&&a(e,t)},[a,m]),_=(0,H.useCallback)((e,t)=>{e.preventDefault(),g(e,t.id),t.items&&t.items.length&&h(e,t.id)},[g,h]);return H.createElement(fo,{className:e,disabled:r,expanded:d,level:0,innerRef:u,select:_,selected:p,style:c,tree:l})}var mo=(0,H.forwardRef)(po);mo.displayName=`TreeView`;var ho=wi,go=ar,_o=Ci,vo=Kn,yo=Gn,bo=bi,xo=Ui,So=Tr;export{jn as C,Un as S,dn as T,ai as _,vo as a,$r as b,ho as c,Fa as d,Na as f,ci as g,Da as h,yo as i,eo as l,ka as m,xo as n,_o as o,ja as p,bo as r,go as s,So as t,Ra as u,ri as v,G as w,ir as x,ti as y};