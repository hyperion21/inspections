# Project

Inspection of certain parts of factory

## Requirements

- Node.js
- NestJS
- React.js
- Vite
- MySQL

## Running the Backend

1. Navigate to the server folder:
   ```
   cd server
   ```
2. Reset the database:
   ```
   npm run reset-db
   ```
3. Start the backend in development mode:
   ```
   npm run start:dev
   ```

## Running the Frontend

1. Navigate to the client folder:
   ```
   cd client
   ```
2. Start the frontend in development mode:
   ```
   npm run dev
   ```

## Inspection Flow

### Manager

- **Create Inspection (YET_TO_START)**: Location is required, scheduling start date is optional.
- **Assign Inspector (YET_TO_START)**: Inspector is required, can change start date.

### Inspector

- **Start Inspection**: Moves from `YET_TO_START` → `IN_PROGRESS` and populates `actualStartDateTime`.
- **Complete Inspection**: Moves from `IN_PROGRESS` → `COMPLETED` with result (`PASS` or `FAIL`) and optional comments, populates `endDateTime`.

### Duration Calculation

- `duration = endDateTime - actualStartDateTime`
- If `startDateTime` or scheduled date is null on start, it will default to `actualStartDateTime`.

### Abandon Inspections

- Only inspections with `IN_PROGRESS` status can be moved to `ABANDON`.
- Inspector is unassigned.
- Cases triggering abandonment:
  - Manager deletes the inspector user.
  - Manager changes the inspector's role to manager.
- Behavior by status:
  - `YET_TO_START` → unassigned.
  - `COMPLETED` → remains assigned.

### Mobile View for Inspector

- SM size

### Added Features

- Swagger
- Common Toast

### Future Improvements

- Pagination
- Error Handling
