import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
  // 调用patch方法
  patch(vnode, container)  
}



function patch(vnode, container) {
  // 去处理组件

  // TODO: 判断vnode是不是一个element
  // 是 element 那么就应该处理element
  // 思考题：如何去区分是 element 还是 component 类型
  // processElement()


  processComponent(vnode, container)
}


function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  // 创建组件实例
  const instance = createComponentInstance(vnode)
  setupComponent(instance)


  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render()
  patch(subTree, container)
}
