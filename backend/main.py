from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
from database import get_connection
from datetime import date
import os
import json
import logging

# from google import genai
import google.generativeai as genai
from groq import Groq

load_dotenv()

GEMINI_MODEL = "gemini-2.0-flash"
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_client = genai.GenerativeModel(GEMINI_MODEL)
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
GROQ_MODEL = "llama-3.3-70b-versatile"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"
    "https://fit-india-nine.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ─────────────────────────────────────────────────────────────────

class UserProfile(BaseModel):
    clerk_user_id: str
    goal: Optional[str] = None
    age: Optional[int] = None
    height_cm: Optional[int] = None
    weight_kg: Optional[float] = None
    activity_level: Optional[str] = None
    diet_type: Optional[str] = None
    medical_conditions: Optional[List[str]] = []
    lifestyle_mode: Optional[str] = None
    fasting_types: Optional[List[str]] = []
    workout_location: Optional[str] = None
    active_fastings: Optional[Dict[str, Any]] = None

class ProfileUpdate(BaseModel):
    goal: Optional[str] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[int] = None
    diet_type: Optional[str] = None
    lifestyle_mode: Optional[str] = None
    workout_location: Optional[str] = None
    display_name: Optional[str] = None

class WorkoutLog(BaseModel):
    clerk_user_id: str
    workout_date: Optional[str] = None
    day_focus: Optional[str] = None
    duration_minutes: Optional[int] = None
    completed: bool = True

class WeightLog(BaseModel):
    clerk_user_id: str
    weight_kg: float
    log_date: Optional[str] = None

class FastingSettings(BaseModel):
    ramzan: bool = False
    navratri: bool = False
    ekadashi: bool = False
    jain_mode: bool = False
    intermittent_fasting: bool = False
    if_window: str = "16:8"
    custom_fast: bool = False
    custom_start: str = "08:00"
    custom_end: str = "16:00"

class CalorieLog(BaseModel):
    clerk_user_id: str
    food_name: str
    calories: int
    protein_g: float = 0
    meal_type: str = "snack"

class MoodLog(BaseModel):
    clerk_user_id: str
    mood: str
    note: Optional[str] = None


# ── Prompt Helpers ──────────────────────────────────────────────────────────

def get_mental_health_context() -> str:
    return """
MENTAL HEALTH PHILOSOPHY — mandatory, must be reflected in tone and content:
- NEVER shame, guilt-trip, or use negative language about food, weight, or missed workouts
- Rest days are as important as workout days — honour them
- Cheat days are CELEBRATED — food is joy and fuel, not a number to minimise
- Frame everything as progress over perfection
- Use warm, encouraging language — never "you must", "you failed", "bad food"
- If medical conditions present (PCOS, diabetes, etc.) — be extra gentle and empowering
- Calorie targets are guidance, not strict rules
"""


def get_fasting_meal_structure(profile: UserProfile) -> tuple[str, bool]:
    """Returns (fasting_instructions, is_ramzan).
    Priority rule: if active_fastings is populated (user visited fasting page),
    use ONLY that. Otherwise fall back to onboarding fasting_types.
    """
    active = profile.active_fastings  # from live fasting settings page
    fasting = profile.fasting_types or []  # from onboarding

    if active:
        # User has explicitly set toggles — these are the source of truth
        is_ramzan    = active.get("ramzan", False)
        is_navratri  = active.get("navratri", False)
        is_ekadashi  = active.get("ekadashi", False)
        is_jain      = active.get("jain_mode", False)
        is_if        = active.get("intermittent_fasting", False)
        if_window    = active.get("if_window", "16:8")
        is_custom    = active.get("custom_fast", False)
        custom_start = active.get("custom_start", "08:00")
        custom_end   = active.get("custom_end", "16:00")
    else:
        # Fallback to onboarding selections only
        is_ramzan    = "Ramzan" in fasting
        is_navratri  = "Navratri" in fasting
        is_ekadashi  = "Ekadashi" in fasting
        is_jain      = "Jain" in fasting
        is_if        = "Intermittent Fasting" in fasting
        if_window    = "16:8"
        is_custom    = False
        custom_start = "08:00"
        custom_end   = "16:00"

    if is_ramzan:
        return ("""
FASTING MODE: RAMZAN (Roza) — CRITICAL RULES:
- Do NOT suggest breakfast or lunch. The user is fasting from Fajr to Maghrib.
- Meal structure MUST be: SEHRI → IFTAR → POST-IFTAR DINNER
- SEHRI (~4:30 AM before Fajr): High protein, slow-digesting carbs, hydration.
  Include: dates, eggs or paneer, paratha/oats, yogurt. Must sustain a 14-16hr fast.
- IFTAR (~6:30-7:00 PM at Maghrib): Break fast gently. Start with 3 dates + water (sunnah).
  Then light shorba/soup or fruits. Wait 20-30 min before main meal.
- POST-IFTAR (1.5-2 hrs after Iftar ~8:00-8:30 PM): Main nourishing meal.
  Dal, roti/rice, sabzi, protein source.
- WORKOUT: Recommend after Taraweeh (post 9 PM) or 30 min before Sehri. NEVER during fast.
- HYDRATION: All 2.5-3L water must be consumed between Iftar and Sehri only.
- Total calories split: ~35% Sehri, ~20% Iftar, ~35% Post-Iftar dinner, ~10% snacks between Iftar and Sehri.
- Use JSON keys: sehri, iftar, post_iftar_snack (NOT breakfast/lunch/dinner)
""", True)

    if is_navratri:
        return ("""
FASTING MODE: NAVRATRI
ALLOWED ONLY: sabudana, kuttu atta, singhare atta, rajgira, sendha namak, potatoes,
sweet potatoes, all fruits, dahi, paneer, milk, ghee, nuts (almonds/cashews/peanuts), lauki.
STRICTLY AVOID: wheat, rice, regular salt, onion, garlic, lentils, legumes, non-veg.
Meal structure: light fruit/dahi morning, sabudana khichdi or kuttu roti lunch, aloo/paneer dinner.
Use standard JSON keys: breakfast, lunch, dinner, snacks.
""", False)

    if is_ekadashi:
        return ("""
FASTING MODE: EKADASHI
STRICTLY AVOID: rice, wheat, all grains, legumes, non-veg.
ALLOWED: fruits, milk, dahi, paneer, sabudana, rajgira, singhara atta, potatoes, nuts, sendha namak.
Light meals: fruit breakfast, sabudana/rajgira lunch, dahi/fruit dinner.
Use standard JSON keys: breakfast, lunch, dinner, snacks.
""", False)

    if is_jain:
        return ("""
FASTING MODE: JAIN (permanent dietary filter — always applies)
STRICTLY AVOID: ALL root vegetables (potato, onion, garlic, carrot, radish, beetroot, turnip), non-veg, eggs.
All meals MUST be completed before sunset (~6:30-7:00 PM). No food after sunset.
Preferred: above-ground vegetables, dal, rice, roti, paneer, dahi, fruits, nuts.
Use standard JSON keys: breakfast, lunch, dinner, snacks.
""", False)

    if is_if:
        windows = {"16:8": ("12:00 PM", "8:00 PM"), "18:6": ("1:00 PM", "7:00 PM"), "OMAD": ("2:00 PM", "3:00 PM")}
        start, end = windows.get(if_window, ("12:00 PM", "8:00 PM"))
        return (f"""
FASTING MODE: INTERMITTENT FASTING ({if_window})
Eating window: {start} to {end} ONLY. No food outside this window.
No breakfast before {start}.
Structure: Break-fast meal at {start}, main meal mid-window, light snack before {end}.
Mention that water/black coffee/plain tea is fine outside the window.
All calories must fit within this eating window.
Use standard JSON keys: breakfast, lunch, dinner, snacks.
""", False)

    if is_custom:
        return (f"""
FASTING MODE: CUSTOM FAST
User fasts from {custom_start} to {custom_end}. No food during this window.
Structure meals only outside {custom_start}–{custom_end}.
Use standard JSON keys: breakfast, lunch, dinner, snacks.
""", False)

    return ("No active fasting. Standard Indian meal structure: Breakfast, Lunch, Dinner, Snacks.", False)


def build_workout_prompt(profile: UserProfile) -> str:
    mental = get_mental_health_context()
    fasting_instr, _ = get_fasting_meal_structure(profile)
    active = profile.active_fastings or {}
    truly_active = [k for k, v in active.items()
                    if v is True and k not in ("if_window", "custom_start", "custom_end")]
    fasting_today = ", ".join(truly_active) if truly_active else "None"

    return f"""You are a certified fitness trainer who genuinely cares about client wellbeing.

User Profile:
- Goal: {profile.goal}
- Age: {profile.age}, Weight: {profile.weight_kg}kg
- Activity Level: {profile.activity_level}
- Workout Location: {profile.workout_location}
- Medical Conditions: {', '.join(profile.medical_conditions) if profile.medical_conditions else 'None'}
- Lifestyle: {profile.lifestyle_mode}
- Fasting ACTIVE TODAY: {fasting_today}

CRITICAL: Only mention fasting in the trainer_note if fasting_today is NOT "None".
If fasting_today is "None", write the trainer_note purely based on goal and medical conditions — no fasting mentions at all.

{mental}

CONDITION-SPECIFIC RULES:
- PCOS/PCOD: strength training preferred, low-impact, include yoga, avoid HIIT
- Diabetes: moderate intensity, daily walks, consistency over intensity
- Night Shift: schedule workout for evening/night, their active hours
- Hostel mode: bodyweight only, zero equipment needed
- Skinny Fat: recomposition focus — strength training + slight deficit, NOT cardio obsession
- Ramzan fasting: suggest post-Taraweeh (9 PM) or pre-Sehri workout ONLY, never during fast

Return ONLY valid JSON, no markdown fences:
{{
  "day_focus": "Push Day / Pull Day / Legs / Full Body / Cardio / Rest Day",
  "duration_minutes": 45,
  "difficulty": "Beginner / Intermediate / Advanced",
  "warmup": [
    {{"exercise": "name", "duration": "2 min", "notes": "encouraging tip"}}
  ],
  "main_workout": [
    {{"exercise": "name", "sets": 3, "reps": "10-12", "rest": "60 sec", "notes": "form tip"}}
  ],
  "cooldown": [
    {{"exercise": "name", "duration": "1 min", "notes": "tip"}}
  ],
  "trainer_note": "Warm, personalised, encouraging note. Celebrate effort. Never shame."
}}"""


def build_meal_prompt(profile: UserProfile) -> str:
    mental = get_mental_health_context()
    fasting_instr, is_ramzan = get_fasting_meal_structure(profile)

    if is_ramzan:
        json_example = """{
  "total_calories": 1800,
  "total_protein_g": 75,
  "diet_type": "vegetarian",
  "fasting_mode": "ramzan",
  "sehri": {
    "name": "Power Sehri plate",
    "time": "4:30 AM",
    "ingredients": ["3 dates", "2 eggs or 100g paneer", "1 paratha or oats", "1 cup dahi", "2 glasses water"],
    "calories": 620,
    "protein_g": 32,
    "prep_time": "15 min",
    "notes": "Eat slow-digesting foods. Drink at least 2 glasses water now."
  },
  "iftar": {
    "name": "Iftar — break fast gently",
    "time": "6:45 PM",
    "ingredients": ["3 dates", "1 glass water", "fruit chaat", "shorba or soup"],
    "calories": 280,
    "protein_g": 6,
    "prep_time": "5 min",
    "notes": "Start with dates and water as sunnah. Wait 20-30 min before main meal."
  },
  "post_iftar_snack": {
    "name": "Main dinner (1.5 hrs after Iftar)",
    "time": "8:15 PM",
    "ingredients": ["2 roti", "dal or paneer sabzi", "salad", "1 cup dahi"],
    "calories": 680,
    "protein_g": 32,
    "prep_time": "20 min",
    "notes": "This is your main meal. Eat mindfully, avoid overeating."
  },
  "hydration_tip": "All 2.5-3L water must be consumed between Iftar and Sehri. Set alarms every 45 min.",
  "workout_tip": "Best workout window: after Taraweeh prayers (9-10 PM) or 30 min before Sehri.",
  "nutritionist_note": "Ramzan Mubarak! This plan keeps you energised through the fast while honouring your roza. Rest is also ibadah."
}"""
    else:
        json_example = """{
  "total_calories": 1800,
  "total_protein_g": 75,
  "diet_type": "vegetarian",
  "fasting_mode": "none",
  "breakfast": {
    "name": "Poha with peanuts",
    "ingredients": ["1 cup poha", "2 tbsp peanuts", "1 small onion", "curry leaves", "mustard seeds"],
    "calories": 350,
    "protein_g": 10,
    "prep_time": "15 min",
    "notes": "Add lemon juice for vitamin C"
  },
  "lunch": {
    "name": "Dal chawal with sabzi",
    "ingredients": ["1 cup toor dal", "1 cup rice", "1 bowl seasonal vegetable", "1 tsp ghee"],
    "calories": 550,
    "protein_g": 22,
    "prep_time": "30 min",
    "notes": null
  },
  "dinner": {
    "name": "Roti with paneer curry",
    "ingredients": ["2 whole wheat roti", "100g paneer", "2 medium tomatoes", "1 onion", "spices"],
    "calories": 500,
    "protein_g": 28,
    "prep_time": "25 min",
    "notes": "Eat 2 hours before sleep"
  },
  "snacks": [
    {
      "name": "Mixed nuts and banana",
      "ingredients": ["10-12 almonds", "1 medium banana"],
      "calories": 200,
      "protein_g": 6,
      "prep_time": "0 min",
      "notes": "Great pre-workout snack"
    }
  ],
  "hydration_tip": "Drink 3L water today. Start with warm water and lemon.",
  "nutritionist_note": "Warm, encouraging note. Food is joy, not guilt. Celebrate good choices."
}"""

    return f"""You are a certified Indian nutritionist who believes food is joy, not guilt.

User Profile:
- Goal: {profile.goal}
- Diet: {profile.diet_type}
- Medical: {', '.join(profile.medical_conditions) if profile.medical_conditions else 'none'}
- Lifestyle: {profile.lifestyle_mode}
- Weight: {profile.weight_kg}kg, Height: {profile.height_cm}cm, Age: {profile.age}

FASTING INSTRUCTIONS:
{fasting_instr}

{mental}

ADDITIONAL RULES:
- Use ONLY Indian foods (dal, sabzi, roti, rice, idli, dosa, poha, paneer, curd, etc.)
- Vegetarian: no meat or eggs. Vegan: no dairy either.
- PCOS: low GI foods, anti-inflammatory, no processed sugar
- Diabetes: low GI, small portions, no white rice in large quantity
- Hostel mode: mess food + cheap protein supplements (boiled eggs ₹6, peanuts ₹20/100g, soya chunks)
- Night Shift: flip timing — "breakfast" at 6 PM, "dinner" at 6 AM
- Budget: ₹150-200/day
- Skinny Fat: high protein, moderate deficit, no starvation
- Vegetarian muscle: complete proteins — dal+rice combo, paneer, dahi, soya
- Each ingredient must include quantity (e.g. "1 cup toor dal" not just "dal")

Return ONLY valid JSON matching this exact structure (no markdown, no extra text):
{json_example}"""


def clean_json_response(raw: str) -> dict:
    clean = raw.strip()
    if clean.startswith("```"):
        parts = clean.split("```")
        clean = parts[1]
        if clean.startswith("json"):
            clean = clean[4:]
    return json.loads(clean.strip())


def call_gemini(prompt: str) -> dict:
    # response = gemini_client.models.generate_content(model=GEMINI_MODEL, contents=prompt)
    
    response = gemini_client.generate_content(prompt)
    return clean_json_response(response.text)


def call_groq(prompt: str) -> dict:
    response = groq_client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1800,
    )
    return clean_json_response(response.choices[0].message.content)


def call_with_fallback(prompt: str) -> tuple[dict, str]:
    try:
        return call_gemini(prompt), "gemini-2.0-flash"
    except Exception as gemini_err:
        logging.warning(f"Gemini failed ({gemini_err}), falling back to Groq…")
        try:
            return call_groq(prompt), "groq-llama3"
        except Exception as groq_err:
            raise RuntimeError(f"Both models failed. Gemini: {gemini_err} | Groq: {groq_err}")


def enrich_with_fasting(profile: UserProfile):
    """Loads live fasting settings from DB and attaches to profile."""
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM fasting_settings WHERE clerk_user_id = %s", (profile.clerk_user_id,))
        row = cur.fetchone()
        cur.close(); conn.close()
        if row:
            profile.active_fastings = {
                "ramzan": row[1], "navratri": row[2], "ekadashi": row[3],
                "jain_mode": row[4], "intermittent_fasting": row[5],
                "if_window": row[6], "custom_fast": row[7],
                "custom_start": row[8], "custom_end": row[9],
            }
    except Exception:
        pass


# ── Routes ─────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "FitIndia API running"}


@app.post("/profile")
def save_profile(profile: UserProfile):
    try:
        conn = get_connection()
        cur = conn.cursor()

        # Save user profile
        cur.execute("""
            INSERT INTO user_profiles (
                clerk_user_id, goal, age, height_cm, weight_kg,
                activity_level, diet_type, medical_conditions,
                lifestyle_mode, fasting_types, workout_location
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT (clerk_user_id) DO UPDATE SET
                display_name=EXCLUDED.display_name,
                goal=EXCLUDED.goal, age=EXCLUDED.age, height_cm=EXCLUDED.height_cm,
                weight_kg=EXCLUDED.weight_kg, activity_level=EXCLUDED.activity_level,
                diet_type=EXCLUDED.diet_type, medical_conditions=EXCLUDED.medical_conditions,
                lifestyle_mode=EXCLUDED.lifestyle_mode, fasting_types=EXCLUDED.fasting_types,
                workout_location=EXCLUDED.workout_location, updated_at=CURRENT_TIMESTAMP
        """, (profile.clerk_user_id, profile.display_name, profile.goal, profile.age, profile.height_cm,
              profile.weight_kg, profile.activity_level, profile.diet_type,
              profile.medical_conditions, profile.lifestyle_mode,
              profile.fasting_types, profile.workout_location))

        # Seed fasting_settings from onboarding choices — only if no row exists yet
        # ON CONFLICT DO NOTHING preserves any toggles the user has already set manually
        fasting = profile.fasting_types or []
        cur.execute("""
            INSERT INTO fasting_settings (
                clerk_user_id, ramzan, navratri, ekadashi,
                jain_mode, intermittent_fasting, if_window,
                custom_fast, custom_start, custom_end
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT (clerk_user_id) DO NOTHING
        """, (
            profile.clerk_user_id,
            "Ramzan" in fasting,
            "Navratri" in fasting,
            "Ekadashi" in fasting,
            "Jain" in fasting,
            "Intermittent Fasting" in fasting,
            "16:8",
            False,
            "08:00",
            "16:00",
        ))

        conn.commit(); cur.close(); conn.close()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/profile/{clerk_user_id}")
def get_profile(clerk_user_id: str):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT goal, age, height_cm, weight_kg, activity_level, diet_type,
                   medical_conditions, lifestyle_mode, fasting_types, workout_location, display_name
            FROM user_profiles WHERE clerk_user_id = %s
        """, (clerk_user_id,))
        row = cur.fetchone()
        cur.close(); conn.close()
        if not row:
            return {"exists": False}
        return {
            "exists": True, "goal": row[0], "age": row[1], "height_cm": row[2],
            "weight_kg": row[3], "activity_level": row[4], "diet_type": row[5],
            "medical_conditions": row[6], "lifestyle_mode": row[7],
            "fasting_types": row[8], "workout_location": row[9],
            "display_name": row[10],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/profile/{clerk_user_id}")
def update_profile(clerk_user_id: str, update: ProfileUpdate):
    """Partial update — only updates fields that are provided."""
    try:
        conn = get_connection()
        cur = conn.cursor()
        fields = {k: v for k, v in update.dict().items() if v is not None}
        if not fields:
            return {"status": "nothing to update"}
        set_clause = ", ".join(f"{k} = %s" for k in fields)
        values = list(fields.values()) + [clerk_user_id]
        cur.execute(
            f"UPDATE user_profiles SET {set_clause}, updated_at=CURRENT_TIMESTAMP WHERE clerk_user_id=%s",
            values
        )
        conn.commit(); cur.close(); conn.close()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/profile-full/{clerk_user_id}")
def get_profile_full(clerk_user_id: str):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT goal, age, height_cm, weight_kg, activity_level, diet_type,
                   medical_conditions, lifestyle_mode, fasting_types, workout_location, display_name
            FROM user_profiles WHERE clerk_user_id = %s
        """, (clerk_user_id,))
        row = cur.fetchone()
        if not row:
            cur.close(); conn.close()
            return {"exists": False}

        goal, age, height_cm, weight_kg = row[0], row[1], row[2], row[3]
        activity_level, diet_type = row[4], row[5]
        medical_conditions, lifestyle_mode = row[6], row[7]
        fasting_types, workout_location = row[8], row[9]
        display_name = row[10]

        # BMI
        bmi = None
        bmi_category = None
        if height_cm and weight_kg:
            height_m = height_cm / 100
            bmi = round(weight_kg / (height_m ** 2), 1)
            if bmi < 18.5:   bmi_category = "Underweight"
            elif bmi < 25:   bmi_category = "Healthy"
            elif bmi < 30:   bmi_category = "Overweight"
            else:            bmi_category = "Obese"

        # Fasting settings
        cur.execute("SELECT * FROM fasting_settings WHERE clerk_user_id = %s", (clerk_user_id,))
        frow = cur.fetchone()
        fasting_settings = None
        if frow:
            fasting_settings = {
                "ramzan": frow[1], "navratri": frow[2], "ekadashi": frow[3],
                "jain_mode": frow[4], "intermittent_fasting": frow[5],
                "if_window": frow[6], "custom_fast": frow[7],
                "custom_start": frow[8], "custom_end": frow[9],
            }

        cur.execute(
            "SELECT COUNT(*) FROM workout_logs WHERE clerk_user_id=%s AND completed=true",
            (clerk_user_id,)
        )
        total_workouts = cur.fetchone()[0]

        cur.execute(
            "SELECT workout_date FROM workout_logs WHERE clerk_user_id=%s AND completed=true ORDER BY workout_date DESC LIMIT 1",
            (clerk_user_id,)
        )
        last_row = cur.fetchone()
        last_workout = str(last_row[0]) if last_row else None

        cur.execute(
            "SELECT log_date, weight_kg FROM weight_logs WHERE clerk_user_id=%s ORDER BY log_date ASC",
            (clerk_user_id,)
        )
        weight_history = [{"date": str(r[0]), "weight_kg": float(r[1])} for r in cur.fetchall()]

        cur.close(); conn.close()

        return {
            "exists": True,
            "goal": goal, "age": age, "height_cm": height_cm, "weight_kg": weight_kg,
            "activity_level": activity_level, "diet_type": diet_type,
            "medical_conditions": medical_conditions or [],
            "lifestyle_mode": lifestyle_mode,
            "fasting_types": fasting_types or [],
            "workout_location": workout_location,
            "display_name": display_name or "",
            "bmi": bmi, "bmi_category": bmi_category,
            "fasting_settings": fasting_settings,
            "total_workouts": total_workouts,
            "last_workout": last_workout,
            "weight_history": weight_history,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-workout")
def generate_workout(profile: UserProfile):
    try:
        enrich_with_fasting(profile)
        workout, model_used = call_with_fallback(build_workout_prompt(profile))
        return {"status": "success", "model_used": model_used, "workout": workout}
    except Exception as e:
        logging.error(f"generate-workout error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-diet")
def generate_diet(profile: UserProfile):
    try:
        enrich_with_fasting(profile)
        diet, model_used = call_with_fallback(build_meal_prompt(profile))
        return {"status": "success", "model_used": model_used, "diet": diet}
    except Exception as e:
        logging.error(f"generate-diet error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-meals")
def generate_meals(profile: UserProfile):
    try:
        enrich_with_fasting(profile)
        meal_plan, model_used = call_with_fallback(build_meal_prompt(profile))
        return {"status": "success", "model_used": model_used, "meal_plan": meal_plan}
    except Exception as e:
        logging.error(f"generate-meals error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/progress/log-workout")
def log_workout(log: WorkoutLog):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO workout_logs (clerk_user_id, workout_date, day_focus, duration_minutes, completed)
            VALUES (%s, COALESCE(%s::date, CURRENT_DATE), %s, %s, %s)
            ON CONFLICT (clerk_user_id, workout_date) DO UPDATE SET
                day_focus=EXCLUDED.day_focus, duration_minutes=EXCLUDED.duration_minutes,
                completed=EXCLUDED.completed
        """, (log.clerk_user_id, log.workout_date, log.day_focus, log.duration_minutes, log.completed))
        conn.commit(); cur.close(); conn.close()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/progress/log-weight")
def log_weight(log: WeightLog):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO weight_logs (clerk_user_id, log_date, weight_kg)
            VALUES (%s, COALESCE(%s::date, CURRENT_DATE), %s)
            ON CONFLICT (clerk_user_id, log_date) DO UPDATE SET weight_kg=EXCLUDED.weight_kg
        """, (log.clerk_user_id, log.log_date, log.weight_kg))
        conn.commit(); cur.close(); conn.close()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/progress/{clerk_user_id}")
def get_progress(clerk_user_id: str):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT workout_date, day_focus, duration_minutes, completed FROM workout_logs
            WHERE clerk_user_id=%s AND workout_date >= CURRENT_DATE - INTERVAL '90 days'
            ORDER BY workout_date DESC
        """, (clerk_user_id,))
        workout_logs = [{"date": str(r[0]), "day_focus": r[1], "duration_minutes": r[2], "completed": r[3]} for r in cur.fetchall()]

        cur.execute("SELECT COUNT(*) FROM workout_logs WHERE clerk_user_id=%s AND completed=true", (clerk_user_id,))
        total_workouts = cur.fetchone()[0]

        cur.execute("SELECT workout_date FROM workout_logs WHERE clerk_user_id=%s AND completed=true ORDER BY workout_date DESC", (clerk_user_id,))
        streak_rows = [r[0] for r in cur.fetchall()]
        streak = 0
        if streak_rows:
            from datetime import date, timedelta
            check = date.today()
            for d in streak_rows:
                if d == check or d == check - timedelta(days=1):
                    streak += 1; check = d - timedelta(days=1)
                else:
                    break

        cur.execute("""
            SELECT log_date, weight_kg FROM weight_logs
            WHERE clerk_user_id=%s AND log_date >= CURRENT_DATE - INTERVAL '60 days'
            ORDER BY log_date ASC
        """, (clerk_user_id,))
        weight_logs = [{"date": str(r[0]), "weight_kg": float(r[1])} for r in cur.fetchall()]

        cur.close(); conn.close()
        return {"status": "success", "total_workouts": total_workouts,
                "current_streak": streak, "workout_logs": workout_logs, "weight_logs": weight_logs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/fasting/{clerk_user_id}")
def save_fasting(clerk_user_id: str, settings: FastingSettings):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO fasting_settings (clerk_user_id, ramzan, navratri, ekadashi,
                jain_mode, intermittent_fasting, if_window, custom_fast, custom_start, custom_end)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT (clerk_user_id) DO UPDATE SET
                ramzan=EXCLUDED.ramzan, navratri=EXCLUDED.navratri, ekadashi=EXCLUDED.ekadashi,
                jain_mode=EXCLUDED.jain_mode, intermittent_fasting=EXCLUDED.intermittent_fasting,
                if_window=EXCLUDED.if_window, custom_fast=EXCLUDED.custom_fast,
                custom_start=EXCLUDED.custom_start, custom_end=EXCLUDED.custom_end, updated_at=NOW()
        """, (clerk_user_id, settings.ramzan, settings.navratri, settings.ekadashi,
              settings.jain_mode, settings.intermittent_fasting, settings.if_window,
              settings.custom_fast, settings.custom_start, settings.custom_end))
        conn.commit(); cur.close(); conn.close()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/fasting/{clerk_user_id}")
def get_fasting(clerk_user_id: str):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM fasting_settings WHERE clerk_user_id=%s", (clerk_user_id,))
        row = cur.fetchone()
        cur.close(); conn.close()
        if not row:
            return {"ramzan": False, "navratri": False, "ekadashi": False, "jain_mode": False,
                    "intermittent_fasting": False, "if_window": "16:8", "custom_fast": False,
                    "custom_start": "08:00", "custom_end": "16:00"}
        return {"ramzan": row[1], "navratri": row[2], "ekadashi": row[3], "jain_mode": row[4],
                "intermittent_fasting": row[5], "if_window": row[6], "custom_fast": row[7],
                "custom_start": row[8], "custom_end": row[9]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/calories/log")
def log_calories(log: CalorieLog):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO calorie_logs (clerk_user_id, food_name, calories, protein_g, meal_type)
            VALUES (%s,%s,%s,%s,%s) RETURNING id
        """, (log.clerk_user_id, log.food_name, log.calories, log.protein_g, log.meal_type))
        conn.commit(); cur.close(); conn.close()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/calories/{clerk_user_id}/today")
def get_today_calories(clerk_user_id: str):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, food_name, calories, protein_g, meal_type, logged_at
            FROM calorie_logs WHERE clerk_user_id=%s AND DATE(logged_at)=CURRENT_DATE
            ORDER BY logged_at DESC
        """, (clerk_user_id,))
        rows = cur.fetchall()
        cur.close(); conn.close()
        entries = [{"id": r[0], "food_name": r[1], "calories": r[2], "protein_g": r[3],
                    "meal_type": r[4], "logged_at": r[5].isoformat()} for r in rows]
        return {"entries": entries,
                "total_calories": sum(e["calories"] for e in entries),
                "total_protein": sum(e["protein_g"] for e in entries)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/calories/{entry_id}")
def delete_calorie_entry(entry_id: int):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM calorie_logs WHERE id=%s", (entry_id,))
        conn.commit(); cur.close(); conn.close()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/mood/log")
def log_mood(log: MoodLog):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO mood_logs (clerk_user_id, mood, note, log_date)
            VALUES (%s,%s,%s,CURRENT_DATE)
            ON CONFLICT (clerk_user_id, log_date) DO UPDATE SET mood=EXCLUDED.mood, note=EXCLUDED.note
        """, (log.clerk_user_id, log.mood, log.note))
        conn.commit(); cur.close(); conn.close()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/mood/{clerk_user_id}/recent")
def get_recent_mood(clerk_user_id: str):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT mood, note, log_date FROM mood_logs
            WHERE clerk_user_id=%s ORDER BY log_date DESC LIMIT 14
        """, (clerk_user_id,))
        rows = cur.fetchall()
        cur.close(); conn.close()
        return {"moods": [{"mood": r[0], "note": r[1], "date": str(r[2])} for r in rows]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))