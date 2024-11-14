import { CssBaseline, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { getPresentationBackgroundSetting } from '../../HelperFiles/helper';
import SlidesBar from './PresentationComponents/SlidesBar/SlidesBar';
import DeleteDialog from './PresentationComponents/Dialogs/DeleteDialog';
import SettingsDialog from './PresentationComponents/Dialogs/SettingsDialog';
import Header from './PresentationComponents/Header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { savePresentations, deletePresentation  } from '../../State/presentationsSlice';
import Toolbar from './Toolbar/Toolbar';
import SlideDisplay from './SlideDisplay/SlideDisplay';
import { useNavigate } from 'react-router-dom';

const PresentationPage = () => {
  const presentations = useSelector((state) => state.presentations.presentations);
  const presentationId = parseInt(location.pathname.split("/")[2]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(savePresentations(location.pathname.split("/")[2]));
  }, [presentations, dispatch]);

  const handleDelete = () => {
    dispatch(deletePresentation(presentationId));
    // This will trigger the useEffect that saves to backend
    // since presentations state changes
    setShowDeleteDialog(false);
    navigate('/dashboard');
  };

  // When the dialog opens, initialize with current values
  const handleSettingsClick = () => {
    setShowSettingsDialog(true);
  };

  return (
    <>
      <CssBaseline />

      <Box sx={{display: "flex", flexDirection: "column", height: "100vh", justifyContent: "center", backgroundColor: "#f5f5f5"}}>
        <Header
          onSettingsClick={handleSettingsClick}
          onDeleteClick={() => setShowDeleteDialog(true)}
        />

        <Toolbar />

        <SlideDisplay />

        <SlidesBar />
      </Box>

      <DeleteDialog 
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />

      <SettingsDialog
        open={showSettingsDialog}
        setShowSettingsDialog={setShowSettingsDialog}
      />
    </>
  );
};

export default PresentationPage;
