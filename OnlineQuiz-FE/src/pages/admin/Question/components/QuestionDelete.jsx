import { toast } from 'react-toastify';
import { deleteQuestion } from '~/apis';
import Icons from '~/assets/icons';
import { DialogComfirm } from '~/components';
import { useQuestionStore } from '~/store';

export default function QuestionDelete() {
  const { openModal, setTargetQuestion, targetQuestion, removeQuestion } = useQuestionStore(
    (state) => state
  );

  const handleDeleteQuestion = async () => {
    try {
      const response = await deleteQuestion(targetQuestion.id);
      if (response) {
        removeQuestion(targetQuestion.id);
        openModal(null);
        setTargetQuestion(null);
        toast.success('Xóa câu hỏi thành công', { toastId: 'delete_question' });
      }
    } catch (error) {
      toast.error('Câu hỏi đang được sử dụng, không thể xóa!', { toastId: 'delete_question' });
    }
  };

  const handleCancel = () => {
    openModal(null);
    setTargetQuestion(null);
  };

  return (
    <DialogComfirm
      icon={<Icons.Exclamation />}
      color="danger"
      title="Xác nhận xóa câu hỏi"
      body="Bạn có chắc chắn muốn xóa câu hỏi này không?"
      onCancel={handleCancel}
      onConfirm={handleDeleteQuestion}
      className="max-w-lg text-danger"
    />
  );
}
