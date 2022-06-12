import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
  // 调用patch方法
  patch(vnode, container)  
}



function patch(vnode, container) {
  // 去处理组件

  // 判断是不是一个element


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
