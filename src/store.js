"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const utils_1 = require("@xofttion/utils");
const rxjs_1 = require("rxjs");
class State {
    constructor(initialValue) {
        this.initialValue = initialValue;
        this.subject = new rxjs_1.BehaviorSubject((0, utils_1.deepFreeze)(this.initialValue));
    }
    getCurrent() {
        return this.subject.value;
    }
    reset() {
        this.reduce(() => this.initialValue);
    }
    reduce(reducer) {
        this.subject.next((0, utils_1.deepFreeze)(reducer(this.subject.value)));
    }
    select(selector) {
        return selector({ ...this.subject.value });
    }
    observe() {
        return this.subject.asObservable();
    }
    subscribe(subscriber) {
        return this.observe().subscribe(subscriber);
    }
}
class Store {
    constructor(value) {
        this.state = new State(value);
    }
    getCurrent() {
        return this.state.getCurrent();
    }
    reset() {
        this.state.reset();
    }
    reduce(reducer) {
        this.state.reduce(reducer);
    }
    select(selector) {
        return this.state.select(selector);
    }
    observe(observer) {
        return this.state.observe().pipe((0, rxjs_1.map)((state) => observer(state)));
    }
    subscribe(subscriber) {
        return this.state.subscribe(subscriber);
    }
}
exports.Store = Store;
//# sourceMappingURL=store.js.map