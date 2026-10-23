const MaintenanceScreen = ({ appName }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl">Scheduled Maintenance</h1>
        <p className="mt-4">
          {appName} is temporarily unavailable while maintenance is being
          performed.
        </p>
      </div>
    </div>
  );
};

export default MaintenanceScreen;
