import { h } from "../../lib/mini-vue.esm.js"
import { Foo } from "./Foo.js"

window.self = null
export const App = {
  name: "App",
  // .vue
  // render 
  render() {
    window.self = this
    // 返回一个虚拟结点
    return h("div", {
      id: "root",
      class: ["red", "hard"],
      onClick() {
        console.log("click")
      },
      onMousedown() {
        console.log("mousedown")
      }
    }, 
    [h("div", {}, "hi, " + this.msg), h(Foo, {
      count: 1,
    })]
    // setupState
    // this.$el -> get root element
    // "hi, " + this.msg
    // string
    // "hi, mini-vue"
    // array
    // [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")]
    )
  },
  setup() {
    return {
      msg: "mini-vue, hhhhh"
    }
  }
}
