import { Link } from 'react-router-dom';
import { ButtonSubmit } from '../UI/ButtonSubmit';
import { CheckBoxForm } from '../UI/CheckBoxForm';
import { InputForm } from '../UI/InputForm';
import { TitleForm } from '../UI/TitleForm';

import styles from './Signin.module.scss';

const Signin: React.FC = () => {
  return (
    <form className={styles.signin}>
      <TitleForm>Войти в личный кабинет</TitleForm>
      <div className={styles.inputs}>
        <InputForm placeholder='vashapochta@gmail.com' name='email' label='Email' type='email' />
        <InputForm
          placeholder='впишите пароль'
          name='password'
          label='Пароль'
          type='password'
          optionalLink={{ text: 'Забыли пароль?', to: '/' }}
        />
        <CheckBoxForm label='Запомнить меня' />
      </div>
      <ButtonSubmit>Войти</ButtonSubmit>
      <Link className={styles.link} to=''>Нет аккаунта? Зарегистрироваться</Link>
    </form>
  );
};

export { Signin };
