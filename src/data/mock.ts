export type Physician = {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  bio: string;
  locationIds: string[];
  avatarHue: number;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
  type: 'Clinic' | 'Hospital' | 'Specialty Center';
};

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  nextRefill: string;
  instructions: string;
  status: 'Active' | 'Paused' | 'Completed';
};

export type TimeSlot = {
  id: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
};

export const physicians: Physician[] = [
  {
    id: 'p1',
    name: 'Dr. Amara Chen',
    specialty: 'Family Medicine',
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 214,
    bio: 'Focused on preventive care and long-term wellness for adults and families.',
    locationIds: ['l1', 'l2'],
    avatarHue: 168,
  },
  {
    id: 'p2',
    name: 'Dr. Marcus Hale',
    specialty: 'Cardiology',
    experienceYears: 18,
    rating: 4.8,
    reviewCount: 301,
    bio: 'Specializes in heart health, risk assessment, and lifestyle-guided treatment plans.',
    locationIds: ['l2', 'l3'],
    avatarHue: 198,
  },
  {
    id: 'p3',
    name: 'Dr. Priya Nair',
    specialty: 'Dermatology',
    experienceYears: 9,
    rating: 4.95,
    reviewCount: 178,
    bio: 'Treats skin conditions with a calm, evidence-based approach for all ages.',
    locationIds: ['l1', 'l4'],
    avatarHue: 145,
  },
  {
    id: 'p4',
    name: 'Dr. Elena Vargas',
    specialty: 'Pediatrics',
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 256,
    bio: 'Warm, thorough pediatric care with a focus on development and vaccination.',
    locationIds: ['l1', 'l3'],
    avatarHue: 210,
  },
  {
    id: 'p5',
    name: 'Dr. James Okonkwo',
    specialty: 'Orthopedics',
    experienceYears: 16,
    rating: 4.7,
    reviewCount: 189,
    bio: 'Helps patients recover mobility through surgical and non-surgical care.',
    locationIds: ['l2', 'l4'],
    avatarHue: 175,
  },
];

export const locations: Location[] = [
  {
    id: 'l1',
    name: 'Harborview Wellness Clinic',
    address: '128 Maple Avenue',
    city: 'Brookline',
    state: 'MA',
    zip: '02445',
    phone: '(617) 555-0142',
    hours: 'Mon–Fri 8:00 AM – 6:00 PM',
    type: 'Clinic',
  },
  {
    id: 'l2',
    name: 'Northside Medical Center',
    address: '940 Industrial Parkway',
    city: 'Cambridge',
    state: 'MA',
    zip: '02139',
    phone: '(617) 555-0198',
    hours: 'Mon–Sat 7:30 AM – 8:00 PM',
    type: 'Hospital',
  },
  {
    id: 'l3',
    name: 'Riverside Specialty Pavilion',
    address: '55 River Road, Suite 210',
    city: 'Somerville',
    state: 'MA',
    zip: '02143',
    phone: '(617) 555-0177',
    hours: 'Tue–Sat 9:00 AM – 5:00 PM',
    type: 'Specialty Center',
  },
  {
    id: 'l4',
    name: 'Eastgate Family Health',
    address: '402 Beacon Street',
    city: 'Boston',
    state: 'MA',
    zip: '02116',
    phone: '(617) 555-0110',
    hours: 'Mon–Fri 8:30 AM – 5:30 PM',
    type: 'Clinic',
  },
];

export const medications: Medication[] = [
  {
    id: 'm1',
    name: 'Lisinopril',
    dosage: '10 mg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. Marcus Hale',
    startDate: '2025-11-12',
    nextRefill: '2026-08-20',
    instructions: 'Take in the morning with water. Avoid skipping doses.',
    status: 'Active',
  },
  {
    id: 'm2',
    name: 'Metformin',
    dosage: '500 mg',
    frequency: 'Twice daily',
    prescribedBy: 'Dr. Amara Chen',
    startDate: '2025-08-03',
    nextRefill: '2026-08-10',
    instructions: 'Take with meals to reduce stomach upset.',
    status: 'Active',
  },
  {
    id: 'm3',
    name: 'Cetirizine',
    dosage: '10 mg',
    frequency: 'As needed',
    prescribedBy: 'Dr. Priya Nair',
    startDate: '2026-03-01',
    nextRefill: '2026-09-01',
    instructions: 'Use for allergy flare-ups. Do not exceed one tablet daily.',
    status: 'Active',
  },
  {
    id: 'm4',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    frequency: 'Once daily',
    prescribedBy: 'Dr. Amara Chen',
    startDate: '2026-01-15',
    nextRefill: '2026-10-15',
    instructions: 'Take with food containing some fat for better absorption.',
    status: 'Active',
  },
];

export const timeSlots: TimeSlot[] = [
  { id: 's1', time: '9:00 AM', period: 'Morning' },
  { id: 's2', time: '9:30 AM', period: 'Morning' },
  { id: 's3', time: '10:00 AM', period: 'Morning' },
  { id: 's4', time: '10:30 AM', period: 'Morning' },
  { id: 's5', time: '11:00 AM', period: 'Morning' },
  { id: 's6', time: '1:00 PM', period: 'Afternoon' },
  { id: 's7', time: '1:30 PM', period: 'Afternoon' },
  { id: 's8', time: '2:00 PM', period: 'Afternoon' },
  { id: 's9', time: '2:30 PM', period: 'Afternoon' },
  { id: 's10', time: '3:30 PM', period: 'Afternoon' },
  { id: 's11', time: '4:00 PM', period: 'Afternoon' },
  { id: 's12', time: '5:00 PM', period: 'Evening' },
];

export function getUpcomingDates(count = 7): { id: string; label: string; sublabel: string; iso: string }[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result = [];
  const start = new Date();
  start.setHours(12, 0, 0, 0);

  for (let i = 1; i <= count; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    result.push({
      id: iso,
      label: `${days[d.getDay()]}`,
      sublabel: `${months[d.getMonth()]} ${d.getDate()}`,
      iso,
    });
  }

  return result;
}

export function getPhysicianById(id?: string | null) {
  return physicians.find((p) => p.id === id);
}

export function getLocationById(id?: string | null) {
  return locations.find((l) => l.id === id);
}
