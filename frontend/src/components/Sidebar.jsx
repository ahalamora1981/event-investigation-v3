import { Search, BarChart2, ShieldAlert, Phone, Headphones, MessageSquare, Zap, Mail, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const channels = [
  { id: 'phone', icon: Phone, color: 'text-blue-400' },
  { id: 'bt', icon: Headphones, color: 'text-orange-400' },
  { id: 'qtrade', icon: MessageSquare, color: 'text-teal-400' },
  { id: 'ideal', icon: Zap, color: 'text-indigo-400' },
  { id: 'email', icon: Mail, color: 'text-amber-400' },
  { id: 'meeting', icon: Users, color: 'text-purple-400' },
];

const riskLevels = [
  { id: 'high', labelKey: 'riskLevels.high', color: 'bg-rose-500' },
  { id: 'medium', labelKey: 'riskLevels.medium', color: 'bg-amber-500' },
  { id: 'low', labelKey: 'riskLevels.low', color: 'bg-emerald-500' },
];

function Sidebar({ filters, onFilterChange, riskStats }) {
  const { t, getChannelLabel } = useLanguage();

  const handleChannelToggle = (channelId) => {
    const newChannels = filters.channels.includes(channelId)
      ? filters.channels.filter((c) => c !== channelId)
      : [...filters.channels, channelId];
    onFilterChange({ ...filters, channels: newChannels });
  };

  const handleRiskToggle = (riskId) => {
    const newRisks = filters.riskLevels.includes(riskId)
      ? filters.riskLevels.filter((r) => r !== riskId)
      : [...filters.riskLevels, riskId];
    onFilterChange({ ...filters, riskLevels: newRisks });
  };

  return (
    <aside className="w-80 bg-slate-900 text-slate-300 flex flex-col h-full shadow-2xl z-20 flex-shrink-0">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-indigo-500 p-2 rounded-lg text-white">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">{t('app.title')}</h1>
          <p className="text-xs text-slate-400">{t('app.subtitle')}</p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-8">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{t('sidebar.searchContext')}</h3>
          
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t('sidebar.participants')}</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={filters.participant}
                onChange={(e) => onFilterChange({ ...filters, participant: e.target.value })}
                placeholder={t('sidebar.participantsPlaceholder')}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">{t('sidebar.tradeIdAsset')}</label>
            <div className="relative">
              <BarChart2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={filters.tradeId}
                onChange={(e) => onFilterChange({ ...filters, tradeId: e.target.value })}
                placeholder={t('sidebar.tradeIdPlaceholder')}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t('sidebar.fromDate')}</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t('sidebar.toDate')}</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            {t('sidebar.riskLevel')}
          </h3>
          <div className="flex flex-col space-y-2">
            {riskLevels.map((risk) => (
              <label key={risk.id} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={filters.riskLevels.includes(risk.id)}
                    onChange={() => handleRiskToggle(risk.id)}
                    className="form-checkbox h-4 w-4 text-rose-500 rounded border-slate-600 bg-slate-800 focus:ring-rose-500 focus:ring-offset-slate-900"
                  />
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${risk.color}`}></span>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{t(risk.labelKey)}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700 w-14 text-center">
                  {riskStats?.stats?.[risk.id] || 0}
                </span>
              </label>
            ))}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-700">
              <span className="text-sm text-white font-semibold">{t('sidebar.total')}</span>
              <span className="text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700 w-14 text-center">
                {riskStats?.total || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{t('sidebar.channels')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const isActive = filters.channels.includes(channel.id);
              return (
                <button
                  key={channel.id}
                  onClick={() => handleChannelToggle(channel.id)}
                  className={`flex items-center justify-start space-x-2 border rounded-lg py-2 px-3 transition-colors ${
                    isActive
                      ? 'bg-teal-500/10 border-slate-500'
                      : 'bg-slate-800 border-slate-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? channel.color : 'text-slate-400'}`} />
                  <span className={`text-xs truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>{getChannelLabel(channel.id)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center space-x-3">
          <img
            src="https://ui-avatars.com/api/?name=Investigator+Admin&background=4f46e5&color=fff"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-medium text-white">Investigator Admin</p>
            <p className="text-xs text-slate-500">ID: INV-4492</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
