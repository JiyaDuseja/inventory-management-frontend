
// export default Dashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "../hooks/use-toast";
import { Loader2, Plus, Trash2, RefreshCw, LogOut, Edit } from 'lucide-react';
import ProductForm from '../components/ProductForm';

const Dashboard = () => {
  const { token, userId, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', price: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://inventory-management-two-tau.vercel.app/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      // Filter products to only show ones created by the current user
      const userProducts = data.filter(product => product.createdBy === userId);
      setProducts(userProducts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchProducts();
    }
  }, [token, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://inventory-management-two-tau.vercel.app/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      toast({
        title: "Success",
        description: "Product added successfully!",
      });
      
      // Reset form and refresh products
      setNewProduct({ name: '', quantity: '', price: '' });
      setShowAddForm(false);
      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (productId, updatedData) => {
    try {
      const response = await fetch(`https://inventory-management-two-tau.vercel.app/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
      
      // Close edit form and refresh products
      setShowEditForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`https://inventory-management-two-tau.vercel.app/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
      
      // Refresh products
      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowEditForm(true);
    setShowAddForm(false); // Close add form if open
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Product Management Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut size={16} />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button 
              onClick={() => {
                setShowAddForm(!showAddForm);
                setShowEditForm(false);
                setEditingProduct(null);
              }} 
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              {showAddForm ? 'Cancel' : 'Add Product'}
            </Button>
            <Button 
              variant="outline" 
              onClick={fetchProducts}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Inventory Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{products.length} Products</p>
          </CardContent>
        </Card>
      </div>

      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Product Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-1">
                    Price ($)
                  </label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Plus size={16} />
                  Add Product
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {showEditForm && editingProduct && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Edit Product</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              product={editingProduct}
              onSubmit={(updatedData) => handleUpdateProduct(editingProduct.id, updatedData)}
              onCancel={() => {
                setShowEditForm(false);
                setEditingProduct(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Products List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No products found. Add your first product to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Quantity</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">{product.quantity}</td>
                      <td className="py-3 px-4">${parseFloat(product.price).toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(product)}
                            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
