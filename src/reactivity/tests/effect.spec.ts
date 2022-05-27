import { effect } from '../effect';
import { reactive } from '../reactive'

describe('effect', () => {
  // 属于是一个比较大的测试
  // 使用 skip 将测试拆开，分步骤进行实现

  it('happy path', () => {
    const user = reactive({ age: 10 })

    let nextAge;
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(11)

    // update
    user.age++
    expect(nextAge).toBe(12)
  })

  it('should return runner when call effect', () => {
    // 1.effect(fn) -> function(runner) -> fn -> return
    let foo = 10
    const runner = effect(() => {
      foo++
      return "foo"
    })

    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe("foo")
  })
})
