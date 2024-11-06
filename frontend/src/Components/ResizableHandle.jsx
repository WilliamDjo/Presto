import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const ResizeHandle = styled(Box, {
  shouldForwardProp: prop => prop !== 'corner'
})(({ corner }) => ({
  position: 'absolute',
  width: 8,
  height: 8,
  backgroundColor: '#2196f3',
  ...(corner === 'nw' && {
    left: -4,
    top: -4,
    cursor: 'nw-resize',
  }),
  ...(corner === 'ne' && {
    right: -4,
    top: -4,
    cursor: 'ne-resize',
  }),
  ...(corner === 'sw' && {
    left: -4,
    bottom: -4,
    cursor: 'sw-resize',
  }),
  ...(corner === 'se' && {
    right: -4,
    bottom: -4,
    cursor: 'se-resize',
  }),
}));

export default ResizeHandle;