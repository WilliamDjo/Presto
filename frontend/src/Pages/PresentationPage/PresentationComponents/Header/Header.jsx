import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../../../Components/BackButton';
import ThumbnailDisplay from '../../../../Components/ThumbnailDisplay';
import HeaderTitle from './HeaderComponents/HeaderTitle';
import HeaderActions from './HeaderComponents/HeaderActions';
import { usePresentation } from '../../../../HelperFiles/helper';

const Header = ({ onSettingsClick, onDeleteClick }) => {
  const navigate = useNavigate();
  const { title, thumbnail, saveStatus } = usePresentation();

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
        <ThumbnailDisplay thumbnail={thumbnail} />
        <HeaderTitle 
          title={title}
          saveStatus={saveStatus}
          onSettingsClick={onSettingsClick}
        />
      </Box>
      <HeaderActions onDeleteClick={onDeleteClick} />
    </Box>
  );
};

export default Header;