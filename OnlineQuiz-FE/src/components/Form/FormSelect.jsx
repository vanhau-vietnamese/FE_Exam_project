import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import { Select } from '~/components';

export default function FormSelect({
  control,
  name,
  label,
  required,
  options = [],
  error,
  disabled,
  defaultValue,
  onChange,
  className = '',
}) {
  const { field } = useController({ control, name, defaultValue });
  const handleOnchange = (e) => {
    field.onChange(e);
    onChange(e);
  };
  return (
    <Select
      label={label}
      name={name}
      error={error}
      disabled={disabled}
      options={options}
      required={required}
      value={field.value}
      onChange={handleOnchange}
      className={className}
    />
  );
}

FormSelect.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  required: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  defaultValue: PropTypes.array,
  className: PropTypes.string,
  onChange: PropTypes.func,
};
