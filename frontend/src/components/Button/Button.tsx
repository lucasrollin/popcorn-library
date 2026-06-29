import type { ComponentProps } from 'react';
import styles from './Button.module.scss';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'danger';
};

const Button = ({ variant = 'primary', children, ...rest }: ButtonProps) => {
  return (
    <button {...rest} className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
};

export default Button;
