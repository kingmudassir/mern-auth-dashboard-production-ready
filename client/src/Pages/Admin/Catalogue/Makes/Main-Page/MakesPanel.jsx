import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

import PanelHeader from '../../../../../Admin-Components/Dashboard/PanelHeader';
import { useAddModelToMake } from '../../../../../Hooks/Admin-Hook/Catalogue/useAddModelToMake';
import { useDeleteMake } from '../../../../../Hooks/Admin-Hook/Catalogue/useDeleteMake';
import { useUpdateMake } from '../../../../../Hooks/Admin-Hook/Catalogue/useUpdateMake';
import { useAddMake } from '../../../../../Hooks/Admin-Hook/Catalogue/useAddMake';
import { useMakes } from '../../../../../Hooks/Admin-Hook/Catalogue/useMakes';
import SearchBar from '../../../../../Admin-Components/Dashboard/SearchBar';
import Toast from '../../../User-Profile/Components/Common/Toast';

function MakesPanel() {
  const [newMakeName, setNewMakeName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [selectedMakeId, setSelectedMakeId] = useState(null);
  const [toast, setToast] = useState(null);

  const { data, isLoading } = useMakes();
  const addMakeMutation = useAddMake();
  const addModelMutation = useAddModelToMake();

  const handleAddMake = async () => {
    if (!newMakeName.trim()) {
      setToast({ type: 'error', message: 'Enter make name' });
      return;
    }
    try {
      await addMakeMutation.mutateAsync({ name: newMakeName });
      setToast({ type: 'success', message: 'Make added' });
      setNewMakeName('');
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Error adding make' });
    }
  };

  const handleAddModel = async (makeId) => {
    if (!newModelName.trim()) {
      setToast({ type: 'error', message: 'Enter model name' });
      return;
    }
    try {
      await addModelMutation.mutateAsync({ makeId, modelName: newModelName });
      setToast({ type: 'success', message: 'Model added' });
      setNewModelName('');
      setSelectedMakeId(null);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Error adding model' });
    }
  };

  const makes = data?.makes || [];

  return (
    <>
      <PanelHeader title="Car Makes & Models" subtitle={`${makes.length} makes available`} />

      <div className="mb-6 bg-white rounded-xl border border-[#E8E3DC] p-4">
        <h3 className="font-semibold mb-3">Add New Make</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMakeName}
            onChange={(e) => setNewMakeName(e.target.value)}
            placeholder="Make name (e.g., Toyota)"
            className="flex-1 px-4 py-2 border border-[#E8E3DC] rounded-lg text-sm"
          />
          <button
            onClick={handleAddMake}
            disabled={addMakeMutation.isPending}
            className="px-4 py-2 bg-[#6C3CE1] text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading makes…</div>
      ) : makes.length === 0 ? (
        <div className="text-center py-8 text-[#8A8390]">No makes found</div>
      ) : (
        <div className="space-y-3">
          {makes.map((make) => (
            <div key={make._id} className="bg-white rounded-xl border border-[#E8E3DC] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#1A1523]">{make.name}</h3>
                <span className="text-xs bg-[#F2EEE9] text-[#8A8390] px-2 py-1 rounded">
                  {make.models.length} models
                </span>
              </div>

              {make.models.length > 0 && (
                <div className="mb-3 text-sm">
                  <p className="text-[#8A8390] mb-2">
                    Models: {make.models.map((m) => m.name).join(', ')}
                  </p>
                </div>
              )}

              {selectedMakeId === make._id ? (
                <div className="flex gap-2 pt-3 border-t">
                  <input
                    type="text"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    placeholder="Model name"
                    className="flex-1 px-3 py-2 border border-[#E8E3DC] rounded-lg text-sm"
                  />
                  <button
                    onClick={() => handleAddModel(make._id)}
                    disabled={addModelMutation.isPending}
                    className="px-3 py-2 bg-[#10B981] text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setSelectedMakeId(null)}
                    className="px-3 py-2 border border-[#E8E3DC] rounded-lg hover:bg-[#F2EEE9]"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedMakeId(make._id)}
                  className="text-xs text-[#6C3CE1] hover:underline"
                >
                  + Add Model
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </>
  );
}

export default MakesPanel;
