# Ticket Management System API Documentation
Import the **Postman API Collection** (*collection.json*) attached in the repository for quick and easy API testing.
## Authentication

All API endpoints (except login) require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Register User
```
POST /api/register
```

Request body:
```json
{
    "username": "user",
    "email": "abc@example.com",
    "password": "your_password"
}
```

Response: `201`
```json
{
    "username": "newuser3",
    "email": "r@example.com",
    "password": ""
}
```

### Login User
```
POST /api/token/
```

Request body:
```json
{
    "username": "your_username",
    "password": "your_password"
}
```

Response:
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Refresh Token
```
POST /api/token/refresh/
```

Request body:
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## Tickets API

### List Tickets
```
GET /api/tickets/
```

Query Parameters:
- `status`: Filter by status (open, in_progress, resolved)
- `priority`: Filter by priority (low, medium, high)
- `user`: Filter by user ID
- `assigned_to`: Filter by assigned user ID
- `search`: Search in title and description
- `ordering`: Order by field (created_at, -created_at, priority, -priority)
- `page`: Page number for pagination
- `page_size`: Number of items per page (default: 10)

Response:
```json
{
    "count": 100,
    "next": "http://api.example.org/tickets/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "title": "Network Issue",
            "description": "Cannot connect to server",
            "created_at": "2025-01-15T10:00:00Z",
            "updated_at": "2025-01-15T10:30:00Z",
            "status": "open",
            "priority": "high",
            "user": 1,
            "assigned_to": null
        },
        // ... more tickets
    ]
}
```

### Create Ticket
```
POST /api/tickets/
```

Request body:
```json
{
    "title": "Network Issue",
    "description": "Cannot connect to server",
    "priority": "high",
}
```

### Get Ticket Details
```
GET /api/tickets/{id}/
```

Response:
```json
{
    "id": 1,
    "title": "Network Issue",
    "description": "Cannot connect to server",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:30:00Z",
    "status": "open",
    "priority": "high",
    "user": 1,
    "assigned_to": null
}
```

### Update Ticket
```
PUT /api/tickets/{id}/
```

Request body:
```json
{
    "title": "Network Issue - Updated",
    "description": "Cannot connect to server - Updated",
    "priority": "medium",
    "status": "in_progress",
    "assigned_to": null
}
```

### Delete Ticket
```
DELETE /api/tickets/{id}/
```

## Error Responses

### Authentication Error
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### Permission Error
```json
{
    "detail": "You do not have permission to perform this action."
}
```

### Validation Error
```json
{
    "title": ["This field is required."]
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- Authenticated users: 100 requests per minute
- Anonymous users: 20 requests per minute

When rate limit is exceeded:
```json
{
    "detail": "Request was throttled. Expected available in 30 seconds."
}
```