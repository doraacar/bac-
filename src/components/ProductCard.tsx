import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '../lib/database.types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-olive/10 hover:shadow-xl transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-olive/5">
        <img
          src={product.image_url}
          alt={product.name_tr}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <div className="absolute top-2 right-2 bg-terracotta text-cream px-3 py-1 rounded-full text-xs font-semibold">
            Öne Çıkan
          </div>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-olive px-4 py-2 rounded-lg font-semibold">
              Tükendi
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-serif text-lg font-bold text-olive mb-2 line-clamp-2">
          {product.name_tr}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description_tr}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-olive">
              {product.price.toFixed(2)}₺
            </span>
            <span className="text-sm text-gray-500 ml-1">/ {product.unit}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart(product)}
            disabled={!product.in_stock}
            className="bg-terracotta hover:bg-terracotta/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Ekle</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
