import { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateElementPosition, updateElementSize } from "../../../../State/presentationsSlice";
import { getElementByIndex } from "../../../../HelperFiles/helper";

const Block = ({ parentHeight, parentWidth, index }) => {
  const [showHandles, setShowHandles] = useState(false);
  const rndRef = useRef(null);
  const dispatch = useDispatch();
  const presentations = useSelector(state => state.presentations.presentations);

  const element = getElementByIndex(presentations, index);
  const x = element.position.x * parentWidth;
  const y = element.position.y * parentHeight;
  const width = element.attributes.elementSize.x * parentWidth;
  const height = element.attributes.elementSize.y * parentHeight;

  const handleDoubleClick = () => {
    console.log('Double click');
  };
    
  const handleSingleClick = () => {
    setShowHandles(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rndRef.current && !rndRef.current.resizableElement.current.contains(event.target)) {
        setShowHandles(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDragStop = (e, d) => {
    dispatch(updateElementPosition({
      index: index,
      position: {
        x: d.x / parentWidth,
        y: d.y / parentHeight
      }
    }));
  };

  const handleResizeStop = (ref, position) => {
    dispatch(updateElementSize({
      index: index,
      size: {
        x: ref.offsetWidth / parentWidth,
        y: ref.offsetHeight / parentHeight
      }
    }));
    dispatch(updateElementPosition({
      index: index,
      position: {
        x: position.x / parentWidth,
        y: position.y / parentHeight
      }
    }));
  };

  return (
    <Rnd
      ref={rndRef}
      position={{ x, y }}
      size={{ width, height }}
      minWidth="1%"
      minHeight="1%"
      bounds="parent"
      enableResizing={showHandles}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleSingleClick}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      style={{
        touchAction: "none",
        backgroundColor: "transparent",
        border: showHandles ? "1px #4A90E2 solid" : "1px #8f8f8f solid",
        zIndex: index
      }}
    >
      <Box style={{ width: "100%", height: "100%", position: "absolute" }}>
        {showHandles &&
          ["top-left", "top-right", "bottom-left", "bottom-right"].map(
            (corner) => (
              <Box
                key={corner}
                style={{
                  width: "5px",
                  height: "5px",
                  backgroundColor: "#4A90E2",
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
      </Box>
    </Rnd>
  );
};

export default Block;
