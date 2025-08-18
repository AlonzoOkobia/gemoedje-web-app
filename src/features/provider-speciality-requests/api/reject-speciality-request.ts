import { RejectSpecialityRequestPayload } from "../types/provider-speciality-request.type";

export const rejectSpecialityRequest = async (
  payload: RejectSpecialityRequestPayload,
) => {
  const response = await fetch("/api/admin/reject-provider-specialities", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to reject speciality request");
  }

  return response.json();
};
