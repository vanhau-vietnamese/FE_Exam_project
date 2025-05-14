import PropTypes from 'prop-types';

function Select({
  name,
  label,
  options,
  onChange,
  value,
  error,
  required,
  disabled,
  className,
  icon,
  ...rest
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={name} className="text-sm font-bold text-icon mb-1">
            {label}
            {required && <strong className="text-error"> *</strong>}
          </label>
        )}
        {error && <p className="text-xs font-semibold pointer-events-none text-error">{error}</p>}
      </div>
      <div className="w-full flex items-center">
        {icon && (
          <div className="text-icon px-4 py-2 bg-[#eeeff8] border border-r-0 border-strike rounded-s-md max-h-[37px]">
            {icon}
          </div>
        )}

        <select
          value={value}
          className={`text-sm flex-1 w-full px-4 py-2 font-body border outline-none ${
            icon ? 'rounded-e-md' : 'rounded-md'
          } transition-all text-[#3b3e66] cursor-pointer disabled:bg-[#eeeff8] disabled:border-none disabled:cursor-auto font-semibold ${
            error
              ? 'border-error focus:shadow-invalid'
              : 'border-strike hover:border-primary60 focus:border-primary40'
          } `}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        >
          <option hidden />
          {options.map((item, index) => (
            <option value={item.value} key={index} className="font-semibold">
              {item.display}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Select;

Select.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  icon: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};
