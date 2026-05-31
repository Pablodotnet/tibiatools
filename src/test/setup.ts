import '@testing-library/jest-dom/vitest';

if (typeof PointerEvent === 'undefined') {
  class MockPointerEvent extends MouseEvent {
    pointerType: string;
    constructor(type: string, init?: PointerEventInit) {
      super(type, init);
      this.pointerType = init?.pointerType ?? 'mouse';
    }
  }
  globalThis.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;
}

if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false;
}

if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = () => {};
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
