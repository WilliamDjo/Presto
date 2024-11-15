// src/components/SettingsDialog.jsx
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Stack,
  TextField,
  Divider,
  Alert,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardActionArea,
  CardMedia
} from '@mui/material';
import ThumbnailUpload from '../../../../Components/ThumbnailUpload';
import { getPresentationBackgroundSetting, getPresentationTitle, getPresentationThumbnail, getPresentationDescription, getCurrentPresentationId } from '../../../../HelperFiles/helper';
import { useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updatePresentationTitle, updatePresentationThumbnail, setDefaultBackground, updatePresentationDescription } from '../../../../State/presentationsSlice';
import Image from '@mui/icons-material/Image';

const SettingsDialog = ({ 
  open,
  setShowSettingsDialog
}) => {
  const presentations = useSelector(state => state.presentations.presentations);
  const presentationId = parseInt(getCurrentPresentationId());
  
  const [newTitle, setNewTitle] = useState("");
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [previewDescription, setPreviewDescription] = useState("");
  const [backgroundSetting, setBackgroundSetting] = useState({ type: "solid", attributes: { color: "#FFFFFF" } });
  const [showDefaultImage, setShowDefaultImage] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();

  // Set initial values when dialog opens
  useEffect(() => {
    if (open) {
      setNewTitle(getPresentationTitle(presentations) || "");
      setPreviewDescription(getPresentationDescription(presentations) || "");
      setPreviewThumbnail(getPresentationThumbnail(presentations) || "");
      const initialBackgroundSetting = getPresentationBackgroundSetting(presentations) || { type: "solid", attributes: { color: "#FFFFFF" } };
      setBackgroundSetting(initialBackgroundSetting);
      setShowDefaultImage(!initialBackgroundSetting.attributes.image);
    }
  }, [open, presentations]);

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setError("File is too large. Please choose an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewThumbnail(e.target.result);
      };
      reader.onerror = (e) => {
        console.error("Error reading file:", e);
        setError("Error reading file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!newTitle.trim()) {
      setError("Please enter a title");
      return;
    }
  
    dispatch(updatePresentationTitle({
      id: presentationId,
      title: newTitle.trim()
    }));
  
    dispatch(updatePresentationDescription({
      id: presentationId,
      description: previewDescription
    }))

    if (previewThumbnail !== getPresentationThumbnail(presentations)) {
      dispatch(updatePresentationThumbnail({
        id: presentationId,
        thumbnail: previewThumbnail
      }));
    }
  
    // Clone backgroundSetting to modify it safely
    const updatedBackgroundSetting = JSON.parse(JSON.stringify(backgroundSetting));

    const defaultBackgroundAttributesSettings = {
      color: "#FFFFFF",
      startingColor: "#FFFFFF",
      endingColor: "#FFFFFF",
      angle: 0,
      image: ""
    }
    updatedBackgroundSetting.attributes = defaultBackgroundAttributesSettings;
  
    // Reset non-relevant fields for each background type
    switch (updatedBackgroundSetting.type) {
    case "solid":
      updatedBackgroundSetting.attributes.color = backgroundSetting.attributes.color;
      break;
    case "gradient":
      updatedBackgroundSetting.attributes.startingColor = backgroundSetting.attributes.startingColor;
      updatedBackgroundSetting.attributes.endingColor = backgroundSetting.attributes.endingColor;
      updatedBackgroundSetting.attributes.angle = backgroundSetting.attributes.angle;
      break;
    case "image":
      updatedBackgroundSetting.attributes.image = backgroundSetting.attributes.image;
      break;
    }
  
    // Dispatch with the updated backgroundSetting
    dispatch(setDefaultBackground(updatedBackgroundSetting));
    
    setShowSettingsDialog(false);
  };

  const handleBackgroundChange = (field, nestedField) => (event) => {
    setBackgroundSetting((prev) => ({
      ...prev,
      [field]: nestedField 
        ? { ...prev[field], [nestedField]: event.target.value }
        : event.target.value,
    }));
  };

  const handleCardClick = () => {
    fileInputRef.current.click();
  };

  const onBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundSetting(prev => ({
          ...prev,
          attributes: { ...prev.attributes, image: e.target.result }
        }));
        setShowDefaultImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog 
      open={open}
      onClose={() => {
        setShowSettingsDialog(false);
        setError('');
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Presentation Settings</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Title"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            variant="outlined"
          />

          <TextField
            autoFocus
            margin="dense"
            label="Presentation Description"
            type="text"
            fullWidth
            variant="filled" // or "standard"
            multiline
            minRows={4} // Adjust the number of rows as needed
            value={previewDescription}
            onChange={(e) => setPreviewDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
          
          <Divider />
          
          <ThumbnailUpload 
            thumbnail={previewThumbnail}
            resetThumbnail={() => setPreviewThumbnail("")}
            onThumbnailChange={handleThumbnailChange}
          />

          <Divider />

          <Stack spacing={1}>
            <InputLabel>Default Background</InputLabel>
            <Select
              value={backgroundSetting.type}
              onChange={handleBackgroundChange('type')}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="solid">Solid</MenuItem>
              <MenuItem value="gradient">Gradient</MenuItem>
              <MenuItem value="image">Image</MenuItem>
            </Select>

            {backgroundSetting.type === "solid" && (
              <TextField
                fullWidth
                label="Background Colour"
                type="color"
                value={backgroundSetting.attributes.color || "#FFFFFF"}
                onChange={handleBackgroundChange('attributes', 'color')}
              />
            )}
            {backgroundSetting.type === "gradient" && 
              <>
                <TextField
                  fullWidth
                  label="Starting Colour"
                  type="color"
                  value={backgroundSetting.attributes.startingColor || "#FFFFFF"}
                  onChange={handleBackgroundChange('attributes', 'startingColor')}
                />
                <TextField
                  fullWidth
                  label="Ending Colour"
                  type="color"
                  value={backgroundSetting.attributes.endingColor || "#FFFFFF"}
                  onChange={handleBackgroundChange('attributes', 'endingColor')}
                />
                <TextField
                  fullWidth
                  label="Gradient Angle"
                  type="number"
                  value={backgroundSetting.attributes.angle}
                  onChange={handleBackgroundChange('attributes', 'angle')}
                  inputProps={{
                    min: 0,
                    max: 360,
                    step: 1
                  }}
                />
              </>
            }
            {backgroundSetting.type === "image" &&
              <Stack spacing={1}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onBackgroundImageChange}
                  style={{ display: 'none' }}
                />
                <Card sx={{ width: '100%', maxWidth: 345 }}>
                  <CardActionArea onClick={handleCardClick}>
                    {!showDefaultImage ? (
                      <CardMedia
                        component="img"
                        sx={{ height: 194 }}
                        image={backgroundSetting.attributes.image}
                        title="Background Image"
                      />
                    ) : (
                      <CardMedia
                        sx={{
                          height: 194,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'grey.100'
                        }}
                      >
                        <Stack alignItems="center" spacing={1}>
                          <Image color="action" sx={{ fontSize: 40 }} />
                          <Typography variant="body2" color="text.secondary">
                            Click to add background image
                          </Typography>
                        </Stack>
                      </CardMedia>
                    )}
                  </CardActionArea>
                </Card>
              </Stack>
            }
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setShowSettingsDialog(false);
          setError('');
        }}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
