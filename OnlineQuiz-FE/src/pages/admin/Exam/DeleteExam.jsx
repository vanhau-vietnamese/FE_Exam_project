import { toast } from 'react-toastify';
import { deleteQuiz } from '~/apis';
import Icons from '~/assets/icons';
import { DialogComfirm } from '~/components';
import { useExamStore } from '~/store';

export default function DeleteExam() {
  const { openModal, setTargetExam, targetExam, removeExam } = useExamStore((state) => state);

  const handleDeleteExam = async () => {
    try {
      const response = await deleteQuiz(targetExam.id);
      if (response) {
        removeExam(targetExam.id);
        openModal(null);
        setTargetExam(null);
        toast.success('Xóa bài tập thành công', { toastId: 'delete_exam' });
      }
    } catch (error) {
      toast.error(error.message, { toastId: 'delete_exam' });
    }
  };

  const handleCancel = () => {
    openModal(null);
    setTargetExam(null);
  };

  return (
    <DialogComfirm
      icon={<Icons.Exclamation />}
      title="Xác nhận xóa bài tập"
      body="Bạn có chắc chắn muốn xóa bài tập này không?"
      onCancel={handleCancel}
      onConfirm={handleDeleteExam}
      className="max-w-lg text-danger"
    />
  );
}
