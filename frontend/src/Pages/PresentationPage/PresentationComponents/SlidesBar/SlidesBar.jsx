import { Box, IconButton } from "@mui/material";
import { ArrowRight, ArrowLeft } from '@mui/icons-material';
import SlidesBarComponent from "./SlidesBarComponent";
import AddSlidesBarComponent from "./AddSlidesBarComponent";
import { useSelector } from 'react-redux';
import { getSlidePositionById, getSlides } from "../../../../HelperFiles/helper";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useDispatch } from "react-redux";
import { updateSlidesBarOrder } from "../../../../State/presentationsSlice";

const SlidesBar = () => {
  const presentations = useSelector((state) => state.presentations.presentations);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dragAutoScrollable, setDragAutoScrollable] = useState(true);
  const [scrollWidth, setScrollWidth] = useState(null);
  const slidesContainer = useRef(null);
  const slidesBar = useRef(null);

  useEffect(() => {
    const handleKeyboardInput = (e) => {
      if (e.key === 'ArrowLeft' && parseInt(location.hash.split("/")[1]) > 1) {
        navigate(`${location.pathname}#/${parseInt(location.hash.split("/")[1]) - 1}`);
      }
      if (e.key === 'ArrowRight' && parseInt(location.hash.split("/")[1]) < getSlides(presentations).length) {
        navigate(`${location.pathname}#/${parseInt(location.hash.split("/")[1]) + 1}`);
      }
    };

    document.addEventListener("keydown", handleKeyboardInput);
    return () => document.removeEventListener("keydown", handleKeyboardInput);
  }, [presentations, navigate]);

  const handleDragEnd = (e) => {
    if (e.active.id === e.over.id) {
      return;
    }

    const activeIndex = getSlidePositionById(presentations, e.active.id) - 1;
    const overIndex = getSlidePositionById(presentations, e.over.id) - 1;
    
    dispatch(updateSlidesBarOrder({ active: e.active.id, over: e.over.id }));
  };

  const handleDragMove = (e) => {
    const isScrolledToLeft = slidesContainer.current.scrollLeft === 0;
    const isScrolledToRight = Math.min(slidesContainer.current.scrollLeft, scrollWidth - slidesContainer.current.clientWidth) === scrollWidth - slidesContainer.current.clientWidth;
    
    const parentRect = slidesContainer.current.getBoundingClientRect();
    const itemRect = e.active.rect.current.translated;
    const parentMiddleX = parentRect.left + parentRect.width / 2;
    const isDraggedToLeftSide = itemRect.right <= parentMiddleX;
    const isDraggedToRightSide = itemRect.left >= parentMiddleX;

    const isWithinParent =
        (itemRect.top >= parentRect.top && itemRect.bottom <= parentRect.bottom) &&
        ((isDraggedToRightSide && !isScrolledToRight) ||
        (isDraggedToLeftSide && !isScrolledToLeft));

    setDragAutoScrollable(isWithinParent);
  };

  const handleDragStart = () => {
    setScrollWidth(slidesContainer.current.scrollWidth);
  };

  const sensors = useSensor(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <Box sensors={sensors} ref={slidesBar} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "primary.main", width: "100%", minHeight: 100 }}>
      <IconButton disabled={location.hash.split("/")[1] == 1} onClick={() => { navigate(`${location.pathname}#/${parseInt(location.hash.split("/")[1]) - 1}`); }} sx={{ color: 'white' }}>
        <ArrowLeft />
      </IconButton >

      <Box ref={slidesContainer} sx={{ display: "flex", alignItems: "center", gap: "2%", width: "100%", height: "100%", overflowX: "auto" }}>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragMove={handleDragMove} autoScroll={dragAutoScrollable} onDragStart={handleDragStart}>
          {getSlides(presentations) && (
            <SortableContext items={getSlides(presentations)} strategy={horizontalListSortingStrategy}>
              {getSlides(presentations)?.map((slide) => (
                <SlidesBarComponent id={slide.id} key={slide.slideNum} index={slide.slideNum} />
              ))}
            </SortableContext>
          )}
        </DndContext>

        <AddSlidesBarComponent />
      </Box>

      <IconButton disabled={location.hash.split("/")[1] == getSlides(presentations)?.length} onClick={() => { navigate(`${location.pathname}#/${parseInt(location.hash.split("/")[1]) + 1}`); }} sx={{ color: 'white' }}>
        <ArrowRight />
      </IconButton>
    </Box>
  );
};

export default SlidesBar;
