import PropTypes from 'prop-types';
import { useId } from 'react';
import { useController } from 'react-hook-form';
import Icons from '~/assets/icons';
import { Button } from '~/components';

const InputType = {
  ['single_choice']: 'radio',
  ['multiple_choice']: 'checkbox',
};

const InputTypeStyle = {
  ['radio']: 'rounded-full',
  ['checkbox']: 'rounded-md',
};

export default function AnswersCreate({
  control,
  name,
  inputName,
  type,
  error,
  onRemove,
  onRadioChange,
}) {
  const id = useId();

  const { field: fieldIsCorrect } = useController({
    control,
    name: `${name}.isCorrect`,
    defaultValue: false,
  });

  const { field: fieldContent } = useController({
    control,
    name: `${name}.content`,
    defaultValue: '',
  });

  return (
    <div className="inline-flex items-center gap-2">
      <label htmlFor={id} className="relative flex items-center p-3 cursor-pointer">
        <input
          id={id}
          type={InputType[type] || 'checkbox'}
          checked={Boolean(fieldIsCorrect.value)}
          className={`before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none border-2 border-strike checked:border-primary transition-all hover:border-primary ${
            InputTypeStyle[InputType[type] || 'checkbox']
          }`}
          {...fieldIsCorrect}
          onChange={(e) =>
            InputType[type] === 'radio'
              ? onRadioChange()
              : fieldIsCorrect.onChange(e.target.checked)
          }
          name={inputName}
        />
        <span
          className={`absolute text-white bg-primary transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100 ${
            InputTypeStyle[InputType[type]]
          }`}
        >
          <Icons.Check />
        </span>
      </label>
      <input
        {...fieldContent}
        type="text"
        className={`flex-1 w-full px-4 py-2 border outline-none transition-all placeholder:font-medium text-sm text-[#3b3e66] font-semibold rounded-md ${
          error
            ? 'border-error focus:shadow-invalid'
            : 'border-strike hover:border-green-400 focus:border-secondary focus:shadow-valid'
        }`}
        placeholder="Nhập đáp án..."
      />
      <Button
        className="p-2 text-danger hover:bg-danger hover:bg-opacity-10 disabled:hover:bg-transparent"
        onClick={onRemove}
      >
        <Icons.Trash />
      </Button>
    </div>
  );
}

AnswersCreate.propTypes = {
  control: PropTypes.object,
  type: PropTypes.oneOf(['single_choice', 'multiple_choice']),
  name: PropTypes.string,
  inputName: PropTypes.string,
  error: PropTypes.object,
  onRadioChange: PropTypes.func,
  onRemove: PropTypes.func,
};
