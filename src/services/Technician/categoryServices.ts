import axiosClient from '../../axiosClient';

export const fetchCategoriesSortedByName = async () => {
  return axiosClient.get('/categories');
};

export const fetchCategoryById = async (id: number) => {
  return axiosClient.get(`/categories/${id}`);
};

export const createCategory = async (data: any) => {
  return axiosClient.post('/categories', data);
};

export const updateCategory = async (id: number, data: any) => {
  return axiosClient.put(`/categories/${id}`, data);
};

export const deleteCategory = async (id: number) => {
  return axiosClient.delete(`/categories/${id}`);
};