
import { css } from '@emotion/react';
import { useTheme } from '@emotion/react';
import classNames from 'classnames';
import React from 'react';
import { Trash as TrashIcon, Edit2 as Edit2Icon } from 'react-feather';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

import { ControlledPagination, LinkButton, FormTextField, Table } from '@eye8/admin-ui';
import { PriceText } from '@eye8/client/components';
import { LoaderLayout, IconWrapper, Tooltip } from '@eye8/shared/components';
import { useDebounce } from '@eye8/shared/hooks';
import { IconSize, mediaQueries } from '@eye8/shared/styles';
import { availableLocales, formatMediaURL } from '@eye8/shared/utils';

interface AdminTableRendererRequiredArgs {
  componentKey: string;
  colKey: string;
}

interface AdminTableColProps<T> {
  title: string;
  key_: keyof T;
  renderer?: Renderer<T>;
  render?: (entity: T) => React.ReactNode;
}

const AdminTableCol = <T extends any>(_: AdminTableColProps<T>) => null;

export interface Renderer<T> {
  renderHeader: (title: string, { componentKey }: AdminTableRendererRequiredArgs) => React.ReactNode;

  renderSubheader: ({ componentKey }: AdminTableRendererRequiredArgs) => React.ReactNode;

  renderEntity: (entity: T, { colKey, componentKey }: AdminTableRendererRequiredArgs) => React.ReactNode;
}

class DefaultRenderer<T> implements Renderer<T> {
  public renderHeader = (title: string, { componentKey }: AdminTableRendererRequiredArgs) => (
    <Table.HeadCell key={componentKey}>{title}</Table.HeadCell>
  );

  public renderSubheader = ({ componentKey }: AdminTableRendererRequiredArgs) => <Table.HeadCell key={componentKey} />;

  public renderEntity = (entity: T, { colKey, componentKey }: AdminTableRendererRequiredArgs) => (
    <Table.Cell key={componentKey}>{entity[colKey]}</Table.Cell>
  );
}

export class IntlRenderer<T> implements Renderer<T> {
  public renderHeader = (title: string, { componentKey }: AdminTableRendererRequiredArgs) => (
    <Table.HeadCell key={componentKey} colSpan={availableLocales.length}>
      {title}
    </Table.HeadCell>
  );

  public renderSubheader = ({ componentKey }: AdminTableRendererRequiredArgs) =>
    availableLocales.map((locale) => <Table.HeadCell key={`${componentKey}-${locale}`}>{locale}</Table.HeadCell>);

  public renderEntity = (entity: T, { colKey, componentKey }: AdminTableRendererRequiredArgs) => (
    <React.Fragment key={componentKey}>
      {availableLocales.map((locale) => (
        <Table.Cell key={locale}>{entity[colKey][locale]}</Table.Cell>
      ))}
    </React.Fragment>
  );
}

export class BooleanRenderer<T> extends DefaultRenderer<T> {
  public renderEntity = (entity: T, { colKey, componentKey }: AdminTableRendererRequiredArgs) => (
    <Table.Cell
      css={css`
        text-align: center !important;
      `}
    >
      {entity[colKey] === true ? '✅' : '❌'}
    </Table.Cell>
  );
}

interface PriceTooltipTriggerProps {
  onMouseEnter: React.MouseEventHandler;
  price: number;
}

const PriceTooltipTrigger = React.forwardRef<HTMLTableCellElement, PriceTooltipTriggerProps>(
  ({ onMouseEnter, price }, ref) => {
    const theme = useTheme() as AdminUITheme;
    return (
      <Table.Cell
        css={css`
          font-weight: bold;
          color: ${theme.success};
        `}
        ref={ref}
        onMouseEnter={onMouseEnter}
      >
        <PriceText price={price} />
      </Table.Cell>
    );
  },
);

export class PriceRenderer<T> extends DefaultRenderer<T> {
  public renderEntity = (entity: T, { colKey, componentKey }: AdminTableRendererRequiredArgs) => (
    <Tooltip<HTMLTableCellElement>
      key={componentKey}
      placement="left"
      renderTrigger={({ open, ref }) => <PriceTooltipTrigger ref={ref} onMouseEnter={open} price={entity[colKey]} />}
    >
      {availableLocales.map((locale) => (
        <div key={locale}>
          <PriceText price={entity[colKey]} locale={locale} alwaysConvertToPrimary={false} />
        </div>
      ))}
    </Tooltip>
  );
}

export class LinkRenderer<T> extends DefaultRenderer<T> {
  private getLink: (entity: T) => { to: string; text: string };

  constructor(getLink: (entity: T) => { to: string; text: string }) {
    super();
    this.getLink = getLink;
  }

  public renderEntity = (entity: T, { colKey }: AdminTableRendererRequiredArgs) => {
    const { to, text } = this.getLink(entity);
    return (
      <Table.Cell
        css={css`
          text-align: center !important;
        `}
      >
        <Link to={to} role="img">
          {text} 🔗
        </Link>
      </Table.Cell>
    );
  };
}

export class ImageRenderer<T> extends DefaultRenderer<T> {
  private getAlt: (entity: T) => string;

  constructor(getAlt: (entity: T) => string) {
    super();
    this.getAlt = getAlt;
  }

  public renderEntity = (entity: T, { colKey }: AdminTableRendererRequiredArgs) => (
    <Table.Cell>
      <img
        alt={this.getAlt(entity)}
        css={css`
          max-width: 100px;
          margin: 0 auto;
          display: block !important;
        `}
        src={formatMediaURL(entity[colKey])}
      />
    </Table.Cell>
  );
}

interface Props<T> {
  isLoading: boolean;
  isDataLoaded: boolean;
  pathPrefix: string;
  renderNoData: () => React.ReactElement;
  entities: T[];
  children: Array<React.ReactElement<AdminTableColProps<T>>>;
  pagesCount?: number;
  currentPage?: number;
  onPageChange?: (newPage: number) => void;
  hideSubheader?: boolean;
  hideDelete?: boolean;
  hideEdit?: boolean;
  onSearchChange?: (query: string) => void;
}

const defaultRenderer = new DefaultRenderer();

const AdminTable = <T extends { id: number }>({
  renderNoData,
  isLoading,
  isDataLoaded,
  entities,
  children,
  pathPrefix,
  pagesCount,
  currentPage,
  onPageChange,
  hideSubheader = false,
  hideDelete = false,
  hideEdit = false,
  onSearchChange,
}: Props<T>) => {
  const location = useLocation();

  const intl = useIntl();
  const [searchValue, setSearchValue] = React.useState('');
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const onSearchChange_: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    (e) => setSearchValue(e.currentTarget.value),
    [],
  );

  React.useEffect(() => {
    onSearchChange && onSearchChange(debouncedSearchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);

  const renderContent = () => {
    if (isLoading) {
      return <LoaderLayout />;
    }

    const isEmpty = entities.length === 0 && isDataLoaded;
    if (isEmpty) {
      return renderNoData();
    }

    const getDeletePath = (id: number) => `${pathPrefix}/delete/${id}${location.search}`;

    return (
      <>
        <Table className={classNames('is-bordered', 'is-striped', 'is-narrow', 'is-hoverable', 'is-fullwidth')}>
          <Table.Head>
            <Table.Row>
              {React.Children.map(children, ({ props: { title, key_, renderer } }) =>
                (renderer || defaultRenderer).renderHeader(title, {
                  colKey: key_ as string,
                  componentKey: `head-cell-${key_}`,
                }),
              )}
              <Table.HeadCell key="head-cell-actions">{intl.formatMessage({ id: 'common.actions' })}</Table.HeadCell>
            </Table.Row>
            {!hideSubheader && (
              <Table.Row>
                {React.Children.map(children, ({ props: { key_, renderer } }) =>
                  (renderer || defaultRenderer).renderSubheader({
                    colKey: key_ as string,
                    componentKey: `sub-head-cell-${key_}`,
                  }),
                )}
                <Table.HeadCell key="sub-head-cell-actions" />
              </Table.Row>
            )}
          </Table.Head>
          <Table.Body>
            {entities.map((entity) => (
              <Table.Row key={entity.id}>
                {React.Children.map(children, ({ props: { key_, renderer, render } }) =>
                  render ? (
                    <Table.Cell key={key_ as string}>{render(entity)}</Table.Cell>
                  ) : (
                    (renderer || defaultRenderer).renderEntity(entity, {
                      colKey: key_ as string,
                      componentKey: `table-cell-${key_}-${entity.id}`,
                    })
                  ),
                )}

                <Table.Cell
                  key={`table-cell-${entity.id}`}
                  css={css`
                    text-align: center;
                    width: 15%;
                  `}
                >
                  {!hideEdit && (
                    <LinkButton
                      to={`${pathPrefix}/edit/${entity.id}${location.search}`}
                      css={css`
                        margin-right: 0.5rem;

                        @media ${mediaQueries.maxWidth768} {
                          margin-right: 0;
                          margin-bottom: 0.25rem;
                        }
                      `}
                      color="is-primary"
                    >
                      <IconWrapper>
                        <Edit2Icon size={IconSize.Medium} />
                      </IconWrapper>
                    </LinkButton>
                  )}
                  {!hideDelete && (
                    <LinkButton to={getDeletePath(entity.id)} color="is-danger">
                      <IconWrapper>
                        <TrashIcon size={IconSize.Medium} />
                      </IconWrapper>
                    </LinkButton>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {[pagesCount, currentPage].every((i) => typeof i !== 'undefined') && debouncedSearchValue.length === 0 && (
          <ControlledPagination
            css={css`
              margin-bottom: 0.25rem;
            `}
            length={pagesCount!}
            page={currentPage!}
            onPageChange={onPageChange}
          />
        )}
      </>
    );
  };

  return (
    <>
      {onSearchChange && (
        <FormTextField
          labelProps={{ children: intl.formatMessage({ id: 'common.search' }) }}
          inputProps={{ onChange: onSearchChange_, value: searchValue }}
        />
      )}

      {renderContent()}
    </>
  );
};

AdminTable.Col = AdminTableCol;

export default AdminTable;
