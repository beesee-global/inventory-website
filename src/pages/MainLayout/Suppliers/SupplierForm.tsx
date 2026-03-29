import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AlertDialog from '../../../components/feedback/AlertDialog';
import { userAuth } from '../../../hooks/userAuth';
import type { Supplier, SupplierInsertPayload } from '../../../model/supplier';
import { getSupplierByPid, insertSupplier, updateSupplier, deleteSupplier } from '../../../services/MainLayout/suppliers';

const SupplierForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { supplierId } = useParams<{ supplierId?: string }>();
  const queryClient = useQueryClient();
  const { setSnackBarOpen, setSnackBarType, setSnackBarMessage } = userAuth();

  const baseSupplierPath = location.pathname.startsWith('/beesee/ecommerce')
    ? '/beesee/ecommerce/supplier'
    : '/main/supplier';

  const [formValues, setFormValues] = useState<SupplierInsertPayload>({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const { data: supplier, error: supplierError } = useQuery<Supplier, Error>({
    queryKey: ['supplier', supplierId],
    queryFn: () => getSupplierByPid(supplierId ?? ''),
    enabled: !!supplierId,
    retry: false,
  });

  useEffect(() => {
    if (supplierError) {
      setSnackBarType('error');
      setSnackBarMessage('Unable to load supplier. Please try again.');
      setSnackBarOpen(true);
      console.error('Supplier fetch error:', supplierError);
    }
  }, [supplierError, setSnackBarOpen, setSnackBarMessage, setSnackBarType]);

  useEffect(() => {
    if (!supplierId) {
      setIsEditing(false);
      setFormValues({ name: '', contact_person: '', phone: '', email: '', address: '' });
      return;
    }

    if (supplier) {
      setIsEditing(true);
      setFormValues({
        name: supplier.name ?? '',
        contact_person: supplier.contact_person ?? '',
        phone: supplier.phone ?? '',
        email: supplier.email ?? '',
        address: supplier.address ?? '',
      });
    }
  }, [supplierId, supplier]);

  const createMutation = useMutation<unknown, Error, SupplierInsertPayload>({
    mutationFn: (payload) => insertSupplier(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setSnackBarType('success');
      setSnackBarMessage('Supplier created successfully.');
      setSnackBarOpen(true);
      navigate(baseSupplierPath);
    },
    onError: (error) => {
      const message = error.message || 'Unable to create supplier.';
      setSnackBarType('error');
      setSnackBarMessage(message);
      setSnackBarOpen(true);
      console.error('Create supplier error:', error);
    },
  });

  const updateMutation = useMutation<unknown, Error, { id: number; payload: SupplierInsertPayload }>({
    mutationFn: ({ id, payload }) => updateSupplier(String(id), { ...payload, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setSnackBarType('success');
      setSnackBarMessage('Supplier updated successfully.');
      setSnackBarOpen(true);
      navigate(baseSupplierPath);
    },
    onError: (error) => {
      const message = error.message || 'Unable to update supplier.';
      setSnackBarType('error');
      setSnackBarMessage(message);
      setSnackBarOpen(true);
      console.error('Update supplier error:', error);
    },
  });

  const deleteMutation = useMutation<unknown, Error, number>({
    mutationFn: (id) => deleteSupplier(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setSnackBarType('success');
      setSnackBarMessage('Supplier deleted successfully.');
      setSnackBarOpen(true);
      navigate(baseSupplierPath);
    },
    onError: (error) => {
      const message = error.message || 'Unable to delete supplier.';
      setSnackBarType('error');
      setSnackBarMessage(message);
      setSnackBarOpen(true);
      console.error('Delete supplier error:', error);
    },
  });

  const handleFieldChange = (field: keyof SupplierInsertPayload, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formValues.name || !formValues.name.trim()) {
      setSnackBarType('error');
      setSnackBarMessage('Supplier name is required.');
      setSnackBarOpen(true);
      return false;
    }

    if (formValues.name.trim().length < 2) {
      setSnackBarType('error');
      setSnackBarMessage('Supplier name must be at least 2 characters.');
      setSnackBarOpen(true);
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isEditing && supplier) {
      updateMutation.mutate({ id: supplier.id, payload: formValues });
      return;
    }

    createMutation.mutate(formValues);
  };

  const handleReset = () => {
    setFormValues({ name: '', contact_person: '', phone: '', email: '', address: '' });
    navigate(`${baseSupplierPath}/form`);
  };

  const handleDelete = () => {
    if (!isEditing || !supplier) {
      setSnackBarType('error');
      setSnackBarMessage('Select a supplier before deleting.');
      setSnackBarOpen(true);
      return;
    }

    setDialogTitle('Confirm Delete');
    setDialogMessage('Are you sure you want to delete this supplier? This action cannot be undone.');
    setAlertDialogOpen(true);
  };

  const handleDialogClose = () => {
    setAlertDialogOpen(false);
  };

  const handleDialogSubmit = () => {
    if (supplier) {
      deleteMutation.mutate(supplier.id);
    }
    setAlertDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {isEditing ? 'Edit Supplier' : 'Create Supplier'}
            </h1>
            <p className="text-sm text-slate-500">
              {isEditing ? 'Update this supplier or reset the form to create a new one.' : 'Create a new supplier record.'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(baseSupplierPath)}
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
              placeholder="Enter supplier name"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Contact Person</span>
            <input
              value={formValues.contact_person}
              onChange={(event) => handleFieldChange('contact_person', event.target.value)}
              placeholder="Enter contact person"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Phone</span>
            <input
              value={formValues.phone}
              onChange={(event) => handleFieldChange('phone', event.target.value)}
              placeholder="Enter phone number"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Email</span>
            <input
              value={formValues.email}
              onChange={(event) => handleFieldChange('email', event.target.value)}
              placeholder="Enter email address"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Address</span>
            <input
              value={formValues.address}
              onChange={(event) => handleFieldChange('address', event.target.value)}
              placeholder="Enter address"
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
            {(createMutation.status === 'pending' || updateMutation.status === 'pending') ? 'Saving...' : isEditing ? 'Update Supplier' : 'Create Supplier'}
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

export default SupplierForm;
