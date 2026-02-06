var X=typeof window<"u"&&window.customElements!=null&&window.customElements.polyfillWrapFlushCallback!==void 0;var S=(a,e,t=null)=>{for(;e!==t;){let i=e.nextSibling;a.removeChild(e),e=i}};var y=`{{lit-${String(Math.random()).slice(2)}}}`,Z=`<!--${y}-->`,_e=new RegExp(`${y}|${Z}`),A="$lit$",T=class{constructor(e,t){this.parts=[],this.element=t;let i=[],s=[],r=document.createTreeWalker(t.content,133,null,!1),n=0,o=-1,c=0,{strings:h,values:{length:p}}=e;for(;c<p;){let d=r.nextNode();if(d===null){r.currentNode=s.pop();continue}if(o++,d.nodeType===1){if(d.hasAttributes()){let _=d.attributes,{length:u}=_,g=0;for(let f=0;f<u;f++)ge(_[f].name,A)&&g++;for(;g-- >0;){let f=h[c],I=V.exec(f)[2],R=I.toLowerCase()+A,P=d.getAttribute(R);d.removeAttribute(R);let b=P.split(_e);this.parts.push({type:"attribute",index:o,name:I,strings:b}),c+=b.length-1}}d.tagName==="TEMPLATE"&&(s.push(d),r.currentNode=d.content)}else if(d.nodeType===3){let _=d.data;if(_.indexOf(y)>=0){let u=d.parentNode,g=_.split(_e),f=g.length-1;for(let I=0;I<f;I++){let R,P=g[I];if(P==="")R=v();else{let b=V.exec(P);b!==null&&ge(b[2],A)&&(P=P.slice(0,b.index)+b[1]+b[2].slice(0,-A.length)+b[3]),R=document.createTextNode(P)}u.insertBefore(R,d),this.parts.push({type:"node",index:++o})}g[f]===""?(u.insertBefore(v(),d),i.push(d)):d.data=g[f],c+=f}}else if(d.nodeType===8)if(d.data===y){let _=d.parentNode;(d.previousSibling===null||o===n)&&(o++,_.insertBefore(v(),d)),n=o,this.parts.push({type:"node",index:o}),d.nextSibling===null?d.data="":(i.push(d),o--),c++}else{let _=-1;for(;(_=d.data.indexOf(y,_+1))!==-1;)this.parts.push({type:"node",index:-1}),c++}}for(let d of i)d.parentNode.removeChild(d)}},ge=(a,e)=>{let t=a.length-e.length;return t>=0&&a.slice(t)===e},U=a=>a.index!==-1,v=()=>document.createComment(""),V=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;var ee=133;function te(a,e){let{element:{content:t},parts:i}=a,s=document.createTreeWalker(t,ee,null,!1),r=F(i),n=i[r],o=-1,c=0,h=[],p=null;for(;s.nextNode();){o++;let d=s.currentNode;for(d.previousSibling===p&&(p=null),e.has(d)&&(h.push(d),p===null&&(p=d)),p!==null&&c++;n!==void 0&&n.index===o;)n.index=p!==null?-1:n.index-c,r=F(i,r),n=i[r]}h.forEach(d=>d.parentNode.removeChild(d))}var Ie=a=>{let e=a.nodeType===11?0:1,t=document.createTreeWalker(a,ee,null,!1);for(;t.nextNode();)e++;return e},F=(a,e=-1)=>{for(let t=e+1;t<a.length;t++){let i=a[t];if(U(i))return t}return-1};function me(a,e,t=null){let{element:{content:i},parts:s}=a;if(t==null){i.appendChild(e);return}let r=document.createTreeWalker(i,ee,null,!1),n=F(s),o=0,c=-1;for(;r.nextNode();)for(c++,r.currentNode===t&&(o=Ie(e),t.parentNode.insertBefore(e,t));n!==-1&&s[n].index===c;){if(o>0){for(;n!==-1;)s[n].index+=o,n=F(s,n);return}n=F(s,n)}}var Re=new WeakMap;var C=a=>typeof a=="function"&&Re.has(a);var m={},D={};var w=class{constructor(e,t,i){this.__parts=[],this.template=e,this.processor=t,this.options=i}update(e){let t=0;for(let i of this.__parts)i!==void 0&&i.setValue(e[t]),t++;for(let i of this.__parts)i!==void 0&&i.commit()}_clone(){let e=X?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),t=[],i=this.template.parts,s=document.createTreeWalker(e,133,null,!1),r=0,n=0,o,c=s.nextNode();for(;r<i.length;){if(o=i[r],!U(o)){this.__parts.push(void 0),r++;continue}for(;n<o.index;)n++,c.nodeName==="TEMPLATE"&&(t.push(c),s.currentNode=c.content),(c=s.nextNode())===null&&(s.currentNode=t.pop(),c=s.nextNode());if(o.type==="node"){let h=this.processor.handleTextExpression(this.options);h.insertAfterNode(c.previousSibling),this.__parts.push(h)}else this.__parts.push(...this.processor.handleAttributeExpressions(c,o.name,o.strings,this.options));r++}return X&&(document.adoptNode(e),customElements.upgrade(e)),e}};var fe=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:a=>a}),Ne=` ${y} `,x=class{constructor(e,t,i,s){this.strings=e,this.values=t,this.type=i,this.processor=s}getHTML(){let e=this.strings.length-1,t="",i=!1;for(let s=0;s<e;s++){let r=this.strings[s],n=r.lastIndexOf("<!--");i=(n>-1||i)&&r.indexOf("-->",n+1)===-1;let o=V.exec(r);o===null?t+=r+(i?Ne:Z):t+=r.substr(0,o.index)+o[1]+o[2]+A+o[3]+y}return t+=this.strings[e],t}getTemplateElement(){let e=document.createElement("template"),t=this.getHTML();return fe!==void 0&&(t=fe.createHTML(t)),e.innerHTML=t,e}};var Q=a=>a===null||!(typeof a=="object"||typeof a=="function"),W=a=>Array.isArray(a)||!!(a&&a[Symbol.iterator]),N=class{constructor(e,t,i){this.dirty=!0,this.element=e,this.name=t,this.strings=i,this.parts=[];for(let s=0;s<i.length-1;s++)this.parts[s]=this._createPart()}_createPart(){return new q(this)}_getValue(){let e=this.strings,t=e.length-1,i=this.parts;if(t===1&&e[0]===""&&e[1]===""){let r=i[0].value;if(typeof r=="symbol")return String(r);if(typeof r=="string"||!W(r))return r}let s="";for(let r=0;r<t;r++){s+=e[r];let n=i[r];if(n!==void 0){let o=n.value;if(Q(o)||!W(o))s+=typeof o=="string"?o:String(o);else for(let c of o)s+=typeof c=="string"?c:String(c)}}return s+=e[t],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}},q=class{constructor(e){this.value=void 0,this.committer=e}setValue(e){e!==m&&(!Q(e)||e!==this.value)&&(this.value=e,C(e)||(this.committer.dirty=!0))}commit(){for(;C(this.value);){let e=this.value;this.value=m,e(this)}this.value!==m&&this.committer.commit()}},E=class a{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(v()),this.endNode=e.appendChild(v())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=v()),e.__insert(this.endNode=v())}insertAfterPart(e){e.__insert(this.startNode=v()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){if(this.startNode.parentNode===null)return;for(;C(this.__pendingValue);){let t=this.__pendingValue;this.__pendingValue=m,t(this)}let e=this.__pendingValue;e!==m&&(Q(e)?e!==this.value&&this.__commitText(e):e instanceof x?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):W(e)?this.__commitIterable(e):e===D?(this.value=D,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){let t=this.startNode.nextSibling;e=e??"";let i=typeof e=="string"?e:String(e);t===this.endNode.previousSibling&&t.nodeType===3?t.data=i:this.__commitNode(document.createTextNode(i)),this.value=e}__commitTemplateResult(e){let t=this.options.templateFactory(e);if(this.value instanceof w&&this.value.template===t)this.value.update(e.values);else{let i=new w(t,e.processor,this.options),s=i._clone();i.update(e.values),this.__commitNode(s),this.value=i}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());let t=this.value,i=0,s;for(let r of e)s=t[i],s===void 0&&(s=new a(this.options),t.push(s),i===0?s.appendIntoPart(this):s.insertAfterPart(t[i-1])),s.setValue(r),s.commit(),i++;i<t.length&&(t.length=i,this.clear(s&&s.endNode))}clear(e=this.startNode){S(this.startNode.parentNode,e.nextSibling,this.endNode)}},j=class{constructor(e,t,i){if(this.value=void 0,this.__pendingValue=void 0,i.length!==2||i[0]!==""||i[1]!=="")throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=i}setValue(e){this.__pendingValue=e}commit(){for(;C(this.__pendingValue);){let t=this.__pendingValue;this.__pendingValue=m,t(this)}if(this.__pendingValue===m)return;let e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=m}},z=class extends N{constructor(e,t,i){super(e,t,i),this.single=i.length===2&&i[0]===""&&i[1]===""}_createPart(){return new H(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}},H=class extends q{},ye=!1;(()=>{try{let a={get capture(){return ye=!0,!1}};window.addEventListener("test",a,a),window.removeEventListener("test",a,a)}catch{}})();var O=class{constructor(e,t,i){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=i,this.__boundHandleEvent=s=>this.handleEvent(s)}setValue(e){this.__pendingValue=e}commit(){for(;C(this.__pendingValue);){let r=this.__pendingValue;this.__pendingValue=m,r(this)}if(this.__pendingValue===m)return;let e=this.__pendingValue,t=this.value,i=e==null||t!=null&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),s=e!=null&&(t==null||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=Le(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=m}handleEvent(e){typeof this.value=="function"?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}},Le=a=>a&&(ye?{capture:a.capture,passive:a.passive,once:a.once}:a.capture);function ie(a){let e=$.get(a.type);e===void 0&&(e={stringsArray:new WeakMap,keyString:new Map},$.set(a.type,e));let t=e.stringsArray.get(a.strings);if(t!==void 0)return t;let i=a.strings.join(y);return t=e.keyString.get(i),t===void 0&&(t=new T(a,a.getTemplateElement()),e.keyString.set(i,t)),e.stringsArray.set(a.strings,t),t}var $=new Map;var k=new WeakMap,se=(a,e,t)=>{let i=k.get(e);i===void 0&&(S(e,e.firstChild),k.set(e,i=new E(Object.assign({templateFactory:ie},t))),i.appendInto(e)),i.setValue(a),i.commit()};var G=class{handleAttributeExpressions(e,t,i,s){let r=t[0];return r==="."?new z(e,t.slice(1),i).parts:r==="@"?[new O(e,t.slice(1),s.eventContext)]:r==="?"?[new j(e,t.slice(1),i)]:new N(e,t,i).parts}handleTextExpression(e){return new E(e)}},re=new G;typeof window<"u"&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var l=(a,...e)=>new x(a,e,"html",re);var be=(a,e)=>`${a}--${e}`,J=!0;typeof window.ShadyCSS>"u"?J=!1:typeof window.ShadyCSS.prepareTemplateDom>"u"&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),J=!1);var Fe=a=>e=>{let t=be(e.type,a),i=$.get(t);i===void 0&&(i={stringsArray:new WeakMap,keyString:new Map},$.set(t,i));let s=i.stringsArray.get(e.strings);if(s!==void 0)return s;let r=e.strings.join(y);if(s=i.keyString.get(r),s===void 0){let n=e.getTemplateElement();J&&window.ShadyCSS.prepareTemplateDom(n,a),s=new T(e,n),i.keyString.set(r,s)}return i.stringsArray.set(e.strings,s),s},qe=["html","svg"],je=a=>{qe.forEach(e=>{let t=$.get(be(e,a));t!==void 0&&t.keyString.forEach(i=>{let{element:{content:s}}=i,r=new Set;Array.from(s.querySelectorAll("style")).forEach(n=>{r.add(n)}),te(i,r)})})},xe=new Set,ze=(a,e,t)=>{xe.add(a);let i=t?t.element:document.createElement("template"),s=e.querySelectorAll("style"),{length:r}=s;if(r===0){window.ShadyCSS.prepareTemplateStyles(i,a);return}let n=document.createElement("style");for(let h=0;h<r;h++){let p=s[h];p.parentNode.removeChild(p),n.textContent+=p.textContent}je(a);let o=i.content;t?me(t,n,o.firstChild):o.insertBefore(n,o.firstChild),window.ShadyCSS.prepareTemplateStyles(i,a);let c=o.querySelector("style");if(window.ShadyCSS.nativeShadow&&c!==null)e.insertBefore(c.cloneNode(!0),e.firstChild);else if(t){o.insertBefore(n,o.firstChild);let h=new Set;h.add(n),te(t,h)}},we=(a,e,t)=>{if(!t||typeof t!="object"||!t.scopeName)throw new Error("The `scopeName` option is required.");let i=t.scopeName,s=k.has(e),r=J&&e.nodeType===11&&!!e.host,n=r&&!xe.has(i),o=n?document.createDocumentFragment():e;if(se(a,o,Object.assign({templateFactory:Fe(i)},t)),n){let c=k.get(o);k.delete(o);let h=c.value instanceof w?c.value.template:void 0;ze(i,o,h),S(e,e.firstChild),e.appendChild(o),k.set(e,c)}!s&&r&&window.ShadyCSS.styleElement(e.host)};var ke;window.JSCompiler_renameProperty=(a,e)=>a;var de={toAttribute(a,e){switch(e){case Boolean:return a?"":null;case Object:case Array:return a==null?a:JSON.stringify(a)}return a},fromAttribute(a,e){switch(e){case Boolean:return a!==null;case Number:return a===null?null:Number(a);case Object:case Array:return JSON.parse(a)}return a}},Pe=(a,e)=>e!==a&&(e===e||a===a),ne={attribute:!0,type:String,converter:de,reflect:!1,hasChanged:Pe},ae=1,oe=4,le=8,ce=16,he="finalized",L=class extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();let e=[];return this._classProperties.forEach((t,i)=>{let s=this._attributeNameForProperty(i,t);s!==void 0&&(this._attributeToPropertyMap.set(s,i),e.push(s))}),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;let e=Object.getPrototypeOf(this)._classProperties;e!==void 0&&e.forEach((t,i)=>this._classProperties.set(i,t))}}static createProperty(e,t=ne){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;let i=typeof e=="symbol"?Symbol():`__${e}`,s=this.getPropertyDescriptor(e,i,t);s!==void 0&&Object.defineProperty(this.prototype,e,s)}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(s){let r=this[e];this[t]=s,this.requestUpdateInternal(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this._classProperties&&this._classProperties.get(e)||ne}static finalize(){let e=Object.getPrototypeOf(this);if(e.hasOwnProperty(he)||e.finalize(),this[he]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){let t=this.properties,i=[...Object.getOwnPropertyNames(t),...typeof Object.getOwnPropertySymbols=="function"?Object.getOwnPropertySymbols(t):[]];for(let s of i)this.createProperty(s,t[s])}}static _attributeNameForProperty(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}static _valueHasChanged(e,t,i=Pe){return i(e,t)}static _propertyValueFromAttribute(e,t){let i=t.type,s=t.converter||de,r=typeof s=="function"?s:s.fromAttribute;return r?r(e,i):e}static _propertyValueToAttribute(e,t){if(t.reflect===void 0)return;let i=t.type,s=t.converter;return(s&&s.toAttribute||de.toAttribute)(e,i)}initialize(){this._updateState=0,this._updatePromise=new Promise(e=>this._enableUpdatingResolver=e),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach((e,t)=>{if(this.hasOwnProperty(t)){let i=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,i)}})}_applyInstanceProperties(){this._instanceProperties.forEach((e,t)=>this[t]=e),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){this._enableUpdatingResolver!==void 0&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(e,t,i){t!==i&&this._attributeToProperty(e,i)}_propertyToAttribute(e,t,i=ne){let s=this.constructor,r=s._attributeNameForProperty(e,i);if(r!==void 0){let n=s._propertyValueToAttribute(t,i);if(n===void 0)return;this._updateState=this._updateState|le,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._updateState=this._updateState&~le}}_attributeToProperty(e,t){if(this._updateState&le)return;let i=this.constructor,s=i._attributeToPropertyMap.get(e);if(s!==void 0){let r=i.getPropertyOptions(s);this._updateState=this._updateState|ce,this[s]=i._propertyValueFromAttribute(t,r),this._updateState=this._updateState&~ce}}requestUpdateInternal(e,t,i){let s=!0;if(e!==void 0){let r=this.constructor;i=i||r.getPropertyOptions(e),r._valueHasChanged(this[e],t,i.hasChanged)?(this._changedProperties.has(e)||this._changedProperties.set(e,t),i.reflect===!0&&!(this._updateState&ce)&&(this._reflectingProperties===void 0&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,i))):s=!1}!this._hasRequestedUpdate&&s&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(e,t){return this.requestUpdateInternal(e,t),this.updateComplete}async _enqueueUpdate(){this._updateState=this._updateState|oe;try{await this._updatePromise}catch{}let e=this.performUpdate();return e!=null&&await e,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return this._updateState&oe}get hasUpdated(){return this._updateState&ae}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let e=!1,t=this._changedProperties;try{e=this.shouldUpdate(t),e?this.update(t):this._markUpdated()}catch(i){throw e=!1,this._markUpdated(),i}e&&(this._updateState&ae||(this._updateState=this._updateState|ae,this.firstUpdated(t)),this.updated(t))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~oe}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){this._reflectingProperties!==void 0&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((t,i)=>this._propertyToAttribute(i,this[i],t)),this._reflectingProperties=void 0),this._markUpdated()}updated(e){}firstUpdated(e){}};ke=he;L[ke]=!0;var Se=Element.prototype,zt=Se.msMatchesSelector||Se.webkitMatchesSelector;var K=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pe=Symbol(),B=class{constructor(e,t){if(t!==pe)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return this._styleSheet===void 0&&(K?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}},Te=a=>new B(String(a),pe),Oe=a=>{if(a instanceof B)return a.cssText;if(typeof a=="number")return a;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${a}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`)},Ce=(a,...e)=>{let t=e.reduce((i,s,r)=>i+Oe(s)+a[r+1],a[0]);return new B(t,pe)};(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");var Ee={},M=class extends L{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;let e=this.getStyles();if(Array.isArray(e)){let t=(r,n)=>r.reduceRight((o,c)=>Array.isArray(c)?t(c,o):(o.add(c),o),n),i=t(e,new Set),s=[];i.forEach(r=>s.unshift(r)),this._styles=s}else this._styles=e===void 0?[]:[e];this._styles=this._styles.map(t=>{if(t instanceof CSSStyleSheet&&!K){let i=Array.prototype.slice.call(t.cssRules).reduce((s,r)=>s+r.cssText,"");return Te(i)}return t})}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){let e=this.constructor._styles;e.length!==0&&(window.ShadyCSS!==void 0&&!window.ShadyCSS.nativeShadow?window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(t=>t.cssText),this.localName):K?this.renderRoot.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):this._needsShimAdoptedStyleSheets=!0)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&window.ShadyCSS!==void 0&&window.ShadyCSS.styleElement(this)}update(e){let t=this.render();super.update(e),t!==Ee&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(i=>{let s=document.createElement("style");s.textContent=i.cssText,this.renderRoot.appendChild(s)}))}render(){return Ee}};M.finalized=!0;M.render=we;M.shadowRootOptions={mode:"open"};var Me="0.1.21";function Be(){let a=navigator.userAgent||"",e=/Android|iPhone|iPad|iPod|Mobile/i.test(a),t=/wv|WebView/i.test(a)||window.navigator.standalone===!0;return e||t}var Ve={fr:"Francais",fra:"Francais",fre:"Francais",en:"English",eng:"English",de:"Deutsch",deu:"Deutsch",ger:"Deutsch",es:"Espanol",spa:"Espanol",it:"Italiano",ita:"Italiano",pt:"Portugues",por:"Portugues",qaa:"Original",und:"Indefini",mul:"Multiple"};function $e(a){if(!a)return"Inconnu";let e=a.toLowerCase();return Ve[e]||a.toUpperCase()}function Y(a){let e=a.split(":");if(e.length<2)return null;let t=e.slice(1).join(":");try{let i=t,s=t.length%4;s&&(i+="=".repeat(4-s));let r=atob(i.replace(/-/g,"+").replace(/_/g,"/"));return JSON.parse(r)}catch{return null}}var ue=class extends M{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},panel:{type:Object},_channels:{type:Array},_loading:{type:Boolean},_error:{type:String},_playing:{type:Boolean},_selectedChannel:{type:Object},_streamData:{type:Object},_isFullscreen:{type:Boolean},_playerError:{type:String},_playerLoading:{type:Boolean},_currentTime:{type:Number},_duration:{type:Number},_volume:{type:Number},_muted:{type:Boolean},_paused:{type:Boolean},_audioTracks:{type:Array},_textTracks:{type:Array},_selectedAudioIndex:{type:Number},_selectedTextIndex:{type:Number},_isLive:{type:Boolean},_programStart:{type:Number},_programEnd:{type:Number},_showAudioMenu:{type:Boolean},_showTextMenu:{type:Boolean},_expandedChannels:{type:Object},_channelPrograms:{type:Object},_loadingPrograms:{type:Object},_searchQuery:{type:String},_searchResults:{type:Array},_searching:{type:Boolean},_showingSearch:{type:Boolean},_expandedResults:{type:Object},_resultEpisodes:{type:Object},_loadingEpisodes:{type:Object},_castTargets:{type:Array},_selectedTarget:{type:String},_activeTab:{type:String},_recordings:{type:Array},_loadingRecordings:{type:Boolean},_expandedRecordings:{type:Object},_recordingEpisodes:{type:Object},_loadingRecordingEpisodes:{type:Object},_castPlaying:{type:Boolean},_castTarget:{type:String},_castTitle:{type:String},_activeCasts:{type:Object},_focusedCastHost:{type:String},_localPlaybackInitiated:{type:Boolean},_localMinimized:{type:Boolean},_castMinimized:{type:Boolean},_castLoading:{type:Boolean},_tonightChannels:{type:Array},_loadingTonight:{type:Boolean}}}static get styles(){return Ce`
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
        min-width: 100px;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cast-select:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      /* Tabs */
      .tabs {
        display: flex;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        background: var(--card-background-color);
        border-bottom: 1px solid var(--divider-color);
      }

      .tabs::-webkit-scrollbar {
        display: none;
      }

      .tab {
        flex: 0 0 auto;
        padding: 12px 16px;
        white-space: nowrap;
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

      .pubs-btn {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .pubs-label {
        font-size: 10px;
        opacity: 0.8;
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

      .player-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        z-index: 5;
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top-color: var(--primary-color, #03a9f4);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .loading-text {
        color: #fff;
        font-size: 14px;
      }

      .cast-loading-banner {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: var(--primary-color);
        color: #fff;
        font-size: 14px;
      }

      .cast-loading-banner .loading-spinner {
        width: 20px;
        height: 20px;
        border-width: 2px;
        flex-shrink: 0;
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
        flex-direction: row;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 12px;
        cursor: pointer;
        border-bottom: 1px solid var(--divider-color);
        transition: background 0.2s;
      }

      .tonight-program-thumb {
        width: 50px;
        height: 70px;
        object-fit: cover;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .tonight-program-info {
        display: flex;
        flex-direction: column;
        min-width: 0;
        flex: 1;
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

      .tonight-program-description {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 4px;
        line-height: 1.4;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
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

      /* Mini cast bar (shown over channel list while casting) */
      .mini-cast-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        background: var(--card-background-color);
        border-top: 2px solid var(--primary-color);
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
        flex-shrink: 0;
      }

      .mini-cast-info {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        flex: 1;
      }

      .mini-cast-title {
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .mini-cast-controls {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
      }

      .mini-live-badge {
        background: #e53935;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
      }

      /* Multi-cast bar */
      .multi-cast-bar {
        display: flex;
        gap: 8px;
        padding: 8px 16px;
        background: var(--card-background-color);
        border-top: 1px solid var(--divider-color);
        overflow-x: auto;
        flex-shrink: 0;
      }

      .cast-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: var(--secondary-background-color);
        border: 2px solid transparent;
        border-radius: 20px;
        cursor: pointer;
        font-size: 13px;
        color: var(--primary-text-color);
        white-space: nowrap;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .cast-chip:hover {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .cast-chip.focused {
        border-color: var(--primary-color);
        background: rgba(var(--rgb-primary-color), 0.15);
      }

      .cast-chip .chip-icon {
        display: flex;
        align-items: center;
      }

      .cast-chip .chip-stop {
        display: flex;
        align-items: center;
        padding: 2px;
        border-radius: 50%;
        cursor: pointer;
        color: var(--error-color);
      }

      .cast-chip .chip-stop:hover {
        background: var(--error-color);
        color: #fff;
      }
    `}constructor(){super(),this._channels=[],this._loading=!0,this._error=null,this._playing=!1,this._selectedChannel=null,this._streamData=null,this._isFullscreen=!1,this._playerError=null,this._playerLoading=!1,this._player=null,this._entityUnsubscribe=null,this._showPlayOverlay=!1,this._currentTime=0,this._duration=0,this._volume=.5,this._muted=!1,this._paused=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._liveDelay=0,this._showAudioMenu=!1,this._showTextMenu=!1,this._updateInterval=null,this._expandedChannels={},this._channelPrograms={},this._loadingPrograms={},this._searchQuery="",this._searchResults=[],this._searching=!1,this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._castTargets=[],this._isMobile=Be(),this._selectedTarget=this._isMobile?"":"local",this._activeTab="live",this._recordings=[],this._loadingRecordings=!1,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castProgressInterval=null,this._castBasePosition=0,this._castPositionUpdatedAt=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._castMinimized=!1,this._castLoading=!1,this._tonightChannels=[],this._loadingTonight=!1}connectedCallback(){super.connectedCallback(),console.log(`[Molotov Panel] Connected - v${Me}`),this._hasLoadedChannels=!1,document.addEventListener("fullscreenchange",this._onFullscreenChange.bind(this)),document.addEventListener("click",this._onDocumentClick.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this._cleanupPlayer(),this._stopCastProgressUpdate(),document.removeEventListener("fullscreenchange",this._onFullscreenChange.bind(this)),document.removeEventListener("click",this._onDocumentClick.bind(this)),this._entityUnsubscribe&&(this._entityUnsubscribe(),this._entityUnsubscribe=null)}_onDocumentClick(e){e.composedPath().some(t=>t.classList?.contains("track-menu-container"))||(this._showAudioMenu=!1,this._showTextMenu=!1,this.requestUpdate())}updated(e){e.has("hass")&&this.hass&&(this._hasLoadedChannels||(this._hasLoadedChannels=!0,this._loadChannels()),this._syncWithEntity())}async _loadChannels(){this._loading=!0,this._error=null;try{let e=this._findMolotovEntity();if(!e)throw new Error("Entite Molotov TV introuvable");console.log(`[Molotov Panel] Loading channels for ${e}`);let t=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:"now_playing",media_content_type:"directory"});t&&t.children?(this._channels=t.children.map(i=>this._parseChannel(i)),console.log(`[Molotov Panel] Loaded ${this._channels.length} channels`),this._channels.length>0&&await this._fetchCastTargets(e,this._channels[0].mediaContentId)):this._channels=[],this._loading=!1}catch(e){console.error("[Molotov Panel] Failed to load channels:",e),this._error=e.message||"Erreur lors du chargement des chaines",this._loading=!1}}async _fetchCastTargets(e,t){try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:t,media_content_type:"program"});if(i&&i.children){let s=i.children.filter(r=>r.media_content_id.startsWith("cast:")).map(r=>({mediaContentId:r.media_content_id,title:r.title}));this._castTargets=s,this._isMobile&&s.length>0&&(!this._selectedTarget||this._selectedTarget==="local")&&(this._selectedTarget=s[0].mediaContentId),console.log(`[Molotov Panel] Found ${s.length} cast targets`)}}catch(i){console.error("[Molotov Panel] Failed to fetch cast targets:",i),this._castTargets=[]}}_handleTargetChange(e){let t=e.target.value;this._isMobile&&t==="local"||(this._selectedTarget=t,console.log(`[Molotov Panel] Selected target: ${this._selectedTarget}`))}_switchTab(e){this._activeTab=e,e==="recordings"&&this._recordings.length===0&&this._loadRecordings(),e==="tonight"&&this._tonightChannels.length===0&&this._loadTonight(),this.requestUpdate()}async _loadRecordings(){let e=this._findMolotovEntity();if(e){this._loadingRecordings=!0,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this.requestUpdate();try{let t=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:"recordings",media_content_type:"directory"});t&&t.children?(this._recordings=t.children.map(i=>{let s=Y(i.media_content_id);return{mediaContentId:i.media_content_id,title:i.title,thumbnail:i.thumbnail,description:s?.desc||null}}),console.log(`[Molotov Panel] Loaded ${this._recordings.length} recordings`)):this._recordings=[]}catch(t){console.error("[Molotov Panel] Failed to load recordings:",t),this._recordings=[]}this._loadingRecordings=!1,this.requestUpdate()}}async _loadTonight(){let e=this._findMolotovEntity();if(e){this._loadingTonight=!0,this.requestUpdate();try{let t=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:"tonight_epg",media_content_type:"directory"});if(t&&t.children&&t.children.length>0){let i=new Map;for(let r of t.children){if(!r.media_content_id.startsWith("tonight_program:"))continue;let n=r.media_content_id.split(":");if(n.length<6)continue;let o=n[1],c=decodeURIComponent(n[2]),h=decodeURIComponent(n[3]),p=parseInt(n[4])*1e3,d=parseInt(n[5])*1e3,_=n.length>6?decodeURIComponent(n.slice(6).join(":")):"",u=r.title;u.startsWith("\u{1F534} ")&&(u=u.substring(3));let g=u.match(/^\d{2}:\d{2}-\d{2}:\d{2}\s+(.+)$/);g&&(u=g[1]);let f={mediaContentId:r.media_content_id,title:u,thumbnail:r.thumbnail,start:p,end:d,description:_};i.has(o)||i.set(o,{id:o,name:c,thumbnail:h,programs:[]}),i.get(o).programs.push(f)}let s=Array.from(i.values());for(let r of s)r.programs.sort((n,o)=>n.start-o.start);this._tonightChannels=s,console.log(`[Molotov Panel] Loaded tonight EPG for ${s.length} channels`)}else this._tonightChannels=[]}catch(t){console.error("[Molotov Panel] Failed to load tonight EPG:",t),this._tonightChannels=[]}this._loadingTonight=!1,this.requestUpdate()}}async _toggleRecordingExpand(e,t){e.stopPropagation();let i=t.mediaContentId;if(this._expandedRecordings[i]){this._expandedRecordings={...this._expandedRecordings,[i]:!1},this.requestUpdate();return}this._recordingEpisodes[i]||await this._fetchRecordingEpisodes(t);let s=this._recordingEpisodes[i]||[];if(s.length===0){console.log("[Molotov Panel] No episodes found, playing recording directly"),await this._playRecordingDirectly(t);return}if(s.length===1){console.log("[Molotov Panel] Only 1 episode found, playing it directly"),await this._playRecordingEpisode(s[0],t.title);return}this._expandedRecordings={...this._expandedRecordings,[i]:!0},this.requestUpdate()}async _playRecordingDirectly(e){let t=this._findMolotovEntity();if(t){this._selectedChannel={name:"",currentProgram:{title:e.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=e.mediaContentId;i.startsWith("recording:")&&(i=i.substring(10));let s=this._buildPlayMediaId(`replay:${i}`);await this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:s,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play recording failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}async _fetchRecordingEpisodes(e){let t=this._findMolotovEntity();if(!t)return;let i=e.mediaContentId;this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:i,media_content_type:"recording"});if(s&&s.children){let r=this._parseEpisodeChildren(s.children,{allowCast:!0});this._recordingEpisodes={...this._recordingEpisodes,[i]:r},console.log(`[Molotov Panel] Found ${r.length} episodes for recording "${e.title}"`)}else this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch recording episodes:",s),this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!1},this.requestUpdate()}async _playRecordingEpisode(e,t){let i=this._findMolotovEntity();if(i){this._selectedChannel={name:"",currentProgram:{title:e.title||t,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(e.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play recording episode failed:",s),this._playerError=s.message||"Erreur de lecture",this._castLoading=!1}}}_buildPlayMediaId(e){if(this._selectedTarget==="local")return`play_local:${e}`;let t=this._selectedTarget.split(":");if(t.length>=2){let i=t[1],s=t.length>=3&&t[2]!=="native"&&t[2]!=="custom"?"":t[2];return s?`cast:${i}:${s}:${e}`:`cast:${i}:${e}`}return`play_local:${e}`}_isLocalPlayback(){return this._selectedTarget==="local"}_parseEpisodeChildren(e,{allowCast:t=!1}={}){return e.filter(i=>i.media_content_id.startsWith("episode:")||i.media_content_id.startsWith("replay:")||t&&i.media_content_id.startsWith("cast:")||i.can_play).map(i=>{let s=Y(i.media_content_id);return{mediaContentId:i.media_content_id,title:i.title,thumbnail:i.thumbnail,description:s?.desc||null}})}_initPlaybackFlags(){this._isLocalPlayback()?(this._localPlaybackInitiated=!0,this._localMinimized=!1):this._castLoading=!0}_parseChannel(e){let t=e.media_content_id,[i,s]=t.split("|"),r=null;if(s)try{let u=s,g=s.length%4;g&&(u+="=".repeat(4-g)),r=decodeURIComponent(escape(atob(u.replace(/-/g,"+").replace(/_/g,"/"))))}catch{}let n=i.split(":"),o,c,h;n[0]==="program"?(o=n[1],c=n[2]?parseInt(n[2])*1e3:null,h=n[3]?parseInt(n[3])*1e3:null):n[0]==="live"&&(o=n[1]);let p=e.title.split(" - "),d=p[0],_=p.slice(1).join(" - ")||"Direct";return{id:o,name:d,thumbnail:e.thumbnail,mediaContentId:i,currentProgram:{title:_,description:r,start:c,end:h},nextProgram:null}}_findMolotovEntity(){if(!this.hass||!this.hass.states)return null;for(let e in this.hass.states)if(e.startsWith("media_player.molotov"))return e;return null}async _toggleChannelExpand(e,t){e.stopPropagation();let i=t.id;if(this._expandedChannels[i]){this._expandedChannels={...this._expandedChannels,[i]:!1},this.requestUpdate();return}this._expandedChannels={...this._expandedChannels,[i]:!0},this._channelPrograms[i]||await this._fetchChannelPrograms(t),this.requestUpdate()}async _fetchChannelPrograms(e){let t=this._findMolotovEntity();if(!t)return;let i=e.id;this._loadingPrograms={...this._loadingPrograms,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:`channel:${i}`,media_content_type:"channel"});if(s&&s.children){let r=s.children.filter(n=>n.media_content_id.startsWith("replay:")).map(n=>this._parseReplayItem(n,e));this._channelPrograms={...this._channelPrograms,[i]:r}}}catch(s){console.error("[Molotov Panel] Failed to fetch channel replays:",s),this._channelPrograms={...this._channelPrograms,[i]:[]}}this._loadingPrograms={...this._loadingPrograms,[i]:!1},this.requestUpdate()}_parseReplayItem(e,t){let i=Y(e.media_content_id);return{mediaContentId:e.media_content_id,title:e.title,thumbnail:e.thumbnail,channelName:t.name,description:i?.desc||null}}async _playReplay(e){let t=this._findMolotovEntity();if(t){this._selectedChannel={name:e.channelName,currentProgram:{title:e.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=this._buildPlayMediaId(e.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play replay failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}_handleSearchInput(e){this._searchQuery=e.target.value}_handleSearchKeydown(e){e.key==="Enter"&&this._performSearch()}async _performSearch(){let e=this._searchQuery.trim();if(!e)return;let t=this._findMolotovEntity();if(t){this._searching=!0,this._showingSearch=!0,this._searchResults=[],this._expandedResults={},this._resultEpisodes={},this.requestUpdate();try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:`search:${encodeURIComponent(e)}`,media_content_type:"search"});if(i&&i.children){let s=i.children.filter(n=>n.media_content_id.startsWith("search_result:")).map(n=>this._parseSearchResult(n)),r=await this._filterResultsWithEpisodes(s,t);this._searchResults=r,console.log(`[Molotov Panel] Found ${this._searchResults.length} results with episodes for "${e}"`)}else this._searchResults=[]}catch(i){console.error("[Molotov Panel] Search failed:",i),this._searchResults=[]}this._searching=!1,this.requestUpdate()}}async _filterResultsWithEpisodes(e,t){let i=[],s=e.map(async n=>{try{let o=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:n.mediaContentId,media_content_type:"search_result"});if(o&&o.children){let c=this._parseEpisodeChildren(o.children);if(c.length>0)return this._resultEpisodes={...this._resultEpisodes,[n.mediaContentId]:c},n}return null}catch(o){return console.error(`[Molotov Panel] Failed to check episodes for "${n.title}":`,o),null}});return(await Promise.all(s)).filter(n=>n!==null)}_parseSearchResult(e){let t=Y(e.media_content_id);return{mediaContentId:e.media_content_id,title:e.title,thumbnail:e.thumbnail,mediaClass:e.media_class,description:t?.desc||null}}_clearSearch(){this._searchQuery="",this._searchResults=[],this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this.requestUpdate()}async _toggleResultExpand(e,t){e.stopPropagation();let i=t.mediaContentId;if(this._expandedResults[i]){this._expandedResults={...this._expandedResults,[i]:!1},this.requestUpdate();return}this._expandedResults={...this._expandedResults,[i]:!0},this._resultEpisodes[i]||await this._fetchResultEpisodes(t),this.requestUpdate()}async _fetchResultEpisodes(e){let t=this._findMolotovEntity();if(!t)return;let i=e.mediaContentId;this._loadingEpisodes={...this._loadingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:i,media_content_type:"search_result"});if(s&&s.children){let r=this._parseEpisodeChildren(s.children);this._resultEpisodes={...this._resultEpisodes,[i]:r},console.log(`[Molotov Panel] Found ${r.length} episodes for "${e.title}"`)}else this._resultEpisodes={...this._resultEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch episodes:",s),this._resultEpisodes={...this._resultEpisodes,[i]:[]}}this._loadingEpisodes={...this._loadingEpisodes,[i]:!1},this.requestUpdate()}async _playEpisode(e,t){let i=this._findMolotovEntity();if(i){this._selectedChannel={name:"",currentProgram:{title:e.title||t,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(e.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play episode failed:",s),this._playerError=s.message||"Erreur de lecture"}}}_syncWithEntity(){let e=this._findMolotovEntity();if(!e||!this.hass?.states?.[e])return;let t=this.hass.states[e];if(t.attributes.stream_url&&this._localPlaybackInitiated){let i=t.attributes.stream_url,s=t.attributes.stream_drm,r=t.attributes.stream_selected_track;if(!this._playing||this._currentStreamUrl!==i){this._currentStreamUrl=i,this._streamData={url:i,drm:s,selectedTrack:r,title:t.attributes.media_title||"En direct"},this._playing=!0,this._localMinimized=!1,this._playerError=null,this._playerLoading=!0;let n=this._selectedChannel;n?.currentProgram?.start&&n?.currentProgram?.end?(this._isLive=!0,this._programStart=n.currentProgram.start,this._programEnd=n.currentProgram.end):(this._isLive=!0,this._programStart=null,this._programEnd=null),this.updateComplete.then(()=>this._initDashPlayer())}}else this._playing&&(this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1);if(t.attributes.active_casts&&Object.keys(t.attributes.active_casts).length>0){let i=t.attributes.active_casts,s=t.attributes.cast_target;this._activeCasts=i,this._focusedCastHost=s||null,(!this._castPlaying||this._castTarget!==s)&&(this._castPlaying=!0,this._castMinimized=this._isMobile,this._castLoading=!1,this._castTarget=s,this._castTitle=t.attributes.media_title||"En cours de lecture",this._startCastProgressUpdate(),console.log("[Molotov Panel] Cast playback detected:",s,"total casts:",Object.keys(i).length)),this._castPositionUpdatedAt=t.attributes.media_position_updated_at?new Date(t.attributes.media_position_updated_at).getTime()/1e3:null,this._castBasePosition=t.attributes.media_position||0,this._duration=t.attributes.media_duration||0,this._volume=t.attributes.volume_level??.5,this._muted=t.attributes.is_volume_muted||!1,this._paused=t.state==="paused",this._castTitle=t.attributes.media_title||this._castTitle,this._isLive=t.attributes.is_live||!1}else this._castPlaying&&(this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._castMinimized=!1,this._castLoading=!1,this._activeCasts={},this._focusedCastHost=null,this._stopCastProgressUpdate())}async _playChannel(e){let t=this._findMolotovEntity();if(!t){console.error("[Molotov Panel] No entity found");return}this._selectedChannel=e,this._playerError=null,this._initPlaybackFlags(),this._isLocalPlayback()&&e.currentProgram?.start&&e.currentProgram?.end&&(this._programStart=e.currentProgram.start,this._programEnd=e.currentProgram.end,this._isLive=!0);try{let i=this._buildPlayMediaId(e.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}async _initDashPlayer(){if(!this._streamData)return;let e=this.shadowRoot.querySelector("video");if(!e){console.error("[Molotov Panel] Video element not found");return}window.dashjs||await this._loadDashJs(),this._player&&(this._player.reset(),this._player=null),this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null);try{let t=window.dashjs.MediaPlayer().create();this._player=t,t.updateSettings({debug:{logLevel:window.dashjs.Debug.LOG_LEVEL_WARNING},streaming:{buffer:{stableBufferTime:6,bufferTimeAtTopQuality:30,bufferTimeAtTopQualityLongForm:60},delay:{liveDelay:3}}});let i=this._streamData.drm;i&&i.type==="widevine"&&(console.log("[Molotov Panel] Configuring Widevine DRM"),t.setProtectionData({"com.widevine.alpha":{serverURL:i.license_url,httpRequestHeaders:i.headers||{}}})),t.initialize(e,this._streamData.url,!0);let s=this._streamData.selectedTrack,r="fr";s?.track_audio&&(r=s.track_audio),t.setInitialMediaSettingsFor("audio",{lang:r}),s?.track_text&&t.setInitialMediaSettingsFor("text",{lang:s.track_text}),t.on(window.dashjs.MediaPlayer.events.ERROR,n=>{let o=n.error?.message||n.error||"Erreur de lecture";console.error("[Molotov Panel] Player error:",o),this._playerError=o,this._playerLoading=!1,this.requestUpdate()}),t.on(window.dashjs.MediaPlayer.events.STREAM_INITIALIZED,()=>{console.log("[Molotov Panel] Stream initialized"),this._enforceAudioLanguage(t,s),this._updateTracks(),this._startProgressUpdate()}),t.on(window.dashjs.MediaPlayer.events.PLAYBACK_STARTED,()=>{console.log("[Molotov Panel] Playback started"),this._showPlayOverlay=!1,this._playerLoading=!1,this._paused=!1,this.requestUpdate()}),t.on(window.dashjs.MediaPlayer.events.PLAYBACK_PAUSED,()=>{this._paused=!0,this.requestUpdate()}),t.on(window.dashjs.MediaPlayer.events.PLAYBACK_PLAYING,()=>{this._paused=!1,this.requestUpdate()}),e.volume=this._volume,e.muted=this._muted,setTimeout(()=>{e.paused&&!e.currentTime&&(console.log("[Molotov Panel] Autoplay blocked"),this._showPlayOverlay=!0,this.requestUpdate())},1500)}catch(t){console.error("[Molotov Panel] Failed to init player:",t),this._playerError=t.message}}_startProgressUpdate(){this._updateInterval&&clearInterval(this._updateInterval),this._updateInterval=setInterval(()=>{this._updateProgress()},1e3)}_updateProgress(){let e=this.shadowRoot?.querySelector("video");if(!(!e||!this._player)){if(this._currentTime=e.currentTime,this._duration=e.duration||0,this._paused=e.paused,this._isLive&&e.seekable&&e.seekable.length>0){let t=e.seekable.end(e.seekable.length-1);this._liveDelay=Math.max(0,(t-e.currentTime)*1e3)}this.requestUpdate()}}_startCastProgressUpdate(){this._stopCastProgressUpdate(),this._castProgressInterval=setInterval(()=>{this._updateCastProgress()},1e3)}_stopCastProgressUpdate(){this._castProgressInterval&&(clearInterval(this._castProgressInterval),this._castProgressInterval=null)}_updateCastProgress(){if(!this._castPlaying){this._stopCastProgressUpdate();return}if(this._castBasePosition!=null&&this._castPositionUpdatedAt&&!this._paused){let e=Date.now()/1e3,t=Math.max(0,e-this._castPositionUpdatedAt);this._currentTime=this._castBasePosition+t}else this._currentTime=this._castBasePosition||0;this.requestUpdate()}_updateTracks(){if(!this._player)return;let e=this._player.getTracksFor("audio")||[];this._audioTracks=e.map((r,n)=>({index:n,lang:r.lang,label:$e(r.lang)}));let t=this._player.getCurrentTrackFor("audio");t&&(this._selectedAudioIndex=e.findIndex(r=>r.lang===t.lang));let i=this._player.getTracksFor("text")||[];if(this._textTracks=i.map((r,n)=>({index:n,lang:r.lang,label:$e(r.lang)})),!this._player.isTextEnabled())this._selectedTextIndex=-1;else{let r=this._player.getCurrentTrackFor("text");r&&(this._selectedTextIndex=i.findIndex(n=>n.lang===r.lang))}console.log("[Molotov Panel] Audio tracks:",this._audioTracks),console.log("[Molotov Panel] Text tracks:",this._textTracks),this.requestUpdate()}_enforceAudioLanguage(e,t){let i=e.getTracksFor("audio");if(!i||i.length===0)return;let r=e.getCurrentTrackFor("audio")?.lang||"",n="fr";if(t?.track_audio&&(n=t.track_audio),r!==n&&r!=="fra"&&r!=="fre"){let o=i.find(c=>c.lang===n||c.lang==="fra"||c.lang==="fre");!o&&(r==="en"||r==="eng"||r==="qaa")&&(o=i.find(c=>c.lang!=="en"&&c.lang!=="eng"&&c.lang!=="qaa")),o&&(console.log("[Molotov Panel] Switching audio to:",o.lang),e.setCurrentTrack(o))}}_loadDashJs(){return new Promise((e,t)=>{if(window.dashjs){e();return}let i=document.createElement("script");i.src="https://cdn.dashjs.org/v4.7.4/dash.all.min.js",i.crossOrigin="anonymous",i.onload=()=>{console.log("[Molotov Panel] dash.js loaded"),e()},i.onerror=()=>{t(new Error("Failed to load dash.js"))},document.head.appendChild(i)})}_cleanupPlayer(){if(this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._player){try{this._player.reset()}catch{}this._player=null}this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._playerLoading=!1}_stopPlayback(){let e=this._findMolotovEntity();e&&this.hass&&(this._castPlaying?this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:"stop_local",media_content_type:"video"}):this.hass.callService("media_player","media_stop",{entity_id:e})),this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._selectedChannel=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1}_goBackFromPlayer(){this._localMinimized=!0}_goBackFromCast(){this._castMinimized=!0}_expandCurrentPlayback(){this._playing&&this._streamData?this._localMinimized=!1:this._castPlaying&&(this._castMinimized=!1)}_togglePlayPause(){let e=this.shadowRoot.querySelector("video");e&&(e.paused?e.play():e.pause())}_localSeek(e){let t=this.shadowRoot.querySelector("video");if(!t)return;if(e===null){t.currentTime=0;return}let i=t.currentTime+e;t.currentTime=Math.max(0,Math.min(t.duration||1/0,i))}_localSeekBeginning(){this._localSeek(null)}_localSkipBack30(){this._localSeek(-30)}_localSkipBack10(){this._localSeek(-10)}_localSkipForward30(){this._localSeek(30)}_localSkipPubs(){this._localSeek(480)}_handleProgressClick(e){let i=e.currentTarget.getBoundingClientRect(),s=(e.clientX-i.left)/i.width;if(this._isLive&&this._programStart&&this._programEnd){if(this._player?.getDVRSeekOffset?.(0)!==void 0){let n=this._player.duration(),o=s*n;this._player.seek(o)}}else if(this._duration){let r=this.shadowRoot.querySelector("video");r&&(r.currentTime=s*this._duration)}}_handleVolumeChange(e){let t=parseFloat(e.target.value);this._volume=t;let i=this.shadowRoot.querySelector("video");i&&(i.volume=t,i.muted=t===0,this._muted=t===0)}_toggleMute(){let e=this.shadowRoot.querySelector("video");e&&(this._muted=!this._muted,e.muted=this._muted,this.requestUpdate())}_selectAudioTrack(e){if(!this._player||e<0||e>=this._audioTracks.length)return;let t=this._player.getTracksFor("audio");t&&t[e]&&(this._player.setCurrentTrack(t[e]),this._selectedAudioIndex=e),this._showAudioMenu=!1,this.requestUpdate()}_selectTextTrack(e){if(this._player){if(e===-1)this._player.enableText(!1),this._selectedTextIndex=-1;else if(e>=0&&e<this._textTracks.length){let t=this._player.getTracksFor("text");t&&t[e]&&(this._player.enableText(!0),this._player.setCurrentTrack(t[e]),this._selectedTextIndex=e)}this._showTextMenu=!1,this.requestUpdate()}}_toggleAudioMenu(e){e.stopPropagation(),this._showAudioMenu=!this._showAudioMenu,this._showTextMenu=!1,this.requestUpdate()}_toggleTextMenu(e){e.stopPropagation(),this._showTextMenu=!this._showTextMenu,this._showAudioMenu=!1,this.requestUpdate()}_toggleFullscreen(){let e=this.shadowRoot.querySelector(".video-wrapper");e&&(document.fullscreenElement?document.exitFullscreen():e.requestFullscreen().catch(t=>{console.error("[Molotov Panel] Fullscreen error:",t)}))}_onFullscreenChange(){this._isFullscreen=!!document.fullscreenElement,this.requestUpdate()}_handlePlayOverlayClick(){let e=this.shadowRoot.querySelector("video");e&&(e.muted=!1,e.play().catch(t=>console.error("[Molotov Panel] Manual play error:",t)),this._showPlayOverlay=!1,this.requestUpdate())}_formatTime(e){if(!e||!isFinite(e))return"00:00";let t=Math.floor(e/3600),i=Math.floor(e%3600/60),s=Math.floor(e%60);return t>0?`${t}:${i.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`:`${i}:${s.toString().padStart(2,"0")}`}_formatClockTime(e){return e?new Date(e).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):""}_getProgressPercent(){if(this._isLive&&this._programStart&&this._programEnd){let e=Date.now()-(this._liveDelay||0),t=this._programEnd-this._programStart;if(t<=0)return 100;let i=e-this._programStart;return Math.min(100,Math.max(0,i/t*100))}else if(this._duration>0&&isFinite(this._duration))return this._currentTime/this._duration*100;return 0}render(){let e=this._playing&&this._streamData,t=e&&!this._localMinimized,i=this._castPlaying&&!this._isMobile&&!this._castMinimized,s=!t&&!i;return l`
      ${e?l`
        <div style="${this._localMinimized?"position:fixed;left:-9999px;width:1px;height:1px;overflow:hidden;":"height:100%;"}">
          ${this._renderPlayer()}
        </div>
      `:""}
      ${i?this._renderCastPlayer():""}
      ${s?this._renderChannelList():""}
    `}_renderChannelList(){return l`
      <div class="container">
        <div class="header">
          <h1>Molotov TV</h1>
          <div class="header-actions">
            <button @click=${this._handleRefresh}>
              <ha-icon icon="mdi:refresh"></ha-icon>
              Actualiser
            </button>
            <select class="cast-select" @change=${this._handleTargetChange} .value=${this._selectedTarget}>
              ${this._isMobile?"":l`<option value="local">Cet appareil</option>`}
              ${this._castTargets.map(e=>l`
                  <option value=${e.mediaContentId}>${e.title}</option>
                `)}
            </select>
          </div>
        </div>

        ${this._castLoading?l`
          <div class="cast-loading-banner">
            <div class="loading-spinner"></div>
            Lancement sur Chromecast...
          </div>
        `:""}

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
          <button class="tab" @click=${this._expandCurrentPlayback}>
            <ha-icon icon="mdi:play-circle"></ha-icon>
            En cours
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
      ${this._castPlaying?this._renderMiniCastBar():""}
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
    `}_renderTonightProgram(e,t){let i=this._formatClockTime(e.start),s=this._formatClockTime(e.end),r=Date.now(),n=e.start<=r&&e.end>r,o=e.end<=r;return l`
      <div
        class="tonight-program ${n?"live":""} ${o?"past":""}"
        @click=${()=>this._playTonightProgram(e,t)}
      >
        ${e.thumbnail?l`<img class="tonight-program-thumb" src=${e.thumbnail} @error=${c=>c.target.style.display="none"} />`:""}
        <div class="tonight-program-info">
          <div class="tonight-program-time">
            ${i} - ${s}
            ${n?l`<span class="live-indicator">EN DIRECT</span>`:""}
          </div>
          <div class="tonight-program-title">${e.title}</div>
          ${e.description?l`<div class="tonight-program-description">${e.description}</div>`:""}
        </div>
      </div>
    `}async _playTonightProgram(e,t){let i=this._findMolotovEntity();if(!i)return;this._selectedChannel={id:t.id,name:t.name,thumbnail:t.thumbnail,mediaContentId:e.mediaContentId,currentProgram:{title:e.title,start:e.start,end:e.end}},this._playerError=null;let s=Date.now();this._isLive=e.start<=s&&e.end>s,this._isLive?(this._programStart=e.start,this._programEnd=e.end):(this._programStart=null,this._programEnd=null),this._initPlaybackFlags();try{let r=this._buildPlayMediaId(e.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:r,media_content_type:"video"})}catch(r){console.error("[Molotov Panel] Play tonight program failed:",r),this._playerError=r.message||"Erreur de lecture",this._castLoading=!1}}_renderRecordingItem(e){let t=e.mediaContentId,i=this._expandedRecordings[t],s=this._recordingEpisodes[t]||[],r=this._loadingRecordingEpisodes[t];return l`
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
                          ${n.thumbnail?l`<img class="episode-thumb" src=${n.thumbnail} @error=${o=>o.target.style.display="none"} />`:""}
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
                          ${n.thumbnail?l`<img class="episode-thumb" src=${n.thumbnail} @error=${o=>o.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${n.title}</div>
                            ${n.description?l`<div class="episode-desc">${n.description}</div>`:""}
                          </div>
                        </div>
                      `):l`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderChannelItem(e){let t=e.currentProgram,i=t?.start?this._formatClockTime(t.start):"",s=t?.end?this._formatClockTime(t.end):"",r=i&&s?`${i} - ${s}`:"",n=this._expandedChannels[e.id],o=this._channelPrograms[e.id]||[],c=this._loadingPrograms[e.id];return l`
      <div class="channel-row">
        <div class="channel-main">
          <img
            class="channel-logo"
            src=${e.thumbnail||""}
            alt=${e.name}
            @error=${h=>h.target.style.display="none"}
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
              @click=${h=>this._toggleChannelExpand(h,e)}
            >
              <ha-icon icon="mdi:history"></ha-icon>
              Replay
            </button>
          </div>
        </div>
        ${n?l`
              <div class="replay-list">
                ${c?l`<div class="replay-loading">Chargement...</div>`:o.length>0?o.map(h=>l`
                        <div class="replay-item" @click=${()=>this._playReplay(h)}>
                          ${h.thumbnail?l`<img class="replay-thumb" src=${h.thumbnail} @error=${p=>p.target.style.display="none"} />`:""}
                          <div class="replay-item-info">
                            <span class="replay-item-title">${h.title}</span>
                            ${h.description?l`<span class="replay-item-desc">${h.description}</span>`:""}
                          </div>
                        </div>
                      `):l`<div class="replay-empty">Aucun replay disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderMiniCastBar(){return l`
      <div class="mini-cast-bar">
        <div class="mini-cast-info">
          <ha-icon icon="mdi:cast-connected" style="--mdc-icon-size: 20px; color: var(--primary-color);"></ha-icon>
          <span class="mini-cast-title">${this._castTitle||"Chromecast"}</span>
        </div>
        <div class="mini-cast-controls">
          ${this._isLive?l`
            <span class="mini-live-badge">DIRECT</span>
          `:""}
          <button class="icon-btn" @click=${this._toggleCastPlayPause}>
            <ha-icon icon=${this._paused?"mdi:play":"mdi:pause"}></ha-icon>
          </button>
          <button class="icon-btn" @click=${this._stopCastPlayback}>
            <ha-icon icon="mdi:stop"></ha-icon>
          </button>
        </div>
      </div>
    `}_renderPlayer(){let e=this._getProgressPercent(),t=this._selectedAudioIndex>=0&&this._audioTracks[this._selectedAudioIndex]?this._audioTracks[this._selectedAudioIndex].label:"Audio",i=this._selectedTextIndex>=0&&this._textTracks[this._selectedTextIndex]?this._textTracks[this._selectedTextIndex].label:"Off";return l`
      <div class="player-view">
        <div class="player-header">
          <div class="player-header-left">
            <button class="secondary" @click=${this._goBackFromPlayer}>
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

            ${this._playerLoading?l`<div class="player-loading">
                  <div class="loading-spinner"></div>
                  <div class="loading-text">Chargement...</div>
                </div>`:""}

            ${this._playerError?l`<div class="player-error">${this._playerError}</div>`:""}

            ${this._showPlayOverlay?l`
                  <div class="play-overlay" @click=${this._handlePlayOverlayClick}>
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                `:""}

            <!-- Custom controls -->
            <div class="custom-controls ${this._paused?"":"autohide"}">
              <div class="progress-container">
                ${this._isLive&&this._programStart?l`<span>${this._formatClockTime(Date.now()-(this._liveDelay||0))}</span>`:l`<span>${this._formatTime(this._currentTime)}</span>`}
                <div class="progress-bar" @click=${this._handleProgressClick}>
                  <div class="progress-filled" style="width: ${e}%"></div>
                </div>
                ${this._isLive&&this._programEnd?l`<span>${this._formatClockTime(this._programEnd)}</span>`:l`<span>${this._formatTime(this._duration)}</span>`}
                ${this._isLive?l`<span class="live-badge">LIVE</span>`:""}
              </div>

              <div class="controls-row">
                <div class="controls-left">
                  <button class="icon-btn" @click=${this._localSeekBeginning}>
                    <ha-icon icon="mdi:skip-previous"></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._localSkipBack30}>
                    <ha-icon icon="mdi:rewind-30"></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._localSkipBack10}>
                    <ha-icon icon="mdi:rewind-10"></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._togglePlayPause}>
                    <ha-icon icon=${this._paused?"mdi:play":"mdi:pause"}></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._localSkipForward30}>
                    <ha-icon icon="mdi:fast-forward-30"></ha-icon>
                  </button>
                  <button class="icon-btn pubs-btn" @click=${this._localSkipPubs}>
                    <ha-icon icon="mdi:fast-forward"></ha-icon>
                    <span class="pubs-label">Pubs</span>
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
    `}_renderCastPlayer(){let e=this._getProgressPercent();return l`
      <div class="player-view">
        <div class="player-header">
          <div class="player-header-left">
            <button class="secondary" @click=${this._goBackFromCast}>
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
                ${this._isLive&&this._programStart?l`<span>${this._formatClockTime(Date.now()-(this._liveDelay||0))}</span>`:l`<span>${this._formatTime(this._currentTime)}</span>`}
                <div class="progress-bar" @click=${this._handleCastSeek}>
                  <div class="progress-filled" style="width: ${e}%"></div>
                </div>
                ${this._isLive&&this._programEnd?l`<span>${this._formatClockTime(this._programEnd)}</span>`:l`<span>${this._formatTime(this._duration)}</span>`}
              </div>

              <div class="controls-row">
                <div class="controls-left">
                  <button class="icon-btn" @click=${this._castSeekBeginning}>
                    <ha-icon icon="mdi:skip-previous"></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._castSkipBack30}>
                    <ha-icon icon="mdi:rewind-30"></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._castSkipBack10}>
                    <ha-icon icon="mdi:rewind-10"></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._toggleCastPlayPause}>
                    <ha-icon icon=${this._paused?"mdi:play":"mdi:pause"}></ha-icon>
                  </button>
                  <button class="icon-btn" @click=${this._castSkipForward}>
                    <ha-icon icon="mdi:fast-forward-30"></ha-icon>
                  </button>
                  <button class="icon-btn pubs-btn" @click=${this._castSkipPubs}>
                    <ha-icon icon="mdi:fast-forward"></ha-icon>
                    <span class="pubs-label">Pubs</span>
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

        ${this._renderMultiCastBar()}
      </div>
    `}_renderMultiCastBar(){let e=Object.entries(this._activeCasts||{});return e.length<=1?"":l`
      <div class="multi-cast-bar">
        ${e.map(([t,i])=>{let s=t===this._focusedCastHost,r=i.title||t,n=i.state==="playing";return l`
            <div
              class="cast-chip ${s?"focused":""}"
              @click=${()=>this._focusCast(t)}
            >
              <span class="chip-icon">
                <ha-icon icon=${n?"mdi:cast-connected":"mdi:cast"} style="--mdc-icon-size: 18px;"></ha-icon>
              </span>
              <span>${r}</span>
              <span class="chip-stop" @click=${o=>this._stopSpecificCast(o,t)}>
                <ha-icon icon="mdi:close" style="--mdc-icon-size: 16px;"></ha-icon>
              </span>
            </div>
          `})}
      </div>
    `}async _focusCast(e){let t=this._findMolotovEntity();if(!t)return;let i=this._activeCasts[e];if(!i)return;let s=i.title||e;try{await this.hass.callService("media_player","select_source",{entity_id:t,source:s}),this._focusedCastHost=e,this._castTarget=e,this._castTitle=i.title||"En cours de lecture",console.log("[Molotov Panel] Focused cast:",e)}catch(r){console.error("[Molotov Panel] Focus cast failed:",r)}}async _stopSpecificCast(e,t){e.stopPropagation();let i=this._findMolotovEntity();if(!i)return;let s=this._activeCasts[t];if(!s)return;let r=s.title||t;try{await this.hass.callService("media_player","select_source",{entity_id:i,source:r}),await new Promise(n=>setTimeout(n,200)),await this.hass.callService("media_player","media_stop",{entity_id:i}),console.log("[Molotov Panel] Stopped cast:",t)}catch(n){console.error("[Molotov Panel] Stop specific cast failed:",n)}}async _stopCastPlayback(){let e=this._findMolotovEntity();if(e){try{await this.hass.callService("media_player","media_stop",{entity_id:e})}catch(t){console.error("[Molotov Panel] Stop cast failed:",t)}this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._stopCastProgressUpdate(),this._castMinimized=!1,this._castLoading=!1}}async _toggleCastPlayPause(){let e=this._findMolotovEntity();if(e)try{this._paused?await this.hass.callService("media_player","media_play",{entity_id:e}):await this.hass.callService("media_player","media_pause",{entity_id:e})}catch(t){console.error("[Molotov Panel] Play/pause cast failed:",t)}}async _castSkipForward(){let e=this._findMolotovEntity();if(e)try{await this.hass.callService("media_player","media_next_track",{entity_id:e})}catch(t){console.error("[Molotov Panel] Skip forward failed:",t)}}_setCastPosition(e){this._currentTime=e,this._castBasePosition=e,this._castPositionUpdatedAt=Date.now()/1e3}async _castSeek(e){let t=this._findMolotovEntity();if(t)try{await this.hass.callService("media_player","media_seek",{entity_id:t,seek_position:e}),this._setCastPosition(e)}catch(i){console.error("[Molotov Panel] Cast seek failed:",i)}}async _castSeekBeginning(){await this._castSeek(0)}async _castSkipBack30(){await this._castSeek(Math.max(0,this._currentTime-30))}async _castSkipBack10(){await this._castSeek(Math.max(0,this._currentTime-10))}async _castSkipPubs(){await this._castSeek(Math.min(this._duration||1/0,this._currentTime+480))}async _handleCastSeek(e){let t=this._findMolotovEntity();if(!t||!this._duration)return;let s=e.currentTarget.getBoundingClientRect(),n=(e.clientX-s.left)/s.width*this._duration;try{await this.hass.callService("media_player","media_seek",{entity_id:t,seek_position:n}),this._setCastPosition(n)}catch(o){console.error("[Molotov Panel] Seek failed:",o)}}async _handleCastVolumeChange(e){let t=this._findMolotovEntity();if(!t)return;let i=parseFloat(e.target.value);this._volume=i;try{await this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:i})}catch(s){console.error("[Molotov Panel] Volume change failed:",s)}}async _toggleCastMute(){let e=this._findMolotovEntity();if(e)try{await this.hass.callService("media_player","volume_mute",{entity_id:e,is_volume_muted:!this._muted}),this._muted=!this._muted}catch(t){console.error("[Molotov Panel] Mute toggle failed:",t)}}};customElements.define("molotov-panel",ue);console.log(`[Molotov Panel] Registered - v${Me}`);
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
