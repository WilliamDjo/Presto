import { CssBaseline, Box } from '@mui/material';
import { useEffect, useState } from 'react';
// import { getPresentationTitle } from '../../HelperFiles/helper';
import SlidesBar from './PresentationComponents/SlidesBar/SlidesBar';
import DeleteDialog from './PresentationComponents/Dialogs/DeleteDialog';
import SettingsDialog from './PresentationComponents/Dialogs/SettingsDialog';
import Header from './PresentationComponents/Header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { savePresentations, updatePresentationTitle, updatePresentationThumbnail , updatePresentationTitle, updatePresentationThumbnail, deletePresentation  } from '../../State/presentationsSlice';
import Toolbar from './Toolbar/Toolbar';
import SlideDisplay from './SlideDisplay/SlideDisplay';
import { useNavigate } from 'react-router-dom';

const PresentationPage = () => {
  const presentations = useSelector((state) => state.presentations.presentations);
  const presentationId = parseInt(location.pathname.split("/")[2]);
  const currentPresentation = presentations?.find(p => p.id === presentationId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [newTitle, setNewTitle] = useState(getPresentationTitle(presentations));
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const presentationId = parseInt(location.pathname.split("/")[2]);
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(savePresentations());
  }, [presentations, dispatch]);

  const handleDelete = () => {
    dispatch(deletePresentation(presentationId));
    // This will trigger the useEffect that saves to backend
    // since presentations state changes
    setShowDeleteDialog(false);
    navigate('/dashboard');
  };

  const handleSave = () => {
    dispatch(updatePresentationTitle({
      id: presentationId,
      title: newTitle
    }));
    
    if (previewThumbnail) {
      dispatch(updatePresentationThumbnail({
        id: presentationId,
        thumbnail: previewThumbnail
      }));
    }
    
    setShowSettingsDialog(false);
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Add file size check
      if (file.size > 5000000) { // 5MB limit
        alert("File is too large. Please choose an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewThumbnail(e.target.result);
      };
      reader.onerror = (e) => {
        console.error("Error reading file:", e);
        alert("Error reading file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  // When the dialog opens, initialize with current values
  const handleSettingsClick = () => {
    setNewTitle(getPresentationTitle(presentations));
    setPreviewThumbnail(presentations.find(p => p.id === presentationId)?.thumbnail || "");
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
        onClose={handleClose}  // Use new handleClose
        onSave={handleSave}
        title={newTitle}
        thumbnail={previewThumbnail}
        onTitleChange={setNewTitle}
        onThumbnailChange={handleThumbnailChange}
      />
    </>
  );
};

export default PresentationPage;
