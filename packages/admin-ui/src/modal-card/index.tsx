import classNames from 'classnames';
import React from 'react';

export type Props = React.HTMLAttributes<HTMLDivElement>;

const ModalCard = ({ children, className, ...props }: Props) => (
  <div className={classNames('modal-card', className)} {...props}>
    {children}
  </div>
);

type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement>;

ModalCard.Head = ({ children, className, ...props }: ModalHeaderProps) => (
  <header className={classNames('modal-card-head', className)} {...props}>
    {children}
  </header>
);

type TitleProps = React.HTMLAttributes<HTMLParagraphElement>;

ModalCard.Title = ({ children, className, ...props }: TitleProps) => (
  <p className={classNames('modal-card-title', className)} {...props}>
    {children}
  </p>
);

type CloseProps = React.HTMLAttributes<HTMLButtonElement>;

ModalCard.Close = ({ className, ...props }: CloseProps) => (
  <button className={classNames('delete', className)} aria-label="close" {...props} />
);

type BodyProps = React.HTMLAttributes<HTMLDivElement>;

ModalCard.Body = ({ children, className, ...props }: BodyProps) => (
  <section className={classNames('modal-card-body', className)} {...props}>
    {children}
  </section>
);

type FootProps = React.HTMLAttributes<HTMLDivElement>;

ModalCard.Foot = ({ children, className, ...props }: FootProps) => (
  <footer className={classNames('modal-card-foot', className)} {...props}>
    {children}
  </footer>
);

export default ModalCard;
