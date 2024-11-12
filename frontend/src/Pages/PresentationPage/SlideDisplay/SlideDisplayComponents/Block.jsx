import { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateElementPosition, updateElementSize } from "../../../../State/presentationsSlice";
import { getElementByIndex } from "../../../../HelperFiles/helper";

const Block = ({ parentHeight, parentWidth, index, interactable, slideNum }) => {
  const [showHandles, setShowHandles] = useState(false);
  const rndRef = useRef(null);
  const dispatch = useDispatch();
  const presentations = useSelector(state => state.presentations.presentations);
  const [isDragging, setIsDragging] = useState(false);

  const element = getElementByIndex(presentations, index, slideNum);
  const x = element.position.x * parentWidth;
  const y = element.position.y * parentHeight;
  const width = element.attributes.elementSize.x * parentWidth;
  const height = element.attributes.elementSize.y * parentHeight;

  const handleDoubleClick = () => {
    if (!interactable) {
      return;
    }
    console.log('Double click');
  };
    
  const handleSingleClick = () => {
    if (!interactable) {
      return;
    }

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
    setIsDragging(false);
    dispatch(updateElementPosition({
      index: index,
      position: {
        x: d.x / parentWidth,
        y: d.y / parentHeight
      }
    }));
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
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
      disableDragging={!interactable}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleSingleClick}
      onDragStop={handleDragStop}
      onDrag={() => setIsDragging(true)}
      onResizeStop={handleResizeStop}
      style={{
        touchAction: "none",
        backgroundColor: "transparent",
        border: showHandles ? "1px #4A90E2 solid" : "1px #8f8f8f solid",
        zIndex: index,
        cursor: !interactable ? "inherit" : isDragging ? "move" : "auto"
      }}
    >
      <Box style={{ width: "100%", height: "100%", position: "absolute" }}>
        {/* <Typography sx={{fontSize: "1rem"}}>
          {element.attributes.textContent}
        </Typography> */}

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
