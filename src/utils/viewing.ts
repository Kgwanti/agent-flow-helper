import { ViewingAppointment } from "@/types/viewing";

export const formatClientName = (profile: ViewingAppointment['profile']) => {
  if (!profile) return "N/A";
  const firstName = profile.first_name || "";
  const lastName = profile.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || profile.email || "N/A";
};

export const formatContactInfo = (profile: ViewingAppointment['profile']) => {
  if (!profile) return "N/A";
  const contacts = [];
  if (profile.email) contacts.push(profile.email);
  if (profile.phone) contacts.push(profile.phone);
  return contacts.length > 0 ? contacts.join(" / ") : "N/A";
};