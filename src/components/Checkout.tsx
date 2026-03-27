import { useState } from 'react';
import { X, MapPin, User, Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Checkout({ isOpen, onClose }: CheckoutProps) {
  const { items, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Erzurum',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderDetails = items
      .map((item) => `${item.quantity}x ${item.name_tr} (${(item.price * item.quantity).toFixed(2)}₺)`)
      .join('\n');

    const shippingInfo =
      formData.city === 'Erzurum'
        ? total >= 2000
          ? 'Teslimat: Ücretsiz (Erzurum içi)'
          : 'Teslimat: Ücretli (2.000₺ altı)'
        : total >= 2500
        ? 'Kargo: Ücretsiz PTT Kargo (2.500₺ üzeri)'
        : 'Kargo: Ücretli PTT Kargo';

    const message = `🛒 *BACI ORGANİK ÜRÜNLER - Yeni Sipariş*

*Müşteri Bilgileri:*
👤 Ad Soyad: ${formData.name}
📱 Telefon: ${formData.phone}
📍 Adres: ${formData.address}
🏙️ Şehir: ${formData.city}
${formData.notes ? `📝 Notlar: ${formData.notes}` : ''}

*Sipariş Detayları:*
${orderDetails}

💰 *Toplam: ${total.toFixed(2)}₺*

🚚 ${shippingInfo}

💳 *Ödeme:* Havale/EFT (IBAN bilgisi WhatsApp'tan paylaşılacak)`;

    const whatsappUrl = `https://wa.me/905465768639?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    clearCart();
    onClose();
  };

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 sm:inset-8 sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-cream rounded-lg shadow-2xl z-[60] flex flex-col max-h-[95vh]"
          >
            <div className="bg-olive text-cream p-4 flex items-center justify-between rounded-t-lg flex-shrink-0">
              <h2 className="text-xl font-serif font-bold">Sipariş Bilgileri</h2>
              <button
                type="button"
                onClick={onClose}
                className="hover:bg-cream/20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4 pb-2">
                <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-olive font-semibold mb-2">
                    <User className="w-4 h-4" />
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-olive/20 rounded-lg focus:border-olive focus:outline-none"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-olive font-semibold mb-2">
                    <Phone className="w-4 h-4" />
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-olive/20 rounded-lg focus:border-olive focus:outline-none"
                    placeholder="05XX XXX XX XX"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-olive font-semibold mb-2">
                    <MapPin className="w-4 h-4" />
                    Şehir *
                  </label>
                  <select
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-olive/20 rounded-lg focus:border-olive focus:outline-none"
                  >
                    <option value="Erzurum">Erzurum</option>
                    <option value="Ankara">Ankara</option>
                    <option value="İstanbul">İstanbul</option>
                    <option value="İzmir">İzmir</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-olive font-semibold mb-2">
                    <MapPin className="w-4 h-4" />
                    Adres *
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-olive/20 rounded-lg focus:border-olive focus:outline-none resize-none"
                    placeholder="Teslimat adresinizi detaylı yazınız"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-olive font-semibold mb-2">
                    <MessageCircle className="w-4 h-4" />
                    Sipariş Notu (Opsiyonel)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2 border-2 border-olive/20 rounded-lg focus:border-olive focus:outline-none resize-none"
                    placeholder="Varsa özel notlarınız..."
                  />
                </div>

                <div className="bg-olive/5 p-4 rounded-lg border-2 border-olive/20">
                  <h3 className="font-semibold text-olive mb-2">Ödeme Bilgisi</h3>
                  <p className="text-sm text-olive/80 mb-2">
                    💳 Ödeme yöntemi: <strong>Havale/EFT</strong>
                  </p>
                  <p className="text-xs text-olive/60">
                    Sipariş onayından sonra IBAN bilgilerimiz WhatsApp üzerinden
                    paylaşılacaktır.
                  </p>
                </div>

                <div className="bg-terracotta/10 p-4 rounded-lg border-2 border-terracotta/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-olive font-semibold">Toplam:</span>
                    <span className="text-2xl font-bold text-olive">
                      {total.toFixed(2)}₺
                    </span>
                  </div>
                  <p className="text-xs text-olive/70">
                    {formData.city === 'Erzurum'
                      ? total >= 2000
                        ? '✅ Ücretsiz teslimat'
                        : '⚠️ 2.000₺ üzeri ücretsiz teslimat'
                      : total >= 2500
                      ? '✅ Ücretsiz kargo'
                      : '⚠️ 2.500₺ üzeri ücretsiz kargo'}
                  </p>
                </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2 text-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp ile Sipariş Ver
                </button>

                <p className="text-xs text-center text-olive/60 mt-4 mb-2">
                  Siparişiniz WhatsApp üzerinden iletilecektir
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
