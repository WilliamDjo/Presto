import { Box, IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import PreviewButton from '../../../../../Components/PreviewButton';

const HeaderActions = ({ onDeleteClick }) => (
  <Box sx={{ display: 'flex', gap: 1 }}>
    <Tooltip title="Preview Presentation">
      <Box>
        <PreviewButton />
      </Box>
    </Tooltip>
    <IconButton onClick={onDeleteClick}>
      <Delete sx={{ color: "white" }} />
    </IconButton>
  </Box>
);

export default HeaderActions;
