import { effect } from "../reactivity/effect"
import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppAPI } from "./createApp"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProps: hostPatchProps,
    insert: hostInsert
  } = options

  function render(vnode, container) {
    // 调用patch方法
    patch(null, vnode, container, null)
  }

  // n1 -> oldNode
  // n2 -> newNode
  function patch(n1, n2, container, parentComponent) {
    // 去处理组件

    // 判断vnode是不是一个element
    // ShapeFlags
    // vnode -> flag

    // 是 element 那么就应该处理element
    // 思考题：如何去区分是 element 还是 component 类型
    // console.log(vnode.type) // component -> object element -> div
    const { type, shapeFlag } = n2

    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
          // STATEFUL_COMPONENT
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
        break
    }
  }

  function processFragment(n1, n2, container, parentComponent) {
    // implement
    mountChildren(n2, container, parentComponent)
  }

  function processText(n1, n2, container) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container)
    }
  }

  function patchElement(n1, n2, container) {
    console.log("patchElement")
    console.log("n1", n1)
    console.log("n2", n2)


    // props
    // children
  }
  function mountElement(vnode, container, parentComponent) {
    // 方便理解
    // const el = document.createElement("div")
    // el.textContent = "hi mini-vue"
    // el.setAttribute("id", "root")
    // document.body.append(el)
    const el = (vnode.el = hostCreateElement(vnode.type))
    const { children, props, shapeFlag } = vnode

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text_children
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // array_children
      mountChildren(vnode, el, parentComponent)
    }
    // props
    for (const key in props) {
      const val = props[key]
      console.log(key)
      // 具体的 click -> 通用
      // on + Event name
      // onMouseDown
      // const isOn = (key: string) => /^on[A-Z]/.test(key)
      // if (isOn(key)) {
      //   const event = key.slice(2).toLowerCase()
      //   el.addEventListener(event, val)
      // } else {
      //   el.setAttribute(key, val)
      // }
      hostPatchProps(el, key, val)
    }
    console.log(container)
    // container.append(el)
    hostInsert(el, container)
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      patch(null, v, container, parentComponent)
    })
  }

  function mountComponent(initialVNode, container, parentComponent) {
    // 创建组件实例
    const instance = createComponentInstance(initialVNode, parentComponent)
    setupComponent(instance)

    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect(instance, initialVNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        // 初始化
        console.log("init")
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
        console.log(subTree)
        patch(null, subTree, container, instance)

        // element -> mount
        initialVNode.el = subTree.el

        instance.isMounted = true
      } else {
        // 更新
        console.log("update")
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree

        console.log("current: ", subTree)
        console.log("prev", prevSubTree)

        patch(prevSubTree, subTree, container, instance)
      }
    })
  }

  return {
    createApp: createAppAPI(render)
  }
}
