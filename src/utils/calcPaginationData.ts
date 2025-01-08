export interface IcalcPaginationDataParams {
  count: number;
  perPage: number;
  page: number;
}

export interface IPaginationData {
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const calcPaginationData = ({
  count,
  perPage,
  page,
}: IcalcPaginationDataParams): IPaginationData => {
  const totalPages = Math.ceil(count / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};
