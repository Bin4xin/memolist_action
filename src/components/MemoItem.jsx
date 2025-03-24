// src/components/MemoItem.jsx
import React from 'react';

function MemoItem({ memo }) {
  const { title, description, status, createdAt } = memo;
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Created: {new Date(createdAt).toLocaleDateString()}
            </span>
            <span 
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemoItem;