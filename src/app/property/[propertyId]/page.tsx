import { PropertyDetailsCard } from '@/components/property-details-card';
import { BookingCalendar } from '@/components/booking-calendar';
import type { Property, ViewingSlot } from '@/lib/types';
import ApertureLogo from '@/components/icons/aperture-logo';
import { AskAnythingBar } from '@/components/ask-anything-bar';
import { AgentCard } from '@/components/agent-card';

// MOCK DATA
const MOCK_PROPERTY: Property = {
  id: '456-oak-avenue',
  address: '456 Oak Avenue, Sandton, Johannesburg, 2196',
  details: '2 Bedrooms, 1 Bathroom',
  rent: 15000,
  deposit: 15000,
  imageUrl: 'https://helium.privateproperty.co.za/live-za-images/property/182/13/11326182/images/property-11326182-5743255_dhd.jpg',
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

    // Generate slots from 9am to 5pm (17:00)
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = new Date(new Date(date).setHours(hour, minute));
        const endTime = new Date(
          new Date(date).setHours(hour, minute + 30)
        );

        // Don't generate slots on weekends for this example
        if (startTime.getDay() === 0 || startTime.getDay() === 6) {
            continue;
        }

        const isGroup = Math.random() > 0.8;
        const totalSlots = isGroup ? 5 : 1;
        
        // Make some slots fully booked
        const isFullyBooked = Math.random() > 0.7;
        const bookedSlots = isFullyBooked ? totalSlots : Math.floor(Math.random() * totalSlots);

        slots.push({
          id: `slot-${dayOffset}-${hour}-${minute}`,
          startTime,
          endTime,
          type: isGroup ? 'Group Viewing' : 'Individual Viewing',
          totalSlots: totalSlots,
          bookedSlots: bookedSlots,
        });
      }
    }
  }
  return slots;
};

// 🚀 CACHE THE MOCK SLOTS - Generate once, reuse everywhere
const CACHED_MOCK_SLOTS = generateMockSlots();

export default function PropertyPage({
  params,
}: {
  params: { propertyId: string };
}) {
  // In a real app, data would be fetched based on params.propertyId
  const property = MOCK_PROPERTY;
  const viewingSlots = CACHED_MOCK_SLOTS;

  const isAvailable = true;

  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-40 w-full p-4 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex max-w-3xl items-center gap-3 px-4 md:px-8">
          <ApertureLogo />
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 pb-32 max-w-3xl">
        <div className="mx-auto flex flex-col gap-8">
          <PropertyDetailsCard property={property} isAvailable={isAvailable} />
          <div id="booking-calendar" className="scroll-mt-24">
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
          <AgentCard />
        </div>
      </main>
      <AskAnythingBar />
    </div>
  );
}
