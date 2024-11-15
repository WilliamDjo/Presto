import { useEffect, useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton, Button, Dialog, DialogContent, DialogTitle, DialogActions, Stack, InputLabel, Select, MenuItem, TextField, Card, CardActionArea, CardMedia, Typography, Divider } from '@mui/material';
import { Settings, Delete, Image } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSlide, deletePresentation, updateSlideBackground, updateSlideTranistion } from '../../../../State/presentationsSlice';
import { getSlides, getSlideByPosition, renderBackground, getCurrentSlideNum, getCurrentPresentationId } from '../../../../HelperFiles/helper';
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
  const [openComponentSettings, setOpenComponentSettings] = useState(false);
  const [backgroundSetting, setBackgroundSetting] = useState({ type: "solid", attributes: { color: "#FFFFFF" } });
  const [slideTransition, setSlideTransition] = useState("none");
  const [showDefaultImage, setShowDefaultImage] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (openComponentSettings) {
      const initialBackgroundSetting = getSlideByPosition(presentations, index).background;
      setBackgroundSetting(initialBackgroundSetting);
      setShowDefaultImage(!initialBackgroundSetting.attributes.image);
    }
  }, [openComponentSettings, presentations, index]);
  
  const handleSave = () => {
    // Clone backgroundSetting to modify it safely
    const updatedBackgroundSetting = JSON.parse(JSON.stringify(backgroundSetting));

    const defaultBackgroundAttributesSettings = {
      color: "#FFFFFF",
      startingColor: "#FFFFFF",
      endingColor: "#FFFFFF",
      angle: 0,
      image: ""
    }
    updatedBackgroundSetting.attributes = defaultBackgroundAttributesSettings;
  
    // Reset non-relevant fields for each background type
    switch (updatedBackgroundSetting.type) {
    case "solid":
      updatedBackgroundSetting.attributes.color = backgroundSetting.attributes.color;
      break;
    case "gradient":
      updatedBackgroundSetting.attributes.startingColor = backgroundSetting.attributes.startingColor;
      updatedBackgroundSetting.attributes.endingColor = backgroundSetting.attributes.endingColor;
      updatedBackgroundSetting.attributes.angle = backgroundSetting.attributes.angle;
      break;
    case "image":
      updatedBackgroundSetting.attributes.image = backgroundSetting.attributes.image;
      break;
    }
  
    dispatch(updateSlideBackground({updatedBackgroundSetting, index}));
    dispatch(updateSlideTranistion({slideTransition, index}));
    
    setOpenComponentSettings(false);
  };

  const handleBackgroundChange = (field, nestedField) => (event) => {
    setBackgroundSetting((prev) => ({
      ...prev,
      [field]: nestedField 
        ? { ...prev[field], [nestedField]: event.target.value }
        : event.target.value,
    }));
  };

  const onBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundSetting(prev => ({
          ...prev,
          attributes: { ...prev.attributes, image: e.target.result }
        }));
        setShowDefaultImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCardClick = () => {
    fileInputRef.current.click();
  };

  const handleDeletePresentation = () => {
    dispatch(deletePresentation(parseInt(getCurrentPresentationId())));
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
    minWidth: "100px",
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
    border: index === parseInt(getCurrentSlideNum()) ? "2px solid black" : ""
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
        setOpenComponentSettings(true);
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
      if (index <= parseInt(getCurrentSlideNum()) && parseInt(getCurrentSlideNum()) !== 1) {
        navigate(`${location.pathname}#/${parseInt(getCurrentSlideNum()) - 1}`);
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
        