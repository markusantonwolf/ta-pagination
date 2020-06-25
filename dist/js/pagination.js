"use strict";function _slicedToArray(t,i){return _arrayWithHoles(t)||_iterableToArrayLimit(t,i)||_unsupportedIterableToArray(t,i)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(t,i){if(t){if("string"==typeof t)return _arrayLikeToArray(t,i);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(t,i):void 0}}function _arrayLikeToArray(t,i){(null==i||i>t.length)&&(i=t.length);for(var n=0,e=new Array(i);n<i;n++)e[n]=t[n];return e}function _iterableToArrayLimit(t,i){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var n=[],e=!0,a=!1,s=void 0;try{for(var r,o=t[Symbol.iterator]();!(e=(r=o.next()).done)&&(n.push(r.value),!i||n.length!==i);e=!0);}catch(t){a=!0,s=t}finally{try{e||null==o.return||o.return()}finally{if(a)throw s}}return n}}function _arrayWithHoles(t){if(Array.isArray(t))return t}function pagination(){return{page:1,pagination:5,elements:[],visible:[],initialized:!1,is_expand:!1,is_shrink:!1,has_next:!1,has_previous:!1,animating:!1,default:{page:1,pagination:5,content:"content",navigation:"navigation",item:"pagination__item",animation:"pagination__anim",hidden:"pagination__item--hidden",visible:"pagination__item--visible",lazy:"pagination__lazy",breakpoint:"640",breakpoint_pagination:"2"},init:function(t){var i=this;if(void 0!==t)for(var n=0,e=Object.entries(t);n<e.length;n++){var a=_slicedToArray(e[n],2),s=a[0],r=a[1];this.default[s]=r}this.page=this.default.page,this.pagination=this.default.pagination,this.visible=this.getVisibleElements();var o=0;this.$refs[this.default.content].querySelectorAll("."+this.default.item).forEach((function(t){i.visible.includes(o)||t.classList.add(i.default.hidden),i.elements.push(t),o++})),this.$nextTick((function(){i.checkMaxHeight()})),window.addEventListener("resize",(function(){i.$el.style.setProperty("--".concat(i.default.content,"-height"),""),i.$el.style.setProperty("--".concat(i.default.navigation,"-height"),""),i.checkMaxHeight(),i.checkWindowWidth()})),this.$watch("animating",(function(t){!0===t?(i.is_expand=!1,i.is_shrink=!1,i.has_next=!1,i.has_previous=!1):(i.checkExpand(),i.checkNavigation())})),this.checkExpand(),this.checkNavigation(),this.checkWindowWidth(),this.checkLazyLoading(),this.initialized=!0},getVisibleElements:function(){for(var t=[],i=0;i<this.pagination;i++){var n=(this.page-1)*this.pagination+i;t.push(n)}return t},checkMaxHeight:function(){var t=0;this.elements.forEach((function(i){t<i.offsetHeight&&(t=i.offsetHeight)})),this.$el.style.setProperty("--".concat(this.default.content,"-height"),"".concat(t,"px"));var i=0;void 0===this.$refs[this.default.navigation]?console.info('x-ref="'+this.default.navigation+'" is not defined'):(i=this.$refs[this.default.navigation].offsetHeight,this.$el.style.setProperty("--".concat(this.default.navigation,"-height"),"".concat(i,"px")))},checkLazyLoading:function(){var t=this;this.elements.forEach((function(i){for(var n=i.getElementsByTagName("img"),e=function(i){if(void 0===n[i].dataset.src)return"continue";(s=new Image).onload=function(e){n[i].src=n[i].dataset.src,n[i].classList.remove(t.default.lazy)},s.src=n[i].dataset.src},a=0;a<n.length;a++){var s;e(a)}}))},checkWindowWidth:function(){var t=this;window.innerWidth<=parseInt(this.default.breakpoint)?this.pagination=parseInt(this.default.breakpoint_pagination):this.pagination=this.default.pagination,this.visible=this.getVisibleElements(),this.elements.forEach((function(i,n){t.visible.includes(n)?(i.classList.remove(t.default.hidden),i.classList.add(t.default.visible)):(i.classList.add(t.default.hidden),i.classList.remove(t.default.visible))}))},startExpand:function(){var t=this,i=this.visible,n=this.default.animation+"--expand";this.elements.forEach((function(e,a){i.includes(a)||(e.classList.remove(t.default.hidden),e.classList.add(n),t.animating=!0,e.addEventListener("animationend",(function(i){i.target.classList.remove(n),t.animating=!1,t.is_expand=!0,t.is_shrink=!1}),{once:!0}))}))},startShrink:function(){var t=this;this.visible=this.getVisibleElements();var i=this.default.animation+"--shrink",n=0;this.elements.forEach((function(e,a){t.visible.includes(n)||(e.classList.add(i),t.animating=!0,e.addEventListener("animationend",(function(n){t.animationEnd(n.target,"hide",i),t.animating=!1,t.is_shrink=!0,t.is_expand=!1}),{once:!0})),n++}))},startOut:function(t){var i=this,n=this.visible;this.visible=this.getVisibleElements();var e=this.default.animation+"--out-"+t;this.elements.forEach((function(a,s){n.includes(s)&&(i.animating=!0,a.classList.add(e),a.addEventListener("animationend",(function(n){i.animationEnd(n.target,"hide",e),i.animating=!1,i.startIn(t)}),{once:!0}))}))},startIn:function(t){var i=this,n="pagination__anim--in-"+t;this.elements.forEach((function(t,e){i.visible.includes(e)&&(t.classList.remove(i.default.hidden),t.classList.add(n),i.animating=!0,t.addEventListener("animationend",(function(t){i.animating=!1,i.animationEnd(t.target,"show",n)}),{once:!0}))}))},animationEnd:function(t,i,n){t.classList.remove(n),"hide"===i?(t.classList.remove(this.default.visible),t.classList.add(this.default.hidden)):(t.classList.remove(this.default.hidden),t.classList.add(this.default.visible))},checkNavigation:function(){(this.page-1)*this.pagination+this.pagination>=this.elements.length?this.has_next=!1:this.has_next=!0,this.page<=1?this.has_previous=!1:this.has_previous=!0},checkExpand:function(){this.pagination===this.elements.length?(this.is_expand=!0,this.is_shrink=!1):(this.is_expand=!1,this.is_shrink=!0)},next:function(){this.page++,this.startOut("right")},end:function(){this.page=Math.ceil(this.elements.length/this.pagination),this.startOut("right")},previous:function(){this.page--,this.startOut("left")},start:function(){this.page=1,this.startOut("left")},expand:function(){this.page=1,this.pagination=this.elements.length,this.startExpand()},shrink:function(){this.page=1,this.pagination=this.default.pagination,this.startShrink()}}}