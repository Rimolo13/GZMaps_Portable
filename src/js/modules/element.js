export class Element {
    element;
    constructor(type, payload) {
        this.element = document.createElement(type);
        if (payload) {
            this.edit(payload);
        }
        return this;
    }
    edit(payload) {
        const filtered = Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
        Object.assign(this.element, filtered);
        return this;
    }
    delete() {
        this.element.remove();
        return this;
    }
}
