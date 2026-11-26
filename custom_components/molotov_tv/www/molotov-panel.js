var ze=typeof window<"u"&&window.customElements!=null&&window.customElements.polyfillWrapFlushCallback!==void 0;var Wt=(a,t,e=null)=>{for(;t!==e;){let i=t.nextSibling;a.removeChild(t),t=i}};var mt=`{{lit-${String(Math.random()).slice(2)}}}`,je=`<!--${mt}-->`,li=new RegExp(`${mt}|${je}`),oe="$lit$",Kt=class{constructor(t,e){this.parts=[],this.element=e;let i=[],s=[],n=document.createTreeWalker(e.content,133,null,!1),r=0,u=-1,x=0,{strings:M,values:{length:j}}=t;for(;x<j;){let R=n.nextNode();if(R===null){n.currentNode=s.pop();continue}if(u++,R.nodeType===1){if(R.hasAttributes()){let st=R.attributes,{length:et}=st,rt=0;for(let ot=0;ot<et;ot++)ci(st[ot].name,oe)&&rt++;for(;rt-- >0;){let ot=M[x],It=Ie.exec(ot)[2],_t=It.toLowerCase()+oe,ft=R.getAttribute(_t);R.removeAttribute(_t);let lt=ft.split(li);this.parts.push({type:"attribute",index:u,name:It,strings:lt}),x+=lt.length-1}}R.tagName==="TEMPLATE"&&(s.push(R),n.currentNode=R.content)}else if(R.nodeType===3){let st=R.data;if(st.indexOf(mt)>=0){let et=R.parentNode,rt=st.split(li),ot=rt.length-1;for(let It=0;It<ot;It++){let _t,ft=rt[It];if(ft==="")_t=xt();else{let lt=Ie.exec(ft);lt!==null&&ci(lt[2],oe)&&(ft=ft.slice(0,lt.index)+lt[1]+lt[2].slice(0,-oe.length)+lt[3]),_t=document.createTextNode(ft)}et.insertBefore(_t,R),this.parts.push({type:"node",index:++u})}rt[ot]===""?(et.insertBefore(xt(),R),i.push(R)):R.data=rt[ot],x+=ot}}else if(R.nodeType===8)if(R.data===mt){let st=R.parentNode;(R.previousSibling===null||u===r)&&(u++,st.insertBefore(xt(),R)),r=u,this.parts.push({type:"node",index:u}),R.nextSibling===null?R.data="":(i.push(R),u--),x++}else{let st=-1;for(;(st=R.data.indexOf(mt,st+1))!==-1;)this.parts.push({type:"node",index:-1}),x++}}for(let R of i)R.parentNode.removeChild(R)}},ci=(a,t)=>{let e=a.length-t.length;return e>=0&&a.slice(e)===t},ge=a=>a.index!==-1,xt=()=>document.createComment(""),Ie=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;var qe=133;function Ve(a,t){let{element:{content:e},parts:i}=a,s=document.createTreeWalker(e,qe,null,!1),n=me(i),r=i[n],u=-1,x=0,M=[],j=null;for(;s.nextNode();){u++;let R=s.currentNode;for(R.previousSibling===j&&(j=null),t.has(R)&&(M.push(R),j===null&&(j=R)),j!==null&&x++;r!==void 0&&r.index===u;)r.index=j!==null?-1:r.index-x,n=me(i,n),r=i[n]}M.forEach(R=>R.parentNode.removeChild(R))}var Ti=a=>{let t=a.nodeType===11?0:1,e=document.createTreeWalker(a,qe,null,!1);for(;e.nextNode();)t++;return t},me=(a,t=-1)=>{for(let e=t+1;e<a.length;e++){let i=a[e];if(ge(i))return e}return-1};function di(a,t,e=null){let{element:{content:i},parts:s}=a;if(e==null){i.appendChild(t);return}let n=document.createTreeWalker(i,qe,null,!1),r=me(s),u=0,x=-1;for(;n.nextNode();)for(x++,n.currentNode===e&&(u=Ti(t),e.parentNode.insertBefore(t,e));r!==-1&&s[r].index===x;){if(u>0){for(;r!==-1;)s[r].index+=u,r=me(s,r);return}r=me(s,r)}}var Ci=new WeakMap;var Yt=a=>typeof a=="function"&&Ci.has(a);var pt={},Me={};var Ut=class{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(let i of this.__parts)i!==void 0&&i.setValue(t[e]),e++;for(let i of this.__parts)i!==void 0&&i.commit()}_clone(){let t=ze?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],i=this.template.parts,s=document.createTreeWalker(t,133,null,!1),n=0,r=0,u,x=s.nextNode();for(;n<i.length;){if(u=i[n],!ge(u)){this.__parts.push(void 0),n++;continue}for(;r<u.index;)r++,x.nodeName==="TEMPLATE"&&(e.push(x),s.currentNode=x.content),(x=s.nextNode())===null&&(s.currentNode=e.pop(),x=s.nextNode());if(u.type==="node"){let M=this.processor.handleTextExpression(this.options);M.insertAfterNode(x.previousSibling),this.__parts.push(M)}else this.__parts.push(...this.processor.handleAttributeExpressions(x,u.name,u.strings,this.options));n++}return ze&&(document.adoptNode(t),customElements.upgrade(t)),t}};var hi=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:a=>a}),Ii=` ${mt} `,At=class{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){let t=this.strings.length-1,e="",i=!1;for(let s=0;s<t;s++){let n=this.strings[s],r=n.lastIndexOf("<!--");i=(r>-1||i)&&n.indexOf("-->",r+1)===-1;let u=Ie.exec(n);u===null?e+=n+(i?Ii:je):e+=n.substr(0,u.index)+u[1]+u[2]+oe+u[3]+mt}return e+=this.strings[t],e}getTemplateElement(){let t=document.createElement("template"),e=this.getHTML();return hi!==void 0&&(e=hi.createHTML(e)),t.innerHTML=e,t}};var Ne=a=>a===null||!(typeof a=="object"||typeof a=="function"),Re=a=>Array.isArray(a)||!!(a&&a[Symbol.iterator]),ae=class{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let s=0;s<i.length-1;s++)this.parts[s]=this._createPart()}_createPart(){return new ye(this)}_getValue(){let t=this.strings,e=t.length-1,i=this.parts;if(e===1&&t[0]===""&&t[1]===""){let n=i[0].value;if(typeof n=="symbol")return String(n);if(typeof n=="string"||!Re(n))return n}let s="";for(let n=0;n<e;n++){s+=t[n];let r=i[n];if(r!==void 0){let u=r.value;if(Ne(u)||!Re(u))s+=typeof u=="string"?u:String(u);else for(let x of u)s+=typeof x=="string"?x:String(x)}}return s+=t[e],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}},ye=class{constructor(t){this.value=void 0,this.committer=t}setValue(t){t!==pt&&(!Ne(t)||t!==this.value)&&(this.value=t,Yt(t)||(this.committer.dirty=!0))}commit(){for(;Yt(this.value);){let t=this.value;this.value=pt,t(this)}this.value!==pt&&this.committer.commit()}},Xt=class a{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(xt()),this.endNode=t.appendChild(xt())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=xt()),t.__insert(this.endNode=xt())}insertAfterPart(t){t.__insert(this.startNode=xt()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(this.startNode.parentNode===null)return;for(;Yt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=pt,e(this)}let t=this.__pendingValue;t!==pt&&(Ne(t)?t!==this.value&&this.__commitText(t):t instanceof At?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):Re(t)?this.__commitIterable(t):t===Me?(this.value=Me,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){let e=this.startNode.nextSibling;t=t??"";let i=typeof t=="string"?t:String(t);e===this.endNode.previousSibling&&e.nodeType===3?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){let e=this.options.templateFactory(t);if(this.value instanceof Ut&&this.value.template===e)this.value.update(t.values);else{let i=new Ut(e,t.processor,this.options),s=i._clone();i.update(t.values),this.__commitNode(s),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());let e=this.value,i=0,s;for(let n of t)s=e[i],s===void 0&&(s=new a(this.options),e.push(s),i===0?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(n),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){Wt(this.startNode.parentNode,t.nextSibling,this.endNode)}},be=class{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,i.length!==2||i[0]!==""||i[1]!=="")throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;Yt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=pt,e(this)}if(this.__pendingValue===pt)return;let t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=pt}},ve=class extends ae{constructor(t,e,i){super(t,e,i),this.single=i.length===2&&i[0]===""&&i[1]===""}_createPart(){return new $e(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}},$e=class extends ye{},ui=!1;(()=>{try{let a={get capture(){return ui=!0,!1}};window.addEventListener("test",a,a),window.removeEventListener("test",a,a)}catch{}})();var xe=class{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=s=>this.handleEvent(s)}setValue(t){this.__pendingValue=t}commit(){for(;Yt(this.__pendingValue);){let n=this.__pendingValue;this.__pendingValue=pt,n(this)}if(this.__pendingValue===pt)return;let t=this.__pendingValue,e=this.value,i=t==null||e!=null&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),s=t!=null&&(e==null||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=Mi(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=pt}handleEvent(t){typeof this.value=="function"?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}},Mi=a=>a&&(ui?{capture:a.capture,passive:a.passive,once:a.once}:a.capture);function Ge(a){let t=Qt.get(a.type);t===void 0&&(t={stringsArray:new WeakMap,keyString:new Map},Qt.set(a.type,t));let e=t.stringsArray.get(a.strings);if(e!==void 0)return e;let i=a.strings.join(mt);return e=t.keyString.get(i),e===void 0&&(e=new Kt(a,a.getTemplateElement()),t.keyString.set(i,e)),t.stringsArray.set(a.strings,e),e}var Qt=new Map;var Dt=new WeakMap,He=(a,t,e)=>{let i=Dt.get(t);i===void 0&&(Wt(t,t.firstChild),Dt.set(t,i=new Xt(Object.assign({templateFactory:Ge},e))),i.appendInto(t)),i.setValue(a),i.commit()};var Oe=class{handleAttributeExpressions(t,e,i,s){let n=e[0];return n==="."?new ve(t,e.slice(1),i).parts:n==="@"?[new xe(t,e.slice(1),s.eventContext)]:n==="?"?[new be(t,e.slice(1),i)]:new ae(t,e,i).parts}handleTextExpression(t){return new Xt(t)}},We=new Oe;typeof window<"u"&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var v=(a,...t)=>new At(a,t,"html",We);var _i=(a,t)=>`${a}--${t}`,Le=!0;typeof window.ShadyCSS>"u"?Le=!1:typeof window.ShadyCSS.prepareTemplateDom>"u"&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),Le=!1);var $i=a=>t=>{let e=_i(t.type,a),i=Qt.get(e);i===void 0&&(i={stringsArray:new WeakMap,keyString:new Map},Qt.set(e,i));let s=i.stringsArray.get(t.strings);if(s!==void 0)return s;let n=t.strings.join(mt);if(s=i.keyString.get(n),s===void 0){let r=t.getTemplateElement();Le&&window.ShadyCSS.prepareTemplateDom(r,a),s=new Kt(t,r),i.keyString.set(n,s)}return i.stringsArray.set(t.strings,s),s},Ni=["html","svg"],Oi=a=>{Ni.forEach(t=>{let e=Qt.get(_i(t,a));e!==void 0&&e.keyString.forEach(i=>{let{element:{content:s}}=i,n=new Set;Array.from(s.querySelectorAll("style")).forEach(r=>{n.add(r)}),Ve(i,n)})})},fi=new Set,Li=(a,t,e)=>{fi.add(a);let i=e?e.element:document.createElement("template"),s=t.querySelectorAll("style"),{length:n}=s;if(n===0){window.ShadyCSS.prepareTemplateStyles(i,a);return}let r=document.createElement("style");for(let M=0;M<n;M++){let j=s[M];j.parentNode.removeChild(j),r.textContent+=j.textContent}Oi(a);let u=i.content;e?di(e,r,u.firstChild):u.insertBefore(r,u.firstChild),window.ShadyCSS.prepareTemplateStyles(i,a);let x=u.querySelector("style");if(window.ShadyCSS.nativeShadow&&x!==null)t.insertBefore(x.cloneNode(!0),t.firstChild);else if(e){u.insertBefore(r,u.firstChild);let M=new Set;M.add(r),Ve(e,M)}},gi=(a,t,e)=>{if(!e||typeof e!="object"||!e.scopeName)throw new Error("The `scopeName` option is required.");let i=e.scopeName,s=Dt.has(t),n=Le&&t.nodeType===11&&!!t.host,r=n&&!fi.has(i),u=r?document.createDocumentFragment():t;if(He(a,u,Object.assign({templateFactory:$i(i)},e)),r){let x=Dt.get(u);Dt.delete(u);let M=x.value instanceof Ut?x.value.template:void 0;Li(i,u,M),Wt(t,t.firstChild),t.appendChild(u),Dt.set(t,x)}!s&&n&&window.ShadyCSS.styleElement(t.host)};var mi;window.JSCompiler_renameProperty=(a,t)=>a;var Ze={toAttribute(a,t){switch(t){case Boolean:return a?"":null;case Object:case Array:return a==null?a:JSON.stringify(a)}return a},fromAttribute(a,t){switch(t){case Boolean:return a!==null;case Number:return a===null?null:Number(a);case Object:case Array:return JSON.parse(a)}return a}},yi=(a,t)=>t!==a&&(t===t||a===a),Ke={attribute:!0,type:String,converter:Ze,reflect:!1,hasChanged:yi},Ye=1,Xe=4,Qe=8,Je=16,ti="finalized",le=class extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();let t=[];return this._classProperties.forEach((e,i)=>{let s=this._attributeNameForProperty(i,e);s!==void 0&&(this._attributeToPropertyMap.set(s,i),t.push(s))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;let t=Object.getPrototypeOf(this)._classProperties;t!==void 0&&t.forEach((e,i)=>this._classProperties.set(i,e))}}static createProperty(t,e=Ke){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;let i=typeof t=="symbol"?Symbol():`__${t}`,s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Object.defineProperty(this.prototype,t,s)}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){let n=this[t];this[e]=s,this.requestUpdateInternal(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||Ke}static finalize(){let t=Object.getPrototypeOf(this);if(t.hasOwnProperty(ti)||t.finalize(),this[ti]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){let e=this.properties,i=[...Object.getOwnPropertyNames(e),...typeof Object.getOwnPropertySymbols=="function"?Object.getOwnPropertySymbols(e):[]];for(let s of i)this.createProperty(s,e[s])}}static _attributeNameForProperty(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=yi){return i(t,e)}static _propertyValueFromAttribute(t,e){let i=e.type,s=e.converter||Ze,n=typeof s=="function"?s:s.fromAttribute;return n?n(t,i):t}static _propertyValueToAttribute(t,e){if(e.reflect===void 0)return;let i=e.type,s=e.converter;return(s&&s.toAttribute||Ze.toAttribute)(t,i)}initialize(){this._updateState=0,this._updatePromise=new Promise(t=>this._enableUpdatingResolver=t),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){let i=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,i)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){this._enableUpdatingResolver!==void 0&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=Ke){let s=this.constructor,n=s._attributeNameForProperty(t,i);if(n!==void 0){let r=s._propertyValueToAttribute(e,i);if(r===void 0)return;this._updateState=this._updateState|Qe,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._updateState=this._updateState&~Qe}}_attributeToProperty(t,e){if(this._updateState&Qe)return;let i=this.constructor,s=i._attributeToPropertyMap.get(t);if(s!==void 0){let n=i.getPropertyOptions(s);this._updateState=this._updateState|Je,this[s]=i._propertyValueFromAttribute(e,n),this._updateState=this._updateState&~Je}}requestUpdateInternal(t,e,i){let s=!0;if(t!==void 0){let n=this.constructor;i=i||n.getPropertyOptions(t),n._valueHasChanged(this[t],e,i.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),i.reflect===!0&&!(this._updateState&Je)&&(this._reflectingProperties===void 0&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,i))):s=!1}!this._hasRequestedUpdate&&s&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=this._updateState|Xe;try{await this._updatePromise}catch{}let t=this.performUpdate();return t!=null&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return this._updateState&Xe}get hasUpdated(){return this._updateState&Ye}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1,e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(i){throw t=!1,this._markUpdated(),i}t&&(this._updateState&Ye||(this._updateState=this._updateState|Ye,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~Xe}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){this._reflectingProperties!==void 0&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,i)=>this._propertyToAttribute(i,this[i],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}};mi=ti;le[mi]=!0;var bi=Element.prototype,Ls=bi.msMatchesSelector||bi.webkitMatchesSelector;var Ue=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ei=Symbol(),we=class{constructor(t,e){if(e!==ei)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return this._styleSheet===void 0&&(Ue?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}},vi=a=>new we(String(a),ei),Ui=a=>{if(a instanceof we)return a.cssText;if(typeof a=="number")return a;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${a}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`)},xi=(a,...t)=>{let e=t.reduce((i,s,n)=>i+Ui(s)+a[n+1],a[0]);return new we(e,ei)};(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");var wi={},Jt=class extends le{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;let t=this.getStyles();if(Array.isArray(t)){let e=(n,r)=>n.reduceRight((u,x)=>Array.isArray(x)?e(x,u):(u.add(x),u),r),i=e(t,new Set),s=[];i.forEach(n=>s.unshift(n)),this._styles=s}else this._styles=t===void 0?[]:[t];this._styles=this._styles.map(e=>{if(e instanceof CSSStyleSheet&&!Ue){let i=Array.prototype.slice.call(e.cssRules).reduce((s,n)=>s+n.cssText,"");return vi(i)}return e})}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){let t=this.constructor._styles;t.length!==0&&(window.ShadyCSS!==void 0&&!window.ShadyCSS.nativeShadow?window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(e=>e.cssText),this.localName):Ue?this.renderRoot.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):this._needsShimAdoptedStyleSheets=!0)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&window.ShadyCSS!==void 0&&window.ShadyCSS.styleElement(this)}update(t){let e=this.render();super.update(t),e!==wi&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(i=>{let s=document.createElement("style");s.textContent=i.cssText,this.renderRoot.appendChild(s)}))}render(){return wi}};Jt.finalized=!0;Jt.render=gi;Jt.shadowRootOptions={mode:"open"};var D=(()=>{function Mt(d,m){let _=[],o=0;for(;o<d.length;){if(!d[o]){o++;continue}let l=o,p=o+1;for(;p<d.length&&p-l<=m+1;)d[p]&&(l=p),p++;_.push([o,l]),o=l+1}return _}function ce(d,m,_){let o=0;for(let g of d)g&&o++;if(!(_>0)||o*2<d.length)return null;let l=Mt(d,3).filter(g=>(g[1]-g[0]+1)*_>=60),p=[];for(let g=0;g+1<l.length;g++){let E=l[g],T=l[g+1],L=m+(E[1]+1)*_,I=m+T[0]*_,C=0;for(let O=E[1]+1;O<T[0];O++)d[O]&&C++;I-L>=150&&I-L<=800&&C*2<T[0]-E[1]-1&&p.push([L,I])}return p}function it(d,m,_){let o=new Array(d.length).fill(!1);for(let l=0;l<d.length;l++){if(!_[l])continue;let p=[];for(let g=Math.max(0,l-2);g<=Math.min(d.length-1,l+2);g++)_[g]&&p.push(d[g]);p.sort((g,E)=>g-E),o[l]=p[p.length>>1]<.5*m}return o}function ct(d){let m=new Array(d.length).fill(!1);for(let _ of Mt(d,0))if(_[1]-_[0]+1>=5)for(let o=_[0];o<=_[1];o++)m[o]=!0;return m}function U(d,m,_,o,l){let p=ct(d),g=(C,O)=>{if(C<0||O>p.length)return!1;let F=0;for(let Pt=C;Pt<O;Pt++)p[Pt]||F++;return F>=8},E=C=>{let O=(C[1]+1-C[0])*m;return g(C[0]-15,C[0])&&g(C[1]+1,C[1]+1+15)&&O>=150&&O<=1200},T=Mt(p,7);if(!_||!o)return T.filter(E);let L=l?T.filter(C=>C[1]-C[0]+1>=10):T,I=[];for(let C of Ft(L,_,o,m)){let O=L.filter(F=>F[0]>=C[0]&&F[1]<=C[1]);if(E(C)&&(!l||O.length===1||O.some(E)))I.push(C);else for(let F of O)E(F)&&I.push([F[0],F[1]])}return I}function Ft(d,m,_,o){let l=[];for(let p of d){let g=l[l.length-1];g&&(p[1]+1-g[0])*o<=1200&&Bt(g[1]+1,p[0],m,_)?g[1]=p[1]:l.push([p[0],p[1]])}return l}function Bt(d,m,_,o){let l=0;for(let p=d;p<m;p++)(_[p]||o[p])&&l++;return m-d<=29&&l>=m-d-7&&wt(_,d,m)<=10&&wt(o,d,m)<=12}function wt(d,m,_){let o=0,l=0;for(let p=m;p<_;p++)o=d[p]?o+1:0,l=Math.max(l,o);return l}function dt(d,m,_,o){let l=d,p=o?d.map((I,C)=>!I&&o[C]):null,g=o?d.map((I,C)=>I&&!o[C]):null,E=U(l,_,g,p,!0);if(o){l=new Array(d.length).fill(!1);let I=new Array(d.length).fill(!1);for(let C of E)for(let O=C[0];O<=C[1];O++)l[O]=d[O]&&o[O],I[O]=d[O]&&!o[O];E=U(l,_,I,p)}let T=ct(l),L=o?ke(d,o,E,m,_):[];return E.map(I=>{let C=Mt(T.slice(I[0],I[1]+1),0),O=Rt(o?ht(C,I[0],d,o):C);return[m+(I[0]+O[0])*_,m+(I[0]+O[1]+1)*_]}).concat(L)}function Rt(d){let m=0,_=d.length-1;for(;_>m&&d[_][1]-d[_][0]+1<10;)_--;for(;m<_&&d[m][1]-d[m][0]+1<10;)m++;return[d[m][0],d[_][1]]}function ht(d,m,_,o){let l=[];for(let p of d){let g=l[l.length-1];g&&!$t(m+g[1]+1,m+p[0],_,o)?g[1]=p[1]:l.push([p[0],p[1]])}return l}function $t(d,m,_,o){let l=0;for(let p=d;p<m;p++)if(!_[p]&&!o[p]||(l=o[p]?0:l+1,l>=5))return!0;return!1}function ke(d,m,_,o,l){let p=ct(d),g=(T,L)=>{if(T<0||L>p.length)return!1;let I=0;for(let C=T;C<L;C++)p[C]||I++;return I>=12},E=[];for(let T of U(m,l)){if(_.some(F=>F[0]<=T[1]&&T[0]<=F[1]))continue;let L=0;for(let F=T[0];F<=T[1];F++)d[F]&&L++;if(L<.5*(T[1]-T[0]+1))continue;let I=-1,C=-1;for(let F=T[0];F<=T[1];F++)p[F]&&(I<0&&(I=F),C=F+1);if(I<0||(C-I)*l<150||!g(I-15,I)||!g(C,C+15))continue;let O=Rt(ht(Mt(p.slice(T[0],T[1]+1),0),T[0],d,m));E.push([o+(T[0]+O[0])*l,o+(T[0]+O[1]+1)*l])}return E}function Nt(d,m){if(d===null)return m||[];if(m===null)return d;let _=[];for(let o of d)for(let l of m){let p=Math.max(o[0],l[0]),g=Math.min(o[1],l[1]);g-p<60||_.push([Math.abs(o[0]-l[0])<=90?l[0]:p,Math.abs(o[1]-l[1])<=90?l[1]:g])}return _}function Zt(d,m,_){let o=Math.floor(m*.22),l=Math.floor(_*.22),p=o-1,g=l-1,E=p*g,T=[[0,0],[m-o,0],[0,_-l],[m-o,_-l]],L=T.map(()=>new Uint8Array(E>0?d*E:0)),I=new Array(d).fill(!1),C=-1;function O(A,V){if(!(E<=0||A<0||A>=d||V.length<m*_)){for(let z=0;z<T.length;z++){let Q=T[z][0],G=T[z][1],J=L[z],W=A*E;for(let q=0;q<g;q++){let K=(G+q)*m+Q;for(let Tt=0;Tt<p;Tt++){let c=V[K];J[W++]=Math.min(255,Math.abs(V[K+1]-c)+Math.abs(V[K+m]-c)),K++}}}I[A]=!0}}function F(A,V,z){let Q=L[A],G=new Uint8Array(E);for(let K=0;K<E;K++){z.fill(0);for(let h of V)z[Q[h*E+K]]++;let Tt=0,c=0;for(;Tt+z[c]<=V.length>>1;)Tt+=z[c++];G[K]=c}let J=Math.max(1,Array.from(G).sort((K,Tt)=>K-Tt)[Math.floor(E*.92)]),W=[],q=0;for(let K=0;K<E;K++)G[K]>=J&&(W.push(K),q+=G[K]);return W.length===0?null:{corner:A,median:G,mask:W,strength:q/W.length,whole:q}}function Pt(A,V,z,Q){let G=null;for(let J=A;J<V;J++){let W=F(J,z,Q);W!==null&&(G===null||W.strength>G.strength)&&(G=W)}return G}function Ee(A,V){let z=L[A.corner],Q=new Float64Array(d),G=[];for(let J of V){let W=J*E,q=0;for(let K of A.mask)q+=Math.min(z[W+K],A.median[K]);Q[J]=q/A.whole,G.push(Q[J])}return G.sort((J,W)=>J-W),A.score=Q,A.usual=G[G.length>>1],A}function _e(){let A=[];for(let q=0;q<d;q++)I[q]&&A.push(q);if(E<=0||A.length<30)return null;let V=new Int32Array(256),z=q=>q!==null&&q.strength>=25?q:null,Q=q=>q!==null&&q.strength>=30?q:null,G=Pt(2,L.length,A,V),J=C<0?z(Pt(0,2,A,V)):C<2?F(C,A,V):null,W=J!==null?J:C<0?z(G):F(C,A,V);return W===null?null:(C=W.corner,Ee(W,A),W.lower=J!==null&&Q(G)!==null?Ee(G,A):null,W)}function ne(A){let V=T[A.corner][0],z=T[A.corner][1];return{width:m,points:A.mask.map(Q=>(z+Math.floor(Q/p))*m+V+Q%p),pattern:A.mask.map(Q=>A.median[Q]),whole:A.whole,usual:A.usual,strength:A.strength,lower:A.lower?ne(A.lower):null,channel:A.corner<2}}function Pe(){let A=_e();return A===null?null:ne(A)}function Te(){let A=_e();return A===null?null:it(A.score,A.usual,I)}return{add:O,logo:Pe,gone:Te,breaks:(A,V)=>{let z=_e();if(z===null)return null;let Q=z.lower?it(z.lower.score,z.lower.usual,I):null;return dt(it(z.score,z.usual,I),A,V,Q)}}}function de(d){return d.lower?Object.assign({},d,{lower:null}):d}function zt(d,m,_){let o=0;for(let l of m)Ot(d,l)>=.5*d.usual&&o++;return o>=_*m.length}function Ot(d,m){let _=0;for(let o=0;o<d.points.length;o++){let l=d.points[o],p=m[l];_+=Math.min(Math.abs(m[l+1]-p)+Math.abs(m[l+d.width]-p),d.pattern[o])}return _/d.whole}function Z(d){let m=String(d).match(/[A-Za-z0-9+\/]{16,}={0,2}/g)||[];for(let _ of m){let o;try{o=atob(_)}catch{continue}if(o.length<20||o.charCodeAt(0)!==252)continue;let l=p=>{if(p<0||p>=o.length)throw new RangeError("short");return o.charCodeAt(p)};try{if(l(13)===5&&!(l(18)&128))return(l(19)&128)!==0;for(let p=16;p+4<=o.length;p++){if(o.substr(p,4)!=="CUEI"||l(p-2)!==2)continue;let g=p+8;if(l(g)&128)continue;g++;let E=l(g);g++,E&128||(g+=1+6*l(g)),E&64&&(g+=5),g+=2+l(g+1);let T=l(g);if([34,48,50,52,54].indexOf(T)>=0)return!0;if([35,49,51,53,55].indexOf(T)>=0)return!1}}catch{return null}return null}return null}function te(d){let m=[];if(d.some(_=>_.signalled))for(let _ of d)for(let o of _.marks){if(!o.opens)continue;let l=null;if(o.duration!==null)l=o.at+o.duration;else{let p=_.marks.filter(g=>g.at>o.at).map(g=>g.at);l=p.length>0?Math.min.apply(null,p):_.end}l!==null&&l>o.at&&m.push([o.at,l])}else{let _=o=>o.end-o.start;for(let o=1;o+1<d.length;o++){let l=d[o-1],p=d[o],g=d[o+1];if(l.end===null||p.end===null||g.end===null)continue;_(p)<10&&_(l)>=60&&_(l)<=420&&_(g)>=60&&_(g)<=420&&m.push([l.start,g.end])}}return jt(m,10)}function jt(d,m){let _=[];for(let o of d.slice().sort((l,p)=>l[0]-p[0])){let l=_[_.length-1];l&&o[0]-l[1]<=m?l[1]=Math.max(l[1],o[1]):_.push([o[0],o[1]])}return _}let qt={270:{tiny:120,mean:40,key:4e3},540:{tiny:172,mean:86,key:8e3},1080:{tiny:430,mean:172,key:12e3}},he=10,ue=14,ut=.2,St=6,yt=90,ee=60,pe=100,gt=3,ie=65536,kt=1e4;function Lt(d,m){return String.fromCharCode(d[m+4],d[m+5],d[m+6],d[m+7])}function se(d){let m=new DataView(d.buffer,d.byteOffset,d.byteLength),_=0;for(;d.length-_>=8;){let o=m.getUint32(_);if(o<8||_+o>ie)return null;if(Lt(d,_)==="moof")return _+o;_+=o}return null}function Vt(d,m,_,o){let l=[],p=_;for(;o-p>=8;){let g=m.getUint32(p);if(g<8||g>o-p)break;l.push({type:Lt(d,p),from:p+8,to:p+g}),p+=g}return l}function bt(d){let m=se(d);if(m===null||m>d.length)return null;let _=new DataView(d.buffer,d.byteOffset,d.byteLength),o=Vt(d,_,0,m).pop();if(!o||o.type!=="moof")return null;let l=Vt(d,_,o.from,o.to).filter(E=>E.type==="traf")[0];if(!l)return null;let p=[],g=-1;for(let E of Vt(d,_,l.from,l.to)){if(E.type!=="tfhd"&&E.type!=="trun")continue;let T=E.from;if(E.to-T<8)return null;let L=_.getUint32(T)&16777215;if(E.type==="tfhd"){let I=T+8;if(L&1&&(I+=8),L&2&&(I+=4),L&8&&(I+=4),L&16){if(I+4>E.to)return null;g=_.getUint32(I)}}else{let I=_.getUint32(T+4),C=((L&256?1:0)+(L&512?1:0)+(L&1024?1:0)+(L&2048?1:0))*4,O=T+8+(L&1?4:0)+(L&4?4:0);if(I>kt||O+I*C>E.to||!(L&512)&&g<0)return null;for(let F=0;F<I;F++)p.push(L&512?_.getUint32(O+(L&256?4:0)):g),O+=C}}return p}function Et(d,m,_,o){let l=[],p=0,g=0;for(let E=0;E<d.length;E++){let T=d[E];if(T>=0&&T<o.tiny){p++,g+=T;continue}p>=he&&p<=ue&&g<=o.mean*p&&T>o.key&&l.push(m+E*_),p=0,g=0}return l}function Gt(d){let m=[];for(let o of d.slice().sort((l,p)=>l-p)){let l=m[m.length-1];l&&o-l[l.length-1]<=ut||(l&&o-l[l.length-1]<=ee?l.push(o):m.push([o]))}let _=[];for(let o=0;o<m.length;o++){let l=m[o],p=m[o+1],g=_[_.length-1];g&&!(g.length>=gt&&l[0]-g[g.length-1]<=pe)&&(g=null),g&&l.length>=gt?g.push(...l):g&&p&&p.length>=gt&&p[0]-l[l.length-1]<=pe?(g.push(...l,...p),o++):_.push(l)}return _.filter(o=>o.length>=St&&o[o.length-1]-o[0]>=yt).map(o=>[o[1],o[o.length-2]])}function Be(d,m){let _=m.filter(o=>o[0]<d[1]&&o[1]>d[1])[0];return _?[d[0],_[1]]:d}return{runs:Mt,captionBreaks:ce,gone:it,solid:ct,logoBreaks:dt,combine:Nt,track:Zt,score:Ot,alone:de,seenIn:zt,opens:Z,markedBreaks:te,merge:jt,moofEnd:se,frameSizes:bt,separatorEnds:Et,separatedBreaks:Gt,reachSeparated:Be,BLACKS:qt,BRIDGE:7,AROUND:15,LOGO_MAX_S:1200}})();function Si(a){let _t=D.LOGO_MAX_S+160,ft=_t+120,lt=3,si=4096,Se=480,ni=8,ri=3e4,oi=4e3,ai=150,Fe=1e4,Mt=5*60*1e3,ce=2e4,it=240,ct=135,U=0,Ft=null,Bt=!1,wt=null,dt=null,Rt=[],ht="none",$t=null,ke=0,Nt=new Map,Zt=[],de=0,zt="none",Ot=[],Z=null,te="none",jt=-1/0,qt=0,he=new Map,ue=null,ut=new Map,St=new Map,yt=new Map,ee=0,pe=0,gt=null,ie=!1,kt=null,Lt=!1,se="none",Vt=[],bt=new Map,Et=new Map,Gt=[];function Be(c){let h=String(c).indexOf("?");return h<0?String(c):String(c).slice(0,h)}function d(c,h){try{let b=c&&c.contentId,f=!!a.isLive(),y=b?Be(b):null;wt=b||null;let k=h&&h.live_thumbnails_url;dt=f&&typeof k=="string"&&k.indexOf("https://")===0?k.replace(/\/+$/,""):null,Lt=f&&!!(h&&h.separated_breaks===!0);let P=!f&&!!(h&&h.recording)&&y!==null;if(y!==null&&y===Ft&&f===Bt){P&&/^error/.test(ht)&&($t={url:wt,name:Ft,mine:U});return}U++,Ft=y,Bt=f,gt=null,ie=a.show(!1),Rt=[],ht=P?"waiting":"none",Zt=[],de=0,zt="none",Ot=[],Z=null,te="none",jt=-1/0,qt=0,ue=null,ut=new Map,St=new Map,yt=new Map,se=Lt?"waiting":"none",Vt=[],bt=new Map,Et=new Map,Gt=[],$t=P?{url:wt,name:Ft,mine:U}:null,ke=0}catch{ht="error"}}function m(c,h,b){let f=new Array(c.length),y=0,k=async()=>{for(;y<c.length;){let S=y++;f[S]=await b(c[S],S)}},P=[];for(let S=0;S<Math.min(h,c.length);S++)P.push(k());return Promise.all(P).then(()=>f)}async function _(c){let h=new AbortController,b=setTimeout(()=>h.abort(),ce);try{let f=await fetch(c,{credentials:"omit",signal:h.signal});if(!f.ok)throw new Error("http "+f.status);return await f.text()}finally{clearTimeout(b)}}function o(c,h,b){return new Promise(f=>{let y=new Image,k=setTimeout(()=>{y.onload=null,y.onerror=null,f(null)},ce);y.crossOrigin="anonymous",y.onload=()=>{clearTimeout(k);try{kt===null&&(kt=document.createElement("canvas")),(kt.width!==h||kt.height!==b)&&(kt.width=h,kt.height=b);let P=kt.getContext("2d",{willReadFrequently:!0});P.drawImage(y,0,0,h,b),f(P.getImageData(0,0,h,b).data)}catch{f(null)}},y.onerror=()=>{clearTimeout(k),f(null)},y.src=c})}function l(c,h,b){let f=new Uint8Array(it*ct),y=0;for(let k=0;k<ct;k++){let P=(k*h+b)*4;for(let S=0;S<it;S++)f[y++]=c[P]*77+c[P+1]*150+c[P+2]*29>>8,P+=4}return f}function p(c){let h=/^PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?$/.exec(c||"");return h?Number(h[1]||0)*3600+Number(h[2]||0)*60+Number(h[3]||0):NaN}function g(c,h){let b=[];for(let f=c.firstElementChild;f;f=f.nextElementSibling)f.localName===h&&b.push(f);return b}function E(c,h){let b=g(c,"BaseURL")[0];return b&&b.textContent?new URL(b.textContent.trim(),h).href:h}function T(c,h,b,f){let y=f||g(c,"Representation")[0];if(!y)return[];let k=g(c,"SegmentTemplate")[0]||g(y,"SegmentTemplate")[0],P=k&&k.getAttribute("media");if(!P)return[];let S=Number(k.getAttribute("timescale")||1),w=Number(k.getAttribute("presentationTimeOffset")||0),N=(tt,Ct,vt)=>tt.replace(new RegExp("\\$"+Ct+"(?:%0(\\d+)d)?\\$","g"),(re,Ht)=>Ht?String(vt).padStart(Number(Ht),"0"):String(vt)),$=(tt,Ct)=>new URL(N(N(P.split("$RepresentationID$").join(y.getAttribute("id")),"Time",tt),"Number",Ct),h).href,B=[],H=g(k,"SegmentTimeline")[0];if(H){let tt=0,Ct=Number(k.getAttribute("startNumber")||1),vt=g(H,"S");for(let re=0;re<vt.length;re++){let Ht=vt[re];Ht.getAttribute("t")!==null&&(tt=Number(Ht.getAttribute("t")));let Ce=Number(Ht.getAttribute("d")),Ae=Number(Ht.getAttribute("r")||0);if(!(Ce>0))return[];if(Ae<0){let fe=re+1<vt.length?vt[re+1].getAttribute("t"):null,Pi=fe!==null?Number(fe):b*S+w;Ae=Math.ceil((Pi-tt)/Ce)-1}if(!(Ae>=0))return[];for(let fe=0;fe<=Ae;fe++)if(B.push({time:(tt-w)/S,duration:Ce/S,url:$(tt,Ct)}),tt+=Ce,Ct++,B.length>Fe)return[]}return B}let Y=Number(k.getAttribute("duration"))/S,X=Number(k.getAttribute("startNumber")||1);if(!(Y>0))return[];let nt=0;k.getAttribute("eptDelta")!==null?nt=Number(k.getAttribute("eptDelta"))/S:nt=(X-1)*Y-w/S,nt<0&&-nt<Y||(nt=0);let at=k.getAttribute("endNumber")!==null?Number(k.getAttribute("endNumber")):X+Math.ceil((b-nt)/Y)-1;if(!(at>=X)||at-X+1>Fe)return[];for(let tt=X;tt<=at;tt++)B.push({time:(tt-X)*Y+nt,duration:Y,url:$("",tt)});return B}async function L(c,h){if(c.length===0)return null;let b=/<p\b[^>]*>([\s\S]*?)<\/p>/g,f=0,y=await m(c,4,async k=>{if(h!==U)return!0;try{let P=await _(k.url).catch(()=>_(k.url)),S;for(b.lastIndex=0;(S=b.exec(P))!==null;)if(S[1].replace(/<[^>]+>/g,"").trim()!=="")return!0;return!1}catch{return f++,!0}});if(h!==U)throw new Error("superseded");if(f*20>y.length)throw new Error("captions unread");return D.captionBreaks(y,c[0].time,c[0].duration)}async function I(c,h,b,f){if(c.length===0||c.length>ai||b!==1||!(h>0))return null;let y=h,k=D.track(c.length*y,it,ct),P=async $=>(await m($,1,async H=>{if(f!==U)return!1;let Y=await o(c[H].url,h*it,ct);if(Y===null&&f===U&&(Y=await o(c[H].url,h*it,ct)),Y===null)return!1;for(let X=0;X<y;X++)k.add(H*y+X,l(Y,h*it,X*it));return!0})).every(H=>H),S=c.map(($,B)=>B);if(!await P(S.filter($=>$%2===0)))throw new Error("thumbnails unread");let w=k.gone();if(w===null)return null;let N=$=>{if($<0||$>=c.length)return!1;for(let B=$*y;B<($+1)*y;B++)if(w[B])return!0;return!1};if(!await P(S.filter($=>$%2===1&&(N($-1)||N($+1)))))throw new Error("thumbnails unread");return k.breaks(c[0].time,c[0].duration/y)}async function C(c,h,b){if(Nt.has(h)){Rt=Nt.get(h),ht="known";return}ht="searching";try{let f=new DOMParser().parseFromString(await _(c),"application/xml").documentElement,y=f?g(f,"Period"):[],k=f?p(f.getAttribute("mediaPresentationDuration")):NaN;if(f&&(f.getAttribute("type")==="dynamic"||!(k>0)))throw new Error("not whole yet");if(!f||y.length!==1){b===U&&(ht="not a recording");return}let P=E(y[0],E(f,c)),S=null,w=null;for(let $ of g(y[0],"AdaptationSet")){let B=g($,"Representation")[0],H=$.getAttribute("mimeType")||B&&B.getAttribute("mimeType")||"",Y=$.getAttribute("contentType")||H.split("/")[0];if(Y==="text"&&S===null)S=await L(T($,P,k),b);else if(Y==="image"&&w===null){let X=g($,"EssentialProperty").concat(B?g(B,"EssentialProperty"):[]).filter(at=>/thumbnail_tile$/.test(at.getAttribute("schemeIdUri")||""))[0],nt=/^(\d+)x(\d+)$/.exec(X&&X.getAttribute("value")||"");nt&&(w=await I(T($,P,k),Number(nt[1]),Number(nt[2]),b))}if(b!==U)return}let N=D.combine(S,w).filter($=>$[0]>0&&$[1]<k);if(Nt.set(h,N),Nt.size>20&&Nt.delete(Nt.keys().next().value),b!==U)return;Rt=N,ht="found "+N.length+" (captions "+(S===null?"none":S.length)+", logo "+(w===null?"none":w.length)+")"}catch(f){b===U&&(ht="error: "+String(f&&f.message).slice(0,40),setTimeout(()=>{b===U&&/^error/.test(ht)&&($t={url:c,name:h,mine:b})},Mt*2**Math.min(ke++,12)))}}async function O(c){try{let h=new DOMParser().parseFromString(await _(wt),"application/xml").documentElement;if(!h||c!==U)return;let b=Date.parse(h.getAttribute("availabilityStartTime")||"")/1e3;if(!isFinite(b)){zt="no start time";return}let f=g(h,"Period"),y=f.map(S=>p(S.getAttribute("start"))),k=null,P=f.map((S,w)=>{let N=isFinite(y[w])?b+y[w]:k!==null?k:b,$=p(S.getAttribute("duration")),B=isFinite($)?N+$:w+1<y.length&&isFinite(y[w+1])?b+y[w+1]:null,H=g(S,"EventStream").filter(X=>(X.getAttribute("schemeIdUri")||"").indexOf("urn:scte:scte35")===0),Y=[];for(let X of H){let nt=Number(X.getAttribute("timescale")||1),at=Number(X.getAttribute("presentationTimeOffset")||0);for(let tt of g(X,"Event")){let Ct=D.opens(new XMLSerializer().serializeToString(tt));if(Ct===null)continue;let vt=Number(tt.getAttribute("duration")||0)/nt;Y.push({at:N+(Number(tt.getAttribute("presentationTime")||0)-at)/nt,duration:vt>0?vt:null,opens:Ct})}}return k=B,{start:N,end:B,marks:Y,signalled:H.length>0}});Zt=D.markedBreaks(P),zt="periods "+f.length+", breaks "+Zt.length,Lt&&(Vt=F(h,b))}catch(h){c===U&&(zt="error: "+String(h&&h.message).slice(0,40))}}function F(c,h){let b=[],f=Date.now()/1e3,y=E(c,wt);for(let k of g(c,"Period")){let P=h+(p(k.getAttribute("start"))||0),S=new Map;for(let w of g(k,"AdaptationSet"))if(!(w.getAttribute("contentType")!=="video"&&!/^video\//.test(w.getAttribute("mimeType")||"")))for(let N of g(w,"Representation")){let $=Number(N.getAttribute("bandwidth")),B=Number(N.getAttribute("height")||w.getAttribute("height"));if(!($>0)||!D.BLACKS[B])continue;let H=S.get(B);(!H||$<Number(H.rep.getAttribute("bandwidth")))&&S.set(B,{set:w,rep:N})}S.forEach((w,N)=>{let $=g(w.set,"SegmentTemplate")[0]||g(w.rep,"SegmentTemplate")[0];if(!$||!g($,"SegmentTimeline")[0])return;let B=E(w.rep,E(w.set,E(k,y)));for(let H of T(w.set,B,f-P,w.rep)){let Y=P+H.time;b.push({time:Y,duration:H.duration,url:H.url,height:N,key:N+" "+Y})}})}return b}async function Pt(c,h){let b=new AbortController,f=setTimeout(()=>b.abort(),ce);try{let y=await fetch(c,{credentials:"omit",headers:{Range:"bytes=0-"+(h-1)},signal:b.signal});if(!y.ok)return null;let k=new Uint8Array(await y.arrayBuffer());return k.length>h?k.subarray(0,h):k}catch{return null}finally{clearTimeout(f)}}async function Ee(c){let h=await Pt(c.url,si);if(h===null)return null;let b=D.moofEnd(h);if(b===null||(b>h.length&&(h=await Pt(c.url,b)),h===null))return null;let f=D.frameSizes(h);return f===null||f.length===0?null:D.separatorEnds(f,c.time,c.duration/f.length,D.BLACKS[c.height])}async function _e(c,h,b){let f=c-Se,y=Math.min(h-ni,c+Se),k=Vt.filter(w=>w.time+w.duration>f&&w.time<y&&(!bt.has(w.key)||Et.has(w.key)&&Et.get(w.key)<lt)),P=await m(k,6,Ee);if(b!==U)return;k.forEach((w,N)=>{P[N]===null?Et.set(w.key,(Et.get(w.key)||0)+1):Et.delete(w.key),bt.set(w.key,{time:w.time,ends:P[N]||[]})});for(let w of Array.from(bt.keys()))bt.get(w).time>=c-2*Se||(bt.delete(w),Et.delete(w));let S=[];for(let w of bt.values())for(let N of w.ends)S.push(N);Gt=D.separatedBreaks(S),se="segments "+bt.size+", breaks "+Gt.length}async function ne(c,h,b){let f=[];for(let S=c;S<=h;S+=4)(!ut.has(S)||yt.has(S)&&yt.get(S)<lt)&&f.push(S);if(f.length===0)return;let y=Z,k=dt,P=await m(f,4,async S=>{if(b!==U)return null;let w=await o(k+"/"+S,it,ct);if(w===null)return null;let N=l(w,it,0);return[D.score(y,N),y.lower?D.score(y.lower,N):null]});b!==U||y!==Z||f.forEach((S,w)=>{P[w]===null?yt.set(S,(yt.get(S)||0)+1):yt.delete(S),ut.set(S,P[w]===null?y.usual:P[w][0]),y.lower&&St.set(S,P[w]===null?y.lower.usual:P[w][1])})}async function Pe(c,h){let b=dt;return(await m(c,4,async f=>{if(h!==U)return null;let y=await o(b+"/"+f,it,ct);return y===null?null:l(y,it,0)})).filter(f=>f!==null)}function Te(c){if(c.length===0)return null;let h=D.track(c.length,it,ct);return c.forEach((b,f)=>h.add(f,b)),h.logo()}async function A(c,h,b){let f=[];for(let S=c-1200;S<=Math.min(h,c+1200);S+=28)f.push(S);let y=await Pe(f,b);if(b!==U)return;if(y.length===0){V(c);return}let k=Te(y);k!==null&&k.channel&&he.set(dt,D.alone(k));let P=null;if(k===null){let S=he.get(dt);if(S&&D.seenIn(S,y,.4))P=S;else if(ue!==dt){let w=await z(c,b);if(b!==U)return;w!==null&&(he.set(dt,w),D.seenIn(w,y,.4)&&(P=w))}}jt=c,Z=P||k,ut=new Map,St=new Map,yt=new Map,te=Z===null?"none in "+y.length+" pictures":"strength "+Math.round(Z.strength)+(Z.lower?", lower one "+Math.round(Z.lower.strength):"")+(P!==null?", kept":""),Z===null?V(c):qt=0}function V(c){jt=c-900+Math.min(900,120*2**qt),120*2**qt<900&&qt++}async function z(c,h){let b=null;for(let f=0;f<3;f++){let y=c-1200-f*2*1200,k=[];for(let w=y-2*1200;w<y;w+=28)k.push(w);let P=await Pe(k,h);if(h!==U)return null;if(P.length===0){if(f===0)return null;break}let S=Te(P);if(S!==null&&S.channel){b=D.alone(S);break}}return ue=dt,b}function Q(c){let h=c;for(;ut.has(h-4);)h-=4;let b=[],f=[];for(let k=h;ut.has(k);k+=4)b.push(ut.get(k)),Z.lower&&f.push(St.has(k)?St.get(k):Z.lower.usual);let y=b.map(()=>!0);return{first:h,gone:D.gone(b,Z.usual,y),lowerGone:Z.lower?D.gone(f,Z.lower.usual,y):null}}async function G(c,h,b){let f=Math.floor(c/4)*4,y=Math.floor((h-12)/4)*4;if(f>y)return;let k=Math.abs(f-jt),P=Ot.some(w=>w[0]<=f&&f<=w[1])&&k<=900+D.LOGO_MAX_S;if(k>900&&!P&&await A(f,y,b),Z===null||b!==U)return;await ne(f-64,Math.min(y,f+88),b);for(let w=0;w<4;w++){if(b!==U||!ut.has(f))return;let N=Q(f),$=N.gone.length,B=N.first+$*4,H=D.runs(D.solid(N.gone),D.BRIDGE).concat(N.lowerGone?D.runs(D.solid(N.lowerGone),D.BRIDGE):[]),Y=H.some(at=>at[1]+D.AROUND>=$&&($-at[0])*4<=_t),X=(f-N.first)/4,nt=H.some(at=>at[0]<D.AROUND&&at[1]>=X&&(at[1]+1)*4<=_t);if(Y&&B<=y)await ne(B,Math.min(y,B+120),b);else if(nt&&N.first>f-_t)await ne(N.first-120,N.first-4,b);else break}if(b!==U||Z===null||!ut.has(f))return;let S=Q(f);Ot=D.logoBreaks(S.gone,S.first,4,S.lowerGone);for(let w of Array.from(ut.keys()))w<f-ft&&ut.delete(w);for(let w of Array.from(St.keys()))w<f-ft&&St.delete(w);for(let w of Array.from(yt.keys()))w<f-ft&&yt.delete(w)}function J(){let c=a.liveRange(),h=a.currentTime();if(!c||typeof h!="number"||!isFinite(h)||!isFinite(c.end))return null;let b=a.absoluteTime(h),f=a.absoluteTime(c.end),y=Date.now()/1e3;return typeof b!="number"||typeof f!="number"||!(b>y-86400&&b<y+600)||!(f>=b)?null:{at:b,end:f}}async function W(c){if(ee!==c){ee=c;try{let h=J();if(h===null||h.end-h.at<=60)return;Date.now()-de>=ri&&wt&&(de=Date.now(),await O(c)),Lt&&c===U&&await _e(h.at,h.end,c),dt!==null&&c===U&&await G(h.at,h.end,c)}catch(h){te="error: "+String(h&&h.message).slice(0,40)}finally{ee===c&&(ee=0)}}}function q(){let c=null;try{let h=a.state();if(Ft!==null&&(h==="playing"||h==="paused")){let b=a.currentTime();if($t!==null&&h==="playing"){let y=$t;$t=null,y.mine===U&&C(y.url,y.name,y.mine)}let f=y=>[y[0],y[1]-32];if(Bt){if(!a.joining()){let y=J();if(y!==null){let k=S=>y.at>=S[0]&&y.at<S[1]-1&&S[1]<=y.end-2,P=Zt.filter(k)[0]||Gt.filter(k)[0]||Ot.map(f).map(S=>D.reachSeparated(S,Gt)).filter(k)[0];if(P){let S=a.mediaTime(P[1]);typeof S=="number"&&isFinite(S)&&S>b&&(c=S)}}Date.now()-pe>=oi&&(pe=Date.now(),W(U))}}else{let y=Rt.map(f).filter(k=>b>=k[0]&&b<k[1]-1)[0];y&&(c=y[1])}}}catch{c=null}gt=c,ie=a.show(gt!==null)}function K(){if(gt===null||!ie)return!1;let c=gt;return gt=null,ie=a.show(!1),a.seek(c),!0}function Tt(){let c={live:Bt,offered:gt!==null,skip_to:gt};if(Bt){c.marked=zt,c.logo=dt===null?"no pictures":te,c.found=Ot.length,Lt&&(c.separators=se);try{let h=J();c.clock=h===null?"none":Math.round(Date.now()/1e3-h.end)+" s behind at the live point"}catch{c.clock="error"}}else c.recording=ht,c.breaks=Rt.map(h=>[Math.round(h[0]),Math.round(h[1])]);return c}return{load:d,tick:q,skip:K,report:Tt}}var Ei="0.1.22";function Di(){let a=navigator.userAgent||"",t=/Android|iPhone|iPad|iPod|Mobile/i.test(a),e=/wv|WebView/i.test(a)||window.navigator.standalone===!0;return t||e}var Fi={fr:"Francais",fra:"Francais",fre:"Francais",en:"English",eng:"English",de:"Deutsch",deu:"Deutsch",ger:"Deutsch",es:"Espanol",spa:"Espanol",it:"Italiano",ita:"Italiano",pt:"Portugues",por:"Portugues",qaa:"Original",und:"Indefini",mul:"Multiple"};function ki(a){if(!a)return"Inconnu";let t=a.toLowerCase();return Fi[t]||a.toUpperCase()}function De(a){let t=a.split(":");if(t.length<2)return null;let e=t.slice(1).join(":");try{let i=e,s=e.length%4;s&&(i+="=".repeat(4-s));let n=atob(i.replace(/-/g,"+").replace(/_/g,"/"));return JSON.parse(n)}catch{return null}}var ii=class extends Jt{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},panel:{type:Object},_channels:{type:Array},_loading:{type:Boolean},_error:{type:String},_playing:{type:Boolean},_selectedChannel:{type:Object},_streamData:{type:Object},_isFullscreen:{type:Boolean},_playerError:{type:String},_playerLoading:{type:Boolean},_currentTime:{type:Number},_duration:{type:Number},_volume:{type:Number},_muted:{type:Boolean},_paused:{type:Boolean},_audioTracks:{type:Array},_textTracks:{type:Array},_selectedAudioIndex:{type:Number},_selectedTextIndex:{type:Number},_isLive:{type:Boolean},_programStart:{type:Number},_programEnd:{type:Number},_showAudioMenu:{type:Boolean},_showTextMenu:{type:Boolean},_expandedChannels:{type:Object},_channelPrograms:{type:Object},_loadingPrograms:{type:Object},_searchQuery:{type:String},_searchResults:{type:Array},_searching:{type:Boolean},_showingSearch:{type:Boolean},_expandedResults:{type:Object},_resultEpisodes:{type:Object},_loadingEpisodes:{type:Object},_castTargets:{type:Array},_selectedTarget:{type:String},_activeTab:{type:String},_recordings:{type:Array},_loadingRecordings:{type:Boolean},_expandedRecordings:{type:Object},_recordingEpisodes:{type:Object},_loadingRecordingEpisodes:{type:Object},_castPlaying:{type:Boolean},_castTarget:{type:String},_castTitle:{type:String},_activeCasts:{type:Object},_focusedCastHost:{type:String},_localPlaybackInitiated:{type:Boolean},_localMinimized:{type:Boolean},_castMinimized:{type:Boolean},_castLoading:{type:Boolean},_tonightChannels:{type:Array},_loadingTonight:{type:Boolean},_episodePlaylist:{type:Array},_episodeIndex:{type:Number},_selectedEntityId:{type:String}}}static get styles(){return xi`
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
    `}constructor(){super(),this._boundOnFullscreenChange=this._onFullscreenChange.bind(this),this._boundOnDocumentClick=this._onDocumentClick.bind(this),this._channels=[],this._loading=!0,this._error=null,this._playing=!1,this._selectedChannel=null,this._streamData=null,this._isFullscreen=!1,this._playerError=null,this._playerLoading=!1,this._player=null,this._entityUnsubscribe=null,this._showPlayOverlay=!1,this._adSkip=null,this._adOffer=!1,this._castSkipTo=null,this._currentTime=0,this._duration=0,this._volume=.5,this._muted=!1,this._paused=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._liveDelay=0,this._showAudioMenu=!1,this._showTextMenu=!1,this._updateInterval=null,this._expandedChannels={},this._channelPrograms={},this._loadingPrograms={},this._searchQuery="",this._searchResults=[],this._searching=!1,this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._searchToken=0,this._castTargets=[],this._isMobile=Di(),this._selectedTarget=this._isMobile?"":"local",this._activeTab="live",this._recordings=[],this._loadingRecordings=!1,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castProgressInterval=null,this._castBasePosition=0,this._castPositionUpdatedAt=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._castMinimized=!1,this._castLoading=!1,this._tonightChannels=[],this._loadingTonight=!1,this._episodePlaylist=[],this._episodeIndex=-1,this._episodeParentTitle="",this._episodeIsRecording=!1,this._sessionId=this._generateSessionId(),this._selectedEntityId=localStorage.getItem("molotov_selected_entity")||""}_generateSessionId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"molotov-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10)}connectedCallback(){super.connectedCallback(),console.log(`[Molotov Panel] Connected - v${Ei}`),this._hasLoadedChannels=!1,document.addEventListener("fullscreenchange",this._boundOnFullscreenChange),document.addEventListener("click",this._boundOnDocumentClick)}disconnectedCallback(){if(super.disconnectedCallback(),this._playing){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"})}this._cleanupPlayer(),this._stopCastProgressUpdate(),document.removeEventListener("fullscreenchange",this._boundOnFullscreenChange),document.removeEventListener("click",this._boundOnDocumentClick),this._entityUnsubscribe&&(this._entityUnsubscribe(),this._entityUnsubscribe=null)}_onDocumentClick(t){t.composedPath().some(e=>e.classList?.contains("track-menu-container"))||(this._showAudioMenu=!1,this._showTextMenu=!1,this.requestUpdate())}updated(t){t.has("hass")&&this.hass&&(this._hasLoadedChannels||(this._hasLoadedChannels=!0,this._loadChannels()),this._syncWithEntity())}async _loadChannels(){this._loading=!0,this._error=null;try{let t=this._getEntityId();if(!t)throw new Error("Entite Molotov TV introuvable");console.log(`[Molotov Panel] Loading channels for ${t}`);let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"now_playing",media_content_type:"directory"});e&&e.children?(this._channels=e.children.map(i=>this._parseChannel(i)),console.log(`[Molotov Panel] Loaded ${this._channels.length} channels`),this._channels.length>0&&await this._fetchCastTargets(t,this._channels[0].mediaContentId)):this._channels=[],this._loading=!1}catch(t){console.error("[Molotov Panel] Failed to load channels:",t),this._error=t.message||"Erreur lors du chargement des chaines",this._loading=!1}}async _fetchCastTargets(t,e){try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:e,media_content_type:"program"});if(i&&i.children){let s=i.children.filter(n=>n.media_content_id.startsWith("cast:")).map(n=>({mediaContentId:n.media_content_id,title:n.title}));this._castTargets=s,this._isMobile&&s.length>0&&(!this._selectedTarget||this._selectedTarget==="local")&&(this._selectedTarget=s[0].mediaContentId),console.log(`[Molotov Panel] Found ${s.length} cast targets`)}}catch(i){console.error("[Molotov Panel] Failed to fetch cast targets:",i),this._castTargets=[]}}_handleTargetChange(t){let e=t.target.value;this._isMobile&&e==="local"||(this._selectedTarget=e,console.log(`[Molotov Panel] Selected target: ${this._selectedTarget}`))}_switchTab(t){this._activeTab=t,t==="recordings"&&this._recordings.length===0&&this._loadRecordings(),t==="tonight"&&this._tonightChannels.length===0&&this._loadTonight(),this.requestUpdate()}async _loadRecordings(){let t=this._getEntityId();if(!t)return;this._loadingRecordings=!0,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this.requestUpdate();try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"recordings",media_content_type:"directory"});i&&i.children?(this._recordings=i.children.map(s=>{let n=De(s.media_content_id);return{mediaContentId:s.media_content_id,title:s.title,thumbnail:s.thumbnail,description:n?.desc||null,isFolder:!!n?.folder}}),console.log(`[Molotov Panel] Loaded ${this._recordings.length} recordings`)):this._recordings=[]}catch(i){console.error("[Molotov Panel] Failed to load recordings:",i),this._recordings=[]}this._loadingRecordings=!1,this.requestUpdate();let e=this._recordings.filter(i=>i.isFolder);e.length>0&&(await Promise.all(e.map(i=>this._fetchRecordingEpisodes(i))),this.requestUpdate())}async _loadTonight(){let t=this._getEntityId();if(t){this._loadingTonight=!0,this.requestUpdate();try{let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"tonight_epg",media_content_type:"directory"});if(e&&e.children&&e.children.length>0){let i=new Map;for(let n of e.children){if(!n.media_content_id.startsWith("tonight_program:"))continue;let r=n.media_content_id.split(":");if(r.length<6)continue;let u=r[1],x=decodeURIComponent(r[2]),M=decodeURIComponent(r[3]),j=parseInt(r[4])*1e3,R=parseInt(r[5])*1e3,st=r.length>6?decodeURIComponent(r.slice(6).join(":")):"",et=n.title;et.startsWith("\u{1F534} ")&&(et=et.substring(3));let rt=et.match(/^\d{2}:\d{2}-\d{2}:\d{2}\s+(.+)$/);rt&&(et=rt[1]);let ot={mediaContentId:n.media_content_id,title:et,thumbnail:n.thumbnail,start:j,end:R,description:st};i.has(u)||i.set(u,{id:u,name:x,thumbnail:M,programs:[]}),i.get(u).programs.push(ot)}let s=Array.from(i.values());for(let n of s)n.programs.sort((r,u)=>r.start-u.start);this._tonightChannels=s,console.log(`[Molotov Panel] Loaded tonight EPG for ${s.length} channels`)}else this._tonightChannels=[]}catch(e){console.error("[Molotov Panel] Failed to load tonight EPG:",e),this._tonightChannels=[]}this._loadingTonight=!1,this.requestUpdate()}}async _toggleRecordingExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedRecordings[i]){this._expandedRecordings={...this._expandedRecordings,[i]:!1},this.requestUpdate();return}if(!e.isFolder){await this._playRecordingDirectly(e);return}this._recordingEpisodes[i]||await this._fetchRecordingEpisodes(e);let s=this._recordingEpisodes[i]||[];if(s.length===0){console.log("[Molotov Panel] No episodes found, playing recording directly"),await this._playRecordingDirectly(e);return}if(s.length===1){console.log("[Molotov Panel] Only 1 episode found, playing it directly"),await this._playRecordingEpisode(s[0],e.title);return}this._expandedRecordings={...this._expandedRecordings,[i]:!0},this.requestUpdate()}async _playRecordingDirectly(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:"",currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=t.mediaContentId;i.startsWith("recording:")&&(i=i.substring(10));let s=this._buildPlayMediaId(`replay:${i}`);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:s,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play recording failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}async _fetchRecordingEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"recording"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._recordingEpisodes={...this._recordingEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for recording "${t.title}"`)}else this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch recording episodes:",s),this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!1},this.requestUpdate()}async _playRecordingEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._recordingEpisodes,!0),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play recording episode failed:",s),this._playerError=s.message||"Erreur de lecture",this._castLoading=!1}}}_buildPlayMediaId(t){if(this._selectedTarget==="local")return`play_local:${this._sessionId}:${t}`;let e=this._selectedTarget.split(":");if(e.length>=2){let i=e[1],s=e.length>=3&&e[2]!=="native"&&e[2]!=="custom"?"":e[2];return s?`cast:${i}:${s}:${t}`:`cast:${i}:${t}`}return`play_local:${t}`}_isLocalPlayback(){return this._selectedTarget==="local"}_parseEpisodeChildren(t){return t.filter(e=>e.media_content_id.startsWith("episode:")||e.media_content_id.startsWith("replay:")||e.media_content_id.startsWith("recording:")||e.can_play).map(e=>{let i=De(e.media_content_id);return{mediaContentId:e.media_content_id,title:e.title,thumbnail:e.thumbnail,description:i?.desc||null}})}_initPlaybackFlags(){this._isLocalPlayback()?(this._localPlaybackInitiated=!0,this._localMinimized=!1):this._castLoading=!0}_parseChannel(t){let e=t.media_content_id,[i,s]=e.split("|"),n=null;if(s)try{let et=s,rt=s.length%4;rt&&(et+="=".repeat(4-rt)),n=decodeURIComponent(escape(atob(et.replace(/-/g,"+").replace(/_/g,"/"))))}catch{}let r=i.split(":"),u,x,M;r[0]==="program"?(u=r[1],x=r[2]?parseInt(r[2])*1e3:null,M=r[3]?parseInt(r[3])*1e3:null):r[0]==="live"&&(u=r[1]);let j=t.title.split(" - "),R=j[0],st=j.slice(1).join(" - ")||"Direct";return{id:u,name:R,thumbnail:t.thumbnail,mediaContentId:i,currentProgram:{title:st,description:n,start:x,end:M},nextProgram:null}}_getMolotovEntities(){return!this.hass||!this.hass.states?[]:Object.keys(this.hass.states).filter(t=>t.startsWith("media_player.molotov")).sort()}_getEntityId(){let t=this._getMolotovEntities();return t.length===0?null:t.length===1?t[0]:this._selectedEntityId&&t.includes(this._selectedEntityId)?this._selectedEntityId:t[0]}_handleEntityChange(t){let e=this._getEntityId();this._playing&&e&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState(),this._selectedEntityId=t.target.value,localStorage.setItem("molotov_selected_entity",this._selectedEntityId),this._hasLoadedChannels=!1,this._channels=[],this._recordings=[],this._tonightChannels=[],this._channelPrograms={},this._expandedChannels={},this._loadingPrograms={},this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._loadChannels()}async _toggleChannelExpand(t,e){t.stopPropagation();let i=e.id;if(this._expandedChannels[i]){this._expandedChannels={...this._expandedChannels,[i]:!1},this.requestUpdate();return}this._expandedChannels={...this._expandedChannels,[i]:!0},this._channelPrograms[i]||await this._fetchChannelPrograms(e),this.requestUpdate()}async _fetchChannelPrograms(t){let e=this._getEntityId();if(!e)return;let i=t.id;this._loadingPrograms={...this._loadingPrograms,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`channel:${i}`,media_content_type:"channel"});if(s&&s.children){let n=s.children.filter(r=>r.media_content_id.startsWith("replay:")).map(r=>this._parseReplayItem(r,t));this._channelPrograms={...this._channelPrograms,[i]:n}}}catch(s){console.error("[Molotov Panel] Failed to fetch channel replays:",s),this._channelPrograms={...this._channelPrograms,[i]:[]}}this._loadingPrograms={...this._loadingPrograms,[i]:!1},this.requestUpdate()}_parseReplayItem(t,e){let i=De(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,channelName:e.name,description:i?.desc||null}}async _playReplay(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:t.channelName,currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play replay failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}_handleSearchInput(t){this._searchQuery=t.target.value}_handleSearchKeydown(t){t.key==="Enter"&&this._performSearch()}async _performSearch(){let t=this._searchQuery.trim();if(!t)return;let e=this._getEntityId();if(!e)return;let i=++this._searchToken;this._searching=!0,this._showingSearch=!0,this._searchResults=[],this._expandedResults={},this._resultEpisodes={},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`search:${encodeURIComponent(t)}`,media_content_type:"search"});if(i!==this._searchToken)return;if(s&&s.children){let n=s.children.filter(u=>u.media_content_id.startsWith("search_result:")).map(u=>this._parseSearchResult(u)),r=await this._filterResultsWithEpisodes(n,e,i);if(i!==this._searchToken)return;this._searchResults=r,console.log(`[Molotov Panel] Found ${this._searchResults.length} results with episodes for "${t}"`)}else this._searchResults=[]}catch(s){if(i!==this._searchToken)return;console.error("[Molotov Panel] Search failed:",s),this._searchResults=[]}i===this._searchToken&&(this._searching=!1,this.requestUpdate())}async _filterResultsWithEpisodes(t,e,i){let s=t.map(async r=>{try{let u=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:r.mediaContentId,media_content_type:"search_result"});if(u&&u.children){let x=this._parseEpisodeChildren(u.children);if(x.length>0)return(i===void 0||i===this._searchToken)&&(this._resultEpisodes={...this._resultEpisodes,[r.mediaContentId]:x}),r}return null}catch(u){return console.error(`[Molotov Panel] Failed to check episodes for "${r.title}":`,u),null}});return(await Promise.all(s)).filter(r=>r!==null)}_parseSearchResult(t){let e=De(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,mediaClass:t.media_class,description:e?.desc||null}}_clearSearch(){this._searchToken++,this._searchQuery="",this._searchResults=[],this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this.requestUpdate()}async _toggleResultExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedResults[i]){this._expandedResults={...this._expandedResults,[i]:!1},this.requestUpdate();return}this._expandedResults={...this._expandedResults,[i]:!0},this._resultEpisodes[i]||await this._fetchResultEpisodes(e),this.requestUpdate()}async _fetchResultEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingEpisodes={...this._loadingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"search_result"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._resultEpisodes={...this._resultEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for "${t.title}"`)}else this._resultEpisodes={...this._resultEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch episodes:",s),this._resultEpisodes={...this._resultEpisodes,[i]:[]}}this._loadingEpisodes={...this._loadingEpisodes,[i]:!1},this.requestUpdate()}_setEpisodePlaylist(t,e,i,s){for(let n of Object.values(i)){let r=n.findIndex(u=>u.mediaContentId===t.mediaContentId);if(r!==-1){this._episodePlaylist=n,this._episodeIndex=r,this._episodeParentTitle=e,this._episodeIsRecording=s;return}}this._episodePlaylist=[],this._episodeIndex=-1}async _playEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._resultEpisodes,!1),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play episode failed:",s),this._playerError=s.message||"Erreur de lecture"}}}_syncWithEntity(){let t=this._getEntityId();if(!t||!this.hass?.states?.[t])return;let e=this.hass.states[t],s=(e.attributes.local_streams||{})[this._sessionId];if(s&&s.url&&this._localPlaybackInitiated){let n=s.url,r=s.drm,u=s.selected_track;if(!this._playing||this._currentStreamUrl!==n){this._currentStreamUrl=n,this._streamData={url:n,drm:r,selectedTrack:u,title:e.attributes.media_title||"En direct",breakSearch:{live_thumbnails_url:s.live_thumbnails_url,recording:s.recording,separated_breaks:s.separated_breaks}},this._playing=!0,this._localMinimized=!1,this._playerError=null,this._playerLoading=!0;let x=this._selectedChannel;x?.currentProgram?.start&&x?.currentProgram?.end?(this._isLive=!0,this._programStart=x.currentProgram.start,this._programEnd=x.currentProgram.end):(this._isLive=!0,this._programStart=null,this._programEnd=null),this.updateComplete.then(()=>this._initDashPlayer())}}else this._playing&&(this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1);if(e.attributes.active_casts&&Object.keys(e.attributes.active_casts).length>0){let n=e.attributes.active_casts,r=e.attributes.cast_target;this._activeCasts=n,this._focusedCastHost=r||null;let u=r?n[r]?.skip_to:null;this._castSkipTo=typeof u=="number"?u:null,(!this._castPlaying||this._castTarget!==r)&&(this._castPlaying=!0,this._castMinimized=this._isMobile,this._castLoading=!1,this._castTarget=r,this._castTitle=e.attributes.media_title||"En cours de lecture",this._startCastProgressUpdate(),console.log("[Molotov Panel] Cast playback detected:",r,"total casts:",Object.keys(n).length)),this._castPositionUpdatedAt=e.attributes.media_position_updated_at?new Date(e.attributes.media_position_updated_at).getTime()/1e3:null,this._castBasePosition=e.attributes.media_position||0,this._duration=e.attributes.media_duration||0,this._volume=e.attributes.volume_level??.5,this._muted=e.attributes.is_volume_muted||!1,this._paused=e.state==="paused",this._castTitle=e.attributes.media_title||this._castTitle,this._isLive=e.attributes.is_live||!1}else this._castPlaying&&(this._onPlaybackEnded()||(this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._castMinimized=!1,this._castLoading=!1,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate()))}async _playChannel(t){let e=this._getEntityId();if(!e){console.error("[Molotov Panel] No entity found");return}this._selectedChannel=t,this._playerError=null,this._episodePlaylist=[],this._episodeIndex=-1,this._initPlaybackFlags(),this._isLocalPlayback()&&t.currentProgram?.start&&t.currentProgram?.end&&(this._programStart=t.currentProgram.start,this._programEnd=t.currentProgram.end,this._isLive=!0);try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}async _initDashPlayer(){if(!this._streamData)return;let t=this.shadowRoot.querySelector("video");if(!t){console.error("[Molotov Panel] Video element not found");return}window.dashjs||await this._loadDashJs(),this._player&&(this._player.reset(),this._player=null),this._adSkip=null,this._adOffer=!1,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null);try{let e=window.dashjs.MediaPlayer().create();this._player=e,e.updateSettings({debug:{logLevel:window.dashjs.Debug.LOG_LEVEL_WARNING},streaming:{buffer:{stableBufferTime:6,bufferTimeAtTopQuality:30,bufferTimeAtTopQualityLongForm:60},delay:{liveDelay:3}}});let i=this._streamData.drm;i&&i.type==="widevine"&&(console.log("[Molotov Panel] Configuring Widevine DRM"),e.setProtectionData({"com.widevine.alpha":{serverURL:i.license_url,httpRequestHeaders:i.headers||{}}})),e.initialize(t,this._streamData.url,!0),this._adSkip=Si(this._adSkipEnv(t,e));let s=this._streamData.selectedTrack,n="fr";s?.track_audio&&(n=s.track_audio),e.setInitialMediaSettingsFor("audio",{lang:n}),s?.track_text&&e.setInitialMediaSettingsFor("text",{lang:s.track_text}),e.on(window.dashjs.MediaPlayer.events.ERROR,r=>{let u=r.error?.message||r.error||"Erreur de lecture";console.error("[Molotov Panel] Player error:",u),this._playerError=u,this._playerLoading=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.STREAM_INITIALIZED,()=>{console.log("[Molotov Panel] Stream initialized"),this._player===e&&this._adSkip&&this._adSkip.load({contentId:this._streamData.url},this._streamData.breakSearch),this._enforceAudioLanguage(e,s),this._updateTracks(),this._startProgressUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_STARTED,()=>{console.log("[Molotov Panel] Playback started"),this._showPlayOverlay=!1,this._playerLoading=!1,this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PAUSED,()=>{this._paused=!0,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PLAYING,()=>{this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_ENDED,()=>{console.log("[Molotov Panel] Playback ended"),this._onPlaybackEnded()}),t.volume=this._volume,t.muted=this._muted,this._autoplayCheckTimeout=setTimeout(()=>{this._autoplayCheckTimeout=null,t.paused&&!t.currentTime&&(console.log("[Molotov Panel] Autoplay blocked"),this._showPlayOverlay=!0,this.requestUpdate())},1500)}catch(e){console.error("[Molotov Panel] Failed to init player:",e),this._playerError=e.message}}_adSkipEnv(t,e){let i=()=>{try{let s=e.timeAsUTC();return typeof s=="number"&&isFinite(s)?s:null}catch{return null}};return{isLive:()=>{try{return e.isDynamic()}catch{return!1}},joining:()=>this._playerLoading,state:()=>t.paused?"paused":t.readyState>=2?"playing":"other",currentTime:()=>t.currentTime,liveRange:()=>t.seekable&&t.seekable.length?{start:t.seekable.start(0),end:t.seekable.end(t.seekable.length-1)}:null,absoluteTime:s=>{let n=i();return n===null?null:n+(s-t.currentTime)},mediaTime:s=>{let n=i();return n===null?null:t.currentTime+(s-n)},show:s=>(this._adOffer!==s&&(this._adOffer=s,this.requestUpdate()),s),seek:s=>{t.currentTime=s}}}_startProgressUpdate(){this._updateInterval&&clearInterval(this._updateInterval),this._updateInterval=setInterval(()=>{this._updateProgress()},1e3)}_updateProgress(){let t=this.shadowRoot?.querySelector("video");if(!(!t||!this._player)){if(this._currentTime=t.currentTime,this._duration=t.duration||0,this._paused=t.paused,this._adSkip&&this._adSkip.tick(),this._isLive&&t.seekable&&t.seekable.length>0){let e=t.seekable.end(t.seekable.length-1);this._liveDelay=Math.max(0,(e-t.currentTime)*1e3)}this.requestUpdate()}}_startCastProgressUpdate(){this._stopCastProgressUpdate(),this._castProgressInterval=setInterval(()=>{this._updateCastProgress()},1e3)}_stopCastProgressUpdate(){this._castProgressInterval&&(clearInterval(this._castProgressInterval),this._castProgressInterval=null)}_updateCastProgress(){if(!this._castPlaying){this._stopCastProgressUpdate();return}if(this._castBasePosition!=null&&this._castPositionUpdatedAt&&!this._paused){let t=Date.now()/1e3,e=Math.max(0,t-this._castPositionUpdatedAt);this._currentTime=this._castBasePosition+e}else this._currentTime=this._castBasePosition||0;this.requestUpdate()}_updateTracks(){if(!this._player)return;let t=this._player.getTracksFor("audio")||[];this._audioTracks=t.map((n,r)=>({index:r,lang:n.lang,label:ki(n.lang)}));let e=this._player.getCurrentTrackFor("audio");e&&(this._selectedAudioIndex=t.findIndex(n=>n.index===e.index));let i=this._player.getTracksFor("text")||[];if(this._textTracks=i.map((n,r)=>({index:r,lang:n.lang,label:ki(n.lang)})),!this._player.isTextEnabled())this._selectedTextIndex=-1;else{let n=this._player.getCurrentTrackFor("text");n&&(this._selectedTextIndex=i.findIndex(r=>r.index===n.index))}console.log("[Molotov Panel] Audio tracks:",this._audioTracks),console.log("[Molotov Panel] Text tracks:",this._textTracks),this.requestUpdate()}_enforceAudioLanguage(t,e){let i=t.getTracksFor("audio");if(!i||i.length===0)return;let n=t.getCurrentTrackFor("audio")?.lang||"",r="fr";if(e?.track_audio&&(r=e.track_audio),n!==r&&n!=="fra"&&n!=="fre"){let u=i.find(x=>x.lang===r||x.lang==="fra"||x.lang==="fre");!u&&(n==="en"||n==="eng"||n==="qaa")&&(u=i.find(x=>x.lang!=="en"&&x.lang!=="eng"&&x.lang!=="qaa")),u&&(console.log("[Molotov Panel] Switching audio to:",u.lang),t.setCurrentTrack(u))}}_loadDashJs(){return new Promise((t,e)=>{if(window.dashjs){t();return}let i=document.createElement("script");i.src="https://cdn.dashjs.org/v4.7.4/dash.all.min.js",i.crossOrigin="anonymous",i.onload=()=>{console.log("[Molotov Panel] dash.js loaded"),t()},i.onerror=()=>{e(new Error("Failed to load dash.js"))},document.head.appendChild(i)})}_cleanupPlayer(){if(this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null),this._player){try{this._player.reset()}catch{}this._player=null}this._adSkip=null,this._adOffer=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._playerLoading=!1}_stopPlayback(){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState()}_resetLocalPlaybackState(){this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._selectedChannel=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._episodePlaylist=[],this._episodeIndex=-1}_onPlaybackEnded(){if(this._episodePlaylist.length===0||this._episodeIndex<0)return!1;let t=this._episodeIndex+1;if(t>=this._episodePlaylist.length)return this._episodePlaylist=[],this._episodeIndex=-1,!1;let e=this._episodePlaylist[t];return this._episodeIndex=t,console.log(`[Molotov Panel] Auto-playing next episode: ${e.title}`),this._episodeIsRecording?this._playRecordingEpisode(e,this._episodeParentTitle):this._playEpisode(e,this._episodeParentTitle),!0}_goBackFromPlayer(){this._localMinimized=!0,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null)}_goBackFromCast(){this._castMinimized=!0}_expandCurrentPlayback(){this._playing&&this._streamData?(this._localMinimized=!1,this._updateInterval||this._startProgressUpdate()):this._castPlaying&&(this._castMinimized=!1)}_togglePlayPause(){let t=this.shadowRoot.querySelector("video");t&&(t.paused?t.play():t.pause())}_localSeek(t){let e=this.shadowRoot.querySelector("video");if(!e)return;if(t===null){e.currentTime=0;return}let i=e.currentTime+t;e.currentTime=Math.max(0,Math.min(e.duration||1/0,i))}_localSeekBeginning(){this._localSeek(null)}_localSkipBack30(){this._localSeek(-30)}_localSkipBack10(){this._localSeek(-10)}_localSkipForward30(){this._localSeek(30)}_localSkipAd(){this._adSkip&&this._adSkip.skip()}_handleProgressClick(t){let i=t.currentTarget.getBoundingClientRect(),s=(t.clientX-i.left)/i.width;if(this._isLive&&this._programStart&&this._programEnd){if(this._player?.getDVRSeekOffset?.(0)!==void 0){let r=this._player.duration(),u=s*r;this._player.seek(u)}}else if(this._duration){let n=this.shadowRoot.querySelector("video");n&&(n.currentTime=s*this._duration)}}_handleVolumeChange(t){let e=parseFloat(t.target.value);this._volume=e;let i=this.shadowRoot.querySelector("video");i&&(i.volume=e,i.muted=e===0,this._muted=e===0)}_toggleMute(){let t=this.shadowRoot.querySelector("video");t&&(this._muted=!this._muted,t.muted=this._muted,this.requestUpdate())}_selectAudioTrack(t){if(!this._player||t<0||t>=this._audioTracks.length)return;let e=this._player.getTracksFor("audio");e&&e[t]&&(this._player.setCurrentTrack(e[t]),this._selectedAudioIndex=t),this._showAudioMenu=!1,this.requestUpdate()}_selectTextTrack(t){if(this._player){if(t===-1)this._player.enableText(!1),this._selectedTextIndex=-1;else if(t>=0&&t<this._textTracks.length){let e=this._player.getTracksFor("text");e&&e[t]&&(this._player.enableText(!0),this._player.setCurrentTrack(e[t]),this._selectedTextIndex=t)}this._showTextMenu=!1,this.requestUpdate()}}_toggleAudioMenu(t){t.stopPropagation(),this._showAudioMenu=!this._showAudioMenu,this._showTextMenu=!1,this.requestUpdate()}_toggleTextMenu(t){t.stopPropagation(),this._showTextMenu=!this._showTextMenu,this._showAudioMenu=!1,this.requestUpdate()}_toggleFullscreen(){let t=this.shadowRoot.querySelector(".video-wrapper");t&&(document.fullscreenElement?document.exitFullscreen():t.requestFullscreen().catch(e=>{console.error("[Molotov Panel] Fullscreen error:",e)}))}_onFullscreenChange(){this._isFullscreen=!!document.fullscreenElement,this.requestUpdate()}_handlePlayOverlayClick(){let t=this.shadowRoot.querySelector("video");t&&(t.muted=!1,t.play().catch(e=>console.error("[Molotov Panel] Manual play error:",e)),this._showPlayOverlay=!1,this.requestUpdate())}_formatTime(t){if(!t||!isFinite(t))return"00:00";let e=Math.floor(t/3600),i=Math.floor(t%3600/60),s=Math.floor(t%60);return e>0?`${e}:${i.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`:`${i}:${s.toString().padStart(2,"0")}`}_formatClockTime(t){return t?new Date(t).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):""}_getProgressPercent(){if(this._isLive&&this._programStart&&this._programEnd){let t=Date.now()-(this._liveDelay||0),e=this._programEnd-this._programStart;if(e<=0)return 100;let i=t-this._programStart;return Math.min(100,Math.max(0,i/e*100))}else if(this._duration>0&&isFinite(this._duration))return this._currentTime/this._duration*100;return 0}render(){let t=this._playing&&this._streamData,e=t&&!this._localMinimized,i=this._castPlaying&&!this._castMinimized,s=!e&&!i;return v`
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
    `}_renderTonightProgram(t,e){let i=this._formatClockTime(t.start),s=this._formatClockTime(t.end),n=Date.now(),r=t.start<=n&&t.end>n,u=t.end<=n;return v`
      <div
        class="tonight-program ${r?"live":""} ${u?"past":""}"
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
    `}_activateOnKey(t,e){(t.key==="Enter"||t.key===" "||t.key==="Spacebar")&&(t.preventDefault(),e())}_tonightToProgramId(t){let e=t.split(":");return e[0]!=="tonight_program"||e.length<6?t:`program:${e[1]}:${e[4]}:${e[5]}`}async _playTonightProgram(t,e){let i=this._getEntityId();if(!i)return;this._episodePlaylist=[],this._episodeIndex=-1;let s=this._tonightToProgramId(t.mediaContentId);this._selectedChannel={id:e.id,name:e.name,thumbnail:e.thumbnail,mediaContentId:s,currentProgram:{title:t.title,start:t.start,end:t.end}},this._playerError=null;let n=Date.now();this._isLive=t.start<=n&&t.end>n,this._isLive?(this._programStart=t.start,this._programEnd=t.end):(this._programStart=null,this._programEnd=null),this._initPlaybackFlags();try{let r=this._buildPlayMediaId(s);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:r,media_content_type:"video"})}catch(r){console.error("[Molotov Panel] Play tonight program failed:",r),this._playerError=r.message||"Erreur de lecture",this._castLoading=!1}}_renderRecordingItem(t){let e=t.mediaContentId,i=this._expandedRecordings[e],s=this._recordingEpisodes[e]||[],n=this._loadingRecordingEpisodes[e],r=this._recordingEpisodes[e]!==void 0,u=!t.isFolder||r&&s.length<=1;return v`
      <div class="search-result-row">
        <div
          class="search-result-main"
          role="button"
          tabindex="0"
          @click=${x=>this._toggleRecordingExpand(x,t)}
          @keydown=${x=>this._activateOnKey(x,()=>this._toggleRecordingExpand(x,t))}
        >
          ${u?v`<ha-icon class="expand-icon" icon="mdi:play-circle-outline"></ha-icon>`:v`<ha-icon
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
                          @keydown=${M=>this._activateOnKey(M,()=>this._playRecordingEpisode(x,t.title))}
                        >
                          ${x.thumbnail?v`<img class="episode-thumb" src=${x.thumbnail} loading="lazy" @load=${M=>M.target.style.display=""} @error=${M=>M.target.style.display="none"} />`:""}
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
                          @keydown=${u=>this._activateOnKey(u,()=>this._playEpisode(r,t.title))}
                        >
                          ${r.thumbnail?v`<img class="episode-thumb" src=${r.thumbnail} loading="lazy" @load=${u=>u.target.style.display=""} @error=${u=>u.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${r.title}</div>
                            ${r.description?v`<div class="episode-desc">${r.description}</div>`:""}
                          </div>
                        </div>
                      `):v`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderChannelItem(t){let e=t.currentProgram,i=e?.start?this._formatClockTime(e.start):"",s=e?.end?this._formatClockTime(e.end):"",n=i&&s?`${i} - ${s}`:"",r=this._expandedChannels[t.id],u=this._channelPrograms[t.id]||[],x=this._loadingPrograms[t.id];return v`
      <div class="channel-row">
        <div class="channel-main">
          <img
            class="channel-logo"
            src=${t.thumbnail||""}
            alt=${t.name}
            loading="lazy"
            @load=${M=>M.target.style.display=""} @error=${M=>M.target.style.display="none"}
            @click=${()=>this._playChannel(t)}
          />
          <div
            class="channel-info"
            role="button"
            tabindex="0"
            @click=${()=>this._playChannel(t)}
            @keydown=${M=>this._activateOnKey(M,()=>this._playChannel(t))}
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
              @click=${M=>this._toggleChannelExpand(M,t)}
            >
              <ha-icon icon="mdi:history"></ha-icon>
              Replay
            </button>
          </div>
        </div>
        ${r?v`
              <div class="replay-list">
                ${x?v`<div class="replay-loading">Chargement...</div>`:u.length>0?u.map(M=>v`
                        <div
                          class="replay-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playReplay(M)}
                          @keydown=${j=>this._activateOnKey(j,()=>this._playReplay(M))}
                        >
                          ${M.thumbnail?v`<img class="replay-thumb" src=${M.thumbnail} loading="lazy" @load=${j=>j.target.style.display=""} @error=${j=>j.target.style.display="none"} />`:""}
                          <div class="replay-item-info">
                            <span class="replay-item-title">${M.title}</span>
                            ${M.description?v`<span class="replay-item-desc">${M.description}</span>`:""}
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
              @keydown=${u=>this._activateOnKey(u,()=>this._focusCast(e))}
            >
              <span class="chip-icon">
                <ha-icon icon=${r?"mdi:cast-connected":"mdi:cast"} style="--mdc-icon-size: 18px;"></ha-icon>
              </span>
              <span>${n}</span>
              <span class="chip-stop" @click=${u=>this._stopSpecificCast(u,e)}>
                <ha-icon icon="mdi:close" style="--mdc-icon-size: 16px;"></ha-icon>
              </span>
            </div>
          `})}
      </div>
    `}async _focusCast(t){let e=this._getEntityId();if(!e)return;let i=this._activeCasts[t];if(!i)return;let s=t;try{await this.hass.callService("media_player","select_source",{entity_id:e,source:s}),this._focusedCastHost=t,this._castTarget=t,this._castTitle=i.title||"En cours de lecture",console.log("[Molotov Panel] Focused cast:",t)}catch(n){console.error("[Molotov Panel] Focus cast failed:",n)}}async _stopSpecificCast(t,e){t.stopPropagation();let i=this._getEntityId();if(!i||!this._activeCasts[e])return;let n=e;try{await this.hass.callService("media_player","select_source",{entity_id:i,source:n}),await new Promise(r=>setTimeout(r,200)),await this.hass.callService("media_player","media_stop",{entity_id:i}),console.log("[Molotov Panel] Stopped cast:",e)}catch(r){console.error("[Molotov Panel] Stop specific cast failed:",r)}}async _stopCastPlayback(){let t=this._getEntityId();if(t){try{await this.hass.callService("media_player","media_stop",{entity_id:t})}catch(e){console.error("[Molotov Panel] Stop cast failed:",e)}this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate(),this._castMinimized=!1,this._castLoading=!1,this._episodePlaylist=[],this._episodeIndex=-1}}async _toggleCastPlayPause(){let t=this._getEntityId();if(t)try{this._paused?await this.hass.callService("media_player","media_play",{entity_id:t}):await this.hass.callService("media_player","media_pause",{entity_id:t})}catch(e){console.error("[Molotov Panel] Play/pause cast failed:",e)}}async _castSkipForward(){let t=this._getEntityId();if(t)try{await this.hass.callService("media_player","media_next_track",{entity_id:t})}catch(e){console.error("[Molotov Panel] Skip forward failed:",e)}}_setCastPosition(t){this._currentTime=t,this._castBasePosition=t,this._castPositionUpdatedAt=Date.now()/1e3}async _castSeek(t){let e=this._getEntityId();if(e)try{await this.hass.callService("media_player","media_seek",{entity_id:e,seek_position:t}),this._setCastPosition(t)}catch(i){console.error("[Molotov Panel] Cast seek failed:",i)}}async _castSeekBeginning(){await this._castSeek(0)}async _castSkipBack30(){await this._castSeek(Math.max(0,this._currentTime-30))}async _castSkipBack10(){await this._castSeek(Math.max(0,this._currentTime-10))}async _castSkipAd(){this._castSkipTo!==null&&await this._castSeek(this._castSkipTo)}async _handleCastSeek(t){let e=this._getEntityId();if(!e||!this._duration)return;let s=t.currentTarget.getBoundingClientRect(),r=(t.clientX-s.left)/s.width*this._duration;try{await this.hass.callService("media_player","media_seek",{entity_id:e,seek_position:r}),this._setCastPosition(r)}catch(u){console.error("[Molotov Panel] Seek failed:",u)}}async _handleCastVolumeChange(t){let e=this._getEntityId();if(!e)return;let i=parseFloat(t.target.value);this._volume=i;try{await this.hass.callService("media_player","volume_set",{entity_id:e,volume_level:i})}catch(s){console.error("[Molotov Panel] Volume change failed:",s)}}async _toggleCastMute(){let t=this._getEntityId();if(t)try{await this.hass.callService("media_player","volume_mute",{entity_id:t,is_volume_muted:!this._muted}),this._muted=!this._muted}catch(e){console.error("[Molotov Panel] Mute toggle failed:",e)}}};customElements.define("molotov-panel",ii);console.log(`[Molotov Panel] Registered - v${Ei}`);
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
