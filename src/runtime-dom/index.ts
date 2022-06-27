import { createRenderer } from "../runtime-core"
function createElement(type) {
  console.log("createElement-------")
  return document.createElement(type)
}

function patchProps(el, key, val) {
  console.log("patchProps-------")
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase()
    el.addEventListener(event, val)
  } else {
    el.setAttribute(key, val)
  }
}

function insert(el, parent) {
  console.log("insert-------")
  parent.append(el)
}

const renderer: any = createRenderer({
  createElement,
  patchProps,
  insert
})

export function createApp(...args) {
  return renderer.createApp(...args)
}

export * from "../runtime-core"
