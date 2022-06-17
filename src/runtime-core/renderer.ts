import { isObject } from "../shared/index"
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
  console.log(vnode.type) // component -> object element -> div
  if (typeof vnode.type === "string") {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container)
  }
}


function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  // 方便理解
  // const el = document.createElement("div")
  // el.textContent = "hi mini-vue"
  // el.setAttribute("id", "root")
  // document.body.append(el)
  const el = (vnode.el = document.createElement(vnode.type))
  const { children, props } = vnode

  if (typeof children === "string") {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vnode, container)
  }
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }
  console.log(container)
  container.append(el)
}

function mountChildren(vnode, container) {
  vnode.children.forEach(v => {
    patch(v, container)
  })
}

function mountComponent(vnode, container) {
  // 创建组件实例
  const instance = createComponentInstance(vnode)
  setupComponent(instance)


  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance, vnode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)
  patch(subTree, container)

  // element -> mount
  vnode.el = subTree.el
}
