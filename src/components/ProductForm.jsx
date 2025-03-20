
import { useState } from 'react';
import { X } from 'lucide-react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [name, setName] = useState(product?.name || '');
  const [quantity, setQuantity] = useState(product?.quantity || '');
  const [price, setPrice] = useState(product?.price || '');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(quantity) || parseInt(quantity) < 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    
    if (!price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(price) || parseFloat(price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await onSubmit({
        name,
        quantity: parseInt(quantity),
        price: parseFloat(price),
      });
      
      // Reset form if it's a new product (not editing)
      if (!product) {
        setName('');
        setQuantity('');
        setPrice('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">
          {product ? 'Edit Product' : 'New Product'}
        </h3>
        <button 
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter product name"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
            errors.quantity ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter quantity"
          min="0"
        />
        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
      </div>
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Price ($)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
            errors.price ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter price"
          min="0.01"
          step="0.01"
        />
        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
      </div>
      
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-2 hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
            loading ? 'opacity-70' : ''
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            <span>Save Product</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
