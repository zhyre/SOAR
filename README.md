# SOAR: Student Organization Activity Registry

SOAR is a comprehensive web-based platform designed to streamline the management of student organizations, their members, events, and activities. Built using Django and Django REST Framework, SOAR provides secure authentication, robust organization management, event scheduling, and collaborative tools for students and administrators.

---

## Table of Contents
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [Event Management](#event-management)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Security Notice](#security-notice)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

---

## Features
- **User Registration & Authentication:** Secure sign-up, login, and logout using Supabase and Django's built-in authentication.
- **Organization Management:** Create, edit, and manage organization profiles, including media uploads and adviser assignment.
- **Member Management:** Invite, approve, and manage organization members with roles (member, officer, leader).
- **Approval Workflows:** Organization membership requires approval by officers or advisers.
- **Event Management:** Officers can create, edit, and delete events for their organization. Members can view upcoming events and see event details.
- **RESTful API:** Exposes endpoints for integration with other systems or mobile apps.
- **Admin Dashboard:** Full control over users, organizations, and system settings.
- **Media Management:** Upload and validate profile images for organizations.
- **Activity Logging:** Track member activities and organization events (future feature).
- **Responsive UI:** Modern, mobile-friendly interface for all users.

---

## System Architecture
- **Backend:** Django 5.2.6, Django REST Framework
- **Frontend:** Django Templates (customizable for React/Vue integration)
- **Database:** SQLite (default for development), PostgreSQL (recommended for production via Supabase)
- **Authentication:** Supabase for external auth, Django for internal auth
- **File Storage:** Local media folder for uploads

---

## Technologies Used
- Python 3.13+
- Django 5.2.6
- Django REST Framework
- Supabase (authentication)
- SQLite / PostgreSQL
- HTML, CSS, JavaScript (for UI)

---

## Installation
### Prerequisites
- Python 3.13 or higher
- pip (Python package manager)
- (Optional) PostgreSQL database
- Git

### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/zhyre/SOAR.git
   cd SOAR
   ```
2. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
3. **Set up environment variables:**
   Create a `.env` file in the project root:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   DATABASE_URL=your_database_url (optional)
   ```
4. **Apply migrations:**
   ```sh
   python manage.py migrate
   ```
5. **Create a superuser (admin):**
   ```sh
   python manage.py createsuperuser
   ```
6. **Start the development server:**
   ```sh
   python manage.py runserver
   ```

---

## Configuration
- **settings.py:** Configure installed apps, middleware, database, static/media paths, and authentication.
- **requirements.txt:** Lists all Python dependencies.
- **.env:** Store sensitive credentials and configuration values.

---

## Database Setup
- By default, SOAR uses SQLite for local development.
- For production, set `DATABASE_URL` in `.env` to use PostgreSQL (recommended with Supabase).
- Run migrations after changing database settings.

---

## Running the Application
- Access the app at [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- Log in as a user or admin to manage organizations, members, and events.
- Use the admin dashboard at `/admin/` for advanced management.

---

## Usage Guide
### User Actions
- **Register:** Create a new account using your email.
- **Login:** Access your dashboard and organizations.
- **Join Organization:** Request membership in available organizations.
- **Create Organization:** Found a new organization and invite members.
- **Manage Profile:** Update your personal information and view your organizations.
- **View Events:** See upcoming events for organizations you belong to, view event details, and RSVP (if enabled).

### Admin Actions
- **Approve Members:** Review and approve membership requests.
- **Edit Organizations:** Update organization details and assign advisers.
- **Manage Users:** Add, edit, or remove users from the system.
- **Manage Events:** View all events across organizations, moderate or delete inappropriate events.

---

## Event Management
SOAR includes a dedicated event management module for student organizations:
- **Event Creation:** Officers can add new events for their organization, specifying title, description, date, time, location, and any relevant attachments.
- **Event Editing & Deletion:** Officers can update or remove events as needed.
- **Event Visibility:** All approved members of the organization can view the list of upcoming and past events, including full event details.
- **Event Details:** Each event page displays all relevant information, including organizer, schedule, location, and description.
- **Notifications:** Members may receive notifications about new or updated events (future feature).
- **Access Control:** Only officers and leaders can create or modify events; members have read-only access.

---

## Development
- **Apps:**
  - `accounts`: Handles user registration, login, profile, and member management.
  - `organization`: Manages organizations, profiles, member roles, and events.
- **Static Files:** Located in `static/` folders within each app.
- **Templates:** HTML templates for UI in `templates/` folders.
- **Media:** Uploaded files stored in `media/`.
- **Events:** Event models, views, and templates are part of the `organization` app.

---

## Testing
- Run unit tests with:
  ```sh
  python manage.py test
  ```
- Add your own tests in the `tests.py` files of each app.
- Test event creation, editing, deletion, and viewing as different user roles.

---

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes
4. Push to your fork and open a pull request
5. Describe your changes and reference any related issues

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Security Notice
**Never include sensitive information (passwords, secret keys, API keys) in your README or code repository.**
- Use environment variables for all credentials.
- Review your code before publishing or sharing.

---

## Contact
For questions, issues, or feature requests, please open an issue on GitHub or contact us on Microsoft Teams:
Samantha Zhyre C. Coritico
Nico John Colo
Princess Althea Simbran Colminas

---

## Acknowledgements
- Django and Django REST Framework teams
- Supabase for authentication services
- All contributors and testers

---
