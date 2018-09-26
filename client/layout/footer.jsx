import '../assets/styles/footer.styl'

export default {
  data() {
    return {
      author: 'XXT'
    }
  },
  render() {
    return (
      //jsx可以直接使用js的一些函数完成自己的想法，不想v-for这类标签的功能是template写死的
      <div id="footer">
        <span>Written by {this.author}</span>
      </div>
    )
  }
}
