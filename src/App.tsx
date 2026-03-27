import { useState } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { ToastContainer } from './components/Toast';
import { AdminAuth } from './components/AdminAuth';
import { AdminPanel } from './components/AdminPanel';
import { useCart } from './contexts/CartContext';
import { useToast } from './contexts/ToastContext';
import { useProducts } from './contexts/ProductsContext';
import { useAdminAuth } from './contexts/AdminAuthContext';
import type { Product } from './lib/database.types';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartShake, setCartShake] = useState(false);
  const [currentPage, setCurrentPage] = useState<'shop' | 'admin-auth' | 'admin'>('shop');

  const { addItem } = useCart();
  const { showToast } = useToast();
  const { products, categories, loading } = useProducts();
  const { isAuthenticated, login, logout } = useAdminAuth();

  function handleAddToCart(product: Product) {
    addItem(product);
    showToast(`${product.name_tr} sepete eklendi`, 'success');
    setCartShake(true);
    setTimeout(() => setCartShake(false), 500);
  }

  function handleCheckout() {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }

  function handleAdminClick() {
    if (isAuthenticated) {
      setCurrentPage('admin');
    } else {
      setCurrentPage('admin-auth');
    }
  }

  function handleBackToShop() {
    setCurrentPage('shop');
  }

  function handleLogout() {
    logout();
    setCurrentPage('shop');
  }

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  const featuredProducts = products.filter((p) => p.featured);

  if (currentPage === 'admin-auth') {
    return (
      <AdminAuth
        onAuthSuccess={() => {
          login();
          setCurrentPage('admin');
        }}
        onBackToShop={handleBackToShop}
      />
    );
  }

  if (currentPage === 'admin') {
    return (
      <AdminPanel
        onBackToShop={handleBackToShop}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-cream to-olive/5">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        cartShake={cartShake}
        onAdminClick={handleAdminClick}
      />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-olive mb-4">
            Doğal ve Organik Lezzetler
          </h2>
          <p className="text-lg text-olive/80 max-w-2xl mx-auto">
            Erzurum'un geleneksel tatlarını, organik ve doğal içeriklerle
            sofranıza getiriyoruz. Her ürün özenle hazırlanır.
          </p>
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-olive border-t-transparent"></div>
          </div>
        ) : (
          <>
            {featuredProducts.length > 0 && (
              <section className="mb-12">
                <h3 className="text-2xl font-serif font-bold text-olive mb-6 flex items-center gap-2">
                  Öne Çıkan Ürünler
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </section>
            )}

            <section className="mb-8">
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === null
                      ? 'bg-olive text-cream shadow-lg'
                      : 'bg-white text-olive border-2 border-olive/20 hover:border-olive'
                  }`}
                >
                  Tümü
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-olive text-cream shadow-lg'
                        : 'bg-white text-olive border-2 border-olive/20 hover:border-olive'
                    }`}
                  >
                    {category.name_tr}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-olive/60 text-lg">
                    Bu kategoride ürün bulunamadı
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        <section className="mt-16 bg-white rounded-lg shadow-lg p-8 border-2 border-olive/20">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-olive mb-4">
                Teslimat Bilgileri
              </h3>
              <div className="space-y-3 text-olive/80">
                <p className="flex items-start gap-2">
                  <span className="text-xl">🚚</span>
                  <span>
                    Erzurum içi <strong>2.000₺ üzeri</strong> ücretsiz adrese
                    teslimat
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-xl">📦</span>
                  <span>
                    Şehir dışı PTT Kargo ile gönderim.{' '}
                    <strong>2.500₺ üzeri</strong> kargo ücretsiz
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-serif font-bold text-olive mb-4">
                İletişim
              </h3>
              <div className="space-y-3 text-olive/80">
                <p className="flex items-start gap-2">
                  <span className="text-xl">📱</span>
                  <span>
                    <a
                      href="https://wa.me/905465768639"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-terracotta font-medium"
                    >
                      +90 546 576 86 39
                    </a>
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-xl">📍</span>
                  <span>Erzurum, Türkiye</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-olive text-cream py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif text-lg mb-2">BACI ORGANİK ÜRÜNLER</p>
          <p className="text-sm text-cream/80">
            Doğal ve organik ürünlerle sağlıklı yaşam
          </p>
        </div>
      </footer>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <ToastContainer />
    </div>
  );
}

export default App;
