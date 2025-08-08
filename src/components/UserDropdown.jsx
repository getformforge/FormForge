import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, BarChart3, UserCircle, LogOut, Mail } from 'lucide-react';
import { theme } from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';
import EmailSettings from './EmailSettings';

const UserDropdown = ({ user, onProfileClick, onSubmissionsClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      icon: <UserCircle size={16} />,
      label: 'Profile',
      onClick: () => {
        onProfileClick();
        setIsOpen(false);
      }
    },
    {
      icon: <BarChart3 size={16} />,
      label: 'View Submissions',
      onClick: () => {
        onSubmissionsClick();
        setIsOpen(false);
      }
    },
    {
      icon: <Mail size={16} />,
      label: 'Email Settings',
      onClick: () => {
        setShowEmailSettings(true);
        setIsOpen(false);
      }
    },
    {
      divider: true
    },
    {
      icon: <LogOut size={16} />,
      label: 'Sign Out',
      onClick: handleLogout,
      danger: true
    }
  ];

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[2],
          padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
          background: isOpen ? theme.colors.secondary[100] : 'transparent',
          border: `1px solid ${isOpen ? theme.colors.secondary[300] : theme.colors.secondary[200]}`,
          borderRadius: theme.borderRadius.lg,
          cursor: 'pointer',
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.secondary[700],
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = theme.colors.secondary[50];
            e.currentTarget.style.borderColor = theme.colors.secondary[300];
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = theme.colors.secondary[200];
          }
        }}
      >
        <User size={16} />
        <span>{user.displayName || user.email?.split('@')[0] || 'Account'}</span>
        <ChevronDown size={14} style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s ease'
        }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          minWidth: '200px',
          background: '#ffffff',
          border: `1px solid ${theme.colors.secondary[200]}`,
          borderRadius: theme.borderRadius.lg,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* User Info */}
          <div style={{
            padding: theme.spacing[3],
            borderBottom: `1px solid ${theme.colors.secondary[200]}`,
            background: theme.colors.secondary[50]
          }}>
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.secondary[500],
              marginBottom: theme.spacing[1]
            }}>
              Signed in as
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.secondary[900],
              wordBreak: 'break-all'
            }}>
              {user.email}
            </div>
          </div>

          {/* Menu Items */}
          <div style={{ padding: theme.spacing[1] }}>
            {menuItems.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={index}
                    style={{
                      height: '1px',
                      background: theme.colors.secondary[200],
                      margin: `${theme.spacing[2]} 0`
                    }}
                  />
                );
              }

              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[2],
                    padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                    background: 'transparent',
                    border: 'none',
                    borderRadius: theme.borderRadius.md,
                    cursor: 'pointer',
                    fontSize: theme.typography.fontSize.sm,
                    color: item.danger ? theme.colors.error[600] : theme.colors.secondary[700],
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = item.danger 
                      ? theme.colors.error[50] 
                      : theme.colors.secondary[100];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Email Settings Modal */}
      {showEmailSettings && (
        <EmailSettings onClose={() => setShowEmailSettings(false)} />
      )}
    </div>
  );
};

export default UserDropdown;