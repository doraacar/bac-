import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function Cart({ isOpen, onClose, onCheckout }: CartProps) {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-cream shadow-2xl z-50 flex flex-col"
          >
            <div className="bg-olive text-cream p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                <h2 className="text-xl font-serif font-bold">
                  Sepetim ({itemCount})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="hover:bg-cream/20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-olive/60">
                  <ShoppingBag className="w-16 h-16 mb-4" />
                  <p className="text-lg">Sepetiniz boş</p>
                  <p className="text-sm mt-2">Ürün ekleyerek başlayın</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-white rounded-lg p-3 shadow-md border border-olive/10"
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.image_url}
                          alt={item.name_tr}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-olive text-sm mb-1 line-clamp-2">
                            {item.name_tr}
                          </h3>
                          <p className="text-terracotta font-bold text-sm mb-2">
                            {item.price.toFixed(2)}₺ / {item.unit}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-olive/10 rounded-lg p-1">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="hover:bg-olive/20 p-1 rounded transition-colors"
                              >
                                <Minus className="w-4 h-4 text-olive" />
                              </button>
                              <span className="w-8 text-center font-semibold text-olive">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="hover:bg-olive/20 p-1 rounded transition-colors"
                              >
                                <Plus className="w-4 h-4 text-olive" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-olive/10 flex justify-between items-center">
                        <span className="text-xs text-olive/60">Toplam:</span>
                        <span className="font-bold text-olive">
                          {(item.price * item.quantity).toFixed(2)}₺
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t-2 border-olive/20 p-4 bg-white">
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-lg">
                    <span className="text-olive font-semibold">Ara Toplam:</span>
                    <span className="text-olive font-bold">{total.toFixed(2)}₺</span>
                  </div>
                  <div className="text-xs text-olive/60 bg-olive/5 p-3 rounded-lg">
                    <p className="mb-1">
                      🚚 Erzurum içi 2.000₺ üzeri ücretsiz teslimat
                    </p>
                    <p>
                      📦 Şehir dışı 2.500₺ üzeri kargo ücretsiz
                    </p>
                  </div>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full bg-terracotta hover:bg-terracotta/90 text-white font-bold py-4 rounded-lg transition-colors shadow-lg text-lg"
                >
                  Siparişi Tamamla
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
