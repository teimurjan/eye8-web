import uniq from 'lodash/uniq';
import React from 'react';
import { useIntl } from 'react-intl';

import { useRatesState } from '@eye8/client/state/rates';
import { Locale, calculateDiscountedPrice } from '@eye8/shared/utils';

interface IPriceProps {
  price: number;
  discount?: number | number[];
  date?: Date;
  locale?: string;
  alwaysConvertToPrimary?: boolean;
}

interface IPriceRangeTextProps {
  range: IPriceProps[];
}

const useRateOnDate = ({ date, name }: { date?: Date; name?: string }) => {
  const {
    ratesState: { rates, error },
  } = useRatesState();

  if (!name || !rates[name]) {
    return {};
  }

  const matchingRate = date ? rates[name].find((rate) => new Date(rate.created_on).getTime() <= date.getTime()) : date;
  const rate = matchingRate ?? rates[name][rates[name].length - 1];

  return { rate, error };
};

export enum RateName {
  Primary = 'kgs_to_usd',
  Secondary = 'usd_to_usd',
}

const rateNameByLocale: { [key in Locale]: RateName | undefined } = {
  [Locale.Primary]: RateName.Primary,
  [Locale.Secondary]: undefined,
};

const useFormattedPrice = ({ price, discount, date, locale, alwaysConvertToPrimary = true }: IPriceProps) => {
  const intl = useIntl();
  const reliableLocale = locale ?? intl.locale;

  const rateName = alwaysConvertToPrimary ? RateName.Primary : rateNameByLocale[reliableLocale];
  const { rate, error } = useRateOnDate({
    date,
    name: rateName,
  });

  const calculatedPrice = calculateDiscountedPrice(price, discount || 0);
  const defaultFormattedPrice = React.useMemo(() => <>${calculatedPrice}</>, [calculatedPrice]);

  if (!rate || error) {
    return defaultFormattedPrice;
  }

  return (
    <>
      {Math.round(calculatedPrice * rate.value)} <u>с</u>
    </>
  );
};

const usePriceRange = ({ range }: IPriceRangeTextProps) => {
  const calculatedRange = range.map((price) => calculateDiscountedPrice(price.price, price.discount || 0));
  const uniqueRange = uniq(calculatedRange);
  const discounts = range
    .map((price) => {
      return Array.isArray(price.discount) ? Math.max(...price.discount) : price.discount || 0;
    })
    .filter((discount) => discount !== 0);
  const uniqueDiscounts = uniq(discounts);

  const biggestPrice = Math.max(...calculatedRange);
  const lowestPrice = Math.min(...calculatedRange);
  const biggestFormattedPrice = useFormattedPrice({ price: biggestPrice, discount: 0 });
  const lowestFormattedPrice = useFormattedPrice({ price: lowestPrice, discount: 0 });

  return {
    calculatedRange,
    discounts,
    biggestFormattedPrice,
    lowestFormattedPrice,
    biggestPrice,
    lowestPrice,
    uniqueRange,
    uniqueDiscounts,
  };
};

export const usePriceRangeText = ({ range }: IPriceRangeTextProps) => {
  const intl = useIntl();

  const { calculatedRange, biggestFormattedPrice, lowestFormattedPrice, uniqueRange, uniqueDiscounts } = usePriceRange({
    range,
  });

  const price = React.useMemo(() => {
    if (uniqueRange.length === 1) {
      return <PriceCrossedText price={range[0].price} discount={range[0].discount} />;
    }

    if (uniqueRange.length > 1) {
      return (
        <>
          {lowestFormattedPrice} - {biggestFormattedPrice}
        </>
      );
    }

    return null;
  }, [lowestFormattedPrice, biggestFormattedPrice, range, uniqueRange]);

  const discount = React.useMemo(() => {
    if (uniqueDiscounts.length === 1) {
      return intl.formatMessage({ id: 'Price.discount' }, { value: uniqueDiscounts[0] });
    }
    if (uniqueDiscounts.length > 1) {
      return intl.formatMessage({ id: 'Price.discountUpTo' }, { value: Math.max(...uniqueDiscounts) });
    }
  }, [intl, uniqueDiscounts]);

  if (calculatedRange.length === 0) {
    return { price: null };
  }

  return {
    price,
    discount,
  };
};

export const PriceCrossedText = ({ price, discount, date, locale }: IPriceProps) => {
  const formattedPrice = useFormattedPrice({ price, discount, date, locale });
  const formattedInitialPrice = useFormattedPrice({ price, discount: 0, date });

  const hasDiscount = Array.isArray(discount) ? discount.reduce((acc, d) => acc + d, 0) > 0 : discount && discount > 0;

  return hasDiscount ? (
    <React.Fragment>
      {formattedPrice} <del>{formattedInitialPrice}</del>
    </React.Fragment>
  ) : (
    <React.Fragment>{formattedInitialPrice}</React.Fragment>
  );
};

export const PriceText = ({ price, date, locale, alwaysConvertToPrimary }: IPriceProps) =>
  useFormattedPrice({ price, discount: 0, date, locale, alwaysConvertToPrimary });
