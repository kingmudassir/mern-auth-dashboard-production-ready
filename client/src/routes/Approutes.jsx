import { Route, Routes } from 'react-router-dom';
import UserLayout from '../Layout/UserLayout';
import Home from '../Pages/Home';
import Login from '../Pages/Register';
import Register from '../Pages/Register';

function Approutes() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default Approutes;
