from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import GoalType

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    points: int = 0
    due_date: datetime
    start_time: datetime
    end_time: datetime
    goal_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    is_completed: bool
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True

class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    goal_type: GoalType
    target_date: datetime

class GoalCreate(GoalBase):
    pass

class Goal(GoalBase):
    id: int
    created_at: datetime
    user_id: int
    tasks: List[Task] = []

    class Config:
        from_attributes = True

class JournalBase(BaseModel):
    content: str
    date: datetime

class JournalCreate(JournalBase):
    pass

class Journal(JournalBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    points: int
    tasks: List[Task] = []
    goals: List[Goal] = []
    journals: List[Journal] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 