import React, { useState } from 'react';
import { X, Check, Sparkles, CreditCard, Shield, Lock, CheckCircle2, RefreshCw } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: (newPlan: 'premium') => void;
}

export default function UpgradeModal({ isOpen, onClose, onUpgradeSuccess }: UpgradeModalProps) {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const premiumFeatures = [
    'Unlimited active landing page projects simultaneously',
    'Uncapped high-fidelity Claude 3.5 Sonnet generations',
    'Custom branding, theme injections, and typography imports',
    'Full static WooCommerce & ShopifySkincare grid formats',
    'Static code compilation & raw multi-page standard exports',
    'WordPress Gutenberg and Block editor compatibility presets'
  ];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !cardNumber.trim()) {
      setError('Please provide valid billing name, contact email, and card numbers.');
      return;
    }
    setError('');
    setStep('processing');

    try {
      // Direct high-speed API call to the server upgrade endpoint we created
      const response = await fetch('/api/admin/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setTimeout(() => {
          setStep('success');
          onUpgradeSuccess('premium');
        }, 1200);
      } else {
        throw new Error('Upgrade network handshake failed');
      }
    } catch (err) {
      setError('A secure transaction routing incident occurred. Please try again.');
      setStep('details');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn select-text text-left">
      <div 
        id="upgrade-modal-card" 
        className="w-full max-w-3xl bg-[#09090b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Absolute Dismiss cross */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer p-1.5 rounded-full hover:bg-white/5 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* DETAILS OR PROCESSING LAYOUT */}
        {step !== 'success' && (
          <>
            {/* Left Side: Features Checklist & Brand Pitch */}
            <div className="p-8 md:w-1/2 bg-gradient-to-b from-white/[0.02] to-transparent border-r border-white/5 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-mono font-bold uppercase tracking-wider mb-5">
                  <Sparkles className="w-3 h-3" />
                  <span>Uncapped Core Licenses</span>
                </div>
                
                <h3 className="text-2xl font-serif text-white italic font-light">Auto Platform Premium</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Join hundreds of agency founders, SaaS builders, and designers deploying stunning visual assets instantly.
                </p>

                <ul className="mt-6 space-y-3.5">
                  {premiumFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start text-xs text-neutral-300">
                      <div className="p-0.5 rounded-full bg-amber-400/10 text-amber-400 mr-2.5 mt-0.5 shrink-0 border border-amber-400/20">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/5 pt-6 mt-6 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                <span className="flex items-center"><Lock className="w-3.5 h-3.5 mr-1" /> SSL Protected</span>
                <span className="flex items-center"><Shield className="w-3.5 h-3.5 mr-1" /> Sandbox Compliant</span>
              </div>
            </div>

            {/* Right Side: Billing Form */}
            <div className="p-8 md:w-1/2 relative flex flex-col justify-center">
              {step === 'processing' ? (
                <div className="text-center py-16 space-y-4 animate-fadeIn">
                  <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
                  <h4 className="text-md font-semibold text-white">Encrypting Secure Pipeline...</h4>
                  <p className="text-xs text-neutral-400 max-w-xs mx-auto">Authorizing zero-latency lifetime token generation key directly with node runners.</p>
                </div>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-4 text-left">
                  <div>
                    <h4 className="text-[10px] font-mono text-neutral-450 uppercase tracking-widest font-bold mb-1 block">Active Plan Tier Selection</h4>
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-amber-400/20 flex justify-between items-center bg-gradient-to-r from-amber-400/[0.03] to-transparent">
                      <div>
                        <span className="text-xs text-white font-semibold block">★ Aura Lifetime PRO</span>
                        <span className="text-[10px] text-amber-400 font-mono font-medium">Single one-time sandbox activation</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-serif italic text-white line-through block text-neutral-500 text-xs">$59</span>
                        <span className="text-md font-bold text-white">$19</span>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400">
                      ⚠ {error}
                    </div>
                  )}

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">Cardholder Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Johnathan Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/5 text-xs text-white focus:border-white/20 outline-none placeholder:text-neutral-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">Contact Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/5 text-xs text-white focus:border-white/20 outline-none placeholder:text-neutral-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">Debit or Credit Card Number</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 •••• •••• 4242"
                          maxLength={19}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-black border border-white/5 text-xs text-white focus:border-white/20 outline-none placeholder:text-neutral-700 font-mono"
                        />
                        <CreditCard className="w-4 h-4 text-neutral-600 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">Expiration</label>
                        <input 
                          type="text" 
                          required
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/5 text-xs text-white focus:border-white/20 outline-none placeholder:text-neutral-700 font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">CVV Code</label>
                        <input 
                          type="password" 
                          required
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={3}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/5 text-xs text-white focus:border-white/20 outline-none placeholder:text-neutral-700 font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 rounded-full bg-white hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-xl shadow-black/80"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize Sandbox Payment</span>
                  </button>
                  <p className="text-[10px] text-neutral-500 text-center uppercase tracking-wider font-mono">
                    Instant sandbox updates. Safe zero-charge simulations.
                  </p>
                </form>
              )}
            </div>
          </>
        )}

        {/* SUCCESS INTERACTIVE FEEDBACK */}
        {step === 'success' && (
          <div className="p-12 w-full text-center space-y-6 animate-fadeIn py-16">
            <div className="w-16 h-16 bg-amber-400/10 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-400/20 shadow-lg shadow-amber-400/10 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block mb-1">TRANSACTION CONFIRMED</span>
              <h3 className="text-3xl font-serif text-white italic font-light">Lifetime Premium Activated</h3>
              <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed mt-2">
                Congratulations! We have successfully bound your secure node account to the unlimited premium compiler cluster.
              </p>
            </div>

            <div className="p-5 max-w-md mx-auto bg-white/[0.01] rounded-2xl border border-white/5 text-left space-y-3 leading-relaxed">
              <div className="flex items-center space-x-2 text-xs text-amber-400 font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>UNLOCKED PREMIUM BENEFITS:</span>
              </div>
              <ul className="text-xs text-neutral-300 space-y-1.5 list-disc pl-4 font-light">
                <li>Deploy infinite concurrent workspaces templates</li>
                <li>Unlimited dual prompt code completions</li>
                <li>Enabled WordPress and Shop layout outputs</li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg inline-flex items-center space-x-1.5"
            >
              <span>Compile Unlimited Workspaces</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
