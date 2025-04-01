export const paymentSearchFilter = (search: string) => {
  if (!search) return {};

  return {
    OR: [
      // {
      //   orderId: {
      //     contains: search,
      //     mode: "insensitive",
      //   },
      // },
      {
        productName: {
          contains: search,
          mode: "insensitive",
        },
      },
    ],
  };
};
