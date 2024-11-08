import { Box, Typography, IconButton } from '@mui/material';
import { Settings } from '@mui/icons-material';

const HeaderTitle = ({ title, saveStatus, onSettingsClick }) => (
  <Box sx={{display: "flex", flexDirection: "column"}}>
    <Box sx={{display: "flex", gap: 0.5}}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <IconButton size="small" sx={{color: "white"}} onClick={onSettingsClick}>
        <Settings />
      </IconButton>
    </Box>
    <Typography variant="body2" sx={{ fontWeight: "semi-bold" }}>
      {saveStatus}
    </Typography>
  </Box>
);

export default HeaderTitle;