import { useEffect, useState, useRef, useCallback } from 'react';
import { Card } from '@mui/material';

export default function Slide({ children, initialPosition = { x: 0, y: 0 }, initialSize = { width: 30, height: 30 }, backgroundColor = 'grey'  }) {
  // Position and size stored as percentages (0-100)
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isSelected, setIsSelected] = useState(false);

  // Refs for tracking drag/resize operations
  const elementRef = useRef(null);          // Reference to the DOM element
  const isDragging = useRef(false);         // Tracks if we're dragging
  const isResizing = useRef(false);         // Tracks if we're resizing
  const dragStart = useRef({ x: 0, y: 0 }); // Starting point of drag/resize
  const initialPosRef = useRef({ x: 0, y: 0 }); // Initial position when drag starts
  const resizeCorner = useRef(null);        // Which corner is being dragged
  const initialSizeRef = useRef({ width: 0, height: 0 }); // Initial size when resize starts

  // Convert percentage to pixels for internal calculations
  const percentToPixels = useCallback((percent, dimension) => {
    const slideElement = elementRef.current?.parentElement;
    if (!slideElement) return 0;
    const total = dimension === 'width' ? slideElement.offsetWidth : slideElement.offsetHeight;
    return (percent * total) / 100;
  }, []);

  // Convert pixels to percentage for state storage
  const pixelsToPercent = useCallback((pixels, dimension) => {
    const slideElement = elementRef.current?.parentElement;
    if (!slideElement) return 0;
    const total = dimension === 'width' ? slideElement.offsetWidth : slideElement.offsetHeight;
    return (pixels / total) * 100;
  }, []);

  return (
    <Card
      ref={elementRef}
      className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        width: `${size.width}%`,
        height: `${size.height}%`,
        left: `${position.x}%`,
        top: `${position.y}%`,
        cursor: isDragging.current ? 'grabbing' : 'grab',
        backgroundColor: backgroundColor
      }}
      onMouseDown={handleMouseDown}
    >
      {isSelected && (
        <>
          <div
            className="resize-handle absolute w-2 h-2 bg-blue-500 -left-1 -top-1 cursor-nw-resize"
            data-corner="nw"
          />
          <div
            className="resize-handle absolute w-2 h-2 bg-blue-500 -right-1 -top-1 cursor-ne-resize"
            data-corner="ne"
          />
          <div
            className="resize-handle absolute w-2 h-2 bg-blue-500 -left-1 -bottom-1 cursor-sw-resize"
            data-corner="sw"
          />
          <div
            className="resize-handle absolute w-2 h-2 bg-blue-500 -right-1 -bottom-1 cursor-se-resize"
            data-corner="se"
          />
        </>
      )}
      {children}
    </Card>
  );
}

