import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Mail,
  UserCheck,
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { id: "u1", name: "Elias Thorne", email: "elias.thorne@buildverse.io", role: "admin", status: "Active", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", joined: "Oct 2026" },
    { id: "u2", name: "Sarah Chen", email: "sarah@buildverse.io", role: "student", status: "Active", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", joined: "Nov 2026" },
    { id: "u3", name: "Alex Chen", email: "alex@buildverse.io", role: "student", status: "Active", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", joined: "Nov 2026" },
    { id: "u4", name: "Elena Rostova", email: "elena@buildverse.io", role: "mentor", status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", joined: "Dec 2026" },
    { id: "u5", name: "Erik Solberg", email: "erik@buildverse.io", role: "mentor", status: "Active", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", joined: "Dec 2026" },
    { id: "u6", name: "Astrid Lind", email: "astrid@buildverse.io", role: "student", status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", joined: "Jan 2026" },
    { id: "u7", name: "Marcus Thorne", email: "marcus@buildverse.io", role: "student", status: "Active", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", joined: "Feb 2026" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // ADD USER FORM STATE
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("student");

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUpdateRole = (userId, role) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role } : u)));
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newUserObj = {
      id: `u_${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      joined: "Just now",
    };

    setUsers([newUserObj, ...users]);
    setNewName("");
    setNewEmail("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* TITLE ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">User Management Directory</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage BuildVerse accounts, permissions, and roles (Admin, Mentor, Student).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* SEARCH AND ROLE FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#121215] border border-[#27272A]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#18181B] border border-[#27272A] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-zinc-400">Filter Role:</span>
          {["all", "admin", "mentor", "student"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize transition-all ${
                roleFilter === r
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                  : "bg-[#18181B] text-zinc-400 hover:text-white border border-[#27272A]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* USERS DATA TABLE */}
      <div className="rounded-2xl bg-[#121215] border border-[#27272A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#18181B] text-zinc-400 uppercase font-extrabold text-[10px] tracking-wider border-b border-[#27272A]">
              <tr>
                <th className="px-5 py-3.5">User Identity</th>
                <th className="px-5 py-3.5">Email Address</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date Joined</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#18181B]/50 transition-colors">
                  <td className="px-5 py-3.5 flex items-center space-x-3">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-[#27272A] object-cover" />
                    <span className="font-bold text-white text-xs">{u.name}</span>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-400">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        u.role === "admin"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : u.role === "mentor"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center text-emerald-400 font-bold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500">{u.joined}</td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                      title="Edit Role"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT ROLE MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#121215] border border-[#27272A] rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-[#27272A] pb-3">
              <h3 className="text-sm font-bold text-white">Edit User Role — {editingUser.name}</h3>
              <button onClick={() => setEditingUser(null)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">Select new system permission role:</p>
            <div className="space-y-2">
              {["admin", "mentor", "student"].map((r) => (
                <button
                  key={r}
                  onClick={() => handleUpdateRole(editingUser.id, r)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold capitalize transition-colors ${
                    editingUser.role === r
                      ? "bg-amber-500/10 border-amber-500 text-amber-400"
                      : "bg-[#18181B] border-[#27272A] text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <span>{r}</span>
                  {editingUser.role === r && <CheckCircle className="w-4 h-4 text-amber-500" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddUser} className="bg-[#121215] border border-[#27272A] rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-[#27272A] pb-3">
              <h3 className="text-sm font-bold text-white">Add New Team Member</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 mb-1 block">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. David Miller"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#18181B] border border-[#27272A] text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 mb-1 block">Email Address</label>
              <input
                type="email"
                required
                placeholder="david@buildverse.io"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#18181B] border border-[#27272A] text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 mb-1 block">Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#18181B] border border-[#27272A] text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="student">Student / Engineer</option>
                <option value="mentor">Mentor / Lead</option>
                <option value="admin">System Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-colors"
            >
              Add User to BuildVerse DB
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
