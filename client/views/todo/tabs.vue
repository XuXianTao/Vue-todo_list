<template>
  <div class="helper">
    <span class="left">{{unFinishedTodoLength}} items left</span> 
    <span class="tabs">
      <span 
        v-for="state in states"
        :key="state"
        :class="['state', filter === state ? 'actived' : '']"
        @click="toggleFilter(state)"
      >
      <!-- key作用是复用节点内容加快速度 -->
        {{state}}
      </span>
    </span>
    <span class="clear" @click="clearAllCompleted">Clear Completed</span>
  </div>
</template>

<script>
export default {
  // props传进来的数值
  props: {
    filter: {
      type: String,
      required: true,
    },
    todos: {
      type: Array,
      requierd: true
    }
  },
  data() {
    return {
      states: ['all', 'active', 'completed']
    }
  },
  computed: {
    unFinishedTodoLength() {
      return this.todos.filter(todo=>!todo.completed).length;
    }
  },
  methods: {
    clearAllCompleted() {
      this.$emit('clearAllCompleted')
    },
    toggleFilter(state) {
      this.$emit('toggle', state)
    }
  }
}
</script>

<style lang="stylus">
.helper
  background-color: white
  padding-left: 10px
  padding-right: 10px
  border-top: 1px solid rgba(140, 140, 140, .1)
  font-size: 20px
  line-height: 40px
  text-align: center
  color: gray
  line-height 60px
  vertical-align middle
  .left
    float: left 
  .clear
    float: right 
    cursor pointer
  .tabs
    display: inline-block
    margin: 0 auto 
    cursor pointer
    word-spacing 1px
    .state
      margin: 5px 10px
      padding: 5px 10px
      box-sizing: border-box
      border: 1px solid transparent
    .actived 
      border: 1px solid rgba(150, 0, 0, .5)
      border-radius 5px

</style>
