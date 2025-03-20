
import { useState } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import ProductForm from './ProductForm';

const ProductDetails = ({ product, onUpdate, onDelete, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleDelete = () => {
    onDelete(product.id);
  };
  
  const handleUpdate = (updatedData) => {
    onUpdate(product.id, updatedData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="animate-fade-in">
        <ProductForm 
          product={product} 
          onSubmit={handleUpdate} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Product Details</h2>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Product Name</h3>
          <p className="text-lg">{product.name}</p>
        </div>
        
        <div className="flex space-x-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Price</h3>
            <p className="text-lg">${parseFloat(product.price).toFixed(2)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
            <p className="text-lg">{product.quantity}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Created By</h3>
          <p className="text-sm">{product.createdBy || 'Unknown'}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
          <p className="text-sm">
            {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>
      
      <div className="border-t border-gray-200 mt-6 pt-4 flex justify-between">
        {!showDeleteConfirm ? (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center text-sm"
            >
              <Edit size={14} className="mr-1" />
              Edit
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center text-sm"
            >
              <Trash2 size={14} className="mr-1" />
              Delete
            </button>
          </div>
        ) : (
          <div className="animate-fade-in w-full">
            <p className="text-sm text-red-600 mb-2">Are you sure you want to delete this product?</p>
            <div className="flex space-x-2">
              <button
                onClick={handleDelete}
                className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm"
              >
                Yes, delete
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
