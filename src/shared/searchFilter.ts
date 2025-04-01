import { ObjectId } from "mongodb";

export const searchFilter = (search: string | null) => {
  if (!search) {
    return undefined;
  }

  const searchConditions: any[] = [];

  if (ObjectId.isValid(search)) {
    searchConditions.push({
      categoryId: new ObjectId(search),
    });
  } else {
    searchConditions.push({
      categoryId: { contains: search, mode: "insensitive" },
    });
  }

  return {
    OR: searchConditions,
  };
};
