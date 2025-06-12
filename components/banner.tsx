import React from 'react';
import { getEnvironmentBgColor } from '../utils/environmentColors';

function Banner() {
    const env = process.env.NEXT_PUBLIC_APP_ENV;

    return (
        <div>
            {(env === 'development' || env === 'preview') && (
                <div className={`${getEnvironmentBgColor(env)} p-4 text-center text-xs text-white font-light`}>
                    You are currently in the <strong>{env === 'development' ? 'Development' : 'Production'}</strong> environment.
                </div>
            )}
        </div>
    );
}

export default Banner;
