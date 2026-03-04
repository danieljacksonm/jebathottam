'use client';

import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface SipConfig {
  id: number;
  sip_server_url: string;
  sip_username?: string;
  sip_password?: string;
  dial_in_number: string;
  country_code: string;
  sip_provider: string;
  max_dial_in_participants: number;
  recording_enabled: boolean;
  is_active: boolean;
}

export default function ConferenceSipSettings() {
  const [config, setConfig] = useState<SipConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SipConfig>>({});

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const data = await apiGet<{ success: boolean; data: SipConfig }>(
        '/conferences/sip-config'
      );
      if (data.success && data.data) {
        setConfig(data.data);
        setFormData(data.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await apiPost<{ success: boolean; data: SipConfig }>(
        '/conferences/sip-config',
        formData
      );

      if (response.success) {
        setSuccess('SIP configuration saved successfully!');
        setConfig(response.data as SipConfig);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading SIP configuration...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        📞 Conference Dial-In Settings (India)
      </h2>

      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700 dark:text-blue-200">
          <strong>ℹ️ Note:</strong> Configure your Asterisk/FreeSWITCH SIP server for free dial-in. See{' '}
          <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">docs/INDIA-SIP-SETUP.md</code> for setup instructions.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 p-4 rounded-lg mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SIP Server URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            SIP Server URL
          </label>
          <input
            type="text"
            value={formData.sip_server_url || ''}
            onChange={(e) =>
              setFormData({ ...formData, sip_server_url: e.target.value })
            }
            placeholder="e.g., sip://asterisk.yourdomain.com:5060"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Your SIP server address (Asterisk, FreeSWITCH, or similar)
          </p>
        </div>

        {/* SIP Provider */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            SIP Provider
          </label>
          <select
            value={formData.sip_provider || 'Asterisk'}
            onChange={(e) =>
              setFormData({ ...formData, sip_provider: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary-500"
          >
            <option value="Asterisk">Asterisk (Recommended)</option>
            <option value="FreeSWITCH">FreeSWITCH</option>
            <option value="Kamailio">Kamailio</option>
            <option value="OpenSIPS">OpenSIPS</option>
            <option value="Jami">Jami (Free)</option>
          </select>
        </div>

        {/* Dial-In Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            📱 Dial-In Phone Number (India)
          </label>
          <input
            type="tel"
            value={formData.dial_in_number || ''}
            onChange={(e) =>
              setFormData({ ...formData, dial_in_number: e.target.value })
            }
            placeholder="e.g., +91-XXXX-XXXX-XXXX"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Phone number users can call to join conferences (must start with +91 for India)
          </p>
        </div>

        {/* Country Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Country Code
            </label>
            <input
              type="text"
              value={formData.country_code || '+91'}
              onChange={(e) =>
                setFormData({ ...formData, country_code: e.target.value })
              }
              placeholder="+91"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Max Dial-In Participants
            </label>
            <input
              type="number"
              value={formData.max_dial_in_participants || 50}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  max_dial_in_participants: parseInt(e.target.value),
                })
              }
              min="5"
              max="500"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* SIP Credentials (Optional) */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Optional: SIP Credentials
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.sip_username || ''}
              onChange={(e) =>
                setFormData({ ...formData, sip_username: e.target.value })
              }
              placeholder="SIP Username"
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary-500"
            />
            <input
              type="password"
              value={formData.sip_password || ''}
              onChange={(e) =>
                setFormData({ ...formData, sip_password: e.target.value })
              }
              placeholder="SIP Password"
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Recording */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="recording"
            checked={formData.recording_enabled || false}
            onChange={(e) =>
              setFormData({ ...formData, recording_enabled: e.target.checked })
            }
            className="w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor="recording" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable conference recording
          </label>
        </div>

        {/* Info Box */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            💡 How Users Will Join:
          </h4>
          <ol className="text-sm text-gray-700 dark:text-gray-400 space-y-1 list-decimal list-inside">
            <li>
              Browser users: Visit link, click "Join Video"
            </li>
            <li>
              Phone users: Call{' '}
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {formData.dial_in_number || 'your-number'}
              </code>
            </li>
            <li>When prompted: Enter 6-digit conference PIN</li>
            <li>Say name and press #</li>
          </ol>
        </div>

        {/* Save Button */}
        <Button
          type="submit"
          disabled={saving}
          className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-semibold"
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </form>

      {/* Resources */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
          📚 Need Help Setting Up?
        </h4>
        <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
          <li>📖 See: <code className="bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded">docs/INDIA-SIP-SETUP.md</code></li>
          <li>🎯 VPS Providers: DigitalOcean, Vultr, AWS EC2</li>
          <li>💰 Estimate: ₹600-1000/month (completely free if using Jami)</li>
          <li>🌐 Test Call: Use any SIP client to test your server</li>
        </ul>
      </div>
    </div>
  );
}
