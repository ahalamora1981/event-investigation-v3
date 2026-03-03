import { useState } from 'react';
import { Download, Lock, Activity, Hash, User, Clock, ChevronDown, Globe, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

function Header() {
  const { t, language, setLanguage } = useLanguage();
  const { contentTheme, toggleContentTheme } = useTheme();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };

  const headerBg = contentTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-100';
  const headerBorder = contentTheme === 'dark' ? 'border-slate-700' : 'border-slate-300';
  const textColor = contentTheme === 'dark' ? 'text-slate-200' : 'text-slate-800';
  const textMuted = contentTheme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const buttonBg = contentTheme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50';
  const badgeBg = contentTheme === 'dark' ? 'bg-rose-900/50 text-rose-300 border-rose-700' : 'bg-rose-200 text-rose-800 border-rose-300';

  return (
    <header className={`${headerBg} border-b ${headerBorder} px-8 py-5 flex justify-between items-center z-10 sticky top-0 shadow-sm`}>
      <div>
        <div className="flex items-center space-x-3 mb-1">
          <span className={`${badgeBg} text-xs font-bold px-2.5 py-0.5 rounded-full border`}>
            {t('header.activeInvestigation')}
          </span>
          <h2 className={`text-xl font-bold ${textColor}`}>{t('header.caseNumber')} #INV-2026-8891</h2>
        </div>
        <p className={`text-sm ${textMuted}`}>
          {t('header.caseDescription')}
        </p>
      </div>
      <div className="flex space-x-3 items-center">
        <button
          onClick={toggleContentTheme}
          className={`p-2 border rounded-lg flex items-center transition-colors ${buttonBg}`}
          title={contentTheme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
        >
          {contentTheme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className={`px-3 py-2 border rounded-lg flex items-center transition-colors ${buttonBg}`}
          >
            <Globe className="w-4 h-4" />
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
        
        <button className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center transition-colors ${buttonBg}`}>
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
  const { contentTheme } = useTheme();

  const bannerBg = contentTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300';
  const cardBg = contentTheme === 'dark' ? 'bg-slate-700' : 'bg-white';
  const cardBorder = contentTheme === 'dark' ? 'border-slate-600' : 'border-slate-200';
  const textColor = contentTheme === 'dark' ? 'text-slate-200' : 'text-slate-800';
  const textMuted = contentTheme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const textSecondary = contentTheme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const iconBg = contentTheme === 'dark' ? 'bg-indigo-900/50' : 'bg-indigo-50';

  return (
    <div className={`${bannerBg} px-8 py-4 border-b`}>
      <div className={`${cardBg} rounded-xl border-l-4 border-l-indigo-500 shadow-sm p-4 flex items-center justify-between`}>
        <div className="flex items-center space-x-4">
          <div className={`${iconBg} p-2.5 rounded-full`}>
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {t('header.triggeringTradeEvent')}
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <span className={`font-semibold ${textColor}`}>{t('header.blockSellOrder')}</span>
              <span className={`flex items-center ${textSecondary}`}>
                <Hash className="w-3.5 h-3.5 mr-1 text-slate-400" /> {t('header.tradeId')}
              </span>
              <span className={`flex items-center ${textSecondary}`}>
                <User className="w-3.5 h-3.5 mr-1 text-slate-400" /> {t('header.executedBy')}
              </span>
              <span className={`flex items-center ${textSecondary}`}>
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> {t('header.tradeTime')}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right pr-4">
          <div className={`text-lg font-bold ${textColor}`}>~$8.5M</div>
        </div>
      </div>
    </div>
  );
}

export { Header, TriggerEventBanner };
