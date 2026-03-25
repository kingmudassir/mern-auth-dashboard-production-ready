import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from 'lucide-react';

import Toast from '../../User-Profile/Components/Common/Toast';
import ConfirmModal from '../../User-Profile/Components/Common/ConfirmModal';
import SearchBar from '../../../../Admin-Components/Dashboard/SearchBar';
import { useReports } from '../../../../Hooks/Admin-Hook/Reports/useReports';
import { useResolveReport } from '../../../../Hooks/Admin-Hook/Reports/useResolveReport';
import { useDismissReport } from '../../../../Hooks/Admin-Hook/Reports/useDismissReport';
import { useUpdateReportPriority } from '../../../../Hooks/Admin-Hook/Reports/useUpdateReportPriority';
import PanelHeader from '../../../../Admin-Components/Dashboard/PanelHeader';

const PAGE_SIZE = 10;

const PRIORITY_CONFIG = {
  high: { label: 'High', color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
  medium: { label: 'Medium', color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  low: { label: 'Low', color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
};

const STATUS_CONFIG = {
  open: { label: 'Open', color: '#3B82F6' },
  investigating: { label: 'Investigating', color: '#D97706' },
  resolved: { label: 'Resolved', color: '#10B981' },
  dismissed: { label: 'Dismissed', color: '#6B7280' },
};

function ReportsPanel() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('open');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [resolution, setResolution] = useState('');
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState(null);

  const { data, isLoading } = useReports({ status, page, limit: PAGE_SIZE });
  const resolveReportMutation = useResolveReport();
  const dismissReportMutation = useDismissReport();

  const handleResolve = async () => {
    if (!resolution) {
      setToast({ type: 'error', message: 'Select a resolution type' });
      return;
    }

    try {
      await resolveReportMutation.mutateAsync({
        reportId: selectedReport._id,
        resolution,
        resolutionNotes: notes,
      });
      setToast({ type: 'success', message: 'Report resolved' });
      setShowResearchModal(false);
      setSelectedReport(null);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Error resolving report' });
    }
  };

  const handleDismiss = async () => {
    try {
      await dismissReportMutation.mutateAsync(selectedReport._id);
      setToast({ type: 'success', message: 'Report dismissed' });
      setSelectedReport(null);
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Error dismissing report',
      });
    }
  };

  const reports = data?.reports || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  return (
    <>
      <PanelHeader
        title="Reports Queue"
        subtitle={`${total} total reports`}
        action={<SearchBar placeholder="Search reports…" />}
      />

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['open', 'investigating', 'resolved', 'dismissed'].map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: status === s ? STATUS_CONFIG[s].color : '#F2EEE9',
              color: status === s ? '#FFF' : '#8A8390',
            }}
          >
            {STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="text-center py-8 text-[#8A8390]">Loading reports…</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-8 text-[#8A8390]">No reports found</div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E3DC] divide-y">
          {reports.map((report) => (
            <div key={report._id} className="p-4 hover:bg-[#FAFAF9] transition-colors">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: PRIORITY_CONFIG[report.priority].bg }}
                >
                  <AlertTriangle
                    size={16}
                    style={{ color: PRIORITY_CONFIG[report.priority].color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1A1523] text-sm">
                    {report.type.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-xs text-[#8A8390]">
                    By {report.reportedBy?.name} • {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className="px-2 py-1 text-xs rounded bg-[#F2EEE9] text-[#8A8390]"
                  style={{ color: STATUS_CONFIG[report.status].color }}
                >
                  {STATUS_CONFIG[report.status].label}
                </span>
                <button
                  onClick={() => setSelectedReport(report)}
                  className="px-3 py-1 text-xs rounded-lg bg-[#6C3CE1] text-white hover:opacity-90"
                >
                  <Eye size={14} className="inline mr-1" /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg border border-[#E8E3DC] disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-[#8A8390]">
            {page} / {pages}
          </span>
          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg border border-[#E8E3DC] disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedReport && (
        <ConfirmModal
          title="Report Details"
          message={selectedReport.description}
          onConfirm={() => setShowResearchModal(true)}
          onCancel={() => setSelectedReport(null)}
          confirmText="Resolve"
          cancelText="Close"
        />
      )}

      {/* Resolution Modal */}
      {showResearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-[#1A1523]">Resolve Report</h3>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[#E8E3DC] mb-4"
            >
              <option value="">Select resolution…</option>
              <option value="content_removed">Content Removed</option>
              <option value="user_warned">User Warned</option>
              <option value="user_banned">User Banned</option>
              <option value="no_action">No Action</option>
              <option value="verified_false">Verified False</option>
            </select>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Resolution notes…"
              className="w-full px-4 py-2 rounded-xl border border-[#E8E3DC] mb-4 text-sm"
              rows="3"
            />
            <div className="flex gap-3">
              <button
                onClick={handleResolve}
                disabled={resolveReportMutation.isPending}
                className="flex-1 px-4 py-2 rounded-xl bg-[#10B981] text-white hover:opacity-90 disabled:opacity-50"
              >
                {resolveReportMutation.isPending ? 'Resolving…' : 'Resolve'}
              </button>
              <button
                onClick={handleDismiss}
                disabled={dismissReportMutation.isPending}
                className="flex-1 px-4 py-2 rounded-xl bg-[#6B7280] text-white hover:opacity-90 disabled:opacity-50"
              >
                {dismissReportMutation.isPending ? 'Dismissing…' : 'Dismiss'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </>
  );
}

export default ReportsPanel;
