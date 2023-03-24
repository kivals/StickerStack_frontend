import { FieldValues, useForm } from 'react-hook-form';

import { ButtonSubmit, InputForm, TitleForm, TextForm } from '../UI';
import { Signin } from '../';

import { switchForm } from '../../store/popupSlice';
import { useAppDispatch } from '../../hooks/hooks';
import { registerEmail } from '../../utils/registersRHF';
import styles from './ResetPassword.module.scss';

const ResetPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.resetpassword}>
      <TitleForm>Восстановление пароля</TitleForm>
      <InputForm
        label='E-mail'
        name='email'
        placeholder='Введите E-mail'
        register={{ ...register('email', registerEmail) }}
        error={errors?.email?.message ? `${errors?.email?.message}` : ''}
      />
      <TextForm>
        Мы направим ссылку на Вашу почту для восстановления пароля
      </TextForm>
      <ButtonSubmit>Восстановить пароль</ButtonSubmit>
      <button
        className={styles.button}
        onClick={() => dispatch(switchForm(Signin))}
      >
        <span className={styles.button_text}>Вернуться назад</span>
      </button>
    </form>
  );
};

export { ResetPassword };
