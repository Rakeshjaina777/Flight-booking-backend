export function calculateFinalFare({
  baseFare,
  isWindow,
  age,
  bookedSeats,
  totalSeats,
  timeBeforeDepartureInMinutes,
}: {
  baseFare: number;
  isWindow: boolean;
  age: number;
  bookedSeats: number;
  totalSeats: number;
  timeBeforeDepartureInMinutes: number;
}) {
  const breakdown: any = { baseFare };

  if (isWindow) {
    breakdown.windowCharge = 200;
    baseFare += 200;
  }

  if (age >= 60) {
    breakdown.ageDiscount = -150;
    baseFare -= 150;
  }

  const occupancyRate = bookedSeats / totalSeats;
  const surgeMultiplier = 1 + Math.min(0.5, occupancyRate);
  breakdown.surgeMultiplier = surgeMultiplier;
  baseFare *= surgeMultiplier;

  const timeMultiplier = timeBeforeDepartureInMinutes < 120 ? 1.05 : 1;
  breakdown.timeAdjustment = timeMultiplier;
  baseFare *= timeMultiplier;

  return {
    finalFare: Math.round(baseFare),
    breakdown,
  };
}
