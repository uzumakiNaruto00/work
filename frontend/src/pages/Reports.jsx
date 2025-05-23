import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalRecords: 0,
    totalAmount: 0,
    averageDuration: '0.00'
  });

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/reports/daily',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports(response.data.records || []);
      setSummary(response.data.summary || {
        totalRecords: 0,
        totalAmount: 0,
        averageDuration: '0.00'
      });
    } catch (error) {
      toast.error('Error fetching report: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Parking Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Records</h3>
          <p className="text-2xl font-bold">{summary.totalRecords}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Amount (RWF)</h3>
          <p className="text-2xl font-bold">{Number(summary.totalAmount).toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Average Duration (hours)</h3>
          <p className="text-2xl font-bold">{summary.averageDuration}</p>
        </div>
      </div>
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
                    {report.plateNumber || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.entryTime ? new Date(report.entryTime).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.exitTime ? new Date(report.exitTime).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.amountPaid ? Number(report.amountPaid).toLocaleString() : '0'}
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