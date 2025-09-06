export type Property = {
  id: string;
  address: string;
  details: string;
  imageUrl: string;
};

export type ViewingType = 'Individual Viewing' | 'Group Viewing';

export type ViewingSlot = {
  id: string;
  startTime: Date;
  endTime: Date;
  type: ViewingType;
  totalSlots: number;
  bookedSlots: number;
};
