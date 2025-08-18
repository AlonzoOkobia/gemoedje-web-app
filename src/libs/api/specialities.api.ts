export const getSpecialities = async (locale: string) => {
  const response = await fetch(`/api/specialities?locale=${locale}`);
  if (!response.ok) {
    throw new Error("Failed to fetch specialities");
  }
  const data = await response.json();
  const mappedData = data.data.map((item: any) => ({
    label: item.label,
    value: item.value,
  }));
  return mappedData;
};
