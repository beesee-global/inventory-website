import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import TableDefault from '../../../components/DataDisplay/TableDefault';
import { userAuth } from '../../../hooks/userAuth';
import type { Product } from '../../../model/products';
import { getProducts } from '../../../services/MainLayout/products';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSnackBarOpen, setSnackBarType, setSnackBarMessage } = userAuth();

  const baseProductPath = location.pathname.startsWith('/beesee/ecommerce')
    ? '/beesee/ecommerce/product'
    : '/main/product';

  const { data, isLoading, error: queryError } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 1000 * 60,
    retry: false,
  });

  const products = data ?? [];

  useEffect(() => {
    if (queryError) {
      setSnackBarType('error');
      setSnackBarMessage('Unable to load products. Please try again.');
      setSnackBarOpen(true);
      console.error('Products query error:', queryError);
    }
  }, [queryError, setSnackBarOpen, setSnackBarMessage, setSnackBarType]);

  const handleSelectRow = (row: any) => {
    const productRow = row as Product;
    navigate(`${baseProductPath}/form/${productRow.id}`);
  };

  const handleAddProduct = () => {
    navigate(`${baseProductPath}/form`);
  };

  const columns = useMemo(
    () => [
      { id: 'name', label: 'Name', sortable: true, width: 'flex-1', align: 'left' },
      { id: 'sku', label: 'SKU', sortable: true, width: 'flex-1', align: 'left' },
      { id: 'stock_quantity', label: 'Stock', sortable: true, width: 'w-28', align: 'right' },
      { id: 'expiry_date', label: 'Expiry Date', sortable: true, width: 'w-32', align: 'left' },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
            <p className="text-sm text-slate-500">View all products and open the product form for add/edit.</p>
          </div>
          <div>
            <button
              type="button"
              onClick={handleAddProduct}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Product List</h2>
            <p className="text-sm text-slate-500">Click a row to open the product form for editing.</p>
          </div>
          <div className="text-sm text-slate-500">
            {products.length} item{products.length === 1 ? '' : 's'}
          </div>
        </div>

        <TableDefault
          rows={products}
          columns={columns}
          onRowClick={(row) => handleSelectRow(row)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Products;
