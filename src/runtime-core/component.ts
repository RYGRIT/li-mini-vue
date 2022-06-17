export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {}
  }

  return component
}

export function setupComponent(instance) {
  TODO:
  // initProps
  // initSlots

  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const Component = instance.type
  // ctx
  instance.proxy = new Proxy({}, {
    get(target, key) {
      // setupState
      const { setupState } = instance
      if (key in setupState) {
        return setupState[key]
      }

      // key -> $el
      if (key === "$el") {
        return instance.vnode.el
      }
    }
  })

  const { setup } = Component
  if (setup) {
    const setupResult = setup()


    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {
  // TODO: FUNCTION
  if (typeof setupResult === "object") {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const Component = instance.type
  instance.render = Component.render
}
