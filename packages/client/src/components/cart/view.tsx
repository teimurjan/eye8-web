/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import React from 'react';
import { ArrowLeft as ArrowLeftIcon, ShoppingBag as ShoppingBagIcon } from 'react-feather';
import { Form, Field as FinalFormField, FieldRenderProps, FormRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Anchor, Button, UnderlinedInput, HelpText, Message, Title, WithIcon } from '@eye8/client-ui';
import { IconWrapper, Drawer, LoaderLayout } from '@eye8/shared/components';
import { IconSize, bounce, fadeInFromRight, fadeInFromLeft, expand, easeOutCubic } from '@eye8/shared/styles';
import { getCartTotalPrice, parsePhoneNumber } from '@eye8/shared/utils';

import CartItem from '../cart-item';
import { PriceText } from '../price';

import { ViewProps as Props, FormValues } from './presenter';

const buttonCSS = css`
  display: block;
  margin: 10px auto;
  width: 100% !important;
`;

const CartTrigger = React.forwardRef<HTMLSpanElement>((props, ref) => {
  const intl = useIntl();
  return (
    <WithIcon ref={ref} icon={<ShoppingBagIcon size={IconSize.Medium} />} hideTextOnMobile {...props}>
      {intl.formatMessage({ id: 'common.cart' })}
    </WithIcon>
  );
});

const Total: React.FC<Pick<Props, 'getProductCount' | 'products' | 'promoCode'>> = ({
  products,
  getProductCount,
  promoCode,
}) => {
  const intl = useIntl();

  const totalPrice = getCartTotalPrice(products, getProductCount, promoCode);

  return (
    <Title
      css={css`
        margin-top: 20px;
      `}
      size={5}
    >
      {intl.formatMessage({ id: 'Cart.total' })}: <PriceText price={totalPrice >= 0 ? totalPrice : 0} />
    </Title>
  );
};

const PromoCodeField = ({ onPromoCodeApply }: Pick<Props, 'onPromoCodeApply'>) => {
  const intl = useIntl();
  const [value, setValue] = React.useState('');

  const onChange = React.useCallback((e) => {
    const newValue = e.currentTarget.value.toUpperCase();
    if (newValue.match(/^[A-z0-9]*$/)) {
      setValue(e.currentTarget.value.toUpperCase());
    }
  }, []);

  const onApplyClick = React.useCallback(() => {
    onPromoCodeApply(value);
  }, [onPromoCodeApply, value]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = React.useCallback(
    (event) => {
      if (event.keyCode === 13) {
        onApplyClick();
      }
    },
    [onApplyClick],
  );

  return (
    <UnderlinedInput
      placeholder={intl.formatMessage({ id: 'Cart.promoCodeInput.label' })}
      onChange={onChange}
      value={value}
      css={css`
        & > input {
          padding-right: 30px;
        }
      `}
      onKeyDown={onKeyDown}
      append={
        <Button
          onClick={onApplyClick}
          css={css`
            position: absolute;
            right: 0;
            bottom: 10px;
          `}
          size="mini"
        >
          {intl.formatMessage({ id: 'common.apply' })}
        </Button>
      }
    />
  );
};

const FirstStep: React.FC<Props> = ({
  isLoading,
  products,
  getProductCount,
  addMore,
  remove,
  goToNextStep,
  onPromoCodeApply,
  promoCode,
  error,
}) => {
  const intl = useIntl();

  if (isLoading) {
    return <LoaderLayout />;
  }

  if (products.length === 0) {
    return <Title size={5}>{intl.formatMessage({ id: 'Cart.empty' })}</Title>;
  }

  const isAnyProductCountNotAllowed = products.some((product) => product.quantity < getProductCount(product.id));

  return (
    <div>
      <div>
        {products.map((product) => (
          <CartItem
            key={product.id}
            product={product}
            count={getProductCount(product.id)}
            onAddClick={() => addMore(product)}
            onRemoveClick={() => remove(product)}
            promoCode={promoCode}
          />
        ))}
      </div>
      <PromoCodeField onPromoCodeApply={onPromoCodeApply} />
      <Total products={products} getProductCount={getProductCount} promoCode={promoCode} />
      <Button color="dark" css={buttonCSS} disabled={isAnyProductCountNotAllowed} onClick={goToNextStep}>
        {intl.formatMessage({ id: 'Cart.order' })}
      </Button>
      {error && <HelpText color={HelpText.Color.Danger}>{intl.formatMessage({ id: error })}</HelpText>}
    </div>
  );
};

const NameField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error && meta.submitFailed;
  return (
    <UnderlinedInput
      placeholder={intl.formatMessage({ id: 'Cart.nameInput.label' })}
      error={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      {...input}
    />
  );
};

const AddressField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error && meta.submitFailed;
  return (
    <UnderlinedInput
      placeholder={intl.formatMessage({ id: 'Cart.addressInput.label' })}
      error={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      {...input}
    />
  );
};

const PhoneField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error && meta.submitFailed;
  return (
    <UnderlinedInput
      mask="+\9\96 (999) 99-99-99"
      placeholder={intl.formatMessage({ id: 'common.phoneInput.label' })}
      error={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      {...input}
    />
  );
};

const InnerForm = ({
  handleSubmit,
  submitting,
  error,
  products,
  getProductCount,
  promoCode,
}: FormRenderProps<FormValues> & Pick<Props, 'error' | 'products' | 'getProductCount' | 'promoCode'>) => {
  const intl = useIntl();

  return (
    <form onSubmit={handleSubmit}>
      <FinalFormField name="name" component={NameField} />
      <FinalFormField name="phone" component={PhoneField} parse={parsePhoneNumber} />
      <FinalFormField name="address" component={AddressField} />
      <Total products={products} getProductCount={getProductCount} promoCode={promoCode} />
      <Button color="dark" type="submit" css={buttonCSS} loading={submitting}>
        {intl.formatMessage({ id: 'Cart.order' })}
      </Button>
      <div
        css={css`
          text-align: center;
        `}
      >
        {error && <HelpText color={HelpText.Color.Danger}>{intl.formatMessage({ id: error })}</HelpText>}
      </div>
    </form>
  );
};

const getInnerFormRenderer = (props: Pick<Props, 'error' | 'products' | 'getProductCount' | 'promoCode'>) => (
  props_: FormRenderProps<FormValues>,
) => <InnerForm {...{ ...props, ...props_ }} />;

const SecondStep: React.FC<Props> = ({
  validator,
  initialValues,
  onSubmit,
  error,
  products,
  getProductCount,
  promoCode,
}) => {
  return (
    <Form<FormValues>
      onSubmit={onSubmit}
      initialValues={initialValues as FormValues}
      validate={validator.validate}
      render={getInnerFormRenderer({ products, error, getProductCount, promoCode })}
    />
  );
};

const ThirdStep: React.FC<Props> = () => {
  const intl = useIntl();

  return (
    <Message
      color="primary"
      css={css`
        transform: scaleY(0);
        transform-origin: 50% 0;
        animation: ${expand} 300ms ${easeOutCubic};
        animation-delay: 300ms;
        animation-fill-mode: forwards;
      `}
    >
      {intl.formatMessage({ id: 'Cart.orderReceived' })}
    </Message>
  );
};

const CartView: React.FC<Props> = (props) => {
  const { isOpen, open, close, step, cartItemsCount, goToPrevStep } = props;
  const theme = useTheme<ClientUITheme>();
  return (
    <React.Fragment>
      <div
        css={css`
          position: relative;
        `}
      >
        {cartItemsCount > 0 && (
          <span
            key={cartItemsCount}
            css={css`
              animation: ${bounce} 1s ease;
              position: absolute;
              width: 16px;
              height: 16px;
              text-align: center;
              font-weight: bold;
              font-size: 10px;
              top: -7.5px;
              right: -12.5px;
              color: ${theme.textBrightColor};
              background: ${theme.primaryColor};
              border-radius: 50%;
            `}
          >
            {cartItemsCount}
          </span>
        )}
        <Anchor onClick={open} noHoverOnTouch weight={Anchor.Weight.Bold}>
          <CartTrigger />
        </Anchor>
      </div>
      <Drawer
        css={css`
          padding: 20px 30px;
          background: ${theme.backgroundSecondaryColor};
          width: 500px;
          max-width: 100%;
        `}
        fromSide="right"
        isOpen={isOpen}
        close={close}
        backdrop
        fixed
      >
        <div
          css={css`
            position: relative;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
          `}
        >
          <IconWrapper
            onClick={goToPrevStep}
            css={css`
              position: absolute;
              left: 0;
              top: 0;
              cursor: pointer;
              opacity: ${step > 0 ? 1 : 0};
              transition: opacity 200ms;
              color: ${theme.textColor};
            `}
          >
            <ArrowLeftIcon size={IconSize.Medium} />
          </IconWrapper>
          <TransitionGroup component={null}>
            <CSSTransition key={step} classNames="fading" timeout={400}>
              <div
                css={css`
                  position: absolute;
                  top: 40px;
                  left: 0;
                  width: 100%;
                  overflow: auto;

                  &.fading-enter {
                    transform: translateX(100%);
                  }

                  &.fading-exit {
                    transform: translateX(-100%);
                  }

                  &.fading-enter,
                  &.fading-entered {
                    animation: ${fadeInFromRight} 300ms ${easeOutCubic};
                    animation-fill-mode: forwards;
                    animation-delay: 100ms;
                  }

                  &.fading-exit,
                  &.fading-exited {
                    animation: ${fadeInFromLeft} 200ms ${easeOutCubic};
                    animation-direction: reverse;
                    animation-fill-mode: forwards;
                  }
                `}
              >
                {step === 0 && <FirstStep {...props} />}
                {step === 1 && <SecondStep {...props} />}
                {step === 2 && <ThirdStep {...props} />}
              </div>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default CartView;
