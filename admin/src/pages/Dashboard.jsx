import React from 'react';
import AddProductForm from './AddProductForm';

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto my-10 bg-white rounded-xl shadow-2xl p-8">
      <div className="flex gap-4 mb-8 justify-center">
        <button
          className="px-8 py-2.5 rounded-md font-semibold text-lg cursor-pointer bg-gray-900 text-white shadow-lg"
                  >
            Add Items
          </button>
      </div>
      <div>
        <AddProductForm onProductAdded={() => console.log('Product added successfully!')} />
      </div>
    </div>
  );
}
