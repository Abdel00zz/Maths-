import React, { useState } from 'react';
import { Modal } from './ui/LayoutComponents';
import { Icon } from './ui/Base';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    const [lang, setLang] = useState<'fr' | 'ar'>('fr');

    const features = [
        {
            icon: "menu_book",
            titleFr: "Cours Interactifs",
            titleAr: "دروس تفاعلية",
            descFr: "Lecture active requise pour débloquer le quiz.",
            descAr: "قراءة نشطة مطلوبة لفتح الاختبار."
        },
        {
            icon: "quiz",
            titleFr: "Quiz de Validation",
            titleAr: "اختبار التحقق",
            descFr: "Testez vos connaissances pour accéder aux exercices.",
            descAr: "اختبر معلوماتك للوصول إلى التمارين."
        },
        {
            icon: "fitness_center",
            titleFr: "Entraînement",
            titleAr: "تمارين تطبيقية",
            descFr: "Résolvez des problèmes et auto-évaluez votre niveau.",
            descAr: "حل المسائل وقيم مستواك ذاتياً."
        },
        {
            icon: "send",
            titleFr: "Envoi du Travail",
            titleAr: "إرسال العمل",
            descFr: "Soumettez votre progression au professeur.",
            descAr: "أرسل تقدمك للأستاذ المشرف."
        }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={lang === 'fr' ? "Guide d'utilisation" : "دليل الاستخدام"}>
            <div className="flex justify-center mb-8">
                <div className="bg-slate-100 p-1.5 rounded-xl inline-flex border border-slate-200">
                    <button onClick={() => setLang('fr')} className={`px-6 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-wider ${lang === 'fr' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Français</button>
                    <button onClick={() => setLang('ar')} className={`px-6 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-wider ${lang === 'ar' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>العربية</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                {features.map((feat, idx) => (
                    <div key={idx} className="p-6 rounded-2xl border-2 border-slate-100 hover:border-slate-900 hover:shadow-lg transition-all group bg-white">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center mb-4 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                            <Icon name={feat.icon} className="text-2xl" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2 text-lg">{lang === 'fr' ? feat.titleFr : feat.titleAr}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            {lang === 'fr' ? feat.descFr : feat.descAr}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-10 pt-8 border-t border-dashed border-slate-200">
                <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-amber-400">
                            <Icon name="support_agent" className="text-2xl" />
                        </div>
                        <div>
                            <h5 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-1">{lang === 'fr' ? "Besoin d'aide ?" : "هل تحتاج مساعدة؟"}</h5>
                            <p className="font-bold text-lg">Contact Support</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 text-sm font-medium text-slate-300">
                        <span className="flex items-center gap-3"><Icon name="chat" className="text-emerald-400" /> +212 674 680 119</span>
                        <span className="flex items-center gap-3"><Icon name="mail" className="text-blue-400" /> bdh.malek@gmail.com</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
};