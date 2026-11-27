var Ke=typeof window<"u"&&window.customElements!=null&&window.customElements.polyfillWrapFlushCallback!==void 0;var Yt=(a,t,e=null)=>{for(;t!==e;){let i=t.nextSibling;a.removeChild(t),t=i}};var mt=`{{lit-${String(Math.random()).slice(2)}}}`,Ye=`<!--${mt}-->`,gi=new RegExp(`${mt}|${Ye}`),ce="$lit$",Xt=class{constructor(t,e){this.parts=[],this.element=e;let i=[],s=[],n=document.createTreeWalker(e.content,133,null,!1),r=0,f=-1,S=0,{strings:$,values:{length:H}}=t;for(;S<H;){let N=n.nextNode();if(N===null){n.currentNode=s.pop();continue}if(f++,N.nodeType===1){if(N.hasAttributes()){let nt=N.attributes,{length:it}=nt,rt=0;for(let lt=0;lt<it;lt++)mi(nt[lt].name,ce)&&rt++;for(;rt-- >0;){let lt=$[S],Mt=Me.exec(lt)[2],pt=Mt.toLowerCase()+ce,_t=N.getAttribute(pt);N.removeAttribute(pt);let ct=_t.split(gi);this.parts.push({type:"attribute",index:f,name:Mt,strings:ct}),S+=ct.length-1}}N.tagName==="TEMPLATE"&&(s.push(N),n.currentNode=N.content)}else if(N.nodeType===3){let nt=N.data;if(nt.indexOf(mt)>=0){let it=N.parentNode,rt=nt.split(gi),lt=rt.length-1;for(let Mt=0;Mt<lt;Mt++){let pt,_t=rt[Mt];if(_t==="")pt=Pt();else{let ct=Me.exec(_t);ct!==null&&mi(ct[2],ce)&&(_t=_t.slice(0,ct.index)+ct[1]+ct[2].slice(0,-ce.length)+ct[3]),pt=document.createTextNode(_t)}it.insertBefore(pt,N),this.parts.push({type:"node",index:++f})}rt[lt]===""?(it.insertBefore(Pt(),N),i.push(N)):N.data=rt[lt],S+=lt}}else if(N.nodeType===8)if(N.data===mt){let nt=N.parentNode;(N.previousSibling===null||f===r)&&(f++,nt.insertBefore(Pt(),N)),r=f,this.parts.push({type:"node",index:f}),N.nextSibling===null?N.data="":(i.push(N),f--),S++}else{let nt=-1;for(;(nt=N.data.indexOf(mt,nt+1))!==-1;)this.parts.push({type:"node",index:-1}),S++}}for(let N of i)N.parentNode.removeChild(N)}},mi=(a,t)=>{let e=a.length-t.length;return e>=0&&a.slice(e)===t},ye=a=>a.index!==-1,Pt=()=>document.createComment(""),Me=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;var Xe=133;function Qe(a,t){let{element:{content:e},parts:i}=a,s=document.createTreeWalker(e,Xe,null,!1),n=be(i),r=i[n],f=-1,S=0,$=[],H=null;for(;s.nextNode();){f++;let N=s.currentNode;for(N.previousSibling===H&&(H=null),t.has(N)&&($.push(N),H===null&&(H=N)),H!==null&&S++;r!==void 0&&r.index===f;)r.index=H!==null?-1:r.index-S,n=be(i,n),r=i[n]}$.forEach(N=>N.parentNode.removeChild(N))}var qi=a=>{let t=a.nodeType===11?0:1,e=document.createTreeWalker(a,Xe,null,!1);for(;e.nextNode();)t++;return t},be=(a,t=-1)=>{for(let e=t+1;e<a.length;e++){let i=a[e];if(ye(i))return e}return-1};function yi(a,t,e=null){let{element:{content:i},parts:s}=a;if(e==null){i.appendChild(t);return}let n=document.createTreeWalker(i,Xe,null,!1),r=be(s),f=0,S=-1;for(;n.nextNode();)for(S++,n.currentNode===e&&(f=qi(t),e.parentNode.insertBefore(t,e));r!==-1&&s[r].index===S;){if(f>0){for(;r!==-1;)s[r].index+=f,r=be(s,r);return}r=be(s,r)}}var Vi=new WeakMap;var Qt=a=>typeof a=="function"&&Vi.has(a);var ut={},Re={};var Dt=class{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(let i of this.__parts)i!==void 0&&i.setValue(t[e]),e++;for(let i of this.__parts)i!==void 0&&i.commit()}_clone(){let t=Ke?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],i=this.template.parts,s=document.createTreeWalker(t,133,null,!1),n=0,r=0,f,S=s.nextNode();for(;n<i.length;){if(f=i[n],!ye(f)){this.__parts.push(void 0),n++;continue}for(;r<f.index;)r++,S.nodeName==="TEMPLATE"&&(e.push(S),s.currentNode=S.content),(S=s.nextNode())===null&&(s.currentNode=e.pop(),S=s.nextNode());if(f.type==="node"){let $=this.processor.handleTextExpression(this.options);$.insertAfterNode(S.previousSibling),this.__parts.push($)}else this.__parts.push(...this.processor.handleAttributeExpressions(S,f.name,f.strings,this.options));n++}return Ke&&(document.adoptNode(t),customElements.upgrade(t)),t}};var bi=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:a=>a}),Hi=` ${mt} `,It=class{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){let t=this.strings.length-1,e="",i=!1;for(let s=0;s<t;s++){let n=this.strings[s],r=n.lastIndexOf("<!--");i=(r>-1||i)&&n.indexOf("-->",r+1)===-1;let f=Me.exec(n);f===null?e+=n+(i?Hi:Ye):e+=n.substr(0,f.index)+f[1]+f[2]+ce+f[3]+mt}return e+=this.strings[t],e}getTemplateElement(){let t=document.createElement("template"),e=this.getHTML();return bi!==void 0&&(e=bi.createHTML(e)),t.innerHTML=e,t}};var Le=a=>a===null||!(typeof a=="object"||typeof a=="function"),$e=a=>Array.isArray(a)||!!(a&&a[Symbol.iterator]),de=class{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let s=0;s<i.length-1;s++)this.parts[s]=this._createPart()}_createPart(){return new ve(this)}_getValue(){let t=this.strings,e=t.length-1,i=this.parts;if(e===1&&t[0]===""&&t[1]===""){let n=i[0].value;if(typeof n=="symbol")return String(n);if(typeof n=="string"||!$e(n))return n}let s="";for(let n=0;n<e;n++){s+=t[n];let r=i[n];if(r!==void 0){let f=r.value;if(Le(f)||!$e(f))s+=typeof f=="string"?f:String(f);else for(let S of f)s+=typeof S=="string"?S:String(S)}}return s+=t[e],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}},ve=class{constructor(t){this.value=void 0,this.committer=t}setValue(t){t!==ut&&(!Le(t)||t!==this.value)&&(this.value=t,Qt(t)||(this.committer.dirty=!0))}commit(){for(;Qt(this.value);){let t=this.value;this.value=ut,t(this)}this.value!==ut&&this.committer.commit()}},Jt=class a{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(Pt()),this.endNode=t.appendChild(Pt())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=Pt()),t.__insert(this.endNode=Pt())}insertAfterPart(t){t.__insert(this.startNode=Pt()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(this.startNode.parentNode===null)return;for(;Qt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=ut,e(this)}let t=this.__pendingValue;t!==ut&&(Le(t)?t!==this.value&&this.__commitText(t):t instanceof It?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):$e(t)?this.__commitIterable(t):t===Re?(this.value=Re,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){let e=this.startNode.nextSibling;t=t??"";let i=typeof t=="string"?t:String(t);e===this.endNode.previousSibling&&e.nodeType===3?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){let e=this.options.templateFactory(t);if(this.value instanceof Dt&&this.value.template===e)this.value.update(t.values);else{let i=new Dt(e,t.processor,this.options),s=i._clone();i.update(t.values),this.__commitNode(s),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());let e=this.value,i=0,s;for(let n of t)s=e[i],s===void 0&&(s=new a(this.options),e.push(s),i===0?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(n),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){Yt(this.startNode.parentNode,t.nextSibling,this.endNode)}},xe=class{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,i.length!==2||i[0]!==""||i[1]!=="")throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;Qt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=ut,e(this)}if(this.__pendingValue===ut)return;let t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=ut}},we=class extends de{constructor(t,e,i){super(t,e,i),this.single=i.length===2&&i[0]===""&&i[1]===""}_createPart(){return new Ne(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}},Ne=class extends ve{},vi=!1;(()=>{try{let a={get capture(){return vi=!0,!1}};window.addEventListener("test",a,a),window.removeEventListener("test",a,a)}catch{}})();var Se=class{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=s=>this.handleEvent(s)}setValue(t){this.__pendingValue=t}commit(){for(;Qt(this.__pendingValue);){let n=this.__pendingValue;this.__pendingValue=ut,n(this)}if(this.__pendingValue===ut)return;let t=this.__pendingValue,e=this.value,i=t==null||e!=null&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),s=t!=null&&(e==null||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=Wi(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=ut}handleEvent(t){typeof this.value=="function"?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}},Wi=a=>a&&(vi?{capture:a.capture,passive:a.passive,once:a.once}:a.capture);function Je(a){let t=Zt.get(a.type);t===void 0&&(t={stringsArray:new WeakMap,keyString:new Map},Zt.set(a.type,t));let e=t.stringsArray.get(a.strings);if(e!==void 0)return e;let i=a.strings.join(mt);return e=t.keyString.get(i),e===void 0&&(e=new Xt(a,a.getTemplateElement()),t.keyString.set(i,e)),t.stringsArray.set(a.strings,e),e}var Zt=new Map;var Ft=new WeakMap,Ze=(a,t,e)=>{let i=Ft.get(t);i===void 0&&(Yt(t,t.firstChild),Ft.set(t,i=new Jt(Object.assign({templateFactory:Je},e))),i.appendInto(t)),i.setValue(a),i.commit()};var Oe=class{handleAttributeExpressions(t,e,i,s){let n=e[0];return n==="."?new we(t,e.slice(1),i).parts:n==="@"?[new Se(t,e.slice(1),s.eventContext)]:n==="?"?[new xe(t,e.slice(1),i)]:new de(t,e,i).parts}handleTextExpression(t){return new Jt(t)}},ti=new Oe;typeof window<"u"&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var w=(a,...t)=>new It(a,t,"html",ti);var wi=(a,t)=>`${a}--${t}`,Ue=!0;typeof window.ShadyCSS>"u"?Ue=!1:typeof window.ShadyCSS.prepareTemplateDom>"u"&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),Ue=!1);var Yi=a=>t=>{let e=wi(t.type,a),i=Zt.get(e);i===void 0&&(i={stringsArray:new WeakMap,keyString:new Map},Zt.set(e,i));let s=i.stringsArray.get(t.strings);if(s!==void 0)return s;let n=t.strings.join(mt);if(s=i.keyString.get(n),s===void 0){let r=t.getTemplateElement();Ue&&window.ShadyCSS.prepareTemplateDom(r,a),s=new Xt(t,r),i.keyString.set(n,s)}return i.stringsArray.set(t.strings,s),s},Xi=["html","svg"],Qi=a=>{Xi.forEach(t=>{let e=Zt.get(wi(t,a));e!==void 0&&e.keyString.forEach(i=>{let{element:{content:s}}=i,n=new Set;Array.from(s.querySelectorAll("style")).forEach(r=>{n.add(r)}),Qe(i,n)})})},Si=new Set,Ji=(a,t,e)=>{Si.add(a);let i=e?e.element:document.createElement("template"),s=t.querySelectorAll("style"),{length:n}=s;if(n===0){window.ShadyCSS.prepareTemplateStyles(i,a);return}let r=document.createElement("style");for(let $=0;$<n;$++){let H=s[$];H.parentNode.removeChild(H),r.textContent+=H.textContent}Qi(a);let f=i.content;e?yi(e,r,f.firstChild):f.insertBefore(r,f.firstChild),window.ShadyCSS.prepareTemplateStyles(i,a);let S=f.querySelector("style");if(window.ShadyCSS.nativeShadow&&S!==null)t.insertBefore(S.cloneNode(!0),t.firstChild);else if(e){f.insertBefore(r,f.firstChild);let $=new Set;$.add(r),Qe(e,$)}},ki=(a,t,e)=>{if(!e||typeof e!="object"||!e.scopeName)throw new Error("The `scopeName` option is required.");let i=e.scopeName,s=Ft.has(t),n=Ue&&t.nodeType===11&&!!t.host,r=n&&!Si.has(i),f=r?document.createDocumentFragment():t;if(Ze(a,f,Object.assign({templateFactory:Yi(i)},e)),r){let S=Ft.get(f);Ft.delete(f);let $=S.value instanceof Dt?S.value.template:void 0;Ji(i,f,$),Yt(t,t.firstChild),t.appendChild(f),Ft.set(t,S)}!s&&n&&window.ShadyCSS.styleElement(t.host)};var Ei;window.JSCompiler_renameProperty=(a,t)=>a;var oi={toAttribute(a,t){switch(t){case Boolean:return a?"":null;case Object:case Array:return a==null?a:JSON.stringify(a)}return a},fromAttribute(a,t){switch(t){case Boolean:return a!==null;case Number:return a===null?null:Number(a);case Object:case Array:return JSON.parse(a)}return a}},Pi=(a,t)=>t!==a&&(t===t||a===a),ei={attribute:!0,type:String,converter:oi,reflect:!1,hasChanged:Pi},ii=1,si=4,ni=8,ri=16,ai="finalized",he=class extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();let t=[];return this._classProperties.forEach((e,i)=>{let s=this._attributeNameForProperty(i,e);s!==void 0&&(this._attributeToPropertyMap.set(s,i),t.push(s))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;let t=Object.getPrototypeOf(this)._classProperties;t!==void 0&&t.forEach((e,i)=>this._classProperties.set(i,e))}}static createProperty(t,e=ei){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;let i=typeof t=="symbol"?Symbol():`__${t}`,s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Object.defineProperty(this.prototype,t,s)}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){let n=this[t];this[e]=s,this.requestUpdateInternal(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||ei}static finalize(){let t=Object.getPrototypeOf(this);if(t.hasOwnProperty(ai)||t.finalize(),this[ai]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){let e=this.properties,i=[...Object.getOwnPropertyNames(e),...typeof Object.getOwnPropertySymbols=="function"?Object.getOwnPropertySymbols(e):[]];for(let s of i)this.createProperty(s,e[s])}}static _attributeNameForProperty(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=Pi){return i(t,e)}static _propertyValueFromAttribute(t,e){let i=e.type,s=e.converter||oi,n=typeof s=="function"?s:s.fromAttribute;return n?n(t,i):t}static _propertyValueToAttribute(t,e){if(e.reflect===void 0)return;let i=e.type,s=e.converter;return(s&&s.toAttribute||oi.toAttribute)(t,i)}initialize(){this._updateState=0,this._updatePromise=new Promise(t=>this._enableUpdatingResolver=t),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){let i=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,i)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){this._enableUpdatingResolver!==void 0&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=ei){let s=this.constructor,n=s._attributeNameForProperty(t,i);if(n!==void 0){let r=s._propertyValueToAttribute(e,i);if(r===void 0)return;this._updateState=this._updateState|ni,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._updateState=this._updateState&~ni}}_attributeToProperty(t,e){if(this._updateState&ni)return;let i=this.constructor,s=i._attributeToPropertyMap.get(t);if(s!==void 0){let n=i.getPropertyOptions(s);this._updateState=this._updateState|ri,this[s]=i._propertyValueFromAttribute(e,n),this._updateState=this._updateState&~ri}}requestUpdateInternal(t,e,i){let s=!0;if(t!==void 0){let n=this.constructor;i=i||n.getPropertyOptions(t),n._valueHasChanged(this[t],e,i.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),i.reflect===!0&&!(this._updateState&ri)&&(this._reflectingProperties===void 0&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,i))):s=!1}!this._hasRequestedUpdate&&s&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=this._updateState|si;try{await this._updatePromise}catch{}let t=this.performUpdate();return t!=null&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return this._updateState&si}get hasUpdated(){return this._updateState&ii}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1,e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(i){throw t=!1,this._markUpdated(),i}t&&(this._updateState&ii||(this._updateState=this._updateState|ii,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~si}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){this._reflectingProperties!==void 0&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,i)=>this._propertyToAttribute(i,this[i],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}};Ei=ai;he[Ei]=!0;var Ti=Element.prototype,Js=Ti.msMatchesSelector||Ti.webkitMatchesSelector;var De=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,li=Symbol(),ke=class{constructor(t,e){if(e!==li)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return this._styleSheet===void 0&&(De?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}},Ci=a=>new ke(String(a),li),Zi=a=>{if(a instanceof ke)return a.cssText;if(typeof a=="number")return a;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${a}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`)},Ai=(a,...t)=>{let e=t.reduce((i,s,n)=>i+Zi(s)+a[n+1],a[0]);return new ke(e,li)};(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");var Ii={},te=class extends he{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;let t=this.getStyles();if(Array.isArray(t)){let e=(n,r)=>n.reduceRight((f,S)=>Array.isArray(S)?e(S,f):(f.add(S),f),r),i=e(t,new Set),s=[];i.forEach(n=>s.unshift(n)),this._styles=s}else this._styles=t===void 0?[]:[t];this._styles=this._styles.map(e=>{if(e instanceof CSSStyleSheet&&!De){let i=Array.prototype.slice.call(e.cssRules).reduce((s,n)=>s+n.cssText,"");return Ci(i)}return e})}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){let t=this.constructor._styles;t.length!==0&&(window.ShadyCSS!==void 0&&!window.ShadyCSS.nativeShadow?window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(e=>e.cssText),this.localName):De?this.renderRoot.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):this._needsShimAdoptedStyleSheets=!0)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&window.ShadyCSS!==void 0&&window.ShadyCSS.styleElement(this)}update(t){let e=this.render();super.update(t),e!==Ii&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(i=>{let s=document.createElement("style");s.textContent=i.cssText,this.renderRoot.appendChild(s)}))}render(){return Ii}};te.finalized=!0;te.render=ki;te.shadowRootOptions={mode:"open"};var z=(()=>{function $t(c,b){let _=[],o=0;for(;o<c.length;){if(!c[o]){o++;continue}let h=o,u=o+1;for(;u<c.length&&u-h<=b+1;)c[u]&&(h=u),u++;_.push([o,h]),o=h+1}return _}function qe(c,b,_){let o=0;for(let v of c)v&&o++;if(!(_>0)||o*2<c.length)return null;let h=$t(c,3).filter(v=>(v[1]-v[0]+1)*_>=60),u=[];for(let v=0;v+1<h.length;v++){let C=h[v],A=h[v+1],L=b+(C[1]+1)*_,T=b+A[0]*_,M=0;for(let U=C[1]+1;U<A[0];U++)c[U]&&M++;T-L>=150&&T-L<=800&&M*2<A[0]-C[1]-1&&u.push([L,T])}return u}function ee(c,b,_){let o=new Array(c.length).fill(!1);for(let h=0;h<c.length;h++){if(!_[h])continue;let u=[];for(let v=Math.max(0,h-2);v<=Math.min(c.length-1,h+2);v++)_[v]&&u.push(c[v]);u.sort((v,C)=>v-C),o[h]=u[u.length>>1]<.5*b}return o}function ie(c){let b=new Array(c.length).fill(!1);for(let _ of $t(c,0))if(_[1]-_[0]+1>=5)for(let o=_[0];o<=_[1];o++)b[o]=!0;return b}function ue(c,b,_,o,h){let u=ie(c),v=(M,U)=>{if(M<0||U>u.length)return!1;let D=0;for(let bt=M;bt<U;bt++)u[bt]||D++;return D>=8},C=M=>{let U=(M[1]+1-M[0])*b;return v(M[0]-15,M[0])&&v(M[1]+1,M[1]+1+15)&&U>=150&&U<=1200},A=$t(u,7);if(!_||!o)return A.filter(C);let L=h?A.filter(M=>M[1]-M[0]+1>=10):A,T=[];for(let M of Pe(L,_,o,b)){let U=L.filter(D=>D[0]>=M[0]&&D[1]<=M[1]);if(C(M)&&(!h||U.length===1||U.some(C)))T.push(M);else for(let D of U)C(D)&&T.push([D[0],D[1]])}return T}function Pe(c,b,_,o){let h=[];for(let u of c){let v=h[h.length-1];v&&(u[1]+1-v[0])*o<=1200&&Ve(v[1]+1,u[0],b,_)?v[1]=u[1]:h.push([u[0],u[1]])}return h}function Ve(c,b,_,o){let h=0;for(let u=c;u<b;u++)(_[u]||o[u])&&h++;return b-c<=29&&h>=b-c-7&&Te(_,c,b)<=10&&Te(o,c,b)<=12}function Te(c,b,_){let o=0,h=0;for(let u=b;u<_;u++)o=c[u]?o+1:0,h=Math.max(h,o);return h}function se(c,b,_,o){let h=c,u=o?c.map((T,M)=>!T&&o[M]):null,v=o?c.map((T,M)=>T&&!o[M]):null,C=ue(h,_,v,u,!0);if(o){h=new Array(c.length).fill(!1);let T=new Array(c.length).fill(!1);for(let M of C)for(let U=M[0];U<=M[1];U++)h[U]=c[U]&&o[U],T[U]=c[U]&&!o[U];C=ue(h,_,T,u)}let A=ie(h),L=o?Bt(c,o,C,b,_):[];return C.map(T=>{let M=$t(A.slice(T[0],T[1]+1),0),U=ot(o?yt(M,T[0],c,o):M);return[b+(T[0]+U[0])*_,b+(T[0]+U[1]+1)*_]}).concat(L)}function ot(c){let b=0,_=c.length-1;for(;_>b&&c[_][1]-c[_][0]+1<10;)_--;for(;b<_&&c[b][1]-c[b][0]+1<10;)b++;return[c[b][0],c[_][1]]}function yt(c,b,_,o){let h=[];for(let u of c){let v=h[h.length-1];v&&!F(b+v[1]+1,b+u[0],_,o)?v[1]=u[1]:h.push([u[0],u[1]])}return h}function F(c,b,_,o){let h=0;for(let u=c;u<b;u++)if(!_[u]&&!o[u]||(h=o[u]?0:h+1,h>=5))return!0;return!1}function Bt(c,b,_,o,h){let u=ie(c),v=(A,L)=>{if(A<0||L>u.length)return!1;let T=0;for(let M=A;M<L;M++)u[M]||T++;return T>=12},C=[];for(let A of ue(b,h)){if(_.some(D=>D[0]<=A[1]&&A[0]<=D[1]))continue;let L=0;for(let D=A[0];D<=A[1];D++)c[D]&&L++;if(L<.5*(A[1]-A[0]+1))continue;let T=-1,M=-1;for(let D=A[0];D<=A[1];D++)u[D]&&(T<0&&(T=D),M=D+1);if(T<0||(M-T)*h<150||!v(T-15,T)||!v(M,M+15))continue;let U=ot(yt($t(u.slice(A[0],A[1]+1),0),A[0],c,b));C.push([o+(A[0]+U[0])*h,o+(A[0]+U[1]+1)*h])}return C}function zt(c,b){if(c===null)return b||[];if(b===null)return c;let _=[];for(let o of c)for(let h of b){let u=Math.max(o[0],h[0]),v=Math.min(o[1],h[1]);v-u<60||_.push([Math.abs(o[0]-h[0])<=90?h[0]:u,Math.abs(o[1]-h[1])<=90?h[1]:v])}return _}function Nt(c,b,_){let o=Math.floor(b*.22),h=Math.floor(_*.22),u=o-1,v=h-1,C=u*v,A=[[0,0],[b-o,0],[0,_-h],[b-o,_-h]],L=A.map(()=>new Uint8Array(C>0?c*C:0)),T=new Array(c).fill(!1),M=-1;function U(I,X){if(!(C<=0||I<0||I>=c||X.length<b*_)){for(let V=0;V<A.length;V++){let Z=A[V][0],K=A[V][1],tt=L[V],Q=I*C;for(let G=0;G<v;G++){let W=(K+G)*b+Z;for(let kt=0;kt<u;kt++){let At=X[W];tt[Q++]=Math.min(255,Math.abs(X[W+1]-At)+Math.abs(X[W+b]-At)),W++}}}T[I]=!0}}function D(I,X,V){let Z=L[I],K=new Uint8Array(C);for(let W=0;W<C;W++){V.fill(0);for(let Ge of X)V[Z[Ge*C+W]]++;let kt=0,At=0;for(;kt+V[At]<=X.length>>1;)kt+=V[At++];K[W]=At}let tt=Math.max(1,Array.from(K).sort((W,kt)=>W-kt)[Math.floor(C*.92)]),Q=[],G=0;for(let W=0;W<C;W++)K[W]>=tt&&(Q.push(W),G+=K[W]);return Q.length===0?null:{corner:I,median:K,mask:Q,strength:G/Q.length,whole:G}}function bt(I,X,V,Z){let K=null;for(let tt=I;tt<X;tt++){let Q=D(tt,V,Z);Q!==null&&(K===null||Q.strength>K.strength)&&(K=Q)}return K}function Gt(I,X){let V=L[I.corner],Z=new Float64Array(c),K=[];for(let tt of X){let Q=tt*C,G=0;for(let W of I.mask)G+=Math.min(V[Q+W],I.median[W]);Z[tt]=G/I.whole,K.push(Z[tt])}return K.sort((tt,Q)=>tt-Q),I.score=Z,I.usual=K[K.length>>1],I}function Ht(){let I=[];for(let G=0;G<c;G++)T[G]&&I.push(G);if(C<=0||I.length<30)return null;let X=new Int32Array(256),V=G=>G!==null&&G.strength>=25?G:null,Z=G=>G!==null&&G.strength>=30?G:null,K=bt(2,L.length,I,X),tt=M<0?V(bt(0,2,I,X)):M<2?D(M,I,X):null,Q=tt!==null?tt:M<0?V(K):D(M,I,X);return Q===null?null:(M=Q.corner,Gt(Q,I),Q.lower=tt!==null&&Z(K)!==null?Gt(K,I):null,Q)}function Wt(I){let X=A[I.corner][0],V=A[I.corner][1];return{width:b,points:I.mask.map(Z=>(V+Math.floor(Z/u))*b+X+Z%u),pattern:I.mask.map(Z=>I.median[Z]),whole:I.whole,usual:I.usual,strength:I.strength,lower:I.lower?Wt(I.lower):null,channel:I.corner<2}}function Y(){let I=Ht();return I===null?null:Wt(I)}function St(){let I=Ht();return I===null?null:ee(I.score,I.usual,T)}return{add:U,logo:Y,gone:St,breaks:(I,X)=>{let V=Ht();if(V===null)return null;let Z=V.lower?ee(V.lower.score,V.lower.usual,T):null;return se(ee(V.score,V.usual,T),I,X,Z)}}}function ft(c){return c.lower?Object.assign({},c,{lower:null}):c}function jt(c,b,_){let o=0;for(let h of b)Lt(c,h)>=.5*c.usual&&o++;return o>=_*b.length}function Lt(c,b){let _=0;for(let o=0;o<c.points.length;o++){let h=c.points[o],u=b[h];_+=Math.min(Math.abs(b[h+1]-u)+Math.abs(b[h+c.width]-u),c.pattern[o])}return _/c.whole}function gt(c){let b=String(c).match(/[A-Za-z0-9+\/]{16,}={0,2}/g)||[];for(let _ of b){let o;try{o=atob(_)}catch{continue}if(o.length<20||o.charCodeAt(0)!==252)continue;let h=u=>{if(u<0||u>=o.length)throw new RangeError("short");return o.charCodeAt(u)};try{if(h(13)===5&&!(h(18)&128))return(h(19)&128)!==0;for(let u=16;u+4<=o.length;u++){if(o.substr(u,4)!=="CUEI"||h(u-2)!==2)continue;let v=u+8;if(h(v)&128)continue;v++;let C=h(v);v++,C&128||(v+=1+6*h(v)),C&64&&(v+=5),v+=2+h(v+1);let A=h(v);if([34,48,50,52,54].indexOf(A)>=0)return!0;if([35,49,51,53,55].indexOf(A)>=0)return!1}}catch{return null}return null}return null}function Ot(c){let b=[];if(c.some(_=>_.signalled))for(let _ of c)for(let o of _.marks){if(!o.opens)continue;let h=null;if(o.duration!==null)h=o.at+o.duration;else{let u=_.marks.filter(v=>v.at>o.at).map(v=>v.at);h=u.length>0?Math.min.apply(null,u):_.end}h!==null&&h>o.at&&b.push([o.at,h])}else{let _=o=>o.end-o.start;for(let o=1;o+1<c.length;o++){let h=c[o-1],u=c[o],v=c[o+1];if(h.end===null||u.end===null||v.end===null)continue;_(u)<10&&_(h)>=60&&_(h)<=420&&_(v)>=60&&_(v)<=420&&b.push([h.start,v.end])}if(b.length>0)for(let o=1;o+1<c.length;o++){let h=c[o-1],u=c[o],v=c[o+1];if(h.end===null||u.end===null)continue;_(u)>=60&&_(u)<=420&&_(h)>420&&(v.end===null||_(v)>420)&&b.push([u.start,u.end])}}return pe(b,10)}function pe(c,b){let _=[];for(let o of c.slice().sort((h,u)=>h[0]-u[0])){let h=_[_.length-1];h&&o[0]-h[1]<=b?h[1]=Math.max(h[1],o[1]):_.push([o[0],o[1]])}return _}let Tt={270:{tiny:120,mean:40,key:4e3},540:{tiny:172,mean:86,key:8e3},1080:{tiny:430,mean:172,key:12e3}},ne=10,_e=20,qt=.2,Vt=6,et=90,re=60,Ut=100,Ct=3,fe=65536,ge=1e4;function dt(c,b){return String.fromCharCode(c[b+4],c[b+5],c[b+6],c[b+7])}function xt(c){let b=new DataView(c.buffer,c.byteOffset,c.byteLength),_=0;for(;c.length-_>=8;){let o=b.getUint32(_);if(o<8||_+o>fe)return null;if(dt(c,_)==="moof")return _+o;_+=o}return null}function ht(c,b,_,o){let h=[],u=_;for(;o-u>=8;){let v=b.getUint32(u);if(v<8||v>o-u)break;h.push({type:dt(c,u),from:u+8,to:u+v}),u+=v}return h}function oe(c){let b=xt(c);if(b===null||b>c.length)return null;let _=new DataView(c.buffer,c.byteOffset,c.byteLength),o=ht(c,_,0,b).pop();if(!o||o.type!=="moof")return null;let h=ht(c,_,o.from,o.to).filter(C=>C.type==="traf")[0];if(!h)return null;let u=[],v=-1;for(let C of ht(c,_,h.from,h.to)){if(C.type!=="tfhd"&&C.type!=="trun")continue;let A=C.from;if(C.to-A<8)return null;let L=_.getUint32(A)&16777215;if(C.type==="tfhd"){let T=A+8;if(L&1&&(T+=8),L&2&&(T+=4),L&8&&(T+=4),L&16){if(T+4>C.to)return null;v=_.getUint32(T)}}else{let T=_.getUint32(A+4),M=((L&256?1:0)+(L&512?1:0)+(L&1024?1:0)+(L&2048?1:0))*4,U=A+8+(L&1?4:0)+(L&4?4:0);if(T>ge||U+T*M>C.to||!(L&512)&&v<0)return null;for(let D=0;D<T;D++)u.push(L&512?_.getUint32(U+(L&256?4:0)):v),U+=M}}return u}function Ce(c,b,_,o){let h=[],u=0,v=0;for(let C=0;C<c.length;C++){let A=c[C];if(A>=0&&A<o.tiny){u++,v+=A;continue}u>=ne&&u<=_e&&v<=o.mean*u&&A>o.key&&h.push(b+C*_),u=0,v=0}return h}function wt(c){let b=[];for(let o of c.slice().sort((h,u)=>h-u)){let h=b[b.length-1];h&&o-h[h.length-1]<=qt||(h&&o-h[h.length-1]<=re?h.push(o):b.push([o]))}let _=[];for(let o=0;o<b.length;o++){let h=b[o],u=b[o+1],v=_[_.length-1];v&&!(v.length>=Ct&&h[0]-v[v.length-1]<=Ut)&&(v=null),v&&h.length>=Ct?v.push(...h):v&&u&&u.length>=Ct&&u[0]-h[h.length-1]<=Ut?(v.push(...h,...u),o++):_.push(h)}return _.filter(o=>o.length>=Vt&&o[o.length-1]-o[0]>=et).map(o=>[o[1],o[o.length-2]])}function ae(c,b){let _=b.filter(o=>o[0]<c[1]&&o[1]>c[1])[0];return _?[c[0],_[1]]:c}return{runs:$t,captionBreaks:qe,gone:ee,solid:ie,logoBreaks:se,combine:zt,track:Nt,score:Lt,alone:ft,seenIn:jt,opens:gt,markedBreaks:Ot,merge:pe,moofEnd:xt,frameSizes:oe,separatorEnds:Ce,separatedBreaks:wt,reachSeparated:ae,BLACKS:Tt,SEP_WIDE_GAP_S:Ut,BRIDGE:7,AROUND:15,LOGO_MAX_S:1200}})();function Mi(a){let pt=z.LOGO_MAX_S+160,_t=pt+120,ct=3,Be=4096,Rt=Math.min.apply(null,Object.keys(z.BLACKS).map(Number)),ze=6,je=2,Ee=480,di=1,hi=8,$t=60,qe=4,ee=3e4,ie=4e3,ue=150,Pe=1e4,Ve=5*60*1e3,Te=10,se=2e4,ot=240,yt=135,F=0,Bt=null,zt=!1,Nt=null,ft=null,jt=[],Lt=[],gt="none",Ot=null,pe=0,Tt=new Map,ne=[],_e=0,qt="none",Vt=[],et=null,re="none",Ut=-1/0,Ct=0,fe=new Map,ge=null,dt=new Map,xt=new Map,ht=new Map,oe=0,Ce=0,wt=null,ae=!1,c=null,b=!1,_="none",o=[],h=0,u=new Map,v=new Map,C=[],A=0,L="",T=!1;function M(d){let l=String(d).indexOf("?");return l<0?String(d):String(d).slice(0,l)}function U(d,l){try{let g=d&&d.contentId,p=!!a.isLive(),m=g?M(g):null;Nt=g||null;let x=l&&l.live_thumbnails_url;ft=p&&typeof x=="string"&&x.indexOf("https://")===0?x.replace(/\/+$/,""):null,b=p&&!!(l&&l.separated_breaks===!0);let k=!p&&!!(l&&l.recording)&&m!==null;if(m!==null&&m===Bt&&p===zt){k&&/^error/.test(gt)&&(Ot={url:Nt,name:Bt,mine:F});return}F++,Bt=m,zt=p,wt=null,ae=a.show(!1),jt=[],Lt=[],gt=k?"waiting":"none",ne=[],_e=0,qt="none",Vt=[],et=null,re="none",Ut=-1/0,Ct=0,ge=null,dt=new Map,xt=new Map,ht=new Map,_=b?"waiting":"none",o=[],h=0,u=new Map,v=new Map,C=[],A=0,L="",T=!1,Ot=k?{url:Nt,name:Bt,mine:F}:null,pe=0}catch{gt="error"}}function D(d,l,g){let p=new Array(d.length),m=0,x=async()=>{for(;m<d.length;){let y=m++;p[y]=await g(d[y],y)}},k=[];for(let y=0;y<Math.min(l,d.length);y++)k.push(x());return Promise.all(k).then(()=>p)}async function bt(d){let l=new AbortController,g=setTimeout(()=>l.abort(),se);try{let p=await fetch(d,{credentials:"omit",signal:l.signal});if(!p.ok)throw new Error("http "+p.status);return await p.text()}finally{clearTimeout(g)}}function Gt(d,l,g){return new Promise(p=>{let m=new Image,x=setTimeout(()=>{m.onload=null,m.onerror=null,p(null)},se);m.crossOrigin="anonymous",m.onload=()=>{clearTimeout(x);try{c===null&&(c=document.createElement("canvas")),(c.width!==l||c.height!==g)&&(c.width=l,c.height=g);let k=c.getContext("2d",{willReadFrequently:!0});k.drawImage(m,0,0,l,g),p(k.getImageData(0,0,l,g).data)}catch{p(null)}},m.onerror=()=>{clearTimeout(x),p(null)},m.src=d})}function Ht(d,l,g){let p=new Uint8Array(ot*yt),m=0;for(let x=0;x<yt;x++){let k=(x*l+g)*4;for(let y=0;y<ot;y++)p[m++]=d[k]*77+d[k+1]*150+d[k+2]*29>>8,k+=4}return p}function Wt(d){let l=/^PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?$/.exec(d||"");return l?Number(l[1]||0)*3600+Number(l[2]||0)*60+Number(l[3]||0):NaN}function Y(d,l){let g=[];for(let p=d.firstElementChild;p;p=p.nextElementSibling)p.localName===l&&g.push(p);return g}function St(d,l){let g=Y(d,"BaseURL")[0];return g&&g.textContent?new URL(g.textContent.trim(),l).href:l}function I(d,l,g,p){let m=p||Y(d,"Representation")[0];if(!m)return[];let x=Y(d,"SegmentTemplate")[0]||Y(m,"SegmentTemplate")[0],k=x&&x.getAttribute("media");if(!k)return[];let y=Number(x.getAttribute("timescale")||1),P=Number(x.getAttribute("presentationTimeOffset")||0),O=(J,vt,Et)=>J.replace(new RegExp("\\$"+vt+"(?:%0(\\d+)d)?\\$","g"),(le,Kt)=>Kt?String(Et).padStart(Number(Kt),"0"):String(Et)),B=(J,vt)=>new URL(O(O(k.split("$RepresentationID$").join(m.getAttribute("id")),"Time",J),"Number",vt),l).href,E=[],R=Y(x,"SegmentTimeline")[0];if(R){let J=0,vt=Number(x.getAttribute("startNumber")||1),Et=Y(R,"S");for(let le=0;le<Et.length;le++){let Kt=Et[le];Kt.getAttribute("t")!==null&&(J=Number(Kt.getAttribute("t")));let Ae=Number(Kt.getAttribute("d")),Ie=Number(Kt.getAttribute("r")||0);if(!(Ae>0))return[];if(Ie<0){let me=le+1<Et.length?Et[le+1].getAttribute("t"):null,ji=me!==null?Number(me):g*y+P;Ie=Math.ceil((ji-J)/Ae)-1}if(!(Ie>=0))return[];for(let me=0;me<=Ie;me++)if(E.push({time:(J-P)/y,duration:Ae/y,url:B(J,vt)}),J+=Ae,vt++,E.length>Pe)return[]}return E}let j=Number(x.getAttribute("duration"))/y,q=Number(x.getAttribute("startNumber")||1);if(!(j>0))return[];let st=0;x.getAttribute("eptDelta")!==null?st=Number(x.getAttribute("eptDelta"))/y:st=(q-1)*j-P/y,st<0&&-st<j||(st=0);let at=x.getAttribute("endNumber")!==null?Number(x.getAttribute("endNumber")):q+Math.ceil((g-st)/j)-1;if(!(at>=q)||at-q+1>Pe)return[];for(let J=q;J<=at;J++)E.push({time:(J-q)*j+st,duration:j,url:B("",J)});return E}async function X(d,l){if(d.length===0)return null;let g=/<p\b[^>]*>([\s\S]*?)<\/p>/g,p=0,m=await D(d,4,async x=>{if(l!==F)return!0;try{let k=await bt(x.url).catch(()=>bt(x.url)),y;for(g.lastIndex=0;(y=g.exec(k))!==null;)if(y[1].replace(/<[^>]+>/g,"").trim()!=="")return!0;return!1}catch{return p++,!0}});if(l!==F)throw new Error("superseded");if(p*20>m.length)throw new Error("captions unread");return z.captionBreaks(m,d[0].time,d[0].duration)}async function V(d,l,g,p){if(d.length===0||d.length>ue||g!==1||!(l>0))return null;let m=l,x=z.track(d.length*m,ot,yt),k=async B=>(await D(B,1,async R=>{if(p!==F)return!1;let j=await Gt(d[R].url,l*ot,yt);if(j===null&&p===F&&(j=await Gt(d[R].url,l*ot,yt)),j===null)return!1;for(let q=0;q<m;q++)x.add(R*m+q,Ht(j,l*ot,q*ot));return!0})).every(R=>R),y=d.map((B,E)=>E);if(!await k(y.filter(B=>B%2===0)))throw new Error("thumbnails unread");let P=x.gone();if(P===null)return null;let O=B=>{if(B<0||B>=d.length)return!1;for(let E=B*m;E<(B+1)*m;E++)if(P[E])return!0;return!1};if(!await k(y.filter(B=>B%2===1&&(O(B-1)||O(B+1)))))throw new Error("thumbnails unread");return x.breaks(d[0].time,d[0].duration/m)}async function Z(d,l,g){if(Tt.has(l)){jt=Tt.get(l).breaks,Lt=Tt.get(l).separated,gt="known";return}gt="searching";try{let p=new DOMParser().parseFromString(await bt(d),"application/xml").documentElement,m=p?Y(p,"Period"):[],x=p?Wt(p.getAttribute("mediaPresentationDuration")):NaN;if(p&&(p.getAttribute("type")==="dynamic"||!(x>0)))throw new Error("not whole yet");if(!p||m.length!==1){g===F&&(gt="not a recording");return}let k=St(m[0],St(p,d)),y=null,P=null;for(let R of Y(m[0],"AdaptationSet")){let j=Y(R,"Representation")[0],q=R.getAttribute("mimeType")||j&&j.getAttribute("mimeType")||"",st=R.getAttribute("contentType")||q.split("/")[0];if(st==="text"&&y===null)y=await X(I(R,k,x),g);else if(st==="image"&&P===null){let at=Y(R,"EssentialProperty").concat(j?Y(j,"EssentialProperty"):[]).filter(vt=>/thumbnail_tile$/.test(vt.getAttribute("schemeIdUri")||""))[0],J=/^(\d+)x(\d+)$/.exec(at&&at.getAttribute("value")||"");J&&(P=await V(I(R,k,x),Number(J[1]),Number(J[2]),g))}if(g!==F)return}let O=z.combine(y,P).filter(R=>R[0]>0&&R[1]<x),B={breaks:O,separated:[]};if(Tt.set(l,B),Tt.size>20&&Tt.delete(Tt.keys().next().value),g!==F||(jt=O,gt="found "+O.length+" (captions "+(y===null?"none":y.length)+", logo "+(P===null?"none":P.length)+")",O.length===0))return;let E=await K(m[0],k,x,O,g);if(E===null)return;B.separated=E,g===F&&(Lt=E)}catch(p){g===F&&(gt="error: "+String(p&&p.message).slice(0,40),setTimeout(()=>{g===F&&/^error/.test(gt)&&(Ot={url:d,name:l,mine:g})},Ve*2**Math.min(pe++,12)))}}async function K(d,l,g,p,m){let x=z.SEP_WIDE_GAP_S,k=E=>p.some(R=>E.time+E.duration>R[0]-x&&E.time<R[1]+x),y=[];if(G(d).forEach((E,R)=>{if(!(T&&R!==Rt))for(let j of I(E.set,St(E.rep,St(E.set,l)),g,E.rep))k(j)&&y.push({time:j.time,duration:j.duration,url:j.url,height:R})}),y.length===0)return null;let P=y.length,O=[];for(let E=0;E<ct&&y.length>0;E++){let R=await D(y,T?je:ze,q=>m===F?kt(q):"stopped");if(m!==F)return null;let j=await At(y,R);if(m!==F)return null;if(j){T=!0,y=y.filter(q=>q.height===Rt),P=y.length,E=-1;continue}R.forEach(q=>{typeof q!="string"&&O.push(...q)}),y=y.filter((q,st)=>typeof R[st]=="string")}if(_="segments "+P+(T?" whole "+Rt+"p":"")+", blacks "+O.length+(y.length>0?", failed "+y.length:""),y.length*Te>P)return null;let B=z.separatedBreaks(O).filter(E=>p.some(R=>R[0]<=E[0]&&E[1]<=R[1]));return _+=", breaks "+B.length,B}async function tt(d){try{let l=new DOMParser().parseFromString(await bt(Nt),"application/xml").documentElement;if(!l||d!==F)return;let g=Date.parse(l.getAttribute("availabilityStartTime")||"")/1e3;if(!isFinite(g)){qt="no start time";return}let p=Y(l,"Period"),m=p.map(y=>Wt(y.getAttribute("start"))),x=null,k=p.map((y,P)=>{let O=isFinite(m[P])?g+m[P]:x!==null?x:g,B=Wt(y.getAttribute("duration")),E=isFinite(B)?O+B:P+1<m.length&&isFinite(m[P+1])?g+m[P+1]:null,R=Y(y,"EventStream").filter(q=>(q.getAttribute("schemeIdUri")||"").indexOf("urn:scte:scte35")===0),j=[];for(let q of R){let st=Number(q.getAttribute("timescale")||1),at=Number(q.getAttribute("presentationTimeOffset")||0);for(let J of Y(q,"Event")){let vt=z.opens(new XMLSerializer().serializeToString(J));if(vt===null)continue;let Et=Number(J.getAttribute("duration")||0)/st;j.push({at:O+(Number(J.getAttribute("presentationTime")||0)-at)/st,duration:Et>0?Et:null,opens:vt})}}return x=E,{start:O,end:E,marks:j,signalled:R.length>0}});ne=z.markedBreaks(k),qt="periods "+p.length+", breaks "+ne.length,b&&(o=Q(l,g),h=Date.now()/1e3)}catch(l){d===F&&(qt="error: "+String(l&&l.message).slice(0,40))}}function Q(d,l){let g=[],p=Date.now()/1e3,m=St(d,Nt);for(let x of Y(d,"Period")){let k=l+(Wt(x.getAttribute("start"))||0);G(x).forEach((y,P)=>{let O=Y(y.set,"SegmentTemplate")[0]||Y(y.rep,"SegmentTemplate")[0];if(!O||!Y(O,"SegmentTimeline")[0])return;let B=St(y.rep,St(y.set,St(x,m)));for(let E of I(y.set,B,p-k,y.rep)){let R=k+E.time;g.push({time:R,duration:E.duration,url:E.url,height:P,key:P+" "+R})}})}return g}function G(d){let l=new Map;for(let g of Y(d,"AdaptationSet"))if(!(g.getAttribute("contentType")!=="video"&&!/^video\//.test(g.getAttribute("mimeType")||"")))for(let p of Y(g,"Representation")){let m=Number(p.getAttribute("bandwidth")),x=Number(p.getAttribute("height")||g.getAttribute("height"));if(!(m>0)||!z.BLACKS[x])continue;let k=l.get(x);(!k||m<Number(k.rep.getAttribute("bandwidth")))&&l.set(x,{set:g,rep:p})}return l}async function W(d,l){let g=new AbortController,p=setTimeout(()=>g.abort(),se);try{let m={credentials:"omit",signal:g.signal};l!==null&&(m.headers={Range:"bytes=0-"+(l-1)});let x=await fetch(d,m);if(!x.ok)return"http "+x.status;let k=new Uint8Array(await x.arrayBuffer());return l!==null&&k.length>l?k.subarray(0,l):k}catch(m){return String(m&&m.name||"error")}finally{clearTimeout(p)}}async function kt(d){let l=await W(d.url,T?null:Be);if(typeof l=="string")return l;let g=z.moofEnd(l);if(g===null)return"no header";if(g>l.length&&(l=await W(d.url,g)),typeof l=="string")return l;let p=z.frameSizes(l);return p===null||p.length===0?"no frames":z.separatorEnds(p,d.time,d.duration/p.length,z.BLACKS[d.height])}async function At(d,l){if(T||d.length===0||!l.every(x=>x==="TypeError"))return!1;let g=d.filter(x=>x.height===Rt).pop(),p=g?await W(g.url,null):"none",m=typeof p=="string"?p:await W(g.url,Be);return typeof p!="string"&&m==="TypeError"}function Ge(d){if(d===void 0)return!1;let l=d.times-ct;return l<0||l<qe&&Date.now()/1e3-d.at>=$t*2**l}async function Ni(d,l,g){let p=d-Ee,x=o.reduce((E,R)=>Math.max(E,R.time+R.duration),-1/0)+(Date.now()/1e3-h)-hi,k=Math.min(l-di,x,d+Ee),y=o.filter(E=>(!T||E.height===Rt)&&E.time+E.duration>p&&E.time<k&&(!u.has(E.key)||Ge(v.get(E.key)))),P=await D(y,T?je:ze,kt);if(g!==F)return;let O=await At(y,P);if(g!==F)return;if(O){T=!0,A+=y.length,L="TypeError",_="segments "+u.size+", whole "+Rt+"p next, failed "+A+" ("+L+")";return}y.forEach((E,R)=>{let j=typeof P[R]=="string";j?(v.set(E.key,{times:(v.has(E.key)?v.get(E.key).times:0)+1,at:Date.now()/1e3}),A++,L=P[R]):v.delete(E.key),u.set(E.key,{time:E.time,ends:j?[]:P[R]})});for(let E of Array.from(u.keys()))u.get(E).time>=d-2*Ee||(u.delete(E),v.delete(E));let B=[];for(let E of u.values())for(let R of E.ends)B.push(R);C=z.separatedBreaks(B),_="segments "+u.size+(T?" whole "+Rt+"p":"")+", blacks "+B.length+", breaks "+C.length+(A>0?", failed "+A+" ("+L+")":"")}async function He(d,l,g){let p=[];for(let y=d;y<=l;y+=4)(!dt.has(y)||ht.has(y)&&ht.get(y)<ct)&&p.push(y);if(p.length===0)return;let m=et,x=ft,k=await D(p,4,async y=>{if(g!==F)return null;let P=await Gt(x+"/"+y,ot,yt);if(P===null)return null;let O=Ht(P,ot,0);return[z.score(m,O),m.lower?z.score(m.lower,O):null]});g!==F||m!==et||p.forEach((y,P)=>{k[P]===null?ht.set(y,(ht.get(y)||0)+1):ht.delete(y),dt.set(y,k[P]===null?m.usual:k[P][0]),m.lower&&xt.set(y,k[P]===null?m.lower.usual:k[P][1])})}async function ui(d,l){let g=ft;return(await D(d,4,async p=>{if(l!==F)return null;let m=await Gt(g+"/"+p,ot,yt);return m===null?null:Ht(m,ot,0)})).filter(p=>p!==null)}function pi(d){if(d.length===0)return null;let l=z.track(d.length,ot,yt);return d.forEach((g,p)=>l.add(p,g)),l.logo()}async function Li(d,l,g){let p=[];for(let y=d-1200;y<=Math.min(l,d+1200);y+=28)p.push(y);let m=await ui(p,g);if(g!==F)return;if(m.length===0){_i(d);return}let x=pi(m);x!==null&&x.channel&&fe.set(ft,z.alone(x));let k=null;if(x===null){let y=fe.get(ft);if(y&&z.seenIn(y,m,.4))k=y;else if(ge!==ft){let P=await Oi(d,g);if(g!==F)return;P!==null&&(fe.set(ft,P),z.seenIn(P,m,.4)&&(k=P))}}Ut=d,et=k||x,dt=new Map,xt=new Map,ht=new Map,re=et===null?"none in "+m.length+" pictures":"strength "+Math.round(et.strength)+(et.lower?", lower one "+Math.round(et.lower.strength):"")+(k!==null?", kept":""),et===null?_i(d):Ct=0}function _i(d){Ut=d-900+Math.min(900,120*2**Ct),120*2**Ct<900&&Ct++}async function Oi(d,l){let g=null;for(let p=0;p<3;p++){let m=d-1200-p*2*1200,x=[];for(let P=m-2*1200;P<m;P+=28)x.push(P);let k=await ui(x,l);if(l!==F)return null;if(k.length===0){if(p===0)return null;break}let y=pi(k);if(y!==null&&y.channel){g=z.alone(y);break}}return ge=ft,g}function fi(d){let l=d;for(;dt.has(l-4);)l-=4;let g=[],p=[];for(let x=l;dt.has(x);x+=4)g.push(dt.get(x)),et.lower&&p.push(xt.has(x)?xt.get(x):et.lower.usual);let m=g.map(()=>!0);return{first:l,gone:z.gone(g,et.usual,m),lowerGone:et.lower?z.gone(p,et.lower.usual,m):null}}async function Ui(d,l,g){let p=Math.floor(d/4)*4,m=Math.floor((l-12)/4)*4;if(p>m)return;let x=Math.abs(p-Ut),k=Vt.some(P=>P[0]<=p&&p<=P[1])&&x<=900+z.LOGO_MAX_S;if(x>900&&!k&&await Li(p,m,g),et===null||g!==F)return;await He(p-64,Math.min(m,p+88),g);for(let P=0;P<4;P++){if(g!==F||!dt.has(p))return;let O=fi(p),B=O.gone.length,E=O.first+B*4,R=z.runs(z.solid(O.gone),z.BRIDGE).concat(O.lowerGone?z.runs(z.solid(O.lowerGone),z.BRIDGE):[]),j=R.some(at=>at[1]+z.AROUND>=B&&(B-at[0])*4<=pt),q=(p-O.first)/4,st=R.some(at=>at[0]<z.AROUND&&at[1]>=q&&(at[1]+1)*4<=pt);if(j&&E<=m)await He(E,Math.min(m,E+120),g);else if(st&&O.first>p-pt)await He(O.first-120,O.first-4,g);else break}if(g!==F||et===null||!dt.has(p))return;let y=fi(p);Vt=z.logoBreaks(y.gone,y.first,4,y.lowerGone);for(let P of Array.from(dt.keys()))P<p-_t&&dt.delete(P);for(let P of Array.from(xt.keys()))P<p-_t&&xt.delete(P);for(let P of Array.from(ht.keys()))P<p-_t&&ht.delete(P)}function We(){let d=a.liveRange(),l=a.currentTime();if(!d||typeof l!="number"||!isFinite(l)||!isFinite(d.end))return null;let g=a.absoluteTime(l),p=a.absoluteTime(d.end),m=Date.now()/1e3;return typeof g!="number"||typeof p!="number"||!(g>m-86400&&g<m+600)||!(p>=g)?null:{at:g,end:p}}async function Di(d){if(oe!==d){oe=d;try{let l=We();if(l===null||l.end-l.at<=60)return;Date.now()-_e>=ee&&Nt&&(_e=Date.now(),await tt(d)),b&&d===F&&await Ni(l.at,l.end,d),ft!==null&&d===F&&await Ui(l.at,l.end,d)}catch(l){re="error: "+String(l&&l.message).slice(0,40)}finally{oe===d&&(oe=0)}}}function Fi(){let d=null;try{let l=a.state();if(Bt!==null&&(l==="playing"||l==="paused")){let g=a.currentTime();if(Ot!==null&&l==="playing"){let m=Ot;Ot=null,m.mine===F&&Z(m.url,m.name,m.mine)}let p=m=>[m[0],m[1]-32];if(zt){if(!a.joining()){let m=We();if(m!==null){let x=y=>m.at>=y[0]&&m.at<y[1]-1&&y[1]<=m.end-2,k=ne.filter(x)[0]||C.filter(x)[0]||Vt.map(p).map(y=>z.reachSeparated(y,C)).filter(x)[0];if(k){let y=a.mediaTime(k[1]);typeof y=="number"&&isFinite(y)&&y>g&&(d=y)}}Date.now()-Ce>=ie&&(Ce=Date.now(),Di(F))}}else{let m=k=>g>=k[0]&&g<k[1]-1,x=Lt.filter(m)[0]||jt.map(p).filter(m)[0];x&&(d=x[1])}}}catch{d=null}wt=d,ae=a.show(wt!==null)}function Bi(){if(wt===null||!ae)return!1;let d=wt;return wt=null,ae=a.show(!1),a.seek(d),!0}function zi(){let d={live:zt,offered:wt!==null,skip_to:wt};if(zt){d.marked=qt,d.logo=ft===null?"no pictures":re,d.found=Vt.length,b&&(d.separators=_);try{let l=We();d.clock=l===null?"none":Math.round(Date.now()/1e3-l.end)+" s behind at the live point"}catch{d.clock="error"}}else d.recording=gt,d.breaks=jt.map(l=>[Math.round(l[0]),Math.round(l[1])]),d.separators=_,d.separated=Lt.map(l=>[Math.round(l[0]),Math.round(l[1])]);return d}return{load:U,tick:Fi,skip:Bi,report:zi}}var $i="0.1.22";function ts(){let a=navigator.userAgent||"",t=/Android|iPhone|iPad|iPod|Mobile/i.test(a),e=/wv|WebView/i.test(a)||window.navigator.standalone===!0;return t||e}var es={fr:"Francais",fra:"Francais",fre:"Francais",en:"English",eng:"English",de:"Deutsch",deu:"Deutsch",ger:"Deutsch",es:"Espanol",spa:"Espanol",it:"Italiano",ita:"Italiano",pt:"Portugues",por:"Portugues",qaa:"Original",und:"Indefini",mul:"Multiple"};function Ri(a){if(!a)return"Inconnu";let t=a.toLowerCase();return es[t]||a.toUpperCase()}function Fe(a){let t=a.split(":");if(t.length<2)return null;let e=t.slice(1).join(":");try{let i=e,s=e.length%4;s&&(i+="=".repeat(4-s));let n=atob(i.replace(/-/g,"+").replace(/_/g,"/"));return JSON.parse(n)}catch{return null}}var ci=class extends te{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},panel:{type:Object},_channels:{type:Array},_loading:{type:Boolean},_error:{type:String},_playing:{type:Boolean},_selectedChannel:{type:Object},_streamData:{type:Object},_isFullscreen:{type:Boolean},_playerError:{type:String},_playerLoading:{type:Boolean},_currentTime:{type:Number},_duration:{type:Number},_volume:{type:Number},_muted:{type:Boolean},_paused:{type:Boolean},_audioTracks:{type:Array},_textTracks:{type:Array},_selectedAudioIndex:{type:Number},_selectedTextIndex:{type:Number},_isLive:{type:Boolean},_programStart:{type:Number},_programEnd:{type:Number},_showAudioMenu:{type:Boolean},_showTextMenu:{type:Boolean},_expandedChannels:{type:Object},_channelPrograms:{type:Object},_loadingPrograms:{type:Object},_searchQuery:{type:String},_searchResults:{type:Array},_searching:{type:Boolean},_showingSearch:{type:Boolean},_expandedResults:{type:Object},_resultEpisodes:{type:Object},_loadingEpisodes:{type:Object},_castTargets:{type:Array},_selectedTarget:{type:String},_activeTab:{type:String},_recordings:{type:Array},_loadingRecordings:{type:Boolean},_expandedRecordings:{type:Object},_recordingEpisodes:{type:Object},_loadingRecordingEpisodes:{type:Object},_castPlaying:{type:Boolean},_castTarget:{type:String},_castTitle:{type:String},_activeCasts:{type:Object},_focusedCastHost:{type:String},_localPlaybackInitiated:{type:Boolean},_localMinimized:{type:Boolean},_castMinimized:{type:Boolean},_castLoading:{type:Boolean},_tonightChannels:{type:Array},_loadingTonight:{type:Boolean},_episodePlaylist:{type:Array},_episodeIndex:{type:Number},_selectedEntityId:{type:String}}}static get styles(){return Ai`
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
    `}constructor(){super(),this._boundOnFullscreenChange=this._onFullscreenChange.bind(this),this._boundOnDocumentClick=this._onDocumentClick.bind(this),this._channels=[],this._loading=!0,this._error=null,this._playing=!1,this._selectedChannel=null,this._streamData=null,this._isFullscreen=!1,this._playerError=null,this._playerLoading=!1,this._player=null,this._entityUnsubscribe=null,this._showPlayOverlay=!1,this._adSkip=null,this._adOffer=!1,this._castSkipTo=null,this._currentTime=0,this._duration=0,this._volume=.5,this._muted=!1,this._paused=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._liveDelay=0,this._showAudioMenu=!1,this._showTextMenu=!1,this._updateInterval=null,this._expandedChannels={},this._channelPrograms={},this._loadingPrograms={},this._searchQuery="",this._searchResults=[],this._searching=!1,this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._searchToken=0,this._castTargets=[],this._isMobile=ts(),this._selectedTarget=this._isMobile?"":"local",this._activeTab="live",this._recordings=[],this._loadingRecordings=!1,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castProgressInterval=null,this._castBasePosition=0,this._castPositionUpdatedAt=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._castMinimized=!1,this._castLoading=!1,this._tonightChannels=[],this._loadingTonight=!1,this._episodePlaylist=[],this._episodeIndex=-1,this._episodeParentTitle="",this._episodeIsRecording=!1,this._sessionId=this._generateSessionId(),this._selectedEntityId=localStorage.getItem("molotov_selected_entity")||""}_generateSessionId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"molotov-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10)}connectedCallback(){super.connectedCallback(),console.log(`[Molotov Panel] Connected - v${$i}`),this._hasLoadedChannels=!1,document.addEventListener("fullscreenchange",this._boundOnFullscreenChange),document.addEventListener("click",this._boundOnDocumentClick)}disconnectedCallback(){if(super.disconnectedCallback(),this._playing){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"})}this._cleanupPlayer(),this._stopCastProgressUpdate(),document.removeEventListener("fullscreenchange",this._boundOnFullscreenChange),document.removeEventListener("click",this._boundOnDocumentClick),this._entityUnsubscribe&&(this._entityUnsubscribe(),this._entityUnsubscribe=null)}_onDocumentClick(t){t.composedPath().some(e=>e.classList?.contains("track-menu-container"))||(this._showAudioMenu=!1,this._showTextMenu=!1,this.requestUpdate())}updated(t){t.has("hass")&&this.hass&&(this._hasLoadedChannels||(this._hasLoadedChannels=!0,this._loadChannels()),this._syncWithEntity())}async _loadChannels(){this._loading=!0,this._error=null;try{let t=this._getEntityId();if(!t)throw new Error("Entite Molotov TV introuvable");console.log(`[Molotov Panel] Loading channels for ${t}`);let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"now_playing",media_content_type:"directory"});e&&e.children?(this._channels=e.children.map(i=>this._parseChannel(i)),console.log(`[Molotov Panel] Loaded ${this._channels.length} channels`),this._channels.length>0&&await this._fetchCastTargets(t,this._channels[0].mediaContentId)):this._channels=[],this._loading=!1}catch(t){console.error("[Molotov Panel] Failed to load channels:",t),this._error=t.message||"Erreur lors du chargement des chaines",this._loading=!1}}async _fetchCastTargets(t,e){try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:e,media_content_type:"program"});if(i&&i.children){let s=i.children.filter(n=>n.media_content_id.startsWith("cast:")).map(n=>({mediaContentId:n.media_content_id,title:n.title}));this._castTargets=s,this._isMobile&&s.length>0&&(!this._selectedTarget||this._selectedTarget==="local")&&(this._selectedTarget=s[0].mediaContentId),console.log(`[Molotov Panel] Found ${s.length} cast targets`)}}catch(i){console.error("[Molotov Panel] Failed to fetch cast targets:",i),this._castTargets=[]}}_handleTargetChange(t){let e=t.target.value;this._isMobile&&e==="local"||(this._selectedTarget=e,console.log(`[Molotov Panel] Selected target: ${this._selectedTarget}`))}_switchTab(t){this._activeTab=t,t==="recordings"&&this._recordings.length===0&&this._loadRecordings(),t==="tonight"&&this._tonightChannels.length===0&&this._loadTonight(),this.requestUpdate()}async _loadRecordings(){let t=this._getEntityId();if(!t)return;this._loadingRecordings=!0,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this.requestUpdate();try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"recordings",media_content_type:"directory"});i&&i.children?(this._recordings=i.children.map(s=>{let n=Fe(s.media_content_id);return{mediaContentId:s.media_content_id,title:s.title,thumbnail:s.thumbnail,description:n?.desc||null,isFolder:!!n?.folder}}),console.log(`[Molotov Panel] Loaded ${this._recordings.length} recordings`)):this._recordings=[]}catch(i){console.error("[Molotov Panel] Failed to load recordings:",i),this._recordings=[]}this._loadingRecordings=!1,this.requestUpdate();let e=this._recordings.filter(i=>i.isFolder);e.length>0&&(await Promise.all(e.map(i=>this._fetchRecordingEpisodes(i))),this.requestUpdate())}async _loadTonight(){let t=this._getEntityId();if(t){this._loadingTonight=!0,this.requestUpdate();try{let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"tonight_epg",media_content_type:"directory"});if(e&&e.children&&e.children.length>0){let i=new Map;for(let n of e.children){if(!n.media_content_id.startsWith("tonight_program:"))continue;let r=n.media_content_id.split(":");if(r.length<6)continue;let f=r[1],S=decodeURIComponent(r[2]),$=decodeURIComponent(r[3]),H=parseInt(r[4])*1e3,N=parseInt(r[5])*1e3,nt=r.length>6?decodeURIComponent(r.slice(6).join(":")):"",it=n.title;it.startsWith("\u{1F534} ")&&(it=it.substring(3));let rt=it.match(/^\d{2}:\d{2}-\d{2}:\d{2}\s+(.+)$/);rt&&(it=rt[1]);let lt={mediaContentId:n.media_content_id,title:it,thumbnail:n.thumbnail,start:H,end:N,description:nt};i.has(f)||i.set(f,{id:f,name:S,thumbnail:$,programs:[]}),i.get(f).programs.push(lt)}let s=Array.from(i.values());for(let n of s)n.programs.sort((r,f)=>r.start-f.start);this._tonightChannels=s,console.log(`[Molotov Panel] Loaded tonight EPG for ${s.length} channels`)}else this._tonightChannels=[]}catch(e){console.error("[Molotov Panel] Failed to load tonight EPG:",e),this._tonightChannels=[]}this._loadingTonight=!1,this.requestUpdate()}}async _toggleRecordingExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedRecordings[i]){this._expandedRecordings={...this._expandedRecordings,[i]:!1},this.requestUpdate();return}if(!e.isFolder){await this._playRecordingDirectly(e);return}this._recordingEpisodes[i]||await this._fetchRecordingEpisodes(e);let s=this._recordingEpisodes[i]||[];if(s.length===0){console.log("[Molotov Panel] No episodes found, playing recording directly"),await this._playRecordingDirectly(e);return}if(s.length===1){console.log("[Molotov Panel] Only 1 episode found, playing it directly"),await this._playRecordingEpisode(s[0],e.title);return}this._expandedRecordings={...this._expandedRecordings,[i]:!0},this.requestUpdate()}async _playRecordingDirectly(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:"",currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=t.mediaContentId;i.startsWith("recording:")&&(i=i.substring(10));let s=this._buildPlayMediaId(`replay:${i}`);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:s,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play recording failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}async _fetchRecordingEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"recording"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._recordingEpisodes={...this._recordingEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for recording "${t.title}"`)}else this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch recording episodes:",s),this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!1},this.requestUpdate()}async _playRecordingEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._recordingEpisodes,!0),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play recording episode failed:",s),this._playerError=s.message||"Erreur de lecture",this._castLoading=!1}}}_buildPlayMediaId(t){if(this._selectedTarget==="local")return`play_local:${this._sessionId}:${t}`;let e=this._selectedTarget.split(":");if(e.length>=2){let i=e[1],s=e.length>=3&&e[2]!=="native"&&e[2]!=="custom"?"":e[2];return s?`cast:${i}:${s}:${t}`:`cast:${i}:${t}`}return`play_local:${t}`}_isLocalPlayback(){return this._selectedTarget==="local"}_parseEpisodeChildren(t){return t.filter(e=>e.media_content_id.startsWith("episode:")||e.media_content_id.startsWith("replay:")||e.media_content_id.startsWith("recording:")||e.can_play).map(e=>{let i=Fe(e.media_content_id);return{mediaContentId:e.media_content_id,title:e.title,thumbnail:e.thumbnail,description:i?.desc||null}})}_initPlaybackFlags(){this._isLocalPlayback()?(this._localPlaybackInitiated=!0,this._localMinimized=!1):this._castLoading=!0}_parseChannel(t){let e=t.media_content_id,[i,s]=e.split("|"),n=null;if(s)try{let it=s,rt=s.length%4;rt&&(it+="=".repeat(4-rt)),n=decodeURIComponent(escape(atob(it.replace(/-/g,"+").replace(/_/g,"/"))))}catch{}let r=i.split(":"),f,S,$;r[0]==="program"?(f=r[1],S=r[2]?parseInt(r[2])*1e3:null,$=r[3]?parseInt(r[3])*1e3:null):r[0]==="live"&&(f=r[1]);let H=t.title.split(" - "),N=H[0],nt=H.slice(1).join(" - ")||"Direct";return{id:f,name:N,thumbnail:t.thumbnail,mediaContentId:i,currentProgram:{title:nt,description:n,start:S,end:$},nextProgram:null}}_getMolotovEntities(){return!this.hass||!this.hass.states?[]:Object.keys(this.hass.states).filter(t=>t.startsWith("media_player.molotov")).sort()}_getEntityId(){let t=this._getMolotovEntities();return t.length===0?null:t.length===1?t[0]:this._selectedEntityId&&t.includes(this._selectedEntityId)?this._selectedEntityId:t[0]}_handleEntityChange(t){let e=this._getEntityId();this._playing&&e&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState(),this._selectedEntityId=t.target.value,localStorage.setItem("molotov_selected_entity",this._selectedEntityId),this._hasLoadedChannels=!1,this._channels=[],this._recordings=[],this._tonightChannels=[],this._channelPrograms={},this._expandedChannels={},this._loadingPrograms={},this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._loadChannels()}async _toggleChannelExpand(t,e){t.stopPropagation();let i=e.id;if(this._expandedChannels[i]){this._expandedChannels={...this._expandedChannels,[i]:!1},this.requestUpdate();return}this._expandedChannels={...this._expandedChannels,[i]:!0},this._channelPrograms[i]||await this._fetchChannelPrograms(e),this.requestUpdate()}async _fetchChannelPrograms(t){let e=this._getEntityId();if(!e)return;let i=t.id;this._loadingPrograms={...this._loadingPrograms,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`channel:${i}`,media_content_type:"channel"});if(s&&s.children){let n=s.children.filter(r=>r.media_content_id.startsWith("replay:")).map(r=>this._parseReplayItem(r,t));this._channelPrograms={...this._channelPrograms,[i]:n}}}catch(s){console.error("[Molotov Panel] Failed to fetch channel replays:",s),this._channelPrograms={...this._channelPrograms,[i]:[]}}this._loadingPrograms={...this._loadingPrograms,[i]:!1},this.requestUpdate()}_parseReplayItem(t,e){let i=Fe(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,channelName:e.name,description:i?.desc||null}}async _playReplay(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:t.channelName,currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play replay failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}_handleSearchInput(t){this._searchQuery=t.target.value}_handleSearchKeydown(t){t.key==="Enter"&&this._performSearch()}async _performSearch(){let t=this._searchQuery.trim();if(!t)return;let e=this._getEntityId();if(!e)return;let i=++this._searchToken;this._searching=!0,this._showingSearch=!0,this._searchResults=[],this._expandedResults={},this._resultEpisodes={},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`search:${encodeURIComponent(t)}`,media_content_type:"search"});if(i!==this._searchToken)return;if(s&&s.children){let n=s.children.filter(f=>f.media_content_id.startsWith("search_result:")).map(f=>this._parseSearchResult(f)),r=await this._filterResultsWithEpisodes(n,e,i);if(i!==this._searchToken)return;this._searchResults=r,console.log(`[Molotov Panel] Found ${this._searchResults.length} results with episodes for "${t}"`)}else this._searchResults=[]}catch(s){if(i!==this._searchToken)return;console.error("[Molotov Panel] Search failed:",s),this._searchResults=[]}i===this._searchToken&&(this._searching=!1,this.requestUpdate())}async _filterResultsWithEpisodes(t,e,i){let s=t.map(async r=>{try{let f=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:r.mediaContentId,media_content_type:"search_result"});if(f&&f.children){let S=this._parseEpisodeChildren(f.children);if(S.length>0)return(i===void 0||i===this._searchToken)&&(this._resultEpisodes={...this._resultEpisodes,[r.mediaContentId]:S}),r}return null}catch(f){return console.error(`[Molotov Panel] Failed to check episodes for "${r.title}":`,f),null}});return(await Promise.all(s)).filter(r=>r!==null)}_parseSearchResult(t){let e=Fe(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,mediaClass:t.media_class,description:e?.desc||null}}_clearSearch(){this._searchToken++,this._searchQuery="",this._searchResults=[],this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this.requestUpdate()}async _toggleResultExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedResults[i]){this._expandedResults={...this._expandedResults,[i]:!1},this.requestUpdate();return}this._expandedResults={...this._expandedResults,[i]:!0},this._resultEpisodes[i]||await this._fetchResultEpisodes(e),this.requestUpdate()}async _fetchResultEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingEpisodes={...this._loadingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"search_result"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._resultEpisodes={...this._resultEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for "${t.title}"`)}else this._resultEpisodes={...this._resultEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch episodes:",s),this._resultEpisodes={...this._resultEpisodes,[i]:[]}}this._loadingEpisodes={...this._loadingEpisodes,[i]:!1},this.requestUpdate()}_setEpisodePlaylist(t,e,i,s){for(let n of Object.values(i)){let r=n.findIndex(f=>f.mediaContentId===t.mediaContentId);if(r!==-1){this._episodePlaylist=n,this._episodeIndex=r,this._episodeParentTitle=e,this._episodeIsRecording=s;return}}this._episodePlaylist=[],this._episodeIndex=-1}async _playEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._resultEpisodes,!1),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play episode failed:",s),this._playerError=s.message||"Erreur de lecture"}}}_syncWithEntity(){let t=this._getEntityId();if(!t||!this.hass?.states?.[t])return;let e=this.hass.states[t],s=(e.attributes.local_streams||{})[this._sessionId];if(s&&s.url&&this._localPlaybackInitiated){let n=s.url,r=s.drm,f=s.selected_track;if(!this._playing||this._currentStreamUrl!==n){this._currentStreamUrl=n,this._streamData={url:n,drm:r,selectedTrack:f,title:e.attributes.media_title||"En direct",breakSearch:{live_thumbnails_url:s.live_thumbnails_url,recording:s.recording,separated_breaks:s.separated_breaks}},this._playing=!0,this._localMinimized=!1,this._playerError=null,this._playerLoading=!0;let S=this._selectedChannel;S?.currentProgram?.start&&S?.currentProgram?.end?(this._isLive=!0,this._programStart=S.currentProgram.start,this._programEnd=S.currentProgram.end):(this._isLive=!0,this._programStart=null,this._programEnd=null),this.updateComplete.then(()=>this._initDashPlayer())}}else this._playing&&(this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1);if(e.attributes.active_casts&&Object.keys(e.attributes.active_casts).length>0){let n=e.attributes.active_casts,r=e.attributes.cast_target;this._activeCasts=n,this._focusedCastHost=r||null;let f=r?n[r]?.skip_to:null;this._castSkipTo=typeof f=="number"?f:null,(!this._castPlaying||this._castTarget!==r)&&(this._castPlaying=!0,this._castMinimized=this._isMobile,this._castLoading=!1,this._castTarget=r,this._castTitle=e.attributes.media_title||"En cours de lecture",this._startCastProgressUpdate(),console.log("[Molotov Panel] Cast playback detected:",r,"total casts:",Object.keys(n).length)),this._castPositionUpdatedAt=e.attributes.media_position_updated_at?new Date(e.attributes.media_position_updated_at).getTime()/1e3:null,this._castBasePosition=e.attributes.media_position||0,this._duration=e.attributes.media_duration||0,this._volume=e.attributes.volume_level??.5,this._muted=e.attributes.is_volume_muted||!1,this._paused=e.state==="paused",this._castTitle=e.attributes.media_title||this._castTitle,this._isLive=e.attributes.is_live||!1}else this._castPlaying&&(this._onPlaybackEnded()||(this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._castMinimized=!1,this._castLoading=!1,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate()))}async _playChannel(t){let e=this._getEntityId();if(!e){console.error("[Molotov Panel] No entity found");return}this._selectedChannel=t,this._playerError=null,this._episodePlaylist=[],this._episodeIndex=-1,this._initPlaybackFlags(),this._isLocalPlayback()&&t.currentProgram?.start&&t.currentProgram?.end&&(this._programStart=t.currentProgram.start,this._programEnd=t.currentProgram.end,this._isLive=!0);try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}async _initDashPlayer(){if(!this._streamData)return;let t=this.shadowRoot.querySelector("video");if(!t){console.error("[Molotov Panel] Video element not found");return}window.dashjs||await this._loadDashJs(),this._player&&(this._player.reset(),this._player=null),this._adSkip=null,this._adOffer=!1,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null);try{let e=window.dashjs.MediaPlayer().create();this._player=e,e.updateSettings({debug:{logLevel:window.dashjs.Debug.LOG_LEVEL_WARNING},streaming:{buffer:{stableBufferTime:6,bufferTimeAtTopQuality:30,bufferTimeAtTopQualityLongForm:60},delay:{liveDelay:3}}});let i=this._streamData.drm;i&&i.type==="widevine"&&(console.log("[Molotov Panel] Configuring Widevine DRM"),e.setProtectionData({"com.widevine.alpha":{serverURL:i.license_url,httpRequestHeaders:i.headers||{}}})),e.initialize(t,this._streamData.url,!0),this._adSkip=Mi(this._adSkipEnv(t,e));let s=this._streamData.selectedTrack,n="fr";s?.track_audio&&(n=s.track_audio),e.setInitialMediaSettingsFor("audio",{lang:n}),s?.track_text&&e.setInitialMediaSettingsFor("text",{lang:s.track_text}),e.on(window.dashjs.MediaPlayer.events.ERROR,r=>{let f=r.error?.message||r.error||"Erreur de lecture";console.error("[Molotov Panel] Player error:",f),this._playerError=f,this._playerLoading=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.STREAM_INITIALIZED,()=>{console.log("[Molotov Panel] Stream initialized"),this._player===e&&this._adSkip&&this._adSkip.load({contentId:this._streamData.url},this._streamData.breakSearch),this._enforceAudioLanguage(e,s),this._updateTracks(),this._startProgressUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_STARTED,()=>{console.log("[Molotov Panel] Playback started"),this._showPlayOverlay=!1,this._playerLoading=!1,this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PAUSED,()=>{this._paused=!0,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PLAYING,()=>{this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_ENDED,()=>{console.log("[Molotov Panel] Playback ended"),this._onPlaybackEnded()}),t.volume=this._volume,t.muted=this._muted,this._autoplayCheckTimeout=setTimeout(()=>{this._autoplayCheckTimeout=null,t.paused&&!t.currentTime&&(console.log("[Molotov Panel] Autoplay blocked"),this._showPlayOverlay=!0,this.requestUpdate())},1500)}catch(e){console.error("[Molotov Panel] Failed to init player:",e),this._playerError=e.message}}_adSkipEnv(t,e){let i=()=>{try{let s=e.timeAsUTC();return typeof s=="number"&&isFinite(s)?s:null}catch{return null}};return{isLive:()=>{try{return e.isDynamic()}catch{return!1}},joining:()=>this._playerLoading,state:()=>t.paused?"paused":t.readyState>=2?"playing":"other",currentTime:()=>t.currentTime,liveRange:()=>t.seekable&&t.seekable.length?{start:t.seekable.start(0),end:t.seekable.end(t.seekable.length-1)}:null,absoluteTime:s=>{let n=i();return n===null?null:n+(s-t.currentTime)},mediaTime:s=>{let n=i();return n===null?null:t.currentTime+(s-n)},show:s=>(this._adOffer!==s&&(this._adOffer=s,this.requestUpdate()),s),seek:s=>{t.currentTime=s}}}_startProgressUpdate(){this._updateInterval&&clearInterval(this._updateInterval),this._updateInterval=setInterval(()=>{this._updateProgress()},1e3)}_updateProgress(){let t=this.shadowRoot?.querySelector("video");if(!(!t||!this._player)){if(this._currentTime=t.currentTime,this._duration=t.duration||0,this._paused=t.paused,this._adSkip&&this._adSkip.tick(),this._isLive&&t.seekable&&t.seekable.length>0){let e=t.seekable.end(t.seekable.length-1);this._liveDelay=Math.max(0,(e-t.currentTime)*1e3)}this.requestUpdate()}}_startCastProgressUpdate(){this._stopCastProgressUpdate(),this._castProgressInterval=setInterval(()=>{this._updateCastProgress()},1e3)}_stopCastProgressUpdate(){this._castProgressInterval&&(clearInterval(this._castProgressInterval),this._castProgressInterval=null)}_updateCastProgress(){if(!this._castPlaying){this._stopCastProgressUpdate();return}if(this._castBasePosition!=null&&this._castPositionUpdatedAt&&!this._paused){let t=Date.now()/1e3,e=Math.max(0,t-this._castPositionUpdatedAt);this._currentTime=this._castBasePosition+e}else this._currentTime=this._castBasePosition||0;this.requestUpdate()}_updateTracks(){if(!this._player)return;let t=this._player.getTracksFor("audio")||[];this._audioTracks=t.map((n,r)=>({index:r,lang:n.lang,label:Ri(n.lang)}));let e=this._player.getCurrentTrackFor("audio");e&&(this._selectedAudioIndex=t.findIndex(n=>n.index===e.index));let i=this._player.getTracksFor("text")||[];if(this._textTracks=i.map((n,r)=>({index:r,lang:n.lang,label:Ri(n.lang)})),!this._player.isTextEnabled())this._selectedTextIndex=-1;else{let n=this._player.getCurrentTrackFor("text");n&&(this._selectedTextIndex=i.findIndex(r=>r.index===n.index))}console.log("[Molotov Panel] Audio tracks:",this._audioTracks),console.log("[Molotov Panel] Text tracks:",this._textTracks),this.requestUpdate()}_enforceAudioLanguage(t,e){let i=t.getTracksFor("audio");if(!i||i.length===0)return;let n=t.getCurrentTrackFor("audio")?.lang||"",r="fr";if(e?.track_audio&&(r=e.track_audio),n!==r&&n!=="fra"&&n!=="fre"){let f=i.find(S=>S.lang===r||S.lang==="fra"||S.lang==="fre");!f&&(n==="en"||n==="eng"||n==="qaa")&&(f=i.find(S=>S.lang!=="en"&&S.lang!=="eng"&&S.lang!=="qaa")),f&&(console.log("[Molotov Panel] Switching audio to:",f.lang),t.setCurrentTrack(f))}}_loadDashJs(){return new Promise((t,e)=>{if(window.dashjs){t();return}let i=document.createElement("script");i.src="https://cdn.dashjs.org/v4.7.4/dash.all.min.js",i.crossOrigin="anonymous",i.onload=()=>{console.log("[Molotov Panel] dash.js loaded"),t()},i.onerror=()=>{e(new Error("Failed to load dash.js"))},document.head.appendChild(i)})}_cleanupPlayer(){if(this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null),this._player){try{this._player.reset()}catch{}this._player=null}this._adSkip=null,this._adOffer=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._playerLoading=!1}_stopPlayback(){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState()}_resetLocalPlaybackState(){this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._selectedChannel=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._episodePlaylist=[],this._episodeIndex=-1}_onPlaybackEnded(){if(this._episodePlaylist.length===0||this._episodeIndex<0)return!1;let t=this._episodeIndex+1;if(t>=this._episodePlaylist.length)return this._episodePlaylist=[],this._episodeIndex=-1,!1;let e=this._episodePlaylist[t];return this._episodeIndex=t,console.log(`[Molotov Panel] Auto-playing next episode: ${e.title}`),this._episodeIsRecording?this._playRecordingEpisode(e,this._episodeParentTitle):this._playEpisode(e,this._episodeParentTitle),!0}_goBackFromPlayer(){this._localMinimized=!0,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null)}_goBackFromCast(){this._castMinimized=!0}_expandCurrentPlayback(){this._playing&&this._streamData?(this._localMinimized=!1,this._updateInterval||this._startProgressUpdate()):this._castPlaying&&(this._castMinimized=!1)}_togglePlayPause(){let t=this.shadowRoot.querySelector("video");t&&(t.paused?t.play():t.pause())}_localSeek(t){let e=this.shadowRoot.querySelector("video");if(!e)return;if(t===null){e.currentTime=0;return}let i=e.currentTime+t;e.currentTime=Math.max(0,Math.min(e.duration||1/0,i))}_localSeekBeginning(){this._localSeek(null)}_localSkipBack30(){this._localSeek(-30)}_localSkipBack10(){this._localSeek(-10)}_localSkipForward30(){this._localSeek(30)}_localSkipAd(){this._adSkip&&this._adSkip.skip()}_handleProgressClick(t){let i=t.currentTarget.getBoundingClientRect(),s=(t.clientX-i.left)/i.width;if(this._isLive&&this._programStart&&this._programEnd){if(this._player?.getDVRSeekOffset?.(0)!==void 0){let r=this._player.duration(),f=s*r;this._player.seek(f)}}else if(this._duration){let n=this.shadowRoot.querySelector("video");n&&(n.currentTime=s*this._duration)}}_handleVolumeChange(t){let e=parseFloat(t.target.value);this._volume=e;let i=this.shadowRoot.querySelector("video");i&&(i.volume=e,i.muted=e===0,this._muted=e===0)}_toggleMute(){let t=this.shadowRoot.querySelector("video");t&&(this._muted=!this._muted,t.muted=this._muted,this.requestUpdate())}_selectAudioTrack(t){if(!this._player||t<0||t>=this._audioTracks.length)return;let e=this._player.getTracksFor("audio");e&&e[t]&&(this._player.setCurrentTrack(e[t]),this._selectedAudioIndex=t),this._showAudioMenu=!1,this.requestUpdate()}_selectTextTrack(t){if(this._player){if(t===-1)this._player.enableText(!1),this._selectedTextIndex=-1;else if(t>=0&&t<this._textTracks.length){let e=this._player.getTracksFor("text");e&&e[t]&&(this._player.enableText(!0),this._player.setCurrentTrack(e[t]),this._selectedTextIndex=t)}this._showTextMenu=!1,this.requestUpdate()}}_toggleAudioMenu(t){t.stopPropagation(),this._showAudioMenu=!this._showAudioMenu,this._showTextMenu=!1,this.requestUpdate()}_toggleTextMenu(t){t.stopPropagation(),this._showTextMenu=!this._showTextMenu,this._showAudioMenu=!1,this.requestUpdate()}_toggleFullscreen(){let t=this.shadowRoot.querySelector(".video-wrapper");t&&(document.fullscreenElement?document.exitFullscreen():t.requestFullscreen().catch(e=>{console.error("[Molotov Panel] Fullscreen error:",e)}))}_onFullscreenChange(){this._isFullscreen=!!document.fullscreenElement,this.requestUpdate()}_handlePlayOverlayClick(){let t=this.shadowRoot.querySelector("video");t&&(t.muted=!1,t.play().catch(e=>console.error("[Molotov Panel] Manual play error:",e)),this._showPlayOverlay=!1,this.requestUpdate())}_formatTime(t){if(!t||!isFinite(t))return"00:00";let e=Math.floor(t/3600),i=Math.floor(t%3600/60),s=Math.floor(t%60);return e>0?`${e}:${i.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`:`${i}:${s.toString().padStart(2,"0")}`}_formatClockTime(t){return t?new Date(t).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):""}_getProgressPercent(){if(this._isLive&&this._programStart&&this._programEnd){let t=Date.now()-(this._liveDelay||0),e=this._programEnd-this._programStart;if(e<=0)return 100;let i=t-this._programStart;return Math.min(100,Math.max(0,i/e*100))}else if(this._duration>0&&isFinite(this._duration))return this._currentTime/this._duration*100;return 0}render(){let t=this._playing&&this._streamData,e=t&&!this._localMinimized,i=this._castPlaying&&!this._castMinimized,s=!e&&!i;return w`
      ${t?w`
        <div style="${this._localMinimized?"position:fixed;left:-9999px;width:1px;height:1px;overflow:hidden;":"height:100%;"}">
          ${this._renderPlayer()}
        </div>
      `:""}
      ${i?this._renderCastPlayer():""}
      ${s?this._renderChannelList():""}
    `}_renderChannelList(){return w`
      <div class="container">
        <div class="header">
          <h1>Molotov TV</h1>
          <div class="header-actions">
            ${this._getMolotovEntities().length>1?w`
              <select class="cast-select" @change=${this._handleEntityChange} .value=${this._getEntityId()}>
                ${this._getMolotovEntities().map(t=>w`
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
              ${this._isMobile?"":w`<option value="local">Cet appareil</option>`}
              ${this._castTargets.map(t=>w`
                  <option value=${t.mediaContentId}>${t.title}</option>
                `)}
            </select>
          </div>
        </div>

        ${this._castLoading?w`
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
    `}_handleRefresh(){this._activeTab==="live"?this._loadChannels():this._activeTab==="tonight"?this._loadTonight():this._loadRecordings()}_renderChannels(){return w`
      <div class="content">
        ${this._loading?w`<div class="loading">Chargement des chaines...</div>`:this._error?w`
              <div class="error">
                <span>${this._error}</span>
                <button @click=${this._loadChannels}>Reessayer</button>
              </div>
            `:w`
              <div class="channel-list">
                ${this._channels.map(t=>this._renderChannelItem(t))}
              </div>
            `}
      </div>
    `}_renderRecordings(){return w`
      <div class="content">
        ${this._loadingRecordings?w`<div class="loading">Chargement des enregistrements...</div>`:this._recordings.length>0?w`
              <div class="channel-list">
                ${this._recordings.map(t=>this._renderRecordingItem(t))}
              </div>
            `:w`<div class="error">Aucun enregistrement trouve</div>`}
      </div>
    `}_renderTonight(){return w`
      <div class="content">
        ${this._loadingTonight?w`<div class="loading">Chargement du programme de ce soir...</div>`:this._tonightChannels.length>0?w`
              <div class="tonight-list">
                ${this._tonightChannels.map(t=>this._renderTonightChannel(t))}
              </div>
            `:w`<div class="error">Aucun programme disponible pour ce soir</div>`}
      </div>
    `}_renderTonightChannel(t){return w`
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
    `}_renderTonightProgram(t,e){let i=this._formatClockTime(t.start),s=this._formatClockTime(t.end),n=Date.now(),r=t.start<=n&&t.end>n,f=t.end<=n;return w`
      <div
        class="tonight-program ${r?"live":""} ${f?"past":""}"
        role="button"
        tabindex="0"
        @click=${()=>this._playTonightProgram(t,e)}
        @keydown=${S=>this._activateOnKey(S,()=>this._playTonightProgram(t,e))}
      >
        ${t.thumbnail?w`<img class="tonight-program-thumb" src=${t.thumbnail} loading="lazy" @load=${S=>S.target.style.display=""} @error=${S=>S.target.style.display="none"} />`:""}
        <div class="tonight-program-info">
          <div class="tonight-program-time">
            ${i} - ${s}
            ${r?w`<span class="live-indicator">EN DIRECT</span>`:""}
          </div>
          <div class="tonight-program-title">${t.title}</div>
          ${t.description?w`<div class="tonight-program-description">${t.description}</div>`:""}
        </div>
      </div>
    `}_activateOnKey(t,e){(t.key==="Enter"||t.key===" "||t.key==="Spacebar")&&(t.preventDefault(),e())}_tonightToProgramId(t){let e=t.split(":");return e[0]!=="tonight_program"||e.length<6?t:`program:${e[1]}:${e[4]}:${e[5]}`}async _playTonightProgram(t,e){let i=this._getEntityId();if(!i)return;this._episodePlaylist=[],this._episodeIndex=-1;let s=this._tonightToProgramId(t.mediaContentId);this._selectedChannel={id:e.id,name:e.name,thumbnail:e.thumbnail,mediaContentId:s,currentProgram:{title:t.title,start:t.start,end:t.end}},this._playerError=null;let n=Date.now();this._isLive=t.start<=n&&t.end>n,this._isLive?(this._programStart=t.start,this._programEnd=t.end):(this._programStart=null,this._programEnd=null),this._initPlaybackFlags();try{let r=this._buildPlayMediaId(s);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:r,media_content_type:"video"})}catch(r){console.error("[Molotov Panel] Play tonight program failed:",r),this._playerError=r.message||"Erreur de lecture",this._castLoading=!1}}_renderRecordingItem(t){let e=t.mediaContentId,i=this._expandedRecordings[e],s=this._recordingEpisodes[e]||[],n=this._loadingRecordingEpisodes[e],r=this._recordingEpisodes[e]!==void 0,f=!t.isFolder||r&&s.length<=1;return w`
      <div class="search-result-row">
        <div
          class="search-result-main"
          role="button"
          tabindex="0"
          @click=${S=>this._toggleRecordingExpand(S,t)}
          @keydown=${S=>this._activateOnKey(S,()=>this._toggleRecordingExpand(S,t))}
        >
          ${f?w`<ha-icon class="expand-icon" icon="mdi:play-circle-outline"></ha-icon>`:w`<ha-icon
                class="expand-icon ${i?"expanded":""}"
                icon="mdi:chevron-right"
              ></ha-icon>`}
          ${t.thumbnail?w`<img
                class="recording-thumb"
                src=${t.thumbnail}
                loading="lazy"
                @load=${S=>S.target.style.display=""} @error=${S=>S.target.style.display="none"}
              />`:w`<div class="recording-thumb"></div>`}
          <div class="recording-info">
            <div class="recording-title">${t.title}</div>
            ${t.description?w`<div class="recording-subtitle">${t.description}</div>`:""}
          </div>
        </div>
        ${i?w`
              <div class="episodes-list">
                ${n?w`<div class="episodes-loading">Chargement des episodes...</div>`:s.length>0?s.map(S=>w`
                        <div
                          class="episode-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playRecordingEpisode(S,t.title)}
                          @keydown=${$=>this._activateOnKey($,()=>this._playRecordingEpisode(S,t.title))}
                        >
                          ${S.thumbnail?w`<img class="episode-thumb" src=${S.thumbnail} loading="lazy" @load=${$=>$.target.style.display=""} @error=${$=>$.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${S.title}</div>
                            ${S.description?w`<div class="episode-desc">${S.description}</div>`:""}
                          </div>
                        </div>
                      `):w`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderSearchResults(){return w`
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
        ${this._searching?w`<div class="loading">Recherche...</div>`:this._searchResults.length>0?w`
              <div class="channel-list">
                ${this._searchResults.map(t=>this._renderSearchResultItem(t))}
              </div>
            `:w`<div class="error">Aucun resultat trouve</div>`}
      </div>
    `}_renderSearchResultItem(t){let e=t.mediaContentId,i=this._expandedResults[e],s=this._resultEpisodes[e]||[],n=this._loadingEpisodes[e];return w`
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
          ${t.thumbnail?w`<img class="search-result-thumb" src=${t.thumbnail} loading="lazy" @load=${r=>r.target.style.display=""} @error=${r=>r.target.style.display="none"} />`:""}
          <div class="search-result-info">
            <div class="search-result-title">${t.title}</div>
            ${t.description?w`<div class="search-result-subtitle">${t.description}</div>`:""}
          </div>
        </div>
        ${i?w`
              <div class="episodes-list">
                ${n?w`<div class="episodes-loading">Chargement des episodes...</div>`:s.length>0?s.map(r=>w`
                        <div
                          class="episode-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playEpisode(r,t.title)}
                          @keydown=${f=>this._activateOnKey(f,()=>this._playEpisode(r,t.title))}
                        >
                          ${r.thumbnail?w`<img class="episode-thumb" src=${r.thumbnail} loading="lazy" @load=${f=>f.target.style.display=""} @error=${f=>f.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${r.title}</div>
                            ${r.description?w`<div class="episode-desc">${r.description}</div>`:""}
                          </div>
                        </div>
                      `):w`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderChannelItem(t){let e=t.currentProgram,i=e?.start?this._formatClockTime(e.start):"",s=e?.end?this._formatClockTime(e.end):"",n=i&&s?`${i} - ${s}`:"",r=this._expandedChannels[t.id],f=this._channelPrograms[t.id]||[],S=this._loadingPrograms[t.id];return w`
      <div class="channel-row">
        <div class="channel-main">
          <img
            class="channel-logo"
            src=${t.thumbnail||""}
            alt=${t.name}
            loading="lazy"
            @load=${$=>$.target.style.display=""} @error=${$=>$.target.style.display="none"}
            @click=${()=>this._playChannel(t)}
          />
          <div
            class="channel-info"
            role="button"
            tabindex="0"
            @click=${()=>this._playChannel(t)}
            @keydown=${$=>this._activateOnKey($,()=>this._playChannel(t))}
          >
            <div class="channel-name">${t.name}</div>
            <div class="program-info">
              <div class="program-now">
                ${e?.title||"Direct"}
                ${n?w`<span class="program-time">(${n})</span>`:""}
              </div>
              ${e?.description?w`<div class="program-next">${e.description}</div>`:""}
            </div>
          </div>
          <div class="channel-actions">
            <button
              class="replay-btn ${r?"expanded":""}"
              @click=${$=>this._toggleChannelExpand($,t)}
            >
              <ha-icon icon="mdi:history"></ha-icon>
              Replay
            </button>
          </div>
        </div>
        ${r?w`
              <div class="replay-list">
                ${S?w`<div class="replay-loading">Chargement...</div>`:f.length>0?f.map($=>w`
                        <div
                          class="replay-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playReplay($)}
                          @keydown=${H=>this._activateOnKey(H,()=>this._playReplay($))}
                        >
                          ${$.thumbnail?w`<img class="replay-thumb" src=${$.thumbnail} loading="lazy" @load=${H=>H.target.style.display=""} @error=${H=>H.target.style.display="none"} />`:""}
                          <div class="replay-item-info">
                            <span class="replay-item-title">${$.title}</span>
                            ${$.description?w`<span class="replay-item-desc">${$.description}</span>`:""}
                          </div>
                        </div>
                      `):w`<div class="replay-empty">Aucun replay disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderMiniCastBar(){return w`
      <div class="mini-cast-bar">
        <div class="mini-cast-info">
          <ha-icon icon="mdi:cast-connected" style="--mdc-icon-size: 20px; color: var(--primary-color);"></ha-icon>
          <span class="mini-cast-title">${this._castTitle||"Chromecast"}</span>
        </div>
        <div class="mini-cast-controls">
          ${this._isLive?w`
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
    `}_renderPlayer(){let t=this._getProgressPercent(),e=this._selectedAudioIndex>=0&&this._audioTracks[this._selectedAudioIndex]?this._audioTracks[this._selectedAudioIndex].label:"Audio",i=this._selectedTextIndex>=0&&this._textTracks[this._selectedTextIndex]?this._textTracks[this._selectedTextIndex].label:"Off";return w`
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

            ${this._playerLoading?w`<div class="player-loading">
                  <div class="loading-spinner"></div>
                  <div class="loading-text">Chargement...</div>
                </div>`:""}

            ${this._playerError?w`<div class="player-error">${this._playerError}</div>`:""}

            ${this._showPlayOverlay?w`
                  <div class="play-overlay" @click=${this._handlePlayOverlayClick}>
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                `:""}

            <!-- Custom controls -->
            <div class="custom-controls ${this._paused?"":"autohide"}">
              <div class="progress-container">
                ${this._isLive&&this._programStart?w`<span>${this._formatClockTime(Date.now()-(this._liveDelay||0))}</span>`:w`<span>${this._formatTime(this._currentTime)}</span>`}
                <div class="progress-bar" @click=${this._handleProgressClick}>
                  <div class="progress-filled" style="width: ${t}%"></div>
                </div>
                ${this._isLive&&this._programEnd?w`<span>${this._formatClockTime(this._programEnd)}</span>`:w`<span>${this._formatTime(this._duration)}</span>`}
                ${this._isLive?w`<span class="live-badge">LIVE</span>`:""}
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
                  ${this._adOffer?w`<button class="icon-btn pubs-btn" @click=${this._localSkipAd}>
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
                  ${this._audioTracks.length>1?w`
                        <div class="track-menu-container">
                          <button class="icon-btn" @click=${this._toggleAudioMenu}>
                            <ha-icon icon="mdi:volume-source"></ha-icon>
                            <span style="font-size: 11px; margin-left: 2px;">${e}</span>
                          </button>
                          ${this._showAudioMenu?w`
                                <div class="track-menu">
                                  ${this._audioTracks.map(s=>w`
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

                  ${this._textTracks.length>0?w`
                        <div class="track-menu-container">
                          <button class="icon-btn" @click=${this._toggleTextMenu}>
                            <ha-icon icon="mdi:subtitles"></ha-icon>
                            <span style="font-size: 11px; margin-left: 2px;">${i}</span>
                          </button>
                          ${this._showTextMenu?w`
                                <div class="track-menu">
                                  <div
                                    class="track-menu-item ${this._selectedTextIndex===-1?"selected":""}"
                                    @click=${()=>this._selectTextTrack(-1)}
                                  >
                                    Off
                                  </div>
                                  ${this._textTracks.map(s=>w`
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
    `}_renderCastPlayer(){let t=this._getProgressPercent();return w`
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
                ${this._isLive&&this._programStart?w`<span>${this._formatClockTime(Date.now()-(this._liveDelay||0))}</span>`:w`<span>${this._formatTime(this._currentTime)}</span>`}
                <div class="progress-bar" @click=${this._handleCastSeek}>
                  <div class="progress-filled" style="width: ${t}%"></div>
                </div>
                ${this._isLive&&this._programEnd?w`<span>${this._formatClockTime(this._programEnd)}</span>`:w`<span>${this._formatTime(this._duration)}</span>`}
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
                  ${this._castSkipTo!==null?w`<button class="icon-btn pubs-btn" @click=${this._castSkipAd}>
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
    `}_renderMultiCastBar(){let t=Object.entries(this._activeCasts||{});return t.length<=1?"":w`
      <div class="multi-cast-bar">
        ${t.map(([e,i])=>{let s=e===this._focusedCastHost,n=i.title||e,r=i.state==="playing";return w`
            <div
              class="cast-chip ${s?"focused":""}"
              role="button"
              tabindex="0"
              @click=${()=>this._focusCast(e)}
              @keydown=${f=>this._activateOnKey(f,()=>this._focusCast(e))}
            >
              <span class="chip-icon">
                <ha-icon icon=${r?"mdi:cast-connected":"mdi:cast"} style="--mdc-icon-size: 18px;"></ha-icon>
              </span>
              <span>${n}</span>
              <span class="chip-stop" @click=${f=>this._stopSpecificCast(f,e)}>
                <ha-icon icon="mdi:close" style="--mdc-icon-size: 16px;"></ha-icon>
              </span>
            </div>
          `})}
      </div>
    `}async _focusCast(t){let e=this._getEntityId();if(!e)return;let i=this._activeCasts[t];if(!i)return;let s=t;try{await this.hass.callService("media_player","select_source",{entity_id:e,source:s}),this._focusedCastHost=t,this._castTarget=t,this._castTitle=i.title||"En cours de lecture",console.log("[Molotov Panel] Focused cast:",t)}catch(n){console.error("[Molotov Panel] Focus cast failed:",n)}}async _stopSpecificCast(t,e){t.stopPropagation();let i=this._getEntityId();if(!i||!this._activeCasts[e])return;let n=e;try{await this.hass.callService("media_player","select_source",{entity_id:i,source:n}),await new Promise(r=>setTimeout(r,200)),await this.hass.callService("media_player","media_stop",{entity_id:i}),console.log("[Molotov Panel] Stopped cast:",e)}catch(r){console.error("[Molotov Panel] Stop specific cast failed:",r)}}async _stopCastPlayback(){let t=this._getEntityId();if(t){try{await this.hass.callService("media_player","media_stop",{entity_id:t})}catch(e){console.error("[Molotov Panel] Stop cast failed:",e)}this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate(),this._castMinimized=!1,this._castLoading=!1,this._episodePlaylist=[],this._episodeIndex=-1}}async _toggleCastPlayPause(){let t=this._getEntityId();if(t)try{this._paused?await this.hass.callService("media_player","media_play",{entity_id:t}):await this.hass.callService("media_player","media_pause",{entity_id:t})}catch(e){console.error("[Molotov Panel] Play/pause cast failed:",e)}}async _castSkipForward(){let t=this._getEntityId();if(t)try{await this.hass.callService("media_player","media_next_track",{entity_id:t})}catch(e){console.error("[Molotov Panel] Skip forward failed:",e)}}_setCastPosition(t){this._currentTime=t,this._castBasePosition=t,this._castPositionUpdatedAt=Date.now()/1e3}async _castSeek(t){let e=this._getEntityId();if(e)try{await this.hass.callService("media_player","media_seek",{entity_id:e,seek_position:t}),this._setCastPosition(t)}catch(i){console.error("[Molotov Panel] Cast seek failed:",i)}}async _castSeekBeginning(){await this._castSeek(0)}async _castSkipBack30(){await this._castSeek(Math.max(0,this._currentTime-30))}async _castSkipBack10(){await this._castSeek(Math.max(0,this._currentTime-10))}async _castSkipAd(){this._castSkipTo!==null&&await this._castSeek(this._castSkipTo)}async _handleCastSeek(t){let e=this._getEntityId();if(!e||!this._duration)return;let s=t.currentTarget.getBoundingClientRect(),r=(t.clientX-s.left)/s.width*this._duration;try{await this.hass.callService("media_player","media_seek",{entity_id:e,seek_position:r}),this._setCastPosition(r)}catch(f){console.error("[Molotov Panel] Seek failed:",f)}}async _handleCastVolumeChange(t){let e=this._getEntityId();if(!e)return;let i=parseFloat(t.target.value);this._volume=i;try{await this.hass.callService("media_player","volume_set",{entity_id:e,volume_level:i})}catch(s){console.error("[Molotov Panel] Volume change failed:",s)}}async _toggleCastMute(){let t=this._getEntityId();if(t)try{await this.hass.callService("media_player","volume_mute",{entity_id:t,is_volume_muted:!this._muted}),this._muted=!this._muted}catch(e){console.error("[Molotov Panel] Mute toggle failed:",e)}}};customElements.define("molotov-panel",ci);console.log(`[Molotov Panel] Registered - v${$i}`);
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
