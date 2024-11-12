import { Box, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

const HeaderActions = ({ onDeleteClick }) => (
  <Box>
    <IconButton onClick={onDeleteClick}>
      <Delete sx={{color: "white"}}/>
    </IconButton>
  </Box>
);

export default HeaderActions;