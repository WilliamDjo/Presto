import { useState, useRef, useCallback } from 'react';

export default function Slide({ children, initialPosition = { x: 0, y: 0 }, initialSize = { width: 30, height: 30 } }) {
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
    <div>DraggableResizable</div>
  )
}
