import { useCallback, useMemo, useState } from 'react';
import type { BookingFormValues, BookingSummary, PriceBreakdown } from '../types/booking';
import { SERVICES } from '../data/catalog';
import type { Room } from '../types';
import { useDiscount } from '../context/DiscountContext';
import { useForm } from '../hooks/useForm';
import type { FormErrors } from '../hooks/useForm';
import { addDays, calcNights, calcTotal, isValidISODate, todayISO } from '../utils/pricing';
import { ServiceCheckbox } from './ServiceCheckbox';

interface BookingFormProps {
  rooms: Room[];
  initialRoomId?: number;
  onBooked: (summary: BookingSummary) => void;
}

const INITIAL_VALUES: BookingFormValues = {
  roomId: '',
  checkIn: '',
  checkOut: '',
  guests: 1,
};

function validateBooking(
  values: BookingFormValues,
  rooms: Room[],
): FormErrors<BookingFormValues> {
  const errors: FormErrors<BookingFormValues> = {};
  const room = rooms.find((r) => String(r.id) === values.roomId);
  const checkInValid = isValidISODate(values.checkIn);

  if (!values.checkIn) {
    errors.checkIn = 'გთხოვთ, მიუთითოთ შესვლის თარიღი';
  } else if (!checkInValid) {
    errors.checkIn = 'შესვლის თარიღი არასწორია';
  } else if (values.checkIn < todayISO()) {
    errors.checkIn = 'შესვლის თარიღი არ შეიძლება იყოს წარსულში';
  }

  if (!values.checkOut) {
    errors.checkOut = 'გთხოვთ, მიუთითოთ გასვლის თარიღი';
  } else if (!isValidISODate(values.checkOut)) {
    errors.checkOut = 'გასვლის თარიღი არასწორია';
  } else if (checkInValid && values.checkOut <= values.checkIn) {
    errors.checkOut = 'გასვლის თარიღი უნდა იყოს შესვლის თარიღზე გვიან';
  }

  if (!Number.isInteger(values.guests) || values.guests < 1) {
    errors.guests = 'სტუმრების რაოდენობა უნდა იყოს მინიმუმ 1';
    } else if (room && values.guests > room.capacity) {
    errors.guests = `სტუმრების ლიმიტი გადაჭარბებულია: ამ ნომერში მაქსიმუმ ${room.capacity} სტუმარია`;
  }

  return errors;
}

export function BookingForm({ rooms, initialRoomId, onBooked }: BookingFormProps) {
  const { discountIndex, isStudent, setIsStudent } = useDiscount();

  const validate = useCallback(
    (formValues: BookingFormValues) => validateBooking(formValues, rooms),
    [rooms],
  );

  const { values, errors, handleChange, handleBlur, handleSubmit, reset } =
       useForm<BookingFormValues>(
      { ...INITIAL_VALUES, roomId: initialRoomId ? String(initialRoomId) : '' },
      validate,
    );
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const room = rooms.find((r) => String(r.id) === values.roomId);
  const selectedServices = useMemo(
    () => SERVICES.filter((s) => selectedServiceIds.includes(s.id)),
    [selectedServiceIds],
  );

  const toggleService = useCallback((serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    );
  }, []);

  // ფასი გამოითვლება უშუალოდ მნიშვნელობებიდან (useMemo), ამიტომ არასდროს "ჩამორჩება" ერთი რენდერით.
  // ღამეები > 0 მხოლოდ მაშინ, როცა ორივე თარიღი სწორია და გასვლა შესვლის შემდეგაა.
  const price: PriceBreakdown = useMemo(() => {
    const nights = calcNights(values.checkIn, values.checkOut);
    return calcTotal({ room, nights, guests: values.guests, services: selectedServices, discountIndex });
  }, [values.checkIn, values.checkOut, values.guests, room, selectedServices, discountIndex]);

  const submitBooking = useCallback(
    (validValues: BookingFormValues) => {
      if (!room) return;
      onBooked({ room, values: validValues, services: selectedServices, price });
      reset();
      setSelectedServiceIds([]);
    },
    [room, selectedServices, price, onBooked, reset],
  );

  // დღევანდელი დღე = შესვლის მინიმუმი; გასვლა მინიმუმ შესვლის მეორე დღეა (მინიმუმ 1 ღამე).
  const today = todayISO();
  const checkOutMin = addDays(isValidISODate(values.checkIn) && values.checkIn >= today ? values.checkIn : today, 1);

  return (
    <form className="form" onSubmit={handleSubmit(submitBooking)} noValidate>
      <h2>ნომრის დაჯავშნის ფორმა</h2>

      <div className="field">
        <label htmlFor="roomId">ნომრის ტიპი</label>
                  <select id="roomId" name="roomId" value={values.roomId} onChange={handleChange} onBlur={handleBlur}>
            <option value="">აირჩიეთ ნომერი</option>
            {rooms.map((r) => (
              <option key={r.id} value={String(r.id)}>
                {r.name} — {r.price} ₾ / ღამე
              </option>
            ))}
          </select>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="checkIn">შესვლის თარიღი</label>
          <input
            id="checkIn" name="checkIn" type="date" min={today}
            value={values.checkIn} onChange={handleChange} onBlur={handleBlur}
            aria-invalid={!!errors.checkIn}
          />
          {errors.checkIn && <p className="error" role="alert">{errors.checkIn}</p>}
        </div>

        <div className="field">
          <label htmlFor="checkOut">გასვლის თარიღი</label>
          <input
            id="checkOut" name="checkOut" type="date" min={checkOutMin}
            value={values.checkOut} onChange={handleChange} onBlur={handleBlur}
            aria-invalid={!!errors.checkOut}
          />
          {errors.checkOut && <p className="error" role="alert">{errors.checkOut}</p>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="guests">სტუმრების რაოდენობა</label>
        <input
          id="guests" name="guests" type="number" min={1}
          value={values.guests} onChange={handleChange} onBlur={handleBlur}
          aria-invalid={!!errors.guests}
        />
        {errors.guests && <p className="error" role="alert">{errors.guests}</p>}
      </div>

      <fieldset className="services">
        <legend>დამატებითი სერვისები</legend>
        {SERVICES.map((s) => (
          <ServiceCheckbox
            key={s.id}
            service={s}
            checked={selectedServiceIds.includes(s.id)}
            onToggle={toggleService}
          />
        ))}
      </fieldset>
      <div className="field">
        <label>
          <input
            type="checkbox"
            checked={isStudent}
            onChange={(e) => setIsStudent(e.target.checked)}
          />{' '}
          სტუდენტი ვარ (15% ფასდაკლება)
        </label>
      </div>
      <section className="summary" aria-live="polite">
        <h3>ღირებულება</h3>
        {price.nights > 0 ? (
          <dl>
            <div><dt>ღამეების რაოდენობა</dt><dd>{price.nights}</dd></div>
            <div><dt>ნომრის ღირებულება</dt><dd>{price.roomCost} ₾</dd></div>
            <div><dt>დამატებითი სერვისები</dt><dd>{price.servicesCost} ₾</dd></div>
            {isStudent && (
              <div><dt>სტუდენტური ფასდაკლება</dt><dd>− {price.discountAmount.toFixed(2)} ₾</dd></div>
            )}
            <div className="summary__total"><dt>ჯამური ღირებულება</dt><dd>{price.total.toFixed(2)} ₾</dd></div>
          </dl>
        ) : (
          <p className="muted">ჯამური ღირებულების სანახავად აირჩიეთ სწორი თარიღები.</p>
        )}
      </section>

      <button type="submit" className="btn">დაჯავშნა</button>
    </form>
  );
}
