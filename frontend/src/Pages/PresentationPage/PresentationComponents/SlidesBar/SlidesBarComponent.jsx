import { Box, Typography, IconButton } from '@mui/material';
import { Settings, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const SlidesBarComponent = ({ index, sx = { 
  height: "60%", 
  minWidth: "8%", 
  backgroundColor: "white", 
  display: "flex", 
  justifyContent: "center", 
  alignItems: "center", 
  borderRadius: "10px", 
  cursor: "pointer", 
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  '&:hover': {
    backgroundColor: "#f0f0f0",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
  },
  border: index == location.hash.split("/")[1] ? "2px solid black" : ""
}}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box 
      onClick={() => navigate(`${location.pathname}#/${index}`)} 
      sx={{ 
        ...sx, 
        position: "relative", 
        '&:hover .icon-buttons': { // Show buttons on hover
          opacity: 1 
        }
      }}
    >
      <Box 
        className="icon-buttons" 
        sx={{ 
          position: "absolute", 
          top: 0, 
          right: 0, 
          display: "flex", 
          justifyContent: "space-between", 
          width: "100%", 
          opacity: 0, // Initially hidden
          transition: "opacity 0.3s ease" // Smooth transition
        }}
      >
        <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
          <Settings />
        </IconButton>
        <IconButton size="small" sx={{ color: "red" }}>
          <Delete />
        </IconButton>
      </Box>
      <Typography>
        {index}
      </Typography>
    </Box>
  );
};

export default SlidesBarComponent;
