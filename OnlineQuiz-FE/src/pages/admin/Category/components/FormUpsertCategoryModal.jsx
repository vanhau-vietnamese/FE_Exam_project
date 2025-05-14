import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createCategory } from '~/apis';
import { FormInput, FormModalWarpper, FormTextArea } from '~/components';
import { CategorySchema } from '~/validations';

export default function FormUpsertCategoryModal({
  isEditing,
  //data,
  onCancel,
  className,
  onSuccess,
}) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(CategorySchema),
    // defaultValues: {
    //   title: data.title || '',
    //   description: data.description || '',
    // },
  });

  const onSubmit = async (data) => {
    try {
      const res = await createCategory(data);
      toast.success(`${isEditing ? 'Cập nhật' : 'Tạo mới'} danh mục thành công`, {
        toastId: 'upsert_category',
      });
      onSuccess(res);
    } catch (error) {
      toast.error('Có lỗi xảy ra', { toastId: 'upsert_category' });
    } finally {
      onCancel();
    }
  };

  return (
    <FormModalWarpper
      title={`${isEditing ? 'Cập nhật' : 'Tạo mới'} danh mục`}
      className={`mx-auto ${className}`}
      onCancel={onCancel}
      onConfirm={handleSubmit(onSubmit)}
    >
      <FormInput
        control={control}
        name="title"
        title="Tên danh mục"
        placeholder="Nhập tên danh mục"
        required
        error={errors.title?.message}
      />
      <FormTextArea
        control={control}
        name="description"
        title="Mô tả"
        placeholder="Viết mô tả danh mục..."
      />
    </FormModalWarpper>
  );
}

FormUpsertCategoryModal.propTypes = {
  data: PropTypes.object,
  isEditing: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  className: PropTypes.string,
};
