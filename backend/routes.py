from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import models
import schemas
from database import get_db
from auth import get_current_active_user
from celery_app import schedule_task_reminder

router = APIRouter()

# Task routes
@router.post("/tasks/", response_model=schemas.Task)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_task = models.Task(**task.dict(), user_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    # Schedule reminder
    schedule_task_reminder(db_task.id, current_user.email, task.start_time)
    
    return db_task

@router.get("/tasks/", response_model=List[schemas.Task])
def read_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    tasks = db.query(models.Task).filter(
        models.Task.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return tasks

@router.get("/tasks/today", response_model=List[schemas.Task])
def read_today_tasks(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    today = datetime.utcnow().date()
    tasks = db.query(models.Task).filter(
        models.Task.user_id == current_user.id,
        models.Task.due_date >= today,
        models.Task.due_date < today + timedelta(days=1)
    ).all()
    return tasks

@router.put("/tasks/{task_id}/complete")
def complete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.is_completed = True
    current_user.points += task.points
    db.commit()
    return {"message": "Task completed successfully"}

# Goal routes
@router.post("/goals/", response_model=schemas.Goal)
def create_goal(
    goal: schemas.GoalCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_goal = models.Goal(**goal.dict(), user_id=current_user.id)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.get("/goals/", response_model=List[schemas.Goal])
def read_goals(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    goals = db.query(models.Goal).filter(
        models.Goal.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return goals

# Journal routes
@router.post("/journals/", response_model=schemas.Journal)
def create_journal(
    journal: schemas.JournalCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_journal = models.Journal(**journal.dict(), user_id=current_user.id)
    db.add(db_journal)
    db.commit()
    db.refresh(db_journal)
    return db_journal

@router.get("/journals/", response_model=List[schemas.Journal])
def read_journals(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    journals = db.query(models.Journal).filter(
        models.Journal.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return journals

# Dashboard routes
@router.get("/dashboard/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    today = datetime.utcnow().date()
    week_start = today - timedelta(days=today.weekday())
    month_start = today.replace(day=1)
    
    # Weekly stats
    weekly_tasks = db.query(models.Task).filter(
        models.Task.user_id == current_user.id,
        models.Task.due_date >= week_start,
        models.Task.due_date < week_start + timedelta(days=7)
    ).all()
    
    # Monthly stats
    monthly_tasks = db.query(models.Task).filter(
        models.Task.user_id == current_user.id,
        models.Task.due_date >= month_start,
        models.Task.due_date < (month_start + timedelta(days=32)).replace(day=1)
    ).all()
    
    return {
        "total_points": current_user.points,
        "weekly_completed": sum(1 for task in weekly_tasks if task.is_completed),
        "weekly_total": len(weekly_tasks),
        "monthly_completed": sum(1 for task in monthly_tasks if task.is_completed),
        "monthly_total": len(monthly_tasks)
    } 