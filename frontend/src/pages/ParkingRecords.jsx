import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ParkingRecords = () => {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    plateNumber: '',
    slotNumber: ''
  });
  const [exitData, setExitData] = useState({
    paymentMethod: 'Cash'
  });

  useEffect(() => {
    fetchRecords();
    fetchCars();
    fetchSlots();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/parking-records');
      setRecords(response.data);
    } catch (error) {
      toast.error('Failed to fetch parking records');
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cars');
      setCars(response.data);
    } catch (error) {
      toast.error('Failed to fetch cars');
    }
  };

  const fetchSlots = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/parking-slots');
      setSlots(response.data.filter(slot => slot.status === 'Available'));
    } catch (error) {
      toast.error('Failed to fetch parking slots');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/parking-records', formData);
      toast.success('Parking record created successfully');
      setFormData({ plateNumber: '', slotNumber: '' });
      fetchRecords();
      fetchSlots();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create parking record');
    }
  };

  const handleExit = async (recordId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/parking-records/${recordId}`, exitData);
      toast.success('Exit processed successfully');
      fetchRecords();
      fetchSlots();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to process exit');
    }
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this parking record?')) {
      try {
        await axios.delete(`http://localhost:5000/api/parking-records/${recordId}`);
        toast.success('Parking record deleted successfully');
        fetchRecords();
        fetchSlots();
      } catch (error) {
        toast.error('Failed to delete parking record');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Parking Record</h3>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700">
                Car
              </label>
              <select
                id="plateNumber"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select a car</option>
                {cars.map((car) => (
                  <option key={car.plateNumber} value={car.plateNumber}>
                    {car.plateNumber} - {car.ownerName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="slotNumber" className="block text-sm font-medium text-gray-700">
                Parking Slot
              </label>
              <select
                id="slotNumber"
                value={formData.slotNumber}
                onChange={(e) => setFormData({ ...formData, slotNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select a parking slot</option>
                {slots.map((slot) => (
                  <option key={slot.slotNumber} value={slot.slotNumber}>
                    {slot.slotNumber} - {slot.location || 'No location'}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Record
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Parking Records</h3>
          <div className="mt-5">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plate Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slot
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entry Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exit Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.plateNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.slotNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(record.entryTime), 'MMM d, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.exitTime
                          ? format(new Date(record.exitTime), 'MMM d, yyyy HH:mm')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.duration ? `${record.duration} hours` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.amountPaid ? `${record.amountPaid} RWF` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.exitTime
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {record.exitTime ? 'Completed' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {!record.exitTime && (
                          <div className="flex justify-end space-x-2">
                            <select
                              value={exitData.paymentMethod}
                              onChange={(e) => setExitData({ paymentMethod: e.target.value })}
                              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                              <option value="Cash">Cash</option>
                              <option value="Card">Card</option>
                              <option value="Mobile Money">Mobile Money</option>
                            </select>
                            <button
                              onClick={() => handleExit(record._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Process Exit
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingRecords; 