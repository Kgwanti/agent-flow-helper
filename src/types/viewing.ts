export interface ViewingAppointment {
  id: string;
  viewing_date: string;
  viewing_time: string;
  address: string | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
}