import { useEffect, useState } from 'react';
import cn from 'classnames';
import { useAppDispatch } from '../../../hooks/hooks';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, FieldValues } from 'react-hook-form';

import { openInfo, openMessage } from '../../../store/popupSlice';
import { TitlePage, Container, ButtonWithText, TextUnderline, Input } from '../../UI';
import { ADD_STICKERS, ORDERS } from '../../../utils/constants';
import { Sticker } from '../../Sticker/Sticker';
import { ICardsState, CartState } from '../../../interfaces';
import { InfoBox } from '../../InfoBox/InfoBox';
import { cleanCart, countTotal, updateAddress, uploadOrder } from '../../../store/cartSlice';
import { cleanCards } from '../../../store/cardsSlice';
import { converter } from '../../../utils/converter';

import image from '../../../images/cart-dog.png';
import { ReactComponent as WriteSvg } from '../../../images/icons/write-icon.svg';
import styles from './CartPage.module.scss';

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const cards = useSelector((state: { cards: ICardsState }) => state.cards.cards);
  const cart = useSelector((state: { cart: CartState }) => state.cart);

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldValues>({
    mode: 'onBlur',
  });

  useEffect(() => {
    setValue('address', cart.address);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch(countTotal());
    // eslint-disable-next-line
  }, [cart.items]);

  const onSubmit = () => {
    setLoading(true);
    dispatch(
      uploadOrder({
        cost: cart.cost,
        address: cart.address,
        number: cart.number_of_sheets,
        cropping: cart.cropping,
        stickers: cart.items.map((item) => {
          return {
            image:
              item.image.replace('data:image/png;base64,', '') ||
              item.image.replace('data:image/jpeg;base64,', '') ||
              item.image.replace('data:image/jpg;base64,', ''),
            shape: item.shape,
            amount: item.amount,
            width: Math.round(converter.pxToCm(item.size.width)),
            height: Math.round(converter.pxToCm(item.size.height)),
          };
        }),
      }),
    )
      .then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          dispatch(cleanCards());
          dispatch(cleanCart());
          dispatch(
            openInfo({
              title: 'Заказ оформлен!',
              text: 'Вся информация по заказу отправлена на почту. Следите за статусом его готовности в личном кабинете',
              buttonText: 'Заказать еще',
              onClick: () => navigate(ADD_STICKERS),
              buttonSecondText: 'Перейти к заказам',
              onClickSecond: () => navigate(ORDERS),
              image: image,
            }),
          );
        }
        if (res.meta.requestStatus === 'rejected') {
          dispatch(openMessage({ text: 'Не удалось оформить заказ', isError: true }));
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <main className={styles.cart}>
      <Container className={styles.cart_container}>
        <TitlePage type='main-title'>Корзина</TitlePage>
        {cart.items.length === 0 ? (
          <div className={styles.box}>
            <span className={styles.text}>Ваша корзина пуста</span>
            <ButtonWithText onClick={() => navigate(ADD_STICKERS)}>Заказать стикеры</ButtonWithText>
            <div className={styles.image} />
          </div>
        ) : (
          <div className={styles.flex}>
            <div className={cn(styles.banner, styles.cards)}>
              {cart.items.map((card) => (
                <Sticker key={card.id} card={card} />
              ))}
            </div>
            <form className={cn(styles.banner, styles.info)} onSubmit={handleSubmit(onSubmit)}>
              <InfoBox
                type='number'
                description='Количество листов'
                descriptionClass={styles.description}
              >
                {cart.number_of_sheets}
              </InfoBox>
              {cart.cropping && <span>Вырезать по контуру</span>}
              <InfoBox
                type='number'
                description='Количество стикеров'
                descriptionClass={styles.description}
              >
                {cart.totalAmount}
              </InfoBox>
              <InfoBox
                type='simple'
                description='Способ доставки'
                descriptionClass={styles.description}
              >
                Самовывоз
              </InfoBox>
              <InfoBox type='simple' description='Адрес' className={styles.address_box}>
                <div className={styles.address_box}>
                  <Input
                    register={register}
                    option={{
                      required: 'Введите адрес',
                      onBlur: (value: React.FocusEvent<HTMLInputElement>) => {
                        setValue('address', value.target.value.trim());
                        dispatch(updateAddress(value.target.value));
                      },
                    }}
                    name='address'
                    type='textarea'
                    className={cn(styles.address, errors.address && styles.address_error)}
                    placeholder='Выберите адрес'
                  />
                  <WriteSvg className={styles.write} />
                </div>
              </InfoBox>
              <InfoBox type='simple' description='Итого' numberClass={styles.number}>
                {cart.cost} ₽
              </InfoBox>
              <div className={styles.buttons}>
                <TextUnderline theme='secondary' onClick={() => navigate(ADD_STICKERS)}>
                  Редактировать заказ
                </TextUnderline>
                <ButtonWithText className={styles.button} type='submit' loading={loading}>
                  Оформить заказ
                </ButtonWithText>
              </div>
            </form>
          </div>
        )}
      </Container>
    </main>
  );
};

export { CartPage };
