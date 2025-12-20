export const getProviderTypes = async (locale: string) => {
  const response = await fetch(`/api/provider-types?locale=${locale}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch provider types");
  }
  const data = await response.json();
  const mappedData = data.data.map((item: any) => ({
    label: item.label,
    value: item.documentId,
  }));
  return mappedData;
};
