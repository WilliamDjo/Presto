import React, { useEffect, useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton } from '@mui/material';
import { Settings, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSlide, deletePresentation } from '../../../../State/presentationsSlice';
import { getSlides, getSlideByPosition, renderBackground } from '../../../../HelperFiles/helper';
import Block from '../../SlideDisplay/SlideDisplayComponents/Block';
import { DeleteConfirmDialog } from '../Dialogs/DeleteConfirmDialog';

const SlidesBarComponent = ({ id, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({animateLayoutChanges: () => false , id });
  const [isDraggingEvent, setIsDraggingEvent] = useState(false);
  const [mousePosition, setMousePosition] = useState(null);
  const [parentDimensions, setParentDimensions] = useState({ width: 0, height: 0 });
  const presentations = useSelector(state => state.presentations.presentations);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const parentRef = useRef(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isLastSlide = getSlides(presentations).length === 1;

  const handleDeletePresentation = () => {
    dispatch(deletePresentation(parseInt(location.pathname.split("/")[2])));
    navigate("/dashboard");
    setDeleteDialogOpen(false);
  };

  // Retrieve the parent container's dimensions on mount
  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = parentRef.current.getBoundingClientRect();
      setParentDimensions({ width, height });
    };

    updateDimensions();

    window.addEventListener("resize", () => updateDimensions());
    return () => window.removeEventListener("resize", () => updateDimensions());
  }, []);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDraggingEvent ? 'grabbing' : 'pointer',
    position: 'relative',
    minWidth: "8%",
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    borderRadius: "10px", 
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    '&:hover': {
      backgroundColor: "#f0f0f0",
      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
    },
    border: index === parseInt(location.hash.split("/")[1]) ? "2px solid black" : ""
  };

  useEffect(() => {
    const handleMouseMove = () => setIsDraggingEvent(true);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      setIsDraggingEvent(false);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      setIsDraggingEvent(false);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e) => {
    if (Math.pow(mousePosition.x - e.clientX, 2) + Math.pow(mousePosition.y - e.clientY, 2) <= 100) {
      if (e.target.closest('#delete-button')) {
        handleDeleteClick();
      } else if (e.target.closest('#settings-button')) {
        console.log('Settings button clicked');
      } else {
        navigate(`${location.pathname}#/${index}`);
      }
    } else {
      console.log('Drag event detected');
    }
  };

  const handleDeleteClick = () => {
    if (getSlides(presentations).length > 1) {
      dispatch(deleteSlide(index));
      if (index <= parseInt(location.hash.split("/")[1]) && parseInt(location.hash.split("/")[1]) !== 1) {
        navigate(`${location.pathname}#/${parseInt(location.hash.split("/")[1]) - 1}`);
      }
    } else {
      setDeleteDialogOpen(true);
    }
  };

  return (
    <>
      <Box
        ref={(el) => {
          setNodeRef(el);
          parentRef.current = el;
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...attributes}
        {...listeners}
        sx={{
          ...style,
          'touchAction': 'none',
          'aspectRatio': 16/9,
          '&:hover .icon-buttons': { opacity: 1 }
        }}
      >
        <Box sx={{...renderBackground(presentations), width: "100%", height: "100%"}}>
          <Box 
            className="icon-buttons" 
            sx={{ 
              position: "absolute",
              top: 0, 
              right: 0, 
              display: "flex", 
              justifyContent: "space-between", 
              width: "100%", 
              opacity: 0, 
              transition: "opacity 0.3s ease",
              zIndex: 999
            }}
          >
            <IconButton id="settings-button" size="small" sx={{ color: theme.palette.primary.main, zIndex: 1000 }} onClick={(e) => e.stopPropagation()}>
              <Settings />
            </IconButton>
            <IconButton
              id="delete-button" 
              size="small" 
              sx={{ color: "red" }}
            >
              <Delete />
            </IconButton>
          </Box>
          
          {getSlideByPosition(presentations, index)?.contents.map((element) => (
            <Block
              interactable={false} 
              parentHeight={parentDimensions.height} 
              parentWidth={parentDimensions.width} 
              key={element.index} 
              index={element.index} 
              slideNum={index}
            />
          ))}
        </Box>
      </Box>

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeletePresentation}
          slideIndex={index}
          isLastSlide={isLastSlide}
        />
    </>
  );
};

export default SlidesBarComponent;
