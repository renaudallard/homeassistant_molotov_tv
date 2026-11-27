var Ye=typeof window<"u"&&window.customElements!=null&&window.customElements.polyfillWrapFlushCallback!==void 0;var Yt=(c,t,e=null)=>{for(;t!==e;){let i=t.nextSibling;c.removeChild(t),t=i}};var vt=`{{lit-${String(Math.random()).slice(2)}}}`,Xe=`<!--${vt}-->`,mi=new RegExp(`${vt}|${Xe}`),de="$lit$",Xt=class{constructor(t,e){this.parts=[],this.element=e;let i=[],s=[],n=document.createTreeWalker(e.content,133,null,!1),r=0,g=-1,S=0,{strings:N,values:{length:W}}=t;for(;S<W;){let O=n.nextNode();if(O===null){n.currentNode=s.pop();continue}if(g++,O.nodeType===1){if(O.hasAttributes()){let ot=O.attributes,{length:rt}=ot,at=0;for(let ct=0;ct<rt;ct++)yi(ot[ct].name,de)&&at++;for(;at-- >0;){let ct=N[S],$t=$e.exec(ct)[2],ft=$t.toLowerCase()+de,gt=O.getAttribute(ft);O.removeAttribute(ft);let dt=gt.split(mi);this.parts.push({type:"attribute",index:g,name:$t,strings:dt}),S+=dt.length-1}}O.tagName==="TEMPLATE"&&(s.push(O),n.currentNode=O.content)}else if(O.nodeType===3){let ot=O.data;if(ot.indexOf(vt)>=0){let rt=O.parentNode,at=ot.split(mi),ct=at.length-1;for(let $t=0;$t<ct;$t++){let ft,gt=at[$t];if(gt==="")ft=Tt();else{let dt=$e.exec(gt);dt!==null&&yi(dt[2],de)&&(gt=gt.slice(0,dt.index)+dt[1]+dt[2].slice(0,-de.length)+dt[3]),ft=document.createTextNode(gt)}rt.insertBefore(ft,O),this.parts.push({type:"node",index:++g})}at[ct]===""?(rt.insertBefore(Tt(),O),i.push(O)):O.data=at[ct],S+=ct}}else if(O.nodeType===8)if(O.data===vt){let ot=O.parentNode;(O.previousSibling===null||g===r)&&(g++,ot.insertBefore(Tt(),O)),r=g,this.parts.push({type:"node",index:g}),O.nextSibling===null?O.data="":(i.push(O),g--),S++}else{let ot=-1;for(;(ot=O.data.indexOf(vt,ot+1))!==-1;)this.parts.push({type:"node",index:-1}),S++}}for(let O of i)O.parentNode.removeChild(O)}},yi=(c,t)=>{let e=c.length-t.length;return e>=0&&c.slice(e)===t},be=c=>c.index!==-1,Tt=()=>document.createComment(""),$e=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;var Qe=133;function Je(c,t){let{element:{content:e},parts:i}=c,s=document.createTreeWalker(e,Qe,null,!1),n=ve(i),r=i[n],g=-1,S=0,N=[],W=null;for(;s.nextNode();){g++;let O=s.currentNode;for(O.previousSibling===W&&(W=null),t.has(O)&&(N.push(O),W===null&&(W=O)),W!==null&&S++;r!==void 0&&r.index===g;)r.index=W!==null?-1:r.index-S,n=ve(i,n),r=i[n]}N.forEach(O=>O.parentNode.removeChild(O))}var Gi=c=>{let t=c.nodeType===11?0:1,e=document.createTreeWalker(c,Qe,null,!1);for(;e.nextNode();)t++;return t},ve=(c,t=-1)=>{for(let e=t+1;e<c.length;e++){let i=c[e];if(be(i))return e}return-1};function bi(c,t,e=null){let{element:{content:i},parts:s}=c;if(e==null){i.appendChild(t);return}let n=document.createTreeWalker(i,Qe,null,!1),r=ve(s),g=0,S=-1;for(;n.nextNode();)for(S++,n.currentNode===e&&(g=Gi(t),e.parentNode.insertBefore(t,e));r!==-1&&s[r].index===S;){if(g>0){for(;r!==-1;)s[r].index+=g,r=ve(s,r);return}r=ve(s,r)}}var Hi=new WeakMap;var Qt=c=>typeof c=="function"&&Hi.has(c);var _t={},Ne={};var jt=class{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(let i of this.__parts)i!==void 0&&i.setValue(t[e]),e++;for(let i of this.__parts)i!==void 0&&i.commit()}_clone(){let t=Ye?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],i=this.template.parts,s=document.createTreeWalker(t,133,null,!1),n=0,r=0,g,S=s.nextNode();for(;n<i.length;){if(g=i[n],!be(g)){this.__parts.push(void 0),n++;continue}for(;r<g.index;)r++,S.nodeName==="TEMPLATE"&&(e.push(S),s.currentNode=S.content),(S=s.nextNode())===null&&(s.currentNode=e.pop(),S=s.nextNode());if(g.type==="node"){let N=this.processor.handleTextExpression(this.options);N.insertAfterNode(S.previousSibling),this.__parts.push(N)}else this.__parts.push(...this.processor.handleAttributeExpressions(S,g.name,g.strings,this.options));n++}return Ye&&(document.adoptNode(t),customElements.upgrade(t)),t}};var vi=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:c=>c}),Ki=` ${vt} `,Rt=class{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){let t=this.strings.length-1,e="",i=!1;for(let s=0;s<t;s++){let n=this.strings[s],r=n.lastIndexOf("<!--");i=(r>-1||i)&&n.indexOf("-->",r+1)===-1;let g=$e.exec(n);g===null?e+=n+(i?Ki:Xe):e+=n.substr(0,g.index)+g[1]+g[2]+de+g[3]+vt}return e+=this.strings[t],e}getTemplateElement(){let t=document.createElement("template"),e=this.getHTML();return vi!==void 0&&(e=vi.createHTML(e)),t.innerHTML=e,t}};var Ue=c=>c===null||!(typeof c=="object"||typeof c=="function"),Le=c=>Array.isArray(c)||!!(c&&c[Symbol.iterator]),he=class{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let s=0;s<i.length-1;s++)this.parts[s]=this._createPart()}_createPart(){return new xe(this)}_getValue(){let t=this.strings,e=t.length-1,i=this.parts;if(e===1&&t[0]===""&&t[1]===""){let n=i[0].value;if(typeof n=="symbol")return String(n);if(typeof n=="string"||!Le(n))return n}let s="";for(let n=0;n<e;n++){s+=t[n];let r=i[n];if(r!==void 0){let g=r.value;if(Ue(g)||!Le(g))s+=typeof g=="string"?g:String(g);else for(let S of g)s+=typeof S=="string"?S:String(S)}}return s+=t[e],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}},xe=class{constructor(t){this.value=void 0,this.committer=t}setValue(t){t!==_t&&(!Ue(t)||t!==this.value)&&(this.value=t,Qt(t)||(this.committer.dirty=!0))}commit(){for(;Qt(this.value);){let t=this.value;this.value=_t,t(this)}this.value!==_t&&this.committer.commit()}},Jt=class c{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(Tt()),this.endNode=t.appendChild(Tt())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=Tt()),t.__insert(this.endNode=Tt())}insertAfterPart(t){t.__insert(this.startNode=Tt()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(this.startNode.parentNode===null)return;for(;Qt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=_t,e(this)}let t=this.__pendingValue;t!==_t&&(Ue(t)?t!==this.value&&this.__commitText(t):t instanceof Rt?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):Le(t)?this.__commitIterable(t):t===Ne?(this.value=Ne,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){let e=this.startNode.nextSibling;t=t??"";let i=typeof t=="string"?t:String(t);e===this.endNode.previousSibling&&e.nodeType===3?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){let e=this.options.templateFactory(t);if(this.value instanceof jt&&this.value.template===e)this.value.update(t.values);else{let i=new jt(e,t.processor,this.options),s=i._clone();i.update(t.values),this.__commitNode(s),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());let e=this.value,i=0,s;for(let n of t)s=e[i],s===void 0&&(s=new c(this.options),e.push(s),i===0?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(n),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){Yt(this.startNode.parentNode,t.nextSibling,this.endNode)}},we=class{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,i.length!==2||i[0]!==""||i[1]!=="")throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;Qt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=_t,e(this)}if(this.__pendingValue===_t)return;let t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=_t}},Se=class extends he{constructor(t,e,i){super(t,e,i),this.single=i.length===2&&i[0]===""&&i[1]===""}_createPart(){return new Oe(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}},Oe=class extends xe{},xi=!1;(()=>{try{let c={get capture(){return xi=!0,!1}};window.addEventListener("test",c,c),window.removeEventListener("test",c,c)}catch{}})();var ke=class{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=s=>this.handleEvent(s)}setValue(t){this.__pendingValue=t}commit(){for(;Qt(this.__pendingValue);){let n=this.__pendingValue;this.__pendingValue=_t,n(this)}if(this.__pendingValue===_t)return;let t=this.__pendingValue,e=this.value,i=t==null||e!=null&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),s=t!=null&&(e==null||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=Yi(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=_t}handleEvent(t){typeof this.value=="function"?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}},Yi=c=>c&&(xi?{capture:c.capture,passive:c.passive,once:c.once}:c.capture);function Ze(c){let t=Zt.get(c.type);t===void 0&&(t={stringsArray:new WeakMap,keyString:new Map},Zt.set(c.type,t));let e=t.stringsArray.get(c.strings);if(e!==void 0)return e;let i=c.strings.join(vt);return e=t.keyString.get(i),e===void 0&&(e=new Xt(c,c.getTemplateElement()),t.keyString.set(i,e)),t.stringsArray.set(c.strings,e),e}var Zt=new Map;var qt=new WeakMap,ti=(c,t,e)=>{let i=qt.get(t);i===void 0&&(Yt(t,t.firstChild),qt.set(t,i=new Jt(Object.assign({templateFactory:Ze},e))),i.appendInto(t)),i.setValue(c),i.commit()};var De=class{handleAttributeExpressions(t,e,i,s){let n=e[0];return n==="."?new Se(t,e.slice(1),i).parts:n==="@"?[new ke(t,e.slice(1),s.eventContext)]:n==="?"?[new we(t,e.slice(1),i)]:new he(t,e,i).parts}handleTextExpression(t){return new Jt(t)}},ei=new De;typeof window<"u"&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var x=(c,...t)=>new Rt(c,t,"html",ei);var Si=(c,t)=>`${c}--${t}`,Fe=!0;typeof window.ShadyCSS>"u"?Fe=!1:typeof window.ShadyCSS.prepareTemplateDom>"u"&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),Fe=!1);var Qi=c=>t=>{let e=Si(t.type,c),i=Zt.get(e);i===void 0&&(i={stringsArray:new WeakMap,keyString:new Map},Zt.set(e,i));let s=i.stringsArray.get(t.strings);if(s!==void 0)return s;let n=t.strings.join(vt);if(s=i.keyString.get(n),s===void 0){let r=t.getTemplateElement();Fe&&window.ShadyCSS.prepareTemplateDom(r,c),s=new Xt(t,r),i.keyString.set(n,s)}return i.stringsArray.set(t.strings,s),s},Ji=["html","svg"],Zi=c=>{Ji.forEach(t=>{let e=Zt.get(Si(t,c));e!==void 0&&e.keyString.forEach(i=>{let{element:{content:s}}=i,n=new Set;Array.from(s.querySelectorAll("style")).forEach(r=>{n.add(r)}),Je(i,n)})})},ki=new Set,ts=(c,t,e)=>{ki.add(c);let i=e?e.element:document.createElement("template"),s=t.querySelectorAll("style"),{length:n}=s;if(n===0){window.ShadyCSS.prepareTemplateStyles(i,c);return}let r=document.createElement("style");for(let N=0;N<n;N++){let W=s[N];W.parentNode.removeChild(W),r.textContent+=W.textContent}Zi(c);let g=i.content;e?bi(e,r,g.firstChild):g.insertBefore(r,g.firstChild),window.ShadyCSS.prepareTemplateStyles(i,c);let S=g.querySelector("style");if(window.ShadyCSS.nativeShadow&&S!==null)t.insertBefore(S.cloneNode(!0),t.firstChild);else if(e){g.insertBefore(r,g.firstChild);let N=new Set;N.add(r),Je(e,N)}},Ei=(c,t,e)=>{if(!e||typeof e!="object"||!e.scopeName)throw new Error("The `scopeName` option is required.");let i=e.scopeName,s=qt.has(t),n=Fe&&t.nodeType===11&&!!t.host,r=n&&!ki.has(i),g=r?document.createDocumentFragment():t;if(ti(c,g,Object.assign({templateFactory:Qi(i)},e)),r){let S=qt.get(g);qt.delete(g);let N=S.value instanceof jt?S.value.template:void 0;ts(i,g,N),Yt(t,t.firstChild),t.appendChild(g),qt.set(t,S)}!s&&n&&window.ShadyCSS.styleElement(t.host)};var Pi;window.JSCompiler_renameProperty=(c,t)=>c;var ai={toAttribute(c,t){switch(t){case Boolean:return c?"":null;case Object:case Array:return c==null?c:JSON.stringify(c)}return c},fromAttribute(c,t){switch(t){case Boolean:return c!==null;case Number:return c===null?null:Number(c);case Object:case Array:return JSON.parse(c)}return c}},Ti=(c,t)=>t!==c&&(t===t||c===c),ii={attribute:!0,type:String,converter:ai,reflect:!1,hasChanged:Ti},si=1,ni=4,ri=8,oi=16,li="finalized",ue=class extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();let t=[];return this._classProperties.forEach((e,i)=>{let s=this._attributeNameForProperty(i,e);s!==void 0&&(this._attributeToPropertyMap.set(s,i),t.push(s))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;let t=Object.getPrototypeOf(this)._classProperties;t!==void 0&&t.forEach((e,i)=>this._classProperties.set(i,e))}}static createProperty(t,e=ii){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;let i=typeof t=="symbol"?Symbol():`__${t}`,s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Object.defineProperty(this.prototype,t,s)}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){let n=this[t];this[e]=s,this.requestUpdateInternal(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||ii}static finalize(){let t=Object.getPrototypeOf(this);if(t.hasOwnProperty(li)||t.finalize(),this[li]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){let e=this.properties,i=[...Object.getOwnPropertyNames(e),...typeof Object.getOwnPropertySymbols=="function"?Object.getOwnPropertySymbols(e):[]];for(let s of i)this.createProperty(s,e[s])}}static _attributeNameForProperty(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=Ti){return i(t,e)}static _propertyValueFromAttribute(t,e){let i=e.type,s=e.converter||ai,n=typeof s=="function"?s:s.fromAttribute;return n?n(t,i):t}static _propertyValueToAttribute(t,e){if(e.reflect===void 0)return;let i=e.type,s=e.converter;return(s&&s.toAttribute||ai.toAttribute)(t,i)}initialize(){this._updateState=0,this._updatePromise=new Promise(t=>this._enableUpdatingResolver=t),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){let i=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,i)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){this._enableUpdatingResolver!==void 0&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=ii){let s=this.constructor,n=s._attributeNameForProperty(t,i);if(n!==void 0){let r=s._propertyValueToAttribute(e,i);if(r===void 0)return;this._updateState=this._updateState|ri,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._updateState=this._updateState&~ri}}_attributeToProperty(t,e){if(this._updateState&ri)return;let i=this.constructor,s=i._attributeToPropertyMap.get(t);if(s!==void 0){let n=i.getPropertyOptions(s);this._updateState=this._updateState|oi,this[s]=i._propertyValueFromAttribute(e,n),this._updateState=this._updateState&~oi}}requestUpdateInternal(t,e,i){let s=!0;if(t!==void 0){let n=this.constructor;i=i||n.getPropertyOptions(t),n._valueHasChanged(this[t],e,i.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),i.reflect===!0&&!(this._updateState&oi)&&(this._reflectingProperties===void 0&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,i))):s=!1}!this._hasRequestedUpdate&&s&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=this._updateState|ni;try{await this._updatePromise}catch{}let t=this.performUpdate();return t!=null&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return this._updateState&ni}get hasUpdated(){return this._updateState&si}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1,e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(i){throw t=!1,this._markUpdated(),i}t&&(this._updateState&si||(this._updateState=this._updateState|si,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~ni}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){this._reflectingProperties!==void 0&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,i)=>this._propertyToAttribute(i,this[i],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}};Pi=li;ue[Pi]=!0;var Ci=Element.prototype,tn=Ci.msMatchesSelector||Ci.webkitMatchesSelector;var Be=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ci=Symbol(),Ee=class{constructor(t,e){if(e!==ci)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return this._styleSheet===void 0&&(Be?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}},Ai=c=>new Ee(String(c),ci),es=c=>{if(c instanceof Ee)return c.cssText;if(typeof c=="number")return c;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${c}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`)},Ii=(c,...t)=>{let e=t.reduce((i,s,n)=>i+es(s)+c[n+1],c[0]);return new Ee(e,ci)};(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");var Mi={},te=class extends ue{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;let t=this.getStyles();if(Array.isArray(t)){let e=(n,r)=>n.reduceRight((g,S)=>Array.isArray(S)?e(S,g):(g.add(S),g),r),i=e(t,new Set),s=[];i.forEach(n=>s.unshift(n)),this._styles=s}else this._styles=t===void 0?[]:[t];this._styles=this._styles.map(e=>{if(e instanceof CSSStyleSheet&&!Be){let i=Array.prototype.slice.call(e.cssRules).reduce((s,n)=>s+n.cssText,"");return Ai(i)}return e})}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){let t=this.constructor._styles;t.length!==0&&(window.ShadyCSS!==void 0&&!window.ShadyCSS.nativeShadow?window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(e=>e.cssText),this.localName):Be?this.renderRoot.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):this._needsShimAdoptedStyleSheets=!0)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&window.ShadyCSS!==void 0&&window.ShadyCSS.styleElement(this)}update(t){let e=this.render();super.update(t),e!==Mi&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(i=>{let s=document.createElement("style");s.textContent=i.cssText,this.renderRoot.appendChild(s)}))}render(){return Mi}};te.finalized=!0;te.render=Ei;te.shadowRootOptions={mode:"open"};var D=(()=>{function Nt(h,b){let f=[],o=0;for(;o<h.length;){if(!h[o]){o++;continue}let d=o,p=o+1;for(;p<h.length&&p-d<=b+1;)h[p]&&(d=p),p++;f.push([o,d]),o=d+1}return f}function Ge(h,b,f){let o=0;for(let v of h)v&&o++;if(!(f>0)||o*2<h.length)return null;let d=Nt(h,3).filter(v=>(v[1]-v[0]+1)*f>=60),p=[];for(let v=0;v+1<d.length;v++){let T=d[v],C=d[v+1],L=b+(T[1]+1)*f,$=b+C[0]*f,A=0;for(let U=T[1]+1;U<C[0];U++)h[U]&&A++;$-L>=150&&$-L<=800&&A*2<C[0]-T[1]-1&&p.push([L,$])}return p}function ee(h,b,f){let o=new Array(h.length).fill(!1);for(let d=0;d<h.length;d++){if(!f[d])continue;let p=[];for(let v=Math.max(0,d-2);v<=Math.min(h.length-1,d+2);v++)f[v]&&p.push(h[v]);p.sort((v,T)=>v-T),o[d]=p[p.length>>1]<.5*b}return o}function ie(h){let b=new Array(h.length).fill(!1);for(let f of Nt(h,0))if(f[1]-f[0]+1>=5)for(let o=f[0];o<=f[1];o++)b[o]=!0;return b}function pe(h,b,f,o,d){let p=ie(h),v=(A,U)=>{if(A<0||U>p.length)return!1;let z=0;for(let wt=A;wt<U;wt++)p[wt]||z++;return z>=8},T=A=>{let U=(A[1]+1-A[0])*b;return v(A[0]-15,A[0])&&v(A[1]+1,A[1]+1+15)&&U>=150&&U<=1200},C=Nt(p,7);if(!f||!o)return C.filter(T);let L=d?C.filter(A=>A[1]-A[0]+1>=10):C,$=[];for(let A of Te(L,f,o,b)){let U=L.filter(z=>z[0]>=A[0]&&z[1]<=A[1]);if(T(A)&&(!d||U.length===1||U.some(T)))$.push(A);else for(let z of U)T(z)&&$.push([z[0],z[1]])}return $}function Te(h,b,f,o){let d=[];for(let p of h){let v=d[d.length-1];v&&(p[1]+1-v[0])*o<=1200&&He(v[1]+1,p[0],b,f)?v[1]=p[1]:d.push([p[0],p[1]])}return d}function He(h,b,f,o){let d=0;for(let p=h;p<b;p++)(f[p]||o[p])&&d++;return b-h<=29&&d>=b-h-7&&Ce(f,h,b)<=10&&Ce(o,h,b)<=12}function Ce(h,b,f){let o=0,d=0;for(let p=b;p<f;p++)o=h[p]?o+1:0,d=Math.max(d,o);return d}function se(h,b,f,o){let d=h,p=o?h.map(($,A)=>!$&&o[A]):null,v=o?h.map(($,A)=>$&&!o[A]):null,T=pe(d,f,v,p,!0);if(o){d=new Array(h.length).fill(!1);let $=new Array(h.length).fill(!1);for(let A of T)for(let U=A[0];U<=A[1];U++)d[U]=h[U]&&o[U],$[U]=h[U]&&!o[U];T=pe(d,f,$,p)}let C=ie(d),L=o?Vt(h,o,T,b,f):[];return T.map($=>{let A=Nt(C.slice($[0],$[1]+1),0),U=lt(o?xt(A,$[0],h,o):A);return[b+($[0]+U[0])*f,b+($[0]+U[1]+1)*f]}).concat(L)}function lt(h){let b=0,f=h.length-1;for(;f>b&&h[f][1]-h[f][0]+1<10;)f--;for(;b<f&&h[b][1]-h[b][0]+1<10;)b++;return[h[b][0],h[f][1]]}function xt(h,b,f,o){let d=[];for(let p of h){let v=d[d.length-1];v&&!B(b+v[1]+1,b+p[0],f,o)?v[1]=p[1]:d.push([p[0],p[1]])}return d}function B(h,b,f,o){let d=0;for(let p=h;p<b;p++)if(!f[p]&&!o[p]||(d=o[p]?0:d+1,d>=5))return!0;return!1}function Vt(h,b,f,o,d){let p=ie(h),v=(C,L)=>{if(C<0||L>p.length)return!1;let $=0;for(let A=C;A<L;A++)p[A]||$++;return $>=12},T=[];for(let C of pe(b,d)){if(f.some(z=>z[0]<=C[1]&&C[0]<=z[1]))continue;let L=0;for(let z=C[0];z<=C[1];z++)h[z]&&L++;if(L<.5*(C[1]-C[0]+1))continue;let $=-1,A=-1;for(let z=C[0];z<=C[1];z++)p[z]&&($<0&&($=z),A=z+1);if($<0||(A-$)*d<150||!v($-15,$)||!v(A,A+15))continue;let U=lt(xt(Nt(p.slice(C[0],C[1]+1),0),C[0],h,b));T.push([o+(C[0]+U[0])*d,o+(C[0]+U[1]+1)*d])}return T}function Gt(h,b){if(h===null)return b||[];if(b===null)return h;let f=[];for(let o of h)for(let d of b){let p=Math.max(o[0],d[0]),v=Math.min(o[1],d[1]);v-p<60||f.push([Math.abs(o[0]-d[0])<=90?d[0]:p,Math.abs(o[1]-d[1])<=90?d[1]:v])}return f}function Lt(h,b,f){let o=Math.floor(b*.22),d=Math.floor(f*.22),p=o-1,v=d-1,T=p*v,C=[[0,0],[b-o,0],[0,f-d],[b-o,f-d]],L=C.map(()=>new Uint8Array(T>0?h*T:0)),$=new Array(h).fill(!1),A=-1;function U(R,Z){if(!(T<=0||R<0||R>=h||Z.length<b*f)){for(let G=0;G<C.length;G++){let et=C[G][0],Q=C[G][1],it=L[G],tt=R*T;for(let K=0;K<v;K++){let J=(Q+K)*b+et;for(let bt=0;bt<p;bt++){let Mt=Z[J];it[tt++]=Math.min(255,Math.abs(Z[J+1]-Mt)+Math.abs(Z[J+b]-Mt)),J++}}}$[R]=!0}}function z(R,Z,G){let et=L[R],Q=new Uint8Array(T);for(let J=0;J<T;J++){G.fill(0);for(let Ie of Z)G[et[Ie*T+J]]++;let bt=0,Mt=0;for(;bt+G[Mt]<=Z.length>>1;)bt+=G[Mt++];Q[J]=Mt}let it=Math.max(1,Array.from(Q).sort((J,bt)=>J-bt)[Math.floor(T*.92)]),tt=[],K=0;for(let J=0;J<T;J++)Q[J]>=it&&(tt.push(J),K+=Q[J]);return tt.length===0?null:{corner:R,median:Q,mask:tt,strength:K/tt.length,whole:K}}function wt(R,Z,G,et){let Q=null;for(let it=R;it<Z;it++){let tt=z(it,G,et);tt!==null&&(Q===null||tt.strength>Q.strength)&&(Q=tt)}return Q}function le(R,Z){let G=L[R.corner],et=new Float64Array(h),Q=[];for(let it of Z){let tt=it*T,K=0;for(let J of R.mask)K+=Math.min(G[tt+J],R.median[J]);et[it]=K/R.whole,Q.push(et[it])}return Q.sort((it,tt)=>it-tt),R.score=et,R.usual=Q[Q.length>>1],R}function zt(){let R=[];for(let K=0;K<h;K++)$[K]&&R.push(K);if(T<=0||R.length<30)return null;let Z=new Int32Array(256),G=K=>K!==null&&K.strength>=25?K:null,et=K=>K!==null&&K.strength>=30?K:null,Q=wt(2,L.length,R,Z),it=A<0?G(wt(0,2,R,Z)):A<2?z(A,R,Z):null,tt=it!==null?it:A<0?G(Q):z(A,R,Z);return tt===null?null:(A=tt.corner,le(tt,R),tt.lower=it!==null&&et(Q)!==null?le(Q,R):null,tt)}function X(R){let Z=C[R.corner][0],G=C[R.corner][1];return{width:b,points:R.mask.map(et=>(G+Math.floor(et/p))*b+Z+et%p),pattern:R.mask.map(et=>R.median[et]),whole:R.whole,usual:R.usual,strength:R.strength,lower:R.lower?X(R.lower):null,channel:R.corner<2}}function Et(){let R=zt();return R===null?null:X(R)}function ce(){let R=zt();return R===null?null:ee(R.score,R.usual,$)}return{add:U,logo:Et,gone:ce,breaks:(R,Z)=>{let G=zt();if(G===null)return null;let et=G.lower?ee(G.lower.score,G.lower.usual,$):null;return se(ee(G.score,G.usual,$),R,Z,et)}}}function mt(h){return h.lower?Object.assign({},h,{lower:null}):h}function Ot(h,b,f){let o=0;for(let d of b)Ut(h,d)>=.5*h.usual&&o++;return o>=f*b.length}function Ut(h,b){let f=0;for(let o=0;o<h.points.length;o++){let d=h.points[o],p=b[d];f+=Math.min(Math.abs(b[d+1]-p)+Math.abs(b[d+h.width]-p),h.pattern[o])}return f/h.whole}function yt(h){let b=String(h).match(/[A-Za-z0-9+\/]{16,}={0,2}/g)||[];for(let f of b){let o;try{o=atob(f)}catch{continue}if(o.length<20||o.charCodeAt(0)!==252)continue;let d=p=>{if(p<0||p>=o.length)throw new RangeError("short");return o.charCodeAt(p)};try{if(d(13)===5&&!(d(18)&128))return(d(19)&128)!==0;for(let p=16;p+4<=o.length;p++){if(o.substr(p,4)!=="CUEI"||d(p-2)!==2)continue;let v=p+8;if(d(v)&128)continue;v++;let T=d(v);v++,T&128||(v+=1+6*d(v)),T&64&&(v+=5),v+=2+d(v+1);let C=d(v);if([34,48,50,52,54].indexOf(C)>=0)return!0;if([35,49,51,53,55].indexOf(C)>=0)return!1}}catch{return null}return null}return null}function Dt(h){let b=[];if(h.some(f=>f.signalled))for(let f of h)for(let o of f.marks){if(!o.opens)continue;let d=null;if(o.duration!==null)d=o.at+o.duration;else{let p=f.marks.filter(v=>v.at>o.at).map(v=>v.at);d=p.length>0?Math.min.apply(null,p):f.end}d!==null&&d>o.at&&b.push([o.at,d])}else{let f=o=>o.end-o.start;for(let o=1;o+1<h.length;o++){let d=h[o-1],p=h[o],v=h[o+1];if(d.end===null||p.end===null||v.end===null)continue;f(p)<10&&f(d)>=60&&f(d)<=420&&f(v)>=60&&f(v)<=420&&b.push([d.start,v.end])}if(b.length>0)for(let o=1;o+1<h.length;o++){let d=h[o-1],p=h[o],v=h[o+1];if(d.end===null||p.end===null)continue;f(p)>=60&&f(p)<=420&&f(d)>420&&(v.end===null||f(v)>420)&&b.push([p.start,p.end])}}return _e(b,10)}function _e(h,b){let f=[];for(let o of h.slice().sort((d,p)=>d[0]-p[0])){let d=f[f.length-1];d&&o[0]-d[1]<=b?d[1]=Math.max(d[1],o[1]):f.push([o[0],o[1]])}return f}let Ft={270:{tiny:120,mean:40,key:4e3},540:{tiny:172,mean:86,key:8e3},1080:{tiny:430,mean:172,key:12e3}},ne=10,fe=20,Ht=.2,Wt=6,nt=90,re=60,Bt=100,At=3,ge=65536,me=1e4;function ht(h,b){return String.fromCharCode(h[b+4],h[b+5],h[b+6],h[b+7])}function St(h){let b=new DataView(h.buffer,h.byteOffset,h.byteLength),f=0;for(;h.length-f>=8;){let o=b.getUint32(f);if(o<8||f+o>ge)return null;if(ht(h,f)==="moof")return f+o;f+=o}return null}function pt(h,b,f,o){let d=[],p=f;for(;o-p>=8;){let v=b.getUint32(p);if(v<8||v>o-p)break;d.push({type:ht(h,p),from:p+8,to:p+v}),p+=v}return d}function oe(h){let b=St(h);if(b===null||b>h.length)return null;let f=new DataView(h.buffer,h.byteOffset,h.byteLength),o=pt(h,f,0,b).pop();if(!o||o.type!=="moof")return null;let d=pt(h,f,o.from,o.to).filter(T=>T.type==="traf")[0];if(!d)return null;let p=[],v=-1;for(let T of pt(h,f,d.from,d.to)){if(T.type!=="tfhd"&&T.type!=="trun")continue;let C=T.from;if(T.to-C<8)return null;let L=f.getUint32(C)&16777215;if(T.type==="tfhd"){let $=C+8;if(L&1&&($+=8),L&2&&($+=4),L&8&&($+=4),L&16){if($+4>T.to)return null;v=f.getUint32($)}}else{let $=f.getUint32(C+4),A=((L&256?1:0)+(L&512?1:0)+(L&1024?1:0)+(L&2048?1:0))*4,U=C+8+(L&1?4:0)+(L&4?4:0);if($>me||U+$*A>T.to||!(L&512)&&v<0)return null;for(let z=0;z<$;z++)p.push(L&512?f.getUint32(U+(L&256?4:0)):v),U+=A}}return p}function Ae(h,b,f,o){let d=[],p=0,v=0;for(let T=0;T<h.length;T++){let C=h[T];if(C>=0&&C<o.tiny){p++,v+=C;continue}p>=ne&&p<=fe&&v<=o.mean*p&&C>o.key&&d.push(b+T*f),p=0,v=0}return d}function kt(h){let b=[];for(let o of h.slice().sort((d,p)=>d-p)){let d=b[b.length-1];d&&o-d[d.length-1]<=Ht||(d&&o-d[d.length-1]<=re?d.push(o):b.push([o]))}let f=[];for(let o=0;o<b.length;o++){let d=b[o],p=b[o+1],v=f[f.length-1];v&&!(v.length>=At&&d[0]-v[v.length-1]<=Bt)&&(v=null),v&&d.length>=At?v.push(...d):v&&p&&p.length>=At&&p[0]-d[d.length-1]<=Bt?(v.push(...d,...p),o++):f.push(d)}return f.filter(o=>o.length>=Wt&&o[o.length-1]-o[0]>=nt).map(o=>[o[1],o[o.length-2]])}function ae(h,b){let f=b.filter(o=>o[0]<h[1]&&o[1]>h[1])[0];return f?[h[0],f[1]]:h}function It(h,b){return b.filter(f=>f[0]<h[1]&&f[1]>h[1]).reduce((f,o)=>Math.max(f,o[1]),h[1])}return{runs:Nt,captionBreaks:Ge,gone:ee,solid:ie,logoBreaks:se,combine:Gt,track:Lt,score:Ut,alone:mt,seenIn:Ot,opens:yt,markedBreaks:Dt,merge:_e,moofEnd:St,frameSizes:oe,separatorEnds:Ae,separatedBreaks:kt,reachSeparated:ae,askedEnd:It,BLACKS:Ft,SEP_WIDE_GAP_S:Bt,BRIDGE:7,AROUND:15,LOGO_MAX_S:1200}})();function Ri(c){let ft=D.LOGO_MAX_S+160,gt=ft+120,dt=3,je=4096,Ct=Math.min.apply(null,Object.keys(D.BLACKS).map(Number)),qe=6,Ve=2,Pe=480,hi=1,ui=8,Nt=60,Ge=4,ee=3e4,ie=4e3,pe=150,Te=1e4,He=5*60*1e3,Ce=10,se=2e4,lt=240,xt=135,B=0,Vt=null,Gt=!1,Lt=null,mt=null,Ot=[],Ut=[],yt="none",Dt=null,_e=0,Ft=new Map,ne=[],fe=0,Ht="none",Wt=[],nt=null,re="none",Bt=-1/0,At=0,ge=new Map,me=null,ht=new Map,St=new Map,pt=new Map,oe=0,Ae=0,kt=null,ae=!1,It=null,h=!1,b="none",f=[],o=0,d=new Map,p=new Map,v=[],T=0,C="",L=!1;function $(a){let l=String(a).indexOf("?");return l<0?String(a):String(a).slice(0,l)}function A(a,l){try{let _=a&&a.contentId,u=!!c.isLive(),m=_?$(_):null;Lt=_||null;let y=l&&l.live_thumbnails_url;mt=u&&typeof y=="string"&&y.indexOf("https://")===0?y.replace(/\/+$/,""):null,h=u&&!!(l&&l.separated_breaks===!0);let k=!u&&!!(l&&l.recording)&&m!==null;if(m!==null&&m===Vt&&u===Gt){k&&/^error/.test(yt)&&(Dt={url:Lt,name:Vt,mine:B});return}B++,Vt=m,Gt=u,kt=null,ae=c.show(!1),Ot=[],Ut=[],yt=k?"waiting":"none",ne=[],fe=0,Ht="none",Wt=[],nt=null,re="none",Bt=-1/0,At=0,me=null,ht=new Map,St=new Map,pt=new Map,b=h?"waiting":"none",f=[],o=0,d=new Map,p=new Map,v=[],T=0,C="",L=!1,Dt=k?{url:Lt,name:Vt,mine:B}:null,_e=0}catch{yt="error"}}function U(a,l,_){let u=new Array(a.length),m=0,y=async()=>{for(;m<a.length;){let w=m++;u[w]=await _(a[w],w)}},k=[];for(let w=0;w<Math.min(l,a.length);w++)k.push(y());return Promise.all(k).then(()=>u)}async function z(a){let l=new AbortController,_=setTimeout(()=>l.abort(),se);try{let u=await fetch(a,{credentials:"omit",signal:l.signal});if(!u.ok)throw new Error("http "+u.status);return await u.text()}finally{clearTimeout(_)}}function wt(a,l,_){return new Promise(u=>{let m=new Image,y=setTimeout(()=>{m.onload=null,m.onerror=null,u(null)},se);m.crossOrigin="anonymous",m.onload=()=>{clearTimeout(y);try{It===null&&(It=document.createElement("canvas")),(It.width!==l||It.height!==_)&&(It.width=l,It.height=_);let k=It.getContext("2d",{willReadFrequently:!0});k.drawImage(m,0,0,l,_),u(k.getImageData(0,0,l,_).data)}catch{u(null)}},m.onerror=()=>{clearTimeout(y),u(null)},m.src=a})}function le(a,l,_){let u=new Uint8Array(lt*xt),m=0;for(let y=0;y<xt;y++){let k=(y*l+_)*4;for(let w=0;w<lt;w++)u[m++]=a[k]*77+a[k+1]*150+a[k+2]*29>>8,k+=4}return u}function zt(a){let l=/^PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?$/.exec(a||"");return l?Number(l[1]||0)*3600+Number(l[2]||0)*60+Number(l[3]||0):NaN}function X(a,l){let _=[];for(let u=a.firstElementChild;u;u=u.nextElementSibling)u.localName===l&&_.push(u);return _}function Et(a,l){let _=X(a,"BaseURL")[0];return _&&_.textContent?new URL(_.textContent.trim(),l).href:l}function ce(a,l,_,u){let m=u||X(a,"Representation")[0];if(!m)return[];let y=X(a,"SegmentTemplate")[0]||X(m,"SegmentTemplate")[0],k=y&&y.getAttribute("media");if(!k)return[];let w=Number(y.getAttribute("timescale")||1),E=Number(y.getAttribute("presentationTimeOffset")||0),F=(V,ut,st)=>V.replace(new RegExp("\\$"+ut+"(?:%0(\\d+)d)?\\$","g"),(Pt,Kt)=>Kt?String(st).padStart(Number(Kt),"0"):String(st)),I=(V,ut)=>new URL(F(F(k.split("$RepresentationID$").join(m.getAttribute("id")),"Time",V),"Number",ut),l).href,P=[],j=X(y,"SegmentTimeline")[0];if(j){let V=0,ut=Number(y.getAttribute("startNumber")||1),st=X(j,"S");for(let Pt=0;Pt<st.length;Pt++){let Kt=st[Pt];Kt.getAttribute("t")!==null&&(V=Number(Kt.getAttribute("t")));let Me=Number(Kt.getAttribute("d")),Re=Number(Kt.getAttribute("r")||0);if(!(Me>0))return[];if(Re<0){let ye=Pt+1<st.length?st[Pt+1].getAttribute("t"):null,Vi=ye!==null?Number(ye):_*w+E;Re=Math.ceil((Vi-V)/Me)-1}if(!(Re>=0))return[];for(let ye=0;ye<=Re;ye++)if(P.push({time:(V-E)/w,duration:Me/w,url:I(V,ut)}),V+=Me,ut++,P.length>Te)return[]}return P}let Y=Number(y.getAttribute("duration"))/w,M=Number(y.getAttribute("startNumber")||1);if(!(Y>0))return[];let H=0;y.getAttribute("eptDelta")!==null?H=Number(y.getAttribute("eptDelta"))/w:H=(M-1)*Y-E/w,H<0&&-H<Y||(H=0);let q=y.getAttribute("endNumber")!==null?Number(y.getAttribute("endNumber")):M+Math.ceil((_-H)/Y)-1;if(!(q>=M)||q-M+1>Te)return[];for(let V=M;V<=q;V++)P.push({time:(V-M)*Y+H,duration:Y,url:I("",V)});return P}async function R(a,l){if(a.length===0)return null;let _=/<p\b[^>]*>([\s\S]*?)<\/p>/g,u=0,m=await U(a,4,async y=>{if(l!==B)return!0;try{let k=await z(y.url).catch(()=>z(y.url)),w;for(_.lastIndex=0;(w=_.exec(k))!==null;)if(w[1].replace(/<[^>]+>/g,"").trim()!=="")return!0;return!1}catch{return u++,!0}});if(l!==B)throw new Error("superseded");if(u*20>m.length)throw new Error("captions unread");return D.captionBreaks(m,a[0].time,a[0].duration)}async function Z(a,l,_,u){if(a.length===0||a.length>pe||_!==1||!(l>0))return null;let m=l,y=D.track(a.length*m,lt,xt),k=async I=>(await U(I,1,async j=>{if(u!==B)return!1;let Y=await wt(a[j].url,l*lt,xt);if(Y===null&&u===B&&(Y=await wt(a[j].url,l*lt,xt)),Y===null)return!1;for(let M=0;M<m;M++)y.add(j*m+M,le(Y,l*lt,M*lt));return!0})).every(j=>j),w=a.map((I,P)=>P);if(!await k(w.filter(I=>I%2===0)))throw new Error("thumbnails unread");let E=y.gone();if(E===null)return null;let F=I=>{if(I<0||I>=a.length)return!1;for(let P=I*m;P<(I+1)*m;P++)if(E[P])return!0;return!1};if(!await k(w.filter(I=>I%2===1&&(F(I-1)||F(I+1)))))throw new Error("thumbnails unread");return y.breaks(a[0].time,a[0].duration/m)}async function G(a,l,_){if(Ft.has(l)){let u=Ft.get(l);Ot=u.breaks,Ut=u.separated||[],yt="known",u.separated===null&&await et(u,_);return}yt="searching";try{let u=new DOMParser().parseFromString(await z(a),"application/xml").documentElement,m=u?X(u,"Period"):[],y=u?zt(u.getAttribute("mediaPresentationDuration")):NaN;if(u&&(u.getAttribute("type")==="dynamic"||!(y>0)))throw new Error("not whole yet");if(!u||m.length!==1){_===B&&(yt="not a recording");return}let k=Et(m[0],Et(u,a)),w=null,E=null;for(let P of X(m[0],"AdaptationSet")){let j=X(P,"Representation")[0],Y=P.getAttribute("mimeType")||j&&j.getAttribute("mimeType")||"",M=P.getAttribute("contentType")||Y.split("/")[0];if(M==="text"&&w===null)w=await R(ce(P,k,y),_);else if(M==="image"&&E===null){let H=X(P,"EssentialProperty").concat(j?X(j,"EssentialProperty"):[]).filter(V=>/thumbnail_tile$/.test(V.getAttribute("schemeIdUri")||""))[0],q=/^(\d+)x(\d+)$/.exec(H&&H.getAttribute("value")||"");q&&(E=await Z(ce(P,k,y),Number(q[1]),Number(q[2]),_))}if(_!==B)return}let F=D.combine(w,E).filter(P=>P[0]>0&&P[1]<y),I={breaks:F,separated:null,period:m[0],base:k,total:y};if(Ft.set(l,I),Ft.size>20&&Ft.delete(Ft.keys().next().value),_!==B)return;Ot=F,yt="found "+F.length+" (captions "+(w===null?"none":w.length)+", logo "+(E===null?"none":E.length)+")",await et(I,_)}catch(u){_===B&&(yt="error: "+String(u&&u.message).slice(0,40),setTimeout(()=>{_===B&&/^error/.test(yt)&&(Dt={url:a,name:l,mine:_})},He*2**Math.min(_e++,12)))}}async function et(a,l){if(a.breaks.length===0){a.separated=[];return}let _=await Q(a.period,a.base,a.total,a.breaks,l);_!==null&&(a.separated=_,l===B&&(Ut=_))}async function Q(a,l,_,u,m){let y=[];J(a).forEach((M,H)=>{for(let q of ce(M.set,Et(M.rep,Et(M.set,l)),_,M.rep))y.push({time:q.time,duration:q.duration,url:q.url,height:H})});let k=new Map,w=D.SEP_WIDE_GAP_S,E=u.map(M=>[Math.max(0,M[0]-w),Math.min(_,M[1]+w)]),F=()=>{let M=[];return k.forEach(H=>{typeof H!="string"&&M.push(...H)}),M};for(;;){let M=[];y.forEach((q,V)=>{!k.has(V)&&(!L||q.height===Ct)&&E.some(ut=>q.time+q.duration>ut[0]&&q.time<ut[1])&&M.push(V)});for(let q=0;q<dt&&M.length>0;q++){let V=await U(M,L?Ve:qe,st=>m===B?Mt(y[st]):"stopped");if(m!==B)return null;let ut=await Ie(M.map(st=>y[st]),V);if(m!==B)return null;if(ut){L=!0,M=M.filter(st=>y[st].height===Ct),q=-1;continue}M.forEach((st,Pt)=>k.set(st,V[Pt])),M=M.filter((st,Pt)=>typeof V[Pt]=="string")}let H=it(E,F(),_);if(H.every((q,V)=>q[0]===E[V][0]&&q[1]===E[V][1]))break;E=H}let I=Array.from(k.entries()).filter(([M])=>!L||y[M].height===Ct);if(I.length===0)return null;let P=I.filter(([,M])=>typeof M=="string").length,j=F();if(b="segments "+I.length+(L?" whole "+Ct+"p":"")+", blacks "+j.length+(P>0?", failed "+P:""),P*Ce>I.length)return null;let Y=D.separatedBreaks(j).filter(M=>u.some(H=>H[0]<=M[0]&&M[1]<=H[1]));return b+=", breaks "+Y.length,Y}function it(a,l,_){let u=D.SEP_WIDE_GAP_S,m=y=>l.some(k=>k>y-u&&k<y+u);return a.map(y=>[y[0]>0&&m(y[0])?Math.max(0,y[0]-u):y[0],y[1]<_&&m(y[1])?Math.min(_,y[1]+u):y[1]])}async function tt(a){try{let l=new DOMParser().parseFromString(await z(Lt),"application/xml").documentElement;if(!l||a!==B)return;let _=Date.parse(l.getAttribute("availabilityStartTime")||"")/1e3;if(!isFinite(_)){Ht="no start time";return}let u=X(l,"Period"),m=u.map(w=>zt(w.getAttribute("start"))),y=null,k=u.map((w,E)=>{let F=isFinite(m[E])?_+m[E]:y!==null?y:_,I=zt(w.getAttribute("duration")),P=isFinite(I)?F+I:E+1<m.length&&isFinite(m[E+1])?_+m[E+1]:null,j=X(w,"EventStream").filter(M=>(M.getAttribute("schemeIdUri")||"").indexOf("urn:scte:scte35")===0),Y=[];for(let M of j){let H=Number(M.getAttribute("timescale")||1),q=Number(M.getAttribute("presentationTimeOffset")||0);for(let V of X(M,"Event")){let ut=D.opens(new XMLSerializer().serializeToString(V));if(ut===null)continue;let st=Number(V.getAttribute("duration")||0)/H;Y.push({at:F+(Number(V.getAttribute("presentationTime")||0)-q)/H,duration:st>0?st:null,opens:ut})}}return y=P,{start:F,end:P,marks:Y,signalled:j.length>0}});ne=D.markedBreaks(k),Ht="periods "+u.length+", breaks "+ne.length,h&&(f=K(l,_),o=Date.now()/1e3)}catch(l){a===B&&(Ht="error: "+String(l&&l.message).slice(0,40))}}function K(a,l){let _=[],u=Date.now()/1e3,m=Et(a,Lt);for(let y of X(a,"Period")){let k=l+(zt(y.getAttribute("start"))||0);J(y).forEach((w,E)=>{let F=X(w.set,"SegmentTemplate")[0]||X(w.rep,"SegmentTemplate")[0];if(!F||!X(F,"SegmentTimeline")[0])return;let I=Et(w.rep,Et(w.set,Et(y,m)));for(let P of ce(w.set,I,u-k,w.rep)){let j=k+P.time;_.push({time:j,duration:P.duration,url:P.url,height:E,key:E+" "+j})}})}return _}function J(a){let l=new Map;for(let _ of X(a,"AdaptationSet"))if(!(_.getAttribute("contentType")!=="video"&&!/^video\//.test(_.getAttribute("mimeType")||"")))for(let u of X(_,"Representation")){let m=Number(u.getAttribute("bandwidth")),y=Number(u.getAttribute("height")||_.getAttribute("height"));if(!(m>0)||!D.BLACKS[y])continue;let k=l.get(y);(!k||m<Number(k.rep.getAttribute("bandwidth")))&&l.set(y,{set:_,rep:u})}return l}async function bt(a,l){let _=new AbortController,u=setTimeout(()=>_.abort(),se);try{let m={credentials:"omit",signal:_.signal};l!==null&&(m.headers={Range:"bytes=0-"+(l-1)});let y=await fetch(a,m);if(!y.ok)return"http "+y.status;let k=new Uint8Array(await y.arrayBuffer());return l!==null&&k.length>l?k.subarray(0,l):k}catch(m){return String(m&&m.name||"error")}finally{clearTimeout(u)}}async function Mt(a){let l=await bt(a.url,L?null:je);if(typeof l=="string")return l;let _=D.moofEnd(l);if(_===null)return"no header";if(_>l.length&&(l=await bt(a.url,_)),typeof l=="string")return l;let u=D.frameSizes(l);return u===null||u.length===0?"no frames":D.separatorEnds(u,a.time,a.duration/u.length,D.BLACKS[a.height])}async function Ie(a,l){if(L||a.length===0||!l.every(y=>y==="TypeError"))return!1;let _=a.filter(y=>y.height===Ct).pop(),u=_?await bt(_.url,null):"none",m=typeof u=="string"?u:await bt(_.url,je);return typeof u!="string"&&m==="TypeError"}function Li(a){if(a===void 0)return!1;let l=a.times-dt;return l<0||l<Ge&&Date.now()/1e3-a.at>=Nt*2**l}async function Oi(a,l,_){let u=a-Pe,y=f.reduce((P,j)=>Math.max(P,j.time+j.duration),-1/0)+(Date.now()/1e3-o)-ui,k=Math.min(l-hi,y,a+Pe),w=f.filter(P=>(!L||P.height===Ct)&&P.time+P.duration>u&&P.time<k&&(!d.has(P.key)||Li(p.get(P.key)))),E=await U(w,L?Ve:qe,Mt);if(_!==B)return;let F=await Ie(w,E);if(_!==B)return;if(F){L=!0,T+=w.length,C="TypeError",b="segments "+d.size+", whole "+Ct+"p next, failed "+T+" ("+C+")";return}w.forEach((P,j)=>{let Y=typeof E[j]=="string";Y?(p.set(P.key,{times:(p.has(P.key)?p.get(P.key).times:0)+1,at:Date.now()/1e3}),T++,C=E[j]):p.delete(P.key),d.set(P.key,{time:P.time,ends:Y?[]:E[j]})});for(let P of Array.from(d.keys()))d.get(P).time>=a-2*Pe||(d.delete(P),p.delete(P));let I=[];for(let P of d.values())for(let j of P.ends)I.push(j);v=D.separatedBreaks(I),b="segments "+d.size+(L?" whole "+Ct+"p":"")+", blacks "+I.length+", breaks "+v.length+(T>0?", failed "+T+" ("+C+")":"")}async function We(a,l,_){let u=[];for(let w=a;w<=l;w+=4)(!ht.has(w)||pt.has(w)&&pt.get(w)<dt)&&u.push(w);if(u.length===0)return;let m=nt,y=mt,k=await U(u,4,async w=>{if(_!==B)return null;let E=await wt(y+"/"+w,lt,xt);if(E===null)return null;let F=le(E,lt,0);return[D.score(m,F),m.lower?D.score(m.lower,F):null]});_!==B||m!==nt||u.forEach((w,E)=>{k[E]===null?pt.set(w,(pt.get(w)||0)+1):pt.delete(w),ht.set(w,k[E]===null?m.usual:k[E][0]),m.lower&&St.set(w,k[E]===null?m.lower.usual:k[E][1])})}async function pi(a,l){let _=mt;return(await U(a,4,async u=>{if(l!==B)return null;let m=await wt(_+"/"+u,lt,xt);return m===null?null:le(m,lt,0)})).filter(u=>u!==null)}function _i(a){if(a.length===0)return null;let l=D.track(a.length,lt,xt);return a.forEach((_,u)=>l.add(u,_)),l.logo()}async function Ui(a,l,_){let u=[];for(let w=a-1200;w<=Math.min(l,a+1200);w+=28)u.push(w);let m=await pi(u,_);if(_!==B)return;if(m.length===0){fi(a);return}let y=_i(m);y!==null&&y.channel&&ge.set(mt,D.alone(y));let k=null;if(y===null){let w=ge.get(mt);if(w&&D.seenIn(w,m,.4))k=w;else if(me!==mt){let E=await Di(a,_);if(_!==B)return;E!==null&&(ge.set(mt,E),D.seenIn(E,m,.4)&&(k=E))}}Bt=a,nt=k||y,ht=new Map,St=new Map,pt=new Map,re=nt===null?"none in "+m.length+" pictures":"strength "+Math.round(nt.strength)+(nt.lower?", lower one "+Math.round(nt.lower.strength):"")+(k!==null?", kept":""),nt===null?fi(a):At=0}function fi(a){Bt=a-900+Math.min(900,120*2**At),120*2**At<900&&At++}async function Di(a,l){let _=null;for(let u=0;u<3;u++){let m=a-1200-u*2*1200,y=[];for(let E=m-2*1200;E<m;E+=28)y.push(E);let k=await pi(y,l);if(l!==B)return null;if(k.length===0){if(u===0)return null;break}let w=_i(k);if(w!==null&&w.channel){_=D.alone(w);break}}return me=mt,_}function gi(a){let l=a;for(;ht.has(l-4);)l-=4;let _=[],u=[];for(let y=l;ht.has(y);y+=4)_.push(ht.get(y)),nt.lower&&u.push(St.has(y)?St.get(y):nt.lower.usual);let m=_.map(()=>!0);return{first:l,gone:D.gone(_,nt.usual,m),lowerGone:nt.lower?D.gone(u,nt.lower.usual,m):null}}async function Fi(a,l,_){let u=Math.floor(a/4)*4,m=Math.floor((l-12)/4)*4;if(u>m)return;let y=Math.abs(u-Bt),k=Wt.some(E=>E[0]<=u&&u<=E[1])&&y<=900+D.LOGO_MAX_S;if(y>900&&!k&&await Ui(u,m,_),nt===null||_!==B)return;await We(u-64,Math.min(m,u+88),_);for(let E=0;E<4;E++){if(_!==B||!ht.has(u))return;let F=gi(u),I=F.gone.length,P=F.first+I*4,j=D.runs(D.solid(F.gone),D.BRIDGE).concat(F.lowerGone?D.runs(D.solid(F.lowerGone),D.BRIDGE):[]),Y=j.some(q=>q[1]+D.AROUND>=I&&(I-q[0])*4<=ft),M=(u-F.first)/4,H=j.some(q=>q[0]<D.AROUND&&q[1]>=M&&(q[1]+1)*4<=ft);if(Y&&P<=m)await We(P,Math.min(m,P+120),_);else if(H&&F.first>u-ft)await We(F.first-120,F.first-4,_);else break}if(_!==B||nt===null||!ht.has(u))return;let w=gi(u);Wt=D.logoBreaks(w.gone,w.first,4,w.lowerGone);for(let E of Array.from(ht.keys()))E<u-gt&&ht.delete(E);for(let E of Array.from(St.keys()))E<u-gt&&St.delete(E);for(let E of Array.from(pt.keys()))E<u-gt&&pt.delete(E)}function Ke(){let a=c.liveRange(),l=c.currentTime();if(!a||typeof l!="number"||!isFinite(l)||!isFinite(a.end))return null;let _=c.absoluteTime(l),u=c.absoluteTime(a.end),m=Date.now()/1e3;return typeof _!="number"||typeof u!="number"||!(_>m-86400&&_<m+600)||!(u>=_)?null:{at:_,end:u}}async function Bi(a){if(oe!==a){oe=a;try{let l=Ke();if(l===null||l.end-l.at<=60)return;Date.now()-fe>=ee&&Lt&&(fe=Date.now(),await tt(a)),h&&a===B&&await Oi(l.at,l.end,a),mt!==null&&a===B&&await Fi(l.at,l.end,a)}catch(l){re="error: "+String(l&&l.message).slice(0,40)}finally{oe===a&&(oe=0)}}}function zi(){let a=null;try{let l=c.state();if(Vt!==null&&(l==="playing"||l==="paused")){let _=c.currentTime();if(Dt!==null&&l==="playing"){let m=Dt;Dt=null,m.mine===B&&G(m.url,m.name,m.mine)}let u=m=>[m[0],m[1]-32];if(Gt){if(!c.joining()){let m=Ke();if(m!==null){let y=I=>m.at>=I[0]&&m.at<I[1]-1&&I[1]<=m.end-2,k=Wt.map(u).map(I=>D.reachSeparated(I,v)),w=v.filter(y)[0],E=k.filter(I=>I[1]<=m.end-2),F=ne.filter(y)[0]||w&&[w[0],D.askedEnd(w,E)]||k.filter(y)[0];if(F){let I=c.mediaTime(F[1]);typeof I=="number"&&isFinite(I)&&I>_&&(a=I)}}Date.now()-Ae>=ie&&(Ae=Date.now(),Bi(B))}}else{let m=w=>_>=w[0]&&_<w[1]-1,y=Ut.filter(m)[0],k=y?[y[0],D.askedEnd(y,Ot.map(u))]:Ot.map(u).filter(m)[0];k&&(a=k[1])}}}catch{a=null}kt=a,ae=c.show(kt!==null)}function ji(){if(kt===null||!ae)return!1;let a=kt;return kt=null,ae=c.show(!1),c.seek(a),!0}function qi(){let a={live:Gt,offered:kt!==null,skip_to:kt};if(Gt){a.marked=Ht,a.logo=mt===null?"no pictures":re,a.found=Wt.length,h&&(a.separators=b);try{let l=Ke();a.clock=l===null?"none":Math.round(Date.now()/1e3-l.end)+" s behind at the live point"}catch{a.clock="error"}}else a.recording=yt,a.breaks=Ot.map(l=>[Math.round(l[0]),Math.round(l[1])]),a.separators=b,a.separated=Ut.map(l=>[Math.round(l[0]),Math.round(l[1])]);return a}return{load:A,tick:zi,skip:ji,report:qi}}var Ni="0.1.22";function is(){let c=navigator.userAgent||"",t=/Android|iPhone|iPad|iPod|Mobile/i.test(c),e=/wv|WebView/i.test(c)||window.navigator.standalone===!0;return t||e}var ss={fr:"Francais",fra:"Francais",fre:"Francais",en:"English",eng:"English",de:"Deutsch",deu:"Deutsch",ger:"Deutsch",es:"Espanol",spa:"Espanol",it:"Italiano",ita:"Italiano",pt:"Portugues",por:"Portugues",qaa:"Original",und:"Indefini",mul:"Multiple"};function $i(c){if(!c)return"Inconnu";let t=c.toLowerCase();return ss[t]||c.toUpperCase()}function ze(c){let t=c.split(":");if(t.length<2)return null;let e=t.slice(1).join(":");try{let i=e,s=e.length%4;s&&(i+="=".repeat(4-s));let n=atob(i.replace(/-/g,"+").replace(/_/g,"/"));return JSON.parse(n)}catch{return null}}var di=class extends te{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},panel:{type:Object},_channels:{type:Array},_loading:{type:Boolean},_error:{type:String},_playing:{type:Boolean},_selectedChannel:{type:Object},_streamData:{type:Object},_isFullscreen:{type:Boolean},_playerError:{type:String},_playerLoading:{type:Boolean},_currentTime:{type:Number},_duration:{type:Number},_volume:{type:Number},_muted:{type:Boolean},_paused:{type:Boolean},_audioTracks:{type:Array},_textTracks:{type:Array},_selectedAudioIndex:{type:Number},_selectedTextIndex:{type:Number},_isLive:{type:Boolean},_programStart:{type:Number},_programEnd:{type:Number},_showAudioMenu:{type:Boolean},_showTextMenu:{type:Boolean},_expandedChannels:{type:Object},_channelPrograms:{type:Object},_loadingPrograms:{type:Object},_searchQuery:{type:String},_searchResults:{type:Array},_searching:{type:Boolean},_showingSearch:{type:Boolean},_expandedResults:{type:Object},_resultEpisodes:{type:Object},_loadingEpisodes:{type:Object},_castTargets:{type:Array},_selectedTarget:{type:String},_activeTab:{type:String},_recordings:{type:Array},_loadingRecordings:{type:Boolean},_expandedRecordings:{type:Object},_recordingEpisodes:{type:Object},_loadingRecordingEpisodes:{type:Object},_castPlaying:{type:Boolean},_castTarget:{type:String},_castTitle:{type:String},_activeCasts:{type:Object},_focusedCastHost:{type:String},_localPlaybackInitiated:{type:Boolean},_localMinimized:{type:Boolean},_castMinimized:{type:Boolean},_castLoading:{type:Boolean},_tonightChannels:{type:Array},_loadingTonight:{type:Boolean},_episodePlaylist:{type:Array},_episodeIndex:{type:Number},_selectedEntityId:{type:String}}}static get styles(){return Ii`
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
    `}constructor(){super(),this._boundOnFullscreenChange=this._onFullscreenChange.bind(this),this._boundOnDocumentClick=this._onDocumentClick.bind(this),this._channels=[],this._loading=!0,this._error=null,this._playing=!1,this._selectedChannel=null,this._streamData=null,this._isFullscreen=!1,this._playerError=null,this._playerLoading=!1,this._player=null,this._entityUnsubscribe=null,this._showPlayOverlay=!1,this._adSkip=null,this._adOffer=!1,this._castSkipTo=null,this._currentTime=0,this._duration=0,this._volume=.5,this._muted=!1,this._paused=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._liveDelay=0,this._showAudioMenu=!1,this._showTextMenu=!1,this._updateInterval=null,this._expandedChannels={},this._channelPrograms={},this._loadingPrograms={},this._searchQuery="",this._searchResults=[],this._searching=!1,this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._searchToken=0,this._castTargets=[],this._isMobile=is(),this._selectedTarget=this._isMobile?"":"local",this._activeTab="live",this._recordings=[],this._loadingRecordings=!1,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castProgressInterval=null,this._castBasePosition=0,this._castPositionUpdatedAt=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._castMinimized=!1,this._castLoading=!1,this._tonightChannels=[],this._loadingTonight=!1,this._episodePlaylist=[],this._episodeIndex=-1,this._episodeParentTitle="",this._episodeIsRecording=!1,this._sessionId=this._generateSessionId(),this._selectedEntityId=localStorage.getItem("molotov_selected_entity")||""}_generateSessionId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"molotov-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10)}connectedCallback(){super.connectedCallback(),console.log(`[Molotov Panel] Connected - v${Ni}`),this._hasLoadedChannels=!1,document.addEventListener("fullscreenchange",this._boundOnFullscreenChange),document.addEventListener("click",this._boundOnDocumentClick)}disconnectedCallback(){if(super.disconnectedCallback(),this._playing){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"})}this._cleanupPlayer(),this._stopCastProgressUpdate(),document.removeEventListener("fullscreenchange",this._boundOnFullscreenChange),document.removeEventListener("click",this._boundOnDocumentClick),this._entityUnsubscribe&&(this._entityUnsubscribe(),this._entityUnsubscribe=null)}_onDocumentClick(t){t.composedPath().some(e=>e.classList?.contains("track-menu-container"))||(this._showAudioMenu=!1,this._showTextMenu=!1,this.requestUpdate())}updated(t){t.has("hass")&&this.hass&&(this._hasLoadedChannels||(this._hasLoadedChannels=!0,this._loadChannels()),this._syncWithEntity())}async _loadChannels(){this._loading=!0,this._error=null;try{let t=this._getEntityId();if(!t)throw new Error("Entite Molotov TV introuvable");console.log(`[Molotov Panel] Loading channels for ${t}`);let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"now_playing",media_content_type:"directory"});e&&e.children?(this._channels=e.children.map(i=>this._parseChannel(i)),console.log(`[Molotov Panel] Loaded ${this._channels.length} channels`),this._channels.length>0&&await this._fetchCastTargets(t,this._channels[0].mediaContentId)):this._channels=[],this._loading=!1}catch(t){console.error("[Molotov Panel] Failed to load channels:",t),this._error=t.message||"Erreur lors du chargement des chaines",this._loading=!1}}async _fetchCastTargets(t,e){try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:e,media_content_type:"program"});if(i&&i.children){let s=i.children.filter(n=>n.media_content_id.startsWith("cast:")).map(n=>({mediaContentId:n.media_content_id,title:n.title}));this._castTargets=s,this._isMobile&&s.length>0&&(!this._selectedTarget||this._selectedTarget==="local")&&(this._selectedTarget=s[0].mediaContentId),console.log(`[Molotov Panel] Found ${s.length} cast targets`)}}catch(i){console.error("[Molotov Panel] Failed to fetch cast targets:",i),this._castTargets=[]}}_handleTargetChange(t){let e=t.target.value;this._isMobile&&e==="local"||(this._selectedTarget=e,console.log(`[Molotov Panel] Selected target: ${this._selectedTarget}`))}_switchTab(t){this._activeTab=t,t==="recordings"&&this._recordings.length===0&&this._loadRecordings(),t==="tonight"&&this._tonightChannels.length===0&&this._loadTonight(),this.requestUpdate()}async _loadRecordings(){let t=this._getEntityId();if(!t)return;this._loadingRecordings=!0,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this.requestUpdate();try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"recordings",media_content_type:"directory"});i&&i.children?(this._recordings=i.children.map(s=>{let n=ze(s.media_content_id);return{mediaContentId:s.media_content_id,title:s.title,thumbnail:s.thumbnail,description:n?.desc||null,isFolder:!!n?.folder}}),console.log(`[Molotov Panel] Loaded ${this._recordings.length} recordings`)):this._recordings=[]}catch(i){console.error("[Molotov Panel] Failed to load recordings:",i),this._recordings=[]}this._loadingRecordings=!1,this.requestUpdate();let e=this._recordings.filter(i=>i.isFolder);e.length>0&&(await Promise.all(e.map(i=>this._fetchRecordingEpisodes(i))),this.requestUpdate())}async _loadTonight(){let t=this._getEntityId();if(t){this._loadingTonight=!0,this.requestUpdate();try{let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"tonight_epg",media_content_type:"directory"});if(e&&e.children&&e.children.length>0){let i=new Map;for(let n of e.children){if(!n.media_content_id.startsWith("tonight_program:"))continue;let r=n.media_content_id.split(":");if(r.length<6)continue;let g=r[1],S=decodeURIComponent(r[2]),N=decodeURIComponent(r[3]),W=parseInt(r[4])*1e3,O=parseInt(r[5])*1e3,ot=r.length>6?decodeURIComponent(r.slice(6).join(":")):"",rt=n.title;rt.startsWith("\u{1F534} ")&&(rt=rt.substring(3));let at=rt.match(/^\d{2}:\d{2}-\d{2}:\d{2}\s+(.+)$/);at&&(rt=at[1]);let ct={mediaContentId:n.media_content_id,title:rt,thumbnail:n.thumbnail,start:W,end:O,description:ot};i.has(g)||i.set(g,{id:g,name:S,thumbnail:N,programs:[]}),i.get(g).programs.push(ct)}let s=Array.from(i.values());for(let n of s)n.programs.sort((r,g)=>r.start-g.start);this._tonightChannels=s,console.log(`[Molotov Panel] Loaded tonight EPG for ${s.length} channels`)}else this._tonightChannels=[]}catch(e){console.error("[Molotov Panel] Failed to load tonight EPG:",e),this._tonightChannels=[]}this._loadingTonight=!1,this.requestUpdate()}}async _toggleRecordingExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedRecordings[i]){this._expandedRecordings={...this._expandedRecordings,[i]:!1},this.requestUpdate();return}if(!e.isFolder){await this._playRecordingDirectly(e);return}this._recordingEpisodes[i]||await this._fetchRecordingEpisodes(e);let s=this._recordingEpisodes[i]||[];if(s.length===0){console.log("[Molotov Panel] No episodes found, playing recording directly"),await this._playRecordingDirectly(e);return}if(s.length===1){console.log("[Molotov Panel] Only 1 episode found, playing it directly"),await this._playRecordingEpisode(s[0],e.title);return}this._expandedRecordings={...this._expandedRecordings,[i]:!0},this.requestUpdate()}async _playRecordingDirectly(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:"",currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=t.mediaContentId;i.startsWith("recording:")&&(i=i.substring(10));let s=this._buildPlayMediaId(`replay:${i}`);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:s,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play recording failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}async _fetchRecordingEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"recording"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._recordingEpisodes={...this._recordingEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for recording "${t.title}"`)}else this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch recording episodes:",s),this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!1},this.requestUpdate()}async _playRecordingEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._recordingEpisodes,!0),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play recording episode failed:",s),this._playerError=s.message||"Erreur de lecture",this._castLoading=!1}}}_buildPlayMediaId(t){if(this._selectedTarget==="local")return`play_local:${this._sessionId}:${t}`;let e=this._selectedTarget.split(":");if(e.length>=2){let i=e[1],s=e.length>=3&&e[2]!=="native"&&e[2]!=="custom"?"":e[2];return s?`cast:${i}:${s}:${t}`:`cast:${i}:${t}`}return`play_local:${t}`}_isLocalPlayback(){return this._selectedTarget==="local"}_parseEpisodeChildren(t){return t.filter(e=>e.media_content_id.startsWith("episode:")||e.media_content_id.startsWith("replay:")||e.media_content_id.startsWith("recording:")||e.can_play).map(e=>{let i=ze(e.media_content_id);return{mediaContentId:e.media_content_id,title:e.title,thumbnail:e.thumbnail,description:i?.desc||null}})}_initPlaybackFlags(){this._isLocalPlayback()?(this._localPlaybackInitiated=!0,this._localMinimized=!1):this._castLoading=!0}_parseChannel(t){let e=t.media_content_id,[i,s]=e.split("|"),n=null;if(s)try{let rt=s,at=s.length%4;at&&(rt+="=".repeat(4-at)),n=decodeURIComponent(escape(atob(rt.replace(/-/g,"+").replace(/_/g,"/"))))}catch{}let r=i.split(":"),g,S,N;r[0]==="program"?(g=r[1],S=r[2]?parseInt(r[2])*1e3:null,N=r[3]?parseInt(r[3])*1e3:null):r[0]==="live"&&(g=r[1]);let W=t.title.split(" - "),O=W[0],ot=W.slice(1).join(" - ")||"Direct";return{id:g,name:O,thumbnail:t.thumbnail,mediaContentId:i,currentProgram:{title:ot,description:n,start:S,end:N},nextProgram:null}}_getMolotovEntities(){return!this.hass||!this.hass.states?[]:Object.keys(this.hass.states).filter(t=>t.startsWith("media_player.molotov")).sort()}_getEntityId(){let t=this._getMolotovEntities();return t.length===0?null:t.length===1?t[0]:this._selectedEntityId&&t.includes(this._selectedEntityId)?this._selectedEntityId:t[0]}_handleEntityChange(t){let e=this._getEntityId();this._playing&&e&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState(),this._selectedEntityId=t.target.value,localStorage.setItem("molotov_selected_entity",this._selectedEntityId),this._hasLoadedChannels=!1,this._channels=[],this._recordings=[],this._tonightChannels=[],this._channelPrograms={},this._expandedChannels={},this._loadingPrograms={},this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._loadChannels()}async _toggleChannelExpand(t,e){t.stopPropagation();let i=e.id;if(this._expandedChannels[i]){this._expandedChannels={...this._expandedChannels,[i]:!1},this.requestUpdate();return}this._expandedChannels={...this._expandedChannels,[i]:!0},this._channelPrograms[i]||await this._fetchChannelPrograms(e),this.requestUpdate()}async _fetchChannelPrograms(t){let e=this._getEntityId();if(!e)return;let i=t.id;this._loadingPrograms={...this._loadingPrograms,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`channel:${i}`,media_content_type:"channel"});if(s&&s.children){let n=s.children.filter(r=>r.media_content_id.startsWith("replay:")).map(r=>this._parseReplayItem(r,t));this._channelPrograms={...this._channelPrograms,[i]:n}}}catch(s){console.error("[Molotov Panel] Failed to fetch channel replays:",s),this._channelPrograms={...this._channelPrograms,[i]:[]}}this._loadingPrograms={...this._loadingPrograms,[i]:!1},this.requestUpdate()}_parseReplayItem(t,e){let i=ze(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,channelName:e.name,description:i?.desc||null}}async _playReplay(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:t.channelName,currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play replay failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}_handleSearchInput(t){this._searchQuery=t.target.value}_handleSearchKeydown(t){t.key==="Enter"&&this._performSearch()}async _performSearch(){let t=this._searchQuery.trim();if(!t)return;let e=this._getEntityId();if(!e)return;let i=++this._searchToken;this._searching=!0,this._showingSearch=!0,this._searchResults=[],this._expandedResults={},this._resultEpisodes={},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`search:${encodeURIComponent(t)}`,media_content_type:"search"});if(i!==this._searchToken)return;if(s&&s.children){let n=s.children.filter(g=>g.media_content_id.startsWith("search_result:")).map(g=>this._parseSearchResult(g)),r=await this._filterResultsWithEpisodes(n,e,i);if(i!==this._searchToken)return;this._searchResults=r,console.log(`[Molotov Panel] Found ${this._searchResults.length} results with episodes for "${t}"`)}else this._searchResults=[]}catch(s){if(i!==this._searchToken)return;console.error("[Molotov Panel] Search failed:",s),this._searchResults=[]}i===this._searchToken&&(this._searching=!1,this.requestUpdate())}async _filterResultsWithEpisodes(t,e,i){let s=t.map(async r=>{try{let g=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:r.mediaContentId,media_content_type:"search_result"});if(g&&g.children){let S=this._parseEpisodeChildren(g.children);if(S.length>0)return(i===void 0||i===this._searchToken)&&(this._resultEpisodes={...this._resultEpisodes,[r.mediaContentId]:S}),r}return null}catch(g){return console.error(`[Molotov Panel] Failed to check episodes for "${r.title}":`,g),null}});return(await Promise.all(s)).filter(r=>r!==null)}_parseSearchResult(t){let e=ze(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,mediaClass:t.media_class,description:e?.desc||null}}_clearSearch(){this._searchToken++,this._searchQuery="",this._searchResults=[],this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this.requestUpdate()}async _toggleResultExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedResults[i]){this._expandedResults={...this._expandedResults,[i]:!1},this.requestUpdate();return}this._expandedResults={...this._expandedResults,[i]:!0},this._resultEpisodes[i]||await this._fetchResultEpisodes(e),this.requestUpdate()}async _fetchResultEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingEpisodes={...this._loadingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"search_result"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._resultEpisodes={...this._resultEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for "${t.title}"`)}else this._resultEpisodes={...this._resultEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch episodes:",s),this._resultEpisodes={...this._resultEpisodes,[i]:[]}}this._loadingEpisodes={...this._loadingEpisodes,[i]:!1},this.requestUpdate()}_setEpisodePlaylist(t,e,i,s){for(let n of Object.values(i)){let r=n.findIndex(g=>g.mediaContentId===t.mediaContentId);if(r!==-1){this._episodePlaylist=n,this._episodeIndex=r,this._episodeParentTitle=e,this._episodeIsRecording=s;return}}this._episodePlaylist=[],this._episodeIndex=-1}async _playEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._resultEpisodes,!1),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play episode failed:",s),this._playerError=s.message||"Erreur de lecture"}}}_syncWithEntity(){let t=this._getEntityId();if(!t||!this.hass?.states?.[t])return;let e=this.hass.states[t],s=(e.attributes.local_streams||{})[this._sessionId];if(s&&s.url&&this._localPlaybackInitiated){let n=s.url,r=s.drm,g=s.selected_track;if(!this._playing||this._currentStreamUrl!==n){this._currentStreamUrl=n,this._streamData={url:n,drm:r,selectedTrack:g,title:e.attributes.media_title||"En direct",breakSearch:{live_thumbnails_url:s.live_thumbnails_url,recording:s.recording,separated_breaks:s.separated_breaks}},this._playing=!0,this._localMinimized=!1,this._playerError=null,this._playerLoading=!0;let S=this._selectedChannel;S?.currentProgram?.start&&S?.currentProgram?.end?(this._isLive=!0,this._programStart=S.currentProgram.start,this._programEnd=S.currentProgram.end):(this._isLive=!0,this._programStart=null,this._programEnd=null),this.updateComplete.then(()=>this._initDashPlayer())}}else this._playing&&(this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1);if(e.attributes.active_casts&&Object.keys(e.attributes.active_casts).length>0){let n=e.attributes.active_casts,r=e.attributes.cast_target;this._activeCasts=n,this._focusedCastHost=r||null;let g=r?n[r]?.skip_to:null;this._castSkipTo=typeof g=="number"?g:null,(!this._castPlaying||this._castTarget!==r)&&(this._castPlaying=!0,this._castMinimized=this._isMobile,this._castLoading=!1,this._castTarget=r,this._castTitle=e.attributes.media_title||"En cours de lecture",this._startCastProgressUpdate(),console.log("[Molotov Panel] Cast playback detected:",r,"total casts:",Object.keys(n).length)),this._castPositionUpdatedAt=e.attributes.media_position_updated_at?new Date(e.attributes.media_position_updated_at).getTime()/1e3:null,this._castBasePosition=e.attributes.media_position||0,this._duration=e.attributes.media_duration||0,this._volume=e.attributes.volume_level??.5,this._muted=e.attributes.is_volume_muted||!1,this._paused=e.state==="paused",this._castTitle=e.attributes.media_title||this._castTitle,this._isLive=e.attributes.is_live||!1}else this._castPlaying&&(this._onPlaybackEnded()||(this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._castMinimized=!1,this._castLoading=!1,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate()))}async _playChannel(t){let e=this._getEntityId();if(!e){console.error("[Molotov Panel] No entity found");return}this._selectedChannel=t,this._playerError=null,this._episodePlaylist=[],this._episodeIndex=-1,this._initPlaybackFlags(),this._isLocalPlayback()&&t.currentProgram?.start&&t.currentProgram?.end&&(this._programStart=t.currentProgram.start,this._programEnd=t.currentProgram.end,this._isLive=!0);try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}async _initDashPlayer(){if(!this._streamData)return;let t=this.shadowRoot.querySelector("video");if(!t){console.error("[Molotov Panel] Video element not found");return}window.dashjs||await this._loadDashJs(),this._player&&(this._player.reset(),this._player=null),this._adSkip=null,this._adOffer=!1,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null);try{let e=window.dashjs.MediaPlayer().create();this._player=e,e.updateSettings({debug:{logLevel:window.dashjs.Debug.LOG_LEVEL_WARNING},streaming:{buffer:{stableBufferTime:6,bufferTimeAtTopQuality:30,bufferTimeAtTopQualityLongForm:60},delay:{liveDelay:3}}});let i=this._streamData.drm;i&&i.type==="widevine"&&(console.log("[Molotov Panel] Configuring Widevine DRM"),e.setProtectionData({"com.widevine.alpha":{serverURL:i.license_url,httpRequestHeaders:i.headers||{}}})),e.initialize(t,this._streamData.url,!0),this._adSkip=Ri(this._adSkipEnv(t,e));let s=this._streamData.selectedTrack,n="fr";s?.track_audio&&(n=s.track_audio),e.setInitialMediaSettingsFor("audio",{lang:n}),s?.track_text&&e.setInitialMediaSettingsFor("text",{lang:s.track_text}),e.on(window.dashjs.MediaPlayer.events.ERROR,r=>{let g=r.error?.message||r.error||"Erreur de lecture";console.error("[Molotov Panel] Player error:",g),this._playerError=g,this._playerLoading=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.STREAM_INITIALIZED,()=>{console.log("[Molotov Panel] Stream initialized"),this._player===e&&this._adSkip&&this._adSkip.load({contentId:this._streamData.url},this._streamData.breakSearch),this._enforceAudioLanguage(e,s),this._updateTracks(),this._startProgressUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_STARTED,()=>{console.log("[Molotov Panel] Playback started"),this._showPlayOverlay=!1,this._playerLoading=!1,this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PAUSED,()=>{this._paused=!0,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PLAYING,()=>{this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_ENDED,()=>{console.log("[Molotov Panel] Playback ended"),this._onPlaybackEnded()}),t.volume=this._volume,t.muted=this._muted,this._autoplayCheckTimeout=setTimeout(()=>{this._autoplayCheckTimeout=null,t.paused&&!t.currentTime&&(console.log("[Molotov Panel] Autoplay blocked"),this._showPlayOverlay=!0,this.requestUpdate())},1500)}catch(e){console.error("[Molotov Panel] Failed to init player:",e),this._playerError=e.message}}_adSkipEnv(t,e){let i=()=>{try{let s=e.timeAsUTC();return typeof s=="number"&&isFinite(s)?s:null}catch{return null}};return{isLive:()=>{try{return e.isDynamic()}catch{return!1}},joining:()=>this._playerLoading,state:()=>t.paused?"paused":t.readyState>=2?"playing":"other",currentTime:()=>t.currentTime,liveRange:()=>t.seekable&&t.seekable.length?{start:t.seekable.start(0),end:t.seekable.end(t.seekable.length-1)}:null,absoluteTime:s=>{let n=i();return n===null?null:n+(s-t.currentTime)},mediaTime:s=>{let n=i();return n===null?null:t.currentTime+(s-n)},show:s=>(this._adOffer!==s&&(this._adOffer=s,this.requestUpdate()),s),seek:s=>{t.currentTime=s}}}_startProgressUpdate(){this._updateInterval&&clearInterval(this._updateInterval),this._updateInterval=setInterval(()=>{this._updateProgress()},1e3)}_updateProgress(){let t=this.shadowRoot?.querySelector("video");if(!(!t||!this._player)){if(this._currentTime=t.currentTime,this._duration=t.duration||0,this._paused=t.paused,this._adSkip&&this._adSkip.tick(),this._isLive&&t.seekable&&t.seekable.length>0){let e=t.seekable.end(t.seekable.length-1);this._liveDelay=Math.max(0,(e-t.currentTime)*1e3)}this.requestUpdate()}}_startCastProgressUpdate(){this._stopCastProgressUpdate(),this._castProgressInterval=setInterval(()=>{this._updateCastProgress()},1e3)}_stopCastProgressUpdate(){this._castProgressInterval&&(clearInterval(this._castProgressInterval),this._castProgressInterval=null)}_updateCastProgress(){if(!this._castPlaying){this._stopCastProgressUpdate();return}if(this._castBasePosition!=null&&this._castPositionUpdatedAt&&!this._paused){let t=Date.now()/1e3,e=Math.max(0,t-this._castPositionUpdatedAt);this._currentTime=this._castBasePosition+e}else this._currentTime=this._castBasePosition||0;this.requestUpdate()}_updateTracks(){if(!this._player)return;let t=this._player.getTracksFor("audio")||[];this._audioTracks=t.map((n,r)=>({index:r,lang:n.lang,label:$i(n.lang)}));let e=this._player.getCurrentTrackFor("audio");e&&(this._selectedAudioIndex=t.findIndex(n=>n.index===e.index));let i=this._player.getTracksFor("text")||[];if(this._textTracks=i.map((n,r)=>({index:r,lang:n.lang,label:$i(n.lang)})),!this._player.isTextEnabled())this._selectedTextIndex=-1;else{let n=this._player.getCurrentTrackFor("text");n&&(this._selectedTextIndex=i.findIndex(r=>r.index===n.index))}console.log("[Molotov Panel] Audio tracks:",this._audioTracks),console.log("[Molotov Panel] Text tracks:",this._textTracks),this.requestUpdate()}_enforceAudioLanguage(t,e){let i=t.getTracksFor("audio");if(!i||i.length===0)return;let n=t.getCurrentTrackFor("audio")?.lang||"",r="fr";if(e?.track_audio&&(r=e.track_audio),n!==r&&n!=="fra"&&n!=="fre"){let g=i.find(S=>S.lang===r||S.lang==="fra"||S.lang==="fre");!g&&(n==="en"||n==="eng"||n==="qaa")&&(g=i.find(S=>S.lang!=="en"&&S.lang!=="eng"&&S.lang!=="qaa")),g&&(console.log("[Molotov Panel] Switching audio to:",g.lang),t.setCurrentTrack(g))}}_loadDashJs(){return new Promise((t,e)=>{if(window.dashjs){t();return}let i=document.createElement("script");i.src="https://cdn.dashjs.org/v4.7.4/dash.all.min.js",i.crossOrigin="anonymous",i.onload=()=>{console.log("[Molotov Panel] dash.js loaded"),t()},i.onerror=()=>{e(new Error("Failed to load dash.js"))},document.head.appendChild(i)})}_cleanupPlayer(){if(this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null),this._player){try{this._player.reset()}catch{}this._player=null}this._adSkip=null,this._adOffer=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._playerLoading=!1}_stopPlayback(){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState()}_resetLocalPlaybackState(){this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._selectedChannel=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._episodePlaylist=[],this._episodeIndex=-1}_onPlaybackEnded(){if(this._episodePlaylist.length===0||this._episodeIndex<0)return!1;let t=this._episodeIndex+1;if(t>=this._episodePlaylist.length)return this._episodePlaylist=[],this._episodeIndex=-1,!1;let e=this._episodePlaylist[t];return this._episodeIndex=t,console.log(`[Molotov Panel] Auto-playing next episode: ${e.title}`),this._episodeIsRecording?this._playRecordingEpisode(e,this._episodeParentTitle):this._playEpisode(e,this._episodeParentTitle),!0}_goBackFromPlayer(){this._localMinimized=!0,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null)}_goBackFromCast(){this._castMinimized=!0}_expandCurrentPlayback(){this._playing&&this._streamData?(this._localMinimized=!1,this._updateInterval||this._startProgressUpdate()):this._castPlaying&&(this._castMinimized=!1)}_togglePlayPause(){let t=this.shadowRoot.querySelector("video");t&&(t.paused?t.play():t.pause())}_localSeek(t){let e=this.shadowRoot.querySelector("video");if(!e)return;if(t===null){e.currentTime=0;return}let i=e.currentTime+t;e.currentTime=Math.max(0,Math.min(e.duration||1/0,i))}_localSeekBeginning(){this._localSeek(null)}_localSkipBack30(){this._localSeek(-30)}_localSkipBack10(){this._localSeek(-10)}_localSkipForward30(){this._localSeek(30)}_localSkipAd(){this._adSkip&&this._adSkip.skip()}_handleProgressClick(t){let i=t.currentTarget.getBoundingClientRect(),s=(t.clientX-i.left)/i.width;if(this._isLive&&this._programStart&&this._programEnd){if(this._player?.getDVRSeekOffset?.(0)!==void 0){let r=this._player.duration(),g=s*r;this._player.seek(g)}}else if(this._duration){let n=this.shadowRoot.querySelector("video");n&&(n.currentTime=s*this._duration)}}_handleVolumeChange(t){let e=parseFloat(t.target.value);this._volume=e;let i=this.shadowRoot.querySelector("video");i&&(i.volume=e,i.muted=e===0,this._muted=e===0)}_toggleMute(){let t=this.shadowRoot.querySelector("video");t&&(this._muted=!this._muted,t.muted=this._muted,this.requestUpdate())}_selectAudioTrack(t){if(!this._player||t<0||t>=this._audioTracks.length)return;let e=this._player.getTracksFor("audio");e&&e[t]&&(this._player.setCurrentTrack(e[t]),this._selectedAudioIndex=t),this._showAudioMenu=!1,this.requestUpdate()}_selectTextTrack(t){if(this._player){if(t===-1)this._player.enableText(!1),this._selectedTextIndex=-1;else if(t>=0&&t<this._textTracks.length){let e=this._player.getTracksFor("text");e&&e[t]&&(this._player.enableText(!0),this._player.setCurrentTrack(e[t]),this._selectedTextIndex=t)}this._showTextMenu=!1,this.requestUpdate()}}_toggleAudioMenu(t){t.stopPropagation(),this._showAudioMenu=!this._showAudioMenu,this._showTextMenu=!1,this.requestUpdate()}_toggleTextMenu(t){t.stopPropagation(),this._showTextMenu=!this._showTextMenu,this._showAudioMenu=!1,this.requestUpdate()}_toggleFullscreen(){let t=this.shadowRoot.querySelector(".video-wrapper");t&&(document.fullscreenElement?document.exitFullscreen():t.requestFullscreen().catch(e=>{console.error("[Molotov Panel] Fullscreen error:",e)}))}_onFullscreenChange(){this._isFullscreen=!!document.fullscreenElement,this.requestUpdate()}_handlePlayOverlayClick(){let t=this.shadowRoot.querySelector("video");t&&(t.muted=!1,t.play().catch(e=>console.error("[Molotov Panel] Manual play error:",e)),this._showPlayOverlay=!1,this.requestUpdate())}_formatTime(t){if(!t||!isFinite(t))return"00:00";let e=Math.floor(t/3600),i=Math.floor(t%3600/60),s=Math.floor(t%60);return e>0?`${e}:${i.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`:`${i}:${s.toString().padStart(2,"0")}`}_formatClockTime(t){return t?new Date(t).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):""}_getProgressPercent(){if(this._isLive&&this._programStart&&this._programEnd){let t=Date.now()-(this._liveDelay||0),e=this._programEnd-this._programStart;if(e<=0)return 100;let i=t-this._programStart;return Math.min(100,Math.max(0,i/e*100))}else if(this._duration>0&&isFinite(this._duration))return this._currentTime/this._duration*100;return 0}render(){let t=this._playing&&this._streamData,e=t&&!this._localMinimized,i=this._castPlaying&&!this._castMinimized,s=!e&&!i;return x`
      ${t?x`
        <div style="${this._localMinimized?"position:fixed;left:-9999px;width:1px;height:1px;overflow:hidden;":"height:100%;"}">
          ${this._renderPlayer()}
        </div>
      `:""}
      ${i?this._renderCastPlayer():""}
      ${s?this._renderChannelList():""}
    `}_renderChannelList(){return x`
      <div class="container">
        <div class="header">
          <h1>Molotov TV</h1>
          <div class="header-actions">
            ${this._getMolotovEntities().length>1?x`
              <select class="cast-select" @change=${this._handleEntityChange} .value=${this._getEntityId()}>
                ${this._getMolotovEntities().map(t=>x`
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
              ${this._isMobile?"":x`<option value="local">Cet appareil</option>`}
              ${this._castTargets.map(t=>x`
                  <option value=${t.mediaContentId}>${t.title}</option>
                `)}
            </select>
          </div>
        </div>

        ${this._castLoading?x`
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
    `}_handleRefresh(){this._activeTab==="live"?this._loadChannels():this._activeTab==="tonight"?this._loadTonight():this._loadRecordings()}_renderChannels(){return x`
      <div class="content">
        ${this._loading?x`<div class="loading">Chargement des chaines...</div>`:this._error?x`
              <div class="error">
                <span>${this._error}</span>
                <button @click=${this._loadChannels}>Reessayer</button>
              </div>
            `:x`
              <div class="channel-list">
                ${this._channels.map(t=>this._renderChannelItem(t))}
              </div>
            `}
      </div>
    `}_renderRecordings(){return x`
      <div class="content">
        ${this._loadingRecordings?x`<div class="loading">Chargement des enregistrements...</div>`:this._recordings.length>0?x`
              <div class="channel-list">
                ${this._recordings.map(t=>this._renderRecordingItem(t))}
              </div>
            `:x`<div class="error">Aucun enregistrement trouve</div>`}
      </div>
    `}_renderTonight(){return x`
      <div class="content">
        ${this._loadingTonight?x`<div class="loading">Chargement du programme de ce soir...</div>`:this._tonightChannels.length>0?x`
              <div class="tonight-list">
                ${this._tonightChannels.map(t=>this._renderTonightChannel(t))}
              </div>
            `:x`<div class="error">Aucun programme disponible pour ce soir</div>`}
      </div>
    `}_renderTonightChannel(t){return x`
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
    `}_renderTonightProgram(t,e){let i=this._formatClockTime(t.start),s=this._formatClockTime(t.end),n=Date.now(),r=t.start<=n&&t.end>n,g=t.end<=n;return x`
      <div
        class="tonight-program ${r?"live":""} ${g?"past":""}"
        role="button"
        tabindex="0"
        @click=${()=>this._playTonightProgram(t,e)}
        @keydown=${S=>this._activateOnKey(S,()=>this._playTonightProgram(t,e))}
      >
        ${t.thumbnail?x`<img class="tonight-program-thumb" src=${t.thumbnail} loading="lazy" @load=${S=>S.target.style.display=""} @error=${S=>S.target.style.display="none"} />`:""}
        <div class="tonight-program-info">
          <div class="tonight-program-time">
            ${i} - ${s}
            ${r?x`<span class="live-indicator">EN DIRECT</span>`:""}
          </div>
          <div class="tonight-program-title">${t.title}</div>
          ${t.description?x`<div class="tonight-program-description">${t.description}</div>`:""}
        </div>
      </div>
    `}_activateOnKey(t,e){(t.key==="Enter"||t.key===" "||t.key==="Spacebar")&&(t.preventDefault(),e())}_tonightToProgramId(t){let e=t.split(":");return e[0]!=="tonight_program"||e.length<6?t:`program:${e[1]}:${e[4]}:${e[5]}`}async _playTonightProgram(t,e){let i=this._getEntityId();if(!i)return;this._episodePlaylist=[],this._episodeIndex=-1;let s=this._tonightToProgramId(t.mediaContentId);this._selectedChannel={id:e.id,name:e.name,thumbnail:e.thumbnail,mediaContentId:s,currentProgram:{title:t.title,start:t.start,end:t.end}},this._playerError=null;let n=Date.now();this._isLive=t.start<=n&&t.end>n,this._isLive?(this._programStart=t.start,this._programEnd=t.end):(this._programStart=null,this._programEnd=null),this._initPlaybackFlags();try{let r=this._buildPlayMediaId(s);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:r,media_content_type:"video"})}catch(r){console.error("[Molotov Panel] Play tonight program failed:",r),this._playerError=r.message||"Erreur de lecture",this._castLoading=!1}}_renderRecordingItem(t){let e=t.mediaContentId,i=this._expandedRecordings[e],s=this._recordingEpisodes[e]||[],n=this._loadingRecordingEpisodes[e],r=this._recordingEpisodes[e]!==void 0,g=!t.isFolder||r&&s.length<=1;return x`
      <div class="search-result-row">
        <div
          class="search-result-main"
          role="button"
          tabindex="0"
          @click=${S=>this._toggleRecordingExpand(S,t)}
          @keydown=${S=>this._activateOnKey(S,()=>this._toggleRecordingExpand(S,t))}
        >
          ${g?x`<ha-icon class="expand-icon" icon="mdi:play-circle-outline"></ha-icon>`:x`<ha-icon
                class="expand-icon ${i?"expanded":""}"
                icon="mdi:chevron-right"
              ></ha-icon>`}
          ${t.thumbnail?x`<img
                class="recording-thumb"
                src=${t.thumbnail}
                loading="lazy"
                @load=${S=>S.target.style.display=""} @error=${S=>S.target.style.display="none"}
              />`:x`<div class="recording-thumb"></div>`}
          <div class="recording-info">
            <div class="recording-title">${t.title}</div>
            ${t.description?x`<div class="recording-subtitle">${t.description}</div>`:""}
          </div>
        </div>
        ${i?x`
              <div class="episodes-list">
                ${n?x`<div class="episodes-loading">Chargement des episodes...</div>`:s.length>0?s.map(S=>x`
                        <div
                          class="episode-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playRecordingEpisode(S,t.title)}
                          @keydown=${N=>this._activateOnKey(N,()=>this._playRecordingEpisode(S,t.title))}
                        >
                          ${S.thumbnail?x`<img class="episode-thumb" src=${S.thumbnail} loading="lazy" @load=${N=>N.target.style.display=""} @error=${N=>N.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${S.title}</div>
                            ${S.description?x`<div class="episode-desc">${S.description}</div>`:""}
                          </div>
                        </div>
                      `):x`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderSearchResults(){return x`
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
        ${this._searching?x`<div class="loading">Recherche...</div>`:this._searchResults.length>0?x`
              <div class="channel-list">
                ${this._searchResults.map(t=>this._renderSearchResultItem(t))}
              </div>
            `:x`<div class="error">Aucun resultat trouve</div>`}
      </div>
    `}_renderSearchResultItem(t){let e=t.mediaContentId,i=this._expandedResults[e],s=this._resultEpisodes[e]||[],n=this._loadingEpisodes[e];return x`
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
          ${t.thumbnail?x`<img class="search-result-thumb" src=${t.thumbnail} loading="lazy" @load=${r=>r.target.style.display=""} @error=${r=>r.target.style.display="none"} />`:""}
          <div class="search-result-info">
            <div class="search-result-title">${t.title}</div>
            ${t.description?x`<div class="search-result-subtitle">${t.description}</div>`:""}
          </div>
        </div>
        ${i?x`
              <div class="episodes-list">
                ${n?x`<div class="episodes-loading">Chargement des episodes...</div>`:s.length>0?s.map(r=>x`
                        <div
                          class="episode-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playEpisode(r,t.title)}
                          @keydown=${g=>this._activateOnKey(g,()=>this._playEpisode(r,t.title))}
                        >
                          ${r.thumbnail?x`<img class="episode-thumb" src=${r.thumbnail} loading="lazy" @load=${g=>g.target.style.display=""} @error=${g=>g.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${r.title}</div>
                            ${r.description?x`<div class="episode-desc">${r.description}</div>`:""}
                          </div>
                        </div>
                      `):x`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderChannelItem(t){let e=t.currentProgram,i=e?.start?this._formatClockTime(e.start):"",s=e?.end?this._formatClockTime(e.end):"",n=i&&s?`${i} - ${s}`:"",r=this._expandedChannels[t.id],g=this._channelPrograms[t.id]||[],S=this._loadingPrograms[t.id];return x`
      <div class="channel-row">
        <div class="channel-main">
          <img
            class="channel-logo"
            src=${t.thumbnail||""}
            alt=${t.name}
            loading="lazy"
            @load=${N=>N.target.style.display=""} @error=${N=>N.target.style.display="none"}
            @click=${()=>this._playChannel(t)}
          />
          <div
            class="channel-info"
            role="button"
            tabindex="0"
            @click=${()=>this._playChannel(t)}
            @keydown=${N=>this._activateOnKey(N,()=>this._playChannel(t))}
          >
            <div class="channel-name">${t.name}</div>
            <div class="program-info">
              <div class="program-now">
                ${e?.title||"Direct"}
                ${n?x`<span class="program-time">(${n})</span>`:""}
              </div>
              ${e?.description?x`<div class="program-next">${e.description}</div>`:""}
            </div>
          </div>
          <div class="channel-actions">
            <button
              class="replay-btn ${r?"expanded":""}"
              @click=${N=>this._toggleChannelExpand(N,t)}
            >
              <ha-icon icon="mdi:history"></ha-icon>
              Replay
            </button>
          </div>
        </div>
        ${r?x`
              <div class="replay-list">
                ${S?x`<div class="replay-loading">Chargement...</div>`:g.length>0?g.map(N=>x`
                        <div
                          class="replay-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playReplay(N)}
                          @keydown=${W=>this._activateOnKey(W,()=>this._playReplay(N))}
                        >
                          ${N.thumbnail?x`<img class="replay-thumb" src=${N.thumbnail} loading="lazy" @load=${W=>W.target.style.display=""} @error=${W=>W.target.style.display="none"} />`:""}
                          <div class="replay-item-info">
                            <span class="replay-item-title">${N.title}</span>
                            ${N.description?x`<span class="replay-item-desc">${N.description}</span>`:""}
                          </div>
                        </div>
                      `):x`<div class="replay-empty">Aucun replay disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderMiniCastBar(){return x`
      <div class="mini-cast-bar">
        <div class="mini-cast-info">
          <ha-icon icon="mdi:cast-connected" style="--mdc-icon-size: 20px; color: var(--primary-color);"></ha-icon>
          <span class="mini-cast-title">${this._castTitle||"Chromecast"}</span>
        </div>
        <div class="mini-cast-controls">
          ${this._isLive?x`
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
    `}_renderPlayer(){let t=this._getProgressPercent(),e=this._selectedAudioIndex>=0&&this._audioTracks[this._selectedAudioIndex]?this._audioTracks[this._selectedAudioIndex].label:"Audio",i=this._selectedTextIndex>=0&&this._textTracks[this._selectedTextIndex]?this._textTracks[this._selectedTextIndex].label:"Off";return x`
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

            ${this._playerLoading?x`<div class="player-loading">
                  <div class="loading-spinner"></div>
                  <div class="loading-text">Chargement...</div>
                </div>`:""}

            ${this._playerError?x`<div class="player-error">${this._playerError}</div>`:""}

            ${this._showPlayOverlay?x`
                  <div class="play-overlay" @click=${this._handlePlayOverlayClick}>
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                `:""}

            <!-- Custom controls -->
            <div class="custom-controls ${this._paused?"":"autohide"}">
              <div class="progress-container">
                ${this._isLive&&this._programStart?x`<span>${this._formatClockTime(Date.now()-(this._liveDelay||0))}</span>`:x`<span>${this._formatTime(this._currentTime)}</span>`}
                <div class="progress-bar" @click=${this._handleProgressClick}>
                  <div class="progress-filled" style="width: ${t}%"></div>
                </div>
                ${this._isLive&&this._programEnd?x`<span>${this._formatClockTime(this._programEnd)}</span>`:x`<span>${this._formatTime(this._duration)}</span>`}
                ${this._isLive?x`<span class="live-badge">LIVE</span>`:""}
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
                  ${this._adOffer?x`<button class="icon-btn pubs-btn" @click=${this._localSkipAd}>
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
                  ${this._audioTracks.length>1?x`
                        <div class="track-menu-container">
                          <button class="icon-btn" @click=${this._toggleAudioMenu}>
                            <ha-icon icon="mdi:volume-source"></ha-icon>
                            <span style="font-size: 11px; margin-left: 2px;">${e}</span>
                          </button>
                          ${this._showAudioMenu?x`
                                <div class="track-menu">
                                  ${this._audioTracks.map(s=>x`
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

                  ${this._textTracks.length>0?x`
                        <div class="track-menu-container">
                          <button class="icon-btn" @click=${this._toggleTextMenu}>
                            <ha-icon icon="mdi:subtitles"></ha-icon>
                            <span style="font-size: 11px; margin-left: 2px;">${i}</span>
                          </button>
                          ${this._showTextMenu?x`
                                <div class="track-menu">
                                  <div
                                    class="track-menu-item ${this._selectedTextIndex===-1?"selected":""}"
                                    @click=${()=>this._selectTextTrack(-1)}
                                  >
                                    Off
                                  </div>
                                  ${this._textTracks.map(s=>x`
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
    `}_renderCastPlayer(){let t=this._getProgressPercent();return x`
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
                ${this._isLive&&this._programStart?x`<span>${this._formatClockTime(Date.now()-(this._liveDelay||0))}</span>`:x`<span>${this._formatTime(this._currentTime)}</span>`}
                <div class="progress-bar" @click=${this._handleCastSeek}>
                  <div class="progress-filled" style="width: ${t}%"></div>
                </div>
                ${this._isLive&&this._programEnd?x`<span>${this._formatClockTime(this._programEnd)}</span>`:x`<span>${this._formatTime(this._duration)}</span>`}
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
                  ${this._castSkipTo!==null?x`<button class="icon-btn pubs-btn" @click=${this._castSkipAd}>
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
    `}_renderMultiCastBar(){let t=Object.entries(this._activeCasts||{});return t.length<=1?"":x`
      <div class="multi-cast-bar">
        ${t.map(([e,i])=>{let s=e===this._focusedCastHost,n=i.title||e,r=i.state==="playing";return x`
            <div
              class="cast-chip ${s?"focused":""}"
              role="button"
              tabindex="0"
              @click=${()=>this._focusCast(e)}
              @keydown=${g=>this._activateOnKey(g,()=>this._focusCast(e))}
            >
              <span class="chip-icon">
                <ha-icon icon=${r?"mdi:cast-connected":"mdi:cast"} style="--mdc-icon-size: 18px;"></ha-icon>
              </span>
              <span>${n}</span>
              <span class="chip-stop" @click=${g=>this._stopSpecificCast(g,e)}>
                <ha-icon icon="mdi:close" style="--mdc-icon-size: 16px;"></ha-icon>
              </span>
            </div>
          `})}
      </div>
    `}async _focusCast(t){let e=this._getEntityId();if(!e)return;let i=this._activeCasts[t];if(!i)return;let s=t;try{await this.hass.callService("media_player","select_source",{entity_id:e,source:s}),this._focusedCastHost=t,this._castTarget=t,this._castTitle=i.title||"En cours de lecture",console.log("[Molotov Panel] Focused cast:",t)}catch(n){console.error("[Molotov Panel] Focus cast failed:",n)}}async _stopSpecificCast(t,e){t.stopPropagation();let i=this._getEntityId();if(!i||!this._activeCasts[e])return;let n=e;try{await this.hass.callService("media_player","select_source",{entity_id:i,source:n}),await new Promise(r=>setTimeout(r,200)),await this.hass.callService("media_player","media_stop",{entity_id:i}),console.log("[Molotov Panel] Stopped cast:",e)}catch(r){console.error("[Molotov Panel] Stop specific cast failed:",r)}}async _stopCastPlayback(){let t=this._getEntityId();if(t){try{await this.hass.callService("media_player","media_stop",{entity_id:t})}catch(e){console.error("[Molotov Panel] Stop cast failed:",e)}this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate(),this._castMinimized=!1,this._castLoading=!1,this._episodePlaylist=[],this._episodeIndex=-1}}async _toggleCastPlayPause(){let t=this._getEntityId();if(t)try{this._paused?await this.hass.callService("media_player","media_play",{entity_id:t}):await this.hass.callService("media_player","media_pause",{entity_id:t})}catch(e){console.error("[Molotov Panel] Play/pause cast failed:",e)}}async _castSkipForward(){let t=this._getEntityId();if(t)try{await this.hass.callService("media_player","media_next_track",{entity_id:t})}catch(e){console.error("[Molotov Panel] Skip forward failed:",e)}}_setCastPosition(t){this._currentTime=t,this._castBasePosition=t,this._castPositionUpdatedAt=Date.now()/1e3}async _castSeek(t){let e=this._getEntityId();if(e)try{await this.hass.callService("media_player","media_seek",{entity_id:e,seek_position:t}),this._setCastPosition(t)}catch(i){console.error("[Molotov Panel] Cast seek failed:",i)}}async _castSeekBeginning(){await this._castSeek(0)}async _castSkipBack30(){await this._castSeek(Math.max(0,this._currentTime-30))}async _castSkipBack10(){await this._castSeek(Math.max(0,this._currentTime-10))}async _castSkipAd(){this._castSkipTo!==null&&await this._castSeek(this._castSkipTo)}async _handleCastSeek(t){let e=this._getEntityId();if(!e||!this._duration)return;let s=t.currentTarget.getBoundingClientRect(),r=(t.clientX-s.left)/s.width*this._duration;try{await this.hass.callService("media_player","media_seek",{entity_id:e,seek_position:r}),this._setCastPosition(r)}catch(g){console.error("[Molotov Panel] Seek failed:",g)}}async _handleCastVolumeChange(t){let e=this._getEntityId();if(!e)return;let i=parseFloat(t.target.value);this._volume=i;try{await this.hass.callService("media_player","volume_set",{entity_id:e,volume_level:i})}catch(s){console.error("[Molotov Panel] Volume change failed:",s)}}async _toggleCastMute(){let t=this._getEntityId();if(t)try{await this.hass.callService("media_player","volume_mute",{entity_id:t,is_volume_muted:!this._muted}),this._muted=!this._muted}catch(e){console.error("[Molotov Panel] Mute toggle failed:",e)}}};customElements.define("molotov-panel",di);console.log(`[Molotov Panel] Registered - v${Ni}`);
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
