import cn from 'classnames';
import styles from './ButtonCustom.module.scss';

export type ButtonType = 'close' | 'person' | 'cart' | 'delete';

interface IProps {
  type: ButtonType;
  className?: string;
  label: string;
  onClick?: () => void;
}

const ButtonCustom: React.FC<IProps> = ({ type, className, label, onClick }: IProps) => {
  return (
    <button
      className={cn(styles.button, styles[`button_${type}`], className)}
      aria-label={label}
      onClick={onClick}
    />
  );
};

export { ButtonCustom };
