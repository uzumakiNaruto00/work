import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/auth/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Cars from './pages/Cars';
import ParkingSlots from './pages/ParkingSlots';
import ParkingRecords from './pages/ParkingRecords';
import Payments from './pages/Payments';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/cars"
                element={
                  <PrivateRoute>
                    <Cars />
                  </PrivateRoute>
                }
              />
              <Route
                path="/parking-slots"
                element={
                  <PrivateRoute>
                    <ParkingSlots />
                  </PrivateRoute>
                }
              />
              <Route
                path="/parking-records"
                element={
                  <PrivateRoute>
                    <ParkingRecords />
                  </PrivateRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <PrivateRoute>
                    <Payments />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <PrivateRoute>
                    <Reports />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/parking-slots" replace />} />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;