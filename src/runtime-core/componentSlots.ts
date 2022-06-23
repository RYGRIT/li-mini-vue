import { ShapeFlags } from "../shared/ShapeFlags"

export function initSlots(instance, children) {
  // 不是所有的都会有children
  const { vnode } = instance
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    // instance.slots = Array.isArray(children) ? children : [children]
    normalizeObjectSlots(instance.slots, children)
  }
}

function normalizeObjectSlots(slots, children) {
  for (const key in children) {
    const value = children[key]
    // slot
    slots[key] = (props) => normalizeSlotValue(value(props))
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value]
}
