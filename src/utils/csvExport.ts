
import { FormData, CSVRow } from '../types/formTypes';

export const exportToCSV = (formData: FormData) => {
  const csvRows: CSVRow[] = [];
  
  // Process each parcel
  Object.entries(formData.parcels).forEach(([parcelNumber, parcelData]) => {
    parcelData.data.forEach((row) => {
      csvRows.push({
        Data: formData.date,
        Fazenda: formData.farm,
        Talhao: formData.plot,
        Parcela: parseInt(parcelNumber),
        N: row.N,
        UN: row.UN,
        'H (cm)': row.H,
        FITO: row.FITO,
        L: row.L,
        EL: row.EL,
        Observacoes: parcelData.observations
      });
    });
  });

  // Convert to CSV string
  const headers = ['Data', 'Fazenda', 'Talhao', 'Parcela', 'N', 'UN', 'H (cm)', 'FITO', 'L', 'EL', 'Observacoes'];
  const csvContent = [
    headers.join(','),
    ...csvRows.map(row => 
      headers.map(header => {
        const value = row[header as keyof CSVRow];
        // Handle empty values and wrap strings with commas in quotes
        if (value === '' || value === null || value === undefined) {
          return '';
        }
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    // Generate filename
    const date = formData.date.replace(/-/g, '');
    const farm = formData.farm.replace(/\s+/g, '_');
    const plot = formData.plot.replace(/\s+/g, '_');
    const filename = `relatorio_${farm}_${plot}_${date}.csv`;
    
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
