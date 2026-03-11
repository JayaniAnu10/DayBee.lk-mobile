import { create } from 'zustand';

export interface JobSeekerRegistrationData {
  firstName: string;
  lastName: string;
  nic: string;
  gender: string;
  address: string;
  dob: Date | null;
  bio: string;
  skills: string[];
  profilePicture: string | null; // URI
}

interface JobSeekerStore {
  data: JobSeekerRegistrationData;
  setData: (newData: Partial<JobSeekerRegistrationData>) => void;
  reset: () => void;
}

export const useJobSeekerStore = create<JobSeekerStore>((set) => ({
  data: {
    firstName: '',
    lastName: '',
    nic: '',
    gender: '',
    address: '',
    dob: null,
    bio: '',
    skills: [],
    profilePicture: null,
  },
  setData: (newData) =>
    set((state) => ({ data: { ...state.data, ...newData } })),
  reset: () =>
    set({
      data: {
        firstName: '',
        lastName: '',
        nic: '',
        gender: '',
        address: '',
        dob: null,
        bio: '',
        skills: [],
        profilePicture: null,
      },
    }),
}));

export interface EmployerRegistrationData {
  companyName: string;
  registrationID: string;
  contactPerson: string;
  phone: string;
  address: string;
  industry: string;
  website: string;
  description: string;
  logo: string | null; // URI
}

interface EmployerStore {
  data: EmployerRegistrationData;
  setData: (newData: Partial<EmployerRegistrationData>) => void;
  reset: () => void;
}

export const useEmployerStore = create<EmployerStore>((set) => ({
  data: {
    companyName: '',
    registrationID: '',
    contactPerson: '',
    phone: '',
    address: '',
    industry: '',
    website: '',
    description: '',
    logo: null,
  },
  setData: (newData) =>
    set((state) => ({ data: { ...state.data, ...newData } })),
  reset: () =>
    set({
      data: {
        companyName: '',
        registrationID: '',
        contactPerson: '',
        phone: '',
        address: '',
        industry: '',
        website: '',
        description: '',
        logo: null,
      },
    }),
}));
