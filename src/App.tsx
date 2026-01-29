import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MainApp from './pages/MainApp';
import Login from './pages/Login';
import AuthGuard from './components/AuthGuard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app/*" element={
            <AuthGuard>
              <MainApp />
            </AuthGuard>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

