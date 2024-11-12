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
  // Safely access position and size with fallbacks
  const position = element?.position 
  const size = element?.attributes?.elementSize // Calculate dimensions with safety checks
  const x = (position.x || 0) * parentWidth;
  const y = (position.y || 0) * parentHeight;
  const width = (size.x || 0.5) * parentWidth;
  const height = (size.y || 0.5) * parentHeight;

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
    // Calculate new relative sizes
    const newSizeX = ref.offsetWidth / parentWidth;
    const newSizeY = ref.offsetHeight / parentHeight;

    // Calculate new relative positions
    const newPositionX = position.x / parentWidth;
    const newPositionY = position.y / parentHeight;

    // Update size
    dispatch(updateElementSize({
      index: index,
      size: {
        x: newSizeX,
        y: newSizeY
      }
    }));

    // Update position
    dispatch(updateElementPosition({
      index: index,
      position: {
        x: newPositionX,
        y: newPositionY
      }
    }));
  };

  const renderContent = () => {
    if (element.type === "text") {
      return (
        <Typography
          style={{
            width: "100%",
            height: "100%",
            padding: "8px",
            fontSize: element.attributes.fontSize || "16px",
            fontFamily: element.attributes.fontFamily || "Arial",
            color: element.attributes.color || "#000000",
            fontWeight: element.attributes.fontWeight || "normal",
            fontStyle: element.attributes.fontStyle || "normal",
            textDecoration: element.attributes.textDecoration || "none",
            textAlign: element.attributes.textAlign || "left",
            overflow: "hidden",
            wordWrap: "break-word"
          }}
        >
          {element.attributes.text || ""}
        </Typography>
      );
    } else if (element.type === "image") {
      return (
        <img
          src={element.attributes.imageSource}
          alt={element.attributes.altText}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      );
    }
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
        {renderContent()}

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
