import React, { useState } from "react";
import { Settings, Shield, Key, Database, RefreshCw, Save, Check } from "lucide-react";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [mongoUri, setMongoUri] = useState("mongodb://127.0.0.1:27017/buildverse");
  const [jwtSecret, setJwtSecret] = useState("super-secret-buildverse-jwt-token-key");
  const [corsOrigin, setCorsOrigin] = useState("*");

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">System & Environment Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure backend API server variables, security keys, and database connections.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* DATABASE SETTINGS */}
        <div className="p-6 rounded-2xl bg-[#121215] border border-[#27272A] space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#27272A] pb-3">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Database & Infrastructure</h3>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 mb-1 block">MongoDB Connection URI</label>
            <input
              type="text"
              value={mongoUri}
              onChange={(e) => setMongoUri(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#18181B] border border-[#27272A] text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* SECURITY & JWT SETTINGS */}
        <div className="p-6 rounded-2xl bg-[#121215] border border-[#27272A] space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#27272A] pb-3">
            <Key className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-white">Security & Secret Keys</h3>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 mb-1 block">JWT Secret Key</label>
            <input
              type="password"
              value={jwtSecret}
              onChange={(e) => setJwtSecret(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#18181B] border border-[#27272A] text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 mb-1 block">CORS Origin Allowed</label>
            <input
              type="text"
              value={corsOrigin}
              onChange={(e) => setCorsOrigin(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#18181B] border border-[#27272A] text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-colors"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-black" />
              <span>Settings Saved ✓</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
