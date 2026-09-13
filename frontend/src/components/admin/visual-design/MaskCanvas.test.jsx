import { createRef } from 'react';
import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';

import MaskCanvas from './MaskCanvas';


function installCanvasContextMock() {
    HTMLCanvasElement.prototype.getContext = vi.fn(function getContext() {
        if (!this.__ctx) {
            this.__ctx = {
                fillStyle: '',
                strokeStyle: '',
                lineWidth: 0,
                clearRect: vi.fn(),
                fillRect: vi.fn(),
                strokeRect: vi.fn(),
                setLineDash: vi.fn()
            };
        }
        return this.__ctx;
    });

    HTMLCanvasElement.prototype.toBlob = vi.fn(function toBlob(callback, type) {
        callback(new Blob(['mock-mask-bytes'], { type: type || 'image/png' }));
    });

    HTMLCanvasElement.prototype.setPointerCapture = vi.fn();
    HTMLCanvasElement.prototype.releasePointerCapture = vi.fn();
}

let mockImageSize = { width: 800, height: 600 };
let imageConstructedCount = 0;

class ImageMock {
    constructor() {
        imageConstructedCount += 1;
        this.naturalWidth = mockImageSize.width;
        this.naturalHeight = mockImageSize.height;
        this.onload = null;
    }
    set src(value) {
        this._src = value;
        Promise.resolve().then(() => {
            if (this.onload) this.onload();
        });
    }
    get src() {
        return this._src;
    }
}

class ResizeObserverMock {
    constructor(callback) {
        this.callback = callback;
        ResizeObserverMock.instances.push(this);
    }
    observe(target) {
        this.target = target;
    }
    disconnect() {
        const idx = ResizeObserverMock.instances.indexOf(this);
        if (idx !== -1) ResizeObserverMock.instances.splice(idx, 1);
    }
}
ResizeObserverMock.instances = [];

const triggerResize = (width, height) => {
    const observer = ResizeObserverMock.instances[ResizeObserverMock.instances.length - 1];
    observer.callback([{ contentRect: { width, height } }]);
};

const triggerEmptyResize = () => {
    const observer =
        ResizeObserverMock.instances[
            ResizeObserverMock.instances.length - 1
        ];

    observer.callback([]);
};

const CANVAS_DISPLAY_RECT = { left: 0, top: 0, width: 400, height: 300, right: 400, bottom: 300, x: 0, y: 0, toJSON: () => {} };

beforeAll(() => {
    installCanvasContextMock();
    globalThis.Image = ImageMock;
    globalThis.ResizeObserver = ResizeObserverMock;
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue(CANVAS_DISPLAY_RECT);
});

beforeEach(() => {
    imageConstructedCount = 0;
    mockImageSize = { width: 800, height: 600 };
    ResizeObserverMock.instances = [];
    vi.clearAllMocks();
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue(CANVAS_DISPLAY_RECT);
});

afterEach(() => {
    cleanup();
});


const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0));

const drawSelection = (canvas, from, to) => {
    fireEvent.pointerDown(canvas, { clientX: from.x, clientY: from.y, pointerId: 1 });
    fireEvent.pointerMove(canvas, { clientX: to.x, clientY: to.y, pointerId: 1 });
    fireEvent.pointerUp(canvas, { clientX: to.x, clientY: to.y, pointerId: 1 });
};

describe('MaskCanvas', () => {
    it('renders a canvas without the "is-drawing" class when isDrawingMode is false', () => {
        const { container } = render(<MaskCanvas imageUrl="photo.png" isDrawingMode={false} />);
        const canvas = container.querySelector('canvas');

        expect(canvas).toBeInTheDocument();
        expect(canvas.className).toBe('mask-canvas ');
    });

    it('adds the "is-drawing" class when isDrawingMode is true', () => {
        const { container } = render(<MaskCanvas imageUrl="photo.png" isDrawingMode={true} />);
        const canvas = container.querySelector('canvas');

        expect(canvas.className).toBe('mask-canvas is-drawing');
    });

    it('does not construct an Image when imageUrl is not provided', async () => {
        render(<MaskCanvas imageUrl={undefined} isDrawingMode={false} />);
        await flushMicrotasks();

        expect(imageConstructedCount).toBe(0);
    });

    it('loads the natural size of the image when imageUrl is provided, and uses it in getMaskBlob', async () => {
        mockImageSize = { width: 1000, height: 500 };
        const ref = createRef();
        const { container } = render(<MaskCanvas ref={ref} imageUrl="photo.png" isDrawingMode={true} />);
        await flushMicrotasks();

        expect(imageConstructedCount).toBe(1);

        const canvas = container.querySelector('canvas');
        triggerResize(400, 300);

        drawSelection(canvas, { x: 40, y: 30 }, { x: 140, y: 90 });
        expect(ref.current.hasSelection()).toBe(true);

        const createElementSpy = vi.spyOn(document, 'createElement');
        const blob = await ref.current.getMaskBlob();

        expect(blob).toBeInstanceOf(Blob);

        const maskCanvasCall = createElementSpy.mock.results.find(
            (result) => result.value instanceof HTMLCanvasElement
        );
        expect(maskCanvasCall.value.width).toBe(1000);
        expect(maskCanvasCall.value.height).toBe(500);

        const ctx = maskCanvasCall.value.__ctx;
        const [x, y, w, h] = ctx.fillRect.mock.calls.at(-1);
        expect(x).toBeCloseTo(40 * 2.5);
        expect(y).toBeCloseTo(30 * (500 / 300));
        expect(w).toBeCloseTo(100 * 2.5);
        expect(h).toBeCloseTo(60 * (500 / 300));

        createElementSpy.mockRestore();
    });

    it('ignores resize entries with a zero width or height', () => {
        const { container } = render(<MaskCanvas imageUrl="photo.png" isDrawingMode={false} />);
        const canvas = container.querySelector('canvas');
        const initialWidth = canvas.width;
        const initialHeight = canvas.height;

        triggerResize(0, 0);

        expect(canvas.width).toBe(initialWidth);
        expect(canvas.height).toBe(initialHeight);
    });

    it('resizes the canvas and redraws on a valid resize entry', () => {
        const { container } = render(<MaskCanvas imageUrl="photo.png" isDrawingMode={false} />);
        const canvas = container.querySelector('canvas');

        triggerResize(400, 300);

        expect(canvas.width).toBe(400);
        expect(canvas.height).toBe(300);
        expect(canvas.getContext('2d').clearRect).toHaveBeenCalled();
    });

    it('does not draw anything when isDrawingMode is false', () => {
        const ref = createRef();
        const { container } = render(<MaskCanvas ref={ref} imageUrl="photo.png" isDrawingMode={false} />);
        const canvas = container.querySelector('canvas');
        triggerResize(400, 300);

        drawSelection(canvas, { x: 10, y: 10 }, { x: 100, y: 100 });

        expect(ref.current.hasSelection()).toBe(false);
        expect(canvas.setPointerCapture).not.toHaveBeenCalled();
    });

    it('draws a rectangle from the start point to the drag point while in drawing mode', () => {
        const ref = createRef();
        const { container } = render(<MaskCanvas ref={ref} imageUrl="photo.png" isDrawingMode={true} />);
        const canvas = container.querySelector('canvas');
        triggerResize(400, 300);

        drawSelection(canvas, { x: 50, y: 60 }, { x: 200, y: 180 });

        expect(canvas.setPointerCapture).toHaveBeenCalledWith(1);
        expect(canvas.releasePointerCapture).toHaveBeenCalledWith(1);
        expect(ref.current.hasSelection()).toBe(true);

        const ctx = canvas.getContext('2d');
        const [x, y, w, h] = ctx.fillRect.mock.calls.at(-1);
        expect({ x, y, w, h }).toEqual({ x: 50, y: 60, w: 150, h: 120 });
    });

    it('treats a tiny rectangle (6px or smaller) as no selection', () => {
        const ref = createRef();
        const { container } = render(<MaskCanvas ref={ref} imageUrl="photo.png" isDrawingMode={true} />);
        const canvas = container.querySelector('canvas');
        triggerResize(400, 300);

        drawSelection(canvas, { x: 50, y: 60 }, { x: 52, y: 61 });

        expect(ref.current.hasSelection()).toBe(false);
    });

    it('clamps the rectangle so it never extends outside the canvas boundaries', () => {
        const ref = createRef();
        const { container } = render(<MaskCanvas ref={ref} imageUrl="photo.png" isDrawingMode={true} />);
        const canvas = container.querySelector('canvas');
        triggerResize(400, 300);

        drawSelection(canvas, { x: 350, y: 250 }, { x: 5000, y: 5000 });

        const ctx = canvas.getContext('2d');
        const [x, y, w, h] = ctx.fillRect.mock.calls.at(-1);
        expect({ x, y, w, h }).toEqual({ x: 350, y: 250, w: 50, h: 50 });
    });

    it('ignores pointermove events when the pointer is not currently down', () => {
        const ref = createRef();
        const { container } = render(<MaskCanvas ref={ref} imageUrl="photo.png" isDrawingMode={true} />);
        const canvas = container.querySelector('canvas');
        triggerResize(400, 300);

        fireEvent.pointerMove(canvas, { clientX: 100, clientY: 100, pointerId: 1 });

        expect(ref.current.hasSelection()).toBe(false);
    });

    it('ignores a pointerup that was not preceded by a pointerdown', () => {
        const { container } = render(<MaskCanvas imageUrl="photo.png" isDrawingMode={true} />);
        const canvas = container.querySelector('canvas');
        triggerResize(400, 300);

        fireEvent.pointerUp(canvas, { clientX: 100, clientY: 100, pointerId: 1 });

        expect(canvas.releasePointerCapture).not.toHaveBeenCalled();
    });

    it('reset() clears the current selection', () => {
        const ref = createRef();
        const { container } = render(<MaskCanvas ref={ref} imageUrl="photo.png" isDrawingMode={true} />);
        const canvas = container.querySelector('canvas');
        triggerResize(400, 300);

        drawSelection(canvas, { x: 10, y: 10 }, { x: 100, y: 100 });
        expect(ref.current.hasSelection()).toBe(true);

        ref.current.reset();

        expect(ref.current.hasSelection()).toBe(false);
    });

    it('getMaskBlob() resolves to null when there is no selection yet', async () => {
        const ref = createRef();
        render(<MaskCanvas ref={ref} imageUrl="photo.png" isDrawingMode={true} />);

        const result = await ref.current.getMaskBlob();

        expect(result).toBeNull();
    });

    it('getMaskBlob() resolves to null when the natural image size is not yet known', async () => {
        const ref = createRef();
        const { container } = render(<MaskCanvas ref={ref} imageUrl={undefined} isDrawingMode={true} />);
        const canvas = container.querySelector('canvas');
        triggerResize(400, 300);

        drawSelection(canvas, { x: 10, y: 10 }, { x: 100, y: 100 });
        expect(ref.current.hasSelection()).toBe(true);

        const result = await ref.current.getMaskBlob();

        expect(result).toBeNull();
    });

    it('getMaskBlob() resolves to a Blob built from a black background and a white selection rectangle', async () => {
        mockImageSize = { width: 400, height: 300 };
        const ref = createRef();
        const { container } = render(<MaskCanvas ref={ref} imageUrl="photo.png" isDrawingMode={true} />);
        await flushMicrotasks();

        const canvas = container.querySelector('canvas');
        triggerResize(400, 300);

        drawSelection(canvas, { x: 20, y: 30 }, { x: 120, y: 90 });

        const createElementSpy = vi.spyOn(document, 'createElement');
        const blob = await ref.current.getMaskBlob();
        expect(blob).toBeInstanceOf(Blob);

        const maskCanvas = createElementSpy.mock.results.find(
            (result) => result.value instanceof HTMLCanvasElement
        ).value;
        const ctx = maskCanvas.__ctx;

        expect(ctx.fillRect.mock.calls[0]).toEqual([0, 0, 400, 300]);
        expect(ctx.fillStyle).toBe('white');
        expect(ctx.fillRect.mock.calls[1]).toEqual([20, 30, 100, 60]);

        createElementSpy.mockRestore();
    });

    it('prevents the default click behaviour while in drawing mode', () => {
        const { container } = render(<MaskCanvas imageUrl="photo.png" isDrawingMode={true} />);
        const canvas = container.querySelector('canvas');

        const notCancelled = fireEvent.click(canvas);

        expect(notCancelled).toBe(false);
    });

    it('does not interfere with click behaviour when not in drawing mode', () => {
        const { container } = render(<MaskCanvas imageUrl="photo.png" isDrawingMode={false} />);
        const canvas = container.querySelector('canvas');

        const notCancelled = fireEvent.click(canvas);

        expect(notCancelled).toBe(true);
    });

    it('does nothing in drawRect when the canvas is no longer available', () => {
        const ref = createRef();

        const { unmount } = render(
            <MaskCanvas
                ref={ref}
                imageUrl="photo.png"
                isDrawingMode={true}
            />
        );

        const handle = ref.current;

        unmount();

        expect(() => handle.reset()).not.toThrow();
    });

    it('ignores resize callback when there is no entry', () => {
        const { container } = render(
            <MaskCanvas
                imageUrl="photo.png"
                isDrawingMode={false}
            />
        );

        const canvas = container.querySelector('canvas');
        const initialWidth = canvas.width;
        const initialHeight = canvas.height;

        triggerEmptyResize();

        expect(canvas.width).toBe(initialWidth);
        expect(canvas.height).toBe(initialHeight);
    });
});