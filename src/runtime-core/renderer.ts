import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode"

export function render(vnode, container) {
  // 调用patch方法
  patch(vnode, container, null)
}



function patch(vnode, container, parentComponent) {
  // 去处理组件

  // 判断vnode是不是一个element
  // ShapeFlags 
  // vnode -> flag

  // 是 element 那么就应该处理element
  // 思考题：如何去区分是 element 还是 component 类型
  // console.log(vnode.type) // component -> object element -> div
  const { type, shapeFlag } = vnode

  // Fragment -> 只渲染 children
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent)
      break
    case Text:
      processText(vnode, container)
      break
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent)
        // STATEFUL_COMPONENT
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent)
      }
      break
  }
}

function processFragment(vnode, container, parentComponent) {
  // implement
  mountChildren(vnode, container, parentComponent)
}

function processText(vnode, container) {
  const { children } = vnode
  const textNode = (vnode.el = document.createTextNode(children))
  container.append(textNode)
}

function processComponent(vnode, container, parentComponent) {
  mountComponent(vnode, container, parentComponent)
}

function processElement(vnode, container, parentComponent) {
  mountElement(vnode, container, parentComponent)
}

function mountElement(initialVNode, container, parentComponent) {
  // 方便理解
  // const el = document.createElement("div")
  // el.textContent = "hi mini-vue"
  // el.setAttribute("id", "root")
  // document.body.append(el)
  const el = (initialVNode.el = document.createElement(initialVNode.type))
  const { children, props, shapeFlag } = initialVNode

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // text_children
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // array_children
    mountChildren(initialVNode, el, parentComponent)
  }
  // props
  for (const key in props) {
    const val = props[key]
    console.log(key)
    // 具体的 click -> 通用 
    // on + Event name
    // onMouseDown
    const isOn = (key: string) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }
  console.log(container)
  container.append(el)
}

function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach(v => {
    patch(v, container, parentComponent)
  })
}

function mountComponent(vnode, container, parentComponent) {
  // 创建组件实例
  const instance = createComponentInstance(vnode, parentComponent)
  setupComponent(instance)


  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)
  patch(subTree, container, instance
  )

  // element -> mount
  initialVNode.el = subTree.el
}
