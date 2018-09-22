<template>
  <div :class="['todo-item', todo.completed ? 'completed': '']">
    <!-- 动态绑定class，vmodel写法,内部可以写数组也可以是object -->
    <label class="toggle">
    <input 
      type="checkbox"
      v-model="todo.completed"
    ><span>{{todo.content}}</span></label>
    <button class="destory" @click="deleteTodo"></button>
  </div>
</template>

<script>
export default {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: {
    deleteTodo() {
      // 触发函数返回给父级组件，实现父子组件的事件解耦
      this.$emit('del', this.todo.id);
    }
  }
}
</script>

<style lang="stylus" scoped>
item_height = 50px
.todo-item
  width 100%
  padding 10px 20px
  box-sizing border-box
  background-image linear-gradient(to right, transparent 0%, rgba(140, 140, 140, .1) 50%, transparent 100%)
  background-size 100% 2px
  background-repeat-y no-repeat 
  background-color white
  font-size 30px
  .toggle
    line-height item_height
    vertical-align middle
    input 
      display: none
      &:checked
        &+span:before
          content: '\2714'
        &,&+span 
          text-decoration: line-through
          color: gray
      &+span:before
        content: '\00A0'
        display inline-block
        width item_height
        height item_height
        margin-right 10px
        background-color white
        border-radius (item_height / 2)
        border solid 1px rgba(140, 140, 140, .5) 
        font-size item_height
        text-indent 5px
  .destory
    ch_color = #BC8F8F
    shadow_color = darken(ch_color, 50)
    float right
    width item_height 
    height item_height 
    background-color transparent
    box-shadow none
    border none
    outline none
    &:focus
      &:after
        text-shadow 0 0 5px shadow_color
    &:active
      &:after
        text-shadow 0 0 15px shadow_color
    &:after
      content '\2716'
      font-size item_height
      text-shadow none
      color ch_color



      
</style>

