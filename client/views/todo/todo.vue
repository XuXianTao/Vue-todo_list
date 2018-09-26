<template>
  <section class="real-app">
    <input 
      type="text"
      class="add-input"
      autocis="autofocus"
      placeholder="接下去要做什么？"
      @keyup.enter="addTodo"
      v-model= "todo_add"
    >
    <input 
      type="button"
      class="add-input__button"
      :value="todo_add_button"
      @click="addTodo"
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
      todo_add: '',
      todo_add_button: 'DO:' + (this.todo_add?this.todo_add:''),
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
        content: this.todo_add.trim(),
        completed: false
      })
      e.target.value = ''
      this.todo_add = ''
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
  },
  beforeUpdate(){
    this.todo_add_button = 'DO:' + this.todo_add;
  }
}
</script>

<style lang="stylus" scoped>
item_height = 50px
.real-app
  position: relative
  width 70%
  margin 20px auto 
  box-shadow 0 0 5px #666
  .add-input
    width 100%
    height item_height
    padding 10px 20px+item_height
    box-sizing border-box
    border none
    font-size 30px
    background-color white
    &__button 
      position absolute 
      top 0
      right 0
      width 200px
      height item_height
      border none
      background-color #33CCFF
      font-size 25px
      font-weight bold
      color white
</style>
