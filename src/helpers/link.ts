export const getPageHref = (asPath: string) => {
  if (asPath.match(/^\/products\/[\d-a-z]+/)) {
    return '/products/[slug]';
  }
  if (asPath.match(/^\/categories\/[\d-a-z]+\/products/)) {
    return '/categories/[id]/products';
  }

  return asPath;
};
