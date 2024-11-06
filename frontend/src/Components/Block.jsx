import { useState } from "react";
import { Rnd } from "react-rnd";

export default function Block({
  type,
  initialSize = { width: 50, height: 50 }, // percentage sizes
  initialPosition = { x: 0, y: 0 }, // percentage positions
  layerOrder,
  onEdit,
  onDelete,
  contentProps,
}) {
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(initialPosition);
  const [isEditing, setIsEditing] = useState(false);
  
  // Convert percentage to absolute pixels based on parent container size
  const containerWidth = 800; // Example slide width
  const containerHeight = 600; // Example slide height
  
  const calculateAbsolutePosition = () => ({
    x: (position.x / 100) * containerWidth,
    y: (position.y / 100) * containerHeight,
  });
  
  const calculateAbsoluteSize = () => ({
    width: (size.width / 100) * containerWidth,
    height: (size.height / 100) * containerHeight,
  });
  
  // Handle double-click to enter editing mode
  const handleDoubleClick = () => {
    setIsEditing(true);
    onEdit && onEdit();
  };
  
  // Handle right-click to delete
  const handleContextMenu = (e) => {
    e.preventDefault();
    onDelete && onDelete();
  };
  return (
    <div>Block</div>
  )
}
