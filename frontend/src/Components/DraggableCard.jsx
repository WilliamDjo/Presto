import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

const DraggableCard = styled(Card, {
  shouldForwardProp: prop => !['isSelected', 'isDragging'].includes(prop)
})(({ theme, isSelected, isDragging }) => ({
  position: 'absolute',
  cursor: isDragging ? 'grabbing' : 'grab',
  border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
  boxSizing: 'border-box',
}));

export default DraggableCard;