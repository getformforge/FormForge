import React, { useState, useEffect } from 'react';
import { Mail, Bell, BellOff, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Button from './ui/Button';
import { theme } from '../styles/theme';

const EmailSettings = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    submissionNotifications: true,
    weeklyReports: false,
    marketingEmails: false,
    confirmationEmails: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [currentUser]);

  const loadSettings = async () => {
    if (!currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data();
      if (userData?.emailSettings) {
        setSettings(userData.emailSettings);
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        emailSettings: settings
      });
      alert('Email settings saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving email settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      background: '#ffffff',
      borderRadius: theme.borderRadius.xl,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      padding: theme.spacing[8],
      width: '100%',
      maxWidth: '500px',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[6]
    },
    title: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.secondary[900],
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[2]
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: theme.spacing[2],
      borderRadius: theme.borderRadius.md,
      color: theme.colors.secondary[500]
    },
    setting: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing[4],
      background: theme.colors.secondary[50],
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing[3],
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '2px solid transparent'
    },
    settingActive: {
      background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)',
      border: '2px solid #3b82f6'
    },
    settingInfo: {
      flex: 1
    },
    settingTitle: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.secondary[900],
      marginBottom: theme.spacing[1]
    },
    settingDescription: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.secondary[600]
    },
    toggle: {
      width: '50px',
      height: '26px',
      borderRadius: '13px',
      position: 'relative',
      transition: 'background 0.3s ease',
      cursor: 'pointer'
    },
    toggleActive: {
      background: '#3b82f6'
    },
    toggleInactive: {
      background: '#d1d5db'
    },
    toggleKnob: {
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      background: 'white',
      position: 'absolute',
      top: '2px',
      transition: 'transform 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    footer: {
      display: 'flex',
      gap: theme.spacing[3],
      justifyContent: 'flex-end',
      marginTop: theme.spacing[6],
      paddingTop: theme.spacing[6],
      borderTop: `1px solid ${theme.colors.secondary[200]}`
    }
  };

  if (loading) {
    return (
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: 'center', padding: theme.spacing[8] }}>
            Loading settings...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <Mail size={24} />
            Email Notifications
          </h2>
          <button 
            style={styles.closeButton} 
            onClick={onClose}
            onMouseEnter={(e) => e.target.style.background = theme.colors.secondary[100]}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        <div>
          {/* Submission Notifications */}
          <div 
            style={{
              ...styles.setting,
              ...(settings.submissionNotifications ? styles.settingActive : {})
            }}
            onClick={() => toggleSetting('submissionNotifications')}
          >
            <div style={styles.settingInfo}>
              <div style={styles.settingTitle}>
                Form Submission Alerts
              </div>
              <div style={styles.settingDescription}>
                Get notified instantly when someone submits your form
              </div>
            </div>
            <div style={{
              ...styles.toggle,
              ...(settings.submissionNotifications ? styles.toggleActive : styles.toggleInactive)
            }}>
              <div style={{
                ...styles.toggleKnob,
                transform: settings.submissionNotifications ? 'translateX(26px)' : 'translateX(2px)'
              }} />
            </div>
          </div>

          {/* Confirmation Emails */}
          <div 
            style={{
              ...styles.setting,
              ...(settings.confirmationEmails ? styles.settingActive : {})
            }}
            onClick={() => toggleSetting('confirmationEmails')}
          >
            <div style={styles.settingInfo}>
              <div style={styles.settingTitle}>
                Send Confirmation to Submitters
              </div>
              <div style={styles.settingDescription}>
                Automatically send a thank you email with their responses
              </div>
            </div>
            <div style={{
              ...styles.toggle,
              ...(settings.confirmationEmails ? styles.toggleActive : styles.toggleInactive)
            }}>
              <div style={{
                ...styles.toggleKnob,
                transform: settings.confirmationEmails ? 'translateX(26px)' : 'translateX(2px)'
              }} />
            </div>
          </div>

          {/* Weekly Reports */}
          <div 
            style={{
              ...styles.setting,
              ...(settings.weeklyReports ? styles.settingActive : {})
            }}
            onClick={() => toggleSetting('weeklyReports')}
          >
            <div style={styles.settingInfo}>
              <div style={styles.settingTitle}>
                Weekly Summary Reports
              </div>
              <div style={styles.settingDescription}>
                Receive weekly insights about your form performance
              </div>
            </div>
            <div style={{
              ...styles.toggle,
              ...(settings.weeklyReports ? styles.toggleActive : styles.toggleInactive)
            }}>
              <div style={{
                ...styles.toggleKnob,
                transform: settings.weeklyReports ? 'translateX(26px)' : 'translateX(2px)'
              }} />
            </div>
          </div>

          {/* Marketing Emails */}
          <div 
            style={{
              ...styles.setting,
              ...(settings.marketingEmails ? styles.settingActive : {})
            }}
            onClick={() => toggleSetting('marketingEmails')}
          >
            <div style={styles.settingInfo}>
              <div style={styles.settingTitle}>
                Product Updates & Tips
              </div>
              <div style={styles.settingDescription}>
                Learn about new features and form building best practices
              </div>
            </div>
            <div style={{
              ...styles.toggle,
              ...(settings.marketingEmails ? styles.toggleActive : styles.toggleInactive)
            }}>
              <div style={{
                ...styles.toggleKnob,
                transform: settings.marketingEmails ? 'translateX(26px)' : 'translateX(2px)'
              }} />
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={saveSettings}
            loading={saving}
            leftIcon={<Check size={16} />}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;