import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';
import { Header, TriggerEventBanner } from './components/Header';
import { eventsApi, riskLevelsApi } from './api';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { contentTheme } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riskStats, setRiskStats] = useState({ stats: { high: 0, medium: 0, low: 0 }, total: 0 });
  const [filters, setFilters] = useState({
    participant: '',
    tradeId: '',
    startDate: '2026-01-19',
    endDate: '2026-01-20',
    riskLevels: ['high', 'medium', 'low'],
    channels: ['phone', 'bt', 'qtrade', 'ideal', 'email', 'meeting'],
  });

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
      <Sidebar filters={filters} onFilterChange={setFilters} riskStats={riskStats} />
      
      <main className={`flex-1 flex flex-col h-full relative ${contentTheme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
        <Header contentTheme={contentTheme} />
        <TriggerEventBanner contentTheme={contentTheme} />
        <Timeline events={events} loading={loading} contentTheme={contentTheme} />
      </main>
    </div>
  );
}

export default App;
