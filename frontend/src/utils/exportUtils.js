// Frontend export utility for downloading CSV reports and trigger print/PDF

export const exportToCSV = (data, filename = 'fitnexus-report.csv') => {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add content rows
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + (row[header] ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const triggerPrint = () => {
  window.print();
};
