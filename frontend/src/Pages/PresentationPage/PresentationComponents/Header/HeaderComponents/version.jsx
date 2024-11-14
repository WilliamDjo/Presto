import { Box, Typography, Button, IconButton } from '@mui/material';
import { Image, Preview } from '@mui/icons-material';

const Version = ({ version }) => {
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., Mon
    const day = date.getDate(); // e.g., 17
    const month = date.toLocaleDateString('en-US', { month: 'short' }); // e.g., Dec
    const year = date.getFullYear(); // e.g., 2024
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }); // e.g., 7:01 PM
  
    return `${dayOfWeek} ${day} ${month} ${year} ${time.toLowerCase()}`;
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: "space-between", 
        padding: '10px', 
        backgroundColor: '#F3F4F6', // Light grey background to match the theme
        borderRadius: '8px', 
        marginBottom: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Light shadow for depth
        border: '1px solid #E0E0E0', // Light border to define the box
      }}
    >
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
              border: '1px solid #D1D5DB' // Light border for image
            }}
          />
        ) : (
          <Image sx={{ width: '40px', height: '40px', marginRight: '12px', color: 'grey.500' }} /> // Grey color for placeholder icon
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
        <IconButton sx={{ color: 'primary.main', marginRight: '8px' }}> {/* Use primary.main for the icon color */}
          <Preview />
        </IconButton>
        <Button variant="contained" color="primary" size="small"> {/* Use primary color from theme */}
          Restore
        </Button>
      </Box>
    </Box>
  );
};

export default Version;