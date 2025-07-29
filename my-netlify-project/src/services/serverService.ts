import { supabase } from '../lib/supabase';
import { Server } from '../types/server';
import { ServerInsert, ServerUpdate } from '../types/database';

// Convert database row to frontend Server type
const convertToServer = (row: any): Server => ({
  id: parseInt(row.id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number for compatibility
  serverIP: row.server_ip,
  portNumber: row.port_number,
  serverName: row.server_name,
  dbId: row.id // Keep the original UUID for database operations
});

// Convert frontend Server to database insert format
const convertToInsert = (server: Omit<Server, 'id'>, environment: 'UAT' | 'PRODUCTION'): ServerInsert => ({
  server_ip: server.serverIP,
  port_number: server.portNumber,
  server_name: server.serverName,
  environment
});

// Default server data
const getDefaultServers = (environment: 'UAT' | 'PRODUCTION') => {
  if (environment === 'UAT') {
    return [
      { serverIP: '192.168.100.10', portNumber: 22, serverName: 'UAT Web Server 01' },
      { serverIP: '192.168.100.11', portNumber: 80, serverName: 'UAT Database Server' },
      { serverIP: '192.168.100.12', portNumber: 443, serverName: 'UAT Mail Server' },
      { serverIP: '192.168.100.13', portNumber: 3306, serverName: 'UAT MySQL Primary' },
      { serverIP: '192.168.100.14', portNumber: 5432, serverName: 'UAT PostgreSQL Main' },
      { serverIP: '192.168.100.15', portNumber: 6379, serverName: 'UAT Redis Cache' },
      { serverIP: '192.168.100.16', portNumber: 27017, serverName: 'UAT MongoDB Cluster' },
      { serverIP: '192.168.100.17', portNumber: 8080, serverName: 'UAT Application Server' },
      { serverIP: '192.168.100.18', portNumber: 9200, serverName: 'UAT Elasticsearch Node' },
      { serverIP: '192.168.100.19', portNumber: 5601, serverName: 'UAT Kibana Dashboard' },
      { serverIP: '192.168.100.20', portNumber: 3000, serverName: 'UAT Node.js API' },
      { serverIP: '192.168.100.21', portNumber: 8000, serverName: 'UAT Django Backend' },
      { serverIP: '192.168.100.22', portNumber: 4000, serverName: 'UAT GraphQL Server' },
      { serverIP: '192.168.100.23', portNumber: 5000, serverName: 'UAT Flask API' },
      { serverIP: '192.168.100.24', portNumber: 8888, serverName: 'UAT Jupyter Notebook' },
      { serverIP: '192.168.100.25', portNumber: 9000, serverName: 'UAT Jenkins CI/CD' },
      { serverIP: '192.168.100.26', portNumber: 8081, serverName: 'UAT Nexus Repository' },
      { serverIP: '192.168.100.27', portNumber: 9090, serverName: 'UAT Prometheus Monitor' },
      { serverIP: '192.168.100.28', portNumber: 3001, serverName: 'UAT Grafana Analytics' },
      { serverIP: '192.168.100.29', portNumber: 2181, serverName: 'UAT Zookeeper Service' }
    ];
  } else {
    return [
      { serverIP: '10.0.1.10', portNumber: 22, serverName: 'PROD Web Server 01' },
      { serverIP: '10.0.1.11', portNumber: 80, serverName: 'PROD Database Server' },
      { serverIP: '10.0.1.12', portNumber: 443, serverName: 'PROD Mail Server' },
      { serverIP: '10.0.1.13', portNumber: 3306, serverName: 'PROD MySQL Primary' },
      { serverIP: '10.0.1.14', portNumber: 5432, serverName: 'PROD PostgreSQL Main' },
      { serverIP: '10.0.1.15', portNumber: 6379, serverName: 'PROD Redis Cache' },
      { serverIP: '10.0.1.16', portNumber: 27017, serverName: 'PROD MongoDB Cluster' },
      { serverIP: '10.0.1.17', portNumber: 8080, serverName: 'PROD Application Server' },
      { serverIP: '10.0.1.18', portNumber: 9200, serverName: 'PROD Elasticsearch Node' },
      { serverIP: '10.0.1.19', portNumber: 5601, serverName: 'PROD Kibana Dashboard' },
      { serverIP: '10.0.1.20', portNumber: 3000, serverName: 'PROD Node.js API' },
      { serverIP: '10.0.1.21', portNumber: 8000, serverName: 'PROD Django Backend' },
      { serverIP: '10.0.1.22', portNumber: 4000, serverName: 'PROD GraphQL Server' },
      { serverIP: '10.0.1.23', portNumber: 5000, serverName: 'PROD Flask API' },
      { serverIP: '10.0.1.24', portNumber: 8888, serverName: 'PROD Jupyter Notebook' },
      { serverIP: '10.0.1.25', portNumber: 9000, serverName: 'PROD Jenkins CI/CD' },
      { serverIP: '10.0.1.26', portNumber: 8081, serverName: 'PROD Nexus Repository' },
      { serverIP: '10.0.1.27', portNumber: 9090, serverName: 'PROD Prometheus Monitor' },
      { serverIP: '10.0.1.28', portNumber: 3001, serverName: 'PROD Grafana Analytics' },
      { serverIP: '10.0.1.29', portNumber: 2181, serverName: 'PROD Zookeeper Service' },
      { serverIP: '10.0.1.30', portNumber: 9092, serverName: 'PROD Kafka Broker' },
      { serverIP: '10.0.1.31', portNumber: 8082, serverName: 'PROD Kafka Connect' },
      { serverIP: '10.0.1.32', portNumber: 8083, serverName: 'PROD Schema Registry' },
      { serverIP: '10.0.1.33', portNumber: 7000, serverName: 'PROD Cassandra Node' },
      { serverIP: '10.0.1.34', portNumber: 8086, serverName: 'PROD InfluxDB Server' },
      { serverIP: '10.0.1.35', portNumber: 8888, serverName: 'PROD Chronograf UI' },
      { serverIP: '10.0.1.36', portNumber: 8089, serverName: 'PROD Telegraf Agent' },
      { serverIP: '10.0.1.37', portNumber: 8125, serverName: 'PROD StatsD Collector' },
      { serverIP: '10.0.1.38', portNumber: 9093, serverName: 'PROD Alertmanager' },
      { serverIP: '10.0.1.39', portNumber: 9094, serverName: 'PROD Pushgateway' }
    ];
  }
};

export const serverService = {
  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('count')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  },

  // Fetch all servers for a specific environment
  async getServers(environment: 'UAT' | 'PRODUCTION'): Promise<Server[]> {
    try {
      // Test connection first
      const isConnected = await this.testConnection();
      if (!isConnected) {
        throw new Error('Database connection failed. Please check your Supabase configuration.');
      }

      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .eq('environment', environment)
        .order('server_name');

      if (error) {
        console.error('Error fetching servers:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      // If no servers exist for this environment, initialize with defaults
      if (!data || data.length === 0) {
        console.log(`No servers found for ${environment}, initializing with defaults...`);
        await this.initializeDefaultServers(environment);
        return await this.getServers(environment);
      }

      return data.map(convertToServer);
    } catch (error) {
      console.error('Failed to fetch servers:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to load servers from database');
    }
  },

  // Initialize default servers for an environment
  async initializeDefaultServers(environment: 'UAT' | 'PRODUCTION'): Promise<void> {
    try {
      const defaultServers = getDefaultServers(environment);
      const insertData = defaultServers.map(server => convertToInsert(server, environment));

      const { error } = await supabase
        .from('servers')
        .insert(insertData);

      if (error) {
        console.error('Error initializing default servers:', error);
        throw new Error(`Failed to initialize default servers: ${error.message}`);
      }

      console.log(`Successfully initialized ${defaultServers.length} default servers for ${environment}`);
    } catch (error) {
      console.error('Failed to initialize default servers:', error);
      throw error;
    }
  },

  // Add a new server
  async addServer(server: Omit<Server, 'id'>, environment: 'UAT' | 'PRODUCTION'): Promise<Server> {
    try {
      const { data, error } = await supabase
        .from('servers')
        .insert(convertToInsert(server, environment))
        .select()
        .single();

      if (error) {
        console.error('Error adding server:', error);
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('A server with this IP address already exists in this environment');
        }
        throw new Error(`Database error: ${error.message}`);
      }

      return convertToServer(data);
    } catch (error) {
      console.error('Failed to add server:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to add server to database');
    }
  },

  // Update an existing server
  async updateServer(server: Server): Promise<Server> {
    try {
      const updateData: ServerUpdate = {
        server_ip: server.serverIP,
        port_number: server.portNumber,
        server_name: server.serverName,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('servers')
        .update(updateData)
        .eq('id', server.dbId || server.id.toString())
        .select()
        .single();

      if (error) {
        console.error('Error updating server:', error);
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('A server with this IP address already exists in this environment');
        }
        throw new Error(`Database error: ${error.message}`);
      }

      return convertToServer(data);
    } catch (error) {
      console.error('Failed to update server:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update server in database');
    }
  },

  // Delete a server
  async deleteServer(server: Server): Promise<void> {
    try {
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', server.dbId || server.id.toString());

      if (error) {
        console.error('Error deleting server:', error);
        throw new Error(`Database error: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to delete server:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete server from database');
    }
  },

  // Reset servers to default for an environment
  async resetToDefault(environment: 'UAT' | 'PRODUCTION'): Promise<Server[]> {
    try {
      // First, delete all existing servers for this environment
      const { error: deleteError } = await supabase
        .from('servers')
        .delete()
        .eq('environment', environment);

      if (deleteError) {
        console.error('Error deleting existing servers:', deleteError);
        throw new Error(`Failed to delete existing servers: ${deleteError.message}`);
      }

      // Then initialize with default servers
      await this.initializeDefaultServers(environment);

      // Return the fresh default data
      return await this.getServers(environment);
    } catch (error) {
      console.error('Failed to reset servers:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to reset servers to default');
    }
  }
};