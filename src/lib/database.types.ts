export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name_tr: string;
          slug: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_tr: string;
          slug: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name_tr?: string;
          slug?: string;
          display_order?: number;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name_tr: string;
          description_tr: string;
          price: number;
          unit: string;
          image_url: string;
          in_stock: boolean;
          featured: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name_tr: string;
          description_tr?: string;
          price: number;
          unit?: string;
          image_url?: string;
          in_stock?: boolean;
          featured?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name_tr?: string;
          description_tr?: string;
          price?: number;
          unit?: string;
          image_url?: string;
          in_stock?: boolean;
          featured?: boolean;
          display_order?: number;
          created_at?: string;
        };
      };
    };
  };
}

export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
