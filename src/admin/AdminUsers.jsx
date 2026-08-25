import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  X,
} from "lucide-react";
import { RoleBadge, RoleSelector } from "@/components/common/RoleBadge";

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { id: "u1", name: "Elias Thorne", email: "elias.thorne@buildverse.io", role: "admin", status: "Active", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", joined: "Oct 2026" },
    { id: "u2", name: "Sarah Chen", email: "sarah@buildverse.io", role: "user", status: "Active", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", joined: "Nov 2026" },
    { id: "u3", name: "Alex Chen", email: "alex@buildverse.io", role: "user", status: "Active", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", joined: "Nov 2026" },
    { id: "u4", name: "Elena Rostova", email: "elena@buildverse.io", role: "mentor", status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", joined: "Dec 2026" },
    { id: "u5", name: "Erik Solberg", email: "erik@buildverse.io", role: "mentor", status: "Active", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", joined: "Dec 2026" },
    { id: "u6", name: "Astrid Lind", email: "astrid@buildverse.io", role: "user", status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", joined: "Jan 2026" },
    { id: "u7", name: "Marcus Thorne", email: "marcus@buildverse.io", role: "user", status: "Active", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", joined: "Feb 2026" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("user");

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
          <h1 className="text-2xl font-black text-foreground font-display tracking-tight">User Management Directory</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage BuildVerse accounts, permissions, and roles (Admin, Mentor, Student).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* SEARCH AND ROLE FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-card border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-surface-elevated border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-muted-foreground">Filter Role:</span>
          {["all", "admin", "mentor", "user"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-extrabold capitalize transition-all ${
                roleFilter === r
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-surface-elevated text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {r === "user" ? "Student" : r}
            </button>
          ))}
        </div>
      </div>

      {/* USERS DATA TABLE */}
      <div className="rounded-3xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted-foreground">
            <thead className="bg-surface-elevated text-muted-foreground uppercase font-extrabold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="px-5 py-3.5">User Identity</th>
                <th className="px-5 py-3.5">Email Address</th>
                <th className="px-5 py-3.5">Account Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date Joined</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-surface-elevated/50 transition-colors">
                  <td className="px-5 py-3.5 flex items-center space-x-3">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-border object-cover" />
                    <span className="font-bold text-foreground text-xs">{u.name}</span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <RoleBadge role={u.role} size="small" />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center text-emerald-400 font-bold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{u.joined}</td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                      title="Edit Role"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground font-display">Edit User Role — {editingUser.name}</h3>
              <button onClick={() => setEditingUser(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">Select new system permission role:</p>
            <RoleSelector
              value={editingUser.role}
              onChange={(newR) => handleUpdateRole(editingUser.id, newR)}
            />
          </div>
        </div>
      )}

      {/* ADD NEW MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddUser} className="bg-card border border-border rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground font-display">Add New Team Member</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. David Miller"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-elevated border border-border text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Email Address</label>
              <input
                type="email"
                required
                placeholder="david@buildverse.io"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-elevated border border-border text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground mb-2 block">Assign System Role</label>
              <RoleSelector value={newRole} onChange={setNewRole} />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform"
            >
              Add User to BuildVerse DB
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
