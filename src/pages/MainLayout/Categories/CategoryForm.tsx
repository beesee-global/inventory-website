import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; 
import AlertDialog from '../../../components/feedback/AlertDialog';
import { userAuth } from '../../../hooks/userAuth';
import type { Category, CategoryInsertPayload } from '../../../model/categories';
import { getCategoryByPid, insertCategory, updateCategory, deleteCategory } from '../../../services/MainLayout/categories';

const CategoryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = useParams<{ categoryId?: string }>();
  const queryClient = useQueryClient();
  const { setSnackBarOpen, setSnackBarType, setSnackBarMessage } = userAuth();

  const baseCategoryPath = location.pathname.startsWith('/beesee/ecommerce')
    ? '/beesee/ecommerce/category'
    : '/main/category';

  const [formValues, setFormValues] = useState<CategoryInsertPayload>({
    name: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const {
    data: category,
    error: categoryError,
  } = useQuery<Category, Error>({
    queryKey: ['category', categoryId],
    queryFn: () => getCategoryByPid(categoryId ?? ''),
    enabled: !!categoryId,
    retry: false,
  });

  useEffect(() => {
    if (categoryError) {
      setSnackBarType('error');
      setSnackBarMessage('Unable to load category. Please try again.');
      setSnackBarOpen(true);
      console.error('Category fetch error:', categoryError);
    }
  }, [categoryError, setSnackBarOpen, setSnackBarMessage, setSnackBarType]);

  useEffect(() => {
    if (!categoryId) {
      setIsEditing(false);
      setFormValues({ name: '', description: '' });
      return;
    }

    if (category) {
      setIsEditing(true);
      setFormValues({ name: category.name ?? '', description: category.description ?? '' });
    }
  }, [categoryId, category]);

  const createMutation = useMutation<unknown, Error, CategoryInsertPayload>({
    mutationFn: (payload) => insertCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setSnackBarType('success');
      setSnackBarMessage('Category created successfully.');
      setSnackBarOpen(true);
      navigate(baseCategoryPath);
    },
    onError: (error) => {
      const message = error.message || 'Unable to create category.';
      setSnackBarType('error');
      setSnackBarMessage(message);
      setSnackBarOpen(true);
      console.error('Create category error:', error);
    },
  });

  const updateMutation = useMutation<unknown, Error, { id: number; payload: CategoryInsertPayload }>({
    mutationFn: ({ id, payload }) => updateCategory(String(id), { ...payload, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setSnackBarType('success');
      setSnackBarMessage('Category updated successfully.');
      setSnackBarOpen(true);
      navigate(baseCategoryPath);
    },
    onError: (error) => {
      const message = error.message || 'Unable to update category.';
      setSnackBarType('error');
      setSnackBarMessage(message);
      setSnackBarOpen(true);
      console.error('Update category error:', error);
    },
  });

  const deleteMutation = useMutation<unknown, Error, number>({
    mutationFn: (id) => deleteCategory(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setSnackBarType('success');
      setSnackBarMessage('Category deleted successfully.');
      setSnackBarOpen(true);
      navigate(baseCategoryPath);
    },
    onError: (error) => {
      const message = error.message || 'Unable to delete category.';
      setSnackBarType('error');
      setSnackBarMessage(message);
      setSnackBarOpen(true);
      console.error('Delete category error:', error);
    },
  });

  const handleFieldChange = (field: keyof CategoryInsertPayload, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formValues.name || !formValues.name.trim()) {
      setSnackBarType('error');
      setSnackBarMessage('Category name is required.');
      setSnackBarOpen(true);
      return false;
    }

    if (formValues.name.trim().length < 2) {
      setSnackBarType('error');
      setSnackBarMessage('Category name must be at least 2 characters.');
      setSnackBarOpen(true);
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isEditing && category) {
      updateMutation.mutate({ id: category.id, payload: formValues });
      return;
    }

    createMutation.mutate(formValues);
  };

  const handleReset = () => {
    setFormValues({ name: '', description: '' });
    navigate(`${baseCategoryPath}/form`);
  };

  const handleDelete = () => {
    if (!isEditing || !category) {
      setSnackBarType('error');
      setSnackBarMessage('Select a category before deleting.');
      setSnackBarOpen(true);
      return;
    }

    setDialogTitle('Confirm Delete');
    setDialogMessage('Are you sure you want to delete this category? This action cannot be undone.');
    setAlertDialogOpen(true);
  };

  const handleDialogClose = () => {
    setAlertDialogOpen(false);
  };

  const handleDialogSubmit = () => {
    if (category) {
      deleteMutation.mutate(category.id);
    }
    setAlertDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {isEditing ? 'Edit Category' : 'Create Category'}
            </h1>
            <p className="text-sm text-slate-500">
              {isEditing ? 'Update this category or reset the form to create a new one.' : 'Create a new category record.'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(baseCategoryPath)}
              className="rounded-lg border border-gray-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-1">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Name <span className="text-red-500">*</span></span>
            <input
              value={formValues.name}
              onChange={(event) => handleFieldChange('name', event.target.value)}
              placeholder="Enter category name"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Description</span>
            <input
              value={formValues.description ?? ''}
              onChange={(event) => handleFieldChange('description', event.target.value)}
              placeholder="Enter optional description"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={createMutation.status === 'pending' || updateMutation.status === 'pending'}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {(createMutation.status === 'pending' || updateMutation.status === 'pending') ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-gray-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Reset
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          )}

          <p className="text-sm text-slate-500">
            Required fields are marked with <span className="text-red-500">*</span>.
          </p>
        </div>
      </section>

      <AlertDialog
        open={alertDialogOpen}
        title={dialogTitle}
        message={dialogMessage}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        isLoading={deleteMutation.status === 'pending'}
      />
    </div>
  );
};

export default CategoryForm;
