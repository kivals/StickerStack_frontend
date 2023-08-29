import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../hooks/hooks';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, FieldValues } from 'react-hook-form';

import { AnimatePresence, motion } from 'framer-motion';
import { Sticker } from '../../Sticker/Sticker';
import { RadioButton, TextUnderline, ButtonWithText, TitlePage, Container } from '../../UI';
import { NewSticker } from '../../index';
import { InfoBox } from '../../InfoBox/InfoBox';
import { openPreview } from '../../../store/popupSlice';
import { pagePrice, pageSizePx, CART, CARDS_MAXIMUM } from '../../../utils/constants';
import { CartState, ICardsState } from '../../../interfaces';
import { addCard, setActive } from '../../../store/cardsSlice';
import { addItems, addSticker, updateCropping, updateSheets } from '../../../store/cartSlice';
import { generateRandomNumber } from '../../../utils/generateRandomNumber';
import { calculateStickerOnList } from '../../../utils/calculateStickerOnList';

import styles from './AddStickers.module.scss';
import { converter } from '../../../utils/converter';

const AddStickers: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cards = useSelector((state: { cards: ICardsState }) => state.cards.cards);
  const cart = useSelector((state: { cart: CartState }) => state.cart);
  const validation = useSelector((state: { cards: ICardsState }) => state.cards.valid);

  const fullPrice = pagePrice * cart.number_of_sheets;
  const fullAmount = cards.reduce((acc, item) => acc + item.amount, 0);
  const itemPrice = Math.round((pagePrice * cart.number_of_sheets) / fullAmount);

  const handleAddCard = () => {
    dispatch(
      addCard({
        image: '',
        shape: 'square',
        amount: 1,
        size: { width: 0, height: 0 },
        optimalSize: { width: 0, height: 0 },
        id: generateRandomNumber(),
        active: true,
        valid: false,
      }),
    );
  };

  useEffect(() => {
    if (cards) {
      calculateStickerOnList(cards, {
        paddingList: {
          top: pageSizePx.paddingList.top,
          right: pageSizePx.paddingList.right,
          bottom: pageSizePx.paddingList.bottom,
          left: pageSizePx.paddingList.left,
        },
        gapX: pageSizePx.gapX,
        gapY: pageSizePx.gapY,
        widthPage: pageSizePx.widthPage,
        heightPage: pageSizePx.heightPage,
      });

      dispatch(
        updateSheets(JSON.parse(localStorage.getItem('pagesWithStickers') || '[]')?.length || 1),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  const cropping = () => {
    if (cart.cropping) {
      return 'true';
    } else return 'false';
  };

  const { register } = useForm<FieldValues>({
    mode: 'onBlur',
    defaultValues: { cut: cropping() },
  });

  return (
    <main className={styles.add}>
      <Container className={styles.add_container}>
        <TitlePage type='main-title'>Заказать стикеры</TitlePage>
        <div className={styles.cards}>
          {cards.map((card) => (
            <AnimatePresence key={card.id}>
              <motion.div
                className={card.active ? styles.motion : styles.motion_inactive}
                initial={{
                  opacity: 0.4,
                  height: 0,
                }}
                animate={{
                  transition: {
                    height: { duration: 0.4 },
                    opacity: { duration: 0.25, delay: 0.15 },
                  },
                  opacity: 1,
                  height: 'auto',
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  transition: {
                    height: { duration: 0.4 },
                    opacity: { duration: 0.25 },
                  },
                }}
              >
                <NewSticker key={card.id} card={card} />
              </motion.div>
              {!card.active && (
                <motion.div
                  className={styles.motion}
                  initial={{
                    opacity: 0.4,
                    height: 0,
                  }}
                  animate={{
                    transition: {
                      height: { duration: 0.4 },
                      opacity: { duration: 0.25, delay: 0.15 },
                    },
                    opacity: 1,
                    height: 'auto',
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    transition: {
                      height: { duration: 0.4 },
                      opacity: { duration: 0.25 },
                    },
                  }}
                >
                  <Sticker onClick={() => dispatch(setActive(card.id))} />
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
        {cards.length < CARDS_MAXIMUM && (
          <ButtonWithText theme='transparent' onClick={handleAddCard} disabled={!validation}>
            Добавить стикер
          </ButtonWithText>
        )}
        <section className={styles.info}>
          <div className={styles.info_pages}>
            <InfoBox type='number' description='Количество листов'>
              {cart.number_of_sheets}
            </InfoBox>
            <TextUnderline
              type='button'
              className={styles.preview}
              onClick={() => dispatch(openPreview())}
            >
              Предпросмотр страницы
            </TextUnderline>
          </div>
          <div className={styles.flex}>
            <span className={styles.text}>Стоимость</span>
            <div className={styles.prices}>
              <span className={styles.price}>{fullPrice} ₽</span>
              <span className={styles.price_small}>{itemPrice}₽/ за шт</span>
            </div>
          </div>
          <form className={styles.options}>
            <RadioButton
              name='cut'
              value='false'
              register={register}
              onClick={() => dispatch(updateCropping(false))}
            >
              Оставить стикеры на листе
            </RadioButton>
            <RadioButton
              name='cut'
              value='true'
              register={register}
              onClick={() => dispatch(updateCropping(true))}
            >
              Вырезать стикеры по контуру
            </RadioButton>
          </form>
        </section>
        {cart.items.length === 0 ? (
          <ButtonWithText
            theme='filled'
            className={styles.button}
            onClick={() => {
              cards.forEach((card) => {
                dispatch(
                  addSticker({
                    amount: card.amount,
                    image: card.image.startsWith('data:image/png;base64,')
                      ? card.image.replace('data:image/png;base64,', '')
                      : card.image.startsWith('data:image/jpeg;base64,')
                      ? card.image.replace('data:image/jpeg;base64,', '')
                      : card.image.startsWith('data:image/jpg;base64,')
                      ? card.image.replace('data:image/jpg;base64,', '')
                      : '',
                    shape: card.shape,
                    height: card.size.height,
                    width: card.size.width,
                  }),
                );
              });
              navigate(CART);
            }}
            disabled={!validation}
          >
            Добавить в корзину
          </ButtonWithText>
        ) : (
          <ButtonWithText theme='filled' className={styles.button} onClick={() => navigate(CART)}>
            Перейти в корзину
          </ButtonWithText>
        )}
      </Container>
    </main>
  );
};

export { AddStickers };
