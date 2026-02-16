import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';


import CreateOrganization from './components/CreateOrganization';
import ViewOrganizations from './components/ViewOrganizations';
import RenewLicense from './components/RenewLicense';
import ViewLicenses from './components/ViewLicenses';
import DashboardOverview from './components/DashboardOverview';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="create-org" element={<CreateOrganization />} />
          <Route path="view-orgs" element={<ViewOrganizations />} />
          <Route path="renew-license" element={<RenewLicense />} />
          <Route path="view-licenses" element={<ViewLicenses />} />
          <Route index element={<DashboardOverview />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
