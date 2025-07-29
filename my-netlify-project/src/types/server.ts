export interface Server {
  id: number;
  serverIP: string;
  portNumber: number;
  serverName: string;
  dbId?: string; // UUID from database
}