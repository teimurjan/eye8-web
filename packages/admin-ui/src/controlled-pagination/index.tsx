import times from 'lodash/times';
import React from 'react';
import { useIntl } from 'react-intl';

import { Pagination, PaginationLink, PaginationList, PaginationNext, PaginationPrev } from '@eye8/admin-ui/index';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  length: number;
  page: number;
  onPageChange?: (index: number) => any;
}

export default ({ length, page, onPageChange, ...props }: IProps) => {
  const intl = useIntl();

  const currentIndex = page - 1;

  const changeCurrent = (index: number) => {
    if (typeof onPageChange === 'function' && index !== currentIndex) {
      onPageChange(index + 1);
    }
  };

  const onNextClick = () => {
    if (currentIndex < length - 1) {
      changeCurrent(currentIndex + 1);
    }
  };

  const onPrevClick = () => {
    if (currentIndex > 0) {
      changeCurrent(currentIndex - 1);
    }
  };

  return (
    <Pagination {...props}>
      <PaginationList>
        {times(length).map((i) => {
          const onClick = () => changeCurrent(i);
          return (
            <PaginationLink key={i} isCurrent={currentIndex === i} onClick={onClick}>
              {i + 1}
            </PaginationLink>
          );
        })}
      </PaginationList>
      <PaginationNext onClick={onNextClick}>{intl.formatMessage({ id: 'Pagination.next' })}</PaginationNext>
      <PaginationPrev onClick={onPrevClick}>{intl.formatMessage({ id: 'Pagination.prev' })}</PaginationPrev>
    </Pagination>
  );
};
