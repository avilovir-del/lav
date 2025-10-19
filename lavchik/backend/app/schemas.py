from pydantic import BaseModel
from typing import Optional

class SubmitIn(BaseModel):
    telegram_id: int
    task_id: int
    note: Optional[str] = None
    init_data: Optional[str] = None  # optional signed initData from Telegram

class TaskOut(BaseModel):
    id: int
    title: str
    reward: int
    active: bool
    class Config:
        orm_mode = True

class SubmissionOut(BaseModel):
    id: int
    user_id: int
    task_id: int
    status: str
    note: Optional[str]
    created_at: Optional[str]
    class Config:
        orm_mode = True