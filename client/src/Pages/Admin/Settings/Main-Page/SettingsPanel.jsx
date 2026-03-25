import PanelHeader from '../../../../Admin-Components/Dashboard/PanelHeader';

function SettingsPanel() {
  return (
    <>
      <PanelHeader title="Admin Settings" subtitle="Manage platform configuration" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#E8E3DC] p-6">
          <h3 className="font-semibold text-[#1A1523] mb-4">Email Settings</h3>
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-[#8A8390] mb-1">Verification Email</label>
              <input
                type="email"
                placeholder="noreply@example.com"
                className="w-full px-3 py-2 border border-[#E8E3DC] rounded-lg"
              />
            </div>
            <button className="w-full px-4 py-2 bg-[#6C3CE1] text-white rounded-lg hover:opacity-90">
              Save
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E8E3DC] p-6">
          <h3 className="font-semibold text-[#1A1523] mb-4">Notification Settings</h3>
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span>Send email alerts for new reports</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span>Daily summary emails</span>
            </label>
            <button className="w-full px-4 py-2 bg-[#6C3CE1] text-white rounded-lg mt-3 hover:opacity-90">
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-[#E8E3DC] p-6">
        <h3 className="font-semibold text-[#1A1523] mb-4">Platform Info</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[#8A8390]">Version</p>
            <p className="font-semibold text-[#1A1523]">1.0.0</p>
          </div>
          <div>
            <p className="text-[#8A8390]">Last Updated</p>
            <p className="font-semibold text-[#1A1523]">Today</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsPanel;
