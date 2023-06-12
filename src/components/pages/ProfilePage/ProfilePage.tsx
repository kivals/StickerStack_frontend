import { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks/hooks';
import EmptyAvatarImage from '../../../images/empty-avatar.svg';
import { IUserState } from '../../../interfaces';
import { sendVerificationCode } from '../../../store/authSlice';
import { updateUser } from '../../../store/userSlice';
import { profileName, registerEmail } from '../../../utils/registersRHF';
import { ImagePick } from '../../ImagePick/ImagePick';
import { ButtonWithText, Container, TitlePage } from '../../UI';
import ProfileInput from '../../UI/ProfileInput/ProfileInput';
import styles from './ProfilePage.module.scss';
import { setMessageIsOpen } from '../../../store/popupSlice';
import { Input } from '../../_UI/Input/Input';

const FIRSTNAME_INPUT_LABEL = 'firstName';
const LASTNAME_INPUT_LABEL = 'lastName';
const EMAIL_INPUT_LABEL = 'email';

const ProfilePage: React.FC = () => {
  const user = useSelector((state: { user: IUserState }) => state.user);

  const {
    register,
    getValues,
    setValue,
    formState: { errors, isValid },
    handleSubmit,
    resetField,
    watch,
  } = useForm<FieldValues>({
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user.email) {
      setValue(EMAIL_INPUT_LABEL, user.email);
    }

    if (user.firstName) {
      setValue(FIRSTNAME_INPUT_LABEL, user.firstName);
    }

    if (user.lastName) {
      setValue(LASTNAME_INPUT_LABEL, user.lastName);
    }
    // eslint-disable-next-line
  }, [user.email]);

  const firstname = getValues(FIRSTNAME_INPUT_LABEL);
  const lastname = getValues(LASTNAME_INPUT_LABEL);
  const email = getValues(EMAIL_INPUT_LABEL);

  const onSubmit = () => {
    const emailChanged = user.email !== email;
    dispatch(
      updateUser({
        email: email,
        firstName: firstname,
        lastName: lastname,
      }),
    ).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(setMessageIsOpen({ message: 'Успешно изменено', messageIsOpen: true }));
        if (emailChanged) {
          dispatch(sendVerificationCode());
        }
      }

      if (res.meta.requestStatus === 'rejected') {
        dispatch(
          setMessageIsOpen({
            message: 'Ошибка. Информация профиля не изменана',
            messageIsOpen: true,
            messageIsError: true,
          }),
        );
      }
    });
  };

  return (
    <main className={styles.profile}>
      <Container className={styles.profile_container}>
        <TitlePage>Мои данные</TitlePage>
        <section className={styles.section}>
          <ImagePick image={EmptyAvatarImage} />
          <div className={styles.profile_data}>
            <form className={styles.inputs} onSubmit={handleSubmit(onSubmit)}>
              <Input
                typeInput='profile'
                name={FIRSTNAME_INPUT_LABEL}
                type='text'
                placeholder='Имя'
                register={register}
                option={profileName}
                showSubButton={watch(FIRSTNAME_INPUT_LABEL)?.length}
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

              <ProfileInput
                name={EMAIL_INPUT_LABEL}
                type='email'
                placeholder='Email'
                register={register}
                option={registerEmail}
                iconVisible={watch(EMAIL_INPUT_LABEL)?.length}
                error={errors && errors[EMAIL_INPUT_LABEL]}
                onClear={() => resetField(EMAIL_INPUT_LABEL)}
              />
              <ButtonWithText
                className={styles.button}
                type='submit'
                disabled={
                  !(
                    user.firstName !== firstname ||
                    user.lastName !== lastname ||
                    user.email !== email
                  ) || !isValid
                }
              >
                Сохранить
              </ButtonWithText>
            </form>
            {!user.isVerified && (
              <>
                <p>Не пришло письмо подтверждения электронной почты? Жми кнопку!</p>
                <ButtonWithText
                  className={styles.button}
                  theme='transparent'
                  onClick={() => dispatch(sendVerificationCode())}
                >
                  Выслать повторно
                </ButtonWithText>
              </>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
};

export { ProfilePage };
