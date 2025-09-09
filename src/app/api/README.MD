# API Documentation

This document describes the APIs available in the `/api` folder. Each API handles user profile image operations or Clerk authentication webhooks.

---

## 📂 Folder Structure

```
/api
 ├── /v1/getProfile      # (currently WIP) Get a user’s profile image
 ├── /v1/saveProfile     # Save a user’s profile image URL to the DB
 ├── /v1/deleteProfile   # Delete a user’s profile image from Cloudinary & DB
 └── /v1/clerk-webhook   # Handle Clerk Webhook events (user/session)
```

---

## 1. `/v1/api/getProfile`

**Method:** `GET`  
**Description:** Fetches the currently stored profile image of a user from the database.

> ⚠️ **Note:** This route is marked WIP in the code (commented out).

### Response Codes

| Status | Message                                                                |
| ------ | ---------------------------------------------------------------------- |
| `200`  | `"Profile Image fetched successfully"`                                 |
| `404`  | `"User not found"` OR `"User has not uploaded any profile image yet."` |
| `500`  | `"Internal Server Error"`                                              |

### Example Request

```http
GET /v1/api/getProfile
```

### Example Response (200)

```json
{
  "message": "Profile Image fetched successfully",
  "url": "https://res.cloudinary.com/demo/image/upload/profile.jpg"
}
```

---

## 2. `/v1/api/saveProfile`

**Method:** `POST`  
**Description:** Stores a user’s profile image URL in the database.

### Request Body

```json
{
  "url": "https://res.cloudinary.com/demo/image/upload/profile.jpg"
}
```

### Response Codes

| Status | Message                                                                                                                            |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `200`  | `"Profile Image stored in DB successfully"`                                                                                        |
| `404`  | `"Authenticated User doesn't exist on Clerk"` OR `"The Profile Image URL was not found"` OR `"Authenticated User not found in DB"` |
| `500`  | `"Error in the Server"`                                                                                                            |

### Example Request

```http
POST /api/v1/saveProfile
Content-Type: application/json

{
  "url": "https://res.cloudinary.com/demo/image/upload/profile.jpg"
}
```

### Example Response (200)

```json
{
  "message": "Profile Image stored in DB successfully"
}
```

---

## 3. `/v1/api/deleteProfile`

**Method:** `POST`  
**Description:** Deletes a user’s profile image from Cloudinary and updates the DB entry to `null`.

### Request Body

```json
{
  "publicId": "user_uploads/profile_123.jpg"
}
```

### Response Codes

| Status | Message                                                                  |
| ------ | ------------------------------------------------------------------------ |
| `200`  | `"Profile Image removed successfully"`                                   |
| `400`  | `"Cloudinary API error"`                                                 |
| `404`  | `"Authenticated User doesn't exist on Clerk"` OR `"Image URL not found"` |
| `500`  | `"Internal Server Error"`                                                |

### Example Request

```http
POST /api/v1/deleteProfile
Content-Type: application/json

{
  "publicId": "user_uploads/profile_123.jpg"
}
```

### Example Response (200)

```json
{
  "message": "Profile Image removed successfully"
}
```

---

## 4. `/api/v1/clerk-webhook`

**Method:** `POST`  
**Description:** Handles Clerk Webhook events such as `user.created`, `user.updated`, `session.created`, and `session.ended`.

### Request Body

The raw event payload from Clerk (varies by event type). Example:

```json
{
  "type": "user.created",
  "data": {
    "id": "user_123",
    "email_addresses": [{ "email_address": "test@example.com" }],
    "first_name": "John",
    "image_url": "https://example.com/profile.png"
  }
}
```

### Response Codes

| Status | Message                                       |
| ------ | --------------------------------------------- |
| `200`  | `"Event handled Gracefully"`                  |
| `400`  | `"Clerk Webhook Secret couldn't be accessed"` |
| `500`  | `"Internal Server Error"`                     |

### Example Response (200)

```json
{
  "message": "Event handled Gracefully"
}
```

---

## ✅ Summary

- **`/api/v1/getProfile`** → Get profile image (WIP).
- **`/api/v1/saveProfile`** → Save/update profile image in DB.
- **`/api/v1/deleteProfile`** → Delete profile image from Cloudinary & DB.
- **`/api/v1/clerk-webhook`** → Handle Clerk user/session events.
