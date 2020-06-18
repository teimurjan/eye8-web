import times from 'lodash/times';
import * as React from 'react';
import { IntlShape, injectIntl } from 'react-intl';

import { Pagination } from 'src/components/admin-ui/Pagination/Pagination';
import { PaginationLink } from 'src/components/admin-ui/PaginationLink/PaginationLink';
import { PaginationList } from 'src/components/admin-ui/PaginationList/PaginationList';
import { PaginationNext } from 'src/components/admin-ui/PaginationNext/PaginationNext';
import { PaginationPrev } from 'src/components/admin-ui/PaginationPrev/PaginationPrev';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  length: number;
  initialPage?: number;
  onPageChange?: (index: number) => any;
  intl: IntlShape;
}

interface IState {
  currentIndex: number;
}

export const UncontrolledPagination = injectIntl(
  class extends React.Component<IProps, IState> {
    public state = {
      currentIndex: 0,
    };

    public componentDidMount() {
      const { initialPage } = this.props;
      if (typeof initialPage === 'number') {
        this.setState({ currentIndex: initialPage - 1 });
      }
    }

    public render() {
      const { length, intl, initialPage: _initialPage, onPageChange: _onPageChange, ...props } = this.props;
      const { currentIndex } = this.state;
      return (
        <Pagination {...props}>
          <PaginationList>
            {times(length).map(i => {
              const onClick = () => this.changeCurrent(i);
              return (
                <PaginationLink key={i} isCurrent={currentIndex === i} onClick={onClick}>
                  {i + 1}
                </PaginationLink>
              );
            })}
          </PaginationList>
          <PaginationNext onClick={this.onNextClick}>{intl.formatMessage({ id: 'Pagination.next' })}</PaginationNext>
          <PaginationPrev onClick={this.onPrevClick}>{intl.formatMessage({ id: 'Pagination.prev' })}</PaginationPrev>
        </Pagination>
      );
    }

    private changeCurrent = (index: number) => {
      const { onPageChange } = this.props;
      const { currentIndex } = this.state;
      if (typeof onPageChange === 'function' && currentIndex !== index) {
        onPageChange(index + 1);
      }
      this.setState({ currentIndex: index });
    };

    private onNextClick = () => {
      const { currentIndex } = this.state;
      const { length } = this.props;
      if (currentIndex < length - 1) {
        this.changeCurrent(currentIndex + 1);
      }
    };

    private onPrevClick = () => {
      const { currentIndex } = this.state;
      if (currentIndex > 0) {
        this.changeCurrent(currentIndex - 1);
      }
    };
  },
);
