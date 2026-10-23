const MaintenanceMessage = () => {
  const message = process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE ?? "";

  if (!message) return null;

  return (
    <>
      <div className="sticky text-center py-6 top-0 z-50 w-full bg-blue-500 text-white font-bold">
        {message}
      </div>
    </>
  );
};

export default MaintenanceMessage;
