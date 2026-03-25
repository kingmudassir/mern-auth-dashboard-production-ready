import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import Toast from '../../../User-Profile/Components/Common/Toast';
import { useCities } from '../../../../../Hooks/Admin-Hook/Catalogue/useCities.js';
import { useAddCity } from '../../../../../Hooks/Admin-Hook/Catalogue/useAddCity.js';
import { useDeleteCity } from '../../../../../Hooks/Admin-Hook/Catalogue/useDeleteCity.js';
import PanelHeader from '../../../../../Admin-Components/Dashboard/PanelHeader';
const PROVINCES = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'AJK', 'GB', 'FATA', 'ICT'];

function CitiesPanel() {
  const [newCityName, setNewCityName] = useState('');
  const [newProvince, setNewProvince] = useState('Punjab');
  const [toast, setToast] = useState(null);

  const { data, isLoading } = useCities();
  const addCityMutation = useAddCity();
  const deleteCityMutation = useDeleteCity();

  const handleAddCity = async () => {
    if (!newCityName.trim()) {
      setToast({ type: 'error', message: 'Enter city name' });
      return;
    }
    try {
      await addCityMutation.mutateAsync({ name: newCityName, province: newProvince });
      setToast({ type: 'success', message: 'City added' });
      setNewCityName('');
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Error adding city' });
    }
  };

  const handleDeleteCity = async (cityId) => {
    if (!window.confirm('Delete this city?')) return;
    try {
      await deleteCityMutation.mutateAsync(cityId);
      setToast({ type: 'success', message: 'City deleted' });
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Error deleting city' });
    }
  };

  const cities = data?.cities || [];
  const citiesByProvince = PROVINCES.reduce((acc, prov) => {
    acc[prov] = cities.filter((c) => c.province === prov);
    return acc;
  }, {});

  return (
    <>
      <PanelHeader title="Cities" subtitle={`${cities.length} cities available`} />

      <div className="mb-6 bg-white rounded-xl border border-[#E8E3DC] p-4">
        <h3 className="font-semibold mb-3">Add New City</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCityName}
            onChange={(e) => setNewCityName(e.target.value)}
            placeholder="City name (e.g., Lahore)"
            className="flex-1 px-4 py-2 border border-[#E8E3DC] rounded-lg text-sm"
          />
          <select
            value={newProvince}
            onChange={(e) => setNewProvince(e.target.value)}
            className="px-4 py-2 border border-[#E8E3DC] rounded-lg text-sm"
          >
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddCity}
            disabled={addCityMutation.isPending}
            className="px-4 py-2 bg-[#6C3CE1] text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading cities…</div>
      ) : cities.length === 0 ? (
        <div className="text-center py-8 text-[#8A8390]">No cities found</div>
      ) : (
        <div className="space-y-6">
          {PROVINCES.map((prov) => {
            const provinceCities = citiesByProvince[prov];
            return (
              provinceCities.length > 0 && (
                <div key={prov}>
                  <h3 className="font-semibold text-[#1A1523] mb-3">
                    {prov} ({provinceCities.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {provinceCities.map((city) => (
                      <div
                        key={city._id}
                        className="bg-white rounded-lg border border-[#E8E3DC] p-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-sm text-[#1A1523]">{city.name}</p>
                          <p className="text-xs text-[#8A8390]">{city.listingCount} listings</p>
                        </div>
                        <button
                          onClick={() => handleDeleteCity(city._id)}
                          disabled={deleteCityMutation.isPending}
                          className="p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] rounded disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            );
          })}
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </>
  );
}

export default CitiesPanel;
