import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createAccoutAdmin } from '~/apis';
import Icons from '~/assets/icons';
import { FormInput, FormModalWarpper } from '~/components';
import { FormSignUpInput } from '~/validations';

export default function FormCreateAccoutAdmin({ onCancel, className, onsubmit }) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(FormSignUpInput),
  });

  const onSubmit = async (data) => {
    try {
      const body = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      };
      const result = await createAccoutAdmin(body);
      onsubmit(result);
      toast.success('Tạo tài khoản thành công', { toastId: 'create_accout' });
    } catch (error) {
      toast.error('Có lỗi xảy ra', { toastId: 'fail_create_accout' });
    } finally {
      onCancel();
    }
  };

  return (
    <FormModalWarpper
      title="Tạo mới tài khoản"
      className={`mx-auto ${className}`}
      onCancel={onCancel}
      onConfirm={handleSubmit(onSubmit)}
    >
      <FormInput
        control={control}
        title="Họ và tên"
        name="fullName"
        placeholder="Họ và tên"
        required
        type="text"
        icon={<Icons.User />}
        error={errors.fullName?.message}
      />
      <FormInput
        control={control}
        title="Địa chỉ Email"
        name="email"
        placeholder="Email"
        required
        type="text"
        icon={<Icons.Email />}
        error={errors.email?.message}
      />
      <FormInput
        control={control}
        title="Mật khẩu"
        name="password"
        placeholder="Mật khẩu"
        required
        type={'password'}
        icon={<Icons.Key />}
        error={errors.password?.message}
      />
      <FormInput
        control={control}
        title="Xác nhận mật khẩu"
        name="confirmPassword"
        placeholder="Xác nhận mật khẩu"
        required
        type={'password'}
        icon={<Icons.Key />}
        error={errors.confirmPassword?.message}
      />
    </FormModalWarpper>
  );
}

FormCreateAccoutAdmin.propTypes = {
  onCancel: PropTypes.func.isRequired,
  className: PropTypes.string,
  onsubmit: PropTypes.func,
};
