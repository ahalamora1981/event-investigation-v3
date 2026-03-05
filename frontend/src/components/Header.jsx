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

  const headerBg = contentTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-200';
  const headerBorder = contentTheme === 'dark' ? 'border-slate-700' : 'border-slate-300';
  const textColor = contentTheme === 'dark' ? 'text-slate-200' : 'text-slate-800';
  const textMuted = contentTheme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const buttonBg = contentTheme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 border-slate-400 text-slate-700 hover:bg-slate-200';
  const badgeBg = contentTheme === 'dark' ? 'bg-rose-900/50 text-rose-300 border-rose-700' : 'bg-rose-200 text-rose-800 border-rose-300';

  return (
    <header className={`${headerBg} border-b ${headerBorder} px-8 py-5 flex justify-between items-center z-10 sticky top-0 shadow-sm`}>
      <div>
        <div className="flex items-center space-x-3">
          <span className={`${badgeBg} text-xs font-bold px-2.5 py-0.5 rounded-full border`}>
            {t('header.activeInvestigation')}
          </span>
          <h2 className={`text-xl font-bold ${textColor}`}>{t('header.caseNumber')} #INV-2026-8891</h2>
        </div>
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
  const cardBg = contentTheme === 'dark' ? 'bg-slate-700' : 'bg-slate-100';
  const cardBorder = contentTheme === 'dark' ? 'border-slate-600' : 'border-slate-300';
  const textColor = contentTheme === 'dark' ? 'text-slate-200' : 'text-slate-800';
  const textMuted = contentTheme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const textSecondary = contentTheme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const iconBg = contentTheme === 'dark' ? 'bg-indigo-900/50' : 'bg-indigo-100';
  const labelColor = contentTheme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const valueColor = contentTheme === 'dark' ? 'text-white' : 'text-slate-900';
  const separatorColor = contentTheme === 'dark' ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className={`${bannerBg} px-8 py-4 border-b`}>
      <div className={`${cardBg} rounded-xl border-l-4 border-l-indigo-500 shadow-sm p-4 flex items-center`}>
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className={`${iconBg} p-2.5 rounded-full flex-shrink-0`}>
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {t('header.triggeringTradeEvent')}
            </h3>
            <div className={`text-sm whitespace-nowrap overflow-x-auto font-sans`}>
              <span className={labelColor}>{t('header.orderId')}:</span> <span className={valueColor}>TRD-9921</span>
              <span className={`mx-2 ${separatorColor}`}>|</span>
              <span className={labelColor}>{t('header.trader')}:</span> <span className={valueColor}>{t('header.traderName')}</span>
              <span className={`mx-2 ${separatorColor}`}>|</span>
              <span className={labelColor}>{t('header.productId')}:</span> <span className={valueColor}>SPX500</span>
              <span className={`mx-2 ${separatorColor}`}>|</span>
              <span className={labelColor}>{t('header.productName')}:</span> <span className={valueColor}>S&P 500 Index</span>
              <span className={`mx-2 ${separatorColor}`}>|</span>
              <span className={labelColor}>{t('header.amount')}:</span> <span className={valueColor}>8.5M</span>
              <span className={`mx-2 ${separatorColor}`}>|</span>
              <span className={labelColor}>{t('header.direction')}:</span> <span className={valueColor}>{t('header.sell')}</span>
              <span className={`mx-2 ${separatorColor}`}>|</span>
              <span className={labelColor}>{t('header.date')}:</span> <span className={valueColor}>2026-01-19</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Header, TriggerEventBanner };
