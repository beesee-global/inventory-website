import type { SupplierInsertPayload, SupplierUpdatePayload } from '../../model/supplier';
import axiosClient from '../../axiosClient';

export const getSuppliers = async () => {
  try {
    const response = await axiosClient.get('/supplier');
    return response.data ?? [];
  } catch (error) {
    console.error('Error fetching supplier:', error);
    throw error;
  }
}

export const getSupplierByPid = async (pid: string) => {
  try {
    const response = await axiosClient.get(`/supplier/${pid}`);
    return response.data?.[0] ?? response.data ?? null;
  } catch (error) {
    console.error(`Error fetching supplier with pid ${pid}:`, error);
    throw error;
  }
}

export const insertSupplier = async (supplier: SupplierInsertPayload) => {
  try {
    const response = await axiosClient.post('/supplier', supplier);
    return response.data;
  } catch (error) {
    console.error('Error inserting supplier:', error);
    throw error;
  }
}

export const updateSupplier = async (pid: string, supplier: SupplierUpdatePayload) => {
  try {
    const response = await axiosClient.put(`/supplier/${pid}`, supplier);
    return response.data;
  } catch (error) {
    console.error(`Error updating supplier with pid ${pid}:`, error);
    throw error;
  }
}

export const deleteSupplier = async (pid: string) => {
  try {
    const response = await axiosClient.delete(`/supplier/${pid}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting supplier with pid ${pid}:`, error);
    throw error;
  }
}
