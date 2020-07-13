export const getPageHref = (as: string) => {
  if (as.match(/^\/products\/[\d-a-z]+/)) {
    return '/products/[slug]';
  }
  if (as.match(/^\/categories\/[\d-a-z]+\/products/)) {
    return '/categories/[id]/products';
  }

  return as;
};
