import { createVNode } from "./vnode"

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // component -> vnode
        // 先转换成虚拟结点，后续的所有操作都会基于虚拟结点做处理
        const vnode = createVNode(rootComponent)

        render(vnode, rootContainer)
      }
    }
  }
}
