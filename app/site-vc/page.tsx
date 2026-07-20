'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, GitBranch, RotateCcw, XCircle, Eye, AlertTriangle, Home, Copy, Check, X, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Copy to clipboard helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Press "/" to focus search
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

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
      alert(`Successfully rolled back to ${commitHash}\n\nBackup branch created: ${data.backupBranch}\n\nRefresh the page to see updated versions.`);
      setRollbackConfirm(null);
      
      // Refresh versions
      await fetchVersions(password);
    } catch (err: any) {
      alert(`Rollback failed: ${err.message}`);
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
                className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20"
              >
                <XCircle className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Secured Admin Area</p>
            <p className="mt-2 text-xs">Only authorized personnel can access version history</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Custom Admin Header */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/martek-only-logo.png"
              alt="Marrelay"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-lg font-bold text-white">Marrelay</h1>
              <p className="text-xs text-gray-400">Admin Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Go to Main Site</span>
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6 border border-white/20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-500/20 p-3 rounded-full">
              <GitBranch className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Version Control</h2>
              <p className="text-gray-300">Manage and monitor your project versions</p>
            </div>
          </div>

          {/* Enhanced Stats */}
          {loading && !versionData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4 h-24"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-5 border border-blue-400/20 hover:border-blue-400/40 transition-all"
              >
                <div className="text-blue-300 text-sm font-medium">Total Versions</div>
                <div className="text-4xl font-bold text-white mt-2 flex items-baseline gap-2">
                  {versionData?.totalCommits || 0}
                  <span className="text-sm text-blue-300 font-normal">commits</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-5 border border-purple-400/20 hover:border-purple-400/40 transition-all"
              >
                <div className="text-purple-300 text-sm font-medium">Current Branch</div>
                <div className="text-3xl font-bold text-white mt-2">
                  {versionData?.currentBranch || 'main'}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-5 border border-green-400/20 hover:border-green-400/40 transition-all"
              >
                <div className="text-green-300 text-sm font-medium">Latest Version</div>
                <div className="text-3xl font-bold text-white mt-2">
                  {versionData?.versions[0]?.version || 'N/A'}
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Enhanced Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 mb-6 border border-white/20"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by message, author, or commit hash... (Press / to focus)"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setFilterText('');
                }}
                className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              {filterText && (
                <button
                  onClick={() => setFilterText('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Timeline View
              </button>
            </div>
          </div>
          
          {filterText && (
            <div className="mt-3 text-sm text-gray-400">
              Found {filteredVersions.length} result{filteredVersions.length !== 1 ? 's' : ''} for &quot;{filterText}&quot;
            </div>
          )}
        </motion.div>

        {/* Enhanced Versions Table */}
        {viewMode === 'table' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
          >
            {filteredVersions.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                <p className="text-gray-400">Try adjusting your search terms</p>
              </div>
            ) : (
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
                    {filteredVersions.map((version, index) => (
                      <motion.tr
                        key={version.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className={`hover:bg-white/10 transition-all group ${
                          index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                          {version.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-mono font-semibold">
                            {version.version}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => copyToClipboard(version.fullHash)}
                            className="flex items-center gap-2 group/copy hover:bg-white/10 px-2 py-1 rounded transition-colors"
                            title="Click to copy full hash"
                          >
                            <code className="text-cyan-400 text-sm">{version.shortHash}</code>
                            {copiedHash === version.fullHash ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-gray-500 group-hover/copy:text-gray-300" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {version.relativeDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {version.author}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 max-w-md">
                          <div className="truncate group-hover:whitespace-normal group-hover:overflow-visible">
                            {version.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
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
            )}
          </motion.div>
        ) : (
          /* Enhanced Timeline View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-0"
          >
            {filteredVersions.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 text-center py-16">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                <p className="text-gray-400">Try adjusting your search terms</p>
              </div>
            ) : (
              filteredVersions.map((version, index) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="relative"
                >
                  {/* Timeline connector line */}
                  {index < filteredVersions.length - 1 && (
                    <div className="absolute left-[27px] top-[80px] bottom-[-16px] w-0.5 bg-gradient-to-b from-blue-400/50 to-transparent"></div>
                  )}
                  
                  <div className="flex gap-4 mb-4">
                    {/* Timeline dot */}
                    <div className="relative flex-shrink-0 mt-2">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 border-4 border-slate-900">
                        <GitBranch className="w-6 h-6 text-white" />
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>

                    {/* Content card */}
                    <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-blue-400/50 hover:bg-white/15 transition-all group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-mono font-semibold">
                              {version.version}
                            </span>
                            <button
                              onClick={() => copyToClipboard(version.fullHash)}
                              className="flex items-center gap-2 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                              title="Click to copy full hash"
                            >
                              <code className="text-cyan-400 text-sm">{version.shortHash}</code>
                              {copiedHash === version.fullHash ? (
                                <Check className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-gray-500 hover:text-gray-300" />
                              )}
                            </button>
                            <span className="text-gray-400 text-sm">{version.relativeDate}</span>
                          </div>
                          <h3 className="text-white text-lg font-semibold mb-2 leading-relaxed">
                            {version.message}
                          </h3>
                          <p className="text-gray-400 text-sm flex items-center gap-2">
                            <span>by {version.author}</span>
                            <span>•</span>
                            <span>{new Date(version.isoDate).toLocaleString()}</span>
                          </p>
                        </div>
                        <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelectedVersion(version)}
                            className="p-3 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors shadow-lg"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setRollbackConfirm(version.shortHash)}
                            className="p-3 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors shadow-lg"
                            title="Rollback to this version"
                          >
                            <RotateCcw className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Enhanced Rollback Confirmation Modal */}
        <AnimatePresence>
          {rollbackConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
              onClick={() => setRollbackConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-orange-500/30 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-500/20 p-3 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Confirm Rollback</h3>
                </div>

                <p className="text-gray-300 mb-4">
                  Are you sure you want to rollback to commit <code className="text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">{rollbackConfirm}</code>?
                </p>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-4">
                  <p className="text-orange-300 text-sm flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>This will create a backup branch first, but all changes after this commit will be lost from the main branch.</span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleRollback(rollbackConfirm)}
                    disabled={loading}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-orange-500/20"
                  >
                    {loading ? 'Rolling back...' : 'Yes, Rollback'}
                  </button>
                  <button
                    onClick={() => setRollbackConfirm(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Version Details Modal */}
        <AnimatePresence>
          {selectedVersion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedVersion(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-blue-500/30 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <GitBranch className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Version Details</h3>
                  </div>
                  <button
                    onClick={() => setSelectedVersion(null)}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Version</label>
                    <div className="text-white font-bold text-xl mt-1">{selectedVersion.version}</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold flex items-center justify-between">
                      Commit Hash
                      <button
                        onClick={() => copyToClipboard(selectedVersion.fullHash)}
                        className="flex items-center gap-1 text-xs normal-case text-blue-400 hover:text-blue-300"
                      >
                        {copiedHash === selectedVersion.fullHash ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </label>
                    <code className="block text-cyan-400 font-mono text-sm mt-2 break-all">{selectedVersion.fullHash}</code>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Author</label>
                    <div className="text-white mt-1">{selectedVersion.author}</div>
                    <div className="text-gray-400 text-sm mt-1">{selectedVersion.email}</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Date</label>
                    <div className="text-white mt-1">
                      {new Date(selectedVersion.isoDate).toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">{selectedVersion.relativeDate}</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Commit Message</label>
                    <div className="text-white mt-2 leading-relaxed">{selectedVersion.message}</div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setRollbackConfirm(selectedVersion.shortHash);
                      setSelectedVersion(null);
                    }}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-orange-500/20"
                  >
                    Rollback to This Version
                  </button>
                  <button
                    onClick={() => setSelectedVersion(null)}
                    className="px-8 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
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
