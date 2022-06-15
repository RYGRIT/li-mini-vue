var isObject = function (val) {
    return val !== null && typeof val === "object";
};

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type
    };
    return component;
}
function setupComponent(instance) {
    // initProps
    // initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // TODO: FUNCTION
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    instance.render = Component.render;
}

function render(vnode, container) {
    // 调用patch方法
    patch(vnode, container);
}
function patch(vnode, container) {
    // 去处理组件
    // TODO: 判断vnode是不是一个element
    // 是 element 那么就应该处理element
    // 思考题：如何去区分是 element 还是 component 类型
    console.log(vnode.type); // component -> object element -> div
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    // 方便理解
    // const el = document.createElement("div")
    // el.textContent = "hi mini-vue"
    // el.setAttribute("id", "root")
    // document.body.append(el)
    var el = document.createElement(vnode.type);
    var children = vnode.children, props = vnode.props;
    if (typeof children === "string") {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        children.forEach(function (v) {
            patch(v, el);
        });
    }
    for (var key in props) {
        var val = props[key];
        el.setAttribute(key, val);
    }
    console.log(container);
    container.append(el);
}
function mountComponent(vnode, container) {
    // 创建组件实例
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    var subTree = instance.render();
    patch(subTree, container);
}

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // component -> vnode
            // 先转换成虚拟结点，后续的所有操作都会基于虚拟结点做处理
            var vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };