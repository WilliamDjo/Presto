import { Container, Box } from '@mui/material';
import CustomPaper from './CustomPaper';


const CentralPanel = ({ children, maxWidth = "xs" }) => {
  return (
    <Box display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Container maxWidth={maxWidth}>
        <CustomPaper>
          {children}
        </CustomPaper>
      </Container>
    </Box>
  );
};

export default CentralPanel;