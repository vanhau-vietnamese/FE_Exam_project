import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import TextArea from '../TextArea';

export default function FormTextArea({ control, name, title, defaultValue, ...rest }) {
  const { field } = useController({
    control,
    name,
    defaultValue: defaultValue || '',
  });

  return <TextArea label={title} name={name} value={field.value} {...rest} {...field} />;
}

FormTextArea.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
