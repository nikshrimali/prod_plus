from celery import Celery
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

celery_app = Celery(
    "productivity_plus",
    broker=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    backend=os.getenv("REDIS_URL", "redis://localhost:6379/0")
)

@celery_app.task
def send_task_reminder(task_id: int, user_email: str):
    # This is a placeholder for the actual notification logic
    # In a real application, you would implement email/SMS/push notifications here
    print(f"Sending reminder for task {task_id} to user {user_email}")

def schedule_task_reminder(task_id: int, user_email: str, start_time: datetime):
    # Schedule reminder 15 minutes before task start time
    reminder_time = start_time - timedelta(minutes=15)
    if reminder_time > datetime.utcnow():
        celery_app.send_task(
            'celery_app.send_task_reminder',
            args=[task_id, user_email],
            eta=reminder_time
        ) 