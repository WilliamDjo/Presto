import { useEffect, useState, useRef, useCallback } from 'react';
import { Card, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ResizeHandle = styled(Box)(({ corner }) => ({
  position: 'absolute',
  width: 8,
  height: 8,
  backgroundColor: '#2196f3',
  ...(corner === 'nw' && {
    left: -4,
    top: -4,
    cursor: 'nw-resize',
  }),
  ...(corner === 'ne' && {
    right: -4,
    top: -4,
    cursor: 'ne-resize',
  }),
  ...(corner === 'sw' && {
    left: -4,
    bottom: -4,
    cursor: 'sw-resize',
  }),
  ...(corner === 'se' && {
    right: -4,
    bottom: -4,
    cursor: 'se-resize',
  }),
}));

const DraggableCard = styled(Card)(({ isSelected, isDragging }) => ({
  position: 'absolute',
  cursor: isDragging ? 'grabbing' : 'grab',
  border: isSelected ? '2px solid #2196f3' : 'none',
  boxSizing: 'border-box',
}));

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

  const handleMouseDown = (e) => {
    if (e.target.getAttribute('data-resize')) {
      isResizing.current = true;
      resizeCorner.current = e.target.getAttribute('data-corner');
      initialSizeRef.current = {
        width: percentToPixels(size.width, 'width'),
        height: percentToPixels(size.height, 'height')
      };
      initialPosRef.current = {
        x: percentToPixels(position.x, 'width'),
        y: percentToPixels(position.y, 'height')
      };
    } else {
      isDragging.current = true;
      initialPosRef.current = {
        x: percentToPixels(position.x, 'width'),
        y: percentToPixels(position.y, 'height')
      };
    }
    dragStart.current = { x: e.clientX, y: e.clientY };
    setIsSelected(true);
    e.stopPropagation();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current && !isResizing.current) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    const slideElement = elementRef.current?.parentElement;
    
    if (!slideElement) return;

    if (isResizing.current) {
      let newWidth = initialSizeRef.current.width;
      let newHeight = initialSizeRef.current.height;
      let newX = initialPosRef.current.x;
      let newY = initialPosRef.current.y;

      switch (resizeCorner.current) {
        case 'nw':
          newWidth = initialSizeRef.current.width - deltaX;
          newHeight = initialSizeRef.current.height - deltaY;
          newX = initialPosRef.current.x + deltaX;
          newY = initialPosRef.current.y + deltaY;
          break;
        case 'ne':
          newWidth = initialSizeRef.current.width + deltaX;
          newHeight = initialSizeRef.current.height - deltaY;
          newY = initialPosRef.current.y + deltaY;
          break;
        case 'sw':
          newWidth = initialSizeRef.current.width - deltaX;
          newHeight = initialSizeRef.current.height + deltaY;
          newX = initialPosRef.current.x + deltaX;
          break;
        case 'se':
          newWidth = initialSizeRef.current.width + deltaX;
          newHeight = initialSizeRef.current.height + deltaY;
          break;
      }

      const minWidth = slideElement.offsetWidth / 100;
      const minHeight = slideElement.offsetHeight / 100;
      newWidth = Math.max(newWidth, minWidth);
      newHeight = Math.max(newHeight, minHeight);

      newWidth = Math.min(newWidth, slideElement.offsetWidth - newX);
      newHeight = Math.min(newHeight, slideElement.offsetHeight - newY);

      setSize({
        width: pixelsToPercent(newWidth, 'width'),
        height: pixelsToPercent(newHeight, 'height')
      });
      setPosition({
        x: pixelsToPercent(Math.max(0, newX), 'width'),
        y: pixelsToPercent(Math.max(0, newY), 'height')
      });
    } else if (isDragging.current) {
      const newX = Math.max(0, Math.min(
        initialPosRef.current.x + deltaX,
        slideElement.offsetWidth - percentToPixels(size.width, 'width')
      ));
      const newY = Math.max(0, Math.min(
        initialPosRef.current.y + deltaY,
        slideElement.offsetHeight - percentToPixels(size.height, 'height')
      ));

      setPosition({
        x: pixelsToPercent(newX, 'width'),
        y: pixelsToPercent(newY, 'height')
      });
    }
  }, [percentToPixels, pixelsToPercent, size.width, size.height]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    isResizing.current = false;
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    if (isSelected) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isSelected, handleMouseMove, handleMouseUp]);

  // Handle clicking outside to deselect
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (elementRef.current && !elementRef.current.contains(e.target)) {
        setIsSelected(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DraggableCard
      ref={elementRef}
      isSelected={isSelected}
      isDragging={isDragging.current}
      sx={{
        width: `${size.width}%`,
        height: `${size.height}%`,
        left: `${position.x}%`,
        top: `${position.y}%`,
        backgroundColor,
      }}
      onMouseDown={handleMouseDown}
      elevation={isSelected ? 8 : 1}
    >
      {isSelected && (
        <>
          <ResizeHandle corner="nw" data-resize data-corner="nw" />
          <ResizeHandle corner="ne" data-resize data-corner="ne" />
          <ResizeHandle corner="sw" data-resize data-corner="sw" />
          <ResizeHandle corner="se" data-resize data-corner="se" />
        </>
      )}
      {children}
    </DraggableCard>
  );
  );
}

