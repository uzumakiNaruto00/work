import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    plateNumber: '',
    ownerName: '',
    contactInfo: ''
  });
  const [editingCar, setEditingCar] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cars');
      setCars(response.data);
    } catch (error) {
      toast.error('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCar) {
        await axios.put(`http://localhost:5000/api/cars/${editingCar.plateNumber}`, formData);
        toast.success('Car updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/cars', formData);
        toast.success('Car added successfully');
      }
      setFormData({ plateNumber: '', ownerName: '', contactInfo: '' });
      setEditingCar(null);
      fetchCars();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      plateNumber: car.plateNumber,
      ownerName: car.ownerName,
      contactInfo: car.contactInfo
    });
  };

  const handleDelete = async (plateNumber) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`http://localhost:5000/api/cars/${plateNumber}`);
        toast.success('Car deleted successfully');
        fetchCars();
      } catch (error) {
        toast.error('Failed to delete car');
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
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {editingCar ? 'Edit Car' : 'Add New Car'}
          </h3>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700">
                Plate Number
              </label>
              <input
                type="text"
                id="plateNumber"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                disabled={editingCar}
              />
            </div>
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                Owner Name
              </label>
              <input
                type="text"
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
                Contact Info
              </label>
              <input
                type="text"
                id="contactInfo"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              {editingCar && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCar(null);
                    setFormData({ plateNumber: '', ownerName: '', contactInfo: '' });
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
                {editingCar ? 'Update' : 'Add'} Car
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Cars List</h3>
          <div className="mt-5">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plate Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cars.map((car) => (
                    <tr key={car.plateNumber}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {car.plateNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {car.ownerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {car.contactInfo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(car)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(car.plateNumber)}
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

export default Cars; 