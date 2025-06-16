
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UN_OPTIONS = ['F', 'L', 'I', 'P', 'B'];
const FITO_OPTIONS = ['Tipo', 'O', 'CC', 'Brecchia', 'Cerrado'];

interface DataRow {
  N: number;
  UN: string;
  H: number | '';
  FITO: string;
  L: number | '';
  EL: number | '';
}

interface DataGridProps {
  data: DataRow[];
  onChange: (data: DataRow[]) => void;
}

const DataGrid: React.FC<DataGridProps> = ({ data, onChange }) => {
  const [gridData, setGridData] = useState<DataRow[]>([]);

  // Initialize data with 40 rows
  useEffect(() => {
    if (data.length === 0) {
      const initialData: DataRow[] = Array.from({ length: 40 }, (_, index) => ({
        N: index + 1,
        UN: '',
        H: '',
        FITO: '',
        L: '',
        EL: ''
      }));
      setGridData(initialData);
      onChange(initialData);
    } else {
      setGridData(data);
    }
  }, [data, onChange]);

  const updateCell = (rowIndex: number, field: keyof DataRow, value: string | number) => {
    const newData = [...gridData];
    if (field === 'H' || field === 'L' || field === 'EL') {
      newData[rowIndex][field] = value === '' ? '' : Number(value);
    } else {
      newData[rowIndex][field] = value as string;
    }
    setGridData(newData);
    onChange(newData);
  };

  return (
    <div className="overflow-x-auto border-2 border-gray-200 rounded-lg">
      <div className="min-w-full bg-white">
        {/* Header */}
        <div className="grid grid-cols-6 gap-0 bg-green-600 text-white font-semibold text-sm">
          <div className="p-3 border-r border-green-500 text-center">N</div>
          <div className="p-3 border-r border-green-500 text-center">UN</div>
          <div className="p-3 border-r border-green-500 text-center">H (cm)</div>
          <div className="p-3 border-r border-green-500 text-center">FITO</div>
          <div className="p-3 border-r border-green-500 text-center">L</div>
          <div className="p-3 text-center">EL</div>
        </div>
        
        {/* Data Rows */}
        <div className="max-h-96 overflow-y-auto">
          {gridData.map((row, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-6 gap-0 border-b border-gray-200 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } hover:bg-blue-50 transition-colors`}
            >
              {/* N - Read only */}
              <div className="p-2 border-r border-gray-200 bg-gray-100 text-center font-medium text-gray-700 flex items-center justify-center">
                {row.N}
              </div>
              
              {/* UN - Dropdown */}
              <div className="p-1 border-r border-gray-200">
                <Select 
                  value={row.UN} 
                  onValueChange={(value) => updateCell(index, 'UN', value)}
                >
                  <SelectTrigger className="h-8 border-0 shadow-none focus:ring-0 text-sm">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-gray-200 z-50">
                    {UN_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option} className="hover:bg-green-50">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* H - Number input */}
              <div className="p-1 border-r border-gray-200">
                <Input
                  type="number"
                  value={row.H}
                  onChange={(e) => updateCell(index, 'H', e.target.value)}
                  className="h-8 border-0 shadow-none focus:ring-0 text-sm"
                  placeholder="0"
                />
              </div>
              
              {/* FITO - Dropdown */}
              <div className="p-1 border-r border-gray-200">
                <Select 
                  value={row.FITO} 
                  onValueChange={(value) => updateCell(index, 'FITO', value)}
                >
                  <SelectTrigger className="h-8 border-0 shadow-none focus:ring-0 text-sm">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-gray-200 z-50">
                    {FITO_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option} className="hover:bg-green-50">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* L - Number input */}
              <div className="p-1 border-r border-gray-200">
                <Input
                  type="number"
                  value={row.L}
                  onChange={(e) => updateCell(index, 'L', e.target.value)}
                  className="h-8 border-0 shadow-none focus:ring-0 text-sm"
                  placeholder="0"
                />
              </div>
              
              {/* EL - Number input */}
              <div className="p-1">
                <Input
                  type="number"
                  value={row.EL}
                  onChange={(e) => updateCell(index, 'EL', e.target.value)}
                  className="h-8 border-0 shadow-none focus:ring-0 text-sm"
                  placeholder="0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataGrid;
