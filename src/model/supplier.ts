export interface Supplier {
  id: number;
  pid: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  created_at?: string;
  updated_at?: string | null;
}

export type SupplierInsertPayload = Omit<Supplier, 'id' | 'pid' | 'created_at' | 'updated_at'>;
export type SupplierUpdatePayload = Omit<Supplier, 'pid' | 'created_at' | 'updated_at'>;
