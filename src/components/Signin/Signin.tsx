import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import {
  ButtonSubmit,
  CheckBoxForm,
  TitleForm,
  NewInput,
} from '../UI';
import { Signup, ResetPassword } from '../';

import {
  setIsOpen,
  setMessageIsOpen,
  switchForm,
} from '../../store/popupSlice';
import { useAppDispatch } from '../../hooks/hooks';
import { getUser, signIn } from '../../store/userSlice';
import { registerEmail, registerPassword } from '../../utils/registersRHF';
import styles from './Signin.module.scss';

const Signin: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    mode: 'onBlur',
  });

  const userEmail = getValues('email');
  const userPassword = getValues('password');

  const onSubmit = () => {
    dispatch(signIn({ email: userEmail, password: userPassword }))
      .then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          dispatch(getUser());
          dispatch(setIsOpen(false));
        }

        if (res.meta.requestStatus === 'rejected' && res.payload === '400') {
          dispatch(
            setMessageIsOpen({
              messageIsOpen: true,
              message: 'Неверная почта или пароль',
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form className={styles.signin} onSubmit={handleSubmit(onSubmit)}>
      <TitleForm>Войти в личный кабинет</TitleForm>
      <div className={styles.inputs}>
        <NewInput 
          register={register}
          option={registerEmail}
          error={errors?.email}
          placeholder='Введите E-mail'
          name='email'
          label='E-mail'
          type='email'
        />
        <NewInput
          register={register}
          option={registerPassword}
          error={errors?.password}
          placeholder='Введите пароль'
          name='password'
          label='Пароль'
          type='password'
          optionalButton={
            !location.pathname.startsWith('/api/auth/verifyemail')
              ? {
                  text: 'Забыли пароль?',
                  onClick: () => {
                    dispatch(switchForm(ResetPassword));
                  },
                }
              : {
                  text: '',
                  onClick: () => {
                    return;
                  },
                }
          }
          optionalEyeButton={{
            visible: watch('password') !== (undefined || ''),
          }}
        />
        <CheckBoxForm
          name='rememberCheckbox'
          register={register('rememberCheckbox')}
        >
          Запомнить меня
        </CheckBoxForm>
      </div>
      <ButtonSubmit>Войти</ButtonSubmit>
      {!location.pathname.startsWith('/api/auth/verifyemail') ? (
        <span className={styles.link}>
          Нет аккаунта?{' '}
          <button
            onClick={() => dispatch(switchForm(Signup))}
            type='button'
            className={styles.button}
          >
            <span className={styles.text}>Зарегистрироваться</span>
          </button>
        </span>
      ) : null}
    </form>
  );
};

export { Signin };
