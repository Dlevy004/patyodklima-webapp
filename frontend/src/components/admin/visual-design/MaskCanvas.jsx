import { forwardRef, useEffect, useImperativeHandle, useRef, useId } from 'react';

import PropTypes from 'prop-types';

import './MaskCanvas.css';

const KEY_STEP = 10;
const KEY_STEP_LARGE = 30;
const DEFAULT_SELECTION_RATIO = 0.25;


const MaskCanvas = forwardRef(({ imageUrl, isDrawingMode }, ref) => {
    const canvasRef = useRef(null);
    const naturalSizeRef = useRef({ width: 0, height: 0 });
    const rectRef = useRef(null);
    const startPointRef = useRef(null);
    const isDrawingRef = useRef(false);
    const instructionsId = useId();

    const ensureSelection = () => {
        const canvas = canvasRef.current;
        if (!canvas || rectRef.current) return;

        const w = Math.max(40, canvas.width * DEFAULT_SELECTION_RATIO);
        const h = Math.max(40, canvas.height * DEFAULT_SELECTION_RATIO);
        rectRef.current = {
            x: (canvas.width - w) / 2,
            y: (canvas.height - h) / 2,
            w,
            h
        };
    };

    const handleKeyDown = (e) => {
        if (!isDrawingMode) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            rectRef.current = null;
            drawRect();
            return;
        }

        const moveKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (!moveKeys.includes(e.key)) return;

        e.preventDefault();
        ensureSelection();

        const rect = rectRef.current;
        const step = e.shiftKey ? KEY_STEP_LARGE : KEY_STEP;

        if (e.altKey) {
            if (e.key === 'ArrowRight') rect.w = clamp(rect.w + step, 20, canvas.width - rect.x);
            if (e.key === 'ArrowLeft') rect.w = clamp(rect.w - step, 20, canvas.width - rect.x);
            if (e.key === 'ArrowDown') rect.h = clamp(rect.h + step, 20, canvas.height - rect.y);
            if (e.key === 'ArrowUp') rect.h = clamp(rect.h - step, 20, canvas.height - rect.y);
        } else {
            if (e.key === 'ArrowRight') rect.x = clamp(rect.x + step, 0, canvas.width - rect.w);
            if (e.key === 'ArrowLeft') rect.x = clamp(rect.x - step, 0, canvas.width - rect.w);
            if (e.key === 'ArrowDown') rect.y = clamp(rect.y + step, 0, canvas.height - rect.h);
            if (e.key === 'ArrowUp') rect.y = clamp(rect.y - step, 0, canvas.height - rect.h);
        }

        drawRect();
    };

    // Draw the rectangle on the canvas based on the current rectRef
    const drawRect = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const rect = rectRef.current;
        if (!rect) return;

        ctx.fillStyle = 'rgba(37, 132, 220, 0.35)';
        ctx.strokeStyle = 'rgba(37, 132, 220, 0.9)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    };

    // Upload the image to get its natural size, which is used to scale the rectangle coordinates correctly
    useEffect(() => {
        let cancelled = false;

        rectRef.current = null;
        naturalSizeRef.current = { width: 0, height: 0 };
        drawRect();

        if (!imageUrl) return;

        const img = new Image();
        img.onload = () => {
            if (cancelled) return;
            naturalSizeRef.current = { width: img.naturalWidth, height: img.naturalHeight };
        };
        img.src = imageUrl;

        return () => {
            cancelled = true;
        };
    }, [imageUrl]);

    // ResizeObserver is used to keep the canvas internal size in sync with the actual displayed size
    // — this improves the coordinate offset caused by layout shift
    // (e.g., when the container aspect ratio changes after the image loads)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            const { width, height } = entry.contentRect;
            if (width === 0 || height === 0) return;

            const previousWidth = canvas.width;
            const previousHeight = canvas.height;

            canvas.width = width;
            canvas.height = height;

            if (rectRef.current && previousWidth && previousHeight) {
                const scaleX = canvas.width / previousWidth;
                const scaleY = canvas.height / previousHeight;
                rectRef.current = {
                    x: rectRef.current.x * scaleX,
                    y: rectRef.current.y * scaleY,
                    w: rectRef.current.w * scaleX,
                    h: rectRef.current.h * scaleY
                };
            }
            drawRect();
        });

        observer.observe(canvas);
        return () => observer.disconnect();
    }, [imageUrl]);

    // Get the mouse/touch position relative to the canvas, scaled to the canvas internal size
    const getRelativePos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        return { x, y };
    };

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const handlePointerDown = (e) => {
        if (!isDrawingMode) return;
        e.preventDefault();
        e.stopPropagation();

        const canvas = canvasRef.current;
        canvas.setPointerCapture(e.pointerId);

        const { x, y } = getRelativePos(e);
        startPointRef.current = { x, y };
        rectRef.current = { x, y, w: 0, h: 0 };
        isDrawingRef.current = true;
        drawRect();
    };

    // Handle pointer move event to update the rectangle dimensions while drawing
    const handlePointerMove = (e) => {
        if (!isDrawingMode || !isDrawingRef.current) return;
        e.preventDefault();

        const canvas = canvasRef.current;
        const start = startPointRef.current;
        let { x, y } = getRelativePos(e);

        // the rectangle should not go outside the canvas boundaries
        x = clamp(x, 0, canvas.width);
        y = clamp(y, 0, canvas.height);

        const left = Math.min(start.x, x);
        const top = Math.min(start.y, y);
        const width = Math.abs(x - start.x);
        const height = Math.abs(y - start.y);

        rectRef.current = { x: left, y: top, w: width, h: height };
        drawRect();
    };

    // Handle pointer up event to finalize the rectangle drawing
    const handlePointerUp = (e) => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        canvasRef.current?.releasePointerCapture(e.pointerId);
    };

    const handleClick = (e) => {
        if (isDrawingMode) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    // Expose methods to the parent component via ref
    useImperativeHandle(ref, () => ({
        reset: () => {
            rectRef.current = null;
            drawRect();
        },
        hasSelection: () => {
            const rect = rectRef.current;
            return !!rect && rect.w > 6 && rect.h > 6;
        },
        getMaskBlob: () => {
            const rect = rectRef.current;
            const canvas = canvasRef.current;
            const { width, height } = naturalSizeRef.current;

            if (!rect || !width || !height) return Promise.resolve(null);

            const scaleX = width / canvas.width;
            const scaleY = height / canvas.height;

            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = width;
            maskCanvas.height = height;
            const ctx = maskCanvas.getContext('2d');

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = 'white';
            ctx.fillRect(
                rect.x * scaleX,
                rect.y * scaleY,
                rect.w * scaleX,
                rect.h * scaleY
            );

            return new Promise((resolve) => {
                maskCanvas.toBlob((blob) => resolve(blob), 'image/png');
            });
        }
    }));

    return (
        <canvas
            ref={canvasRef}
            className={`mask-canvas ${isDrawingMode ? 'is-drawing' : ''}`}
            tabIndex={isDrawingMode ? 0 : -1}
            aria-label="Klíma helyének kijelölése a képen"
            aria-describedby={isDrawingMode ? instructionsId : undefined}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        />
    );
});

MaskCanvas.displayName = 'MaskCanvas';
MaskCanvas.propTypes = {
    imageUrl: PropTypes.string,
    isDrawingMode: PropTypes.bool
};

export default MaskCanvas;