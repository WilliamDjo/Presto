import { useState } from "react";
import { Rnd } from "react-rnd";

export default function Block({ initialWidth, initialHeight, initialX, initialY, children, styles }) {
  const [isMovable, setIsMovable] = useState(true);
  const [showHandles, setShowHandles] = useState(false);
  
  const handleDoubleClick = () => {
    setIsMovable(!isMovable);
    setShowHandles(!isMovable);
  };
    
  const handleSingleClick = () => {
    setShowHandles(true);
  };
    
  return (
    <Rnd
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
      style={styles}
    >
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {children}
        {showHandles &&
              ["top-left", "top-right", "bottom-left", "bottom-right"].map((corner) => (
                <div
                  key={corner}
                  style={{
                    width: "5px",
                    height: "5px",
                    backgroundColor: "black",
                    position: "absolute",
                    ...(corner.includes("top") ? { top: "-3px" } : { bottom: "-3px" }),
                    ...(corner.includes("left") ? { left: "-3px" } : { right: "-3px" }),
                  }}
                />
              ))}
      </div>
    </Rnd>
  );
}
