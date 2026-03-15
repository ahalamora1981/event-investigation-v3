import { useState } from 'react';
import {
  Phone,
  Headphones,
  MessageSquare,
  Zap,
  Mail,
  Users,
  ArrowRight,
  Clock,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

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

function ContentLines({ content, isDark }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();
  
  const lines = content.split('\n').filter(line => line.trim());

  const contentBg = isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-200/50 border-slate-300';
  const textColor = isDark ? 'text-slate-300' : 'text-slate-700';
  const timestampColor = isDark ? 'text-slate-500' : 'text-slate-500';
  const speakerColor = isDark ? 'text-indigo-400' : 'text-indigo-600';

  return (
    <div className="mt-3">
      {expanded ? (
        <>
          <div className={`text-sm ${textColor} leading-relaxed font-mono p-3 rounded border ${contentBg} space-y-1`}>
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
          <button
            onClick={() => setExpanded(false)}
            className="mt-2 flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-400 font-medium transition-colors"
          >
            <ChevronUp className="w-3 h-3" />
            {t('timeline.collapseContent')}
          </button>
        </>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-400 font-medium transition-colors"
        >
          <ChevronDown className="w-3 h-3" />
          {t('timeline.expandContent')} ({lines.length})
        </button>
      )}
    </div>
  );
}

function Timeline({ events, loading, contentTheme = 'light' }) {
  const { t, getChannelLabel } = useLanguage();
  const isDark = contentTheme === 'dark';

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
  const borderColor = isDark ? 'border-slate-600' : 'border-slate-100';

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
        {events.map((event) => {
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

          return (
            <div key={`${event.id}-${event.timestamp}`} className="relative mb-4 flex items-start w-full group">
              <div
                className={`absolute left-[10px] w-8 h-8 rounded-full border-4 ${dotBorder} ${eventChannel.bg} flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110`}
              >
                <Icon className={`w-3.5 h-3.5 ${eventChannel.text}`} />
              </div>

              <div className={`ml-16 w-full rounded-xl border p-3 shadow-sm card-hover-effect relative ${cardBg}`}>
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${eventRisk.line}`}
                ></div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <span className={`text-xs font-bold uppercase tracking-wider ${eventChannel.text} flex-shrink-0`}>
                      {getChannelLabel(event.channel)}
                    </span>
                    <span className={separatorColor}>&bull;</span>
                    <span className={`text-xs font-medium ${subText} flex-shrink-0`}>
                      {dateStr} - {timeStr}
                    </span>
                    <span className={separatorColor}>&bull;</span>
                    <h4 className={`text-sm font-semibold ${cardText} truncate flex-1 min-w-0`}>{event.subject}</h4>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                    {event.duration && (
                      <span className={`flex items-center text-xs ${subText}`}>
                        <Clock className="w-3 h-3 mr-1" />
                        {event.duration}
                      </span>
                    )}
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
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}
                        >
                          <IconComponent className="w-3 h-3 mr-1" />
                          {indicator.label}
                        </span>
                      );
                    })}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${eventRisk.badgeBg} ${eventRisk.text} ${eventRisk.border}`}
                    >
                      {t(eventRisk.labelKey)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                        isDark ? 'bg-slate-700 text-indigo-400 border-slate-600' : 'bg-slate-100 text-indigo-700 border-slate-200'
                      }`}
                    >
                      相关性：{event.totalScore || 0}分
                    </span>
                  </div>
                </div>

                <div className={`rounded-lg p-2 mb-2 border ${contentBg}`}>
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${labelColor}`}>From: </span>
                      <span className={`text-sm font-medium ${participantText} truncate`}>{event.participants.from}</span>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${subText} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${labelColor}`}>To: </span>
                      <span className={`text-sm font-medium ${participantText} truncate`}>{event.participants.to}</span>
                    </div>
                  </div>
                </div>

                <ContentLines content={event.content} isDark={isDark} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mx-auto relative mt-8 flex items-center">
        <div className={`absolute left-[16px] w-4 h-4 rounded-full border-4 ${dotBorder} z-10`} style={{ backgroundColor: isDark ? '#475569' : '#e2e8f0' }}></div>
        <div className={`ml-16 text-sm font-medium ${subText}`}>{t('header.endOfTimeline')}</div>
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
