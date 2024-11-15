import { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateElementPosition, updateElementSize, deleteElement } from "../../../../State/presentationsSlice";
import { getElementByIndex, getPresentation, getRoute, getPreviewVersion } from "../../../../HelperFiles/helper";
import Prism from "prismjs";
import TextModal from "../../PresentationComponents/Dialogs/TextModal";
import ImageModal from "../../PresentationComponents/Dialogs/ImageModal";
import VideoModal from "../../PresentationComponents/Dialogs/VideoModal";
import CodeModal from "../../PresentationComponents/Dialogs/CodeModal";

const Block = ({ parentHeight, parentWidth, index, interactable, slideNum, preview = false }) => {
  const [showHandles, setShowHandles] = useState(false);
  const rndRef = useRef(null);
  const dispatch = useDispatch();
  const presentations = useSelector(state => state.presentations.presentations);
  const presentation = getPresentation(presentations);
  const [isDragging, setIsDragging] = useState(false);

  let element;

  if (getRoute() === "preview" && getPreviewVersion()) {
    const version = presentation.versionHistory?.find((version) => version.dateTime == getPreviewVersion());
    element = version.slides[slideNum - 1].contents[index];
  } else  {
    element = getElementByIndex(presentations, index, slideNum);
  }

  // Safely access position and size with fallbacks
  const position = element?.position 
  const size = element?.attributes?.elementSize // Calculate dimensions with safety checks
  const x = (position.x || 0) * parentWidth;
  const y = (position.y || 0) * parentHeight;
  const width = (size.x || 0.5) * parentWidth;
  const height = (size.y || 0.5) * parentHeight;

  // Add state for modal
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleDoubleClick = () => {
    if (!interactable) {
      return;
    }
    console.log('Double click');
    
    setEditModalOpen(true);
    setShowHandles(false);
  };
    
  const handleSingleClick = () => {
    if (!interactable) {
      return;
    }

    setShowHandles(true);
  };

  const handleRightClick = (e) => {
    if (!interactable) {
      return;
    }

    e.preventDefault();
    dispatch(deleteElement(index));
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
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
          {element.attributes.textContent || ""}
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
            objectFit: "contain",
            pointerEvents: "none", 
            userSelect: "none",
            WebkitUserDrag: "none", // Prevents image dragging in webkit browsers
          }}
          draggable={false}
        />
      );
    } else if (element.type === "video") {
      // Construct YouTube URL with parameters
      const videoUrl = new URL(element.attributes.videoSource);
      
      // Add parameters to URL
      const params = new URLSearchParams(videoUrl.search);
      
      if (element.attributes.autoplay) {
        params.set('autoplay', '1');
      }
      if (element.attributes.muted) {
        params.set('mute', '1');
      }      
      // Additional parameters for better integration
      params.set('enablejsapi', '1');
      params.set('rel', '0'); // Don't show related videos
      
      // Combine URL and parameters
      const finalUrl = `${videoUrl.origin}${videoUrl.pathname}?${params.toString()}`;

      return (
        <Box
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: interactable ? "auto" : "none", // Allow video controls when not dragging
            userSelect: "none"
          }}
        >
          <iframe
            src={finalUrl}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              pointerEvents: interactable ? "none" : "auto",
            }}
            allow={`accelerometer; ${element.attributes.autoplay ? 'autoplay; ' : ''}clipboard-write; encrypted-media; gyroscope; picture-in-picture`}
            allowFullScreen
          />
        </Box>
      );
    } else if (element.type == 'code') {
      // Detect the language
      const detectLanguage = (code) => {
        const indicators = {
          python: {
            keywords: ['def ', 'import ', 'class ', 'print(', '__init__', 'if __name__'],
            syntax: [':', '    ', '#'],
          },
          javascript: {
            keywords: ['function', 'const ', 'let ', 'var ', '=>', 'console.log'],
            syntax: [';', '===', '}}'],
          },
          c: {
            keywords: ['#include', 'int main', 'void', 'printf', 'scanf'],
            syntax: ['{', '};', '#define'],
          }
        };
      
        let scores = {
          python: 0,
          javascript: 0,
          c: 0
        };
      
        Object.entries(indicators).forEach(([lang, { keywords, syntax }]) => {
          keywords.forEach(keyword => {
            if (code.includes(keyword)) scores[lang] += 2;
          });
          syntax.forEach(symbol => {
            if (code.includes(symbol)) scores[lang] += 1;
          });
        });
      
        const maxScore = Math.max(...Object.values(scores));
        if (maxScore === 0) return 'javascript'; // default to javascript if no matches
          
        return Object.entries(scores).find(([, score]) => score === maxScore)[0];
      };

      // Detect language and highlight the code
      const language = detectLanguage(element.attributes.textContent);
      const highlighted = Prism.highlight(
        element.attributes.textContent,
        Prism.languages[language],
        language
      );

      return (
        <Box
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            backgroundColor: "#ffffff",
            fontFamily: "monospace",
            fontSize: (element.attributes.fontSize || 1) + "em",
            position: "relative"
          }}
        >
          <pre
            style={{
              margin: 0,
              padding: "8px",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
              overflow: "visible",
              whiteSpace: "pre-wrap",
              wordBreak: "keep-all",
              height: "100%"
            }}
          >
            <code
              dangerouslySetInnerHTML={{ __html: highlighted }}
              style={{ 
                fontFamily: "monospace",
                position: "relative",
                pointerEvents: "none"
              }}
            />
          </pre>
        </Box>
      );

    }
  };

  return (
    <>
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
        onContextMenu={handleRightClick}
        onMouseDown={handleSingleClick}
        onDragStop={handleDragStop}
        onDrag={() => setIsDragging(true)}
        onResizeStop={handleResizeStop}
        style={{
          touchAction: "none",
          backgroundColor: "transparent",
          border: preview ? 'none' : (showHandles ? "1px #4A90E2 solid" : "1px #8f8f8f solid"),
          zIndex: index,
          cursor: !interactable ? "inherit" : isDragging ? "move" : "auto",
          
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
      {/* Add TextModal for editing */}
      {editModalOpen && element.type === 'text' && (
        <TextModal 
          open={editModalOpen}
          handleClose={handleCloseModal}
          initialData={{
            width: element.attributes.elementSize.x,
            height: element.attributes.elementSize.y,
            text: element.attributes.textContent,
            fontSize: parseFloat(element.attributes.fontSize),
            color: element.attributes.color || '#000000',
            index: element.index,
            fontFamily: element.attributes.fontFamily || 'Arial',
          }}
          isEditing={true}
        />
      )}

      {/* Add ImageModal for editing */}
      {editModalOpen && element.type === 'image' && (
        <ImageModal 
          open={editModalOpen}
          handleClose={handleCloseModal}
          initialData={{
            width: element.attributes.elementSize.x,
            height: element.attributes.elementSize.y,
            imageSource: element.attributes.imageSource,
            altText: element.attributes.altText,
            index: element.index
          }}
          isEditing={true}
        />
      )}

      {/* Add VideoModal for editing */}
      {editModalOpen && element.type === 'video' && (
        <VideoModal 
          open={editModalOpen}
          handleClose={handleCloseModal}
          initialData={{
            width: element.attributes.elementSize.x,
            height: element.attributes.elementSize.y,
            videoSource: element.attributes.videoSource,
            altText: element.attributes.altText,
            autoplay: element.attributes.autoplay,
            muted: element.attributes.muted,
            controls: element.attributes.controls,
            index: element.index
          }}
          isEditing={true}
        />
      )}

      {/* Add CodeModal for editing */}
      {editModalOpen && element.type === 'code' && (
        <CodeModal 
          open={editModalOpen}
          handleClose={handleCloseModal}
          initialData={{
            width: element.attributes.elementSize.x,
            height: element.attributes.elementSize.y,
            textContent: element.attributes.textContent,
            fontSize: element.attributes.fontSize,
            index: element.index
          }}
          isEditing={true}
        />
      )}
    </>
  );
};

export default Block;
