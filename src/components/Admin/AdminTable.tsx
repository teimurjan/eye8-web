/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import * as React from 'react';
import { IntlShape } from 'react-intl';

import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';
import { Table } from 'src/components/admin-ui/Table/Table';
import { UncontrolledPagination } from 'src/components/admin-ui/UncontrolledPagination/UncontrolledPagination';
import { LoaderLayout } from 'src/components/client-ui/LoaderLayout/LoaderLayout';
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
}: IProps<T> & { intl: IntlShape }) => {
  if (isLoading) {
    return <LoaderLayout />;
  }

  if (entities.length === 0 && isDataLoaded) {
    return renderNoData();
  }

  return (
    <React.Fragment>
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
          {entities.map(entity => (
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

      {[pagesCount, currentPage].every(i => typeof i !== 'undefined') && (
        <UncontrolledPagination
          css={css`
            margin-bottom: 0.25rem;
          `}
          length={pagesCount as number}
          initialPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
    </React.Fragment>
  );
};

AdminTable.Col = AdminTableCol;
