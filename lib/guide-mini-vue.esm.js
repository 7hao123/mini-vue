function createComponentInstance(vnode) {
    const component = { vnode };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    // TODO
    const Component = instance.vnode.type;
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

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    // TODO  判断vnode是不是一个element
    // 是element那应该处理element
    processElement(vnode, container);
    processComponent(vnode, container);
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);
}

function createVNode(type, props, children) {
    return {
        type,
        props,
        children,
    };
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先创建一个vnode
            // 所有的逻辑操作都会基于vnode做处理
            //   mount里面传的根组件，我们需要component-> vnode
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
