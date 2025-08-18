export const getAllFaq = async (locale: string) => {
  const response = await fetch(`/api/faqs?locale=${locale}`);
  const data = await response.json();
  return data;
};
