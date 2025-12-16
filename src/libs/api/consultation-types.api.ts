export const getConsultationTypes = async (locale: string) => {
  const response = await fetch(`/api/consultation-types?locale=${locale}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch consultation types");
  }
  const data = await response.json();
  const mappedData = data.data.map((item: any) => ({
    label: item.label,
    value: item.value,
  }));
  return mappedData;
};
