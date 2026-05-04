import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppNotification } from '../types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    // Load from local storage
    const stored = localStorage.getItem('notifications');
    let allNotifications: AppNotification[] = stored ? JSON.parse(stored) : [];

    // Filter by role or specific user
    const filtered = allNotifications.filter(n => {
      if (n.targetRole === 'ALL') return true;
      if (n.targetRole === user.role) {
        if (n.targetUserId) {
          return n.targetUserId === user.id;
        }
        return true;
      }
      return false;
    });

    setNotifications(filtered);
  }, [user]);

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    
    // Update local storage (merge with others)
    const stored = localStorage.getItem('notifications');
    if (stored) {
      const allNotifications: AppNotification[] = JSON.parse(stored);
      const newAll = allNotifications.map(nav => {
        const found = updated.find(u => u.id === nav.id);
        return found ? found : nav;
      });
      localStorage.setItem('notifications', JSON.stringify(newAll));
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
