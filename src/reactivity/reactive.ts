import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_is_reactive",
  IS_READONlY = "__v_is_readonly"
}

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers)
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONlY]
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value)
}

function createReactiveObject(target, baseHandlers) {
  return new Proxy(target, baseHandlers)
}
