import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export const COUNTRIES = [
  // European Core & Blue Card destinations (Germany default)
  { code: 'DE', name: 'Germany', dialCode: '+49', priority: 1 },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', priority: 2 },
  { code: 'IE', name: 'Ireland', dialCode: '+353', priority: 3 },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', priority: 4 },
  { code: 'FR', name: 'France', dialCode: '+33', priority: 5 },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', priority: 6 },
  { code: 'AT', name: 'Austria', dialCode: '+43', priority: 7 },
  { code: 'SE', name: 'Sweden', dialCode: '+46', priority: 8 },
  { code: 'DK', name: 'Denmark', dialCode: '+45', priority: 9 },
  { code: 'NO', name: 'Norway', dialCode: '+47', priority: 10 },
  { code: 'FI', name: 'Finland', dialCode: '+358', priority: 11 },
  { code: 'PL', name: 'Poland', dialCode: '+48', priority: 12 },
  { code: 'BE', name: 'Belgium', dialCode: '+32', priority: 13 },
  { code: 'ES', name: 'Spain', dialCode: '+34', priority: 14 },
  { code: 'IT', name: 'Italy', dialCode: '+39', priority: 15 },
  { code: 'PT', name: 'Portugal', dialCode: '+351', priority: 16 },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', priority: 17 },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', priority: 18 },
  { code: 'HU', name: 'Hungary', dialCode: '+36', priority: 19 },
  { code: 'RO', name: 'Romania', dialCode: '+40', priority: 20 },
  { code: 'GR', name: 'Greece', dialCode: '+30', priority: 21 },
  { code: 'EE', name: 'Estonia', dialCode: '+372', priority: 22 },
  { code: 'LT', name: 'Lithuania', dialCode: '+370', priority: 23 },
  { code: 'LV', name: 'Latvia', dialCode: '+371', priority: 24 },
  // Major International & Applicant Regions
  { code: 'IN', name: 'India', dialCode: '+91', priority: 25 },
  { code: 'US', name: 'United States', dialCode: '+1', priority: 26 },
  { code: 'CA', name: 'Canada', dialCode: '+1', priority: 27 },
  { code: 'AU', name: 'Australia', dialCode: '+61', priority: 28 },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', priority: 29 },
  { code: 'SG', name: 'Singapore', dialCode: '+65', priority: 30 },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', priority: 31 },
  { code: 'BR', name: 'Brazil', dialCode: '+55', priority: 32 },
  { code: 'TR', name: 'Turkey', dialCode: '+90', priority: 33 },
  { code: 'JP', name: 'Japan', dialCode: '+81', priority: 34 },
];

/**
 * Flag component using SVG image with CSS colored fallback so flags render
 * reliably on Windows OS (where emoji flags are not supported natively).
 */
export function CountryFlag({ code, className = 'w-5 h-3.5' }) {
  const [imgError, setImgError] = useState(false);
  const codeLower = code?.toLowerCase();

  if (imgError || !codeLower) {
    return (
      <span className={`inline-flex items-center justify-center rounded-xs bg-zinc-200 text-[9px] font-bold text-zinc-700 shrink-0 ${className}`}>
        {code}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${codeLower}.png`}
      alt={`${code} flag`}
      loading="lazy"
      onError={() => setImgError(true)}
      className={`rounded-xs object-cover shadow-2xs shrink-0 border border-black/10 ${className}`}
    />
  );
}

export default function PhoneCountryInput({
  value = '',
  onChange,
  disabled = false,
  required = true,
  placeholder,
}) {
  // Default country is Germany (DE, +49)
  const defaultCountry = COUNTRIES[0];
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [nationalNumber, setNationalNumber] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Parse initial or passed value
  useEffect(() => {
    if (!value) {
      setNationalNumber('');
      return;
    }
    // If value already has country code, try to match it
    const trimmed = value.trim();
    if (trimmed.startsWith('+')) {
      const match = COUNTRIES.find((c) => trimmed.startsWith(c.dialCode));
      if (match) {
        setSelectedCountry(match);
        setNationalNumber(trimmed.slice(match.dialCode.length).trim());
        return;
      }
    }
    // Otherwise keep national number
    setNationalNumber(trimmed.replace(selectedCountry.dialCode, '').trim());
  }, []);

  // Update parent when country or national number changes
  function notifyChange(country, number) {
    const cleanNum = number.trim();
    if (!cleanNum) {
      onChange('');
    } else {
      onChange(`${country.dialCode} ${cleanNum}`);
    }
  }

  function handleNumberChange(e) {
    const inputVal = e.target.value;
    // If user pastes full number with '+', detect country
    if (inputVal.startsWith('+')) {
      const match = COUNTRIES.find((c) => inputVal.startsWith(c.dialCode));
      if (match) {
        setSelectedCountry(match);
        const rest = inputVal.slice(match.dialCode.length).trim();
        setNationalNumber(rest);
        notifyChange(match, rest);
        return;
      }
    }

    setNationalNumber(inputVal);
    notifyChange(selectedCountry, inputVal);
  }

  function handleSelectCountry(country) {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearch('');
    notifyChange(country, nationalNumber);
  }

  // Filter countries for search
  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.dialCode.includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }, [search]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus search input when opening dropdown
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Input Group: Country Selector Pill + Phone Text Field */}
      <div className="flex rounded-xl border border-zinc-200 bg-white transition focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 overflow-hidden shadow-2xs">
        {/* Country Selector Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 bg-zinc-50/80 hover:bg-zinc-100/80 px-3 py-2 text-xs font-semibold text-zinc-900 border-r border-zinc-200 transition shrink-0 cursor-pointer select-none"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          title={`${selectedCountry.name} (${selectedCountry.dialCode})`}
        >
          <CountryFlag code={selectedCountry.code} className="w-5 h-3.5" />
          <span className="font-mono text-zinc-800">{selectedCountry.dialCode}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-zinc-800' : ''
            }`}
          />
        </button>

        {/* National Number Input */}
        <input
          type="tel"
          required={required}
          disabled={disabled}
          value={nationalNumber}
          onChange={handleNumberChange}
          placeholder={placeholder || (selectedCountry.code === 'DE' ? '170 1234567' : '9876543210')}
          className="w-full bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
        />
      </div>

      {/* Dropdown Menu (6 Items Visible at Once, Rest Scrollable) */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-72 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* Search Header */}
          <div className="relative mb-1.5 px-1">
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search country or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-8 pr-7 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 focus:bg-white"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Country List: Exactly 6 items visible (~240px) then scroll */}
          <div className="max-h-[240px] overflow-y-auto divide-y divide-zinc-50 pr-0.5 scrollbar-thin">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = country.code === selectedCountry.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelectCountry(country)}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs transition cursor-pointer text-left h-10 ${
                      isSelected
                        ? 'bg-zinc-100 text-zinc-950 font-bold'
                        : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CountryFlag code={country.code} className="w-5 h-3.5 shrink-0" />
                      <span className="truncate">{country.name}</span>
                    </div>
                    <span className="font-mono text-zinc-500 text-[11px] shrink-0 font-medium">
                      {country.dialCode}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-zinc-400">
                No matching country found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
