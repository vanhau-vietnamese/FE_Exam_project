import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';

export default function FormInput({
  control,
  name,
  title,
  type = 'text',
  required,
  defaultValue,
  error,
  icon,
  className = '',
  disabled,
  ...rest
}) {
  const { field } = useController({
    control,
    name,
    defaultValue: defaultValue || '',
  });
  return (
    <div className="flex flex-col w-full mb-5 gap-y-1">
      <div className="flex items-center justify-between">
        {title && (
          <label htmlFor={name} className="text-sm font-bold text-icon">
            {title}
            {required && <strong className="text-error"> *</strong>}
          </label>
        )}
        {(error || !field.value) && (
          <p className="text-xs font-semibold pointer-events-none text-error">{error}</p>
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
          autoComplete="off"
          className={`text-sm flex-1 w-full px-4 py-2 border outline-none transition-all placeholder:font-medium disabled:bg-[#dee0ec] font-semibold ${
            icon ? 'rounded-e-md' : 'rounded-md'
          } ${
            error
              ? 'border-error focus:shadow-invalid'
              : 'border-strike hover:border-primary focus:border-primary focus:shadow-valid'
          }
          disabled:hover:border-strike disabled:text-gray-500
          ${className}`}
          disabled={disabled}
          {...rest}
          {...field}
        />
      </div>
    </div>
  );
}

FormInput.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  type: PropTypes.oneOf(['text', 'password', 'email', 'number']),
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
