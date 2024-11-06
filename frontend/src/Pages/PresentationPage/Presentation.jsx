import { CssBaseline, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { getPresentationTitle } from '../../HelperFiles/helper';
import SlidesBar from './PresentationComponents/SlidesBar/SlidesBar';
import DeleteDialog from './PresentationComponents/Dialogs/DeleteDialog';
import SettingsDialog from './PresentationComponents/Dialogs/SettingsDialog';
import Header from './PresentationComponents/Header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { savePresentations } from '../../State/presentationsSlice';
import Toolbar from './Toolbar/Toolbar';
import SlideDisplay from './SlideDisplay/SlideDisplay';

const PresentationPage = () => {
  const presentations = useSelector((state) => state.presentations.presentations);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [newTitle, setNewTitle] = useState(getPresentationTitle(presentations));
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(savePresentations());
  }, [presentations, dispatch]);

  const handleDelete = () => {

    setShowDeleteDialog(false);
    // onDelete();
  };

  const handleSave = () => {
    // onTitleChange(newTitle);
    // onThumbnailChange(previewThumbnail);
    setShowSettingsDialog(false);
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewThumbnail(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <CssBaseline />

      <Box sx={{display: "flex", flexDirection: "column", height: "100vh", justifyContent: "center", backgroundColor: "#f5f5f5"}}>
        <Header
          onSettingsClick={() => setShowSettingsDialog(true)}
          onDeleteClick={() => setShowDeleteDialog(true)}
        />

        <Toolbar />

        <SlideDisplay />

        <SlidesBar />
      </Box>
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Presentation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PresentationPage;
