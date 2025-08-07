import React, { useState, useEffect } from 'react';
import { User, LogOut, Crown, BarChart3, FileText, Mail, Calendar, CreditCard, TrendingUp, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../styles/theme';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import SubmissionsDashboard from './SubmissionsDashboard';
import { getUserStats, getPlanLimits as getServicePlanLimits } from '../services/formService';

const UserDashboard = ({ onClose }) => {
  const { currentUser, userPlan, logout } = useAuth();
  const [userStats, setUserStats] = useState({
    formCount: 0,
    submissionCount: 0,
    createdAt: null,
    pdfGenerations: {}
  });
  const [loading, setLoading] = useState(true);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [showUsageDetails, setShowUsageDetails] = useState(false);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (currentUser) {
        try {
          const stats = await getUserStats(currentUser.uid);
          setUserStats(stats);
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)'
    },
    container: {
      background: '#ffffff',
      borderRadius: theme.borderRadius.xl,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: `1px solid ${theme.colors.secondary[200]}`,
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
      background: theme.gradients.primary,
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
      color: theme.colors.secondary[900]
    },
    userEmail: {
      fontSize: '14px',
      color: theme.colors.secondary[600]
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
      color: theme.colors.error[500],
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
      color: theme.colors.primary[500],
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '14px',
      color: theme.colors.secondary[600],
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
      color: theme.colors.secondary[900],
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
      color: theme.colors.secondary[500],
      marginBottom: '4px',
      textTransform: 'uppercase',
      fontWeight: '600'
    },
    planDetailValue: {
      fontSize: '16px',
      fontWeight: '700',
      color: theme.colors.secondary[900]
    },
    upgradeButton: {
      width: '100%',
      padding: '16px',
      background: theme.gradients.primary,
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
      color: theme.colors.secondary[500],
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
          <div style={{ textAlign: 'center', color: theme.colors.secondary[600], fontSize: '18px' }}>
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

        {/* Usage & Limits Section - Compact and Subtle */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 107, 53, 0.15)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginBottom: showUsageDetails ? '16px' : 0
            }}
            onClick={() => setShowUsageDetails(!showUsageDetails)}
          >
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: theme.colors.secondary[700],
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <TrendingUp size={16} />
              Usage & Limits
            </div>
            <div style={{
              fontSize: '24px',
              color: theme.colors.secondary[400],
              transform: showUsageDetails ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>
              ⌄
            </div>
          </div>

          {showUsageDetails && (() => {
            const limits = getServicePlanLimits(userPlan);
            const currentMonth = new Date().toISOString().slice(0, 7);
            const monthlyPDFs = userStats.pdfGenerations?.[currentMonth] || 0;
            
            const formUsagePercent = limits.maxForms === -1 ? 0 : (userStats.formCount / limits.maxForms) * 100;
            const submissionUsagePercent = limits.maxSubmissions === -1 ? 0 : (userStats.submissionCount / limits.maxSubmissions) * 100;
            const pdfUsagePercent = limits.maxPDFsPerMonth === -1 ? 0 : (monthlyPDFs / limits.maxPDFsPerMonth) * 100;
            
            const isAnyLimitClose = formUsagePercent > 80 || submissionUsagePercent > 80 || pdfUsagePercent > 80;

            return (
              <>
                {isAnyLimitClose && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    borderRadius: '8px',
                    color: theme.colors.warning[500],
                    fontSize: '12px',
                    fontWeight: '500',
                    marginBottom: '12px'
                  }}>
                    <AlertTriangle size={14} />
                    Approaching plan limits
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Forms Usage */}
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Forms</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
                        {userStats.formCount}{limits.maxForms === -1 ? ' / Unlimited' : ` / ${limits.maxForms}`}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        backgroundColor: formUsagePercent > 80 ? '#fbbf24' : '#10b981',
                        width: limits.maxForms === -1 ? '100%' : `${Math.min(formUsagePercent, 100)}%`,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  {/* Submissions Usage */}
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Submissions</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
                        {userStats.submissionCount}{limits.maxSubmissions === -1 ? ' / Unlimited' : ` / ${limits.maxSubmissions}`}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        backgroundColor: submissionUsagePercent > 80 ? '#fbbf24' : '#10b981',
                        width: limits.maxSubmissions === -1 ? '100%' : `${Math.min(submissionUsagePercent, 100)}%`,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  {/* PDF Generation Usage */}
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>PDFs This Month</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
                        {monthlyPDFs}{limits.maxPDFsPerMonth === -1 ? ' / Unlimited' : ` / ${limits.maxPDFsPerMonth}`}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        backgroundColor: pdfUsagePercent > 80 ? '#fbbf24' : '#10b981',
                        width: limits.maxPDFsPerMonth === -1 ? '100%' : `${Math.min(pdfUsagePercent, 100)}%`,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
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