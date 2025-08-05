import React from 'react';
import { User, ArrowLeft } from 'lucide-react';
import Layout from './Layout';
import Button from '../ui/Button';
import { theme } from '../../styles/theme';

const Header = ({ 
  title = 'FormForge', 
  subtitle,
  showBackButton = false,
  onBack,
  user,
  onUserClick,
  rightContent
}) => {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 107, 53, 0.2)',
      padding: `${theme.spacing[4]} 0`,
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Layout.Container>
        <Layout.Flex justify="space-between" align="center">
          <Layout.Flex align="center" gap={4}>
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ArrowLeft size={16} />}
                onClick={onBack}
              >
                Back
              </Button>
            )}
            
            <div>
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
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0
                }}>
                  {subtitle}
                </p>
              )}
            </div>
          </Layout.Flex>

          <Layout.Flex align="center" gap={3}>
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
          </Layout.Flex>
        </Layout.Flex>
      </Layout.Container>
    </div>
  );
};

export default Header;