import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Link, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Settings } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { getPresentation } from '../../../../../HelperFiles/helper';
import Version from './Version';

const HeaderTitle = ({ title, saveStatus, onSettingsClick }) => {
  const [openVersionHistory, setOpenVersionHistory] = useState(false);
  const presentations = useSelector((state) => state.presentations.presentations);
  
  const [titleFontSize, setTitleFontSize] = useState('2rem'); // Default font size for title
  const [statusFontSize, setStatusFontSize] = useState('1rem'); // Default font size for save status

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Dynamically adjust title font size
      if (width > 1200) {
        setTitleFontSize('2.5rem');
        setStatusFontSize('1.25rem');
      } else if (width > 450) {
        setTitleFontSize('1.5rem');
        setStatusFontSize('1rem');
      } else {
        setTitleFontSize('1rem');
        setStatusFontSize('0.5rem');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [window.innerWidth]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: titleFontSize }}>
          {title}
        </Typography>
        <IconButton size="small" sx={{ color: "white" }} onClick={onSettingsClick}>
          <Settings />
        </IconButton>
      </Box>
      <Typography sx={{ fontSize: statusFontSize }}>
        <Link 
          onClick={() => setOpenVersionHistory(true)} 
          variant="body2" 
          sx={{ fontWeight: "semi-bold", color: "white", width: "100%", cursor: "pointer" }}
        >
          {saveStatus}
        </Link>
      </Typography>
      <Dialog
        open={openVersionHistory}
        onClose={() => setOpenVersionHistory(false)}
        fullWidth
      >
        <DialogTitle>
          Version History
        </DialogTitle>
        <DialogContent>
          {getPresentation(presentations)?.versionHistory.slice(1).length > 0 ? (
            getPresentation(presentations)?.versionHistory.slice(1).map((version, index) => (
              <Version key={index} version={version} setOpenVersionHistory={setOpenVersionHistory}/>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No saved versions yet
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVersionHistory(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HeaderTitle;
