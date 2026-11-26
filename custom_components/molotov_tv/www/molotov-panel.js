var qe=typeof window<"u"&&window.customElements!=null&&window.customElements.polyfillWrapFlushCallback!==void 0;var Kt=(a,t,e=null)=>{for(;t!==e;){let i=t.nextSibling;a.removeChild(t),t=i}};var gt=`{{lit-${String(Math.random()).slice(2)}}}`,Ve=`<!--${gt}-->`,di=new RegExp(`${gt}|${Ve}`),oe="$lit$",Yt=class{constructor(t,e){this.parts=[],this.element=e;let i=[],s=[],n=document.createTreeWalker(e.content,133,null,!1),r=0,u=-1,w=0,{strings:R,values:{length:q}}=t;for(;w<q;){let N=n.nextNode();if(N===null){n.currentNode=s.pop();continue}if(u++,N.nodeType===1){if(N.hasAttributes()){let it=N.attributes,{length:et}=it,nt=0;for(let rt=0;rt<et;rt++)hi(it[rt].name,oe)&&nt++;for(;nt-- >0;){let rt=R[w],At=Me.exec(rt)[2],ut=At.toLowerCase()+oe,pt=N.getAttribute(ut);N.removeAttribute(ut);let lt=pt.split(di);this.parts.push({type:"attribute",index:u,name:At,strings:lt}),w+=lt.length-1}}N.tagName==="TEMPLATE"&&(s.push(N),n.currentNode=N.content)}else if(N.nodeType===3){let it=N.data;if(it.indexOf(gt)>=0){let et=N.parentNode,nt=it.split(di),rt=nt.length-1;for(let At=0;At<rt;At++){let ut,pt=nt[At];if(pt==="")ut=Et();else{let lt=Me.exec(pt);lt!==null&&hi(lt[2],oe)&&(pt=pt.slice(0,lt.index)+lt[1]+lt[2].slice(0,-oe.length)+lt[3]),ut=document.createTextNode(pt)}et.insertBefore(ut,N),this.parts.push({type:"node",index:++u})}nt[rt]===""?(et.insertBefore(Et(),N),i.push(N)):N.data=nt[rt],w+=rt}}else if(N.nodeType===8)if(N.data===gt){let it=N.parentNode;(N.previousSibling===null||u===r)&&(u++,it.insertBefore(Et(),N)),r=u,this.parts.push({type:"node",index:u}),N.nextSibling===null?N.data="":(i.push(N),u--),w++}else{let it=-1;for(;(it=N.data.indexOf(gt,it+1))!==-1;)this.parts.push({type:"node",index:-1}),w++}}for(let N of i)N.parentNode.removeChild(N)}},hi=(a,t)=>{let e=a.length-t.length;return e>=0&&a.slice(e)===t},me=a=>a.index!==-1,Et=()=>document.createComment(""),Me=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;var Ge=133;function He(a,t){let{element:{content:e},parts:i}=a,s=document.createTreeWalker(e,Ge,null,!1),n=ye(i),r=i[n],u=-1,w=0,R=[],q=null;for(;s.nextNode();){u++;let N=s.currentNode;for(N.previousSibling===q&&(q=null),t.has(N)&&(R.push(N),q===null&&(q=N)),q!==null&&w++;r!==void 0&&r.index===u;)r.index=q!==null?-1:r.index-w,n=ye(i,n),r=i[n]}R.forEach(N=>N.parentNode.removeChild(N))}var $i=a=>{let t=a.nodeType===11?0:1,e=document.createTreeWalker(a,Ge,null,!1);for(;e.nextNode();)t++;return t},ye=(a,t=-1)=>{for(let e=t+1;e<a.length;e++){let i=a[e];if(me(i))return e}return-1};function ui(a,t,e=null){let{element:{content:i},parts:s}=a;if(e==null){i.appendChild(t);return}let n=document.createTreeWalker(i,Ge,null,!1),r=ye(s),u=0,w=-1;for(;n.nextNode();)for(w++,n.currentNode===e&&(u=$i(t),e.parentNode.insertBefore(t,e));r!==-1&&s[r].index===w;){if(u>0){for(;r!==-1;)s[r].index+=u,r=ye(s,r);return}r=ye(s,r)}}var Ni=new WeakMap;var Xt=a=>typeof a=="function"&&Ni.has(a);var ht={},Re={};var Ut=class{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(let i of this.__parts)i!==void 0&&i.setValue(t[e]),e++;for(let i of this.__parts)i!==void 0&&i.commit()}_clone(){let t=qe?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],i=this.template.parts,s=document.createTreeWalker(t,133,null,!1),n=0,r=0,u,w=s.nextNode();for(;n<i.length;){if(u=i[n],!me(u)){this.__parts.push(void 0),n++;continue}for(;r<u.index;)r++,w.nodeName==="TEMPLATE"&&(e.push(w),s.currentNode=w.content),(w=s.nextNode())===null&&(s.currentNode=e.pop(),w=s.nextNode());if(u.type==="node"){let R=this.processor.handleTextExpression(this.options);R.insertAfterNode(w.previousSibling),this.__parts.push(R)}else this.__parts.push(...this.processor.handleAttributeExpressions(w,u.name,u.strings,this.options));n++}return qe&&(document.adoptNode(t),customElements.upgrade(t)),t}};var pi=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:a=>a}),Li=` ${gt} `,Ct=class{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){let t=this.strings.length-1,e="",i=!1;for(let s=0;s<t;s++){let n=this.strings[s],r=n.lastIndexOf("<!--");i=(r>-1||i)&&n.indexOf("-->",r+1)===-1;let u=Me.exec(n);u===null?e+=n+(i?Li:Ve):e+=n.substr(0,u.index)+u[1]+u[2]+oe+u[3]+gt}return e+=this.strings[t],e}getTemplateElement(){let t=document.createElement("template"),e=this.getHTML();return pi!==void 0&&(e=pi.createHTML(e)),t.innerHTML=e,t}};var Oe=a=>a===null||!(typeof a=="object"||typeof a=="function"),$e=a=>Array.isArray(a)||!!(a&&a[Symbol.iterator]),ae=class{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let s=0;s<i.length-1;s++)this.parts[s]=this._createPart()}_createPart(){return new be(this)}_getValue(){let t=this.strings,e=t.length-1,i=this.parts;if(e===1&&t[0]===""&&t[1]===""){let n=i[0].value;if(typeof n=="symbol")return String(n);if(typeof n=="string"||!$e(n))return n}let s="";for(let n=0;n<e;n++){s+=t[n];let r=i[n];if(r!==void 0){let u=r.value;if(Oe(u)||!$e(u))s+=typeof u=="string"?u:String(u);else for(let w of u)s+=typeof w=="string"?w:String(w)}}return s+=t[e],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}},be=class{constructor(t){this.value=void 0,this.committer=t}setValue(t){t!==ht&&(!Oe(t)||t!==this.value)&&(this.value=t,Xt(t)||(this.committer.dirty=!0))}commit(){for(;Xt(this.value);){let t=this.value;this.value=ht,t(this)}this.value!==ht&&this.committer.commit()}},Qt=class a{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(Et()),this.endNode=t.appendChild(Et())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=Et()),t.__insert(this.endNode=Et())}insertAfterPart(t){t.__insert(this.startNode=Et()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(this.startNode.parentNode===null)return;for(;Xt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=ht,e(this)}let t=this.__pendingValue;t!==ht&&(Oe(t)?t!==this.value&&this.__commitText(t):t instanceof Ct?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):$e(t)?this.__commitIterable(t):t===Re?(this.value=Re,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){let e=this.startNode.nextSibling;t=t??"";let i=typeof t=="string"?t:String(t);e===this.endNode.previousSibling&&e.nodeType===3?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){let e=this.options.templateFactory(t);if(this.value instanceof Ut&&this.value.template===e)this.value.update(t.values);else{let i=new Ut(e,t.processor,this.options),s=i._clone();i.update(t.values),this.__commitNode(s),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());let e=this.value,i=0,s;for(let n of t)s=e[i],s===void 0&&(s=new a(this.options),e.push(s),i===0?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(n),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){Kt(this.startNode.parentNode,t.nextSibling,this.endNode)}},ve=class{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,i.length!==2||i[0]!==""||i[1]!=="")throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;Xt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=ht,e(this)}if(this.__pendingValue===ht)return;let t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=ht}},xe=class extends ae{constructor(t,e,i){super(t,e,i),this.single=i.length===2&&i[0]===""&&i[1]===""}_createPart(){return new Ne(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}},Ne=class extends be{},_i=!1;(()=>{try{let a={get capture(){return _i=!0,!1}};window.addEventListener("test",a,a),window.removeEventListener("test",a,a)}catch{}})();var we=class{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=s=>this.handleEvent(s)}setValue(t){this.__pendingValue=t}commit(){for(;Xt(this.__pendingValue);){let n=this.__pendingValue;this.__pendingValue=ht,n(this)}if(this.__pendingValue===ht)return;let t=this.__pendingValue,e=this.value,i=t==null||e!=null&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),s=t!=null&&(e==null||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=Ui(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=ht}handleEvent(t){typeof this.value=="function"?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}},Ui=a=>a&&(_i?{capture:a.capture,passive:a.passive,once:a.once}:a.capture);function We(a){let t=Jt.get(a.type);t===void 0&&(t={stringsArray:new WeakMap,keyString:new Map},Jt.set(a.type,t));let e=t.stringsArray.get(a.strings);if(e!==void 0)return e;let i=a.strings.join(gt);return e=t.keyString.get(i),e===void 0&&(e=new Yt(a,a.getTemplateElement()),t.keyString.set(i,e)),t.stringsArray.set(a.strings,e),e}var Jt=new Map;var Dt=new WeakMap,Ke=(a,t,e)=>{let i=Dt.get(t);i===void 0&&(Kt(t,t.firstChild),Dt.set(t,i=new Qt(Object.assign({templateFactory:We},e))),i.appendInto(t)),i.setValue(a),i.commit()};var Le=class{handleAttributeExpressions(t,e,i,s){let n=e[0];return n==="."?new xe(t,e.slice(1),i).parts:n==="@"?[new we(t,e.slice(1),s.eventContext)]:n==="?"?[new ve(t,e.slice(1),i)]:new ae(t,e,i).parts}handleTextExpression(t){return new Qt(t)}},Ye=new Le;typeof window<"u"&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var v=(a,...t)=>new Ct(a,t,"html",Ye);var gi=(a,t)=>`${a}--${t}`,Ue=!0;typeof window.ShadyCSS>"u"?Ue=!1:typeof window.ShadyCSS.prepareTemplateDom>"u"&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),Ue=!1);var Fi=a=>t=>{let e=gi(t.type,a),i=Jt.get(e);i===void 0&&(i={stringsArray:new WeakMap,keyString:new Map},Jt.set(e,i));let s=i.stringsArray.get(t.strings);if(s!==void 0)return s;let n=t.strings.join(gt);if(s=i.keyString.get(n),s===void 0){let r=t.getTemplateElement();Ue&&window.ShadyCSS.prepareTemplateDom(r,a),s=new Yt(t,r),i.keyString.set(n,s)}return i.stringsArray.set(t.strings,s),s},Bi=["html","svg"],zi=a=>{Bi.forEach(t=>{let e=Jt.get(gi(t,a));e!==void 0&&e.keyString.forEach(i=>{let{element:{content:s}}=i,n=new Set;Array.from(s.querySelectorAll("style")).forEach(r=>{n.add(r)}),He(i,n)})})},mi=new Set,ji=(a,t,e)=>{mi.add(a);let i=e?e.element:document.createElement("template"),s=t.querySelectorAll("style"),{length:n}=s;if(n===0){window.ShadyCSS.prepareTemplateStyles(i,a);return}let r=document.createElement("style");for(let R=0;R<n;R++){let q=s[R];q.parentNode.removeChild(q),r.textContent+=q.textContent}zi(a);let u=i.content;e?ui(e,r,u.firstChild):u.insertBefore(r,u.firstChild),window.ShadyCSS.prepareTemplateStyles(i,a);let w=u.querySelector("style");if(window.ShadyCSS.nativeShadow&&w!==null)t.insertBefore(w.cloneNode(!0),t.firstChild);else if(e){u.insertBefore(r,u.firstChild);let R=new Set;R.add(r),He(e,R)}},yi=(a,t,e)=>{if(!e||typeof e!="object"||!e.scopeName)throw new Error("The `scopeName` option is required.");let i=e.scopeName,s=Dt.has(t),n=Ue&&t.nodeType===11&&!!t.host,r=n&&!mi.has(i),u=r?document.createDocumentFragment():t;if(Ke(a,u,Object.assign({templateFactory:Fi(i)},e)),r){let w=Dt.get(u);Dt.delete(u);let R=w.value instanceof Ut?w.value.template:void 0;ji(i,u,R),Kt(t,t.firstChild),t.appendChild(u),Dt.set(t,w)}!s&&n&&window.ShadyCSS.styleElement(t.host)};var bi;window.JSCompiler_renameProperty=(a,t)=>a;var ei={toAttribute(a,t){switch(t){case Boolean:return a?"":null;case Object:case Array:return a==null?a:JSON.stringify(a)}return a},fromAttribute(a,t){switch(t){case Boolean:return a!==null;case Number:return a===null?null:Number(a);case Object:case Array:return JSON.parse(a)}return a}},vi=(a,t)=>t!==a&&(t===t||a===a),Xe={attribute:!0,type:String,converter:ei,reflect:!1,hasChanged:vi},Qe=1,Je=4,Ze=8,ti=16,ii="finalized",le=class extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();let t=[];return this._classProperties.forEach((e,i)=>{let s=this._attributeNameForProperty(i,e);s!==void 0&&(this._attributeToPropertyMap.set(s,i),t.push(s))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;let t=Object.getPrototypeOf(this)._classProperties;t!==void 0&&t.forEach((e,i)=>this._classProperties.set(i,e))}}static createProperty(t,e=Xe){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;let i=typeof t=="symbol"?Symbol():`__${t}`,s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Object.defineProperty(this.prototype,t,s)}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){let n=this[t];this[e]=s,this.requestUpdateInternal(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||Xe}static finalize(){let t=Object.getPrototypeOf(this);if(t.hasOwnProperty(ii)||t.finalize(),this[ii]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){let e=this.properties,i=[...Object.getOwnPropertyNames(e),...typeof Object.getOwnPropertySymbols=="function"?Object.getOwnPropertySymbols(e):[]];for(let s of i)this.createProperty(s,e[s])}}static _attributeNameForProperty(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=vi){return i(t,e)}static _propertyValueFromAttribute(t,e){let i=e.type,s=e.converter||ei,n=typeof s=="function"?s:s.fromAttribute;return n?n(t,i):t}static _propertyValueToAttribute(t,e){if(e.reflect===void 0)return;let i=e.type,s=e.converter;return(s&&s.toAttribute||ei.toAttribute)(t,i)}initialize(){this._updateState=0,this._updatePromise=new Promise(t=>this._enableUpdatingResolver=t),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){let i=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,i)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){this._enableUpdatingResolver!==void 0&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=Xe){let s=this.constructor,n=s._attributeNameForProperty(t,i);if(n!==void 0){let r=s._propertyValueToAttribute(e,i);if(r===void 0)return;this._updateState=this._updateState|Ze,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._updateState=this._updateState&~Ze}}_attributeToProperty(t,e){if(this._updateState&Ze)return;let i=this.constructor,s=i._attributeToPropertyMap.get(t);if(s!==void 0){let n=i.getPropertyOptions(s);this._updateState=this._updateState|ti,this[s]=i._propertyValueFromAttribute(e,n),this._updateState=this._updateState&~ti}}requestUpdateInternal(t,e,i){let s=!0;if(t!==void 0){let n=this.constructor;i=i||n.getPropertyOptions(t),n._valueHasChanged(this[t],e,i.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),i.reflect===!0&&!(this._updateState&ti)&&(this._reflectingProperties===void 0&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,i))):s=!1}!this._hasRequestedUpdate&&s&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=this._updateState|Je;try{await this._updatePromise}catch{}let t=this.performUpdate();return t!=null&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return this._updateState&Je}get hasUpdated(){return this._updateState&Qe}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1,e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(i){throw t=!1,this._markUpdated(),i}t&&(this._updateState&Qe||(this._updateState=this._updateState|Qe,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~Je}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){this._reflectingProperties!==void 0&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,i)=>this._propertyToAttribute(i,this[i],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}};bi=ii;le[bi]=!0;var xi=Element.prototype,js=xi.msMatchesSelector||xi.webkitMatchesSelector;var De=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,si=Symbol(),Se=class{constructor(t,e){if(e!==si)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return this._styleSheet===void 0&&(De?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}},wi=a=>new Se(String(a),si),qi=a=>{if(a instanceof Se)return a.cssText;if(typeof a=="number")return a;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${a}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`)},Si=(a,...t)=>{let e=t.reduce((i,s,n)=>i+qi(s)+a[n+1],a[0]);return new Se(e,si)};(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");var ki={},Zt=class extends le{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;let t=this.getStyles();if(Array.isArray(t)){let e=(n,r)=>n.reduceRight((u,w)=>Array.isArray(w)?e(w,u):(u.add(w),u),r),i=e(t,new Set),s=[];i.forEach(n=>s.unshift(n)),this._styles=s}else this._styles=t===void 0?[]:[t];this._styles=this._styles.map(e=>{if(e instanceof CSSStyleSheet&&!De){let i=Array.prototype.slice.call(e.cssRules).reduce((s,n)=>s+n.cssText,"");return wi(i)}return e})}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){let t=this.constructor._styles;t.length!==0&&(window.ShadyCSS!==void 0&&!window.ShadyCSS.nativeShadow?window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(e=>e.cssText),this.localName):De?this.renderRoot.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):this._needsShimAdoptedStyleSheets=!0)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&window.ShadyCSS!==void 0&&window.ShadyCSS.styleElement(this)}update(t){let e=this.render();super.update(t),e!==ki&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(i=>{let s=document.createElement("style");s.textContent=i.cssText,this.renderRoot.appendChild(s)}))}render(){return ki}};Zt.finalized=!0;Zt.render=yi;Zt.shadowRootOptions={mode:"open"};var D=(()=>{function It(c,g){let p=[],o=0;for(;o<c.length;){if(!c[o]){o++;continue}let l=o,_=o+1;for(;_<c.length&&_-l<=g+1;)c[_]&&(l=_),_++;p.push([o,l]),o=l+1}return p}function Be(c,g,p){let o=0;for(let x of c)x&&o++;if(!(p>0)||o*2<c.length)return null;let l=It(c,3).filter(x=>(x[1]-x[0]+1)*p>=60),_=[];for(let x=0;x+1<l.length;x++){let P=l[x],A=l[x+1],L=g+(P[1]+1)*p,M=g+A[0]*p,C=0;for(let T=P[1]+1;T<A[0];T++)c[T]&&C++;M-L>=150&&M-L<=800&&C*2<A[0]-P[1]-1&&_.push([L,M])}return _}function Ft(c,g,p){let o=new Array(c.length).fill(!1);for(let l=0;l<c.length;l++){if(!p[l])continue;let _=[];for(let x=Math.max(0,l-2);x<=Math.min(c.length-1,l+2);x++)p[x]&&_.push(c[x]);_.sort((x,P)=>x-P),o[l]=_[_.length>>1]<.5*g}return o}function te(c){let g=new Array(c.length).fill(!1);for(let p of It(c,0))if(p[1]-p[0]+1>=5)for(let o=p[0];o<=p[1];o++)g[o]=!0;return g}function Bt(c,g,p,o,l){let _=te(c),x=(C,T)=>{if(C<0||T>_.length)return!1;let U=0;for(let wt=C;wt<T;wt++)_[wt]||U++;return U>=8},P=C=>{let T=(C[1]+1-C[0])*g;return x(C[0]-15,C[0])&&x(C[1]+1,C[1]+1+15)&&T>=150&&T<=1200},A=It(_,7);if(!p||!o)return A.filter(P);let L=l?A.filter(C=>C[1]-C[0]+1>=10):A,M=[];for(let C of ot(L,p,o,g)){let T=L.filter(U=>U[0]>=C[0]&&U[1]<=C[1]);if(P(C)&&(!l||T.length===1||T.some(P)))M.push(C);else for(let U of T)P(U)&&M.push([U[0],U[1]])}return M}function ot(c,g,p,o){let l=[];for(let _ of c){let x=l[l.length-1];x&&(_[1]+1-x[0])*o<=1200&&bt(x[1]+1,_[0],g,p)?x[1]=_[1]:l.push([_[0],_[1]])}return l}function bt(c,g,p,o){let l=0;for(let _=c;_<g;_++)(p[_]||o[_])&&l++;return g-c<=29&&l>=g-c-7&&F(p,c,g)<=10&&F(o,c,g)<=12}function F(c,g,p){let o=0,l=0;for(let _=g;_<p;_++)o=c[_]?o+1:0,l=Math.max(l,o);return l}function Mt(c,g,p,o){let l=c,_=o?c.map((M,C)=>!M&&o[C]):null,x=o?c.map((M,C)=>M&&!o[C]):null,P=Bt(l,p,x,_,!0);if(o){l=new Array(c.length).fill(!1);let M=new Array(c.length).fill(!1);for(let C of P)for(let T=C[0];T<=C[1];T++)l[T]=c[T]&&o[T],M[T]=c[T]&&!o[T];P=Bt(l,p,M,_)}let A=te(l),L=o?zt(c,o,P,g,p):[];return P.map(M=>{let C=It(A.slice(M[0],M[1]+1),0),T=Rt(o?Pt(C,M[0],c,o):C);return[g+(M[0]+T[0])*p,g+(M[0]+T[1]+1)*p]}).concat(L)}function Rt(c){let g=0,p=c.length-1;for(;p>g&&c[p][1]-c[p][0]+1<10;)p--;for(;g<p&&c[g][1]-c[g][0]+1<10;)g++;return[c[g][0],c[p][1]]}function Pt(c,g,p,o){let l=[];for(let _ of c){let x=l[l.length-1];x&&!_t(g+x[1]+1,g+_[0],p,o)?x[1]=_[1]:l.push([_[0],_[1]])}return l}function _t(c,g,p,o){let l=0;for(let _=c;_<g;_++)if(!p[_]&&!o[_]||(l=o[_]?0:l+1,l>=5))return!0;return!1}function zt(c,g,p,o,l){let _=te(c),x=(A,L)=>{if(A<0||L>_.length)return!1;let M=0;for(let C=A;C<L;C++)_[C]||M++;return M>=12},P=[];for(let A of Bt(g,l)){if(p.some(U=>U[0]<=A[1]&&A[0]<=U[1]))continue;let L=0;for(let U=A[0];U<=A[1];U++)c[U]&&L++;if(L<.5*(A[1]-A[0]+1))continue;let M=-1,C=-1;for(let U=A[0];U<=A[1];U++)_[U]&&(M<0&&(M=U),C=U+1);if(M<0||(C-M)*l<150||!x(M-15,M)||!x(C,C+15))continue;let T=Rt(Pt(It(_.slice(A[0],A[1]+1),0),A[0],c,g));P.push([o+(A[0]+T[0])*l,o+(A[0]+T[1]+1)*l])}return P}function ft(c,g){if(c===null)return g||[];if(g===null)return c;let p=[];for(let o of c)for(let l of g){let _=Math.max(o[0],l[0]),x=Math.min(o[1],l[1]);x-_<60||p.push([Math.abs(o[0]-l[0])<=90?l[0]:_,Math.abs(o[1]-l[1])<=90?l[1]:x])}return p}function $t(c,g,p){let o=Math.floor(g*.22),l=Math.floor(p*.22),_=o-1,x=l-1,P=_*x,A=[[0,0],[g-o,0],[0,p-l],[g-o,p-l]],L=A.map(()=>new Uint8Array(P>0?c*P:0)),M=new Array(c).fill(!1),C=-1;function T(I,H){if(!(P<=0||I<0||I>=c||H.length<g*p)){for(let z=0;z<A.length;z++){let W=A[z][0],V=A[z][1],J=L[z],K=I*P;for(let j=0;j<x;j++){let Y=(V+j)*g+W;for(let St=0;St<_;St++){let Lt=H[Y];J[K++]=Math.min(255,Math.abs(H[Y+1]-Lt)+Math.abs(H[Y+g]-Lt)),Y++}}}M[I]=!0}}function U(I,H,z){let W=L[I],V=new Uint8Array(P);for(let Y=0;Y<P;Y++){z.fill(0);for(let fe of H)z[W[fe*P+Y]]++;let St=0,Lt=0;for(;St+z[Lt]<=H.length>>1;)St+=z[Lt++];V[Y]=Lt}let J=Math.max(1,Array.from(V).sort((Y,St)=>Y-St)[Math.floor(P*.92)]),K=[],j=0;for(let Y=0;Y<P;Y++)V[Y]>=J&&(K.push(Y),j+=V[Y]);return K.length===0?null:{corner:I,median:V,mask:K,strength:j/K.length,whole:j}}function wt(I,H,z,W){let V=null;for(let J=I;J<H;J++){let K=U(J,z,W);K!==null&&(V===null||K.strength>V.strength)&&(V=K)}return V}function Te(I,H){let z=L[I.corner],W=new Float64Array(c),V=[];for(let J of H){let K=J*P,j=0;for(let Y of I.mask)j+=Math.min(z[K+Y],I.median[Y]);W[J]=j/I.whole,V.push(W[J])}return V.sort((J,K)=>J-K),I.score=W,I.usual=V[V.length>>1],I}function _e(){let I=[];for(let j=0;j<c;j++)M[j]&&I.push(j);if(P<=0||I.length<30)return null;let H=new Int32Array(256),z=j=>j!==null&&j.strength>=25?j:null,W=j=>j!==null&&j.strength>=30?j:null,V=wt(2,L.length,I,H),J=C<0?z(wt(0,2,I,H)):C<2?U(C,I,H):null,K=J!==null?J:C<0?z(V):U(C,I,H);return K===null?null:(C=K.corner,Te(K,I),K.lower=J!==null&&W(V)!==null?Te(V,I):null,K)}function Ce(I){let H=A[I.corner][0],z=A[I.corner][1];return{width:g,points:I.mask.map(W=>(z+Math.floor(W/_))*g+H+W%_),pattern:I.mask.map(W=>I.median[W]),whole:I.whole,usual:I.usual,strength:I.strength,lower:I.lower?Ce(I.lower):null,channel:I.corner<2}}function ze(){let I=_e();return I===null?null:Ce(I)}function je(){let I=_e();return I===null?null:Ft(I.score,I.usual,M)}return{add:T,logo:ze,gone:je,breaks:(I,H)=>{let z=_e();if(z===null)return null;let W=z.lower?Ft(z.lower.score,z.lower.usual,M):null;return Mt(Ft(z.score,z.usual,M),I,H,W)}}}function Ee(c){return c.lower?Object.assign({},c,{lower:null}):c}function Nt(c,g,p){let o=0;for(let l of g)jt(c,l)>=.5*c.usual&&o++;return o>=p*g.length}function jt(c,g){let p=0;for(let o=0;o<c.points.length;o++){let l=c.points[o],_=g[l];p+=Math.min(Math.abs(g[l+1]-_)+Math.abs(g[l+c.width]-_),c.pattern[o])}return p/c.whole}function de(c){let g=String(c).match(/[A-Za-z0-9+\/]{16,}={0,2}/g)||[];for(let p of g){let o;try{o=atob(p)}catch{continue}if(o.length<20||o.charCodeAt(0)!==252)continue;let l=_=>{if(_<0||_>=o.length)throw new RangeError("short");return o.charCodeAt(_)};try{if(l(13)===5&&!(l(18)&128))return(l(19)&128)!==0;for(let _=16;_+4<=o.length;_++){if(o.substr(_,4)!=="CUEI"||l(_-2)!==2)continue;let x=_+8;if(l(x)&128)continue;x++;let P=l(x);x++,P&128||(x+=1+6*l(x)),P&64&&(x+=5),x+=2+l(x+1);let A=l(x);if([34,48,50,52,54].indexOf(A)>=0)return!0;if([35,49,51,53,55].indexOf(A)>=0)return!1}}catch{return null}return null}return null}function qt(c){let g=[];if(c.some(p=>p.signalled))for(let p of c)for(let o of p.marks){if(!o.opens)continue;let l=null;if(o.duration!==null)l=o.at+o.duration;else{let _=p.marks.filter(x=>x.at>o.at).map(x=>x.at);l=_.length>0?Math.min.apply(null,_):p.end}l!==null&&l>o.at&&g.push([o.at,l])}else{let p=o=>o.end-o.start;for(let o=1;o+1<c.length;o++){let l=c[o-1],_=c[o],x=c[o+1];if(l.end===null||_.end===null||x.end===null)continue;p(_)<10&&p(l)>=60&&p(l)<=420&&p(x)>=60&&p(x)<=420&&g.push([l.start,x.end])}}return Ot(g,10)}function Ot(c,g){let p=[];for(let o of c.slice().sort((l,_)=>l[0]-_[0])){let l=p[p.length-1];l&&o[0]-l[1]<=g?l[1]=Math.max(l[1],o[1]):p.push([o[0],o[1]])}return p}let Z={270:{tiny:120,mean:40,key:4e3},540:{tiny:172,mean:86,key:8e3},1080:{tiny:430,mean:172,key:12e3}},ee=10,ie=14,Vt=.2,he=6,ue=90,ct=60,vt=100,dt=3,se=65536,Pe=1e4;function mt(c,g){return String.fromCharCode(c[g+4],c[g+5],c[g+6],c[g+7])}function Gt(c){let g=new DataView(c.buffer,c.byteOffset,c.byteLength),p=0;for(;c.length-p>=8;){let o=g.getUint32(p);if(o<8||p+o>se)return null;if(mt(c,p)==="moof")return p+o;p+=o}return null}function yt(c,g,p,o){let l=[],_=p;for(;o-_>=8;){let x=g.getUint32(_);if(x<8||x>o-_)break;l.push({type:mt(c,_),from:_+8,to:_+x}),_+=x}return l}function Ht(c){let g=Gt(c);if(g===null||g>c.length)return null;let p=new DataView(c.buffer,c.byteOffset,c.byteLength),o=yt(c,p,0,g).pop();if(!o||o.type!=="moof")return null;let l=yt(c,p,o.from,o.to).filter(P=>P.type==="traf")[0];if(!l)return null;let _=[],x=-1;for(let P of yt(c,p,l.from,l.to)){if(P.type!=="tfhd"&&P.type!=="trun")continue;let A=P.from;if(P.to-A<8)return null;let L=p.getUint32(A)&16777215;if(P.type==="tfhd"){let M=A+8;if(L&1&&(M+=8),L&2&&(M+=4),L&8&&(M+=4),L&16){if(M+4>P.to)return null;x=p.getUint32(M)}}else{let M=p.getUint32(A+4),C=((L&256?1:0)+(L&512?1:0)+(L&1024?1:0)+(L&2048?1:0))*4,T=A+8+(L&1?4:0)+(L&4?4:0);if(M>Pe||T+M*C>P.to||!(L&512)&&x<0)return null;for(let U=0;U<M;U++)_.push(L&512?p.getUint32(T+(L&256?4:0)):x),T+=C}}return _}function ne(c,g,p,o){let l=[],_=0,x=0;for(let P=0;P<c.length;P++){let A=c[P];if(A>=0&&A<o.tiny){_++,x+=A;continue}_>=ee&&_<=ie&&x<=o.mean*_&&A>o.key&&l.push(g+P*p),_=0,x=0}return l}function pe(c){let g=[];for(let o of c.slice().sort((l,_)=>l-_)){let l=g[g.length-1];l&&o-l[l.length-1]<=Vt||(l&&o-l[l.length-1]<=ct?l.push(o):g.push([o]))}let p=[];for(let o=0;o<g.length;o++){let l=g[o],_=g[o+1],x=p[p.length-1];x&&!(x.length>=dt&&l[0]-x[x.length-1]<=vt)&&(x=null),x&&l.length>=dt?x.push(...l):x&&_&&_.length>=dt&&_[0]-l[l.length-1]<=vt?(x.push(...l,..._),o++):p.push(l)}return p.filter(o=>o.length>=he&&o[o.length-1]-o[0]>=ue).map(o=>[o[1],o[o.length-2]])}function xt(c,g){let p=g.filter(o=>o[0]<c[1]&&o[1]>c[1])[0];return p?[c[0],p[1]]:c}return{runs:It,captionBreaks:Be,gone:Ft,solid:te,logoBreaks:Mt,combine:ft,track:$t,score:jt,alone:Ee,seenIn:Nt,opens:de,markedBreaks:qt,merge:Ot,moofEnd:Gt,frameSizes:Ht,separatorEnds:ne,separatedBreaks:pe,reachSeparated:xt,BLACKS:Z,BRIDGE:7,AROUND:15,LOGO_MAX_S:1200}})();function Ei(a){let ut=D.LOGO_MAX_S+160,pt=ut+120,lt=3,ri=4096,ce=Math.min.apply(null,Object.keys(D.BLACKS).map(Number)),oi=6,ai=2,ke=480,li=8,ci=3e4,It=4e3,Be=150,Ft=1e4,te=5*60*1e3,Bt=2e4,ot=240,bt=135,F=0,Mt=null,Rt=!1,Pt=null,_t=null,zt=[],ft="none",$t=null,Ee=0,Nt=new Map,jt=[],de=0,qt="none",Ot=[],Z=null,ee="none",ie=-1/0,Vt=0,he=new Map,ue=null,ct=new Map,vt=new Map,dt=new Map,se=0,Pe=0,mt=null,Gt=!1,yt=null,Ht=!1,ne="none",pe=[],xt=new Map,c=new Map,g=[],p=0,o="",l=!1;function _(h){let d=String(h).indexOf("?");return d<0?String(h):String(h).slice(0,d)}function x(h,d){try{let y=h&&h.contentId,f=!!a.isLive(),m=y?_(y):null;Pt=y||null;let k=d&&d.live_thumbnails_url;_t=f&&typeof k=="string"&&k.indexOf("https://")===0?k.replace(/\/+$/,""):null,Ht=f&&!!(d&&d.separated_breaks===!0);let E=!f&&!!(d&&d.recording)&&m!==null;if(m!==null&&m===Mt&&f===Rt){E&&/^error/.test(ft)&&($t={url:Pt,name:Mt,mine:F});return}F++,Mt=m,Rt=f,mt=null,Gt=a.show(!1),zt=[],ft=E?"waiting":"none",jt=[],de=0,qt="none",Ot=[],Z=null,ee="none",ie=-1/0,Vt=0,ue=null,ct=new Map,vt=new Map,dt=new Map,ne=Ht?"waiting":"none",pe=[],xt=new Map,c=new Map,g=[],p=0,o="",l=!1,$t=E?{url:Pt,name:Mt,mine:F}:null,Ee=0}catch{ft="error"}}function P(h,d,y){let f=new Array(h.length),m=0,k=async()=>{for(;m<h.length;){let S=m++;f[S]=await y(h[S],S)}},E=[];for(let S=0;S<Math.min(d,h.length);S++)E.push(k());return Promise.all(E).then(()=>f)}async function A(h){let d=new AbortController,y=setTimeout(()=>d.abort(),Bt);try{let f=await fetch(h,{credentials:"omit",signal:d.signal});if(!f.ok)throw new Error("http "+f.status);return await f.text()}finally{clearTimeout(y)}}function L(h,d,y){return new Promise(f=>{let m=new Image,k=setTimeout(()=>{m.onload=null,m.onerror=null,f(null)},Bt);m.crossOrigin="anonymous",m.onload=()=>{clearTimeout(k);try{yt===null&&(yt=document.createElement("canvas")),(yt.width!==d||yt.height!==y)&&(yt.width=d,yt.height=y);let E=yt.getContext("2d",{willReadFrequently:!0});E.drawImage(m,0,0,d,y),f(E.getImageData(0,0,d,y).data)}catch{f(null)}},m.onerror=()=>{clearTimeout(k),f(null)},m.src=h})}function M(h,d,y){let f=new Uint8Array(ot*bt),m=0;for(let k=0;k<bt;k++){let E=(k*d+y)*4;for(let S=0;S<ot;S++)f[m++]=h[E]*77+h[E+1]*150+h[E+2]*29>>8,E+=4}return f}function C(h){let d=/^PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?$/.exec(h||"");return d?Number(d[1]||0)*3600+Number(d[2]||0)*60+Number(d[3]||0):NaN}function T(h,d){let y=[];for(let f=h.firstElementChild;f;f=f.nextElementSibling)f.localName===d&&y.push(f);return y}function U(h,d){let y=T(h,"BaseURL")[0];return y&&y.textContent?new URL(y.textContent.trim(),d).href:d}function wt(h,d,y,f){let m=f||T(h,"Representation")[0];if(!m)return[];let k=T(h,"SegmentTemplate")[0]||T(m,"SegmentTemplate")[0],E=k&&k.getAttribute("media");if(!E)return[];let S=Number(k.getAttribute("timescale")||1),b=Number(k.getAttribute("presentationTimeOffset")||0),O=(tt,Tt,kt)=>tt.replace(new RegExp("\\$"+Tt+"(?:%0(\\d+)d)?\\$","g"),(re,Wt)=>Wt?String(kt).padStart(Number(Wt),"0"):String(kt)),$=(tt,Tt)=>new URL(O(O(E.split("$RepresentationID$").join(m.getAttribute("id")),"Time",tt),"Number",Tt),d).href,B=[],G=T(k,"SegmentTimeline")[0];if(G){let tt=0,Tt=Number(k.getAttribute("startNumber")||1),kt=T(G,"S");for(let re=0;re<kt.length;re++){let Wt=kt[re];Wt.getAttribute("t")!==null&&(tt=Number(Wt.getAttribute("t")));let Ae=Number(Wt.getAttribute("d")),Ie=Number(Wt.getAttribute("r")||0);if(!(Ae>0))return[];if(Ie<0){let ge=re+1<kt.length?kt[re+1].getAttribute("t"):null,Ri=ge!==null?Number(ge):y*S+b;Ie=Math.ceil((Ri-tt)/Ae)-1}if(!(Ie>=0))return[];for(let ge=0;ge<=Ie;ge++)if(B.push({time:(tt-b)/S,duration:Ae/S,url:$(tt,Tt)}),tt+=Ae,Tt++,B.length>Ft)return[]}return B}let X=Number(k.getAttribute("duration"))/S,Q=Number(k.getAttribute("startNumber")||1);if(!(X>0))return[];let st=0;k.getAttribute("eptDelta")!==null?st=Number(k.getAttribute("eptDelta"))/S:st=(Q-1)*X-b/S,st<0&&-st<X||(st=0);let at=k.getAttribute("endNumber")!==null?Number(k.getAttribute("endNumber")):Q+Math.ceil((y-st)/X)-1;if(!(at>=Q)||at-Q+1>Ft)return[];for(let tt=Q;tt<=at;tt++)B.push({time:(tt-Q)*X+st,duration:X,url:$("",tt)});return B}async function Te(h,d){if(h.length===0)return null;let y=/<p\b[^>]*>([\s\S]*?)<\/p>/g,f=0,m=await P(h,4,async k=>{if(d!==F)return!0;try{let E=await A(k.url).catch(()=>A(k.url)),S;for(y.lastIndex=0;(S=y.exec(E))!==null;)if(S[1].replace(/<[^>]+>/g,"").trim()!=="")return!0;return!1}catch{return f++,!0}});if(d!==F)throw new Error("superseded");if(f*20>m.length)throw new Error("captions unread");return D.captionBreaks(m,h[0].time,h[0].duration)}async function _e(h,d,y,f){if(h.length===0||h.length>Be||y!==1||!(d>0))return null;let m=d,k=D.track(h.length*m,ot,bt),E=async $=>(await P($,1,async G=>{if(f!==F)return!1;let X=await L(h[G].url,d*ot,bt);if(X===null&&f===F&&(X=await L(h[G].url,d*ot,bt)),X===null)return!1;for(let Q=0;Q<m;Q++)k.add(G*m+Q,M(X,d*ot,Q*ot));return!0})).every(G=>G),S=h.map(($,B)=>B);if(!await E(S.filter($=>$%2===0)))throw new Error("thumbnails unread");let b=k.gone();if(b===null)return null;let O=$=>{if($<0||$>=h.length)return!1;for(let B=$*m;B<($+1)*m;B++)if(b[B])return!0;return!1};if(!await E(S.filter($=>$%2===1&&(O($-1)||O($+1)))))throw new Error("thumbnails unread");return k.breaks(h[0].time,h[0].duration/m)}async function Ce(h,d,y){if(Nt.has(d)){zt=Nt.get(d),ft="known";return}ft="searching";try{let f=new DOMParser().parseFromString(await A(h),"application/xml").documentElement,m=f?T(f,"Period"):[],k=f?C(f.getAttribute("mediaPresentationDuration")):NaN;if(f&&(f.getAttribute("type")==="dynamic"||!(k>0)))throw new Error("not whole yet");if(!f||m.length!==1){y===F&&(ft="not a recording");return}let E=U(m[0],U(f,h)),S=null,b=null;for(let $ of T(m[0],"AdaptationSet")){let B=T($,"Representation")[0],G=$.getAttribute("mimeType")||B&&B.getAttribute("mimeType")||"",X=$.getAttribute("contentType")||G.split("/")[0];if(X==="text"&&S===null)S=await Te(wt($,E,k),y);else if(X==="image"&&b===null){let Q=T($,"EssentialProperty").concat(B?T(B,"EssentialProperty"):[]).filter(at=>/thumbnail_tile$/.test(at.getAttribute("schemeIdUri")||""))[0],st=/^(\d+)x(\d+)$/.exec(Q&&Q.getAttribute("value")||"");st&&(b=await _e(wt($,E,k),Number(st[1]),Number(st[2]),y))}if(y!==F)return}let O=D.combine(S,b).filter($=>$[0]>0&&$[1]<k);if(Nt.set(d,O),Nt.size>20&&Nt.delete(Nt.keys().next().value),y!==F)return;zt=O,ft="found "+O.length+" (captions "+(S===null?"none":S.length)+", logo "+(b===null?"none":b.length)+")"}catch(f){y===F&&(ft="error: "+String(f&&f.message).slice(0,40),setTimeout(()=>{y===F&&/^error/.test(ft)&&($t={url:h,name:d,mine:y})},te*2**Math.min(Ee++,12)))}}async function ze(h){try{let d=new DOMParser().parseFromString(await A(Pt),"application/xml").documentElement;if(!d||h!==F)return;let y=Date.parse(d.getAttribute("availabilityStartTime")||"")/1e3;if(!isFinite(y)){qt="no start time";return}let f=T(d,"Period"),m=f.map(S=>C(S.getAttribute("start"))),k=null,E=f.map((S,b)=>{let O=isFinite(m[b])?y+m[b]:k!==null?k:y,$=C(S.getAttribute("duration")),B=isFinite($)?O+$:b+1<m.length&&isFinite(m[b+1])?y+m[b+1]:null,G=T(S,"EventStream").filter(Q=>(Q.getAttribute("schemeIdUri")||"").indexOf("urn:scte:scte35")===0),X=[];for(let Q of G){let st=Number(Q.getAttribute("timescale")||1),at=Number(Q.getAttribute("presentationTimeOffset")||0);for(let tt of T(Q,"Event")){let Tt=D.opens(new XMLSerializer().serializeToString(tt));if(Tt===null)continue;let kt=Number(tt.getAttribute("duration")||0)/st;X.push({at:O+(Number(tt.getAttribute("presentationTime")||0)-at)/st,duration:kt>0?kt:null,opens:Tt})}}return k=B,{start:O,end:B,marks:X,signalled:G.length>0}});jt=D.markedBreaks(E),qt="periods "+f.length+", breaks "+jt.length,Ht&&(pe=je(d,y))}catch(d){h===F&&(qt="error: "+String(d&&d.message).slice(0,40))}}function je(h,d){let y=[],f=Date.now()/1e3,m=U(h,Pt);for(let k of T(h,"Period")){let E=d+(C(k.getAttribute("start"))||0),S=new Map;for(let b of T(k,"AdaptationSet"))if(!(b.getAttribute("contentType")!=="video"&&!/^video\//.test(b.getAttribute("mimeType")||"")))for(let O of T(b,"Representation")){let $=Number(O.getAttribute("bandwidth")),B=Number(O.getAttribute("height")||b.getAttribute("height"));if(!($>0)||!D.BLACKS[B])continue;let G=S.get(B);(!G||$<Number(G.rep.getAttribute("bandwidth")))&&S.set(B,{set:b,rep:O})}S.forEach((b,O)=>{let $=T(b.set,"SegmentTemplate")[0]||T(b.rep,"SegmentTemplate")[0];if(!$||!T($,"SegmentTimeline")[0])return;let B=U(b.rep,U(b.set,U(k,m)));for(let G of wt(b.set,B,f-E,b.rep)){let X=E+G.time;y.push({time:X,duration:G.duration,url:G.url,height:O,key:O+" "+X})}})}return y}async function I(h,d){let y=new AbortController,f=setTimeout(()=>y.abort(),Bt);try{let m={credentials:"omit",signal:y.signal};d!==null&&(m.headers={Range:"bytes=0-"+(d-1)});let k=await fetch(h,m);if(!k.ok)return"http "+k.status;let E=new Uint8Array(await k.arrayBuffer());return d!==null&&E.length>d?E.subarray(0,d):E}catch(m){return String(m&&m.name||"error")}finally{clearTimeout(f)}}async function H(h){let d=await I(h.url,l?null:ri);if(typeof d=="string")return d;let y=D.moofEnd(d);if(y===null)return"no header";if(y>d.length&&(d=await I(h.url,y)),typeof d=="string")return d;let f=D.frameSizes(d);return f===null||f.length===0?"no frames":D.separatorEnds(f,h.time,h.duration/f.length,D.BLACKS[h.height])}async function z(h,d,y){let f=h-ke,m=Math.min(d-li,h+ke),k=pe.filter(b=>(!l||b.height===ce)&&b.time+b.duration>f&&b.time<m&&(!xt.has(b.key)||c.has(b.key)&&c.get(b.key)<lt)),E=await P(k,l?ai:oi,H);if(y!==F)return;if(!l&&k.length>0&&E.every(b=>b==="TypeError")){let b=k.filter($=>$.height===ce).pop(),O=b?await I(b.url,null):"none";if(y!==F)return;if(typeof O!="string"){l=!0,p+=k.length,o="TypeError",ne="segments 0, whole "+ce+"p next, failed "+p+" ("+o+")";return}}k.forEach((b,O)=>{let $=typeof E[O]=="string";$?(c.set(b.key,(c.get(b.key)||0)+1),p++,o=E[O]):c.delete(b.key),xt.set(b.key,{time:b.time,ends:$?[]:E[O]})});for(let b of Array.from(xt.keys()))xt.get(b).time>=h-2*ke||(xt.delete(b),c.delete(b));let S=[];for(let b of xt.values())for(let O of b.ends)S.push(O);g=D.separatedBreaks(S),ne="segments "+xt.size+(l?" whole "+ce+"p":"")+", blacks "+S.length+", breaks "+g.length+(p>0?", failed "+p+" ("+o+")":"")}async function W(h,d,y){let f=[];for(let S=h;S<=d;S+=4)(!ct.has(S)||dt.has(S)&&dt.get(S)<lt)&&f.push(S);if(f.length===0)return;let m=Z,k=_t,E=await P(f,4,async S=>{if(y!==F)return null;let b=await L(k+"/"+S,ot,bt);if(b===null)return null;let O=M(b,ot,0);return[D.score(m,O),m.lower?D.score(m.lower,O):null]});y!==F||m!==Z||f.forEach((S,b)=>{E[b]===null?dt.set(S,(dt.get(S)||0)+1):dt.delete(S),ct.set(S,E[b]===null?m.usual:E[b][0]),m.lower&&vt.set(S,E[b]===null?m.lower.usual:E[b][1])})}async function V(h,d){let y=_t;return(await P(h,4,async f=>{if(d!==F)return null;let m=await L(y+"/"+f,ot,bt);return m===null?null:M(m,ot,0)})).filter(f=>f!==null)}function J(h){if(h.length===0)return null;let d=D.track(h.length,ot,bt);return h.forEach((y,f)=>d.add(f,y)),d.logo()}async function K(h,d,y){let f=[];for(let S=h-1200;S<=Math.min(d,h+1200);S+=28)f.push(S);let m=await V(f,y);if(y!==F)return;if(m.length===0){j(h);return}let k=J(m);k!==null&&k.channel&&he.set(_t,D.alone(k));let E=null;if(k===null){let S=he.get(_t);if(S&&D.seenIn(S,m,.4))E=S;else if(ue!==_t){let b=await Y(h,y);if(y!==F)return;b!==null&&(he.set(_t,b),D.seenIn(b,m,.4)&&(E=b))}}ie=h,Z=E||k,ct=new Map,vt=new Map,dt=new Map,ee=Z===null?"none in "+m.length+" pictures":"strength "+Math.round(Z.strength)+(Z.lower?", lower one "+Math.round(Z.lower.strength):"")+(E!==null?", kept":""),Z===null?j(h):Vt=0}function j(h){ie=h-900+Math.min(900,120*2**Vt),120*2**Vt<900&&Vt++}async function Y(h,d){let y=null;for(let f=0;f<3;f++){let m=h-1200-f*2*1200,k=[];for(let b=m-2*1200;b<m;b+=28)k.push(b);let E=await V(k,d);if(d!==F)return null;if(E.length===0){if(f===0)return null;break}let S=J(E);if(S!==null&&S.channel){y=D.alone(S);break}}return ue=_t,y}function St(h){let d=h;for(;ct.has(d-4);)d-=4;let y=[],f=[];for(let k=d;ct.has(k);k+=4)y.push(ct.get(k)),Z.lower&&f.push(vt.has(k)?vt.get(k):Z.lower.usual);let m=y.map(()=>!0);return{first:d,gone:D.gone(y,Z.usual,m),lowerGone:Z.lower?D.gone(f,Z.lower.usual,m):null}}async function Lt(h,d,y){let f=Math.floor(h/4)*4,m=Math.floor((d-12)/4)*4;if(f>m)return;let k=Math.abs(f-ie),E=Ot.some(b=>b[0]<=f&&f<=b[1])&&k<=900+D.LOGO_MAX_S;if(k>900&&!E&&await K(f,m,y),Z===null||y!==F)return;await W(f-64,Math.min(m,f+88),y);for(let b=0;b<4;b++){if(y!==F||!ct.has(f))return;let O=St(f),$=O.gone.length,B=O.first+$*4,G=D.runs(D.solid(O.gone),D.BRIDGE).concat(O.lowerGone?D.runs(D.solid(O.lowerGone),D.BRIDGE):[]),X=G.some(at=>at[1]+D.AROUND>=$&&($-at[0])*4<=ut),Q=(f-O.first)/4,st=G.some(at=>at[0]<D.AROUND&&at[1]>=Q&&(at[1]+1)*4<=ut);if(X&&B<=m)await W(B,Math.min(m,B+120),y);else if(st&&O.first>f-ut)await W(O.first-120,O.first-4,y);else break}if(y!==F||Z===null||!ct.has(f))return;let S=St(f);Ot=D.logoBreaks(S.gone,S.first,4,S.lowerGone);for(let b of Array.from(ct.keys()))b<f-pt&&ct.delete(b);for(let b of Array.from(vt.keys()))b<f-pt&&vt.delete(b);for(let b of Array.from(dt.keys()))b<f-pt&&dt.delete(b)}function fe(){let h=a.liveRange(),d=a.currentTime();if(!h||typeof d!="number"||!isFinite(d)||!isFinite(h.end))return null;let y=a.absoluteTime(d),f=a.absoluteTime(h.end),m=Date.now()/1e3;return typeof y!="number"||typeof f!="number"||!(y>m-86400&&y<m+600)||!(f>=y)?null:{at:y,end:f}}async function Ci(h){if(se!==h){se=h;try{let d=fe();if(d===null||d.end-d.at<=60)return;Date.now()-de>=ci&&Pt&&(de=Date.now(),await ze(h)),Ht&&h===F&&await z(d.at,d.end,h),_t!==null&&h===F&&await Lt(d.at,d.end,h)}catch(d){ee="error: "+String(d&&d.message).slice(0,40)}finally{se===h&&(se=0)}}}function Ai(){let h=null;try{let d=a.state();if(Mt!==null&&(d==="playing"||d==="paused")){let y=a.currentTime();if($t!==null&&d==="playing"){let m=$t;$t=null,m.mine===F&&Ce(m.url,m.name,m.mine)}let f=m=>[m[0],m[1]-32];if(Rt){if(!a.joining()){let m=fe();if(m!==null){let k=S=>m.at>=S[0]&&m.at<S[1]-1&&S[1]<=m.end-2,E=jt.filter(k)[0]||g.filter(k)[0]||Ot.map(f).map(S=>D.reachSeparated(S,g)).filter(k)[0];if(E){let S=a.mediaTime(E[1]);typeof S=="number"&&isFinite(S)&&S>y&&(h=S)}}Date.now()-Pe>=It&&(Pe=Date.now(),Ci(F))}}else{let m=zt.map(f).filter(k=>y>=k[0]&&y<k[1]-1)[0];m&&(h=m[1])}}}catch{h=null}mt=h,Gt=a.show(mt!==null)}function Ii(){if(mt===null||!Gt)return!1;let h=mt;return mt=null,Gt=a.show(!1),a.seek(h),!0}function Mi(){let h={live:Rt,offered:mt!==null,skip_to:mt};if(Rt){h.marked=qt,h.logo=_t===null?"no pictures":ee,h.found=Ot.length,Ht&&(h.separators=ne);try{let d=fe();h.clock=d===null?"none":Math.round(Date.now()/1e3-d.end)+" s behind at the live point"}catch{h.clock="error"}}else h.recording=ft,h.breaks=zt.map(d=>[Math.round(d[0]),Math.round(d[1])]);return h}return{load:x,tick:Ai,skip:Ii,report:Mi}}var Ti="0.1.22";function Vi(){let a=navigator.userAgent||"",t=/Android|iPhone|iPad|iPod|Mobile/i.test(a),e=/wv|WebView/i.test(a)||window.navigator.standalone===!0;return t||e}var Gi={fr:"Francais",fra:"Francais",fre:"Francais",en:"English",eng:"English",de:"Deutsch",deu:"Deutsch",ger:"Deutsch",es:"Espanol",spa:"Espanol",it:"Italiano",ita:"Italiano",pt:"Portugues",por:"Portugues",qaa:"Original",und:"Indefini",mul:"Multiple"};function Pi(a){if(!a)return"Inconnu";let t=a.toLowerCase();return Gi[t]||a.toUpperCase()}function Fe(a){let t=a.split(":");if(t.length<2)return null;let e=t.slice(1).join(":");try{let i=e,s=e.length%4;s&&(i+="=".repeat(4-s));let n=atob(i.replace(/-/g,"+").replace(/_/g,"/"));return JSON.parse(n)}catch{return null}}var ni=class extends Zt{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},panel:{type:Object},_channels:{type:Array},_loading:{type:Boolean},_error:{type:String},_playing:{type:Boolean},_selectedChannel:{type:Object},_streamData:{type:Object},_isFullscreen:{type:Boolean},_playerError:{type:String},_playerLoading:{type:Boolean},_currentTime:{type:Number},_duration:{type:Number},_volume:{type:Number},_muted:{type:Boolean},_paused:{type:Boolean},_audioTracks:{type:Array},_textTracks:{type:Array},_selectedAudioIndex:{type:Number},_selectedTextIndex:{type:Number},_isLive:{type:Boolean},_programStart:{type:Number},_programEnd:{type:Number},_showAudioMenu:{type:Boolean},_showTextMenu:{type:Boolean},_expandedChannels:{type:Object},_channelPrograms:{type:Object},_loadingPrograms:{type:Object},_searchQuery:{type:String},_searchResults:{type:Array},_searching:{type:Boolean},_showingSearch:{type:Boolean},_expandedResults:{type:Object},_resultEpisodes:{type:Object},_loadingEpisodes:{type:Object},_castTargets:{type:Array},_selectedTarget:{type:String},_activeTab:{type:String},_recordings:{type:Array},_loadingRecordings:{type:Boolean},_expandedRecordings:{type:Object},_recordingEpisodes:{type:Object},_loadingRecordingEpisodes:{type:Object},_castPlaying:{type:Boolean},_castTarget:{type:String},_castTitle:{type:String},_activeCasts:{type:Object},_focusedCastHost:{type:String},_localPlaybackInitiated:{type:Boolean},_localMinimized:{type:Boolean},_castMinimized:{type:Boolean},_castLoading:{type:Boolean},_tonightChannels:{type:Array},_loadingTonight:{type:Boolean},_episodePlaylist:{type:Array},_episodeIndex:{type:Number},_selectedEntityId:{type:String}}}static get styles(){return Si`
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
    `}constructor(){super(),this._boundOnFullscreenChange=this._onFullscreenChange.bind(this),this._boundOnDocumentClick=this._onDocumentClick.bind(this),this._channels=[],this._loading=!0,this._error=null,this._playing=!1,this._selectedChannel=null,this._streamData=null,this._isFullscreen=!1,this._playerError=null,this._playerLoading=!1,this._player=null,this._entityUnsubscribe=null,this._showPlayOverlay=!1,this._adSkip=null,this._adOffer=!1,this._castSkipTo=null,this._currentTime=0,this._duration=0,this._volume=.5,this._muted=!1,this._paused=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._liveDelay=0,this._showAudioMenu=!1,this._showTextMenu=!1,this._updateInterval=null,this._expandedChannels={},this._channelPrograms={},this._loadingPrograms={},this._searchQuery="",this._searchResults=[],this._searching=!1,this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._searchToken=0,this._castTargets=[],this._isMobile=Vi(),this._selectedTarget=this._isMobile?"":"local",this._activeTab="live",this._recordings=[],this._loadingRecordings=!1,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castProgressInterval=null,this._castBasePosition=0,this._castPositionUpdatedAt=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._castMinimized=!1,this._castLoading=!1,this._tonightChannels=[],this._loadingTonight=!1,this._episodePlaylist=[],this._episodeIndex=-1,this._episodeParentTitle="",this._episodeIsRecording=!1,this._sessionId=this._generateSessionId(),this._selectedEntityId=localStorage.getItem("molotov_selected_entity")||""}_generateSessionId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"molotov-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10)}connectedCallback(){super.connectedCallback(),console.log(`[Molotov Panel] Connected - v${Ti}`),this._hasLoadedChannels=!1,document.addEventListener("fullscreenchange",this._boundOnFullscreenChange),document.addEventListener("click",this._boundOnDocumentClick)}disconnectedCallback(){if(super.disconnectedCallback(),this._playing){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"})}this._cleanupPlayer(),this._stopCastProgressUpdate(),document.removeEventListener("fullscreenchange",this._boundOnFullscreenChange),document.removeEventListener("click",this._boundOnDocumentClick),this._entityUnsubscribe&&(this._entityUnsubscribe(),this._entityUnsubscribe=null)}_onDocumentClick(t){t.composedPath().some(e=>e.classList?.contains("track-menu-container"))||(this._showAudioMenu=!1,this._showTextMenu=!1,this.requestUpdate())}updated(t){t.has("hass")&&this.hass&&(this._hasLoadedChannels||(this._hasLoadedChannels=!0,this._loadChannels()),this._syncWithEntity())}async _loadChannels(){this._loading=!0,this._error=null;try{let t=this._getEntityId();if(!t)throw new Error("Entite Molotov TV introuvable");console.log(`[Molotov Panel] Loading channels for ${t}`);let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"now_playing",media_content_type:"directory"});e&&e.children?(this._channels=e.children.map(i=>this._parseChannel(i)),console.log(`[Molotov Panel] Loaded ${this._channels.length} channels`),this._channels.length>0&&await this._fetchCastTargets(t,this._channels[0].mediaContentId)):this._channels=[],this._loading=!1}catch(t){console.error("[Molotov Panel] Failed to load channels:",t),this._error=t.message||"Erreur lors du chargement des chaines",this._loading=!1}}async _fetchCastTargets(t,e){try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:e,media_content_type:"program"});if(i&&i.children){let s=i.children.filter(n=>n.media_content_id.startsWith("cast:")).map(n=>({mediaContentId:n.media_content_id,title:n.title}));this._castTargets=s,this._isMobile&&s.length>0&&(!this._selectedTarget||this._selectedTarget==="local")&&(this._selectedTarget=s[0].mediaContentId),console.log(`[Molotov Panel] Found ${s.length} cast targets`)}}catch(i){console.error("[Molotov Panel] Failed to fetch cast targets:",i),this._castTargets=[]}}_handleTargetChange(t){let e=t.target.value;this._isMobile&&e==="local"||(this._selectedTarget=e,console.log(`[Molotov Panel] Selected target: ${this._selectedTarget}`))}_switchTab(t){this._activeTab=t,t==="recordings"&&this._recordings.length===0&&this._loadRecordings(),t==="tonight"&&this._tonightChannels.length===0&&this._loadTonight(),this.requestUpdate()}async _loadRecordings(){let t=this._getEntityId();if(!t)return;this._loadingRecordings=!0,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this.requestUpdate();try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"recordings",media_content_type:"directory"});i&&i.children?(this._recordings=i.children.map(s=>{let n=Fe(s.media_content_id);return{mediaContentId:s.media_content_id,title:s.title,thumbnail:s.thumbnail,description:n?.desc||null,isFolder:!!n?.folder}}),console.log(`[Molotov Panel] Loaded ${this._recordings.length} recordings`)):this._recordings=[]}catch(i){console.error("[Molotov Panel] Failed to load recordings:",i),this._recordings=[]}this._loadingRecordings=!1,this.requestUpdate();let e=this._recordings.filter(i=>i.isFolder);e.length>0&&(await Promise.all(e.map(i=>this._fetchRecordingEpisodes(i))),this.requestUpdate())}async _loadTonight(){let t=this._getEntityId();if(t){this._loadingTonight=!0,this.requestUpdate();try{let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"tonight_epg",media_content_type:"directory"});if(e&&e.children&&e.children.length>0){let i=new Map;for(let n of e.children){if(!n.media_content_id.startsWith("tonight_program:"))continue;let r=n.media_content_id.split(":");if(r.length<6)continue;let u=r[1],w=decodeURIComponent(r[2]),R=decodeURIComponent(r[3]),q=parseInt(r[4])*1e3,N=parseInt(r[5])*1e3,it=r.length>6?decodeURIComponent(r.slice(6).join(":")):"",et=n.title;et.startsWith("\u{1F534} ")&&(et=et.substring(3));let nt=et.match(/^\d{2}:\d{2}-\d{2}:\d{2}\s+(.+)$/);nt&&(et=nt[1]);let rt={mediaContentId:n.media_content_id,title:et,thumbnail:n.thumbnail,start:q,end:N,description:it};i.has(u)||i.set(u,{id:u,name:w,thumbnail:R,programs:[]}),i.get(u).programs.push(rt)}let s=Array.from(i.values());for(let n of s)n.programs.sort((r,u)=>r.start-u.start);this._tonightChannels=s,console.log(`[Molotov Panel] Loaded tonight EPG for ${s.length} channels`)}else this._tonightChannels=[]}catch(e){console.error("[Molotov Panel] Failed to load tonight EPG:",e),this._tonightChannels=[]}this._loadingTonight=!1,this.requestUpdate()}}async _toggleRecordingExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedRecordings[i]){this._expandedRecordings={...this._expandedRecordings,[i]:!1},this.requestUpdate();return}if(!e.isFolder){await this._playRecordingDirectly(e);return}this._recordingEpisodes[i]||await this._fetchRecordingEpisodes(e);let s=this._recordingEpisodes[i]||[];if(s.length===0){console.log("[Molotov Panel] No episodes found, playing recording directly"),await this._playRecordingDirectly(e);return}if(s.length===1){console.log("[Molotov Panel] Only 1 episode found, playing it directly"),await this._playRecordingEpisode(s[0],e.title);return}this._expandedRecordings={...this._expandedRecordings,[i]:!0},this.requestUpdate()}async _playRecordingDirectly(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:"",currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=t.mediaContentId;i.startsWith("recording:")&&(i=i.substring(10));let s=this._buildPlayMediaId(`replay:${i}`);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:s,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play recording failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}async _fetchRecordingEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"recording"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._recordingEpisodes={...this._recordingEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for recording "${t.title}"`)}else this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch recording episodes:",s),this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!1},this.requestUpdate()}async _playRecordingEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._recordingEpisodes,!0),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play recording episode failed:",s),this._playerError=s.message||"Erreur de lecture",this._castLoading=!1}}}_buildPlayMediaId(t){if(this._selectedTarget==="local")return`play_local:${this._sessionId}:${t}`;let e=this._selectedTarget.split(":");if(e.length>=2){let i=e[1],s=e.length>=3&&e[2]!=="native"&&e[2]!=="custom"?"":e[2];return s?`cast:${i}:${s}:${t}`:`cast:${i}:${t}`}return`play_local:${t}`}_isLocalPlayback(){return this._selectedTarget==="local"}_parseEpisodeChildren(t){return t.filter(e=>e.media_content_id.startsWith("episode:")||e.media_content_id.startsWith("replay:")||e.media_content_id.startsWith("recording:")||e.can_play).map(e=>{let i=Fe(e.media_content_id);return{mediaContentId:e.media_content_id,title:e.title,thumbnail:e.thumbnail,description:i?.desc||null}})}_initPlaybackFlags(){this._isLocalPlayback()?(this._localPlaybackInitiated=!0,this._localMinimized=!1):this._castLoading=!0}_parseChannel(t){let e=t.media_content_id,[i,s]=e.split("|"),n=null;if(s)try{let et=s,nt=s.length%4;nt&&(et+="=".repeat(4-nt)),n=decodeURIComponent(escape(atob(et.replace(/-/g,"+").replace(/_/g,"/"))))}catch{}let r=i.split(":"),u,w,R;r[0]==="program"?(u=r[1],w=r[2]?parseInt(r[2])*1e3:null,R=r[3]?parseInt(r[3])*1e3:null):r[0]==="live"&&(u=r[1]);let q=t.title.split(" - "),N=q[0],it=q.slice(1).join(" - ")||"Direct";return{id:u,name:N,thumbnail:t.thumbnail,mediaContentId:i,currentProgram:{title:it,description:n,start:w,end:R},nextProgram:null}}_getMolotovEntities(){return!this.hass||!this.hass.states?[]:Object.keys(this.hass.states).filter(t=>t.startsWith("media_player.molotov")).sort()}_getEntityId(){let t=this._getMolotovEntities();return t.length===0?null:t.length===1?t[0]:this._selectedEntityId&&t.includes(this._selectedEntityId)?this._selectedEntityId:t[0]}_handleEntityChange(t){let e=this._getEntityId();this._playing&&e&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState(),this._selectedEntityId=t.target.value,localStorage.setItem("molotov_selected_entity",this._selectedEntityId),this._hasLoadedChannels=!1,this._channels=[],this._recordings=[],this._tonightChannels=[],this._channelPrograms={},this._expandedChannels={},this._loadingPrograms={},this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._loadChannels()}async _toggleChannelExpand(t,e){t.stopPropagation();let i=e.id;if(this._expandedChannels[i]){this._expandedChannels={...this._expandedChannels,[i]:!1},this.requestUpdate();return}this._expandedChannels={...this._expandedChannels,[i]:!0},this._channelPrograms[i]||await this._fetchChannelPrograms(e),this.requestUpdate()}async _fetchChannelPrograms(t){let e=this._getEntityId();if(!e)return;let i=t.id;this._loadingPrograms={...this._loadingPrograms,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`channel:${i}`,media_content_type:"channel"});if(s&&s.children){let n=s.children.filter(r=>r.media_content_id.startsWith("replay:")).map(r=>this._parseReplayItem(r,t));this._channelPrograms={...this._channelPrograms,[i]:n}}}catch(s){console.error("[Molotov Panel] Failed to fetch channel replays:",s),this._channelPrograms={...this._channelPrograms,[i]:[]}}this._loadingPrograms={...this._loadingPrograms,[i]:!1},this.requestUpdate()}_parseReplayItem(t,e){let i=Fe(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,channelName:e.name,description:i?.desc||null}}async _playReplay(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:t.channelName,currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play replay failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}_handleSearchInput(t){this._searchQuery=t.target.value}_handleSearchKeydown(t){t.key==="Enter"&&this._performSearch()}async _performSearch(){let t=this._searchQuery.trim();if(!t)return;let e=this._getEntityId();if(!e)return;let i=++this._searchToken;this._searching=!0,this._showingSearch=!0,this._searchResults=[],this._expandedResults={},this._resultEpisodes={},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`search:${encodeURIComponent(t)}`,media_content_type:"search"});if(i!==this._searchToken)return;if(s&&s.children){let n=s.children.filter(u=>u.media_content_id.startsWith("search_result:")).map(u=>this._parseSearchResult(u)),r=await this._filterResultsWithEpisodes(n,e,i);if(i!==this._searchToken)return;this._searchResults=r,console.log(`[Molotov Panel] Found ${this._searchResults.length} results with episodes for "${t}"`)}else this._searchResults=[]}catch(s){if(i!==this._searchToken)return;console.error("[Molotov Panel] Search failed:",s),this._searchResults=[]}i===this._searchToken&&(this._searching=!1,this.requestUpdate())}async _filterResultsWithEpisodes(t,e,i){let s=t.map(async r=>{try{let u=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:r.mediaContentId,media_content_type:"search_result"});if(u&&u.children){let w=this._parseEpisodeChildren(u.children);if(w.length>0)return(i===void 0||i===this._searchToken)&&(this._resultEpisodes={...this._resultEpisodes,[r.mediaContentId]:w}),r}return null}catch(u){return console.error(`[Molotov Panel] Failed to check episodes for "${r.title}":`,u),null}});return(await Promise.all(s)).filter(r=>r!==null)}_parseSearchResult(t){let e=Fe(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,mediaClass:t.media_class,description:e?.desc||null}}_clearSearch(){this._searchToken++,this._searchQuery="",this._searchResults=[],this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this.requestUpdate()}async _toggleResultExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedResults[i]){this._expandedResults={...this._expandedResults,[i]:!1},this.requestUpdate();return}this._expandedResults={...this._expandedResults,[i]:!0},this._resultEpisodes[i]||await this._fetchResultEpisodes(e),this.requestUpdate()}async _fetchResultEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingEpisodes={...this._loadingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"search_result"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._resultEpisodes={...this._resultEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for "${t.title}"`)}else this._resultEpisodes={...this._resultEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch episodes:",s),this._resultEpisodes={...this._resultEpisodes,[i]:[]}}this._loadingEpisodes={...this._loadingEpisodes,[i]:!1},this.requestUpdate()}_setEpisodePlaylist(t,e,i,s){for(let n of Object.values(i)){let r=n.findIndex(u=>u.mediaContentId===t.mediaContentId);if(r!==-1){this._episodePlaylist=n,this._episodeIndex=r,this._episodeParentTitle=e,this._episodeIsRecording=s;return}}this._episodePlaylist=[],this._episodeIndex=-1}async _playEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._resultEpisodes,!1),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play episode failed:",s),this._playerError=s.message||"Erreur de lecture"}}}_syncWithEntity(){let t=this._getEntityId();if(!t||!this.hass?.states?.[t])return;let e=this.hass.states[t],s=(e.attributes.local_streams||{})[this._sessionId];if(s&&s.url&&this._localPlaybackInitiated){let n=s.url,r=s.drm,u=s.selected_track;if(!this._playing||this._currentStreamUrl!==n){this._currentStreamUrl=n,this._streamData={url:n,drm:r,selectedTrack:u,title:e.attributes.media_title||"En direct",breakSearch:{live_thumbnails_url:s.live_thumbnails_url,recording:s.recording,separated_breaks:s.separated_breaks}},this._playing=!0,this._localMinimized=!1,this._playerError=null,this._playerLoading=!0;let w=this._selectedChannel;w?.currentProgram?.start&&w?.currentProgram?.end?(this._isLive=!0,this._programStart=w.currentProgram.start,this._programEnd=w.currentProgram.end):(this._isLive=!0,this._programStart=null,this._programEnd=null),this.updateComplete.then(()=>this._initDashPlayer())}}else this._playing&&(this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1);if(e.attributes.active_casts&&Object.keys(e.attributes.active_casts).length>0){let n=e.attributes.active_casts,r=e.attributes.cast_target;this._activeCasts=n,this._focusedCastHost=r||null;let u=r?n[r]?.skip_to:null;this._castSkipTo=typeof u=="number"?u:null,(!this._castPlaying||this._castTarget!==r)&&(this._castPlaying=!0,this._castMinimized=this._isMobile,this._castLoading=!1,this._castTarget=r,this._castTitle=e.attributes.media_title||"En cours de lecture",this._startCastProgressUpdate(),console.log("[Molotov Panel] Cast playback detected:",r,"total casts:",Object.keys(n).length)),this._castPositionUpdatedAt=e.attributes.media_position_updated_at?new Date(e.attributes.media_position_updated_at).getTime()/1e3:null,this._castBasePosition=e.attributes.media_position||0,this._duration=e.attributes.media_duration||0,this._volume=e.attributes.volume_level??.5,this._muted=e.attributes.is_volume_muted||!1,this._paused=e.state==="paused",this._castTitle=e.attributes.media_title||this._castTitle,this._isLive=e.attributes.is_live||!1}else this._castPlaying&&(this._onPlaybackEnded()||(this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._castMinimized=!1,this._castLoading=!1,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate()))}async _playChannel(t){let e=this._getEntityId();if(!e){console.error("[Molotov Panel] No entity found");return}this._selectedChannel=t,this._playerError=null,this._episodePlaylist=[],this._episodeIndex=-1,this._initPlaybackFlags(),this._isLocalPlayback()&&t.currentProgram?.start&&t.currentProgram?.end&&(this._programStart=t.currentProgram.start,this._programEnd=t.currentProgram.end,this._isLive=!0);try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}async _initDashPlayer(){if(!this._streamData)return;let t=this.shadowRoot.querySelector("video");if(!t){console.error("[Molotov Panel] Video element not found");return}window.dashjs||await this._loadDashJs(),this._player&&(this._player.reset(),this._player=null),this._adSkip=null,this._adOffer=!1,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null);try{let e=window.dashjs.MediaPlayer().create();this._player=e,e.updateSettings({debug:{logLevel:window.dashjs.Debug.LOG_LEVEL_WARNING},streaming:{buffer:{stableBufferTime:6,bufferTimeAtTopQuality:30,bufferTimeAtTopQualityLongForm:60},delay:{liveDelay:3}}});let i=this._streamData.drm;i&&i.type==="widevine"&&(console.log("[Molotov Panel] Configuring Widevine DRM"),e.setProtectionData({"com.widevine.alpha":{serverURL:i.license_url,httpRequestHeaders:i.headers||{}}})),e.initialize(t,this._streamData.url,!0),this._adSkip=Ei(this._adSkipEnv(t,e));let s=this._streamData.selectedTrack,n="fr";s?.track_audio&&(n=s.track_audio),e.setInitialMediaSettingsFor("audio",{lang:n}),s?.track_text&&e.setInitialMediaSettingsFor("text",{lang:s.track_text}),e.on(window.dashjs.MediaPlayer.events.ERROR,r=>{let u=r.error?.message||r.error||"Erreur de lecture";console.error("[Molotov Panel] Player error:",u),this._playerError=u,this._playerLoading=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.STREAM_INITIALIZED,()=>{console.log("[Molotov Panel] Stream initialized"),this._player===e&&this._adSkip&&this._adSkip.load({contentId:this._streamData.url},this._streamData.breakSearch),this._enforceAudioLanguage(e,s),this._updateTracks(),this._startProgressUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_STARTED,()=>{console.log("[Molotov Panel] Playback started"),this._showPlayOverlay=!1,this._playerLoading=!1,this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PAUSED,()=>{this._paused=!0,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PLAYING,()=>{this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_ENDED,()=>{console.log("[Molotov Panel] Playback ended"),this._onPlaybackEnded()}),t.volume=this._volume,t.muted=this._muted,this._autoplayCheckTimeout=setTimeout(()=>{this._autoplayCheckTimeout=null,t.paused&&!t.currentTime&&(console.log("[Molotov Panel] Autoplay blocked"),this._showPlayOverlay=!0,this.requestUpdate())},1500)}catch(e){console.error("[Molotov Panel] Failed to init player:",e),this._playerError=e.message}}_adSkipEnv(t,e){let i=()=>{try{let s=e.timeAsUTC();return typeof s=="number"&&isFinite(s)?s:null}catch{return null}};return{isLive:()=>{try{return e.isDynamic()}catch{return!1}},joining:()=>this._playerLoading,state:()=>t.paused?"paused":t.readyState>=2?"playing":"other",currentTime:()=>t.currentTime,liveRange:()=>t.seekable&&t.seekable.length?{start:t.seekable.start(0),end:t.seekable.end(t.seekable.length-1)}:null,absoluteTime:s=>{let n=i();return n===null?null:n+(s-t.currentTime)},mediaTime:s=>{let n=i();return n===null?null:t.currentTime+(s-n)},show:s=>(this._adOffer!==s&&(this._adOffer=s,this.requestUpdate()),s),seek:s=>{t.currentTime=s}}}_startProgressUpdate(){this._updateInterval&&clearInterval(this._updateInterval),this._updateInterval=setInterval(()=>{this._updateProgress()},1e3)}_updateProgress(){let t=this.shadowRoot?.querySelector("video");if(!(!t||!this._player)){if(this._currentTime=t.currentTime,this._duration=t.duration||0,this._paused=t.paused,this._adSkip&&this._adSkip.tick(),this._isLive&&t.seekable&&t.seekable.length>0){let e=t.seekable.end(t.seekable.length-1);this._liveDelay=Math.max(0,(e-t.currentTime)*1e3)}this.requestUpdate()}}_startCastProgressUpdate(){this._stopCastProgressUpdate(),this._castProgressInterval=setInterval(()=>{this._updateCastProgress()},1e3)}_stopCastProgressUpdate(){this._castProgressInterval&&(clearInterval(this._castProgressInterval),this._castProgressInterval=null)}_updateCastProgress(){if(!this._castPlaying){this._stopCastProgressUpdate();return}if(this._castBasePosition!=null&&this._castPositionUpdatedAt&&!this._paused){let t=Date.now()/1e3,e=Math.max(0,t-this._castPositionUpdatedAt);this._currentTime=this._castBasePosition+e}else this._currentTime=this._castBasePosition||0;this.requestUpdate()}_updateTracks(){if(!this._player)return;let t=this._player.getTracksFor("audio")||[];this._audioTracks=t.map((n,r)=>({index:r,lang:n.lang,label:Pi(n.lang)}));let e=this._player.getCurrentTrackFor("audio");e&&(this._selectedAudioIndex=t.findIndex(n=>n.index===e.index));let i=this._player.getTracksFor("text")||[];if(this._textTracks=i.map((n,r)=>({index:r,lang:n.lang,label:Pi(n.lang)})),!this._player.isTextEnabled())this._selectedTextIndex=-1;else{let n=this._player.getCurrentTrackFor("text");n&&(this._selectedTextIndex=i.findIndex(r=>r.index===n.index))}console.log("[Molotov Panel] Audio tracks:",this._audioTracks),console.log("[Molotov Panel] Text tracks:",this._textTracks),this.requestUpdate()}_enforceAudioLanguage(t,e){let i=t.getTracksFor("audio");if(!i||i.length===0)return;let n=t.getCurrentTrackFor("audio")?.lang||"",r="fr";if(e?.track_audio&&(r=e.track_audio),n!==r&&n!=="fra"&&n!=="fre"){let u=i.find(w=>w.lang===r||w.lang==="fra"||w.lang==="fre");!u&&(n==="en"||n==="eng"||n==="qaa")&&(u=i.find(w=>w.lang!=="en"&&w.lang!=="eng"&&w.lang!=="qaa")),u&&(console.log("[Molotov Panel] Switching audio to:",u.lang),t.setCurrentTrack(u))}}_loadDashJs(){return new Promise((t,e)=>{if(window.dashjs){t();return}let i=document.createElement("script");i.src="https://cdn.dashjs.org/v4.7.4/dash.all.min.js",i.crossOrigin="anonymous",i.onload=()=>{console.log("[Molotov Panel] dash.js loaded"),t()},i.onerror=()=>{e(new Error("Failed to load dash.js"))},document.head.appendChild(i)})}_cleanupPlayer(){if(this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null),this._player){try{this._player.reset()}catch{}this._player=null}this._adSkip=null,this._adOffer=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._playerLoading=!1}_stopPlayback(){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState()}_resetLocalPlaybackState(){this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._selectedChannel=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._episodePlaylist=[],this._episodeIndex=-1}_onPlaybackEnded(){if(this._episodePlaylist.length===0||this._episodeIndex<0)return!1;let t=this._episodeIndex+1;if(t>=this._episodePlaylist.length)return this._episodePlaylist=[],this._episodeIndex=-1,!1;let e=this._episodePlaylist[t];return this._episodeIndex=t,console.log(`[Molotov Panel] Auto-playing next episode: ${e.title}`),this._episodeIsRecording?this._playRecordingEpisode(e,this._episodeParentTitle):this._playEpisode(e,this._episodeParentTitle),!0}_goBackFromPlayer(){this._localMinimized=!0,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null)}_goBackFromCast(){this._castMinimized=!0}_expandCurrentPlayback(){this._playing&&this._streamData?(this._localMinimized=!1,this._updateInterval||this._startProgressUpdate()):this._castPlaying&&(this._castMinimized=!1)}_togglePlayPause(){let t=this.shadowRoot.querySelector("video");t&&(t.paused?t.play():t.pause())}_localSeek(t){let e=this.shadowRoot.querySelector("video");if(!e)return;if(t===null){e.currentTime=0;return}let i=e.currentTime+t;e.currentTime=Math.max(0,Math.min(e.duration||1/0,i))}_localSeekBeginning(){this._localSeek(null)}_localSkipBack30(){this._localSeek(-30)}_localSkipBack10(){this._localSeek(-10)}_localSkipForward30(){this._localSeek(30)}_localSkipAd(){this._adSkip&&this._adSkip.skip()}_handleProgressClick(t){let i=t.currentTarget.getBoundingClientRect(),s=(t.clientX-i.left)/i.width;if(this._isLive&&this._programStart&&this._programEnd){if(this._player?.getDVRSeekOffset?.(0)!==void 0){let r=this._player.duration(),u=s*r;this._player.seek(u)}}else if(this._duration){let n=this.shadowRoot.querySelector("video");n&&(n.currentTime=s*this._duration)}}_handleVolumeChange(t){let e=parseFloat(t.target.value);this._volume=e;let i=this.shadowRoot.querySelector("video");i&&(i.volume=e,i.muted=e===0,this._muted=e===0)}_toggleMute(){let t=this.shadowRoot.querySelector("video");t&&(this._muted=!this._muted,t.muted=this._muted,this.requestUpdate())}_selectAudioTrack(t){if(!this._player||t<0||t>=this._audioTracks.length)return;let e=this._player.getTracksFor("audio");e&&e[t]&&(this._player.setCurrentTrack(e[t]),this._selectedAudioIndex=t),this._showAudioMenu=!1,this.requestUpdate()}_selectTextTrack(t){if(this._player){if(t===-1)this._player.enableText(!1),this._selectedTextIndex=-1;else if(t>=0&&t<this._textTracks.length){let e=this._player.getTracksFor("text");e&&e[t]&&(this._player.enableText(!0),this._player.setCurrentTrack(e[t]),this._selectedTextIndex=t)}this._showTextMenu=!1,this.requestUpdate()}}_toggleAudioMenu(t){t.stopPropagation(),this._showAudioMenu=!this._showAudioMenu,this._showTextMenu=!1,this.requestUpdate()}_toggleTextMenu(t){t.stopPropagation(),this._showTextMenu=!this._showTextMenu,this._showAudioMenu=!1,this.requestUpdate()}_toggleFullscreen(){let t=this.shadowRoot.querySelector(".video-wrapper");t&&(document.fullscreenElement?document.exitFullscreen():t.requestFullscreen().catch(e=>{console.error("[Molotov Panel] Fullscreen error:",e)}))}_onFullscreenChange(){this._isFullscreen=!!document.fullscreenElement,this.requestUpdate()}_handlePlayOverlayClick(){let t=this.shadowRoot.querySelector("video");t&&(t.muted=!1,t.play().catch(e=>console.error("[Molotov Panel] Manual play error:",e)),this._showPlayOverlay=!1,this.requestUpdate())}_formatTime(t){if(!t||!isFinite(t))return"00:00";let e=Math.floor(t/3600),i=Math.floor(t%3600/60),s=Math.floor(t%60);return e>0?`${e}:${i.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`:`${i}:${s.toString().padStart(2,"0")}`}_formatClockTime(t){return t?new Date(t).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):""}_getProgressPercent(){if(this._isLive&&this._programStart&&this._programEnd){let t=Date.now()-(this._liveDelay||0),e=this._programEnd-this._programStart;if(e<=0)return 100;let i=t-this._programStart;return Math.min(100,Math.max(0,i/e*100))}else if(this._duration>0&&isFinite(this._duration))return this._currentTime/this._duration*100;return 0}render(){let t=this._playing&&this._streamData,e=t&&!this._localMinimized,i=this._castPlaying&&!this._castMinimized,s=!e&&!i;return v`
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
        @keydown=${w=>this._activateOnKey(w,()=>this._playTonightProgram(t,e))}
      >
        ${t.thumbnail?v`<img class="tonight-program-thumb" src=${t.thumbnail} loading="lazy" @load=${w=>w.target.style.display=""} @error=${w=>w.target.style.display="none"} />`:""}
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
          @click=${w=>this._toggleRecordingExpand(w,t)}
          @keydown=${w=>this._activateOnKey(w,()=>this._toggleRecordingExpand(w,t))}
        >
          ${u?v`<ha-icon class="expand-icon" icon="mdi:play-circle-outline"></ha-icon>`:v`<ha-icon
                class="expand-icon ${i?"expanded":""}"
                icon="mdi:chevron-right"
              ></ha-icon>`}
          ${t.thumbnail?v`<img
                class="recording-thumb"
                src=${t.thumbnail}
                loading="lazy"
                @load=${w=>w.target.style.display=""} @error=${w=>w.target.style.display="none"}
              />`:v`<div class="recording-thumb"></div>`}
          <div class="recording-info">
            <div class="recording-title">${t.title}</div>
            ${t.description?v`<div class="recording-subtitle">${t.description}</div>`:""}
          </div>
        </div>
        ${i?v`
              <div class="episodes-list">
                ${n?v`<div class="episodes-loading">Chargement des episodes...</div>`:s.length>0?s.map(w=>v`
                        <div
                          class="episode-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playRecordingEpisode(w,t.title)}
                          @keydown=${R=>this._activateOnKey(R,()=>this._playRecordingEpisode(w,t.title))}
                        >
                          ${w.thumbnail?v`<img class="episode-thumb" src=${w.thumbnail} loading="lazy" @load=${R=>R.target.style.display=""} @error=${R=>R.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${w.title}</div>
                            ${w.description?v`<div class="episode-desc">${w.description}</div>`:""}
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
    `}_renderChannelItem(t){let e=t.currentProgram,i=e?.start?this._formatClockTime(e.start):"",s=e?.end?this._formatClockTime(e.end):"",n=i&&s?`${i} - ${s}`:"",r=this._expandedChannels[t.id],u=this._channelPrograms[t.id]||[],w=this._loadingPrograms[t.id];return v`
      <div class="channel-row">
        <div class="channel-main">
          <img
            class="channel-logo"
            src=${t.thumbnail||""}
            alt=${t.name}
            loading="lazy"
            @load=${R=>R.target.style.display=""} @error=${R=>R.target.style.display="none"}
            @click=${()=>this._playChannel(t)}
          />
          <div
            class="channel-info"
            role="button"
            tabindex="0"
            @click=${()=>this._playChannel(t)}
            @keydown=${R=>this._activateOnKey(R,()=>this._playChannel(t))}
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
              @click=${R=>this._toggleChannelExpand(R,t)}
            >
              <ha-icon icon="mdi:history"></ha-icon>
              Replay
            </button>
          </div>
        </div>
        ${r?v`
              <div class="replay-list">
                ${w?v`<div class="replay-loading">Chargement...</div>`:u.length>0?u.map(R=>v`
                        <div
                          class="replay-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playReplay(R)}
                          @keydown=${q=>this._activateOnKey(q,()=>this._playReplay(R))}
                        >
                          ${R.thumbnail?v`<img class="replay-thumb" src=${R.thumbnail} loading="lazy" @load=${q=>q.target.style.display=""} @error=${q=>q.target.style.display="none"} />`:""}
                          <div class="replay-item-info">
                            <span class="replay-item-title">${R.title}</span>
                            ${R.description?v`<span class="replay-item-desc">${R.description}</span>`:""}
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
