const publicPropertisMap = {
  $el: (i) => i.vnode.el,
};

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // setupState
    const { setupState, props } = instance;
    const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
    // if (key in setupState) {
    //   return setupState[key];
    // }
    // if (key in props) {
    //   return props[key];
    // }
    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }
    const publicGetter = publicPropertisMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
