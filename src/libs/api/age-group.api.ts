export const getAgeGroups = async (locale: string) => {
  const response = await fetch(`/api/age-groups?locale=${locale}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch age groups");
  }
  const data = await response.json();
  const mappedData = data.data.map((item: any) => ({
    label: item.label,
    value: item.value,
  }));
  return mappedData;
};
