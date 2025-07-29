export interface Database {
  public: {
    Tables: {
      servers: {
        Row: {
          id: string;
          server_ip: string;
          port_number: number;
          server_name: string;
          environment: 'UAT' | 'PRODUCTION';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          server_ip: string;
          port_number: number;
          server_name: string;
          environment: 'UAT' | 'PRODUCTION';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          server_ip?: string;
          port_number?: number;
          server_name?: string;
          environment?: 'UAT' | 'PRODUCTION';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type ServerRow = Database['public']['Tables']['servers']['Row'];
export type ServerInsert = Database['public']['Tables']['servers']['Insert'];
export type ServerUpdate = Database['public']['Tables']['servers']['Update'];