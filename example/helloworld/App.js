export const App = {
  // .vue
  // render 
  render() {
    // 返回一个虚拟结点
    return h("div", "hi, " + this.msg)
  },
  setup() {
    return {
      msg: "mini-vue"
    }
  }
}
