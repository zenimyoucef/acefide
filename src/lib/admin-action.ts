export type AdminActionResult = {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export const initialAdminActionResult: AdminActionResult = { success: false };

