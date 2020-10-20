/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import * as React from 'react';
import { Trash as TrashIcon, Edit2 as Edit2Icon } from 'react-feather';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { ControlledPagination } from 'src/components/admin-ui/ControlledPagination/ControlledPagination';
import { FormTextField } from 'src/components/admin-ui/FormTextField/FormTextField';
import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';
import { Table } from 'src/components/admin-ui/Table/Table';
import { IconWrapper } from 'src/components/client-ui/IconWrapper/IconWrapper';
import { LoaderLayout } from 'src/components/client-ui/LoaderLayout/LoaderLayout';
import { Tooltip } from 'src/components/client-ui/Tooltip/Tooltip';
import { PriceText } from 'src/components/client/Price/Price';
import { useDebounce } from 'src/hooks/useDebounce';
import { IconSizes } from 'src/styles/icon';
import { mediaQueries } from 'src/styles/media';
import { availableLocales } from 'src/utils/locale';
import { buildSearchString } from 'src/utils/queryString';
import { formatMediaURL } from 'src/utils/url';

interface IAdminTableRendererRequiredArgs {
  componentKey: string;
  colKey: string;
}

interface IAdminTableColProps<T> {
  title: string;
  key_: keyof T;
  renderer?: IRenderer<T>;
  render?: (entity: T) => React.ReactNode;
}

const AdminTableCol = <T extends any>(_: IAdminTableColProps<T>) => null;

export interface IRenderer<T> {
  renderHeader: (title: string, { componentKey }: IAdminTableRendererRequiredArgs) => React.ReactNode;

  renderSubheader: ({ componentKey }: IAdminTableRendererRequiredArgs) => React.ReactNode;

  renderEntity: (entity: T, { colKey, componentKey }: IAdminTableRendererRequiredArgs) => React.ReactNode;
}

class DefaultRenderer<T> implements IRenderer<T> {
  public renderHeader = (title: string, { componentKey }: IAdminTableRendererRequiredArgs) => (
    <Table.HeadCell key={componentKey}>{title}</Table.HeadCell>
  );

  public renderSubheader = ({ componentKey }: IAdminTableRendererRequiredArgs) => <Table.HeadCell key={componentKey} />;

  public renderEntity = (entity: T, { colKey, componentKey }: IAdminTableRendererRequiredArgs) => (
    <Table.Cell key={componentKey}>{entity[colKey]}</Table.Cell>
  );
}

export class IntlRenderer<T> implements IRenderer<T> {
  public renderHeader = (title: string, { componentKey }: IAdminTableRendererRequiredArgs) => (
    <Table.HeadCell key={componentKey} colSpan={availableLocales.length}>
      {title}
    </Table.HeadCell>
  );

  public renderSubheader = ({ componentKey }: IAdminTableRendererRequiredArgs) =>
    availableLocales.map((locale) => <Table.HeadCell key={`${componentKey}-${locale}`}>{locale}</Table.HeadCell>);

  public renderEntity = (entity: T, { colKey, componentKey }: IAdminTableRendererRequiredArgs) => (
    <React.Fragment key={componentKey}>
      {availableLocales.map((locale) => (
        <Table.Cell key={locale}>{entity[colKey][locale]}</Table.Cell>
      ))}
    </React.Fragment>
  );
}

export class BooleanRenderer<T> extends DefaultRenderer<T> {
  public renderEntity = (entity: T, { colKey, componentKey }: IAdminTableRendererRequiredArgs) => (
    <Table.Cell
      css={css`
        text-align: center !important;
      `}
    >
      {entity[colKey] === true ? '✅' : '❌'}
    </Table.Cell>
  );
}

export class PriceRenderer<T> extends DefaultRenderer<T> {
  public renderEntity = (entity: T, { colKey, componentKey }: IAdminTableRendererRequiredArgs) => (
    <Tooltip<HTMLTableCellElement>
      placement="left"
      renderTrigger={({ open, ref }) => (
        <Table.Cell ref={ref} onMouseEnter={open} key={componentKey}>
          <PriceText price={entity[colKey]} />
        </Table.Cell>
      )}
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

  public renderEntity = (entity: T, { colKey }: IAdminTableRendererRequiredArgs) => {
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

  public renderEntity = (entity: T, { colKey }: IAdminTableRendererRequiredArgs) => (
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

interface IProps<T> {
  isLoading: boolean;
  isDataLoaded: boolean;
  pathPrefix: string;
  renderNoData: () => React.ReactElement;
  entities: T[];
  children: Array<React.ReactElement<IAdminTableColProps<T>>>;
  pagesCount?: number;
  currentPage?: number;
  onPageChange?: (newPage: number) => void;
  hideSubheader?: boolean;
  hideDelete?: boolean;
  hideEdit?: boolean;
  onSearchChange?: (query: string) => void;
  isDeletedMode?: boolean;
}

const defaultRenderer = new DefaultRenderer();

export const AdminTable = <T extends { id: number }>({
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
  isDeletedMode,
}: IProps<T>) => {
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

    const getDeletePath = (id: number) => {
      return `${pathPrefix}/delete/${id}${buildSearchString({
        // Currently, search works only for non-deleted entities
        forever: debouncedSearchValue.length === 0 ? Boolean(isDeletedMode).toString() : false,
      })}`;
    };

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
                    <ReactRouterLinkButton
                      to={`${pathPrefix}/edit/${entity.id}`}
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
                        <Edit2Icon size={IconSizes.Medium} />
                      </IconWrapper>
                    </ReactRouterLinkButton>
                  )}
                  {!hideDelete && (
                    <ReactRouterLinkButton to={getDeletePath(entity.id)} color="is-danger">
                      <IconWrapper>
                        <TrashIcon size={IconSizes.Medium} />
                      </IconWrapper>
                    </ReactRouterLinkButton>
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
