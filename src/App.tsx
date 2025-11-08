import { useAppStore } from './store/useAppStore';
import { UserSelection } from './components/UserSelection';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { QuickAdd } from './views/QuickAdd';
import { TableView } from './views/TableView';
import { TimelineView } from './views/TimelineView';
import { KanbanView } from './views/KanbanView';
import { GalleryView } from './views/GalleryView';

function App() {
  const { currentUser, currentView } = useAppStore();

  // If no user is selected, show the user selection screen
  if (!currentUser) {
    return <UserSelection onSelectUser={(user) => useAppStore.getState().setCurrentUser(user)} />;
  }

  // Render the appropriate view based on currentView
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'quick-add':
        return <QuickAdd />;
      case 'table':
        return <TableView />;
      case 'timeline':
        return <TimelineView />;
      case 'kanban':
        return <KanbanView />;
      case 'gallery':
        return <GalleryView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderView()}
    </Layout>
  );
}

export default App;
