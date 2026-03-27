import { ShoppingBag, Leaf, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  onCartClick: () => void;
  cartShake: boolean;
  onAdminClick?: () => void;
}

export function Header({ onCartClick, cartShake, onAdminClick }: HeaderProps) {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-cream border-b-2 border-olive/20 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-olive p-2 rounded-full">
              <Leaf className="w-6 h-6 text-cream" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-olive">
                BACI ORGANİK ÜRÜNLER
              </h1>
              <p className="text-xs md:text-sm text-olive/70">Erzurum'dan Sofranıza</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onAdminClick && (
              <motion.button
                onClick={onAdminClick}
                className="bg-gray-200 hover:bg-gray-300 text-olive px-3 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-md"
                title="Yönetici Paneli"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            )}

            <motion.button
              onClick={onCartClick}
              className="relative bg-olive hover:bg-olive/90 text-cream px-4 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-md"
              animate={cartShake ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Sepet</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-terracotta text-cream w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
