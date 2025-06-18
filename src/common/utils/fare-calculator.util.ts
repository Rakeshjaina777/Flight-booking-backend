
interface FareInput {
  baseFare: number;
  isWindow: boolean;
  age: number;
  bookedSeats: number;
  totalSeats: number;
  timeBeforeDepartureInMinutes: number;
}

export function calculateFinalFare(input: FareInput): {
  finalFare: number;
  breakdown: any;
} {
  const breakdown: any = {};
  let fare = input.baseFare;

  breakdown.base = fare;

  // Age discounts
  if (input.age >= 60) {
    const discount = fare * 0.1;
    fare -= discount;
    breakdown.seniorDiscount = -discount;
  } else if (input.age < 3) {
    breakdown.infant = -fare;
    fare = 0;
  }

  // Window seat premium
  if (input.isWindow) {
    const premium = fare * 0.1;
    fare += premium;
    breakdown.windowSeatPremium = premium;
  }

  // Last 20 seats surge pricing
  if (input.totalSeats - input.bookedSeats <= 20) {
    const surge = fare * 0.2;
    fare += surge;
    breakdown.last20Surge = surge;
  }

  // <4 hour & 50% empty = discount
  if (
    input.timeBeforeDepartureInMinutes <= 240 &&
    input.bookedSeats / input.totalSeats <= 0.5
  ) {
    const discount = fare * 0.2;
    fare -= discount;
    breakdown.lastMinuteDiscount = -discount;
  }

  return { finalFare: Math.ceil(fare), breakdown };
}
