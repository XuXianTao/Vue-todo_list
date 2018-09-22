<template>
  <section class="real-app">
    <input 
      type="text"
      class="add-input"
      autocis="autofocus"
      placeholder="接下去要做什么？"
      @keyup.enter="addTodo"
    >
    <!-- 使用@keyup 是vue 中v-on:keyup渐变写法就是@keyup,
    之后的.enter表示敲了enter之后才会调用enter -->
    <item
      :todo="todo"
      v-for= "todo in filteredTodos"
      :key="todo.id"
      @del="deleteTodo"
      />
    
    <!-- 所需参数:todo等于data()的todo -->
    <tabs 
      :filter="filter" 
      :todos="todos"
      @toggle="toggleFilter"
      @clearAllCompleted = "clearAllCompleted"
    />
  </section>
</template>

<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
let id =0;
export default {
  data() {
    return {
      todos: [],
      filter: 'all'
    }
  },
  components: {
    Item,
    Tabs
  },
  computed: {
    filteredTodos() {
      if (this.filter === 'all') {
        return this.todos;
      }
      const completed = this.filter === 'completed';
      return this.todos.filter(todo => completed === todo.completed)
    }
  },
  methods: {
    addTodo(e) {
      this.todos.unshift({
        id: id++,
        content: e.target.value.trim(),
        completed: false
      })
      e.target.value = ''
    },
    deleteTodo(id) {
      this.todos.splice(this.todos.findIndex(todo=>todo.id===id), 1)
    },
    toggleFilter(state) {
      this.filter = state
    },
    clearAllCompleted() {
      this.todos = this.todos.filter(item=>!item.completed)
    }
  }
}
</script>

<style lang="stylus" scoped>
item_height = 50px
.real-app
  position: relative
  width 70%
  margin 0 auto 
  box-shadow 0 0 5px #666
  .add-input
    width 100%
    padding 10px 20px+item_height
    box-sizing border-box
    border none
    font-size 30px
    background-color white
</style>
