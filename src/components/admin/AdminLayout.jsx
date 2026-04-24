import React, { useState, useEffect } from 'react';
import { 
  Menu, X, LayoutDashboard, Users, DollarSign, 
  MessageSquare, ClipboardList, LogOut 
} from 'lucide-react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { adminAuth } from '../../firebase'; // ✅ FIX
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminProfile, setAdminProfile] = useState({ 
    name: 'Admin User', 
    email: 'admin@kabadibecho.com' 
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(adminAuth, (user) => { // ✅ FIX
      if (user) {
        setAdminProfile({
          name: user.displayName || 'Admin User',
          email: user.email || 'admin@portal.com'
        });
      } else {
        navigate("/admin/login"); // 🔥 safety
      }
    });

    return () => unsubscribe();
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Analytics & Reports', path: '/admin/analytics' },
    { icon: ClipboardList, label: 'User Requests', path: '/admin/requests' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: DollarSign, label: 'Payments & Pricing', path: '/admin/payments' },
    { icon: MessageSquare, label: 'Complaints & Support', path: '/admin/complaints' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut(adminAuth); // ✅ FIX
      localStorage.removeItem('token');
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F8E9]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-40 flex items-center px-4 lg:px-6">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="flex items-center ml-4">
          <img src="/KabadBecho2.jpg" className="h-12" />
          <span className="ml-3 text-xl font-bold text-[#66BB6A]">
            Admin Dashboard
          </span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{adminProfile.name}</p>
            <p className="text-xs text-gray-500">{adminProfile.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[#5D4037] text-white rounded-lg"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-white shadow-xl transition-all ${
        isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full lg:w-20'
      }`}>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  active ? 'bg-[#E8F5E9] text-[#66BB6A]' : 'hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <main className={`pt-16 transition-all ${
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;