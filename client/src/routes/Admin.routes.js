import { Route } from 'react-router-dom';
import AdminLayout from '../Layout/AdminLayout';
import Dashboard from '../Pages/Admin-Dashboard/Main-Page/Dashboard';
import UsersProfile from '../Pages/Admin/User-Profile/Main-Page/UsersProfile';
import DeletedUsers from '../Pages/Admin/Deleted-Users/Main-Page/DeletedUsers';
import BannedUsers from '../Pages/Admin/Banned-Users/Main-Page/BannerUsers';
import AdminAccounts from '../Pages/Admin/Admin-Accounts/Main-Page/AdminAccounts';
import AllCarListings from '../Pages/Admin/Car-Listings/Main-Page/AllCarListings';
import PendingListingsPanel from '../Pages/Admin/Pending-Listings/Main-Page/PendingListingsPanel';
import ReportsPanel from '../Pages/Admin/Reports/Main-Page/ReportsPanel';
import MakesPanel from '../Pages/Admin/Catalogue/Makes/Main-Page/MakesPanel';
import CitiesPanel from '../Pages/Admin/Catalogue/Cities/Main-Page/CitiesPanel';
import SettingsPanel from '../Pages/Admin/Settings/Main-Page/SettingsPanel';
import AllUsersPanel from '../Pages/Admin/All-Users/Main-Page/AllUsersPanel';

export default function AdminRoutes() {
    return (
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
        </Route>
    );
}