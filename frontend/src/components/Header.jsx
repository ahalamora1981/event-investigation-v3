import { useState, useEffect } from 'react';
import { Download, Lock, Activity, Hash, User, Clock, ChevronDown, Globe, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { tradesApi } from '../api';
import { exportReport } from '../utils/exportReport';

function Header({ events, filters, onExportReport }) {
  const { t, language, setLanguage, getChannelLabel } = useLanguage();
  const { contentTheme, toggleContentTheme } = useTheme();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const caseNumber = 'INV-2026-8891';

  const handleExportReport = () => {
    if (onExportReport) {
      onExportReport();
    } else {
      exportReport(events, filters, caseNumber, t, getChannelLabel);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };

  const headerBg = contentTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-200';
  const headerBorder = contentTheme === 'dark' ? 'border-slate-700' : 'border-slate-300';
  const textColor = contentTheme === 'dark' ? 'text-slate-200' : 'text-slate-800';
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
        
        <button
          onClick={handleExportReport}
          className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center shadow-md transition-all transform hover:scale-105 ${
            contentTheme === 'dark'
              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white border border-teal-500/30'
              : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white border border-teal-400/30'
          }`}
        >
          <Download className="w-4 h-4 mr-2" /> {t('header.exportReport')}
        </button>
        <button className="px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 flex items-center shadow-sm transition-colors">
          <Lock className="w-4 h-4 mr-2" /> {t('header.escalateCase')}
        </button>
      </div>
    </header>
  );
}

const fieldKeys = [
  'tradeNumber',
  'status',
  'assetClass',
  'productCode',
  'productName',
  'direction',
  'tradeSize',
  'price',
  'tradeTime',
  'internalTrader',
  'counterpartyInstitution',
  'counterparty',
  'brokerInstitution',
  'broker',
  'tradingVenue',
];

const firstRowFields = fieldKeys.slice(0, 5);
const secondRowFields = fieldKeys.slice(5, 10);
const thirdRowFields = fieldKeys.slice(10);

function TriggerEventBanner({ filters }) {
  const { t } = useLanguage();
  const { contentTheme } = useTheme();
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchTrades = async () => {
      if (!filters.tradeNumber) {
        setFilteredTrades([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const response = await tradesApi.getAll({
          tradeNumber: filters.tradeNumber,
        });
        setFilteredTrades(response.data.trades);
      } catch (error) {
        console.error('Error fetching trades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, [filters.tradeNumber]);

  const bannerBg = contentTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300';
  const cardBg = contentTheme === 'dark' ? 'bg-slate-700' : 'bg-slate-100';
  const textColor = contentTheme === 'dark' ? 'text-slate-200' : 'text-slate-800';
  const labelColor = contentTheme === 'dark' ? 'text-slate-400' : 'text-slate-600';

  const renderFieldItem = (fieldKey, trade) => (
    <div key={fieldKey} className="flex items-center whitespace-nowrap min-w-0">
      <span className={`${labelColor} text-xs flex-shrink-0`}>{t(`tradeFields.${fieldKey}`)}: </span>
      <span className={`${textColor} text-xs font-medium ml-1 truncate`} title={trade ? (trade[fieldKey] || '-') : '-'}>
        {trade ? (trade[fieldKey] || '-') : '-'}
      </span>
    </div>
  );

  const renderRow = (fields, trade, rowIndex) => (
    <div key={rowIndex} className="grid grid-cols-5 gap-x-4 gap-y-0">
      {fields.map((key) => (
        renderFieldItem(key, trade)
      ))}
    </div>
  );

  return (
    <div className={`${bannerBg} px-8 py-4 border-b`}>
      <div 
        className={`${cardBg} rounded-xl border-l-4 border-l-indigo-500 shadow-sm p-4 cursor-pointer`}
        onClick={() => setExpanded(!expanded)}
      >
        {loading ? (
          <div className="text-sm text-slate-400">加载中...</div>
        ) : !filters.tradeNumber ? (
          <div className="space-y-2">
            {renderRow(firstRowFields, null, 0)}
            {expanded && (
              <>
                {renderRow(secondRowFields, null, 1)}
                {renderRow(thirdRowFields, null, 2)}
              </>
            )}
          </div>
        ) : filteredTrades.length === 0 ? (
          <div className="text-sm text-slate-400">没有符合的交易数据</div>
        ) : (
          <div className="space-y-2">
            {filteredTrades.map((trade, tradeIndex) => (
              <div key={trade.tradeNumber || tradeIndex} className="space-y-2">
                {renderRow(firstRowFields, trade, 0)}
                {expanded && (
                  <>
                    {renderRow(secondRowFields, trade, 1)}
                    {renderRow(thirdRowFields, trade, 2)}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { Header, TriggerEventBanner };
