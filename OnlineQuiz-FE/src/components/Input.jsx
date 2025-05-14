import PropTypes from 'prop-types';

export default function Input({
  name,
  type = 'text',
  value,
  disabled,
  onChange,
  required,
  icon,
  label,
  className,
  placeholder,
  onKeyDown,
}) {
  return (
    <div className={`flex flex-col w-full gap-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={name} className="text-sm font-bold text-icon">
            {label}
            {required && <strong className="text-error"> *</strong>}
          </label>
        )}
      </div>
      <div className="flex items-center">
        {icon && (
          <div className="text-icon px-4 py-2 bg-[#eeeff8] border border-r-0 border-strike rounded-s-md">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={name}
          value={value}
          autoComplete="off"
          className={`text-sm flex-1 w-full px-4 py-2 border outline-none transition-all placeholder:font-medium disabled:bg-[#dee0ec] font-semibold ${
            icon ? 'rounded-e-md' : 'rounded-md'
          } border-strike hover:border-primary focus:border-primary focus:shadow-valid
          disabled:hover:border-strike disabled:text-gray-500
        `}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
}

Input.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.oneOf(['text', 'password', 'number', 'email']),
  onChange: PropTypes.func,
  value: PropTypes.any,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onKeyDown: PropTypes.func,
  icon: PropTypes.node,
};
