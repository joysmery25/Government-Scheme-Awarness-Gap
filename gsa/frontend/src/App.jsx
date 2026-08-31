import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
// Import pages later
import Home from './pages/Home';
import Schemes from './pages/Schemes';
import SchemeDetails from './pages/SchemeDetails';
import EligibilityChecker from './pages/EligibilityChecker';
import About from './pages/About';
import Contact from './pages/Contact';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import Bookmarks from './pages/Bookmarks';
import AdminDashboard from './pages/AdminDashboard';
import ManageSchemes from './pages/ManageSchemes';
import ManageUsers from './pages/ManageUsers';
import NotFound from './pages/NotFound';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/schemes" element={<Schemes />} />
                <Route path="/schemes/:id" element={<SchemeDetails />} />
                <Route path="/eligibility" element={<EligibilityChecker />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/register" element={<UserRegister />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin-register" element={<AdminRegister />} />

                {/* User Protected Routes */}
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/bookmarks" element={<Bookmarks />} />

                {/* Admin Protected Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/schemes" element={<ManageSchemes />} />
                <Route path="/admin/users" element={<ManageUsers />} />

                {/* Catch All */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Layout>
    );
}

export default App;
