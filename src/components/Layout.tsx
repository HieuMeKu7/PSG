import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Table,
  Clock,
  Columns,
  Images,
  LogOut,
  Download
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ExportModal } from './ExportModal';
import type { ViewType } from '../types';

interface LayoutProps {
  children: ReactNode;
}

const navItems: Array<{ id: ViewType; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'quick-add', label: 'Quick Add', icon: PlusCircle },
  { id: 'table', label: 'Table View', icon: Table },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'kanban', label: 'Kanban', icon: Columns },
  { id: 'gallery', label: 'Gallery', icon: Images }
];

export const Layout = ({ children }: LayoutProps) => {
  const { currentUser, currentView, setCurrentView, setCurrentUser, records } = useAppStore();
  const [showExportModal, setShowExportModal] = useState(false);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      setCurrentUser(null);
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-indigo-600">PSG Research</h1>
          <p className="text-sm text-gray-500 mt-1">Research Tool</p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
              {currentUser?.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{currentUser}</p>
              <p className="text-xs text-gray-500">
                {records.length} records
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            <Download size={20} />
            <span className="font-medium">Export Data</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Export Modal */}
      {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} />}
    </div>
  );
};
