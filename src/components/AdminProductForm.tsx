import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import type { Product, Category } from '../lib/database.types';

interface AdminProductFormProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (product: Product) => void;
}

export function AdminProductForm({
  product,
  categories,
  onClose,
  onSave,
}: AdminProductFormProps) {
  const [formData, setFormData] = useState({
    name_tr: product?.name_tr || '',
    description_tr: product?.description_tr || '',
    category_id: product?.category_id || (categories[0]?.id || ''),
    price: product?.price || 0,
    unit: product?.unit || 'adet',
    image_url: product?.image_url || '',
    featured: product?.featured || false,
    in_stock: product?.in_stock !== false,
  });

  const [imagePreview, setImagePreview] = useState<string>(product?.image_url || '');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData({ ...formData, image_url: base64 });
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  }

  function handleImageUrlChange(url: string) {
    if (url.trim()) {
      setFormData({ ...formData, image_url: url });
      setImagePreview(url);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name_tr.trim()) {
      showToast('Ürün adı gerekli', 'error');
      return;
    }

    if (formData.price <= 0) {
      showToast('Fiyat 0 dan büyük olmalı', 'error');
      return;
    }

    setLoading(true);

    try {
      const data = {
        name_tr: formData.name_tr.trim(),
        description_tr: formData.description_tr.trim(),
        category_id: formData.category_id || null,
        price: parseFloat(formData.price.toString()),
        unit: formData.unit.trim(),
        image_url: formData.image_url.trim(),
        featured: formData.featured,
        in_stock: formData.in_stock,
      };

      console.log('Saving product:', data);

      if (product?.id) {
        const { data: updatedData, error } = await supabase
          .from('products')
          .update(data)
          .eq('id', product.id)
          .select()
          .single();

        if (error) {
          console.error('Update error:', error);
          throw error;
        }

        console.log('Product updated successfully:', updatedData);
        showToast('Ürün başarıyla güncellendi', 'success');
        onSave(updatedData);
      } else {
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([data])
          .select()
          .single();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }

        console.log('Product created successfully:', newProduct);
        showToast('Ürün başarıyla eklendi', 'success');
        onSave(newProduct);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      showToast(`Kayıt başarısız: ${errorMessage}`, 'error');
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto"
      >
        <div className="bg-olive text-cream p-6 flex items-center justify-between sticky top-0">
          <h2 className="text-2xl font-serif font-bold">
            {product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-cream/20 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-olive font-semibold mb-2">
                Ürün Adı *
              </label>
              <input
                type="text"
                required
                value={formData.name_tr}
                onChange={(e) =>
                  setFormData({ ...formData, name_tr: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-olive/20 rounded-lg focus:border-olive focus:outline-none"
                placeholder="Örn: Kete"
              />
            </div>

            <div>
              <label className="block text-olive font-semibold mb-2">
                Kategori
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-olive/20 rounded-lg focus:border-olive focus:outline-none"
              >
                <option value="">Seçiniz...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_tr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-olive font-semibold mb-2">
                Fiyat *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 border-2 border-olive/20 rounded-lg focus:border-olive focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-olive font-semibold mb-2">
                Birim
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-olive/20 rounded-lg focus:border-olive focus:outline-none"
                placeholder="Örn: kg"
              />
            </div>
          </div>

          <div>
            <label className="block text-olive font-semibold mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description_tr}
              onChange={(e) =>
                setFormData({ ...formData, description_tr: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border-2 border-olive/20 rounded-lg focus:border-olive focus:outline-none resize-none"
              placeholder="Ürün açıklaması..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-olive font-semibold mb-2">
                Resim - Dosya Yükle
              </label>
              <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-olive/20 rounded-lg hover:border-olive cursor-pointer transition-colors">
                <div className="flex items-center gap-2 text-olive">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm">Resim seçiniz...</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-olive font-semibold mb-2">
                Resim - URL
              </label>
              <input
                type="url"
                value={formData.image_url.startsWith('data:') ? '' : formData.image_url}
                onChange={(e) => {
                  if (e.target.value.trim()) {
                    handleImageUrlChange(e.target.value);
                  }
                }}
                className="w-full px-4 py-2 border-2 border-olive/20 rounded-lg focus:border-olive focus:outline-none text-sm"
                placeholder="https://..."
                disabled={formData.image_url.startsWith('data:')}
              />
              {formData.image_url.startsWith('data:') && (
                <p className="text-xs text-olive/60 mt-1">
                  Base64 dosya yüklendi. URL alanı devre dışı bırakılmıştır.
                </p>
              )}
            </div>
          </div>

          {imagePreview && (
            <div className="bg-olive/5 rounded-lg p-4 flex justify-center">
              <img
                src={imagePreview}
                alt="Önizleme"
                className="max-h-40 max-w-full object-contain rounded"
              />
            </div>
          )}

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.in_stock}
                onChange={(e) =>
                  setFormData({ ...formData, in_stock: e.target.checked })
                }
                className="w-5 h-5 rounded border-2 border-olive/20 accent-olive"
              />
              <span className="text-olive font-semibold">Stokta Var</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-5 h-5 rounded border-2 border-olive/20 accent-olive"
              />
              <span className="text-olive font-semibold">Öne Çıkan Ürün</span>
            </label>
          </div>

          <div className="flex gap-4 pt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
            >
              İptal
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 bg-olive hover:bg-olive/90 disabled:bg-olive/50 text-cream font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
