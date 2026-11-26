var qe=typeof window<"u"&&window.customElements!=null&&window.customElements.polyfillWrapFlushCallback!==void 0;var Kt=(a,t,e=null)=>{for(;t!==e;){let i=t.nextSibling;a.removeChild(t),t=i}};var mt=`{{lit-${String(Math.random()).slice(2)}}}`,Ve=`<!--${mt}-->`,di=new RegExp(`${mt}|${Ve}`),le="$lit$",Yt=class{constructor(t,e){this.parts=[],this.element=e;let i=[],s=[],n=document.createTreeWalker(e.content,133,null,!1),r=0,u=-1,x=0,{strings:M,values:{length:q}}=t;for(;x<q;){let R=n.nextNode();if(R===null){n.currentNode=s.pop();continue}if(u++,R.nodeType===1){if(R.hasAttributes()){let st=R.attributes,{length:et}=st,rt=0;for(let ot=0;ot<et;ot++)hi(st[ot].name,le)&&rt++;for(;rt-- >0;){let ot=M[x],At=Me.exec(ot)[2],_t=At.toLowerCase()+le,ft=R.getAttribute(_t);R.removeAttribute(_t);let lt=ft.split(di);this.parts.push({type:"attribute",index:u,name:At,strings:lt}),x+=lt.length-1}}R.tagName==="TEMPLATE"&&(s.push(R),n.currentNode=R.content)}else if(R.nodeType===3){let st=R.data;if(st.indexOf(mt)>=0){let et=R.parentNode,rt=st.split(di),ot=rt.length-1;for(let At=0;At<ot;At++){let _t,ft=rt[At];if(ft==="")_t=xt();else{let lt=Me.exec(ft);lt!==null&&hi(lt[2],le)&&(ft=ft.slice(0,lt.index)+lt[1]+lt[2].slice(0,-le.length)+lt[3]),_t=document.createTextNode(ft)}et.insertBefore(_t,R),this.parts.push({type:"node",index:++u})}rt[ot]===""?(et.insertBefore(xt(),R),i.push(R)):R.data=rt[ot],x+=ot}}else if(R.nodeType===8)if(R.data===mt){let st=R.parentNode;(R.previousSibling===null||u===r)&&(u++,st.insertBefore(xt(),R)),r=u,this.parts.push({type:"node",index:u}),R.nextSibling===null?R.data="":(i.push(R),u--),x++}else{let st=-1;for(;(st=R.data.indexOf(mt,st+1))!==-1;)this.parts.push({type:"node",index:-1}),x++}}for(let R of i)R.parentNode.removeChild(R)}},hi=(a,t)=>{let e=a.length-t.length;return e>=0&&a.slice(e)===t},ye=a=>a.index!==-1,xt=()=>document.createComment(""),Me=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;var Ge=133;function He(a,t){let{element:{content:e},parts:i}=a,s=document.createTreeWalker(e,Ge,null,!1),n=be(i),r=i[n],u=-1,x=0,M=[],q=null;for(;s.nextNode();){u++;let R=s.currentNode;for(R.previousSibling===q&&(q=null),t.has(R)&&(M.push(R),q===null&&(q=R)),q!==null&&x++;r!==void 0&&r.index===u;)r.index=q!==null?-1:r.index-x,n=be(i,n),r=i[n]}M.forEach(R=>R.parentNode.removeChild(R))}var Ai=a=>{let t=a.nodeType===11?0:1,e=document.createTreeWalker(a,Ge,null,!1);for(;e.nextNode();)t++;return t},be=(a,t=-1)=>{for(let e=t+1;e<a.length;e++){let i=a[e];if(ye(i))return e}return-1};function ui(a,t,e=null){let{element:{content:i},parts:s}=a;if(e==null){i.appendChild(t);return}let n=document.createTreeWalker(i,Ge,null,!1),r=be(s),u=0,x=-1;for(;n.nextNode();)for(x++,n.currentNode===e&&(u=Ai(t),e.parentNode.insertBefore(t,e));r!==-1&&s[r].index===x;){if(u>0){for(;r!==-1;)s[r].index+=u,r=be(s,r);return}r=be(s,r)}}var Ii=new WeakMap;var Xt=a=>typeof a=="function"&&Ii.has(a);var pt={},Re={};var Dt=class{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(let i of this.__parts)i!==void 0&&i.setValue(t[e]),e++;for(let i of this.__parts)i!==void 0&&i.commit()}_clone(){let t=qe?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],i=this.template.parts,s=document.createTreeWalker(t,133,null,!1),n=0,r=0,u,x=s.nextNode();for(;n<i.length;){if(u=i[n],!ye(u)){this.__parts.push(void 0),n++;continue}for(;r<u.index;)r++,x.nodeName==="TEMPLATE"&&(e.push(x),s.currentNode=x.content),(x=s.nextNode())===null&&(s.currentNode=e.pop(),x=s.nextNode());if(u.type==="node"){let M=this.processor.handleTextExpression(this.options);M.insertAfterNode(x.previousSibling),this.__parts.push(M)}else this.__parts.push(...this.processor.handleAttributeExpressions(x,u.name,u.strings,this.options));n++}return qe&&(document.adoptNode(t),customElements.upgrade(t)),t}};var pi=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:a=>a}),Ri=` ${mt} `,Ct=class{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){let t=this.strings.length-1,e="",i=!1;for(let s=0;s<t;s++){let n=this.strings[s],r=n.lastIndexOf("<!--");i=(r>-1||i)&&n.indexOf("-->",r+1)===-1;let u=Me.exec(n);u===null?e+=n+(i?Ri:Ve):e+=n.substr(0,u.index)+u[1]+u[2]+le+u[3]+mt}return e+=this.strings[t],e}getTemplateElement(){let t=document.createElement("template"),e=this.getHTML();return pi!==void 0&&(e=pi.createHTML(e)),t.innerHTML=e,t}};var Oe=a=>a===null||!(typeof a=="object"||typeof a=="function"),$e=a=>Array.isArray(a)||!!(a&&a[Symbol.iterator]),ce=class{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let s=0;s<i.length-1;s++)this.parts[s]=this._createPart()}_createPart(){return new ve(this)}_getValue(){let t=this.strings,e=t.length-1,i=this.parts;if(e===1&&t[0]===""&&t[1]===""){let n=i[0].value;if(typeof n=="symbol")return String(n);if(typeof n=="string"||!$e(n))return n}let s="";for(let n=0;n<e;n++){s+=t[n];let r=i[n];if(r!==void 0){let u=r.value;if(Oe(u)||!$e(u))s+=typeof u=="string"?u:String(u);else for(let x of u)s+=typeof x=="string"?x:String(x)}}return s+=t[e],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}},ve=class{constructor(t){this.value=void 0,this.committer=t}setValue(t){t!==pt&&(!Oe(t)||t!==this.value)&&(this.value=t,Xt(t)||(this.committer.dirty=!0))}commit(){for(;Xt(this.value);){let t=this.value;this.value=pt,t(this)}this.value!==pt&&this.committer.commit()}},Qt=class a{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(xt()),this.endNode=t.appendChild(xt())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=xt()),t.__insert(this.endNode=xt())}insertAfterPart(t){t.__insert(this.startNode=xt()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(this.startNode.parentNode===null)return;for(;Xt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=pt,e(this)}let t=this.__pendingValue;t!==pt&&(Oe(t)?t!==this.value&&this.__commitText(t):t instanceof Ct?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):$e(t)?this.__commitIterable(t):t===Re?(this.value=Re,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){let e=this.startNode.nextSibling;t=t??"";let i=typeof t=="string"?t:String(t);e===this.endNode.previousSibling&&e.nodeType===3?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){let e=this.options.templateFactory(t);if(this.value instanceof Dt&&this.value.template===e)this.value.update(t.values);else{let i=new Dt(e,t.processor,this.options),s=i._clone();i.update(t.values),this.__commitNode(s),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());let e=this.value,i=0,s;for(let n of t)s=e[i],s===void 0&&(s=new a(this.options),e.push(s),i===0?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(n),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){Kt(this.startNode.parentNode,t.nextSibling,this.endNode)}},xe=class{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,i.length!==2||i[0]!==""||i[1]!=="")throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;Xt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=pt,e(this)}if(this.__pendingValue===pt)return;let t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=pt}},we=class extends ce{constructor(t,e,i){super(t,e,i),this.single=i.length===2&&i[0]===""&&i[1]===""}_createPart(){return new Ne(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}},Ne=class extends ve{},_i=!1;(()=>{try{let a={get capture(){return _i=!0,!1}};window.addEventListener("test",a,a),window.removeEventListener("test",a,a)}catch{}})();var Se=class{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=s=>this.handleEvent(s)}setValue(t){this.__pendingValue=t}commit(){for(;Xt(this.__pendingValue);){let n=this.__pendingValue;this.__pendingValue=pt,n(this)}if(this.__pendingValue===pt)return;let t=this.__pendingValue,e=this.value,i=t==null||e!=null&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),s=t!=null&&(e==null||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=$i(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=pt}handleEvent(t){typeof this.value=="function"?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}},$i=a=>a&&(_i?{capture:a.capture,passive:a.passive,once:a.once}:a.capture);function We(a){let t=Jt.get(a.type);t===void 0&&(t={stringsArray:new WeakMap,keyString:new Map},Jt.set(a.type,t));let e=t.stringsArray.get(a.strings);if(e!==void 0)return e;let i=a.strings.join(mt);return e=t.keyString.get(i),e===void 0&&(e=new Yt(a,a.getTemplateElement()),t.keyString.set(i,e)),t.stringsArray.set(a.strings,e),e}var Jt=new Map;var Ft=new WeakMap,Ke=(a,t,e)=>{let i=Ft.get(t);i===void 0&&(Kt(t,t.firstChild),Ft.set(t,i=new Qt(Object.assign({templateFactory:We},e))),i.appendInto(t)),i.setValue(a),i.commit()};var Le=class{handleAttributeExpressions(t,e,i,s){let n=e[0];return n==="."?new we(t,e.slice(1),i).parts:n==="@"?[new Se(t,e.slice(1),s.eventContext)]:n==="?"?[new xe(t,e.slice(1),i)]:new ce(t,e,i).parts}handleTextExpression(t){return new Qt(t)}},Ye=new Le;typeof window<"u"&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var b=(a,...t)=>new Ct(a,t,"html",Ye);var gi=(a,t)=>`${a}--${t}`,Ue=!0;typeof window.ShadyCSS>"u"?Ue=!1:typeof window.ShadyCSS.prepareTemplateDom>"u"&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),Ue=!1);var Oi=a=>t=>{let e=gi(t.type,a),i=Jt.get(e);i===void 0&&(i={stringsArray:new WeakMap,keyString:new Map},Jt.set(e,i));let s=i.stringsArray.get(t.strings);if(s!==void 0)return s;let n=t.strings.join(mt);if(s=i.keyString.get(n),s===void 0){let r=t.getTemplateElement();Ue&&window.ShadyCSS.prepareTemplateDom(r,a),s=new Yt(t,r),i.keyString.set(n,s)}return i.stringsArray.set(t.strings,s),s},Li=["html","svg"],Ui=a=>{Li.forEach(t=>{let e=Jt.get(gi(t,a));e!==void 0&&e.keyString.forEach(i=>{let{element:{content:s}}=i,n=new Set;Array.from(s.querySelectorAll("style")).forEach(r=>{n.add(r)}),He(i,n)})})},mi=new Set,Di=(a,t,e)=>{mi.add(a);let i=e?e.element:document.createElement("template"),s=t.querySelectorAll("style"),{length:n}=s;if(n===0){window.ShadyCSS.prepareTemplateStyles(i,a);return}let r=document.createElement("style");for(let M=0;M<n;M++){let q=s[M];q.parentNode.removeChild(q),r.textContent+=q.textContent}Ui(a);let u=i.content;e?ui(e,r,u.firstChild):u.insertBefore(r,u.firstChild),window.ShadyCSS.prepareTemplateStyles(i,a);let x=u.querySelector("style");if(window.ShadyCSS.nativeShadow&&x!==null)t.insertBefore(x.cloneNode(!0),t.firstChild);else if(e){u.insertBefore(r,u.firstChild);let M=new Set;M.add(r),He(e,M)}},yi=(a,t,e)=>{if(!e||typeof e!="object"||!e.scopeName)throw new Error("The `scopeName` option is required.");let i=e.scopeName,s=Ft.has(t),n=Ue&&t.nodeType===11&&!!t.host,r=n&&!mi.has(i),u=r?document.createDocumentFragment():t;if(Ke(a,u,Object.assign({templateFactory:Oi(i)},e)),r){let x=Ft.get(u);Ft.delete(u);let M=x.value instanceof Dt?x.value.template:void 0;Di(i,u,M),Kt(t,t.firstChild),t.appendChild(u),Ft.set(t,x)}!s&&n&&window.ShadyCSS.styleElement(t.host)};var bi;window.JSCompiler_renameProperty=(a,t)=>a;var ei={toAttribute(a,t){switch(t){case Boolean:return a?"":null;case Object:case Array:return a==null?a:JSON.stringify(a)}return a},fromAttribute(a,t){switch(t){case Boolean:return a!==null;case Number:return a===null?null:Number(a);case Object:case Array:return JSON.parse(a)}return a}},vi=(a,t)=>t!==a&&(t===t||a===a),Xe={attribute:!0,type:String,converter:ei,reflect:!1,hasChanged:vi},Qe=1,Je=4,Ze=8,ti=16,ii="finalized",de=class extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();let t=[];return this._classProperties.forEach((e,i)=>{let s=this._attributeNameForProperty(i,e);s!==void 0&&(this._attributeToPropertyMap.set(s,i),t.push(s))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;let t=Object.getPrototypeOf(this)._classProperties;t!==void 0&&t.forEach((e,i)=>this._classProperties.set(i,e))}}static createProperty(t,e=Xe){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;let i=typeof t=="symbol"?Symbol():`__${t}`,s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Object.defineProperty(this.prototype,t,s)}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){let n=this[t];this[e]=s,this.requestUpdateInternal(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||Xe}static finalize(){let t=Object.getPrototypeOf(this);if(t.hasOwnProperty(ii)||t.finalize(),this[ii]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){let e=this.properties,i=[...Object.getOwnPropertyNames(e),...typeof Object.getOwnPropertySymbols=="function"?Object.getOwnPropertySymbols(e):[]];for(let s of i)this.createProperty(s,e[s])}}static _attributeNameForProperty(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=vi){return i(t,e)}static _propertyValueFromAttribute(t,e){let i=e.type,s=e.converter||ei,n=typeof s=="function"?s:s.fromAttribute;return n?n(t,i):t}static _propertyValueToAttribute(t,e){if(e.reflect===void 0)return;let i=e.type,s=e.converter;return(s&&s.toAttribute||ei.toAttribute)(t,i)}initialize(){this._updateState=0,this._updatePromise=new Promise(t=>this._enableUpdatingResolver=t),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){let i=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,i)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){this._enableUpdatingResolver!==void 0&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=Xe){let s=this.constructor,n=s._attributeNameForProperty(t,i);if(n!==void 0){let r=s._propertyValueToAttribute(e,i);if(r===void 0)return;this._updateState=this._updateState|Ze,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._updateState=this._updateState&~Ze}}_attributeToProperty(t,e){if(this._updateState&Ze)return;let i=this.constructor,s=i._attributeToPropertyMap.get(t);if(s!==void 0){let n=i.getPropertyOptions(s);this._updateState=this._updateState|ti,this[s]=i._propertyValueFromAttribute(e,n),this._updateState=this._updateState&~ti}}requestUpdateInternal(t,e,i){let s=!0;if(t!==void 0){let n=this.constructor;i=i||n.getPropertyOptions(t),n._valueHasChanged(this[t],e,i.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),i.reflect===!0&&!(this._updateState&ti)&&(this._reflectingProperties===void 0&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,i))):s=!1}!this._hasRequestedUpdate&&s&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=this._updateState|Je;try{await this._updatePromise}catch{}let t=this.performUpdate();return t!=null&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return this._updateState&Je}get hasUpdated(){return this._updateState&Qe}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1,e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(i){throw t=!1,this._markUpdated(),i}t&&(this._updateState&Qe||(this._updateState=this._updateState|Qe,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~Je}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){this._reflectingProperties!==void 0&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,i)=>this._propertyToAttribute(i,this[i],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}};bi=ii;de[bi]=!0;var xi=Element.prototype,Ds=xi.msMatchesSelector||xi.webkitMatchesSelector;var De=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,si=Symbol(),ke=class{constructor(t,e){if(e!==si)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return this._styleSheet===void 0&&(De?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}},wi=a=>new ke(String(a),si),Fi=a=>{if(a instanceof ke)return a.cssText;if(typeof a=="number")return a;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${a}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`)},Si=(a,...t)=>{let e=t.reduce((i,s,n)=>i+Fi(s)+a[n+1],a[0]);return new ke(e,si)};(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");var ki={},Zt=class extends de{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;let t=this.getStyles();if(Array.isArray(t)){let e=(n,r)=>n.reduceRight((u,x)=>Array.isArray(x)?e(x,u):(u.add(x),u),r),i=e(t,new Set),s=[];i.forEach(n=>s.unshift(n)),this._styles=s}else this._styles=t===void 0?[]:[t];this._styles=this._styles.map(e=>{if(e instanceof CSSStyleSheet&&!De){let i=Array.prototype.slice.call(e.cssRules).reduce((s,n)=>s+n.cssText,"");return wi(i)}return e})}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){let t=this.constructor._styles;t.length!==0&&(window.ShadyCSS!==void 0&&!window.ShadyCSS.nativeShadow?window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(e=>e.cssText),this.localName):De?this.renderRoot.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):this._needsShimAdoptedStyleSheets=!0)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&window.ShadyCSS!==void 0&&window.ShadyCSS.styleElement(this)}update(t){let e=this.render();super.update(t),e!==ki&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(i=>{let s=document.createElement("style");s.textContent=i.cssText,this.renderRoot.appendChild(s)}))}render(){return ki}};Zt.finalized=!0;Zt.render=yi;Zt.shadowRootOptions={mode:"open"};var D=(()=>{function It(c,m){let f=[],o=0;for(;o<c.length;){if(!c[o]){o++;continue}let l=o,p=o+1;for(;p<c.length&&p-l<=m+1;)c[p]&&(l=p),p++;f.push([o,l]),o=l+1}return f}function he(c,m,f){let o=0;for(let v of c)v&&o++;if(!(f>0)||o*2<c.length)return null;let l=It(c,3).filter(v=>(v[1]-v[0]+1)*f>=60),p=[];for(let v=0;v+1<l.length;v++){let T=l[v],E=l[v+1],N=m+(T[1]+1)*f,A=m+E[0]*f,C=0;for(let L=T[1]+1;L<E[0];L++)c[L]&&C++;A-N>=150&&A-N<=800&&C*2<E[0]-T[1]-1&&p.push([N,A])}return p}function it(c,m,f){let o=new Array(c.length).fill(!1);for(let l=0;l<c.length;l++){if(!f[l])continue;let p=[];for(let v=Math.max(0,l-2);v<=Math.min(c.length-1,l+2);v++)f[v]&&p.push(c[v]);p.sort((v,T)=>v-T),o[l]=p[p.length>>1]<.5*m}return o}function ct(c){let m=new Array(c.length).fill(!1);for(let f of It(c,0))if(f[1]-f[0]+1>=5)for(let o=f[0];o<=f[1];o++)m[o]=!0;return m}function U(c,m,f,o,l){let p=ct(c),v=(C,L)=>{if(C<0||L>p.length)return!1;let F=0;for(let Lt=C;Lt<L;Lt++)p[Lt]||F++;return F>=8},T=C=>{let L=(C[1]+1-C[0])*m;return v(C[0]-15,C[0])&&v(C[1]+1,C[1]+1+15)&&L>=150&&L<=1200},E=It(p,7);if(!f||!o)return E.filter(T);let N=l?E.filter(C=>C[1]-C[0]+1>=10):E,A=[];for(let C of Bt(N,f,o,m)){let L=N.filter(F=>F[0]>=C[0]&&F[1]<=C[1]);if(T(C)&&(!l||L.length===1||L.some(T)))A.push(C);else for(let F of L)T(F)&&A.push([F[0],F[1]])}return A}function Bt(c,m,f,o){let l=[];for(let p of c){let v=l[l.length-1];v&&(p[1]+1-v[0])*o<=1200&&zt(v[1]+1,p[0],m,f)?v[1]=p[1]:l.push([p[0],p[1]])}return l}function zt(c,m,f,o){let l=0;for(let p=c;p<m;p++)(f[p]||o[p])&&l++;return m-c<=29&&l>=m-c-7&&wt(f,c,m)<=10&&wt(o,c,m)<=12}function wt(c,m,f){let o=0,l=0;for(let p=m;p<f;p++)o=c[p]?o+1:0,l=Math.max(l,o);return l}function dt(c,m,f,o){let l=c,p=o?c.map((A,C)=>!A&&o[C]):null,v=o?c.map((A,C)=>A&&!o[C]):null,T=U(l,f,v,p,!0);if(o){l=new Array(c.length).fill(!1);let A=new Array(c.length).fill(!1);for(let C of T)for(let L=C[0];L<=C[1];L++)l[L]=c[L]&&o[L],A[L]=c[L]&&!o[L];T=U(l,f,A,p)}let E=ct(l),N=o?Pe(c,o,T,m,f):[];return T.map(A=>{let C=It(E.slice(A[0],A[1]+1),0),L=Mt(o?ht(C,A[0],c,o):C);return[m+(A[0]+L[0])*f,m+(A[0]+L[1]+1)*f]}).concat(N)}function Mt(c){let m=0,f=c.length-1;for(;f>m&&c[f][1]-c[f][0]+1<10;)f--;for(;m<f&&c[m][1]-c[m][0]+1<10;)m++;return[c[m][0],c[f][1]]}function ht(c,m,f,o){let l=[];for(let p of c){let v=l[l.length-1];v&&!Rt(m+v[1]+1,m+p[0],f,o)?v[1]=p[1]:l.push([p[0],p[1]])}return l}function Rt(c,m,f,o){let l=0;for(let p=c;p<m;p++)if(!f[p]&&!o[p]||(l=o[p]?0:l+1,l>=5))return!0;return!1}function Pe(c,m,f,o,l){let p=ct(c),v=(E,N)=>{if(E<0||N>p.length)return!1;let A=0;for(let C=E;C<N;C++)p[C]||A++;return A>=12},T=[];for(let E of U(m,l)){if(f.some(F=>F[0]<=E[1]&&E[0]<=F[1]))continue;let N=0;for(let F=E[0];F<=E[1];F++)c[F]&&N++;if(N<.5*(E[1]-E[0]+1))continue;let A=-1,C=-1;for(let F=E[0];F<=E[1];F++)p[F]&&(A<0&&(A=F),C=F+1);if(A<0||(C-A)*l<150||!v(A-15,A)||!v(C,C+15))continue;let L=Mt(ht(It(p.slice(E[0],E[1]+1),0),E[0],c,m));T.push([o+(E[0]+L[0])*l,o+(E[0]+L[1]+1)*l])}return T}function $t(c,m){if(c===null)return m||[];if(m===null)return c;let f=[];for(let o of c)for(let l of m){let p=Math.max(o[0],l[0]),v=Math.min(o[1],l[1]);v-p<60||f.push([Math.abs(o[0]-l[0])<=90?l[0]:p,Math.abs(o[1]-l[1])<=90?l[1]:v])}return f}function te(c,m,f){let o=Math.floor(m*.22),l=Math.floor(f*.22),p=o-1,v=l-1,T=p*v,E=[[0,0],[m-o,0],[0,f-l],[m-o,f-l]],N=E.map(()=>new Uint8Array(T>0?c*T:0)),A=new Array(c).fill(!1),C=-1;function L(I,V){if(!(T<=0||I<0||I>=c||V.length<m*f)){for(let z=0;z<E.length;z++){let Q=E[z][0],G=E[z][1],J=N[z],W=I*T;for(let j=0;j<v;j++){let K=(G+j)*m+Q;for(let Pt=0;Pt<p;Pt++){let Ut=V[K];J[W++]=Math.min(255,Math.abs(V[K+1]-Ut)+Math.abs(V[K+m]-Ut)),K++}}}A[I]=!0}}function F(I,V,z){let Q=N[I],G=new Uint8Array(T);for(let K=0;K<T;K++){z.fill(0);for(let je of V)z[Q[je*T+K]]++;let Pt=0,Ut=0;for(;Pt+z[Ut]<=V.length>>1;)Pt+=z[Ut++];G[K]=Ut}let J=Math.max(1,Array.from(G).sort((K,Pt)=>K-Pt)[Math.floor(T*.92)]),W=[],j=0;for(let K=0;K<T;K++)G[K]>=J&&(W.push(K),j+=G[K]);return W.length===0?null:{corner:I,median:G,mask:W,strength:j/W.length,whole:j}}function Lt(I,V,z,Q){let G=null;for(let J=I;J<V;J++){let W=F(J,z,Q);W!==null&&(G===null||W.strength>G.strength)&&(G=W)}return G}function Te(I,V){let z=N[I.corner],Q=new Float64Array(c),G=[];for(let J of V){let W=J*T,j=0;for(let K of I.mask)j+=Math.min(z[W+K],I.median[K]);Q[J]=j/I.whole,G.push(Q[J])}return G.sort((J,W)=>J-W),I.score=Q,I.usual=G[G.length>>1],I}function oe(){let I=[];for(let j=0;j<c;j++)A[j]&&I.push(j);if(T<=0||I.length<30)return null;let V=new Int32Array(256),z=j=>j!==null&&j.strength>=25?j:null,Q=j=>j!==null&&j.strength>=30?j:null,G=Lt(2,N.length,I,V),J=C<0?z(Lt(0,2,I,V)):C<2?F(C,I,V):null,W=J!==null?J:C<0?z(G):F(C,I,V);return W===null?null:(C=W.corner,Te(W,I),W.lower=J!==null&&Q(G)!==null?Te(G,I):null,W)}function Ce(I){let V=E[I.corner][0],z=E[I.corner][1];return{width:m,points:I.mask.map(Q=>(z+Math.floor(Q/p))*m+V+Q%p),pattern:I.mask.map(Q=>I.median[Q]),whole:I.whole,usual:I.usual,strength:I.strength,lower:I.lower?Ce(I.lower):null,channel:I.corner<2}}function ze(){let I=oe();return I===null?null:Ce(I)}function ge(){let I=oe();return I===null?null:it(I.score,I.usual,A)}return{add:L,logo:ze,gone:ge,breaks:(I,V)=>{let z=oe();if(z===null)return null;let Q=z.lower?it(z.lower.score,z.lower.usual,A):null;return dt(it(z.score,z.usual,A),I,V,Q)}}}function ue(c){return c.lower?Object.assign({},c,{lower:null}):c}function jt(c,m,f){let o=0;for(let l of m)Nt(c,l)>=.5*c.usual&&o++;return o>=f*m.length}function Nt(c,m){let f=0;for(let o=0;o<c.points.length;o++){let l=c.points[o],p=m[l];f+=Math.min(Math.abs(m[l+1]-p)+Math.abs(m[l+c.width]-p),c.pattern[o])}return f/c.whole}function Z(c){let m=String(c).match(/[A-Za-z0-9+\/]{16,}={0,2}/g)||[];for(let f of m){let o;try{o=atob(f)}catch{continue}if(o.length<20||o.charCodeAt(0)!==252)continue;let l=p=>{if(p<0||p>=o.length)throw new RangeError("short");return o.charCodeAt(p)};try{if(l(13)===5&&!(l(18)&128))return(l(19)&128)!==0;for(let p=16;p+4<=o.length;p++){if(o.substr(p,4)!=="CUEI"||l(p-2)!==2)continue;let v=p+8;if(l(v)&128)continue;v++;let T=l(v);v++,T&128||(v+=1+6*l(v)),T&64&&(v+=5),v+=2+l(v+1);let E=l(v);if([34,48,50,52,54].indexOf(E)>=0)return!0;if([35,49,51,53,55].indexOf(E)>=0)return!1}}catch{return null}return null}return null}function ee(c){let m=[];if(c.some(f=>f.signalled))for(let f of c)for(let o of f.marks){if(!o.opens)continue;let l=null;if(o.duration!==null)l=o.at+o.duration;else{let p=f.marks.filter(v=>v.at>o.at).map(v=>v.at);l=p.length>0?Math.min.apply(null,p):f.end}l!==null&&l>o.at&&m.push([o.at,l])}else{let f=o=>o.end-o.start;for(let o=1;o+1<c.length;o++){let l=c[o-1],p=c[o],v=c[o+1];if(l.end===null||p.end===null||v.end===null)continue;f(p)<10&&f(l)>=60&&f(l)<=420&&f(v)>=60&&f(v)<=420&&m.push([l.start,v.end])}}return qt(m,10)}function qt(c,m){let f=[];for(let o of c.slice().sort((l,p)=>l[0]-p[0])){let l=f[f.length-1];l&&o[0]-l[1]<=m?l[1]=Math.max(l[1],o[1]):f.push([o[0],o[1]])}return f}let Vt={270:{tiny:120,mean:40,key:4e3},540:{tiny:172,mean:86,key:8e3},1080:{tiny:430,mean:172,key:12e3}},pe=10,_e=14,ut=.2,St=6,yt=90,ie=60,fe=100,gt=3,se=65536,kt=1e4;function Ot(c,m){return String.fromCharCode(c[m+4],c[m+5],c[m+6],c[m+7])}function ne(c){let m=new DataView(c.buffer,c.byteOffset,c.byteLength),f=0;for(;c.length-f>=8;){let o=m.getUint32(f);if(o<8||f+o>se)return null;if(Ot(c,f)==="moof")return f+o;f+=o}return null}function Gt(c,m,f,o){let l=[],p=f;for(;o-p>=8;){let v=m.getUint32(p);if(v<8||v>o-p)break;l.push({type:Ot(c,p),from:p+8,to:p+v}),p+=v}return l}function bt(c){let m=ne(c);if(m===null||m>c.length)return null;let f=new DataView(c.buffer,c.byteOffset,c.byteLength),o=Gt(c,f,0,m).pop();if(!o||o.type!=="moof")return null;let l=Gt(c,f,o.from,o.to).filter(T=>T.type==="traf")[0];if(!l)return null;let p=[],v=-1;for(let T of Gt(c,f,l.from,l.to)){if(T.type!=="tfhd"&&T.type!=="trun")continue;let E=T.from;if(T.to-E<8)return null;let N=f.getUint32(E)&16777215;if(T.type==="tfhd"){let A=E+8;if(N&1&&(A+=8),N&2&&(A+=4),N&8&&(A+=4),N&16){if(A+4>T.to)return null;v=f.getUint32(A)}}else{let A=f.getUint32(E+4),C=((N&256?1:0)+(N&512?1:0)+(N&1024?1:0)+(N&2048?1:0))*4,L=E+8+(N&1?4:0)+(N&4?4:0);if(A>kt||L+A*C>T.to||!(N&512)&&v<0)return null;for(let F=0;F<A;F++)p.push(N&512?f.getUint32(L+(N&256?4:0)):v),L+=C}}return p}function Et(c,m,f,o){let l=[],p=0,v=0;for(let T=0;T<c.length;T++){let E=c[T];if(E>=0&&E<o.tiny){p++,v+=E;continue}p>=pe&&p<=_e&&v<=o.mean*p&&E>o.key&&l.push(m+T*f),p=0,v=0}return l}function Ht(c){let m=[];for(let o of c.slice().sort((l,p)=>l-p)){let l=m[m.length-1];l&&o-l[l.length-1]<=ut||(l&&o-l[l.length-1]<=ie?l.push(o):m.push([o]))}let f=[];for(let o=0;o<m.length;o++){let l=m[o],p=m[o+1],v=f[f.length-1];v&&!(v.length>=gt&&l[0]-v[v.length-1]<=fe)&&(v=null),v&&l.length>=gt?v.push(...l):v&&p&&p.length>=gt&&p[0]-l[l.length-1]<=fe?(v.push(...l,...p),o++):f.push(l)}return f.filter(o=>o.length>=St&&o[o.length-1]-o[0]>=yt).map(o=>[o[1],o[o.length-2]])}function re(c,m){let f=m.filter(o=>o[0]<c[1]&&o[1]>c[1])[0];return f?[c[0],f[1]]:c}return{runs:It,captionBreaks:he,gone:it,solid:ct,logoBreaks:dt,combine:$t,track:te,score:Nt,alone:ue,seenIn:jt,opens:Z,markedBreaks:ee,merge:qt,moofEnd:ne,frameSizes:bt,separatorEnds:Et,separatedBreaks:Ht,reachSeparated:re,BLACKS:Vt,BRIDGE:7,AROUND:15,LOGO_MAX_S:1200}})();function Ei(a){let _t=D.LOGO_MAX_S+160,ft=_t+120,lt=3,ri=4096,Ee=480,oi=8,ai=3e4,li=4e3,ci=150,Be=1e4,It=5*60*1e3,he=2e4,it=240,ct=135,U=0,Bt=null,zt=!1,wt=null,dt=null,Mt=[],ht="none",Rt=null,Pe=0,$t=new Map,te=[],ue=0,jt="none",Nt=[],Z=null,ee="none",qt=-1/0,Vt=0,pe=new Map,_e=null,ut=new Map,St=new Map,yt=new Map,ie=0,fe=0,gt=null,se=!1,kt=null,Ot=!1,ne="none",Gt=[],bt=new Map,Et=new Map,Ht=[],re=0,c="";function m(d){let h=String(d).indexOf("?");return h<0?String(d):String(d).slice(0,h)}function f(d,h){try{let y=d&&d.contentId,_=!!a.isLive(),g=y?m(y):null;wt=y||null;let k=h&&h.live_thumbnails_url;dt=_&&typeof k=="string"&&k.indexOf("https://")===0?k.replace(/\/+$/,""):null,Ot=_&&!!(h&&h.separated_breaks===!0);let P=!_&&!!(h&&h.recording)&&g!==null;if(g!==null&&g===Bt&&_===zt){P&&/^error/.test(ht)&&(Rt={url:wt,name:Bt,mine:U});return}U++,Bt=g,zt=_,gt=null,se=a.show(!1),Mt=[],ht=P?"waiting":"none",te=[],ue=0,jt="none",Nt=[],Z=null,ee="none",qt=-1/0,Vt=0,_e=null,ut=new Map,St=new Map,yt=new Map,ne=Ot?"waiting":"none",Gt=[],bt=new Map,Et=new Map,Ht=[],re=0,c="",Rt=P?{url:wt,name:Bt,mine:U}:null,Pe=0}catch{ht="error"}}function o(d,h,y){let _=new Array(d.length),g=0,k=async()=>{for(;g<d.length;){let w=g++;_[w]=await y(d[w],w)}},P=[];for(let w=0;w<Math.min(h,d.length);w++)P.push(k());return Promise.all(P).then(()=>_)}async function l(d){let h=new AbortController,y=setTimeout(()=>h.abort(),he);try{let _=await fetch(d,{credentials:"omit",signal:h.signal});if(!_.ok)throw new Error("http "+_.status);return await _.text()}finally{clearTimeout(y)}}function p(d,h,y){return new Promise(_=>{let g=new Image,k=setTimeout(()=>{g.onload=null,g.onerror=null,_(null)},he);g.crossOrigin="anonymous",g.onload=()=>{clearTimeout(k);try{kt===null&&(kt=document.createElement("canvas")),(kt.width!==h||kt.height!==y)&&(kt.width=h,kt.height=y);let P=kt.getContext("2d",{willReadFrequently:!0});P.drawImage(g,0,0,h,y),_(P.getImageData(0,0,h,y).data)}catch{_(null)}},g.onerror=()=>{clearTimeout(k),_(null)},g.src=d})}function v(d,h,y){let _=new Uint8Array(it*ct),g=0;for(let k=0;k<ct;k++){let P=(k*h+y)*4;for(let w=0;w<it;w++)_[g++]=d[P]*77+d[P+1]*150+d[P+2]*29>>8,P+=4}return _}function T(d){let h=/^PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?$/.exec(d||"");return h?Number(h[1]||0)*3600+Number(h[2]||0)*60+Number(h[3]||0):NaN}function E(d,h){let y=[];for(let _=d.firstElementChild;_;_=_.nextElementSibling)_.localName===h&&y.push(_);return y}function N(d,h){let y=E(d,"BaseURL")[0];return y&&y.textContent?new URL(y.textContent.trim(),h).href:h}function A(d,h,y,_){let g=_||E(d,"Representation")[0];if(!g)return[];let k=E(d,"SegmentTemplate")[0]||E(g,"SegmentTemplate")[0],P=k&&k.getAttribute("media");if(!P)return[];let w=Number(k.getAttribute("timescale")||1),S=Number(k.getAttribute("presentationTimeOffset")||0),O=(tt,Tt,vt)=>tt.replace(new RegExp("\\$"+Tt+"(?:%0(\\d+)d)?\\$","g"),(ae,Wt)=>Wt?String(vt).padStart(Number(Wt),"0"):String(vt)),$=(tt,Tt)=>new URL(O(O(P.split("$RepresentationID$").join(g.getAttribute("id")),"Time",tt),"Number",Tt),h).href,B=[],H=E(k,"SegmentTimeline")[0];if(H){let tt=0,Tt=Number(k.getAttribute("startNumber")||1),vt=E(H,"S");for(let ae=0;ae<vt.length;ae++){let Wt=vt[ae];Wt.getAttribute("t")!==null&&(tt=Number(Wt.getAttribute("t")));let Ae=Number(Wt.getAttribute("d")),Ie=Number(Wt.getAttribute("r")||0);if(!(Ae>0))return[];if(Ie<0){let me=ae+1<vt.length?vt[ae+1].getAttribute("t"):null,Ci=me!==null?Number(me):y*w+S;Ie=Math.ceil((Ci-tt)/Ae)-1}if(!(Ie>=0))return[];for(let me=0;me<=Ie;me++)if(B.push({time:(tt-S)/w,duration:Ae/w,url:$(tt,Tt)}),tt+=Ae,Tt++,B.length>Be)return[]}return B}let Y=Number(k.getAttribute("duration"))/w,X=Number(k.getAttribute("startNumber")||1);if(!(Y>0))return[];let nt=0;k.getAttribute("eptDelta")!==null?nt=Number(k.getAttribute("eptDelta"))/w:nt=(X-1)*Y-S/w,nt<0&&-nt<Y||(nt=0);let at=k.getAttribute("endNumber")!==null?Number(k.getAttribute("endNumber")):X+Math.ceil((y-nt)/Y)-1;if(!(at>=X)||at-X+1>Be)return[];for(let tt=X;tt<=at;tt++)B.push({time:(tt-X)*Y+nt,duration:Y,url:$("",tt)});return B}async function C(d,h){if(d.length===0)return null;let y=/<p\b[^>]*>([\s\S]*?)<\/p>/g,_=0,g=await o(d,4,async k=>{if(h!==U)return!0;try{let P=await l(k.url).catch(()=>l(k.url)),w;for(y.lastIndex=0;(w=y.exec(P))!==null;)if(w[1].replace(/<[^>]+>/g,"").trim()!=="")return!0;return!1}catch{return _++,!0}});if(h!==U)throw new Error("superseded");if(_*20>g.length)throw new Error("captions unread");return D.captionBreaks(g,d[0].time,d[0].duration)}async function L(d,h,y,_){if(d.length===0||d.length>ci||y!==1||!(h>0))return null;let g=h,k=D.track(d.length*g,it,ct),P=async $=>(await o($,1,async H=>{if(_!==U)return!1;let Y=await p(d[H].url,h*it,ct);if(Y===null&&_===U&&(Y=await p(d[H].url,h*it,ct)),Y===null)return!1;for(let X=0;X<g;X++)k.add(H*g+X,v(Y,h*it,X*it));return!0})).every(H=>H),w=d.map(($,B)=>B);if(!await P(w.filter($=>$%2===0)))throw new Error("thumbnails unread");let S=k.gone();if(S===null)return null;let O=$=>{if($<0||$>=d.length)return!1;for(let B=$*g;B<($+1)*g;B++)if(S[B])return!0;return!1};if(!await P(w.filter($=>$%2===1&&(O($-1)||O($+1)))))throw new Error("thumbnails unread");return k.breaks(d[0].time,d[0].duration/g)}async function F(d,h,y){if($t.has(h)){Mt=$t.get(h),ht="known";return}ht="searching";try{let _=new DOMParser().parseFromString(await l(d),"application/xml").documentElement,g=_?E(_,"Period"):[],k=_?T(_.getAttribute("mediaPresentationDuration")):NaN;if(_&&(_.getAttribute("type")==="dynamic"||!(k>0)))throw new Error("not whole yet");if(!_||g.length!==1){y===U&&(ht="not a recording");return}let P=N(g[0],N(_,d)),w=null,S=null;for(let $ of E(g[0],"AdaptationSet")){let B=E($,"Representation")[0],H=$.getAttribute("mimeType")||B&&B.getAttribute("mimeType")||"",Y=$.getAttribute("contentType")||H.split("/")[0];if(Y==="text"&&w===null)w=await C(A($,P,k),y);else if(Y==="image"&&S===null){let X=E($,"EssentialProperty").concat(B?E(B,"EssentialProperty"):[]).filter(at=>/thumbnail_tile$/.test(at.getAttribute("schemeIdUri")||""))[0],nt=/^(\d+)x(\d+)$/.exec(X&&X.getAttribute("value")||"");nt&&(S=await L(A($,P,k),Number(nt[1]),Number(nt[2]),y))}if(y!==U)return}let O=D.combine(w,S).filter($=>$[0]>0&&$[1]<k);if($t.set(h,O),$t.size>20&&$t.delete($t.keys().next().value),y!==U)return;Mt=O,ht="found "+O.length+" (captions "+(w===null?"none":w.length)+", logo "+(S===null?"none":S.length)+")"}catch(_){y===U&&(ht="error: "+String(_&&_.message).slice(0,40),setTimeout(()=>{y===U&&/^error/.test(ht)&&(Rt={url:d,name:h,mine:y})},It*2**Math.min(Pe++,12)))}}async function Lt(d){try{let h=new DOMParser().parseFromString(await l(wt),"application/xml").documentElement;if(!h||d!==U)return;let y=Date.parse(h.getAttribute("availabilityStartTime")||"")/1e3;if(!isFinite(y)){jt="no start time";return}let _=E(h,"Period"),g=_.map(w=>T(w.getAttribute("start"))),k=null,P=_.map((w,S)=>{let O=isFinite(g[S])?y+g[S]:k!==null?k:y,$=T(w.getAttribute("duration")),B=isFinite($)?O+$:S+1<g.length&&isFinite(g[S+1])?y+g[S+1]:null,H=E(w,"EventStream").filter(X=>(X.getAttribute("schemeIdUri")||"").indexOf("urn:scte:scte35")===0),Y=[];for(let X of H){let nt=Number(X.getAttribute("timescale")||1),at=Number(X.getAttribute("presentationTimeOffset")||0);for(let tt of E(X,"Event")){let Tt=D.opens(new XMLSerializer().serializeToString(tt));if(Tt===null)continue;let vt=Number(tt.getAttribute("duration")||0)/nt;Y.push({at:O+(Number(tt.getAttribute("presentationTime")||0)-at)/nt,duration:vt>0?vt:null,opens:Tt})}}return k=B,{start:O,end:B,marks:Y,signalled:H.length>0}});te=D.markedBreaks(P),jt="periods "+_.length+", breaks "+te.length,Ot&&(Gt=Te(h,y))}catch(h){d===U&&(jt="error: "+String(h&&h.message).slice(0,40))}}function Te(d,h){let y=[],_=Date.now()/1e3,g=N(d,wt);for(let k of E(d,"Period")){let P=h+(T(k.getAttribute("start"))||0),w=new Map;for(let S of E(k,"AdaptationSet"))if(!(S.getAttribute("contentType")!=="video"&&!/^video\//.test(S.getAttribute("mimeType")||"")))for(let O of E(S,"Representation")){let $=Number(O.getAttribute("bandwidth")),B=Number(O.getAttribute("height")||S.getAttribute("height"));if(!($>0)||!D.BLACKS[B])continue;let H=w.get(B);(!H||$<Number(H.rep.getAttribute("bandwidth")))&&w.set(B,{set:S,rep:O})}w.forEach((S,O)=>{let $=E(S.set,"SegmentTemplate")[0]||E(S.rep,"SegmentTemplate")[0];if(!$||!E($,"SegmentTimeline")[0])return;let B=N(S.rep,N(S.set,N(k,g)));for(let H of A(S.set,B,_-P,S.rep)){let Y=P+H.time;y.push({time:Y,duration:H.duration,url:H.url,height:O,key:O+" "+Y})}})}return y}async function oe(d,h){let y=new AbortController,_=setTimeout(()=>y.abort(),he);try{let g=await fetch(d,{credentials:"omit",headers:{Range:"bytes=0-"+(h-1)},signal:y.signal});if(!g.ok)return"http "+g.status;let k=new Uint8Array(await g.arrayBuffer());return k.length>h?k.subarray(0,h):k}catch(g){return String(g&&g.name||"error")}finally{clearTimeout(_)}}async function Ce(d){let h=await oe(d.url,ri);if(typeof h=="string")return h;let y=D.moofEnd(h);if(y===null)return"no header";if(y>h.length&&(h=await oe(d.url,y)),typeof h=="string")return h;let _=D.frameSizes(h);return _===null||_.length===0?"no frames":D.separatorEnds(_,d.time,d.duration/_.length,D.BLACKS[d.height])}async function ze(d,h,y){let _=d-Ee,g=Math.min(h-oi,d+Ee),k=Gt.filter(S=>S.time+S.duration>_&&S.time<g&&(!bt.has(S.key)||Et.has(S.key)&&Et.get(S.key)<lt)),P=await o(k,6,Ce);if(y!==U)return;k.forEach((S,O)=>{let $=typeof P[O]=="string";$?(Et.set(S.key,(Et.get(S.key)||0)+1),re++,c=P[O]):Et.delete(S.key),bt.set(S.key,{time:S.time,ends:$?[]:P[O]})});for(let S of Array.from(bt.keys()))bt.get(S).time>=d-2*Ee||(bt.delete(S),Et.delete(S));let w=[];for(let S of bt.values())for(let O of S.ends)w.push(O);Ht=D.separatedBreaks(w),ne="segments "+bt.size+", blacks "+w.length+", breaks "+Ht.length+(re>0?", failed "+re+" ("+c+")":"")}async function ge(d,h,y){let _=[];for(let w=d;w<=h;w+=4)(!ut.has(w)||yt.has(w)&&yt.get(w)<lt)&&_.push(w);if(_.length===0)return;let g=Z,k=dt,P=await o(_,4,async w=>{if(y!==U)return null;let S=await p(k+"/"+w,it,ct);if(S===null)return null;let O=v(S,it,0);return[D.score(g,O),g.lower?D.score(g.lower,O):null]});y!==U||g!==Z||_.forEach((w,S)=>{P[S]===null?yt.set(w,(yt.get(w)||0)+1):yt.delete(w),ut.set(w,P[S]===null?g.usual:P[S][0]),g.lower&&St.set(w,P[S]===null?g.lower.usual:P[S][1])})}async function I(d,h){let y=dt;return(await o(d,4,async _=>{if(h!==U)return null;let g=await p(y+"/"+_,it,ct);return g===null?null:v(g,it,0)})).filter(_=>_!==null)}function V(d){if(d.length===0)return null;let h=D.track(d.length,it,ct);return d.forEach((y,_)=>h.add(_,y)),h.logo()}async function z(d,h,y){let _=[];for(let w=d-1200;w<=Math.min(h,d+1200);w+=28)_.push(w);let g=await I(_,y);if(y!==U)return;if(g.length===0){Q(d);return}let k=V(g);k!==null&&k.channel&&pe.set(dt,D.alone(k));let P=null;if(k===null){let w=pe.get(dt);if(w&&D.seenIn(w,g,.4))P=w;else if(_e!==dt){let S=await G(d,y);if(y!==U)return;S!==null&&(pe.set(dt,S),D.seenIn(S,g,.4)&&(P=S))}}qt=d,Z=P||k,ut=new Map,St=new Map,yt=new Map,ee=Z===null?"none in "+g.length+" pictures":"strength "+Math.round(Z.strength)+(Z.lower?", lower one "+Math.round(Z.lower.strength):"")+(P!==null?", kept":""),Z===null?Q(d):Vt=0}function Q(d){qt=d-900+Math.min(900,120*2**Vt),120*2**Vt<900&&Vt++}async function G(d,h){let y=null;for(let _=0;_<3;_++){let g=d-1200-_*2*1200,k=[];for(let S=g-2*1200;S<g;S+=28)k.push(S);let P=await I(k,h);if(h!==U)return null;if(P.length===0){if(_===0)return null;break}let w=V(P);if(w!==null&&w.channel){y=D.alone(w);break}}return _e=dt,y}function J(d){let h=d;for(;ut.has(h-4);)h-=4;let y=[],_=[];for(let k=h;ut.has(k);k+=4)y.push(ut.get(k)),Z.lower&&_.push(St.has(k)?St.get(k):Z.lower.usual);let g=y.map(()=>!0);return{first:h,gone:D.gone(y,Z.usual,g),lowerGone:Z.lower?D.gone(_,Z.lower.usual,g):null}}async function W(d,h,y){let _=Math.floor(d/4)*4,g=Math.floor((h-12)/4)*4;if(_>g)return;let k=Math.abs(_-qt),P=Nt.some(S=>S[0]<=_&&_<=S[1])&&k<=900+D.LOGO_MAX_S;if(k>900&&!P&&await z(_,g,y),Z===null||y!==U)return;await ge(_-64,Math.min(g,_+88),y);for(let S=0;S<4;S++){if(y!==U||!ut.has(_))return;let O=J(_),$=O.gone.length,B=O.first+$*4,H=D.runs(D.solid(O.gone),D.BRIDGE).concat(O.lowerGone?D.runs(D.solid(O.lowerGone),D.BRIDGE):[]),Y=H.some(at=>at[1]+D.AROUND>=$&&($-at[0])*4<=_t),X=(_-O.first)/4,nt=H.some(at=>at[0]<D.AROUND&&at[1]>=X&&(at[1]+1)*4<=_t);if(Y&&B<=g)await ge(B,Math.min(g,B+120),y);else if(nt&&O.first>_-_t)await ge(O.first-120,O.first-4,y);else break}if(y!==U||Z===null||!ut.has(_))return;let w=J(_);Nt=D.logoBreaks(w.gone,w.first,4,w.lowerGone);for(let S of Array.from(ut.keys()))S<_-ft&&ut.delete(S);for(let S of Array.from(St.keys()))S<_-ft&&St.delete(S);for(let S of Array.from(yt.keys()))S<_-ft&&yt.delete(S)}function j(){let d=a.liveRange(),h=a.currentTime();if(!d||typeof h!="number"||!isFinite(h)||!isFinite(d.end))return null;let y=a.absoluteTime(h),_=a.absoluteTime(d.end),g=Date.now()/1e3;return typeof y!="number"||typeof _!="number"||!(y>g-86400&&y<g+600)||!(_>=y)?null:{at:y,end:_}}async function K(d){if(ie!==d){ie=d;try{let h=j();if(h===null||h.end-h.at<=60)return;Date.now()-ue>=ai&&wt&&(ue=Date.now(),await Lt(d)),Ot&&d===U&&await ze(h.at,h.end,d),dt!==null&&d===U&&await W(h.at,h.end,d)}catch(h){ee="error: "+String(h&&h.message).slice(0,40)}finally{ie===d&&(ie=0)}}}function Pt(){let d=null;try{let h=a.state();if(Bt!==null&&(h==="playing"||h==="paused")){let y=a.currentTime();if(Rt!==null&&h==="playing"){let g=Rt;Rt=null,g.mine===U&&F(g.url,g.name,g.mine)}let _=g=>[g[0],g[1]-32];if(zt){if(!a.joining()){let g=j();if(g!==null){let k=w=>g.at>=w[0]&&g.at<w[1]-1&&w[1]<=g.end-2,P=te.filter(k)[0]||Ht.filter(k)[0]||Nt.map(_).map(w=>D.reachSeparated(w,Ht)).filter(k)[0];if(P){let w=a.mediaTime(P[1]);typeof w=="number"&&isFinite(w)&&w>y&&(d=w)}}Date.now()-fe>=li&&(fe=Date.now(),K(U))}}else{let g=Mt.map(_).filter(k=>y>=k[0]&&y<k[1]-1)[0];g&&(d=g[1])}}}catch{d=null}gt=d,se=a.show(gt!==null)}function Ut(){if(gt===null||!se)return!1;let d=gt;return gt=null,se=a.show(!1),a.seek(d),!0}function je(){let d={live:zt,offered:gt!==null,skip_to:gt};if(zt){d.marked=jt,d.logo=dt===null?"no pictures":ee,d.found=Nt.length,Ot&&(d.separators=ne);try{let h=j();d.clock=h===null?"none":Math.round(Date.now()/1e3-h.end)+" s behind at the live point"}catch{d.clock="error"}}else d.recording=ht,d.breaks=Mt.map(h=>[Math.round(h[0]),Math.round(h[1])]);return d}return{load:f,tick:Pt,skip:Ut,report:je}}var Ti="0.1.22";function Bi(){let a=navigator.userAgent||"",t=/Android|iPhone|iPad|iPod|Mobile/i.test(a),e=/wv|WebView/i.test(a)||window.navigator.standalone===!0;return t||e}var zi={fr:"Francais",fra:"Francais",fre:"Francais",en:"English",eng:"English",de:"Deutsch",deu:"Deutsch",ger:"Deutsch",es:"Espanol",spa:"Espanol",it:"Italiano",ita:"Italiano",pt:"Portugues",por:"Portugues",qaa:"Original",und:"Indefini",mul:"Multiple"};function Pi(a){if(!a)return"Inconnu";let t=a.toLowerCase();return zi[t]||a.toUpperCase()}function Fe(a){let t=a.split(":");if(t.length<2)return null;let e=t.slice(1).join(":");try{let i=e,s=e.length%4;s&&(i+="=".repeat(4-s));let n=atob(i.replace(/-/g,"+").replace(/_/g,"/"));return JSON.parse(n)}catch{return null}}var ni=class extends Zt{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},panel:{type:Object},_channels:{type:Array},_loading:{type:Boolean},_error:{type:String},_playing:{type:Boolean},_selectedChannel:{type:Object},_streamData:{type:Object},_isFullscreen:{type:Boolean},_playerError:{type:String},_playerLoading:{type:Boolean},_currentTime:{type:Number},_duration:{type:Number},_volume:{type:Number},_muted:{type:Boolean},_paused:{type:Boolean},_audioTracks:{type:Array},_textTracks:{type:Array},_selectedAudioIndex:{type:Number},_selectedTextIndex:{type:Number},_isLive:{type:Boolean},_programStart:{type:Number},_programEnd:{type:Number},_showAudioMenu:{type:Boolean},_showTextMenu:{type:Boolean},_expandedChannels:{type:Object},_channelPrograms:{type:Object},_loadingPrograms:{type:Object},_searchQuery:{type:String},_searchResults:{type:Array},_searching:{type:Boolean},_showingSearch:{type:Boolean},_expandedResults:{type:Object},_resultEpisodes:{type:Object},_loadingEpisodes:{type:Object},_castTargets:{type:Array},_selectedTarget:{type:String},_activeTab:{type:String},_recordings:{type:Array},_loadingRecordings:{type:Boolean},_expandedRecordings:{type:Object},_recordingEpisodes:{type:Object},_loadingRecordingEpisodes:{type:Object},_castPlaying:{type:Boolean},_castTarget:{type:String},_castTitle:{type:String},_activeCasts:{type:Object},_focusedCastHost:{type:String},_localPlaybackInitiated:{type:Boolean},_localMinimized:{type:Boolean},_castMinimized:{type:Boolean},_castLoading:{type:Boolean},_tonightChannels:{type:Array},_loadingTonight:{type:Boolean},_episodePlaylist:{type:Array},_episodeIndex:{type:Number},_selectedEntityId:{type:String}}}static get styles(){return Si`
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
    `}constructor(){super(),this._boundOnFullscreenChange=this._onFullscreenChange.bind(this),this._boundOnDocumentClick=this._onDocumentClick.bind(this),this._channels=[],this._loading=!0,this._error=null,this._playing=!1,this._selectedChannel=null,this._streamData=null,this._isFullscreen=!1,this._playerError=null,this._playerLoading=!1,this._player=null,this._entityUnsubscribe=null,this._showPlayOverlay=!1,this._adSkip=null,this._adOffer=!1,this._castSkipTo=null,this._currentTime=0,this._duration=0,this._volume=.5,this._muted=!1,this._paused=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._liveDelay=0,this._showAudioMenu=!1,this._showTextMenu=!1,this._updateInterval=null,this._expandedChannels={},this._channelPrograms={},this._loadingPrograms={},this._searchQuery="",this._searchResults=[],this._searching=!1,this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._searchToken=0,this._castTargets=[],this._isMobile=Bi(),this._selectedTarget=this._isMobile?"":"local",this._activeTab="live",this._recordings=[],this._loadingRecordings=!1,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castProgressInterval=null,this._castBasePosition=0,this._castPositionUpdatedAt=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._castMinimized=!1,this._castLoading=!1,this._tonightChannels=[],this._loadingTonight=!1,this._episodePlaylist=[],this._episodeIndex=-1,this._episodeParentTitle="",this._episodeIsRecording=!1,this._sessionId=this._generateSessionId(),this._selectedEntityId=localStorage.getItem("molotov_selected_entity")||""}_generateSessionId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"molotov-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10)}connectedCallback(){super.connectedCallback(),console.log(`[Molotov Panel] Connected - v${Ti}`),this._hasLoadedChannels=!1,document.addEventListener("fullscreenchange",this._boundOnFullscreenChange),document.addEventListener("click",this._boundOnDocumentClick)}disconnectedCallback(){if(super.disconnectedCallback(),this._playing){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"})}this._cleanupPlayer(),this._stopCastProgressUpdate(),document.removeEventListener("fullscreenchange",this._boundOnFullscreenChange),document.removeEventListener("click",this._boundOnDocumentClick),this._entityUnsubscribe&&(this._entityUnsubscribe(),this._entityUnsubscribe=null)}_onDocumentClick(t){t.composedPath().some(e=>e.classList?.contains("track-menu-container"))||(this._showAudioMenu=!1,this._showTextMenu=!1,this.requestUpdate())}updated(t){t.has("hass")&&this.hass&&(this._hasLoadedChannels||(this._hasLoadedChannels=!0,this._loadChannels()),this._syncWithEntity())}async _loadChannels(){this._loading=!0,this._error=null;try{let t=this._getEntityId();if(!t)throw new Error("Entite Molotov TV introuvable");console.log(`[Molotov Panel] Loading channels for ${t}`);let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"now_playing",media_content_type:"directory"});e&&e.children?(this._channels=e.children.map(i=>this._parseChannel(i)),console.log(`[Molotov Panel] Loaded ${this._channels.length} channels`),this._channels.length>0&&await this._fetchCastTargets(t,this._channels[0].mediaContentId)):this._channels=[],this._loading=!1}catch(t){console.error("[Molotov Panel] Failed to load channels:",t),this._error=t.message||"Erreur lors du chargement des chaines",this._loading=!1}}async _fetchCastTargets(t,e){try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:e,media_content_type:"program"});if(i&&i.children){let s=i.children.filter(n=>n.media_content_id.startsWith("cast:")).map(n=>({mediaContentId:n.media_content_id,title:n.title}));this._castTargets=s,this._isMobile&&s.length>0&&(!this._selectedTarget||this._selectedTarget==="local")&&(this._selectedTarget=s[0].mediaContentId),console.log(`[Molotov Panel] Found ${s.length} cast targets`)}}catch(i){console.error("[Molotov Panel] Failed to fetch cast targets:",i),this._castTargets=[]}}_handleTargetChange(t){let e=t.target.value;this._isMobile&&e==="local"||(this._selectedTarget=e,console.log(`[Molotov Panel] Selected target: ${this._selectedTarget}`))}_switchTab(t){this._activeTab=t,t==="recordings"&&this._recordings.length===0&&this._loadRecordings(),t==="tonight"&&this._tonightChannels.length===0&&this._loadTonight(),this.requestUpdate()}async _loadRecordings(){let t=this._getEntityId();if(!t)return;this._loadingRecordings=!0,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this.requestUpdate();try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"recordings",media_content_type:"directory"});i&&i.children?(this._recordings=i.children.map(s=>{let n=Fe(s.media_content_id);return{mediaContentId:s.media_content_id,title:s.title,thumbnail:s.thumbnail,description:n?.desc||null,isFolder:!!n?.folder}}),console.log(`[Molotov Panel] Loaded ${this._recordings.length} recordings`)):this._recordings=[]}catch(i){console.error("[Molotov Panel] Failed to load recordings:",i),this._recordings=[]}this._loadingRecordings=!1,this.requestUpdate();let e=this._recordings.filter(i=>i.isFolder);e.length>0&&(await Promise.all(e.map(i=>this._fetchRecordingEpisodes(i))),this.requestUpdate())}async _loadTonight(){let t=this._getEntityId();if(t){this._loadingTonight=!0,this.requestUpdate();try{let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"tonight_epg",media_content_type:"directory"});if(e&&e.children&&e.children.length>0){let i=new Map;for(let n of e.children){if(!n.media_content_id.startsWith("tonight_program:"))continue;let r=n.media_content_id.split(":");if(r.length<6)continue;let u=r[1],x=decodeURIComponent(r[2]),M=decodeURIComponent(r[3]),q=parseInt(r[4])*1e3,R=parseInt(r[5])*1e3,st=r.length>6?decodeURIComponent(r.slice(6).join(":")):"",et=n.title;et.startsWith("\u{1F534} ")&&(et=et.substring(3));let rt=et.match(/^\d{2}:\d{2}-\d{2}:\d{2}\s+(.+)$/);rt&&(et=rt[1]);let ot={mediaContentId:n.media_content_id,title:et,thumbnail:n.thumbnail,start:q,end:R,description:st};i.has(u)||i.set(u,{id:u,name:x,thumbnail:M,programs:[]}),i.get(u).programs.push(ot)}let s=Array.from(i.values());for(let n of s)n.programs.sort((r,u)=>r.start-u.start);this._tonightChannels=s,console.log(`[Molotov Panel] Loaded tonight EPG for ${s.length} channels`)}else this._tonightChannels=[]}catch(e){console.error("[Molotov Panel] Failed to load tonight EPG:",e),this._tonightChannels=[]}this._loadingTonight=!1,this.requestUpdate()}}async _toggleRecordingExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedRecordings[i]){this._expandedRecordings={...this._expandedRecordings,[i]:!1},this.requestUpdate();return}if(!e.isFolder){await this._playRecordingDirectly(e);return}this._recordingEpisodes[i]||await this._fetchRecordingEpisodes(e);let s=this._recordingEpisodes[i]||[];if(s.length===0){console.log("[Molotov Panel] No episodes found, playing recording directly"),await this._playRecordingDirectly(e);return}if(s.length===1){console.log("[Molotov Panel] Only 1 episode found, playing it directly"),await this._playRecordingEpisode(s[0],e.title);return}this._expandedRecordings={...this._expandedRecordings,[i]:!0},this.requestUpdate()}async _playRecordingDirectly(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:"",currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=t.mediaContentId;i.startsWith("recording:")&&(i=i.substring(10));let s=this._buildPlayMediaId(`replay:${i}`);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:s,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play recording failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}async _fetchRecordingEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"recording"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._recordingEpisodes={...this._recordingEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for recording "${t.title}"`)}else this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch recording episodes:",s),this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!1},this.requestUpdate()}async _playRecordingEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._recordingEpisodes,!0),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play recording episode failed:",s),this._playerError=s.message||"Erreur de lecture",this._castLoading=!1}}}_buildPlayMediaId(t){if(this._selectedTarget==="local")return`play_local:${this._sessionId}:${t}`;let e=this._selectedTarget.split(":");if(e.length>=2){let i=e[1],s=e.length>=3&&e[2]!=="native"&&e[2]!=="custom"?"":e[2];return s?`cast:${i}:${s}:${t}`:`cast:${i}:${t}`}return`play_local:${t}`}_isLocalPlayback(){return this._selectedTarget==="local"}_parseEpisodeChildren(t){return t.filter(e=>e.media_content_id.startsWith("episode:")||e.media_content_id.startsWith("replay:")||e.media_content_id.startsWith("recording:")||e.can_play).map(e=>{let i=Fe(e.media_content_id);return{mediaContentId:e.media_content_id,title:e.title,thumbnail:e.thumbnail,description:i?.desc||null}})}_initPlaybackFlags(){this._isLocalPlayback()?(this._localPlaybackInitiated=!0,this._localMinimized=!1):this._castLoading=!0}_parseChannel(t){let e=t.media_content_id,[i,s]=e.split("|"),n=null;if(s)try{let et=s,rt=s.length%4;rt&&(et+="=".repeat(4-rt)),n=decodeURIComponent(escape(atob(et.replace(/-/g,"+").replace(/_/g,"/"))))}catch{}let r=i.split(":"),u,x,M;r[0]==="program"?(u=r[1],x=r[2]?parseInt(r[2])*1e3:null,M=r[3]?parseInt(r[3])*1e3:null):r[0]==="live"&&(u=r[1]);let q=t.title.split(" - "),R=q[0],st=q.slice(1).join(" - ")||"Direct";return{id:u,name:R,thumbnail:t.thumbnail,mediaContentId:i,currentProgram:{title:st,description:n,start:x,end:M},nextProgram:null}}_getMolotovEntities(){return!this.hass||!this.hass.states?[]:Object.keys(this.hass.states).filter(t=>t.startsWith("media_player.molotov")).sort()}_getEntityId(){let t=this._getMolotovEntities();return t.length===0?null:t.length===1?t[0]:this._selectedEntityId&&t.includes(this._selectedEntityId)?this._selectedEntityId:t[0]}_handleEntityChange(t){let e=this._getEntityId();this._playing&&e&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState(),this._selectedEntityId=t.target.value,localStorage.setItem("molotov_selected_entity",this._selectedEntityId),this._hasLoadedChannels=!1,this._channels=[],this._recordings=[],this._tonightChannels=[],this._channelPrograms={},this._expandedChannels={},this._loadingPrograms={},this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._loadChannels()}async _toggleChannelExpand(t,e){t.stopPropagation();let i=e.id;if(this._expandedChannels[i]){this._expandedChannels={...this._expandedChannels,[i]:!1},this.requestUpdate();return}this._expandedChannels={...this._expandedChannels,[i]:!0},this._channelPrograms[i]||await this._fetchChannelPrograms(e),this.requestUpdate()}async _fetchChannelPrograms(t){let e=this._getEntityId();if(!e)return;let i=t.id;this._loadingPrograms={...this._loadingPrograms,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`channel:${i}`,media_content_type:"channel"});if(s&&s.children){let n=s.children.filter(r=>r.media_content_id.startsWith("replay:")).map(r=>this._parseReplayItem(r,t));this._channelPrograms={...this._channelPrograms,[i]:n}}}catch(s){console.error("[Molotov Panel] Failed to fetch channel replays:",s),this._channelPrograms={...this._channelPrograms,[i]:[]}}this._loadingPrograms={...this._loadingPrograms,[i]:!1},this.requestUpdate()}_parseReplayItem(t,e){let i=Fe(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,channelName:e.name,description:i?.desc||null}}async _playReplay(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:t.channelName,currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play replay failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}_handleSearchInput(t){this._searchQuery=t.target.value}_handleSearchKeydown(t){t.key==="Enter"&&this._performSearch()}async _performSearch(){let t=this._searchQuery.trim();if(!t)return;let e=this._getEntityId();if(!e)return;let i=++this._searchToken;this._searching=!0,this._showingSearch=!0,this._searchResults=[],this._expandedResults={},this._resultEpisodes={},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`search:${encodeURIComponent(t)}`,media_content_type:"search"});if(i!==this._searchToken)return;if(s&&s.children){let n=s.children.filter(u=>u.media_content_id.startsWith("search_result:")).map(u=>this._parseSearchResult(u)),r=await this._filterResultsWithEpisodes(n,e,i);if(i!==this._searchToken)return;this._searchResults=r,console.log(`[Molotov Panel] Found ${this._searchResults.length} results with episodes for "${t}"`)}else this._searchResults=[]}catch(s){if(i!==this._searchToken)return;console.error("[Molotov Panel] Search failed:",s),this._searchResults=[]}i===this._searchToken&&(this._searching=!1,this.requestUpdate())}async _filterResultsWithEpisodes(t,e,i){let s=t.map(async r=>{try{let u=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:r.mediaContentId,media_content_type:"search_result"});if(u&&u.children){let x=this._parseEpisodeChildren(u.children);if(x.length>0)return(i===void 0||i===this._searchToken)&&(this._resultEpisodes={...this._resultEpisodes,[r.mediaContentId]:x}),r}return null}catch(u){return console.error(`[Molotov Panel] Failed to check episodes for "${r.title}":`,u),null}});return(await Promise.all(s)).filter(r=>r!==null)}_parseSearchResult(t){let e=Fe(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,mediaClass:t.media_class,description:e?.desc||null}}_clearSearch(){this._searchToken++,this._searchQuery="",this._searchResults=[],this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this.requestUpdate()}async _toggleResultExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedResults[i]){this._expandedResults={...this._expandedResults,[i]:!1},this.requestUpdate();return}this._expandedResults={...this._expandedResults,[i]:!0},this._resultEpisodes[i]||await this._fetchResultEpisodes(e),this.requestUpdate()}async _fetchResultEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingEpisodes={...this._loadingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"search_result"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._resultEpisodes={...this._resultEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for "${t.title}"`)}else this._resultEpisodes={...this._resultEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch episodes:",s),this._resultEpisodes={...this._resultEpisodes,[i]:[]}}this._loadingEpisodes={...this._loadingEpisodes,[i]:!1},this.requestUpdate()}_setEpisodePlaylist(t,e,i,s){for(let n of Object.values(i)){let r=n.findIndex(u=>u.mediaContentId===t.mediaContentId);if(r!==-1){this._episodePlaylist=n,this._episodeIndex=r,this._episodeParentTitle=e,this._episodeIsRecording=s;return}}this._episodePlaylist=[],this._episodeIndex=-1}async _playEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._resultEpisodes,!1),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play episode failed:",s),this._playerError=s.message||"Erreur de lecture"}}}_syncWithEntity(){let t=this._getEntityId();if(!t||!this.hass?.states?.[t])return;let e=this.hass.states[t],s=(e.attributes.local_streams||{})[this._sessionId];if(s&&s.url&&this._localPlaybackInitiated){let n=s.url,r=s.drm,u=s.selected_track;if(!this._playing||this._currentStreamUrl!==n){this._currentStreamUrl=n,this._streamData={url:n,drm:r,selectedTrack:u,title:e.attributes.media_title||"En direct",breakSearch:{live_thumbnails_url:s.live_thumbnails_url,recording:s.recording,separated_breaks:s.separated_breaks}},this._playing=!0,this._localMinimized=!1,this._playerError=null,this._playerLoading=!0;let x=this._selectedChannel;x?.currentProgram?.start&&x?.currentProgram?.end?(this._isLive=!0,this._programStart=x.currentProgram.start,this._programEnd=x.currentProgram.end):(this._isLive=!0,this._programStart=null,this._programEnd=null),this.updateComplete.then(()=>this._initDashPlayer())}}else this._playing&&(this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1);if(e.attributes.active_casts&&Object.keys(e.attributes.active_casts).length>0){let n=e.attributes.active_casts,r=e.attributes.cast_target;this._activeCasts=n,this._focusedCastHost=r||null;let u=r?n[r]?.skip_to:null;this._castSkipTo=typeof u=="number"?u:null,(!this._castPlaying||this._castTarget!==r)&&(this._castPlaying=!0,this._castMinimized=this._isMobile,this._castLoading=!1,this._castTarget=r,this._castTitle=e.attributes.media_title||"En cours de lecture",this._startCastProgressUpdate(),console.log("[Molotov Panel] Cast playback detected:",r,"total casts:",Object.keys(n).length)),this._castPositionUpdatedAt=e.attributes.media_position_updated_at?new Date(e.attributes.media_position_updated_at).getTime()/1e3:null,this._castBasePosition=e.attributes.media_position||0,this._duration=e.attributes.media_duration||0,this._volume=e.attributes.volume_level??.5,this._muted=e.attributes.is_volume_muted||!1,this._paused=e.state==="paused",this._castTitle=e.attributes.media_title||this._castTitle,this._isLive=e.attributes.is_live||!1}else this._castPlaying&&(this._onPlaybackEnded()||(this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._castMinimized=!1,this._castLoading=!1,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate()))}async _playChannel(t){let e=this._getEntityId();if(!e){console.error("[Molotov Panel] No entity found");return}this._selectedChannel=t,this._playerError=null,this._episodePlaylist=[],this._episodeIndex=-1,this._initPlaybackFlags(),this._isLocalPlayback()&&t.currentProgram?.start&&t.currentProgram?.end&&(this._programStart=t.currentProgram.start,this._programEnd=t.currentProgram.end,this._isLive=!0);try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}async _initDashPlayer(){if(!this._streamData)return;let t=this.shadowRoot.querySelector("video");if(!t){console.error("[Molotov Panel] Video element not found");return}window.dashjs||await this._loadDashJs(),this._player&&(this._player.reset(),this._player=null),this._adSkip=null,this._adOffer=!1,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null);try{let e=window.dashjs.MediaPlayer().create();this._player=e,e.updateSettings({debug:{logLevel:window.dashjs.Debug.LOG_LEVEL_WARNING},streaming:{buffer:{stableBufferTime:6,bufferTimeAtTopQuality:30,bufferTimeAtTopQualityLongForm:60},delay:{liveDelay:3}}});let i=this._streamData.drm;i&&i.type==="widevine"&&(console.log("[Molotov Panel] Configuring Widevine DRM"),e.setProtectionData({"com.widevine.alpha":{serverURL:i.license_url,httpRequestHeaders:i.headers||{}}})),e.initialize(t,this._streamData.url,!0),this._adSkip=Ei(this._adSkipEnv(t,e));let s=this._streamData.selectedTrack,n="fr";s?.track_audio&&(n=s.track_audio),e.setInitialMediaSettingsFor("audio",{lang:n}),s?.track_text&&e.setInitialMediaSettingsFor("text",{lang:s.track_text}),e.on(window.dashjs.MediaPlayer.events.ERROR,r=>{let u=r.error?.message||r.error||"Erreur de lecture";console.error("[Molotov Panel] Player error:",u),this._playerError=u,this._playerLoading=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.STREAM_INITIALIZED,()=>{console.log("[Molotov Panel] Stream initialized"),this._player===e&&this._adSkip&&this._adSkip.load({contentId:this._streamData.url},this._streamData.breakSearch),this._enforceAudioLanguage(e,s),this._updateTracks(),this._startProgressUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_STARTED,()=>{console.log("[Molotov Panel] Playback started"),this._showPlayOverlay=!1,this._playerLoading=!1,this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PAUSED,()=>{this._paused=!0,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PLAYING,()=>{this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_ENDED,()=>{console.log("[Molotov Panel] Playback ended"),this._onPlaybackEnded()}),t.volume=this._volume,t.muted=this._muted,this._autoplayCheckTimeout=setTimeout(()=>{this._autoplayCheckTimeout=null,t.paused&&!t.currentTime&&(console.log("[Molotov Panel] Autoplay blocked"),this._showPlayOverlay=!0,this.requestUpdate())},1500)}catch(e){console.error("[Molotov Panel] Failed to init player:",e),this._playerError=e.message}}_adSkipEnv(t,e){let i=()=>{try{let s=e.timeAsUTC();return typeof s=="number"&&isFinite(s)?s:null}catch{return null}};return{isLive:()=>{try{return e.isDynamic()}catch{return!1}},joining:()=>this._playerLoading,state:()=>t.paused?"paused":t.readyState>=2?"playing":"other",currentTime:()=>t.currentTime,liveRange:()=>t.seekable&&t.seekable.length?{start:t.seekable.start(0),end:t.seekable.end(t.seekable.length-1)}:null,absoluteTime:s=>{let n=i();return n===null?null:n+(s-t.currentTime)},mediaTime:s=>{let n=i();return n===null?null:t.currentTime+(s-n)},show:s=>(this._adOffer!==s&&(this._adOffer=s,this.requestUpdate()),s),seek:s=>{t.currentTime=s}}}_startProgressUpdate(){this._updateInterval&&clearInterval(this._updateInterval),this._updateInterval=setInterval(()=>{this._updateProgress()},1e3)}_updateProgress(){let t=this.shadowRoot?.querySelector("video");if(!(!t||!this._player)){if(this._currentTime=t.currentTime,this._duration=t.duration||0,this._paused=t.paused,this._adSkip&&this._adSkip.tick(),this._isLive&&t.seekable&&t.seekable.length>0){let e=t.seekable.end(t.seekable.length-1);this._liveDelay=Math.max(0,(e-t.currentTime)*1e3)}this.requestUpdate()}}_startCastProgressUpdate(){this._stopCastProgressUpdate(),this._castProgressInterval=setInterval(()=>{this._updateCastProgress()},1e3)}_stopCastProgressUpdate(){this._castProgressInterval&&(clearInterval(this._castProgressInterval),this._castProgressInterval=null)}_updateCastProgress(){if(!this._castPlaying){this._stopCastProgressUpdate();return}if(this._castBasePosition!=null&&this._castPositionUpdatedAt&&!this._paused){let t=Date.now()/1e3,e=Math.max(0,t-this._castPositionUpdatedAt);this._currentTime=this._castBasePosition+e}else this._currentTime=this._castBasePosition||0;this.requestUpdate()}_updateTracks(){if(!this._player)return;let t=this._player.getTracksFor("audio")||[];this._audioTracks=t.map((n,r)=>({index:r,lang:n.lang,label:Pi(n.lang)}));let e=this._player.getCurrentTrackFor("audio");e&&(this._selectedAudioIndex=t.findIndex(n=>n.index===e.index));let i=this._player.getTracksFor("text")||[];if(this._textTracks=i.map((n,r)=>({index:r,lang:n.lang,label:Pi(n.lang)})),!this._player.isTextEnabled())this._selectedTextIndex=-1;else{let n=this._player.getCurrentTrackFor("text");n&&(this._selectedTextIndex=i.findIndex(r=>r.index===n.index))}console.log("[Molotov Panel] Audio tracks:",this._audioTracks),console.log("[Molotov Panel] Text tracks:",this._textTracks),this.requestUpdate()}_enforceAudioLanguage(t,e){let i=t.getTracksFor("audio");if(!i||i.length===0)return;let n=t.getCurrentTrackFor("audio")?.lang||"",r="fr";if(e?.track_audio&&(r=e.track_audio),n!==r&&n!=="fra"&&n!=="fre"){let u=i.find(x=>x.lang===r||x.lang==="fra"||x.lang==="fre");!u&&(n==="en"||n==="eng"||n==="qaa")&&(u=i.find(x=>x.lang!=="en"&&x.lang!=="eng"&&x.lang!=="qaa")),u&&(console.log("[Molotov Panel] Switching audio to:",u.lang),t.setCurrentTrack(u))}}_loadDashJs(){return new Promise((t,e)=>{if(window.dashjs){t();return}let i=document.createElement("script");i.src="https://cdn.dashjs.org/v4.7.4/dash.all.min.js",i.crossOrigin="anonymous",i.onload=()=>{console.log("[Molotov Panel] dash.js loaded"),t()},i.onerror=()=>{e(new Error("Failed to load dash.js"))},document.head.appendChild(i)})}_cleanupPlayer(){if(this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null),this._player){try{this._player.reset()}catch{}this._player=null}this._adSkip=null,this._adOffer=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._playerLoading=!1}_stopPlayback(){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState()}_resetLocalPlaybackState(){this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._selectedChannel=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._episodePlaylist=[],this._episodeIndex=-1}_onPlaybackEnded(){if(this._episodePlaylist.length===0||this._episodeIndex<0)return!1;let t=this._episodeIndex+1;if(t>=this._episodePlaylist.length)return this._episodePlaylist=[],this._episodeIndex=-1,!1;let e=this._episodePlaylist[t];return this._episodeIndex=t,console.log(`[Molotov Panel] Auto-playing next episode: ${e.title}`),this._episodeIsRecording?this._playRecordingEpisode(e,this._episodeParentTitle):this._playEpisode(e,this._episodeParentTitle),!0}_goBackFromPlayer(){this._localMinimized=!0,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null)}_goBackFromCast(){this._castMinimized=!0}_expandCurrentPlayback(){this._playing&&this._streamData?(this._localMinimized=!1,this._updateInterval||this._startProgressUpdate()):this._castPlaying&&(this._castMinimized=!1)}_togglePlayPause(){let t=this.shadowRoot.querySelector("video");t&&(t.paused?t.play():t.pause())}_localSeek(t){let e=this.shadowRoot.querySelector("video");if(!e)return;if(t===null){e.currentTime=0;return}let i=e.currentTime+t;e.currentTime=Math.max(0,Math.min(e.duration||1/0,i))}_localSeekBeginning(){this._localSeek(null)}_localSkipBack30(){this._localSeek(-30)}_localSkipBack10(){this._localSeek(-10)}_localSkipForward30(){this._localSeek(30)}_localSkipAd(){this._adSkip&&this._adSkip.skip()}_handleProgressClick(t){let i=t.currentTarget.getBoundingClientRect(),s=(t.clientX-i.left)/i.width;if(this._isLive&&this._programStart&&this._programEnd){if(this._player?.getDVRSeekOffset?.(0)!==void 0){let r=this._player.duration(),u=s*r;this._player.seek(u)}}else if(this._duration){let n=this.shadowRoot.querySelector("video");n&&(n.currentTime=s*this._duration)}}_handleVolumeChange(t){let e=parseFloat(t.target.value);this._volume=e;let i=this.shadowRoot.querySelector("video");i&&(i.volume=e,i.muted=e===0,this._muted=e===0)}_toggleMute(){let t=this.shadowRoot.querySelector("video");t&&(this._muted=!this._muted,t.muted=this._muted,this.requestUpdate())}_selectAudioTrack(t){if(!this._player||t<0||t>=this._audioTracks.length)return;let e=this._player.getTracksFor("audio");e&&e[t]&&(this._player.setCurrentTrack(e[t]),this._selectedAudioIndex=t),this._showAudioMenu=!1,this.requestUpdate()}_selectTextTrack(t){if(this._player){if(t===-1)this._player.enableText(!1),this._selectedTextIndex=-1;else if(t>=0&&t<this._textTracks.length){let e=this._player.getTracksFor("text");e&&e[t]&&(this._player.enableText(!0),this._player.setCurrentTrack(e[t]),this._selectedTextIndex=t)}this._showTextMenu=!1,this.requestUpdate()}}_toggleAudioMenu(t){t.stopPropagation(),this._showAudioMenu=!this._showAudioMenu,this._showTextMenu=!1,this.requestUpdate()}_toggleTextMenu(t){t.stopPropagation(),this._showTextMenu=!this._showTextMenu,this._showAudioMenu=!1,this.requestUpdate()}_toggleFullscreen(){let t=this.shadowRoot.querySelector(".video-wrapper");t&&(document.fullscreenElement?document.exitFullscreen():t.requestFullscreen().catch(e=>{console.error("[Molotov Panel] Fullscreen error:",e)}))}_onFullscreenChange(){this._isFullscreen=!!document.fullscreenElement,this.requestUpdate()}_handlePlayOverlayClick(){let t=this.shadowRoot.querySelector("video");t&&(t.muted=!1,t.play().catch(e=>console.error("[Molotov Panel] Manual play error:",e)),this._showPlayOverlay=!1,this.requestUpdate())}_formatTime(t){if(!t||!isFinite(t))return"00:00";let e=Math.floor(t/3600),i=Math.floor(t%3600/60),s=Math.floor(t%60);return e>0?`${e}:${i.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`:`${i}:${s.toString().padStart(2,"0")}`}_formatClockTime(t){return t?new Date(t).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):""}_getProgressPercent(){if(this._isLive&&this._programStart&&this._programEnd){let t=Date.now()-(this._liveDelay||0),e=this._programEnd-this._programStart;if(e<=0)return 100;let i=t-this._programStart;return Math.min(100,Math.max(0,i/e*100))}else if(this._duration>0&&isFinite(this._duration))return this._currentTime/this._duration*100;return 0}render(){let t=this._playing&&this._streamData,e=t&&!this._localMinimized,i=this._castPlaying&&!this._castMinimized,s=!e&&!i;return b`
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
        @keydown=${x=>this._activateOnKey(x,()=>this._playTonightProgram(t,e))}
      >
        ${t.thumbnail?b`<img class="tonight-program-thumb" src=${t.thumbnail} loading="lazy" @load=${x=>x.target.style.display=""} @error=${x=>x.target.style.display="none"} />`:""}
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
          @click=${x=>this._toggleRecordingExpand(x,t)}
          @keydown=${x=>this._activateOnKey(x,()=>this._toggleRecordingExpand(x,t))}
        >
          ${u?b`<ha-icon class="expand-icon" icon="mdi:play-circle-outline"></ha-icon>`:b`<ha-icon
                class="expand-icon ${i?"expanded":""}"
                icon="mdi:chevron-right"
              ></ha-icon>`}
          ${t.thumbnail?b`<img
                class="recording-thumb"
                src=${t.thumbnail}
                loading="lazy"
                @load=${x=>x.target.style.display=""} @error=${x=>x.target.style.display="none"}
              />`:b`<div class="recording-thumb"></div>`}
          <div class="recording-info">
            <div class="recording-title">${t.title}</div>
            ${t.description?b`<div class="recording-subtitle">${t.description}</div>`:""}
          </div>
        </div>
        ${i?b`
              <div class="episodes-list">
                ${n?b`<div class="episodes-loading">Chargement des episodes...</div>`:s.length>0?s.map(x=>b`
                        <div
                          class="episode-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playRecordingEpisode(x,t.title)}
                          @keydown=${M=>this._activateOnKey(M,()=>this._playRecordingEpisode(x,t.title))}
                        >
                          ${x.thumbnail?b`<img class="episode-thumb" src=${x.thumbnail} loading="lazy" @load=${M=>M.target.style.display=""} @error=${M=>M.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${x.title}</div>
                            ${x.description?b`<div class="episode-desc">${x.description}</div>`:""}
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
    `}_renderChannelItem(t){let e=t.currentProgram,i=e?.start?this._formatClockTime(e.start):"",s=e?.end?this._formatClockTime(e.end):"",n=i&&s?`${i} - ${s}`:"",r=this._expandedChannels[t.id],u=this._channelPrograms[t.id]||[],x=this._loadingPrograms[t.id];return b`
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
                ${x?b`<div class="replay-loading">Chargement...</div>`:u.length>0?u.map(M=>b`
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
    `}async _focusCast(t){let e=this._getEntityId();if(!e)return;let i=this._activeCasts[t];if(!i)return;let s=t;try{await this.hass.callService("media_player","select_source",{entity_id:e,source:s}),this._focusedCastHost=t,this._castTarget=t,this._castTitle=i.title||"En cours de lecture",console.log("[Molotov Panel] Focused cast:",t)}catch(n){console.error("[Molotov Panel] Focus cast failed:",n)}}async _stopSpecificCast(t,e){t.stopPropagation();let i=this._getEntityId();if(!i||!this._activeCasts[e])return;let n=e;try{await this.hass.callService("media_player","select_source",{entity_id:i,source:n}),await new Promise(r=>setTimeout(r,200)),await this.hass.callService("media_player","media_stop",{entity_id:i}),console.log("[Molotov Panel] Stopped cast:",e)}catch(r){console.error("[Molotov Panel] Stop specific cast failed:",r)}}async _stopCastPlayback(){let t=this._getEntityId();if(t){try{await this.hass.callService("media_player","media_stop",{entity_id:t})}catch(e){console.error("[Molotov Panel] Stop cast failed:",e)}this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate(),this._castMinimized=!1,this._castLoading=!1,this._episodePlaylist=[],this._episodeIndex=-1}}async _toggleCastPlayPause(){let t=this._getEntityId();if(t)try{this._paused?await this.hass.callService("media_player","media_play",{entity_id:t}):await this.hass.callService("media_player","media_pause",{entity_id:t})}catch(e){console.error("[Molotov Panel] Play/pause cast failed:",e)}}async _castSkipForward(){let t=this._getEntityId();if(t)try{await this.hass.callService("media_player","media_next_track",{entity_id:t})}catch(e){console.error("[Molotov Panel] Skip forward failed:",e)}}_setCastPosition(t){this._currentTime=t,this._castBasePosition=t,this._castPositionUpdatedAt=Date.now()/1e3}async _castSeek(t){let e=this._getEntityId();if(e)try{await this.hass.callService("media_player","media_seek",{entity_id:e,seek_position:t}),this._setCastPosition(t)}catch(i){console.error("[Molotov Panel] Cast seek failed:",i)}}async _castSeekBeginning(){await this._castSeek(0)}async _castSkipBack30(){await this._castSeek(Math.max(0,this._currentTime-30))}async _castSkipBack10(){await this._castSeek(Math.max(0,this._currentTime-10))}async _castSkipAd(){this._castSkipTo!==null&&await this._castSeek(this._castSkipTo)}async _handleCastSeek(t){let e=this._getEntityId();if(!e||!this._duration)return;let s=t.currentTarget.getBoundingClientRect(),r=(t.clientX-s.left)/s.width*this._duration;try{await this.hass.callService("media_player","media_seek",{entity_id:e,seek_position:r}),this._setCastPosition(r)}catch(u){console.error("[Molotov Panel] Seek failed:",u)}}async _handleCastVolumeChange(t){let e=this._getEntityId();if(!e)return;let i=parseFloat(t.target.value);this._volume=i;try{await this.hass.callService("media_player","volume_set",{entity_id:e,volume_level:i})}catch(s){console.error("[Molotov Panel] Volume change failed:",s)}}async _toggleCastMute(){let t=this._getEntityId();if(t)try{await this.hass.callService("media_player","volume_mute",{entity_id:t,is_volume_muted:!this._muted}),this._muted=!this._muted}catch(e){console.error("[Molotov Panel] Mute toggle failed:",e)}}};customElements.define("molotov-panel",ni);console.log(`[Molotov Panel] Registered - v${Ti}`);
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
