// ─────────────────────────────────────────────────────────────────
// FILE: pages/Admin/Panels/ReportsPanel.jsx
// ─────────────────────────────────────────────────────────────────
import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Flag,
  Car,
  User,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

import Toast from '../../User-Profile/Components/Common/Toast';
import PanelHeader from '../../../../Admin-Components/Dashboard/PanelHeader';
import { useReports } from '../../../../Hooks/Admin-Hook/Reports/useReports';
import { useReportById } from '../../../../Hooks/Admin-Hook/Reports/useReportById';
import { useResolveReport } from '../../../../Hooks/Admin-Hook/Reports/useResolveReport';
import { useDismissReport } from '../../../../Hooks/Admin-Hook/Reports/useDismissReport';
import { useUpdateReportPriority } from '../../../../Hooks/Admin-Hook/Reports/useUpdateReportPriority';

const PAGE_SIZE = 15;

// ── Config ────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  high: { label: 'High', color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
  medium: { label: 'Medium', color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  low: { label: 'Low', color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
};

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  resolved: { label: 'Resolved', color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
  dismissed: { label: 'Dismissed', color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
};

const RESOLUTION_OPTIONS = [
  { value: 'content_removed', label: 'Content Removed', desc: 'Listing removed from platform' },
  { value: 'user_warned', label: 'User Warned', desc: 'Seller received a warning' },
  { value: 'user_banned', label: 'User Banned', desc: 'Seller account suspended' },
  { value: 'no_action', label: 'No Action', desc: 'Report reviewed, no violation found' },
  { value: 'verified_false', label: 'False Report', desc: 'Report was inaccurate or in bad faith' },
];

// ── Small reusable pieces ─────────────────────────────────────────
function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.68rem] font-semibold"
      style={{ background: cfg.bg, color: cfg.color, fontFamily: "'DM Sans', sans-serif" }}
    >
      <AlertTriangle size={10} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[0.68rem] font-semibold"
      style={{ background: cfg.bg, color: cfg.color, fontFamily: "'DM Sans', sans-serif" }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function timeAgo(date) {
  if (!date) return '—';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Report Detail Drawer ──────────────────────────────────────────
function ReportDetailDrawer({ reportId, onClose, onToast }) {
  const [resolution, setResolution] = useState('');
  const [notes, setNotes] = useState('');

  const { data, isLoading } = useReportById(reportId);
  const report = data?.report;

  const { mutate: resolveReport, isPending: resolving } = useResolveReport();
  const { mutate: dismissReport, isPending: dismissing } = useDismissReport();
  const { mutate: updatePriority, isPending: updatingPriority } = useUpdateReportPriority();

  const handleResolve = () => {
    if (!resolution) {
      onToast({ type: 'error', message: 'Select a resolution type before submitting.' });
      return;
    }
    resolveReport(
      { reportId, resolution, resolutionNotes: notes },
      {
        onSuccess: () => {
          onToast({ type: 'success', message: 'Report resolved.' });
          onClose();
        },
        onError: (err) => onToast({ type: 'error', message: err?.message || 'Failed to resolve.' }),
      }
    );
  };

  const handleDismiss = () => {
    dismissReport(reportId, {
      onSuccess: () => {
        onToast({ type: 'success', message: 'Report dismissed.' });
        onClose();
      },
      onError: (err) => onToast({ type: 'error', message: err?.message || 'Failed to dismiss.' }),
    });
  };

  const handlePriority = (priority) => {
    updatePriority(
      { reportId, priority },
      {
        onSuccess: () => onToast({ type: 'success', message: `Priority set to ${priority}.` }),
        onError: (err) =>
          onToast({ type: 'error', message: err?.message || 'Failed to update priority.' }),
      }
    );
  };

  const isActionable = report && report.status === 'pending';

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl"
        style={{ width: 'min(520px, 100vw)', borderLeft: '1px solid #E8E3DC' }}
      >
        {/* Drawer Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid #F2EEE9' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(232,98,42,0.08)' }}
            >
              <Flag size={15} strokeWidth={2} style={{ color: '#E8622A' }} />
            </div>
            <div>
              <p
                className="text-[0.88rem] font-bold text-[#1A1523]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Report Details
              </p>
              {report && <p className="text-[0.68rem] text-[#8A8390]">ID: {report._id}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-[#F2EEE9]"
          >
            <X size={16} strokeWidth={2} style={{ color: '#8A8390' }} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-[#8A8390] text-sm">
              Loading…
            </div>
          ) : !report ? (
            <div className="flex items-center justify-center py-16 text-[#8A8390] text-sm">
              Report not found.
            </div>
          ) : (
            <>
              {/* Status + Priority Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={report.status} />
                <PriorityBadge priority={report.priority} />
                <span className="text-[0.68rem] text-[#C4BDD0] ml-auto">
                  {timeAgo(report.createdAt)}
                </span>
              </div>

              {/* Reason */}
              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(232,98,42,0.04)',
                  border: '1px solid rgba(232,98,42,0.12)',
                }}
              >
                <p
                  className="text-[0.65rem] font-bold uppercase tracking-widest mb-1"
                  style={{ color: '#E8622A' }}
                >
                  Reason
                </p>
                <p
                  className="text-[0.88rem] font-semibold text-[#1A1523]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {report.reason}
                </p>
                {report.description && (
                  <p
                    className="text-[0.78rem] text-[#8A8390] mt-2 leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    "{report.description}"
                  </p>
                )}
              </div>

              {/* Reported Listing */}
              {report.car && (
                <div
                  className="rounded-2xl p-4"
                  style={{ background: '#FAFAF9', border: '1px solid #E8E3DC' }}
                >
                  <p
                    className="text-[0.65rem] font-bold uppercase tracking-widest mb-3"
                    style={{ color: '#8A8390' }}
                  >
                    Reported Listing
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(108,60,225,0.08)' }}
                    >
                      <Car size={16} strokeWidth={1.8} style={{ color: '#6C3CE1' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[0.85rem] font-bold text-[#1A1523] truncate"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {report.car.year} {report.car.make} {report.car.model}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mt-0.5">
                        {report.car.price && (
                          <span
                            className="text-[0.7rem] font-semibold"
                            style={{ color: '#E8622A' }}
                          >
                            PKR {(report.car.price / 100000).toFixed(0)}L
                          </span>
                        )}
                        {report.car.city && (
                          <span className="text-[0.7rem]" style={{ color: '#8A8390' }}>
                            {report.car.city}
                          </span>
                        )}
                        <span
                          className="text-[0.65rem] font-semibold px-1.5 py-0.5 rounded"
                          style={{
                            background:
                              report.car.status === 'active'
                                ? 'rgba(5,150,105,0.08)'
                                : 'rgba(217,119,6,0.08)',
                            color: report.car.status === 'active' ? '#059669' : '#D97706',
                          }}
                        >
                          {report.car.status}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`/cars/${report.car._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-[#F2EEE9]"
                      title="View listing"
                    >
                      <ExternalLink size={14} strokeWidth={2} style={{ color: '#6C3CE1' }} />
                    </a>
                  </div>
                </div>
              )}

              {/* Reporter */}
              {report.reportedBy && (
                <div
                  className="rounded-2xl p-4"
                  style={{ background: '#FAFAF9', border: '1px solid #E8E3DC' }}
                >
                  <p
                    className="text-[0.65rem] font-bold uppercase tracking-widest mb-3"
                    style={{ color: '#8A8390' }}
                  >
                    Reported By
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(37,99,235,0.08)' }}
                    >
                      <User size={16} strokeWidth={1.8} style={{ color: '#2563EB' }} />
                    </div>
                    <div>
                      <p
                        className="text-[0.85rem] font-bold text-[#1A1523]"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {report.reportedBy.name}
                      </p>
                      <p className="text-[0.72rem] text-[#8A8390]">{report.reportedBy.email}</p>
                      {report.reportedBy.phone && (
                        <p className="text-[0.72rem] text-[#8A8390]">{report.reportedBy.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution info (if already resolved) */}
              {report.status !== 'pending' && report.resolution && (
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: 'rgba(16,185,129,0.04)',
                    border: '1px solid rgba(16,185,129,0.15)',
                  }}
                >
                  <p
                    className="text-[0.65rem] font-bold uppercase tracking-widest mb-2"
                    style={{ color: '#10B981' }}
                  >
                    Resolution
                  </p>
                  <p className="text-[0.82rem] font-semibold text-[#1A1523]">
                    {RESOLUTION_OPTIONS.find((o) => o.value === report.resolution)?.label ||
                      report.resolution}
                  </p>
                  {report.resolutionNotes && (
                    <p className="text-[0.75rem] text-[#8A8390] mt-1">{report.resolutionNotes}</p>
                  )}
                  {report.resolvedBy && (
                    <p className="text-[0.68rem] text-[#C4BDD0] mt-2">
                      By {report.resolvedBy.name} · {timeAgo(report.resolvedAt)}
                    </p>
                  )}
                </div>
              )}

              {/* Priority controls (always visible) */}
              <div>
                <p
                  className="text-[0.65rem] font-bold uppercase tracking-widest mb-2"
                  style={{ color: '#8A8390' }}
                >
                  Set Priority
                </p>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((p) => {
                    const cfg = PRIORITY_CONFIG[p];
                    const isActive = report.priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handlePriority(p)}
                        disabled={updatingPriority || isActive}
                        className="flex-1 py-2 rounded-xl text-[0.75rem] font-semibold transition-all disabled:cursor-default"
                        style={{
                          background: isActive ? cfg.bg : '#F7F4F0',
                          color: isActive ? cfg.color : '#8A8390',
                          border: isActive
                            ? `1.5px solid ${cfg.color}30`
                            : '1.5px solid transparent',
                        }}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resolution form (only for pending reports) */}
              {isActionable && (
                <div style={{ borderTop: '1px solid #F2EEE9', paddingTop: '20px' }}>
                  <p
                    className="text-[0.65rem] font-bold uppercase tracking-widest mb-3"
                    style={{ color: '#8A8390' }}
                  >
                    Take Action
                  </p>

                  <div className="flex flex-col gap-2 mb-4">
                    {RESOLUTION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setResolution(opt.value)}
                        className="flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all"
                        style={{
                          border:
                            resolution === opt.value
                              ? '1.5px solid #6C3CE1'
                              : '1.5px solid #E8E3DC',
                          background:
                            resolution === opt.value ? 'rgba(108,60,225,0.04)' : '#FAFAF9',
                        }}
                      >
                        <div>
                          <p
                            className="text-[0.8rem] font-semibold"
                            style={{ color: resolution === opt.value ? '#6C3CE1' : '#1A1523' }}
                          >
                            {opt.label}
                          </p>
                          <p className="text-[0.68rem] text-[#8A8390]">{opt.desc}</p>
                        </div>
                        {resolution === opt.value && (
                          <CheckCircle2
                            size={16}
                            strokeWidth={2}
                            style={{ color: '#6C3CE1', flexShrink: 0 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Resolution notes (optional)…"
                    rows={3}
                    maxLength={500}
                    className="w-full rounded-xl border border-[#E8E3DC] bg-[#FAFAF9] text-[0.82rem] p-3.5 outline-none transition-all resize-none mb-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <p className="text-right text-[0.65rem] mb-4" style={{ color: '#C4BDD0' }}>
                    {notes.length} / 500
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Drawer Footer — sticky action bar */}
        {report?.status === 'pending' && (
          <div
            className="px-6 py-4 flex gap-3 shrink-0"
            style={{ borderTop: '1px solid #F2EEE9', background: '#FFFFFF' }}
          >
            <button
              type="button"
              onClick={handleDismiss}
              disabled={dismissing || resolving}
              className="flex-1 py-3 rounded-xl text-[0.82rem] font-bold transition-all disabled:opacity-50"
              style={{ border: '1.5px solid #E8E3DC', color: '#6B7280', background: '#FAFAF9' }}
            >
              {dismissing ? 'Dismissing…' : 'Dismiss'}
            </button>
            <button
              type="button"
              onClick={handleResolve}
              disabled={resolving || dismissing || !resolution}
              className="flex-2 flex-grow-[2] py-3 rounded-xl text-[0.82rem] font-bold text-white transition-all disabled:opacity-40 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)' }}
            >
              {resolving ? 'Resolving…' : 'Resolve Report'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Main Panel ────────────────────────────────────────────────────
export default function ReportsPanel() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('pending');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [toast, setToast] = useState(null);

  const { data, isLoading } = useReports({ status, page, limit: PAGE_SIZE });

  const reports = data?.reports || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  return (
    <>
      <PanelHeader
        title="Reports Queue"
        subtitle={`${total} report${total !== 1 ? 's' : ''} · ${status}`}
      />

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['pending', 'resolved', 'dismissed'].map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className="px-4 py-2 rounded-xl text-[0.8rem] font-semibold transition-all"
              style={{
                background: status === s ? cfg.color : '#F2EEE9',
                color: status === s ? '#FFF' : '#8A8390',
              }}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Reports Table */}
      {isLoading ? (
        <div className="text-center py-12 text-[#8A8390] text-sm">Loading reports…</div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#F2EEE9' }}
          >
            <Flag size={24} strokeWidth={1.8} style={{ color: '#C4BDD0' }} />
          </div>
          <p className="text-[0.88rem] font-semibold text-[#1A1523] mb-1">No {status} reports</p>
          <p className="text-[0.78rem] text-[#8A8390]">All clear for now.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E3DC] overflow-hidden">
          {/* Table header */}
          <div
            className="hidden md:grid grid-cols-[1fr_1.2fr_1fr_auto_auto_auto] gap-4 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-widest"
            style={{ color: '#8A8390', background: '#FAFAF9', borderBottom: '1px solid #F2EEE9' }}
          >
            <span>Reason</span>
            <span>Listing</span>
            <span>Reporter</span>
            <span>Priority</span>
            <span>Time</span>
            <span />
          </div>

          <div className="divide-y divide-[#F2EEE9]">
            {reports.map((report) => (
              <div
                key={report._id}
                className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1fr_auto_auto_auto] gap-2 md:gap-4 px-5 py-4 items-center hover:bg-[#FAFAF9] transition-colors"
              >
                {/* Reason */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: PRIORITY_CONFIG[report.priority]?.bg || PRIORITY_CONFIG.low.bg,
                    }}
                  >
                    <AlertTriangle
                      size={14}
                      strokeWidth={2}
                      style={{
                        color: PRIORITY_CONFIG[report.priority]?.color || PRIORITY_CONFIG.low.color,
                      }}
                    />
                  </div>
                  <p
                    className="text-[0.8rem] font-semibold text-[#1A1523] leading-tight truncate"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {report.reason}
                  </p>
                </div>

                {/* Listing */}
                <p
                  className="text-[0.75rem] text-[#8A8390] truncate"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {report.car
                    ? `${report.car.year ?? ''} ${report.car.make ?? ''} ${report.car.model ?? ''}`.trim()
                    : '—'}
                </p>

                {/* Reporter */}
                <p
                  className="text-[0.75rem] text-[#8A8390] truncate"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {report.reportedBy?.name || '—'}
                </p>

                {/* Priority badge */}
                <PriorityBadge priority={report.priority} />

                {/* Time */}
                <span className="text-[0.68rem] text-[#C4BDD0] whitespace-nowrap">
                  {timeAgo(report.createdAt)}
                </span>

                {/* View button */}
                <button
                  type="button"
                  onClick={() => setSelectedReportId(report._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.72rem] font-semibold text-white transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)' }}
                >
                  <Eye size={12} strokeWidth={2} /> View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-9 h-9 rounded-xl border border-[#E8E3DC] flex items-center justify-center disabled:opacity-40 transition-colors hover:bg-[#F2EEE9]"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-[0.8rem] font-medium text-[#8A8390]">
            {page} / {pages}
          </span>
          <button
            type="button"
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="w-9 h-9 rounded-xl border border-[#E8E3DC] flex items-center justify-center disabled:opacity-40 transition-colors hover:bg-[#F2EEE9]"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* Detail Drawer */}
      {selectedReportId && (
        <ReportDetailDrawer
          reportId={selectedReportId}
          onClose={() => setSelectedReportId(null)}
          onToast={setToast}
        />
      )}

      {/* Toast */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </>
  );
}
