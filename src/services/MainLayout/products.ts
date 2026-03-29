import type { ProductInsertPayload, ProductUpdatePayload } from '../../model/products';
import axiosClient from '../../axiosClient';

export const getProducts = async () => {
  try {
    const response = await axiosClient.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export const getProductByPid = async (pid: string) => {
  try {
    const response = await axiosClient.get(`/products/${pid}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with pid ${pid}:`, error);
    throw error;
  }
}

export const insertProduct = async (product: ProductInsertPayload) => {
  try {
    const response = await axiosClient.post('/products', product);
    return response.data;
  } catch (error) {
    console.error('Error inserting product:', error);
    throw error;
  }
}

export const updateProduct = async (pid: string, product: ProductUpdatePayload) => {
  try {
    const response = await axiosClient.put(`/products/${pid}`, product);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with pid ${pid}:`, error);
    throw error;
  }
}

export const deleteProduct = async (id: number) => {
  try {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
}
