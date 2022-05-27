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
})
