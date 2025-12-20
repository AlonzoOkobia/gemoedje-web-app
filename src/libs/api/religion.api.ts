export const getReligions = async (locale: string) => {
  const response = await fetch(`/api/religions?locale=${locale}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch religions");
  }
  const data = await response.json();
  const mappedData = data.data.map((item: any) => ({
    label: item.label,
    value: item.documentId,
  }));
  return mappedData;
};
