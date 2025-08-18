import { ApproveSpecialityRequestPayload } from "../types/provider-speciality-request.type";

export const approveSpecialityRequest = async (
  payload: ApproveSpecialityRequestPayload,
) => {
  const response = await fetch("/api/admin/approve-provider-specialities", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to approve speciality request");
  }

  return response.json();
};
