(()=>{var e={};e.id=888,e.ids=[888],e.modules={530:(e,r,t)=>{"use strict";t.d(r,{z:()=>i});var s=t(997);t(6689);let i=({as:e="button",variant:r="default",size:t="medium",children:i,className:n="",...l})=>s.jsx(e,{className:`px-4 py-2 rounded ${{default:"bg-blue-500 text-white hover:bg-blue-600",outline:"border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",link:"text-blue-500 hover:underline"}[r]} ${{small:"text-sm",medium:"text-base",large:"text-lg"}[t]} ${n}`,...l,children:i})},4416:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>u});var s=t(997);let i=require("next-i18next");t(108);var n=t(6689),l=t.n(n),a=t(1664),c=t.n(a),o=t(530);let d=()=>(0,s.jsxs)("header",{className:"flex justify-between items-center p-4 bg-green-500 text-white",children:[s.jsx("h1",{className:"text-xl font-bold",children:"Pomodoro Timer"}),(0,s.jsxs)("nav",{className:"space-x-4",children:[s.jsx(c(),{href:"/",passHref:!0,children:s.jsx(o.z,{variant:"link",children:"ホーム"})}),s.jsx(c(),{href:"/faq",passHref:!0,children:s.jsx(o.z,{variant:"link",children:"FAQ"})}),s.jsx(c(),{href:"/contact-us",passHref:!0,children:s.jsx(o.z,{variant:"link",children:"お問い合わせ"})})]})]}),x=()=>s.jsx("footer",{className:"flex justify-center items-center p-4 bg-gray-200 text-gray-700",children:s.jsx("p",{children:"\xa9 2024 Pomodoro Timer. All rights reserved."})});class h extends l().Component{constructor(e){super(e),this.state={hasError:!1,error:null}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,r){console.error("Uncaught error:",e,r)}render(){return this.state.hasError?s.jsx("div",{className:"flex items-center justify-center h-screen bg-gray-100",children:(0,s.jsxs)("div",{className:"text-center p-4 bg-white rounded shadow",children:[s.jsx("h1",{className:"text-2xl font-bold mb-4",children:"アプリケーションでエラーが発生しました。"}),s.jsx("p",{className:"text-lg",children:"ページをリロードするか、後ほど再度お試しください。"}),this.state.error&&s.jsx("pre",{className:"mt-4 text-left",children:this.state.error.toString()})]})}):this.props.children}}let u=(0,i.appWithTranslation)(function({Component:e,pageProps:r}){return(0,s.jsxs)(h,{children:[s.jsx(d,{}),s.jsx(e,{...r}),s.jsx(x,{})]})})},108:()=>{},2785:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/pages.runtime.prod.js")},6689:e=>{"use strict";e.exports=require("react")},997:e=>{"use strict";e.exports=require("react/jsx-runtime")}};var r=require("../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[977,664],()=>t(4416));module.exports=s})();