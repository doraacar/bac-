import { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminAuthProps {
  onAuthSuccess: () => void;
  onBackToShop: () => void;
}

export function AdminAuth({ onAuthSuccess, onBackToShop }: AdminAuthProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setPassword('');
      setError('');
      onAuthSuccess();
    } else {
      setError('Yanlış şifre');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-cream to-olive/5 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full border-2 border-olive/20 relative"
      >
        <button
          onClick={onBackToShop}
          className="absolute top-4 left-4 flex items-center gap-2 text-olive/60 hover:text-olive transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Geri Dön</span>
        </button>

        <div className="flex justify-center mb-6 mt-4">
          <div className="bg-olive p-4 rounded-lg">
            <Lock className="w-8 h-8 text-cream" />
          </div>
        </div>

        <h1 className="text-2xl font-serif font-bold text-olive text-center mb-2">
          Yönetici Paneli
        </h1>
        <p className="text-olive/60 text-center mb-6">
          Panele erişmek için şifre giriniz
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="w-full px-4 py-3 border-2 border-olive/20 rounded-lg focus:border-olive focus:outline-none font-medium"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-600 font-semibold text-sm">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-olive hover:bg-olive/90 text-cream font-bold py-3 rounded-lg transition-colors"
          >
            Giriş Yap
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
