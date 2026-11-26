var ze=typeof window<"u"&&window.customElements!=null&&window.customElements.polyfillWrapFlushCallback!==void 0;var Wt=(a,t,e=null)=>{for(;t!==e;){let i=t.nextSibling;a.removeChild(t),t=i}};var gt=`{{lit-${String(Math.random()).slice(2)}}}`,je=`<!--${gt}-->`,li=new RegExp(`${gt}|${je}`),re="$lit$",Kt=class{constructor(t,e){this.parts=[],this.element=e;let i=[],s=[],n=document.createTreeWalker(e.content,133,null,!1),r=0,p=-1,v=0,{strings:I,values:{length:j}}=t;for(;v<j;){let R=n.nextNode();if(R===null){n.currentNode=s.pop();continue}if(p++,R.nodeType===1){if(R.hasAttributes()){let st=R.attributes,{length:et}=st,rt=0;for(let ot=0;ot<et;ot++)ci(st[ot].name,re)&&rt++;for(;rt-- >0;){let ot=I[v],Ct=Ce.exec(ot)[2],_t=Ct.toLowerCase()+re,ft=R.getAttribute(_t);R.removeAttribute(_t);let lt=ft.split(li);this.parts.push({type:"attribute",index:p,name:Ct,strings:lt}),v+=lt.length-1}}R.tagName==="TEMPLATE"&&(s.push(R),n.currentNode=R.content)}else if(R.nodeType===3){let st=R.data;if(st.indexOf(gt)>=0){let et=R.parentNode,rt=st.split(li),ot=rt.length-1;for(let Ct=0;Ct<ot;Ct++){let _t,ft=rt[Ct];if(ft==="")_t=wt();else{let lt=Ce.exec(ft);lt!==null&&ci(lt[2],re)&&(ft=ft.slice(0,lt.index)+lt[1]+lt[2].slice(0,-re.length)+lt[3]),_t=document.createTextNode(ft)}et.insertBefore(_t,R),this.parts.push({type:"node",index:++p})}rt[ot]===""?(et.insertBefore(wt(),R),i.push(R)):R.data=rt[ot],v+=ot}}else if(R.nodeType===8)if(R.data===gt){let st=R.parentNode;(R.previousSibling===null||p===r)&&(p++,st.insertBefore(wt(),R)),r=p,this.parts.push({type:"node",index:p}),R.nextSibling===null?R.data="":(i.push(R),p--),v++}else{let st=-1;for(;(st=R.data.indexOf(gt,st+1))!==-1;)this.parts.push({type:"node",index:-1}),v++}}for(let R of i)R.parentNode.removeChild(R)}},ci=(a,t)=>{let e=a.length-t.length;return e>=0&&a.slice(e)===t},fe=a=>a.index!==-1,wt=()=>document.createComment(""),Ce=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;var qe=133;function Ve(a,t){let{element:{content:e},parts:i}=a,s=document.createTreeWalker(e,qe,null,!1),n=ge(i),r=i[n],p=-1,v=0,I=[],j=null;for(;s.nextNode();){p++;let R=s.currentNode;for(R.previousSibling===j&&(j=null),t.has(R)&&(I.push(R),j===null&&(j=R)),j!==null&&v++;r!==void 0&&r.index===p;)r.index=j!==null?-1:r.index-v,n=ge(i,n),r=i[n]}I.forEach(R=>R.parentNode.removeChild(R))}var Ti=a=>{let t=a.nodeType===11?0:1,e=document.createTreeWalker(a,qe,null,!1);for(;e.nextNode();)t++;return t},ge=(a,t=-1)=>{for(let e=t+1;e<a.length;e++){let i=a[e];if(fe(i))return e}return-1};function di(a,t,e=null){let{element:{content:i},parts:s}=a;if(e==null){i.appendChild(t);return}let n=document.createTreeWalker(i,qe,null,!1),r=ge(s),p=0,v=-1;for(;n.nextNode();)for(v++,n.currentNode===e&&(p=Ti(t),e.parentNode.insertBefore(t,e));r!==-1&&s[r].index===v;){if(p>0){for(;r!==-1;)s[r].index+=p,r=ge(s,r);return}r=ge(s,r)}}var Ci=new WeakMap;var Yt=a=>typeof a=="function"&&Ci.has(a);var pt={},Ae={};var Ot=class{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(let i of this.__parts)i!==void 0&&i.setValue(t[e]),e++;for(let i of this.__parts)i!==void 0&&i.commit()}_clone(){let t=ze?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],i=this.template.parts,s=document.createTreeWalker(t,133,null,!1),n=0,r=0,p,v=s.nextNode();for(;n<i.length;){if(p=i[n],!fe(p)){this.__parts.push(void 0),n++;continue}for(;r<p.index;)r++,v.nodeName==="TEMPLATE"&&(e.push(v),s.currentNode=v.content),(v=s.nextNode())===null&&(s.currentNode=e.pop(),v=s.nextNode());if(p.type==="node"){let I=this.processor.handleTextExpression(this.options);I.insertAfterNode(v.previousSibling),this.__parts.push(I)}else this.__parts.push(...this.processor.handleAttributeExpressions(v,p.name,p.strings,this.options));n++}return ze&&(document.adoptNode(t),customElements.upgrade(t)),t}};var hi=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:a=>a}),Ii=` ${gt} `,Tt=class{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){let t=this.strings.length-1,e="",i=!1;for(let s=0;s<t;s++){let n=this.strings[s],r=n.lastIndexOf("<!--");i=(r>-1||i)&&n.indexOf("-->",r+1)===-1;let p=Ce.exec(n);p===null?e+=n+(i?Ii:je):e+=n.substr(0,p.index)+p[1]+p[2]+re+p[3]+gt}return e+=this.strings[t],e}getTemplateElement(){let t=document.createElement("template"),e=this.getHTML();return hi!==void 0&&(e=hi.createHTML(e)),t.innerHTML=e,t}};var Re=a=>a===null||!(typeof a=="object"||typeof a=="function"),Ie=a=>Array.isArray(a)||!!(a&&a[Symbol.iterator]),oe=class{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let s=0;s<i.length-1;s++)this.parts[s]=this._createPart()}_createPart(){return new me(this)}_getValue(){let t=this.strings,e=t.length-1,i=this.parts;if(e===1&&t[0]===""&&t[1]===""){let n=i[0].value;if(typeof n=="symbol")return String(n);if(typeof n=="string"||!Ie(n))return n}let s="";for(let n=0;n<e;n++){s+=t[n];let r=i[n];if(r!==void 0){let p=r.value;if(Re(p)||!Ie(p))s+=typeof p=="string"?p:String(p);else for(let v of p)s+=typeof v=="string"?v:String(v)}}return s+=t[e],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}},me=class{constructor(t){this.value=void 0,this.committer=t}setValue(t){t!==pt&&(!Re(t)||t!==this.value)&&(this.value=t,Yt(t)||(this.committer.dirty=!0))}commit(){for(;Yt(this.value);){let t=this.value;this.value=pt,t(this)}this.value!==pt&&this.committer.commit()}},Xt=class a{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(wt()),this.endNode=t.appendChild(wt())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=wt()),t.__insert(this.endNode=wt())}insertAfterPart(t){t.__insert(this.startNode=wt()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(this.startNode.parentNode===null)return;for(;Yt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=pt,e(this)}let t=this.__pendingValue;t!==pt&&(Re(t)?t!==this.value&&this.__commitText(t):t instanceof Tt?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):Ie(t)?this.__commitIterable(t):t===Ae?(this.value=Ae,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){let e=this.startNode.nextSibling;t=t??"";let i=typeof t=="string"?t:String(t);e===this.endNode.previousSibling&&e.nodeType===3?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){let e=this.options.templateFactory(t);if(this.value instanceof Ot&&this.value.template===e)this.value.update(t.values);else{let i=new Ot(e,t.processor,this.options),s=i._clone();i.update(t.values),this.__commitNode(s),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());let e=this.value,i=0,s;for(let n of t)s=e[i],s===void 0&&(s=new a(this.options),e.push(s),i===0?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(n),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){Wt(this.startNode.parentNode,t.nextSibling,this.endNode)}},ye=class{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,i.length!==2||i[0]!==""||i[1]!=="")throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;Yt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=pt,e(this)}if(this.__pendingValue===pt)return;let t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=pt}},be=class extends oe{constructor(t,e,i){super(t,e,i),this.single=i.length===2&&i[0]===""&&i[1]===""}_createPart(){return new Me(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}},Me=class extends me{},ui=!1;(()=>{try{let a={get capture(){return ui=!0,!1}};window.addEventListener("test",a,a),window.removeEventListener("test",a,a)}catch{}})();var ve=class{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=s=>this.handleEvent(s)}setValue(t){this.__pendingValue=t}commit(){for(;Yt(this.__pendingValue);){let n=this.__pendingValue;this.__pendingValue=pt,n(this)}if(this.__pendingValue===pt)return;let t=this.__pendingValue,e=this.value,i=t==null||e!=null&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),s=t!=null&&(e==null||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=Mi(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=pt}handleEvent(t){typeof this.value=="function"?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}},Mi=a=>a&&(ui?{capture:a.capture,passive:a.passive,once:a.once}:a.capture);function Ge(a){let t=Qt.get(a.type);t===void 0&&(t={stringsArray:new WeakMap,keyString:new Map},Qt.set(a.type,t));let e=t.stringsArray.get(a.strings);if(e!==void 0)return e;let i=a.strings.join(gt);return e=t.keyString.get(i),e===void 0&&(e=new Kt(a,a.getTemplateElement()),t.keyString.set(i,e)),t.stringsArray.set(a.strings,e),e}var Qt=new Map;var Lt=new WeakMap,He=(a,t,e)=>{let i=Lt.get(t);i===void 0&&(Wt(t,t.firstChild),Lt.set(t,i=new Xt(Object.assign({templateFactory:Ge},e))),i.appendInto(t)),i.setValue(a),i.commit()};var $e=class{handleAttributeExpressions(t,e,i,s){let n=e[0];return n==="."?new be(t,e.slice(1),i).parts:n==="@"?[new ve(t,e.slice(1),s.eventContext)]:n==="?"?[new ye(t,e.slice(1),i)]:new oe(t,e,i).parts}handleTextExpression(t){return new Xt(t)}},We=new $e;typeof window<"u"&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var b=(a,...t)=>new Tt(a,t,"html",We);var _i=(a,t)=>`${a}--${t}`,Ne=!0;typeof window.ShadyCSS>"u"?Ne=!1:typeof window.ShadyCSS.prepareTemplateDom>"u"&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),Ne=!1);var $i=a=>t=>{let e=_i(t.type,a),i=Qt.get(e);i===void 0&&(i={stringsArray:new WeakMap,keyString:new Map},Qt.set(e,i));let s=i.stringsArray.get(t.strings);if(s!==void 0)return s;let n=t.strings.join(gt);if(s=i.keyString.get(n),s===void 0){let r=t.getTemplateElement();Ne&&window.ShadyCSS.prepareTemplateDom(r,a),s=new Kt(t,r),i.keyString.set(n,s)}return i.stringsArray.set(t.strings,s),s},Ni=["html","svg"],Oi=a=>{Ni.forEach(t=>{let e=Qt.get(_i(t,a));e!==void 0&&e.keyString.forEach(i=>{let{element:{content:s}}=i,n=new Set;Array.from(s.querySelectorAll("style")).forEach(r=>{n.add(r)}),Ve(i,n)})})},fi=new Set,Li=(a,t,e)=>{fi.add(a);let i=e?e.element:document.createElement("template"),s=t.querySelectorAll("style"),{length:n}=s;if(n===0){window.ShadyCSS.prepareTemplateStyles(i,a);return}let r=document.createElement("style");for(let I=0;I<n;I++){let j=s[I];j.parentNode.removeChild(j),r.textContent+=j.textContent}Oi(a);let p=i.content;e?di(e,r,p.firstChild):p.insertBefore(r,p.firstChild),window.ShadyCSS.prepareTemplateStyles(i,a);let v=p.querySelector("style");if(window.ShadyCSS.nativeShadow&&v!==null)t.insertBefore(v.cloneNode(!0),t.firstChild);else if(e){p.insertBefore(r,p.firstChild);let I=new Set;I.add(r),Ve(e,I)}},gi=(a,t,e)=>{if(!e||typeof e!="object"||!e.scopeName)throw new Error("The `scopeName` option is required.");let i=e.scopeName,s=Lt.has(t),n=Ne&&t.nodeType===11&&!!t.host,r=n&&!fi.has(i),p=r?document.createDocumentFragment():t;if(He(a,p,Object.assign({templateFactory:$i(i)},e)),r){let v=Lt.get(p);Lt.delete(p);let I=v.value instanceof Ot?v.value.template:void 0;Li(i,p,I),Wt(t,t.firstChild),t.appendChild(p),Lt.set(t,v)}!s&&n&&window.ShadyCSS.styleElement(t.host)};var mi;window.JSCompiler_renameProperty=(a,t)=>a;var Ze={toAttribute(a,t){switch(t){case Boolean:return a?"":null;case Object:case Array:return a==null?a:JSON.stringify(a)}return a},fromAttribute(a,t){switch(t){case Boolean:return a!==null;case Number:return a===null?null:Number(a);case Object:case Array:return JSON.parse(a)}return a}},yi=(a,t)=>t!==a&&(t===t||a===a),Ke={attribute:!0,type:String,converter:Ze,reflect:!1,hasChanged:yi},Ye=1,Xe=4,Qe=8,Je=16,ti="finalized",ae=class extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();let t=[];return this._classProperties.forEach((e,i)=>{let s=this._attributeNameForProperty(i,e);s!==void 0&&(this._attributeToPropertyMap.set(s,i),t.push(s))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;let t=Object.getPrototypeOf(this)._classProperties;t!==void 0&&t.forEach((e,i)=>this._classProperties.set(i,e))}}static createProperty(t,e=Ke){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;let i=typeof t=="symbol"?Symbol():`__${t}`,s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Object.defineProperty(this.prototype,t,s)}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){let n=this[t];this[e]=s,this.requestUpdateInternal(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||Ke}static finalize(){let t=Object.getPrototypeOf(this);if(t.hasOwnProperty(ti)||t.finalize(),this[ti]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){let e=this.properties,i=[...Object.getOwnPropertyNames(e),...typeof Object.getOwnPropertySymbols=="function"?Object.getOwnPropertySymbols(e):[]];for(let s of i)this.createProperty(s,e[s])}}static _attributeNameForProperty(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=yi){return i(t,e)}static _propertyValueFromAttribute(t,e){let i=e.type,s=e.converter||Ze,n=typeof s=="function"?s:s.fromAttribute;return n?n(t,i):t}static _propertyValueToAttribute(t,e){if(e.reflect===void 0)return;let i=e.type,s=e.converter;return(s&&s.toAttribute||Ze.toAttribute)(t,i)}initialize(){this._updateState=0,this._updatePromise=new Promise(t=>this._enableUpdatingResolver=t),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){let i=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,i)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){this._enableUpdatingResolver!==void 0&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=Ke){let s=this.constructor,n=s._attributeNameForProperty(t,i);if(n!==void 0){let r=s._propertyValueToAttribute(e,i);if(r===void 0)return;this._updateState=this._updateState|Qe,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._updateState=this._updateState&~Qe}}_attributeToProperty(t,e){if(this._updateState&Qe)return;let i=this.constructor,s=i._attributeToPropertyMap.get(t);if(s!==void 0){let n=i.getPropertyOptions(s);this._updateState=this._updateState|Je,this[s]=i._propertyValueFromAttribute(e,n),this._updateState=this._updateState&~Je}}requestUpdateInternal(t,e,i){let s=!0;if(t!==void 0){let n=this.constructor;i=i||n.getPropertyOptions(t),n._valueHasChanged(this[t],e,i.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),i.reflect===!0&&!(this._updateState&Je)&&(this._reflectingProperties===void 0&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,i))):s=!1}!this._hasRequestedUpdate&&s&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=this._updateState|Xe;try{await this._updatePromise}catch{}let t=this.performUpdate();return t!=null&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return this._updateState&Xe}get hasUpdated(){return this._updateState&Ye}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1,e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(i){throw t=!1,this._markUpdated(),i}t&&(this._updateState&Ye||(this._updateState=this._updateState|Ye,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~Xe}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){this._reflectingProperties!==void 0&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,i)=>this._propertyToAttribute(i,this[i],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}};mi=ti;ae[mi]=!0;var bi=Element.prototype,Ls=bi.msMatchesSelector||bi.webkitMatchesSelector;var Oe=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ei=Symbol(),xe=class{constructor(t,e){if(e!==ei)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return this._styleSheet===void 0&&(Oe?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}},vi=a=>new xe(String(a),ei),Ui=a=>{if(a instanceof xe)return a.cssText;if(typeof a=="number")return a;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${a}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`)},xi=(a,...t)=>{let e=t.reduce((i,s,n)=>i+Ui(s)+a[n+1],a[0]);return new xe(e,ei)};(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");var wi={},Jt=class extends ae{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;let t=this.getStyles();if(Array.isArray(t)){let e=(n,r)=>n.reduceRight((p,v)=>Array.isArray(v)?e(v,p):(p.add(v),p),r),i=e(t,new Set),s=[];i.forEach(n=>s.unshift(n)),this._styles=s}else this._styles=t===void 0?[]:[t];this._styles=this._styles.map(e=>{if(e instanceof CSSStyleSheet&&!Oe){let i=Array.prototype.slice.call(e.cssRules).reduce((s,n)=>s+n.cssText,"");return vi(i)}return e})}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){let t=this.constructor._styles;t.length!==0&&(window.ShadyCSS!==void 0&&!window.ShadyCSS.nativeShadow?window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(e=>e.cssText),this.localName):Oe?this.renderRoot.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):this._needsShimAdoptedStyleSheets=!0)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&window.ShadyCSS!==void 0&&window.ShadyCSS.styleElement(this)}update(t){let e=this.render();super.update(t),e!==wi&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(i=>{let s=document.createElement("style");s.textContent=i.cssText,this.renderRoot.appendChild(s)}))}render(){return wi}};Jt.finalized=!0;Jt.render=gi;Jt.shadowRootOptions={mode:"open"};var B=(()=>{function At(l,m){let _=[],o=0;for(;o<l.length;){if(!l[o]){o++;continue}let c=o,u=o+1;for(;u<l.length&&u-c<=m+1;)l[u]&&(c=u),u++;_.push([o,c]),o=c+1}return _}function ce(l,m,_){let o=0;for(let w of l)w&&o++;if(!(_>0)||o*2<l.length)return null;let c=At(l,3).filter(w=>(w[1]-w[0]+1)*_>=60),u=[];for(let w=0;w+1<c.length;w++){let P=c[w],M=c[w+1],N=m+(P[1]+1)*_,A=m+M[0]*_,T=0;for(let $=P[1]+1;$<M[0];$++)l[$]&&T++;A-N>=150&&A-N<=800&&T*2<M[0]-P[1]-1&&u.push([N,A])}return u}function it(l,m,_){let o=new Array(l.length).fill(!1);for(let c=0;c<l.length;c++){if(!_[c])continue;let u=[];for(let w=Math.max(0,c-2);w<=Math.min(l.length-1,c+2);w++)_[w]&&u.push(l[w]);u.sort((w,P)=>w-P),o[c]=u[u.length>>1]<.5*m}return o}function ct(l){let m=new Array(l.length).fill(!1);for(let _ of At(l,0))if(_[1]-_[0]+1>=5)for(let o=_[0];o<=_[1];o++)m[o]=!0;return m}function D(l,m,_,o,c){let u=ct(l),w=(T,$)=>{if(T<0||$>u.length)return!1;let F=0;for(let Nt=T;Nt<$;Nt++)u[Nt]||F++;return F>=8},P=T=>{let $=(T[1]+1-T[0])*m;return w(T[0]-15,T[0])&&w(T[1]+1,T[1]+1+15)&&$>=150&&$<=1200},M=At(u,7);if(!_||!o)return M.filter(P);let N=c?M.filter(T=>T[1]-T[0]+1>=10):M,A=[];for(let T of Ut(N,_,o,m)){let $=N.filter(F=>F[0]>=T[0]&&F[1]<=T[1]);if(P(T)&&(!c||$.length===1||$.some(P)))A.push(T);else for(let F of $)P(F)&&A.push([F[0],F[1]])}return A}function Ut(l,m,_,o){let c=[];for(let u of l){let w=c[c.length-1];w&&(u[1]+1-w[0])*o<=1200&&Dt(w[1]+1,u[0],m,_)?w[1]=u[1]:c.push([u[0],u[1]])}return c}function Dt(l,m,_,o){let c=0;for(let u=l;u<m;u++)(_[u]||o[u])&&c++;return m-l<=29&&c>=m-l-7&&St(_,l,m)<=10&&St(o,l,m)<=12}function St(l,m,_){let o=0,c=0;for(let u=m;u<_;u++)o=l[u]?o+1:0,c=Math.max(c,o);return c}function dt(l,m,_,o){let c=l,u=o?l.map((A,T)=>!A&&o[T]):null,w=o?l.map((A,T)=>A&&!o[T]):null,P=D(c,_,w,u,!0);if(o){c=new Array(l.length).fill(!1);let A=new Array(l.length).fill(!1);for(let T of P)for(let $=T[0];$<=T[1];$++)c[$]=l[$]&&o[$],A[$]=l[$]&&!o[$];P=D(c,_,A,u)}let M=ct(c),N=o?we(l,o,P,m,_):[];return P.map(A=>{let T=At(M.slice(A[0],A[1]+1),0),$=It(o?ht(T,A[0],l,o):T);return[m+(A[0]+$[0])*_,m+(A[0]+$[1]+1)*_]}).concat(N)}function It(l){let m=0,_=l.length-1;for(;_>m&&l[_][1]-l[_][0]+1<10;)_--;for(;m<_&&l[m][1]-l[m][0]+1<10;)m++;return[l[m][0],l[_][1]]}function ht(l,m,_,o){let c=[];for(let u of l){let w=c[c.length-1];w&&!Mt(m+w[1]+1,m+u[0],_,o)?w[1]=u[1]:c.push([u[0],u[1]])}return c}function Mt(l,m,_,o){let c=0;for(let u=l;u<m;u++)if(!_[u]&&!o[u]||(c=o[u]?0:c+1,c>=5))return!0;return!1}function we(l,m,_,o,c){let u=ct(l),w=(M,N)=>{if(M<0||N>u.length)return!1;let A=0;for(let T=M;T<N;T++)u[T]||A++;return A>=12},P=[];for(let M of D(m,c)){if(_.some(F=>F[0]<=M[1]&&M[0]<=F[1]))continue;let N=0;for(let F=M[0];F<=M[1];F++)l[F]&&N++;if(N<.5*(M[1]-M[0]+1))continue;let A=-1,T=-1;for(let F=M[0];F<=M[1];F++)u[F]&&(A<0&&(A=F),T=F+1);if(A<0||(T-A)*c<150||!w(A-15,A)||!w(T,T+15))continue;let $=It(ht(At(u.slice(M[0],M[1]+1),0),M[0],l,m));P.push([o+(M[0]+$[0])*c,o+(M[0]+$[1]+1)*c])}return P}function Rt(l,m){if(l===null)return m||[];if(m===null)return l;let _=[];for(let o of l)for(let c of m){let u=Math.max(o[0],c[0]),w=Math.min(o[1],c[1]);w-u<60||_.push([Math.abs(o[0]-c[0])<=90?c[0]:u,Math.abs(o[1]-c[1])<=90?c[1]:w])}return _}function Zt(l,m,_){let o=Math.floor(m*.22),c=Math.floor(_*.22),u=o-1,w=c-1,P=u*w,M=[[0,0],[m-o,0],[0,_-c],[m-o,_-c]],N=M.map(()=>new Uint8Array(P>0?l*P:0)),A=new Array(l).fill(!1),T=-1;function $(C,G){if(!(P<=0||C<0||C>=l||G.length<m*_)){for(let z=0;z<M.length;z++){let X=M[z][0],q=M[z][1],Q=N[z],H=C*P;for(let V=0;V<w;V++){let W=(q+V)*m+X;for(let d=0;d<u;d++){let h=G[W];Q[H++]=Math.min(255,Math.abs(G[W+1]-h)+Math.abs(G[W+m]-h)),W++}}}A[C]=!0}}function F(C,G,z){let X=N[C],q=new Uint8Array(P);for(let W=0;W<P;W++){z.fill(0);for(let y of G)z[X[y*P+W]]++;let d=0,h=0;for(;d+z[h]<=G.length>>1;)d+=z[h++];q[W]=h}let Q=Math.max(1,Array.from(q).sort((W,d)=>W-d)[Math.floor(P*.92)]),H=[],V=0;for(let W=0;W<P;W++)q[W]>=Q&&(H.push(W),V+=q[W]);return H.length===0?null:{corner:C,median:q,mask:H,strength:V/H.length,whole:V}}function Nt(C,G,z,X){let q=null;for(let Q=C;Q<G;Q++){let H=F(Q,z,X);H!==null&&(q===null||H.strength>q.strength)&&(q=H)}return q}function ke(C,G){let z=N[C.corner],X=new Float64Array(l),q=[];for(let Q of G){let H=Q*P,V=0;for(let W of C.mask)V+=Math.min(z[H+W],C.median[W]);X[Q]=V/C.whole,q.push(X[Q])}return q.sort((Q,H)=>Q-H),C.score=X,C.usual=q[q.length>>1],C}function Gt(){let C=[];for(let V=0;V<l;V++)A[V]&&C.push(V);if(P<=0||C.length<30)return null;let G=new Int32Array(256),z=V=>V!==null&&V.strength>=25?V:null,X=V=>V!==null&&V.strength>=30?V:null,q=Nt(2,N.length,C,G),Q=T<0?z(Nt(0,2,C,G)):T<2?F(T,C,G):null,H=Q!==null?Q:T<0?z(q):F(T,C,G);return H===null?null:(T=H.corner,ke(H,C),H.lower=Q!==null&&X(q)!==null?ke(q,C):null,H)}function pe(C){let G=M[C.corner][0],z=M[C.corner][1];return{width:m,points:C.mask.map(X=>(z+Math.floor(X/u))*m+G+X%u),pattern:C.mask.map(X=>C.median[X]),whole:C.whole,usual:C.usual,strength:C.strength,lower:C.lower?pe(C.lower):null,channel:C.corner<2}}function Ee(){let C=Gt();return C===null?null:pe(C)}function Be(){let C=Gt();return C===null?null:it(C.score,C.usual,A)}return{add:$,logo:Ee,gone:Be,breaks:(C,G)=>{let z=Gt();if(z===null)return null;let X=z.lower?it(z.lower.score,z.lower.usual,A):null;return dt(it(z.score,z.usual,A),C,G,X)}}}function de(l){return l.lower?Object.assign({},l,{lower:null}):l}function Ft(l,m,_){let o=0;for(let c of m)$t(l,c)>=.5*l.usual&&o++;return o>=_*m.length}function $t(l,m){let _=0;for(let o=0;o<l.points.length;o++){let c=l.points[o],u=m[c];_+=Math.min(Math.abs(m[c+1]-u)+Math.abs(m[c+l.width]-u),l.pattern[o])}return _/l.whole}function Z(l){let m=String(l).match(/[A-Za-z0-9+\/]{16,}={0,2}/g)||[];for(let _ of m){let o;try{o=atob(_)}catch{continue}if(o.length<20||o.charCodeAt(0)!==252)continue;let c=u=>{if(u<0||u>=o.length)throw new RangeError("short");return o.charCodeAt(u)};try{if(c(13)===5&&!(c(18)&128))return(c(19)&128)!==0;for(let u=16;u+4<=o.length;u++){if(o.substr(u,4)!=="CUEI"||c(u-2)!==2)continue;let w=u+8;if(c(w)&128)continue;w++;let P=c(w);w++,P&128||(w+=1+6*c(w)),P&64&&(w+=5),w+=2+c(w+1);let M=c(w);if([34,48,50,52,54].indexOf(M)>=0)return!0;if([35,49,51,53,55].indexOf(M)>=0)return!1}}catch{return null}return null}return null}function te(l){let m=[];if(l.some(_=>_.signalled))for(let _ of l)for(let o of _.marks){if(!o.opens)continue;let c=null;if(o.duration!==null)c=o.at+o.duration;else{let u=_.marks.filter(w=>w.at>o.at).map(w=>w.at);c=u.length>0?Math.min.apply(null,u):_.end}c!==null&&c>o.at&&m.push([o.at,c])}else{let _=o=>o.end-o.start;for(let o=1;o+1<l.length;o++){let c=l[o-1],u=l[o],w=l[o+1];if(c.end===null||u.end===null||w.end===null)continue;_(u)<10&&_(c)>=60&&_(c)<=330&&_(w)>=60&&_(w)<=330&&m.push([c.start,w.end])}}return Bt(m,10)}function Bt(l,m){let _=[];for(let o of l.slice().sort((c,u)=>c[0]-u[0])){let c=_[_.length-1];c&&o[0]-c[1]<=m?c[1]=Math.max(c[1],o[1]):_.push([o[0],o[1]])}return _}let zt=120,he=40,ue=4e3,ut=10,kt=14,mt=6,ee=90,Se=60,bt=100,jt=3,Et=65536,qt=1e4;function ie(l,m){return String.fromCharCode(l[m+4],l[m+5],l[m+6],l[m+7])}function se(l){let m=new DataView(l.buffer,l.byteOffset,l.byteLength),_=0;for(;l.length-_>=8;){let o=m.getUint32(_);if(o<8||_+o>Et)return null;if(ie(l,_)==="moof")return _+o;_+=o}return null}function yt(l,m,_,o){let c=[],u=_;for(;o-u>=8;){let w=m.getUint32(u);if(w<8||w>o-u)break;c.push({type:ie(l,u),from:u+8,to:u+w}),u+=w}return c}function vt(l){let m=se(l);if(m===null||m>l.length)return null;let _=new DataView(l.buffer,l.byteOffset,l.byteLength),o=yt(l,_,0,m).pop();if(!o||o.type!=="moof")return null;let c=yt(l,_,o.from,o.to).filter(P=>P.type==="traf")[0];if(!c)return null;let u=[],w=-1;for(let P of yt(l,_,c.from,c.to)){if(P.type!=="tfhd"&&P.type!=="trun")continue;let M=P.from;if(P.to-M<8)return null;let N=_.getUint32(M)&16777215;if(P.type==="tfhd"){let A=M+8;if(N&1&&(A+=8),N&2&&(A+=4),N&8&&(A+=4),N&16){if(A+4>P.to)return null;w=_.getUint32(A)}}else{let A=_.getUint32(M+4),T=((N&256?1:0)+(N&512?1:0)+(N&1024?1:0)+(N&2048?1:0))*4,$=M+8+(N&1?4:0)+(N&4?4:0);if(A>qt||$+A*T>P.to||!(N&512)&&w<0)return null;for(let F=0;F<A;F++)u.push(N&512?_.getUint32($+(N&256?4:0)):w),$+=T}}return u}function Vt(l,m,_){let o=[],c=0,u=0;for(let w=0;w<l.length;w++){let P=l[w];if(P>=0&&P<zt){c++,u+=P;continue}c>=ut&&c<=kt&&u<=he*c&&P>ue&&o.push(m+w*_),c=0,u=0}return o}function De(l){let m=[];for(let o of l.slice().sort((c,u)=>c-u)){let c=m[m.length-1];c&&o-c[c.length-1]<=Se?c.push(o):m.push([o])}let _=[];for(let o of m){let c=_[_.length-1];c&&o[0]-c[c.length-1]<=bt&&c.length>=jt&&o.length>=jt?c.push(...o):_.push(o)}return _.filter(o=>o.length>=mt&&o[o.length-1]-o[0]>=ee).map(o=>[o[1],o[o.length-2]])}function Fe(l,m){let _=m.filter(o=>o[0]<l[1]&&o[1]>l[1])[0];return _?[l[0],_[1]]:l}return{runs:At,captionBreaks:ce,gone:it,solid:ct,logoBreaks:dt,combine:Rt,track:Zt,score:$t,alone:de,seenIn:Ft,opens:Z,markedBreaks:te,merge:Bt,moofEnd:se,frameSizes:vt,separatorEnds:Vt,separatedBreaks:De,reachSeparated:Fe,BRIDGE:7,AROUND:15,LOGO_MAX_S:1200}})();function Si(a){let _t=B.LOGO_MAX_S+160,ft=_t+120,lt=3,si=8192,le=480,ni=8,ri=3e4,oi=4e3,ai=150,Ue=1e4,At=5*60*1e3,ce=2e4,it=240,ct=135,D=0,Ut=null,Dt=!1,St=null,dt=null,It=[],ht="none",Mt=null,we=0,Rt=new Map,Zt=[],de=0,Ft="none",$t=[],Z=null,te="none",Bt=-1/0,zt=0,he=new Map,ue=null,ut=new Map,kt=new Map,mt=new Map,ee=0,Se=0,bt=null,jt=!1,Et=null,qt=!1,ie="none",se=[],yt=new Map,vt=new Map,Vt=[];function De(d){let h=String(d).indexOf("?");return h<0?String(d):String(d).slice(0,h)}function Fe(d,h){try{let y=d&&d.contentId,f=!!a.isLive(),g=y?De(y):null;St=y||null;let S=h&&h.live_thumbnails_url;dt=f&&typeof S=="string"&&S.indexOf("https://")===0?S.replace(/\/+$/,""):null,qt=f&&!!(h&&h.separated_breaks===!0);let E=!f&&!!(h&&h.recording)&&g!==null;if(g!==null&&g===Ut&&f===Dt){E&&/^error/.test(ht)&&(Mt={url:St,name:Ut,mine:D});return}D++,Ut=g,Dt=f,bt=null,jt=a.show(!1),It=[],ht=E?"waiting":"none",Zt=[],de=0,Ft="none",$t=[],Z=null,te="none",Bt=-1/0,zt=0,ue=null,ut=new Map,kt=new Map,mt=new Map,ie=qt?"waiting":"none",se=[],yt=new Map,vt=new Map,Vt=[],Mt=E?{url:St,name:Ut,mine:D}:null,we=0}catch{ht="error"}}function l(d,h,y){let f=new Array(d.length),g=0,S=async()=>{for(;g<d.length;){let x=g++;f[x]=await y(d[x],x)}},E=[];for(let x=0;x<Math.min(h,d.length);x++)E.push(S());return Promise.all(E).then(()=>f)}async function m(d){let h=new AbortController,y=setTimeout(()=>h.abort(),ce);try{let f=await fetch(d,{credentials:"omit",signal:h.signal});if(!f.ok)throw new Error("http "+f.status);return await f.text()}finally{clearTimeout(y)}}function _(d,h,y){return new Promise(f=>{let g=new Image,S=setTimeout(()=>{g.onload=null,g.onerror=null,f(null)},ce);g.crossOrigin="anonymous",g.onload=()=>{clearTimeout(S);try{Et===null&&(Et=document.createElement("canvas")),(Et.width!==h||Et.height!==y)&&(Et.width=h,Et.height=y);let E=Et.getContext("2d",{willReadFrequently:!0});E.drawImage(g,0,0,h,y),f(E.getImageData(0,0,h,y).data)}catch{f(null)}},g.onerror=()=>{clearTimeout(S),f(null)},g.src=d})}function o(d,h,y){let f=new Uint8Array(it*ct),g=0;for(let S=0;S<ct;S++){let E=(S*h+y)*4;for(let x=0;x<it;x++)f[g++]=d[E]*77+d[E+1]*150+d[E+2]*29>>8,E+=4}return f}function c(d){let h=/^PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?$/.exec(d||"");return h?Number(h[1]||0)*3600+Number(h[2]||0)*60+Number(h[3]||0):NaN}function u(d,h){let y=[];for(let f=d.firstElementChild;f;f=f.nextElementSibling)f.localName===h&&y.push(f);return y}function w(d,h){let y=u(d,"BaseURL")[0];return y&&y.textContent?new URL(y.textContent.trim(),h).href:h}function P(d,h,y,f){let g=f||u(d,"Representation")[0];if(!g)return[];let S=u(d,"SegmentTemplate")[0]||u(g,"SegmentTemplate")[0],E=S&&S.getAttribute("media");if(!E)return[];let x=Number(S.getAttribute("timescale")||1),k=Number(S.getAttribute("presentationTimeOffset")||0),L=(tt,Pt,xt)=>tt.replace(new RegExp("\\$"+Pt+"(?:%0(\\d+)d)?\\$","g"),(ne,Ht)=>Ht?String(xt).padStart(Number(Ht),"0"):String(xt)),O=(tt,Pt)=>new URL(L(L(E.split("$RepresentationID$").join(g.getAttribute("id")),"Time",tt),"Number",Pt),h).href,U=[],J=u(S,"SegmentTimeline")[0];if(J){let tt=0,Pt=Number(S.getAttribute("startNumber")||1),xt=u(J,"S");for(let ne=0;ne<xt.length;ne++){let Ht=xt[ne];Ht.getAttribute("t")!==null&&(tt=Number(Ht.getAttribute("t")));let Pe=Number(Ht.getAttribute("d")),Te=Number(Ht.getAttribute("r")||0);if(!(Pe>0))return[];if(Te<0){let _e=ne+1<xt.length?xt[ne+1].getAttribute("t"):null,Pi=_e!==null?Number(_e):y*x+k;Te=Math.ceil((Pi-tt)/Pe)-1}if(!(Te>=0))return[];for(let _e=0;_e<=Te;_e++)if(U.push({time:(tt-k)/x,duration:Pe/x,url:O(tt,Pt)}),tt+=Pe,Pt++,U.length>Ue)return[]}return U}let K=Number(S.getAttribute("duration"))/x,Y=Number(S.getAttribute("startNumber")||1);if(!(K>0))return[];let nt=0;S.getAttribute("eptDelta")!==null?nt=Number(S.getAttribute("eptDelta"))/x:nt=(Y-1)*K-k/x,nt<0&&-nt<K||(nt=0);let at=S.getAttribute("endNumber")!==null?Number(S.getAttribute("endNumber")):Y+Math.ceil((y-nt)/K)-1;if(!(at>=Y)||at-Y+1>Ue)return[];for(let tt=Y;tt<=at;tt++)U.push({time:(tt-Y)*K+nt,duration:K,url:O("",tt)});return U}async function M(d,h){if(d.length===0)return null;let y=/<p\b[^>]*>([\s\S]*?)<\/p>/g,f=0,g=await l(d,4,async S=>{if(h!==D)return!0;try{let E=await m(S.url).catch(()=>m(S.url)),x;for(y.lastIndex=0;(x=y.exec(E))!==null;)if(x[1].replace(/<[^>]+>/g,"").trim()!=="")return!0;return!1}catch{return f++,!0}});if(h!==D)throw new Error("superseded");if(f*20>g.length)throw new Error("captions unread");return B.captionBreaks(g,d[0].time,d[0].duration)}async function N(d,h,y,f){if(d.length===0||d.length>ai||y!==1||!(h>0))return null;let g=h,S=B.track(d.length*g,it,ct),E=async O=>(await l(O,1,async J=>{if(f!==D)return!1;let K=await _(d[J].url,h*it,ct);if(K===null&&f===D&&(K=await _(d[J].url,h*it,ct)),K===null)return!1;for(let Y=0;Y<g;Y++)S.add(J*g+Y,o(K,h*it,Y*it));return!0})).every(J=>J),x=d.map((O,U)=>U);if(!await E(x.filter(O=>O%2===0)))throw new Error("thumbnails unread");let k=S.gone();if(k===null)return null;let L=O=>{if(O<0||O>=d.length)return!1;for(let U=O*g;U<(O+1)*g;U++)if(k[U])return!0;return!1};if(!await E(x.filter(O=>O%2===1&&(L(O-1)||L(O+1)))))throw new Error("thumbnails unread");return S.breaks(d[0].time,d[0].duration/g)}async function A(d,h,y){if(Rt.has(h)){It=Rt.get(h),ht="known";return}ht="searching";try{let f=new DOMParser().parseFromString(await m(d),"application/xml").documentElement,g=f?u(f,"Period"):[],S=f?c(f.getAttribute("mediaPresentationDuration")):NaN;if(f&&(f.getAttribute("type")==="dynamic"||!(S>0)))throw new Error("not whole yet");if(!f||g.length!==1){y===D&&(ht="not a recording");return}let E=w(g[0],w(f,d)),x=null,k=null;for(let O of u(g[0],"AdaptationSet")){let U=u(O,"Representation")[0],J=O.getAttribute("mimeType")||U&&U.getAttribute("mimeType")||"",K=O.getAttribute("contentType")||J.split("/")[0];if(K==="text"&&x===null)x=await M(P(O,E,S),y);else if(K==="image"&&k===null){let Y=u(O,"EssentialProperty").concat(U?u(U,"EssentialProperty"):[]).filter(at=>/thumbnail_tile$/.test(at.getAttribute("schemeIdUri")||""))[0],nt=/^(\d+)x(\d+)$/.exec(Y&&Y.getAttribute("value")||"");nt&&(k=await N(P(O,E,S),Number(nt[1]),Number(nt[2]),y))}if(y!==D)return}let L=B.combine(x,k).filter(O=>O[0]>0&&O[1]<S);if(Rt.set(h,L),Rt.size>20&&Rt.delete(Rt.keys().next().value),y!==D)return;It=L,ht="found "+L.length+" (captions "+(x===null?"none":x.length)+", logo "+(k===null?"none":k.length)+")"}catch(f){y===D&&(ht="error: "+String(f&&f.message).slice(0,40),setTimeout(()=>{y===D&&/^error/.test(ht)&&(Mt={url:d,name:h,mine:y})},At*2**Math.min(we++,12)))}}async function T(d){try{let h=new DOMParser().parseFromString(await m(St),"application/xml").documentElement;if(!h||d!==D)return;let y=Date.parse(h.getAttribute("availabilityStartTime")||"")/1e3;if(!isFinite(y)){Ft="no start time";return}let f=u(h,"Period"),g=f.map(x=>c(x.getAttribute("start"))),S=null,E=f.map((x,k)=>{let L=isFinite(g[k])?y+g[k]:S!==null?S:y,O=c(x.getAttribute("duration")),U=isFinite(O)?L+O:k+1<g.length&&isFinite(g[k+1])?y+g[k+1]:null,J=u(x,"EventStream").filter(Y=>(Y.getAttribute("schemeIdUri")||"").indexOf("urn:scte:scte35")===0),K=[];for(let Y of J){let nt=Number(Y.getAttribute("timescale")||1),at=Number(Y.getAttribute("presentationTimeOffset")||0);for(let tt of u(Y,"Event")){let Pt=B.opens(new XMLSerializer().serializeToString(tt));if(Pt===null)continue;let xt=Number(tt.getAttribute("duration")||0)/nt;K.push({at:L+(Number(tt.getAttribute("presentationTime")||0)-at)/nt,duration:xt>0?xt:null,opens:Pt})}}return S=U,{start:L,end:U,marks:K,signalled:J.length>0}});Zt=B.markedBreaks(E),Ft="periods "+f.length+", breaks "+Zt.length,qt&&(se=$(h,y))}catch(h){d===D&&(Ft="error: "+String(h&&h.message).slice(0,40))}}function $(d,h){let y=[],f=Date.now()/1e3,g=w(d,St);for(let S of u(d,"Period")){let E=h+(c(S.getAttribute("start"))||0),x=null,k=null;for(let U of u(S,"AdaptationSet"))if(!(U.getAttribute("contentType")!=="video"&&!/^video\//.test(U.getAttribute("mimeType")||"")))for(let J of u(U,"Representation")){let K=Number(J.getAttribute("bandwidth"));K>0&&(k===null||K<Number(k.getAttribute("bandwidth")))&&(x=U,k=J)}if(k===null)continue;let L=u(x,"SegmentTemplate")[0]||u(k,"SegmentTemplate")[0];if(!L||!u(L,"SegmentTimeline")[0])continue;let O=w(k,w(x,w(S,g)));for(let U of P(x,O,f-E,k))y.push({time:E+U.time,duration:U.duration,url:U.url})}return y}async function F(d,h){let y=new AbortController,f=setTimeout(()=>y.abort(),ce);try{let g=await fetch(d,{credentials:"omit",headers:{Range:"bytes=0-"+(h-1)},signal:y.signal});if(!g.ok)return null;let S=new Uint8Array(await g.arrayBuffer());return S.length>h?S.subarray(0,h):S}catch{return null}finally{clearTimeout(f)}}async function Nt(d){let h=await F(d.url,si);if(h===null)return null;let y=B.moofEnd(h);if(y===null||(y>h.length&&(h=await F(d.url,y)),h===null))return null;let f=B.frameSizes(h);return f===null||f.length===0?null:B.separatorEnds(f,d.time,d.duration/f.length)}async function ke(d,h,y){let f=d-le,g=Math.min(h-ni,d+le),S=se.filter(k=>k.time+k.duration>f&&k.time<g&&(!yt.has(k.time)||vt.has(k.time)&&vt.get(k.time)<lt)),E=await l(S,6,Nt);if(y!==D)return;S.forEach((k,L)=>{E[L]===null?vt.set(k.time,(vt.get(k.time)||0)+1):vt.delete(k.time),yt.set(k.time,E[L]||[])});for(let k of Array.from(yt.keys()))k<d-2*le&&yt.delete(k);for(let k of Array.from(vt.keys()))k<d-2*le&&vt.delete(k);let x=[];for(let k of yt.values())for(let L of k)x.push(L);Vt=B.separatedBreaks(x),ie="segments "+yt.size+", breaks "+Vt.length}async function Gt(d,h,y){let f=[];for(let x=d;x<=h;x+=4)(!ut.has(x)||mt.has(x)&&mt.get(x)<lt)&&f.push(x);if(f.length===0)return;let g=Z,S=dt,E=await l(f,4,async x=>{if(y!==D)return null;let k=await _(S+"/"+x,it,ct);if(k===null)return null;let L=o(k,it,0);return[B.score(g,L),g.lower?B.score(g.lower,L):null]});y!==D||g!==Z||f.forEach((x,k)=>{E[k]===null?mt.set(x,(mt.get(x)||0)+1):mt.delete(x),ut.set(x,E[k]===null?g.usual:E[k][0]),g.lower&&kt.set(x,E[k]===null?g.lower.usual:E[k][1])})}async function pe(d,h){let y=dt;return(await l(d,4,async f=>{if(h!==D)return null;let g=await _(y+"/"+f,it,ct);return g===null?null:o(g,it,0)})).filter(f=>f!==null)}function Ee(d){if(d.length===0)return null;let h=B.track(d.length,it,ct);return d.forEach((y,f)=>h.add(f,y)),h.logo()}async function Be(d,h,y){let f=[];for(let x=d-1200;x<=Math.min(h,d+1200);x+=28)f.push(x);let g=await pe(f,y);if(y!==D)return;if(g.length===0){C(d);return}let S=Ee(g);S!==null&&S.channel&&he.set(dt,B.alone(S));let E=null;if(S===null){let x=he.get(dt);if(x&&B.seenIn(x,g,.4))E=x;else if(ue!==dt){let k=await G(d,y);if(y!==D)return;k!==null&&(he.set(dt,k),B.seenIn(k,g,.4)&&(E=k))}}Bt=d,Z=E||S,ut=new Map,kt=new Map,mt=new Map,te=Z===null?"none in "+g.length+" pictures":"strength "+Math.round(Z.strength)+(Z.lower?", lower one "+Math.round(Z.lower.strength):"")+(E!==null?", kept":""),Z===null?C(d):zt=0}function C(d){Bt=d-900+Math.min(900,120*2**zt),120*2**zt<900&&zt++}async function G(d,h){let y=null;for(let f=0;f<3;f++){let g=d-1200-f*2*1200,S=[];for(let k=g-2*1200;k<g;k+=28)S.push(k);let E=await pe(S,h);if(h!==D)return null;if(E.length===0){if(f===0)return null;break}let x=Ee(E);if(x!==null&&x.channel){y=B.alone(x);break}}return ue=dt,y}function z(d){let h=d;for(;ut.has(h-4);)h-=4;let y=[],f=[];for(let S=h;ut.has(S);S+=4)y.push(ut.get(S)),Z.lower&&f.push(kt.has(S)?kt.get(S):Z.lower.usual);let g=y.map(()=>!0);return{first:h,gone:B.gone(y,Z.usual,g),lowerGone:Z.lower?B.gone(f,Z.lower.usual,g):null}}async function X(d,h,y){let f=Math.floor(d/4)*4,g=Math.floor((h-12)/4)*4;if(f>g)return;let S=Math.abs(f-Bt),E=$t.some(k=>k[0]<=f&&f<=k[1])&&S<=900+B.LOGO_MAX_S;if(S>900&&!E&&await Be(f,g,y),Z===null||y!==D)return;await Gt(f-64,Math.min(g,f+88),y);for(let k=0;k<4;k++){if(y!==D||!ut.has(f))return;let L=z(f),O=L.gone.length,U=L.first+O*4,J=B.runs(B.solid(L.gone),B.BRIDGE).concat(L.lowerGone?B.runs(B.solid(L.lowerGone),B.BRIDGE):[]),K=J.some(at=>at[1]+B.AROUND>=O&&(O-at[0])*4<=_t),Y=(f-L.first)/4,nt=J.some(at=>at[0]<B.AROUND&&at[1]>=Y&&(at[1]+1)*4<=_t);if(K&&U<=g)await Gt(U,Math.min(g,U+120),y);else if(nt&&L.first>f-_t)await Gt(L.first-120,L.first-4,y);else break}if(y!==D||Z===null||!ut.has(f))return;let x=z(f);$t=B.logoBreaks(x.gone,x.first,4,x.lowerGone);for(let k of Array.from(ut.keys()))k<f-ft&&ut.delete(k);for(let k of Array.from(kt.keys()))k<f-ft&&kt.delete(k);for(let k of Array.from(mt.keys()))k<f-ft&&mt.delete(k)}function q(){let d=a.liveRange(),h=a.currentTime();if(!d||typeof h!="number"||!isFinite(h)||!isFinite(d.end))return null;let y=a.absoluteTime(h),f=a.absoluteTime(d.end),g=Date.now()/1e3;return typeof y!="number"||typeof f!="number"||!(y>g-86400&&y<g+600)||!(f>=y)?null:{at:y,end:f}}async function Q(d){if(ee!==d){ee=d;try{let h=q();if(h===null||h.end-h.at<=60)return;Date.now()-de>=ri&&St&&(de=Date.now(),await T(d)),qt&&d===D&&await ke(h.at,h.end,d),dt!==null&&d===D&&await X(h.at,h.end,d)}catch(h){te="error: "+String(h&&h.message).slice(0,40)}finally{ee===d&&(ee=0)}}}function H(){let d=null;try{let h=a.state();if(Ut!==null&&(h==="playing"||h==="paused")){let y=a.currentTime();if(Mt!==null&&h==="playing"){let g=Mt;Mt=null,g.mine===D&&A(g.url,g.name,g.mine)}let f=g=>[g[0],g[1]-32];if(Dt){if(!a.joining()){let g=q();if(g!==null){let S=x=>g.at>=x[0]&&g.at<x[1]-1&&x[1]<=g.end-2,E=Zt.filter(S)[0]||Vt.filter(S)[0]||$t.map(f).map(x=>B.reachSeparated(x,Vt)).filter(S)[0];if(E){let x=a.mediaTime(E[1]);typeof x=="number"&&isFinite(x)&&x>y&&(d=x)}}Date.now()-Se>=oi&&(Se=Date.now(),Q(D))}}else{let g=It.map(f).filter(S=>y>=S[0]&&y<S[1]-1)[0];g&&(d=g[1])}}}catch{d=null}bt=d,jt=a.show(bt!==null)}function V(){if(bt===null||!jt)return!1;let d=bt;return bt=null,jt=a.show(!1),a.seek(d),!0}function W(){let d={live:Dt,offered:bt!==null,skip_to:bt};if(Dt){d.marked=Ft,d.logo=dt===null?"no pictures":te,d.found=$t.length,qt&&(d.separators=ie);try{let h=q();d.clock=h===null?"none":Math.round(Date.now()/1e3-h.end)+" s behind at the live point"}catch{d.clock="error"}}else d.recording=ht,d.breaks=It.map(h=>[Math.round(h[0]),Math.round(h[1])]);return d}return{load:Fe,tick:H,skip:V,report:W}}var Ei="0.1.22";function Di(){let a=navigator.userAgent||"",t=/Android|iPhone|iPad|iPod|Mobile/i.test(a),e=/wv|WebView/i.test(a)||window.navigator.standalone===!0;return t||e}var Fi={fr:"Francais",fra:"Francais",fre:"Francais",en:"English",eng:"English",de:"Deutsch",deu:"Deutsch",ger:"Deutsch",es:"Espanol",spa:"Espanol",it:"Italiano",ita:"Italiano",pt:"Portugues",por:"Portugues",qaa:"Original",und:"Indefini",mul:"Multiple"};function ki(a){if(!a)return"Inconnu";let t=a.toLowerCase();return Fi[t]||a.toUpperCase()}function Le(a){let t=a.split(":");if(t.length<2)return null;let e=t.slice(1).join(":");try{let i=e,s=e.length%4;s&&(i+="=".repeat(4-s));let n=atob(i.replace(/-/g,"+").replace(/_/g,"/"));return JSON.parse(n)}catch{return null}}var ii=class extends Jt{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},panel:{type:Object},_channels:{type:Array},_loading:{type:Boolean},_error:{type:String},_playing:{type:Boolean},_selectedChannel:{type:Object},_streamData:{type:Object},_isFullscreen:{type:Boolean},_playerError:{type:String},_playerLoading:{type:Boolean},_currentTime:{type:Number},_duration:{type:Number},_volume:{type:Number},_muted:{type:Boolean},_paused:{type:Boolean},_audioTracks:{type:Array},_textTracks:{type:Array},_selectedAudioIndex:{type:Number},_selectedTextIndex:{type:Number},_isLive:{type:Boolean},_programStart:{type:Number},_programEnd:{type:Number},_showAudioMenu:{type:Boolean},_showTextMenu:{type:Boolean},_expandedChannels:{type:Object},_channelPrograms:{type:Object},_loadingPrograms:{type:Object},_searchQuery:{type:String},_searchResults:{type:Array},_searching:{type:Boolean},_showingSearch:{type:Boolean},_expandedResults:{type:Object},_resultEpisodes:{type:Object},_loadingEpisodes:{type:Object},_castTargets:{type:Array},_selectedTarget:{type:String},_activeTab:{type:String},_recordings:{type:Array},_loadingRecordings:{type:Boolean},_expandedRecordings:{type:Object},_recordingEpisodes:{type:Object},_loadingRecordingEpisodes:{type:Object},_castPlaying:{type:Boolean},_castTarget:{type:String},_castTitle:{type:String},_activeCasts:{type:Object},_focusedCastHost:{type:String},_localPlaybackInitiated:{type:Boolean},_localMinimized:{type:Boolean},_castMinimized:{type:Boolean},_castLoading:{type:Boolean},_tonightChannels:{type:Array},_loadingTonight:{type:Boolean},_episodePlaylist:{type:Array},_episodeIndex:{type:Number},_selectedEntityId:{type:String}}}static get styles(){return xi`
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
    `}constructor(){super(),this._boundOnFullscreenChange=this._onFullscreenChange.bind(this),this._boundOnDocumentClick=this._onDocumentClick.bind(this),this._channels=[],this._loading=!0,this._error=null,this._playing=!1,this._selectedChannel=null,this._streamData=null,this._isFullscreen=!1,this._playerError=null,this._playerLoading=!1,this._player=null,this._entityUnsubscribe=null,this._showPlayOverlay=!1,this._adSkip=null,this._adOffer=!1,this._castSkipTo=null,this._currentTime=0,this._duration=0,this._volume=.5,this._muted=!1,this._paused=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._liveDelay=0,this._showAudioMenu=!1,this._showTextMenu=!1,this._updateInterval=null,this._expandedChannels={},this._channelPrograms={},this._loadingPrograms={},this._searchQuery="",this._searchResults=[],this._searching=!1,this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._searchToken=0,this._castTargets=[],this._isMobile=Di(),this._selectedTarget=this._isMobile?"":"local",this._activeTab="live",this._recordings=[],this._loadingRecordings=!1,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castProgressInterval=null,this._castBasePosition=0,this._castPositionUpdatedAt=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._castMinimized=!1,this._castLoading=!1,this._tonightChannels=[],this._loadingTonight=!1,this._episodePlaylist=[],this._episodeIndex=-1,this._episodeParentTitle="",this._episodeIsRecording=!1,this._sessionId=this._generateSessionId(),this._selectedEntityId=localStorage.getItem("molotov_selected_entity")||""}_generateSessionId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"molotov-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10)}connectedCallback(){super.connectedCallback(),console.log(`[Molotov Panel] Connected - v${Ei}`),this._hasLoadedChannels=!1,document.addEventListener("fullscreenchange",this._boundOnFullscreenChange),document.addEventListener("click",this._boundOnDocumentClick)}disconnectedCallback(){if(super.disconnectedCallback(),this._playing){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"})}this._cleanupPlayer(),this._stopCastProgressUpdate(),document.removeEventListener("fullscreenchange",this._boundOnFullscreenChange),document.removeEventListener("click",this._boundOnDocumentClick),this._entityUnsubscribe&&(this._entityUnsubscribe(),this._entityUnsubscribe=null)}_onDocumentClick(t){t.composedPath().some(e=>e.classList?.contains("track-menu-container"))||(this._showAudioMenu=!1,this._showTextMenu=!1,this.requestUpdate())}updated(t){t.has("hass")&&this.hass&&(this._hasLoadedChannels||(this._hasLoadedChannels=!0,this._loadChannels()),this._syncWithEntity())}async _loadChannels(){this._loading=!0,this._error=null;try{let t=this._getEntityId();if(!t)throw new Error("Entite Molotov TV introuvable");console.log(`[Molotov Panel] Loading channels for ${t}`);let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"now_playing",media_content_type:"directory"});e&&e.children?(this._channels=e.children.map(i=>this._parseChannel(i)),console.log(`[Molotov Panel] Loaded ${this._channels.length} channels`),this._channels.length>0&&await this._fetchCastTargets(t,this._channels[0].mediaContentId)):this._channels=[],this._loading=!1}catch(t){console.error("[Molotov Panel] Failed to load channels:",t),this._error=t.message||"Erreur lors du chargement des chaines",this._loading=!1}}async _fetchCastTargets(t,e){try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:e,media_content_type:"program"});if(i&&i.children){let s=i.children.filter(n=>n.media_content_id.startsWith("cast:")).map(n=>({mediaContentId:n.media_content_id,title:n.title}));this._castTargets=s,this._isMobile&&s.length>0&&(!this._selectedTarget||this._selectedTarget==="local")&&(this._selectedTarget=s[0].mediaContentId),console.log(`[Molotov Panel] Found ${s.length} cast targets`)}}catch(i){console.error("[Molotov Panel] Failed to fetch cast targets:",i),this._castTargets=[]}}_handleTargetChange(t){let e=t.target.value;this._isMobile&&e==="local"||(this._selectedTarget=e,console.log(`[Molotov Panel] Selected target: ${this._selectedTarget}`))}_switchTab(t){this._activeTab=t,t==="recordings"&&this._recordings.length===0&&this._loadRecordings(),t==="tonight"&&this._tonightChannels.length===0&&this._loadTonight(),this.requestUpdate()}async _loadRecordings(){let t=this._getEntityId();if(!t)return;this._loadingRecordings=!0,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this.requestUpdate();try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"recordings",media_content_type:"directory"});i&&i.children?(this._recordings=i.children.map(s=>{let n=Le(s.media_content_id);return{mediaContentId:s.media_content_id,title:s.title,thumbnail:s.thumbnail,description:n?.desc||null,isFolder:!!n?.folder}}),console.log(`[Molotov Panel] Loaded ${this._recordings.length} recordings`)):this._recordings=[]}catch(i){console.error("[Molotov Panel] Failed to load recordings:",i),this._recordings=[]}this._loadingRecordings=!1,this.requestUpdate();let e=this._recordings.filter(i=>i.isFolder);e.length>0&&(await Promise.all(e.map(i=>this._fetchRecordingEpisodes(i))),this.requestUpdate())}async _loadTonight(){let t=this._getEntityId();if(t){this._loadingTonight=!0,this.requestUpdate();try{let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"tonight_epg",media_content_type:"directory"});if(e&&e.children&&e.children.length>0){let i=new Map;for(let n of e.children){if(!n.media_content_id.startsWith("tonight_program:"))continue;let r=n.media_content_id.split(":");if(r.length<6)continue;let p=r[1],v=decodeURIComponent(r[2]),I=decodeURIComponent(r[3]),j=parseInt(r[4])*1e3,R=parseInt(r[5])*1e3,st=r.length>6?decodeURIComponent(r.slice(6).join(":")):"",et=n.title;et.startsWith("\u{1F534} ")&&(et=et.substring(3));let rt=et.match(/^\d{2}:\d{2}-\d{2}:\d{2}\s+(.+)$/);rt&&(et=rt[1]);let ot={mediaContentId:n.media_content_id,title:et,thumbnail:n.thumbnail,start:j,end:R,description:st};i.has(p)||i.set(p,{id:p,name:v,thumbnail:I,programs:[]}),i.get(p).programs.push(ot)}let s=Array.from(i.values());for(let n of s)n.programs.sort((r,p)=>r.start-p.start);this._tonightChannels=s,console.log(`[Molotov Panel] Loaded tonight EPG for ${s.length} channels`)}else this._tonightChannels=[]}catch(e){console.error("[Molotov Panel] Failed to load tonight EPG:",e),this._tonightChannels=[]}this._loadingTonight=!1,this.requestUpdate()}}async _toggleRecordingExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedRecordings[i]){this._expandedRecordings={...this._expandedRecordings,[i]:!1},this.requestUpdate();return}if(!e.isFolder){await this._playRecordingDirectly(e);return}this._recordingEpisodes[i]||await this._fetchRecordingEpisodes(e);let s=this._recordingEpisodes[i]||[];if(s.length===0){console.log("[Molotov Panel] No episodes found, playing recording directly"),await this._playRecordingDirectly(e);return}if(s.length===1){console.log("[Molotov Panel] Only 1 episode found, playing it directly"),await this._playRecordingEpisode(s[0],e.title);return}this._expandedRecordings={...this._expandedRecordings,[i]:!0},this.requestUpdate()}async _playRecordingDirectly(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:"",currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=t.mediaContentId;i.startsWith("recording:")&&(i=i.substring(10));let s=this._buildPlayMediaId(`replay:${i}`);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:s,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play recording failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}async _fetchRecordingEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"recording"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._recordingEpisodes={...this._recordingEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for recording "${t.title}"`)}else this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch recording episodes:",s),this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!1},this.requestUpdate()}async _playRecordingEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._recordingEpisodes,!0),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play recording episode failed:",s),this._playerError=s.message||"Erreur de lecture",this._castLoading=!1}}}_buildPlayMediaId(t){if(this._selectedTarget==="local")return`play_local:${this._sessionId}:${t}`;let e=this._selectedTarget.split(":");if(e.length>=2){let i=e[1],s=e.length>=3&&e[2]!=="native"&&e[2]!=="custom"?"":e[2];return s?`cast:${i}:${s}:${t}`:`cast:${i}:${t}`}return`play_local:${t}`}_isLocalPlayback(){return this._selectedTarget==="local"}_parseEpisodeChildren(t){return t.filter(e=>e.media_content_id.startsWith("episode:")||e.media_content_id.startsWith("replay:")||e.media_content_id.startsWith("recording:")||e.can_play).map(e=>{let i=Le(e.media_content_id);return{mediaContentId:e.media_content_id,title:e.title,thumbnail:e.thumbnail,description:i?.desc||null}})}_initPlaybackFlags(){this._isLocalPlayback()?(this._localPlaybackInitiated=!0,this._localMinimized=!1):this._castLoading=!0}_parseChannel(t){let e=t.media_content_id,[i,s]=e.split("|"),n=null;if(s)try{let et=s,rt=s.length%4;rt&&(et+="=".repeat(4-rt)),n=decodeURIComponent(escape(atob(et.replace(/-/g,"+").replace(/_/g,"/"))))}catch{}let r=i.split(":"),p,v,I;r[0]==="program"?(p=r[1],v=r[2]?parseInt(r[2])*1e3:null,I=r[3]?parseInt(r[3])*1e3:null):r[0]==="live"&&(p=r[1]);let j=t.title.split(" - "),R=j[0],st=j.slice(1).join(" - ")||"Direct";return{id:p,name:R,thumbnail:t.thumbnail,mediaContentId:i,currentProgram:{title:st,description:n,start:v,end:I},nextProgram:null}}_getMolotovEntities(){return!this.hass||!this.hass.states?[]:Object.keys(this.hass.states).filter(t=>t.startsWith("media_player.molotov")).sort()}_getEntityId(){let t=this._getMolotovEntities();return t.length===0?null:t.length===1?t[0]:this._selectedEntityId&&t.includes(this._selectedEntityId)?this._selectedEntityId:t[0]}_handleEntityChange(t){let e=this._getEntityId();this._playing&&e&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState(),this._selectedEntityId=t.target.value,localStorage.setItem("molotov_selected_entity",this._selectedEntityId),this._hasLoadedChannels=!1,this._channels=[],this._recordings=[],this._tonightChannels=[],this._channelPrograms={},this._expandedChannels={},this._loadingPrograms={},this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._loadChannels()}async _toggleChannelExpand(t,e){t.stopPropagation();let i=e.id;if(this._expandedChannels[i]){this._expandedChannels={...this._expandedChannels,[i]:!1},this.requestUpdate();return}this._expandedChannels={...this._expandedChannels,[i]:!0},this._channelPrograms[i]||await this._fetchChannelPrograms(e),this.requestUpdate()}async _fetchChannelPrograms(t){let e=this._getEntityId();if(!e)return;let i=t.id;this._loadingPrograms={...this._loadingPrograms,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`channel:${i}`,media_content_type:"channel"});if(s&&s.children){let n=s.children.filter(r=>r.media_content_id.startsWith("replay:")).map(r=>this._parseReplayItem(r,t));this._channelPrograms={...this._channelPrograms,[i]:n}}}catch(s){console.error("[Molotov Panel] Failed to fetch channel replays:",s),this._channelPrograms={...this._channelPrograms,[i]:[]}}this._loadingPrograms={...this._loadingPrograms,[i]:!1},this.requestUpdate()}_parseReplayItem(t,e){let i=Le(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,channelName:e.name,description:i?.desc||null}}async _playReplay(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:t.channelName,currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play replay failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}_handleSearchInput(t){this._searchQuery=t.target.value}_handleSearchKeydown(t){t.key==="Enter"&&this._performSearch()}async _performSearch(){let t=this._searchQuery.trim();if(!t)return;let e=this._getEntityId();if(!e)return;let i=++this._searchToken;this._searching=!0,this._showingSearch=!0,this._searchResults=[],this._expandedResults={},this._resultEpisodes={},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`search:${encodeURIComponent(t)}`,media_content_type:"search"});if(i!==this._searchToken)return;if(s&&s.children){let n=s.children.filter(p=>p.media_content_id.startsWith("search_result:")).map(p=>this._parseSearchResult(p)),r=await this._filterResultsWithEpisodes(n,e,i);if(i!==this._searchToken)return;this._searchResults=r,console.log(`[Molotov Panel] Found ${this._searchResults.length} results with episodes for "${t}"`)}else this._searchResults=[]}catch(s){if(i!==this._searchToken)return;console.error("[Molotov Panel] Search failed:",s),this._searchResults=[]}i===this._searchToken&&(this._searching=!1,this.requestUpdate())}async _filterResultsWithEpisodes(t,e,i){let s=t.map(async r=>{try{let p=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:r.mediaContentId,media_content_type:"search_result"});if(p&&p.children){let v=this._parseEpisodeChildren(p.children);if(v.length>0)return(i===void 0||i===this._searchToken)&&(this._resultEpisodes={...this._resultEpisodes,[r.mediaContentId]:v}),r}return null}catch(p){return console.error(`[Molotov Panel] Failed to check episodes for "${r.title}":`,p),null}});return(await Promise.all(s)).filter(r=>r!==null)}_parseSearchResult(t){let e=Le(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,mediaClass:t.media_class,description:e?.desc||null}}_clearSearch(){this._searchToken++,this._searchQuery="",this._searchResults=[],this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this.requestUpdate()}async _toggleResultExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedResults[i]){this._expandedResults={...this._expandedResults,[i]:!1},this.requestUpdate();return}this._expandedResults={...this._expandedResults,[i]:!0},this._resultEpisodes[i]||await this._fetchResultEpisodes(e),this.requestUpdate()}async _fetchResultEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingEpisodes={...this._loadingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"search_result"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._resultEpisodes={...this._resultEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for "${t.title}"`)}else this._resultEpisodes={...this._resultEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch episodes:",s),this._resultEpisodes={...this._resultEpisodes,[i]:[]}}this._loadingEpisodes={...this._loadingEpisodes,[i]:!1},this.requestUpdate()}_setEpisodePlaylist(t,e,i,s){for(let n of Object.values(i)){let r=n.findIndex(p=>p.mediaContentId===t.mediaContentId);if(r!==-1){this._episodePlaylist=n,this._episodeIndex=r,this._episodeParentTitle=e,this._episodeIsRecording=s;return}}this._episodePlaylist=[],this._episodeIndex=-1}async _playEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._resultEpisodes,!1),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play episode failed:",s),this._playerError=s.message||"Erreur de lecture"}}}_syncWithEntity(){let t=this._getEntityId();if(!t||!this.hass?.states?.[t])return;let e=this.hass.states[t],s=(e.attributes.local_streams||{})[this._sessionId];if(s&&s.url&&this._localPlaybackInitiated){let n=s.url,r=s.drm,p=s.selected_track;if(!this._playing||this._currentStreamUrl!==n){this._currentStreamUrl=n,this._streamData={url:n,drm:r,selectedTrack:p,title:e.attributes.media_title||"En direct",breakSearch:{live_thumbnails_url:s.live_thumbnails_url,recording:s.recording,separated_breaks:s.separated_breaks}},this._playing=!0,this._localMinimized=!1,this._playerError=null,this._playerLoading=!0;let v=this._selectedChannel;v?.currentProgram?.start&&v?.currentProgram?.end?(this._isLive=!0,this._programStart=v.currentProgram.start,this._programEnd=v.currentProgram.end):(this._isLive=!0,this._programStart=null,this._programEnd=null),this.updateComplete.then(()=>this._initDashPlayer())}}else this._playing&&(this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1);if(e.attributes.active_casts&&Object.keys(e.attributes.active_casts).length>0){let n=e.attributes.active_casts,r=e.attributes.cast_target;this._activeCasts=n,this._focusedCastHost=r||null;let p=r?n[r]?.skip_to:null;this._castSkipTo=typeof p=="number"?p:null,(!this._castPlaying||this._castTarget!==r)&&(this._castPlaying=!0,this._castMinimized=this._isMobile,this._castLoading=!1,this._castTarget=r,this._castTitle=e.attributes.media_title||"En cours de lecture",this._startCastProgressUpdate(),console.log("[Molotov Panel] Cast playback detected:",r,"total casts:",Object.keys(n).length)),this._castPositionUpdatedAt=e.attributes.media_position_updated_at?new Date(e.attributes.media_position_updated_at).getTime()/1e3:null,this._castBasePosition=e.attributes.media_position||0,this._duration=e.attributes.media_duration||0,this._volume=e.attributes.volume_level??.5,this._muted=e.attributes.is_volume_muted||!1,this._paused=e.state==="paused",this._castTitle=e.attributes.media_title||this._castTitle,this._isLive=e.attributes.is_live||!1}else this._castPlaying&&(this._onPlaybackEnded()||(this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._castMinimized=!1,this._castLoading=!1,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate()))}async _playChannel(t){let e=this._getEntityId();if(!e){console.error("[Molotov Panel] No entity found");return}this._selectedChannel=t,this._playerError=null,this._episodePlaylist=[],this._episodeIndex=-1,this._initPlaybackFlags(),this._isLocalPlayback()&&t.currentProgram?.start&&t.currentProgram?.end&&(this._programStart=t.currentProgram.start,this._programEnd=t.currentProgram.end,this._isLive=!0);try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}async _initDashPlayer(){if(!this._streamData)return;let t=this.shadowRoot.querySelector("video");if(!t){console.error("[Molotov Panel] Video element not found");return}window.dashjs||await this._loadDashJs(),this._player&&(this._player.reset(),this._player=null),this._adSkip=null,this._adOffer=!1,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null);try{let e=window.dashjs.MediaPlayer().create();this._player=e,e.updateSettings({debug:{logLevel:window.dashjs.Debug.LOG_LEVEL_WARNING},streaming:{buffer:{stableBufferTime:6,bufferTimeAtTopQuality:30,bufferTimeAtTopQualityLongForm:60},delay:{liveDelay:3}}});let i=this._streamData.drm;i&&i.type==="widevine"&&(console.log("[Molotov Panel] Configuring Widevine DRM"),e.setProtectionData({"com.widevine.alpha":{serverURL:i.license_url,httpRequestHeaders:i.headers||{}}})),e.initialize(t,this._streamData.url,!0),this._adSkip=Si(this._adSkipEnv(t,e));let s=this._streamData.selectedTrack,n="fr";s?.track_audio&&(n=s.track_audio),e.setInitialMediaSettingsFor("audio",{lang:n}),s?.track_text&&e.setInitialMediaSettingsFor("text",{lang:s.track_text}),e.on(window.dashjs.MediaPlayer.events.ERROR,r=>{let p=r.error?.message||r.error||"Erreur de lecture";console.error("[Molotov Panel] Player error:",p),this._playerError=p,this._playerLoading=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.STREAM_INITIALIZED,()=>{console.log("[Molotov Panel] Stream initialized"),this._player===e&&this._adSkip&&this._adSkip.load({contentId:this._streamData.url},this._streamData.breakSearch),this._enforceAudioLanguage(e,s),this._updateTracks(),this._startProgressUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_STARTED,()=>{console.log("[Molotov Panel] Playback started"),this._showPlayOverlay=!1,this._playerLoading=!1,this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PAUSED,()=>{this._paused=!0,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PLAYING,()=>{this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_ENDED,()=>{console.log("[Molotov Panel] Playback ended"),this._onPlaybackEnded()}),t.volume=this._volume,t.muted=this._muted,this._autoplayCheckTimeout=setTimeout(()=>{this._autoplayCheckTimeout=null,t.paused&&!t.currentTime&&(console.log("[Molotov Panel] Autoplay blocked"),this._showPlayOverlay=!0,this.requestUpdate())},1500)}catch(e){console.error("[Molotov Panel] Failed to init player:",e),this._playerError=e.message}}_adSkipEnv(t,e){let i=()=>{try{let s=e.timeAsUTC();return typeof s=="number"&&isFinite(s)?s:null}catch{return null}};return{isLive:()=>{try{return e.isDynamic()}catch{return!1}},joining:()=>this._playerLoading,state:()=>t.paused?"paused":t.readyState>=2?"playing":"other",currentTime:()=>t.currentTime,liveRange:()=>t.seekable&&t.seekable.length?{start:t.seekable.start(0),end:t.seekable.end(t.seekable.length-1)}:null,absoluteTime:s=>{let n=i();return n===null?null:n+(s-t.currentTime)},mediaTime:s=>{let n=i();return n===null?null:t.currentTime+(s-n)},show:s=>(this._adOffer!==s&&(this._adOffer=s,this.requestUpdate()),s),seek:s=>{t.currentTime=s}}}_startProgressUpdate(){this._updateInterval&&clearInterval(this._updateInterval),this._updateInterval=setInterval(()=>{this._updateProgress()},1e3)}_updateProgress(){let t=this.shadowRoot?.querySelector("video");if(!(!t||!this._player)){if(this._currentTime=t.currentTime,this._duration=t.duration||0,this._paused=t.paused,this._adSkip&&this._adSkip.tick(),this._isLive&&t.seekable&&t.seekable.length>0){let e=t.seekable.end(t.seekable.length-1);this._liveDelay=Math.max(0,(e-t.currentTime)*1e3)}this.requestUpdate()}}_startCastProgressUpdate(){this._stopCastProgressUpdate(),this._castProgressInterval=setInterval(()=>{this._updateCastProgress()},1e3)}_stopCastProgressUpdate(){this._castProgressInterval&&(clearInterval(this._castProgressInterval),this._castProgressInterval=null)}_updateCastProgress(){if(!this._castPlaying){this._stopCastProgressUpdate();return}if(this._castBasePosition!=null&&this._castPositionUpdatedAt&&!this._paused){let t=Date.now()/1e3,e=Math.max(0,t-this._castPositionUpdatedAt);this._currentTime=this._castBasePosition+e}else this._currentTime=this._castBasePosition||0;this.requestUpdate()}_updateTracks(){if(!this._player)return;let t=this._player.getTracksFor("audio")||[];this._audioTracks=t.map((n,r)=>({index:r,lang:n.lang,label:ki(n.lang)}));let e=this._player.getCurrentTrackFor("audio");e&&(this._selectedAudioIndex=t.findIndex(n=>n.index===e.index));let i=this._player.getTracksFor("text")||[];if(this._textTracks=i.map((n,r)=>({index:r,lang:n.lang,label:ki(n.lang)})),!this._player.isTextEnabled())this._selectedTextIndex=-1;else{let n=this._player.getCurrentTrackFor("text");n&&(this._selectedTextIndex=i.findIndex(r=>r.index===n.index))}console.log("[Molotov Panel] Audio tracks:",this._audioTracks),console.log("[Molotov Panel] Text tracks:",this._textTracks),this.requestUpdate()}_enforceAudioLanguage(t,e){let i=t.getTracksFor("audio");if(!i||i.length===0)return;let n=t.getCurrentTrackFor("audio")?.lang||"",r="fr";if(e?.track_audio&&(r=e.track_audio),n!==r&&n!=="fra"&&n!=="fre"){let p=i.find(v=>v.lang===r||v.lang==="fra"||v.lang==="fre");!p&&(n==="en"||n==="eng"||n==="qaa")&&(p=i.find(v=>v.lang!=="en"&&v.lang!=="eng"&&v.lang!=="qaa")),p&&(console.log("[Molotov Panel] Switching audio to:",p.lang),t.setCurrentTrack(p))}}_loadDashJs(){return new Promise((t,e)=>{if(window.dashjs){t();return}let i=document.createElement("script");i.src="https://cdn.dashjs.org/v4.7.4/dash.all.min.js",i.crossOrigin="anonymous",i.onload=()=>{console.log("[Molotov Panel] dash.js loaded"),t()},i.onerror=()=>{e(new Error("Failed to load dash.js"))},document.head.appendChild(i)})}_cleanupPlayer(){if(this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null),this._player){try{this._player.reset()}catch{}this._player=null}this._adSkip=null,this._adOffer=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._playerLoading=!1}_stopPlayback(){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState()}_resetLocalPlaybackState(){this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._selectedChannel=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._episodePlaylist=[],this._episodeIndex=-1}_onPlaybackEnded(){if(this._episodePlaylist.length===0||this._episodeIndex<0)return!1;let t=this._episodeIndex+1;if(t>=this._episodePlaylist.length)return this._episodePlaylist=[],this._episodeIndex=-1,!1;let e=this._episodePlaylist[t];return this._episodeIndex=t,console.log(`[Molotov Panel] Auto-playing next episode: ${e.title}`),this._episodeIsRecording?this._playRecordingEpisode(e,this._episodeParentTitle):this._playEpisode(e,this._episodeParentTitle),!0}_goBackFromPlayer(){this._localMinimized=!0,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null)}_goBackFromCast(){this._castMinimized=!0}_expandCurrentPlayback(){this._playing&&this._streamData?(this._localMinimized=!1,this._updateInterval||this._startProgressUpdate()):this._castPlaying&&(this._castMinimized=!1)}_togglePlayPause(){let t=this.shadowRoot.querySelector("video");t&&(t.paused?t.play():t.pause())}_localSeek(t){let e=this.shadowRoot.querySelector("video");if(!e)return;if(t===null){e.currentTime=0;return}let i=e.currentTime+t;e.currentTime=Math.max(0,Math.min(e.duration||1/0,i))}_localSeekBeginning(){this._localSeek(null)}_localSkipBack30(){this._localSeek(-30)}_localSkipBack10(){this._localSeek(-10)}_localSkipForward30(){this._localSeek(30)}_localSkipAd(){this._adSkip&&this._adSkip.skip()}_handleProgressClick(t){let i=t.currentTarget.getBoundingClientRect(),s=(t.clientX-i.left)/i.width;if(this._isLive&&this._programStart&&this._programEnd){if(this._player?.getDVRSeekOffset?.(0)!==void 0){let r=this._player.duration(),p=s*r;this._player.seek(p)}}else if(this._duration){let n=this.shadowRoot.querySelector("video");n&&(n.currentTime=s*this._duration)}}_handleVolumeChange(t){let e=parseFloat(t.target.value);this._volume=e;let i=this.shadowRoot.querySelector("video");i&&(i.volume=e,i.muted=e===0,this._muted=e===0)}_toggleMute(){let t=this.shadowRoot.querySelector("video");t&&(this._muted=!this._muted,t.muted=this._muted,this.requestUpdate())}_selectAudioTrack(t){if(!this._player||t<0||t>=this._audioTracks.length)return;let e=this._player.getTracksFor("audio");e&&e[t]&&(this._player.setCurrentTrack(e[t]),this._selectedAudioIndex=t),this._showAudioMenu=!1,this.requestUpdate()}_selectTextTrack(t){if(this._player){if(t===-1)this._player.enableText(!1),this._selectedTextIndex=-1;else if(t>=0&&t<this._textTracks.length){let e=this._player.getTracksFor("text");e&&e[t]&&(this._player.enableText(!0),this._player.setCurrentTrack(e[t]),this._selectedTextIndex=t)}this._showTextMenu=!1,this.requestUpdate()}}_toggleAudioMenu(t){t.stopPropagation(),this._showAudioMenu=!this._showAudioMenu,this._showTextMenu=!1,this.requestUpdate()}_toggleTextMenu(t){t.stopPropagation(),this._showTextMenu=!this._showTextMenu,this._showAudioMenu=!1,this.requestUpdate()}_toggleFullscreen(){let t=this.shadowRoot.querySelector(".video-wrapper");t&&(document.fullscreenElement?document.exitFullscreen():t.requestFullscreen().catch(e=>{console.error("[Molotov Panel] Fullscreen error:",e)}))}_onFullscreenChange(){this._isFullscreen=!!document.fullscreenElement,this.requestUpdate()}_handlePlayOverlayClick(){let t=this.shadowRoot.querySelector("video");t&&(t.muted=!1,t.play().catch(e=>console.error("[Molotov Panel] Manual play error:",e)),this._showPlayOverlay=!1,this.requestUpdate())}_formatTime(t){if(!t||!isFinite(t))return"00:00";let e=Math.floor(t/3600),i=Math.floor(t%3600/60),s=Math.floor(t%60);return e>0?`${e}:${i.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`:`${i}:${s.toString().padStart(2,"0")}`}_formatClockTime(t){return t?new Date(t).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):""}_getProgressPercent(){if(this._isLive&&this._programStart&&this._programEnd){let t=Date.now()-(this._liveDelay||0),e=this._programEnd-this._programStart;if(e<=0)return 100;let i=t-this._programStart;return Math.min(100,Math.max(0,i/e*100))}else if(this._duration>0&&isFinite(this._duration))return this._currentTime/this._duration*100;return 0}render(){let t=this._playing&&this._streamData,e=t&&!this._localMinimized,i=this._castPlaying&&!this._castMinimized,s=!e&&!i;return b`
      ${t?b`
        <div style="${this._localMinimized?"position:fixed;left:-9999px;width:1px;height:1px;overflow:hidden;":"height:100%;"}">
          ${this._renderPlayer()}
        </div>
      `:""}
      ${i?this._renderCastPlayer():""}
      ${s?this._renderChannelList():""}
    `}_renderChannelList(){return b`
      <div class="container">
        <div class="header">
          <h1>Molotov TV</h1>
          <div class="header-actions">
            ${this._getMolotovEntities().length>1?b`
              <select class="cast-select" @change=${this._handleEntityChange} .value=${this._getEntityId()}>
                ${this._getMolotovEntities().map(t=>b`
                    <option value=${t}>
                      ${this.hass.states[t]?.attributes?.friendly_name||t}
                    </option>
                  `)}
              </select>
            `:""}
            <button @click=${this._handleRefresh}>
              <ha-icon icon="mdi:refresh"></ha-icon>
              Actualiser
            </button>
            <select class="cast-select" @change=${this._handleTargetChange} .value=${this._selectedTarget}>
              ${this._isMobile?"":b`<option value="local">Cet appareil</option>`}
              ${this._castTargets.map(t=>b`
                  <option value=${t.mediaContentId}>${t.title}</option>
                `)}
            </select>
          </div>
        </div>

        ${this._castLoading?b`
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
    `}_handleRefresh(){this._activeTab==="live"?this._loadChannels():this._activeTab==="tonight"?this._loadTonight():this._loadRecordings()}_renderChannels(){return b`
      <div class="content">
        ${this._loading?b`<div class="loading">Chargement des chaines...</div>`:this._error?b`
              <div class="error">
                <span>${this._error}</span>
                <button @click=${this._loadChannels}>Reessayer</button>
              </div>
            `:b`
              <div class="channel-list">
                ${this._channels.map(t=>this._renderChannelItem(t))}
              </div>
            `}
      </div>
    `}_renderRecordings(){return b`
      <div class="content">
        ${this._loadingRecordings?b`<div class="loading">Chargement des enregistrements...</div>`:this._recordings.length>0?b`
              <div class="channel-list">
                ${this._recordings.map(t=>this._renderRecordingItem(t))}
              </div>
            `:b`<div class="error">Aucun enregistrement trouve</div>`}
      </div>
    `}_renderTonight(){return b`
      <div class="content">
        ${this._loadingTonight?b`<div class="loading">Chargement du programme de ce soir...</div>`:this._tonightChannels.length>0?b`
              <div class="tonight-list">
                ${this._tonightChannels.map(t=>this._renderTonightChannel(t))}
              </div>
            `:b`<div class="error">Aucun programme disponible pour ce soir</div>`}
      </div>
    `}_renderTonightChannel(t){return b`
      <div class="tonight-channel">
        <div class="tonight-channel-header">
          <img
            class="tonight-channel-logo"
            src=${t.thumbnail||""}
            alt=${t.name}
            loading="lazy"
            @load=${e=>e.target.style.display=""} @error=${e=>e.target.style.display="none"}
          />
          <div class="tonight-channel-name">${t.name}</div>
        </div>
        <div class="tonight-programs">
          ${t.programs.map(e=>this._renderTonightProgram(e,t))}
        </div>
      </div>
    `}_renderTonightProgram(t,e){let i=this._formatClockTime(t.start),s=this._formatClockTime(t.end),n=Date.now(),r=t.start<=n&&t.end>n,p=t.end<=n;return b`
      <div
        class="tonight-program ${r?"live":""} ${p?"past":""}"
        role="button"
        tabindex="0"
        @click=${()=>this._playTonightProgram(t,e)}
        @keydown=${v=>this._activateOnKey(v,()=>this._playTonightProgram(t,e))}
      >
        ${t.thumbnail?b`<img class="tonight-program-thumb" src=${t.thumbnail} loading="lazy" @load=${v=>v.target.style.display=""} @error=${v=>v.target.style.display="none"} />`:""}
        <div class="tonight-program-info">
          <div class="tonight-program-time">
            ${i} - ${s}
            ${r?b`<span class="live-indicator">EN DIRECT</span>`:""}
          </div>
          <div class="tonight-program-title">${t.title}</div>
          ${t.description?b`<div class="tonight-program-description">${t.description}</div>`:""}
        </div>
      </div>
    `}_activateOnKey(t,e){(t.key==="Enter"||t.key===" "||t.key==="Spacebar")&&(t.preventDefault(),e())}_tonightToProgramId(t){let e=t.split(":");return e[0]!=="tonight_program"||e.length<6?t:`program:${e[1]}:${e[4]}:${e[5]}`}async _playTonightProgram(t,e){let i=this._getEntityId();if(!i)return;this._episodePlaylist=[],this._episodeIndex=-1;let s=this._tonightToProgramId(t.mediaContentId);this._selectedChannel={id:e.id,name:e.name,thumbnail:e.thumbnail,mediaContentId:s,currentProgram:{title:t.title,start:t.start,end:t.end}},this._playerError=null;let n=Date.now();this._isLive=t.start<=n&&t.end>n,this._isLive?(this._programStart=t.start,this._programEnd=t.end):(this._programStart=null,this._programEnd=null),this._initPlaybackFlags();try{let r=this._buildPlayMediaId(s);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:r,media_content_type:"video"})}catch(r){console.error("[Molotov Panel] Play tonight program failed:",r),this._playerError=r.message||"Erreur de lecture",this._castLoading=!1}}_renderRecordingItem(t){let e=t.mediaContentId,i=this._expandedRecordings[e],s=this._recordingEpisodes[e]||[],n=this._loadingRecordingEpisodes[e],r=this._recordingEpisodes[e]!==void 0,p=!t.isFolder||r&&s.length<=1;return b`
      <div class="search-result-row">
        <div
          class="search-result-main"
          role="button"
          tabindex="0"
          @click=${v=>this._toggleRecordingExpand(v,t)}
          @keydown=${v=>this._activateOnKey(v,()=>this._toggleRecordingExpand(v,t))}
        >
          ${p?b`<ha-icon class="expand-icon" icon="mdi:play-circle-outline"></ha-icon>`:b`<ha-icon
                class="expand-icon ${i?"expanded":""}"
                icon="mdi:chevron-right"
              ></ha-icon>`}
          ${t.thumbnail?b`<img
                class="recording-thumb"
                src=${t.thumbnail}
                loading="lazy"
                @load=${v=>v.target.style.display=""} @error=${v=>v.target.style.display="none"}
              />`:b`<div class="recording-thumb"></div>`}
          <div class="recording-info">
            <div class="recording-title">${t.title}</div>
            ${t.description?b`<div class="recording-subtitle">${t.description}</div>`:""}
          </div>
        </div>
        ${i?b`
              <div class="episodes-list">
                ${n?b`<div class="episodes-loading">Chargement des episodes...</div>`:s.length>0?s.map(v=>b`
                        <div
                          class="episode-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playRecordingEpisode(v,t.title)}
                          @keydown=${I=>this._activateOnKey(I,()=>this._playRecordingEpisode(v,t.title))}
                        >
                          ${v.thumbnail?b`<img class="episode-thumb" src=${v.thumbnail} loading="lazy" @load=${I=>I.target.style.display=""} @error=${I=>I.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${v.title}</div>
                            ${v.description?b`<div class="episode-desc">${v.description}</div>`:""}
                          </div>
                        </div>
                      `):b`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderSearchResults(){return b`
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
        ${this._searching?b`<div class="loading">Recherche...</div>`:this._searchResults.length>0?b`
              <div class="channel-list">
                ${this._searchResults.map(t=>this._renderSearchResultItem(t))}
              </div>
            `:b`<div class="error">Aucun resultat trouve</div>`}
      </div>
    `}_renderSearchResultItem(t){let e=t.mediaContentId,i=this._expandedResults[e],s=this._resultEpisodes[e]||[],n=this._loadingEpisodes[e];return b`
      <div class="search-result-row">
        <div
          class="search-result-main"
          role="button"
          tabindex="0"
          @click=${r=>this._toggleResultExpand(r,t)}
          @keydown=${r=>this._activateOnKey(r,()=>this._toggleResultExpand(r,t))}
        >
          <ha-icon
            class="expand-icon ${i?"expanded":""}"
            icon="mdi:chevron-right"
          ></ha-icon>
          ${t.thumbnail?b`<img class="search-result-thumb" src=${t.thumbnail} loading="lazy" @load=${r=>r.target.style.display=""} @error=${r=>r.target.style.display="none"} />`:""}
          <div class="search-result-info">
            <div class="search-result-title">${t.title}</div>
            ${t.description?b`<div class="search-result-subtitle">${t.description}</div>`:""}
          </div>
        </div>
        ${i?b`
              <div class="episodes-list">
                ${n?b`<div class="episodes-loading">Chargement des episodes...</div>`:s.length>0?s.map(r=>b`
                        <div
                          class="episode-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playEpisode(r,t.title)}
                          @keydown=${p=>this._activateOnKey(p,()=>this._playEpisode(r,t.title))}
                        >
                          ${r.thumbnail?b`<img class="episode-thumb" src=${r.thumbnail} loading="lazy" @load=${p=>p.target.style.display=""} @error=${p=>p.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${r.title}</div>
                            ${r.description?b`<div class="episode-desc">${r.description}</div>`:""}
                          </div>
                        </div>
                      `):b`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderChannelItem(t){let e=t.currentProgram,i=e?.start?this._formatClockTime(e.start):"",s=e?.end?this._formatClockTime(e.end):"",n=i&&s?`${i} - ${s}`:"",r=this._expandedChannels[t.id],p=this._channelPrograms[t.id]||[],v=this._loadingPrograms[t.id];return b`
      <div class="channel-row">
        <div class="channel-main">
          <img
            class="channel-logo"
            src=${t.thumbnail||""}
            alt=${t.name}
            loading="lazy"
            @load=${I=>I.target.style.display=""} @error=${I=>I.target.style.display="none"}
            @click=${()=>this._playChannel(t)}
          />
          <div
            class="channel-info"
            role="button"
            tabindex="0"
            @click=${()=>this._playChannel(t)}
            @keydown=${I=>this._activateOnKey(I,()=>this._playChannel(t))}
          >
            <div class="channel-name">${t.name}</div>
            <div class="program-info">
              <div class="program-now">
                ${e?.title||"Direct"}
                ${n?b`<span class="program-time">(${n})</span>`:""}
              </div>
              ${e?.description?b`<div class="program-next">${e.description}</div>`:""}
            </div>
          </div>
          <div class="channel-actions">
            <button
              class="replay-btn ${r?"expanded":""}"
              @click=${I=>this._toggleChannelExpand(I,t)}
            >
              <ha-icon icon="mdi:history"></ha-icon>
              Replay
            </button>
          </div>
        </div>
        ${r?b`
              <div class="replay-list">
                ${v?b`<div class="replay-loading">Chargement...</div>`:p.length>0?p.map(I=>b`
                        <div
                          class="replay-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playReplay(I)}
                          @keydown=${j=>this._activateOnKey(j,()=>this._playReplay(I))}
                        >
                          ${I.thumbnail?b`<img class="replay-thumb" src=${I.thumbnail} loading="lazy" @load=${j=>j.target.style.display=""} @error=${j=>j.target.style.display="none"} />`:""}
                          <div class="replay-item-info">
                            <span class="replay-item-title">${I.title}</span>
                            ${I.description?b`<span class="replay-item-desc">${I.description}</span>`:""}
                          </div>
                        </div>
                      `):b`<div class="replay-empty">Aucun replay disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderMiniCastBar(){return b`
      <div class="mini-cast-bar">
        <div class="mini-cast-info">
          <ha-icon icon="mdi:cast-connected" style="--mdc-icon-size: 20px; color: var(--primary-color);"></ha-icon>
          <span class="mini-cast-title">${this._castTitle||"Chromecast"}</span>
        </div>
        <div class="mini-cast-controls">
          ${this._isLive?b`
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
    `}_renderPlayer(){let t=this._getProgressPercent(),e=this._selectedAudioIndex>=0&&this._audioTracks[this._selectedAudioIndex]?this._audioTracks[this._selectedAudioIndex].label:"Audio",i=this._selectedTextIndex>=0&&this._textTracks[this._selectedTextIndex]?this._textTracks[this._selectedTextIndex].label:"Off";return b`
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

            ${this._playerLoading?b`<div class="player-loading">
                  <div class="loading-spinner"></div>
                  <div class="loading-text">Chargement...</div>
                </div>`:""}

            ${this._playerError?b`<div class="player-error">${this._playerError}</div>`:""}

            ${this._showPlayOverlay?b`
                  <div class="play-overlay" @click=${this._handlePlayOverlayClick}>
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                `:""}

            <!-- Custom controls -->
            <div class="custom-controls ${this._paused?"":"autohide"}">
              <div class="progress-container">
                ${this._isLive&&this._programStart?b`<span>${this._formatClockTime(Date.now()-(this._liveDelay||0))}</span>`:b`<span>${this._formatTime(this._currentTime)}</span>`}
                <div class="progress-bar" @click=${this._handleProgressClick}>
                  <div class="progress-filled" style="width: ${t}%"></div>
                </div>
                ${this._isLive&&this._programEnd?b`<span>${this._formatClockTime(this._programEnd)}</span>`:b`<span>${this._formatTime(this._duration)}</span>`}
                ${this._isLive?b`<span class="live-badge">LIVE</span>`:""}
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
                  ${this._adOffer?b`<button class="icon-btn pubs-btn" @click=${this._localSkipAd}>
                        <ha-icon icon="mdi:skip-forward"></ha-icon>
                        <span class="pubs-label">Passer la pub</span>
                      </button>`:""}

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
                  ${this._audioTracks.length>1?b`
                        <div class="track-menu-container">
                          <button class="icon-btn" @click=${this._toggleAudioMenu}>
                            <ha-icon icon="mdi:volume-source"></ha-icon>
                            <span style="font-size: 11px; margin-left: 2px;">${e}</span>
                          </button>
                          ${this._showAudioMenu?b`
                                <div class="track-menu">
                                  ${this._audioTracks.map(s=>b`
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

                  ${this._textTracks.length>0?b`
                        <div class="track-menu-container">
                          <button class="icon-btn" @click=${this._toggleTextMenu}>
                            <ha-icon icon="mdi:subtitles"></ha-icon>
                            <span style="font-size: 11px; margin-left: 2px;">${i}</span>
                          </button>
                          ${this._showTextMenu?b`
                                <div class="track-menu">
                                  <div
                                    class="track-menu-item ${this._selectedTextIndex===-1?"selected":""}"
                                    @click=${()=>this._selectTextTrack(-1)}
                                  >
                                    Off
                                  </div>
                                  ${this._textTracks.map(s=>b`
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
    `}_renderCastPlayer(){let t=this._getProgressPercent();return b`
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
                ${this._isLive&&this._programStart?b`<span>${this._formatClockTime(Date.now()-(this._liveDelay||0))}</span>`:b`<span>${this._formatTime(this._currentTime)}</span>`}
                <div class="progress-bar" @click=${this._handleCastSeek}>
                  <div class="progress-filled" style="width: ${t}%"></div>
                </div>
                ${this._isLive&&this._programEnd?b`<span>${this._formatClockTime(this._programEnd)}</span>`:b`<span>${this._formatTime(this._duration)}</span>`}
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
                  ${this._castSkipTo!==null?b`<button class="icon-btn pubs-btn" @click=${this._castSkipAd}>
                        <ha-icon icon="mdi:skip-forward"></ha-icon>
                        <span class="pubs-label">Passer la pub</span>
                      </button>`:""}

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
    `}_renderMultiCastBar(){let t=Object.entries(this._activeCasts||{});return t.length<=1?"":b`
      <div class="multi-cast-bar">
        ${t.map(([e,i])=>{let s=e===this._focusedCastHost,n=i.title||e,r=i.state==="playing";return b`
            <div
              class="cast-chip ${s?"focused":""}"
              role="button"
              tabindex="0"
              @click=${()=>this._focusCast(e)}
              @keydown=${p=>this._activateOnKey(p,()=>this._focusCast(e))}
            >
              <span class="chip-icon">
                <ha-icon icon=${r?"mdi:cast-connected":"mdi:cast"} style="--mdc-icon-size: 18px;"></ha-icon>
              </span>
              <span>${n}</span>
              <span class="chip-stop" @click=${p=>this._stopSpecificCast(p,e)}>
                <ha-icon icon="mdi:close" style="--mdc-icon-size: 16px;"></ha-icon>
              </span>
            </div>
          `})}
      </div>
    `}async _focusCast(t){let e=this._getEntityId();if(!e)return;let i=this._activeCasts[t];if(!i)return;let s=t;try{await this.hass.callService("media_player","select_source",{entity_id:e,source:s}),this._focusedCastHost=t,this._castTarget=t,this._castTitle=i.title||"En cours de lecture",console.log("[Molotov Panel] Focused cast:",t)}catch(n){console.error("[Molotov Panel] Focus cast failed:",n)}}async _stopSpecificCast(t,e){t.stopPropagation();let i=this._getEntityId();if(!i||!this._activeCasts[e])return;let n=e;try{await this.hass.callService("media_player","select_source",{entity_id:i,source:n}),await new Promise(r=>setTimeout(r,200)),await this.hass.callService("media_player","media_stop",{entity_id:i}),console.log("[Molotov Panel] Stopped cast:",e)}catch(r){console.error("[Molotov Panel] Stop specific cast failed:",r)}}async _stopCastPlayback(){let t=this._getEntityId();if(t){try{await this.hass.callService("media_player","media_stop",{entity_id:t})}catch(e){console.error("[Molotov Panel] Stop cast failed:",e)}this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate(),this._castMinimized=!1,this._castLoading=!1,this._episodePlaylist=[],this._episodeIndex=-1}}async _toggleCastPlayPause(){let t=this._getEntityId();if(t)try{this._paused?await this.hass.callService("media_player","media_play",{entity_id:t}):await this.hass.callService("media_player","media_pause",{entity_id:t})}catch(e){console.error("[Molotov Panel] Play/pause cast failed:",e)}}async _castSkipForward(){let t=this._getEntityId();if(t)try{await this.hass.callService("media_player","media_next_track",{entity_id:t})}catch(e){console.error("[Molotov Panel] Skip forward failed:",e)}}_setCastPosition(t){this._currentTime=t,this._castBasePosition=t,this._castPositionUpdatedAt=Date.now()/1e3}async _castSeek(t){let e=this._getEntityId();if(e)try{await this.hass.callService("media_player","media_seek",{entity_id:e,seek_position:t}),this._setCastPosition(t)}catch(i){console.error("[Molotov Panel] Cast seek failed:",i)}}async _castSeekBeginning(){await this._castSeek(0)}async _castSkipBack30(){await this._castSeek(Math.max(0,this._currentTime-30))}async _castSkipBack10(){await this._castSeek(Math.max(0,this._currentTime-10))}async _castSkipAd(){this._castSkipTo!==null&&await this._castSeek(this._castSkipTo)}async _handleCastSeek(t){let e=this._getEntityId();if(!e||!this._duration)return;let s=t.currentTarget.getBoundingClientRect(),r=(t.clientX-s.left)/s.width*this._duration;try{await this.hass.callService("media_player","media_seek",{entity_id:e,seek_position:r}),this._setCastPosition(r)}catch(p){console.error("[Molotov Panel] Seek failed:",p)}}async _handleCastVolumeChange(t){let e=this._getEntityId();if(!e)return;let i=parseFloat(t.target.value);this._volume=i;try{await this.hass.callService("media_player","volume_set",{entity_id:e,volume_level:i})}catch(s){console.error("[Molotov Panel] Volume change failed:",s)}}async _toggleCastMute(){let t=this._getEntityId();if(t)try{await this.hass.callService("media_player","volume_mute",{entity_id:t,is_volume_muted:!this._muted}),this._muted=!this._muted}catch(e){console.error("[Molotov Panel] Mute toggle failed:",e)}}};customElements.define("molotov-panel",ii);console.log(`[Molotov Panel] Registered - v${Ei}`);
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
