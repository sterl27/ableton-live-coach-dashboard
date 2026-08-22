"""Minimal Supabase Postgres connectivity check."""

import os

import psycopg2
from dotenv import load_dotenv


load_dotenv()


def connect_database():
    """Open a TLS-protected connection using DATABASE_URL."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not configured")
    if "YOUR_PERCENT_ENCODED_PASSWORD" in database_url:
        raise RuntimeError("Replace the DATABASE_URL password placeholder in .env")

    return psycopg2.connect(database_url, connect_timeout=10)


def main() -> None:
    try:
        with connect_database() as connection:
            with connection.cursor() as cursor:
                cursor.execute("select current_database(), current_user")
                database, user = cursor.fetchone()
                print(f"Connected to database {database!r} as {user!r}.")
    except RuntimeError as error:
        raise SystemExit(str(error)) from None


if __name__ == "__main__":
    main()
