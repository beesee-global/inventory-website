import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AlertDialog from '../../../components/feedback/AlertDialog';
import { userAuth } from '../../../hooks/userAuth';
import type { Product, ProductInsertPayload } from '../../../model/products';
import { getProductByPid, insertProduct, updateProduct, deleteProduct } from '../../../services/MainLayout/products';
import { getCategories } from '../../../services/MainLayout/categories';
import { getSuppliers } from '../../../services/MainLayout/suppliers';

const ProductsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams<{ productId?: string }>();
  const queryClient = useQueryClient();
  const { setSnackBarOpen, setSnackBarType, setSnackBarMessage } = userAuth();

  const baseProductPath = location.pathname.startsWith('/beesee/ecommerce')
    ? '/beesee/ecommerce/product'
    : '/main/product';

  const [formValues, setFormValues] = useState<ProductInsertPayload>({
    name: '',
    sku: '',
    category_id: 0,
    supplier_id: 0,
    cost_price: 0,
    retail_price: 0,
    reorder_level: 0,
    stock_quantity: 0,
    expiry_date: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const {
    data: product,
    error: productError,
  } = useQuery<Product, Error>({
    queryKey: ['product', productId],
    queryFn: () => getProductByPid(productId ?? ''),
    enabled: !!productId,
    retry: false,
  });

  const {
    data: categoriesData,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60,
    retry: false,
  });

  const {
    data: suppliersData,
    error: suppliersError,
  } = useQuery({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
    staleTime: 1000 * 60,
    retry: false,
  });

  const categories = categoriesData ?? [];
  const suppliers = suppliersData ?? [];

  useEffect(() => {
    if (productError) {
      setSnackBarType('error');
      setSnackBarMessage('Unable to load product. Please try again.');
      setSnackBarOpen(true);
      console.error('Product fetch error:', productError);
    }

    if (categoriesError) {
      setSnackBarType('error');
      setSnackBarMessage('Unable to load categories. Please try again.');
      setSnackBarOpen(true);
      console.error('Categories fetch error:', categoriesError);
    }

    if (suppliersError) {
      setSnackBarType('error');
      setSnackBarMessage('Unable to load suppliers. Please try again.');
      setSnackBarOpen(true);
      console.error('Suppliers fetch error:', suppliersError);
    }
  }, [productError, categoriesError, suppliersError, setSnackBarOpen, setSnackBarMessage, setSnackBarType]);

  useEffect(() => {
    if (!productId) {
      setIsEditing(false);
      setFormValues({
        name: '',
        sku: '',
        category_id: 0,
        supplier_id: 0,
        cost_price: 0,
        retail_price: 0,
        reorder_level: 0,
        stock_quantity: 0,
        expiry_date: '',
      });
      return;
    }

    if (product) {
      setIsEditing(true);
      setFormValues({
        name: product.name ?? '',
        sku: product.sku ?? '',
        category_id: product.category_id ?? 0,
        supplier_id: product.supplier_id ?? 0,
        cost_price: product.cost_price ?? 0,
        retail_price: product.retail_price ?? 0,
        reorder_level: product.reorder_level ?? 0,
        stock_quantity: product.stock_quantity ?? 0,
        expiry_date: product.expiry_date ?? '',
      });
    }
  }, [productId, product]);

  const createMutation = useMutation<unknown, Error, ProductInsertPayload>({
    mutationFn: (payload) => insertProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setSnackBarType('success');
      setSnackBarMessage('Product created successfully.');
      setSnackBarOpen(true);
      navigate(baseProductPath);
    },
    onError: (error) => {
      const message = error.message || 'Unable to create product.';
      setSnackBarType('error');
      setSnackBarMessage(message);
      setSnackBarOpen(true);
      console.error('Create product error:', error);
    },
  });

  const updateMutation = useMutation<unknown, Error, { id: number; payload: Product }>(
    {
      mutationFn: ({ id, payload }) => updateProduct(String(id), payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        setSnackBarType('success');
        setSnackBarMessage('Product updated successfully.');
        setSnackBarOpen(true);
        navigate(baseProductPath);
      },
      onError: (error) => {
        const message = error.message || 'Unable to update product.';
        setSnackBarType('error');
        setSnackBarMessage(message);
        setSnackBarOpen(true);
        console.error('Update product error:', error);
      },
    }
  );

  const deleteMutation = useMutation<unknown, Error, number>({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setSnackBarType('success');
      setSnackBarMessage('Product deleted successfully.');
      setSnackBarOpen(true);
      navigate(baseProductPath);
    },
    onError: (error) => {
      const message = error.message || 'Unable to delete product.';
      setSnackBarType('error');
      setSnackBarMessage(message);
      setSnackBarOpen(true);
      console.error('Delete product error:', error);
    },
  });

  const numberFields = [
    'category_id',
    'supplier_id',
    'cost_price',
    'retail_price',
    'reorder_level',
    'stock_quantity',
  ] as const;

  const handleFieldChange = (field: keyof ProductInsertPayload, value: string) => {
    const parsedValue = numberFields.includes(field as any) ? Number(value) : value;
    setFormValues((prev) => ({ ...prev, [field]: parsedValue }));
  };

  const validateForm = () => {
    if (!formValues.name || !formValues.name.trim()) {
      setSnackBarType('error');
      setSnackBarMessage('Product name is required.');
      setSnackBarOpen(true);
      return false;
    }

    if (!formValues.sku || !formValues.sku.trim()) {
      setSnackBarType('error');
      setSnackBarMessage('Product SKU is required.');
      setSnackBarOpen(true);
      return false;
    }

    if (formValues.cost_price < 0 || formValues.retail_price < 0 || formValues.stock_quantity < 0) {
      setSnackBarType('error');
      setSnackBarMessage('Price and stock values must be zero or greater.');
      setSnackBarOpen(true);
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isEditing && product) {
      updateMutation.mutate({ id: product.id, payload: { ...formValues, id: product.id } });
      return;
    }

    createMutation.mutate(formValues);
  };

  const handleReset = () => {
    setFormValues({
      name: '',
      sku: '',
      category_id: 0,
      supplier_id: 0,
      cost_price: 0,
      retail_price: 0,
      reorder_level: 0,
      stock_quantity: 0,
      expiry_date: '',
    });
    navigate(`${baseProductPath}/form`);
  };

  const handleDelete = () => {
    if (!isEditing || !product) {
      setSnackBarType('error');
      setSnackBarMessage('Select a product before deleting.');
      setSnackBarOpen(true);
      return;
    }

    setDialogTitle('Confirm Delete');
    setDialogMessage('Are you sure you want to delete this product? This action cannot be undone.');
    setAlertDialogOpen(true);
  };

  const handleDialogClose = () => {
    setAlertDialogOpen(false);
  };

  const handleDialogSubmit = () => {
    if (product) {
      deleteMutation.mutate(product.id);
    }
    setAlertDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {isEditing ? 'Edit Product' : 'Create Product'}
            </h1>
            <p className="text-sm text-slate-500">
              {isEditing ? 'Update this product or reset the form to create a new one.' : 'Create a new product record.'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(baseProductPath)}
              className="rounded-lg border border-gray-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Name <span className="text-red-500">*</span></span>
            <input
              value={formValues.name}
              onChange={(event) => handleFieldChange('name', event.target.value)}
              placeholder="Enter product name"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>SKU <span className="text-red-500">*</span></span>
            <input
              value={formValues.sku}
              onChange={(event) => handleFieldChange('sku', event.target.value)}
              placeholder="Enter product SKU"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Category</span>
            <select
              value={formValues.category_id}
              onChange={(event) => handleFieldChange('category_id', event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value={0}>Select category</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Supplier</span>
            <select
              value={formValues.supplier_id}
              onChange={(event) => handleFieldChange('supplier_id', event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value={0}>Select supplier</option>
              {suppliers.map((supplier: any) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Cost Price</span>
            <input
              type="number"
              value={formValues.cost_price}
              onChange={(event) => handleFieldChange('cost_price', event.target.value)}
              placeholder="Enter cost price"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Retail Price</span>
            <input
              type="number"
              value={formValues.retail_price}
              onChange={(event) => handleFieldChange('retail_price', event.target.value)}
              placeholder="Enter retail price"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Reorder Level</span>
            <input
              type="number"
              value={formValues.reorder_level}
              onChange={(event) => handleFieldChange('reorder_level', event.target.value)}
              placeholder="Enter reorder level"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Stock Quantity</span>
            <input
              type="number"
              value={formValues.stock_quantity}
              onChange={(event) => handleFieldChange('stock_quantity', event.target.value)}
              placeholder="Enter stock quantity"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Expiry Date</span>
            <input
              type="date"
              value={formValues.expiry_date}
              onChange={(event) => handleFieldChange('expiry_date', event.target.value)}
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
            {(createMutation.status === 'pending' || updateMutation.status === 'pending') ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
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

export default ProductsForm;
