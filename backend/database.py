import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

def create_tables():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS user_profiles (
            id SERIAL PRIMARY KEY,
            clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
            goal VARCHAR(100),
            age INTEGER,
            height_cm INTEGER,
            weight_kg FLOAT,
            activity_level VARCHAR(100),
            diet_type VARCHAR(100),
            medical_conditions TEXT[],
            lifestyle_mode VARCHAR(100),
            fasting_types TEXT[],
            workout_location VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    cur.close()
    conn.close()
    print("Tables created successfully!")

if __name__ == "__main__":
    create_tables()