import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ value, onChange, error, disabled, onResend, onSubmit }) => {
  const [digits, setDigits] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);

  // Initialize refs array and auto-focus first input
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
    // Auto-focus the first input when component mounts
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  // Update digits when value prop changes
  useEffect(() => {
    const newDigits = Array(6).fill('');
    for (let i = 0; i < Math.min(value.length, 6); i++) {
      newDigits[i] = value[i] || '';
    }
    setDigits(newDigits);
  }, [value]);

  const handleDigitChange = (index, digitValue) => {
    // Only allow single digits
    const cleanValue = digitValue.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = cleanValue;
    setDigits(newDigits);

    // Update parent component
    const newValue = newDigits.join('');
    onChange(newValue);

    // Auto-focus next input
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Handle Enter key to submit
    const currentValue = digits.join('');
    if (e.key === 'Enter' && currentValue.length === 6 && onSubmit) {
      onSubmit(currentValue);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

    if (pastedData.length <= 6) {
      const newDigits = Array(6).fill('');
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newDigits[i] = pastedData[i];
      }
      setDigits(newDigits);
      onChange(pastedData);

      // Focus the next empty input or the last input
      const nextEmptyIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  const getInputClassName = (index) => {
    let baseClass = "w-10 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm";

    if (error) {
      baseClass += " border-red-500 bg-red-50 text-red-800 focus:border-red-600 focus:ring-red-500 animate-pulse";
    } else if (digits[index]) {
      baseClass += " border-green-500 bg-green-50 text-green-800 focus:border-green-600 focus:ring-green-500 transform scale-105";
    } else {
      baseClass += " border-gray-300 bg-white hover:border-indigo-400 focus:border-indigo-500 focus:ring-indigo-500";
    }

    if (disabled) {
      baseClass += " bg-gray-100 text-gray-400 cursor-not-allowed";
    }

    return baseClass;
  };

  const newValue = digits.join('');
  const isComplete = newValue.length === 6;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Enter Verification Code</h3>
        <p className="text-sm text-gray-600">
          We've sent a 6-digit code to your phone
        </p>
      </div>

      <div className="flex space-x-2 sm:space-x-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={disabled}
            className={getInputClassName(index)}
            aria-label={`Verification code digit ${index + 1}`}
            autoComplete="one-time-code"
          />
        ))}
      </div>

      <div className="text-center space-y-2">
        {isComplete && !error && (
          <div className="flex items-center justify-center text-green-600 text-sm">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Code entered successfully
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm">
            The code that was entered is incorrect. Please try again.
          </div>
        )}

        <div className="text-xs text-gray-500">
          Didn't receive a code?{' '}
          <button
            className="text-indigo-600 hover:text-indigo-800 underline focus:outline-none"
            onClick={onResend}
            type="button"
          >
            Resend code
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPInput;