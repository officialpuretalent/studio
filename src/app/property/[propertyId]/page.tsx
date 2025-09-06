import { PropertyDetailsCard } from '@/components/property-details-card';
import { BookingCalendar } from '@/components/booking-calendar';
import type { Property, ViewingSlot } from '@/lib/types';
import ViewWiseLogo from '@/components/icons/viewwise-logo';

// MOCK DATA
const MOCK_PROPERTY: Property = {
  id: '456-oak-avenue',
  address: '456 Oak Avenue, Sandton, Johannesburg, 2196',
  details: '2 Bedrooms, 1 Bathroom',
  rent: 15000,
  deposit: 30000,
  imageUrl: 'https://picsum.photos/1200/800',
  areaInterests: ['Sandton City Mall', 'Nelson Mandela Square', 'Gautrain Station'],
  uberFriendly: true,
  rating: 8.5,
  amenities: {
    gym: true,
    cafe: true,
    restaurants: true,
    hospital: false,
    mall: true,
  },
};

const generateMockSlots = (): ViewingSlot[] => {
  const slots: ViewingSlot[] = [];
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);

  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + dayOffset);

    if (dayOffset % 2 === 0) {
      slots.push({
        id: `slot-${dayOffset}-1`,
        startTime: new Date(new Date(date).setHours(10, 0)),
        endTime: new Date(new Date(date).setHours(10, 30)),
        type: 'Individual Viewing',
        totalSlots: 1,
        bookedSlots: (dayOffset / 2) % 2 === 0 ? 0 : 1,
      });
      slots.push({
        id: `slot-${dayOffset}-2`,
        startTime: new Date(new Date(date).setHours(10, 30)),
        endTime: new Date(new Date(date).setHours(11, 0)),
        type: 'Individual Viewing',
        totalSlots: 1,
        bookedSlots: 0,
      });
    }

    if (dayOffset % 3 === 0) {
      slots.push({
        id: `slot-${dayOffset}-3`,
        startTime: new Date(new Date(date).setHours(14, 0)),
        endTime: new Date(new Date(date).setHours(14, 30)),
        type: 'Group Viewing',
        totalSlots: 5,
        bookedSlots: 3,
      });
      slots.push({
        id: `slot-${dayOffset}-4`,
        startTime: new Date(new Date(date).setHours(14, 30)),
        endTime: new Date(new Date(date).setHours(15, 0)),
        type: 'Group Viewing',
        totalSlots: 5,
        bookedSlots: 5,
      });
    }
  }
  return slots;
};

export default function PropertyPage({
  params,
}: {
  params: { propertyId: string };
}) {
  // In a real app, data would be fetched based on params.propertyId
  const property = MOCK_PROPERTY;
  const viewingSlots = generateMockSlots();

  const isAvailable = true;

  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-50 w-full p-4 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-3">
          <ViewWiseLogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold font-headline">ViewWise</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[60%]">
            <PropertyDetailsCard property={property} isAvailable={isAvailable} />
          </div>
          <div className="lg:w-[40%]">
            {isAvailable ? (
              <BookingCalendar
                propertyId={property.id}
                viewingSlots={viewingSlots}
              />
            ) : (
              <div className="text-center mt-8 text-lg text-muted-foreground">
                <p>Here are some similar properties.</p>
                {/* Similar properties component would go here */}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
