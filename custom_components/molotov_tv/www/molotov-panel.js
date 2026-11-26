var ze=typeof window<"u"&&window.customElements!=null&&window.customElements.polyfillWrapFlushCallback!==void 0;var Wt=(a,t,e=null)=>{for(;t!==e;){let i=t.nextSibling;a.removeChild(t),t=i}};var gt=`{{lit-${String(Math.random()).slice(2)}}}`,je=`<!--${gt}-->`,li=new RegExp(`${gt}|${je}`),re="$lit$",Kt=class{constructor(t,e){this.parts=[],this.element=e;let i=[],s=[],n=document.createTreeWalker(e.content,133,null,!1),r=0,p=-1,x=0,{strings:I,values:{length:j}}=t;for(;x<j;){let R=n.nextNode();if(R===null){n.currentNode=s.pop();continue}if(p++,R.nodeType===1){if(R.hasAttributes()){let st=R.attributes,{length:et}=st,rt=0;for(let ot=0;ot<et;ot++)ci(st[ot].name,re)&&rt++;for(;rt-- >0;){let ot=I[x],Ct=Ce.exec(ot)[2],_t=Ct.toLowerCase()+re,ft=R.getAttribute(_t);R.removeAttribute(_t);let lt=ft.split(li);this.parts.push({type:"attribute",index:p,name:Ct,strings:lt}),x+=lt.length-1}}R.tagName==="TEMPLATE"&&(s.push(R),n.currentNode=R.content)}else if(R.nodeType===3){let st=R.data;if(st.indexOf(gt)>=0){let et=R.parentNode,rt=st.split(li),ot=rt.length-1;for(let Ct=0;Ct<ot;Ct++){let _t,ft=rt[Ct];if(ft==="")_t=wt();else{let lt=Ce.exec(ft);lt!==null&&ci(lt[2],re)&&(ft=ft.slice(0,lt.index)+lt[1]+lt[2].slice(0,-re.length)+lt[3]),_t=document.createTextNode(ft)}et.insertBefore(_t,R),this.parts.push({type:"node",index:++p})}rt[ot]===""?(et.insertBefore(wt(),R),i.push(R)):R.data=rt[ot],x+=ot}}else if(R.nodeType===8)if(R.data===gt){let st=R.parentNode;(R.previousSibling===null||p===r)&&(p++,st.insertBefore(wt(),R)),r=p,this.parts.push({type:"node",index:p}),R.nextSibling===null?R.data="":(i.push(R),p--),x++}else{let st=-1;for(;(st=R.data.indexOf(gt,st+1))!==-1;)this.parts.push({type:"node",index:-1}),x++}}for(let R of i)R.parentNode.removeChild(R)}},ci=(a,t)=>{let e=a.length-t.length;return e>=0&&a.slice(e)===t},fe=a=>a.index!==-1,wt=()=>document.createComment(""),Ce=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;var qe=133;function Ve(a,t){let{element:{content:e},parts:i}=a,s=document.createTreeWalker(e,qe,null,!1),n=ge(i),r=i[n],p=-1,x=0,I=[],j=null;for(;s.nextNode();){p++;let R=s.currentNode;for(R.previousSibling===j&&(j=null),t.has(R)&&(I.push(R),j===null&&(j=R)),j!==null&&x++;r!==void 0&&r.index===p;)r.index=j!==null?-1:r.index-x,n=ge(i,n),r=i[n]}I.forEach(R=>R.parentNode.removeChild(R))}var Ti=a=>{let t=a.nodeType===11?0:1,e=document.createTreeWalker(a,qe,null,!1);for(;e.nextNode();)t++;return t},ge=(a,t=-1)=>{for(let e=t+1;e<a.length;e++){let i=a[e];if(fe(i))return e}return-1};function di(a,t,e=null){let{element:{content:i},parts:s}=a;if(e==null){i.appendChild(t);return}let n=document.createTreeWalker(i,qe,null,!1),r=ge(s),p=0,x=-1;for(;n.nextNode();)for(x++,n.currentNode===e&&(p=Ti(t),e.parentNode.insertBefore(t,e));r!==-1&&s[r].index===x;){if(p>0){for(;r!==-1;)s[r].index+=p,r=ge(s,r);return}r=ge(s,r)}}var Ci=new WeakMap;var Yt=a=>typeof a=="function"&&Ci.has(a);var pt={},Ae={};var Lt=class{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(let i of this.__parts)i!==void 0&&i.setValue(t[e]),e++;for(let i of this.__parts)i!==void 0&&i.commit()}_clone(){let t=ze?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],i=this.template.parts,s=document.createTreeWalker(t,133,null,!1),n=0,r=0,p,x=s.nextNode();for(;n<i.length;){if(p=i[n],!fe(p)){this.__parts.push(void 0),n++;continue}for(;r<p.index;)r++,x.nodeName==="TEMPLATE"&&(e.push(x),s.currentNode=x.content),(x=s.nextNode())===null&&(s.currentNode=e.pop(),x=s.nextNode());if(p.type==="node"){let I=this.processor.handleTextExpression(this.options);I.insertAfterNode(x.previousSibling),this.__parts.push(I)}else this.__parts.push(...this.processor.handleAttributeExpressions(x,p.name,p.strings,this.options));n++}return ze&&(document.adoptNode(t),customElements.upgrade(t)),t}};var hi=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:a=>a}),Ii=` ${gt} `,Tt=class{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){let t=this.strings.length-1,e="",i=!1;for(let s=0;s<t;s++){let n=this.strings[s],r=n.lastIndexOf("<!--");i=(r>-1||i)&&n.indexOf("-->",r+1)===-1;let p=Ce.exec(n);p===null?e+=n+(i?Ii:je):e+=n.substr(0,p.index)+p[1]+p[2]+re+p[3]+gt}return e+=this.strings[t],e}getTemplateElement(){let t=document.createElement("template"),e=this.getHTML();return hi!==void 0&&(e=hi.createHTML(e)),t.innerHTML=e,t}};var Re=a=>a===null||!(typeof a=="object"||typeof a=="function"),Ie=a=>Array.isArray(a)||!!(a&&a[Symbol.iterator]),oe=class{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let s=0;s<i.length-1;s++)this.parts[s]=this._createPart()}_createPart(){return new me(this)}_getValue(){let t=this.strings,e=t.length-1,i=this.parts;if(e===1&&t[0]===""&&t[1]===""){let n=i[0].value;if(typeof n=="symbol")return String(n);if(typeof n=="string"||!Ie(n))return n}let s="";for(let n=0;n<e;n++){s+=t[n];let r=i[n];if(r!==void 0){let p=r.value;if(Re(p)||!Ie(p))s+=typeof p=="string"?p:String(p);else for(let x of p)s+=typeof x=="string"?x:String(x)}}return s+=t[e],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}},me=class{constructor(t){this.value=void 0,this.committer=t}setValue(t){t!==pt&&(!Re(t)||t!==this.value)&&(this.value=t,Yt(t)||(this.committer.dirty=!0))}commit(){for(;Yt(this.value);){let t=this.value;this.value=pt,t(this)}this.value!==pt&&this.committer.commit()}},Xt=class a{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(wt()),this.endNode=t.appendChild(wt())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=wt()),t.__insert(this.endNode=wt())}insertAfterPart(t){t.__insert(this.startNode=wt()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(this.startNode.parentNode===null)return;for(;Yt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=pt,e(this)}let t=this.__pendingValue;t!==pt&&(Re(t)?t!==this.value&&this.__commitText(t):t instanceof Tt?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):Ie(t)?this.__commitIterable(t):t===Ae?(this.value=Ae,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){let e=this.startNode.nextSibling;t=t??"";let i=typeof t=="string"?t:String(t);e===this.endNode.previousSibling&&e.nodeType===3?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){let e=this.options.templateFactory(t);if(this.value instanceof Lt&&this.value.template===e)this.value.update(t.values);else{let i=new Lt(e,t.processor,this.options),s=i._clone();i.update(t.values),this.__commitNode(s),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());let e=this.value,i=0,s;for(let n of t)s=e[i],s===void 0&&(s=new a(this.options),e.push(s),i===0?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(n),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){Wt(this.startNode.parentNode,t.nextSibling,this.endNode)}},ye=class{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,i.length!==2||i[0]!==""||i[1]!=="")throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;Yt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=pt,e(this)}if(this.__pendingValue===pt)return;let t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=pt}},be=class extends oe{constructor(t,e,i){super(t,e,i),this.single=i.length===2&&i[0]===""&&i[1]===""}_createPart(){return new Me(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}},Me=class extends me{},ui=!1;(()=>{try{let a={get capture(){return ui=!0,!1}};window.addEventListener("test",a,a),window.removeEventListener("test",a,a)}catch{}})();var ve=class{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=s=>this.handleEvent(s)}setValue(t){this.__pendingValue=t}commit(){for(;Yt(this.__pendingValue);){let n=this.__pendingValue;this.__pendingValue=pt,n(this)}if(this.__pendingValue===pt)return;let t=this.__pendingValue,e=this.value,i=t==null||e!=null&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),s=t!=null&&(e==null||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=Mi(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=pt}handleEvent(t){typeof this.value=="function"?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}},Mi=a=>a&&(ui?{capture:a.capture,passive:a.passive,once:a.once}:a.capture);function Ge(a){let t=Qt.get(a.type);t===void 0&&(t={stringsArray:new WeakMap,keyString:new Map},Qt.set(a.type,t));let e=t.stringsArray.get(a.strings);if(e!==void 0)return e;let i=a.strings.join(gt);return e=t.keyString.get(i),e===void 0&&(e=new Kt(a,a.getTemplateElement()),t.keyString.set(i,e)),t.stringsArray.set(a.strings,e),e}var Qt=new Map;var Ut=new WeakMap,He=(a,t,e)=>{let i=Ut.get(t);i===void 0&&(Wt(t,t.firstChild),Ut.set(t,i=new Xt(Object.assign({templateFactory:Ge},e))),i.appendInto(t)),i.setValue(a),i.commit()};var $e=class{handleAttributeExpressions(t,e,i,s){let n=e[0];return n==="."?new be(t,e.slice(1),i).parts:n==="@"?[new ve(t,e.slice(1),s.eventContext)]:n==="?"?[new ye(t,e.slice(1),i)]:new oe(t,e,i).parts}handleTextExpression(t){return new Xt(t)}},We=new $e;typeof window<"u"&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var v=(a,...t)=>new Tt(a,t,"html",We);var _i=(a,t)=>`${a}--${t}`,Ne=!0;typeof window.ShadyCSS>"u"?Ne=!1:typeof window.ShadyCSS.prepareTemplateDom>"u"&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),Ne=!1);var $i=a=>t=>{let e=_i(t.type,a),i=Qt.get(e);i===void 0&&(i={stringsArray:new WeakMap,keyString:new Map},Qt.set(e,i));let s=i.stringsArray.get(t.strings);if(s!==void 0)return s;let n=t.strings.join(gt);if(s=i.keyString.get(n),s===void 0){let r=t.getTemplateElement();Ne&&window.ShadyCSS.prepareTemplateDom(r,a),s=new Kt(t,r),i.keyString.set(n,s)}return i.stringsArray.set(t.strings,s),s},Ni=["html","svg"],Oi=a=>{Ni.forEach(t=>{let e=Qt.get(_i(t,a));e!==void 0&&e.keyString.forEach(i=>{let{element:{content:s}}=i,n=new Set;Array.from(s.querySelectorAll("style")).forEach(r=>{n.add(r)}),Ve(i,n)})})},fi=new Set,Li=(a,t,e)=>{fi.add(a);let i=e?e.element:document.createElement("template"),s=t.querySelectorAll("style"),{length:n}=s;if(n===0){window.ShadyCSS.prepareTemplateStyles(i,a);return}let r=document.createElement("style");for(let I=0;I<n;I++){let j=s[I];j.parentNode.removeChild(j),r.textContent+=j.textContent}Oi(a);let p=i.content;e?di(e,r,p.firstChild):p.insertBefore(r,p.firstChild),window.ShadyCSS.prepareTemplateStyles(i,a);let x=p.querySelector("style");if(window.ShadyCSS.nativeShadow&&x!==null)t.insertBefore(x.cloneNode(!0),t.firstChild);else if(e){p.insertBefore(r,p.firstChild);let I=new Set;I.add(r),Ve(e,I)}},gi=(a,t,e)=>{if(!e||typeof e!="object"||!e.scopeName)throw new Error("The `scopeName` option is required.");let i=e.scopeName,s=Ut.has(t),n=Ne&&t.nodeType===11&&!!t.host,r=n&&!fi.has(i),p=r?document.createDocumentFragment():t;if(He(a,p,Object.assign({templateFactory:$i(i)},e)),r){let x=Ut.get(p);Ut.delete(p);let I=x.value instanceof Lt?x.value.template:void 0;Li(i,p,I),Wt(t,t.firstChild),t.appendChild(p),Ut.set(t,x)}!s&&n&&window.ShadyCSS.styleElement(t.host)};var mi;window.JSCompiler_renameProperty=(a,t)=>a;var Ze={toAttribute(a,t){switch(t){case Boolean:return a?"":null;case Object:case Array:return a==null?a:JSON.stringify(a)}return a},fromAttribute(a,t){switch(t){case Boolean:return a!==null;case Number:return a===null?null:Number(a);case Object:case Array:return JSON.parse(a)}return a}},yi=(a,t)=>t!==a&&(t===t||a===a),Ke={attribute:!0,type:String,converter:Ze,reflect:!1,hasChanged:yi},Ye=1,Xe=4,Qe=8,Je=16,ti="finalized",ae=class extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();let t=[];return this._classProperties.forEach((e,i)=>{let s=this._attributeNameForProperty(i,e);s!==void 0&&(this._attributeToPropertyMap.set(s,i),t.push(s))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;let t=Object.getPrototypeOf(this)._classProperties;t!==void 0&&t.forEach((e,i)=>this._classProperties.set(i,e))}}static createProperty(t,e=Ke){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;let i=typeof t=="symbol"?Symbol():`__${t}`,s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Object.defineProperty(this.prototype,t,s)}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){let n=this[t];this[e]=s,this.requestUpdateInternal(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||Ke}static finalize(){let t=Object.getPrototypeOf(this);if(t.hasOwnProperty(ti)||t.finalize(),this[ti]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){let e=this.properties,i=[...Object.getOwnPropertyNames(e),...typeof Object.getOwnPropertySymbols=="function"?Object.getOwnPropertySymbols(e):[]];for(let s of i)this.createProperty(s,e[s])}}static _attributeNameForProperty(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=yi){return i(t,e)}static _propertyValueFromAttribute(t,e){let i=e.type,s=e.converter||Ze,n=typeof s=="function"?s:s.fromAttribute;return n?n(t,i):t}static _propertyValueToAttribute(t,e){if(e.reflect===void 0)return;let i=e.type,s=e.converter;return(s&&s.toAttribute||Ze.toAttribute)(t,i)}initialize(){this._updateState=0,this._updatePromise=new Promise(t=>this._enableUpdatingResolver=t),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){let i=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,i)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){this._enableUpdatingResolver!==void 0&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=Ke){let s=this.constructor,n=s._attributeNameForProperty(t,i);if(n!==void 0){let r=s._propertyValueToAttribute(e,i);if(r===void 0)return;this._updateState=this._updateState|Qe,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._updateState=this._updateState&~Qe}}_attributeToProperty(t,e){if(this._updateState&Qe)return;let i=this.constructor,s=i._attributeToPropertyMap.get(t);if(s!==void 0){let n=i.getPropertyOptions(s);this._updateState=this._updateState|Je,this[s]=i._propertyValueFromAttribute(e,n),this._updateState=this._updateState&~Je}}requestUpdateInternal(t,e,i){let s=!0;if(t!==void 0){let n=this.constructor;i=i||n.getPropertyOptions(t),n._valueHasChanged(this[t],e,i.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),i.reflect===!0&&!(this._updateState&Je)&&(this._reflectingProperties===void 0&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,i))):s=!1}!this._hasRequestedUpdate&&s&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=this._updateState|Xe;try{await this._updatePromise}catch{}let t=this.performUpdate();return t!=null&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return this._updateState&Xe}get hasUpdated(){return this._updateState&Ye}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1,e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(i){throw t=!1,this._markUpdated(),i}t&&(this._updateState&Ye||(this._updateState=this._updateState|Ye,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~Xe}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){this._reflectingProperties!==void 0&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,i)=>this._propertyToAttribute(i,this[i],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}};mi=ti;ae[mi]=!0;var bi=Element.prototype,Ls=bi.msMatchesSelector||bi.webkitMatchesSelector;var Oe=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ei=Symbol(),xe=class{constructor(t,e){if(e!==ei)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return this._styleSheet===void 0&&(Oe?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}},vi=a=>new xe(String(a),ei),Ui=a=>{if(a instanceof xe)return a.cssText;if(typeof a=="number")return a;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${a}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`)},xi=(a,...t)=>{let e=t.reduce((i,s,n)=>i+Ui(s)+a[n+1],a[0]);return new xe(e,ei)};(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");var wi={},Jt=class extends ae{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;let t=this.getStyles();if(Array.isArray(t)){let e=(n,r)=>n.reduceRight((p,x)=>Array.isArray(x)?e(x,p):(p.add(x),p),r),i=e(t,new Set),s=[];i.forEach(n=>s.unshift(n)),this._styles=s}else this._styles=t===void 0?[]:[t];this._styles=this._styles.map(e=>{if(e instanceof CSSStyleSheet&&!Oe){let i=Array.prototype.slice.call(e.cssRules).reduce((s,n)=>s+n.cssText,"");return vi(i)}return e})}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){let t=this.constructor._styles;t.length!==0&&(window.ShadyCSS!==void 0&&!window.ShadyCSS.nativeShadow?window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(e=>e.cssText),this.localName):Oe?this.renderRoot.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):this._needsShimAdoptedStyleSheets=!0)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&window.ShadyCSS!==void 0&&window.ShadyCSS.styleElement(this)}update(t){let e=this.render();super.update(t),e!==wi&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(i=>{let s=document.createElement("style");s.textContent=i.cssText,this.renderRoot.appendChild(s)}))}render(){return wi}};Jt.finalized=!0;Jt.render=gi;Jt.shadowRootOptions={mode:"open"};var B=(()=>{function At(c,g){let _=[],o=0;for(;o<c.length;){if(!c[o]){o++;continue}let l=o,h=o+1;for(;h<c.length&&h-l<=g+1;)c[h]&&(l=h),h++;_.push([o,l]),o=l+1}return _}function ce(c,g,_){let o=0;for(let b of c)b&&o++;if(!(_>0)||o*2<c.length)return null;let l=At(c,3).filter(b=>(b[1]-b[0]+1)*_>=60),h=[];for(let b=0;b+1<l.length;b++){let P=l[b],M=l[b+1],N=g+(P[1]+1)*_,A=g+M[0]*_,T=0;for(let $=P[1]+1;$<M[0];$++)c[$]&&T++;A-N>=150&&A-N<=800&&T*2<M[0]-P[1]-1&&h.push([N,A])}return h}function it(c,g,_){let o=new Array(c.length).fill(!1);for(let l=0;l<c.length;l++){if(!_[l])continue;let h=[];for(let b=Math.max(0,l-2);b<=Math.min(c.length-1,l+2);b++)_[b]&&h.push(c[b]);h.sort((b,P)=>b-P),o[l]=h[h.length>>1]<.5*g}return o}function ct(c){let g=new Array(c.length).fill(!1);for(let _ of At(c,0))if(_[1]-_[0]+1>=5)for(let o=_[0];o<=_[1];o++)g[o]=!0;return g}function D(c,g,_,o,l){let h=ct(c),b=(T,$)=>{if(T<0||$>h.length)return!1;let F=0;for(let Ot=T;Ot<$;Ot++)h[Ot]||F++;return F>=8},P=T=>{let $=(T[1]+1-T[0])*g;return b(T[0]-15,T[0])&&b(T[1]+1,T[1]+1+15)&&$>=150&&$<=1200},M=At(h,7);if(!_||!o)return M.filter(P);let N=l?M.filter(T=>T[1]-T[0]+1>=10):M,A=[];for(let T of Dt(N,_,o,g)){let $=N.filter(F=>F[0]>=T[0]&&F[1]<=T[1]);if(P(T)&&(!l||$.length===1||$.some(P)))A.push(T);else for(let F of $)P(F)&&A.push([F[0],F[1]])}return A}function Dt(c,g,_,o){let l=[];for(let h of c){let b=l[l.length-1];b&&(h[1]+1-b[0])*o<=1200&&Ft(b[1]+1,h[0],g,_)?b[1]=h[1]:l.push([h[0],h[1]])}return l}function Ft(c,g,_,o){let l=0;for(let h=c;h<g;h++)(_[h]||o[h])&&l++;return g-c<=29&&l>=g-c-7&&St(_,c,g)<=10&&St(o,c,g)<=12}function St(c,g,_){let o=0,l=0;for(let h=g;h<_;h++)o=c[h]?o+1:0,l=Math.max(l,o);return l}function dt(c,g,_,o){let l=c,h=o?c.map((A,T)=>!A&&o[T]):null,b=o?c.map((A,T)=>A&&!o[T]):null,P=D(l,_,b,h,!0);if(o){l=new Array(c.length).fill(!1);let A=new Array(c.length).fill(!1);for(let T of P)for(let $=T[0];$<=T[1];$++)l[$]=c[$]&&o[$],A[$]=c[$]&&!o[$];P=D(l,_,A,h)}let M=ct(l),N=o?we(c,o,P,g,_):[];return P.map(A=>{let T=At(M.slice(A[0],A[1]+1),0),$=It(o?ht(T,A[0],c,o):T);return[g+(A[0]+$[0])*_,g+(A[0]+$[1]+1)*_]}).concat(N)}function It(c){let g=0,_=c.length-1;for(;_>g&&c[_][1]-c[_][0]+1<10;)_--;for(;g<_&&c[g][1]-c[g][0]+1<10;)g++;return[c[g][0],c[_][1]]}function ht(c,g,_,o){let l=[];for(let h of c){let b=l[l.length-1];b&&!Mt(g+b[1]+1,g+h[0],_,o)?b[1]=h[1]:l.push([h[0],h[1]])}return l}function Mt(c,g,_,o){let l=0;for(let h=c;h<g;h++)if(!_[h]&&!o[h]||(l=o[h]?0:l+1,l>=5))return!0;return!1}function we(c,g,_,o,l){let h=ct(c),b=(M,N)=>{if(M<0||N>h.length)return!1;let A=0;for(let T=M;T<N;T++)h[T]||A++;return A>=12},P=[];for(let M of D(g,l)){if(_.some(F=>F[0]<=M[1]&&M[0]<=F[1]))continue;let N=0;for(let F=M[0];F<=M[1];F++)c[F]&&N++;if(N<.5*(M[1]-M[0]+1))continue;let A=-1,T=-1;for(let F=M[0];F<=M[1];F++)h[F]&&(A<0&&(A=F),T=F+1);if(A<0||(T-A)*l<150||!b(A-15,A)||!b(T,T+15))continue;let $=It(ht(At(h.slice(M[0],M[1]+1),0),M[0],c,g));P.push([o+(M[0]+$[0])*l,o+(M[0]+$[1]+1)*l])}return P}function Rt(c,g){if(c===null)return g||[];if(g===null)return c;let _=[];for(let o of c)for(let l of g){let h=Math.max(o[0],l[0]),b=Math.min(o[1],l[1]);b-h<60||_.push([Math.abs(o[0]-l[0])<=90?l[0]:h,Math.abs(o[1]-l[1])<=90?l[1]:b])}return _}function Zt(c,g,_){let o=Math.floor(g*.22),l=Math.floor(_*.22),h=o-1,b=l-1,P=h*b,M=[[0,0],[g-o,0],[0,_-l],[g-o,_-l]],N=M.map(()=>new Uint8Array(P>0?c*P:0)),A=new Array(c).fill(!1),T=-1;function $(C,G){if(!(P<=0||C<0||C>=c||G.length<g*_)){for(let z=0;z<M.length;z++){let X=M[z][0],q=M[z][1],Q=N[z],H=C*P;for(let V=0;V<b;V++){let W=(q+V)*g+X;for(let d=0;d<h;d++){let u=G[W];Q[H++]=Math.min(255,Math.abs(G[W+1]-u)+Math.abs(G[W+g]-u)),W++}}}A[C]=!0}}function F(C,G,z){let X=N[C],q=new Uint8Array(P);for(let W=0;W<P;W++){z.fill(0);for(let y of G)z[X[y*P+W]]++;let d=0,u=0;for(;d+z[u]<=G.length>>1;)d+=z[u++];q[W]=u}let Q=Math.max(1,Array.from(q).sort((W,d)=>W-d)[Math.floor(P*.92)]),H=[],V=0;for(let W=0;W<P;W++)q[W]>=Q&&(H.push(W),V+=q[W]);return H.length===0?null:{corner:C,median:q,mask:H,strength:V/H.length,whole:V}}function Ot(C,G,z,X){let q=null;for(let Q=C;Q<G;Q++){let H=F(Q,z,X);H!==null&&(q===null||H.strength>q.strength)&&(q=H)}return q}function ke(C,G){let z=N[C.corner],X=new Float64Array(c),q=[];for(let Q of G){let H=Q*P,V=0;for(let W of C.mask)V+=Math.min(z[H+W],C.median[W]);X[Q]=V/C.whole,q.push(X[Q])}return q.sort((Q,H)=>Q-H),C.score=X,C.usual=q[q.length>>1],C}function Gt(){let C=[];for(let V=0;V<c;V++)A[V]&&C.push(V);if(P<=0||C.length<30)return null;let G=new Int32Array(256),z=V=>V!==null&&V.strength>=25?V:null,X=V=>V!==null&&V.strength>=30?V:null,q=Ot(2,N.length,C,G),Q=T<0?z(Ot(0,2,C,G)):T<2?F(T,C,G):null,H=Q!==null?Q:T<0?z(q):F(T,C,G);return H===null?null:(T=H.corner,ke(H,C),H.lower=Q!==null&&X(q)!==null?ke(q,C):null,H)}function pe(C){let G=M[C.corner][0],z=M[C.corner][1];return{width:g,points:C.mask.map(X=>(z+Math.floor(X/h))*g+G+X%h),pattern:C.mask.map(X=>C.median[X]),whole:C.whole,usual:C.usual,strength:C.strength,lower:C.lower?pe(C.lower):null,channel:C.corner<2}}function Ee(){let C=Gt();return C===null?null:pe(C)}function Be(){let C=Gt();return C===null?null:it(C.score,C.usual,A)}return{add:$,logo:Ee,gone:Be,breaks:(C,G)=>{let z=Gt();if(z===null)return null;let X=z.lower?it(z.lower.score,z.lower.usual,A):null;return dt(it(z.score,z.usual,A),C,G,X)}}}function de(c){return c.lower?Object.assign({},c,{lower:null}):c}function Bt(c,g,_){let o=0;for(let l of g)$t(c,l)>=.5*c.usual&&o++;return o>=_*g.length}function $t(c,g){let _=0;for(let o=0;o<c.points.length;o++){let l=c.points[o],h=g[l];_+=Math.min(Math.abs(g[l+1]-h)+Math.abs(g[l+c.width]-h),c.pattern[o])}return _/c.whole}function Z(c){let g=String(c).match(/[A-Za-z0-9+\/]{16,}={0,2}/g)||[];for(let _ of g){let o;try{o=atob(_)}catch{continue}if(o.length<20||o.charCodeAt(0)!==252)continue;let l=h=>{if(h<0||h>=o.length)throw new RangeError("short");return o.charCodeAt(h)};try{if(l(13)===5&&!(l(18)&128))return(l(19)&128)!==0;for(let h=16;h+4<=o.length;h++){if(o.substr(h,4)!=="CUEI"||l(h-2)!==2)continue;let b=h+8;if(l(b)&128)continue;b++;let P=l(b);b++,P&128||(b+=1+6*l(b)),P&64&&(b+=5),b+=2+l(b+1);let M=l(b);if([34,48,50,52,54].indexOf(M)>=0)return!0;if([35,49,51,53,55].indexOf(M)>=0)return!1}}catch{return null}return null}return null}function te(c){let g=[];if(c.some(_=>_.signalled))for(let _ of c)for(let o of _.marks){if(!o.opens)continue;let l=null;if(o.duration!==null)l=o.at+o.duration;else{let h=_.marks.filter(b=>b.at>o.at).map(b=>b.at);l=h.length>0?Math.min.apply(null,h):_.end}l!==null&&l>o.at&&g.push([o.at,l])}else{let _=o=>o.end-o.start;for(let o=1;o+1<c.length;o++){let l=c[o-1],h=c[o],b=c[o+1];if(l.end===null||h.end===null||b.end===null)continue;_(h)<10&&_(l)>=60&&_(l)<=420&&_(b)>=60&&_(b)<=420&&g.push([l.start,b.end])}}return zt(g,10)}function zt(c,g){let _=[];for(let o of c.slice().sort((l,h)=>l[0]-h[0])){let l=_[_.length-1];l&&o[0]-l[1]<=g?l[1]=Math.max(l[1],o[1]):_.push([o[0],o[1]])}return _}let jt=120,he=40,ue=4e3,ut=10,kt=14,mt=6,ee=90,Se=60,yt=100,Nt=3,Et=65536,qt=1e4;function ie(c,g){return String.fromCharCode(c[g+4],c[g+5],c[g+6],c[g+7])}function se(c){let g=new DataView(c.buffer,c.byteOffset,c.byteLength),_=0;for(;c.length-_>=8;){let o=g.getUint32(_);if(o<8||_+o>Et)return null;if(ie(c,_)==="moof")return _+o;_+=o}return null}function bt(c,g,_,o){let l=[],h=_;for(;o-h>=8;){let b=g.getUint32(h);if(b<8||b>o-h)break;l.push({type:ie(c,h),from:h+8,to:h+b}),h+=b}return l}function vt(c){let g=se(c);if(g===null||g>c.length)return null;let _=new DataView(c.buffer,c.byteOffset,c.byteLength),o=bt(c,_,0,g).pop();if(!o||o.type!=="moof")return null;let l=bt(c,_,o.from,o.to).filter(P=>P.type==="traf")[0];if(!l)return null;let h=[],b=-1;for(let P of bt(c,_,l.from,l.to)){if(P.type!=="tfhd"&&P.type!=="trun")continue;let M=P.from;if(P.to-M<8)return null;let N=_.getUint32(M)&16777215;if(P.type==="tfhd"){let A=M+8;if(N&1&&(A+=8),N&2&&(A+=4),N&8&&(A+=4),N&16){if(A+4>P.to)return null;b=_.getUint32(A)}}else{let A=_.getUint32(M+4),T=((N&256?1:0)+(N&512?1:0)+(N&1024?1:0)+(N&2048?1:0))*4,$=M+8+(N&1?4:0)+(N&4?4:0);if(A>qt||$+A*T>P.to||!(N&512)&&b<0)return null;for(let F=0;F<A;F++)h.push(N&512?_.getUint32($+(N&256?4:0)):b),$+=T}}return h}function Vt(c,g,_){let o=[],l=0,h=0;for(let b=0;b<c.length;b++){let P=c[b];if(P>=0&&P<jt){l++,h+=P;continue}l>=ut&&l<=kt&&h<=he*l&&P>ue&&o.push(g+b*_),l=0,h=0}return o}function De(c){let g=[];for(let o of c.slice().sort((l,h)=>l-h)){let l=g[g.length-1];l&&o-l[l.length-1]<=Se?l.push(o):g.push([o])}let _=[];for(let o=0;o<g.length;o++){let l=g[o],h=g[o+1],b=_[_.length-1];b&&!(b.length>=Nt&&l[0]-b[b.length-1]<=yt)&&(b=null),b&&l.length>=Nt?b.push(...l):b&&h&&h.length>=Nt&&h[0]-l[l.length-1]<=yt?(b.push(...l,...h),o++):_.push(l)}return _.filter(o=>o.length>=mt&&o[o.length-1]-o[0]>=ee).map(o=>[o[1],o[o.length-2]])}function Fe(c,g){let _=g.filter(o=>o[0]<c[1]&&o[1]>c[1])[0];return _?[c[0],_[1]]:c}return{runs:At,captionBreaks:ce,gone:it,solid:ct,logoBreaks:dt,combine:Rt,track:Zt,score:$t,alone:de,seenIn:Bt,opens:Z,markedBreaks:te,merge:zt,moofEnd:se,frameSizes:vt,separatorEnds:Vt,separatedBreaks:De,reachSeparated:Fe,BRIDGE:7,AROUND:15,LOGO_MAX_S:1200}})();function Si(a){let _t=B.LOGO_MAX_S+160,ft=_t+120,lt=3,si=8192,le=480,ni=8,ri=3e4,oi=4e3,ai=150,Ue=1e4,At=5*60*1e3,ce=2e4,it=240,ct=135,D=0,Dt=null,Ft=!1,St=null,dt=null,It=[],ht="none",Mt=null,we=0,Rt=new Map,Zt=[],de=0,Bt="none",$t=[],Z=null,te="none",zt=-1/0,jt=0,he=new Map,ue=null,ut=new Map,kt=new Map,mt=new Map,ee=0,Se=0,yt=null,Nt=!1,Et=null,qt=!1,ie="none",se=[],bt=new Map,vt=new Map,Vt=[];function De(d){let u=String(d).indexOf("?");return u<0?String(d):String(d).slice(0,u)}function Fe(d,u){try{let y=d&&d.contentId,f=!!a.isLive(),m=y?De(y):null;St=y||null;let S=u&&u.live_thumbnails_url;dt=f&&typeof S=="string"&&S.indexOf("https://")===0?S.replace(/\/+$/,""):null,qt=f&&!!(u&&u.separated_breaks===!0);let E=!f&&!!(u&&u.recording)&&m!==null;if(m!==null&&m===Dt&&f===Ft){E&&/^error/.test(ht)&&(Mt={url:St,name:Dt,mine:D});return}D++,Dt=m,Ft=f,yt=null,Nt=a.show(!1),It=[],ht=E?"waiting":"none",Zt=[],de=0,Bt="none",$t=[],Z=null,te="none",zt=-1/0,jt=0,ue=null,ut=new Map,kt=new Map,mt=new Map,ie=qt?"waiting":"none",se=[],bt=new Map,vt=new Map,Vt=[],Mt=E?{url:St,name:Dt,mine:D}:null,we=0}catch{ht="error"}}function c(d,u,y){let f=new Array(d.length),m=0,S=async()=>{for(;m<d.length;){let w=m++;f[w]=await y(d[w],w)}},E=[];for(let w=0;w<Math.min(u,d.length);w++)E.push(S());return Promise.all(E).then(()=>f)}async function g(d){let u=new AbortController,y=setTimeout(()=>u.abort(),ce);try{let f=await fetch(d,{credentials:"omit",signal:u.signal});if(!f.ok)throw new Error("http "+f.status);return await f.text()}finally{clearTimeout(y)}}function _(d,u,y){return new Promise(f=>{let m=new Image,S=setTimeout(()=>{m.onload=null,m.onerror=null,f(null)},ce);m.crossOrigin="anonymous",m.onload=()=>{clearTimeout(S);try{Et===null&&(Et=document.createElement("canvas")),(Et.width!==u||Et.height!==y)&&(Et.width=u,Et.height=y);let E=Et.getContext("2d",{willReadFrequently:!0});E.drawImage(m,0,0,u,y),f(E.getImageData(0,0,u,y).data)}catch{f(null)}},m.onerror=()=>{clearTimeout(S),f(null)},m.src=d})}function o(d,u,y){let f=new Uint8Array(it*ct),m=0;for(let S=0;S<ct;S++){let E=(S*u+y)*4;for(let w=0;w<it;w++)f[m++]=d[E]*77+d[E+1]*150+d[E+2]*29>>8,E+=4}return f}function l(d){let u=/^PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?$/.exec(d||"");return u?Number(u[1]||0)*3600+Number(u[2]||0)*60+Number(u[3]||0):NaN}function h(d,u){let y=[];for(let f=d.firstElementChild;f;f=f.nextElementSibling)f.localName===u&&y.push(f);return y}function b(d,u){let y=h(d,"BaseURL")[0];return y&&y.textContent?new URL(y.textContent.trim(),u).href:u}function P(d,u,y,f){let m=f||h(d,"Representation")[0];if(!m)return[];let S=h(d,"SegmentTemplate")[0]||h(m,"SegmentTemplate")[0],E=S&&S.getAttribute("media");if(!E)return[];let w=Number(S.getAttribute("timescale")||1),k=Number(S.getAttribute("presentationTimeOffset")||0),L=(tt,Pt,xt)=>tt.replace(new RegExp("\\$"+Pt+"(?:%0(\\d+)d)?\\$","g"),(ne,Ht)=>Ht?String(xt).padStart(Number(Ht),"0"):String(xt)),O=(tt,Pt)=>new URL(L(L(E.split("$RepresentationID$").join(m.getAttribute("id")),"Time",tt),"Number",Pt),u).href,U=[],J=h(S,"SegmentTimeline")[0];if(J){let tt=0,Pt=Number(S.getAttribute("startNumber")||1),xt=h(J,"S");for(let ne=0;ne<xt.length;ne++){let Ht=xt[ne];Ht.getAttribute("t")!==null&&(tt=Number(Ht.getAttribute("t")));let Pe=Number(Ht.getAttribute("d")),Te=Number(Ht.getAttribute("r")||0);if(!(Pe>0))return[];if(Te<0){let _e=ne+1<xt.length?xt[ne+1].getAttribute("t"):null,Pi=_e!==null?Number(_e):y*w+k;Te=Math.ceil((Pi-tt)/Pe)-1}if(!(Te>=0))return[];for(let _e=0;_e<=Te;_e++)if(U.push({time:(tt-k)/w,duration:Pe/w,url:O(tt,Pt)}),tt+=Pe,Pt++,U.length>Ue)return[]}return U}let K=Number(S.getAttribute("duration"))/w,Y=Number(S.getAttribute("startNumber")||1);if(!(K>0))return[];let nt=0;S.getAttribute("eptDelta")!==null?nt=Number(S.getAttribute("eptDelta"))/w:nt=(Y-1)*K-k/w,nt<0&&-nt<K||(nt=0);let at=S.getAttribute("endNumber")!==null?Number(S.getAttribute("endNumber")):Y+Math.ceil((y-nt)/K)-1;if(!(at>=Y)||at-Y+1>Ue)return[];for(let tt=Y;tt<=at;tt++)U.push({time:(tt-Y)*K+nt,duration:K,url:O("",tt)});return U}async function M(d,u){if(d.length===0)return null;let y=/<p\b[^>]*>([\s\S]*?)<\/p>/g,f=0,m=await c(d,4,async S=>{if(u!==D)return!0;try{let E=await g(S.url).catch(()=>g(S.url)),w;for(y.lastIndex=0;(w=y.exec(E))!==null;)if(w[1].replace(/<[^>]+>/g,"").trim()!=="")return!0;return!1}catch{return f++,!0}});if(u!==D)throw new Error("superseded");if(f*20>m.length)throw new Error("captions unread");return B.captionBreaks(m,d[0].time,d[0].duration)}async function N(d,u,y,f){if(d.length===0||d.length>ai||y!==1||!(u>0))return null;let m=u,S=B.track(d.length*m,it,ct),E=async O=>(await c(O,1,async J=>{if(f!==D)return!1;let K=await _(d[J].url,u*it,ct);if(K===null&&f===D&&(K=await _(d[J].url,u*it,ct)),K===null)return!1;for(let Y=0;Y<m;Y++)S.add(J*m+Y,o(K,u*it,Y*it));return!0})).every(J=>J),w=d.map((O,U)=>U);if(!await E(w.filter(O=>O%2===0)))throw new Error("thumbnails unread");let k=S.gone();if(k===null)return null;let L=O=>{if(O<0||O>=d.length)return!1;for(let U=O*m;U<(O+1)*m;U++)if(k[U])return!0;return!1};if(!await E(w.filter(O=>O%2===1&&(L(O-1)||L(O+1)))))throw new Error("thumbnails unread");return S.breaks(d[0].time,d[0].duration/m)}async function A(d,u,y){if(Rt.has(u)){It=Rt.get(u),ht="known";return}ht="searching";try{let f=new DOMParser().parseFromString(await g(d),"application/xml").documentElement,m=f?h(f,"Period"):[],S=f?l(f.getAttribute("mediaPresentationDuration")):NaN;if(f&&(f.getAttribute("type")==="dynamic"||!(S>0)))throw new Error("not whole yet");if(!f||m.length!==1){y===D&&(ht="not a recording");return}let E=b(m[0],b(f,d)),w=null,k=null;for(let O of h(m[0],"AdaptationSet")){let U=h(O,"Representation")[0],J=O.getAttribute("mimeType")||U&&U.getAttribute("mimeType")||"",K=O.getAttribute("contentType")||J.split("/")[0];if(K==="text"&&w===null)w=await M(P(O,E,S),y);else if(K==="image"&&k===null){let Y=h(O,"EssentialProperty").concat(U?h(U,"EssentialProperty"):[]).filter(at=>/thumbnail_tile$/.test(at.getAttribute("schemeIdUri")||""))[0],nt=/^(\d+)x(\d+)$/.exec(Y&&Y.getAttribute("value")||"");nt&&(k=await N(P(O,E,S),Number(nt[1]),Number(nt[2]),y))}if(y!==D)return}let L=B.combine(w,k).filter(O=>O[0]>0&&O[1]<S);if(Rt.set(u,L),Rt.size>20&&Rt.delete(Rt.keys().next().value),y!==D)return;It=L,ht="found "+L.length+" (captions "+(w===null?"none":w.length)+", logo "+(k===null?"none":k.length)+")"}catch(f){y===D&&(ht="error: "+String(f&&f.message).slice(0,40),setTimeout(()=>{y===D&&/^error/.test(ht)&&(Mt={url:d,name:u,mine:y})},At*2**Math.min(we++,12)))}}async function T(d){try{let u=new DOMParser().parseFromString(await g(St),"application/xml").documentElement;if(!u||d!==D)return;let y=Date.parse(u.getAttribute("availabilityStartTime")||"")/1e3;if(!isFinite(y)){Bt="no start time";return}let f=h(u,"Period"),m=f.map(w=>l(w.getAttribute("start"))),S=null,E=f.map((w,k)=>{let L=isFinite(m[k])?y+m[k]:S!==null?S:y,O=l(w.getAttribute("duration")),U=isFinite(O)?L+O:k+1<m.length&&isFinite(m[k+1])?y+m[k+1]:null,J=h(w,"EventStream").filter(Y=>(Y.getAttribute("schemeIdUri")||"").indexOf("urn:scte:scte35")===0),K=[];for(let Y of J){let nt=Number(Y.getAttribute("timescale")||1),at=Number(Y.getAttribute("presentationTimeOffset")||0);for(let tt of h(Y,"Event")){let Pt=B.opens(new XMLSerializer().serializeToString(tt));if(Pt===null)continue;let xt=Number(tt.getAttribute("duration")||0)/nt;K.push({at:L+(Number(tt.getAttribute("presentationTime")||0)-at)/nt,duration:xt>0?xt:null,opens:Pt})}}return S=U,{start:L,end:U,marks:K,signalled:J.length>0}});Zt=B.markedBreaks(E),Bt="periods "+f.length+", breaks "+Zt.length,qt&&(se=$(u,y))}catch(u){d===D&&(Bt="error: "+String(u&&u.message).slice(0,40))}}function $(d,u){let y=[],f=Date.now()/1e3,m=b(d,St);for(let S of h(d,"Period")){let E=u+(l(S.getAttribute("start"))||0),w=null,k=null;for(let U of h(S,"AdaptationSet"))if(!(U.getAttribute("contentType")!=="video"&&!/^video\//.test(U.getAttribute("mimeType")||"")))for(let J of h(U,"Representation")){let K=Number(J.getAttribute("bandwidth"));K>0&&(k===null||K<Number(k.getAttribute("bandwidth")))&&(w=U,k=J)}if(k===null)continue;let L=h(w,"SegmentTemplate")[0]||h(k,"SegmentTemplate")[0];if(!L||!h(L,"SegmentTimeline")[0])continue;let O=b(k,b(w,b(S,m)));for(let U of P(w,O,f-E,k))y.push({time:E+U.time,duration:U.duration,url:U.url})}return y}async function F(d,u){let y=new AbortController,f=setTimeout(()=>y.abort(),ce);try{let m=await fetch(d,{credentials:"omit",headers:{Range:"bytes=0-"+(u-1)},signal:y.signal});if(!m.ok)return null;let S=new Uint8Array(await m.arrayBuffer());return S.length>u?S.subarray(0,u):S}catch{return null}finally{clearTimeout(f)}}async function Ot(d){let u=await F(d.url,si);if(u===null)return null;let y=B.moofEnd(u);if(y===null||(y>u.length&&(u=await F(d.url,y)),u===null))return null;let f=B.frameSizes(u);return f===null||f.length===0?null:B.separatorEnds(f,d.time,d.duration/f.length)}async function ke(d,u,y){let f=d-le,m=Math.min(u-ni,d+le),S=se.filter(k=>k.time+k.duration>f&&k.time<m&&(!bt.has(k.time)||vt.has(k.time)&&vt.get(k.time)<lt)),E=await c(S,6,Ot);if(y!==D)return;S.forEach((k,L)=>{E[L]===null?vt.set(k.time,(vt.get(k.time)||0)+1):vt.delete(k.time),bt.set(k.time,E[L]||[])});for(let k of Array.from(bt.keys()))k<d-2*le&&bt.delete(k);for(let k of Array.from(vt.keys()))k<d-2*le&&vt.delete(k);let w=[];for(let k of bt.values())for(let L of k)w.push(L);Vt=B.separatedBreaks(w),ie="segments "+bt.size+", breaks "+Vt.length}async function Gt(d,u,y){let f=[];for(let w=d;w<=u;w+=4)(!ut.has(w)||mt.has(w)&&mt.get(w)<lt)&&f.push(w);if(f.length===0)return;let m=Z,S=dt,E=await c(f,4,async w=>{if(y!==D)return null;let k=await _(S+"/"+w,it,ct);if(k===null)return null;let L=o(k,it,0);return[B.score(m,L),m.lower?B.score(m.lower,L):null]});y!==D||m!==Z||f.forEach((w,k)=>{E[k]===null?mt.set(w,(mt.get(w)||0)+1):mt.delete(w),ut.set(w,E[k]===null?m.usual:E[k][0]),m.lower&&kt.set(w,E[k]===null?m.lower.usual:E[k][1])})}async function pe(d,u){let y=dt;return(await c(d,4,async f=>{if(u!==D)return null;let m=await _(y+"/"+f,it,ct);return m===null?null:o(m,it,0)})).filter(f=>f!==null)}function Ee(d){if(d.length===0)return null;let u=B.track(d.length,it,ct);return d.forEach((y,f)=>u.add(f,y)),u.logo()}async function Be(d,u,y){let f=[];for(let w=d-1200;w<=Math.min(u,d+1200);w+=28)f.push(w);let m=await pe(f,y);if(y!==D)return;if(m.length===0){C(d);return}let S=Ee(m);S!==null&&S.channel&&he.set(dt,B.alone(S));let E=null;if(S===null){let w=he.get(dt);if(w&&B.seenIn(w,m,.4))E=w;else if(ue!==dt){let k=await G(d,y);if(y!==D)return;k!==null&&(he.set(dt,k),B.seenIn(k,m,.4)&&(E=k))}}zt=d,Z=E||S,ut=new Map,kt=new Map,mt=new Map,te=Z===null?"none in "+m.length+" pictures":"strength "+Math.round(Z.strength)+(Z.lower?", lower one "+Math.round(Z.lower.strength):"")+(E!==null?", kept":""),Z===null?C(d):jt=0}function C(d){zt=d-900+Math.min(900,120*2**jt),120*2**jt<900&&jt++}async function G(d,u){let y=null;for(let f=0;f<3;f++){let m=d-1200-f*2*1200,S=[];for(let k=m-2*1200;k<m;k+=28)S.push(k);let E=await pe(S,u);if(u!==D)return null;if(E.length===0){if(f===0)return null;break}let w=Ee(E);if(w!==null&&w.channel){y=B.alone(w);break}}return ue=dt,y}function z(d){let u=d;for(;ut.has(u-4);)u-=4;let y=[],f=[];for(let S=u;ut.has(S);S+=4)y.push(ut.get(S)),Z.lower&&f.push(kt.has(S)?kt.get(S):Z.lower.usual);let m=y.map(()=>!0);return{first:u,gone:B.gone(y,Z.usual,m),lowerGone:Z.lower?B.gone(f,Z.lower.usual,m):null}}async function X(d,u,y){let f=Math.floor(d/4)*4,m=Math.floor((u-12)/4)*4;if(f>m)return;let S=Math.abs(f-zt),E=$t.some(k=>k[0]<=f&&f<=k[1])&&S<=900+B.LOGO_MAX_S;if(S>900&&!E&&await Be(f,m,y),Z===null||y!==D)return;await Gt(f-64,Math.min(m,f+88),y);for(let k=0;k<4;k++){if(y!==D||!ut.has(f))return;let L=z(f),O=L.gone.length,U=L.first+O*4,J=B.runs(B.solid(L.gone),B.BRIDGE).concat(L.lowerGone?B.runs(B.solid(L.lowerGone),B.BRIDGE):[]),K=J.some(at=>at[1]+B.AROUND>=O&&(O-at[0])*4<=_t),Y=(f-L.first)/4,nt=J.some(at=>at[0]<B.AROUND&&at[1]>=Y&&(at[1]+1)*4<=_t);if(K&&U<=m)await Gt(U,Math.min(m,U+120),y);else if(nt&&L.first>f-_t)await Gt(L.first-120,L.first-4,y);else break}if(y!==D||Z===null||!ut.has(f))return;let w=z(f);$t=B.logoBreaks(w.gone,w.first,4,w.lowerGone);for(let k of Array.from(ut.keys()))k<f-ft&&ut.delete(k);for(let k of Array.from(kt.keys()))k<f-ft&&kt.delete(k);for(let k of Array.from(mt.keys()))k<f-ft&&mt.delete(k)}function q(){let d=a.liveRange(),u=a.currentTime();if(!d||typeof u!="number"||!isFinite(u)||!isFinite(d.end))return null;let y=a.absoluteTime(u),f=a.absoluteTime(d.end),m=Date.now()/1e3;return typeof y!="number"||typeof f!="number"||!(y>m-86400&&y<m+600)||!(f>=y)?null:{at:y,end:f}}async function Q(d){if(ee!==d){ee=d;try{let u=q();if(u===null||u.end-u.at<=60)return;Date.now()-de>=ri&&St&&(de=Date.now(),await T(d)),qt&&d===D&&await ke(u.at,u.end,d),dt!==null&&d===D&&await X(u.at,u.end,d)}catch(u){te="error: "+String(u&&u.message).slice(0,40)}finally{ee===d&&(ee=0)}}}function H(){let d=null;try{let u=a.state();if(Dt!==null&&(u==="playing"||u==="paused")){let y=a.currentTime();if(Mt!==null&&u==="playing"){let m=Mt;Mt=null,m.mine===D&&A(m.url,m.name,m.mine)}let f=m=>[m[0],m[1]-32];if(Ft){if(!a.joining()){let m=q();if(m!==null){let S=w=>m.at>=w[0]&&m.at<w[1]-1&&w[1]<=m.end-2,E=Zt.filter(S)[0]||Vt.filter(S)[0]||$t.map(f).map(w=>B.reachSeparated(w,Vt)).filter(S)[0];if(E){let w=a.mediaTime(E[1]);typeof w=="number"&&isFinite(w)&&w>y&&(d=w)}}Date.now()-Se>=oi&&(Se=Date.now(),Q(D))}}else{let m=It.map(f).filter(S=>y>=S[0]&&y<S[1]-1)[0];m&&(d=m[1])}}}catch{d=null}yt=d,Nt=a.show(yt!==null)}function V(){if(yt===null||!Nt)return!1;let d=yt;return yt=null,Nt=a.show(!1),a.seek(d),!0}function W(){let d={live:Ft,offered:yt!==null,skip_to:yt};if(Ft){d.marked=Bt,d.logo=dt===null?"no pictures":te,d.found=$t.length,qt&&(d.separators=ie);try{let u=q();d.clock=u===null?"none":Math.round(Date.now()/1e3-u.end)+" s behind at the live point"}catch{d.clock="error"}}else d.recording=ht,d.breaks=It.map(u=>[Math.round(u[0]),Math.round(u[1])]);return d}return{load:Fe,tick:H,skip:V,report:W}}var Ei="0.1.22";function Di(){let a=navigator.userAgent||"",t=/Android|iPhone|iPad|iPod|Mobile/i.test(a),e=/wv|WebView/i.test(a)||window.navigator.standalone===!0;return t||e}var Fi={fr:"Francais",fra:"Francais",fre:"Francais",en:"English",eng:"English",de:"Deutsch",deu:"Deutsch",ger:"Deutsch",es:"Espanol",spa:"Espanol",it:"Italiano",ita:"Italiano",pt:"Portugues",por:"Portugues",qaa:"Original",und:"Indefini",mul:"Multiple"};function ki(a){if(!a)return"Inconnu";let t=a.toLowerCase();return Fi[t]||a.toUpperCase()}function Le(a){let t=a.split(":");if(t.length<2)return null;let e=t.slice(1).join(":");try{let i=e,s=e.length%4;s&&(i+="=".repeat(4-s));let n=atob(i.replace(/-/g,"+").replace(/_/g,"/"));return JSON.parse(n)}catch{return null}}var ii=class extends Jt{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},panel:{type:Object},_channels:{type:Array},_loading:{type:Boolean},_error:{type:String},_playing:{type:Boolean},_selectedChannel:{type:Object},_streamData:{type:Object},_isFullscreen:{type:Boolean},_playerError:{type:String},_playerLoading:{type:Boolean},_currentTime:{type:Number},_duration:{type:Number},_volume:{type:Number},_muted:{type:Boolean},_paused:{type:Boolean},_audioTracks:{type:Array},_textTracks:{type:Array},_selectedAudioIndex:{type:Number},_selectedTextIndex:{type:Number},_isLive:{type:Boolean},_programStart:{type:Number},_programEnd:{type:Number},_showAudioMenu:{type:Boolean},_showTextMenu:{type:Boolean},_expandedChannels:{type:Object},_channelPrograms:{type:Object},_loadingPrograms:{type:Object},_searchQuery:{type:String},_searchResults:{type:Array},_searching:{type:Boolean},_showingSearch:{type:Boolean},_expandedResults:{type:Object},_resultEpisodes:{type:Object},_loadingEpisodes:{type:Object},_castTargets:{type:Array},_selectedTarget:{type:String},_activeTab:{type:String},_recordings:{type:Array},_loadingRecordings:{type:Boolean},_expandedRecordings:{type:Object},_recordingEpisodes:{type:Object},_loadingRecordingEpisodes:{type:Object},_castPlaying:{type:Boolean},_castTarget:{type:String},_castTitle:{type:String},_activeCasts:{type:Object},_focusedCastHost:{type:String},_localPlaybackInitiated:{type:Boolean},_localMinimized:{type:Boolean},_castMinimized:{type:Boolean},_castLoading:{type:Boolean},_tonightChannels:{type:Array},_loadingTonight:{type:Boolean},_episodePlaylist:{type:Array},_episodeIndex:{type:Number},_selectedEntityId:{type:String}}}static get styles(){return xi`
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
    `}constructor(){super(),this._boundOnFullscreenChange=this._onFullscreenChange.bind(this),this._boundOnDocumentClick=this._onDocumentClick.bind(this),this._channels=[],this._loading=!0,this._error=null,this._playing=!1,this._selectedChannel=null,this._streamData=null,this._isFullscreen=!1,this._playerError=null,this._playerLoading=!1,this._player=null,this._entityUnsubscribe=null,this._showPlayOverlay=!1,this._adSkip=null,this._adOffer=!1,this._castSkipTo=null,this._currentTime=0,this._duration=0,this._volume=.5,this._muted=!1,this._paused=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._liveDelay=0,this._showAudioMenu=!1,this._showTextMenu=!1,this._updateInterval=null,this._expandedChannels={},this._channelPrograms={},this._loadingPrograms={},this._searchQuery="",this._searchResults=[],this._searching=!1,this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._searchToken=0,this._castTargets=[],this._isMobile=Di(),this._selectedTarget=this._isMobile?"":"local",this._activeTab="live",this._recordings=[],this._loadingRecordings=!1,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castProgressInterval=null,this._castBasePosition=0,this._castPositionUpdatedAt=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._castMinimized=!1,this._castLoading=!1,this._tonightChannels=[],this._loadingTonight=!1,this._episodePlaylist=[],this._episodeIndex=-1,this._episodeParentTitle="",this._episodeIsRecording=!1,this._sessionId=this._generateSessionId(),this._selectedEntityId=localStorage.getItem("molotov_selected_entity")||""}_generateSessionId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"molotov-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10)}connectedCallback(){super.connectedCallback(),console.log(`[Molotov Panel] Connected - v${Ei}`),this._hasLoadedChannels=!1,document.addEventListener("fullscreenchange",this._boundOnFullscreenChange),document.addEventListener("click",this._boundOnDocumentClick)}disconnectedCallback(){if(super.disconnectedCallback(),this._playing){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"})}this._cleanupPlayer(),this._stopCastProgressUpdate(),document.removeEventListener("fullscreenchange",this._boundOnFullscreenChange),document.removeEventListener("click",this._boundOnDocumentClick),this._entityUnsubscribe&&(this._entityUnsubscribe(),this._entityUnsubscribe=null)}_onDocumentClick(t){t.composedPath().some(e=>e.classList?.contains("track-menu-container"))||(this._showAudioMenu=!1,this._showTextMenu=!1,this.requestUpdate())}updated(t){t.has("hass")&&this.hass&&(this._hasLoadedChannels||(this._hasLoadedChannels=!0,this._loadChannels()),this._syncWithEntity())}async _loadChannels(){this._loading=!0,this._error=null;try{let t=this._getEntityId();if(!t)throw new Error("Entite Molotov TV introuvable");console.log(`[Molotov Panel] Loading channels for ${t}`);let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"now_playing",media_content_type:"directory"});e&&e.children?(this._channels=e.children.map(i=>this._parseChannel(i)),console.log(`[Molotov Panel] Loaded ${this._channels.length} channels`),this._channels.length>0&&await this._fetchCastTargets(t,this._channels[0].mediaContentId)):this._channels=[],this._loading=!1}catch(t){console.error("[Molotov Panel] Failed to load channels:",t),this._error=t.message||"Erreur lors du chargement des chaines",this._loading=!1}}async _fetchCastTargets(t,e){try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:e,media_content_type:"program"});if(i&&i.children){let s=i.children.filter(n=>n.media_content_id.startsWith("cast:")).map(n=>({mediaContentId:n.media_content_id,title:n.title}));this._castTargets=s,this._isMobile&&s.length>0&&(!this._selectedTarget||this._selectedTarget==="local")&&(this._selectedTarget=s[0].mediaContentId),console.log(`[Molotov Panel] Found ${s.length} cast targets`)}}catch(i){console.error("[Molotov Panel] Failed to fetch cast targets:",i),this._castTargets=[]}}_handleTargetChange(t){let e=t.target.value;this._isMobile&&e==="local"||(this._selectedTarget=e,console.log(`[Molotov Panel] Selected target: ${this._selectedTarget}`))}_switchTab(t){this._activeTab=t,t==="recordings"&&this._recordings.length===0&&this._loadRecordings(),t==="tonight"&&this._tonightChannels.length===0&&this._loadTonight(),this.requestUpdate()}async _loadRecordings(){let t=this._getEntityId();if(!t)return;this._loadingRecordings=!0,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this.requestUpdate();try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"recordings",media_content_type:"directory"});i&&i.children?(this._recordings=i.children.map(s=>{let n=Le(s.media_content_id);return{mediaContentId:s.media_content_id,title:s.title,thumbnail:s.thumbnail,description:n?.desc||null,isFolder:!!n?.folder}}),console.log(`[Molotov Panel] Loaded ${this._recordings.length} recordings`)):this._recordings=[]}catch(i){console.error("[Molotov Panel] Failed to load recordings:",i),this._recordings=[]}this._loadingRecordings=!1,this.requestUpdate();let e=this._recordings.filter(i=>i.isFolder);e.length>0&&(await Promise.all(e.map(i=>this._fetchRecordingEpisodes(i))),this.requestUpdate())}async _loadTonight(){let t=this._getEntityId();if(t){this._loadingTonight=!0,this.requestUpdate();try{let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"tonight_epg",media_content_type:"directory"});if(e&&e.children&&e.children.length>0){let i=new Map;for(let n of e.children){if(!n.media_content_id.startsWith("tonight_program:"))continue;let r=n.media_content_id.split(":");if(r.length<6)continue;let p=r[1],x=decodeURIComponent(r[2]),I=decodeURIComponent(r[3]),j=parseInt(r[4])*1e3,R=parseInt(r[5])*1e3,st=r.length>6?decodeURIComponent(r.slice(6).join(":")):"",et=n.title;et.startsWith("\u{1F534} ")&&(et=et.substring(3));let rt=et.match(/^\d{2}:\d{2}-\d{2}:\d{2}\s+(.+)$/);rt&&(et=rt[1]);let ot={mediaContentId:n.media_content_id,title:et,thumbnail:n.thumbnail,start:j,end:R,description:st};i.has(p)||i.set(p,{id:p,name:x,thumbnail:I,programs:[]}),i.get(p).programs.push(ot)}let s=Array.from(i.values());for(let n of s)n.programs.sort((r,p)=>r.start-p.start);this._tonightChannels=s,console.log(`[Molotov Panel] Loaded tonight EPG for ${s.length} channels`)}else this._tonightChannels=[]}catch(e){console.error("[Molotov Panel] Failed to load tonight EPG:",e),this._tonightChannels=[]}this._loadingTonight=!1,this.requestUpdate()}}async _toggleRecordingExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedRecordings[i]){this._expandedRecordings={...this._expandedRecordings,[i]:!1},this.requestUpdate();return}if(!e.isFolder){await this._playRecordingDirectly(e);return}this._recordingEpisodes[i]||await this._fetchRecordingEpisodes(e);let s=this._recordingEpisodes[i]||[];if(s.length===0){console.log("[Molotov Panel] No episodes found, playing recording directly"),await this._playRecordingDirectly(e);return}if(s.length===1){console.log("[Molotov Panel] Only 1 episode found, playing it directly"),await this._playRecordingEpisode(s[0],e.title);return}this._expandedRecordings={...this._expandedRecordings,[i]:!0},this.requestUpdate()}async _playRecordingDirectly(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:"",currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=t.mediaContentId;i.startsWith("recording:")&&(i=i.substring(10));let s=this._buildPlayMediaId(`replay:${i}`);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:s,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play recording failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}async _fetchRecordingEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"recording"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._recordingEpisodes={...this._recordingEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for recording "${t.title}"`)}else this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch recording episodes:",s),this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!1},this.requestUpdate()}async _playRecordingEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._recordingEpisodes,!0),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play recording episode failed:",s),this._playerError=s.message||"Erreur de lecture",this._castLoading=!1}}}_buildPlayMediaId(t){if(this._selectedTarget==="local")return`play_local:${this._sessionId}:${t}`;let e=this._selectedTarget.split(":");if(e.length>=2){let i=e[1],s=e.length>=3&&e[2]!=="native"&&e[2]!=="custom"?"":e[2];return s?`cast:${i}:${s}:${t}`:`cast:${i}:${t}`}return`play_local:${t}`}_isLocalPlayback(){return this._selectedTarget==="local"}_parseEpisodeChildren(t){return t.filter(e=>e.media_content_id.startsWith("episode:")||e.media_content_id.startsWith("replay:")||e.media_content_id.startsWith("recording:")||e.can_play).map(e=>{let i=Le(e.media_content_id);return{mediaContentId:e.media_content_id,title:e.title,thumbnail:e.thumbnail,description:i?.desc||null}})}_initPlaybackFlags(){this._isLocalPlayback()?(this._localPlaybackInitiated=!0,this._localMinimized=!1):this._castLoading=!0}_parseChannel(t){let e=t.media_content_id,[i,s]=e.split("|"),n=null;if(s)try{let et=s,rt=s.length%4;rt&&(et+="=".repeat(4-rt)),n=decodeURIComponent(escape(atob(et.replace(/-/g,"+").replace(/_/g,"/"))))}catch{}let r=i.split(":"),p,x,I;r[0]==="program"?(p=r[1],x=r[2]?parseInt(r[2])*1e3:null,I=r[3]?parseInt(r[3])*1e3:null):r[0]==="live"&&(p=r[1]);let j=t.title.split(" - "),R=j[0],st=j.slice(1).join(" - ")||"Direct";return{id:p,name:R,thumbnail:t.thumbnail,mediaContentId:i,currentProgram:{title:st,description:n,start:x,end:I},nextProgram:null}}_getMolotovEntities(){return!this.hass||!this.hass.states?[]:Object.keys(this.hass.states).filter(t=>t.startsWith("media_player.molotov")).sort()}_getEntityId(){let t=this._getMolotovEntities();return t.length===0?null:t.length===1?t[0]:this._selectedEntityId&&t.includes(this._selectedEntityId)?this._selectedEntityId:t[0]}_handleEntityChange(t){let e=this._getEntityId();this._playing&&e&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState(),this._selectedEntityId=t.target.value,localStorage.setItem("molotov_selected_entity",this._selectedEntityId),this._hasLoadedChannels=!1,this._channels=[],this._recordings=[],this._tonightChannels=[],this._channelPrograms={},this._expandedChannels={},this._loadingPrograms={},this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._loadChannels()}async _toggleChannelExpand(t,e){t.stopPropagation();let i=e.id;if(this._expandedChannels[i]){this._expandedChannels={...this._expandedChannels,[i]:!1},this.requestUpdate();return}this._expandedChannels={...this._expandedChannels,[i]:!0},this._channelPrograms[i]||await this._fetchChannelPrograms(e),this.requestUpdate()}async _fetchChannelPrograms(t){let e=this._getEntityId();if(!e)return;let i=t.id;this._loadingPrograms={...this._loadingPrograms,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`channel:${i}`,media_content_type:"channel"});if(s&&s.children){let n=s.children.filter(r=>r.media_content_id.startsWith("replay:")).map(r=>this._parseReplayItem(r,t));this._channelPrograms={...this._channelPrograms,[i]:n}}}catch(s){console.error("[Molotov Panel] Failed to fetch channel replays:",s),this._channelPrograms={...this._channelPrograms,[i]:[]}}this._loadingPrograms={...this._loadingPrograms,[i]:!1},this.requestUpdate()}_parseReplayItem(t,e){let i=Le(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,channelName:e.name,description:i?.desc||null}}async _playReplay(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:t.channelName,currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play replay failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}_handleSearchInput(t){this._searchQuery=t.target.value}_handleSearchKeydown(t){t.key==="Enter"&&this._performSearch()}async _performSearch(){let t=this._searchQuery.trim();if(!t)return;let e=this._getEntityId();if(!e)return;let i=++this._searchToken;this._searching=!0,this._showingSearch=!0,this._searchResults=[],this._expandedResults={},this._resultEpisodes={},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`search:${encodeURIComponent(t)}`,media_content_type:"search"});if(i!==this._searchToken)return;if(s&&s.children){let n=s.children.filter(p=>p.media_content_id.startsWith("search_result:")).map(p=>this._parseSearchResult(p)),r=await this._filterResultsWithEpisodes(n,e,i);if(i!==this._searchToken)return;this._searchResults=r,console.log(`[Molotov Panel] Found ${this._searchResults.length} results with episodes for "${t}"`)}else this._searchResults=[]}catch(s){if(i!==this._searchToken)return;console.error("[Molotov Panel] Search failed:",s),this._searchResults=[]}i===this._searchToken&&(this._searching=!1,this.requestUpdate())}async _filterResultsWithEpisodes(t,e,i){let s=t.map(async r=>{try{let p=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:r.mediaContentId,media_content_type:"search_result"});if(p&&p.children){let x=this._parseEpisodeChildren(p.children);if(x.length>0)return(i===void 0||i===this._searchToken)&&(this._resultEpisodes={...this._resultEpisodes,[r.mediaContentId]:x}),r}return null}catch(p){return console.error(`[Molotov Panel] Failed to check episodes for "${r.title}":`,p),null}});return(await Promise.all(s)).filter(r=>r!==null)}_parseSearchResult(t){let e=Le(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,mediaClass:t.media_class,description:e?.desc||null}}_clearSearch(){this._searchToken++,this._searchQuery="",this._searchResults=[],this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this.requestUpdate()}async _toggleResultExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedResults[i]){this._expandedResults={...this._expandedResults,[i]:!1},this.requestUpdate();return}this._expandedResults={...this._expandedResults,[i]:!0},this._resultEpisodes[i]||await this._fetchResultEpisodes(e),this.requestUpdate()}async _fetchResultEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingEpisodes={...this._loadingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"search_result"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._resultEpisodes={...this._resultEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for "${t.title}"`)}else this._resultEpisodes={...this._resultEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch episodes:",s),this._resultEpisodes={...this._resultEpisodes,[i]:[]}}this._loadingEpisodes={...this._loadingEpisodes,[i]:!1},this.requestUpdate()}_setEpisodePlaylist(t,e,i,s){for(let n of Object.values(i)){let r=n.findIndex(p=>p.mediaContentId===t.mediaContentId);if(r!==-1){this._episodePlaylist=n,this._episodeIndex=r,this._episodeParentTitle=e,this._episodeIsRecording=s;return}}this._episodePlaylist=[],this._episodeIndex=-1}async _playEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._resultEpisodes,!1),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play episode failed:",s),this._playerError=s.message||"Erreur de lecture"}}}_syncWithEntity(){let t=this._getEntityId();if(!t||!this.hass?.states?.[t])return;let e=this.hass.states[t],s=(e.attributes.local_streams||{})[this._sessionId];if(s&&s.url&&this._localPlaybackInitiated){let n=s.url,r=s.drm,p=s.selected_track;if(!this._playing||this._currentStreamUrl!==n){this._currentStreamUrl=n,this._streamData={url:n,drm:r,selectedTrack:p,title:e.attributes.media_title||"En direct",breakSearch:{live_thumbnails_url:s.live_thumbnails_url,recording:s.recording,separated_breaks:s.separated_breaks}},this._playing=!0,this._localMinimized=!1,this._playerError=null,this._playerLoading=!0;let x=this._selectedChannel;x?.currentProgram?.start&&x?.currentProgram?.end?(this._isLive=!0,this._programStart=x.currentProgram.start,this._programEnd=x.currentProgram.end):(this._isLive=!0,this._programStart=null,this._programEnd=null),this.updateComplete.then(()=>this._initDashPlayer())}}else this._playing&&(this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1);if(e.attributes.active_casts&&Object.keys(e.attributes.active_casts).length>0){let n=e.attributes.active_casts,r=e.attributes.cast_target;this._activeCasts=n,this._focusedCastHost=r||null;let p=r?n[r]?.skip_to:null;this._castSkipTo=typeof p=="number"?p:null,(!this._castPlaying||this._castTarget!==r)&&(this._castPlaying=!0,this._castMinimized=this._isMobile,this._castLoading=!1,this._castTarget=r,this._castTitle=e.attributes.media_title||"En cours de lecture",this._startCastProgressUpdate(),console.log("[Molotov Panel] Cast playback detected:",r,"total casts:",Object.keys(n).length)),this._castPositionUpdatedAt=e.attributes.media_position_updated_at?new Date(e.attributes.media_position_updated_at).getTime()/1e3:null,this._castBasePosition=e.attributes.media_position||0,this._duration=e.attributes.media_duration||0,this._volume=e.attributes.volume_level??.5,this._muted=e.attributes.is_volume_muted||!1,this._paused=e.state==="paused",this._castTitle=e.attributes.media_title||this._castTitle,this._isLive=e.attributes.is_live||!1}else this._castPlaying&&(this._onPlaybackEnded()||(this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._castMinimized=!1,this._castLoading=!1,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate()))}async _playChannel(t){let e=this._getEntityId();if(!e){console.error("[Molotov Panel] No entity found");return}this._selectedChannel=t,this._playerError=null,this._episodePlaylist=[],this._episodeIndex=-1,this._initPlaybackFlags(),this._isLocalPlayback()&&t.currentProgram?.start&&t.currentProgram?.end&&(this._programStart=t.currentProgram.start,this._programEnd=t.currentProgram.end,this._isLive=!0);try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}async _initDashPlayer(){if(!this._streamData)return;let t=this.shadowRoot.querySelector("video");if(!t){console.error("[Molotov Panel] Video element not found");return}window.dashjs||await this._loadDashJs(),this._player&&(this._player.reset(),this._player=null),this._adSkip=null,this._adOffer=!1,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null);try{let e=window.dashjs.MediaPlayer().create();this._player=e,e.updateSettings({debug:{logLevel:window.dashjs.Debug.LOG_LEVEL_WARNING},streaming:{buffer:{stableBufferTime:6,bufferTimeAtTopQuality:30,bufferTimeAtTopQualityLongForm:60},delay:{liveDelay:3}}});let i=this._streamData.drm;i&&i.type==="widevine"&&(console.log("[Molotov Panel] Configuring Widevine DRM"),e.setProtectionData({"com.widevine.alpha":{serverURL:i.license_url,httpRequestHeaders:i.headers||{}}})),e.initialize(t,this._streamData.url,!0),this._adSkip=Si(this._adSkipEnv(t,e));let s=this._streamData.selectedTrack,n="fr";s?.track_audio&&(n=s.track_audio),e.setInitialMediaSettingsFor("audio",{lang:n}),s?.track_text&&e.setInitialMediaSettingsFor("text",{lang:s.track_text}),e.on(window.dashjs.MediaPlayer.events.ERROR,r=>{let p=r.error?.message||r.error||"Erreur de lecture";console.error("[Molotov Panel] Player error:",p),this._playerError=p,this._playerLoading=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.STREAM_INITIALIZED,()=>{console.log("[Molotov Panel] Stream initialized"),this._player===e&&this._adSkip&&this._adSkip.load({contentId:this._streamData.url},this._streamData.breakSearch),this._enforceAudioLanguage(e,s),this._updateTracks(),this._startProgressUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_STARTED,()=>{console.log("[Molotov Panel] Playback started"),this._showPlayOverlay=!1,this._playerLoading=!1,this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PAUSED,()=>{this._paused=!0,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PLAYING,()=>{this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_ENDED,()=>{console.log("[Molotov Panel] Playback ended"),this._onPlaybackEnded()}),t.volume=this._volume,t.muted=this._muted,this._autoplayCheckTimeout=setTimeout(()=>{this._autoplayCheckTimeout=null,t.paused&&!t.currentTime&&(console.log("[Molotov Panel] Autoplay blocked"),this._showPlayOverlay=!0,this.requestUpdate())},1500)}catch(e){console.error("[Molotov Panel] Failed to init player:",e),this._playerError=e.message}}_adSkipEnv(t,e){let i=()=>{try{let s=e.timeAsUTC();return typeof s=="number"&&isFinite(s)?s:null}catch{return null}};return{isLive:()=>{try{return e.isDynamic()}catch{return!1}},joining:()=>this._playerLoading,state:()=>t.paused?"paused":t.readyState>=2?"playing":"other",currentTime:()=>t.currentTime,liveRange:()=>t.seekable&&t.seekable.length?{start:t.seekable.start(0),end:t.seekable.end(t.seekable.length-1)}:null,absoluteTime:s=>{let n=i();return n===null?null:n+(s-t.currentTime)},mediaTime:s=>{let n=i();return n===null?null:t.currentTime+(s-n)},show:s=>(this._adOffer!==s&&(this._adOffer=s,this.requestUpdate()),s),seek:s=>{t.currentTime=s}}}_startProgressUpdate(){this._updateInterval&&clearInterval(this._updateInterval),this._updateInterval=setInterval(()=>{this._updateProgress()},1e3)}_updateProgress(){let t=this.shadowRoot?.querySelector("video");if(!(!t||!this._player)){if(this._currentTime=t.currentTime,this._duration=t.duration||0,this._paused=t.paused,this._adSkip&&this._adSkip.tick(),this._isLive&&t.seekable&&t.seekable.length>0){let e=t.seekable.end(t.seekable.length-1);this._liveDelay=Math.max(0,(e-t.currentTime)*1e3)}this.requestUpdate()}}_startCastProgressUpdate(){this._stopCastProgressUpdate(),this._castProgressInterval=setInterval(()=>{this._updateCastProgress()},1e3)}_stopCastProgressUpdate(){this._castProgressInterval&&(clearInterval(this._castProgressInterval),this._castProgressInterval=null)}_updateCastProgress(){if(!this._castPlaying){this._stopCastProgressUpdate();return}if(this._castBasePosition!=null&&this._castPositionUpdatedAt&&!this._paused){let t=Date.now()/1e3,e=Math.max(0,t-this._castPositionUpdatedAt);this._currentTime=this._castBasePosition+e}else this._currentTime=this._castBasePosition||0;this.requestUpdate()}_updateTracks(){if(!this._player)return;let t=this._player.getTracksFor("audio")||[];this._audioTracks=t.map((n,r)=>({index:r,lang:n.lang,label:ki(n.lang)}));let e=this._player.getCurrentTrackFor("audio");e&&(this._selectedAudioIndex=t.findIndex(n=>n.index===e.index));let i=this._player.getTracksFor("text")||[];if(this._textTracks=i.map((n,r)=>({index:r,lang:n.lang,label:ki(n.lang)})),!this._player.isTextEnabled())this._selectedTextIndex=-1;else{let n=this._player.getCurrentTrackFor("text");n&&(this._selectedTextIndex=i.findIndex(r=>r.index===n.index))}console.log("[Molotov Panel] Audio tracks:",this._audioTracks),console.log("[Molotov Panel] Text tracks:",this._textTracks),this.requestUpdate()}_enforceAudioLanguage(t,e){let i=t.getTracksFor("audio");if(!i||i.length===0)return;let n=t.getCurrentTrackFor("audio")?.lang||"",r="fr";if(e?.track_audio&&(r=e.track_audio),n!==r&&n!=="fra"&&n!=="fre"){let p=i.find(x=>x.lang===r||x.lang==="fra"||x.lang==="fre");!p&&(n==="en"||n==="eng"||n==="qaa")&&(p=i.find(x=>x.lang!=="en"&&x.lang!=="eng"&&x.lang!=="qaa")),p&&(console.log("[Molotov Panel] Switching audio to:",p.lang),t.setCurrentTrack(p))}}_loadDashJs(){return new Promise((t,e)=>{if(window.dashjs){t();return}let i=document.createElement("script");i.src="https://cdn.dashjs.org/v4.7.4/dash.all.min.js",i.crossOrigin="anonymous",i.onload=()=>{console.log("[Molotov Panel] dash.js loaded"),t()},i.onerror=()=>{e(new Error("Failed to load dash.js"))},document.head.appendChild(i)})}_cleanupPlayer(){if(this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null),this._player){try{this._player.reset()}catch{}this._player=null}this._adSkip=null,this._adOffer=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._playerLoading=!1}_stopPlayback(){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState()}_resetLocalPlaybackState(){this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._selectedChannel=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._episodePlaylist=[],this._episodeIndex=-1}_onPlaybackEnded(){if(this._episodePlaylist.length===0||this._episodeIndex<0)return!1;let t=this._episodeIndex+1;if(t>=this._episodePlaylist.length)return this._episodePlaylist=[],this._episodeIndex=-1,!1;let e=this._episodePlaylist[t];return this._episodeIndex=t,console.log(`[Molotov Panel] Auto-playing next episode: ${e.title}`),this._episodeIsRecording?this._playRecordingEpisode(e,this._episodeParentTitle):this._playEpisode(e,this._episodeParentTitle),!0}_goBackFromPlayer(){this._localMinimized=!0,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null)}_goBackFromCast(){this._castMinimized=!0}_expandCurrentPlayback(){this._playing&&this._streamData?(this._localMinimized=!1,this._updateInterval||this._startProgressUpdate()):this._castPlaying&&(this._castMinimized=!1)}_togglePlayPause(){let t=this.shadowRoot.querySelector("video");t&&(t.paused?t.play():t.pause())}_localSeek(t){let e=this.shadowRoot.querySelector("video");if(!e)return;if(t===null){e.currentTime=0;return}let i=e.currentTime+t;e.currentTime=Math.max(0,Math.min(e.duration||1/0,i))}_localSeekBeginning(){this._localSeek(null)}_localSkipBack30(){this._localSeek(-30)}_localSkipBack10(){this._localSeek(-10)}_localSkipForward30(){this._localSeek(30)}_localSkipAd(){this._adSkip&&this._adSkip.skip()}_handleProgressClick(t){let i=t.currentTarget.getBoundingClientRect(),s=(t.clientX-i.left)/i.width;if(this._isLive&&this._programStart&&this._programEnd){if(this._player?.getDVRSeekOffset?.(0)!==void 0){let r=this._player.duration(),p=s*r;this._player.seek(p)}}else if(this._duration){let n=this.shadowRoot.querySelector("video");n&&(n.currentTime=s*this._duration)}}_handleVolumeChange(t){let e=parseFloat(t.target.value);this._volume=e;let i=this.shadowRoot.querySelector("video");i&&(i.volume=e,i.muted=e===0,this._muted=e===0)}_toggleMute(){let t=this.shadowRoot.querySelector("video");t&&(this._muted=!this._muted,t.muted=this._muted,this.requestUpdate())}_selectAudioTrack(t){if(!this._player||t<0||t>=this._audioTracks.length)return;let e=this._player.getTracksFor("audio");e&&e[t]&&(this._player.setCurrentTrack(e[t]),this._selectedAudioIndex=t),this._showAudioMenu=!1,this.requestUpdate()}_selectTextTrack(t){if(this._player){if(t===-1)this._player.enableText(!1),this._selectedTextIndex=-1;else if(t>=0&&t<this._textTracks.length){let e=this._player.getTracksFor("text");e&&e[t]&&(this._player.enableText(!0),this._player.setCurrentTrack(e[t]),this._selectedTextIndex=t)}this._showTextMenu=!1,this.requestUpdate()}}_toggleAudioMenu(t){t.stopPropagation(),this._showAudioMenu=!this._showAudioMenu,this._showTextMenu=!1,this.requestUpdate()}_toggleTextMenu(t){t.stopPropagation(),this._showTextMenu=!this._showTextMenu,this._showAudioMenu=!1,this.requestUpdate()}_toggleFullscreen(){let t=this.shadowRoot.querySelector(".video-wrapper");t&&(document.fullscreenElement?document.exitFullscreen():t.requestFullscreen().catch(e=>{console.error("[Molotov Panel] Fullscreen error:",e)}))}_onFullscreenChange(){this._isFullscreen=!!document.fullscreenElement,this.requestUpdate()}_handlePlayOverlayClick(){let t=this.shadowRoot.querySelector("video");t&&(t.muted=!1,t.play().catch(e=>console.error("[Molotov Panel] Manual play error:",e)),this._showPlayOverlay=!1,this.requestUpdate())}_formatTime(t){if(!t||!isFinite(t))return"00:00";let e=Math.floor(t/3600),i=Math.floor(t%3600/60),s=Math.floor(t%60);return e>0?`${e}:${i.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`:`${i}:${s.toString().padStart(2,"0")}`}_formatClockTime(t){return t?new Date(t).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):""}_getProgressPercent(){if(this._isLive&&this._programStart&&this._programEnd){let t=Date.now()-(this._liveDelay||0),e=this._programEnd-this._programStart;if(e<=0)return 100;let i=t-this._programStart;return Math.min(100,Math.max(0,i/e*100))}else if(this._duration>0&&isFinite(this._duration))return this._currentTime/this._duration*100;return 0}render(){let t=this._playing&&this._streamData,e=t&&!this._localMinimized,i=this._castPlaying&&!this._castMinimized,s=!e&&!i;return v`
      ${t?v`
        <div style="${this._localMinimized?"position:fixed;left:-9999px;width:1px;height:1px;overflow:hidden;":"height:100%;"}">
          ${this._renderPlayer()}
        </div>
      `:""}
      ${i?this._renderCastPlayer():""}
      ${s?this._renderChannelList():""}
    `}_renderChannelList(){return v`
      <div class="container">
        <div class="header">
          <h1>Molotov TV</h1>
          <div class="header-actions">
            ${this._getMolotovEntities().length>1?v`
              <select class="cast-select" @change=${this._handleEntityChange} .value=${this._getEntityId()}>
                ${this._getMolotovEntities().map(t=>v`
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
              ${this._isMobile?"":v`<option value="local">Cet appareil</option>`}
              ${this._castTargets.map(t=>v`
                  <option value=${t.mediaContentId}>${t.title}</option>
                `)}
            </select>
          </div>
        </div>

        ${this._castLoading?v`
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
    `}_handleRefresh(){this._activeTab==="live"?this._loadChannels():this._activeTab==="tonight"?this._loadTonight():this._loadRecordings()}_renderChannels(){return v`
      <div class="content">
        ${this._loading?v`<div class="loading">Chargement des chaines...</div>`:this._error?v`
              <div class="error">
                <span>${this._error}</span>
                <button @click=${this._loadChannels}>Reessayer</button>
              </div>
            `:v`
              <div class="channel-list">
                ${this._channels.map(t=>this._renderChannelItem(t))}
              </div>
            `}
      </div>
    `}_renderRecordings(){return v`
      <div class="content">
        ${this._loadingRecordings?v`<div class="loading">Chargement des enregistrements...</div>`:this._recordings.length>0?v`
              <div class="channel-list">
                ${this._recordings.map(t=>this._renderRecordingItem(t))}
              </div>
            `:v`<div class="error">Aucun enregistrement trouve</div>`}
      </div>
    `}_renderTonight(){return v`
      <div class="content">
        ${this._loadingTonight?v`<div class="loading">Chargement du programme de ce soir...</div>`:this._tonightChannels.length>0?v`
              <div class="tonight-list">
                ${this._tonightChannels.map(t=>this._renderTonightChannel(t))}
              </div>
            `:v`<div class="error">Aucun programme disponible pour ce soir</div>`}
      </div>
    `}_renderTonightChannel(t){return v`
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
    `}_renderTonightProgram(t,e){let i=this._formatClockTime(t.start),s=this._formatClockTime(t.end),n=Date.now(),r=t.start<=n&&t.end>n,p=t.end<=n;return v`
      <div
        class="tonight-program ${r?"live":""} ${p?"past":""}"
        role="button"
        tabindex="0"
        @click=${()=>this._playTonightProgram(t,e)}
        @keydown=${x=>this._activateOnKey(x,()=>this._playTonightProgram(t,e))}
      >
        ${t.thumbnail?v`<img class="tonight-program-thumb" src=${t.thumbnail} loading="lazy" @load=${x=>x.target.style.display=""} @error=${x=>x.target.style.display="none"} />`:""}
        <div class="tonight-program-info">
          <div class="tonight-program-time">
            ${i} - ${s}
            ${r?v`<span class="live-indicator">EN DIRECT</span>`:""}
          </div>
          <div class="tonight-program-title">${t.title}</div>
          ${t.description?v`<div class="tonight-program-description">${t.description}</div>`:""}
        </div>
      </div>
    `}_activateOnKey(t,e){(t.key==="Enter"||t.key===" "||t.key==="Spacebar")&&(t.preventDefault(),e())}_tonightToProgramId(t){let e=t.split(":");return e[0]!=="tonight_program"||e.length<6?t:`program:${e[1]}:${e[4]}:${e[5]}`}async _playTonightProgram(t,e){let i=this._getEntityId();if(!i)return;this._episodePlaylist=[],this._episodeIndex=-1;let s=this._tonightToProgramId(t.mediaContentId);this._selectedChannel={id:e.id,name:e.name,thumbnail:e.thumbnail,mediaContentId:s,currentProgram:{title:t.title,start:t.start,end:t.end}},this._playerError=null;let n=Date.now();this._isLive=t.start<=n&&t.end>n,this._isLive?(this._programStart=t.start,this._programEnd=t.end):(this._programStart=null,this._programEnd=null),this._initPlaybackFlags();try{let r=this._buildPlayMediaId(s);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:r,media_content_type:"video"})}catch(r){console.error("[Molotov Panel] Play tonight program failed:",r),this._playerError=r.message||"Erreur de lecture",this._castLoading=!1}}_renderRecordingItem(t){let e=t.mediaContentId,i=this._expandedRecordings[e],s=this._recordingEpisodes[e]||[],n=this._loadingRecordingEpisodes[e],r=this._recordingEpisodes[e]!==void 0,p=!t.isFolder||r&&s.length<=1;return v`
      <div class="search-result-row">
        <div
          class="search-result-main"
          role="button"
          tabindex="0"
          @click=${x=>this._toggleRecordingExpand(x,t)}
          @keydown=${x=>this._activateOnKey(x,()=>this._toggleRecordingExpand(x,t))}
        >
          ${p?v`<ha-icon class="expand-icon" icon="mdi:play-circle-outline"></ha-icon>`:v`<ha-icon
                class="expand-icon ${i?"expanded":""}"
                icon="mdi:chevron-right"
              ></ha-icon>`}
          ${t.thumbnail?v`<img
                class="recording-thumb"
                src=${t.thumbnail}
                loading="lazy"
                @load=${x=>x.target.style.display=""} @error=${x=>x.target.style.display="none"}
              />`:v`<div class="recording-thumb"></div>`}
          <div class="recording-info">
            <div class="recording-title">${t.title}</div>
            ${t.description?v`<div class="recording-subtitle">${t.description}</div>`:""}
          </div>
        </div>
        ${i?v`
              <div class="episodes-list">
                ${n?v`<div class="episodes-loading">Chargement des episodes...</div>`:s.length>0?s.map(x=>v`
                        <div
                          class="episode-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playRecordingEpisode(x,t.title)}
                          @keydown=${I=>this._activateOnKey(I,()=>this._playRecordingEpisode(x,t.title))}
                        >
                          ${x.thumbnail?v`<img class="episode-thumb" src=${x.thumbnail} loading="lazy" @load=${I=>I.target.style.display=""} @error=${I=>I.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${x.title}</div>
                            ${x.description?v`<div class="episode-desc">${x.description}</div>`:""}
                          </div>
                        </div>
                      `):v`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderSearchResults(){return v`
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
        ${this._searching?v`<div class="loading">Recherche...</div>`:this._searchResults.length>0?v`
              <div class="channel-list">
                ${this._searchResults.map(t=>this._renderSearchResultItem(t))}
              </div>
            `:v`<div class="error">Aucun resultat trouve</div>`}
      </div>
    `}_renderSearchResultItem(t){let e=t.mediaContentId,i=this._expandedResults[e],s=this._resultEpisodes[e]||[],n=this._loadingEpisodes[e];return v`
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
          ${t.thumbnail?v`<img class="search-result-thumb" src=${t.thumbnail} loading="lazy" @load=${r=>r.target.style.display=""} @error=${r=>r.target.style.display="none"} />`:""}
          <div class="search-result-info">
            <div class="search-result-title">${t.title}</div>
            ${t.description?v`<div class="search-result-subtitle">${t.description}</div>`:""}
          </div>
        </div>
        ${i?v`
              <div class="episodes-list">
                ${n?v`<div class="episodes-loading">Chargement des episodes...</div>`:s.length>0?s.map(r=>v`
                        <div
                          class="episode-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playEpisode(r,t.title)}
                          @keydown=${p=>this._activateOnKey(p,()=>this._playEpisode(r,t.title))}
                        >
                          ${r.thumbnail?v`<img class="episode-thumb" src=${r.thumbnail} loading="lazy" @load=${p=>p.target.style.display=""} @error=${p=>p.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${r.title}</div>
                            ${r.description?v`<div class="episode-desc">${r.description}</div>`:""}
                          </div>
                        </div>
                      `):v`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderChannelItem(t){let e=t.currentProgram,i=e?.start?this._formatClockTime(e.start):"",s=e?.end?this._formatClockTime(e.end):"",n=i&&s?`${i} - ${s}`:"",r=this._expandedChannels[t.id],p=this._channelPrograms[t.id]||[],x=this._loadingPrograms[t.id];return v`
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
                ${n?v`<span class="program-time">(${n})</span>`:""}
              </div>
              ${e?.description?v`<div class="program-next">${e.description}</div>`:""}
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
        ${r?v`
              <div class="replay-list">
                ${x?v`<div class="replay-loading">Chargement...</div>`:p.length>0?p.map(I=>v`
                        <div
                          class="replay-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playReplay(I)}
                          @keydown=${j=>this._activateOnKey(j,()=>this._playReplay(I))}
                        >
                          ${I.thumbnail?v`<img class="replay-thumb" src=${I.thumbnail} loading="lazy" @load=${j=>j.target.style.display=""} @error=${j=>j.target.style.display="none"} />`:""}
                          <div class="replay-item-info">
                            <span class="replay-item-title">${I.title}</span>
                            ${I.description?v`<span class="replay-item-desc">${I.description}</span>`:""}
                          </div>
                        </div>
                      `):v`<div class="replay-empty">Aucun replay disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderMiniCastBar(){return v`
      <div class="mini-cast-bar">
        <div class="mini-cast-info">
          <ha-icon icon="mdi:cast-connected" style="--mdc-icon-size: 20px; color: var(--primary-color);"></ha-icon>
          <span class="mini-cast-title">${this._castTitle||"Chromecast"}</span>
        </div>
        <div class="mini-cast-controls">
          ${this._isLive?v`
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
    `}_renderPlayer(){let t=this._getProgressPercent(),e=this._selectedAudioIndex>=0&&this._audioTracks[this._selectedAudioIndex]?this._audioTracks[this._selectedAudioIndex].label:"Audio",i=this._selectedTextIndex>=0&&this._textTracks[this._selectedTextIndex]?this._textTracks[this._selectedTextIndex].label:"Off";return v`
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

            ${this._playerLoading?v`<div class="player-loading">
                  <div class="loading-spinner"></div>
                  <div class="loading-text">Chargement...</div>
                </div>`:""}

            ${this._playerError?v`<div class="player-error">${this._playerError}</div>`:""}

            ${this._showPlayOverlay?v`
                  <div class="play-overlay" @click=${this._handlePlayOverlayClick}>
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                `:""}

            <!-- Custom controls -->
            <div class="custom-controls ${this._paused?"":"autohide"}">
              <div class="progress-container">
                ${this._isLive&&this._programStart?v`<span>${this._formatClockTime(Date.now()-(this._liveDelay||0))}</span>`:v`<span>${this._formatTime(this._currentTime)}</span>`}
                <div class="progress-bar" @click=${this._handleProgressClick}>
                  <div class="progress-filled" style="width: ${t}%"></div>
                </div>
                ${this._isLive&&this._programEnd?v`<span>${this._formatClockTime(this._programEnd)}</span>`:v`<span>${this._formatTime(this._duration)}</span>`}
                ${this._isLive?v`<span class="live-badge">LIVE</span>`:""}
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
                  ${this._adOffer?v`<button class="icon-btn pubs-btn" @click=${this._localSkipAd}>
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
                  ${this._audioTracks.length>1?v`
                        <div class="track-menu-container">
                          <button class="icon-btn" @click=${this._toggleAudioMenu}>
                            <ha-icon icon="mdi:volume-source"></ha-icon>
                            <span style="font-size: 11px; margin-left: 2px;">${e}</span>
                          </button>
                          ${this._showAudioMenu?v`
                                <div class="track-menu">
                                  ${this._audioTracks.map(s=>v`
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

                  ${this._textTracks.length>0?v`
                        <div class="track-menu-container">
                          <button class="icon-btn" @click=${this._toggleTextMenu}>
                            <ha-icon icon="mdi:subtitles"></ha-icon>
                            <span style="font-size: 11px; margin-left: 2px;">${i}</span>
                          </button>
                          ${this._showTextMenu?v`
                                <div class="track-menu">
                                  <div
                                    class="track-menu-item ${this._selectedTextIndex===-1?"selected":""}"
                                    @click=${()=>this._selectTextTrack(-1)}
                                  >
                                    Off
                                  </div>
                                  ${this._textTracks.map(s=>v`
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
    `}_renderCastPlayer(){let t=this._getProgressPercent();return v`
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
                ${this._isLive&&this._programStart?v`<span>${this._formatClockTime(Date.now()-(this._liveDelay||0))}</span>`:v`<span>${this._formatTime(this._currentTime)}</span>`}
                <div class="progress-bar" @click=${this._handleCastSeek}>
                  <div class="progress-filled" style="width: ${t}%"></div>
                </div>
                ${this._isLive&&this._programEnd?v`<span>${this._formatClockTime(this._programEnd)}</span>`:v`<span>${this._formatTime(this._duration)}</span>`}
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
                  ${this._castSkipTo!==null?v`<button class="icon-btn pubs-btn" @click=${this._castSkipAd}>
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
    `}_renderMultiCastBar(){let t=Object.entries(this._activeCasts||{});return t.length<=1?"":v`
      <div class="multi-cast-bar">
        ${t.map(([e,i])=>{let s=e===this._focusedCastHost,n=i.title||e,r=i.state==="playing";return v`
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
