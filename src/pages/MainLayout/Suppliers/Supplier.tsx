import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import TableDefault from '../../../components/DataDisplay/TableDefault';
import { userAuth } from '../../../hooks/userAuth';
import type { Supplier } from '../../../model/supplier';
import { getSuppliers } from '../../../services/MainLayout/suppliers';

const Supplier = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSnackBarOpen, setSnackBarType, setSnackBarMessage } = userAuth();

  const baseSupplierPath = location.pathname.startsWith('/beesee/ecommerce')
    ? '/beesee/ecommerce/supplier'
    : '/main/supplier';

  const { data, isLoading, error: queryError } = useQuery<Supplier[], Error>({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
    staleTime: 1000 * 60,
    retry: false,
  });

  const suppliers = data ?? [];

  useEffect(() => {
    if (queryError) {
      setSnackBarType('error');
      setSnackBarMessage('Unable to load suppliers. Please try again.');
      setSnackBarOpen(true);
      console.error('Suppliers query error:', queryError);
    }
  }, [queryError, setSnackBarOpen, setSnackBarMessage, setSnackBarType]);

  const handleSelectRow = (row: any) => {
    const supplierRow = row as Supplier;
    navigate(`${baseSupplierPath}/form/${supplierRow.pid}`);
  };

  const handleAddSupplier = () => {
    navigate(`${baseSupplierPath}/form`);
  };

  const columns = useMemo(
    () => [
      { id: 'name', label: 'Name', sortable: true, width: 'flex-1', align: 'left' },
      { id: 'contact_person', label: 'Contact Person', sortable: true, width: 'flex-1', align: 'left' },
      { id: 'phone', label: 'Phone', sortable: false, width: 'flex-1', align: 'left' },
      { id: 'email', label: 'Email', sortable: false, width: 'flex-1', align: 'left' },
      { id: 'address', label: 'Address', sortable: false, width: 'flex-1', align: 'left' },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Suppliers</h1>
            <p className="text-sm text-slate-500">View all suppliers and open the supplier form for add/edit.</p>
          </div>
          <div>
            <button
              type="button"
              onClick={handleAddSupplier}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Add Supplier
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Supplier List</h2>
            <p className="text-sm text-slate-500">Click a row to open the supplier form for editing.</p>
          </div>
          <div className="text-sm text-slate-500">
            {suppliers.length} item{suppliers.length === 1 ? '' : 's'}
          </div>
        </div>

        <TableDefault
          rows={suppliers}
          columns={columns}
          onRowClick={(row) => handleSelectRow(row)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Supplier;
