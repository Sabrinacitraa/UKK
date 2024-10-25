import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Login from './Components/Login';
import NotFound from './Components/NotFound';
import ProtectedRoute from './Components/ProtectedRoute'; 

// Admin pages
import LayoutAdmin from './Components/Shared/LayoutAdmin';
import User from './Components/Admin/User/User';
import AddUser from './Components/Admin/User/AddUser';
import EditUser from './Components/Admin/User/EditUser';
import Menu from './Components/Admin/Menu/Menu';
import AddMenu from './Components/Admin/Menu/AddMenu';
import EditMenu from './Components/Admin/Menu/EditMenu';
import Meja from './Components/Admin/Meja/Meja';

// Manajer pages
import LayoutManajer from './Components/Shared/LayoutManajer';
import DataTransaksi from './Components/Manajer/DataTransaksi'; 

// Kasir pages
import LayoutKasir from './Components/Shared/LayoutKasir';
import Pemesanan from './Components/Kasir/Pemesanan';
import Riwayat from './Components/Kasir/Riwayat'; 

function App() {
  const isLoggedIn = sessionStorage.getItem('logged');
  const userRole = sessionStorage.getItem('role');

  return (
    <Router>
      <Routes>
        {/* Halaman Login */}
        {!isLoggedIn ? (
          <Route path="/" element={<Login />} />
        ) : (
          <>
            {/* Halaman Admin */}
            <Route path="/admin" element={<LayoutAdmin />} >
              <Route index element={<Navigate to="/admin/user" />} />
              <Route 
                path="/admin/user" 
                element={<ProtectedRoute element={<User />} isLoggedIn={isLoggedIn} userRole={userRole} requiredRole="admin" />} 
              />
              <Route 
                path="/admin/add_user" 
                element={<ProtectedRoute element={<AddUser />} isLoggedIn={isLoggedIn} userRole={userRole} requiredRole="admin" />} 
              />
              <Route 
                path="/admin/edit_user/:id_user" 
                element={<ProtectedRoute element={<EditUser />} isLoggedIn={isLoggedIn} userRole={userRole} requiredRole="admin" />} 
              />
              <Route 
                path="/admin/menu" 
                element={<ProtectedRoute element={<Menu />} isLoggedIn={isLoggedIn} userRole={userRole} requiredRole="admin" />} 
              />
              <Route 
                path="/admin/add_menu" 
                element={<ProtectedRoute element={<AddMenu />} isLoggedIn={isLoggedIn} userRole={userRole} requiredRole="admin" />} 
              />
              <Route 
                path="/admin/edit_menu/:id_menu" 
                element={<ProtectedRoute element={<EditMenu />} isLoggedIn={isLoggedIn} userRole={userRole} requiredRole="admin" />} 
              />
              <Route 
                path="/admin/meja" 
                element={<ProtectedRoute element={<Meja />} isLoggedIn={isLoggedIn} userRole={userRole} requiredRole="admin" />} 
              />
            </Route>

            {/* Halaman Manajer */}
            <Route path="/manajer" element={<LayoutManajer />}>
              <Route index element={<Navigate to="/manajer/data_transaksi" />} />
              <Route 
                path="/manajer/data_transaksi" 
                element={<ProtectedRoute element={<DataTransaksi />} isLoggedIn={isLoggedIn} userRole={userRole} requiredRole="manajer" />} 
              />
            </Route>

            {/* Halaman Kasir */}
            <Route path="/kasir" element={<LayoutKasir />}>
              <Route 
                path="/kasir/riwayat" 
                element={<ProtectedRoute element={<Riwayat />} isLoggedIn={isLoggedIn} userRole={userRole} requiredRole="kasir" />} 
              />
              <Route 
                path="/kasir/pemesanan" 
                element={<ProtectedRoute element={<Pemesanan />} isLoggedIn={isLoggedIn} userRole={userRole} requiredRole="kasir" />} 
              />
            </Route>
          </>
        )}
        
        {/* Halaman Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
