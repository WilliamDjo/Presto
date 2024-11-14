import { Box, Typography, IconButton, Button, Link, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Settings } from '@mui/icons-material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getPresentation } from '../../../../../HelperFiles/helper';
import Version from './Version';

const HeaderTitle = ({ title, saveStatus, onSettingsClick }) => {
  const [openVersionHistory, setOpenVersionHistory] = useState(false);
  const presentations = useSelector(state => state.presentations.presentations);

  return (
    <Box sx={{display: "flex", flexDirection: "column"}}>
      <Box sx={{display: "flex", gap: 0.5}}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <IconButton size="small" sx={{color: "white"}} onClick={onSettingsClick}>
          <Settings />
        </IconButton>
      </Box>
      <Typography>
        <Link onClick={() => setOpenVersionHistory(true)} variant="body2" sx={{ fontWeight: "semi-bold", color: "white", width: "100%", cursor: "pointer" }}>
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
}

export default HeaderTitle;
