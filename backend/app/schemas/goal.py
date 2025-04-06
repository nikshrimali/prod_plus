from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum

class GoalType(str, Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"

class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    goal_type: GoalType
    target_date: datetime

class GoalCreate(GoalBase):
    pass

class GoalUpdate(GoalBase):
    title: Optional[str] = None
    goal_type: Optional[GoalType] = None
    target_date: Optional[datetime] = None

class Goal(GoalBase):
    id: int
    created_at: datetime
    updated_at: datetime
    user_id: int

    class Config:
        orm_mode = True

class GoalResponse(GoalBase):
    id: int
    created_at: datetime
    updated_at: datetime
    user_id: int

    class Config:
        orm_mode = True 