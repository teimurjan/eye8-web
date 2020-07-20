/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import * as React from 'react';
import { IntlShape } from 'react-intl';

import { ControlledPagination } from 'src/components/admin-ui/ControlledPagination/ControlledPagination';
import { FormTextField } from 'src/components/admin-ui/FormTextField/FormTextField';
import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';
import { Table } from 'src/components/admin-ui/Table/Table';
import { Title } from 'src/components/admin-ui/Title/Title';
import { LoaderLayout } from 'src/components/client-ui/LoaderLayout/LoaderLayout';
import { useBoolean } from 'src/hooks/useBoolean';
import { useDebounce } from 'src/hooks/useDebounce';
import { mediaQueries } from 'src/styles/media';
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
  private locales: string[];

  constructor(locales: string[]) {
    this.locales = locales;
  }

  public renderHeader = (title: string, { componentKey }: IAdminTableRendererRequiredArgs) => (
    <Table.HeadCell key={componentKey} colSpan={this.locales.length}>
      {title}
    </Table.HeadCell>
  );

  public renderSubheader = ({ componentKey }: IAdminTableRendererRequiredArgs) =>
    this.locales.map(locale => <Table.HeadCell key={`${componentKey}-${locale}`}>{locale}</Table.HeadCell>);

  public renderEntity = (entity: T, { colKey, componentKey }: IAdminTableRendererRequiredArgs) => (
    <React.Fragment key={componentKey}>
      {this.locales.map(locale => (
        <Table.Cell key={locale}>{entity[colKey][locale]}</Table.Cell>
      ))}
    </React.Fragment>
  );
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
  search?: (query: string) => Promise<T[]>;
}

const defaultRenderer = new DefaultRenderer();

export const AdminTable = <T extends { id: number }>({
  renderNoData,
  isLoading,
  isDataLoaded,
  entities,
  children,
  intl,
  pathPrefix,
  pagesCount,
  currentPage,
  onPageChange,
  hideSubheader = false,
  hideDelete = false,
  hideEdit = false,
  search,
}: IProps<T> & { intl: IntlShape }) => {
  const { value: isSearching, setPositive: setSearching, setNegative: setIdle } = useBoolean();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [searchValue, setSearchValue] = React.useState('');
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    e => setSearchValue(e.currentTarget.value),
    [],
  );
  const [searchResults, setSearchResults] = React.useState<T[]>([]);

  React.useEffect(() => {
    (async () => {
      if (search && debouncedSearchValue.length > 0) {
        try {
          setSearching();
          setSearchResults(await search(debouncedSearchValue));
        } catch (e) {
          setError('errors.common');
        } finally {
          setIdle();
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);

  const renderContent = () => {
    if (isLoading || isSearching) {
      return <LoaderLayout />;
    }

    const isEmpty = entities.length === 0 && isDataLoaded;
    const isSearchResultsEmpty = debouncedSearchValue.length > 0 && !isSearching && searchResults.length === 0;
    if (isEmpty || isSearchResultsEmpty) {
      return renderNoData();
    }

    if (error) {
      return <Title size={4}>{intl.formatMessage({ id: error })}</Title>;
    }

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
            {(debouncedSearchValue.length > 0 ? searchResults : entities).map(entity => (
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
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </ReactRouterLinkButton>
                  )}
                  {!hideDelete && (
                    <ReactRouterLinkButton to={`${pathPrefix}/delete/${entity.id}`} color="is-danger">
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </ReactRouterLinkButton>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {[pagesCount, currentPage].every(i => typeof i !== 'undefined') && debouncedSearchValue.length === 0 && (
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
      {search && (
        <FormTextField
          labelProps={{ children: intl.formatMessage({ id: 'common.search' }) }}
          inputProps={{ onChange: onSearchChange, value: searchValue }}
        />
      )}

      {renderContent()}
    </>
  );
};

AdminTable.Col = AdminTableCol;
