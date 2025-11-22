
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui/Base';
import { Modal as ModalLayout } from '../components/ui/LayoutComponents';
import { useAppContext } from '../context/AppContext';
import { StorageService } from '../services/StorageService';
import { MathCosmos } from '../components/login/MathCosmos';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState<'school' | 'concours'>('school');
  const [name, setName] = useState('');
  const [level, setLevel] = useState('1bsm');
  
  const [existingUser, setExistingUser] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const saved = StorageService.get();
    if (saved.studentName) {
        setExistingUser(saved.studentName);
        setName(saved.studentName);
        setLevel(saved.classId);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch({ type: 'LOGIN', payload: { name, classId: level } });
      navigate('/dashboard');
    }
  };

  const handleReset = () => {
      StorageService.clear();
      dispatch({ type: 'LOGOUT' });
      setExistingUser(null);
      setName('');
      setShowResetConfirm(false);
  };

  // --- VIEW: Session Resume (Minimalist) ---
  if (existingUser) {
      return (
          <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden font-body">
              <MathCosmos />
              <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-sm"></div>
              
              <div className="relative w-full max-w-sm p-8 bg-white flex flex-col items-center text-center z-10 animate-fadeIn">
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-white mb-6 shadow-xl">
                      <span className="text-2xl font-bold font-display">{existingUser.charAt(0).toUpperCase()}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{existingUser}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Session active</p>
                  
                  <button 
                      onClick={() => navigate('/dashboard')}
                      className="w-full py-3.5 bg-slate-900 text-white rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-lg mb-4"
                  >
                      Reprendre
                  </button>
                  
                  <button 
                      onClick={() => setShowResetConfirm(true)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider transition-colors"
                  >
                      Changer de compte
                  </button>
              </div>

              <ModalLayout isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="Déconnexion">
                  <div className="text-center p-6">
                      <p className="text-slate-600 mb-8 font-medium text-sm">Quitter la session actuelle ?</p>
                      <div className="flex gap-4 justify-center">
                          <button className="px-6 py-2 rounded-lg text-slate-500 font-bold text-xs hover:bg-slate-50 uppercase tracking-wider" onClick={() => setShowResetConfirm(false)}>Non</button>
                          <button className="px-6 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 uppercase tracking-wider" onClick={handleReset}>Oui</button>
                      </div>
                  </div>
              </ModalLayout>
          </div>
      );
  }

  // --- VIEW: New Login (Minimalist) ---
  return (
    <div className="h-screen w-full flex overflow-hidden font-body bg-white">
      
      {/* LEFT: Content */}
      <div className="w-full lg:w-[40%] h-full flex flex-col relative z-20 bg-white border-r border-slate-100">
          <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12">
              
                <div className="w-full max-w-xs">
                    {/* Significant Brand Logo - Maths+ */}
                    <div className="flex flex-col items-center mb-12 select-none group">
                        <div className="relative flex items-start leading-none">
                            <span className="font-logo text-8xl text-slate-900 tracking-wide scale-y-110">
                                MATHS
                            </span>
                            <span className="font-logo text-6xl text-[#0056D2] -mt-2 ml-1 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 origin-bottom-left">
                                +
                            </span>
                        </div>
                        {/* Creative Underline/Tagline */}
                        <div className="flex items-center gap-3 mt-3 opacity-60">
                            <div className="h-px w-8 bg-slate-300"></div>
                            <span className="text-[10px] font-black font-display text-slate-400 uppercase tracking-[0.3em]">L'Excellence</span>
                            <div className="h-px w-8 bg-slate-300"></div>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        
                        <div className="space-y-1">
                            <label htmlFor="name" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom Complet</label>
                            <input 
                                type="text" 
                                id="name"
                                className="block w-full py-3 px-4 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                                placeholder="Ex: Ahmed Alami"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="off"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Niveau</label>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <button 
                                    type="button"
                                    onClick={() => setActiveTab('school')}
                                    className={`py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${activeTab === 'school' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                >
                                    Lycée
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setActiveTab('concours')}
                                    className={`py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${activeTab === 'concours' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                >
                                    Concours
                                </button>
                            </div>

                            {activeTab === 'school' && (
                                <div className="relative">
                                    <select 
                                        className="block w-full py-3 px-4 text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 appearance-none cursor-pointer"
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                    >
                                        <option value="tcs">Tronc Commun Scientifique</option>
                                        <option value="1bse">1ère Bac Sc. Expérimentales</option>
                                        <option value="1bsm">1ère Bac Sc. Mathématiques</option>
                                        <option value="2bse">2ème Bac Sc. Expérimentales</option>
                                        <option value="2bsm">2ème Bac Sc. Mathématiques</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                                        <Icon name="expand_more" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="w-full py-4 bg-slate-900 text-white rounded-lg font-bold uppercase tracking-[0.15em] text-xs hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl mt-4"
                        >
                            Accéder
                        </button>
                    </form>
                </div>
          </div>
          
          <div className="p-6 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2025 Maths Plus</p>
          </div>
      </div>

      {/* RIGHT: Clean Cosmos */}
      <div className="hidden lg:block w-[60%] h-full relative bg-slate-950">
          <MathCosmos />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
      </div>

    </div>
  );
};

export default Login;
