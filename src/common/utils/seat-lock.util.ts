const lockedSeats = new Map();

export function lockSeat(seatKey: string, ttl = 90000) {
  if (lockedSeats.has(seatKey)) return false;

  lockedSeats.set(seatKey, Date.now());

  setTimeout(() => {
    
    lockedSeats.delete(seatKey);
  }, ttl);

  return true;
}

export function isSeatLocked(seatKey: string) {
  return lockedSeats.has(seatKey);
}
