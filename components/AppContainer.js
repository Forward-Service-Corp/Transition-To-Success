import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Layout from './layout';
import useAppRouter from '../hooks/useAppRouter';

// Import all view components
import DashboardView from '../views/DashboardView';
import DreamsView from '../views/DreamsView';
import LoginView from '../views/LoginView';
import LifeAreaSurveysView from '../views/LifeAreaSurveysView';
import CarePlansView from '../views/CarePlansView';
import JourneyView from '../views/JourneyView';
import DirectoryView from '../views/DirectoryView';
import ProfileView from '../views/ProfileView';
import ClientsView from '../views/ClientsView';
import UsersView from '../views/UsersView';
import SettingsView from '../views/SettingsView';
import ReportsView from '../views/ReportsView';
import MapOfMyDreamsView from '../views/MapOfMyDreamsView';
import DisclaimerView from '../views/DisclaimerView';
import AddNewReferralView from '../views/AddNewReferralView';
import NewLifeAreaSurveyView from '../views/NewLifeAreaSurveyView';

const AppContainer = () => {
  const { data: session } = useSession();
  const { currentView, viewLoading, navigateToView, router } = useAppRouter();

  // Skip SPA rendering for authentication routes - let NextAuth handle them
  if (router.pathname.startsWith('/auth/') || router.pathname.startsWith('/api/auth/')) {
    return null;
  }

  // Map view names to components
  const viewComponents = {
    Dashboard: DashboardView,
    Dreams: DreamsView,
    Login: LoginView,
    LoginSms: LoginView, // Reuse login for now
    LifeAreaSurveys: LifeAreaSurveysView,
    CarePlans: CarePlansView,
    Journey: JourneyView,
    Directory: DirectoryView,
    Profile: ProfileView,
    Clients: ClientsView,
    Users: UsersView,
    Settings: SettingsView,
    Reports: ReportsView,
    MapOfMyDreams: MapOfMyDreamsView,
    Disclaimer: DisclaimerView,
    AddNewReferral: AddNewReferralView,
    NewLifeAreaSurvey: NewLifeAreaSurveyView,
    NotFound: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 text-sm">Page not found</div>
      </div>
    )
  };

  // Get the current view component
  const ViewComponent = viewComponents[currentView] || viewComponents.NotFound;

  // Show loading state during view transitions
  if (viewLoading) {
    return (
      <Layout title={"Loading..."} session={session}>
        <Head>
          <title>TTS / Loading...</title>
        </Head>
        <div className="flex items-center justify-center h-64">
          <div className="uppercase text-gray-600 text-sm">loading...</div>
        </div>
      </Layout>
    );
  }

  // Handle login views (no layout wrapper)
  if (currentView === 'Login' || currentView === 'LoginSms') {
    return (
      <>
        <Head>
          <title>TTS / Login</title>
        </Head>
        <ViewComponent navigateToView={navigateToView} router={router} />
      </>
    );
  }

  // Handle protected views (with layout wrapper)
  return (
    <Layout
      title={getPageTitle(currentView)}
      session={session}
      navigateToView={navigateToView}
    >
      <Head>
        <title>TTS / {getPageTitle(currentView)}</title>
      </Head>
      <ViewComponent navigateToView={navigateToView} router={router} />
    </Layout>
  );
};

// Helper function to get page titles
const getPageTitle = (viewName) => {
  const titles = {
    Dashboard: 'Dashboard',
    Dreams: 'Dreams',
    LifeAreaSurveys: 'Life Area Surveys',
    CarePlans: 'CARE Plans',
    Journey: 'The Journey',
    Directory: 'CARE Network',
    Profile: 'Profile',
    Clients: 'My Clients',
    Users: 'Users',
    Settings: 'Settings',
    Reports: 'Reports',
    MapOfMyDreams: 'Map of My Dreams',
    Disclaimer: 'Disclaimer',
    AddNewReferral: 'Add New Referral',
    NewLifeAreaSurvey: 'New Life Area Survey'
  };

  return titles[viewName] || viewName;
};

export default AppContainer;