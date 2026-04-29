# Hotel Booking System

A small Express + PostgreSQL hotel booking app with room, guest, and booking management. It includes a Tailwind-powered frontend, Yup validation, Jest tests, and weather data lookup for new bookings through Open-Meteo.

## Features

- Manage rooms: create, list, edit, and delete rooms.
- Manage guests: create, list, and edit guest records.
- Manage bookings: create, list, cancel, and update booking status.
- Fetch weather data for booking check-in dates.
- Browser frontend served from `public/index.html`.
- Jest test coverage for room, guest, booking, validation, and weather logic.

## Requirements

- Node.js 18+
- pnpm
- PostgreSQL

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a local environment file from the example:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Update `.env` with your local PostgreSQL connection string:

   ```env
   PORT=3000
   DATABASE_URL=postgresql://postgres:password@localhost:5432/hotel_booking_db
   ```

4. Create the database, then run the schema in `database/schema.sql`.

## Running the app

Start the development server:

```bash
pnpm run dev
```

Or start without nodemon:

```bash
pnpm start
```

Open the frontend at:

```text
http://localhost:3000
```

## Testing

Run the test suite:

```bash
pnpm test
```

For a single serial run, use:

```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand
```

## API endpoints

### Rooms

- `POST /bookings/rooms`
- `GET /bookings/rooms`
- `GET /bookings/rooms/:id`
- `PATCH /bookings/rooms/:id`
- `DELETE /bookings/rooms/:id`

### Guests

- `POST /bookings/guests`
- `GET /bookings/guests`
- `GET /bookings/guests/:id`
- `PATCH /bookings/guests/:id`

### Bookings

- `POST /bookings`
- `GET /bookings`
- `GET /bookings/:id`
- `GET /bookings/guest/:guest_id`
- `PATCH /bookings/:id`
- `DELETE /bookings/:id`
