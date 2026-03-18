import { Route, Routes } from 'react-router-dom';
import UserLayout from '../Layout/UserLayout';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import UserProfile from '../Pages/UserProfile';
import ForgotPassword from '../Pages/ForgotPassword';
import VerifyOTP from '../Pages/VerifyOTP';
import ResetPassword from '../Pages/ResetPassword';
import Profile from '../Pages/Profile';

function Approutes() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verifyotp" element={<VerifyOTP />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default Approutes;
