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
    riskLevels: ['high', 'medium', 'low'],
    channels: ['phone', 'bt', 'qtrade', 'ideal', 'reuters', 'email', 'bloomberg'],
    tradeNumber: '',
    scoreThreshold: 0,
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
        // If channels or riskLevels is empty, return empty results
        if (filters.channels.length === 0 || filters.riskLevels.length === 0) {
          setEvents([]);
          setLoading(false);
          return;
        }
        
        const response = await eventsApi.getAll({
          participant: filters.participant,
          tradeId: filters.tradeId,
          riskLevels: filters.riskLevels.join(','),
          channels: filters.channels.join(','),
          tradeNumber: filters.tradeNumber,
          scoreThreshold: filters.scoreThreshold,
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
        // If channels or riskLevels is empty, return zero stats
        if (filters.channels.length === 0 || filters.riskLevels.length === 0) {
          setRiskStats({ stats: { high: 0, medium: 0, low: 0 }, total: 0 });
          return;
        }
        
        const response = await riskLevelsApi.getStats({
          participant: filters.participant,
          tradeId: filters.tradeId,
          riskLevels: filters.riskLevels.join(','),
          channels: filters.channels.join(','),
          tradeNumber: filters.tradeNumber,
          scoreThreshold: filters.scoreThreshold,
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
