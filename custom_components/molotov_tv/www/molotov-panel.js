var X=typeof window<"u"&&window.customElements!=null&&window.customElements.polyfillWrapFlushCallback!==void 0;var P=(o,e,t=null)=>{for(;e!==t;){let i=e.nextSibling;o.removeChild(e),e=i}};var m=`{{lit-${String(Math.random()).slice(2)}}}`,Z=`<!--${m}-->`,_e=new RegExp(`${m}|${Z}`),A="$lit$",T=class{constructor(e,t){this.parts=[],this.element=t;let i=[],s=[],r=document.createTreeWalker(t.content,133,null,!1),n=0,a=-1,d=0,{strings:c,values:{length:p}}=e;for(;d<p;){let h=r.nextNode();if(h===null){r.currentNode=s.pop();continue}if(a++,h.nodeType===1){if(h.hasAttributes()){let u=h.attributes,{length:g}=u,f=0;for(let y=0;y<g;y++)me(u[y].name,A)&&f++;for(;f-- >0;){let y=c[d],R=B.exec(y)[2],M=R.toLowerCase()+A,S=h.getAttribute(M);h.removeAttribute(M);let x=S.split(_e);this.parts.push({type:"attribute",index:a,name:R,strings:x}),d+=x.length-1}}h.tagName==="TEMPLATE"&&(s.push(h),r.currentNode=h.content)}else if(h.nodeType===3){let u=h.data;if(u.indexOf(m)>=0){let g=h.parentNode,f=u.split(_e),y=f.length-1;for(let R=0;R<y;R++){let M,S=f[R];if(S==="")M=v();else{let x=B.exec(S);x!==null&&me(x[2],A)&&(S=S.slice(0,x.index)+x[1]+x[2].slice(0,-A.length)+x[3]),M=document.createTextNode(S)}g.insertBefore(M,h),this.parts.push({type:"node",index:++a})}f[y]===""?(g.insertBefore(v(),h),i.push(h)):h.data=f[y],d+=y}}else if(h.nodeType===8)if(h.data===m){let u=h.parentNode;(h.previousSibling===null||a===n)&&(a++,u.insertBefore(v(),h)),n=a,this.parts.push({type:"node",index:a}),h.nextSibling===null?h.data="":(i.push(h),a--),d++}else{let u=-1;for(;(u=h.data.indexOf(m,u+1))!==-1;)this.parts.push({type:"node",index:-1}),d++}}for(let h of i)h.parentNode.removeChild(h)}},me=(o,e)=>{let t=o.length-e.length;return t>=0&&o.slice(t)===e},q=o=>o.index!==-1,v=()=>document.createComment(""),B=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;var ee=133;function te(o,e){let{element:{content:t},parts:i}=o,s=document.createTreeWalker(t,ee,null,!1),r=F(i),n=i[r],a=-1,d=0,c=[],p=null;for(;s.nextNode();){a++;let h=s.currentNode;for(h.previousSibling===p&&(p=null),e.has(h)&&(c.push(h),p===null&&(p=h)),p!==null&&d++;n!==void 0&&n.index===a;)n.index=p!==null?-1:n.index-d,r=F(i,r),n=i[r]}c.forEach(h=>h.parentNode.removeChild(h))}var Re=o=>{let e=o.nodeType===11?0:1,t=document.createTreeWalker(o,ee,null,!1);for(;t.nextNode();)e++;return e},F=(o,e=-1)=>{for(let t=e+1;t<o.length;t++){let i=o[t];if(q(i))return t}return-1};function ge(o,e,t=null){let{element:{content:i},parts:s}=o;if(t==null){i.appendChild(e);return}let r=document.createTreeWalker(i,ee,null,!1),n=F(s),a=0,d=-1;for(;r.nextNode();)for(d++,r.currentNode===t&&(a=Re(e),t.parentNode.insertBefore(e,t));n!==-1&&s[n].index===d;){if(a>0){for(;n!==-1;)s[n].index+=a,n=F(s,n);return}n=F(s,n)}}var Me=new WeakMap;var C=o=>typeof o=="function"&&Me.has(o);var _={},W={};var w=class{constructor(e,t,i){this.__parts=[],this.template=e,this.processor=t,this.options=i}update(e){let t=0;for(let i of this.__parts)i!==void 0&&i.setValue(e[t]),t++;for(let i of this.__parts)i!==void 0&&i.commit()}_clone(){let e=X?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),t=[],i=this.template.parts,s=document.createTreeWalker(e,133,null,!1),r=0,n=0,a,d=s.nextNode();for(;r<i.length;){if(a=i[r],!q(a)){this.__parts.push(void 0),r++;continue}for(;n<a.index;)n++,d.nodeName==="TEMPLATE"&&(t.push(d),s.currentNode=d.content),(d=s.nextNode())===null&&(s.currentNode=t.pop(),d=s.nextNode());if(a.type==="node"){let c=this.processor.handleTextExpression(this.options);c.insertAfterNode(d.previousSibling),this.__parts.push(c)}else this.__parts.push(...this.processor.handleAttributeExpressions(d,a.name,a.strings,this.options));r++}return X&&(document.adoptNode(e),customElements.upgrade(e)),e}};var fe=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:o=>o}),Ne=` ${m} `,b=class{constructor(e,t,i,s){this.strings=e,this.values=t,this.type=i,this.processor=s}getHTML(){let e=this.strings.length-1,t="",i=!1;for(let s=0;s<e;s++){let r=this.strings[s],n=r.lastIndexOf("<!--");i=(n>-1||i)&&r.indexOf("-->",n+1)===-1;let a=B.exec(r);a===null?t+=r+(i?Ne:Z):t+=r.substr(0,a.index)+a[1]+a[2]+A+a[3]+m}return t+=this.strings[e],t}getTemplateElement(){let e=document.createElement("template"),t=this.getHTML();return fe!==void 0&&(t=fe.createHTML(t)),e.innerHTML=t,e}};var G=o=>o===null||!(typeof o=="object"||typeof o=="function"),H=o=>Array.isArray(o)||!!(o&&o[Symbol.iterator]),N=class{constructor(e,t,i){this.dirty=!0,this.element=e,this.name=t,this.strings=i,this.parts=[];for(let s=0;s<i.length-1;s++)this.parts[s]=this._createPart()}_createPart(){return new j(this)}_getValue(){let e=this.strings,t=e.length-1,i=this.parts;if(t===1&&e[0]===""&&e[1]===""){let r=i[0].value;if(typeof r=="symbol")return String(r);if(typeof r=="string"||!H(r))return r}let s="";for(let r=0;r<t;r++){s+=e[r];let n=i[r];if(n!==void 0){let a=n.value;if(G(a)||!H(a))s+=typeof a=="string"?a:String(a);else for(let d of a)s+=typeof d=="string"?d:String(d)}}return s+=e[t],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}},j=class{constructor(e){this.value=void 0,this.committer=e}setValue(e){e!==_&&(!G(e)||e!==this.value)&&(this.value=e,C(e)||(this.committer.dirty=!0))}commit(){for(;C(this.value);){let e=this.value;this.value=_,e(this)}this.value!==_&&this.committer.commit()}},E=class o{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(v()),this.endNode=e.appendChild(v())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=v()),e.__insert(this.endNode=v())}insertAfterPart(e){e.__insert(this.startNode=v()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){if(this.startNode.parentNode===null)return;for(;C(this.__pendingValue);){let t=this.__pendingValue;this.__pendingValue=_,t(this)}let e=this.__pendingValue;e!==_&&(G(e)?e!==this.value&&this.__commitText(e):e instanceof b?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):H(e)?this.__commitIterable(e):e===W?(this.value=W,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){let t=this.startNode.nextSibling;e=e??"";let i=typeof e=="string"?e:String(e);t===this.endNode.previousSibling&&t.nodeType===3?t.data=i:this.__commitNode(document.createTextNode(i)),this.value=e}__commitTemplateResult(e){let t=this.options.templateFactory(e);if(this.value instanceof w&&this.value.template===t)this.value.update(e.values);else{let i=new w(t,e.processor,this.options),s=i._clone();i.update(e.values),this.__commitNode(s),this.value=i}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());let t=this.value,i=0,s;for(let r of e)s=t[i],s===void 0&&(s=new o(this.options),t.push(s),i===0?s.appendIntoPart(this):s.insertAfterPart(t[i-1])),s.setValue(r),s.commit(),i++;i<t.length&&(t.length=i,this.clear(s&&s.endNode))}clear(e=this.startNode){P(this.startNode.parentNode,e.nextSibling,this.endNode)}},O=class{constructor(e,t,i){if(this.value=void 0,this.__pendingValue=void 0,i.length!==2||i[0]!==""||i[1]!=="")throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=i}setValue(e){this.__pendingValue=e}commit(){for(;C(this.__pendingValue);){let t=this.__pendingValue;this.__pendingValue=_,t(this)}if(this.__pendingValue===_)return;let e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=_}},V=class extends N{constructor(e,t,i){super(e,t,i),this.single=i.length===2&&i[0]===""&&i[1]===""}_createPart(){return new Q(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}},Q=class extends j{},ye=!1;(()=>{try{let o={get capture(){return ye=!0,!1}};window.addEventListener("test",o,o),window.removeEventListener("test",o,o)}catch{}})();var z=class{constructor(e,t,i){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=i,this.__boundHandleEvent=s=>this.handleEvent(s)}setValue(e){this.__pendingValue=e}commit(){for(;C(this.__pendingValue);){let r=this.__pendingValue;this.__pendingValue=_,r(this)}if(this.__pendingValue===_)return;let e=this.__pendingValue,t=this.value,i=e==null||t!=null&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),s=e!=null&&(t==null||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=Ue(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=_}handleEvent(e){typeof this.value=="function"?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}},Ue=o=>o&&(ye?{capture:o.capture,passive:o.passive,once:o.once}:o.capture);function ie(o){let e=$.get(o.type);e===void 0&&(e={stringsArray:new WeakMap,keyString:new Map},$.set(o.type,e));let t=e.stringsArray.get(o.strings);if(t!==void 0)return t;let i=o.strings.join(m);return t=e.keyString.get(i),t===void 0&&(t=new T(o,o.getTemplateElement()),e.keyString.set(i,t)),e.stringsArray.set(o.strings,t),t}var $=new Map;var k=new WeakMap,se=(o,e,t)=>{let i=k.get(e);i===void 0&&(P(e,e.firstChild),k.set(e,i=new E(Object.assign({templateFactory:ie},t))),i.appendInto(e)),i.setValue(o),i.commit()};var J=class{handleAttributeExpressions(e,t,i,s){let r=t[0];return r==="."?new V(e,t.slice(1),i).parts:r==="@"?[new z(e,t.slice(1),s.eventContext)]:r==="?"?[new O(e,t.slice(1),i)]:new N(e,t,i).parts}handleTextExpression(e){return new E(e)}},re=new J;typeof window<"u"&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var l=(o,...e)=>new b(o,e,"html",re);var xe=(o,e)=>`${o}--${e}`,K=!0;typeof window.ShadyCSS>"u"?K=!1:typeof window.ShadyCSS.prepareTemplateDom>"u"&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),K=!1);var qe=o=>e=>{let t=xe(e.type,o),i=$.get(t);i===void 0&&(i={stringsArray:new WeakMap,keyString:new Map},$.set(t,i));let s=i.stringsArray.get(e.strings);if(s!==void 0)return s;let r=e.strings.join(m);if(s=i.keyString.get(r),s===void 0){let n=e.getTemplateElement();K&&window.ShadyCSS.prepareTemplateDom(n,o),s=new T(e,n),i.keyString.set(r,s)}return i.stringsArray.set(e.strings,s),s},Fe=["html","svg"],je=o=>{Fe.forEach(e=>{let t=$.get(xe(e,o));t!==void 0&&t.keyString.forEach(i=>{let{element:{content:s}}=i,r=new Set;Array.from(s.querySelectorAll("style")).forEach(n=>{r.add(n)}),te(i,r)})})},be=new Set,Oe=(o,e,t)=>{be.add(o);let i=t?t.element:document.createElement("template"),s=e.querySelectorAll("style"),{length:r}=s;if(r===0){window.ShadyCSS.prepareTemplateStyles(i,o);return}let n=document.createElement("style");for(let c=0;c<r;c++){let p=s[c];p.parentNode.removeChild(p),n.textContent+=p.textContent}je(o);let a=i.content;t?ge(t,n,a.firstChild):a.insertBefore(n,a.firstChild),window.ShadyCSS.prepareTemplateStyles(i,o);let d=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&d!==null)e.insertBefore(d.cloneNode(!0),e.firstChild);else if(t){a.insertBefore(n,a.firstChild);let c=new Set;c.add(n),te(t,c)}},we=(o,e,t)=>{if(!t||typeof t!="object"||!t.scopeName)throw new Error("The `scopeName` option is required.");let i=t.scopeName,s=k.has(e),r=K&&e.nodeType===11&&!!e.host,n=r&&!be.has(i),a=n?document.createDocumentFragment():e;if(se(o,a,Object.assign({templateFactory:qe(i)},t)),n){let d=k.get(a);k.delete(a);let c=d.value instanceof w?d.value.template:void 0;Oe(i,a,c),P(e,e.firstChild),e.appendChild(a),k.set(e,d)}!s&&r&&window.ShadyCSS.styleElement(e.host)};var ke;window.JSCompiler_renameProperty=(o,e)=>o;var ce={toAttribute(o,e){switch(e){case Boolean:return o?"":null;case Object:case Array:return o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){switch(e){case Boolean:return o!==null;case Number:return o===null?null:Number(o);case Object:case Array:return JSON.parse(o)}return o}},Se=(o,e)=>e!==o&&(e===e||o===o),ne={attribute:!0,type:String,converter:ce,reflect:!1,hasChanged:Se},oe=1,ae=4,le=8,de=16,he="finalized",U=class extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();let e=[];return this._classProperties.forEach((t,i)=>{let s=this._attributeNameForProperty(i,t);s!==void 0&&(this._attributeToPropertyMap.set(s,i),e.push(s))}),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;let e=Object.getPrototypeOf(this)._classProperties;e!==void 0&&e.forEach((t,i)=>this._classProperties.set(i,t))}}static createProperty(e,t=ne){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;let i=typeof e=="symbol"?Symbol():`__${e}`,s=this.getPropertyDescriptor(e,i,t);s!==void 0&&Object.defineProperty(this.prototype,e,s)}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(s){let r=this[e];this[t]=s,this.requestUpdateInternal(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this._classProperties&&this._classProperties.get(e)||ne}static finalize(){let e=Object.getPrototypeOf(this);if(e.hasOwnProperty(he)||e.finalize(),this[he]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){let t=this.properties,i=[...Object.getOwnPropertyNames(t),...typeof Object.getOwnPropertySymbols=="function"?Object.getOwnPropertySymbols(t):[]];for(let s of i)this.createProperty(s,t[s])}}static _attributeNameForProperty(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}static _valueHasChanged(e,t,i=Se){return i(e,t)}static _propertyValueFromAttribute(e,t){let i=t.type,s=t.converter||ce,r=typeof s=="function"?s:s.fromAttribute;return r?r(e,i):e}static _propertyValueToAttribute(e,t){if(t.reflect===void 0)return;let i=t.type,s=t.converter;return(s&&s.toAttribute||ce.toAttribute)(e,i)}initialize(){this._updateState=0,this._updatePromise=new Promise(e=>this._enableUpdatingResolver=e),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach((e,t)=>{if(this.hasOwnProperty(t)){let i=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,i)}})}_applyInstanceProperties(){this._instanceProperties.forEach((e,t)=>this[t]=e),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){this._enableUpdatingResolver!==void 0&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(e,t,i){t!==i&&this._attributeToProperty(e,i)}_propertyToAttribute(e,t,i=ne){let s=this.constructor,r=s._attributeNameForProperty(e,i);if(r!==void 0){let n=s._propertyValueToAttribute(t,i);if(n===void 0)return;this._updateState=this._updateState|le,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._updateState=this._updateState&~le}}_attributeToProperty(e,t){if(this._updateState&le)return;let i=this.constructor,s=i._attributeToPropertyMap.get(e);if(s!==void 0){let r=i.getPropertyOptions(s);this._updateState=this._updateState|de,this[s]=i._propertyValueFromAttribute(t,r),this._updateState=this._updateState&~de}}requestUpdateInternal(e,t,i){let s=!0;if(e!==void 0){let r=this.constructor;i=i||r.getPropertyOptions(e),r._valueHasChanged(this[e],t,i.hasChanged)?(this._changedProperties.has(e)||this._changedProperties.set(e,t),i.reflect===!0&&!(this._updateState&de)&&(this._reflectingProperties===void 0&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,i))):s=!1}!this._hasRequestedUpdate&&s&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(e,t){return this.requestUpdateInternal(e,t),this.updateComplete}async _enqueueUpdate(){this._updateState=this._updateState|ae;try{await this._updatePromise}catch{}let e=this.performUpdate();return e!=null&&await e,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return this._updateState&ae}get hasUpdated(){return this._updateState&oe}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let e=!1,t=this._changedProperties;try{e=this.shouldUpdate(t),e?this.update(t):this._markUpdated()}catch(i){throw e=!1,this._markUpdated(),i}e&&(this._updateState&oe||(this._updateState=this._updateState|oe,this.firstUpdated(t)),this.updated(t))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~ae}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){this._reflectingProperties!==void 0&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((t,i)=>this._propertyToAttribute(i,this[i],t)),this._reflectingProperties=void 0),this._markUpdated()}updated(e){}firstUpdated(e){}};ke=he;U[ke]=!0;var Pe=Element.prototype,jt=Pe.msMatchesSelector||Pe.webkitMatchesSelector;var Y=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pe=Symbol(),D=class{constructor(e,t){if(t!==pe)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return this._styleSheet===void 0&&(Y?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}},Te=o=>new D(String(o),pe),Ve=o=>{if(o instanceof D)return o.cssText;if(typeof o=="number")return o;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${o}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`)},Ce=(o,...e)=>{let t=e.reduce((i,s,r)=>i+Ve(s)+o[r+1],o[0]);return new D(t,pe)};(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");var Ee={},I=class extends U{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;let e=this.getStyles();if(Array.isArray(e)){let t=(r,n)=>r.reduceRight((a,d)=>Array.isArray(d)?t(d,a):(a.add(d),a),n),i=t(e,new Set),s=[];i.forEach(r=>s.unshift(r)),this._styles=s}else this._styles=e===void 0?[]:[e];this._styles=this._styles.map(t=>{if(t instanceof CSSStyleSheet&&!Y){let i=Array.prototype.slice.call(t.cssRules).reduce((s,r)=>s+r.cssText,"");return Te(i)}return t})}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){let e=this.constructor._styles;e.length!==0&&(window.ShadyCSS!==void 0&&!window.ShadyCSS.nativeShadow?window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(t=>t.cssText),this.localName):Y?this.renderRoot.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):this._needsShimAdoptedStyleSheets=!0)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&window.ShadyCSS!==void 0&&window.ShadyCSS.styleElement(this)}update(e){let t=this.render();super.update(e),t!==Ee&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(i=>{let s=document.createElement("style");s.textContent=i.cssText,this.renderRoot.appendChild(s)}))}render(){return Ee}};I.finalized=!0;I.render=we;I.shadowRootOptions={mode:"open"};var Ie="0.1.15",ze={fr:"Francais",fra:"Francais",fre:"Francais",en:"English",eng:"English",de:"Deutsch",deu:"Deutsch",ger:"Deutsch",es:"Espanol",spa:"Espanol",it:"Italiano",ita:"Italiano",pt:"Portugues",por:"Portugues",qaa:"Original",und:"Indefini",mul:"Multiple"};function $e(o){if(!o)return"Inconnu";let e=o.toLowerCase();return ze[e]||o.toUpperCase()}function L(o){let e=o.split(":");if(e.length<2)return null;let t=e.slice(1).join(":");try{let i=t,s=t.length%4;s&&(i+="=".repeat(4-s));let r=atob(i.replace(/-/g,"+").replace(/_/g,"/"));return JSON.parse(r)}catch{return null}}var ue=class extends I{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},panel:{type:Object},_channels:{type:Array},_loading:{type:Boolean},_error:{type:String},_playing:{type:Boolean},_selectedChannel:{type:Object},_streamData:{type:Object},_isFullscreen:{type:Boolean},_playerError:{type:String},_currentTime:{type:Number},_duration:{type:Number},_volume:{type:Number},_muted:{type:Boolean},_paused:{type:Boolean},_audioTracks:{type:Array},_textTracks:{type:Array},_selectedAudioIndex:{type:Number},_selectedTextIndex:{type:Number},_isLive:{type:Boolean},_programStart:{type:Number},_programEnd:{type:Number},_showAudioMenu:{type:Boolean},_showTextMenu:{type:Boolean},_expandedChannels:{type:Object},_channelPrograms:{type:Object},_loadingPrograms:{type:Object},_searchQuery:{type:String},_searchResults:{type:Array},_searching:{type:Boolean},_showingSearch:{type:Boolean},_expandedResults:{type:Object},_resultEpisodes:{type:Object},_loadingEpisodes:{type:Object},_castTargets:{type:Array},_selectedTarget:{type:String},_activeTab:{type:String},_recordings:{type:Array},_loadingRecordings:{type:Boolean},_expandedRecordings:{type:Object},_recordingEpisodes:{type:Object},_loadingRecordingEpisodes:{type:Object},_castPlaying:{type:Boolean},_castTarget:{type:String},_castTitle:{type:String},_tonightChannels:{type:Array},_loadingTonight:{type:Boolean}}}static get styles(){return Ce`
      :host {
        display: block;
        height: 100%;
        background: var(--primary-background-color);
        overflow: hidden;
      }

      .container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        background: var(--card-background-color);
        border-bottom: 1px solid var(--divider-color);
      }

      .header h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .header-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .cast-select {
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--primary-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
        cursor: pointer;
        min-width: 150px;
      }

      .cast-select:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      /* Tabs */
      .tabs {
        display: flex;
        background: var(--card-background-color);
        border-bottom: 1px solid var(--divider-color);
      }

      .tab {
        flex: 1;
        padding: 12px 16px;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        color: var(--secondary-text-color);
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .tab:hover {
        color: var(--primary-text-color);
        background: var(--secondary-background-color);
      }

      .tab.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }

      /* Recording item */
      .recording-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--card-background-color);
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .recording-item:hover {
        background: var(--secondary-background-color);
      }

      .recording-thumb {
        width: 100px;
        height: 56px;
        object-fit: cover;
        border-radius: 4px;
        background: #000;
        flex-shrink: 0;
      }

      .recording-info {
        flex: 1;
        min-width: 0;
      }

      .recording-title {
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .recording-subtitle {
        font-size: 12px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      button {
        background: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      button:hover {
        opacity: 0.9;
      }

      button.secondary {
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
      }

      button.danger {
        background: #f44336;
      }

      button.icon-btn {
        padding: 8px;
        background: transparent;
        color: #fff;
      }

      button.icon-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }

      .loading,
      .error {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: var(--secondary-text-color);
      }

      .error {
        color: var(--error-color);
        flex-direction: column;
        gap: 16px;
      }

      .channel-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }


      .channel-logo {
        width: 48px;
        height: 48px;
        object-fit: contain;
        border-radius: 4px;
        background: #000;
        flex-shrink: 0;
      }

      .channel-info {
        flex: 1;
        min-width: 0;
      }

      .channel-name {
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 4px;
      }

      .program-info {
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .program-now {
        margin-bottom: 2px;
      }

      .program-next {
        opacity: 0.7;
        font-size: 12px;
      }

      .program-time {
        color: var(--primary-color);
        font-weight: 500;
      }

      /* Player view */
      .player-view {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }

      .player-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: var(--card-background-color);
        border-bottom: 1px solid var(--divider-color);
        flex-shrink: 0;
      }

      .player-header-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .player-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #000;
        position: relative;
        min-height: 0;
        overflow: hidden;
      }

      .video-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        min-height: 0;
        overflow: hidden;
      }

      video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #000;
      }

      .player-info {
        padding: 12px 16px;
        background: var(--card-background-color);
        flex-shrink: 0;
      }

      .now-playing-title {
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 4px;
      }

      .now-playing-program {
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .player-error {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 16px 24px;
        border-radius: 8px;
        text-align: center;
        max-width: 80%;
      }

      .play-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s;
      }

      .play-overlay:hover {
        background: rgba(0, 0, 0, 0.8);
      }

      .play-overlay svg {
        width: 40px;
        height: 40px;
        fill: #fff;
      }

      /* Custom controls */
      .custom-controls {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        opacity: 1;
        transition: opacity 0.3s;
      }

      .video-wrapper:not(:hover) .custom-controls.autohide {
        opacity: 0;
      }

      .progress-container {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #fff;
        font-size: 12px;
      }

      .progress-bar {
        flex: 1;
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        cursor: pointer;
        position: relative;
      }

      .progress-bar:hover {
        height: 6px;
      }

      .progress-filled {
        height: 100%;
        background: var(--primary-color);
        border-radius: 2px;
        position: relative;
      }

      .progress-filled::after {
        content: "";
        position: absolute;
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .progress-bar:hover .progress-filled::after {
        opacity: 1;
      }

      .controls-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .controls-left,
      .controls-right {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .volume-container {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .volume-slider {
        width: 60px;
        height: 4px;
        -webkit-appearance: none;
        appearance: none;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        cursor: pointer;
      }

      .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
        cursor: pointer;
      }

      .track-menu-container {
        position: relative;
      }

      .track-menu {
        position: absolute;
        bottom: 100%;
        right: 0;
        background: rgba(0, 0, 0, 0.9);
        border-radius: 4px;
        padding: 4px 0;
        min-width: 120px;
        margin-bottom: 8px;
      }

      .track-menu-item {
        padding: 8px 16px;
        color: #fff;
        cursor: pointer;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .track-menu-item:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .track-menu-item.selected {
        color: var(--primary-color);
      }

      .track-menu-item.selected::before {
        content: "\\2713";
      }

      .live-badge {
        background: #f44336;
        color: #fff;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: bold;
        margin-left: 8px;
      }

      .hidden {
        display: none !important;
      }

      /* Channel row with replay button */
      .channel-row {
        display: flex;
        flex-direction: column;
        background: var(--card-background-color);
        border-radius: 8px;
        overflow: hidden;
      }

      .channel-main {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .channel-main:hover {
        background: var(--secondary-background-color);
      }

      .channel-actions {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-left: auto;
        flex-shrink: 0;
      }

      .replay-btn {
        background: transparent;
        color: var(--primary-color);
        border: 1px solid var(--primary-color);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .replay-btn:hover {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .replay-btn.expanded {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .replay-list {
        background: var(--secondary-background-color);
        padding: 8px 12px 12px 72px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .replay-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: var(--card-background-color);
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: background 0.2s;
      }

      .replay-item:hover {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .replay-thumb {
        width: 60px;
        height: 34px;
        object-fit: cover;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .replay-item-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .replay-item-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .replay-item-desc {
        font-size: 11px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 2px;
      }

      .replay-loading {
        padding: 12px;
        color: var(--secondary-text-color);
        font-size: 13px;
      }

      .replay-empty {
        padding: 12px;
        color: var(--secondary-text-color);
        font-size: 13px;
        font-style: italic;
      }

      /* Search bar */
      .search-bar {
        display: flex;
        gap: 8px;
        padding: 12px 16px;
        background: var(--card-background-color);
        border-bottom: 1px solid var(--divider-color);
      }

      .search-input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--primary-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
      }

      .search-input:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      .search-input::placeholder {
        color: var(--secondary-text-color);
      }

      .search-btn {
        padding: 10px 16px;
      }

      .search-results-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: var(--secondary-background-color);
        border-bottom: 1px solid var(--divider-color);
      }

      .search-results-title {
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .search-result-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--card-background-color);
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .search-result-item:hover {
        background: var(--secondary-background-color);
      }

      .search-result-thumb {
        width: 80px;
        height: 45px;
        object-fit: cover;
        border-radius: 4px;
        background: #000;
        flex-shrink: 0;
      }

      .search-result-info {
        flex: 1;
        min-width: 0;
      }

      .search-result-title {
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .search-result-subtitle {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      /* Search result row with expand */
      .search-result-row {
        background: var(--card-background-color);
        border-radius: 8px;
        overflow: hidden;
      }

      .search-result-main {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .search-result-main:hover {
        background: var(--secondary-background-color);
      }

      .expand-icon {
        color: var(--secondary-text-color);
        transition: transform 0.2s;
      }

      .expand-icon.expanded {
        transform: rotate(90deg);
      }

      .episodes-list {
        background: var(--secondary-background-color);
        padding: 8px 12px 12px 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .episode-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        background: var(--card-background-color);
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .episode-item:hover {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .episode-thumb {
        width: 80px;
        height: 45px;
        object-fit: cover;
        border-radius: 4px;
        flex-shrink: 0;
        background: #000;
      }

      .episode-info {
        flex: 1;
        min-width: 0;
      }

      .episode-title {
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .episode-desc {
        font-size: 11px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 2px;
      }

      .episodes-loading,
      .episodes-empty {
        padding: 12px;
        color: var(--secondary-text-color);
        font-size: 13px;
      }

      /* Tonight EPG styles */
      .tonight-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .tonight-channel {
        background: var(--card-background-color);
        border-radius: 8px;
        overflow: hidden;
      }

      .tonight-channel-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--secondary-background-color);
        border-bottom: 1px solid var(--divider-color);
      }

      .tonight-channel-logo {
        width: 40px;
        height: 40px;
        object-fit: contain;
        border-radius: 4px;
        background: #000;
      }

      .tonight-channel-name {
        font-weight: 500;
        font-size: 16px;
        color: var(--primary-text-color);
      }

      .tonight-programs {
        display: flex;
        flex-direction: column;
      }

      .tonight-program {
        display: flex;
        flex-direction: column;
        padding: 10px 12px;
        cursor: pointer;
        border-bottom: 1px solid var(--divider-color);
        transition: background 0.2s;
      }

      .tonight-program:last-child {
        border-bottom: none;
      }

      .tonight-program:hover {
        background: var(--secondary-background-color);
      }

      .tonight-program.live {
        background: rgba(var(--rgb-primary-color), 0.1);
        border-left: 3px solid var(--primary-color);
      }

      .tonight-program.past {
        opacity: 0.5;
      }

      .tonight-program-time {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .tonight-program-title {
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .live-indicator {
        background: #f44336;
        color: #fff;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: bold;
      }

      /* Cast player placeholder */
      .cast-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      }

      .cast-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        text-align: center;
        padding: 32px;
        flex: 1;
      }

      .cast-info ha-icon {
        --mdc-icon-size: 64px;
        color: var(--primary-color);
        margin-bottom: 16px;
      }

      .cast-title {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .cast-target {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      }
    `}constructor(){super(),this._channels=[],this._loading=!0,this._error=null,this._playing=!1,this._selectedChannel=null,this._streamData=null,this._isFullscreen=!1,this._playerError=null,this._player=null,this._entityUnsubscribe=null,this._showPlayOverlay=!1,this._currentTime=0,this._duration=0,this._volume=.5,this._muted=!1,this._paused=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._isLive=!1,this._programStart=null,this._programEnd=null,this._showAudioMenu=!1,this._showTextMenu=!1,this._updateInterval=null,this._expandedChannels={},this._channelPrograms={},this._loadingPrograms={},this._searchQuery="",this._searchResults=[],this._searching=!1,this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._castTargets=[],this._selectedTarget="local",this._activeTab="live",this._recordings=[],this._loadingRecordings=!1,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._tonightChannels=[],this._loadingTonight=!1}connectedCallback(){super.connectedCallback(),console.log(`[Molotov Panel] Connected - v${Ie}`),this._hasLoadedChannels=!1,document.addEventListener("fullscreenchange",this._onFullscreenChange.bind(this)),document.addEventListener("click",this._onDocumentClick.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this._cleanupPlayer(),document.removeEventListener("fullscreenchange",this._onFullscreenChange.bind(this)),document.removeEventListener("click",this._onDocumentClick.bind(this)),this._entityUnsubscribe&&(this._entityUnsubscribe(),this._entityUnsubscribe=null)}_onDocumentClick(e){e.composedPath().some(t=>t.classList?.contains("track-menu-container"))||(this._showAudioMenu=!1,this._showTextMenu=!1,this.requestUpdate())}updated(e){e.has("hass")&&this.hass&&(this._hasLoadedChannels||(this._hasLoadedChannels=!0,this._loadChannels()),this._syncWithEntity())}async _loadChannels(){this._loading=!0,this._error=null;try{let e=this._findMolotovEntity();if(!e)throw new Error("Entite Molotov TV introuvable");console.log(`[Molotov Panel] Loading channels for ${e}`);let t=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:"now_playing",media_content_type:"directory"});t&&t.children?(this._channels=t.children.map(i=>this._parseChannel(i)),console.log(`[Molotov Panel] Loaded ${this._channels.length} channels`),this._channels.length>0&&await this._fetchCastTargets(e,this._channels[0].mediaContentId)):this._channels=[],this._loading=!1}catch(e){console.error("[Molotov Panel] Failed to load channels:",e),this._error=e.message||"Erreur lors du chargement des chaines",this._loading=!1}}async _fetchCastTargets(e,t){try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:t,media_content_type:"program"});if(i&&i.children){let s=i.children.filter(r=>r.media_content_id.startsWith("cast:")).map(r=>({mediaContentId:r.media_content_id,title:r.title}));this._castTargets=s,console.log(`[Molotov Panel] Found ${s.length} cast targets`)}}catch(i){console.error("[Molotov Panel] Failed to fetch cast targets:",i),this._castTargets=[]}}_handleTargetChange(e){this._selectedTarget=e.target.value,console.log(`[Molotov Panel] Selected target: ${this._selectedTarget}`)}_switchTab(e){this._activeTab=e,e==="recordings"&&this._recordings.length===0&&this._loadRecordings(),e==="tonight"&&this._tonightChannels.length===0&&this._loadTonight(),this.requestUpdate()}async _loadRecordings(){let e=this._findMolotovEntity();if(e){this._loadingRecordings=!0,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this.requestUpdate();try{let t=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:"recordings",media_content_type:"directory"});t&&t.children?(this._recordings=t.children.map(i=>{let s=L(i.media_content_id);return{mediaContentId:i.media_content_id,title:i.title,thumbnail:i.thumbnail,description:s?.desc||null}}),console.log(`[Molotov Panel] Loaded ${this._recordings.length} recordings`)):this._recordings=[]}catch(t){console.error("[Molotov Panel] Failed to load recordings:",t),this._recordings=[]}this._loadingRecordings=!1,this.requestUpdate()}}async _loadTonight(){let e=this._findMolotovEntity();if(e){this._loadingTonight=!0,this.requestUpdate();try{let t=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:"tonight_epg",media_content_type:"directory"});if(t&&t.children){let i=[];for(let s of t.children){if(!s.children||s.children.length===0)continue;let r=s.media_content_id.split(":"),n=r.length>1?r[1]:s.media_content_id,a=s.children.map(d=>{let c=d.media_content_id.split(":"),p=c.length>=3?parseInt(c[2])*1e3:0,h=c.length>=4?parseInt(c[3])*1e3:0,u=d.title;u.startsWith("\u{1F534} ")&&(u=u.substring(3));let g=u.match(/^\d{2}:\d{2}-\d{2}:\d{2}\s+(.+)$/);return g&&(u=g[1]),{mediaContentId:d.media_content_id,title:u,thumbnail:d.thumbnail,start:p,end:h}});a.length>0&&i.push({id:n,name:s.title,thumbnail:s.thumbnail,programs:a})}this._tonightChannels=i,console.log(`[Molotov Panel] Loaded tonight EPG for ${i.length} channels`)}else this._tonightChannels=[]}catch(t){console.error("[Molotov Panel] Failed to load tonight EPG:",t),this._tonightChannels=[]}this._loadingTonight=!1,this.requestUpdate()}}async _toggleRecordingExpand(e,t){e.stopPropagation();let i=t.mediaContentId;if(this._expandedRecordings[i]){this._expandedRecordings={...this._expandedRecordings,[i]:!1},this.requestUpdate();return}this._recordingEpisodes[i]||await this._fetchRecordingEpisodes(t);let s=this._recordingEpisodes[i]||[];if(s.length===0){console.log("[Molotov Panel] No episodes found, playing recording directly"),await this._playRecordingDirectly(t);return}if(s.length===1){console.log("[Molotov Panel] Only 1 episode found, playing it directly"),await this._playRecordingEpisode(s[0],t.title);return}this._expandedRecordings={...this._expandedRecordings,[i]:!0},this.requestUpdate()}async _playRecordingDirectly(e){let t=this._findMolotovEntity();if(t){this._selectedChannel={name:"",currentProgram:{title:e.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null;try{let i=e.mediaContentId;i.startsWith("recording:")&&(i=i.substring(10));let s=this._buildPlayMediaId(`replay:${i}`);await this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:s,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play recording failed:",i),this._playerError=i.message||"Erreur de lecture"}}}async _fetchRecordingEpisodes(e){let t=this._findMolotovEntity();if(!t)return;let i=e.mediaContentId;this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:i,media_content_type:"recording"});if(s&&s.children){let r=s.children.filter(n=>n.media_content_id.startsWith("episode:")||n.media_content_id.startsWith("replay:")||n.media_content_id.startsWith("cast:")||n.can_play).map(n=>{let a=L(n.media_content_id);return{mediaContentId:n.media_content_id,title:n.title,thumbnail:n.thumbnail,description:a?.desc||null}});this._recordingEpisodes={...this._recordingEpisodes,[i]:r},console.log(`[Molotov Panel] Found ${r.length} episodes for recording "${e.title}"`)}else this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch recording episodes:",s),this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!1},this.requestUpdate()}async _playRecordingEpisode(e,t){let i=this._findMolotovEntity();if(i){this._selectedChannel={name:"",currentProgram:{title:e.title||t,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null;try{let s=this._buildPlayMediaId(e.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play recording episode failed:",s),this._playerError=s.message||"Erreur de lecture"}}}_buildPlayMediaId(e){if(this._selectedTarget==="local")return`play_local:${e}`;let t=this._selectedTarget.split(":");if(t.length>=2){let i=t[1],s=t.length>=3&&t[2]!=="native"&&t[2]!=="custom"?"":t[2];return s?`cast:${i}:${s}:${e}`:`cast:${i}:${e}`}return`play_local:${e}`}_isLocalPlayback(){return this._selectedTarget==="local"}_parseChannel(e){let t=e.media_content_id,[i,s]=t.split("|"),r=null;if(s)try{let g=s,f=s.length%4;f&&(g+="=".repeat(4-f)),r=decodeURIComponent(escape(atob(g.replace(/-/g,"+").replace(/_/g,"/"))))}catch{}let n=i.split(":"),a,d,c;n[0]==="program"?(a=n[1],d=n[2]?parseInt(n[2])*1e3:null,c=n[3]?parseInt(n[3])*1e3:null):n[0]==="live"&&(a=n[1]);let p=e.title.split(" - "),h=p[0],u=p.slice(1).join(" - ")||"Direct";return{id:a,name:h,thumbnail:e.thumbnail,mediaContentId:i,currentProgram:{title:u,description:r,start:d,end:c},nextProgram:null}}_findMolotovEntity(){if(!this.hass||!this.hass.states)return null;for(let e in this.hass.states)if(e.startsWith("media_player.molotov"))return e;return null}async _toggleChannelExpand(e,t){e.stopPropagation();let i=t.id;if(this._expandedChannels[i]){this._expandedChannels={...this._expandedChannels,[i]:!1},this.requestUpdate();return}this._expandedChannels={...this._expandedChannels,[i]:!0},this._channelPrograms[i]||await this._fetchChannelPrograms(t),this.requestUpdate()}async _fetchChannelPrograms(e){let t=this._findMolotovEntity();if(!t)return;let i=e.id;this._loadingPrograms={...this._loadingPrograms,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:`channel:${i}`,media_content_type:"channel"});if(s&&s.children){let r=s.children.filter(n=>n.media_content_id.startsWith("replay:")).map(n=>this._parseReplayItem(n,e));this._channelPrograms={...this._channelPrograms,[i]:r}}}catch(s){console.error("[Molotov Panel] Failed to fetch channel replays:",s),this._channelPrograms={...this._channelPrograms,[i]:[]}}this._loadingPrograms={...this._loadingPrograms,[i]:!1},this.requestUpdate()}_parseReplayItem(e,t){let i=L(e.media_content_id);return{mediaContentId:e.media_content_id,title:e.title,thumbnail:e.thumbnail,channelName:t.name,description:i?.desc||null}}async _playReplay(e){let t=this._findMolotovEntity();if(t){this._selectedChannel={name:e.channelName,currentProgram:{title:e.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null;try{let i=this._buildPlayMediaId(e.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play replay failed:",i),this._playerError=i.message||"Erreur de lecture"}}}_handleSearchInput(e){this._searchQuery=e.target.value}_handleSearchKeydown(e){e.key==="Enter"&&this._performSearch()}async _performSearch(){let e=this._searchQuery.trim();if(!e)return;let t=this._findMolotovEntity();if(t){this._searching=!0,this._showingSearch=!0,this._searchResults=[],this._expandedResults={},this._resultEpisodes={},this.requestUpdate();try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:`search:${encodeURIComponent(e)}`,media_content_type:"search"});if(i&&i.children){let s=i.children.filter(n=>n.media_content_id.startsWith("search_result:")).map(n=>this._parseSearchResult(n)),r=await this._filterResultsWithEpisodes(s,t);this._searchResults=r,console.log(`[Molotov Panel] Found ${this._searchResults.length} results with episodes for "${e}"`)}else this._searchResults=[]}catch(i){console.error("[Molotov Panel] Search failed:",i),this._searchResults=[]}this._searching=!1,this.requestUpdate()}}async _filterResultsWithEpisodes(e,t){let i=[],s=e.map(async n=>{try{let a=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:n.mediaContentId,media_content_type:"search_result"});if(a&&a.children){let d=a.children.filter(c=>c.media_content_id.startsWith("episode:")||c.media_content_id.startsWith("replay:")||c.can_play).map(c=>{let p=L(c.media_content_id);return{mediaContentId:c.media_content_id,title:c.title,thumbnail:c.thumbnail,description:p?.desc||null}});if(d.length>0)return this._resultEpisodes={...this._resultEpisodes,[n.mediaContentId]:d},n}return null}catch(a){return console.error(`[Molotov Panel] Failed to check episodes for "${n.title}":`,a),null}});return(await Promise.all(s)).filter(n=>n!==null)}_parseSearchResult(e){let t=L(e.media_content_id);return{mediaContentId:e.media_content_id,title:e.title,thumbnail:e.thumbnail,mediaClass:e.media_class,description:t?.desc||null}}_clearSearch(){this._searchQuery="",this._searchResults=[],this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this.requestUpdate()}async _toggleResultExpand(e,t){e.stopPropagation();let i=t.mediaContentId;if(this._expandedResults[i]){this._expandedResults={...this._expandedResults,[i]:!1},this.requestUpdate();return}this._expandedResults={...this._expandedResults,[i]:!0},this._resultEpisodes[i]||await this._fetchResultEpisodes(t),this.requestUpdate()}async _fetchResultEpisodes(e){let t=this._findMolotovEntity();if(!t)return;let i=e.mediaContentId;this._loadingEpisodes={...this._loadingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:i,media_content_type:"search_result"});if(s&&s.children){let r=s.children.filter(n=>n.media_content_id.startsWith("episode:")||n.media_content_id.startsWith("replay:")||n.can_play).map(n=>{let a=L(n.media_content_id);return{mediaContentId:n.media_content_id,title:n.title,thumbnail:n.thumbnail,description:a?.desc||null}});this._resultEpisodes={...this._resultEpisodes,[i]:r},console.log(`[Molotov Panel] Found ${r.length} episodes for "${e.title}"`)}else this._resultEpisodes={...this._resultEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch episodes:",s),this._resultEpisodes={...this._resultEpisodes,[i]:[]}}this._loadingEpisodes={...this._loadingEpisodes,[i]:!1},this.requestUpdate()}async _playEpisode(e,t){let i=this._findMolotovEntity();if(i){this._selectedChannel={name:"",currentProgram:{title:e.title||t,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null;try{let s=this._buildPlayMediaId(e.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play episode failed:",s),this._playerError=s.message||"Erreur de lecture"}}}_syncWithEntity(){let e=this._findMolotovEntity();if(!e||!this.hass?.states?.[e])return;let t=this.hass.states[e];if(t.state==="playing"&&t.attributes.stream_url){let i=t.attributes.stream_url,s=t.attributes.stream_drm,r=t.attributes.stream_selected_track;if(!this._playing||this._currentStreamUrl!==i){this._currentStreamUrl=i,this._streamData={url:i,drm:s,selectedTrack:r,title:t.attributes.media_title||"En direct"},this._playing=!0,this._playerError=null;let n=this._selectedChannel;n?.currentProgram?.start&&n?.currentProgram?.end?(this._isLive=!0,this._programStart=n.currentProgram.start,this._programEnd=n.currentProgram.end):(this._isLive=!0,this._programStart=null,this._programEnd=null),this.updateComplete.then(()=>this._initDashPlayer())}}else if(t.state==="playing"&&t.attributes.cast_target&&!t.attributes.stream_url){let i=t.attributes.cast_target;(!this._castPlaying||this._castTarget!==i)&&(this._castPlaying=!0,this._castTarget=i,this._castTitle=t.attributes.media_title||"En cours de lecture",this._playing=!1,this._cleanupPlayer(),console.log("[Molotov Panel] Cast playback detected:",i)),this._currentTime=t.attributes.media_position||0,this._duration=t.attributes.media_duration||0,this._volume=t.attributes.volume_level??.5,this._muted=t.attributes.is_volume_muted||!1,this._paused=t.state==="paused",this._castTitle=t.attributes.media_title||this._castTitle}else(this._playing||this._castPlaying)&&t.state!=="playing"&&t.state!=="paused"?(this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._currentStreamUrl=null,this._castPlaying=!1,this._castTarget=null,this._castTitle=null):this._castPlaying&&t.state==="paused"&&(this._paused=!0)}async _playChannel(e){let t=this._findMolotovEntity();if(!t){console.error("[Molotov Panel] No entity found");return}this._selectedChannel=e,this._playerError=null,this._isLocalPlayback()&&e.currentProgram?.start&&e.currentProgram?.end&&(this._programStart=e.currentProgram.start,this._programEnd=e.currentProgram.end,this._isLive=!0);try{let i=this._buildPlayMediaId(e.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play failed:",i),this._playerError=i.message||"Erreur de lecture"}}async _initDashPlayer(){if(!this._streamData)return;let e=this.shadowRoot.querySelector("video");if(!e){console.error("[Molotov Panel] Video element not found");return}window.dashjs||await this._loadDashJs(),this._player&&(this._player.reset(),this._player=null),this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null);try{let t=window.dashjs.MediaPlayer().create();this._player=t,t.updateSettings({debug:{logLevel:window.dashjs.Debug.LOG_LEVEL_WARNING},streaming:{buffer:{stableBufferTime:20,bufferTimeAtTopQuality:30,bufferTimeAtTopQualityLongForm:60},delay:{liveDelay:4}}});let i=this._streamData.drm;i&&i.type==="widevine"&&(console.log("[Molotov Panel] Configuring Widevine DRM"),t.setProtectionData({"com.widevine.alpha":{serverURL:i.license_url,httpRequestHeaders:i.headers||{}}})),t.initialize(e,this._streamData.url,!0);let s=this._streamData.selectedTrack,r="fr";s?.track_audio&&(r=s.track_audio),t.setInitialMediaSettingsFor("audio",{lang:r}),s?.track_text&&t.setInitialMediaSettingsFor("text",{lang:s.track_text}),t.on(window.dashjs.MediaPlayer.events.ERROR,n=>{let a=n.error?.message||n.error||"Erreur de lecture";console.error("[Molotov Panel] Player error:",a),this._playerError=a,this.requestUpdate()}),t.on(window.dashjs.MediaPlayer.events.STREAM_INITIALIZED,()=>{console.log("[Molotov Panel] Stream initialized"),this._enforceAudioLanguage(t,s),this._updateTracks(),this._startProgressUpdate()}),t.on(window.dashjs.MediaPlayer.events.PLAYBACK_STARTED,()=>{console.log("[Molotov Panel] Playback started"),this._showPlayOverlay=!1,this._paused=!1,this.requestUpdate()}),t.on(window.dashjs.MediaPlayer.events.PLAYBACK_PAUSED,()=>{this._paused=!0,this.requestUpdate()}),t.on(window.dashjs.MediaPlayer.events.PLAYBACK_PLAYING,()=>{this._paused=!1,this.requestUpdate()}),e.volume=this._volume,e.muted=this._muted,setTimeout(()=>{e.paused&&!e.currentTime&&(console.log("[Molotov Panel] Autoplay blocked"),this._showPlayOverlay=!0,this.requestUpdate())},1500)}catch(t){console.error("[Molotov Panel] Failed to init player:",t),this._playerError=t.message}}_startProgressUpdate(){this._updateInterval&&clearInterval(this._updateInterval),this._updateInterval=setInterval(()=>{this._updateProgress()},1e3)}_updateProgress(){let e=this.shadowRoot?.querySelector("video");!e||!this._player||(this._currentTime=e.currentTime,this._duration=e.duration||0,this._paused=e.paused,this.requestUpdate())}_updateTracks(){if(!this._player)return;let e=this._player.getTracksFor("audio")||[];this._audioTracks=e.map((r,n)=>({index:n,lang:r.lang,label:$e(r.lang)}));let t=this._player.getCurrentTrackFor("audio");t&&(this._selectedAudioIndex=e.findIndex(r=>r.lang===t.lang));let i=this._player.getTracksFor("text")||[];if(this._textTracks=i.map((r,n)=>({index:n,lang:r.lang,label:$e(r.lang)})),!this._player.isTextEnabled())this._selectedTextIndex=-1;else{let r=this._player.getCurrentTrackFor("text");r&&(this._selectedTextIndex=i.findIndex(n=>n.lang===r.lang))}console.log("[Molotov Panel] Audio tracks:",this._audioTracks),console.log("[Molotov Panel] Text tracks:",this._textTracks),this.requestUpdate()}_enforceAudioLanguage(e,t){let i=e.getTracksFor("audio");if(!i||i.length===0)return;let r=e.getCurrentTrackFor("audio")?.lang||"",n="fr";if(t?.track_audio&&(n=t.track_audio),r!==n&&r!=="fra"&&r!=="fre"){let a=i.find(d=>d.lang===n||d.lang==="fra"||d.lang==="fre");!a&&(r==="en"||r==="eng"||r==="qaa")&&(a=i.find(d=>d.lang!=="en"&&d.lang!=="eng"&&d.lang!=="qaa")),a&&(console.log("[Molotov Panel] Switching audio to:",a.lang),e.setCurrentTrack(a))}}_loadDashJs(){return new Promise((e,t)=>{if(window.dashjs){e();return}let i=document.createElement("script");i.src="https://cdn.dashjs.org/v4.7.4/dash.all.min.js",i.crossOrigin="anonymous",i.onload=()=>{console.log("[Molotov Panel] dash.js loaded"),e()},i.onerror=()=>{t(new Error("Failed to load dash.js"))},document.head.appendChild(i)})}_cleanupPlayer(){if(this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._player){try{this._player.reset()}catch{}this._player=null}this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1}_stopPlayback(){let e=this._findMolotovEntity();e&&this.hass&&this.hass.callService("media_player","media_stop",{entity_id:e}),this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._selectedChannel=null,this._currentStreamUrl=null}_togglePlayPause(){let e=this.shadowRoot.querySelector("video");e&&(e.paused?e.play():e.pause())}_handleProgressClick(e){let i=e.currentTarget.getBoundingClientRect(),s=(e.clientX-i.left)/i.width;if(this._isLive&&this._programStart&&this._programEnd){if(this._player?.getDVRSeekOffset?.(0)!==void 0){let n=this._player.duration(),a=s*n;this._player.seek(a)}}else if(this._duration){let r=this.shadowRoot.querySelector("video");r&&(r.currentTime=s*this._duration)}}_handleVolumeChange(e){let t=parseFloat(e.target.value);this._volume=t;let i=this.shadowRoot.querySelector("video");i&&(i.volume=t,i.muted=t===0,this._muted=t===0)}_toggleMute(){let e=this.shadowRoot.querySelector("video");e&&(this._muted=!this._muted,e.muted=this._muted,this.requestUpdate())}_selectAudioTrack(e){if(!this._player||e<0||e>=this._audioTracks.length)return;let t=this._player.getTracksFor("audio");t&&t[e]&&(this._player.setCurrentTrack(t[e]),this._selectedAudioIndex=e),this._showAudioMenu=!1,this.requestUpdate()}_selectTextTrack(e){if(this._player){if(e===-1)this._player.enableText(!1),this._selectedTextIndex=-1;else if(e>=0&&e<this._textTracks.length){let t=this._player.getTracksFor("text");t&&t[e]&&(this._player.enableText(!0),this._player.setCurrentTrack(t[e]),this._selectedTextIndex=e)}this._showTextMenu=!1,this.requestUpdate()}}_toggleAudioMenu(e){e.stopPropagation(),this._showAudioMenu=!this._showAudioMenu,this._showTextMenu=!1,this.requestUpdate()}_toggleTextMenu(e){e.stopPropagation(),this._showTextMenu=!this._showTextMenu,this._showAudioMenu=!1,this.requestUpdate()}_toggleFullscreen(){let e=this.shadowRoot.querySelector(".video-wrapper");e&&(document.fullscreenElement?document.exitFullscreen():e.requestFullscreen().catch(t=>{console.error("[Molotov Panel] Fullscreen error:",t)}))}_onFullscreenChange(){this._isFullscreen=!!document.fullscreenElement,this.requestUpdate()}_handlePlayOverlayClick(){let e=this.shadowRoot.querySelector("video");e&&(e.muted=!1,e.play().catch(t=>console.error("[Molotov Panel] Manual play error:",t)),this._showPlayOverlay=!1,this.requestUpdate())}_formatTime(e){if(!e||!isFinite(e))return"00:00";let t=Math.floor(e/3600),i=Math.floor(e%3600/60),s=Math.floor(e%60);return t>0?`${t}:${i.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`:`${i}:${s.toString().padStart(2,"0")}`}_formatClockTime(e){return e?new Date(e).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):""}_getProgressPercent(){if(this._isLive&&this._programStart&&this._programEnd){let e=Date.now(),t=this._programEnd-this._programStart;if(t<=0)return 100;let i=e-this._programStart;return Math.min(100,Math.max(0,i/t*100))}else if(this._duration>0)return this._currentTime/this._duration*100;return 0}render(){return this._playing&&this._streamData?this._renderPlayer():this._castPlaying?this._renderCastPlayer():this._renderChannelList()}_renderChannelList(){return l`
      <div class="container">
        <div class="header">
          <h1>Molotov TV</h1>
          <div class="header-actions">
            <select class="cast-select" @change=${this._handleTargetChange} .value=${this._selectedTarget}>
              <option value="local">Cet appareil</option>
              ${this._castTargets.map(e=>l`
                  <option value=${e.mediaContentId}>${e.title}</option>
                `)}
            </select>
            <button @click=${this._handleRefresh}>
              <ha-icon icon="mdi:refresh"></ha-icon>
              Actualiser
            </button>
          </div>
        </div>

        <div class="tabs">
          <button class="tab ${this._activeTab==="live"?"active":""}" @click=${()=>this._switchTab("live")}>
            <ha-icon icon="mdi:television-play"></ha-icon>
            Direct
          </button>
          <button class="tab ${this._activeTab==="tonight"?"active":""}" @click=${()=>this._switchTab("tonight")}>
            <ha-icon icon="mdi:weather-night"></ha-icon>
            Ce soir
          </button>
          <button class="tab ${this._activeTab==="recordings"?"active":""}" @click=${()=>this._switchTab("recordings")}>
            <ha-icon icon="mdi:bookmark"></ha-icon>
            Enregistrements
          </button>
        </div>

        <div class="search-bar">
          <input
            type="text"
            class="search-input"
            placeholder="Rechercher un programme..."
            .value=${this._searchQuery}
            @input=${this._handleSearchInput}
            @keydown=${this._handleSearchKeydown}
          />
          <button class="search-btn" @click=${this._performSearch}>
            <ha-icon icon="mdi:magnify"></ha-icon>
          </button>
        </div>

        ${this._showingSearch?this._renderSearchResults():this._activeTab==="live"?this._renderChannels():this._activeTab==="tonight"?this._renderTonight():this._renderRecordings()}
      </div>
    `}_handleRefresh(){this._activeTab==="live"?this._loadChannels():this._activeTab==="tonight"?this._loadTonight():this._loadRecordings()}_renderChannels(){return l`
      <div class="content">
        ${this._loading?l`<div class="loading">Chargement des chaines...</div>`:this._error?l`
              <div class="error">
                <span>${this._error}</span>
                <button @click=${this._loadChannels}>Reessayer</button>
              </div>
            `:l`
              <div class="channel-list">
                ${this._channels.map(e=>this._renderChannelItem(e))}
              </div>
            `}
      </div>
    `}_renderRecordings(){return l`
      <div class="content">
        ${this._loadingRecordings?l`<div class="loading">Chargement des enregistrements...</div>`:this._recordings.length>0?l`
              <div class="channel-list">
                ${this._recordings.map(e=>this._renderRecordingItem(e))}
              </div>
            `:l`<div class="error">Aucun enregistrement trouve</div>`}
      </div>
    `}_renderTonight(){return l`
      <div class="content">
        ${this._loadingTonight?l`<div class="loading">Chargement du programme de ce soir...</div>`:this._tonightChannels.length>0?l`
              <div class="tonight-list">
                ${this._tonightChannels.map(e=>this._renderTonightChannel(e))}
              </div>
            `:l`<div class="error">Aucun programme disponible pour ce soir</div>`}
      </div>
    `}_renderTonightChannel(e){return l`
      <div class="tonight-channel">
        <div class="tonight-channel-header">
          <img
            class="tonight-channel-logo"
            src=${e.thumbnail||""}
            alt=${e.name}
            @error=${t=>t.target.style.display="none"}
          />
          <div class="tonight-channel-name">${e.name}</div>
        </div>
        <div class="tonight-programs">
          ${e.programs.map(t=>this._renderTonightProgram(t,e))}
        </div>
      </div>
    `}_renderTonightProgram(e,t){let i=this._formatClockTime(e.start),s=this._formatClockTime(e.end),r=Date.now(),n=e.start<=r&&e.end>r,a=e.end<=r;return l`
      <div
        class="tonight-program ${n?"live":""} ${a?"past":""}"
        @click=${()=>this._playTonightProgram(e,t)}
      >
        <div class="tonight-program-time">
          ${i} - ${s}
          ${n?l`<span class="live-indicator">EN DIRECT</span>`:""}
        </div>
        <div class="tonight-program-title">${e.title}</div>
      </div>
    `}async _playTonightProgram(e,t){let i=this._findMolotovEntity();if(!i)return;this._selectedChannel={id:t.id,name:t.name,thumbnail:t.thumbnail,mediaContentId:e.mediaContentId,currentProgram:{title:e.title,start:e.start,end:e.end}},this._playerError=null;let s=Date.now();this._isLive=e.start<=s&&e.end>s,this._isLive?(this._programStart=e.start,this._programEnd=e.end):(this._programStart=null,this._programEnd=null);try{let r=this._buildPlayMediaId(e.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:r,media_content_type:"video"})}catch(r){console.error("[Molotov Panel] Play tonight program failed:",r),this._playerError=r.message||"Erreur de lecture"}}_renderRecordingItem(e){let t=e.mediaContentId,i=this._expandedRecordings[t],s=this._recordingEpisodes[t]||[],r=this._loadingRecordingEpisodes[t];return l`
      <div class="search-result-row">
        <div class="search-result-main" @click=${n=>this._toggleRecordingExpand(n,e)}>
          <ha-icon
            class="expand-icon ${i?"expanded":""}"
            icon="mdi:chevron-right"
          ></ha-icon>
          ${e.thumbnail?l`<img
                class="recording-thumb"
                src=${e.thumbnail}
                @error=${n=>n.target.style.display="none"}
              />`:l`<div class="recording-thumb"></div>`}
          <div class="recording-info">
            <div class="recording-title">${e.title}</div>
            ${e.description?l`<div class="recording-subtitle">${e.description}</div>`:""}
          </div>
        </div>
        ${i?l`
              <div class="episodes-list">
                ${r?l`<div class="episodes-loading">Chargement des episodes...</div>`:s.length>0?s.map(n=>l`
                        <div class="episode-item" @click=${()=>this._playRecordingEpisode(n,e.title)}>
                          ${n.thumbnail?l`<img class="episode-thumb" src=${n.thumbnail} @error=${a=>a.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${n.title}</div>
                            ${n.description?l`<div class="episode-desc">${n.description}</div>`:""}
                          </div>
                        </div>
                      `):l`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderSearchResults(){return l`
      <div class="search-results-header">
        <span class="search-results-title">
          ${this._searching?"Recherche en cours...":`${this._searchResults.length} resultat(s) pour "${this._searchQuery}"`}
        </span>
        <button class="secondary" @click=${this._clearSearch}>
          <ha-icon icon="mdi:close"></ha-icon>
          Fermer
        </button>
      </div>
      <div class="content">
        ${this._searching?l`<div class="loading">Recherche...</div>`:this._searchResults.length>0?l`
              <div class="channel-list">
                ${this._searchResults.map(e=>this._renderSearchResultItem(e))}
              </div>
            `:l`<div class="error">Aucun resultat trouve</div>`}
      </div>
    `}_renderSearchResultItem(e){let t=e.mediaContentId,i=this._expandedResults[t],s=this._resultEpisodes[t]||[],r=this._loadingEpisodes[t];return l`
      <div class="search-result-row">
        <div class="search-result-main" @click=${n=>this._toggleResultExpand(n,e)}>
          <ha-icon
            class="expand-icon ${i?"expanded":""}"
            icon="mdi:chevron-right"
          ></ha-icon>
          ${e.thumbnail?l`<img class="search-result-thumb" src=${e.thumbnail} @error=${n=>n.target.style.display="none"} />`:""}
          <div class="search-result-info">
            <div class="search-result-title">${e.title}</div>
            ${e.description?l`<div class="search-result-subtitle">${e.description}</div>`:""}
          </div>
        </div>
        ${i?l`
              <div class="episodes-list">
                ${r?l`<div class="episodes-loading">Chargement des episodes...</div>`:s.length>0?s.map(n=>l`
                        <div class="episode-item" @click=${()=>this._playEpisode(n,e.title)}>
                          ${n.thumbnail?l`<img class="episode-thumb" src=${n.thumbnail} @error=${a=>a.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${n.title}</div>
                            ${n.description?l`<div class="episode-desc">${n.description}</div>`:""}
                          </div>
                        </div>
                      `):l`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderChannelItem(e){let t=e.currentProgram,i=t?.start?this._formatClockTime(t.start):"",s=t?.end?this._formatClockTime(t.end):"",r=i&&s?`${i} - ${s}`:"",n=this._expandedChannels[e.id],a=this._channelPrograms[e.id]||[],d=this._loadingPrograms[e.id];return l`
      <div class="channel-row">
        <div class="channel-main">
          <img
            class="channel-logo"
            src=${e.thumbnail||""}
            alt=${e.name}
            @error=${c=>c.target.style.display="none"}
            @click=${()=>this._playChannel(e)}
          />
          <div class="channel-info" @click=${()=>this._playChannel(e)}>
            <div class="channel-name">${e.name}</div>
            <div class="program-info">
              <div class="program-now">
                ${t?.title||"Direct"}
                ${r?l`<span class="program-time">(${r})</span>`:""}
              </div>
              ${t?.description?l`<div class="program-next">${t.description}</div>`:""}
            </div>
          </div>
          <div class="channel-actions">
            <button
              class="replay-btn ${n?"expanded":""}"
              @click=${c=>this._toggleChannelExpand(c,e)}
            >
              <ha-icon icon="mdi:history"></ha-icon>
              Replay
            </button>
          </div>
        </div>
        ${n?l`
              <div class="replay-list">
                ${d?l`<div class="replay-loading">Chargement...</div>`:a.length>0?a.map(c=>l`
                        <div class="replay-item" @click=${()=>this._playReplay(c)}>
                          ${c.thumbnail?l`<img class="replay-thumb" src=${c.thumbnail} @error=${p=>p.target.style.display="none"} />`:""}
                          <div class="replay-item-info">
                            <span class="replay-item-title">${c.title}</span>
                            ${c.description?l`<span class="replay-item-desc">${c.description}</span>`:""}
                          </div>
                        </div>
                      `):l`<div class="replay-empty">Aucun replay disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderPlayer(){let e=this._getProgressPercent(),t=this._selectedAudioIndex>=0&&this._audioTracks[this._selectedAudioIndex]?this._audioTracks[this._selectedAudioIndex].label:"Audio",i=this._selectedTextIndex>=0&&this._textTracks[this._selectedTextIndex]?this._textTracks[this._selectedTextIndex].label:"Off";return l`
      <div class="player-view">
        <div class="player-header">
          <div class="player-header-left">
            <button class="secondary" @click=${this._stopPlayback}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
              Retour
            </button>
          </div>
          <div class="header-actions">
            <button class="danger" @click=${this._stopPlayback}>
              <ha-icon icon="mdi:stop"></ha-icon>
              Arreter
            </button>
          </div>
        </div>

        <div class="player-container">
          <div class="video-wrapper">
            <video playsinline></video>

            ${this._playerError?l`<div class="player-error">${this._playerError}</div>`:""}

            ${this._showPlayOverlay?l`
                  <div class="play-overlay" @click=${this._handlePlayOverlayClick}>
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                `:""}

            <!-- Custom controls -->
            <div class="custom-controls ${this._paused?"":"autohide"}">
              <div class="progress-container">
                ${this._isLive&&this._programStart?l`<span>${this._formatClockTime(this._programStart)}</span>`:l`<span>${this._formatTime(this._currentTime)}</span>`}
                <div class="progress-bar" @click=${this._handleProgressClick}>
                  <div class="progress-filled" style="width: ${e}%"></div>
                </div>
                ${this._isLive&&this._programEnd?l`<span>${this._formatClockTime(this._programEnd)}</span>`:l`<span>${this._formatTime(this._duration)}</span>`}
                ${this._isLive?l`<span class="live-badge">LIVE</span>`:""}
              </div>

              <div class="controls-row">
                <div class="controls-left">
                  <button class="icon-btn" @click=${this._togglePlayPause}>
                    <ha-icon icon=${this._paused?"mdi:play":"mdi:pause"}></ha-icon>
                  </button>

                  <div class="volume-container">
                    <button class="icon-btn" @click=${this._toggleMute}>
                      <ha-icon
                        icon=${this._muted||this._volume===0?"mdi:volume-off":this._volume<.5?"mdi:volume-medium":"mdi:volume-high"}
                      ></ha-icon>
                    </button>
                    <input
                      type="range"
                      class="volume-slider"
                      min="0"
                      max="1"
                      step="0.05"
                      .value=${this._muted?0:this._volume}
                      @input=${this._handleVolumeChange}
                    />
                  </div>
                </div>

                <div class="controls-right">
                  ${this._audioTracks.length>1?l`
                        <div class="track-menu-container">
                          <button class="icon-btn" @click=${this._toggleAudioMenu}>
                            <ha-icon icon="mdi:volume-source"></ha-icon>
                            <span style="font-size: 11px; margin-left: 2px;">${t}</span>
                          </button>
                          ${this._showAudioMenu?l`
                                <div class="track-menu">
                                  ${this._audioTracks.map(s=>l`
                                      <div
                                        class="track-menu-item ${this._selectedAudioIndex===s.index?"selected":""}"
                                        @click=${()=>this._selectAudioTrack(s.index)}
                                      >
                                        ${s.label}
                                      </div>
                                    `)}
                                </div>
                              `:""}
                        </div>
                      `:""}

                  ${this._textTracks.length>0?l`
                        <div class="track-menu-container">
                          <button class="icon-btn" @click=${this._toggleTextMenu}>
                            <ha-icon icon="mdi:subtitles"></ha-icon>
                            <span style="font-size: 11px; margin-left: 2px;">${i}</span>
                          </button>
                          ${this._showTextMenu?l`
                                <div class="track-menu">
                                  <div
                                    class="track-menu-item ${this._selectedTextIndex===-1?"selected":""}"
                                    @click=${()=>this._selectTextTrack(-1)}
                                  >
                                    Off
                                  </div>
                                  ${this._textTracks.map(s=>l`
                                      <div
                                        class="track-menu-item ${this._selectedTextIndex===s.index?"selected":""}"
                                        @click=${()=>this._selectTextTrack(s.index)}
                                      >
                                        ${s.label}
                                      </div>
                                    `)}
                                </div>
                              `:""}
                        </div>
                      `:""}

                  <button class="icon-btn" @click=${this._toggleFullscreen}>
                    <ha-icon icon=${this._isFullscreen?"mdi:fullscreen-exit":"mdi:fullscreen"}></ha-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="player-info">
          <div class="now-playing-title">
            ${this._selectedChannel?.name||"En direct"}
          </div>
          <div class="now-playing-program">
            ${this._streamData?.title||this._selectedChannel?.currentProgram?.title||""}
          </div>
        </div>
      </div>
    `}_renderCastPlayer(){let e=this._duration>0?this._currentTime/this._duration*100:0;return l`
      <div class="player-view">
        <div class="player-header">
          <div class="player-header-left">
            <button class="secondary" @click=${this._stopCastPlayback}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
              Retour
            </button>
          </div>
          <div class="header-actions">
            <ha-icon icon="mdi:cast-connected" style="color: var(--primary-color); margin-right: 8px;"></ha-icon>
            <button class="danger" @click=${this._stopCastPlayback}>
              <ha-icon icon="mdi:stop"></ha-icon>
              Arreter
            </button>
          </div>
        </div>

        <div class="player-container">
          <div class="video-wrapper cast-placeholder">
            <div class="cast-info">
              <ha-icon icon="mdi:cast-connected" style="font-size: 64px; margin-bottom: 16px;"></ha-icon>
              <div class="cast-title">${this._castTitle||"En cours de lecture"}</div>
              <div class="cast-target">Sur Chromecast</div>
            </div>

            <!-- Cast controls -->
            <div class="custom-controls">
              <div class="progress-container">
                <span>${this._formatTime(this._currentTime)}</span>
                <div class="progress-bar" @click=${this._handleCastSeek}>
                  <div class="progress-filled" style="width: ${e}%"></div>
                </div>
                <span>${this._formatTime(this._duration)}</span>
              </div>

              <div class="controls-row">
                <div class="controls-left">
                  <button class="icon-btn" @click=${this._castSkipBack}>
                    <ha-icon icon="mdi:rewind-30"></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._toggleCastPlayPause}>
                    <ha-icon icon=${this._paused?"mdi:play":"mdi:pause"}></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._castSkipForward}>
                    <ha-icon icon="mdi:fast-forward-30"></ha-icon>
                  </button>

                  <div class="volume-container">
                    <button class="icon-btn" @click=${this._toggleCastMute}>
                      <ha-icon
                        icon=${this._muted||this._volume===0?"mdi:volume-off":this._volume<.5?"mdi:volume-medium":"mdi:volume-high"}
                      ></ha-icon>
                    </button>
                    <input
                      type="range"
                      class="volume-slider"
                      min="0"
                      max="1"
                      step="0.05"
                      .value=${this._muted?0:this._volume}
                      @input=${this._handleCastVolumeChange}
                    />
                  </div>
                </div>

                <div class="controls-right">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="player-info">
          <div class="now-playing-title">
            <ha-icon icon="mdi:cast" style="margin-right: 8px;"></ha-icon>
            Chromecast
          </div>
          <div class="now-playing-program">
            ${this._castTitle||""}
          </div>
        </div>
      </div>
    `}async _stopCastPlayback(){let e=this._findMolotovEntity();if(e){try{await this.hass.callService("media_player","media_stop",{entity_id:e})}catch(t){console.error("[Molotov Panel] Stop cast failed:",t)}this._castPlaying=!1,this._castTarget=null,this._castTitle=null}}async _toggleCastPlayPause(){let e=this._findMolotovEntity();if(e)try{this._paused?await this.hass.callService("media_player","media_play",{entity_id:e}):await this.hass.callService("media_player","media_pause",{entity_id:e})}catch(t){console.error("[Molotov Panel] Play/pause cast failed:",t)}}async _castSkipForward(){let e=this._findMolotovEntity();if(e)try{await this.hass.callService("media_player","media_next_track",{entity_id:e})}catch(t){console.error("[Molotov Panel] Skip forward failed:",t)}}async _castSkipBack(){let e=this._findMolotovEntity();if(e)try{await this.hass.callService("media_player","media_previous_track",{entity_id:e})}catch(t){console.error("[Molotov Panel] Skip back failed:",t)}}async _handleCastSeek(e){let t=this._findMolotovEntity();if(!t||!this._duration)return;let s=e.currentTarget.getBoundingClientRect(),n=(e.clientX-s.left)/s.width*this._duration;try{await this.hass.callService("media_player","media_seek",{entity_id:t,seek_position:n}),this._currentTime=n}catch(a){console.error("[Molotov Panel] Seek failed:",a)}}async _handleCastVolumeChange(e){let t=this._findMolotovEntity();if(!t)return;let i=parseFloat(e.target.value);this._volume=i;try{await this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:i})}catch(s){console.error("[Molotov Panel] Volume change failed:",s)}}async _toggleCastMute(){let e=this._findMolotovEntity();if(e)try{await this.hass.callService("media_player","volume_mute",{entity_id:e,is_volume_muted:!this._muted}),this._muted=!this._muted}catch(t){console.error("[Molotov Panel] Mute toggle failed:",t)}}};customElements.define("molotov-panel",ue);console.log(`[Molotov Panel] Registered - v${Ie}`);
/*! Bundled license information:

lit-html/lib/dom.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/template.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/modify-template.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/directive.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/part.js:
  (**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/template-instance.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/template-result.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/parts.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/template-factory.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/render.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/default-template-processor.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-html/lib/shady-render.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-element/lib/updating-element.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-element/lib/decorators.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)

lit-element/lib/css-tag.js:
  (**
  @license
  Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at
  http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
  http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
  found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
  part of the polymer project is also subject to an additional IP rights grant
  found at http://polymer.github.io/PATENTS.txt
  *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   *)
*/
