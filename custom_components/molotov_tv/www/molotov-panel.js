var Xe=typeof window<"u"&&window.customElements!=null&&window.customElements.polyfillWrapFlushCallback!==void 0;var Xt=(d,t,e=null)=>{for(;t!==e;){let i=t.nextSibling;d.removeChild(t),t=i}};var bt=`{{lit-${String(Math.random()).slice(2)}}}`,Qe=`<!--${bt}-->`,yi=new RegExp(`${bt}|${Qe}`),de="$lit$",Qt=class{constructor(t,e){this.parts=[],this.element=e;let i=[],s=[],n=document.createTreeWalker(e.content,133,null,!1),o=0,g=-1,S=0,{strings:N,values:{length:K}}=t;for(;S<K;){let L=n.nextNode();if(L===null){n.currentNode=s.pop();continue}if(g++,L.nodeType===1){if(L.hasAttributes()){let ot=L.attributes,{length:rt}=ot,at=0;for(let ct=0;ct<rt;ct++)bi(ot[ct].name,de)&&at++;for(;at-- >0;){let ct=N[S],Nt=Re.exec(ct)[2],ft=Nt.toLowerCase()+de,gt=L.getAttribute(ft);L.removeAttribute(ft);let dt=gt.split(yi);this.parts.push({type:"attribute",index:g,name:Nt,strings:dt}),S+=dt.length-1}}L.tagName==="TEMPLATE"&&(s.push(L),n.currentNode=L.content)}else if(L.nodeType===3){let ot=L.data;if(ot.indexOf(bt)>=0){let rt=L.parentNode,at=ot.split(yi),ct=at.length-1;for(let Nt=0;Nt<ct;Nt++){let ft,gt=at[Nt];if(gt==="")ft=Tt();else{let dt=Re.exec(gt);dt!==null&&bi(dt[2],de)&&(gt=gt.slice(0,dt.index)+dt[1]+dt[2].slice(0,-de.length)+dt[3]),ft=document.createTextNode(gt)}rt.insertBefore(ft,L),this.parts.push({type:"node",index:++g})}at[ct]===""?(rt.insertBefore(Tt(),L),i.push(L)):L.data=at[ct],S+=ct}}else if(L.nodeType===8)if(L.data===bt){let ot=L.parentNode;(L.previousSibling===null||g===o)&&(g++,ot.insertBefore(Tt(),L)),o=g,this.parts.push({type:"node",index:g}),L.nextSibling===null?L.data="":(i.push(L),g--),S++}else{let ot=-1;for(;(ot=L.data.indexOf(bt,ot+1))!==-1;)this.parts.push({type:"node",index:-1}),S++}}for(let L of i)L.parentNode.removeChild(L)}},bi=(d,t)=>{let e=d.length-t.length;return e>=0&&d.slice(e)===t},be=d=>d.index!==-1,Tt=()=>document.createComment(""),Re=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;var Je=133;function Ze(d,t){let{element:{content:e},parts:i}=d,s=document.createTreeWalker(e,Je,null,!1),n=ve(i),o=i[n],g=-1,S=0,N=[],K=null;for(;s.nextNode();){g++;let L=s.currentNode;for(L.previousSibling===K&&(K=null),t.has(L)&&(N.push(L),K===null&&(K=L)),K!==null&&S++;o!==void 0&&o.index===g;)o.index=K!==null?-1:o.index-S,n=ve(i,n),o=i[n]}N.forEach(L=>L.parentNode.removeChild(L))}var Gi=d=>{let t=d.nodeType===11?0:1,e=document.createTreeWalker(d,Je,null,!1);for(;e.nextNode();)t++;return t},ve=(d,t=-1)=>{for(let e=t+1;e<d.length;e++){let i=d[e];if(be(i))return e}return-1};function vi(d,t,e=null){let{element:{content:i},parts:s}=d;if(e==null){i.appendChild(t);return}let n=document.createTreeWalker(i,Je,null,!1),o=ve(s),g=0,S=-1;for(;n.nextNode();)for(S++,n.currentNode===e&&(g=Gi(t),e.parentNode.insertBefore(t,e));o!==-1&&s[o].index===S;){if(g>0){for(;o!==-1;)s[o].index+=g,o=ve(s,o);return}o=ve(s,o)}}var Hi=new WeakMap;var Jt=d=>typeof d=="function"&&Hi.has(d);var _t={},$e={};var Bt=class{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(let i of this.__parts)i!==void 0&&i.setValue(t[e]),e++;for(let i of this.__parts)i!==void 0&&i.commit()}_clone(){let t=Xe?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],i=this.template.parts,s=document.createTreeWalker(t,133,null,!1),n=0,o=0,g,S=s.nextNode();for(;n<i.length;){if(g=i[n],!be(g)){this.__parts.push(void 0),n++;continue}for(;o<g.index;)o++,S.nodeName==="TEMPLATE"&&(e.push(S),s.currentNode=S.content),(S=s.nextNode())===null&&(s.currentNode=e.pop(),S=s.nextNode());if(g.type==="node"){let N=this.processor.handleTextExpression(this.options);N.insertAfterNode(S.previousSibling),this.__parts.push(N)}else this.__parts.push(...this.processor.handleAttributeExpressions(S,g.name,g.strings,this.options));n++}return Xe&&(document.adoptNode(t),customElements.upgrade(t)),t}};var xi=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:d=>d}),Ki=` ${bt} `,$t=class{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){let t=this.strings.length-1,e="",i=!1;for(let s=0;s<t;s++){let n=this.strings[s],o=n.lastIndexOf("<!--");i=(o>-1||i)&&n.indexOf("-->",o+1)===-1;let g=Re.exec(n);g===null?e+=n+(i?Ki:Qe):e+=n.substr(0,g.index)+g[1]+g[2]+de+g[3]+bt}return e+=this.strings[t],e}getTemplateElement(){let t=document.createElement("template"),e=this.getHTML();return xi!==void 0&&(e=xi.createHTML(e)),t.innerHTML=e,t}};var Oe=d=>d===null||!(typeof d=="object"||typeof d=="function"),Ne=d=>Array.isArray(d)||!!(d&&d[Symbol.iterator]),he=class{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let s=0;s<i.length-1;s++)this.parts[s]=this._createPart()}_createPart(){return new xe(this)}_getValue(){let t=this.strings,e=t.length-1,i=this.parts;if(e===1&&t[0]===""&&t[1]===""){let n=i[0].value;if(typeof n=="symbol")return String(n);if(typeof n=="string"||!Ne(n))return n}let s="";for(let n=0;n<e;n++){s+=t[n];let o=i[n];if(o!==void 0){let g=o.value;if(Oe(g)||!Ne(g))s+=typeof g=="string"?g:String(g);else for(let S of g)s+=typeof S=="string"?S:String(S)}}return s+=t[e],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}},xe=class{constructor(t){this.value=void 0,this.committer=t}setValue(t){t!==_t&&(!Oe(t)||t!==this.value)&&(this.value=t,Jt(t)||(this.committer.dirty=!0))}commit(){for(;Jt(this.value);){let t=this.value;this.value=_t,t(this)}this.value!==_t&&this.committer.commit()}},Zt=class d{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(Tt()),this.endNode=t.appendChild(Tt())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=Tt()),t.__insert(this.endNode=Tt())}insertAfterPart(t){t.__insert(this.startNode=Tt()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(this.startNode.parentNode===null)return;for(;Jt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=_t,e(this)}let t=this.__pendingValue;t!==_t&&(Oe(t)?t!==this.value&&this.__commitText(t):t instanceof $t?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):Ne(t)?this.__commitIterable(t):t===$e?(this.value=$e,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){let e=this.startNode.nextSibling;t=t??"";let i=typeof t=="string"?t:String(t);e===this.endNode.previousSibling&&e.nodeType===3?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){let e=this.options.templateFactory(t);if(this.value instanceof Bt&&this.value.template===e)this.value.update(t.values);else{let i=new Bt(e,t.processor,this.options),s=i._clone();i.update(t.values),this.__commitNode(s),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());let e=this.value,i=0,s;for(let n of t)s=e[i],s===void 0&&(s=new d(this.options),e.push(s),i===0?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(n),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){Xt(this.startNode.parentNode,t.nextSibling,this.endNode)}},we=class{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,i.length!==2||i[0]!==""||i[1]!=="")throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;Jt(this.__pendingValue);){let e=this.__pendingValue;this.__pendingValue=_t,e(this)}if(this.__pendingValue===_t)return;let t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=_t}},Se=class extends he{constructor(t,e,i){super(t,e,i),this.single=i.length===2&&i[0]===""&&i[1]===""}_createPart(){return new Le(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}},Le=class extends xe{},wi=!1;(()=>{try{let d={get capture(){return wi=!0,!1}};window.addEventListener("test",d,d),window.removeEventListener("test",d,d)}catch{}})();var ke=class{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=s=>this.handleEvent(s)}setValue(t){this.__pendingValue=t}commit(){for(;Jt(this.__pendingValue);){let n=this.__pendingValue;this.__pendingValue=_t,n(this)}if(this.__pendingValue===_t)return;let t=this.__pendingValue,e=this.value,i=t==null||e!=null&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),s=t!=null&&(e==null||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=Yi(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=_t}handleEvent(t){typeof this.value=="function"?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}},Yi=d=>d&&(wi?{capture:d.capture,passive:d.passive,once:d.once}:d.capture);function ti(d){let t=te.get(d.type);t===void 0&&(t={stringsArray:new WeakMap,keyString:new Map},te.set(d.type,t));let e=t.stringsArray.get(d.strings);if(e!==void 0)return e;let i=d.strings.join(bt);return e=t.keyString.get(i),e===void 0&&(e=new Qt(d,d.getTemplateElement()),t.keyString.set(i,e)),t.stringsArray.set(d.strings,e),e}var te=new Map;var zt=new WeakMap,ei=(d,t,e)=>{let i=zt.get(t);i===void 0&&(Xt(t,t.firstChild),zt.set(t,i=new Zt(Object.assign({templateFactory:ti},e))),i.appendInto(t)),i.setValue(d),i.commit()};var Ue=class{handleAttributeExpressions(t,e,i,s){let n=e[0];return n==="."?new Se(t,e.slice(1),i).parts:n==="@"?[new ke(t,e.slice(1),s.eventContext)]:n==="?"?[new we(t,e.slice(1),i)]:new he(t,e,i).parts}handleTextExpression(t){return new Zt(t)}},ii=new Ue;typeof window<"u"&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var x=(d,...t)=>new $t(d,t,"html",ii);var ki=(d,t)=>`${d}--${t}`,De=!0;typeof window.ShadyCSS>"u"?De=!1:typeof window.ShadyCSS.prepareTemplateDom>"u"&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),De=!1);var Qi=d=>t=>{let e=ki(t.type,d),i=te.get(e);i===void 0&&(i={stringsArray:new WeakMap,keyString:new Map},te.set(e,i));let s=i.stringsArray.get(t.strings);if(s!==void 0)return s;let n=t.strings.join(bt);if(s=i.keyString.get(n),s===void 0){let o=t.getTemplateElement();De&&window.ShadyCSS.prepareTemplateDom(o,d),s=new Qt(t,o),i.keyString.set(n,s)}return i.stringsArray.set(t.strings,s),s},Ji=["html","svg"],Zi=d=>{Ji.forEach(t=>{let e=te.get(ki(t,d));e!==void 0&&e.keyString.forEach(i=>{let{element:{content:s}}=i,n=new Set;Array.from(s.querySelectorAll("style")).forEach(o=>{n.add(o)}),Ze(i,n)})})},Ei=new Set,ts=(d,t,e)=>{Ei.add(d);let i=e?e.element:document.createElement("template"),s=t.querySelectorAll("style"),{length:n}=s;if(n===0){window.ShadyCSS.prepareTemplateStyles(i,d);return}let o=document.createElement("style");for(let N=0;N<n;N++){let K=s[N];K.parentNode.removeChild(K),o.textContent+=K.textContent}Zi(d);let g=i.content;e?vi(e,o,g.firstChild):g.insertBefore(o,g.firstChild),window.ShadyCSS.prepareTemplateStyles(i,d);let S=g.querySelector("style");if(window.ShadyCSS.nativeShadow&&S!==null)t.insertBefore(S.cloneNode(!0),t.firstChild);else if(e){g.insertBefore(o,g.firstChild);let N=new Set;N.add(o),Ze(e,N)}},Pi=(d,t,e)=>{if(!e||typeof e!="object"||!e.scopeName)throw new Error("The `scopeName` option is required.");let i=e.scopeName,s=zt.has(t),n=De&&t.nodeType===11&&!!t.host,o=n&&!Ei.has(i),g=o?document.createDocumentFragment():t;if(ei(d,g,Object.assign({templateFactory:Qi(i)},e)),o){let S=zt.get(g);zt.delete(g);let N=S.value instanceof Bt?S.value.template:void 0;ts(i,g,N),Xt(t,t.firstChild),t.appendChild(g),zt.set(t,S)}!s&&n&&window.ShadyCSS.styleElement(t.host)};var Ti;window.JSCompiler_renameProperty=(d,t)=>d;var li={toAttribute(d,t){switch(t){case Boolean:return d?"":null;case Object:case Array:return d==null?d:JSON.stringify(d)}return d},fromAttribute(d,t){switch(t){case Boolean:return d!==null;case Number:return d===null?null:Number(d);case Object:case Array:return JSON.parse(d)}return d}},Ci=(d,t)=>t!==d&&(t===t||d===d),si={attribute:!0,type:String,converter:li,reflect:!1,hasChanged:Ci},ni=1,ri=4,oi=8,ai=16,ci="finalized",ue=class extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();let t=[];return this._classProperties.forEach((e,i)=>{let s=this._attributeNameForProperty(i,e);s!==void 0&&(this._attributeToPropertyMap.set(s,i),t.push(s))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;let t=Object.getPrototypeOf(this)._classProperties;t!==void 0&&t.forEach((e,i)=>this._classProperties.set(i,e))}}static createProperty(t,e=si){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;let i=typeof t=="symbol"?Symbol():`__${t}`,s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Object.defineProperty(this.prototype,t,s)}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){let n=this[t];this[e]=s,this.requestUpdateInternal(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||si}static finalize(){let t=Object.getPrototypeOf(this);if(t.hasOwnProperty(ci)||t.finalize(),this[ci]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){let e=this.properties,i=[...Object.getOwnPropertyNames(e),...typeof Object.getOwnPropertySymbols=="function"?Object.getOwnPropertySymbols(e):[]];for(let s of i)this.createProperty(s,e[s])}}static _attributeNameForProperty(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=Ci){return i(t,e)}static _propertyValueFromAttribute(t,e){let i=e.type,s=e.converter||li,n=typeof s=="function"?s:s.fromAttribute;return n?n(t,i):t}static _propertyValueToAttribute(t,e){if(e.reflect===void 0)return;let i=e.type,s=e.converter;return(s&&s.toAttribute||li.toAttribute)(t,i)}initialize(){this._updateState=0,this._updatePromise=new Promise(t=>this._enableUpdatingResolver=t),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){let i=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,i)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){this._enableUpdatingResolver!==void 0&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=si){let s=this.constructor,n=s._attributeNameForProperty(t,i);if(n!==void 0){let o=s._propertyValueToAttribute(e,i);if(o===void 0)return;this._updateState=this._updateState|oi,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._updateState=this._updateState&~oi}}_attributeToProperty(t,e){if(this._updateState&oi)return;let i=this.constructor,s=i._attributeToPropertyMap.get(t);if(s!==void 0){let n=i.getPropertyOptions(s);this._updateState=this._updateState|ai,this[s]=i._propertyValueFromAttribute(e,n),this._updateState=this._updateState&~ai}}requestUpdateInternal(t,e,i){let s=!0;if(t!==void 0){let n=this.constructor;i=i||n.getPropertyOptions(t),n._valueHasChanged(this[t],e,i.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),i.reflect===!0&&!(this._updateState&ai)&&(this._reflectingProperties===void 0&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,i))):s=!1}!this._hasRequestedUpdate&&s&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=this._updateState|ri;try{await this._updatePromise}catch{}let t=this.performUpdate();return t!=null&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return this._updateState&ri}get hasUpdated(){return this._updateState&ni}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1,e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(i){throw t=!1,this._markUpdated(),i}t&&(this._updateState&ni||(this._updateState=this._updateState|ni,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~ri}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){this._reflectingProperties!==void 0&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,i)=>this._propertyToAttribute(i,this[i],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}};Ti=ci;ue[Ti]=!0;var Ai=Element.prototype,tn=Ai.msMatchesSelector||Ai.webkitMatchesSelector;var Fe=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,di=Symbol(),Ee=class{constructor(t,e){if(e!==di)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return this._styleSheet===void 0&&(Fe?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}},Ii=d=>new Ee(String(d),di),es=d=>{if(d instanceof Ee)return d.cssText;if(typeof d=="number")return d;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${d}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`)},Mi=(d,...t)=>{let e=t.reduce((i,s,n)=>i+es(s)+d[n+1],d[0]);return new Ee(e,di)};(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");var Ri={},ee=class extends ue{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;let t=this.getStyles();if(Array.isArray(t)){let e=(n,o)=>n.reduceRight((g,S)=>Array.isArray(S)?e(S,g):(g.add(S),g),o),i=e(t,new Set),s=[];i.forEach(n=>s.unshift(n)),this._styles=s}else this._styles=t===void 0?[]:[t];this._styles=this._styles.map(e=>{if(e instanceof CSSStyleSheet&&!Fe){let i=Array.prototype.slice.call(e.cssRules).reduce((s,n)=>s+n.cssText,"");return Ii(i)}return e})}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){let t=this.constructor._styles;t.length!==0&&(window.ShadyCSS!==void 0&&!window.ShadyCSS.nativeShadow?window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(e=>e.cssText),this.localName):Fe?this.renderRoot.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):this._needsShimAdoptedStyleSheets=!0)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&window.ShadyCSS!==void 0&&window.ShadyCSS.styleElement(this)}update(t){let e=this.render();super.update(t),e!==Ri&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(i=>{let s=document.createElement("style");s.textContent=i.cssText,this.renderRoot.appendChild(s)}))}render(){return Ri}};ee.finalized=!0;ee.render=Pi;ee.shadowRootOptions={mode:"open"};var O=(()=>{function Lt(a,b){let p=[],r=0;for(;r<a.length;){if(!a[r]){r++;continue}let h=r,_=r+1;for(;_<a.length&&_-h<=b+1;)a[_]&&(h=_),_++;p.push([r,h]),r=h+1}return p}function Ve(a,b,p){let r=0;for(let v of a)v&&r++;if(!(p>0)||r*2<a.length)return null;let h=Lt(a,3).filter(v=>(v[1]-v[0]+1)*p>=60),_=[];for(let v=0;v+1<h.length;v++){let C=h[v],P=h[v+1],B=b+(C[1]+1)*p,$=b+P[0]*p,A=0;for(let U=C[1]+1;U<P[0];U++)a[U]&&A++;$-B>=150&&$-B<=800&&A*2<P[0]-C[1]-1&&_.push([B,$])}return _}function ie(a,b,p){let r=new Array(a.length).fill(!1);for(let h=0;h<a.length;h++){if(!p[h])continue;let _=[];for(let v=Math.max(0,h-2);v<=Math.min(a.length-1,h+2);v++)p[v]&&_.push(a[v]);_.sort((v,C)=>v-C),r[h]=_[_.length>>1]<.5*b}return r}function se(a){let b=new Array(a.length).fill(!1);for(let p of Lt(a,0))if(p[1]-p[0]+1>=5)for(let r=p[0];r<=p[1];r++)b[r]=!0;return b}function pe(a,b,p,r,h){let _=se(a),v=(A,U)=>{if(A<0||U>_.length)return!1;let z=0;for(let kt=A;kt<U;kt++)_[kt]||z++;return z>=8},C=A=>{let U=(A[1]+1-A[0])*b;return v(A[0]-15,A[0])&&v(A[1]+1,A[1]+1+15)&&U>=150&&U<=1200},P=Lt(_,7);if(!p||!r)return P.filter(C);let B=h?P.filter(A=>A[1]-A[0]+1>=10):P,$=[];for(let A of Te(B,p,r,b)){let U=B.filter(z=>z[0]>=A[0]&&z[1]<=A[1]);if(C(A)&&(!h||U.length===1||U.some(C)))$.push(A);else for(let z of U)C(z)&&$.push([z[0],z[1]])}return $}function Te(a,b,p,r){let h=[];for(let _ of a){let v=h[h.length-1];v&&(_[1]+1-v[0])*r<=1200&&Ge(v[1]+1,_[0],b,p)?v[1]=_[1]:h.push([_[0],_[1]])}return h}function Ge(a,b,p,r){let h=0;for(let _=a;_<b;_++)(p[_]||r[_])&&h++;return b-a<=29&&h>=b-a-7&&Ce(p,a,b)<=10&&Ce(r,a,b)<=12}function Ce(a,b,p){let r=0,h=0;for(let _=b;_<p;_++)r=a[_]?r+1:0,h=Math.max(h,r);return h}function ne(a,b,p,r){let h=a,_=r?a.map(($,A)=>!$&&r[A]):null,v=r?a.map(($,A)=>$&&!r[A]):null,C=pe(h,p,v,_,!0);if(r){h=new Array(a.length).fill(!1);let $=new Array(a.length).fill(!1);for(let A of C)for(let U=A[0];U<=A[1];U++)h[U]=a[U]&&r[U],$[U]=a[U]&&!r[U];C=pe(h,p,$,_)}let P=se(h),B=r?jt(a,r,C,b,p):[];return C.map($=>{let A=Lt(P.slice($[0],$[1]+1),0),U=lt(r?vt(A,$[0],a,r):A);return[b+($[0]+U[0])*p,b+($[0]+U[1]+1)*p]}).concat(B)}function lt(a){let b=0,p=a.length-1;for(;p>b&&a[p][1]-a[p][0]+1<10;)p--;for(;b<p&&a[b][1]-a[b][0]+1<10;)b++;return[a[b][0],a[p][1]]}function vt(a,b,p,r){let h=[];for(let _ of a){let v=h[h.length-1];v&&!F(b+v[1]+1,b+_[0],p,r)?v[1]=_[1]:h.push([_[0],_[1]])}return h}function F(a,b,p,r){let h=0;for(let _=a;_<b;_++)if(!p[_]&&!r[_]||(h=r[_]?0:h+1,h>=5))return!0;return!1}function jt(a,b,p,r,h){let _=se(a),v=(P,B)=>{if(P<0||B>_.length)return!1;let $=0;for(let A=P;A<B;A++)_[A]||$++;return $>=12},C=[];for(let P of pe(b,h)){if(p.some(z=>z[0]<=P[1]&&P[0]<=z[1]))continue;let B=0;for(let z=P[0];z<=P[1];z++)a[z]&&B++;if(B<.5*(P[1]-P[0]+1))continue;let $=-1,A=-1;for(let z=P[0];z<=P[1];z++)_[z]&&($<0&&($=z),A=z+1);if($<0||(A-$)*h<150||!v($-15,$)||!v(A,A+15))continue;let U=lt(vt(Lt(_.slice(P[0],P[1]+1),0),P[0],a,b));C.push([r+(P[0]+U[0])*h,r+(P[0]+U[1]+1)*h])}return C}function qt(a,b){if(a===null)return b||[];if(b===null)return a;let p=[];for(let r of a)for(let h of b){let _=Math.max(r[0],h[0]),v=Math.min(r[1],h[1]);v-_<60||p.push([Math.abs(r[0]-h[0])<=90?h[0]:_,Math.abs(r[1]-h[1])<=90?h[1]:v])}return p}function Ot(a,b,p){let r=Math.floor(b*.22),h=Math.floor(p*.22),_=r-1,v=h-1,C=_*v,P=[[0,0],[b-r,0],[0,p-h],[b-r,p-h]],B=P.map(()=>new Uint8Array(C>0?a*C:0)),$=new Array(a).fill(!1),A=-1;function U(R,Z){if(!(C<=0||R<0||R>=a||Z.length<b*p)){for(let G=0;G<P.length;G++){let et=P[G][0],J=P[G][1],it=B[G],tt=R*C;for(let H=0;H<v;H++){let Y=(J+H)*b+et;for(let Et=0;Et<_;Et++){let Rt=Z[Y];it[tt++]=Math.min(255,Math.abs(Z[Y+1]-Rt)+Math.abs(Z[Y+b]-Rt)),Y++}}}$[R]=!0}}function z(R,Z,G){let et=B[R],J=new Uint8Array(C);for(let Y=0;Y<C;Y++){G.fill(0);for(let We of Z)G[et[We*C+Y]]++;let Et=0,Rt=0;for(;Et+G[Rt]<=Z.length>>1;)Et+=G[Rt++];J[Y]=Rt}let it=Math.max(1,Array.from(J).sort((Y,Et)=>Y-Et)[Math.floor(C*.92)]),tt=[],H=0;for(let Y=0;Y<C;Y++)J[Y]>=it&&(tt.push(Y),H+=J[Y]);return tt.length===0?null:{corner:R,median:J,mask:tt,strength:H/tt.length,whole:H}}function kt(R,Z,G,et){let J=null;for(let it=R;it<Z;it++){let tt=z(it,G,et);tt!==null&&(J===null||tt.strength>J.strength)&&(J=tt)}return J}function Kt(R,Z){let G=B[R.corner],et=new Float64Array(a),J=[];for(let it of Z){let tt=it*C,H=0;for(let Y of R.mask)H+=Math.min(G[tt+Y],R.median[Y]);et[it]=H/R.whole,J.push(et[it])}return J.sort((it,tt)=>it-tt),R.score=et,R.usual=J[J.length>>1],R}function X(){let R=[];for(let H=0;H<a;H++)$[H]&&R.push(H);if(C<=0||R.length<30)return null;let Z=new Int32Array(256),G=H=>H!==null&&H.strength>=25?H:null,et=H=>H!==null&&H.strength>=30?H:null,J=kt(2,B.length,R,Z),it=A<0?G(kt(0,2,R,Z)):A<2?z(A,R,Z):null,tt=it!==null?it:A<0?G(J):z(A,R,Z);return tt===null?null:(A=tt.corner,Kt(tt,R),tt.lower=it!==null&&et(J)!==null?Kt(J,R):null,tt)}function xt(R){let Z=P[R.corner][0],G=P[R.corner][1];return{width:b,points:R.mask.map(et=>(G+Math.floor(et/_))*b+Z+et%_),pattern:R.mask.map(et=>R.median[et]),whole:R.whole,usual:R.usual,strength:R.strength,lower:R.lower?xt(R.lower):null,channel:R.corner<2}}function ce(){let R=X();return R===null?null:xt(R)}function He(){let R=X();return R===null?null:ie(R.score,R.usual,$)}return{add:U,logo:ce,gone:He,breaks:(R,Z)=>{let G=X();if(G===null)return null;let et=G.lower?ie(G.lower.score,G.lower.usual,$):null;return ne(ie(G.score,G.usual,$),R,Z,et)}}}function mt(a){return a.lower?Object.assign({},a,{lower:null}):a}function Vt(a,b,p){let r=0;for(let h of b)At(a,h)>=.5*a.usual&&r++;return r>=p*b.length}function At(a,b){let p=0;for(let r=0;r<a.points.length;r++){let h=a.points[r],_=b[h];p+=Math.min(Math.abs(b[h+1]-_)+Math.abs(b[h+a.width]-_),a.pattern[r])}return p/a.whole}function yt(a){let b=String(a).match(/[A-Za-z0-9+\/]{16,}={0,2}/g)||[];for(let p of b){let r;try{r=atob(p)}catch{continue}if(r.length<20||r.charCodeAt(0)!==252)continue;let h=_=>{if(_<0||_>=r.length)throw new RangeError("short");return r.charCodeAt(_)};try{if(h(13)===5&&!(h(18)&128))return(h(19)&128)!==0;for(let _=16;_+4<=r.length;_++){if(r.substr(_,4)!=="CUEI"||h(_-2)!==2)continue;let v=_+8;if(h(v)&128)continue;v++;let C=h(v);v++,C&128||(v+=1+6*h(v)),C&64&&(v+=5),v+=2+h(v+1);let P=h(v);if([34,48,50,52,54].indexOf(P)>=0)return!0;if([35,49,51,53,55].indexOf(P)>=0)return!1}}catch{return null}return null}return null}function Ut(a){let b=[];if(a.some(p=>p.signalled))for(let p of a)for(let r of p.marks){if(!r.opens)continue;let h=null;if(r.duration!==null)h=r.at+r.duration;else{let _=p.marks.filter(v=>v.at>r.at).map(v=>v.at);h=_.length>0?Math.min.apply(null,_):p.end}h!==null&&h>r.at&&b.push([r.at,h])}else{let p=r=>r.end-r.start;for(let r=1;r+1<a.length;r++){let h=a[r-1],_=a[r],v=a[r+1];if(h.end===null||_.end===null||v.end===null)continue;p(_)<10&&p(h)>=60&&p(h)<=420&&p(v)>=60&&p(v)<=420&&b.push([h.start,v.end])}if(b.length>0)for(let r=1;r+1<a.length;r++){let h=a[r-1],_=a[r],v=a[r+1];if(h.end===null||_.end===null)continue;p(_)>=60&&p(_)<=420&&p(h)>420&&(v.end===null||p(v)>420)&&b.push([_.start,_.end])}}return _e(b,10)}function _e(a,b){let p=[];for(let r of a.slice().sort((h,_)=>h[0]-_[0])){let h=p[p.length-1];h&&r[0]-h[1]<=b?h[1]=Math.max(h[1],r[1]):p.push([r[0],r[1]])}return p}let Dt={270:{tiny:120,mean:40,key:4e3},540:{tiny:172,mean:86,key:8e3},1080:{tiny:430,mean:172,key:12e3}},re=10,fe=20,Gt=.2,Ht=6,nt=90,oe=60,Ft=100,It=3,ge=65536,me=1e4;function ht(a,b){return String.fromCharCode(a[b+4],a[b+5],a[b+6],a[b+7])}function wt(a){let b=new DataView(a.buffer,a.byteOffset,a.byteLength),p=0;for(;a.length-p>=8;){let r=b.getUint32(p);if(r<8||p+r>ge)return null;if(ht(a,p)==="moof")return p+r;p+=r}return null}function pt(a,b,p,r){let h=[],_=p;for(;r-_>=8;){let v=b.getUint32(_);if(v<8||v>r-_)break;h.push({type:ht(a,_),from:_+8,to:_+v}),_+=v}return h}function ae(a){let b=wt(a);if(b===null||b>a.length)return null;let p=new DataView(a.buffer,a.byteOffset,a.byteLength),r=pt(a,p,0,b).pop();if(!r||r.type!=="moof")return null;let h=pt(a,p,r.from,r.to).filter(C=>C.type==="traf")[0];if(!h)return null;let _=[],v=-1;for(let C of pt(a,p,h.from,h.to)){if(C.type!=="tfhd"&&C.type!=="trun")continue;let P=C.from;if(C.to-P<8)return null;let B=p.getUint32(P)&16777215;if(C.type==="tfhd"){let $=P+8;if(B&1&&($+=8),B&2&&($+=4),B&8&&($+=4),B&16){if($+4>C.to)return null;v=p.getUint32($)}}else{let $=p.getUint32(P+4),A=((B&256?1:0)+(B&512?1:0)+(B&1024?1:0)+(B&2048?1:0))*4,U=P+8+(B&1?4:0)+(B&4?4:0);if($>me||U+$*A>C.to||!(B&512)&&v<0)return null;for(let z=0;z<$;z++)_.push(B&512?p.getUint32(U+(B&256?4:0)):v),U+=A}}return _}function Ae(a,b,p,r){let h=[],_=0,v=0;for(let C=0;C<a.length;C++){let P=a[C];if(P>=0&&P<r.tiny){_++,v+=P;continue}_>=re&&_<=fe&&v<=r.mean*_&&P>r.key&&h.push(b+C*p),_=0,v=0}return h}function St(a){let b=[];for(let r of a.slice().sort((h,_)=>h-_)){let h=b[b.length-1];h&&r-h[h.length-1]<=Gt||(h&&r-h[h.length-1]<=oe?h.push(r):b.push([r]))}let p=[];for(let r=0;r<b.length;r++){let h=b[r],_=b[r+1],v=p[p.length-1];v&&!(v.length>=It&&h[0]-v[v.length-1]<=Ft)&&(v=null),v&&h.length>=It?v.push(...h):v&&_&&_.length>=It&&_[0]-h[h.length-1]<=Ft?(v.push(...h,..._),r++):p.push(h)}return p.filter(r=>r.length>=Ht&&r[r.length-1]-r[0]>=nt).map(r=>Object.assign([r[1],r[r.length-2]],{first:r[0]}))}function le(a,b){let p=b.filter(r=>r[0]<a[1]&&r[1]>a[1])[0];return p?[a[0],p[1]]:a}function Mt(a,b){let p=b.filter(r=>r.first!==void 0&&r[0]<a[1]&&r[1]>a[0]).map(r=>r.first);return p.length>0?Math.max(a[0],Math.min.apply(null,p)):a[0]}function Wt(a,b){return b.filter(p=>p[0]<a[1]&&p[1]>a[1]).reduce((p,r)=>Math.max(p,r[1]),a[1])}return{runs:Lt,captionBreaks:Ve,gone:ie,solid:se,logoBreaks:ne,combine:qt,track:Ot,score:At,alone:mt,seenIn:Vt,opens:yt,markedBreaks:Ut,merge:_e,moofEnd:wt,frameSizes:ae,separatorEnds:Ae,separatedBreaks:St,reachSeparated:le,offeredFrom:Mt,askedEnd:Wt,BLACKS:Dt,SEP_WIDE_GAP_S:Ft,BRIDGE:7,AROUND:15,LOGO_MAX_S:1200}})();function $i(d){let ft=O.LOGO_MAX_S+160,gt=ft+120,dt=3,ze=4096,Ct=Math.min.apply(null,Object.keys(O.BLACKS).map(Number)),je=6,qe=2,Pe=480,ui=1,pi=8,Lt=60,Ve=4,ie=3e4,se=4e3,pe=150,Te=1e4,Ge=5*60*1e3,Ce=10,ne=2e4,lt=240,vt=135,F=0,jt=null,qt=!1,Ot=null,mt=null,Vt=[],At=[],yt="none",Ut=null,_e=0,Dt=new Map,re=[],fe=0,Gt="none",Ht=[],nt=null,oe="none",Ft=-1/0,It=0,ge=new Map,me=null,ht=new Map,wt=new Map,pt=new Map,ae=0,Ae=0,St=null,le=!1,Mt=null,Wt=!1,a="none",b=[],p=0,r=new Map,h=new Map,_=[],v=0,C="",P=!1;function B(l){let c=String(l).indexOf("?");return c<0?String(l):String(l).slice(0,c)}function $(l,c){try{let f=l&&l.contentId,u=!!d.isLive(),m=f?B(f):null;Ot=f||null;let y=c&&c.live_thumbnails_url;mt=u&&typeof y=="string"&&y.indexOf("https://")===0?y.replace(/\/+$/,""):null,Wt=u&&!!(c&&c.separated_breaks===!0);let E=!u&&!!(c&&c.recording)&&m!==null;if(m!==null&&m===jt&&u===qt){E&&/^error/.test(yt)&&(Ut={url:Ot,name:jt,mine:F});return}F++,jt=m,qt=u,St=null,le=d.show(!1),Vt=[],At=[],yt=E?"waiting":"none",re=[],fe=0,Gt="none",Ht=[],nt=null,oe="none",Ft=-1/0,It=0,me=null,ht=new Map,wt=new Map,pt=new Map,a=Wt?"waiting":"none",b=[],p=0,r=new Map,h=new Map,_=[],v=0,C="",P=!1,Ut=E?{url:Ot,name:jt,mine:F}:null,_e=0}catch{yt="error"}}function A(l,c,f){let u=new Array(l.length),m=0,y=async()=>{for(;m<l.length;){let w=m++;u[w]=await f(l[w],w)}},E=[];for(let w=0;w<Math.min(c,l.length);w++)E.push(y());return Promise.all(E).then(()=>u)}async function U(l){let c=new AbortController,f=setTimeout(()=>c.abort(),ne);try{let u=await fetch(l,{credentials:"omit",signal:c.signal});if(!u.ok)throw new Error("http "+u.status);return await u.text()}finally{clearTimeout(f)}}function z(l,c,f){return new Promise(u=>{let m=new Image,y=setTimeout(()=>{m.onload=null,m.onerror=null,u(null)},ne);m.crossOrigin="anonymous",m.onload=()=>{clearTimeout(y);try{Mt===null&&(Mt=document.createElement("canvas")),(Mt.width!==c||Mt.height!==f)&&(Mt.width=c,Mt.height=f);let E=Mt.getContext("2d",{willReadFrequently:!0});E.drawImage(m,0,0,c,f),u(E.getImageData(0,0,c,f).data)}catch{u(null)}},m.onerror=()=>{clearTimeout(y),u(null)},m.src=l})}function kt(l,c,f){let u=new Uint8Array(lt*vt),m=0;for(let y=0;y<vt;y++){let E=(y*c+f)*4;for(let w=0;w<lt;w++)u[m++]=l[E]*77+l[E+1]*150+l[E+2]*29>>8,E+=4}return u}function Kt(l){let c=/^PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?$/.exec(l||"");return c?Number(c[1]||0)*3600+Number(c[2]||0)*60+Number(c[3]||0):NaN}function X(l,c){let f=[];for(let u=l.firstElementChild;u;u=u.nextElementSibling)u.localName===c&&f.push(u);return f}function xt(l,c){let f=X(l,"BaseURL")[0];return f&&f.textContent?new URL(f.textContent.trim(),c).href:c}function ce(l,c,f,u){let m=u||X(l,"Representation")[0];if(!m)return[];let y=X(l,"SegmentTemplate")[0]||X(m,"SegmentTemplate")[0],E=y&&y.getAttribute("media");if(!E)return[];let w=Number(y.getAttribute("timescale")||1),k=Number(y.getAttribute("presentationTimeOffset")||0),D=(V,ut,st)=>V.replace(new RegExp("\\$"+ut+"(?:%0(\\d+)d)?\\$","g"),(Pt,Yt)=>Yt?String(st).padStart(Number(Yt),"0"):String(st)),I=(V,ut)=>new URL(D(D(E.split("$RepresentationID$").join(m.getAttribute("id")),"Time",V),"Number",ut),c).href,T=[],j=X(y,"SegmentTimeline")[0];if(j){let V=0,ut=Number(y.getAttribute("startNumber")||1),st=X(j,"S");for(let Pt=0;Pt<st.length;Pt++){let Yt=st[Pt];Yt.getAttribute("t")!==null&&(V=Number(Yt.getAttribute("t")));let Ie=Number(Yt.getAttribute("d")),Me=Number(Yt.getAttribute("r")||0);if(!(Ie>0))return[];if(Me<0){let ye=Pt+1<st.length?st[Pt+1].getAttribute("t"):null,Vi=ye!==null?Number(ye):f*w+k;Me=Math.ceil((Vi-V)/Ie)-1}if(!(Me>=0))return[];for(let ye=0;ye<=Me;ye++)if(T.push({time:(V-k)/w,duration:Ie/w,url:I(V,ut)}),V+=Ie,ut++,T.length>Te)return[]}return T}let Q=Number(y.getAttribute("duration"))/w,M=Number(y.getAttribute("startNumber")||1);if(!(Q>0))return[];let W=0;y.getAttribute("eptDelta")!==null?W=Number(y.getAttribute("eptDelta"))/w:W=(M-1)*Q-k/w,W<0&&-W<Q||(W=0);let q=y.getAttribute("endNumber")!==null?Number(y.getAttribute("endNumber")):M+Math.ceil((f-W)/Q)-1;if(!(q>=M)||q-M+1>Te)return[];for(let V=M;V<=q;V++)T.push({time:(V-M)*Q+W,duration:Q,url:I("",V)});return T}async function He(l,c){if(l.length===0)return null;let f=/<p\b[^>]*>([\s\S]*?)<\/p>/g,u=0,m=await A(l,4,async y=>{if(c!==F)return!0;try{let E=await U(y.url).catch(()=>U(y.url)),w;for(f.lastIndex=0;(w=f.exec(E))!==null;)if(w[1].replace(/<[^>]+>/g,"").trim()!=="")return!0;return!1}catch{return u++,!0}});if(c!==F)throw new Error("superseded");if(u*20>m.length)throw new Error("captions unread");return O.captionBreaks(m,l[0].time,l[0].duration)}async function R(l,c,f,u){if(l.length===0||l.length>pe||f!==1||!(c>0))return null;let m=c,y=O.track(l.length*m,lt,vt),E=async I=>(await A(I,1,async j=>{if(u!==F)return!1;let Q=await z(l[j].url,c*lt,vt);if(Q===null&&u===F&&(Q=await z(l[j].url,c*lt,vt)),Q===null)return!1;for(let M=0;M<m;M++)y.add(j*m+M,kt(Q,c*lt,M*lt));return!0})).every(j=>j),w=l.map((I,T)=>T);if(!await E(w.filter(I=>I%2===0)))throw new Error("thumbnails unread");let k=y.gone();if(k===null)return null;let D=I=>{if(I<0||I>=l.length)return!1;for(let T=I*m;T<(I+1)*m;T++)if(k[T])return!0;return!1};if(!await E(w.filter(I=>I%2===1&&(D(I-1)||D(I+1)))))throw new Error("thumbnails unread");return y.breaks(l[0].time,l[0].duration/m)}async function Z(l,c,f){if(Dt.has(c)){let u=Dt.get(c);Vt=u.breaks,At=u.separated||[],yt="known",u.separated===null&&await G(u,f);return}yt="searching";try{let u=new DOMParser().parseFromString(await U(l),"application/xml").documentElement,m=u?X(u,"Period"):[],y=u?Kt(u.getAttribute("mediaPresentationDuration")):NaN;if(u&&(u.getAttribute("type")==="dynamic"||!(y>0)))throw new Error("not whole yet");if(!u||m.length!==1){f===F&&(yt="not a recording");return}let E=xt(m[0],xt(u,l)),w=null,k=null;for(let T of X(m[0],"AdaptationSet")){let j=X(T,"Representation")[0],Q=T.getAttribute("mimeType")||j&&j.getAttribute("mimeType")||"",M=T.getAttribute("contentType")||Q.split("/")[0];if(M==="text"&&w===null)w=await He(ce(T,E,y),f);else if(M==="image"&&k===null){let W=X(T,"EssentialProperty").concat(j?X(j,"EssentialProperty"):[]).filter(V=>/thumbnail_tile$/.test(V.getAttribute("schemeIdUri")||""))[0],q=/^(\d+)x(\d+)$/.exec(W&&W.getAttribute("value")||"");q&&(k=await R(ce(T,E,y),Number(q[1]),Number(q[2]),f))}if(f!==F)return}let D=O.combine(w,k).filter(T=>T[0]>0&&T[1]<y),I={breaks:D,separated:null,period:m[0],base:E,total:y};if(Dt.set(c,I),Dt.size>20&&Dt.delete(Dt.keys().next().value),f!==F)return;Vt=D,yt="found "+D.length+" (captions "+(w===null?"none":w.length)+", logo "+(k===null?"none":k.length)+")",await G(I,f)}catch(u){f===F&&(yt="error: "+String(u&&u.message).slice(0,40),setTimeout(()=>{f===F&&/^error/.test(yt)&&(Ut={url:l,name:c,mine:f})},Ge*2**Math.min(_e++,12)))}}async function G(l,c){if(l.breaks.length===0){l.separated=[];return}let f=await et(l.period,l.base,l.total,l.breaks,c);f!==null&&(l.separated=f,c===F&&(At=f))}async function et(l,c,f,u,m){let y=[];H(l).forEach((M,W)=>{for(let q of ce(M.set,xt(M.rep,xt(M.set,c)),f,M.rep))y.push({time:q.time,duration:q.duration,url:q.url,height:W})});let E=new Map,w=O.SEP_WIDE_GAP_S,k=u.map(M=>[Math.max(0,M[0]-w),Math.min(f,M[1]+w)]),D=()=>{let M=[];return E.forEach(W=>{typeof W!="string"&&M.push(...W)}),M};for(;;){let M=[];y.forEach((q,V)=>{!E.has(V)&&(!P||q.height===Ct)&&k.some(ut=>q.time+q.duration>ut[0]&&q.time<ut[1])&&M.push(V)});for(let q=0;q<dt&&M.length>0;q++){let V=await A(M,P?qe:je,st=>m===F?Et(y[st]):"stopped");if(m!==F)return null;let ut=await Rt(M.map(st=>y[st]),V);if(m!==F)return null;if(ut){P=!0,M=M.filter(st=>y[st].height===Ct),q=-1;continue}M.forEach((st,Pt)=>E.set(st,V[Pt])),M=M.filter((st,Pt)=>typeof V[Pt]=="string")}let W=J(k,D(),f);if(W.every((q,V)=>q[0]===k[V][0]&&q[1]===k[V][1]))break;k=W}let I=Array.from(E.entries()).filter(([M])=>!P||y[M].height===Ct);if(I.length===0)return null;let T=I.filter(([,M])=>typeof M=="string").length,j=D();if(a="segments "+I.length+(P?" whole "+Ct+"p":"")+", blacks "+j.length+(T>0?", failed "+T:""),T*Ce>I.length)return null;let Q=O.separatedBreaks(j).filter(M=>u.some(W=>W[0]<=M[0]&&M[1]<=W[1]));return a+=", breaks "+Q.length,Q}function J(l,c,f){let u=O.SEP_WIDE_GAP_S,m=y=>c.some(E=>E>y-u&&E<y+u);return l.map(y=>[y[0]>0&&m(y[0])?Math.max(0,y[0]-u):y[0],y[1]<f&&m(y[1])?Math.min(f,y[1]+u):y[1]])}async function it(l){try{let c=new DOMParser().parseFromString(await U(Ot),"application/xml").documentElement;if(!c||l!==F)return;let f=Date.parse(c.getAttribute("availabilityStartTime")||"")/1e3;if(!isFinite(f)){Gt="no start time";return}let u=X(c,"Period"),m=u.map(w=>Kt(w.getAttribute("start"))),y=null,E=u.map((w,k)=>{let D=isFinite(m[k])?f+m[k]:y!==null?y:f,I=Kt(w.getAttribute("duration")),T=isFinite(I)?D+I:k+1<m.length&&isFinite(m[k+1])?f+m[k+1]:null,j=X(w,"EventStream").filter(M=>(M.getAttribute("schemeIdUri")||"").indexOf("urn:scte:scte35")===0),Q=[];for(let M of j){let W=Number(M.getAttribute("timescale")||1),q=Number(M.getAttribute("presentationTimeOffset")||0);for(let V of X(M,"Event")){let ut=O.opens(new XMLSerializer().serializeToString(V));if(ut===null)continue;let st=Number(V.getAttribute("duration")||0)/W;Q.push({at:D+(Number(V.getAttribute("presentationTime")||0)-q)/W,duration:st>0?st:null,opens:ut})}}return y=T,{start:D,end:T,marks:Q,signalled:j.length>0}});re=O.markedBreaks(E),Gt="periods "+u.length+", breaks "+re.length,Wt&&(b=tt(c,f),p=Date.now()/1e3)}catch(c){l===F&&(Gt="error: "+String(c&&c.message).slice(0,40))}}function tt(l,c){let f=[],u=Date.now()/1e3,m=xt(l,Ot);for(let y of X(l,"Period")){let E=c+(Kt(y.getAttribute("start"))||0);H(y).forEach((w,k)=>{let D=X(w.set,"SegmentTemplate")[0]||X(w.rep,"SegmentTemplate")[0];if(!D||!X(D,"SegmentTimeline")[0])return;let I=xt(w.rep,xt(w.set,xt(y,m)));for(let T of ce(w.set,I,u-E,w.rep)){let j=E+T.time;f.push({time:j,duration:T.duration,url:T.url,height:k,key:k+" "+j})}})}return f}function H(l){let c=new Map;for(let f of X(l,"AdaptationSet"))if(!(f.getAttribute("contentType")!=="video"&&!/^video\//.test(f.getAttribute("mimeType")||"")))for(let u of X(f,"Representation")){let m=Number(u.getAttribute("bandwidth")),y=Number(u.getAttribute("height")||f.getAttribute("height"));if(!(m>0)||!O.BLACKS[y])continue;let E=c.get(y);(!E||m<Number(E.rep.getAttribute("bandwidth")))&&c.set(y,{set:f,rep:u})}return c}async function Y(l,c){let f=new AbortController,u=setTimeout(()=>f.abort(),ne);try{let m={credentials:"omit",signal:f.signal};c!==null&&(m.headers={Range:"bytes=0-"+(c-1)});let y=await fetch(l,m);if(!y.ok)return"http "+y.status;let E=new Uint8Array(await y.arrayBuffer());return c!==null&&E.length>c?E.subarray(0,c):E}catch(m){return String(m&&m.name||"error")}finally{clearTimeout(u)}}async function Et(l){let c=await Y(l.url,P?null:ze);if(typeof c=="string")return c;let f=O.moofEnd(c);if(f===null)return"no header";if(f>c.length&&(c=await Y(l.url,f)),typeof c=="string")return c;let u=O.frameSizes(c);return u===null||u.length===0?"no frames":O.separatorEnds(u,l.time,l.duration/u.length,O.BLACKS[l.height])}async function Rt(l,c){if(P||l.length===0||!c.every(y=>y==="TypeError"))return!1;let f=l.filter(y=>y.height===Ct).pop(),u=f?await Y(f.url,null):"none",m=typeof u=="string"?u:await Y(f.url,ze);return typeof u!="string"&&m==="TypeError"}function We(l){if(l===void 0)return!1;let c=l.times-dt;return c<0||c<Ve&&Date.now()/1e3-l.at>=Lt*2**c}async function Oi(l,c,f){let u=l-Pe,y=b.reduce((T,j)=>Math.max(T,j.time+j.duration),-1/0)+(Date.now()/1e3-p)-pi,E=Math.min(c-ui,y,l+Pe),w=b.filter(T=>(!P||T.height===Ct)&&T.time+T.duration>u&&T.time<E&&(!r.has(T.key)||We(h.get(T.key)))),k=await A(w,P?qe:je,Et);if(f!==F)return;let D=await Rt(w,k);if(f!==F)return;if(D){P=!0,v+=w.length,C="TypeError",a="segments "+r.size+", whole "+Ct+"p next, failed "+v+" ("+C+")";return}w.forEach((T,j)=>{let Q=typeof k[j]=="string";Q?(h.set(T.key,{times:(h.has(T.key)?h.get(T.key).times:0)+1,at:Date.now()/1e3}),v++,C=k[j]):h.delete(T.key),r.set(T.key,{time:T.time,ends:Q?[]:k[j]})});for(let T of Array.from(r.keys()))r.get(T).time>=l-2*Pe||(r.delete(T),h.delete(T));let I=[];for(let T of r.values())for(let j of T.ends)I.push(j);_=O.separatedBreaks(I),a="segments "+r.size+(P?" whole "+Ct+"p":"")+", blacks "+I.length+", breaks "+_.length+(v>0?", failed "+v+" ("+C+")":"")}async function Ke(l,c,f){let u=[];for(let w=l;w<=c;w+=4)(!ht.has(w)||pt.has(w)&&pt.get(w)<dt)&&u.push(w);if(u.length===0)return;let m=nt,y=mt,E=await A(u,4,async w=>{if(f!==F)return null;let k=await z(y+"/"+w,lt,vt);if(k===null)return null;let D=kt(k,lt,0);return[O.score(m,D),m.lower?O.score(m.lower,D):null]});f!==F||m!==nt||u.forEach((w,k)=>{E[k]===null?pt.set(w,(pt.get(w)||0)+1):pt.delete(w),ht.set(w,E[k]===null?m.usual:E[k][0]),m.lower&&wt.set(w,E[k]===null?m.lower.usual:E[k][1])})}async function _i(l,c){let f=mt;return(await A(l,4,async u=>{if(c!==F)return null;let m=await z(f+"/"+u,lt,vt);return m===null?null:kt(m,lt,0)})).filter(u=>u!==null)}function fi(l){if(l.length===0)return null;let c=O.track(l.length,lt,vt);return l.forEach((f,u)=>c.add(u,f)),c.logo()}async function Ui(l,c,f){let u=[];for(let w=l-1200;w<=Math.min(c,l+1200);w+=28)u.push(w);let m=await _i(u,f);if(f!==F)return;if(m.length===0){gi(l);return}let y=fi(m);y!==null&&y.channel&&ge.set(mt,O.alone(y));let E=null;if(y===null){let w=ge.get(mt);if(w&&O.seenIn(w,m,.4))E=w;else if(me!==mt){let k=await Di(l,f);if(f!==F)return;k!==null&&(ge.set(mt,k),O.seenIn(k,m,.4)&&(E=k))}}Ft=l,nt=E||y,ht=new Map,wt=new Map,pt=new Map,oe=nt===null?"none in "+m.length+" pictures":"strength "+Math.round(nt.strength)+(nt.lower?", lower one "+Math.round(nt.lower.strength):"")+(E!==null?", kept":""),nt===null?gi(l):It=0}function gi(l){Ft=l-900+Math.min(900,120*2**It),120*2**It<900&&It++}async function Di(l,c){let f=null;for(let u=0;u<3;u++){let m=l-1200-u*2*1200,y=[];for(let k=m-2*1200;k<m;k+=28)y.push(k);let E=await _i(y,c);if(c!==F)return null;if(E.length===0){if(u===0)return null;break}let w=fi(E);if(w!==null&&w.channel){f=O.alone(w);break}}return me=mt,f}function mi(l){let c=l;for(;ht.has(c-4);)c-=4;let f=[],u=[];for(let y=c;ht.has(y);y+=4)f.push(ht.get(y)),nt.lower&&u.push(wt.has(y)?wt.get(y):nt.lower.usual);let m=f.map(()=>!0);return{first:c,gone:O.gone(f,nt.usual,m),lowerGone:nt.lower?O.gone(u,nt.lower.usual,m):null}}async function Fi(l,c,f){let u=Math.floor(l/4)*4,m=Math.floor((c-12)/4)*4;if(u>m)return;let y=Math.abs(u-Ft),E=Ht.some(k=>k[0]<=u&&u<=k[1])&&y<=900+O.LOGO_MAX_S;if(y>900&&!E&&await Ui(u,m,f),nt===null||f!==F)return;await Ke(u-64,Math.min(m,u+88),f);for(let k=0;k<4;k++){if(f!==F||!ht.has(u))return;let D=mi(u),I=D.gone.length,T=D.first+I*4,j=O.runs(O.solid(D.gone),O.BRIDGE).concat(D.lowerGone?O.runs(O.solid(D.lowerGone),O.BRIDGE):[]),Q=j.some(q=>q[1]+O.AROUND>=I&&(I-q[0])*4<=ft),M=(u-D.first)/4,W=j.some(q=>q[0]<O.AROUND&&q[1]>=M&&(q[1]+1)*4<=ft);if(Q&&T<=m)await Ke(T,Math.min(m,T+120),f);else if(W&&D.first>u-ft)await Ke(D.first-120,D.first-4,f);else break}if(f!==F||nt===null||!ht.has(u))return;let w=mi(u);Ht=O.logoBreaks(w.gone,w.first,4,w.lowerGone);for(let k of Array.from(ht.keys()))k<u-gt&&ht.delete(k);for(let k of Array.from(wt.keys()))k<u-gt&&wt.delete(k);for(let k of Array.from(pt.keys()))k<u-gt&&pt.delete(k)}function Ye(){let l=d.liveRange(),c=d.currentTime();if(!l||typeof c!="number"||!isFinite(c)||!isFinite(l.end))return null;let f=d.absoluteTime(c),u=d.absoluteTime(l.end),m=Date.now()/1e3;return typeof f!="number"||typeof u!="number"||!(f>m-86400&&f<m+600)||!(u>=f)?null:{at:f,end:u}}async function Bi(l){if(ae!==l){ae=l;try{let c=Ye();if(c===null||c.end-c.at<=60)return;Date.now()-fe>=ie&&Ot&&(fe=Date.now(),await it(l)),Wt&&l===F&&await Oi(c.at,c.end,l),mt!==null&&l===F&&await Fi(c.at,c.end,l)}catch(c){oe="error: "+String(c&&c.message).slice(0,40)}finally{ae===l&&(ae=0)}}}function zi(){let l=null;try{let c=d.state();if(jt!==null&&(c==="playing"||c==="paused")){let f=d.currentTime();if(Ut!==null&&c==="playing"){let m=Ut;Ut=null,m.mine===F&&Z(m.url,m.name,m.mine)}let u=m=>[m[0],m[1]-32];if(qt){if(!d.joining()){let m=Ye();if(m!==null){let y=I=>m.at>=I[0]&&m.at<I[1]-1&&I[1]<=m.end-2,E=Ht.map(I=>[O.offeredFrom(I,_),O.reachSeparated(u(I),_)[1]]),w=_.filter(y)[0],k=E.filter(I=>I[1]<=m.end-2),D=re.filter(y)[0]||w&&[w[0],O.askedEnd(w,k)]||E.filter(y)[0];if(D){let I=d.mediaTime(D[1]);typeof I=="number"&&isFinite(I)&&I>f&&(l=I)}}Date.now()-Ae>=se&&(Ae=Date.now(),Bi(F))}}else{let m=k=>f>=k[0]&&f<k[1]-1,y=At.filter(m)[0],E=Vt.map(k=>[O.offeredFrom(k,At),u(k)[1]]),w=y?[y[0],O.askedEnd(y,E)]:E.filter(m)[0];w&&(l=w[1])}}}catch{l=null}St=l,le=d.show(St!==null)}function ji(){if(St===null||!le)return!1;let l=St;return St=null,le=d.show(!1),d.seek(l),!0}function qi(){let l={live:qt,offered:St!==null,skip_to:St};if(qt){l.marked=Gt,l.logo=mt===null?"no pictures":oe,l.found=Ht.length,Wt&&(l.separators=a);try{let c=Ye();l.clock=c===null?"none":Math.round(Date.now()/1e3-c.end)+" s behind at the live point"}catch{l.clock="error"}}else l.recording=yt,l.breaks=Vt.map(c=>[Math.round(c[0]),Math.round(c[1])]),l.separators=a,l.separated=At.map(c=>[Math.round(c[0]),Math.round(c[1])]);return l}return{load:$,tick:zi,skip:ji,report:qi}}var Li="0.1.22";function is(){let d=navigator.userAgent||"",t=/Android|iPhone|iPad|iPod|Mobile/i.test(d),e=/wv|WebView/i.test(d)||window.navigator.standalone===!0;return t||e}var ss={fr:"Francais",fra:"Francais",fre:"Francais",en:"English",eng:"English",de:"Deutsch",deu:"Deutsch",ger:"Deutsch",es:"Espanol",spa:"Espanol",it:"Italiano",ita:"Italiano",pt:"Portugues",por:"Portugues",qaa:"Original",und:"Indefini",mul:"Multiple"};function Ni(d){if(!d)return"Inconnu";let t=d.toLowerCase();return ss[t]||d.toUpperCase()}function Be(d){let t=d.split(":");if(t.length<2)return null;let e=t.slice(1).join(":");try{let i=e,s=e.length%4;s&&(i+="=".repeat(4-s));let n=atob(i.replace(/-/g,"+").replace(/_/g,"/"));return JSON.parse(n)}catch{return null}}var hi=class extends ee{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},panel:{type:Object},_channels:{type:Array},_loading:{type:Boolean},_error:{type:String},_playing:{type:Boolean},_selectedChannel:{type:Object},_streamData:{type:Object},_isFullscreen:{type:Boolean},_playerError:{type:String},_playerLoading:{type:Boolean},_currentTime:{type:Number},_duration:{type:Number},_volume:{type:Number},_muted:{type:Boolean},_paused:{type:Boolean},_audioTracks:{type:Array},_textTracks:{type:Array},_selectedAudioIndex:{type:Number},_selectedTextIndex:{type:Number},_isLive:{type:Boolean},_programStart:{type:Number},_programEnd:{type:Number},_showAudioMenu:{type:Boolean},_showTextMenu:{type:Boolean},_expandedChannels:{type:Object},_channelPrograms:{type:Object},_loadingPrograms:{type:Object},_searchQuery:{type:String},_searchResults:{type:Array},_searching:{type:Boolean},_showingSearch:{type:Boolean},_expandedResults:{type:Object},_resultEpisodes:{type:Object},_loadingEpisodes:{type:Object},_castTargets:{type:Array},_selectedTarget:{type:String},_activeTab:{type:String},_recordings:{type:Array},_loadingRecordings:{type:Boolean},_expandedRecordings:{type:Object},_recordingEpisodes:{type:Object},_loadingRecordingEpisodes:{type:Object},_castPlaying:{type:Boolean},_castTarget:{type:String},_castTitle:{type:String},_activeCasts:{type:Object},_focusedCastHost:{type:String},_localPlaybackInitiated:{type:Boolean},_localMinimized:{type:Boolean},_castMinimized:{type:Boolean},_castLoading:{type:Boolean},_tonightChannels:{type:Array},_loadingTonight:{type:Boolean},_episodePlaylist:{type:Array},_episodeIndex:{type:Number},_selectedEntityId:{type:String}}}static get styles(){return Mi`
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
    `}constructor(){super(),this._boundOnFullscreenChange=this._onFullscreenChange.bind(this),this._boundOnDocumentClick=this._onDocumentClick.bind(this),this._channels=[],this._loading=!0,this._error=null,this._playing=!1,this._selectedChannel=null,this._streamData=null,this._isFullscreen=!1,this._playerError=null,this._playerLoading=!1,this._player=null,this._entityUnsubscribe=null,this._showPlayOverlay=!1,this._adSkip=null,this._adOffer=!1,this._castSkipTo=null,this._currentTime=0,this._duration=0,this._volume=.5,this._muted=!1,this._paused=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._liveDelay=0,this._showAudioMenu=!1,this._showTextMenu=!1,this._updateInterval=null,this._expandedChannels={},this._channelPrograms={},this._loadingPrograms={},this._searchQuery="",this._searchResults=[],this._searching=!1,this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._searchToken=0,this._castTargets=[],this._isMobile=is(),this._selectedTarget=this._isMobile?"":"local",this._activeTab="live",this._recordings=[],this._loadingRecordings=!1,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castProgressInterval=null,this._castBasePosition=0,this._castPositionUpdatedAt=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._castMinimized=!1,this._castLoading=!1,this._tonightChannels=[],this._loadingTonight=!1,this._episodePlaylist=[],this._episodeIndex=-1,this._episodeParentTitle="",this._episodeIsRecording=!1,this._sessionId=this._generateSessionId(),this._selectedEntityId=localStorage.getItem("molotov_selected_entity")||""}_generateSessionId(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"molotov-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10)}connectedCallback(){super.connectedCallback(),console.log(`[Molotov Panel] Connected - v${Li}`),this._hasLoadedChannels=!1,document.addEventListener("fullscreenchange",this._boundOnFullscreenChange),document.addEventListener("click",this._boundOnDocumentClick)}disconnectedCallback(){if(super.disconnectedCallback(),this._playing){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"})}this._cleanupPlayer(),this._stopCastProgressUpdate(),document.removeEventListener("fullscreenchange",this._boundOnFullscreenChange),document.removeEventListener("click",this._boundOnDocumentClick),this._entityUnsubscribe&&(this._entityUnsubscribe(),this._entityUnsubscribe=null)}_onDocumentClick(t){t.composedPath().some(e=>e.classList?.contains("track-menu-container"))||(this._showAudioMenu=!1,this._showTextMenu=!1,this.requestUpdate())}updated(t){t.has("hass")&&this.hass&&(this._hasLoadedChannels||(this._hasLoadedChannels=!0,this._loadChannels()),this._syncWithEntity())}async _loadChannels(){this._loading=!0,this._error=null;try{let t=this._getEntityId();if(!t)throw new Error("Entite Molotov TV introuvable");console.log(`[Molotov Panel] Loading channels for ${t}`);let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"now_playing",media_content_type:"directory"});e&&e.children?(this._channels=e.children.map(i=>this._parseChannel(i)),console.log(`[Molotov Panel] Loaded ${this._channels.length} channels`),this._channels.length>0&&await this._fetchCastTargets(t,this._channels[0].mediaContentId)):this._channels=[],this._loading=!1}catch(t){console.error("[Molotov Panel] Failed to load channels:",t),this._error=t.message||"Erreur lors du chargement des chaines",this._loading=!1}}async _fetchCastTargets(t,e){try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:e,media_content_type:"program"});if(i&&i.children){let s=i.children.filter(n=>n.media_content_id.startsWith("cast:")).map(n=>({mediaContentId:n.media_content_id,title:n.title}));this._castTargets=s,this._isMobile&&s.length>0&&(!this._selectedTarget||this._selectedTarget==="local")&&(this._selectedTarget=s[0].mediaContentId),console.log(`[Molotov Panel] Found ${s.length} cast targets`)}}catch(i){console.error("[Molotov Panel] Failed to fetch cast targets:",i),this._castTargets=[]}}_handleTargetChange(t){let e=t.target.value;this._isMobile&&e==="local"||(this._selectedTarget=e,console.log(`[Molotov Panel] Selected target: ${this._selectedTarget}`))}_switchTab(t){this._activeTab=t,t==="recordings"&&this._recordings.length===0&&this._loadRecordings(),t==="tonight"&&this._tonightChannels.length===0&&this._loadTonight(),this.requestUpdate()}async _loadRecordings(){let t=this._getEntityId();if(!t)return;this._loadingRecordings=!0,this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this.requestUpdate();try{let i=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"recordings",media_content_type:"directory"});i&&i.children?(this._recordings=i.children.map(s=>{let n=Be(s.media_content_id);return{mediaContentId:s.media_content_id,title:s.title,thumbnail:s.thumbnail,description:n?.desc||null,isFolder:!!n?.folder}}),console.log(`[Molotov Panel] Loaded ${this._recordings.length} recordings`)):this._recordings=[]}catch(i){console.error("[Molotov Panel] Failed to load recordings:",i),this._recordings=[]}this._loadingRecordings=!1,this.requestUpdate();let e=this._recordings.filter(i=>i.isFolder);e.length>0&&(await Promise.all(e.map(i=>this._fetchRecordingEpisodes(i))),this.requestUpdate())}async _loadTonight(){let t=this._getEntityId();if(t){this._loadingTonight=!0,this.requestUpdate();try{let e=await this.hass.callWS({type:"media_player/browse_media",entity_id:t,media_content_id:"tonight_epg",media_content_type:"directory"});if(e&&e.children&&e.children.length>0){let i=new Map;for(let n of e.children){if(!n.media_content_id.startsWith("tonight_program:"))continue;let o=n.media_content_id.split(":");if(o.length<6)continue;let g=o[1],S=decodeURIComponent(o[2]),N=decodeURIComponent(o[3]),K=parseInt(o[4])*1e3,L=parseInt(o[5])*1e3,ot=o.length>6?decodeURIComponent(o.slice(6).join(":")):"",rt=n.title;rt.startsWith("\u{1F534} ")&&(rt=rt.substring(3));let at=rt.match(/^\d{2}:\d{2}-\d{2}:\d{2}\s+(.+)$/);at&&(rt=at[1]);let ct={mediaContentId:n.media_content_id,title:rt,thumbnail:n.thumbnail,start:K,end:L,description:ot};i.has(g)||i.set(g,{id:g,name:S,thumbnail:N,programs:[]}),i.get(g).programs.push(ct)}let s=Array.from(i.values());for(let n of s)n.programs.sort((o,g)=>o.start-g.start);this._tonightChannels=s,console.log(`[Molotov Panel] Loaded tonight EPG for ${s.length} channels`)}else this._tonightChannels=[]}catch(e){console.error("[Molotov Panel] Failed to load tonight EPG:",e),this._tonightChannels=[]}this._loadingTonight=!1,this.requestUpdate()}}async _toggleRecordingExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedRecordings[i]){this._expandedRecordings={...this._expandedRecordings,[i]:!1},this.requestUpdate();return}if(!e.isFolder){await this._playRecordingDirectly(e);return}this._recordingEpisodes[i]||await this._fetchRecordingEpisodes(e);let s=this._recordingEpisodes[i]||[];if(s.length===0){console.log("[Molotov Panel] No episodes found, playing recording directly"),await this._playRecordingDirectly(e);return}if(s.length===1){console.log("[Molotov Panel] Only 1 episode found, playing it directly"),await this._playRecordingEpisode(s[0],e.title);return}this._expandedRecordings={...this._expandedRecordings,[i]:!0},this.requestUpdate()}async _playRecordingDirectly(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:"",currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=t.mediaContentId;i.startsWith("recording:")&&(i=i.substring(10));let s=this._buildPlayMediaId(`replay:${i}`);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:s,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play recording failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}async _fetchRecordingEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"recording"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._recordingEpisodes={...this._recordingEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for recording "${t.title}"`)}else this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch recording episodes:",s),this._recordingEpisodes={...this._recordingEpisodes,[i]:[]}}this._loadingRecordingEpisodes={...this._loadingRecordingEpisodes,[i]:!1},this.requestUpdate()}async _playRecordingEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._recordingEpisodes,!0),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play recording episode failed:",s),this._playerError=s.message||"Erreur de lecture",this._castLoading=!1}}}_buildPlayMediaId(t){if(this._selectedTarget==="local")return`play_local:${this._sessionId}:${t}`;let e=this._selectedTarget.split(":");if(e.length>=2){let i=e[1],s=e.length>=3&&e[2]!=="native"&&e[2]!=="custom"?"":e[2];return s?`cast:${i}:${s}:${t}`:`cast:${i}:${t}`}return`play_local:${t}`}_isLocalPlayback(){return this._selectedTarget==="local"}_parseEpisodeChildren(t){return t.filter(e=>e.media_content_id.startsWith("episode:")||e.media_content_id.startsWith("replay:")||e.media_content_id.startsWith("recording:")||e.can_play).map(e=>{let i=Be(e.media_content_id);return{mediaContentId:e.media_content_id,title:e.title,thumbnail:e.thumbnail,description:i?.desc||null}})}_initPlaybackFlags(){this._isLocalPlayback()?(this._localPlaybackInitiated=!0,this._localMinimized=!1):this._castLoading=!0}_parseChannel(t){let e=t.media_content_id,[i,s]=e.split("|"),n=null;if(s)try{let rt=s,at=s.length%4;at&&(rt+="=".repeat(4-at)),n=decodeURIComponent(escape(atob(rt.replace(/-/g,"+").replace(/_/g,"/"))))}catch{}let o=i.split(":"),g,S,N;o[0]==="program"?(g=o[1],S=o[2]?parseInt(o[2])*1e3:null,N=o[3]?parseInt(o[3])*1e3:null):o[0]==="live"&&(g=o[1]);let K=t.title.split(" - "),L=K[0],ot=K.slice(1).join(" - ")||"Direct";return{id:g,name:L,thumbnail:t.thumbnail,mediaContentId:i,currentProgram:{title:ot,description:n,start:S,end:N},nextProgram:null}}_getMolotovEntities(){return!this.hass||!this.hass.states?[]:Object.keys(this.hass.states).filter(t=>t.startsWith("media_player.molotov")).sort()}_getEntityId(){let t=this._getMolotovEntities();return t.length===0?null:t.length===1?t[0]:this._selectedEntityId&&t.includes(this._selectedEntityId)?this._selectedEntityId:t[0]}_handleEntityChange(t){let e=this._getEntityId();this._playing&&e&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState(),this._selectedEntityId=t.target.value,localStorage.setItem("molotov_selected_entity",this._selectedEntityId),this._hasLoadedChannels=!1,this._channels=[],this._recordings=[],this._tonightChannels=[],this._channelPrograms={},this._expandedChannels={},this._loadingPrograms={},this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this._expandedRecordings={},this._recordingEpisodes={},this._loadingRecordingEpisodes={},this._loadChannels()}async _toggleChannelExpand(t,e){t.stopPropagation();let i=e.id;if(this._expandedChannels[i]){this._expandedChannels={...this._expandedChannels,[i]:!1},this.requestUpdate();return}this._expandedChannels={...this._expandedChannels,[i]:!0},this._channelPrograms[i]||await this._fetchChannelPrograms(e),this.requestUpdate()}async _fetchChannelPrograms(t){let e=this._getEntityId();if(!e)return;let i=t.id;this._loadingPrograms={...this._loadingPrograms,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`channel:${i}`,media_content_type:"channel"});if(s&&s.children){let n=s.children.filter(o=>o.media_content_id.startsWith("replay:")).map(o=>this._parseReplayItem(o,t));this._channelPrograms={...this._channelPrograms,[i]:n}}}catch(s){console.error("[Molotov Panel] Failed to fetch channel replays:",s),this._channelPrograms={...this._channelPrograms,[i]:[]}}this._loadingPrograms={...this._loadingPrograms,[i]:!1},this.requestUpdate()}_parseReplayItem(t,e){let i=Be(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,channelName:e.name,description:i?.desc||null}}async _playReplay(t){let e=this._getEntityId();if(e){this._episodePlaylist=[],this._episodeIndex=-1,this._selectedChannel={name:t.channelName,currentProgram:{title:t.title,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play replay failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}}_handleSearchInput(t){this._searchQuery=t.target.value}_handleSearchKeydown(t){t.key==="Enter"&&this._performSearch()}async _performSearch(){let t=this._searchQuery.trim();if(!t)return;let e=this._getEntityId();if(!e)return;let i=++this._searchToken;this._searching=!0,this._showingSearch=!0,this._searchResults=[],this._expandedResults={},this._resultEpisodes={},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:`search:${encodeURIComponent(t)}`,media_content_type:"search"});if(i!==this._searchToken)return;if(s&&s.children){let n=s.children.filter(g=>g.media_content_id.startsWith("search_result:")).map(g=>this._parseSearchResult(g)),o=await this._filterResultsWithEpisodes(n,e,i);if(i!==this._searchToken)return;this._searchResults=o,console.log(`[Molotov Panel] Found ${this._searchResults.length} results with episodes for "${t}"`)}else this._searchResults=[]}catch(s){if(i!==this._searchToken)return;console.error("[Molotov Panel] Search failed:",s),this._searchResults=[]}i===this._searchToken&&(this._searching=!1,this.requestUpdate())}async _filterResultsWithEpisodes(t,e,i){let s=t.map(async o=>{try{let g=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:o.mediaContentId,media_content_type:"search_result"});if(g&&g.children){let S=this._parseEpisodeChildren(g.children);if(S.length>0)return(i===void 0||i===this._searchToken)&&(this._resultEpisodes={...this._resultEpisodes,[o.mediaContentId]:S}),o}return null}catch(g){return console.error(`[Molotov Panel] Failed to check episodes for "${o.title}":`,g),null}});return(await Promise.all(s)).filter(o=>o!==null)}_parseSearchResult(t){let e=Be(t.media_content_id);return{mediaContentId:t.media_content_id,title:t.title,thumbnail:t.thumbnail,mediaClass:t.media_class,description:e?.desc||null}}_clearSearch(){this._searchToken++,this._searchQuery="",this._searchResults=[],this._showingSearch=!1,this._expandedResults={},this._resultEpisodes={},this._loadingEpisodes={},this.requestUpdate()}async _toggleResultExpand(t,e){t.stopPropagation();let i=e.mediaContentId;if(this._expandedResults[i]){this._expandedResults={...this._expandedResults,[i]:!1},this.requestUpdate();return}this._expandedResults={...this._expandedResults,[i]:!0},this._resultEpisodes[i]||await this._fetchResultEpisodes(e),this.requestUpdate()}async _fetchResultEpisodes(t){let e=this._getEntityId();if(!e)return;let i=t.mediaContentId;this._loadingEpisodes={...this._loadingEpisodes,[i]:!0},this.requestUpdate();try{let s=await this.hass.callWS({type:"media_player/browse_media",entity_id:e,media_content_id:i,media_content_type:"search_result"});if(s&&s.children){let n=this._parseEpisodeChildren(s.children);this._resultEpisodes={...this._resultEpisodes,[i]:n},console.log(`[Molotov Panel] Found ${n.length} episodes for "${t.title}"`)}else this._resultEpisodes={...this._resultEpisodes,[i]:[]}}catch(s){console.error("[Molotov Panel] Failed to fetch episodes:",s),this._resultEpisodes={...this._resultEpisodes,[i]:[]}}this._loadingEpisodes={...this._loadingEpisodes,[i]:!1},this.requestUpdate()}_setEpisodePlaylist(t,e,i,s){for(let n of Object.values(i)){let o=n.findIndex(g=>g.mediaContentId===t.mediaContentId);if(o!==-1){this._episodePlaylist=n,this._episodeIndex=o,this._episodeParentTitle=e,this._episodeIsRecording=s;return}}this._episodePlaylist=[],this._episodeIndex=-1}async _playEpisode(t,e){let i=this._getEntityId();if(i){this._setEpisodePlaylist(t,e,this._resultEpisodes,!1),this._selectedChannel={name:"",currentProgram:{title:t.title||e,start:null,end:null}},this._playerError=null,this._isLive=!1,this._programStart=null,this._programEnd=null,this._liveDelay=0,this._initPlaybackFlags();try{let s=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:s,media_content_type:"video"})}catch(s){console.error("[Molotov Panel] Play episode failed:",s),this._playerError=s.message||"Erreur de lecture"}}}_syncWithEntity(){let t=this._getEntityId();if(!t||!this.hass?.states?.[t])return;let e=this.hass.states[t],s=(e.attributes.local_streams||{})[this._sessionId];if(s&&s.url&&this._localPlaybackInitiated){let n=s.url,o=s.drm,g=s.selected_track;if(!this._playing||this._currentStreamUrl!==n){this._currentStreamUrl=n,this._streamData={url:n,drm:o,selectedTrack:g,title:e.attributes.media_title||"En direct",breakSearch:{live_thumbnails_url:s.live_thumbnails_url,recording:s.recording,separated_breaks:s.separated_breaks}},this._playing=!0,this._localMinimized=!1,this._playerError=null,this._playerLoading=!0;let S=this._selectedChannel;S?.currentProgram?.start&&S?.currentProgram?.end?(this._isLive=!0,this._programStart=S.currentProgram.start,this._programEnd=S.currentProgram.end):(this._isLive=!0,this._programStart=null,this._programEnd=null),this.updateComplete.then(()=>this._initDashPlayer())}}else this._playing&&(this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1);if(e.attributes.active_casts&&Object.keys(e.attributes.active_casts).length>0){let n=e.attributes.active_casts,o=e.attributes.cast_target;this._activeCasts=n,this._focusedCastHost=o||null;let g=o?n[o]?.skip_to:null;this._castSkipTo=typeof g=="number"?g:null,(!this._castPlaying||this._castTarget!==o)&&(this._castPlaying=!0,this._castMinimized=this._isMobile,this._castLoading=!1,this._castTarget=o,this._castTitle=e.attributes.media_title||"En cours de lecture",this._startCastProgressUpdate(),console.log("[Molotov Panel] Cast playback detected:",o,"total casts:",Object.keys(n).length)),this._castPositionUpdatedAt=e.attributes.media_position_updated_at?new Date(e.attributes.media_position_updated_at).getTime()/1e3:null,this._castBasePosition=e.attributes.media_position||0,this._duration=e.attributes.media_duration||0,this._volume=e.attributes.volume_level??.5,this._muted=e.attributes.is_volume_muted||!1,this._paused=e.state==="paused",this._castTitle=e.attributes.media_title||this._castTitle,this._isLive=e.attributes.is_live||!1}else this._castPlaying&&(this._onPlaybackEnded()||(this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._castMinimized=!1,this._castLoading=!1,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate()))}async _playChannel(t){let e=this._getEntityId();if(!e){console.error("[Molotov Panel] No entity found");return}this._selectedChannel=t,this._playerError=null,this._episodePlaylist=[],this._episodeIndex=-1,this._initPlaybackFlags(),this._isLocalPlayback()&&t.currentProgram?.start&&t.currentProgram?.end&&(this._programStart=t.currentProgram.start,this._programEnd=t.currentProgram.end,this._isLive=!0);try{let i=this._buildPlayMediaId(t.mediaContentId);await this.hass.callService("media_player","play_media",{entity_id:e,media_content_id:i,media_content_type:"video"})}catch(i){console.error("[Molotov Panel] Play failed:",i),this._playerError=i.message||"Erreur de lecture",this._castLoading=!1}}async _initDashPlayer(){if(!this._streamData)return;let t=this.shadowRoot.querySelector("video");if(!t){console.error("[Molotov Panel] Video element not found");return}window.dashjs||await this._loadDashJs(),this._player&&(this._player.reset(),this._player=null),this._adSkip=null,this._adOffer=!1,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null);try{let e=window.dashjs.MediaPlayer().create();this._player=e,e.updateSettings({debug:{logLevel:window.dashjs.Debug.LOG_LEVEL_WARNING},streaming:{buffer:{stableBufferTime:6,bufferTimeAtTopQuality:30,bufferTimeAtTopQualityLongForm:60},delay:{liveDelay:3}}});let i=this._streamData.drm;i&&i.type==="widevine"&&(console.log("[Molotov Panel] Configuring Widevine DRM"),e.setProtectionData({"com.widevine.alpha":{serverURL:i.license_url,httpRequestHeaders:i.headers||{}}})),e.initialize(t,this._streamData.url,!0),this._adSkip=$i(this._adSkipEnv(t,e));let s=this._streamData.selectedTrack,n="fr";s?.track_audio&&(n=s.track_audio),e.setInitialMediaSettingsFor("audio",{lang:n}),s?.track_text&&e.setInitialMediaSettingsFor("text",{lang:s.track_text}),e.on(window.dashjs.MediaPlayer.events.ERROR,o=>{let g=o.error?.message||o.error||"Erreur de lecture";console.error("[Molotov Panel] Player error:",g),this._playerError=g,this._playerLoading=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.STREAM_INITIALIZED,()=>{console.log("[Molotov Panel] Stream initialized"),this._player===e&&this._adSkip&&this._adSkip.load({contentId:this._streamData.url},this._streamData.breakSearch),this._enforceAudioLanguage(e,s),this._updateTracks(),this._startProgressUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_STARTED,()=>{console.log("[Molotov Panel] Playback started"),this._showPlayOverlay=!1,this._playerLoading=!1,this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PAUSED,()=>{this._paused=!0,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_PLAYING,()=>{this._paused=!1,this.requestUpdate()}),e.on(window.dashjs.MediaPlayer.events.PLAYBACK_ENDED,()=>{console.log("[Molotov Panel] Playback ended"),this._onPlaybackEnded()}),t.volume=this._volume,t.muted=this._muted,this._autoplayCheckTimeout=setTimeout(()=>{this._autoplayCheckTimeout=null,t.paused&&!t.currentTime&&(console.log("[Molotov Panel] Autoplay blocked"),this._showPlayOverlay=!0,this.requestUpdate())},1500)}catch(e){console.error("[Molotov Panel] Failed to init player:",e),this._playerError=e.message}}_adSkipEnv(t,e){let i=()=>{try{let s=e.timeAsUTC();return typeof s=="number"&&isFinite(s)?s:null}catch{return null}};return{isLive:()=>{try{return e.isDynamic()}catch{return!1}},joining:()=>this._playerLoading,state:()=>t.paused?"paused":t.readyState>=2?"playing":"other",currentTime:()=>t.currentTime,liveRange:()=>t.seekable&&t.seekable.length?{start:t.seekable.start(0),end:t.seekable.end(t.seekable.length-1)}:null,absoluteTime:s=>{let n=i();return n===null?null:n+(s-t.currentTime)},mediaTime:s=>{let n=i();return n===null?null:t.currentTime+(s-n)},show:s=>(this._adOffer!==s&&(this._adOffer=s,this.requestUpdate()),s),seek:s=>{t.currentTime=s}}}_startProgressUpdate(){this._updateInterval&&clearInterval(this._updateInterval),this._updateInterval=setInterval(()=>{this._updateProgress()},1e3)}_updateProgress(){let t=this.shadowRoot?.querySelector("video");if(!(!t||!this._player)){if(this._currentTime=t.currentTime,this._duration=t.duration||0,this._paused=t.paused,this._adSkip&&this._adSkip.tick(),this._isLive&&t.seekable&&t.seekable.length>0){let e=t.seekable.end(t.seekable.length-1);this._liveDelay=Math.max(0,(e-t.currentTime)*1e3)}this.requestUpdate()}}_startCastProgressUpdate(){this._stopCastProgressUpdate(),this._castProgressInterval=setInterval(()=>{this._updateCastProgress()},1e3)}_stopCastProgressUpdate(){this._castProgressInterval&&(clearInterval(this._castProgressInterval),this._castProgressInterval=null)}_updateCastProgress(){if(!this._castPlaying){this._stopCastProgressUpdate();return}if(this._castBasePosition!=null&&this._castPositionUpdatedAt&&!this._paused){let t=Date.now()/1e3,e=Math.max(0,t-this._castPositionUpdatedAt);this._currentTime=this._castBasePosition+e}else this._currentTime=this._castBasePosition||0;this.requestUpdate()}_updateTracks(){if(!this._player)return;let t=this._player.getTracksFor("audio")||[];this._audioTracks=t.map((n,o)=>({index:o,lang:n.lang,label:Ni(n.lang)}));let e=this._player.getCurrentTrackFor("audio");e&&(this._selectedAudioIndex=t.findIndex(n=>n.index===e.index));let i=this._player.getTracksFor("text")||[];if(this._textTracks=i.map((n,o)=>({index:o,lang:n.lang,label:Ni(n.lang)})),!this._player.isTextEnabled())this._selectedTextIndex=-1;else{let n=this._player.getCurrentTrackFor("text");n&&(this._selectedTextIndex=i.findIndex(o=>o.index===n.index))}console.log("[Molotov Panel] Audio tracks:",this._audioTracks),console.log("[Molotov Panel] Text tracks:",this._textTracks),this.requestUpdate()}_enforceAudioLanguage(t,e){let i=t.getTracksFor("audio");if(!i||i.length===0)return;let n=t.getCurrentTrackFor("audio")?.lang||"",o="fr";if(e?.track_audio&&(o=e.track_audio),n!==o&&n!=="fra"&&n!=="fre"){let g=i.find(S=>S.lang===o||S.lang==="fra"||S.lang==="fre");!g&&(n==="en"||n==="eng"||n==="qaa")&&(g=i.find(S=>S.lang!=="en"&&S.lang!=="eng"&&S.lang!=="qaa")),g&&(console.log("[Molotov Panel] Switching audio to:",g.lang),t.setCurrentTrack(g))}}_loadDashJs(){return new Promise((t,e)=>{if(window.dashjs){t();return}let i=document.createElement("script");i.src="https://cdn.dashjs.org/v4.7.4/dash.all.min.js",i.crossOrigin="anonymous",i.onload=()=>{console.log("[Molotov Panel] dash.js loaded"),t()},i.onerror=()=>{e(new Error("Failed to load dash.js"))},document.head.appendChild(i)})}_cleanupPlayer(){if(this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null),this._autoplayCheckTimeout&&(clearTimeout(this._autoplayCheckTimeout),this._autoplayCheckTimeout=null),this._player){try{this._player.reset()}catch{}this._player=null}this._adSkip=null,this._adOffer=!1,this._audioTracks=[],this._textTracks=[],this._selectedAudioIndex=-1,this._selectedTextIndex=-1,this._playerLoading=!1}_stopPlayback(){let t=this._getEntityId();t&&this.hass&&this.hass.callService("media_player","play_media",{entity_id:t,media_content_id:`stop_local:${this._sessionId}`,media_content_type:"video"}),this._resetLocalPlaybackState()}_resetLocalPlaybackState(){this._cleanupPlayer(),this._playing=!1,this._streamData=null,this._selectedChannel=null,this._currentStreamUrl=null,this._localPlaybackInitiated=!1,this._localMinimized=!1,this._episodePlaylist=[],this._episodeIndex=-1}_onPlaybackEnded(){if(this._episodePlaylist.length===0||this._episodeIndex<0)return!1;let t=this._episodeIndex+1;if(t>=this._episodePlaylist.length)return this._episodePlaylist=[],this._episodeIndex=-1,!1;let e=this._episodePlaylist[t];return this._episodeIndex=t,console.log(`[Molotov Panel] Auto-playing next episode: ${e.title}`),this._episodeIsRecording?this._playRecordingEpisode(e,this._episodeParentTitle):this._playEpisode(e,this._episodeParentTitle),!0}_goBackFromPlayer(){this._localMinimized=!0,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null)}_goBackFromCast(){this._castMinimized=!0}_expandCurrentPlayback(){this._playing&&this._streamData?(this._localMinimized=!1,this._updateInterval||this._startProgressUpdate()):this._castPlaying&&(this._castMinimized=!1)}_togglePlayPause(){let t=this.shadowRoot.querySelector("video");t&&(t.paused?t.play():t.pause())}_localSeek(t){let e=this.shadowRoot.querySelector("video");if(!e)return;if(t===null){e.currentTime=0;return}let i=e.currentTime+t;e.currentTime=Math.max(0,Math.min(e.duration||1/0,i))}_localSeekBeginning(){this._localSeek(null)}_localSkipBack30(){this._localSeek(-30)}_localSkipBack10(){this._localSeek(-10)}_localSkipForward30(){this._localSeek(30)}_localSkipAd(){this._adSkip&&this._adSkip.skip()}_handleProgressClick(t){let i=t.currentTarget.getBoundingClientRect(),s=(t.clientX-i.left)/i.width;if(this._isLive&&this._programStart&&this._programEnd){if(this._player?.getDVRSeekOffset?.(0)!==void 0){let o=this._player.duration(),g=s*o;this._player.seek(g)}}else if(this._duration){let n=this.shadowRoot.querySelector("video");n&&(n.currentTime=s*this._duration)}}_handleVolumeChange(t){let e=parseFloat(t.target.value);this._volume=e;let i=this.shadowRoot.querySelector("video");i&&(i.volume=e,i.muted=e===0,this._muted=e===0)}_toggleMute(){let t=this.shadowRoot.querySelector("video");t&&(this._muted=!this._muted,t.muted=this._muted,this.requestUpdate())}_selectAudioTrack(t){if(!this._player||t<0||t>=this._audioTracks.length)return;let e=this._player.getTracksFor("audio");e&&e[t]&&(this._player.setCurrentTrack(e[t]),this._selectedAudioIndex=t),this._showAudioMenu=!1,this.requestUpdate()}_selectTextTrack(t){if(this._player){if(t===-1)this._player.enableText(!1),this._selectedTextIndex=-1;else if(t>=0&&t<this._textTracks.length){let e=this._player.getTracksFor("text");e&&e[t]&&(this._player.enableText(!0),this._player.setCurrentTrack(e[t]),this._selectedTextIndex=t)}this._showTextMenu=!1,this.requestUpdate()}}_toggleAudioMenu(t){t.stopPropagation(),this._showAudioMenu=!this._showAudioMenu,this._showTextMenu=!1,this.requestUpdate()}_toggleTextMenu(t){t.stopPropagation(),this._showTextMenu=!this._showTextMenu,this._showAudioMenu=!1,this.requestUpdate()}_toggleFullscreen(){let t=this.shadowRoot.querySelector(".video-wrapper");t&&(document.fullscreenElement?document.exitFullscreen():t.requestFullscreen().catch(e=>{console.error("[Molotov Panel] Fullscreen error:",e)}))}_onFullscreenChange(){this._isFullscreen=!!document.fullscreenElement,this.requestUpdate()}_handlePlayOverlayClick(){let t=this.shadowRoot.querySelector("video");t&&(t.muted=!1,t.play().catch(e=>console.error("[Molotov Panel] Manual play error:",e)),this._showPlayOverlay=!1,this.requestUpdate())}_formatTime(t){if(!t||!isFinite(t))return"00:00";let e=Math.floor(t/3600),i=Math.floor(t%3600/60),s=Math.floor(t%60);return e>0?`${e}:${i.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`:`${i}:${s.toString().padStart(2,"0")}`}_formatClockTime(t){return t?new Date(t).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):""}_getProgressPercent(){if(this._isLive&&this._programStart&&this._programEnd){let t=Date.now()-(this._liveDelay||0),e=this._programEnd-this._programStart;if(e<=0)return 100;let i=t-this._programStart;return Math.min(100,Math.max(0,i/e*100))}else if(this._duration>0&&isFinite(this._duration))return this._currentTime/this._duration*100;return 0}render(){let t=this._playing&&this._streamData,e=t&&!this._localMinimized,i=this._castPlaying&&!this._castMinimized,s=!e&&!i;return x`
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
    `}_renderTonightProgram(t,e){let i=this._formatClockTime(t.start),s=this._formatClockTime(t.end),n=Date.now(),o=t.start<=n&&t.end>n,g=t.end<=n;return x`
      <div
        class="tonight-program ${o?"live":""} ${g?"past":""}"
        role="button"
        tabindex="0"
        @click=${()=>this._playTonightProgram(t,e)}
        @keydown=${S=>this._activateOnKey(S,()=>this._playTonightProgram(t,e))}
      >
        ${t.thumbnail?x`<img class="tonight-program-thumb" src=${t.thumbnail} loading="lazy" @load=${S=>S.target.style.display=""} @error=${S=>S.target.style.display="none"} />`:""}
        <div class="tonight-program-info">
          <div class="tonight-program-time">
            ${i} - ${s}
            ${o?x`<span class="live-indicator">EN DIRECT</span>`:""}
          </div>
          <div class="tonight-program-title">${t.title}</div>
          ${t.description?x`<div class="tonight-program-description">${t.description}</div>`:""}
        </div>
      </div>
    `}_activateOnKey(t,e){(t.key==="Enter"||t.key===" "||t.key==="Spacebar")&&(t.preventDefault(),e())}_tonightToProgramId(t){let e=t.split(":");return e[0]!=="tonight_program"||e.length<6?t:`program:${e[1]}:${e[4]}:${e[5]}`}async _playTonightProgram(t,e){let i=this._getEntityId();if(!i)return;this._episodePlaylist=[],this._episodeIndex=-1;let s=this._tonightToProgramId(t.mediaContentId);this._selectedChannel={id:e.id,name:e.name,thumbnail:e.thumbnail,mediaContentId:s,currentProgram:{title:t.title,start:t.start,end:t.end}},this._playerError=null;let n=Date.now();this._isLive=t.start<=n&&t.end>n,this._isLive?(this._programStart=t.start,this._programEnd=t.end):(this._programStart=null,this._programEnd=null),this._initPlaybackFlags();try{let o=this._buildPlayMediaId(s);await this.hass.callService("media_player","play_media",{entity_id:i,media_content_id:o,media_content_type:"video"})}catch(o){console.error("[Molotov Panel] Play tonight program failed:",o),this._playerError=o.message||"Erreur de lecture",this._castLoading=!1}}_renderRecordingItem(t){let e=t.mediaContentId,i=this._expandedRecordings[e],s=this._recordingEpisodes[e]||[],n=this._loadingRecordingEpisodes[e],o=this._recordingEpisodes[e]!==void 0,g=!t.isFolder||o&&s.length<=1;return x`
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
          @click=${o=>this._toggleResultExpand(o,t)}
          @keydown=${o=>this._activateOnKey(o,()=>this._toggleResultExpand(o,t))}
        >
          <ha-icon
            class="expand-icon ${i?"expanded":""}"
            icon="mdi:chevron-right"
          ></ha-icon>
          ${t.thumbnail?x`<img class="search-result-thumb" src=${t.thumbnail} loading="lazy" @load=${o=>o.target.style.display=""} @error=${o=>o.target.style.display="none"} />`:""}
          <div class="search-result-info">
            <div class="search-result-title">${t.title}</div>
            ${t.description?x`<div class="search-result-subtitle">${t.description}</div>`:""}
          </div>
        </div>
        ${i?x`
              <div class="episodes-list">
                ${n?x`<div class="episodes-loading">Chargement des episodes...</div>`:s.length>0?s.map(o=>x`
                        <div
                          class="episode-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playEpisode(o,t.title)}
                          @keydown=${g=>this._activateOnKey(g,()=>this._playEpisode(o,t.title))}
                        >
                          ${o.thumbnail?x`<img class="episode-thumb" src=${o.thumbnail} loading="lazy" @load=${g=>g.target.style.display=""} @error=${g=>g.target.style.display="none"} />`:""}
                          <div class="episode-info">
                            <div class="episode-title">${o.title}</div>
                            ${o.description?x`<div class="episode-desc">${o.description}</div>`:""}
                          </div>
                        </div>
                      `):x`<div class="episodes-empty">Aucun episode disponible</div>`}
              </div>
            `:""}
      </div>
    `}_renderChannelItem(t){let e=t.currentProgram,i=e?.start?this._formatClockTime(e.start):"",s=e?.end?this._formatClockTime(e.end):"",n=i&&s?`${i} - ${s}`:"",o=this._expandedChannels[t.id],g=this._channelPrograms[t.id]||[],S=this._loadingPrograms[t.id];return x`
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
              class="replay-btn ${o?"expanded":""}"
              @click=${N=>this._toggleChannelExpand(N,t)}
            >
              <ha-icon icon="mdi:history"></ha-icon>
              Replay
            </button>
          </div>
        </div>
        ${o?x`
              <div class="replay-list">
                ${S?x`<div class="replay-loading">Chargement...</div>`:g.length>0?g.map(N=>x`
                        <div
                          class="replay-item"
                          role="button"
                          tabindex="0"
                          @click=${()=>this._playReplay(N)}
                          @keydown=${K=>this._activateOnKey(K,()=>this._playReplay(N))}
                        >
                          ${N.thumbnail?x`<img class="replay-thumb" src=${N.thumbnail} loading="lazy" @load=${K=>K.target.style.display=""} @error=${K=>K.target.style.display="none"} />`:""}
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
        ${t.map(([e,i])=>{let s=e===this._focusedCastHost,n=i.title||e,o=i.state==="playing";return x`
            <div
              class="cast-chip ${s?"focused":""}"
              role="button"
              tabindex="0"
              @click=${()=>this._focusCast(e)}
              @keydown=${g=>this._activateOnKey(g,()=>this._focusCast(e))}
            >
              <span class="chip-icon">
                <ha-icon icon=${o?"mdi:cast-connected":"mdi:cast"} style="--mdc-icon-size: 18px;"></ha-icon>
              </span>
              <span>${n}</span>
              <span class="chip-stop" @click=${g=>this._stopSpecificCast(g,e)}>
                <ha-icon icon="mdi:close" style="--mdc-icon-size: 16px;"></ha-icon>
              </span>
            </div>
          `})}
      </div>
    `}async _focusCast(t){let e=this._getEntityId();if(!e)return;let i=this._activeCasts[t];if(!i)return;let s=t;try{await this.hass.callService("media_player","select_source",{entity_id:e,source:s}),this._focusedCastHost=t,this._castTarget=t,this._castTitle=i.title||"En cours de lecture",console.log("[Molotov Panel] Focused cast:",t)}catch(n){console.error("[Molotov Panel] Focus cast failed:",n)}}async _stopSpecificCast(t,e){t.stopPropagation();let i=this._getEntityId();if(!i||!this._activeCasts[e])return;let n=e;try{await this.hass.callService("media_player","select_source",{entity_id:i,source:n}),await new Promise(o=>setTimeout(o,200)),await this.hass.callService("media_player","media_stop",{entity_id:i}),console.log("[Molotov Panel] Stopped cast:",e)}catch(o){console.error("[Molotov Panel] Stop specific cast failed:",o)}}async _stopCastPlayback(){let t=this._getEntityId();if(t){try{await this.hass.callService("media_player","media_stop",{entity_id:t})}catch(e){console.error("[Molotov Panel] Stop cast failed:",e)}this._castPlaying=!1,this._castTarget=null,this._castTitle=null,this._activeCasts={},this._focusedCastHost=null,this._castSkipTo=null,this._stopCastProgressUpdate(),this._castMinimized=!1,this._castLoading=!1,this._episodePlaylist=[],this._episodeIndex=-1}}async _toggleCastPlayPause(){let t=this._getEntityId();if(t)try{this._paused?await this.hass.callService("media_player","media_play",{entity_id:t}):await this.hass.callService("media_player","media_pause",{entity_id:t})}catch(e){console.error("[Molotov Panel] Play/pause cast failed:",e)}}async _castSkipForward(){let t=this._getEntityId();if(t)try{await this.hass.callService("media_player","media_next_track",{entity_id:t})}catch(e){console.error("[Molotov Panel] Skip forward failed:",e)}}_setCastPosition(t){this._currentTime=t,this._castBasePosition=t,this._castPositionUpdatedAt=Date.now()/1e3}async _castSeek(t){let e=this._getEntityId();if(e)try{await this.hass.callService("media_player","media_seek",{entity_id:e,seek_position:t}),this._setCastPosition(t)}catch(i){console.error("[Molotov Panel] Cast seek failed:",i)}}async _castSeekBeginning(){await this._castSeek(0)}async _castSkipBack30(){await this._castSeek(Math.max(0,this._currentTime-30))}async _castSkipBack10(){await this._castSeek(Math.max(0,this._currentTime-10))}async _castSkipAd(){this._castSkipTo!==null&&await this._castSeek(this._castSkipTo)}async _handleCastSeek(t){let e=this._getEntityId();if(!e||!this._duration)return;let s=t.currentTarget.getBoundingClientRect(),o=(t.clientX-s.left)/s.width*this._duration;try{await this.hass.callService("media_player","media_seek",{entity_id:e,seek_position:o}),this._setCastPosition(o)}catch(g){console.error("[Molotov Panel] Seek failed:",g)}}async _handleCastVolumeChange(t){let e=this._getEntityId();if(!e)return;let i=parseFloat(t.target.value);this._volume=i;try{await this.hass.callService("media_player","volume_set",{entity_id:e,volume_level:i})}catch(s){console.error("[Molotov Panel] Volume change failed:",s)}}async _toggleCastMute(){let t=this._getEntityId();if(t)try{await this.hass.callService("media_player","volume_mute",{entity_id:t,is_volume_muted:!this._muted}),this._muted=!this._muted}catch(e){console.error("[Molotov Panel] Mute toggle failed:",e)}}};customElements.define("molotov-panel",hi);console.log(`[Molotov Panel] Registered - v${Li}`);
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
