# Architecture
# Architecture Overview

RizeOS is a full-stack web application built using a simple, modular architecture.

## Frontend
- React.js
- Component-based UI
- Context-based authentication state
- API layer for backend communication

## Backend
- Go (Golang)
- REST APIs using Gorilla Mux
- MongoDB for data storage
- Middleware-based request handling

## Authentication
- Simplified authentication is used for demo purposes.
- User identity is maintained via backend middleware.
- JWT-based authentication can be added without changing core logic.

## Database
- MongoDB
- Collections: users, jobs, profiles

This architecture was chosen to keep the system easy to understand, scalable, and suitable for rapid development.
