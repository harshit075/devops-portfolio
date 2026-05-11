import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminDashboard } from './AdminDashboard';

const LockIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);



const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export function AdminAccess() {
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Read PIN from env or default to the provided password
  const correctPin = import.meta.env.VITE_ADMIN_PIN || '987654321';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === correctPin) {
      setIsAuthenticated(true);
      setError(false);
      setPin('');
    } else {
      setError(true);
      setPin('');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsAuthenticated(false);
      setPin('');
      setError(false);
    }, 300);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 border border-border-color hover:border-cyan hover:text-cyan transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] group rounded-full md:rounded-none"
        title="Admin Access"
      >
        <LockIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative bg-background border border-border-color shadow-[0_0_40px_rgba(0,255,255,0.1)] overflow-hidden transition-all duration-300 ${
                isAuthenticated 
                  ? 'w-[95vw] h-[95vh] max-w-7xl flex flex-col' 
                  : 'w-full max-w-lg p-8'
              }`}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan to-transparent opacity-50 z-10" />
              
              {!isAuthenticated && (
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors z-10"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              )}

              {!isAuthenticated ? (
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="p-4 rounded-full bg-cyan/10 text-cyan">
                    <LockIcon className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Restricted Access</h2>
                    <p className="text-text-muted text-sm uppercase tracking-wider">Please enter admin password</p>
                  </div>

                  <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value);
                        setError(false);
                      }}
                      className={`w-full bg-black/50 border ${error ? 'border-red-500' : 'border-border-color'} p-3 text-center text-xl tracking-[0.2em] focus:outline-none focus:border-cyan transition-colors font-mono`}
                      placeholder="••••••••"
                      maxLength={50}
                      autoFocus
                    />
                    {error && (
                      <p className="text-red-500 text-xs uppercase tracking-widest">Access Denied</p>
                    )}
                    <button
                      type="submit"
                      className="w-full py-3 bg-cyan text-black font-bold uppercase tracking-widest hover:bg-cyan/90 transition-colors"
                    >
                      Authenticate
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex-1 overflow-hidden relative">
                   <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors z-50 bg-black/50 p-2 rounded-full hidden md:block"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                  <AdminDashboard onLogout={() => {
                    setIsAuthenticated(false);
                    handleClose();
                  }} />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
