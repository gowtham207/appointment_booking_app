# CareBook API Specification

API contract for the **Appointment Booking** mobile app (CareBook).  
Use this document to implement the backend that will replace the current mock/local data.

**Base URL (suggested):** `https://api.example.com/v1`  
**Format:** JSON  
**Auth:** Bearer JWT (`Authorization: Bearer <access_token>`)

---

## Contents

1. [Overview](#1-overview)
2. [Auth & headers](#2-auth--headers)
3. [Standard response & errors](#3-standard-response--errors)
4. [Data models](#4-data-models)
5. [API list (quick reference)](#5-api-list-quick-reference)
6. [Auth APIs](#6-auth-apis)
7. [Patient / profile APIs](#7-patient--profile-apis)
8. [Physician APIs](#8-physician-apis)
9. [Location APIs](#9-location-apis)
10. [Availability / slot APIs](#10-availability--slot-apis)
11. [Appointment APIs](#11-appointment-apis)
12. [Medication APIs](#12-medication-apis)
13. [Priority for MVP](#13-priority-for-mvp)

---

## 1. Overview

The mobile app currently supports:

| Feature | Backend need |
| --- | --- |
| Patient login / signup | Auth APIs |
| Physician list | Physicians APIs |
| Location list | Locations APIs |
| Book appointment (physician + location + date + slot) | Availability + Appointments APIs |
| View / cancel appointments | Appointments APIs |
| Current medications | Medications APIs |
| Patient profile | Profile APIs |

---

## 2. Auth & headers

### Public endpoints (no token)

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh` (optional but recommended)

### Protected endpoints

All other endpoints require:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Token suggestion

| Token | Lifetime | Purpose |
| --- | --- | --- |
| `access_token` | 15–60 minutes | API access |
| `refresh_token` | 7–30 days | Renew access token |

Passwords must be hashed server-side (e.g. bcrypt / argon2). Never return password fields.

---

## 3. Standard response & errors

### Success (example)

```json
{
  "success": true,
  "data": {}
}
```

### Error (example)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is already registered"
  }
}
```

### Common HTTP status codes

| Code | Meaning |
| --- | --- |
| `200` | OK |
| `201` | Created |
| `400` | Validation / bad request |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden |
| `404` | Not found |
| `409` | Conflict (e..g. slot already booked) |
| `422` | Unprocessable entity |
| `500` | Server error |

### Suggested error codes

| Code | When |
| --- | --- |
| `INVALID_CREDENTIALS` | Wrong email/password |
| `EMAIL_EXISTS` | Signup with existing email |
| `UNAUTHORIZED` | Missing/invalid token |
| `NOT_FOUND` | Resource missing |
| `SLOT_UNAVAILABLE` | Slot already taken |
| `VALIDATION_ERROR` | Invalid payload |
| `FORBIDDEN` | Accessing another patient's data |

---

## 4. Data models

### Patient

```ts
{
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
```

### Physician

```ts
{
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;          // e.g. 4.9
  reviewCount: number;
  bio: string;
  locationIds: string[];   // locations where this physician practices
  avatarUrl?: string | null;
  avatarHue?: number;      // optional UI helper (0–360)
  isActive: boolean;
}
```

### Location

```ts
{
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;           // e.g. "Mon–Fri 8:00 AM – 6:00 PM"
  type: "Clinic" | "Hospital" | "Specialty Center";
  isActive: boolean;
}
```

### TimeSlot

```ts
{
  id: string;
  time: string;            // display: "9:00 AM"
  startTime: string;       // "09:00" (24h recommended for backend)
  endTime: string;         // "09:30"
  period: "Morning" | "Afternoon" | "Evening";
  available: boolean;
}
```

### Appointment

```ts
{
  id: string;
  patientId: string;
  physicianId: string;
  locationId: string;
  date: string;            // "YYYY-MM-DD"
  slotId: string;
  time: string;            // "9:00 AM"
  reason?: string | null;
  status: "Scheduled" | "Completed" | "Cancelled" | "NoShow";
  createdAt: string;
  updatedAt: string;

  // Optional nested objects for list/detail convenience
  physician?: Physician;
  location?: Location;
}
```

### Medication

```ts
{
  id: string;
  patientId: string;
  name: string;
  dosage: string;          // "10 mg"
  frequency: string;       // "Once daily"
  prescribedBy: string;    // physician name or id + name
  physicianId?: string | null;
  startDate: string;       // "YYYY-MM-DD"
  nextRefill: string;      // "YYYY-MM-DD"
  instructions: string;
  status: "Active" | "Paused" | "Completed";
}
```

---

## 5. API list (quick reference)

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/signup` | No | Register patient |
| `POST` | `/auth/login` | No | Login patient |
| `POST` | `/auth/logout` | Yes | Logout / invalidate refresh token |
| `POST` | `/auth/refresh` | No* | Refresh access token |
| `GET` | `/patients/me` | Yes | Get current patient profile |
| `PATCH` | `/patients/me` | Yes | Update profile |
| `GET` | `/physicians` | Yes | List / search physicians |
| `GET` | `/physicians/:id` | Yes | Physician detail |
| `GET` | `/locations` | Yes | List / filter locations |
| `GET` | `/locations/:id` | Yes | Location detail |
| `GET` | `/availability` | Yes | Available dates/slots for booking |
| `GET` | `/appointments` | Yes | My appointments |
| `GET` | `/appointments/:id` | Yes | Appointment detail |
| `POST` | `/appointments` | Yes | Book appointment |
| `PATCH` | `/appointments/:id/cancel` | Yes | Cancel appointment |
| `GET` | `/medications` | Yes | Current medications for patient |
| `GET` | `/medications/:id` | Yes | Medication detail |

\* Refresh uses `refresh_token` in body/cookie, not access token.

---

## 6. Auth APIs

### 6.1 Signup

`POST /auth/signup`

**Request**

```json
{
  "name": "Alex Morgan",
  "email": "alex@email.com",
  "password": "secret123",
  "phone": "(555) 000-0000"
}
```

**Validation**

- `name`: required, non-empty
- `email`: required, valid email, unique
- `password`: required, min 6 characters
- `phone`: optional

**Response `201`**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "u_123",
      "name": "Alex Morgan",
      "email": "alex@email.com",
      "phone": "(555) 000-0000"
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

**Errors**

- `409` / `EMAIL_EXISTS`
- `400` / `VALIDATION_ERROR`

---

### 6.2 Login

`POST /auth/login`

**Request**

```json
{
  "email": "alex@email.com",
  "password": "secret123"
}
```

**Response `200`**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "u_123",
      "name": "Alex Morgan",
      "email": "alex@email.com",
      "phone": "(555) 000-0000"
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

**Errors**

- `401` / `INVALID_CREDENTIALS`

---

### 6.3 Logout

`POST /auth/logout`

**Headers:** Bearer token required

**Request (optional)**

```json
{
  "refreshToken": "eyJhbGciOi..."
}
```

**Response `200`**

```json
{
  "success": true,
  "data": {
    "message": "Logged out"
  }
}
```

---

### 6.4 Refresh token (recommended)

`POST /auth/refresh`

**Request**

```json
{
  "refreshToken": "eyJhbGciOi..."
}
```

**Response `200`**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

---

## 7. Patient / profile APIs

### 7.1 Get current patient

`GET /patients/me`

**Response `200`**

```json
{
  "success": true,
  "data": {
    "id": "u_123",
    "name": "Alex Morgan",
    "email": "alex@email.com",
    "phone": "(555) 000-0000",
    "createdAt": "2026-08-01T10:00:00.000Z",
    "updatedAt": "2026-08-01T10:00:00.000Z"
  }
}
```

---

### 7.2 Update profile

`PATCH /patients/me`

**Request**

```json
{
  "name": "Alex M.",
  "phone": "(555) 111-2222"
}
```

**Response `200`:** updated patient object

---

## 8. Physician APIs

### 8.1 List physicians

`GET /physicians`

**Query params**

| Param | Type | Description |
| --- | --- | --- |
| `q` | string | Search name or specialty |
| `specialty` | string | Exact/partial specialty filter |
| `locationId` | string | Physicians available at a location |
| `page` | number | Page number (default 1) |
| `limit` | number | Page size (default 20) |

**Example**

`GET /physicians?q=cardio&locationId=l2`

**Response `200`**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "p2",
        "name": "Dr. Marcus Hale",
        "specialty": "Cardiology",
        "experienceYears": 18,
        "rating": 4.8,
        "reviewCount": 301,
        "bio": "Specializes in heart health...",
        "locationIds": ["l2", "l3"],
        "avatarUrl": null,
        "avatarHue": 198,
        "isActive": true
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

---

### 8.2 Get physician by id

`GET /physicians/:id`

**Response `200`:** single physician object  
**Error:** `404` if not found

---

## 9. Location APIs

### 9.1 List locations

`GET /locations`

**Query params**

| Param | Type | Description |
| --- | --- | --- |
| `q` | string | Search name, city, address |
| `type` | string | `Clinic` \| `Hospital` \| `Specialty Center` |
| `physicianId` | string | Locations for a physician |
| `city` | string | City filter |
| `page` | number | Page number |
| `limit` | number | Page size |

**Example**

`GET /locations?type=Clinic&physicianId=p1`

**Response `200`**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "l1",
        "name": "Harborview Wellness Clinic",
        "address": "128 Maple Avenue",
        "city": "Brookline",
        "state": "MA",
        "zip": "02445",
        "phone": "(617) 555-0142",
        "hours": "Mon–Fri 8:00 AM – 6:00 PM",
        "type": "Clinic",
        "isActive": true
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

---

### 9.2 Get location by id

`GET /locations/:id`

**Response `200`:** single location object

---

## 10. Availability / slot APIs

Used by the booking screen (date + time slot selection).

### 10.1 Get availability

`GET /availability`

**Query params (required)**

| Param | Type | Description |
| --- | --- | --- |
| `physicianId` | string | Selected physician |
| `locationId` | string | Selected location |
| `from` | string | Start date `YYYY-MM-DD` |
| `to` | string | End date `YYYY-MM-DD` |

**Example**

`GET /availability?physicianId=p1&locationId=l1&from=2026-08-03&to=2026-08-10`

**Response `200`**

```json
{
  "success": true,
  "data": {
    "dates": [
      {
        "date": "2026-08-03",
        "label": "Mon",
        "sublabel": "Aug 3",
        "slots": [
          {
            "id": "s1",
            "time": "9:00 AM",
            "startTime": "09:00",
            "endTime": "09:30",
            "period": "Morning",
            "available": true
          },
          {
            "id": "s2",
            "time": "9:30 AM",
            "startTime": "09:30",
            "endTime": "10:00",
            "period": "Morning",
            "available": false
          }
        ]
      }
    ]
  }
}
```

**Business rules**

- Only return slots for that physician at that location.
- Mark booked/blocked slots as `available: false` (or omit them).
- Prevent double-booking with a DB unique constraint on  
  `(physicianId, locationId, date, slotId)` where status is `Scheduled`.

---

## 11. Appointment APIs

### 11.1 List my appointments

`GET /appointments`

**Query params**

| Param | Type | Description |
| --- | --- | --- |
| `status` | string | `Scheduled` \| `Completed` \| `Cancelled` \| `NoShow` |
| `from` | string | Filter from date |
| `to` | string | Filter to date |
| `page` | number | Page |
| `limit` | number | Limit |

**Response `200`**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "appt_1",
        "patientId": "u_123",
        "physicianId": "p1",
        "locationId": "l1",
        "date": "2026-08-05",
        "slotId": "s3",
        "time": "10:00 AM",
        "reason": "Annual checkup",
        "status": "Scheduled",
        "createdAt": "2026-08-02T08:00:00.000Z",
        "updatedAt": "2026-08-02T08:00:00.000Z",
        "physician": {
          "id": "p1",
          "name": "Dr. Amara Chen",
          "specialty": "Family Medicine",
          "avatarHue": 168
        },
        "location": {
          "id": "l1",
          "name": "Harborview Wellness Clinic",
          "city": "Brookline"
        }
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

**Rule:** return only appointments for the authenticated patient.

---

### 11.2 Get appointment detail

`GET /appointments/:id`

**Response `200`:** full appointment (with physician + location)  
**Errors:** `404`, `403` if not owned by patient

---

### 11.3 Book appointment

`POST /appointments`

**Request**

```json
{
  "physicianId": "p1",
  "locationId": "l1",
  "date": "2026-08-05",
  "slotId": "s3",
  "reason": "Annual checkup"
}
```

**Validation**

- Patient must be authenticated
- Physician must practice at location (`locationId` in physician.locationIds)
- Slot must be available for that physician/location/date
- `reason` optional

**Response `201`**

```json
{
  "success": true,
  "data": {
    "id": "appt_1",
    "patientId": "u_123",
    "physicianId": "p1",
    "locationId": "l1",
    "date": "2026-08-05",
    "slotId": "s3",
    "time": "10:00 AM",
    "reason": "Annual checkup",
    "status": "Scheduled",
    "createdAt": "2026-08-02T08:00:00.000Z",
    "updatedAt": "2026-08-02T08:00:00.000Z"
  }
}
```

**Errors**

- `409` / `SLOT_UNAVAILABLE`
- `400` / `VALIDATION_ERROR`
- `404` if physician/location/slot invalid

---

### 11.4 Cancel appointment

`PATCH /appointments/:id/cancel`

**Request (optional)**

```json
{
  "reason": "Schedule conflict"
}
```

**Response `200`**

```json
{
  "success": true,
  "data": {
    "id": "appt_1",
    "status": "Cancelled",
    "updatedAt": "2026-08-02T09:00:00.000Z"
  }
}
```

**Rules**

- Only the owning patient can cancel
- Only `Scheduled` appointments can be cancelled
- Prefer soft cancel (`status = Cancelled`), do not hard-delete

---

## 12. Medication APIs

### 12.1 List current medications

`GET /medications`

**Query params**

| Param | Type | Description |
| --- | --- | --- |
| `status` | string | `Active` \| `Paused` \| `Completed` (default: all, or Active for home) |

**Response `200`**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "m1",
        "patientId": "u_123",
        "name": "Lisinopril",
        "dosage": "10 mg",
        "frequency": "Once daily",
        "prescribedBy": "Dr. Marcus Hale",
        "physicianId": "p2",
        "startDate": "2025-11-12",
        "nextRefill": "2026-08-20",
        "instructions": "Take in the morning with water.",
        "status": "Active"
      }
    ],
    "activeCount": 1
  }
}
```

**Rule:** return only medications for the authenticated patient.

---

### 12.2 Get medication detail

`GET /medications/:id`

**Response `200`:** single medication  
**Errors:** `404`, `403`

> Note: Creating/updating medications may be admin/physician-only later.  
> For the current mobile MVP, **read-only** medication APIs are enough.

---

## 13. Priority for MVP

Implement in this order so the mobile app can switch off mocks quickly:

### Must have (Phase 1)

1. `POST /auth/signup`
2. `POST /auth/login`
3. `GET /patients/me`
4. `GET /physicians`
5. `GET /locations`
6. `GET /availability`
7. `POST /appointments`
8. `GET /appointments`
9. `PATCH /appointments/:id/cancel`
10. `GET /medications`

### Nice to have (Phase 2)

11. `POST /auth/refresh`
12. `POST /auth/logout`
13. `GET /physicians/:id`
14. `GET /locations/:id`
15. `GET /appointments/:id`
16. `GET /medications/:id`
17. `PATCH /patients/me`

---

## Suggested DB tables

- `patients`
- `physicians`
- `locations`
- `physician_locations` (many-to-many)
- `time_slots` (master slot catalog)
- `appointments`
- `medications`
- `refresh_tokens` (optional)

---

## Mobile app mapping (current screens)

| Screen | APIs used |
| --- | --- |
| Login | `POST /auth/login` |
| Signup | `POST /auth/signup` |
| Home | `GET /appointments?status=Scheduled`, `GET /medications?status=Active` |
| Physicians | `GET /physicians?q=` |
| Locations | `GET /locations?q=&type=` |
| Book | `GET /physicians`, `GET /locations?physicianId=`, `GET /availability`, `POST /appointments` |
| Medications | `GET /medications` |
| Profile | `GET /patients/me`, `GET /appointments`, `PATCH /appointments/:id/cancel`, `POST /auth/logout` |

---

## Notes for backend developer

1. Keep IDs as UUID strings (or similar) in API responses.
2. Use ISO dates: `YYYY-MM-DD` for dates, full ISO for timestamps.
3. Always scope patient data by authenticated `patientId` from the JWT — never trust client-sent patient IDs for ownership.
4. Booking must be transactional: check slot availability + create appointment atomically.
5. CORS should allow the mobile/dev origins if needed for web testing.
6. Provide a Postman/Insomnia collection once endpoints are ready.
7. Seed sample physicians, locations, slots, and a demo patient for QA.

---

## Sample seed data (aligned with current app mocks)

### Physicians

- Dr. Amara Chen — Family Medicine
- Dr. Marcus Hale — Cardiology
- Dr. Priya Nair — Dermatology
- Dr. Elena Vargas — Pediatrics
- Dr. James Okonkwo — Orthopedics

### Locations

- Harborview Wellness Clinic (Clinic)
- Northside Medical Center (Hospital)
- Riverside Specialty Pavilion (Specialty Center)
- Eastgate Family Health (Clinic)

### Sample slots

Morning: 9:00, 9:30, 10:00, 10:30, 11:00  
Afternoon: 1:00, 1:30, 2:00, 2:30, 3:30, 4:00  
Evening: 5:00

---

**Document version:** 1.0  
**App:** CareBook / appointment_booking  
**Owner:** Mobile team → Backend team handoff
