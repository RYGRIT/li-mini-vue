import { h } from "../../lib/mini-vue.esm.js"
export const App = {
  // .vue
  // render 
  render() {
    // 返回一个虚拟结点
    return h("div", {
      id: "root",
      class: ["red", "hard"]
    }, 
    "hi, " + this.msg
    // string
    // "hi, mini-vue"
    // array
    // [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")]
    )
  },
  setup() {
    return {
      msg: "mini-vue"
    }
  }
}
