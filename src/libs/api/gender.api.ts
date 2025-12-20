export type TGenderOption = {
  id?: number;
  documentId?: string;
  label: string;
  value: string;
};
export const getGenders = async (locale: string): Promise<TGenderOption[]> => {
  const response = await fetch(`/api/genders?locale=${locale}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch genders");
  }
  const data = await response.json();
  const mappedData = data.data.map((item: TGenderOption) => ({
    label: item.label,
    value: item.documentId,
  }));
  return mappedData;
};
