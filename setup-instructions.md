# Optimrental Setup Instructions

Welcome to your new Vehicle Booking System! Follow these steps to get started:

## 1. Environment Variables
Open the `.env` file in the root directory and fill in your credentials:
- **Supabase**: URL, Anon Key, and Service Role Key.
- **SMTP**: Gmail/SMTP details for email notifications.
- **JWT_SECRET**: Any random string for JWT (though Supabase handles most of it).

## 2. Supabase Database Schema
1. Go to your [Supabase Dashboard](https://supabase.com).
2. Open the **SQL Editor**.
3. Create a new query and paste the contents of `supabase/schema.sql`.
4. Run the query to create `vehicles` and `bookings` tables + RLS policies.

## 3. Seed Admin Account
To access the Admin Panel, you need an admin account.
Run the following command in your terminal:
```bash
node scripts/seed-admin.js
```

## 4. Run Locally
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` to see the site.
Visit `http://localhost:3000/de/admin` to access the admin panel.

## Features
- **Landing Page**: Modern, Swiss-themed, mobile-responsive.
- **Booking**: Users can select vehicles, pick dates/hours, and book.
- **Admin**: Manage vehicles (CRUD), view/confirm/cancel bookings.
- **i18n**: Full support for German (Default) and English.
- **Emails**: Automatic confirmation emails via Nodemailer.
