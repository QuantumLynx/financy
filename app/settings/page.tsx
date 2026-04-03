"use client";

import { Bell, Moon, Sun, Globe, DollarSign, Shield, User, Mail, Palette } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account preferences and application settings</p>
      </div>

      {/* Account Settings */}
      <div className="bg-card-dark rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <User size={20} className="text-emerald-500" />
            Account
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div>
              <div className="font-semibold text-white mb-1">Email</div>
              <div className="text-sm text-slate-400">user@example.com</div>
            </div>
            <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm">
              Change
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div>
              <div className="font-semibold text-white mb-1">Password</div>
              <div className="text-sm text-slate-400">••••••••</div>
            </div>
            <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm">
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-card-dark rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Palette size={20} className="text-emerald-500" />
            Appearance
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={20} className="text-slate-400" /> : <Sun size={20} className="text-slate-400" />}
              <div>
                <div className="font-semibold text-white">Dark Mode</div>
                <div className="text-sm text-slate-400">Use dark theme across the app</div>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                darkMode ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div>
              <div className="font-semibold text-white mb-1">Currency</div>
              <div className="text-sm text-slate-400">Display currency for prices</div>
            </div>
            <select className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>JPY (¥)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div>
              <div className="font-semibold text-white mb-1">Language</div>
              <div className="text-sm text-slate-400">Interface language</div>
            </div>
            <select className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card-dark rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Bell size={20} className="text-emerald-500" />
            Notifications
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div>
              <div className="font-semibold text-white">Email Notifications</div>
              <div className="text-sm text-slate-400">Receive email updates about your portfolio</div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                notifications ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div>
              <div className="font-semibold text-white">Price Alerts</div>
              <div className="text-sm text-slate-400">Get notified when stocks reach target prices</div>
            </div>
            <button
              onClick={() => setPriceAlerts(!priceAlerts)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                priceAlerts ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  priceAlerts ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div>
              <div className="font-semibold text-white">News Digest</div>
              <div className="text-sm text-slate-400">Daily summary of market news</div>
            </div>
            <select className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Never</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-card-dark rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Shield size={20} className="text-emerald-500" />
            Privacy & Security
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div>
              <div className="font-semibold text-white">Two-Factor Authentication</div>
              <div className="text-sm text-slate-400">Add an extra layer of security</div>
            </div>
            <button className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-colors text-sm font-medium">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div>
              <div className="font-semibold text-white">Active Sessions</div>
              <div className="text-sm text-slate-400">Manage your logged-in devices</div>
            </div>
            <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm">
              View
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div>
              <div className="font-semibold text-white">Data Export</div>
              <div className="text-sm text-slate-400">Download your portfolio data</div>
            </div>
            <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 rounded-xl border border-red-500/30 overflow-hidden">
        <div className="p-6 border-b border-red-500/30">
          <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg">
            <div>
              <div className="font-semibold text-white">Delete Account</div>
              <div className="text-sm text-slate-400">Permanently delete your account and all data</div>
            </div>
            <button className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
