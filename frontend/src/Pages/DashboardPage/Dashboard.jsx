import CustomButton from "../../components/CustomButton"
import { logoutFetch } from "../../HelperFiles/helper"
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await logoutFetch('/admin/auth/logout', token);
      
      if (res.success) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        console.error('Logout failed:', res.error);
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <>
      <CustomButton  text="Log out" onClick={handleLogout}/>
    </>
  )
}

export default DashboardPage
