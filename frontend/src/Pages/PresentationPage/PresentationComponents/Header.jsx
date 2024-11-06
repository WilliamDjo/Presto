import { Box, Typography, IconButton } from '@mui/material';
import { Settings, Delete, Image } from '@mui/icons-material';
import BackButton from '../../../Components/BackButton';

const Header = ({ 
  title, 
  saveStatus, 
  onBackClick, 
  onSettingsClick, 
  onDeleteClick 
}) => {
  return (
    <Box sx={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      p: 2, 
      backgroundColor: 'primary.main', 
      color: 'white', 
      gap: 2, 
      minHeight: 100 
    }}>
      <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
        <BackButton onClick={onBackClick} />
        <Image />
        <Box sx={{display: "flex", flexDirection: "column"}}>
          <Box sx={{display: "flex", gap: 0.5}}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
            <IconButton size="small" sx={{color: "white"}} onClick={onSettingsClick}>
              <Settings />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: "semi-bold" }}>{saveStatus}</Typography>
        </Box>
      </Box>
      <Box>
        <IconButton onClick={onDeleteClick}>
          <Delete sx={{color: "white"}}/>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header;