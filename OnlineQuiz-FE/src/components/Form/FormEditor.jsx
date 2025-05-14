import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Editor } from '../TextEditor';

export default function FormEditor({
  title,
  required,
  error,
  control,
  name,
  placeholder,
  disabled,
}) {
  const { field } = useController({ name, control, defaultValue: '' });

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="block text-sm font-semibold font-body text-icon">
          {title} {required && <strong className="text-error">*</strong>}
        </span>
        {(error || !field.value) && (
          <p className="text-xs font-semibold pointer-events-none text-error">{error}</p>
        )}
      </div>
      <Editor
        data={field.value}
        onChange={field.onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`rounded-[5px] transition-all ${error ? '!border-error' : '!border-[#d1d2de]'}`}
      />
    </div>
  );
}

FormEditor.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
};
