export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
  };
  return component;
}

export function setupComponent(instance) {
  // TODO
  // initProps()
  // initSlots()
  setupStatefulComponent(instance);
}

export function setupStatefulComponent(instance) {
  // TODO
  const Component = instance.type;
  // 这个空对象是ctx
  instance.proxy = new Proxy(
    {},
    {
      get(target, key) {
        const { setupState } = instance;
        if (key in setupState) {
          return setupState[key];
        }
      },
    }
  );

  const { setup } = Component;
  if (setup) {
    // 可能返回function或者object
    const setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  const Component = instance.type;
  // if (Component.render) {
  instance.render = Component.render;
  // }
}
