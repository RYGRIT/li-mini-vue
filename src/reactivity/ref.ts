import { isTracking, trackEffects, triggerEffects } from "./effect"

class RefImpl {
  private _value: any
  public dep
  constructor(value) {
    this._value = value
    this.dep = new Set()
  }

  get value() {
    if (isTracking()) {
      // 依赖收集
      trackEffects(this.dep)
    }
    return this._value
  }

  set value(newValue) {
    // 一定要先去修改了 value 值
    this._value = newValue
    // 触发依赖
    triggerEffects(this.dep)
  }
}

export function ref(value) {
  return new RefImpl(value)
}
