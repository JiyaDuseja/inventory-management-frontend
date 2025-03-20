
import React from 'react';
import { Package } from 'lucide-react';

const ProductList = ({ products, loading, onSelectProduct, selectedProductId }) => {
  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6 animate-pulse">
        {[1, 2, 3].map((item) => (
          <div 
            key={item} 
            className="mb-3 p-4 border border-gray-100 rounded-lg bg-white bg-opacity-50"
          >
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="glass-card rounded-xl p-10 text-center">
        <Package size={36} className="mx-auto mb-3 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-500">No products yet</h3>
        <p className="text-gray-400 text-sm mt-1">Add your first product to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onSelectProduct(product)}
          className={`product-card p-4 rounded-xl cursor-pointer transition-all
            ${selectedProductId === product.id 
              ? 'border-blue-200 bg-blue-50 shadow-md' 
              : 'border border-gray-100 bg-white hover:border-blue-100 hover:bg-blue-50'
            }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <div className="mt-1 flex items-baseline">
                <span className="text-gray-600 text-sm mr-3">
                  Price: ${parseFloat(product.price).toFixed(2)}
                </span>
                <span className="text-gray-500 text-sm">
                  Qty: {product.quantity}
                </span>
              </div>
            </div>
            <span 
              className="inline-flex items-center justify-center rounded-full p-2 bg-white"
            >
              <Package size={16} className="text-blue-500" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
