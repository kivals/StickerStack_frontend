import { useSelector } from 'react-redux';
import { useForm } from "react-hook-form";

import { ButtonWithText, TitlePage } from '../UI';
import { ImagePick } from '../ImagePick/ImagePick';
import ProfileInput from '../UI/ProfileInput/ProfileInput';

import { useAppDispatch } from '../../hooks/hooks';
import { IUserState } from '../../interfaces';
import { logOut } from '../../store/userSlice';

import EmptyAvatarImage from '../../images/empty-avatar.svg';
import { profileName } from "../../utils/registersRHF";
import styles from './ProfilePage.module.scss';

const FIRSTNAME_INPUT_LABEL = 'firstName';
const LASTNAME_INPUT_LABEL = 'lastName';

const ProfilePage: React.FC = () => {
  const email = useSelector((state: { user: IUserState }) => state.user.email);
  const {
    register,
    formState: {
      errors,
    },
    handleSubmit,
    resetField,
    watch,
  } = useForm({
    mode: 'onBlur',
  });

  const dispatch = useAppDispatch();

  const onLogOut = () => {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      return;
    }

    dispatch(logOut());
  };

  const onSubmit = () => {
    console.log('server request')
  }

  return (
    <main className={styles.profile}>
      <TitlePage>Мои данные</TitlePage>
      <div className={styles.container}>
        <ImagePick image={EmptyAvatarImage}/>
        <div className={styles.profile_data}>
          <form className={styles.inputs} onSubmit={handleSubmit(onSubmit)}>
            <ProfileInput
              name={FIRSTNAME_INPUT_LABEL}
              type='text'
              placeholder='Имя'
              register={register}
              option={profileName}
              iconVisible={watch(FIRSTNAME_INPUT_LABEL)?.length}
              error={errors && errors[FIRSTNAME_INPUT_LABEL]}
              onClear={() => resetField(FIRSTNAME_INPUT_LABEL)}
            />

            <ProfileInput
              name={LASTNAME_INPUT_LABEL}
              type='text'
              placeholder='Фамилия'
              register={register}
              option={profileName}
              iconVisible={watch(LASTNAME_INPUT_LABEL)?.length}
              error={errors && errors[LASTNAME_INPUT_LABEL]}
              onClear={() => resetField(LASTNAME_INPUT_LABEL)}
            />
            <ButtonWithText className={styles.button} type='submit' theme='filled'>
              Сохранить
            </ButtonWithText>
          </form>
        </div>
      </div>
    </main>
  );
};

export { ProfilePage };
