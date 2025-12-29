/**
 * Auth Debug Panel Component
 * Component untuk debugging authentication state
 * Hanya untuk development
 */

import { useState, useEffect } from 'react';
import { debugAuth, getToken, getUser, getUserRole, isAuthenticated, isTokenExpired } from '../utils/auth';

export default function AuthDebugPanel() {
  const [authState, setAuthState] = useState({});
  const [showPanel, setShowPanel] = useState(false);

  const refreshAuthState = () => {
    const token = getToken();
    const user = getUser();
    const role = getUserRole();
    
    setAuthState({
      hasToken: !!token,
      token: token ? token.substring(0, 30) + '...' : null,
      tokenFull: token,
      isAuthenticated: isAuthenticated(),
      isExpired: isTokenExpired(),
      user: user,
      role: role,
      localStorage: {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user')
      }
    });
    
    // Log to console
    debugAuth();
  };

  useEffect(() => {
    refreshAuthState();
  }, []);

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 z-50"
        title="Debug Auth"
      >
        🔍
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-purple-600 rounded-lg shadow-xl p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-purple-600">🔍 Auth Debug Panel</h3>
        <button
          onClick={() => setShowPanel(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Authenticated:</span>
          <span className={authState.isAuthenticated ? 'text-green-600' : 'text-red-600'}>
            {authState.isAuthenticated ? '✅ Yes' : '❌ No'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold">Has Token:</span>
          <span className={authState.hasToken ? 'text-green-600' : 'text-red-600'}>
            {authState.hasToken ? '✅ Yes' : '❌ No'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold">Token Expired:</span>
          <span className={authState.isExpired ? 'text-red-600' : 'text-green-600'}>
            {authState.isExpired ? '⚠️ Yes' : '✅ No'}
          </span>
        </div>

        {authState.token && (
          <div>
            <span className="font-semibold">Token Preview:</span>
            <div className="mt-1 p-2 bg-gray-100 rounded text-xs font-mono break-all">
              {authState.token}
            </div>
          </div>
        )}

        {authState.user && (
          <div>
            <span className="font-semibold">User:</span>
            <div className="mt-1 p-2 bg-gray-100 rounded text-xs">
              <div><strong>Username:</strong> {authState.user.username}</div>
              <div><strong>Email:</strong> {authState.user.email}</div>
              <div><strong>Role:</strong> {authState.role}</div>
              <div><strong>ID:</strong> {authState.user.user_id}</div>
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <button
            onClick={refreshAuthState}
            className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-medium"
          >
            🔄 Refresh Auth State
          </button>
        </div>

        <div className="pt-1">
          <button
            onClick={() => {
              console.log('Full Auth State:', authState);
              alert('Auth state logged to console (F12)');
            }}
            className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
          >
            📋 Log to Console
          </button>
        </div>
      </div>
    </div>
  );
}
