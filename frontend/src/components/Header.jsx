import { useState } from 'react';
import { Download, Lock, Activity, Hash, User, Clock, ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function Header() {
  const { t, language, setLanguage } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center z-10 sticky top-0 shadow-sm">
      <div>
        <div className="flex items-center space-x-3 mb-1">
          <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
            {t('header.activeInvestigation')}
          </span>
          <h2 className="text-xl font-bold text-slate-800">{t('header.caseNumber')} #INV-2026-8891</h2>
        </div>
        <p className="text-sm text-slate-500">
          {t('header.caseDescription')}
        </p>
      </div>
      <div className="flex space-x-3 items-center">
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center transition-colors"
          >
            <Globe className="w-4 h-4 mr-2" />
            {language === 'zh' ? '中文' : 'English'}
            <ChevronDown className="w-3 h-3 ml-1" />
          </button>
          
          {showLanguageDropdown && (
            <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => handleLanguageChange('zh')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center ${
                    language === 'zh' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                  }`}
                >
                  <span className="mr-2">🇨🇳</span>
                  {t('language.chinese')}
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center ${
                    language === 'en' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                  }`}
                >
                  <span className="mr-2">🇺🇸</span>
                  {t('language.english')}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center transition-colors">
          <Download className="w-4 h-4 mr-2" /> {t('header.exportReport')}
        </button>
        <button className="px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 flex items-center shadow-sm transition-colors">
          <Lock className="w-4 h-4 mr-2" /> {t('header.escalateCase')}
        </button>
      </div>
    </header>
  );
}

function TriggerEventBanner() {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-50 px-8 py-4 border-b border-slate-200">
      <div className="bg-white rounded-xl border-l-4 border-l-indigo-500 shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-50 p-2.5 rounded-full">
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {t('header.triggeringTradeEvent')}
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-semibold text-slate-800">{t('header.blockSellOrder')}</span>
              <span className="flex items-center text-slate-600">
                <Hash className="w-3.5 h-3.5 mr-1 text-slate-400" /> {t('header.tradeId')}
              </span>
              <span className="flex items-center text-slate-600">
                <User className="w-3.5 h-3.5 mr-1 text-slate-400" /> {t('header.executedBy')}
              </span>
              <span className="flex items-center text-slate-600">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> {t('header.tradeTime')}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right pr-4">
          <div className="text-lg font-bold text-slate-800">~$8.5M</div>
        </div>
      </div>
    </div>
  );
}

export { Header, TriggerEventBanner };
