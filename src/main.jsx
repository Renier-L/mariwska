import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in MARIKHA App:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#041209',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'sans-serif',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌱</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#86efac', marginBottom: '8px' }}>
            MARIKHA Cooperative Portal
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', maxWidth: '420px', marginBottom: '16px' }}>
            An unexpected render issue occurred. Click below to reload and restore session.
          </p>
          {this.state.error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #f87171',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              maxWidth: '600px',
              marginBottom: '20px',
              textAlign: 'left',
              fontFamily: 'monospace',
              overflowX: 'auto'
            }}>
              <strong>Error Trace:</strong> {this.state.error.toString()}
            </div>
          )}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              background: '#15803d',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            🔄 Reset & Reload Portal
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
