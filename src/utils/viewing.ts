import { ViewingAppointment } from "@/types/viewing";

export const formatClientName = (profile: ViewingAppointment['profile']) => {
  if (!profile || (!profile.first_name && !profile.last_name)) return "N/A";
  const firstName = profile.first_name || "";
  const lastName = profile.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || "N/A";
};

export const formatContactInfo = (profile: ViewingAppointment['profile']) => {
  if (!profile) return "N/A";
  return profile.email || profile.phone || "N/A";
};