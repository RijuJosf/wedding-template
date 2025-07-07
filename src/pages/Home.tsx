const Home = () => {
  return (
    <div className="py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to My App!</h1>
        <p className="text-lg text-gray-600 mb-8">
          This is your home page. Start exploring or manage your account.
        </p>
        <div className="space-x-4">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Explore
          </button>
          <button
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Account Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;