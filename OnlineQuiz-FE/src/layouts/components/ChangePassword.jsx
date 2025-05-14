import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { changePassword } from '~/apis';
import { FormInput, FormModalWarpper } from '~/components';
import { ChangePasswordSchema } from '~/validations';

function ChangePassword({ onCancel }) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(ChangePasswordSchema),
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await changePassword(data);
      toast.success('Đổi mật khẩu thành công');
    } catch (error) {
      toast.error(error.message);
    } finally {
      onCancel();
      setLoading(false);
    }
  };

  return (
    <FormModalWarpper
      title="Tạo mới danh mục"
      className={`mx-auto md:max-w-[450px]`}
      loading={loading || isSubmitting}
      onCancel={onCancel}
      onConfirm={handleSubmit(onSubmit)}
    >
      <FormInput
        control={control}
        name="oldPassword"
        type="password"
        title="Mật khẩu hiện tại"
        placeholder="Mật khẩu hiện tại"
        error={errors.oldPassword?.message}
        required
      />
      <FormInput
        control={control}
        name="newPassword"
        type="password"
        title="Mật khẩu mới"
        placeholder="Mật khẩu mới"
        error={errors.newPassword?.message}
        required
      />
      <FormInput
        control={control}
        name="confirmPassword"
        type="password"
        title="Xác nhận mật khẩu"
        placeholder="Xác nhận mật khẩu"
        error={errors.confirmPassword?.message}
        required
      />
    </FormModalWarpper>
  );
}

ChangePassword.propTypes = {
  onCancel: PropTypes.func.isRequired,
};

export default ChangePassword;
