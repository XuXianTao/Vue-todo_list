import Vue from 'vue'
import App from './app.vue'

import './assets/styles/global.styl'
const root = document.createElement('div')
document.body.appendChild(root)
Vue.config.devtools = true;

new Vue({
  render: (h) => h(App)
}).$mount(root)

//生命周期，模块什么时候生成
//Reactive是指template引用的是script中return的data内容
//Computed是reactive更深度的引用，是指用户修改数据的时候计算生成再修改
