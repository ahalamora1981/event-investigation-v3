import { useState } from 'react';
import {
  Phone,
  Headphones,
  MessageSquare,
  Zap,
  Mail,
  Users,
  Newspaper,
  Radio,
  DollarSign,
  Play,
} from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const channelConfig = {
  phone: { icon: Phone, bg: 'bg-blue-500', hoverBg: 'hover:bg-blue-600' },
  bt: { icon: Headphones, bg: 'bg-orange-500', hoverBg: 'hover:bg-orange-600' },
  qtrade: { icon: MessageSquare, bg: 'bg-teal-500', hoverBg: 'hover:bg-teal-600' },
  ideal: { icon: Zap, bg: 'bg-indigo-500', hoverBg: 'hover:bg-indigo-600' },
  email: { icon: Mail, bg: 'bg-slate-500', hoverBg: 'hover:bg-slate-600' },
  meeting: { icon: Users, bg: 'bg-purple-500', hoverBg: 'hover:bg-purple-600' },
  reuters: { icon: Newspaper, bg: 'bg-rose-500', hoverBg: 'hover:bg-rose-600' },
  bloomberg: { icon: Radio, bg: 'bg-cyan-500', hoverBg: 'hover:bg-cyan-600' },
};

const riskConfig = {
  high: { bg: 'bg-rose-500', border: 'border-rose-300' },
  medium: { bg: 'bg-amber-500', border: 'border-amber-300' },
  low: { bg: 'bg-emerald-500', border: 'border-emerald-300' },
};

function HorizontalTimeline({ events, allPositionEvents, trades, filters }) {
  const { getChannelLabel } = useLanguage();
  const { contentTheme } = useTheme();
  const [hoveredItem, setHoveredItem] = useState(null);

  const isDark = contentTheme === 'dark';

  // 过滤交易记录：只显示选中的交易
  const filteredTrades = filters?.tradeNumber 
    ? trades.filter(trade => trade.tradeNumber === filters.tradeNumber)
    : [];

  // 所有记录（用于计算位置基准）- 排除低风险，只包含高、中风险和交易
  const allRecordsForPosition = [
    ...allPositionEvents.filter(event => event.risk !== 'low').map(event => ({
      type: 'communication',
      ...event,
    })),
    ...filteredTrades.map(trade => ({
      type: 'trade',
      ...trade,
      timestamp: trade.tradeTime,
    })),
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // 当前显示记录（根据风险等级、渠道等过滤器）- 横向时间轴不显示低风险
  const displayedRecords = events.filter(record => {
    if (filters?.riskLevels && !filters.riskLevels.includes(record.risk)) {
      return false;
    }
    if (filters?.channels && !filters.channels.includes(record.channel)) {
      return false;
    }
    if (record.risk === 'low') {
      return false;
    }
    return true;
  }).map(event => ({
    type: 'communication',
    ...event,
  }));

  // 添加交易记录到显示列表
  filteredTrades.forEach(trade => {
    displayedRecords.push({
      type: 'trade',
      ...trade,
      timestamp: trade.tradeTime,
    });
  });

  // 排序显示记录
  displayedRecords.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  if (allRecordsForPosition.length === 0) {
    return null;
  }

  // 过滤掉时间戳无效的 records（用于位置计算）
  const validAllRecords = allRecordsForPosition.filter(record => {
    const date = new Date(record.timestamp);
    return !isNaN(date.getTime());
  });

  // 当前显示的有效记录
  const validDisplayedRecords = displayedRecords.filter(record => {
    const date = new Date(record.timestamp);
    return !isNaN(date.getTime());
  });

  if (validDisplayedRecords.length === 0) {
    return null;
  }

  // 计算时间范围（基于所有记录）
  const startTime = new Date(validAllRecords[0].timestamp);
  const endTime = new Date(validAllRecords[validAllRecords.length - 1].timestamp);
  const timeRange = endTime - startTime;

  // 计算均匀分布的位置（基于所有记录）
  const getEvenPosition = (record) => {
    if (validAllRecords.length === 1) return 50;
    const padding = 8; // 两边各留 8% 的空白
    // 查找记录在所有记录中的索引
    const index = validAllRecords.findIndex(r => 
      r.type === record.type && 
      r.timestamp === record.timestamp &&
      (r.type === 'communication' ? r.id === record.id : r.tradeNumber === record.tradeNumber)
    );
    if (index === -1) return 50;
    const step = (100 - padding * 2) / (validAllRecords.length - 1);
    return padding + step * index;
  };

  const handleMouseEnter = (record, index) => {
    setHoveredItem({ ...record, position: getEvenPosition(record), index });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  // 格式化时间的辅助函数
  const formatTime = (timestamp, full = false) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '--:--';
      return format(date, full ? 'yyyy-MM-dd HH:mm:ss' : 'HH:mm');
    } catch {
      return '--:--';
    }
  };

  const timelineLineColor = isDark ? 'border-slate-600' : 'border-slate-400';
  const timeTextColor = isDark ? 'text-slate-400' : 'text-slate-600';
  const tooltipBg = isDark ? 'bg-slate-800 border-slate-600' : 'bg-slate-700 border-slate-600';
  const tooltipText = 'text-white';
  const tooltipSubText = 'text-slate-300';

  const renderTooltip = (record, position) => {
    return (
      <div
        className={`absolute z-50 ${tooltipBg} ${tooltipText} rounded-lg shadow-xl p-3 min-w-[240px] border bottom-full mb-2 whitespace-nowrap`}
        style={{
          left: `${position}%`,
          transform: 'translateX(-50%)',
        }}
      >
        {record.type === 'communication' ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              {(() => {
                const ChannelIcon = channelConfig[record.channel]?.icon || Phone;
                return <ChannelIcon className="w-3.5 h-3.5" />;
              })()}
              <span className="text-xs font-semibold">{getChannelLabel(record.channel)}</span>
            </div>
            <div className={`text-[10px] ${tooltipSubText}`}>
              {formatTime(record.timestamp, true)}
            </div>
            <div className={`text-xs font-medium mt-1 truncate max-w-[220px]`} title={record.subject}>
              {record.subject}
            </div>
            <div className={`text-[10px] ${tooltipSubText} mt-1`}>
              <div className="truncate max-w-[200px]">From: {record.participants?.from}</div>
              <div className="truncate max-w-[200px]">To: {record.participants?.to}</div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold">交易</span>
            </div>
            <div className={`text-[10px] ${tooltipSubText}`}>
              {formatTime(record.timestamp, true)}
            </div>
            <div className={`text-xs font-medium mt-1`}>{record.productName}</div>
            <div className={`text-[10px] ${tooltipSubText} mt-1`}>
              {record.tradeNumber}
            </div>
          </div>
        )}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-700"
        />
      </div>
    );
  };

  return (
    <div className="relative w-full pt-4 pb-1 px-2 mx-2 mt-2 mb-1">
      {/* 节点和时间线在同一层 */}
      <div className="relative w-full" style={{ height: '56px' }}>
        {/* 时间轴线 - 贯穿整个容器，两边突出一些 */}
        <div
          className={`absolute ${timelineLineColor} border-t-2`}
          style={{
            left: '5%',
            right: '5%',
            top: '28px',
          }}
        ></div>
        
        {/* 右箭头 - 和时间线同一水平，在时间线右端 */}
        <div
          className={`absolute ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
          style={{
            right: '4.5%',
            top: '22px',
          }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </div>
        
        {/* 节点 */}
        {validDisplayedRecords.map((record, index) => {
          const position = getEvenPosition(record);
          const isHovered = hoveredItem?.index === index;

          if (record.type === 'trade') {
            // 交易记录 - 黑色菱形
            return (
              <div
                key={`trade-${record.tradeNumber}-${record.timestamp}`}
                className="absolute transform -translate-x-1/2 cursor-pointer"
                style={{ left: `${position}%` }}
                onMouseEnter={() => handleMouseEnter(record, index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex flex-col items-center" style={{ height: '56px' }}>
                  {/* Icon - 顶部 */}
                  <div className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} style={{ marginBottom: '2px' }}>
                    <DollarSign className="w-4 h-4" />
                  </div>
                  {/* 菱形节点 - 绝对定位，中心对准时间轴线 (28px) */}
                  <div
                    className={`absolute w-3 h-3 bg-slate-800 rotate-45 transform transition-transform ${
                      isHovered ? 'scale-125' : ''
                    }`}
                    style={{ 
                      left: '50%',
                      transform: 'translateX(-50%) rotate(45deg)',
                      top: '22px' // 28px - 6px (菱形半径) = 22px
                    }}
                  />
                  {/* 时间 - 底部 */}
                  <div className={`text-[10px] font-mono ${timeTextColor} whitespace-nowrap mt-auto`} style={{ paddingTop: '2px' }}>
                    {formatTime(record.timestamp)}
                  </div>
                </div>
              </div>
            );
          } else {
            // 通信记录 - 彩色圆点
            const channel = channelConfig[record.channel] || channelConfig.phone;
            const risk = riskConfig[record.risk] || riskConfig.low;
            const ChannelIcon = channel.icon;

            return (
              <div
                key={`comm-${record.id}-${record.timestamp}`}
                className="absolute transform -translate-x-1/2 cursor-pointer"
                style={{ left: `${position}%` }}
                onMouseEnter={() => handleMouseEnter(record, index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex flex-col items-center" style={{ height: '56px' }}>
                  {/* Icon - 顶部 */}
                  <div className={`${isDark ? 'text-white' : channel.text}`} style={{ marginBottom: '2px' }}>
                    <ChannelIcon className="w-4 h-4" />
                  </div>
                  {/* 圆点节点 - 绝对定位，中心对准时间轴线 (28px) */}
                  <div
                    className={`absolute w-3 h-3 rounded-full ${risk.bg} border-2 ${risk.border} transition-transform ${
                      isHovered ? 'scale-125' : ''
                    }`}
                    style={{ 
                      left: '50%',
                      transform: 'translateX(-50%)',
                      top: '22px' // 28px - 6px (圆点半径) = 22px
                    }}
                  />
                  {/* 时间 - 底部 */}
                  <div className={`text-[10px] font-mono ${timeTextColor} whitespace-nowrap mt-auto`} style={{ paddingTop: '2px' }}>
                    {formatTime(record.timestamp)}
                  </div>
                </div>
              </div>
            );
          }
        })}
        
        {/* Tooltip - 在外层渲染 */}
        {hoveredItem && renderTooltip(hoveredItem, hoveredItem.position)}
      </div>
    </div>
  );
}

export default HorizontalTimeline;
