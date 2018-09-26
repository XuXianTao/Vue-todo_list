<!-- 在template标签下必须有单独一个大节点，不能有两个或以上的节点会报错 -->
<template>
  <div id="app">
    <div id="cover"></div>
    <Header></Header>
    <todo></todo>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './layout/header.vue'
import Footer from './layout/footer.jsx'
import Todo from './views/todo/todo.vue'
export default {
  components: {//申明使用Header组件,注意别用成函数形式
    Header,//不用小写header，可能与原生html标签存在冲突，可能就不用模板了，用大小写区分也可以
    Footer,
    Todo
  },
  // render() {
  //   createElement()//遍历template进入创建节点
  // }
}
</script>

<style lang="stylus" scoped>
#app
  position absolute
  left 0
  top 0
  right 0
  bottom 0
  background-image url('./assets/images/bg.png')
  background-size cover
  transform translateZ(0)
  #cover
    position absolute
    left 0
    top 0
    right 0
    bottom 0
    background-color: #aaaa
    z-index: 0
</style>
