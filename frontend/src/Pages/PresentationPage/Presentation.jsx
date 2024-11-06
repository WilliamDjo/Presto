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

      <Dialog 
        open={showSettingsDialog} 
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Presentation Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="Title"
              fullWidth
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              variant="outlined"
            />
            
            <Divider />
            
            <Stack spacing={1}>
              <InputLabel>Thumbnail</InputLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                style={{ display: 'none' }}
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload">
                <Card sx={{ width: '100%', maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component={previewThumbnail ? "img" : "div"}
                      sx={{
                        height: 194,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.100'
                      }}
                      image={previewThumbnail}
                      title="Presentation thumbnail"
                    >
                      {!previewThumbnail && (
                        <Stack alignItems="center" spacing={1}>
                          <Image color="action" sx={{ fontSize: 40 }} />
                          <Typography variant="body2" color="text.secondary">
                            Click to add thumbnail
                          </Typography>
                        </Stack>
                      )}
                    </CardMedia>
                  </CardActionArea>
                </Card>
              </label>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  
  );
};

export default PresentationPage;
