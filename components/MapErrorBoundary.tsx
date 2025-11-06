/**
 * Map Error Boundary
 * Gracefully handles map loading errors and provides fallback UI
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, RefreshCw, AlertCircle } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ [MAP ERROR BOUNDARY] Map component error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <AlertCircle size={48} color="#ef4444" />
            <Text style={styles.title}>Map Unavailable</Text>
            <Text style={styles.message}>
              {this.props.fallbackMessage || 
                'Unable to load map. Please check your internet connection and try again.'}
            </Text>
            {this.state.error && __DEV__ && (
              <Text style={styles.errorDetails}>
                {this.state.error.message}
              </Text>
            )}
            <TouchableOpacity style={styles.retryButton} onPress={this.handleReset}>
              <RefreshCw size={20} color="white" />
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  errorDetails: {
    fontSize: 12,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapErrorBoundary;

