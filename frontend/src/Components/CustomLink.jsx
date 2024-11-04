import { Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const CustomLink = ({ text, navigateTo }) => {
    const navigate = useNavigate();

    return (
        <Link onClick={() => navigate(navigateTo)} underline="hover" sx={{ cursor: 'pointer', ml: 1 }}>
            {text}
        </Link>
    );
};

export default CustomLink;
