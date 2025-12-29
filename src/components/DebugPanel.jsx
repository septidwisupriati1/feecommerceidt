import { useState } from 'react';
import { getCurrentUser } from '../services/authAPI';
import { getUserRoles, getPrimaryRole, getDashboardPath, getRoleLabel, getRoleBadgeClass } from '../utils/roleHelper';
import { isAuthenticated, getToken } from '../utils/auth';

/**
 * 🔍 DEBUG PANEL - Development Tool
 * 
 * PENJELASAN:
 * Panel ini menampilkan informasi login user untuk memudahkan debugging.
 * Berguna untuk melihat role, permission, dan status autentikasi.
 * 
 * FITUR:
 * - Menampilkan data user yang sedang login
 * - Menampilkan role & permission
 * - Tombol logout cepat
 * - Log detail ke console
 * - Bisa di-minimize untuk tidak mengganggu
 * 
 * HANYA MUNCUL DI DEVELOPMENT MODE!
 * Di production akan otomatis hidden.
 */
export default function DebugPanel() {
  const [isMinimized, setIsMinimized] = useState(false);
  const user = getCurrentUser();
  const token = getToken();
  const authenticated = isAuthenticated();
  const roles = getUserRoles(user);
  const primaryRole = getPrimaryRole(user);
  const dashboardPath = getDashboardPath(user);

  // Hide in production (otomatis tidak muncul saat build)
  if (import.meta.env.PROD) {
    return null;
  }

  // Jika tidak ada user yang login
  if (!user || !authenticated) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md z-50">
        <p className="font-bold">⚠️ No User Logged In</p>
        <p className="text-sm">Please login to see debug info</p>
        <p className="text-xs mt-2 text-red-600">
          Token: {token ? '✅ Available' : '❌ Missing'}
        </p>
      </div>
    );
  }

  // Jika panel di-minimize, tampilkan button kecil
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded-full shadow-xl hover:bg-gray-800 transition-all z-50"
        title="Open Debug Panel"
      >
        🔍
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl max-w-md z-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm flex items-center gap-2">
          🔍 Debug Info
          <span className="text-xs bg-green-600 px-2 py-0.5 rounded">DEV</span>
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => {
              console.group('🔍 FULL USER DEBUG INFO');
              console.log('📋 User Object:', user);
              console.log('📊 Roles Array:', user?.roles);
              console.log('🏷️  Role String:', user?.role);
              console.log('✅ Normalized Roles:', roles);
              console.log('⭐ Primary Role:', primaryRole);
              console.log('🚪 Dashboard Path:', dashboardPath);
              console.log('🔐 Token:', token ? 'Available' : 'Missing');
              console.log('✔️  Authenticated:', authenticated);
              console.groupEnd();
            }}
            className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
            title="Log detail to browser console"
          >
            Log to Console
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors"
            title="Minimize panel"
          >
            ➖
          </button>
        </div>
      </div>
      
      {/* User Info Section */}
      <div className="space-y-1 text-xs">
        <div className="mb-2 pb-2 border-b border-gray-700">
          <span className="text-gray-400 font-semibold">👤 USER INFORMATION</span>
        </div>
        
        <div>
          <span className="text-gray-400">User ID:</span>{' '}
          <span className="text-yellow-400 font-mono">{user.user_id}</span>
        </div>
        
        <div>
          <span className="text-gray-400">Username:</span>{' '}
          <span className="text-green-400 font-semibold">{user.username}</span>
        </div>
        
        <div>
          <span className="text-gray-400">Email:</span>{' '}
          <span className="text-blue-400">{user.email}</span>
        </div>

        {/* Role Section */}
        <div className="mt-3 mb-2 pt-2 border-t border-gray-700">
          <span className="text-gray-400 font-semibold">🎭 ROLE & PERMISSIONS</span>
        </div>
        
        <div>
          <span className="text-gray-400">Roles (array):</span>{' '}
          <code className="text-purple-400 bg-gray-800 px-1 rounded font-mono text-xs">
            {JSON.stringify(user.roles)}
          </code>
        </div>
        
        <div>
          <span className="text-gray-400">Role (string):</span>{' '}
          <code className="text-purple-400 bg-gray-800 px-1 rounded font-mono text-xs">
            "{user.role}"
          </code>
        </div>
        
        <div>
          <span className="text-gray-400">Normalized Roles:</span>{' '}
          <div className="flex gap-1 mt-1 flex-wrap">
            {roles.map(role => (
              <span
                key={role}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${getRoleBadgeClass(role)}`}
              >
                {getRoleLabel(role)}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <span className="text-gray-400">Primary Role:</span>{' '}
          <span className="text-yellow-400 font-bold uppercase">{primaryRole}</span>
        </div>

        {/* Navigation Section */}
        <div className="mt-3 mb-2 pt-2 border-t border-gray-700">
          <span className="text-gray-400 font-semibold">🚪 NAVIGATION</span>
        </div>
        
        <div>
          <span className="text-gray-400">Dashboard Path:</span>{' '}
          <code className="text-cyan-400 bg-gray-800 px-1 rounded font-mono text-xs">
            {dashboardPath}
          </code>
        </div>

        <div>
          <a
            href={dashboardPath}
            className="inline-block mt-1 text-xs bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded transition-colors"
          >
            Go to Dashboard →
          </a>
        </div>

        {/* Auth Status */}
        <div className="mt-3 mb-2 pt-2 border-t border-gray-700">
          <span className="text-gray-400 font-semibold">🔐 AUTH STATUS</span>
        </div>

        <div>
          <span className="text-gray-400">Authenticated:</span>{' '}
          <span className={authenticated ? "text-green-400" : "text-red-400"}>
            {authenticated ? "✅ Yes" : "❌ No"}
          </span>
        </div>

        <div>
          <span className="text-gray-400">Token:</span>{' '}
          <span className={token ? "text-green-400" : "text-red-400"}>
            {token ? "✅ Available" : "❌ Missing"}
          </span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-3 pt-2 border-t border-gray-700 space-y-2">
        <button
          onClick={() => {
            if (confirm('⚠️ Anda yakin ingin logout?\n\nIni akan menghapus semua data login dari browser.')) {
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              window.location.href = '/login';
            }
          }}
          className="w-full text-xs bg-red-600 hover:bg-red-700 px-3 py-2 rounded font-semibold transition-colors"
        >
          🚪 Clear & Logout
        </button>

        <div className="text-xs text-gray-500 text-center">
          💡 Tip: Press F12 to open DevTools
        </div>
      </div>
    </div>
  );
}
