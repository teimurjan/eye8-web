/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React from 'react';
import { useIntl } from 'react-intl';

import { ProductTypeSortingType } from '@eye8/api/product-type';
import { Filter, ScrollableContainer } from '@eye8/client-ui';
import { ViewProps as Props } from '@eye8/client/components/product-types-page-filter/presenter';
import { mediaQueries } from '@eye8/shared/styles';

export const ProductTypesPageFilterView = ({
  onSortingTypeChange,
  onCharacteristicValuesChange,
  sortingType,
  characteristicValuesIds,
  groupedCharacteristics,
  disabled,
}: Props) => {
  const intl = useIntl();

  const sortingFilterGroup = (
    <Filter.ItemGroup key="sortBy" title={intl.formatMessage({ id: 'common.sortBy' })}>
      <Filter.Item
        active={sortingType === ProductTypeSortingType.RECENT}
        onClick={() => onSortingTypeChange(ProductTypeSortingType.RECENT)}
      >
        {intl.formatMessage({ id: 'filter.newlyAdded' })}
      </Filter.Item>
      <Filter.Item
        active={sortingType === ProductTypeSortingType.PRICE_ASCENDING}
        onClick={() => onSortingTypeChange(ProductTypeSortingType.PRICE_ASCENDING)}
      >
        {intl.formatMessage({ id: 'filter.priceAscending' })}
      </Filter.Item>
      <Filter.Item
        active={sortingType === ProductTypeSortingType.PRICE_DESCENDING}
        onClick={() => onSortingTypeChange(ProductTypeSortingType.PRICE_DESCENDING)}
      >
        {intl.formatMessage({ id: 'filter.priceDescending' })}
      </Filter.Item>
    </Filter.ItemGroup>
  );

  const characteristicsFilterGroups = Object.keys(groupedCharacteristics).map((characteristicId) => {
    const { values, name } = groupedCharacteristics[characteristicId];

    return values.length > 0 ? (
      <Filter.ItemGroup key={characteristicId} title={name}>
        <ScrollableContainer maxHeight={350} mobileMaxHeight={250}>
          {values.map((value) => {
            const isActive = characteristicValuesIds.indexOf(value.id) !== -1;
            return (
              <Filter.Item
                key={value.id}
                active={isActive}
                squared
                onClick={() => {
                  onCharacteristicValuesChange(
                    isActive
                      ? characteristicValuesIds.filter((id) => id !== value.id)
                      : [...characteristicValuesIds, value.id],
                  );
                }}
              >
                {value.name}
              </Filter.Item>
            );
          })}
        </ScrollableContainer>
      </Filter.ItemGroup>
    ) : null;
  });

  const allFilterGroups = [sortingFilterGroup, ...characteristicsFilterGroups];

  const onReset = React.useCallback(
    () => (characteristicValuesIds.length > 0 ? () => onCharacteristicValuesChange([]) : undefined),
    [characteristicValuesIds, onCharacteristicValuesChange],
  );

  return (
    <>
      <Filter
        onReset={onReset}
        disabled={disabled}
        css={css`
          padding: 20px 30px 0 0;

          @media ${mediaQueries.maxWidth768} {
            padding: 0;
          }
        `}
      >
        {allFilterGroups}
      </Filter>
    </>
  );
};
