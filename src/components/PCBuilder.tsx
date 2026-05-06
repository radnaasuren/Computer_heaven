'use client';

import { useState } from 'react';
import { Cpu, Gpu, HardDrive, Zap, Box, Fan, MemoryStick} from 'lucide-react';
import { MockPCBuildAPI, MockAPIUtils } from '@/services/mockData';
import { GRAPHQL_TYPES } from '@/graphql';
import type { PCBuild, CompatibilityResult } from '@/types/graphql';

interface ComponentSelectorProps {
  type: keyof PCBuild;
  label: string;
  icon: React.ReactNode;
  value?: string;
  onChange: (value: string) => void;
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({ type, label, icon, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    setIsOpen(true);
    setLoading(true);
    try {
      const filter = MockAPIUtils.createProductFilter(
        type === 'cpu' ? GRAPHQL_TYPES.PRODUCT_TYPE.CPU : 
        type === 'gpu' ? GRAPHQL_TYPES.PRODUCT_TYPE.GPU : 
        type,
        GRAPHQL_TYPES.PRODUCT_STATUS.ACTIVE
      );
      const response = await MockPCBuildAPI.getProducts(filter);
      setProducts(response.items);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="flex items-center gap-3 w-full p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
      >
        {icon}
        <div className="flex-1 text-left">
          <div className="font-medium text-gray-900">{label}</div>
          <div className="text-sm text-gray-500">
            {value || 'Select component'}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-left p-2 hover:bg-gray-100 rounded"
            >
              Clear selection
            </button>
            {loading ? (
              <div className="p-2 text-gray-500">Loading...</div>
            ) : (
              products?.map((product: any) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onChange(product.name);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2 hover:bg-gray-100 rounded"
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">${product.price}</div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const PCBuilder: React.FC = () => {
  const [build, setBuild] = useState<PCBuild>({
    name: 'My PC Build',
  });
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [checking, setChecking] = useState(false);

  const updateComponent = (component: keyof PCBuild, value: string) => {
    setBuild(prev => ({ ...prev, [component]: value }));
  };

  const handleCheckCompatibility = async () => {
    setChecking(true);
    try {
      const buildInput = MockAPIUtils.createPCBuildInput(build);
      const result = await MockPCBuildAPI.checkCompatibility(buildInput);
      setCompatibility(result);
    } catch (error) {
      console.error('Error checking compatibility:', error);
      setCompatibility(null);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">PC Builder</h1>
      
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Build Name
          </label>
          <input
            type="text"
            value={build.name}
            onChange={(e) => setBuild(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <ComponentSelector
          type="cpu"
          label="Processor"
          icon={<Cpu className="w-5 h-5 text-blue-500" />}
          value={build.cpu}
          onChange={(value) => updateComponent('cpu', value)}
        />

        <ComponentSelector
          type="gpu"
          label="Graphics Card"
          icon={<Gpu className="w-5 h-5 text-green-500" />}
          value={build.gpu}
          onChange={(value) => updateComponent('gpu', value)}
        />

        <ComponentSelector
          type="motherboard"
          label="Motherboard"
          icon={<Cpu className="w-5 h-5 text-purple-500" />}
          value={build.motherboard}
          onChange={(value) => updateComponent('motherboard', value)}
        />

        <ComponentSelector
          type="ram"
          label="Memory"
          icon={<MemoryStick className="w-5 h-5 text-orange-500" />}
          value={build.ram?.[0]}
          onChange={(value) => updateComponent('ram', value)}
        />

        <ComponentSelector
          type="psu"
          label="Power Supply"
          icon={<Zap className="w-5 h-5 text-yellow-500" />}
          value={build.psu}
          onChange={(value) => updateComponent('psu', value)}
        />

        <ComponentSelector
          type="case"
          label="Case"
          icon={<Box className="w-5 h-5 text-gray-500" />}
          value={build.case}
          onChange={(value) => updateComponent('case', value)}
        />

        <ComponentSelector
          type="cooler"
          label="CPU Cooler"
          icon={<Fan className="w-5 h-5 text-cyan-500" />}
          value={build.cooler}
          onChange={(value) => updateComponent('cooler', value)}
        />
      </div>

      <button
        onClick={handleCheckCompatibility}
        disabled={checking}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
      >
        {checking ? 'Checking...' : 'Check Compatibility'}
      </button>

      {compatibility && (
        <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Compatibility Results</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              compatibility.isCompatible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {compatibility.isCompatible ? 'Compatible' : 'Incompatible'}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">Compatibility Score</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  compatibility.score >= 80 ? 'bg-green-500' : 
                  compatibility.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${compatibility.score}%` }}
              />
            </div>
            <div className="text-sm font-medium mt-1">{compatibility.score}/100</div>
          </div>

          <div className="space-y-2 mb-4">
            {compatibility.checks.map((check, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg ${
                  check.severity === 'error' ? 'bg-red-50 border border-red-200' :
                  check.severity === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    check.severity === 'error' ? 'bg-red-500' :
                    check.severity === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{check.message}</div>
                    <div className="text-xs text-gray-500">{check.rule}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {compatibility.recommendations.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Recommendations</h3>
              <ul className="list-disc list-inside space-y-1">
                {compatibility.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
