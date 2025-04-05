import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { HelmetProvider } from 'react-helmet-async';
import { CircularProgress, Box } from '@mui/material';
import theme from './theme';
import ErrorBoundary from './components/common/ErrorBoundary';
import { NotificationProvider } from './contexts/NotificationContext';
import { PerformanceProvider } from './contexts/PerformanceContext';
import NotificationSnackbar from './components/common/NotificationSnackbar';

// Import core components synchronously
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './components/dashboard/DashboardLayout';

// Lazy load all other components
const Home = lazy(() => import('./components/home/Home'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const DashboardHome = lazy(() => import('./components/dashboard/DashboardHome'));
const ClientList = lazy(() => import('./components/clients/ClientList'));
const ClientForm = lazy(() => import('./components/clients/ClientForm'));
const CaseList = lazy(() => import('./components/cases/CaseList'));
const CaseForm = lazy(() => import('./components/cases/CaseForm'));
const AppointmentList = lazy(() => import('./components/appointments/AppointmentList'));
const AppointmentForm = lazy(() => import('./components/appointments/AppointmentForm'));
const BlogList = lazy(() => import('./components/blog/BlogList'));
const BlogForm = lazy(() => import('./components/blog/BlogForm'));
const PublicBlogView = lazy(() => import('./components/blog/PublicBlogView'));
const PracticeAreas = lazy(() => import('./components/pages/PracticeAreas'));
const About = lazy(() => import('./components/pages/About'));
const TeamMemberDetail = lazy(() => import('./components/team/TeamMemberDetail'));
const Contact = lazy(() => import('./components/pages/Contact'));
const SingleBlogPost = lazy(() => import('./components/blog/SingleBlogPost'));
const PracticeAreaDetail = lazy(() => import('./components/practice-areas/PracticeAreaDetail'));
const PracticeAreaManagement = lazy(
  () => import('./components/practice-areas/PracticeAreaManagement')
);
const AboutManagement = lazy(() => import('./components/about/AboutManagement'));
const HomeCardManagement = lazy(() => import('./components/home/HomeCardManagement'));

// Development Tools
const PerformanceDashboard =
  process.env.NODE_ENV === 'development'
    ? lazy(() => import('./components/dev/PerformanceDashboard'))
    : () => null;

// Loading component for suspense fallback
const LoadingComponent = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

function App() {
  console.log('App initialized - Auth setup starting');

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <PerformanceProvider>
              <NotificationProvider>
                <AuthProvider>
                  <Router>
                    <Suspense fallback={<LoadingComponent />}>
                      <Routes>
                        <Route path="/" element={<Layout />}>
                          <Route
                            index
                            element={
                              <ErrorBoundary>
                                <Home />
                              </ErrorBoundary>
                            }
                          />
                          <Route path="login" element={<Login />} />
                          <Route path="register" element={<Register />} />
                          <Route
                            path="blog"
                            element={
                              <ErrorBoundary>
                                <PublicBlogView />
                              </ErrorBoundary>
                            }
                          />
                          <Route
                            path="blog/new"
                            element={
                              <PrivateRoute>
                                <ErrorBoundary>
                                  <BlogForm />
                                </ErrorBoundary>
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="blog/edit/:id"
                            element={
                              <PrivateRoute>
                                <ErrorBoundary>
                                  <BlogForm />
                                </ErrorBoundary>
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="blog/:id"
                            element={
                              <ErrorBoundary>
                                <SingleBlogPost />
                              </ErrorBoundary>
                            }
                          />
                          <Route
                            path="practice-areas"
                            element={
                              <ErrorBoundary>
                                <PracticeAreas />
                              </ErrorBoundary>
                            }
                          />
                          <Route
                            path="practice-areas/:id"
                            element={
                              <ErrorBoundary>
                                <PracticeAreaDetail />
                              </ErrorBoundary>
                            }
                          />
                          <Route
                            path="about"
                            element={
                              <ErrorBoundary>
                                <About />
                              </ErrorBoundary>
                            }
                          />
                          <Route
                            path="about/team/:memberId"
                            element={
                              <ErrorBoundary>
                                <TeamMemberDetail />
                              </ErrorBoundary>
                            }
                          />
                          <Route
                            path="contact"
                            element={
                              <ErrorBoundary>
                                <Contact />
                              </ErrorBoundary>
                            }
                          />
                          <Route
                            path="dashboard"
                            element={
                              <PrivateRoute>
                                <ErrorBoundary>
                                  <DashboardLayout />
                                </ErrorBoundary>
                              </PrivateRoute>
                            }
                          >
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
                            <Route path="home-cards" element={<HomeCardManagement />} />
                          </Route>
                        </Route>
                      </Routes>
                    </Suspense>
                  </Router>
                  <NotificationSnackbar />
                </AuthProvider>
              </NotificationProvider>
              {process.env.NODE_ENV === 'development' && (
                <Suspense fallback={null}>
                  <PerformanceDashboard />
                </Suspense>
              )}
            </PerformanceProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
