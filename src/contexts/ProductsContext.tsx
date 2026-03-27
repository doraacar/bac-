import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../lib/database.types';

interface ProductsContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  refreshData: () => Promise<void>;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [{ data: categoriesData, error: catError }, { data: productsData, error: prodError }] = await Promise.all([
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('products').select('*').order('display_order'),
      ]);

      if (catError) throw catError;
      if (prodError) throw prodError;

      if (categoriesData) setCategories(categoriesData);
      if (productsData) setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const addProduct = useCallback((product: Product) => {
    setProducts((current) => [...current, product]);
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts((current) => current.map((p) => (p.id === product.id ? product : p)));
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((current) => current.filter((p) => p.id !== productId));
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        loading,
        refreshData,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
}
