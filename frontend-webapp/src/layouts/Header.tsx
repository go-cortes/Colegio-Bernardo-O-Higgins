import React, { useState } from 'react';
import { Bell, Search, Check } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

export const Header: React.FC = () => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center text-gray-500">
        <Search size={20} />
        <input 
          type="text" 
          placeholder="Buscar..." 
          className="ml-3 outline-none bg-transparent text-sm w-64 placeholder-gray-400"
        />
      </div>
      
      <div className="flex items-center space-x-4 relative">
        <button 
          className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-12 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
            <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Notificaciones</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium bg-blue-50 px-2 py-1 rounded"
                >
                  <Check size={14} />
                  Marcar leídas
                </button>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No tienes notificaciones
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 transition-colors hover:bg-gray-50 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {!notification.read && <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>}
                        <div>
                          <p className={`text-sm ${!notification.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-400 mt-1 block">
                            {new Date(notification.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
