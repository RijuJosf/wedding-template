import React from 'react';

const WeddingTemplate = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white font-sans">
      {/* Header Section */}
      <header className="text-center py-12 opacity-0 animate-fadeIn">
        <h1 className="text-5xl md:text-6xl font-serif text-gray-800 transition-all duration-500">
          Our Wedding
        </h1>
        <p className="mt-4 text-xl text-gray-600 transition-opacity duration-700">
          Join us for a day of love and celebration
        </p>
        <p className="mt-2 text-lg text-gray-500"> [Bride's Name] & [Groom's Name] </p>
        <p className="mt-2 text-lg text-gray-500">[Date] | [Location]</p>
      </header>

      {/* Hero Section */}
      <section
        className="relative h-96 bg-cover bg-center opacity-0 animate-slideIn"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1519741497674-4113f4c0b600)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-1000">
          <h2 className="text-4xl text-white font-serif">Together Forever</h2>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-16 px-4 md:px-16 text-center">
        <h2 className="text-3xl font-serif text-gray-800 mb-8 opacity-0 animate-fadeInUp">
          Event Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="opacity-0 animate-fadeInUp animation-delay-200">
            <h3 className="text-xl font-semibold text-gray-700">Ceremony</h3>
            <p className="mt-2 text-gray-600">[Time]</p>
            <p className="text-gray-600">[Venue Name]</p>
            <p className="text-gray-600">[Address]</p>
          </div>
          <div className="opacity-0 animate-fadeInUp animation-delay-400">
            <h3 className="text-xl font-semibold text-gray-700">Reception</h3>
            <p className="mt-2 text-gray-600">[Time]</p>
            <p className="text-gray-600">[Venue Name]</p>
            <p className="text-gray-600">[Address]</p>
          </div>
          <div className="opacity-0 animate-fadeInUp animation-delay-600">
            <h3 className="text-xl font-semibold text-gray-700">Dress Code</h3>
            <p className="mt-2 text-gray-600">Formal Attire</p>
            <p className="text-gray-600">Colors: [Suggested Colors]</p>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-16 bg-pink-100 text-center opacity-0 animate-fadeIn">
        <h2 className="text-3xl font-serif text-gray-800 mb-8">
          RSVP
        </h2>
        <p className="text-gray-600 mb-6">Kindly respond by [RSVP Date]</p>
        <button className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 hover:scale-105 transition-all duration-300">
          RSVP Now
        </button>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center bg-gray-800 text-white opacity-0 animate-fadeIn">
        <p>We can't wait to celebrate with you!</p>
        <p className="mt-2">[Bride's Name] & [Groom's Name]</p>
      </footer>

      {/* Inline CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-slideIn {
          animation: slideIn 1s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
};

export default WeddingTemplate;