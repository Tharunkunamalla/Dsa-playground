import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './GlassDropdown.css';

const GlassDropdown = ({ options, value, onChange, placeholder = 'Select...', disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="glass-dropdown-container" ref={dropdownRef}>
      <button
        type="button"
        className="glass-dropdown-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <FaChevronDown className="glass-dropdown-arrow" size={12} />
      </button>

      <div className={`glass-dropdown-menu ${isOpen ? 'open' : ''}`}>
        {options.map((option) => (
          <div
            key={option.value}
            className={`glass-dropdown-item ${value === option.value ? 'selected' : ''}`}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlassDropdown;
