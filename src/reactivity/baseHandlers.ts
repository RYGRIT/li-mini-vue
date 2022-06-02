import { extend, isObject } from "../shared"
import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
  return function (target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONlY) {
      return isReadonly
    }
    const res = Reflect.get(target, key)

    if (shallow) {
      return res
    }

    // 看看 res 是不是 object
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    // 依赖收集
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return function (target, key, newValue) {
    const res = Reflect.set(target, key, newValue)
    // 触发依赖
    trigger(target, key)
    return res
  }
}

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    // 当设置值时，应抛出异常
    console.warn(`key: ${key} not set, because target is readonly`, target)
    return true
  }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
})
