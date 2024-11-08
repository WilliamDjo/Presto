import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

  return (
    <Box onClick={() => navigate(`${location.pathname}#/${index}`)} sx={{ ...sx }}>
      <Typography>
        {index}
      </Typography>
    </Box>
  );
};

export default SlidesBarComponent;
