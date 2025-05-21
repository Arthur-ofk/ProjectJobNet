import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  name,
  type,
  value,
  onChange,
  required = false,
  placeholder = '',
  options = [],
  className = ''
}) => {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={id}>{label}</label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value as string}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="form-control"
        />
      ) : type === 'select' ? (
        <select
          id={id}
          name={name}
          value={value as string}
          onChange={onChange}
          required={required}
          className="form-control"
        >
          <option value="">-- Select an option --</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value as string | number}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="form-control"
        />
      )}
    </div>
  );
};

export default FormField;
