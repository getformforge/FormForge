import React, { useState, useEffect } from 'react';
import { AlertTriangle, Crown, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats, getPlanLimits } from '../services/formService';

const PlanLimits = ({ onUpgrade }) => {
  const { currentUser, userPlan } = useAuth();
  const [stats, setStats] = useState({
    formCount: 0,
    submissionCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (currentUser) {
        const userStats = await getUserStats(currentUser.uid);
        setStats(userStats);
      }
      setLoading(false);
    };

    loadStats();
  }, [currentUser]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>
        Loading usage...
      </div>
    );
  }

  const limits = getPlanLimits(userPlan);
  const formUsagePercent = limits.maxForms === -1 ? 0 : (stats.formCount / limits.maxForms) * 100;
  const submissionUsagePercent = limits.maxSubmissions === -1 ? 0 : (stats.submissionCount / limits.maxSubmissions) * 100;
  
  const isFormLimitClose = formUsagePercent > 80;
  const isSubmissionLimitClose = submissionUsagePercent > 80;
  const isFormLimitReached = limits.maxForms !== -1 && stats.formCount >= limits.maxForms;
  const isSubmissionLimitReached = limits.maxSubmissions !== -1 && stats.submissionCount >= limits.maxSubmissions;

  const styles = {
    container: {
      background: 'rgba(255, 107, 53, 0.08)',
      border: '1px solid rgba(255, 107, 53, 0.2)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    title: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    planBadge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase',
      backgroundColor: userPlan === 'free' ? 'rgba(107, 114, 128, 0.2)' : 
                     userPlan === 'pro' ? 'rgba(59, 130, 246, 0.2)' : 
                     'rgba(16, 185, 129, 0.2)',
      color: userPlan === 'free' ? '#6b7280' : 
             userPlan === 'pro' ? '#3b82f6' : 
             '#10b981',
      border: `1px solid ${userPlan === 'free' ? '#6b7280' : 
                           userPlan === 'pro' ? '#3b82f6' : 
                           '#10b981'}40`
    },
    usageGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '16px'
    },
    usageItem: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      padding: '12px'
    },
    usageHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },
    usageLabel: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.7)',
      fontWeight: '500'
    },
    usageValue: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#ffffff'
    },
    progressBar: {
      width: '100%',
      height: '6px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: '3px',
      overflow: 'hidden'
    },
    progressFill: (percent, isLimit) => ({
      height: '100%',
      backgroundColor: isLimit ? '#ef4444' : percent > 80 ? '#f59e0b' : '#10b981',
      width: limits.maxForms === -1 && limits.maxSubmissions === -1 ? '100%' : `${Math.min(percent, 100)}%`,
      transition: 'width 0.3s ease'
    }),
    warning: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '8px',
      color: '#ef4444',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '16px'
    },
    upgradeButton: {
      width: '100%',
      padding: '12px',
      background: 'linear-gradient(45deg, #ff6b35, #e63946)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <TrendingUp size={16} />
          Usage & Limits
        </div>
        <div style={styles.planBadge}>
          {userPlan} Plan
        </div>
      </div>

      {(isFormLimitClose || isSubmissionLimitClose || isFormLimitReached || isSubmissionLimitReached) && (
        <div style={styles.warning}>
          <AlertTriangle size={16} />
          {isFormLimitReached ? 'Form limit reached!' : 
           isSubmissionLimitReached ? 'Submission limit reached!' :
           'Approaching plan limits. Consider upgrading.'}
        </div>
      )}

      <div style={styles.usageGrid}>
        <div style={styles.usageItem}>
          <div style={styles.usageHeader}>
            <div style={styles.usageLabel}>Forms</div>
            <div style={styles.usageValue}>
              {stats.formCount}{limits.maxForms === -1 ? '' : `/${limits.maxForms}`}
            </div>
          </div>
          <div style={styles.progressBar}>
            <div style={styles.progressFill(formUsagePercent, isFormLimitReached)} />
          </div>
        </div>
        
        <div style={styles.usageItem}>
          <div style={styles.usageHeader}>
            <div style={styles.usageLabel}>Submissions</div>
            <div style={styles.usageValue}>
              {stats.submissionCount}{limits.maxSubmissions === -1 ? '' : `/${limits.maxSubmissions}`}
            </div>
          </div>
          <div style={styles.progressBar}>
            <div style={styles.progressFill(submissionUsagePercent, isSubmissionLimitReached)} />
          </div>
        </div>
      </div>

      {userPlan === 'free' && (
        <button onClick={onUpgrade} style={styles.upgradeButton}>
          <Zap size={16} />
          Upgrade Plan
        </button>
      )}
    </div>
  );
};

export default PlanLimits;