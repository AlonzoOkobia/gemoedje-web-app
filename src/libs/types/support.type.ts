// lib/types.ts

// Individual support message (e.g., from a contact form)
export interface Support {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string; // ISO string
}

// Response for multiple support entries (e.g., paginated list)
export interface SupportResponse {
  data: Support[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Response for a single support entry
export interface SingleSupportResponse {
  data: Support;
}
