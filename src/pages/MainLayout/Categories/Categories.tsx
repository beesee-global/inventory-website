import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategoriesSortedByName } from '../../../services/Technician/categoryServices';
import CategoryTable from '../../../components/DataDisplay/CategoryTable';

const Categories = () => { 

  return (
    <div>
      <h1 className='text-black'>Categories</h1> 
    </div>
  );
};

export default Categories;
