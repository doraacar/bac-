import { useState } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight, ArrowLeft, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { useProducts } from '../contexts/ProductsContext';
import { AdminProductForm } from './AdminProductForm';
import type { Product } from '../lib/database.types';

interface AdminPanelProps {
  onBackToShop: () => void;
  onLogout: () => void;
}

export function AdminPanel({ onBackToShop, onLogout }: AdminPanelProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { showToast } = useToast();
  const { products, categories, loading, updateProduct, deleteProduct: removeProduct, addProduct } = useProducts();

  async function handleDeleteProduct(id: string) {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;

      removeProduct(id);
      showToast('Ürün silindi', 'success');
    } catch (error) {
      showToast('Silme işlemi başarısız', 'error');
      console.error('Error deleting product:', error);
    }
  }

  async function handleToggleStock(product: Product) {
    try {
      const updatedProduct = { ...product, in_stock: !product.in_stock };

      const { error } = await supabase
        .from('products')
        .update({ in_stock: updatedProduct.in_stock })
        .eq('id', product.id);

      if (error) throw error;

      updateProduct(updatedProduct);
      showToast(
        `Stok durumu güncellendi: ${updatedProduct.in_stock ? 'Stokta Var' : 'Stokta Yok'}`,
        'success'
      );
    } catch (error) {
      showToast('Güncelleme başarısız', 'error');
      console.error('Error updating stock:', error);
    }
  }

  function getCategoryName(categoryId: string | null) {
    if (!categoryId) return 'Kategori Yok';
    return categories.find((c) => c.id === categoryId)?.name_tr || 'Bilinmeyen';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-cream to-olive/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-olive border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-cream to-olive/5">
      <header className="bg-olive text-cream py-6 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Yönetici Paneli</h1>
            <p className="text-cream/80 text-sm">BACI ORGANİK ÜRÜNLER</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBackToShop}
              className="flex items-center gap-2 bg-cream/20 hover:bg-cream/30 text-cream font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Geri Dön
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Çıkış
            </motion.button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-olive mb-1">
              Ürün Yönetimi
            </h2>
            <p className="text-olive/60">
              Toplam {products.length} ürün
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="bg-olive hover:bg-olive/90 text-cream font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Yeni Ürün Ekle
          </motion.button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border-2 border-olive/20">
            <p className="text-olive/60 text-lg mb-4">Henüz ürün eklenmemiş</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}
              className="bg-olive hover:bg-olive/90 text-cream font-semibold px-6 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              İlk Ürünü Ekleyin
            </motion.button>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6 border-2 border-olive/10 hover:border-olive/30 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start mb-4">
                  {product.image_url && (
                    <div className="flex items-center justify-center bg-olive/5 rounded-lg p-4 max-h-32">
                      <img
                        src={product.image_url}
                        alt={product.name_tr}
                        className="max-h-28 max-w-full object-contain"
                      />
                    </div>
                  )}

                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-olive">
                          {product.name_tr}
                        </h3>
                        <p className="text-sm text-olive/60">
                          {getCategoryName(product.category_id)}
                        </p>
                      </div>
                      {product.featured && (
                        <span className="bg-terracotta text-cream px-2 py-1 rounded text-xs font-semibold">
                          Öne Çıkan
                        </span>
                      )}
                    </div>

                    {product.description_tr && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {product.description_tr}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-bold text-olive">
                        {product.price.toFixed(2)}₺ / {product.unit}
                      </span>
                      <span
                        className={`font-semibold px-3 py-1 rounded-full text-xs ${
                          product.in_stock
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.in_stock ? 'Stokta Var' : 'Stokta Yok'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleStock(product)}
                      className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      {product.in_stock ? (
                        <>
                          <ToggleRight className="w-4 h-4" />
                          <span className="text-sm">Devre Dışı</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          <span className="text-sm">Etkinleştir</span>
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingProduct(product);
                        setIsFormOpen(true);
                      }}
                      className="bg-olive/10 hover:bg-olive/20 text-olive font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      Düzenle
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Sil</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {isFormOpen && (
          <AdminProductForm
            product={editingProduct}
            categories={categories}
            onClose={() => setIsFormOpen(false)}
            onSave={(savedProduct) => {
              if (editingProduct) {
                updateProduct(savedProduct);
                showToast('Ürün güncellendi', 'success');
              } else {
                addProduct(savedProduct);
                showToast('Ürün eklendi', 'success');
              }
              setEditingProduct(null);
              setIsFormOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
