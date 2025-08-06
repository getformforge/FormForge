import React, { useState } from 'react';
import { Share2, Copy, CheckCircle, X, Globe, Users } from 'lucide-react';
import Button from './ui/Button';
import { theme } from '../styles/theme';

const ShareFormModal = ({ isOpen, onClose, onPublish, isPublishing }) => {
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [shareUrl, setShareUrl] = useState(null);
  const [urlCopied, setUrlCopied] = useState(false);

  const handlePublish = async () => {
    if (!formTitle.trim()) {
      alert('Please enter a form title');
      return;
    }

    const result = await onPublish({
      title: formTitle,
      description: formDescription
    });

    if (result.success) {
      setShareUrl(result.formUrl);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy URL to clipboard');
    }
  };

  const handleClose = () => {
    setFormTitle('');
    setFormDescription('');
    setShareUrl(null);
    setUrlCopied(false);
    onClose();
  };

  if (!isOpen) return null;

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
      backdropFilter: 'blur(8px)',
      padding: '20px'
    },
    modal: {
      background: '#ffffff',
      borderRadius: theme.borderRadius.xl,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: `1px solid ${theme.colors.secondary[200]}`,
      padding: theme.spacing[8],
      width: '100%',
      maxWidth: '500px',
      position: 'relative'
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
      color: theme.colors.secondary[500],
      transition: 'all 0.2s ease'
    },
    inputGroup: {
      marginBottom: theme.spacing[4]
    },
    label: {
      display: 'block',
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.secondary[700],
      marginBottom: theme.spacing[2]
    },
    input: {
      width: '100%',
      padding: theme.spacing[3],
      border: `2px solid ${theme.colors.secondary[200]}`,
      borderRadius: theme.borderRadius.lg,
      fontSize: theme.typography.fontSize.base,
      outline: 'none',
      transition: 'all 0.2s ease'
    },
    textarea: {
      width: '100%',
      padding: theme.spacing[3],
      border: `2px solid ${theme.colors.secondary[200]}`,
      borderRadius: theme.borderRadius.lg,
      fontSize: theme.typography.fontSize.base,
      outline: 'none',
      resize: 'vertical',
      minHeight: '80px',
      fontFamily: 'inherit'
    },
    urlContainer: {
      background: theme.colors.secondary[50],
      border: `1px solid ${theme.colors.secondary[200]}`,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[6]
    },
    urlText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.secondary[700],
      wordBreak: 'break-all',
      marginBottom: theme.spacing[3]
    },
    successMessage: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[2],
      color: theme.colors.success[600],
      fontSize: theme.typography.fontSize.sm,
      marginBottom: theme.spacing[4]
    },
    buttonGroup: {
      display: 'flex',
      gap: theme.spacing[3],
      justifyContent: 'flex-end'
    }
  };

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <Share2 size={24} />
            Share Your Form
          </h2>
          <button 
            style={styles.closeButton}
            onClick={handleClose}
            onMouseEnter={(e) => {
              e.target.style.background = theme.colors.secondary[100];
              e.target.style.color = theme.colors.secondary[700];
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = theme.colors.secondary[500];
            }}
          >
            <X size={20} />
          </button>
        </div>

        {!shareUrl ? (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Form Title *
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Enter a title for your form"
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary[500];
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary[500]}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.secondary[200];
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Description (Optional)
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Add a brief description of your form"
                style={styles.textarea}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary[500];
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary[500]}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.secondary[200];
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={styles.buttonGroup}>
              <Button
                variant="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={<Globe size={16} />}
                onClick={handlePublish}
                disabled={isPublishing}
                loading={isPublishing}
              >
                {isPublishing ? 'Publishing...' : 'Publish & Share'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div style={styles.successMessage}>
              <CheckCircle size={16} />
              Form published successfully!
            </div>

            <div style={styles.urlContainer}>
              <label style={styles.label}>
                <Users size={16} style={{ display: 'inline', marginRight: theme.spacing[1] }} />
                Shareable Link
              </label>
              <div style={styles.urlText}>
                {shareUrl}
              </div>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={urlCopied ? <CheckCircle size={14} /> : <Copy size={14} />}
                onClick={copyToClipboard}
                style={{ width: '100%' }}
              >
                {urlCopied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>

            <div style={{ 
              background: theme.colors.info[50], 
              border: `1px solid ${theme.colors.info[200]}`,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing[4],
              marginBottom: theme.spacing[6]
            }}>
              <p style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.info[700],
                margin: 0
              }}>
                💡 Share this link with anyone you want to collect responses from. 
                They don't need an account to fill out your form.
              </p>
            </div>

            <div style={styles.buttonGroup}>
              <Button
                variant="primary"
                onClick={handleClose}
              >
                Done
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareFormModal;