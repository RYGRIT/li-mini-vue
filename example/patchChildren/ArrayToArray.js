import {ref, h} from "../../lib/mini-vue.esm.js"

// 1.左侧的对比
// (a b) c
// (a b) d e
// const prevChildren = [
//   h("p", {key: "A"}, "A"),
//   h("p", {key: "B"}, "B"),
//   h("p", {key: "C"}, "C")
// ]

// const nextChildren = [
//   h("p", {key: "A"}, "A"),
//   h("p", {key: "B"}, "B"),
//   h("p", {key: "D"}, "D"),
//   h("p", {key: "E"}, "E")
// ]

// 2.右侧的对比
// a (b c)
// d e (b c)
const prevChildren = [
 h("p", {key: "A"}, "A"),
 h("p", {key: "B"}, "B"),
 h("p", {key: "C"}, "C")
]

const nextChildren = [
 h("p", {key: "D"}, "D"),
 h("p", {key: "E"}, "E"),
 h("p", {key: "B"}, "B"),
 h("p", {key: "C"}, "C")
]

// 3. 新的比老的长
// 创建新的
// 左侧
// (a b)
// (a b) c
// i = 2, e2 = 1, e2 = 2
// const prevChildren = [h("p", {key: "A"}, "A"), h("p", {key: "B"}, "B")]
// const nextChildren = [
//  h("p", {key: "A"}, "A"),
//  h("p", {key: "B"}, "B"),
//  h("p", {key: "C"}, "C")
// ]

