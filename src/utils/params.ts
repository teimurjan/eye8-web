export const paramToIDOrSlug = (param: string) => {
  const id = parseInt(param as string, 10);
  return Number.isNaN(id) ? param : id;
};
