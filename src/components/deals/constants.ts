
import { Stage } from "./types";

export const initialStages: Stage[] = [
  {
    id: '1',
    status: 'LEAD_QUALIFICATION',
    title: 'Lead Qualification',
    notes: 'Initial evaluation of client requirements and preferences',
    expense: 0,
    bgColor: 'bg-[#F2FCE2]',
    lightBgColor: 'hover:bg-[#E2ECE2]',
    order: 0
  },
  {
    id: '2',
    status: 'PROPERTY_SHOWINGS',
    title: 'Property Showings',
    notes: 'Scheduling and conducting property viewings',
    expense: 0,
    bgColor: 'bg-[#FEF7CD]',
    lightBgColor: 'hover:bg-[#EEE7BD]',
    order: 1
  },
  {
    id: '3',
    status: 'OFFER_SUBMISSION',
    title: 'Offer Submission',
    notes: 'Preparing and submitting offers',
    expense: 0,
    bgColor: 'bg-[#FEC6A1]',
    lightBgColor: 'hover:bg-[#EEB691]',
    order: 2
  },
  {
    id: '4',
    status: 'NEGOTIATION',
    title: 'Negotiation',
    notes: 'Active price and terms negotiation',
    expense: 0,
    bgColor: 'bg-[#E5DEFF]',
    lightBgColor: 'hover:bg-[#D5CEEF]',
    order: 3
  },
  {
    id: '5',
    status: 'DUE_DILIGENCE',
    title: 'Due Diligence',
    notes: 'Property inspection and document review',
    expense: 0,
    bgColor: 'bg-[#FFDEE2]',
    lightBgColor: 'hover:bg-[#EFCED2]',
    order: 4
  },
  {
    id: '6',
    status: 'CLOSING',
    title: 'Closing',
    notes: 'Final paperwork and closing process',
    expense: 0,
    bgColor: 'bg-[#D3E4FD]',
    lightBgColor: 'hover:bg-[#C3D4ED]',
    order: 5
  }
];
