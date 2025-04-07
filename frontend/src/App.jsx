import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/stats" element={<DashboardLayout />} />
            <Route path="/" element={<div className="text-2xl">Welcome to SMS Dashboard</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;