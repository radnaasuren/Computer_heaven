'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Monitor, Cpu, Gpu, Gamepad2, Filter } from 'lucide-react';
import {
  fetchBenchmarkViewerData,
  type BenchmarkViewerPayload,
  type PcPartsBenchmark,
} from '@/lib/pc-parts-api';

interface FilterState {
  cpu?: string;
  gpu?: string;
  ram?: string;
  game?: string;
  preset?: string;
  resolution?: string;
  settings?: string;
  minFps?: number;
}

const LEGACY_SETTINGS_OPTIONS = ['Low', 'Medium', 'High', 'Ultra'] as const;

export const BenchmarkViewer: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({});
  const [showFilters, setShowFilters] = useState(false);
  const [data, setData] = useState<BenchmarkViewerPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBenchmarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await fetchBenchmarkViewerData({
        cpu: filters.cpu,
        gpu: filters.gpu,
        ram: filters.ram,
        game: filters.game,
        preset: filters.preset,
        resolution: filters.resolution,
        settings: filters.settings,
        minFps: filters.minFps,
        page: 1,
        limit: 50,
      });
      setData(payload);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to load benchmarks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void Promise.resolve().then(() => loadBenchmarks());
  }, [loadBenchmarks]);

  const resolutions = ['1080p', '1440p', '4K'];

  const handleFilterChange = (key: keyof FilterState, value: string | number | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getFpsColor = (fps: number) => {
    if (fps >= 120) return 'text-green-600';
    if (fps >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const presetFilterOptions = Array.from(
    new Set([
      ...LEGACY_SETTINGS_OPTIONS,
      ...(data?.popularPresets ?? []),
    ]),
  ).sort((a, b) => a.localeCompare(b));

  const getFpsChartRows = () => {
    if (!data?.benchmarks?.items?.length) return [];
    return data.benchmarks.items.map((b: PcPartsBenchmark) => ({
      name: b.chartLabel,
      fps: b.fps,
    }));
  };

  const getFrameTimeRows = () => {
    if (!data?.benchmarks?.items?.length) return [];
    return data.benchmarks.items.map((b: PcPartsBenchmark) => ({
      name: b.chartLabel,
      frameTimeMs: Math.round(1000 / Math.max(b.fps, 1)),
    }));
  };

  if (loading) return <div className="p-6">Loading benchmarks...</div>;
  if (error)
    return (
      <div className="p-6 text-red-600">
        Error loading benchmarks: {error}
        <p className="mt-2 text-sm text-gray-600">
          Start pc_parts_api (default port 4000) and set{' '}
          <code className="rounded bg-gray-100 px-1">NEXT_PUBLIC_PC_PARTS_API_URL</code> if it
          differs.
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gaming Benchmarks</h1>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPU</label>
              <select
                value={filters.cpu || ''}
                onChange={(e) => handleFilterChange('cpu', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All CPUs</option>
                {data?.popularCPUs?.map((cpu: string) => (
                  <option key={cpu} value={cpu}>
                    {cpu}
                  </option>
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
                  <option key={gpu} value={gpu}>
                    {gpu}
                  </option>
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
                <option value="">All games</option>
                {data?.popularGames?.map((g: string) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RAM</label>
              <select
                value={filters.ram || ''}
                onChange={(e) => handleFilterChange('ram', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All RAM kits</option>
                {data?.popularRAMs?.map((kit: string) => (
                  <option key={kit} value={kit}>
                    {kit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preset</label>
              <select
                value={filters.preset || ''}
                onChange={(e) => handleFilterChange('preset', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All presets</option>
                {data?.popularPresets?.map((p: string) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
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
                {resolutions.map((res) => (
                  <option key={res} value={res}>
                    {res}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Settings / quality</label>
              <select
                value={filters.settings || ''}
                onChange={(e) => handleFilterChange('settings', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All</option>
                {presetFilterOptions.map((setting) => (
                  <option key={setting} value={setting}>
                    {setting}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min FPS</label>
              <input
                type="number"
                value={filters.minFps ?? ''}
                onChange={(e) =>
                  handleFilterChange('minFps', parseInt(e.target.value, 10) || undefined)
                }
                placeholder="0"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
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
            FPS (reported)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getFpsChartRows()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="fps" fill="#3b82f6" name="FPS" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5" />
            Frame time (from FPS)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getFrameTimeRows()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="frameTimeMs"
                stroke="#8b5cf6"
                name="Frame time (ms)"
              />
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
                  Scenario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RAM
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
                  Preset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  FPS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.benchmarks?.items?.map((benchmark: PcPartsBenchmark) => (
                <tr key={benchmark._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Gamepad2 className="w-4 h-4 mr-2 text-purple-500 shrink-0" />
                      <span className="text-sm font-medium text-gray-900 max-w-[220px] truncate" title={benchmark.game}>
                        {benchmark.game}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-[160px] truncate" title={benchmark.ram}>
                    {benchmark.ram || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Cpu className="w-4 h-4 mr-2 text-blue-500 shrink-0" />
                      <span className="text-sm text-gray-900 max-w-[200px] truncate" title={benchmark.cpu}>
                        {benchmark.cpu}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Gpu className="w-4 h-4 mr-2 text-green-500 shrink-0" />
                      <span className="text-sm text-gray-900 max-w-[200px] truncate" title={benchmark.gpu}>
                        {benchmark.gpu}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-900">{benchmark.resolution}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 max-w-[180px] truncate inline-block align-middle" title={benchmark.settings}>
                      {benchmark.settings || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-lg font-bold ${getFpsColor(benchmark.fps)}`}>
                      {benchmark.fps}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {benchmark.testDate || "—"}
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
