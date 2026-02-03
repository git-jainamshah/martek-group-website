'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, GitBranch, History, RotateCcw, CheckCircle, XCircle, Eye, AlertTriangle } from 'lucide-react';

interface Version {
  id: number;
  version: string;
  fullHash: string;
  shortHash: string;
  relativeDate: string;
  isoDate: string;
  author: string;
  email: string;
  message: string;
}

interface VersionData {
  versions: Version[];
  currentBranch: string;
  totalCommits: number;
}

export default function VersionControlPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [versionData, setVersionData] = useState<VersionData | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [rollbackConfirm, setRollbackConfirm] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');

  // Fetch versions after authentication
  const fetchVersions = async (pwd: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/git-versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd, action: 'getVersions' }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch versions');
      }

      const data = await response.json();
      setVersionData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/git-versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'getVersions' }),
      });

      if (response.status === 401) {
        setError('Invalid password');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setVersionData(data);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle rollback
  const handleRollback = async (commitHash: string) => {
    if (!window.confirm(`Are you sure you want to rollback to commit ${commitHash}? This will create a backup branch first.`)) {
      setRollbackConfirm(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/git-versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'rollback', commitHash }),
      });

      if (!response.ok) {
        throw new Error('Rollback failed');
      }

      const data = await response.json();
      alert(`✅ Successfully rolled back to ${commitHash}\n\nBackup branch created: ${data.backupBranch}\n\nRefresh the page to see updated versions.`);
      setRollbackConfirm(null);
      
      // Refresh versions
      await fetchVersions(password);
    } catch (err: any) {
      alert(`❌ Rollback failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter versions
  const filteredVersions = versionData?.versions.filter(v =>
    v.message.toLowerCase().includes(filterText.toLowerCase()) ||
    v.author.toLowerCase().includes(filterText.toLowerCase()) ||
    v.shortHash.includes(filterText.toLowerCase())
  ) || [];

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-500/20 p-4 rounded-full">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Version Control Dashboard
          </h1>
          <p className="text-center text-gray-300 mb-6">
            Enter password to access version history
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Enter admin password"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>🔒 Secured Admin Area</p>
            <p className="mt-2 text-xs">Only authorized personnel can access version history</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6 border border-white/20"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-full">
                <GitBranch className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Version Control Dashboard</h1>
                <p className="text-gray-300">Manage and monitor your project versions</p>
              </div>
            </div>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Total Versions</div>
              <div className="text-3xl font-bold text-white mt-1">
                {versionData?.totalCommits || 0}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Current Branch</div>
              <div className="text-2xl font-bold text-blue-400 mt-1">
                {versionData?.currentBranch || 'main'}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Latest Version</div>
              <div className="text-2xl font-bold text-green-400 mt-1">
                {versionData?.versions[0]?.version || 'N/A'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 mb-6 border border-white/20"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search by message, author, or commit hash..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="flex-1 min-w-[300px] px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'timeline'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Timeline View
              </button>
            </div>
          </div>
        </motion.div>

        {/* Versions Table */}
        {viewMode === 'table' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Sr#
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Commit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredVersions.map((version) => (
                    <motion.tr
                      key={version.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {version.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm font-mono">
                          {version.version}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-cyan-400 text-sm">{version.shortHash}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {version.relativeDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {version.author}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-md truncate">
                        {version.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedVersion(version)}
                            className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setRollbackConfirm(version.shortHash)}
                            className="p-2 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors"
                            title="Rollback to this version"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          /* Timeline View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredVersions.map((version, index) => (
              <motion.div
                key={version.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-blue-400/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-mono">
                        {version.version}
                      </span>
                      <code className="text-cyan-400 text-sm">{version.shortHash}</code>
                      <span className="text-gray-400 text-sm">{version.relativeDate}</span>
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-2">
                      {version.message}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      by {version.author} • {new Date(version.isoDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedVersion(version)}
                      className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setRollbackConfirm(version.shortHash)}
                      className="p-2 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Rollback Confirmation Modal */}
        <AnimatePresence>
          {rollbackConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setRollbackConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-orange-500/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-500/20 p-3 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Confirm Rollback</h3>
                </div>

                <p className="text-gray-300 mb-4">
                  Are you sure you want to rollback to commit <code className="text-cyan-400">{rollbackConfirm}</code>?
                </p>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mb-4">
                  <p className="text-orange-300 text-sm">
                    ⚠️ This will create a backup branch first, but all changes after this commit will be lost from the main branch.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleRollback(rollbackConfirm)}
                    disabled={loading}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Rolling back...' : 'Yes, Rollback'}
                  </button>
                  <button
                    onClick={() => setRollbackConfirm(null)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Version Details Modal */}
        <AnimatePresence>
          {selectedVersion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedVersion(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-blue-500/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">Version Details</h3>
                  <button
                    onClick={() => setSelectedVersion(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Version</label>
                    <div className="text-white font-semibold">{selectedVersion.version}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Commit Hash</label>
                    <code className="block text-cyan-400">{selectedVersion.fullHash}</code>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Author</label>
                    <div className="text-white">{selectedVersion.author} ({selectedVersion.email})</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Date</label>
                    <div className="text-white">
                      {new Date(selectedVersion.isoDate).toLocaleString()} ({selectedVersion.relativeDate})
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Message</label>
                    <div className="text-white bg-white/5 p-3 rounded-lg">{selectedVersion.message}</div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setRollbackConfirm(selectedVersion.shortHash);
                      setSelectedVersion(null);
                    }}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Rollback to This Version
                  </button>
                  <button
                    onClick={() => setSelectedVersion(null)}
                    className="px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
