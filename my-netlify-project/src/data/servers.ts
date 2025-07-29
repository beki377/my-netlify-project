import { Server } from '../types/server';

export const uatServers: Server[] = [
  { id: 1, serverIP: '192.168.100.10', portNumber: 22, serverName: 'UAT Web Server 01' },
  { id: 2, serverIP: '192.168.100.11', portNumber: 80, serverName: 'UAT Database Server' },
  { id: 3, serverIP: '192.168.100.12', portNumber: 443, serverName: 'UAT Mail Server' },
  { id: 4, serverIP: '192.168.100.13', portNumber: 3306, serverName: 'UAT MySQL Primary' },
  { id: 5, serverIP: '192.168.100.14', portNumber: 5432, serverName: 'UAT PostgreSQL Main' },
  { id: 6, serverIP: '192.168.100.15', portNumber: 6379, serverName: 'UAT Redis Cache' },
  { id: 7, serverIP: '192.168.100.16', portNumber: 27017, serverName: 'UAT MongoDB Cluster' },
  { id: 8, serverIP: '192.168.100.17', portNumber: 8080, serverName: 'UAT Application Server' },
  { id: 9, serverIP: '192.168.100.18', portNumber: 9200, serverName: 'UAT Elasticsearch Node' },
  { id: 10, serverIP: '192.168.100.19', portNumber: 5601, serverName: 'UAT Kibana Dashboard' },
  { id: 11, serverIP: '192.168.100.20', portNumber: 3000, serverName: 'UAT Node.js API' },
  { id: 12, serverIP: '192.168.100.21', portNumber: 8000, serverName: 'UAT Django Backend' },
  { id: 13, serverIP: '192.168.100.22', portNumber: 4000, serverName: 'UAT GraphQL Server' },
  { id: 14, serverIP: '192.168.100.23', portNumber: 5000, serverName: 'UAT Flask API' },
  { id: 15, serverIP: '192.168.100.24', portNumber: 8888, serverName: 'UAT Jupyter Notebook' },
  { id: 16, serverIP: '192.168.100.25', portNumber: 9000, serverName: 'UAT Jenkins CI/CD' },
  { id: 17, serverIP: '192.168.100.26', portNumber: 8081, serverName: 'UAT Nexus Repository' },
  { id: 18, serverIP: '192.168.100.27', portNumber: 9090, serverName: 'UAT Prometheus Monitor' },
  { id: 19, serverIP: '192.168.100.28', portNumber: 3001, serverName: 'UAT Grafana Analytics' },
  { id: 20, serverIP: '192.168.100.29', portNumber: 2181, serverName: 'UAT Zookeeper Service' }
];

export const productionServers: Server[] = [
  { id: 1, serverIP: '10.0.1.10', portNumber: 22, serverName: 'PROD Web Server 01' },
  { id: 2, serverIP: '10.0.1.11', portNumber: 80, serverName: 'PROD Database Server' },
  { id: 3, serverIP: '10.0.1.12', portNumber: 443, serverName: 'PROD Mail Server' },
  { id: 4, serverIP: '10.0.1.13', portNumber: 3306, serverName: 'PROD MySQL Primary' },
  { id: 5, serverIP: '10.0.1.14', portNumber: 5432, serverName: 'PROD PostgreSQL Main' },
  { id: 6, serverIP: '10.0.1.15', portNumber: 6379, serverName: 'PROD Redis Cache' },
  { id: 7, serverIP: '10.0.1.16', portNumber: 27017, serverName: 'PROD MongoDB Cluster' },
  { id: 8, serverIP: '10.0.1.17', portNumber: 8080, serverName: 'PROD Application Server' },
  { id: 9, serverIP: '10.0.1.18', portNumber: 9200, serverName: 'PROD Elasticsearch Node' },
  { id: 10, serverIP: '10.0.1.19', portNumber: 5601, serverName: 'PROD Kibana Dashboard' },
  { id: 11, serverIP: '10.0.1.20', portNumber: 3000, serverName: 'PROD Node.js API' },
  { id: 12, serverIP: '10.0.1.21', portNumber: 8000, serverName: 'PROD Django Backend' },
  { id: 13, serverIP: '10.0.1.22', portNumber: 4000, serverName: 'PROD GraphQL Server' },
  { id: 14, serverIP: '10.0.1.23', portNumber: 5000, serverName: 'PROD Flask API' },
  { id: 15, serverIP: '10.0.1.24', portNumber: 8888, serverName: 'PROD Jupyter Notebook' },
  { id: 16, serverIP: '10.0.1.25', portNumber: 9000, serverName: 'PROD Jenkins CI/CD' },
  { id: 17, serverIP: '10.0.1.26', portNumber: 8081, serverName: 'PROD Nexus Repository' },
  { id: 18, serverIP: '10.0.1.27', portNumber: 9090, serverName: 'PROD Prometheus Monitor' },
  { id: 19, serverIP: '10.0.1.28', portNumber: 3001, serverName: 'PROD Grafana Analytics' },
  { id: 20, serverIP: '10.0.1.29', portNumber: 2181, serverName: 'PROD Zookeeper Service' },
  { id: 21, serverIP: '10.0.1.30', portNumber: 9092, serverName: 'PROD Kafka Broker' },
  { id: 22, serverIP: '10.0.1.31', portNumber: 8082, serverName: 'PROD Kafka Connect' },
  { id: 23, serverIP: '10.0.1.32', portNumber: 8083, serverName: 'PROD Schema Registry' },
  { id: 24, serverIP: '10.0.1.33', portNumber: 7000, serverName: 'PROD Cassandra Node' },
  { id: 25, serverIP: '10.0.1.34', portNumber: 8086, serverName: 'PROD InfluxDB Server' },
  { id: 26, serverIP: '10.0.1.35', portNumber: 8888, serverName: 'PROD Chronograf UI' },
  { id: 27, serverIP: '10.0.1.36', portNumber: 8089, serverName: 'PROD Telegraf Agent' },
  { id: 28, serverIP: '10.0.1.37', portNumber: 8125, serverName: 'PROD StatsD Collector' },
  { id: 29, serverIP: '10.0.1.38', portNumber: 9093, serverName: 'PROD Alertmanager' },
  { id: 30, serverIP: '10.0.1.39', portNumber: 9094, serverName: 'PROD Pushgateway' }
];

// Legacy export for backward compatibility
export const servers = productionServers;