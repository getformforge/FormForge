import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Clear any corrupted data from localStorage
    try {
      const keysToCheck = ['formRows', 'formFields', 'currentTemplate'];
      keysToCheck.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            JSON.parse(data);
          } catch (e) {
            console.log(`Removing corrupted ${key} from localStorage`);
            localStorage.removeItem(key);
          }
        }
      });
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  }

  handleReset = () => {
    // Clear potentially corrupted data
    localStorage.removeItem('formRows');
    localStorage.removeItem('formFields');
    localStorage.removeItem('currentTemplate');
    
    // Reset error state and reload
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const styles = {
        container: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px'
        },
        card: {
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          textAlign: 'center'
        },
        icon: {
          marginBottom: '20px',
          color: '#ef4444'
        },
        title: {
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '12px'
        },
        message: {
          fontSize: '16px',
          color: '#6b7280',
          marginBottom: '24px',
          lineHeight: '1.5'
        },
        errorDetails: {
          background: '#f3f4f6',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '24px',
          textAlign: 'left',
          fontSize: '12px',
          color: '#374151',
          fontFamily: 'monospace',
          maxHeight: '150px',
          overflow: 'auto'
        },
        buttonGroup: {
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        },
        button: {
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s ease'
        },
        primaryButton: {
          background: 'linear-gradient(45deg, #ff6b35, #e63946)',
          color: 'white'
        },
        secondaryButton: {
          background: '#f3f4f6',
          color: '#6b7280'
        }
      };

      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.icon}>
              <AlertCircle size={48} />
            </div>
            <h1 style={styles.title}>Oops! Something went wrong</h1>
            <p style={styles.message}>
              The form builder encountered an error. Don't worry, your work is saved. 
              Click below to reset and continue.
            </p>
            
            {this.state.error && (
              <div style={styles.errorDetails}>
                <strong>Error:</strong> {this.state.error.toString()}<br/>
                {this.state.errorInfo && (
                  <>
                    <strong>Stack:</strong><br/>
                    {this.state.errorInfo.componentStack.slice(0, 200)}...
                  </>
                )}
              </div>
            )}
            
            <div style={styles.buttonGroup}>
              <button 
                onClick={this.handleReset}
                style={{...styles.button, ...styles.primaryButton}}
              >
                <RefreshCw size={18} />
                Reset & Reload
              </button>
              <button 
                onClick={this.handleGoHome}
                style={{...styles.button, ...styles.secondaryButton}}
              >
                <Home size={18} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;