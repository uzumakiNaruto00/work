import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'react-toastify';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [date, setDate] = useState(new Date());
  const [reportType, setReportType] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalRecords: 0,
    totalAmount: 0,
    averageDuration: 0
  });

  useEffect(() => {
    fetchReport();
  }, [date, reportType]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      let response;
      const token = localStorage.getItem('token');
      if (reportType === 'daily') {
        response = await axios.get(
          `https://localhost:5000/api/reports/daily?date=${format(date, 'yyyy-MM-dd')}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.get(`https://localhost:5000/api/reports/monthly?year=${date.getFullYear()}&month=${date.getMonth() + 1}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setReports(response.data);
      calculateSummary(response.data);
    } catch (error) {
      toast.error('Error fetching report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data) => {
    const totalRecords = data.length;
    const totalAmount = data.reduce((sum, record) => sum + record.amountPaid, 0);
    const averageDuration = totalRecords > 0
      ? data.reduce((sum, record) => sum + record.duration, 0) / totalRecords
      : 0;

    setSummary({
      totalRecords,
      totalAmount,
      averageDuration: averageDuration.toFixed(2)
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parking Reports</h1>
        <div className="flex gap-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border rounded p-2"
          >
            <option value="daily">Daily Report</option>
            <option value="monthly">Monthly Report</option>
          </select>
          <input
            type={reportType === 'daily' ? 'date' : 'month'}
            value={reportType === 'daily' 
              ? format(date, 'yyyy-MM-dd')
              : format(date, 'yyyy-MM')}
            onChange={(e) => setDate(new Date(e.target.value))}
            className="border rounded p-2"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Records</h3>
          <p className="text-2xl font-bold">{summary.totalRecords}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Amount (RWF)</h3>
          <p className="text-2xl font-bold">{summary.totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Average Duration (hours)</h3>
          <p className="text-2xl font-bold">{summary.averageDuration}</p>
        </div>
      </div>

      {/* Report Table */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plate Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exit Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration (hours)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Paid (RWF)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(Array.isArray(reports) ? reports : []).map((report) => (
                <tr key={report._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.plateNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(report.entryTime), 'yyyy-MM-dd HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.exitTime ? format(new Date(report.exitTime), 'yyyy-MM-dd HH:mm:ss') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.amountPaid.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;