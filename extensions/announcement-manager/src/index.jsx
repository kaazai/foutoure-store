import React, { useState, useEffect } from 'react';
import {
  Page,
  Layout,
  Card,
  Button,
  TextField,
  DatePicker,
  ChoiceList,
  Banner,
} from '@shopify/polaris';

export default function AnnouncementManager() {
  const [settings, setSettings] = useState({
    enabled: false,
    text: '',
    endDate: new Date(),
    promoCode: '',
    gradientFrom: 'purple-600',
    gradientTo: 'pink-600',
  });

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const response = await fetch('/api/settings/announcements');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to load settings',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      const response = await fetch('/api/settings/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save');

      setStatus({
        type: 'success',
        message: 'Settings saved successfully',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to save settings',
      });
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <Page title="Announcement Bar Manager">
      <Layout>
        {status.message && (
          <Layout.Section>
            <Banner
              status={status.type === 'success' ? 'success' : 'critical'}
              onDismiss={() => setStatus({ type: '', message: '' })}
            >
              {status.message}
            </Banner>
          </Layout.Section>
        )}

        <Layout.Section>
          <Card sectioned>
            <ChoiceList
              title="Status"
              choices={[
                { label: 'Enabled', value: 'true' },
                { label: 'Disabled', value: 'false' },
              ]}
              selected={[settings.enabled.toString()]}
              onChange={([value]) =>
                setSettings({ ...settings, enabled: value === 'true' })
              }
            />
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            <TextField
              label="Announcement Text"
              value={settings.text}
              onChange={(value) => setSettings({ ...settings, text: value })}
              multiline
            />
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            <DatePicker
              month={settings.endDate.getMonth()}
              year={settings.endDate.getFullYear()}
              selected={settings.endDate}
              onChange={(date) => setSettings({ ...settings, endDate: date })}
              label="End Date"
            />
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            <TextField
              label="Promo Code"
              value={settings.promoCode}
              onChange={(value) => setSettings({ ...settings, promoCode: value })}
            />
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            <TextField
              label="Gradient Start Color"
              value={settings.gradientFrom}
              onChange={(value) =>
                setSettings({ ...settings, gradientFrom: value })
              }
              helpText="Enter a Tailwind color class (e.g., purple-600)"
            />
            <TextField
              label="Gradient End Color"
              value={settings.gradientTo}
              onChange={(value) => setSettings({ ...settings, gradientTo: value })}
              helpText="Enter a Tailwind color class (e.g., pink-600)"
            />
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Button primary onClick={handleSave}>
            Save Changes
          </Button>
        </Layout.Section>
      </Layout>
    </Page>
  );
} 