import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ParkingSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    slotNumber: '',
    location: '',
    status: 'Available'
  });
  const [editingSlot, setEditingSlot] = useState(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/parking-slots');
      setSlots(response.data);
    } catch (error) {
      toast.error('Failed to fetch parking slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSlot) {
        await axios.put(`http://localhost:5000/api/parking-slots/${editingSlot.slotNumber}`, formData);
        toast.success('Parking slot updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/parking-slots', formData);
        toast.success('Parking slot added successfully');
      }
      setFormData({ slotNumber: '', location: '', status: 'Available' });
      setEditingSlot(null);
      fetchSlots();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setFormData({
      slotNumber: slot.slotNumber,
      location: slot.location || '',
      status: slot.status
    });
  };

  const handleDelete = async (slotNumber) => {
    if (window.confirm('Are you sure you want to delete this parking slot?')) {
      try {
        await axios.delete(`http://localhost:5000/api/parking-slots/${slotNumber}`);
        toast.success('Parking slot deleted successfully');
        fetchSlots();
      } catch (error) {
        toast.error('Failed to delete parking slot');
      }
    }
  };

  const handleStatusChange = async (slotNumber, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/parking-slots/${slotNumber}/status`, {
        status: newStatus
      });
      toast.success('Status updated successfully');
      fetchSlots();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {editingSlot ? 'Edit Parking Slot' : 'Add New Parking Slot'}
          </h3>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="slotNumber" className="block text-sm font-medium text-gray-700">
                Slot Number
              </label>
              <input
                type="text"
                id="slotNumber"
                value={formData.slotNumber}
                onChange={(e) => setFormData({ ...formData, slotNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                disabled={editingSlot}
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              {editingSlot && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSlot(null);
                    setFormData({ slotNumber: '', location: '', status: 'Available' });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {editingSlot ? 'Update' : 'Add'} Parking Slot
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Parking Slots List</h3>
          <div className="mt-5">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slot Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
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
                  {slots.map((slot) => (
                    <tr key={slot.slotNumber}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {slot.slotNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {slot.location || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            slot.status === 'Available'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {slot.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(slot)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              slot.slotNumber,
                              slot.status === 'Available' ? 'Occupied' : 'Available'
                            )
                          }
                          className="text-yellow-600 hover:text-yellow-900 mr-4"
                        >
                          Toggle Status
                        </button>
                        <button
                          onClick={() => handleDelete(slot.slotNumber)}
                          className="text-red-600 hover:text-red-900"
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

export default ParkingSlots; 