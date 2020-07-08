import times from 'lodash/times';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Pagination } from 'src/components/admin-ui/Pagination/Pagination';
import { PaginationLink } from 'src/components/admin-ui/PaginationLink/PaginationLink';
import { PaginationList } from 'src/components/admin-ui/PaginationList/PaginationList';
import { PaginationNext } from 'src/components/admin-ui/PaginationNext/PaginationNext';
import { PaginationPrev } from 'src/components/admin-ui/PaginationPrev/PaginationPrev';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  length: number;
  page: number;
  onPageChange?: (index: number) => any;
}

export const ControlledPagination = ({ length, page, onPageChange, ...props }: IProps) => {
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
        {times(length).map(i => {
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
