import { useCallback } from 'react';

import { TextUnderline } from '../UI';
import { useAppDispatch } from '../../hooks/hooks';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { openOrder } from '../../store/popupSlice';
import { IOrderState } from '../../interfaces';

import styles from './OrderOptions.module.scss';

interface IProps {
  setIsOpen: (open: boolean) => void;
  order: IOrderState;
}

const OrderOptions: React.FC<IProps> = ({ order, setIsOpen }: IProps) => {
  const dispatch = useAppDispatch();

  const ref = useOutsideClick(
    useCallback(() => {
      setTimeout(() => setIsOpen(false), 100);
    }, []),
  );
  return (
    <div className={styles.options} ref={ref}>
      <TextUnderline
        className={styles.button}
        onClick={() => {
          order && dispatch(openOrder(order));
          setIsOpen(false);
        }}
      >
        Просмотр заказа
      </TextUnderline>
      <TextUnderline onClick={() => setIsOpen(false)} className={styles.button}>
        Повторить заказ
      </TextUnderline>
      <TextUnderline onClick={() => setIsOpen(false)} className={styles.button}>
        Удалить
      </TextUnderline>
    </div>
  );
};

export { OrderOptions };