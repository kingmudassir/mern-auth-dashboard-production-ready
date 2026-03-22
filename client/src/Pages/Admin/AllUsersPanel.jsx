import { Eye, Pencil, Ban } from 'lucide-react';
import { useAllUsers } from '../../Hooks/Admin-Hook/useAllUsers';
import Badge from '../../Admin-Components/Dashboard/Badge';
import PanelHeader from '../../Admin-Components/Dashboard/PanelHeader';
import SearchBar from '../../Admin-Components/Dashboard/SearchBar';
import AdminTable from '../../Admin-Components/Dashboard/AdminTable';
import TableHeader from '../../Admin-Components/Dashboard/TableHeader';
import ActionMenu from '../../Admin-Components/Dashboard/ActionMenu';

const getStatus = (user) => {
  if (user.isBanned) return 'banned';
  if (user.deleteAccountRequestAt) return 'pending';
  return 'active';
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const initials = (name = '') =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

function AllUsersPanel() {
  const { data, isLoading } = useAllUsers();
  const users = data?.users ?? [];

  return (
    <div>
      <PanelHeader
        title="All Users"
        subtitle={isLoading ? 'Loading...' : `${data?.count ?? 0} registered users`}
        action={<SearchBar placeholder="Search users…" />}
      />
      <AdminTable>
        <TableHeader cols={['User', 'Role', 'Status', 'Joined', '']} />
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Loading users...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                No users found.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr
                key={u._id}
                className="border-b border-[#F2EEE9] last:border-0 hover:bg-[#FAFAF9] transition-colors duration-100"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-[0.7rem] font-bold text-[#6C3CE1] flex-shrink-0"
                      style={{
                        background: 'rgba(108,60,225,0.1)',
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {initials(u.name)}
                    </div>
                    <div>
                      <p
                        className="text-[0.82rem] font-semibold text-[#1A1523]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {u.name}
                      </p>
                      <p
                        className="text-[0.72rem] text-[#8A8390]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {u.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td
                  className="px-4 py-3.5 text-[0.82rem] text-[#8A8390] capitalize"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {u.role}
                </td>
                <td className="px-4 py-3.5">
                  <Badge status={getStatus(u)} />
                </td>
                <td
                  className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {formatDate(u.createdAt)}
                </td>
                <td className="px-4 py-3.5">
                  <ActionMenu
                    actions={[
                      { label: 'View Profile', icon: Eye },
                      { label: 'Edit', icon: Pencil },
                      { label: u.isBanned ? 'Unban' : 'Ban', icon: Ban, danger: true },
                    ]}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </AdminTable>
    </div>
  );
}

export default AllUsersPanel;
