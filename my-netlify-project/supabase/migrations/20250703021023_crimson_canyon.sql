/*
  # Create servers table for server management system

  1. New Tables
    - `servers`
      - `id` (uuid, primary key)
      - `server_ip` (text, unique per environment)
      - `port_number` (integer)
      - `server_name` (text)
      - `environment` (text, either 'UAT' or 'PRODUCTION')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `servers` table
    - Add policy for public read access (since this is a management tool)
    - Add policy for authenticated users to modify data (admin functionality)
*/

CREATE TABLE IF NOT EXISTS servers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_ip text NOT NULL,
  port_number integer NOT NULL CHECK (port_number > 0 AND port_number <= 65535),
  server_name text NOT NULL,
  environment text NOT NULL CHECK (environment IN ('UAT', 'PRODUCTION')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(server_ip, environment)
);

-- Enable Row Level Security
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for viewing servers)
CREATE POLICY "Allow public read access"
  ON servers
  FOR SELECT
  TO public
  USING (true);

-- Allow public insert/update/delete (for admin functionality)
-- In a production environment, you might want to restrict this to authenticated users
CREATE POLICY "Allow public write access"
  ON servers
  FOR ALL
  TO public
  USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
--CREATE TRIGGER update_servers_updated_at
  --BEFORE UPDATE ON servers
  --FOR EACH ROW
  --EXECUTE FUNCTION update_updated_at_column();

-- Insert default UAT servers
--INSERT INTO servers (server_ip, port_number, server_name, environment) VALUES
  ('172.16.0.70', 22, 'ACTIVEMQ AND GATEWAY', 'UAT'),
  ('192.168.100.11', 80, 'UAT Database Server', 'UAT'),
  ('192.168.100.12', 443, 'UAT Mail Server', 'UAT'),
  ('192.168.100.13', 3306, 'UAT MySQL Primary', 'UAT'),
  ('192.168.100.14', 5432, 'UAT PostgreSQL Main', 'UAT'),
  ('192.168.100.15', 6379, 'UAT Redis Cache', 'UAT'),
  ('192.168.100.16', 27017, 'UAT MongoDB Cluster', 'UAT'),
  ('192.168.100.17', 8080, 'UAT Application Server', 'UAT'),
  ('192.168.100.18', 9200, 'UAT Elasticsearch Node', 'UAT'),
  ('192.168.100.19', 5601, 'UAT Kibana Dashboard', 'UAT'),
  ('192.168.100.20', 3000, 'UAT Node.js API', 'UAT'),
  ('192.168.100.21', 8000, 'UAT Django Backend', 'UAT'),
  ('192.168.100.22', 4000, 'UAT GraphQL Server', 'UAT'),
  ('192.168.100.23', 5000, 'UAT Flask API', 'UAT'),
  ('192.168.100.24', 8888, 'UAT Jupyter Notebook', 'UAT'),
  ('192.168.100.25', 9000, 'UAT Jenkins CI/CD', 'UAT'),
  ('192.168.100.26', 8081, 'UAT Nexus Repository', 'UAT'),
  ('192.168.100.27', 9090, 'UAT Prometheus Monitor', 'UAT'),
  ('192.168.100.28', 3001, 'UAT Grafana Analytics', 'UAT'),
  ('192.168.100.29', 2181, 'UAT Zookeeper Service', 'UAT');

-- Insert default Production servers
--INSERT INTO servers (server_ip, port_number, server_name, environment) VALUES
  ('10.0.1.10', 22, 'PROD Web Server 01', 'PRODUCTION'),
  ('10.0.1.11', 80, 'PROD Database Server', 'PRODUCTION'),
  ('10.0.1.12', 443, 'PROD Mail Server', 'PRODUCTION'),
  ('10.0.1.13', 3306, 'PROD MySQL Primary', 'PRODUCTION'),
  ('10.0.1.14', 5432, 'PROD PostgreSQL Main', 'PRODUCTION'),
  ('10.0.1.15', 6379, 'PROD Redis Cache', 'PRODUCTION'),
  ('10.0.1.16', 27017, 'PROD MongoDB Cluster', 'PRODUCTION'),
  ('10.0.1.17', 8080, 'PROD Application Server', 'PRODUCTION'),
  ('10.0.1.18', 9200, 'PROD Elasticsearch Node', 'PRODUCTION'),
  ('10.0.1.19', 5601, 'PROD Kibana Dashboard', 'PRODUCTION'),
  ('10.0.1.20', 3000, 'PROD Node.js API', 'PRODUCTION'),
  ('10.0.1.21', 8000, 'PROD Django Backend', 'PRODUCTION'),
  ('10.0.1.22', 4000, 'PROD GraphQL Server', 'PRODUCTION'),
  ('10.0.1.23', 5000, 'PROD Flask API', 'PRODUCTION'),
  ('10.0.1.24', 8888, 'PROD Jupyter Notebook', 'PRODUCTION'),
  ('10.0.1.25', 9000, 'PROD Jenkins CI/CD', 'PRODUCTION'),
  ('10.0.1.26', 8081, 'PROD Nexus Repository', 'PRODUCTION'),
  ('10.0.1.27', 9090, 'PROD Prometheus Monitor', 'PRODUCTION'),
  ('10.0.1.28', 3001, 'PROD Grafana Analytics', 'PRODUCTION'),
  ('10.0.1.29', 2181, 'PROD Zookeeper Service', 'PRODUCTION'),
  ('10.0.1.30', 9092, 'PROD Kafka Broker', 'PRODUCTION'),
  ('10.0.1.31', 8082, 'PROD Kafka Connect', 'PRODUCTION'),
  ('10.0.1.32', 8083, 'PROD Schema Registry', 'PRODUCTION'),
  ('10.0.1.33', 7000, 'PROD Cassandra Node', 'PRODUCTION'),
  ('10.0.1.34', 8086, 'PROD InfluxDB Server', 'PRODUCTION'),
  ('10.0.1.35', 8888, 'PROD Chronograf UI', 'PRODUCTION'),
  ('10.0.1.36', 8089, 'PROD Telegraf Agent', 'PRODUCTION'),
  ('10.0.1.37', 8125, 'PROD StatsD Collector', 'PRODUCTION'),
  ('10.0.1.38', 9093, 'PROD Alertmanager', 'PRODUCTION'),
  ('10.0.1.39', 9094, 'PROD Pushgateway', 'PRODUCTION');