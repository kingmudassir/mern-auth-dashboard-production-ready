// import { Route } from 'react-router-dom';
// import UserLayout from '../Layout/UserLayout';
// import Home from '../Pages/Home';
// import Login from '../Pages/Shared/Login';
// import Register from '../Pages/Shared/Register';
// import UserProfile from '../Pages/UserProfile';
// import ForgotPassword from '../Pages/Shared/ForgotPassword';
// import VerifyOTP from '../Pages/Shared/VerifyOTP';
// import ResetPassword from '../Pages/Shared/ResetPassword';
// import Profile from '../Pages/User/Profile';
// import ConfirmEmailChange from '../Pages/ConfirmEmailChange';
// import CarMarketplace from '../Pages/CarMarketplace';
// import CarListing from '../Pages/CarListing';
// import PostAd from '../Pages/PostAd';
// import SavedAds from '../Pages/SavedAds';

// export default function UserRoutes() {
//     return (
//         <Route path="/" element={<UserLayout />}>
//             <Route index element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/userprofile" element={<UserProfile />} />
//             <Route path="/forgotpassword" element={<ForgotPassword />} />
//             <Route path="/verifyotp" element={<VerifyOTP />} />
//             <Route path="/password/reset/:token" element={<ResetPassword />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/confirm-email-change" element={<ConfirmEmailChange />} />
//             <Route path="/cars" element={<CarMarketplace />} />
//             <Route path="cars/:carId" element={<CarListing />} />
//             <Route path="post-ad" element={<PostAd />} />
//             <Route path="saved" element={<SavedAds />} />
//         </Route>
//     );
// }

import { Route } from 'react-router-dom';
import UserLayout from '../Layout/UserLayout';
import Home from '../Pages/Home';
import Login from '../Pages/Shared/Login';
import Register from '../Pages/Shared/Register';
import ForgotPassword from '../Pages/Shared/ForgotPassword';
import VerifyOTP from '../Pages/Shared/VerifyOTP';
import ResetPassword from '../Pages/Shared/ResetPassword';
import Profile from '../Pages/User/Profile';
import DashboardLayout from '../Layout/DashboardLayout';
import MyAds from '../Pages/My-Ads/Main-Page/MyAds';
import SavedAds from '../Pages/SavedAds';
import EditAd from '../Pages/Edit-Ad/Main-Page/EditAd';
import CarMarketplace from '../Pages/CarMarketplace';
import CarListing from '../Pages/CarListing';
import ConfirmEmailChange from '../Pages/ConfirmEmailChange';
import PostAd from '../Pages/Post-Ad/Main-Page/PostAd';

export const UserRoutes = (
  <Route path="/" element={<UserLayout />}>
    <Route index element={<Home />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="forgotpassword" element={<ForgotPassword />} />
    <Route path="verifyotp" element={<VerifyOTP />} />
    <Route path="password/reset/:token" element={<ResetPassword />} />
    <Route path="confirm-email-change" element={<ConfirmEmailChange />} />

    {/* Market Routes */}
    <Route path="saved-ads" element={<SavedAds />} />
    <Route path="cars" element={<CarMarketplace />} />
    <Route path="cars/:carId" element={<CarListing />} />
    <Route path="post-ad" element={<PostAd />} />
    <Route path="edit-ad/:adId" element={<EditAd />} />

    {/* Nested Dashboard/Profile Routes */}
    <Route path="profile" element={<DashboardLayout />}>
      <Route index element={<Profile />} />
      <Route path="info" element={<Profile />} />
      <Route path="my-ads" element={<MyAds />} />
      <Route path="saved-ads" element={<SavedAds />} />
    </Route>
  </Route>
);
