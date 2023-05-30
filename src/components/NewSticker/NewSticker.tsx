import { useState } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { FieldValues, useForm } from 'react-hook-form';

import { ButtonCustom, RadioButton, TooltipCustom } from '../UI';
import { DragAndDrop } from '../';
import { useAppDispatch } from '../../hooks/hooks';
import { deleteCard } from '../../store/cardsSlice';
import { ICard, ICardsState } from '../../interfaces';
import { registerAmount, registerSize } from '../../utils/registersRHF';

import { ReactComponent as RectSvg } from '../../images/icons/rect.svg';
import { ReactComponent as RectRondedSvg } from '../../images/icons/rect_rounded.svg';
import { ReactComponent as CircleSvg } from '../../images/icons/circle.svg';
import { ReactComponent as ContourSvg } from '../../images/icons/contour.svg';
import { tooltipText } from '../../utils/texts';

import styles from './NewSticker.module.scss';

interface IProps {
  card: ICard;
}

const NewSticker: React.FC<IProps> = ({ card }: IProps) => {
  const dispatch = useAppDispatch();
  const [customVisible, setCustomVisible] = useState<boolean>(false);
  const cards = useSelector((state: { cards: ICardsState }) => state.cards.cards);
  const [amount, setAmount] = useState<number>(card.amount);

  const handleDelete = () => {
    dispatch(deleteCard(card.id));
  };

  const {
    register,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onBlur',
    defaultValues: { size: 'optimal' },
  });

  return (
    <div className={styles.card}>
      <form className={styles.info}>
        <div className={styles.image}>
          <DragAndDrop card={card} />
        </div>

        <fieldset className={cn(styles.flex, styles.flex_shapes)}>
          <p className={styles.category}>Форма</p>
          <div className={styles.shapes}>
            <div className={styles.shape}>
              <div className={styles.shape_pic}>
                <RectSvg />
              </div>
              <span className={styles.shape_title}>Квадрат</span>
            </div>
            <div className={styles.shape}>
              <div className={styles.shape_pic}>
                <RectRondedSvg />
              </div>
              <span className={styles.shape_title}>Закругленный квадрат</span>
            </div>
            <div className={styles.shape}>
              <div className={styles.shape_pic}>
                <CircleSvg />
              </div>
              <span className={styles.shape_title}>Круг</span>
            </div>
            <div className={styles.shape}>
              <div className={styles.shape_pic}>
                <ContourSvg />
              </div>
              <span className={styles.shape_title}>По контуру</span>
            </div>
          </div>
        </fieldset>
        <div>
          <div className={styles.flex}>
            <p className={styles.category} onClick={() => console.log(errors)}>
              Количество стикеров
            </p>
            <input
              type='tel'
              className={cn(styles.input, styles.quantity_input)}
              {...register('amount', registerAmount)}
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className={styles.error}>{errors.amount && `${errors.amount?.message}`}</div>
        </div>

        <fieldset className={styles.flex}>
          <p className={styles.category}>Размер</p>
          <div className={styles.options}>
            <RadioButton
              register={register}
              name='size'
              value='optimal'
              onClick={() => setCustomVisible(false)}
            >
              Оптимальный размер
              <TooltipCustom text={tooltipText} />
            </RadioButton>
            <RadioButton
              register={register}
              name='size'
              value='custom'
              className={styles.size}
              onClick={() => setCustomVisible(true)}
            >
              Свой размер
              <div className={cn(customVisible ? styles.visible : styles.hidden)}>
                <div>
                  <input
                    placeholder='ширина'
                    type='tel'
                    className={cn(styles.input, styles.size_input)}
                    {...register('width', registerSize)}
                  />{' '}
                  x{' '}
                  <input
                    className={cn(styles.input, styles.size_input)}
                    placeholder='высота'
                    type='tel'
                    {...register('height', registerSize)}
                  />
                  <span className={cn(customVisible ? styles.visible : styles.hidden)}> см</span>
                </div>
                <div className={styles.error}>
                  {(errors.width || errors.height) &&
                    `${errors.width?.message || errors.height?.message}`}
                </div>
              </div>
            </RadioButton>
          </div>
        </fieldset>
        <div className={styles.flex}>
          <p className={styles.category}>Цвет фона</p>
          <label className={styles.text}>белый</label>
          <div className={styles.color_sample} />
        </div>
        <div className={styles.flex}>
          <p className={styles.category}>Материал</p>
          <p className={styles.text}>винил</p>
        </div>
      </form>
      {cards.length > 1 ? (
        <ButtonCustom
          type='delete'
          className={styles.delete}
          label='Удалить'
          onClick={handleDelete}
        />
      ) : null}
    </div>
  );
};

export { NewSticker };
