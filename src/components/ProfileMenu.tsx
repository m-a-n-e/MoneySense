import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function ProfileMenu({ onSignOut }: { onSignOut: () => void }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
    return user?.email?.substring(0, 2).toUpperCase() || 'MS';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full border-2 border-indigo-200 hover:border-indigo-400 transition flex items-center justify-center bg-gradient-to-br from-indigo-400 to-indigo-600 hover:shadow-lg hover:shadow-indigo-200 cursor-pointer"
        title={user?.email}
      >
        <span className="text-white font-bold text-sm">{getInitials()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-200 flex items-center justify-center bg-gradient-to-br from-indigo-400 to-indigo-600">
                <span className="text-white font-bold text-lg">{getInitials()}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Meu Perfil</p>
                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="p-3">
            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition font-medium text-sm"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
