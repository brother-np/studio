
import { getApps, getSettings } from './actions';
import AppTable from './app-table';
import SettingsDialog from './settings-dialog';

export default async function DashboardPage() {
  // In a real app, this data would be fetched from a database.
  // For this scaffold, we're using a server action that reads from a static file.
  const apps = await getApps();
  const settings = await getSettings();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-headline">App Management</h1>
          <p className="text-muted-foreground">Add, edit, or delete app listings.</p>
        </div>
        <SettingsDialog initialSettings={settings} />
      </div>
      <AppTable initialApps={apps} />
    </div>
  );
}
