import { apiClient, AuthService } from "../auth";

export interface UpgradePopupResponse {
  id: number;
  title: string;
  description: string;
  visibleTo: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  locale?: string;
  documentId?: string;
}

export const getActiveUpgradePopup =
  async (): Promise<UpgradePopupResponse | null> => {
    try {
      const now = new Date();
      const token = AuthService.getToken();

      const response = await apiClient.get("/upgrade-popup-setting", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const popup = response.data?.data;
      if (!popup) return null;

      const { startDate, endDate, title, enabled } = popup;

      const isWithinDateRange =
        new Date(startDate) <= now && new Date(endDate) >= now;

      if (enabled && title && isWithinDateRange) {
        return popup;
      }

      return null;
    } catch (error) {
      return null;
    }
  };
