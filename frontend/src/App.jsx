import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';
import { Header, TriggerEventBanner } from './components/Header';
import { eventsApi, riskLevelsApi, tradesApi } from './api';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { contentTheme } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riskStats, setRiskStats] = useState({ stats: { high: 0, medium: 0, low: 0 }, total: 0 });
  const [trades, setTrades] = useState([]);
  const [filters, setFilters] = useState({
    participant: '',
    tradeId: '',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    riskLevels: ['high', 'medium', 'low'],
    channels: ['phone', 'bt', 'qtrade', 'ideal', 'reuters', 'email', 'bloomberg'],
    tradeNumber: '',
  });

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await tradesApi.getAll();
        setTrades(response.data.trades);
      } catch (error) {
        console.error('Error fetching trades:', error);
      }
    };

    fetchTrades();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await eventsApi.getAll({
          participant: filters.participant,
          tradeId: filters.tradeId,
          startDate: filters.startDate,
          endDate: filters.endDate,
          riskLevels: filters.riskLevels.join(','),
          channels: filters.channels.join(','),
          tradeNumber: filters.tradeNumber,
        });
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  useEffect(() => {
    const fetchRiskStats = async () => {
      try {
        const response = await riskLevelsApi.getStats({
          participant: filters.participant,
          tradeId: filters.tradeId,
          startDate: filters.startDate,
          endDate: filters.endDate,
          riskLevels: filters.riskLevels.join(','),
          channels: filters.channels.join(','),
          tradeNumber: filters.tradeNumber,
        });
        setRiskStats(response.data);
      } catch (error) {
        console.error('Error fetching risk stats:', error);
      }
    };

    fetchRiskStats();
  }, [filters]);

  return (
    <div className="flex h-screen overflow-hidden text-slate-800">
      <Sidebar filters={filters} onFilterChange={setFilters} riskStats={riskStats} trades={trades} />
      
      <main className={`flex-1 flex flex-col h-full relative ${contentTheme === 'dark' ? 'bg-slate-900' : 'bg-slate-200'}`}>
        <Header contentTheme={contentTheme} />
        <TriggerEventBanner filters={filters} />
        <Timeline events={events} loading={loading} contentTheme={contentTheme} />
      </main>
    </div>
  );
}

export default App;
