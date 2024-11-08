import { Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addNewSlide } from '../../../../State/presentationsSlice';

const AddSlidesBarComponent = ({ sx = { 
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
  }
}}) => {
  const dispatch = useDispatch();

  return (
    <Box onClick={() => {dispatch(addNewSlide())}} sx={{ ...sx }}>
      <Add />
    </Box>
  );
};

export default AddSlidesBarComponent;