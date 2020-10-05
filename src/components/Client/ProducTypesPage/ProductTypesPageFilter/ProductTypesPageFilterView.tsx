/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { ProductTypeSortingType } from 'src/api/ProductTypeAPI';
import { Button } from 'src/components/client-ui/Button/Button';
import { Filter } from 'src/components/client-ui/Filter/Filter';
import { IViewProps as IProps } from 'src/components/Client/ProducTypesPage/ProductTypesPageFilter/ProductTypesPageFilterPresenter';
import { mediaQueries } from 'src/styles/media';

export const ProductTypesPageFilterView = ({
  onSortingTypeChange,
  onCharacteristicValuesChange,
  sortingType,
  characteristicValuesIds,
  groupedCharacteristics,
  disabled,
}: IProps) => {
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
      </Filter.ItemGroup>
    ) : null;
  });

  const allFilterGroups = [sortingFilterGroup, ...characteristicsFilterGroups];

  return (
    <div>
      <Filter
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

      {characteristicValuesIds.length > 0 && (
        <Button size="small" onClick={() => onCharacteristicValuesChange([])}>
          {intl.formatMessage({ id: 'common.reset' })}
        </Button>
      )}
    </div>
  );
};
