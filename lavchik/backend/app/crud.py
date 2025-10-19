from sqlalchemy.orm import Session
from app import models

def get_or_create_user(db: Session, telegram_id: int, username: str = None):
    u = db.query(models.User).filter(models.User.telegram_id == telegram_id).first()
    if not u:
        u = models.User(telegram_id=telegram_id, username=username)
        db.add(u); db.commit(); db.refresh(u)
    return u

def create_submission(db: Session, telegram_id: int, task_id: int, note: str = None, username: str = None):
    user = get_or_create_user(db, telegram_id, username)
    sub = models.Submission(user_id=user.id, task_id=task_id, note=note, status="pending")
    db.add(sub); db.commit(); db.refresh(sub)
    return sub

def list_pending(db: Session):
    return db.query(models.Submission).filter(models.Submission.status == "pending").all()

def approve_submission(db: Session, submission_id: int):
    sub = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not sub or sub.status != "pending":
        return None
    task = db.query(models.Task).filter(models.Task.id == sub.task_id).first()
    user = db.query(models.User).filter(models.User.id == sub.user_id).first()
    if task and user:
        user.balance += int(task.reward or 0)
    sub.status = "approved"
    db.add(sub); db.add(user); db.commit(); db.refresh(sub); db.refresh(user)
    return sub

def reject_submission(db: Session, submission_id: int, reason: str = None):
    sub = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not sub or sub.status != "pending": return None
    sub.status = "rejected"
    if reason:
        sub.note = (sub.note or "") + f"\n---\nAdmin reason: {reason}"
    db.add(sub); db.commit(); db.refresh(sub)
    return sub

def list_tasks(db: Session):
    return db.query(models.Task).filter(models.Task.active == True).all()

def create_task(db: Session, title: str, reward: int):
    t = models.Task(title=title, reward=reward, active=True)
    db.add(t); db.commit(); db.refresh(t)
    return t