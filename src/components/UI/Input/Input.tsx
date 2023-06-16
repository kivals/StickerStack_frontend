import cn from 'classnames';
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

import styles from './Input.module.scss';

interface IProps {
  name: string;
  id?: string;
  value?: string | number;
  type: string;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  option?: RegisterOptions;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<IProps> = ({
  name,
  id,
  value,
  type,
  register,
  option,
  placeholder,
  error,
  className,
  onChange,
}: IProps) => {
  return (
    <input
      id={id}
      value={value || ''}
      placeholder={placeholder}
      type={type}
      className={cn(styles.input, error && styles.input_error, className)}
      {...(register && register(name, option))}
      onChange={onChange}
    />
  );
};

export { Input };
