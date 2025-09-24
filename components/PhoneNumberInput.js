import React, { useState, useRef, useEffect } from 'react';

const PhoneNumberInput = ({ value, onChange, error, disabled, onSubmit }) => {
  const [digits, setDigits] = useState(Array(10).fill(''));
  const inputRefs = useRef([]);

  // Initialize refs array and auto-focus first input
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 10);
    // Auto-focus the first input when component mounts
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  // Update digits when value prop changes
  useEffect(() => {
    // Strip hyphens, + signs, and any non-digits from incoming value
    let cleanValue = value.replace(/\D/g, '');

    // Strip US country code if present (remove leading 1 if 11 digits)
    if (cleanValue.length === 11 && cleanValue.startsWith('1')) {
      cleanValue = cleanValue.slice(1);
    }

    const newDigits = Array(10).fill('');
    for (let i = 0; i < Math.min(cleanValue.length, 10); i++) {
      newDigits[i] = cleanValue[i] || '';
    }
    setDigits(newDigits);
  }, [value]);

  const handleDigitChange = (index, digitValue) => {
    // Only allow single digits
    const cleanValue = digitValue.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = cleanValue;
    setDigits(newDigits);

    // Update parent component with formatted phone number (with hyphens)
    const newValue = newDigits.join('');
    const formattedValue = formatPhoneNumberForAPI(newValue);
    onChange(formattedValue);

    // Auto-focus next input
    if (cleanValue && index < 9) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Format phone number with US country code and hyphens for API
  const formatPhoneNumberForAPI = (phoneValue) => {
    if (phoneValue.length === 10) {
      return `+1-${phoneValue.slice(0, 3)}-${phoneValue.slice(3, 6)}-${phoneValue.slice(6, 10)}`;
    }
    return phoneValue; // Return unformatted if not complete
  };

  // Format phone number with hyphens for display
  const getFormattedPhoneNumber = () => {
    const phoneValue = digits.join('');
    if (phoneValue.length === 10) {
      return `+1-${phoneValue.slice(0, 3)}-${phoneValue.slice(3, 6)}-${phoneValue.slice(6, 10)}`;
    } else if (phoneValue.length >= 6) {
      return `${phoneValue.slice(0, 3)}-${phoneValue.slice(3, 6)}-${phoneValue.slice(6)}`;
    } else if (phoneValue.length >= 3) {
      return `${phoneValue.slice(0, 3)}-${phoneValue.slice(3)}`;
    }
    return phoneValue;
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
    if (e.key === 'ArrowRight' && index < 9) {
      inputRefs.current[index + 1]?.focus();
    }

    // Handle Enter key to submit
    const currentValue = digits.join('');
    if (e.key === 'Enter' && currentValue.length === 10 && onSubmit) {
      onSubmit(formatPhoneNumberForAPI(currentValue));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    let pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

    // Strip country code if present (remove leading 1 if 11 digits)
    if (pastedData.length === 11 && pastedData.startsWith('1')) {
      pastedData = pastedData.slice(1);
    }

    if (pastedData.length <= 10) {
      const newDigits = Array(10).fill('');
      for (let i = 0; i < Math.min(pastedData.length, 10); i++) {
        newDigits[i] = pastedData[i];
      }
      setDigits(newDigits);
      const formattedPastedValue = formatPhoneNumberForAPI(pastedData);
      onChange(formattedPastedValue);

      // Focus the next empty input or the last input
      const nextEmptyIndex = Math.min(pastedData.length, 9);
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  const getInputClassName = (index) => {
    let baseClass = "w-8 sm:w-10 h-10 sm:h-12 text-center text-base sm:text-lg font-semibold border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    if (error) {
      baseClass += " border-red-500 focus:border-red-500 focus:ring-red-500";
    } else if (digits[index]) {
      baseClass += " border-green-500 bg-green-50 text-green-800 focus:border-green-600 focus:ring-green-500";
    } else {
      baseClass += " border-gray-300 focus:border-indigo-500 focus:ring-indigo-500";
    }

    if (disabled) {
      baseClass += " bg-gray-100 text-gray-400 cursor-not-allowed";
    }

    return baseClass;
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="text-left self-start pb-2 text-gray-700 font-extralight">
        <span className="font-bold text-black">Mobile</span> Phone Number
      </div>

      <div className="flex space-x-1 sm:space-x-2">
        {/* Area Code Group (3 digits) */}
        <div className="flex space-x-1 bg-gray-50 rounded-lg p-1 sm:p-2">
          {digits.slice(0, 3).map((digit, index) => (
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
              aria-label={`Phone digit ${index + 1}`}
            />
          ))}
        </div>

        <div className="self-center text-gray-400 font-bold text-sm">-</div>

        {/* Exchange Group (3 digits) */}
        <div className="flex space-x-1 bg-gray-50 rounded-lg p-1 sm:p-2">
          {digits.slice(3, 6).map((digit, index) => (
            <input
              key={index + 3}
              ref={(el) => (inputRefs.current[index + 3] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleDigitChange(index + 3, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index + 3, e)}
              disabled={disabled}
              className={getInputClassName(index + 3)}
              aria-label={`Phone digit ${index + 4}`}
            />
          ))}
        </div>

        <div className="self-center text-gray-400 font-bold text-sm">-</div>

        {/* Number Group (4 digits) */}
        <div className="flex space-x-1 bg-gray-50 rounded-lg p-1 sm:p-2">
          {digits.slice(6, 10).map((digit, index) => (
            <input
              key={index + 6}
              ref={(el) => (inputRefs.current[index + 6] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleDigitChange(index + 6, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index + 6, e)}
              disabled={disabled}
              className={getInputClassName(index + 6)}
              aria-label={`Phone digit ${index + 7}`}
            />
          ))}
        </div>
      </div>

      {/* Display formatted phone number */}
      {digits.join('').length > 0 && (
        <div className="text-center mt-3">
          <div className="text-lg font-mono font-semibold text-gray-700 bg-gray-50 px-4 py-2 rounded-lg inline-block">
            {getFormattedPhoneNumber()}
          </div>
        </div>
      )}

      <div className="text-left self-start text-xs text-gray-500 mt-2">
        Example: +1-555-666-7777
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center">
          There was no account with this phone number associated. Try logging in with your email and adding your mobile number to your account.
        </div>
      )}
    </div>
  );
};

export default PhoneNumberInput;