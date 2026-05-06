'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Monitor, Cpu, Gpu, Gamepad2, Filter } from 'lucide-react';
import { PCBuildAPI, APIUtils } from '@/services/api';
import { GRAPHQL_TYPES } from '@/graphql';
import type { BenchmarkData } from '@/types/graphql';

interface FilterState {
  cpu?: string;
  gpu?: string;
  game?: string;
  resolution?: string;
  settings?: string;
  minFps?: number;
}

export const BenchmarkViewer: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({});
  const [showFilters, setShowFilters] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBenchmarks();
  }, [filters]);

  const loadBenchmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const filter = APIUtils.createBenchmarkFilter(filters);
      const response = await PCBuildAPI.getBenchmarks(filter);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load benchmarks');
    } finally {
      setLoading(false);
    }
  };

  const resolutions = ['1080p', '1440p', '4K'];
  const settings = ['Low', 'Medium', 'High', 'Ultra', 'Max'];

  const handleFilterChange = (key: keyof FilterState, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getFpsColor = (fps: number) => {
    if (fps >= 120) return 'text-green-600';
    if (fps >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceData = () => {
    if (!data?.benchmarks?.items) return [];
    
    return data.benchmarks.items.map((benchmark: BenchmarkData) => ({
      name: `${benchmark.game} (${benchmark.resolution})`,
      avgFps: benchmark.avgFps,
      minFps: benchmark.minFps,
      maxFps: benchmark.maxFps,
      cpuUsage: benchmark.cpuUsage,
      gpuUsage: benchmark.gpuUsage,
    }));
  };

  const getFrameTimeData = () => {
    if (!data?.benchmarks?.items) return [];
    
    return data.benchmarks.items.map((benchmark: BenchmarkData) => ({
      name: benchmark.game,
      frameTime: benchmark.frameTime,
      temperature: benchmark.temperature,
    }));
  };

  if (loading) return <div className="p-6">Loading benchmarks...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading benchmarks: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gaming Benchmarks</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPU</label>
              <select
                value={filters.cpu || ''}
                onChange={(e) => handleFilterChange('cpu', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All CPUs</option>
                {data?.popularCPUs?.map((cpu: string) => (
                  <option key={cpu} value={cpu}>{cpu}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GPU</label>
              <select
                value={filters.gpu || ''}
                onChange={(e) => handleFilterChange('gpu', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All GPUs</option>
                {data?.popularGPUs?.map((gpu: string) => (
                  <option key={gpu} value={gpu}>{gpu}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Game</label>
              <select
                value={filters.game || ''}
                onChange={(e) => handleFilterChange('game', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Games</option>
                {data?.popularGames?.map((game: string) => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
              <select
                value={filters.resolution || ''}
                onChange={(e) => handleFilterChange('resolution', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Resolutions</option>
                {resolutions.map(res => (
                  <option key={res} value={res}>{res}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Settings</label>
              <select
                value={filters.settings || ''}
                onChange={(e) => handleFilterChange('settings', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Settings</option>
                {settings.map(setting => (
                  <option key={setting} value={setting}>{setting}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min FPS</label>
              <input
                type="number"
                value={filters.minFps || ''}
                onChange={(e) => handleFilterChange('minFps', parseInt(e.target.value) || undefined)}
                placeholder="0"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            FPS Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getFpsData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgFps" fill="#3b82f6" name="Avg FPS" />
              <Bar dataKey="minFps" fill="#ef4444" name="Min FPS" />
              <Bar dataKey="maxFps" fill="#10b981" name="Max FPS" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5" />
            Frame Time & Temperature
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getFrameTimeData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="frameTime" stroke="#8b5cf6" name="Frame Time (ms)" />
              <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#f97316" name="Temperature (°C)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Benchmark Results</h2>
          <p className="text-sm text-gray-600 mt-1">
            Showing {data?.benchmarks?.items?.length || 0} of {data?.benchmarks?.total || 0} results
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GPU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resolution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Settings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg FPS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min/Max FPS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frame Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.benchmarks?.items?.map((benchmark: BenchmarkData) => (
                <tr key={benchmark.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Gamepad2 className="w-4 h-4 mr-2 text-purple-500" />
                      <span className="text-sm font-medium text-gray-900">{benchmark.game}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Cpu className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm text-gray-900">{benchmark.cpuModel.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Gpu className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm text-gray-900">{benchmark.gpuModel.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-900">{benchmark.resolution}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {benchmark.settings}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-lg font-bold ${getFpsColor(benchmark.avgFps)}`}>
                      {benchmark.avgFps}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {benchmark.minFps} / {benchmark.maxFps}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {benchmark.frameTime}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center">
                        <span className="w-16">CPU:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${benchmark.cpuUsage}%` }}
                          />
                        </div>
                        <span className="ml-2 w-10 text-right">{benchmark.cpuUsage}%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-16">GPU:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${benchmark.gpuUsage}%` }}
                          />
                        </div>
                        <span className="ml-2 w-10 text-right">{benchmark.gpuUsage}%</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
