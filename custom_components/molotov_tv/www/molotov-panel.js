var ze=typeof window<"u"&&window.customElements!=null&&window.customElements.polyfillWrapFlushCallback!==void 0;var Wt=(o,t,e=null)=>{for(;t!==e;){let i=t.nextSibling;o.removeChild(t),t=i}};var gt=`{{lit-${String(Math.random()).slice(2)}}}`,je=`<!--${gt}-->`,li=new RegExp(`${gt}|${je}`),re="$lit$",Kt=class{constructor(t,e){this.parts=[],this.element=e;let i=[],s=[],n=document.createTreeWalker(e.content,133,null,!1),r=0,u=-1,v=0,{strings:M,values:{length:q}}=t;for(;v<q;){let R=n.nextNode();if(R===null){n.currentNode=s.pop();continue}if(u++,R.nodeType===1){if(R.hasAttributes()){let st=R.attributes,{length:et}=st,rt=0;for(let ot=0;ot<et;ot++)ci(st[ot].name,re)&&rt++;for(;rt-- >0;){let ot=M[v],It=Ie.exec(ot)[2],_t=It.toLowerCase()+re,ft=R.getAttribute(_t);R.removeAttribute(_t);let lt=ft.split(li);this.parts.push({type:"attribute",index:u,name:It,strings:lt}),v+=lt.length-1}}R.tagName==="TEMPLATE"&&(s.push(R),n.currentNode=R.content)}else if(R.nodeType===3){let st=R.data;if(st.indexOf(gt)>=0){let et=R.parentNode,rt=st.split(li),ot=rt.length-1;for(let It=0;It<ot;It++){let _t,ft=rt[It];if(ft==="")_t=wt();else{let lt=Ie.exec(ft);lt!==null&&ci(lt[2],re)&&(ft=ft.slice(0,lt.index)+lt[1]+lt[2].slice(0,-re.length)+lt[3]),_t=document.createTextNode(ft)}et.insertBefore(_t,R),this.parts.push({type:"node",index:++u})}rt[ot]===""?(et.insertBefore(wt(),R),i.push(R)):R.data=rt[ot],v+=ot}}else if(R.nodeType===8)if(R.data===gt){let st=R.parentNode;(R.previousSibling===null||u===r)&&(u++,st.insertBefore(wt(),R)),r=u,this.parts.push({type:"node",index:u}),R.nextSibling===null?R.data="":(i.push(R),u--),v++}else{let st=-1;for(;(st=R.data.indexOf(gt,st+1))!==-1;)this.parts.push({type:"node",index:-1}),v++}}for(let R of i)R.parentNode.removeChild(R)}},ci=(o,t)=>{let e=o.length-t.length;return e>=0&&o.slice(e)===t},ge=o=>o.index!==-1,wt=()=>document.createComment(""),Ie=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;var qe=133;function Ve(o,t){let{element:{content:e},parts:i}=o,s=document.createTreeWalker(e,qe,null,!1),n=me(i),r=i[n],u=-1,v=0,M=[],q=null;for(;s.nextNode();){u++;let R=s.currentNode;for(R.previousSibling===q&&(q=null),t.has(R)&&(M.push(R),q===null&&(q=R)),q!==null&&v++;r!==void 0&&r.index===u;)r.index=q!==null?-1:r.index-v,n=me(i,n),r=i[n]}M.forEach(R=>R.parentNode.removeChild(R))}var Ti=o=>{let t=o.nodeType===11?0:1,e=document.createTreeWalker(o,qe,null,!1);for(;e.nextNode();)t++;return t},me=(o,t=-1)=>{for(let e=t+1;e<o.length;e++){let i=o[e];if(ge(i))return e}return-1};function di(o,t,e=null){let{element:{content:i},parts:s}=o;if(e==null){i.appendChild(t);return}let n=document.createTreeWalker(i,qe,null,!1),r=me(s),u=0,v=-1;for(;n.nextNode();)for(v++,n.currentNode===e&&(u=Ti(t),e.parentNode.insertBefore(t,e));r!==-1&&s[r].index===v;){if(u>0){for(;r!==-1;)s[r].index+=u,r=me(s,r);return}r=me(s,r)}}var Ci=new WeakMap;var Yt=o=>typeof o=="function"&&Ci.has(o);var pt={},Ae={};var Dt=class{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(let i of this.__parts)i!==void 0&&i.setValue(t[e]),e++;for(let i of this.__parts)i!==void 0&&i.commit()}_clone(){let t=ze?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],i=this.template.parts,s=document.createTreeWalker(t,133,null,!1),n=0,r=0,u,v=s.nextNode();for(;n<i.length;){if(u=i[n],!ge(u)){this.__parts.push(void 0),n++;continue}for(;r<u.index;)r++,v.nodeName==="TEMPLATE"&&(e.push(v),s.currentNode=v.content),(v=s.nextNode())===null&&(s.currentNode=e.pop(),v=s.nextNode());if(u.type==="node"){let M=this.processor.handleTextExpression(this.options);M.insertAfterNode(v.previousSibling),this.__parts.push(M)}else this.__parts.push(...this.processor.handleAttributeExpressions(v,u.name,u.strings,this.options));n++}return ze&&(document.adoptNode(t),customElements.upgrade(t)),t}};var hi=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:o=>o}),Ai=` ${gt} `,Ct=class{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){let t=this.strings.length-1,e="",i=!1;for(let s=0;s<t;s++){let n=this.strings[s],r=n.lastIndexOf("<!--");i=(r>-1||i)&&n.indexOf("-->",r+1)===-1;let u=Ie.exec(n);u===null?e+=n+(i?Ai:je):e+=n.substr(0,u.index)+u[1]+u[2]+re+u[3]+gt}return e+=this.strings[t],e}getTemplateElement(){let t=document.createElement("template"),e=this.getHTML();return hi!==void 0&&(e=hi.createHTML(e)),t.innerHTML=e,t}};var $e=o=>o===null||!(typeof o=="object"||typeof o=="function"),Me=o=>Array.isArray(o)||!!(o&&o[Symbol.iterator]),oe=class{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let s=0;s<i.length-1;s++)this.parts[s]=this._createPart()}_createPart(){return new ye(this)}_getValue(){let t=this.strings,e=t.length-1,i=this.parts;if(e===1&&t[0]===""&&t[1]===""){let n=i[0].value;if(typeof n=="symbol")return String(n);if(typeof n=="string"||!Me(n))return n}let s="";for(let n=0;n<e;n++){s+=t[n];let r=i[n];if(r!==void 0){let u=r.value;if($e(u)||!Me(u))s+=typeof u=="string"?u:String(u);else for(let v of u)s+=typeof v=="string"?v:String(v)}}return s+=t[e],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}},ye=class{constructor(t){this.value=void 0,this.committer=t}setValue(t){t!==pt&&(!$e(t)||t!==this.value)&&(this.value=t,Yt(t)||(this.committer.dirty=!0))}commit(){for(;Yt(this.value);){let t=this.value;this.value=pt,t(this)}this.value!==pt&&this.committer.commit()}},Xt=class o{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(wt()),this.endNode=t.appendChild(wt())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=wt()),t.__insert(this.endNode=wt())}insertAfterPart(t){t.__insert(this.startNode=wt()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(this.startNode.parentNode===null)return;for(;Yt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=pt,e(this)}let t=this.__pendingValue;t!==pt&&($e(t)?t!==this.value&&this.__commitText(t):t instanceof Ct?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):Me(t)?this.__commitIterable(t):t===Ae?(this.value=Ae,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){let e=this.startNode.nextSibling;t=t??"";let i=typeof t=="string"?t:String(t);e===this.endNode.previousSibling&&e.nodeType===3?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){let e=this.options.templateFactory(t);if(this.value instanceof Dt&&this.value.template===e)this.value.update(t.values);else{let i=new Dt(e,t.processor,this.options),s=i._clone();i.update(t.values),this.__commitNode(s),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());let e=this.value,i=0,s;for(let n of t)s=e[i],s===void 0&&(s=new o(this.options),e.push(s),i===0?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(n),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){Wt(this.startNode.parentNode,t.nextSibling,this.endNode)}},be=class{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,i.length!==2||i[0]!==""||i[1]!=="")throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;Yt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=pt,e(this)}if(this.__pendingValue===pt)return;let t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=pt}},ve=class extends oe{constructor(t,e,i){super(t,e,i),this.single=i.length===2&&i[0]===""&&i[1]===""}_createPart(){return new Re(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}},Re=class extends ye{},ui=!1;(()=>{try{let o={get capture(){return ui=!0,!1}};window.addEventListener("test",o,o),window.removeEventListener("test",o,o)}catch{}})();var xe=class{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=s=>this.handleEvent(s)}setValue(t){this.__pendingValue=t}commit(){for(;Yt(this.__pendingValue);){let n=this.__pendingValue;this.__pendingValue=pt,n(this)}if(this.__pendingValue===pt)return;let t=this.__pendingValue,e=this.value,i=t==null||e!=null&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),s=t!=null&&(e==null||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=Mi(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=pt}handleEvent(t){typeof this.value=="function"?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}},Mi=o=>o&&(ui?{capture:o.capture,passive:o.passive,once:o.once}:o.capture);function Ge(o){let t=Qt.get(o.type);t===void 0&&(t={stringsArray:new WeakMap,keyString:new Map},Qt.set(o.type,t));let e=t.stringsArray.get(o.strings);if(e!==void 0)return e;let i=o.strings.join(gt);return e=t.keyString.get(i),e===void 0&&(e=new Kt(o,o.getTemplateElement()),t.keyString.set(i,e)),t.stringsArray.set(o.strings,e),e}var Qt=new Map;var Ft=new WeakMap,He=(o,t,e)=>{let i=Ft.get(t);i===void 0&&(Wt(t,t.firstChild),Ft.set(t,i=new Xt(Object.assign({templateFactory:Ge},e))),i.appendInto(t)),i.setValue(o),i.commit()};var Ne=class{handleAttributeExpressions(t,e,i,s){let n=e[0];return n==="."?new ve(t,e.slice(1),i).parts:n==="@"?[new xe(t,e.slice(1),s.eventContext)]:n==="?"?[new be(t,e.slice(1),i)]:new oe(t,e,i).parts}handleTextExpression(t){return new Xt(t)}},We=new Ne;typeof window<"u"&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var b=(o,...t)=>new Ct(o,t,"html",We);var _i=(o,t)=>`${o}--${t}`,Oe=!0;typeof window.ShadyCSS>"u"?Oe=!1:typeof window.ShadyCSS.prepareTemplateDom>"u"&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),Oe=!1);var $i=o=>t=>{let e=_i(t.type,o),i=Qt.get(e);i===void 0&&(i={stringsArray:new WeakMap,keyString:new Map},Qt.set(e,i));let s=i.stringsArray.get(t.strings);if(s!==void 0)return s;let n=t.strings.join(gt);if(s=i.keyString.get(n),s===void 0){let r=t.getTemplateElement();Oe&&window.ShadyCSS.prepareTemplateDom(r,o),s=new Kt(t,r),i.keyString.set(n,s)}return i.stringsArray.set(t.strings,s),s},Ni=["html","svg"],Oi=o=>{Ni.forEach(t=>{let e=Qt.get(_i(t,o));e!==void 0&&e.keyString.forEach(i=>{let{element:{content:s}}=i,n=new Set;Array.from(s.querySelectorAll("style")).forEach(r=>{n.add(r)}),Ve(i,n)})})},fi=new Set,Li=(o,t,e)=>{fi.add(o);let i=e?e.element:document.createElement("template"),s=t.querySelectorAll("style"),{length:n}=s;if(n===0){window.ShadyCSS.prepareTemplateStyles(i,o);return}let r=document.createElement("style");for(let M=0;M<n;M++){let q=s[M];q.parentNode.removeChild(q),r.textContent+=q.textContent}Oi(o);let u=i.content;e?di(e,r,u.firstChild):u.insertBefore(r,u.firstChild),window.ShadyCSS.prepareTemplateStyles(i,o);let v=u.querySelector("style");if(window.ShadyCSS.nativeShadow&&v!==null)t.insertBefore(v.cloneNode(!0),t.firstChild);else if(e){u.insertBefore(r,u.firstChild);let M=new Set;M.add(r),Ve(e,M)}},gi=(o,t,e)=>{if(!e||typeof e!="object"||!e.scopeName)throw new Error("The `scopeName` option is required.");let i=e.scopeName,s=Ft.has(t),n=Oe&&t.nodeType===11&&!!t.host,r=n&&!fi.has(i),u=r?document.createDocumentFragment():t;if(He(o,u,Object.assign({templateFactory:$i(i)},e)),r){let v=Ft.get(u);Ft.delete(u);let M=v.value instanceof Dt?v.value.template:void 0;Li(i,u,M),Wt(t,t.firstChild),t.appendChild(u),Ft.set(t,v)}!s&&n&&window.ShadyCSS.styleElement(t.host)};var mi;window.JSCompiler_renameProperty=(o,t)=>o;var Ze={toAttribute(o,t){switch(t){case Boolean:return o?"":null;case Object:case Array:return o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){switch(t){case Boolean:return o!==null;case Number:return o===null?null:Number(o);case Object:case Array:return JSON.parse(o)}return o}},yi=(o,t)=>t!==o&&(t===t||o===o),Ke={attribute:!0,type:String,converter:Ze,reflect:!1,hasChanged:yi},Ye=1,Xe=4,Qe=8,Je=16,ti="finalized",ae=class extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();let t=[];return this._classProperties.forEach((e,i)=>{let s=this._attributeNameForProperty(i,e);s!==void 0&&(this._attributeToPropertyMap.set(s,i),t.push(s))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;let t=Object.getPrototypeOf(this)._classProperties;t!==void 0&&t.forEach((e,i)=>this._classProperties.set(i,e))}}static createProperty(t,e=Ke){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;let i=typeof t=="symbol"?Symbol():`__${t}`,s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Object.defineProperty(this.prototype,t,s)}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){let n=this[t];this[e]=s,this.requestUpdateInternal(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||Ke}static finalize(){let t=Object.getPrototypeOf(this);if(t.hasOwnProperty(ti)||t.finalize(),this[ti]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){let e=this.properties,i=[...Object.getOwnPropertyNames(e),...typeof Object.getOwnPropertySymbols=="function"?Object.getOwnPropertySymbols(e):[]];for(let s of i)this.createProperty(s,e[s])}}static _attributeNameForProperty(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=yi){return i(t,e)}static _propertyValueFromAttribute(t,e){let i=e.type,s=e.converter||Ze,n=typeof s=="function"?s:s.fromAttribute;return n?n(t,i):t}static _propertyValueToAttribute(t,e){if(e.reflect===void 0)return;let i=e.type,s=e.converter;return(s&&s.toAttribute||Ze.toAttribute)(t,i)}initialize(){this._updateState=0,this._updatePromise=new Promise(t=>this._enableUpdatingResolver=t),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){let i=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,i)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){this._enableUpdatingResolver!==void 0&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=Ke){let s=this.constructor,n=s._attributeNameForProperty(t,i);if(n!==void 0){let r=s._propertyValueToAttribute(e,i);if(r===void 0)return;this._updateState=this._updateState|Qe,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._updateState=this._updateState&~Qe}}_attributeToProperty(t,e){if(this._updateState&Qe)return;let i=this.constructor,s=i._attributeToPropertyMap.get(t);if(s!==void 0){let n=i.getPropertyOptions(s);this._updateState=this._updateState|Je,this[s]=i._propertyValueFromAttribute(e,n),this._updateState=this._updateState&~Je}}requestUpdateInternal(t,e,i){let s=!0;if(t!==void 0){let n=this.constructor;i=i||n.getPropertyOptions(t),n._valueHasChanged(this[t],e,i.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),i.reflect===!0&&!(this._updateState&Je)&&(this._reflectingProperties===void 0&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,i))):s=!1}!this._hasRequestedUpdate&&s&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=this._updateState|Xe;try{await this._updatePromise}catch{}let t=this.performUpdate();return t!=null&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return this._updateState&Xe}get hasUpdated(){return this._updateState&Ye}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1,e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(i){throw t=!1,this._markUpdated(),i}t&&(this._updateState&Ye||(this._updateState=this._updateState|Ye,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~Xe}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){this._reflectingProperties!==void 0&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,i)=>this._propertyToAttribute(i,this[i],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}};mi=ti;ae[mi]=!0;var bi=Element.prototype,Ls=bi.msMatchesSelector||bi.webkitMatchesSelector;var Le=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ei=Symbol(),we=class{constructor(t,e){if(e!==ei)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return this._styleSheet===void 0&&(Le?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}},vi=o=>new we(String(o),ei),Ui=o=>{if(o instanceof we)return o.cssText;if(typeof o=="number")return o;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${o}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`)},xi=(o,...t)=>{let e=t.reduce((i,s,n)=>i+Ui(s)+o[n+1],o[0]);return new we(e,ei)};(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");var wi={},Jt=class extends ae{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;let t=this.getStyles();if(Array.isArray(t)){let e=(n,r)=>n.reduceRight((u,v)=>Array.isArray(v)?e(v,u):(u.add(v),u),r),i=e(t,new Set),s=[];i.forEach(n=>s.unshift(n)),this._styles=s}else this._styles=t===void 0?[]:[t];this._styles=this._styles.map(e=>{if(e instanceof CSSStyleSheet&&!Le){let i=Array.prototype.slice.call(e.cssRules).reduce((s,n)=>s+n.cssText,"");return vi(i)}return e})}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){let t=this.constructor._styles;t.length!==0&&(window.ShadyCSS!==void 0&&!window.ShadyCSS.nativeShadow?window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(e=>e.cssText),this.localName):Le?this.renderRoot.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):this._needsShimAdoptedStyleSheets=!0)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&window.ShadyCSS!==void 0&&window.ShadyCSS.styleElement(this)}update(t){let e=this.render();super.update(t),e!==wi&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(i=>{let s=document.createElement("style");s.textContent=i.cssText,this.renderRoot.appendChild(s)}))}render(){return wi}};Jt.finalized=!0;Jt.render=gi;Jt.shadowRootOptions={mode:"open"};var B=(()=>{function At(c,m){let f=[],l=0;for(;l<c.length;){if(!c[l]){l++;continue}let a=l,_=l+1;for(;_<c.length&&_-a<=m+1;)c[_]&&(a=_),_++;f.push([l,a]),l=a+1}return f}function ce(c,m,f){let l=0;for(let k of c)k&&l++;if(!(f>0)||l*2<c.length)return null;let a=At(c,3).filter(k=>(k[1]-k[0]+1)*f>=60),_=[];for(let k=0;k+1<a.length;k++){let P=a[k],E=a[k+1],$=m+(P[1]+1)*f,I=m+E[0]*f,C=0;for(let N=P[1]+1;N<E[0];N++)c[N]&&C++;I-$>=150&&I-$<=800&&C*2<E[0]-P[1]-1&&_.push([$,I])}return _}function it(c,m,f){let l=new Array(c.length).fill(!1);for(let a=0;a<c.length;a++){if(!f[a])continue;let _=[];for(let k=Math.max(0,a-2);k<=Math.min(c.length-1,a+2);k++)f[k]&&_.push(c[k]);_.sort((k,P)=>k-P),l[a]=_[_.length>>1]<.5*m}return l}function ct(c){let m=new Array(c.length).fill(!1);for(let f of At(c,0))if(f[1]-f[0]+1>=5)for(let l=f[0];l<=f[1];l++)m[l]=!0;return m}function D(c,m,f,l,a){let _=ct(c),k=(C,N)=>{if(C<0||N>_.length)return!1;let F=0;for(let Lt=C;Lt<N;Lt++)_[Lt]||F++;return F>=8},P=C=>{let N=(C[1]+1-C[0])*m;return k(C[0]-15,C[0])&&k(C[1]+1,C[1]+1+15)&&N>=150&&N<=1200},E=At(_,7);if(!f||!l)return E.filter(P);let $=a?E.filter(C=>C[1]-C[0]+1>=10):E,I=[];for(let C of Bt($,f,l,m)){let N=$.filter(F=>F[0]>=C[0]&&F[1]<=C[1]);if(P(C)&&(!a||N.length===1||N.some(P)))I.push(C);else for(let F of N)P(F)&&I.push([F[0],F[1]])}return I}function Bt(c,m,f,l){let a=[];for(let _ of c){let k=a[a.length-1];k&&(_[1]+1-k[0])*l<=1200&&zt(k[1]+1,_[0],m,f)?k[1]=_[1]:a.push([_[0],_[1]])}return a}function zt(c,m,f,l){let a=0;for(let _=c;_<m;_++)(f[_]||l[_])&&a++;return m-c<=29&&a>=m-c-7&&St(f,c,m)<=10&&St(l,c,m)<=12}function St(c,m,f){let l=0,a=0;for(let _=m;_<f;_++)l=c[_]?l+1:0,a=Math.max(a,l);return a}function dt(c,m,f,l){let a=c,_=l?c.map((I,C)=>!I&&l[C]):null,k=l?c.map((I,C)=>I&&!l[C]):null,P=D(a,f,k,_,!0);if(l){a=new Array(c.length).fill(!1);let I=new Array(c.length).fill(!1);for(let C of P)for(let N=C[0];N<=C[1];N++)a[N]=c[N]&&l[N],I[N]=c[N]&&!l[N];P=D(a,f,I,_)}let E=ct(a),$=l?Se(c,l,P,m,f):[];return P.map(I=>{let C=At(E.slice(I[0],I[1]+1),0),N=Mt(l?ht(C,I[0],c,l):C);return[m+(I[0]+N[0])*f,m+(I[0]+N[1]+1)*f]}).concat($)}function Mt(c){let m=0,f=c.length-1;for(;f>m&&c[f][1]-c[f][0]+1<10;)f--;for(;m<f&&c[m][1]-c[m][0]+1<10;)m++;return[c[m][0],c[f][1]]}function ht(c,m,f,l){let a=[];for(let _ of c){let k=a[a.length-1];k&&!Rt(m+k[1]+1,m+_[0],f,l)?k[1]=_[1]:a.push([_[0],_[1]])}return a}function Rt(c,m,f,l){let a=0;for(let _=c;_<m;_++)if(!f[_]&&!l[_]||(a=l[_]?0:a+1,a>=5))return!0;return!1}function Se(c,m,f,l,a){let _=ct(c),k=(E,$)=>{if(E<0||$>_.length)return!1;let I=0;for(let C=E;C<$;C++)_[C]||I++;return I>=12},P=[];for(let E of D(m,a)){if(f.some(F=>F[0]<=E[1]&&E[0]<=F[1]))continue;let $=0;for(let F=E[0];F<=E[1];F++)c[F]&&$++;if($<.5*(E[1]-E[0]+1))continue;let I=-1,C=-1;for(let F=E[0];F<=E[1];F++)_[F]&&(I<0&&(I=F),C=F+1);if(I<0||(C-I)*a<150||!k(I-15,I)||!k(C,C+15))continue;let N=Mt(ht(At(_.slice(E[0],E[1]+1),0),E[0],c,m));P.push([l+(E[0]+N[0])*a,l+(E[0]+N[1]+1)*a])}return P}function $t(c,m){if(c===null)return m||[];if(m===null)return c;let f=[];for(let l of c)for(let a of m){let _=Math.max(l[0],a[0]),k=Math.min(l[1],a[1]);k-_<60||f.push([Math.abs(l[0]-a[0])<=90?a[0]:_,Math.abs(l[1]-a[1])<=90?a[1]:k])}return f}function Zt(c,m,f){let l=Math.floor(m*.22),a=Math.floor(f*.22),_=l-1,k=a-1,P=_*k,E=[[0,0],[m-l,0],[0,f-a],[m-l,f-a]],$=E.map(()=>new Uint8Array(P>0?c*P:0)),I=new Array(c).fill(!1),C=-1;function N(A,V){if(!(P<=0||A<0||A>=c||V.length<m*f)){for(let z=0;z<E.length;z++){let X=E[z][0],G=E[z][1],Q=$[z],H=A*P;for(let j=0;j<k;j++){let W=(G+j)*m+X;for(let Pt=0;Pt<_;Pt++){let Ut=V[W];Q[H++]=Math.min(255,Math.abs(V[W+1]-Ut)+Math.abs(V[W+m]-Ut)),W++}}}I[A]=!0}}function F(A,V,z){let X=$[A],G=new Uint8Array(P);for(let W=0;W<P;W++){z.fill(0);for(let Be of V)z[X[Be*P+W]]++;let Pt=0,Ut=0;for(;Pt+z[Ut]<=V.length>>1;)Pt+=z[Ut++];G[W]=Ut}let Q=Math.max(1,Array.from(G).sort((W,Pt)=>W-Pt)[Math.floor(P*.92)]),H=[],j=0;for(let W=0;W<P;W++)G[W]>=Q&&(H.push(W),j+=G[W]);return H.length===0?null:{corner:A,median:G,mask:H,strength:j/H.length,whole:j}}function Lt(A,V,z,X){let G=null;for(let Q=A;Q<V;Q++){let H=F(Q,z,X);H!==null&&(G===null||H.strength>G.strength)&&(G=H)}return G}function Ee(A,V){let z=$[A.corner],X=new Float64Array(c),G=[];for(let Q of V){let H=Q*P,j=0;for(let W of A.mask)j+=Math.min(z[H+W],A.median[W]);X[Q]=j/A.whole,G.push(X[Q])}return G.sort((Q,H)=>Q-H),A.score=X,A.usual=G[G.length>>1],A}function se(){let A=[];for(let j=0;j<c;j++)I[j]&&A.push(j);if(P<=0||A.length<30)return null;let V=new Int32Array(256),z=j=>j!==null&&j.strength>=25?j:null,X=j=>j!==null&&j.strength>=30?j:null,G=Lt(2,$.length,A,V),Q=C<0?z(Lt(0,2,A,V)):C<2?F(C,A,V):null,H=Q!==null?Q:C<0?z(G):F(C,A,V);return H===null?null:(C=H.corner,Ee(H,A),H.lower=Q!==null&&X(G)!==null?Ee(G,A):null,H)}function Pe(A){let V=E[A.corner][0],z=E[A.corner][1];return{width:m,points:A.mask.map(X=>(z+Math.floor(X/_))*m+V+X%_),pattern:A.mask.map(X=>A.median[X]),whole:A.whole,usual:A.usual,strength:A.strength,lower:A.lower?Pe(A.lower):null,channel:A.corner<2}}function Fe(){let A=se();return A===null?null:Pe(A)}function _e(){let A=se();return A===null?null:it(A.score,A.usual,I)}return{add:N,logo:Fe,gone:_e,breaks:(A,V)=>{let z=se();if(z===null)return null;let X=z.lower?it(z.lower.score,z.lower.usual,I):null;return dt(it(z.score,z.usual,I),A,V,X)}}}function de(c){return c.lower?Object.assign({},c,{lower:null}):c}function jt(c,m,f){let l=0;for(let a of m)Nt(c,a)>=.5*c.usual&&l++;return l>=f*m.length}function Nt(c,m){let f=0;for(let l=0;l<c.points.length;l++){let a=c.points[l],_=m[a];f+=Math.min(Math.abs(m[a+1]-_)+Math.abs(m[a+c.width]-_),c.pattern[l])}return f/c.whole}function Z(c){let m=String(c).match(/[A-Za-z0-9+\/]{16,}={0,2}/g)||[];for(let f of m){let l;try{l=atob(f)}catch{continue}if(l.length<20||l.charCodeAt(0)!==252)continue;let a=_=>{if(_<0||_>=l.length)throw new RangeError("short");return l.charCodeAt(_)};try{if(a(13)===5&&!(a(18)&128))return(a(19)&128)!==0;for(let _=16;_+4<=l.length;_++){if(l.substr(_,4)!=="CUEI"||a(_-2)!==2)continue;let k=_+8;if(a(k)&128)continue;k++;let P=a(k);k++,P&128||(k+=1+6*a(k)),P&64&&(k+=5),k+=2+a(k+1);let E=a(k);if([34,48,50,52,54].indexOf(E)>=0)return!0;if([35,49,51,53,55].indexOf(E)>=0)return!1}}catch{return null}return null}return null}function te(c){let m=[];if(c.some(f=>f.signalled))for(let f of c)for(let l of f.marks){if(!l.opens)continue;let a=null;if(l.duration!==null)a=l.at+l.duration;else{let _=f.marks.filter(k=>k.at>l.at).map(k=>k.at);a=_.length>0?Math.min.apply(null,_):f.end}a!==null&&a>l.at&&m.push([l.at,a])}else{let f=l=>l.end-l.start;for(let l=1;l+1<c.length;l++){let a=c[l-1],_=c[l],k=c[l+1];if(a.end===null||_.end===null||k.end===null)continue;f(_)<10&&f(a)>=60&&f(a)<=330&&f(k)>=60&&f(k)<=330&&m.push([a.start,k.end])}}return qt(m,10)}function qt(c,m){let f=[];for(let l of c.slice().sort((a,_)=>a[0]-_[0])){let a=f[f.length-1];a&&l[0]-a[1]<=m?a[1]=Math.max(a[1],l[1]):f.push([l[0],l[1]])}return f}let Vt=120,he=40,ue=4e3,ut=10,kt=14,mt=6,ee=90,ke=100,yt=65536,ie=1e4;function bt(c,m){return String.fromCharCode(c[m+4],c[m+5],c[m+6],c[m+7])}function Ot(c){let m=new DataView(c.buffer,c.byteOffset,c.byteLength),f=0;for(;c.length-f>=8;){let l=m.getUint32(f);if(l<8||f+l>yt)return null;if(bt(c,f)==="moof")return f+l;f+=l}return null}function Gt(c,m,f,l){let a=[],_=f;for(;l-_>=8;){let k=m.getUint32(_);if(k<8||k>l-_)break;a.push({type:bt(c,_),from:_+8,to:_+k}),_+=k}return a}function pe(c){let m=Ot(c);if(m===null||m>c.length)return null;let f=new DataView(c.buffer,c.byteOffset,c.byteLength),l=Gt(c,f,0,m).pop();if(!l||l.type!=="moof")return null;let a=Gt(c,f,l.from,l.to).filter(P=>P.type==="traf")[0];if(!a)return null;let _=[],k=-1;for(let P of Gt(c,f,a.from,a.to)){if(P.type!=="tfhd"&&P.type!=="trun")continue;let E=P.from;if(P.to-E<8)return null;let $=f.getUint32(E)&16777215;if(P.type==="tfhd"){let I=E+8;if($&1&&(I+=8),$&2&&(I+=4),$&8&&(I+=4),$&16){if(I+4>P.to)return null;k=f.getUint32(I)}}else{let I=f.getUint32(E+4),C=(($&256?1:0)+($&512?1:0)+($&1024?1:0)+($&2048?1:0))*4,N=E+8+($&1?4:0)+($&4?4:0);if(I>ie||N+I*C>P.to||!($&512)&&k<0)return null;for(let F=0;F<I;F++)_.push($&512?f.getUint32(N+($&256?4:0)):k),N+=C}}return _}function Et(c,m,f){let l=[],a=0,_=0;for(let k=0;k<c.length;k++){let P=c[k];if(P>=0&&P<Vt){a++,_+=P;continue}a>=ut&&a<=kt&&_<=he*a&&P>ue&&l.push(m+k*f),a=0,_=0}return l}function vt(c){let m=c.slice().sort((a,_)=>a-_),f=[],l=0;for(let a=0;a<m.length;a++)a<m.length-1&&m[a+1]-m[a]<=ke||(a-l+1>=mt&&m[a]-m[l]>=ee&&f.push([m[l+1],m[a-1]]),l=a+1);return f}return{runs:At,captionBreaks:ce,gone:it,solid:ct,logoBreaks:dt,combine:$t,track:Zt,score:Nt,alone:de,seenIn:jt,opens:Z,markedBreaks:te,merge:qt,moofEnd:Ot,frameSizes:pe,separatorEnds:Et,separatedBreaks:vt,BRIDGE:7,AROUND:15,LOGO_MAX_S:1200}})();function Si(o){let _t=B.LOGO_MAX_S+160,ft=_t+120,lt=3,si=8192,le=480,ni=8,ri=3e4,oi=4e3,ai=150,De=1e4,At=5*60*1e3,ce=2e4,it=240,ct=135,D=0,Bt=null,zt=!1,St=null,dt=null,Mt=[],ht="none",Rt=null,Se=0,$t=new Map,Zt=[],de=0,jt="none",Nt=[],Z=null,te="none",qt=-1/0,Vt=0,he=new Map,ue=null,ut=new Map,kt=new Map,mt=new Map,ee=0,ke=0,yt=null,ie=!1,bt=null,Ot=!1,Gt="none",pe=[],Et=new Map,vt=new Map,c=[];function m(d){let h=String(d).indexOf("?");return h<0?String(d):String(d).slice(0,h)}function f(d,h){try{let y=d&&d.contentId,p=!!o.isLive(),g=y?m(y):null;St=y||null;let w=h&&h.live_thumbnails_url;dt=p&&typeof w=="string"&&w.indexOf("https://")===0?w.replace(/\/+$/,""):null,Ot=p&&!!(h&&h.separated_breaks===!0);let T=!p&&!!(h&&h.recording)&&g!==null;if(g!==null&&g===Bt&&p===zt){T&&/^error/.test(ht)&&(Rt={url:St,name:Bt,mine:D});return}D++,Bt=g,zt=p,yt=null,ie=o.show(!1),Mt=[],ht=T?"waiting":"none",Zt=[],de=0,jt="none",Nt=[],Z=null,te="none",qt=-1/0,Vt=0,ue=null,ut=new Map,kt=new Map,mt=new Map,Gt=Ot?"waiting":"none",pe=[],Et=new Map,vt=new Map,c=[],Rt=T?{url:St,name:Bt,mine:D}:null,Se=0}catch{ht="error"}}function l(d,h,y){let p=new Array(d.length),g=0,w=async()=>{for(;g<d.length;){let x=g++;p[x]=await y(d[x],x)}},T=[];for(let x=0;x<Math.min(h,d.length);x++)T.push(w());return Promise.all(T).then(()=>p)}async function a(d){let h=new AbortController,y=setTimeout(()=>h.abort(),ce);try{let p=await fetch(d,{credentials:"omit",signal:h.signal});if(!p.ok)throw new Error("http "+p.status);return await p.text()}finally{clearTimeout(y)}}function _(d,h,y){return new Promise(p=>{let g=new Image,w=setTimeout(()=>{g.onload=null,g.onerror=null,p(null)},ce);g.crossOrigin="anonymous",g.onload=()=>{clearTimeout(w);try{bt===null&&(bt=document.createElement("canvas")),(bt.width!==h||bt.height!==y)&&(bt.width=h,bt.height=y);let T=bt.getContext("2d",{willReadFrequently:!0});T.drawImage(g,0,0,h,y),p(T.getImageData(0,0,h,y).data)}catch{p(null)}},g.onerror=()=>{clearTimeout(w),p(null)},g.src=d})}function k(d,h,y){let p=new Uint8Array(it*ct),g=0;for(let w=0;w<ct;w++){let T=(w*h+y)*4;for(let x=0;x<it;x++)p[g++]=d[T]*77+d[T+1]*150+d[T+2]*29>>8,T+=4}return p}function P(d){let h=/^PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?$/.exec(d||"");return h?Number(h[1]||0)*3600+Number(h[2]||0)*60+Number(h[3]||0):NaN}function E(d,h){let y=[];for(let p=d.firstElementChild;p;p=p.nextElementSibling)p.localName===h&&y.push(p);return y}function $(d,h){let y=E(d,"BaseURL")[0];return y&&y.textContent?new URL(y.textContent.trim(),h).href:h}function I(d,h,y,p){let g=p||E(d,"Representation")[0];if(!g)return[];let w=E(d,"SegmentTemplate")[0]||E(g,"SegmentTemplate")[0],T=w&&w.getAttribute("media");if(!T)return[];let x=Number(w.getAttribute("timescale")||1),S=Number(w.getAttribute("presentationTimeOffset")||0),L=(tt,Tt,xt)=>tt.replace(new RegExp("\\$"+Tt+"(?:%0(\\d+)d)?\\$","g"),(ne,Ht)=>Ht?String(xt).padStart(Number(Ht),"0"):String(xt)),O=(tt,Tt)=>new URL(L(L(T.split("$RepresentationID$").join(g.getAttribute("id")),"Time",tt),"Number",Tt),h).href,U=[],J=E(w,"SegmentTimeline")[0];if(J){let tt=0,Tt=Number(w.getAttribute("startNumber")||1),xt=E(J,"S");for(let ne=0;ne<xt.length;ne++){let Ht=xt[ne];Ht.getAttribute("t")!==null&&(tt=Number(Ht.getAttribute("t")));let Te=Number(Ht.getAttribute("d")),Ce=Number(Ht.getAttribute("r")||0);if(!(Te>0))return[];if(Ce<0){let fe=ne+1<xt.length?xt[ne+1].getAttribute("t"):null,Pi=fe!==null?Number(fe):y*x+S;Ce=Math.ceil((Pi-tt)/Te)-1}if(!(Ce>=0))return[];for(let fe=0;fe<=Ce;fe++)if(U.push({time:(tt-S)/x,duration:Te/x,url:O(tt,Tt)}),tt+=Te,Tt++,U.length>De)return[]}return U}let K=Number(w.getAttribute("duration"))/x,Y=Number(w.getAttribute("startNumber")||1);if(!(K>0))return[];let nt=0;w.getAttribute("eptDelta")!==null?nt=Number(w.getAttribute("eptDelta"))/x:nt=(Y-1)*K-S/x,nt<0&&-nt<K||(nt=0);let at=w.getAttribute("endNumber")!==null?Number(w.getAttribute("endNumber")):Y+Math.ceil((y-nt)/K)-1;if(!(at>=Y)||at-Y+1>De)return[];for(let tt=Y;tt<=at;tt++)U.push({time:(tt-Y)*K+nt,duration:K,url:O("",tt)});return U}async function C(d,h){if(d.length===0)return null;let y=/<p\b[^>]*>([\s\S]*?)<\/p>/g,p=0,g=await l(d,4,async w=>{if(h!==D)return!0;try{let T=await a(w.url).catch(()=>a(w.url)),x;for(y.lastIndex=0;(x=y.exec(T))!==null;)if(x[1].replace(/<[^>]+>/g,"").trim()!=="")return!0;return!1}catch{return p++,!0}});if(h!==D)throw new Error("superseded");if(p*20>g.length)throw new Error("captions unread");return B.captionBreaks(g,d[0].time,d[0].duration)}async function N(d,h,y,p){if(d.length===0||d.length>ai||y!==1||!(h>0))return null;let g=h,w=B.track(d.length*g,it,ct),T=async O=>(await l(O,1,async J=>{if(p!==D)return!1;let K=await _(d[J].url,h*it,ct);if(K===null&&p===D&&(K=await _(d[J].url,h*it,ct)),K===null)return!1;for(let Y=0;Y<g;Y++)w.add(J*g+Y,k(K,h*it,Y*it));return!0})).every(J=>J),x=d.map((O,U)=>U);if(!await T(x.filter(O=>O%2===0)))throw new Error("thumbnails unread");let S=w.gone();if(S===null)return null;let L=O=>{if(O<0||O>=d.length)return!1;for(let U=O*g;U<(O+1)*g;U++)if(S[U])return!0;return!1};if(!await T(x.filter(O=>O%2===1&&(L(O-1)||L(O+1)))))throw new Error("thumbnails unread");return w.breaks(d[0].time,d[0].duration/g)}async function F(d,h,y){if($t.has(h)){Mt=$t.get(h),ht="known";return}ht="searching";try{let p=new DOMParser().parseFromString(await a(d),"application/xml").documentElement,g=p?E(p,"Period"):[],w=p?P(p.getAttribute("mediaPresentationDuration")):NaN;if(p&&(p.getAttribute("type")==="dynamic"||!(w>0)))throw new Error("not whole yet");if(!p||g.length!==1){y===D&&(ht="not a recording");return}let T=$(g[0],$(p,d)),x=null,S=null;for(let O of E(g[0],"AdaptationSet")){let U=E(O,"Representation")[0],J=O.getAttribute("mimeType")||U&&U.getAttribute("mimeType")||"",K=O.getAttribute("contentType")||J.split("/")[0];if(K==="text"&&x===null)x=await C(I(O,T,w),y);else if(K==="image"&&S===null){let Y=E(O,"EssentialProperty").concat(U?E(U,"EssentialProperty"):[]).filter(at=>/thumbnail_tile$/.test(at.getAttribute("schemeIdUri")||""))[0],nt=/^(\d+)x(\d+)$/.exec(Y&&Y.getAttribute("value")||"");nt&&(S=await N(I(O,T,w),Number(nt[1]),Number(nt[2]),y))}if(y!==D)return}let L=B.combine(x,S).filter(O=>O[0]>0&&O[1]<w);if($t.set(h,L),$t.size>20&&$t.delete($t.keys().next().value),y!==D)return;Mt=L,ht="found "+L.length+" (captions "+(x===null?"none":x.length)+", logo "+(S===null?"none":S.length)+")"}catch(p){y===D&&(ht="error: "+String(p&&p.message).slice(0,40),setTimeout(()=>{y===D&&/^error/.test(ht)&&(Rt={url:d,name:h,mine:y})},At*2**Math.min(Se++,12)))}}async function Lt(d){try{let h=new DOMParser().parseFromString(await a(St),"application/xml").documentElement;if(!h||d!==D)return;let y=Date.parse(h.getAttribute("availabilityStartTime")||"")/1e3;if(!isFinite(y)){jt="no start time";return}let p=E(h,"Period"),g=p.map(x=>P(x.getAttribute("start"))),w=null,T=p.map((x,S)=>{let L=isFinite(g[S])?y+g[S]:w!==null?w:y,O=P(x.getAttribute("duration")),U=isFinite(O)?L+O:S+1<g.length&&isFinite(g[S+1])?y+g[S+1]:null,J=E(x,"EventStream").filter(Y=>(Y.getAttribute("schemeIdUri")||"").indexOf("urn:scte:scte35")===0),K=[];for(let Y of J){let nt=Number(Y.getAttribute("timescale")||1),at=Number(Y.getAttribute("presentationTimeOffset")||0);for(let tt of E(Y,"Event")){let Tt=B.opens(new XMLSerializer().serializeToString(tt));if(Tt===null)continue;let xt=Number(tt.getAttribute("duration")||0)/nt;K.push({at:L+(Number(tt.getAttribute("presentationTime")||0)-at)/nt,duration:xt>0?xt:null,opens:Tt})}}return w=U,{start:L,end:U,marks:K,signalled:J.length>0}});Zt=B.markedBreaks(T),jt="periods "+p.length+", breaks "+Zt.length,Ot&&(pe=Ee(h,y))}catch(h){d===D&&(jt="error: "+String(h&&h.message).slice(0,40))}}function Ee(d,h){let y=[],p=Date.now()/1e3,g=$(d,St);for(let w of E(d,"Period")){let T=h+(P(w.getAttribute("start"))||0),x=null,S=null;for(let U of E(w,"AdaptationSet"))if(!(U.getAttribute("contentType")!=="video"&&!/^video\//.test(U.getAttribute("mimeType")||"")))for(let J of E(U,"Representation")){let K=Number(J.getAttribute("bandwidth"));K>0&&(S===null||K<Number(S.getAttribute("bandwidth")))&&(x=U,S=J)}if(S===null)continue;let L=E(x,"SegmentTemplate")[0]||E(S,"SegmentTemplate")[0];if(!L||!E(L,"SegmentTimeline")[0])continue;let O=$(S,$(x,$(w,g)));for(let U of I(x,O,p-T,S))y.push({time:T+U.time,duration:U.duration,url:U.url})}return y}async function se(d,h){let y=new AbortController,p=setTimeout(()=>y.abort(),ce);try{let g=await fetch(d,{credentials:"omit",headers:{Range:"bytes=0-"+(h-1)},signal:y.signal});if(!g.ok)return null;let w=new Uint8Array(await g.arrayBuffer());return w.length>h?w.subarray(0,h):w}catch{return null}finally{clearTimeout(p)}}async function Pe(d){let h=await se(d.url,si);if(h===null)return null;let y=B.moofEnd(h);if(y===null||(y>h.length&&(h=await se(d.url,y)),h===null))return null;let p=B.frameSizes(h);return p===null||p.length===0?null:B.separatorEnds(p,d.time,d.duration/p.length)}async function Fe(d,h,y){let p=d-le,g=Math.min(h-ni,d+le),w=pe.filter(S=>S.time+S.duration>p&&S.time<g&&(!Et.has(S.time)||vt.has(S.time)&&vt.get(S.time)<lt)),T=await l(w,6,Pe);if(y!==D)return;w.forEach((S,L)=>{T[L]===null?vt.set(S.time,(vt.get(S.time)||0)+1):vt.delete(S.time),Et.set(S.time,T[L]||[])});for(let S of Array.from(Et.keys()))S<d-2*le&&Et.delete(S);for(let S of Array.from(vt.keys()))S<d-2*le&&vt.delete(S);let x=[];for(let S of Et.values())for(let L of S)x.push(L);c=B.separatedBreaks(x),Gt="segments "+Et.size+", breaks "+c.length}async function _e(d,h,y){let p=[];for(let x=d;x<=h;x+=4)(!ut.has(x)||mt.has(x)&&mt.get(x)<lt)&&p.push(x);if(p.length===0)return;let g=Z,w=dt,T=await l(p,4,async x=>{if(y!==D)return null;let S=await _(w+"/"+x,it,ct);if(S===null)return null;let L=k(S,it,0);return[B.score(g,L),g.lower?B.score(g.lower,L):null]});y!==D||g!==Z||p.forEach((x,S)=>{T[S]===null?mt.set(x,(mt.get(x)||0)+1):mt.delete(x),ut.set(x,T[S]===null?g.usual:T[S][0]),g.lower&&kt.set(x,T[S]===null?g.lower.usual:T[S][1])})}async function A(d,h){let y=dt;return(await l(d,4,async p=>{if(h!==D)return null;let g=await _(y+"/"+p,it,ct);return g===null?null:k(g,it,0)})).filter(p=>p!==null)}function V(d){if(d.length===0)return null;let h=B.track(d.length,it,ct);return d.forEach((y,p)=>h.add(p,y)),h.logo()}async function z(d,h,y){let p=[];for(let x=d-1200;x<=Math.min(h,d+1200);x+=28)p.push(x);let g=await A(p,y);if(y!==D)return;if(g.length===0){X(d);return}let w=V(g);w!==null&&w.channel&&he.set(dt,B.alone(w));let T=null;if(w===null){let x=he.get(dt);if(x&&B.seenIn(x,g,.4))T=x;else if(ue!==dt){let S=await G(d,y);if(y!==D)return;S!==null&&(he.set(dt,S),B.seenIn(S,g,.4)&&(T=S))}}qt=d,Z=T||w,ut=new Map,kt=new Map,mt=new Map,te=Z===null?"none in "+g.length+" pictures":"strength "+Math.round(Z.strength)+(Z.lower?", lower one "+Math.round(Z.lower.strength):"")+(T!==null?", kept":""),Z===null?X(d):Vt=0}function X(d){qt=d-900+Math.min(900,120*2**Vt),120*2**Vt<900&&Vt++}async function G(d,h){let y=null;for(let p=0;p<3;p++){let g=d-1200-p*2*1200,w=[];for(let S=g-2*1200;S<g;S+=28)w.push(S);let T=await A(w,h);if(h!==D)return null;if(T.length===0){if(p===0)return null;break}let x=V(T);if(x!==null&&x.channel){y=B.alone(x);break}}return ue=dt,y}function Q(d){let h=d;for(;ut.has(h-4);)h-=4;let y=[],p=[];for(let w=h;ut.has(w);w+=4)y.push(ut.get(w)),Z.lower&&p.push(kt.has(w)?kt.get(w):Z.lower.usual);let g=y.map(()=>!0);return{first:h,gone:B.gone(y,Z.usual,g),lowerGone:Z.lower?B.gone(p,Z.lower.usual,g):null}}async function H(d,h,y){let p=Math.floor(d/4)*4,g=Math.floor((h-12)/4)*4;if(p>g)return;let w=Math.abs(p-qt),T=Nt.some(S=>S[0]<=p&&p<=S[1])&&w<=900+B.LOGO_MAX_S;if(w>900&&!T&&await z(p,g,y),Z===null||y!==D)return;await _e(p-64,Math.min(g,p+88),y);for(let S=0;S<4;S++){if(y!==D||!ut.has(p))return;let L=Q(p),O=L.gone.length,U=L.first+O*4,J=B.runs(B.solid(L.gone),B.BRIDGE).concat(L.lowerGone?B.runs(B.solid(L.lowerGone),B.BRIDGE):[]),K=J.some(at=>at[1]+B.AROUND>=O&&(O-at[0])*4<=_t),Y=(p-L.first)/4,nt=J.some(at=>at[0]<B.AROUND&&at[1]>=Y&&(at[1]+1)*4<=_t);if(K&&U<=g)await _e(U,Math.min(g,U+120),y);else if(nt&&L.first>p-_t)await _e(L.first-120,L.first-4,y);else break}if(y!==D||Z===null||!ut.has(p))return;let x=Q(p);Nt=B.logoBreaks(x.gone,x.first,4,x.lowerGone);for(let S of Array.from(ut.keys()))S<p-ft&&ut.delete(S);for(let S of Array.from(kt.keys()))S<p-ft&&kt.delete(S);for(let S of Array.from(mt.keys()))S<p-ft&&mt.delete(S)}function j(){let d=o.liveRange(),h=o.currentTime();if(!d||typeof h!="number"||!isFinite(h)||!isFinite(d.end))return null;let y=o.absoluteTime(h),p=o.absoluteTime(d.end),g=Date.now()/1e3;return typeof y!="number"||typeof p!="number"||!(y>g-86400&&y<g+600)||!(p>=y)?null:{at:y,end:p}}async function W(d){if(ee!==d){ee=d;try{let h=j();if(h===null||h.end-h.at<=60)return;Date.now()-de>=ri&&St&&(de=Date.now(),await Lt(d)),Ot&&d===D&&await Fe(h.at,h.end,d),dt!==null&&d===D&&await H(h.at,h.end,d)}catch(h){te="error: "+String(h&&h.message).slice(0,40)}finally{ee===d&&(ee=0)}}}function Pt(){let d=null;try{let h=o.state();if(Bt!==null&&(h==="playing"||h==="paused")){let y=o.currentTime();if(Rt!==null&&h==="playing"){let g=Rt;Rt=null,g.mine===D&&F(g.url,g.name,g.mine)}let p=g=>[g[0],g[1]-32];if(zt){if(!o.joining()){let g=j();if(g!==null){let w=x=>g.at>=x[0]&&g.at<x[1]-1&&x[1]<=g.end-2,T=Zt.filter(w)[0]||c.filter(w)[0]||Nt.map(p).filter(w)[0];if(T){let x=o.mediaTime(T[1]);typeof x=="number"&&isFinite(x)&&x>y&&(d=x)}}Date.now()-ke>=oi&&(ke=Date.now(),W(D))}}else{let g=Mt.map(p).filter(w=>y>=w[0]&&y<w[1]-1)[0];g&&(d=g[1])}}}catch{d=null}yt=d,ie=o.show(yt!==null)}function Ut(){if(yt===null||!ie)return!1;let d=yt;return yt=null,ie=o.show(!1),o.seek(d),!0}function Be(){let d={live:zt,offered:yt!==null,skip_to:yt};if(zt){d.marked=jt,d.logo=dt===null?"no pictures":te,d.found=Nt.length,Ot&&(d.separators=Gt);try{let h=j();d.clock=h===null?"none":Math.round(Date.now()/1e3-h.end)+" s behind at the live point"}catch{d.clock="error"}}else d.recording=ht,d.breaks=Mt.map(h=>[Math.round(h[0]),Math.round(h[1])]);return d}return{load:f,tick:Pt,skip:Ut,report:Be}}var Ei="0.1.22";function Di(){let o=navigator.userAgent||"",t=/Android|iPhone|iPad|iPod|Mobile/i.test(o),e=/wv|WebView/i.test(o)||window.navigator.standalone===!0;return t||e}var Fi={fr:"Francais",fra:"Francais",fre:"Francais",en:"English",eng:"English",de:"Deutsch",deu:"Deutsch",ger:"Deutsch",es:"Espanol",spa:"Espanol",it:"Italiano",ita:"Italiano",pt:"Portugues",por:"Portugues",qaa:"Original",und:"Indefini",mul:"Multiple"};function ki(o){if(!o)return"Inconnu";let t=o.toLowerCase();return Fi[t]||o.toUpperCase()}function Ue(o){let t=o.split(":");if(t.length<2)return null;let e=t.slice(1).join(":");try{let i=e,s=e.length%4;s&&(i+="=".repeat(4-s));let n=atob(i.replace(/-/g,"+").replace(/_/g,"/"));return JSON.parse(n)}catch{return null}}var ii=class extends Jt{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},panel:{type:Object},_channels:{type:Array},_loading:{type:Boolean},_error:{type:String},_playing:{type:Boolean},_selectedChannel:{type:Object},_streamData:{type:Object},_isFullscreen:{type:Boolean},_playerError:{type:String},_playerLoading:{type:Boolean},_currentTime:{type:Number},_duration:{type:Number},_volume:{type:Number},_muted:{type:Boolean},_paused:{type:Boolean},_audioTracks:{type:Array},_textTracks:{type:Array},_selectedAudioIndex:{type:Number},_selectedTextIndex:{type:Number},_isLive:{type:Boolean},_programStart:{type:Number},_programEnd:{type:Number},_showAudioMenu:{type:Boolean},_showTextMenu:{type:Boolean},_expandedChannels:{type:Object},_channelPrograms:{type:Object},_loadingPrograms:{type:Object},_searchQuery:{type:String},_searchResults:{type:Array},_searching:{type:Boolean},_showingSearch:{type:Boolean},_expandedResults:{type:Object},_resultEpisodes:{type:Object},_loadingEpisodes:{type:Object},_castTargets:{type:Array},_selectedTarget:{type:String},_activeTab:{type:String},_recordings:{type:Array},_loadingRecordings:{type:Boolean},_expandedRecordings:{type:Object},_recordingEpisodes:{type:Object},_loadingRecordingEpisodes:{type:Object},_castPlaying:{type:Boolean},_castTarget:{type:String},_castTitle:{type:String},_activeCasts:{type:Object},_focusedCastHost:{type:String},_localPlaybackInitiated:{type:Boolean},_localMinimized:{type:Boolean},_castMinimized:{type:Boolean},_castLoading:{type:Boolean},_tonightChannels:{type:Array},_loadingTonight:{type:Boolean},_episodePlaylist:{type:Array},_episodeIndex:{type:Number},_selectedEntityId:{type:String}}}static get styles(){return xi`
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
    `}constructor(){super(),this._boundOnFullscreenChange=this._onFullscreenChange.bind(this),this._boundOnDocumentClick=this._onDocumentClick.bind(this),this._channels=[],this._loading=!0,this._error=null,this._playing=!1,this._selectedChannel=null,this._streamData=null,this._isFullscreen=!1,this._playerError=null,this._playerLoading=!1,this._player=null,this._entityUnsubscribe=null,this._showPlayOverlay=!1,this._adSkip=null,this._adOffer=!1,this._castSkipTo=null,this._currentTime=0,this._duration=0,this._volume=.5,this._muted=!1,this._paused=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._liveDelay=0,this._showAudioMenu=!1,this._showTextMenu=!1,this._updateInterval=null,this._expandedChannels={},this._channelPrograms={},this._loadingPrograms={},this._searchQuery="",this._searchResults=[],this._searching=!1,this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._searchToken=0,this._castTargets=[],this._isMobile=Di(),this._selectedTarget=this._isMobile?"":"local",this._activeTab="live",this._recordings=[],this._loadingRecordings=!1,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castProgressInterval=null,this._castBasePosition=0,this._castPositionUpdatedAt=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._castMinimized=!1,this._castLoading=!1,this._tonightChannels=[],this._loadingTonight=!1,this._episodePlaylist=[],this._episodeIndex=-1,this._episodeParentTitle="",this._episodeIsRecording=!1,this._sessionId=this._generateSessionId(),this._selectedEntityId=localStorage.getItem("molotov_selected_entity")||""}_generateSessionId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"molotov-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10)}connectedCallback(){super.connectedCallback(),console.log(`[Molotov Panel] Connected - v${Ei}`),this._hasLoadedChannels=!1,document.addEventListener("fullscreenchange",this._boundOnFullscreenChange),document.addEventListener("click",this._boundOnDocumentClick)}disconnectedCallback(){if(super.disconnectedCallback(),this._playing){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"})}this._cleanupPlayer(),this._stopCastProgressUpdate(),document.removeEventListener("fullscreenchange",this._boundOnFullscreenChange),document.removeEventListener("click",this._boundOnDocumentClick),this._entityUnsubscribe&&(this._entityUnsubscribe(),this._entityUnsubscribe=null)}_onDocumentClick(t){t.composedPath().some(e=>e.classList?.contains("track-menu-container"))||(this._showAudioMenu=!1,this._showTextMenu=!1,this.requestUpdate())}updated(t){t.has("hass")&&this.hass&&(this._hasLoadedChannels||(this._hasLoadedChannels=!0,this._loadChannels()),this._syncWithEntity())}async _loadChannels(){this._loading=!0,this._error=null;try{let t=this._getEntityId();if(!t)throw new Error("Entite Molotov TV introuvable");console.log(`[Molotov Panel] Loading channels for ${t}`);let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"now_playing",media_content_type:"directory"});e&&e.children?(this._channels=e.children.map(i=>this._parseChannel(i)),console.log(`[Molotov Panel] Loaded ${this._channels.length} channels`),this._channels.length>0&&await this._fetchCastTargets(t,this._channels[0].mediaContentId)):this._channels=[],this._loading=!1}catch(t){console.error("[Molotov Panel] Failed to load channels:",t),this._error=t.message||"Erreur lors du chargement des chaines",this._loading=!1}}async _fetchCastTargets(t,e){try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:e,media_content_type:"program"});if(i&&i.children){let s=i.children.filter(n=>n.media_content_id.startsWith("cast:")).map(n=>({mediaContentId:n.media_content_id,title:n.title}));this._castTargets=s,this._isMobile&&s.length>0&&(!this._selectedTarget||this._selectedTarget==="local")&&(this._selectedTarget=s[0].mediaContentId),console.log(`[Molotov Panel] Found ${s.length} cast targets`)}}catch(i){console.error("[Molotov Panel] Failed to fetch cast targets:",i),this._castTargets=[]}}_handleTargetChange(t){let e=t.target.value;this._isMobile&&e==="local"||(this._selectedTarget=e,console.log(`[Molotov Panel] Selected target: ${this._selectedTarget}`))}_switchTab(t){this._activeTab=t,t==="recordings"&&this._recordings.length===0&&this._loadRecordings(),t==="tonight"&&this._tonightChannels.length===0&&this._loadTonight(),this.requestUpdate()}async _loadRecordings(){let t=this._getEntityId();if(!t)return;this._loadingRecordings=!0,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this.requestUpdate();try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"recordings",media_content_type:"directory"});i&&i.children?(this._recordings=i.children.map(s=>{let n=Ue(s.media_content_id);return{mediaContentId:s.media_content_id,title:s.title,thumbnail:s.thumbnail,description:n?.desc||null,isFolder:!!n?.folder}}),console.log(`[Molotov Panel] Loaded ${this._recordings.length} recordings`)):this._recordings=[]}catch(i){console.error("[Molotov Panel] Failed to load recordings:",i),this._recordings=[]}this._loadingRecordings=!1,this.requestUpdate();let e=this._recordings.filter(i=>i.isFolder);e.length>0&&(await Promise.all(e.map(i=>this._fetchRecordingEpisodes(i))),this.requestUpdate())}async _loadTonight(){let t=this._getEntityId();if(t){this._loadingTonight=!0,this.requestUpdate();try{let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"tonight_epg",media_content_type:"directory"});if(e&&e.children&&e.children.length>0){let i=new Map;for(let n of e.children){if(!n.media_content_id.startsWith("tonight_program:"))continue;let r=n.media_content_id.split(":");if(r.length<6)continue;let u=r[1],v=decodeURIComponent(r[2]),M=decodeURIComponent(r[3]),q=parseInt(r[4])*1e3,R=parseInt(r[5])*1e3,st=r.length>6?decodeURIComponent(r.slice(6).join(":")):"",et=n.title;et.startsWith("\u{1F534} ")&&(et=et.substring(3));let rt=et.match(/^\d{2}:\d{2}-\d{2}:\d{2}\s+(.+)$/);rt&&(et=rt[1]);let ot={mediaContentId:n.media_content_id,title:et,thumbnail:n.thumbnail,start:q,end:R,description:st};i.has(u)||i.set(u,{id:u,name:v,thumbnail:M,programs:[]}),i.get(u).programs.push(ot)}let s=Array.from(i.values());for(let n of s)n.programs.sort((r,u)=>r.start-u.start);this._tonightChannels=s,console.log(`[Molotov Panel] Loaded tonight EPG for ${s.length} channels`)}else this._tonightChannels=[]}catch(e){console.error("[Molotov Panel] Failed to load tonight EPG:",e),this._tonightChannels=[]}this._loadingTonight=!1,this.requestUpdate()}}async _toggleRecordingExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedRecordings[i]){this._expandedRecordings={...this._expandedRecordings,[i]:!1},this.requestUpdate();return}if(!e.isFolder){await this._playRecordingDirectly(e);return}this._recordingEpisodes[i]||await this._fetchRecordingEpisodes(e);let s=this._recordingEpisodes[i]||[];if(s.length===0){console.log("[Molotov Panel] No episodes found, playing recording directly"),await this._playRecordingDirectly(e);return}if(s.length===1){console.log("[Molotov Panel] Only 1 episode found, playing it directly"),await this._playRecordingEpisode(s[0],e.title);return}this._expandedRecordings={...this._expandedRecordings,[i]:!0},this.requestUpdate()}async _playRecordingDirectly(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:"",currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=t.mediaContentId;i.startsWith("recording:")&&(i=i.substring(10));let s=this._buildPlayMediaId(`replay:${i}`);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:s,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play recording failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}async _fetchRecordingEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"recording"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._recordingEpisodes={...this._recordingEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for recording "${t.title}"`)}else this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch recording episodes:",s),this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!1},this.requestUpdate()}async _playRecordingEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._recordingEpisodes,!0),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play recording episode failed:",s),this._playerError=s.message||"Erreur de lecture",this._castLoading=!1}}}_buildPlayMediaId(t){if(this._selectedTarget==="local")return`play_local:${this._sessionId}:${t}`;let e=this._selectedTarget.split(":");if(e.length>=2){let i=e[1],s=e.length>=3&&e[2]!=="native"&&e[2]!=="custom"?"":e[2];return s?`cast:${i}:${s}:${t}`:`cast:${i}:${t}`}return`play_local:${t}`}_isLocalPlayback(){return this._selectedTarget==="local"}_parseEpisodeChildren(t){return t.filter(e=>e.media_content_id.startsWith("episode:")||e.media_content_id.startsWith("replay:")||e.media_content_id.startsWith("recording:")||e.can_play).map(e=>{let i=Ue(e.media_content_id);return{mediaContentId:e.media_content_id,title:e.title,thumbnail:e.thumbnail,description:i?.desc||null}})}_initPlaybackFlags(){this._isLocalPlayback()?(this._localPlaybackInitiated=!0,this._localMinimized=!1):this._castLoading=!0}_parseChannel(t){let e=t.media_content_id,[i,s]=e.split("|"),n=null;if(s)try{let et=s,rt=s.length%4;rt&&(et+="=".repeat(4-rt)),n=decodeURIComponent(escape(atob(et.replace(/-/g,"+").replace(/_/g,"/"))))}catch{}let r=i.split(":"),u,v,M;r[0]==="program"?(u=r[1],v=r[2]?parseInt(r[2])*1e3:null,M=r[3]?parseInt(r[3])*1e3:null):r[0]==="live"&&(u=r[1]);let q=t.title.split(" - "),R=q[0],st=q.slice(1).join(" - ")||"Direct";return{id:u,name:R,thumbnail:t.thumbnail,mediaContentId:i,currentProgram:{title:st,description:n,start:v,end:M},nextProgram:null}}_getMolotovEntities(){return!this.hass||!this.hass.states?[]:Object.keys(this.hass.states).filter(t=>t.startsWith("media_player.molotov")).sort()}_getEntityId(){let t=this._getMolotovEntities();return t.length===0?null:t.length===1?t[0]:this._selectedEntityId&&t.includes(this._selectedEntityId)?this._selectedEntityId:t[0]}_handleEntityChange(t){let e=this._getEntityId();this._playing&&e&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState(),this._selectedEntityId=t.target.value,localStorage.setItem("molotov_selected_entity",this._selectedEntityId),this._hasLoadedChannels=!1,this._channels=[],this._recordings=[],this._tonightChannels=[],this._channelPrograms={},this._expandedChannels={},this._loadingPrograms={},this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._loadChannels()}async _toggleChannelExpand(t,e){t.stopPropagation();let i=e.id;if(this._expandedChannels[i]){this._expandedChannels={...this._expandedChannels,[i]:!1},this.requestUpdate();return}this._expandedChannels={...this._expandedChannels,[i]:!0},this._channelPrograms[i]||await this._fetchChannelPrograms(e),this.requestUpdate()}async _fetchChannelPrograms(t){let e=this._getEntityId();if(!e)return;let i=t.id;this._loadingPrograms={...this._loadingPrograms,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`channel:${i}`,media_content_type:"channel"});if(s&&s.children){let n=s.children.filter(r=>r.media_content_id.startsWith("replay:")).map(r=>this._parseReplayItem(r,t));this._channelPrograms={...this._channelPrograms,[i]:n}}}catch(s){console.error("[Molotov Panel] Failed to fetch channel replays:",s),this._channelPrograms={...this._channelPrograms,[i]:[]}}this._loadingPrograms={...this._loadingPrograms,[i]:!1},this.requestUpdate()}_parseReplayItem(t,e){let i=Ue(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,channelName:e.name,description:i?.desc||null}}async _playReplay(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:t.channelName,currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play replay failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}_handleSearchInput(t){this._searchQuery=t.target.value}_handleSearchKeydown(t){t.key==="Enter"&&this._performSearch()}async _performSearch(){let t=this._searchQuery.trim();if(!t)return;let e=this._getEntityId();if(!e)return;let i=++this._searchToken;this._searching=!0,this._showingSearch=!0,this._searchResults=[],this._expandedResults={},this._resultEpisodes={},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`search:${encodeURIComponent(t)}`,media_content_type:"search"});if(i!==this._searchToken)return;if(s&&s.children){let n=s.children.filter(u=>u.media_content_id.startsWith("search_result:")).map(u=>this._parseSearchResult(u)),r=await this._filterResultsWithEpisodes(n,e,i);if(i!==this._searchToken)return;this._searchResults=r,console.log(`[Molotov Panel] Found ${this._searchResults.length} results with episodes for "${t}"`)}else this._searchResults=[]}catch(s){if(i!==this._searchToken)return;console.error("[Molotov Panel] Search failed:",s),this._searchResults=[]}i===this._searchToken&&(this._searching=!1,this.requestUpdate())}async _filterResultsWithEpisodes(t,e,i){let s=t.map(async r=>{try{let u=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:r.mediaContentId,media_content_type:"search_result"});if(u&&u.children){let v=this._parseEpisodeChildren(u.children);if(v.length>0)return(i===void 0||i===this._searchToken)&&(this._resultEpisodes={...this._resultEpisodes,[r.mediaContentId]:v}),r}return null}catch(u){return console.error(`[Molotov Panel] Failed to check episodes for "${r.title}":`,u),null}});return(await Promise.all(s)).filter(r=>r!==null)}_parseSearchResult(t){let e=Ue(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,mediaClass:t.media_class,description:e?.desc||null}}_clearSearch(){this._searchToken++,this._searchQuery="",this._searchResults=[],this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this.requestUpdate()}async _toggleResultExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedResults[i]){this._expandedResults={...this._expandedResults,[i]:!1},this.requestUpdate();return}this._expandedResults={...this._expandedResults,[i]:!0},this._resultEpisodes[i]||await this._fetchResultEpisodes(e),this.requestUpdate()}async _fetchResultEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingEpisodes={...this._loadingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"search_result"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._resultEpisodes={...this._resultEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for "${t.title}"`)}else this._resultEpisodes={...this._resultEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch episodes:",s),this._resultEpisodes={...this._resultEpisodes,[i]:[]}}this._loadingEpisodes={...this._loadingEpisodes,[i]:!1},this.requestUpdate()}_setEpisodePlaylist(t,e,i,s){for(let n of Object.values(i)){let r=n.findIndex(u=>u.mediaContentId===t.mediaContentId);if(r!==-1){this._episodePlaylist=n,this._episodeIndex=r,this._episodeParentTitle=e,this._episodeIsRecording=s;return}}this._episodePlaylist=[],this._episodeIndex=-1}async _playEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._resultEpisodes,!1),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play episode failed:",s),this._playerError=s.message||"Erreur de lecture"}}}_syncWithEntity(){let t=this._getEntityId();if(!t||!this.hass?.states?.[t])return;let e=this.hass.states[t],s=(e.attributes.local_streams||{})[this._sessionId];if(s&&s.url&&this._localPlaybackInitiated){let n=s.url,r=s.drm,u=s.selected_track;if(!this._playing||this._currentStreamUrl!==n){this._currentStreamUrl=n,this._streamData={url:n,drm:r,selectedTrack:u,title:e.attributes.media_title||"En direct",breakSearch:{live_thumbnails_url:s.live_thumbnails_url,recording:s.recording,separated_breaks:s.separated_breaks}},this._playing=!0,this._localMinimized=!1,this._playerError=null,this._playerLoading=!0;let v=this._selectedChannel;v?.currentProgram?.start&&v?.currentProgram?.end?(this._isLive=!0,this._programStart=v.currentProgram.start,this._programEnd=v.currentProgram.end):(this._isLive=!0,this._programStart=null,this._programEnd=null),this.updateComplete.then(()=>this._initDashPlayer())}}else this._playing&&(this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1);if(e.attributes.active_casts&&Object.keys(e.attributes.active_casts).length>0){let n=e.attributes.active_casts,r=e.attributes.cast_target;this._activeCasts=n,this._focusedCastHost=r||null;let u=r?n[r]?.skip_to:null;this._castSkipTo=typeof u=="number"?u:null,(!this._castPlaying||this._castTarget!==r)&&(this._castPlaying=!0,this._castMinimized=this._isMobile,this._castLoading=!1,this._castTarget=r,this._castTitle=e.attributes.media_title||"En cours de lecture",this._startCastProgressUpdate(),console.log("[Molotov Panel] Cast playback detected:",r,"total casts:",Object.keys(n).length)),this._castPositionUpdatedAt=e.attributes.media_position_updated_at?new Date(e.attributes.media_position_updated_at).getTime()/1e3:null,this._castBasePosition=e.attributes.media_position||0,this._duration=e.attributes.media_duration||0,this._volume=e.attributes.volume_level??.5,this._muted=e.attributes.is_volume_muted||!1,this._paused=e.state==="paused",this._castTitle=e.attributes.media_title||this._castTitle,this._isLive=e.attributes.is_live||!1}else this._castPlaying&&(this._onPlaybackEnded()||(this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._castMinimized=!1,this._castLoading=!1,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate()))}async _playChannel(t){let e=this._getEntityId();if(!e){console.error("[Molotov Panel] No entity found");return}this._selectedChannel=t,this._playerError=null,this._episodePlaylist=[],this._episodeIndex=-1,this._initPlaybackFlags(),this._isLocalPlayback()&&t.currentProgram?.start&&t.currentProgram?.end&&(this._programStart=t.currentProgram.start,this._programEnd=t.currentProgram.end,this._isLive=!0);try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}async _initDashPlayer(){if(!this._streamData)return;let t=this.shadowRoot.querySelector("video");if(!t){console.error("[Molotov Panel] Video element not found");return}window.dashjs||await this._loadDashJs(),this._player&&(this._player.reset(),this._player=null),this._adSkip=null,this._adOffer=!1,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null);try{let e=window.dashjs.MediaPlayer().create();this._player=e,e.updateSettings({debug:{logLevel:window.dashjs.Debug.LOG_LEVEL_WARNING},streaming:{buffer:{stableBufferTime:6,bufferTimeAtTopQuality:30,bufferTimeAtTopQualityLongForm:60},delay:{liveDelay:3}}});let i=this._streamData.drm;i&&i.type==="widevine"&&(console.log("[Molotov Panel] Configuring Widevine DRM"),e.setProtectionData({"com.widevine.alpha":{serverURL:i.license_url,httpRequestHeaders:i.headers||{}}})),e.initialize(t,this._streamData.url,!0),this._adSkip=Si(this._adSkipEnv(t,e));let s=this._streamData.selectedTrack,n="fr";s?.track_audio&&(n=s.track_audio),e.setInitialMediaSettingsFor("audio",{lang:n}),s?.track_text&&e.setInitialMediaSettingsFor("text",{lang:s.track_text}),e.on(window.dashjs.MediaPlayer.events.ERROR,r=>{let u=r.error?.message||r.error||"Erreur de lecture";console.error("[Molotov Panel] Player error:",u),this._playerError=u,this._playerLoading=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.STREAM_INITIALIZED,()=>{console.log("[Molotov Panel] Stream initialized"),this._player===e&&this._adSkip&&this._adSkip.load({contentId:this._streamData.url},this._streamData.breakSearch),this._enforceAudioLanguage(e,s),this._updateTracks(),this._startProgressUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_STARTED,()=>{console.log("[Molotov Panel] Playback started"),this._showPlayOverlay=!1,this._playerLoading=!1,this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PAUSED,()=>{this._paused=!0,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PLAYING,()=>{this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_ENDED,()=>{console.log("[Molotov Panel] Playback ended"),this._onPlaybackEnded()}),t.volume=this._volume,t.muted=this._muted,this._autoplayCheckTimeout=setTimeout(()=>{this._autoplayCheckTimeout=null,t.paused&&!t.currentTime&&(console.log("[Molotov Panel] Autoplay blocked"),this._showPlayOverlay=!0,this.requestUpdate())},1500)}catch(e){console.error("[Molotov Panel] Failed to init player:",e),this._playerError=e.message}}_adSkipEnv(t,e){let i=()=>{try{let s=e.timeAsUTC();return typeof s=="number"&&isFinite(s)?s:null}catch{return null}};return{isLive:()=>{try{return e.isDynamic()}catch{return!1}},joining:()=>this._playerLoading,state:()=>t.paused?"paused":t.readyState>=2?"playing":"other",currentTime:()=>t.currentTime,liveRange:()=>t.seekable&&t.seekable.length?{start:t.seekable.start(0),end:t.seekable.end(t.seekable.length-1)}:null,absoluteTime:s=>{let n=i();return n===null?null:n+(s-t.currentTime)},mediaTime:s=>{let n=i();return n===null?null:t.currentTime+(s-n)},show:s=>(this._adOffer!==s&&(this._adOffer=s,this.requestUpdate()),s),seek:s=>{t.currentTime=s}}}_startProgressUpdate(){this._updateInterval&&clearInterval(this._updateInterval),this._updateInterval=setInterval(()=>{this._updateProgress()},1e3)}_updateProgress(){let t=this.shadowRoot?.querySelector("video");if(!(!t||!this._player)){if(this._currentTime=t.currentTime,this._duration=t.duration||0,this._paused=t.paused,this._adSkip&&this._adSkip.tick(),this._isLive&&t.seekable&&t.seekable.length>0){let e=t.seekable.end(t.seekable.length-1);this._liveDelay=Math.max(0,(e-t.currentTime)*1e3)}this.requestUpdate()}}_startCastProgressUpdate(){this._stopCastProgressUpdate(),this._castProgressInterval=setInterval(()=>{this._updateCastProgress()},1e3)}_stopCastProgressUpdate(){this._castProgressInterval&&(clearInterval(this._castProgressInterval),this._castProgressInterval=null)}_updateCastProgress(){if(!this._castPlaying){this._stopCastProgressUpdate();return}if(this._castBasePosition!=null&&this._castPositionUpdatedAt&&!this._paused){let t=Date.now()/1e3,e=Math.max(0,t-this._castPositionUpdatedAt);this._currentTime=this._castBasePosition+e}else this._currentTime=this._castBasePosition||0;this.requestUpdate()}_updateTracks(){if(!this._player)return;let t=this._player.getTracksFor("audio")||[];this._audioTracks=t.map((n,r)=>({index:r,lang:n.lang,label:ki(n.lang)}));let e=this._player.getCurrentTrackFor("audio");e&&(this._selectedAudioIndex=t.findIndex(n=>n.index===e.index));let i=this._player.getTracksFor("text")||[];if(this._textTracks=i.map((n,r)=>({index:r,lang:n.lang,label:ki(n.lang)})),!this._player.isTextEnabled())this._selectedTextIndex=-1;else{let n=this._player.getCurrentTrackFor("text");n&&(this._selectedTextIndex=i.findIndex(r=>r.index===n.index))}console.log("[Molotov Panel] Audio tracks:",this._audioTracks),console.log("[Molotov Panel] Text tracks:",this._textTracks),this.requestUpdate()}_enforceAudioLanguage(t,e){let i=t.getTracksFor("audio");if(!i||i.length===0)return;let n=t.getCurrentTrackFor("audio")?.lang||"",r="fr";if(e?.track_audio&&(r=e.track_audio),n!==r&&n!=="fra"&&n!=="fre"){let u=i.find(v=>v.lang===r||v.lang==="fra"||v.lang==="fre");!u&&(n==="en"||n==="eng"||n==="qaa")&&(u=i.find(v=>v.lang!=="en"&&v.lang!=="eng"&&v.lang!=="qaa")),u&&(console.log("[Molotov Panel] Switching audio to:",u.lang),t.setCurrentTrack(u))}}_loadDashJs(){return new Promise((t,e)=>{if(window.dashjs){t();return}let i=document.createElement("script");i.src="https://cdn.dashjs.org/v4.7.4/dash.all.min.js",i.crossOrigin="anonymous",i.onload=()=>{console.log("[Molotov Panel] dash.js loaded"),t()},i.onerror=()=>{e(new Error("Failed to load dash.js"))},document.head.appendChild(i)})}_cleanupPlayer(){if(this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null),this._player){try{this._player.reset()}catch{}this._player=null}this._adSkip=null,this._adOffer=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._playerLoading=!1}_stopPlayback(){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState()}_resetLocalPlaybackState(){this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._selectedChannel=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._episodePlaylist=[],this._episodeIndex=-1}_onPlaybackEnded(){if(this._episodePlaylist.length===0||this._episodeIndex<0)return!1;let t=this._episodeIndex+1;if(t>=this._episodePlaylist.length)return this._episodePlaylist=[],this._episodeIndex=-1,!1;let e=this._episodePlaylist[t];return this._episodeIndex=t,console.log(`[Molotov Panel] Auto-playing next episode: ${e.title}`),this._episodeIsRecording?this._playRecordingEpisode(e,this._episodeParentTitle):this._playEpisode(e,this._episodeParentTitle),!0}_goBackFromPlayer(){this._localMinimized=!0,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null)}_goBackFromCast(){this._castMinimized=!0}_expandCurrentPlayback(){this._playing&&this._streamData?(this._localMinimized=!1,this._updateInterval||this._startProgressUpdate()):this._castPlaying&&(this._castMinimized=!1)}_togglePlayPause(){let t=this.shadowRoot.querySelector("video");t&&(t.paused?t.play():t.pause())}_localSeek(t){let e=this.shadowRoot.querySelector("video");if(!e)return;if(t===null){e.currentTime=0;return}let i=e.currentTime+t;e.currentTime=Math.max(0,Math.min(e.duration||1/0,i))}_localSeekBeginning(){this._localSeek(null)}_localSkipBack30(){this._localSeek(-30)}_localSkipBack10(){this._localSeek(-10)}_localSkipForward30(){this._localSeek(30)}_localSkipAd(){this._adSkip&&this._adSkip.skip()}_handleProgressClick(t){let i=t.currentTarget.getBoundingClientRect(),s=(t.clientX-i.left)/i.width;if(this._isLive&&this._programStart&&this._programEnd){if(this._player?.getDVRSeekOffset?.(0)!==void 0){let r=this._player.duration(),u=s*r;this._player.seek(u)}}else if(this._duration){let n=this.shadowRoot.querySelector("video");n&&(n.currentTime=s*this._duration)}}_handleVolumeChange(t){let e=parseFloat(t.target.value);this._volume=e;let i=this.shadowRoot.querySelector("video");i&&(i.volume=e,i.muted=e===0,this._muted=e===0)}_toggleMute(){let t=this.shadowRoot.querySelector("video");t&&(this._muted=!this._muted,t.muted=this._muted,this.requestUpdate())}_selectAudioTrack(t){if(!this._player||t<0||t>=this._audioTracks.length)return;let e=this._player.getTracksFor("audio");e&&e[t]&&(this._player.setCurrentTrack(e[t]),this._selectedAudioIndex=t),this._showAudioMenu=!1,this.requestUpdate()}_selectTextTrack(t){if(this._player){if(t===-1)this._player.enableText(!1),this._selectedTextIndex=-1;else if(t>=0&&t<this._textTracks.length){let e=this._player.getTracksFor("text");e&&e[t]&&(this._player.enableText(!0),this._player.setCurrentTrack(e[t]),this._selectedTextIndex=t)}this._showTextMenu=!1,this.requestUpdate()}}_toggleAudioMenu(t){t.stopPropagation(),this._showAudioMenu=!this._showAudioMenu,this._showTextMenu=!1,this.requestUpdate()}_toggleTextMenu(t){t.stopPropagation(),this._showTextMenu=!this._showTextMenu,this._showAudioMenu=!1,this.requestUpdate()}_toggleFullscreen(){let t=this.shadowRoot.querySelector(".video-wrapper");t&&(document.fullscreenElement?document.exitFullscreen():t.requestFullscreen().catch(e=>{console.error("[Molotov Panel] Fullscreen error:",e)}))}_onFullscreenChange(){this._isFullscreen=!!document.fullscreenElement,this.requestUpdate()}_handlePlayOverlayClick(){let t=this.shadowRoot.querySelector("video");t&&(t.muted=!1,t.play().catch(e=>console.error("[Molotov Panel] Manual play error:",e)),this._showPlayOverlay=!1,this.requestUpdate())}_formatTime(t){if(!t||!isFinite(t))return"00:00";let e=Math.floor(t/3600),i=Math.floor(t%3600/60),s=Math.floor(t%60);return e>0?`${e}:${i.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`:`${i}:${s.toString().padStart(2,"0")}`}_formatClockTime(t){return t?new Date(t).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):""}_getProgressPercent(){if(this._isLive&&this._programStart&&this._programEnd){let t=Date.now()-(this._liveDelay||0),e=this._programEnd-this._programStart;if(e<=0)return 100;let i=t-this._programStart;return Math.min(100,Math.max(0,i/e*100))}else if(this._duration>0&&isFinite(this._duration))return this._currentTime/this._duration*100;return 0}render(){let t=this._playing&&this._streamData,e=t&&!this._localMinimized,i=this._castPlaying&&!this._castMinimized,s=!e&&!i;return b`
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
    `}_renderTonightProgram(t,e){let i=this._formatClockTime(t.start),s=this._formatClockTime(t.end),n=Date.now(),r=t.start<=n&&t.end>n,u=t.end<=n;return b`
      <div
        class="tonight-program ${r?"live":""} ${u?"past":""}"
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
    `}_activateOnKey(t,e){(t.key==="Enter"||t.key===" "||t.key==="Spacebar")&&(t.preventDefault(),e())}_tonightToProgramId(t){let e=t.split(":");return e[0]!=="tonight_program"||e.length<6?t:`program:${e[1]}:${e[4]}:${e[5]}`}async _playTonightProgram(t,e){let i=this._getEntityId();if(!i)return;this._episodePlaylist=[],this._episodeIndex=-1;let s=this._tonightToProgramId(t.mediaContentId);this._selectedChannel={id:e.id,name:e.name,thumbnail:e.thumbnail,mediaContentId:s,currentProgram:{title:t.title,start:t.start,end:t.end}},this._playerError=null;let n=Date.now();this._isLive=t.start<=n&&t.end>n,this._isLive?(this._programStart=t.start,this._programEnd=t.end):(this._programStart=null,this._programEnd=null),this._initPlaybackFlags();try{let r=this._buildPlayMediaId(s);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:r,media_content_type:"video"})}catch(r){console.error("[Molotov Panel] Play tonight program failed:",r),this._playerError=r.message||"Erreur de lecture",this._castLoading=!1}}_renderRecordingItem(t){let e=t.mediaContentId,i=this._expandedRecordings[e],s=this._recordingEpisodes[e]||[],n=this._loadingRecordingEpisodes[e],r=this._recordingEpisodes[e]!==void 0,u=!t.isFolder||r&&s.length<=1;return b`
      <div class="search-result-row">
        <div
          class="search-result-main"
          role="button"
          tabindex="0"
          @click=${v=>this._toggleRecordingExpand(v,t)}
          @keydown=${v=>this._activateOnKey(v,()=>this._toggleRecordingExpand(v,t))}
        >
          ${u?b`<ha-icon class="expand-icon" icon="mdi:play-circle-outline"></ha-icon>`:b`<ha-icon
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
                          @keydown=${M=>this._activateOnKey(M,()=>this._playRecordingEpisode(v,t.title))}
                        >
                          ${v.thumbnail?b`<img class="episode-thumb" src=${v.thumbnail} loading="lazy" @load=${M=>M.target.style.display=""} @error=${M=>M.target.style.display="none"} />`:""}
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
                          @keydown=${u=>this._activateOnKey(u,()=>this._playEpisode(r,t.title))}
                        >
                          ${r.thumbnail?b`<img class="episode-thumb" src=${r.thumbnail} loading="lazy" @load=${u=>u.target.style.display=""} @error=${u=>u.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${r.title}</div>
                            ${r.description?b`<div class="episode-desc">${r.description}</div>`:""}
                          </div>
                        </div>
                      `):b`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderChannelItem(t){let e=t.currentProgram,i=e?.start?this._formatClockTime(e.start):"",s=e?.end?this._formatClockTime(e.end):"",n=i&&s?`${i} - ${s}`:"",r=this._expandedChannels[t.id],u=this._channelPrograms[t.id]||[],v=this._loadingPrograms[t.id];return b`
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
                ${n?b`<span class="program-time">(${n})</span>`:""}
              </div>
              ${e?.description?b`<div class="program-next">${e.description}</div>`:""}
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
        ${r?b`
              <div class="replay-list">
                ${v?b`<div class="replay-loading">Chargement...</div>`:u.length>0?u.map(M=>b`
                        <div
                          class="replay-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playReplay(M)}
                          @keydown=${q=>this._activateOnKey(q,()=>this._playReplay(M))}
                        >
                          ${M.thumbnail?b`<img class="replay-thumb" src=${M.thumbnail} loading="lazy" @load=${q=>q.target.style.display=""} @error=${q=>q.target.style.display="none"} />`:""}
                          <div class="replay-item-info">
                            <span class="replay-item-title">${M.title}</span>
                            ${M.description?b`<span class="replay-item-desc">${M.description}</span>`:""}
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
