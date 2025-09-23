import React from 'react';

const DelightfulLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-50">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-32 h-32 border-4 border-transparent border-t-white border-r-white rounded-full animate-spin"></div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
        </div>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute -top-4 -left-4 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
        <div className="absolute -top-2 -right-6 w-1 h-1 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -bottom-3 -left-5 w-1.5 h-1.5 bg-green-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-4 -right-3 w-1 h-1 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Loading text */}
      <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
        <div className="text-white text-lg font-medium tracking-wider">
          <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>L</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>o</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>a</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>d</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>i</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.5s' }}>n</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.6s' }}>g</span>
          <span className="inline-block animate-bounce ml-2" style={{ animationDelay: '0.7s' }}>.</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.8s' }}>.</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.9s' }}>.</span>
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 border border-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
};

export default DelightfulLoader;