// Node 25 ships an experimental global `localStorage` that shadows jsdom's and has no methods
// unless `--localstorage-file` is set. Tests get a plain in-memory Storage instead.
class MemoryStorage implements Storage {
  #items = new Map<string, string>()
  get length() {
    return this.#items.size
  }
  clear() {
    this.#items.clear()
  }
  getItem(key: string) {
    return this.#items.get(key) ?? null
  }
  key(index: number) {
    return [...this.#items.keys()][index] ?? null
  }
  removeItem(key: string) {
    this.#items.delete(key)
  }
  setItem(key: string, value: string) {
    this.#items.set(key, String(value))
  }
}

for (const name of ['localStorage', 'sessionStorage'] as const) {
  if (typeof globalThis[name]?.setItem !== 'function') {
    Object.defineProperty(globalThis, name, { value: new MemoryStorage(), configurable: true })
  }
}
