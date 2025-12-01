import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '2rem',
                    textAlign: 'center',
                    background: 'var(--bg-color)',
                    color: 'var(--text-color)'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                        Something went wrong
                    </h1>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <button
                        className="btn-primary"
                        onClick={() => window.location.reload()}
                        style={{ padding: '1rem 2rem', fontSize: '1rem' }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
