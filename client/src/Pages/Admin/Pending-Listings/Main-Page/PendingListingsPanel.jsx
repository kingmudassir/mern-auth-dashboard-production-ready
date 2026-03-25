import { useState } from 'react';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle, Eye } from 'lucide-react';
import PanelHeader from '../../../../Admin-Components/Dashboard/PanelHeader';
import SearchBar from '../../../../Admin-Components/Dashboard/SearchBar';
import Toast from '../../User-Profile/Components/Common/Toast';
import ConfirmModal from '../../User-Profile/Components/Common/ConfirmModal';
import { useRejectListing } from '../../../../Hooks/Admin-Hook/Listings/useRejectListing';
import { useApproveListing } from '../../../../Hooks/Admin-Hook/Listings/useApproveListingHook';
import { usePendingListings } from '../../../../Hooks/Admin-Hook/Listings/usePendingListings';
const PAGE_SIZE = 10;

function PendingListingsPanel() {
  const [page, setPage] = useState(1);
  const [selectedListing, setSelectedListing] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [toast, setToast] = useState(null);

  const { data, isLoading } = usePendingListings({ page, limit: PAGE_SIZE });
  const approveMutation = useApproveListing();
  const rejectMutation = useRejectListing();

  const handleApprove = async (listingId) => {
    try {
      await approveMutation.mutateAsync(listingId);
      setToast({ type: 'success', message: 'Listing approved' });
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Error approving listing',
      });
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setToast({ type: 'error', message: 'Please provide a rejection reason' });
      return;
    }
    try {
      await rejectMutation.mutateAsync({
        listingId: selectedListing._id,
        rejectionReason,
      });
      setToast({ type: 'success', message: 'Listing rejected' });
      setShowRejectModal(false);
      setSelectedListing(null);
      setRejectionReason('');
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Error rejecting listing',
      });
    }
  };

  const listings = data?.listings || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  return (
    <>
      <PanelHeader
        title="Pending Listings"
        subtitle={`${total} waiting for approval`}
        action={<SearchBar placeholder="Search listings…" />}
      />

      {isLoading ? (
        <div className="text-center py-8">Loading…</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-8 text-[#8A8390]">No pending listings</div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-xl border border-[#E8E3DC] p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1A1523] truncate">{listing.title}</h3>
                  <p className="text-sm text-[#8A8390]">
                    By {listing.createdBy?.name} •{' '}
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-1">
                    ₨{listing.price?.toLocaleString()} • {listing.city}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(listing._id)}
                    disabled={approveMutation.isPending}
                    className="px-3 py-2 rounded-lg bg-[#10B981] text-white text-xs hover:opacity-90 disabled:opacity-50"
                  >
                    <CheckCircle size={14} className="inline mr-1" /> Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedListing(listing);
                      setShowRejectModal(true);
                    }}
                    className="px-3 py-2 rounded-lg bg-[#DC2626] text-white text-xs hover:opacity-90"
                  >
                    <XCircle size={14} className="inline mr-1" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Reject Listing</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Rejection reason…"
              rows={4}
              className="w-full px-4 py-2 border border-[#E8E3DC] rounded-lg mb-4 text-sm"
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={rejectMutation.isPending}
                className="flex-1 px-4 py-2 bg-[#DC2626] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {rejectMutation.isPending ? 'Rejecting…' : 'Reject'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 border border-[#E8E3DC] rounded-lg hover:bg-[#F2EEE9]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </>
  );
}

export default PendingListingsPanel;
