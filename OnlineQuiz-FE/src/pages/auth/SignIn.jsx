import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword, postNewPassword, postOTP } from '~/apis';
import Icons from '~/assets/icons';
import images from '~/assets/images';
import { Button, FormInput, Loading } from '~/components';
import { useAuth } from '~/hooks';
import { router } from '~/routes';
import { FormSignInInput } from '~/validations';

function SignInPage() {
  const { signInWithSocial, signInWithEmailPassword } = useAuth();
  const [isLoging, setIsLoging] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewPassword, setOpenNewPassword] = useState(false);
  const [openOPT, setOpenOPT] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');
  const [email, setEmail] = useState('');
  const [OTP, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const [repeatePass, setRepeatePass] = useState('');
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({ resolver: zodResolver(FormSignInInput), mode: 'onBlur' });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoging(true);
    try {
      await signInWithEmailPassword({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      setIsLoging(false);
      toast.error('Thông tin đăng nhập không chính xác', {
        toastId: 'login_failed',
      });
    }
  });

  const hadleOpenDialogInputEmail = () => {
    setOpenDialog(true);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Email không hợp lệ. Vui lòng nhập lại!');
      return;
    }
    try {
      await forgotPassword(email);
      setOpenDialog(false);
      setError('');
      setOpenOPT(true);
    } catch (error) {
      toast.error('Thông tin email không chính xác, vui lòng nhập lại!', {
        toastId: 'forot_password_failed',
      });
    }
  };

  const handleAcceptOTP = async () => {
    console.log(1);
    if (OTP.length !== 6 || OTP < 0) {
      toast.error('Hãy nhập OTP có đủ 6 số nguyên dương!');
      return;
    }
    try {
      const body = {
        otp: OTP,
        email: email,
      };
      const res = await postOTP(body);
      console.log('giỡn mặt', res);
      setOpenNewPassword(true);
      setOpenOPT(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra!', {
        toastId: 'OTP_failed',
      });
    }
  };

  const handleDoneNewPass = async () => {
    let error = false;
    if (!password) {
      setPasswordError('Mật khẩu không được để trống.');
      error = true;
    } else if (password.length < 8) {
      setPasswordError('Mật khẩu phải có ít nhất 8 ký tự.');
      error = true;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError('Mật khẩu phải chứa ít nhất 1 ký tự viết hoa.');
      error = true;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.');
      error = true;
    } else {
      setPasswordError('');
    }

    if (!repeatePass) {
      setRepeatPasswordError('Vui lòng nhập lại mật khẩu.');
      error = true;
    } else if (password !== repeatePass) {
      setRepeatPasswordError('Mật khẩu nhập lại không khớp.');
      error = true;
    } else {
      setRepeatPasswordError('');
    }

    if (!error) {
      try {
        const body = {
          password: password,
          repeatPassword: repeatePass,
        };
        await postNewPassword(body, email);
        setOpenNewPassword(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

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
            <p className="my-3 text-2xl font-bold text-center text-icon">Đăng nhập</p>
            <form onSubmit={onSubmit}>
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
              <div
                className="hover:text-blue-500 text-sm text-icon cursor-pointer"
                onClick={hadleOpenDialogInputEmail}
              >
                Quên mật khẩu?
              </div>
              <div className="text-left mt-5">
                <Button
                  type="submit"
                  disable={isLoging || isSubmitting}
                  className="w-full px-5 py-2 text-sm text-white bg-primary shadow-success hover:shadow-success_hover disabled:hover:shadow-none"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    {isLoging || isSubmitting ? (
                      <>
                        <Loading size="small" />
                        <p>Đang đăng nhập</p>
                      </>
                    ) : (
                      <p>Đăng nhập</p>
                    )}
                  </div>
                </Button>
              </div>
            </form>
            <div className="text-sm font-semibold text-center m-[12px_auto] text-icon">
              <span>Hoặc đăng nhập bằng</span>
            </div>
            <div className="flex items-center gap-8 w-full">
              <Button
                className="flex items-center justify-center p-2 flex-1 gap-2 text-gray-800 bg-strike shadow-sidebar hover:bg-[#c0c1cd] text-sm"
                onClick={() => signInWithSocial('google')}
              >
                <img src={images.google} alt="google_logo" />
                <p>Google</p>
              </Button>
              <Button
                className="flex items-center justify-center p-2 flex-1 gap-2 text-gray-800 bg-strike shadow-sidebar hover:bg-[#c0c1cd] text-sm"
                onClick={() => signInWithSocial('facebook')}
              >
                <img src={images.facebook} alt="facebook_logo" />
                <p>Facebook</p>
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <p className="mt-4 font-semibold text-icon text-[15px]">
                Bạn chưa có tài khoản?{' '}
                <Link to={router.signUp} className="text-primary font-bold hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {openDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Quên mật khẩu</h2>
            <form onSubmit={handleSubmitEmail}>
              <div className="text-sm text-icon font-bold mb-5">Vui lòng nhập email</div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 mb-5 block w-full border border-gray-300 rounded p-2"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md w-full">
                Gửi email
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('');
                  setOpenDialog(false);
                }}
                className="mt-2 text-gray-500 hover:text-red-500 hover:font-bold"
              >
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}
      {openOPT && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">
              Vui lòng kiểm tra email và nhập mã OTP chính xác nhé!
            </h2>

            <div className="text-sm text-icon font-bold mb-5">Nhập mã OTP</div>
            <input
              type="number"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              className="mt-1 mb-5 block w-full border border-gray-300 rounded p-2"
            />
            <button
              type="button"
              onClick={handleAcceptOTP}
              className="bg-green-600 text-white px-4 py-2 rounded-md w-full"
            >
              Xác nhận
            </button>
            <button
              type="button"
              onClick={() => setOpenOPT(false)}
              className="mt-2 text-gray-500 hover:text-red-500 hover:font-bold"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
      {openNewPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4 text-center">Tạo mật khẩu mới</h2>

            <div className="text-sm text-icon font-bold mb-5">Nhập mật khẩu mới</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 mb-1 block w-full border ${
                passwordError ? 'border-red-500' : 'border-gray-300'
              } rounded p-2`}
            />
            {passwordError && <p className="text-sm text-red-500 mb-5">{passwordError}</p>}

            <div className="text-sm text-icon font-bold mb-5">Nhập lại mật khẩu</div>
            <input
              type="password"
              value={repeatePass}
              onChange={(e) => setRepeatePass(e.target.value)}
              className={`mt-1 mb-1 block w-full border ${
                repeatPasswordError ? 'border-red-500' : 'border-gray-300'
              } rounded p-2`}
            />
            {repeatPasswordError && (
              <p className="text-sm text-red-500 mb-5">{repeatPasswordError}</p>
            )}

            <button
              type="button"
              onClick={handleDoneNewPass}
              className="bg-green-600 text-white px-4 py-2 rounded-md w-full"
            >
              Xác nhận
            </button>
            <button
              type="button"
              onClick={() => {
                setPassword('');
                setRepeatePass('');
                setPasswordError('');
                setRepeatPasswordError('');
                setOpenNewPassword(false);
              }}
              className="mt-2 text-gray-500 hover:text-red-500 hover:font-bold"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignInPage;
