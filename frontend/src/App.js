import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from './theme';
import Layout from './components/layout/Layout';
import Home from './components/home/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import ClientList from './components/clients/ClientList';
import ClientForm from './components/clients/ClientForm';
import CaseList from './components/cases/CaseList';
import CaseForm from './components/cases/CaseForm';
import AppointmentList from './components/appointments/AppointmentList';
import AppointmentForm from './components/appointments/AppointmentForm';
import BlogList from './components/blog/BlogList';
import BlogForm from './components/blog/BlogForm';
import PublicBlogView from './components/blog/PublicBlogView';
import PracticeAreas from './components/pages/PracticeAreas';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import SingleBlogPost from './components/blog/SingleBlogPost';
import PracticeAreaDetail from './components/practice-areas/PracticeAreaDetail';
import PracticeAreaManagement from './components/practice-areas/PracticeAreaManagement';
import AboutManagement from './components/about/AboutManagement';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="blog" element={<PublicBlogView />} />
                <Route path="blog/new" element={<PrivateRoute><BlogForm /></PrivateRoute>} />
                <Route path="blog/edit/:id" element={<PrivateRoute><BlogForm /></PrivateRoute>} />
                <Route path="blog/:id" element={<SingleBlogPost />} />
                <Route path="practice-areas" element={<PracticeAreas />} />
                <Route path="practice-areas/:id" element={<PracticeAreaDetail />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                  <Route index element={<DashboardHome />} />
                  <Route path="clients" element={<ClientList />} />
                  <Route path="clients/new" element={<ClientForm />} />
                  <Route path="clients/:id" element={<ClientForm />} />
                  <Route path="cases" element={<CaseList />} />
                  <Route path="cases/new" element={<CaseForm />} />
                  <Route path="cases/:id" element={<CaseForm />} />
                  <Route path="appointments" element={<AppointmentList />} />
                  <Route path="appointments/new" element={<AppointmentForm />} />
                  <Route path="appointments/:id" element={<AppointmentForm />} />
                  <Route path="blog" element={<BlogList />} />
                  <Route path="blog/new" element={<BlogForm />} />
                  <Route path="blog/:id" element={<BlogForm />} />
                  <Route path="practice-areas" element={<PracticeAreaManagement />} />
                  <Route path="about" element={<AboutManagement />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
