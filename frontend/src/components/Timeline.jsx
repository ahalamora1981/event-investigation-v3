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

const channelConfig = {
  phone: { icon: Phone, bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  bt: { icon: Headphones, bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
  qtrade: { icon: MessageSquare, bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' },
  ideal: { icon: Zap, bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
  email: { icon: Mail, bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
  meeting: { icon: Users, bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
};

const riskConfig = {
  high: { labelKey: 'riskLevels.high', bg: 'bg-rose-50', text: 'text-rose-700', badgeBg: 'bg-rose-100', border: 'border-rose-200', line: 'bg-rose-500' },
  medium: { labelKey: 'riskLevels.medium', bg: 'bg-amber-50', text: 'text-amber-700', badgeBg: 'bg-amber-100', border: 'border-amber-200', line: 'bg-amber-500' },
  low: { labelKey: 'riskLevels.low', bg: 'bg-emerald-50', text: 'text-emerald-700', badgeBg: 'bg-emerald-100', border: 'border-emerald-200', line: 'bg-emerald-500' },
};

function ContentLines({ content }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();
  
  const lines = content.split('\n').filter(line => line.trim());

  return (
    <div className="mt-3">
      {expanded ? (
        <>
          <div className="text-sm text-slate-600 leading-relaxed font-mono bg-slate-50/50 p-3 rounded border border-slate-100 space-y-1">
            {lines.map((line, idx) => {
              const match = line.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] \[(.*?)\] (.*)$/);
              if (match) {
                const [, timestamp, speaker, text] = match;
                return (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-xs text-slate-400 whitespace-nowrap">{timestamp}</span>
                    <span className="text-xs font-semibold text-indigo-600 whitespace-nowrap">[{speaker}]</span>
                    <span className="flex-1">{text}</span>
                  </div>
                );
              }
              return <div key={idx}>{line}</div>;
            })}
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="mt-2 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <ChevronUp className="w-3 h-3" />
            {t('timeline.collapseContent')}
          </button>
        </>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <ChevronDown className="w-3 h-3" />
          {t('timeline.expandContent')} ({lines.length})
        </button>
      )}
    </div>
  );
}

function Timeline({ events, loading }) {
  const { t, getChannelLabel } = useLanguage();

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto px-8 py-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-8 py-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="ml-16 bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-500">
            <Info className="w-8 h-8 mx-auto mb-3 text-slate-400" />
            <p>{t('timeline.noEvents')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 relative">
      <div className="max-w-4xl mx-auto relative timeline-line">
        {events.map((event) => {
          const channel = channelConfig[event.channel] || channelConfig.phone;
          const risk = riskConfig[event.risk] || riskConfig.low;
          const Icon = channel.icon;
          
          const dateObj = new Date(event.timestamp);
          const dateStr = format(dateObj, 'MMM d, yyyy');
          const timeStr = format(dateObj, 'HH:mm:ss');

          return (
            <div key={event.id} className="relative mb-8 flex items-start w-full group">
              <div
                className={`absolute left-[10px] w-8 h-8 rounded-full border-4 border-white ${channel.bg} flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110`}
              >
                <Icon className={`w-3.5 h-3.5 ${channel.text}`} />
              </div>

              <div className="ml-16 w-full bg-white rounded-xl border border-slate-200 p-5 shadow-sm card-hover-effect relative">
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${risk.line}`}
                ></div>

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs font-bold uppercase tracking-wider ${channel.text}`}>
                        {getChannelLabel(event.channel)}
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-xs font-medium text-slate-500">
                        {dateStr} - {timeStr}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800">{event.subject}</h4>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${risk.badgeBg} ${risk.text} ${risk.border}`}
                    >
                      {t(risk.labelKey)}
                    </span>
                    {event.duration && (
                      <span className="flex items-center text-xs text-slate-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {event.duration}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 mb-3 border border-slate-100 flex items-center space-x-3">
                  <div className="flex-1">
                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-0.5">{t('timeline.from')}</p>
                    <p className="text-sm font-medium text-slate-700">{event.participants.from}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-0.5">{t('timeline.to')}</p>
                    <p className="text-sm font-medium text-slate-700">{event.participants.to}</p>
                  </div>
                </div>

                <ContentLines content={event.content} />

                {event.indicators && event.indicators.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                    {event.indicators.map((indicator, idx) => {
                      let colorClass = 'bg-slate-100 text-slate-600 border-slate-200';
                      let IconComponent = Info;
                      
                      if (indicator.type === 'danger') {
                        colorClass = 'bg-rose-50 text-rose-700 border-rose-200';
                        IconComponent = AlertTriangle;
                      } else if (indicator.type === 'warning') {
                        colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
                        IconComponent = AlertCircle;
                      } else if (indicator.type === 'info') {
                        colorClass = 'bg-blue-50 text-blue-700 border-blue-200';
                        IconComponent = Info;
                      }

                      return (
                        <span
                          key={idx}
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${colorClass}`}
                        >
                          <IconComponent className="w-3 h-3 mr-1" />
                          {indicator.label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-4xl mx-auto relative mt-8 flex items-center">
        <div className="absolute left-[16px] w-4 h-4 bg-slate-200 rounded-full border-4 border-white z-10"></div>
        <div className="ml-16 text-sm text-slate-400 font-medium">{t('header.endOfTimeline')}</div>
      </div>

      <style>{`
        .timeline-line::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 24px;
          width: 2px;
          background: #e2e8f0;
          z-index: 0;
        }
        
        .card-hover-effect {
          transition: all 0.2s ease-in-out;
        }
        .card-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border-color: #c7d2fe;
        }
      `}</style>
    </div>
  );
}

export default Timeline;
