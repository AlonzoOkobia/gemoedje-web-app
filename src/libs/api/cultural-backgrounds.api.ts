export const getCulturalBackgrounds = async (locale: string) => {
  const response = await fetch(`/api/cultural-backgrounds?locale=${locale}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch cultural backgrounds");
  }
  const data = await response.json();
  const mappedData = data.data.map((item: any) => ({
    label: item.label,
    value: item.value,
  }));
  return mappedData;
};
