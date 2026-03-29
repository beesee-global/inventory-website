import type { CategoryInsertPayload, CategoryUpdatePayload } from '../../model/categories';
import axiosClient from '../../axiosClient';

export const getCategories = async () => {
  try {
    const response = await axiosClient.get('/categories');
    return response.data ?? [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export const getCategoryByPid = async (pid: string) => {
  try {
    const response = await axiosClient.get(`/categories/${pid}`);
    return response.data?.[0] ?? null;
  } catch (error) {
    console.error(`Error fetching category with pid ${pid}:`, error);
    throw error;
  }
} 

export const insertCategory = async (category: CategoryInsertPayload) => {
  try {
    const response = await axiosClient.post('/categories', category);
    return response.data;
  } catch (error) {
    console.error('Error inserting category:', error);
    throw error;
  }
} 

export const updateCategory = async (pid: string, category: CategoryUpdatePayload) => {
  try {
    const response = await axiosClient.put(`/categories/${pid}`, category);
    return response.data;
  } catch (error) {
    console.error(`Error updating category with pid ${pid}:`, error);
    throw error;
  }
}

export const deleteCategory = async (id: string) => {
  try {
    const response = await axiosClient.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    throw error;
  }
}