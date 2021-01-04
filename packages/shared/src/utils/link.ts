export const guessPageHref = (as: string) => {
  if (as.match(/^\/products\/[\d-a-z]+/)) {
    return '/products/[slug]';
  }
  if (as.match(/^\/categories\/[\da-z-]+\/products/)) {
    return '/categories/[slug]/products';
  }

  return as;
};
