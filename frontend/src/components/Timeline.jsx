import { useState, useMemo } from 'react';
import {
  Phone,
  Headphones,
  MessageSquare,
  Zap,
  Mail,
  Users,
  ArrowRight,
  AlertTriangle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';

const channelConfig = {
  phone: { icon: Phone, bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', darkBg: 'bg-blue-900/50', darkText: 'text-blue-400', darkBorder: 'border-blue-800' },
  bt: { icon: Headphones, bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', darkBg: 'bg-orange-900/50', darkText: 'text-orange-400', darkBorder: 'border-orange-800' },
  qtrade: { icon: MessageSquare, bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200', darkBg: 'bg-teal-900/50', darkText: 'text-teal-400', darkBorder: 'border-teal-800' },
  ideal: { icon: Zap, bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200', darkBg: 'bg-indigo-900/50', darkText: 'text-indigo-400', darkBorder: 'border-indigo-800' },
  email: { icon: Mail, bg: 'bg-slate-200', text: 'text-slate-600', border: 'border-slate-300', darkBg: 'bg-slate-800', darkText: 'text-slate-400', darkBorder: 'border-slate-700' },
  meeting: { icon: Users, bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', darkBg: 'bg-purple-900/50', darkText: 'text-purple-400', darkBorder: 'border-purple-800' },
};

const riskConfig = {
  high: { labelKey: 'riskLevels.high', bg: 'bg-rose-100', text: 'text-rose-700', badgeBg: 'bg-rose-200', border: 'border-rose-300', line: 'bg-rose-500', darkBg: 'bg-rose-900/30', darkText: 'text-rose-400', darkBadgeBg: 'bg-rose-900/50', darkBorder: 'border-rose-800', darkLine: 'bg-rose-500' },
  medium: { labelKey: 'riskLevels.medium', bg: 'bg-amber-100', text: 'text-amber-700', badgeBg: 'bg-amber-200', border: 'border-amber-300', line: 'bg-amber-500', darkBg: 'bg-amber-900/30', darkText: 'text-amber-400', darkBadgeBg: 'bg-amber-900/50', darkBorder: 'border-amber-800', darkLine: 'bg-amber-500' },
  low: { labelKey: 'riskLevels.low', bg: 'bg-emerald-100', text: 'text-emerald-700', badgeBg: 'bg-emerald-200', border: 'border-emerald-300', line: 'bg-emerald-500', darkBg: 'bg-emerald-900/30', darkText: 'text-emerald-400', darkBadgeBg: 'bg-emerald-900/50', darkBorder: 'border-emerald-800', darkLine: 'bg-emerald-500' },
};

function ContentLines({ content, isDark, expanded }) {
  const { t } = useLanguage();
  
  const lines = content.split('\n').filter(line => line.trim());

  const contentBg = isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-200/50 border-slate-300';
  const textColor = isDark ? 'text-slate-300' : 'text-slate-700';
  const timestampColor = isDark ? 'text-slate-500' : 'text-slate-500';
  const speakerColor = isDark ? 'text-indigo-400' : 'text-indigo-600';

  if (!expanded) {
    return null;
  }

  return (
    <div className={`text-sm ${textColor} leading-relaxed font-mono p-3 rounded border ${contentBg} space-y-1 mt-3`}>
      {lines.map((line, idx) => {
        const match = line.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] \[(.*?)\] (.*)$/);
        if (match) {
          const [, timestamp, speaker, text] = match;
          return (
            <div key={idx} className="flex items-start gap-2">
              <span className={`text-xs ${timestampColor} whitespace-nowrap`}>{timestamp}</span>
              <span className={`text-xs font-semibold ${speakerColor} whitespace-nowrap`}>[{speaker}]</span>
              <span className="flex-1">{text}</span>
            </div>
          );
        }
        return <div key={idx}>{line}</div>;
      })}
    </div>
  );
}

function Timeline({ events, loading, contentTheme = 'light' }) {
  const { t } = useLanguage();
  const isDark = contentTheme === 'dark';
  const [expandedId, setExpandedId] = useState(null);

  // 按时间倒序排列，使用稳定的排序
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [events]);

  const cardBg = isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300';
  const cardText = isDark ? 'text-slate-200' : 'text-slate-800';
  const subText = isDark ? 'text-slate-400' : 'text-slate-600';
  const dotBorder = isDark ? 'border-slate-800' : 'border-slate-100';
  const lineColor = isDark ? '#334e2e8155' : '#f0';
  const emptyBg = isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-dashed border-slate-400';
  const emptyText = isDark ? 'text-slate-400' : 'text-slate-600';
  const contentBg = isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-200 border-slate-300';
  const participantText = isDark ? 'text-slate-300' : 'text-slate-700';
  const labelColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const separatorColor = isDark ? 'text-slate-600' : 'text-slate-300';

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-8 relative">
        <div className="mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-8 relative">
        <div className="mx-auto">
          <div className={`ml-16 p-8 rounded-xl border border-dashed text-center ${emptyBg} ${emptyText}`}>
            <Info className="w-8 h-8 mx-auto mb-3" />
            <p>{t('timeline.noEvents')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 relative">
      <div className="mx-auto relative timeline-line">
        {sortedEvents.map((event, index) => {
          const channel = channelConfig[event.channel] || channelConfig.phone;
          const risk = riskConfig[event.risk] || riskConfig.low;
          const Icon = channel.icon;
          
          const eventChannel = isDark 
            ? { bg: channel.darkBg, text: channel.darkText, border: channel.darkBorder }
            : { bg: channel.bg, text: channel.text, border: channel.border };
          
          const eventRisk = isDark
            ? { bg: risk.darkBg, text: risk.darkText, badgeBg: risk.darkBadgeBg, border: risk.darkBorder, line: risk.darkLine, labelKey: risk.labelKey }
            : { bg: risk.bg, text: risk.text, badgeBg: risk.badgeBg, border: risk.border, line: risk.line, labelKey: risk.labelKey };

          const dateObj = new Date(event.timestamp);
          const dateStr = format(dateObj, 'MMM d, yyyy');
          const timeStr = format(dateObj, 'HH:mm:ss');

          const uniqueKey = `${event.id}-${event.timestamp}-${event.channel}-${index}`;

          return (
            <div key={uniqueKey} className="relative mb-4 flex items-start w-full group">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full border-4 ${dotBorder} ${eventChannel.bg} flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110`}
                >
                  <Icon className={`w-3.5 h-3.5 ${eventChannel.text}`} />
                </div>
                <div className={`text-[10px] font-bold font-mono ${isDark ? 'text-slate-500' : 'text-slate-500'} whitespace-nowrap mt-1`}>
                  {timeStr}
                </div>
              </div>

              <div 
                className={`ml-4 w-full rounded-xl border p-3 shadow-sm card-hover-effect relative ${cardBg} cursor-pointer`}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedId(expandedId === uniqueKey ? null : uniqueKey);
                }}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${eventRisk.line}`}
                ></div>

                <div className="flex items-center">
                  <div className="min-w-0" style={{ width: '240px', flexShrink: 0 }}>
                    <h4 className={`text-sm font-semibold ${cardText} truncate`}>{event.subject}</h4>
                  </div>
                  <div className="flex items-center gap-2" style={{ minWidth: '380px', flexShrink: 0, marginLeft: '50px' }}>
                    <span className={`text-xs ${labelColor} w-10 flex-shrink-0 text-right`}>From:</span>
                    <span className={`text-xs font-medium ${participantText} truncate`} style={{ width: '126px' }}>{event.participants.from}</span>
                    <ArrowRight className={`w-3 h-3 ${subText} flex-shrink-0`} />
                    <span className={`text-xs ${labelColor} w-8 flex-shrink-0 text-right`}>To:</span>
                    <span className={`text-xs font-medium ${participantText} truncate`} style={{ width: '126px' }}>{event.participants.to}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                    {event.indicators && event.indicators.length > 0 && event.indicators.map((indicator, idx) => {
                      let colorClass = isDark 
                        ? 'bg-slate-700 text-slate-300 border-slate-600'
                        : 'bg-slate-100 text-slate-600 border-slate-200';
                      let IconComponent = Info;
                      
                      if (indicator.type === 'danger') {
                        colorClass = isDark
                          ? 'bg-rose-900/50 text-rose-400 border-rose-700'
                          : 'bg-rose-50 text-rose-700 border-rose-200';
                        IconComponent = AlertTriangle;
                      } else if (indicator.type === 'warning') {
                        colorClass = isDark
                          ? 'bg-amber-900/50 text-amber-400 border-amber-700'
                          : 'bg-amber-50 text-amber-700 border-amber-200';
                        IconComponent = AlertCircle;
                      } else if (indicator.type === 'info') {
                        colorClass = isDark
                          ? 'bg-blue-900/50 text-blue-400 border-blue-700'
                          : 'bg-blue-50 text-blue-700 border-blue-200';
                        IconComponent = Info;
                      }

                      return (
                        <span
                          key={idx}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border flex-shrink-0 ${colorClass}`}
                        >
                          <IconComponent className="w-3 h-3 mr-1" />
                          {indicator.label}
                        </span>
                      );
                    })}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border flex-shrink-0 ${eventRisk.badgeBg} ${eventRisk.text} ${eventRisk.border}`}
                    >
                      {t(eventRisk.labelKey)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border flex-shrink-0 ${
                        isDark ? 'bg-slate-700 text-indigo-400 border-slate-600' : 'bg-slate-100 text-indigo-700 border-slate-200'
                      }`}
                    >
                      {event.totalScore || 0}pts
                    </span>
                  </div>
                </div>

                <ContentLines content={event.content} isDark={isDark} expanded={expandedId === uniqueKey} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mx-auto relative mt-8 flex items-center">
        <div className={`w-4 h-4 rounded-full border-4 ${dotBorder} z-10`} style={{ backgroundColor: isDark ? '#475569' : '#e2e8f0' }}></div>
        <div className={`ml-4 text-sm font-medium ${subText}`}>{t('header.endOfTimeline')}</div>
      </div>

      <style>{`
        .timeline-line::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 24px;
          width: 2px;
          background: ${lineColor};
          z-index: 0;
        }
        
        .card-hover-effect {
          transition: all 0.2s ease-in-out;
        }
        .card-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          ${isDark ? 'border-color: #4338ca;' : 'border-color: #c7d2fe;'}
        }
      `}</style>
    </div>
  );
}

export default Timeline;
