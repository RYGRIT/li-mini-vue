var extend = Object.assign;
var isObject = function (val) {
    return val !== null && typeof val === "object";
};
var hasOwn = function (val, key) { return Object.prototype.hasOwnProperty.call(val, key); };
var camelize = function (str) {
    return str.replace(/-(\w)/g, function (_, c) {
        return c ? c.toUpperCase() : "";
    });
};
var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
var toHandlerKey = function (str) {
    return str ? "on" + capitalize(str) : "";
};

var targetMap = new Map();
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else {
            effect_1.run();
        }
    }
}

var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    return function (target, key) {
        if (key === "__v_is_reactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_is_readonly" /* ReactiveFlags.IS_READONlY */) {
            return isReadonly;
        }
        var res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        // 看看 res 是不是 object
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function (target, key, newValue) {
        var res = Reflect.set(target, key, newValue);
        // 触发依赖
        trigger(target, key);
        return res;
    };
}
var mutableHandlers = {
    get: get,
    set: set
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key) {
        // 当设置值时，应抛出异常
        console.warn("key: ".concat(key, " not set, because target is readonly"), target);
        return true;
    }
};
var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
});

function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}
function createReactiveObject(target, baseHandlers) {
    if (!isObject(target)) {
        console.warn("target ".concat(target, " \u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61"));
        return target;
    }
    return new Proxy(target, baseHandlers);
}

function emit(instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    console.log("emit", event);
    // instance.props -> event
    var props = instance.props;
    // TPP
    // 先去写一个特定的行为 -> 重构成通用的行为
    // add 
    // add -> Add
    // add-foo -> addFoo
    var handlerName = toHandlerKey(camelize(event));
    var handler = props[handlerName];
    handler && handler.apply(void 0, args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
    // attrs
}

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
    // $slots
    $slots: function (i) { return i.slots; }
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        // setupState
        var setupState = instance.setupState, props = instance.props;
        if (key in setupState) {
            return setupState[key];
        }
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
        // $data
    }
};

function initSlots(instance, children) {
    // 不是所有的都会有children
    var vnode = instance.vnode;
    if (vnode.shapeFlag & 16 /* ShapeFlags.SLOT_CHILDREN */) {
        // instance.slots = Array.isArray(children) ? children : [children]
        normalizeObjectSlots(instance.slots, children);
    }
}
function normalizeObjectSlots(slots, children) {
    var _loop_1 = function (key) {
        var value = children[key];
        // slot
        slots[key] = function (props) { return normalizeSlotValue(value(props)); };
    };
    for (var key in children) {
        _loop_1(key);
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode, parent) {
    console.log("createComponentInstance", parent);
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent: parent,
        emit: function () { }
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    // ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        setCurrentInstance(instance);
        var setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        currentInstance = instance;
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
var currentInstance = null;
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

var Fragment = Symbol("Fragment");
var Text = Symbol("Text");
function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        shapeFlag: getShapeFlag(type),
        el: null
    };
    // children
    if (typeof children === "string") {
        vnode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    // 组件 + children object 
    if (vnode.shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        if (typeof children === "object") {
            vnode.shapeFlag |= 16 /* ShapeFlags.SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}
function getShapeFlag(type) {
    return typeof type === "string" ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

function render(vnode, container) {
    // 调用patch方法
    patch(vnode, container, null);
}
function patch(vnode, container, parentComponent) {
    // 去处理组件
    // 判断vnode是不是一个element
    // ShapeFlags 
    // vnode -> flag
    // 是 element 那么就应该处理element
    // 思考题：如何去区分是 element 还是 component 类型
    // console.log(vnode.type) // component -> object element -> div
    var type = vnode.type, shapeFlag = vnode.shapeFlag;
    // Fragment -> 只渲染 children
    switch (type) {
        case Fragment:
            processFragment(vnode, container, parentComponent);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
                processElement(vnode, container, parentComponent);
                // STATEFUL_COMPONENT
            }
            else if (shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
                processComponent(vnode, container, parentComponent);
            }
            break;
    }
}
function processFragment(vnode, container, parentComponent) {
    // implement
    mountChildren(vnode, container, parentComponent);
}
function processText(vnode, container) {
    var children = vnode.children;
    var textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
}
function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent);
}
function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent);
}
function mountElement(initialVNode, container, parentComponent) {
    // 方便理解
    // const el = document.createElement("div")
    // el.textContent = "hi mini-vue"
    // el.setAttribute("id", "root")
    // document.body.append(el)
    var el = (initialVNode.el = document.createElement(initialVNode.type));
    var children = initialVNode.children, props = initialVNode.props, shapeFlag = initialVNode.shapeFlag;
    if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        // text_children
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
        // array_children
        mountChildren(initialVNode, el, parentComponent);
    }
    // props
    for (var key in props) {
        var val = props[key];
        console.log(key);
        // 具体的 click -> 通用 
        // on + Event name
        // onMouseDown
        var isOn = function (key) { return /^on[A-Z]/.test(key); };
        if (isOn(key)) {
            var event_1 = key.slice(2).toLowerCase();
            el.addEventListener(event_1, val);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    console.log(container);
    container.append(el);
}
function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach(function (v) {
        patch(v, container, parentComponent);
    });
}
function mountComponent(vnode, container, parentComponent) {
    // 创建组件实例
    var instance = createComponentInstance(vnode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy);
    patch(subTree, container, instance);
    // element -> mount
    initialVNode.el = subTree.el;
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

function renderSlots(slots, name, props) {
    var slot = slots[name];
    if (slot) {
        // function
        if (typeof slot === "function") {
            // children 是不可以有 array
            return createVNode(Fragment, {}, slot(props));
        }
    }
}

function provide(key, value) {
    // 存
    // key value 存在哪里？
    // 存在当前组件的实例对象上
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var provides = currentInstance.provides;
        var parentProvides = currentInstance.parent.provides;
        // init
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    // 取
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === "function") {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}

export { createApp, createTextVNode, getCurrentInstance, h, inject, provide, renderSlots };
