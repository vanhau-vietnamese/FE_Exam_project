import { useState } from 'react';

import { Backdrop, Button } from '~/components';
import FormQuestionCreate from './FormQuestionCreate';
import Icons from '~/assets/icons';

function CreateQuestionModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="flex items-center gap-x-2 px-3 py-2 text-sm text-white bg-primary shadow-success hover:shadow-success_hover"
        onClick={() => setOpen(true)}
      >
        <Icons.Plus />
        <p>Thêm câu hỏi</p>
      </Button>
      {open && (
        <Backdrop opacity={0.25}>
          <FormQuestionCreate onClose={() => setOpen(false)} />
        </Backdrop>
      )}
    </>
  );
}

export default CreateQuestionModal;
