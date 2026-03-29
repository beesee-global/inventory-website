export interface Category {
  id: number;
  pid: string;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export type CategoryInsertPayload = Omit<Category, 'id' | 'pid' | 'created_at' | 'updated_at'>;
export type CategoryUpdatePayload = Omit<Category, 'pid' | 'created_at' | 'updated_at'>;
