import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const TextArea = forwardRef(function Component(
  { name, required, label, className, error, ...rest },
  ref
) {
  return (
    <div className={`flex flex-col w-full gap-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={name} className="text-sm font-bold text-icon">
            {label}
            {required && <strong className="text-error"> *</strong>}
          </label>
        )}
        {error && <p className="text-xs font-semibold pointer-events-none text-error">{error}</p>}
      </div>
      <div className="flex items-center">
        <textarea
          ref={ref}
          id={name}
          className={`resize-none text-sm flex-1 w-full px-4 py-2 border outline-none transition-all placeholder:font-medium disabled:bg-[#dee0ec] font-semibold rounded-md border-strike hover:border-primary focus:border-primary focus:shadow-valid
        disabled:hover:border-strike disabled:text-gray-500 min-h-32
      `}
          {...rest}
        />
      </div>
    </div>
  );
});

TextArea.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  value: PropTypes.any,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

export default TextArea;
