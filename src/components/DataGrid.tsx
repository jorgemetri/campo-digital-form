
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataRow } from '@/types/formTypes';

interface DataGridProps {
  data: DataRow[];
  onChange: (data: DataRow[]) => void;
}

const DataGrid: React.FC<DataGridProps> = ({ data, onChange }) => {
  // Inicializar com linhas vazias se não houver dados
  useEffect(() => {
    if (data.length === 0) {
      const initialData: DataRow[] = Array.from({ length: 10 }, (_, index) => ({
        N: index + 1,
        UN: '',
        H: '',
        FITO: '',
        L: '',
        EL: ''
      }));
      onChange(initialData);
    }
  }, [data.length, onChange]);

  const updateCell = (rowIndex: number, field: keyof DataRow, value: string | number) => {
    const newData = [...data];
    if (field === 'H' || field === 'L' || field === 'EL') {
      newData[rowIndex] = { ...newData[rowIndex], [field]: value === '' ? '' : Number(value) };
    } else {
      newData[rowIndex] = { ...newData[rowIndex], [field]: value };
    }
    onChange(newData);
  };

  // Se ainda não há dados, mostrar tabela vazia temporariamente
  const displayData = data.length > 0 ? data : Array.from({ length: 10 }, (_, index) => ({
    N: index + 1,
    UN: '',
    H: '',
    FITO: '',
    L: '',
    EL: ''
  }));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-1 text-sm font-medium">N</th>
            <th className="border border-gray-300 px-2 py-1 text-sm font-medium">UN</th>
            <th className="border border-gray-300 px-2 py-1 text-sm font-medium">H (cm)</th>
            <th className="border border-gray-300 px-2 py-1 text-sm font-medium">FITO</th>
            <th className="border border-gray-300 px-2 py-1 text-sm font-medium">L</th>
            <th className="border border-gray-300 px-2 py-1 text-sm font-medium">EL</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-2 py-1">
                <span className="text-sm font-medium">{row.N}</span>
              </td>
              <td className="border border-gray-300 px-2 py-1">
                <Select
                  value={row.UN}
                  onValueChange={(value) => updateCell(index, 'UN', value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F">F</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="I">I</SelectItem>
                    <SelectItem value="P">P</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="border border-gray-300 px-2 py-1">
                <Input
                  type="number"
                  value={row.H === '' ? '' : row.H}
                  onChange={(e) => updateCell(index, 'H', e.target.value)}
                  className="h-8 text-xs"
                  placeholder="0"
                />
              </td>
              <td className="border border-gray-300 px-2 py-1">
                <Select
                  value={row.FITO}
                  onValueChange={(value) => updateCell(index, 'FITO', value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tipo">Tipo</SelectItem>
                    <SelectItem value="O">O</SelectItem>
                    <SelectItem value="CC">CC</SelectItem>
                    <SelectItem value="Brecchia">Brecchia</SelectItem>
                    <SelectItem value="Cerrado">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="border border-gray-300 px-2 py-1">
                <Input
                  type="number"
                  value={row.L === '' ? '' : row.L}
                  onChange={(e) => updateCell(index, 'L', e.target.value)}
                  className="h-8 text-xs"
                  placeholder="0"
                />
              </td>
              <td className="border border-gray-300 px-2 py-1">
                <Input
                  type="number"
                  value={row.EL === '' ? '' : row.EL}
                  onChange={(e) => updateCell(index, 'EL', e.target.value)}
                  className="h-8 text-xs"
                  placeholder="0"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataGrid;
