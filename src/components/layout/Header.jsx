import React from 'react';
import { User, Home } from 'lucide-react';
import Layout from './Layout';
import Button from '../ui/Button';
import { theme } from '../../styles/theme';

const Header = ({ 
  title = 'FormForge', 
  subtitle,
  showHomeButton = false,
  onHome,
  user,
  onUserClick,
  rightContent,
  centerControls
}) => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      padding: `${theme.spacing[4]} 0`,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ padding: `0 ${theme.spacing[6]}`, maxWidth: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center' }}>
          {/* Left Section - Home Button */}
          <div>
            {showHomeButton && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Home size={16} />}
                onClick={onHome}
              >
                Home
              </Button>
            )}
          </div>
          
          {/* Center Section - Title */}
          <div style={{ textAlign: 'center' }}>
              <h1 style={{
                fontSize: theme.typography.fontSize['2xl'],
                fontWeight: theme.typography.fontWeight.black,
                background: 'linear-gradient(45deg, #ff6b35, #ffaa00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                marginBottom: subtitle ? theme.spacing[1] : 0
              }}>
                {title}
              </h1>
              
              {subtitle && (
                <p style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.secondary[600],
                  margin: 0,
                  fontWeight: theme.typography.fontWeight.medium,
                  letterSpacing: '0.025em'
                }}>
                  {subtitle}
                </p>
              )}
          </div>

          {/* Right Section - User and Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: theme.spacing[3] }}>
            {centerControls}
            {rightContent}
            
            {user && (
              <Button
                variant="ghost"
                leftIcon={<User size={16} />}
                onClick={onUserClick}
              >
                {user.displayName || user.email || 'Account'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;