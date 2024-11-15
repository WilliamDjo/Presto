import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Collapse } from '@mui/material';
import { Image, Preview, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { loadVersion } from '../../../../../State/presentationsSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Version = ({ version, setOpenVersionHistory }) => {
  const presentationId = location.pathname.split("/")[2];
  const [openConfirmRestore, setOpenConfirmRestore] = useState(false);
  const [expanded, setExpanded] = useState(false); // State to manage expansion
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., Mon
    const day = date.getDate(); // e.g., 17
    const month = date.toLocaleDateString('en-US', { month: 'short' }); // e.g., Dec
    const year = date.getFullYear(); // e.g., 2024
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }); // e.g., 7:01 PM
  
    return `${dayOfWeek} ${day} ${month} ${year} ${time.toLowerCase()}`;
  };

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        padding: '10px', 
        backgroundColor: '#F3F4F6', 
        borderRadius: '8px', 
        marginBottom: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', 
        border: '1px solid #E0E0E0',
        cursor: "pointer"
      }}
      onClick={toggleExpand}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {version.thumbnail ? (
            <Box
              component="img"
              src={version.thumbnail}
              alt={version.title}
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '4px',
                objectFit: 'cover',
                marginRight: '12px',
                border: '1px solid #D1D5DB'
              }}
            />
          ) : (
            <Image sx={{ width: '40px', height: '40px', marginRight: '12px', color: 'grey.500' }} />
          )}
          <Box>
            <Typography color="text.primary" fontWeight="500" fontSize="15px">
              {version.title}
            </Typography>
            <Typography color="text.secondary" fontSize="13px" sx={{ opacity: 0.8 }}>
              {formatDateTime(version.dateTime)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={(e) => { e.stopPropagation(); window.open(`/preview/${presentationId}#/1/${version.dateTime}`, '_blank'); }} sx={{ color: 'primary.main', marginRight: '8px' }}>
            <Preview />
          </IconButton>
          <Button onClick={(e) => { e.stopPropagation(); setOpenConfirmRestore(true); }} variant="contained" color="primary" size="small">
            Restore
          </Button>
          <IconButton onClick={toggleExpand} sx={{ color: 'primary.main' }}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 1, pl: 2 }}>
          <Typography color="text.secondary" fontSize="14px">
            {version.description || "No description available"}
          </Typography>
        </Box>
      </Collapse>

      <Dialog
        open={openConfirmRestore}
        onClose={() => setOpenConfirmRestore(false)}
      >
        <DialogTitle id="delete-dialog-title">
          Restore Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to restore this version?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmRestore(false)} color="primary">
            No
          </Button>
          <Button onClick={() => {
            dispatch(loadVersion({ version, id: location.pathname.split("/")[2] }));
            setOpenConfirmRestore(false);
            setOpenVersionHistory(false);
            navigate(`${location.pathname}#/1`);
          }} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Version;
