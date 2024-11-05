import { Paper } from '@mui/material';


const CustomPaper = ({ children }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      {children}
    </Paper>
  );
};

export default CustomPaper;
