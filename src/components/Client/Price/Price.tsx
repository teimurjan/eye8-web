import uniq from 'lodash/uniq';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { useIntlState } from 'src/state/IntlState';
import { useRatesState } from 'src/state/RatesState';
import { USE_CEILED_PRICE } from 'src/utils/featureFlags';
import { calculateDiscountedPrice, getCeiledPrice } from 'src/utils/number';

interface IPriceProps {
  price: number;
  discount?: number | number[];
  date?: Date;
  forceLocale?: string;
}

interface IPriceRangeTextProps {
  range: IPriceProps[];
}

const useRateOnDate = ({ date, name }: { date?: Date; name: string }) => {
  const {
    ratesState: { rates, error },
  } = useRatesState();

  if (!rates[name]) {
    return {};
  }

  const matchingRate = date ? rates[name].find((rate) => new Date(rate.created_on).getTime() <= date.getTime()) : date;
  const rate = matchingRate ?? rates[name][rates[name].length - 1];

  return { rate, error };
};

export const KGS_TO_USD_RATE_NAME = 'kgs_to_usd';

const useFormattedPrice = ({ price, discount, date, forceLocale }: IPriceProps) => {
  const {
    intlState: { locale },
  } = useIntlState();

  const { rate, error } = useRateOnDate({ date, name: KGS_TO_USD_RATE_NAME });

  const calculatedPrice = calculateDiscountedPrice(price, discount || 0);
  const defaultFormattedPrice = React.useMemo(() => `$${calculatedPrice}`, [calculatedPrice]);
  const isEn = [locale, forceLocale].some((l) => l === 'en');
  const formattedPrice = React.useMemo(() => {
    if (!rate) {
      return error ? defaultFormattedPrice : null;
    }
    const kgsPrice = Math.round(calculatedPrice * rate.value);
    return (
      <>
        {USE_CEILED_PRICE ? getCeiledPrice(kgsPrice) : kgsPrice} {isEn ? 'KGS' : <u>с</u>}
      </>
    );
  }, [calculatedPrice, rate, isEn, defaultFormattedPrice, error]);

  return formattedPrice;
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

export const PriceCrossedText = ({ price, discount, date, forceLocale }: IPriceProps) => {
  const formattedPrice = useFormattedPrice({ price, discount, date, forceLocale });
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

export const PriceText = ({ price, date, forceLocale }: IPriceProps) => (
  <>{useFormattedPrice({ price, discount: 0, date, forceLocale })}</>
);
