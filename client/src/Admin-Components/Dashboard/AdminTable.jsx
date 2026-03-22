function AdminTable({ children }) {
  return (
    <div className="admin-table-card rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">{children}</table>
      </div>
    </div>
  );
}
export default AdminTable;
