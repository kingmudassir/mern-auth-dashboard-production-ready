import { Route, Routes } from 'react-router-dom';
import UserLayout from '../Layout/UserLayout';
import Home from '../Pages/Home';
import Login from '../Pages/Shared/Login';
import Register from '../Pages/Shared/Register';
import UserProfile from '../Pages/UserProfile';
import ForgotPassword from '../Pages/Shared/ForgotPassword';
import VerifyOTP from '../Pages/Shared/VerifyOTP';
import ResetPassword from '../Pages/Shared/ResetPassword';
import Profile from '../Pages/User/Profile';
import ConfirmEmailChange from '../Pages/ConfirmEmailChange';
import Dashboard from '../Pages/Admin/Dashboard';
import AdminLayout from '../Layout/AdminLayout';
import AllUsersPanel from '../Pages/Admin/AllUsersPanel';
import UsersProfile from '../Pages/Admin/User-Profile/Main-Page/UsersProfile';
import DeletedUsers from '../Pages/Admin/Deleted-Users/Main-Page/DeletedUsers';
import BannedUsers from '../Pages/Admin/Banned-Users/Main-Page/BannerUsers';
import AdminAccounts from '../Pages/Admin/Admin-Accounts/Main-Page/AdminAccounts';
import CarMarketplace from '../Pages/CarMarketplace';
import CarListing from '../Pages/CarListing';
import AllCarListings from '../Pages/Admin/Car-Listings/Main-Page/AllCarListings';
import ReportsPanel from '../Pages/Admin/Reports/Main-Page/ReportsPanel';
import PendingListingsPanel from '../Pages/Admin/Pending-Listings/Main-Page/PendingListingsPanel';
import MakesPanel from '../Pages/Admin/Catalogue/Makes/Main-Page/MakesPanel';
import CitiesPanel from '../Pages/Admin/Catalogue/Cities/Main-Page/CitiesPanel';
import SettingsPanel from '../Pages/Admin/Settings/Main-Page/SettingsPanel';
import PostAd from '../Pages/PostAd';
import SavedAds from '../Pages/SavedAds';

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
        <Route path="/confirm-email-change" element={<ConfirmEmailChange />} />
        {/* <Route path="/admin/dashboard" element={<Dashboard />} /> */}
        <Route path="/cars" element={<CarMarketplace />} />
        <Route path="cars/:carId" element={<CarListing />} />
        <Route path="post-ad" element={<PostAd />} />
        <Route path="saved" element={<SavedAds />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<AllUsersPanel />} />
        <Route path="users/:userId" element={<UsersProfile />} />
        <Route path="users/deleted" element={<DeletedUsers />} />
        <Route path="users/banned" element={<BannedUsers />} />

        <Route path="listings" element={<AllCarListings />} />
        <Route path="listings/pending" element={<PendingListingsPanel />} />

        <Route path="reports" element={<ReportsPanel />} />

        <Route path="catalogue/makes" element={<MakesPanel />} />
        <Route path="catalogue/cities" element={<CitiesPanel />} />

        <Route path="settings" element={<SettingsPanel />} />

        <Route path="accounts" element={<AdminAccounts />} />
      </Route>{' '}
      {/* <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<AllUsersPanel />} />
        <Route path="users/banned" element={<BannedUsersPanel />} />
        <Route path="listings" element={<AllListingsPanel />} />
        <Route path="listings/pending" element={<PendingListingsPanel />} />
        <Route path="listings/flagged" element={<FlaggedListingsPanel />} />
        <Route path="reports" element={<ReportsPanel />} />
        <Route path="catalogue/makes" element={<MakesPanel />} />
        <Route path="catalogue/cities" element={<CitiesPanel />} />
        <Route path="accounts" element={<AdminAccountsPanel />} />
        <Route path="settings" element={<SettingsPanel />} />
      </Route> */}
    </Routes>
  );
}

export default Approutes;
