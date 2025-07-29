import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Wifi, Terminal, Check, X, Plus, UserCheck, Lock, LogOut, Server, Database, RefreshCw, AlertCircle, Wifi as WifiIcon, CheckCircle, XCircle } from 'lucide-react';
import { Server as ServerType } from '../types/server';
import { serverService } from '../services/serverService';

interface EditingState {
  id: number | null;
  field: 'serverIP' | 'portNumber' | 'serverName' | null;
  value: string;
}

interface NewServer {
  serverIP: string;
  portNumber: string;
  serverName: string;
}

type Environment = 'UAT' | 'PRODUCTION';

const ServerTable: React.FC = () => {
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment>('PRODUCTION');
  const [uatServerList, setUatServerList] = useState<ServerType[]>([]);
  const [productionServerList, setProductionServerList] = useState<ServerType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServers, setFilteredServers] = useState<ServerType[]>([]);
  const [editing, setEditing] = useState<EditingState>({ id: null, field: null, value: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newServer, setNewServer] = useState<NewServer>({
    serverIP: '',
    portNumber: '',
    serverName: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);

  // Admin password (in production, this should be handled securely on the backend)
  const ADMIN_PASSWORD = 'Beki123';

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Test database connection
  const testDatabaseConnection = async () => {
    try {
      const connected = await serverService.testConnection();
      setDbConnected(connected);
      if (!connected) {
        setError('Database connection failed. Please check your Supabase configuration.');
      }
      return connected;
    } catch (err) {
      console.error('Database connection test failed:', err);
      setDbConnected(false);
      setError('Database connection failed. Please check your Supabase configuration.');
      return false;
    }
  };

  const getCurrentServers = () => {
    return currentEnvironment === 'UAT' ? uatServerList : productionServerList;
  };

  const setCurrentServers = (servers: ServerType[]) => {
    if (currentEnvironment === 'UAT') {
      setUatServerList(servers);
    } else {
      setProductionServerList(servers);
    }
  };

  // Load servers from database
  const loadServers = async (environment: Environment) => {
    try {
      setLoading(true);
      setError(null);
      
      // Test connection first
      const connected = await testDatabaseConnection();
      if (!connected) {
        return;
      }

      const servers = await serverService.getServers(environment);
      
      if (environment === 'UAT') {
        setUatServerList(servers);
      } else {
        setProductionServerList(servers);
      }

      console.log(`✅ Loaded ${servers.length} servers for ${environment}`);
    } catch (err) {
      console.error('Failed to load servers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load servers');
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing Server Management Dashboard...');
      
      // Test database connection first
      const connected = await testDatabaseConnection();
      if (connected) {
        // Load both environments
        await Promise.all([
          loadServers('PRODUCTION'),
          loadServers('UAT')
        ]);
      }
    };

    initializeApp();
  }, []);

  // Filter servers based on search term
  useEffect(() => {
    const currentServers = getCurrentServers();
    const filtered = currentServers.filter(server =>
      server.serverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.serverIP.includes(searchTerm)
    );
    setFilteredServers(filtered);
  }, [searchTerm, uatServerList, productionServerList, currentEnvironment]);

  const handleEnvironmentSwitch = (env: Environment) => {
    setCurrentEnvironment(env);
    setSearchTerm('');
    setEditing({ id: null, field: null, value: '' });
    setShowAddForm(false);
  };

  const handleRefresh = async () => {
    await loadServers(currentEnvironment);
  };

  const handleLoginClick = () => {
    if (isAdmin) {
      // Logout
      setIsAdmin(false);
      setShowAddForm(false);
      setEditing({ id: null, field: null, value: '' });
    } else {
      // Show login modal
      setShowLoginModal(true);
      setLoginPassword('');
      setLoginError('');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setLoginPassword('');
      setLoginError('');
    } else {
      setLoginError('Invalid password. Please try again.');
      setLoginPassword('');
    }
  };

  const handleLoginCancel = () => {
    setShowLoginModal(false);
    setLoginPassword('');
    setLoginError('');
  };

  const handlePing = (server: ServerType) => {
    alert(`Pinging ${server.serverName} (${server.serverIP})...`);
  };

  const handleTelnet = (server: ServerType) => {
    alert(`Connecting to ${server.serverName} via Telnet on port ${server.portNumber}...`);
  };

  const handleDelete = async (server: ServerType) => {
    if (!isAdmin) {
      alert('Admin access required to delete servers.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${server.serverName}?`)) {
      try {
        await serverService.deleteServer(server);
        const currentServers = getCurrentServers();
        setCurrentServers(currentServers.filter(s => s.id !== server.id));
        console.log(`✅ Deleted server: ${server.serverName}`);
      } catch (err) {
        console.error('Failed to delete server:', err);
        alert(err instanceof Error ? err.message : 'Failed to delete server');
      }
    }
  };

  const startEditing = (serverId: number, field: 'serverIP' | 'portNumber' | 'serverName', currentValue: string | number) => {
    if (!isAdmin) {
      alert('Admin access required to edit servers.');
      return;
    }
    setEditing({
      id: serverId,
      field,
      value: currentValue.toString()
    });
  };

  const cancelEditing = () => {
    setEditing({ id: null, field: null, value: '' });
  };

  const saveEdit = async () => {
    if (editing.id && editing.field) {
      const currentServers = getCurrentServers();
      const serverToUpdate = currentServers.find(s => s.id === editing.id);
      
      if (!serverToUpdate) return;

      const updatedServer = { ...serverToUpdate };
      
      if (editing.field === 'portNumber') {
        const portNum = parseInt(editing.value);
        if (!isNaN(portNum) && portNum > 0 && portNum <= 65535) {
          updatedServer.portNumber = portNum;
        } else {
          alert('Please enter a valid port number (1-65535).');
          return;
        }
      } else if (editing.field === 'serverIP') {
        // Basic IP validation
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (ipRegex.test(editing.value)) {
          updatedServer.serverIP = editing.value;
        } else {
          alert('Please enter a valid IP address.');
          return;
        }
      } else if (editing.field === 'serverName') {
        if (editing.value.trim()) {
          updatedServer.serverName = editing.value.trim();
        } else {
          alert('Server name cannot be empty.');
          return;
        }
      }

      try {
        const updated = await serverService.updateServer(updatedServer);
        setCurrentServers(currentServers.map(server => 
          server.id === editing.id ? updated : server
        ));
        cancelEditing();
        console.log(`✅ Updated server: ${updated.serverName}`);
      } catch (err) {
        console.error('Failed to update server:', err);
        alert(err instanceof Error ? err.message : 'Failed to update server');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleAddServer = async () => {
    if (!isAdmin) {
      alert('Admin access required to add servers.');
      return;
    }

    // Validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const portNum = parseInt(newServer.portNumber);

    if (!ipRegex.test(newServer.serverIP)) {
      alert('Please enter a valid IP address.');
      return;
    }

    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      alert('Please enter a valid port number (1-65535).');
      return;
    }

    if (!newServer.serverName.trim()) {
      alert('Please enter a server name.');
      return;
    }

    const envPrefix = currentEnvironment === 'UAT' ? 'UAT' : 'PROD';
    const serverName = newServer.serverName.trim().startsWith(envPrefix) 
      ? newServer.serverName.trim() 
      : `${envPrefix} ${newServer.serverName.trim()}`;

    const newServerData = {
      serverIP: newServer.serverIP,
      portNumber: portNum,
      serverName
    };

    try {
      const addedServer = await serverService.addServer(newServerData, currentEnvironment);
      const currentServers = getCurrentServers();
      setCurrentServers([...currentServers, addedServer]);
      setNewServer({ serverIP: '', portNumber: '', serverName: '' });
      setShowAddForm(false);
      console.log(`✅ Added new server: ${addedServer.serverName}`);
    } catch (err) {
      console.error('Failed to add server:', err);
      alert(err instanceof Error ? err.message : 'Failed to add server');
    }
  };

  const cancelAddServer = () => {
    setNewServer({ serverIP: '', portNumber: '', serverName: '' });
    setShowAddForm(false);
  };

  const renderEditableCell = (server: ServerType, field: 'serverIP' | 'portNumber' | 'serverName', value: string | number) => {
    const isEditing = editing.id === server.id && editing.field === field;
    
    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type={field === 'portNumber' ? 'number' : 'text'}
            value={editing.value}
            onChange={(e) => setEditing(prev => ({ ...prev, value: e.target.value }))}
            onKeyDown={handleKeyPress}
            className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
            min={field === 'portNumber' ? 1 : undefined}
            max={field === 'portNumber' ? 65535 : undefined}
          />
          <button
            onClick={saveEdit}
            className="p-1 text-green-600 hover:text-green-800 transition-colors"
            title="Save"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={cancelEditing}
            className="p-1 text-red-600 hover:text-red-800 transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div
        className={`${isAdmin ? 'cursor-pointer hover:bg-blue-50' : 'cursor-default'} px-2 py-1 rounded transition-colors group`}
        onClick={() => isAdmin && startEditing(server.id, field, value)}
        title={isAdmin ? "Click to edit" : "Admin access required"}
      >
        <span className={field === 'serverIP' ? 'font-mono' : field === 'serverName' ? 'font-medium' : ''}>
          {value}
        </span>
        {isAdmin && <Edit className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-50 inline transition-opacity" />}
      </div>
    );
  };

  const getEnvironmentColor = (env: Environment) => {
    return env === 'UAT' ? 'from-blue-600 to-blue-700' : 'from-green-600 to-green-700';
  };

  const getEnvironmentIcon = (env: Environment) => {
    return env === 'UAT' ? <Database className="w-8 h-8" /> : <Server className="w-8 h-8" />;
  };

  const getConnectionStatus = () => {
    if (dbConnected === null) return { icon: RefreshCw, color: 'text-yellow-500', text: 'Connecting...', spin: true };
    if (dbConnected === true) return { icon: CheckCircle, color: 'text-green-500', text: 'Database Connected', spin: false };
    return { icon: XCircle, color: 'text-red-500', text: 'Database Disconnected', spin: false };
  };

  if (loading && getCurrentServers().length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-gray-600">Loading servers...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to database...</p>
        </div>
      </div>
    );
  }

  const connectionStatus = getConnectionStatus();
  const ConnectionIcon = connectionStatus.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Admin Login</h2>
            </div>
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Admin Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter password..."
                  autoFocus
                />
                {loginError && (
                  <p className="mt-2 text-sm text-red-600">{loginError}</p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={handleLoginCancel}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`bg-gradient-to-r ${getEnvironmentColor(currentEnvironment)} text-white py-6 px-6 shadow-lg`}>
        <h1 className="text-3xl font-bold text-center flex items-center justify-center">
          {getEnvironmentIcon(currentEnvironment)}
          <span className="ml-3">
            {currentEnvironment} Server Management - {isAdmin ? 'Admin' : 'Guest'}
          </span>
          {isAdmin && <UserCheck className="inline-block w-8 h-8 ml-3 text-green-200" />}
          {!isOnline && <WifiIcon className="inline-block w-8 h-8 ml-3 text-red-200" />}
        </h1>
        
        {/* Connection Status */}
        <div className="text-center mt-3">
          <div className="flex items-center justify-center space-x-2">
            <ConnectionIcon className={`w-5 h-5 ${connectionStatus.color} ${connectionStatus.spin ? 'animate-spin' : ''}`} />
            <span className={`text-sm font-medium ${connectionStatus.color}`}>
              {connectionStatus.text}
            </span>
          </div>
          {!isOnline && (
            <p className="text-red-200 text-sm mt-1">
              <AlertCircle className="inline w-4 h-4 mr-1" />
              You're offline. Changes may not be saved.
            </p>
          )}
        </div>
      </div>

      {/* Environment Navigation */}
      <div className="bg-white shadow-sm border-b px-6 py-3">
        <div className="flex justify-center items-center max-w-7xl mx-auto">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleEnvironmentSwitch('PRODUCTION')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center ${
                currentEnvironment === 'PRODUCTION'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Server className="w-4 h-4 mr-2" />
              Production Servers ({productionServerList.length})
            </button>
            <button
              onClick={() => handleEnvironmentSwitch('UAT')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center ${
                currentEnvironment === 'UAT'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Database className="w-4 h-4 mr-2" />
              UAT Servers ({uatServerList.length})
            </button>
          </div>
        </div>
      </div>

      {/* Search and Admin Controls Section */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Server Name or IP"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md flex items-center"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Server
              </button>
            )}
            <button
              onClick={handleLoginClick}
              className={`px-6 py-2 rounded-lg font-medium transition-colors shadow-md flex items-center ${
                isAdmin
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isAdmin ? (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Login
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <div>
              <p className="text-red-700 font-medium">Database Connection Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Server Form */}
      {showAddForm && isAdmin && (
        <div className="bg-blue-50 border-b px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New {currentEnvironment} Server</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Server IP</label>
                <input
                  type="text"
                  placeholder={currentEnvironment === 'UAT' ? '192.168.100.x' : '10.0.1.x'}
                  value={newServer.serverIP}
                  onChange={(e) => setNewServer(prev => ({ ...prev, serverIP: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Port Number</label>
                <input
                  type="number"
                  placeholder="8080"
                  min="1"
                  max="65535"
                  value={newServer.portNumber}
                  onChange={(e) => setNewServer(prev => ({ ...prev, portNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Server Name</label>
                <input
                  type="text"
                  placeholder={`${currentEnvironment} My New Server`}
                  value={newServer.serverName}
                  onChange={(e) => setNewServer(prev => ({ ...prev, serverName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  onClick={handleAddServer}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Add
                </button>
                <button
                  onClick={cancelAddServer}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                      R.No.
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                        Server IP
                      </div>
                      {isAdmin && <span className="text-xs font-normal text-gray-300 mt-1">Click to edit</span>}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                        Port Number
                      </div>
                      {isAdmin && <span className="text-xs font-normal text-gray-300 mt-1">Click to edit</span>}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                        Server Name
                      </div>
                      {isAdmin && <span className="text-xs font-normal text-gray-300 mt-1">Click to edit</span>}
                    </div>
                  </th>
                  {isAdmin && (
                    <>
                      <th className="px-6 py-4 text-center text-sm font-bold">
                        <div className="flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          Ping
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold">
                        <div className="flex items-center justify-center">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                          Telnet
                        </div>
                      </th>
                    </>
                  )}
                  <th className="px-6 py-4 text-center text-sm font-bold">
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                      Edit
                    </div>
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-4 text-center text-sm font-bold">
                      <div className="flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                        Delete
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredServers.map((server, index) => (
                  <tr key={server.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium bg-purple-50 border-r border-purple-100">
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-purple-400 rounded-full mr-3"></div>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 bg-blue-50 border-r border-blue-100">
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-blue-400 rounded-full mr-3"></div>
                        {renderEditableCell(server, 'serverIP', server.serverIP)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 bg-orange-50 border-r border-orange-100">
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-orange-400 rounded-full mr-3"></div>
                        {renderEditableCell(server, 'portNumber', server.portNumber)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 bg-emerald-50 border-r border-emerald-100">
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-emerald-400 rounded-full mr-3"></div>
                        {renderEditableCell(server, 'serverName', server.serverName)}
                      </div>
                    </td>
                    {isAdmin && (
                      <>
                        <td className="px-6 py-4 text-center bg-green-50">
                          <button
                            onClick={() => handlePing(server)}
                            className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            <Wifi className="w-4 h-4 mr-1" />
                            Ping
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center bg-yellow-50">
                          <button
                            onClick={() => handleTelnet(server)}
                            className="inline-flex items-center px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            <Terminal className="w-4 h-4 mr-1" />
                            Telnet
                          </button>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 text-center bg-blue-50">
                      <button
                        onClick={() => startEditing(server.id, 'serverName', server.serverName)}
                        className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 shadow-md ${
                          isAdmin
                            ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transform hover:scale-105'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                        disabled={!isAdmin}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-center bg-red-50">
                        <button
                          onClick={() => handleDelete(server)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredServers.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No servers found matching your search.</p>
              {dbConnected === false && (
                <p className="text-red-500 text-sm mt-2">Database connection required to load servers.</p>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredServers.length} of {getCurrentServers().length} {currentEnvironment.toLowerCase()} servers
          {dbConnected === true && <span className="ml-2 text-green-600 font-medium">• Database Connected</span>}
          {dbConnected === false && <span className="ml-2 text-red-600 font-medium">• Database Disconnected</span>}
          {isAdmin && <span className="ml-2 text-blue-600 font-medium">• Admin Mode Active</span>}
          {!isOnline && <span className="ml-2 text-red-600 font-medium">• Offline Mode</span>}
        </div>
      </div>
    </div>
  );
};

export default ServerTable;