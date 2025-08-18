export type TWishlistRequest = {
  email: string;
  documentId: string;
};

export const createWishlistRequest = async (body: TWishlistRequest) => {
  try {
    const response = await fetch(`/api/providers/wishlist-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to create wishlist request");
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};
