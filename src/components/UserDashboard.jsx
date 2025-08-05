import React, { useState, useEffect } from 'react';
import { User, LogOut, Crown, BarChart3, FileText, Mail, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import SubmissionsDashboard from './SubmissionsDashboard';

const UserDashboard = ({ onClose }) => {
  const { currentUser, userPlan, logout } = useAuth();
  const [userStats, setUserStats] = useState({
    formCount: 0,
    submissionCount: 0,
    createdAt: null
  });
  const [loading, setLoading] = useState(true);
  const [showSubmissions, setShowSubmissions] = useState(false);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserStats({
              formCount: data.formCount || 0,
              submissionCount: data.submissionCount || 0,
              createdAt: data.createdAt?.toDate() || null
            });
          }
        } catch (error) {
          console.error('Error fetching user stats:', error);
        }
      }
      setLoading(false);
    };

    fetchUserStats();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      onClose?.();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getPlanLimits = (plan) => {
    switch (plan) {
      case 'pro':
        return { forms: 'Unlimited', submissions: '1,000/month', price: '$9/month' };
      case 'business':
        return { forms: 'Unlimited', submissions: '10,000/month', price: '$29/month' };
      default:
        return { forms: '3', submissions: '50/month', price: 'Free' };
    }
  };

  const planLimits = getPlanLimits(userPlan);
  const planColor = userPlan === 'free' ? '#6b7280' : userPlan === 'pro' ? '#3b82f6' : '#10b981';

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)'
    },
    container: {
      background: 'linear-gradient(135deg, rgba(45, 45, 45, 0.98), rgba(30, 30, 30, 0.98))',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255, 107, 53, 0.2)',
      border: '2px solid rgba(255, 107, 53, 0.3)',
      padding: '40px',
      width: '100%',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px',
      paddingBottom: '20px',
      borderBottom: '1px solid rgba(255, 107, 53, 0.2)'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    avatar: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      background: 'linear-gradient(45deg, #ff6b35, #ffaa00)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: '700',
      color: 'white'
    },
    userDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    userName: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#ffffff'
    },
    userEmail: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.7)'
    },
    planBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase',
      border: `2px solid ${planColor}`,
      color: planColor,
      background: `${planColor}15`
    },
    logoutButton: {
      padding: '12px 16px',
      background: 'rgba(239, 68, 68, 0.2)',
      border: '2px solid rgba(239, 68, 68, 0.4)',
      borderRadius: '10px',
      color: '#ef4444',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginBottom: '32px'
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 107, 53, 0.2)',
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'center'
    },
    statIcon: {
      margin: '0 auto 12px',
      padding: '12px',
      borderRadius: '50%',
      background: 'rgba(255, 107, 53, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 'fit-content'
    },
    statValue: {
      fontSize: '28px',
      fontWeight: '900',
      color: '#ff6b35',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.7)',
      fontWeight: '500'
    },
    planSection: {
      background: 'rgba(255, 107, 53, 0.08)',
      border: '1px solid rgba(255, 107, 53, 0.2)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px'
    },
    planTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    planDetails: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '16px',
      marginBottom: '20px'
    },
    planDetail: {
      textAlign: 'center'
    },
    planDetailLabel: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.6)',
      marginBottom: '4px',
      textTransform: 'uppercase',
      fontWeight: '600'
    },
    planDetailValue: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#ffffff'
    },
    upgradeButton: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(45deg, #ff6b35, #e63946)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    memberSince: {
      textAlign: 'center',
      color: 'rgba(255,255,255,0.6)',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }
  };

  if (loading) {
    return (
      <div style={styles.overlay}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', color: '#ffffff', fontSize: '18px' }}>
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {currentUser?.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>
                {currentUser?.displayName || 'User'}
              </div>
              <div style={styles.userEmail}>
                {currentUser?.email}
              </div>
              <div style={styles.planBadge}>
                <Crown size={14} />
                {userPlan} Plan
              </div>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <FileText size={24} color="#ff6b35" />
            </div>
            <div style={styles.statValue}>{userStats.formCount}</div>
            <div style={styles.statLabel}>Forms Created</div>
          </div>
          <div 
            style={{
              ...styles.statCard,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setShowSubmissions(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 107, 53, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.statIcon}>
              <BarChart3 size={24} color="#ff6b35" />
            </div>
            <div style={styles.statValue}>{userStats.submissionCount}</div>
            <div style={styles.statLabel}>Total Submissions</div>
          </div>
        </div>

        <div style={styles.planSection}>
          <div style={styles.planTitle}>
            <CreditCard size={20} />
            Current Plan: {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
          </div>
          <div style={styles.planDetails}>
            <div style={styles.planDetail}>
              <div style={styles.planDetailLabel}>Forms</div>
              <div style={styles.planDetailValue}>{planLimits.forms}</div>
            </div>
            <div style={styles.planDetail}>
              <div style={styles.planDetailLabel}>Submissions</div>
              <div style={styles.planDetailValue}>{planLimits.submissions}</div>
            </div>
            <div style={styles.planDetail}>
              <div style={styles.planDetailLabel}>Price</div>
              <div style={styles.planDetailValue}>{planLimits.price}</div>
            </div>
          </div>
          {userPlan === 'free' && (
            <button style={styles.upgradeButton}>
              Upgrade to Pro
            </button>
          )}
        </div>

        <div style={styles.memberSince}>
          <Calendar size={16} />
          Member since {userStats.createdAt?.toLocaleDateString() || 'Unknown'}
        </div>
      </div>
      
      {showSubmissions && (
        <SubmissionsDashboard onClose={() => setShowSubmissions(false)} />
      )}
    </div>
  );
};

export default UserDashboard;