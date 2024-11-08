import { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";

export default function Block({ initialWidth, initialHeight, initialX, initialY, children, styles }) {
  const [isMovable, setIsMovable] = useState(true);
  const [showHandles, setShowHandles] = useState(false);
  const rndRef = useRef(null);
  
  const handleDoubleClick = () => {
    setIsMovable(!isMovable);
    setShowHandles(false);
  };
    
  const handleSingleClick = () => {
    setShowHandles(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click was outside the Rnd component
      if (rndRef.current && !rndRef.current.resizableElement.current.contains(event.target)) {
        setShowHandles(false);
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


    
  return (
    <Rnd
      ref={rndRef}
      default={{
        x: initialX,
        y: initialY,
        width: initialWidth,
        height: initialHeight,
      }}
      minWidth={initialWidth * 0.01} // Minimum 1% of initial width
      minHeight={initialHeight * 0.01} // Minimum 1% of initial height
      bounds="parent"
      enableResizing={showHandles}
      disableDragging={!isMovable}
      onDoubleClick={handleDoubleClick}
      onClick={handleSingleClick}
      style={{...styles, touchAction: "none"}}
    >
      <div style={{ width: "100%", height: "100%", position: "absolute" }}>
        {children}
        {showHandles &&
          ["top-left", "top-right", "bottom-left", "bottom-right"].map(
            (corner) => (
              <div
                key={corner}
                style={{
                  width: "5px",
                  height: "5px",
                  backgroundColor: "black",
                  position: "absolute",
                  cursor: "pointer",
                  ...(corner.includes("top")
                    ? { top: "-3px" }
                    : { bottom: "-3px" }),
                  ...(corner.includes("left")
                    ? { left: "-3px" }
                    : { right: "-3px" }),
                }}
              />
            )
          )}
      </div>
    </Rnd>
  );
}
