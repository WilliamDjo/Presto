import { Box, Typography, IconButton } from '@mui/material';
import { Settings, Delete, Image } from '@mui/icons-material';
import BackButton from '../../../../Components/BackButton';
import { useSelector } from 'react-redux';
import { getPresentationTitle } from '../../../../HelperFiles/helper';
import { useNavigate } from 'react-router-dom';

const Header = ({ 
  onSettingsClick,
  onDeleteClick
}) => {
  const presentations = useSelector((state) => state.presentations.presentations);
  const saveStatus = useSelector((state) => state.saveStatus) ? "Saved" : "Saving...";
  const navigate = useNavigate();

  // Get the current presentation's thumbnail
  const currentPresentation = presentations?.find((presentation) => 
    presentation.id == location.pathname.split("/")[2]
  );
  const thumbnail = currentPresentation?.thumbnail;

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
        <BackButton onClick={() => navigate("/dashboard")} />
        {thumbnail ? (
          <Box
            component="img"
            src={thumbnail}
            sx={{
              width: 40,
              height: 40,
              objectFit: 'cover',
              borderRadius: 1
            }}
          />
        ) : (
          <Image />
        )}
        <Box sx={{display: "flex", flexDirection: "column"}}>
          <Box sx={{display: "flex", gap: 0.5}}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{getPresentationTitle(presentations)}</Typography>
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