import type { ComponentProps } from 'react';
import styles from './Button.module.scss';

type ButtonProps = ComponentProps<'button'>;

export default function Button({ children, ...rest }: ButtonProps) {
  return (
    <button {...rest} className={styles.button}>
      {children}
    </button>
  );
}
