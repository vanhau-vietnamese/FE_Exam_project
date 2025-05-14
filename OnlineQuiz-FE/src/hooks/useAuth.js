import bcrypt from 'bcryptjs';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as signOutFirebase,
} from 'firebase/auth';
import { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createAccountWithSocial, getMe, register } from '~/apis/authApis';
import { authentication } from '~/config';
import { router } from '~/routes';
import { useUserStore } from '~/store';

export function useAuth() {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore((state) => state);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    setLoading(true);
    const unregisterAuthObserver = onAuthStateChanged(authentication, async (credential) => {
      if (credential) {
        localStorage.setItem('access_token', credential.accessToken);
        getMe()
          .then((res) => setUser(res))
          .catch(() => localStorage.removeItem('access_token'))
          .finally(() => setLoading(false));
      } else {
        localStorage.removeItem('access_token');
        setLoading(false);
      }
    });

    return () => unregisterAuthObserver();
  }, [setUser]);

  const signInWithSocial = async (platform) => {
    setLoading(true);

    let provider = null;
    switch (platform) {
      case 'google':
        provider = new GoogleAuthProvider();
        break;
      case 'facebook':
        provider = new FacebookAuthProvider();
        break;
      default:
        break;
    }

    signInWithPopup(authentication, provider)
      .then(async ({ user: data }) => {
        localStorage.setItem('access_token', data.accessToken);
        getMe()
          .then((res) => setUser(res))
          .catch(async () => {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(data.uid, salt);

            await createAccountWithSocial({
              fullName: data.displayName,
              email: data.email,
              firebaseId: data.uid,
              password: hash,
            })
              .catch((err) => {
                signOutFirebase(authentication);
                localStorage.removeItem('access_token');
                setLoading(false);
                console.error(err.message);
              })
              .finally(() => setLoading(false));
          });
      })
      .catch(() => setLoading(false));
  };

  const signInWithEmailPassword = ({ email, password }) =>
    signInWithEmailAndPassword(authentication, email, password)
      .then(async ({ user }) => {
        localStorage.setItem('access_token', user.accessToken);
        await getMe()
          .then((res) => setUser(res))
          .catch(async () => {
            await signOutFirebase(authentication);
            localStorage.removeItem('access_token');
            return Promise.reject('Thông tin đăng nhập không chính xác');
          })
          .finally(() => setLoading(false));
      })
      .catch(() => {
        return Promise.reject('Thông tin đăng nhập không chính xác');
      })
      .finally(() => setLoading(false));

  const signOut = () => {
    signOutFirebase(authentication)
      .then(() => {
        setUser(null);
        localStorage.removeItem('access_token');
        navigate(router.signIn);
      })
      .catch((error) => {
        toast.error(error.message, { toastId: 'firebase_sign_out' });
      });
  };

  const signUpAccount = async ({ fullName, email, password }) => {
    try {
      const res = await register({ fullName, email, password });
      localStorage.setItem('access_token', res);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const changePassword = async ({ oldPassword, newPassword }) => {
    console.log('Change Password', { oldPassword, newPassword });
  };

  return {
    user,
    loading,
    signInWithEmailPassword,
    signInWithSocial,
    signUpAccount,
    signOut,
    changePassword,
  };
}
