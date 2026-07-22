export class Element<K extends keyof HTMLElementTagNameMap> {
  public element: HTMLElementTagNameMap[K];
  constructor(type: K, payload?: Partial<HTMLElementTagNameMap[K]>) {
    this.element = document.createElement(type);
    if (payload) {
      this.edit(payload);
    }
    return this;
  }
  edit(payload: Partial<HTMLElementTagNameMap[K]>) {
    const filtered = Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined)) as Partial<HTMLElementTagNameMap[K]>;
    Object.assign(this.element, filtered);
    return this;
  }
  delete() {
    this.element.remove();
    return this;
  }
}
