import React from 'react';

function Banner() {
    return (
        <div>
            {process.env.NEXT_PUBLIC_APP_ENV === 'development' && (
                <div className="bg-indigo-600 p-4 text-center text-xs text-white font-light">
                    You are currently in the <strong>Development</strong> environment.
                </div>
            )}

            {process.env.NEXT_PUBLIC_APP_ENV === 'preview' && (
                <div className="bg-pink-600 p-4 text-center text-xs text-white font-light">
                    You are currently in the <strong>Production</strong> environment.
                </div>
            )}
        </div>
    );
}

export default Banner;