import React, { useEffect, useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton, IconButton } from '@mui/material';
import { Settings, Delete } from '@mui/icons-material';
import { Settings, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSlide } from '../../../../State/presentationsSlice';
import { getSlides, getSlideByPosition } from '../../../../HelperFiles/helper';
import Block from '../../SlideDisplay/SlideDisplayComponents/Block';

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
    backgroundColor: "white", 
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
    dispatch(deleteSlide(index));
    if (index <= parseInt(location.hash.split("/")[1]) && parseInt(location.hash.split("/")[1]) !== 1) {
      navigate(`${location.pathname}#/${parseInt(location.hash.split("/")[1]) - 1}`);
    }
    if (getSlides(presentations).length === 1) {
      console.log('Prompt user to delete presentation');
    }
  };
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { deleteSlide } from '../../../../State/presentationsSlice';
import { getSlides } from '../../../../HelperFiles/helper';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { DeleteConfirmDialog } from '../Dialogs/DeleteConfirmDialog';

const SlidesBarComponent = ({ index, sx = { 
  height: "60%", 
  minWidth: "8%", 
  backgroundColor: "white", 
  display: "flex", 
  justifyContent: "center", 
  alignItems: "center", 
  borderRadius: "10px", 
  cursor: "pointer", 
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  '&:hover': {
    backgroundColor: "#f0f0f0",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
  },
  border: index == location.hash.split("/")[1] ? "2px solid black" : ""
}}) => {
  const presentations = useSelector(state => state.presentations.presentations);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  // State for managing dialog visibility
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Check if this is the last slide
  const isLastSlide = getSlides(presentations).length === 1;

  // Function to handle box click and navigate
  const handleBoxClick = () => {
    navigate(`${location.pathname}#/${index}`);
  };

  // Function to handle slide deletion
  const handleDeleteSlide = () => {
    dispatch(deleteSlide(index));
    if (index <= parseInt(location.hash.split("/")[1]) && parseInt(location.hash.split("/")[1]) !== 1) {
      navigate(`${location.pathname}#/${parseInt(location.hash.split("/")[1]) - 1}`);
    }
    // if (getSlides(presentations).length === 1) {
    //   setDeletePresentationDialogOpen(true);
    // }
    setDeleteDialogOpen(false);
  };

  return (
    // This is the parent box
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
          transition: "opacity 0.3s ease"
        }}
      >
        <IconButton id="settings-button" size="small" sx={{ color: theme.palette.primary.main }} onClick={(e) => e.stopPropagation()}>
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
    <>
      <Box 
        onClick={handleBoxClick} 
        sx={{ 
          ...sx, 
          position: "relative", 
          '&:hover .icon-buttons': { // Show buttons on hover
            opacity: 1 
          }
        }}
      >
        <Box 
          className="icon-buttons" 
          sx={{ 
            position: "absolute", 
            top: 0, 
            right: 0, 
            display: "flex", 
            justifyContent: "space-between", 
            width: "100%", 
            opacity: 0, // Initially hidden
            transition: "opacity 0.3s ease" // Smooth transition
          }}
        >
          {/* Prevent propagation for button clicks */}
          <IconButton size="small" sx={{ color: theme.palette.primary.main }} onClick={(e) => e.stopPropagation()}>
            <Settings />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ color: "red" }} 
            onClick={(e) => { 
              e.stopPropagation();
              setDeleteDialogOpen(true);
            }}
          >
            <Delete />
          </IconButton>
        </Box>

        <Typography>
          {index}
        </Typography>
      </Box>


      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteSlide}
        slideIndex={index}
        isLastSlide={isLastSlide}
      />
    </>
  
  );
};

export default SlidesBarComponent;
