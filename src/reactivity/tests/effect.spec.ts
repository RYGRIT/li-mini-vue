import { effect, stop } from '../effect';
import { reactive } from '../reactive'

describe('effect', () => {
  it('onStop', () => {
    const obj = reactive({
      foo: 1,
    })
    const onStop = jest.fn()
    let dummy
    const runner = effect(() => {
      dummy = obj.foo
    },
    {
      onStop,
    })
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })

  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    // set
    // obj.prop = 3 
    // get set
    // obj.prop = obj.prop + 1
    obj.prop++
    expect(dummy).toBe(2)

    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(3)
  })

  // 1. 通过 effect 的第二个参数给定的一个 scheduler 的 fn
  // 2. effect 第一次执行的时候不会执行 schedular，而是会执行 fn
  // 3. 当响应式对象 set update 不会执行 fn，而是会执行 schedular
  // 4. 如果说执行 runner 的时候，会再次执行 fn
  it('scheduler', () => {
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )
    // 最开始的时候 scheduler 不会被调用
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    // foo 值被改变了，所以 scheduler 会被调用一次
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })

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
