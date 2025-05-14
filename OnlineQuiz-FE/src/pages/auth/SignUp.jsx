import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Icons from '~/assets/icons';
import images from '~/assets/images';
import { Button, FormInput, Loading } from '~/components';
import { useAuth } from '~/hooks';
import { router } from '~/routes';
import { FormSignUpInput } from '~/validations';

function SignUpPage() {
  const navigate = useNavigate();
  const { signUpAccount } = useAuth();
  const [isResgisting, setIsResgisting] = useState(false);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({ resolver: zodResolver(FormSignUpInput), mode: 'onBlur' });

  const onSubmit = handleSubmit(async (data) => {
    setIsResgisting(true);
    try {
      await signUpAccount({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });
      setIsResgisting(false);
      navigate(router.root, { replace: true });
    } catch (error) {
      setIsResgisting(false);
      toast.error(error.message, { toastId: 'sign_up' });
    }
  });

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="items-center flex-grow-0 flex-shrink-0 hidden px-3 md:flex w-[50%]">
        <img
          src={images.dashboard}
          alt="..."
          className="block object-cover w-full h-full mx-auto"
        />
      </div>
      <div className="flex-1 md:max-w-[50%]">
        <div className="px-5 mx-auto">
          <div className="w-full ">
            <p className="my-3 text-2xl font-bold text-center text-icon">Đăng ký tài khoản</p>
            <form onSubmit={onSubmit}>
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
              <div className="text-left">
                <Button
                  type="submit"
                  className="w-full px-5 py-2 text-sm text-white bg-primary shadow-success hover:shadow-success_hover"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    {isResgisting || isSubmitting ? (
                      <>
                        <Loading size="small" />
                        <p>Đang đăng ký</p>
                      </>
                    ) : (
                      <p>Đăng ký ngay</p>
                    )}
                  </div>
                </Button>
              </div>
            </form>
            <div className="flex items-center justify-center">
              <p className="mt-4 font-semibold text-icon text-sm">
                Bạn đã có tài khoản?{' '}
                <Link to={router.signIn} className="text-primary font-bold hover:underline">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
