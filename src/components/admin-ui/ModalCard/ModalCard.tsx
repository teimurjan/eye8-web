import classNames from 'classnames';
import * as React from 'react';

export type IProps = React.HTMLAttributes<HTMLDivElement>;

export const ModalCard = ({ children, className, ...props }: IProps) => (
  <div className={classNames('modal-card', className)} {...props}>
    {children}
  </div>
);

type IModalHeaderProps = React.HTMLAttributes<HTMLDivElement>;

ModalCard.Head = ({ children, className, ...props }: IModalHeaderProps) => (
  <header className={classNames('modal-card-head', className)} {...props}>
    {children}
  </header>
);

type ITitleProps = React.HTMLAttributes<HTMLParagraphElement>;

ModalCard.Title = ({ children, className, ...props }: ITitleProps) => (
  <p className={classNames('modal-card-title', className)} {...props}>
    {children}
  </p>
);

type ICloseProps = React.HTMLAttributes<HTMLButtonElement>;

ModalCard.Close = ({ className, ...props }: ICloseProps) => (
  <button className={classNames('delete', className)} aria-label="close" {...props} />
);

type IBodyProps = React.HTMLAttributes<HTMLDivElement>;

ModalCard.Body = ({ children, className, ...props }: IBodyProps) => (
  <section className={classNames('modal-card-body', className)} {...props}>
    {children}
  </section>
);

type IFootProps = React.HTMLAttributes<HTMLDivElement>;

ModalCard.Foot = ({ children, className, ...props }: IFootProps) => (
  <footer className={classNames('modal-card-foot', className)} {...props}>
    {children}
  </footer>
);
