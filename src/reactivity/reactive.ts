import { track, trigger } from "./effect"

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key)
      // 依赖收集
      track(target, key)
      return res
    },

    set(target, key, newValue) {
      const res = Reflect.set(target, key, newValue)
      // 触发依赖
      trigger(target, key)
      return res
    }
  })
}

export function readonly(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key)
      return res
    },

    set(target, key, newValue) {
      // 当设置值时，应抛出异常
      return true
    }
  })
}
