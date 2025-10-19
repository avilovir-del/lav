from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app import models, schemas, crud, config, utils
from app.models import SessionLocal, init_db
from typing import List, Optional

init_db()
app = FastAPI(title="Lavchik Backend")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def admin_auth(x_api_key: Optional[str] = Header(None)):
    if x_api_key != config.API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

# Public: список активных задач
@app.get("/tasks", response_model=List[schemas.TaskOut])
def get_tasks(db: Session = Depends(get_db)):
    return crud.list_tasks(db)

# Public: пользователь отправляет выполнение задания
@app.post("/submit", response_model=schemas.SubmissionOut)
def submit(sub: schemas.SubmitIn, db: Session = Depends(get_db)):
    # Рекомендуется проверить init_data через utils.check_init_data(sub.init_data)
    # если есть init_data, валидируем (тут ---- placeholder)
    if sub.init_data and not utils.check_init_data(sub.init_data):
        raise HTTPException(status_code=400, detail="Invalid init_data")
    task = db.query(models.Task).filter(models.Task.id == sub.task_id, models.Task.active==True).first()
    if not task:
        raise HTTPException(status_code=400, detail="Task not found or inactive")
    submission = crud.create_submission(db, sub.telegram_id, sub.task_id, note=sub.note)
    return submission

# Admin endpoints (защищены API_KEY в заголовке x-api-key)
@app.get("/admin/submissions", dependencies=[Depends(admin_auth)])
def get_pending(db: Session = Depends(get_db)):
    return crud.list_pending(db)

@app.post("/admin/approve/{submission_id}", dependencies=[Depends(admin_auth)])
def approve(submission_id: int, db: Session = Depends(get_db)):
    sub = crud.approve_submission(db, submission_id)
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found or not pending")
    user = db.query(models.User).filter(models.User.id == sub.user_id).first()
    return {"ok": True, "new_balance": user.balance}

@app.post("/admin/reject/{submission_id}", dependencies=[Depends(admin_auth)])
def reject(submission_id: int, reason: str = None, db: Session = Depends(get_db)):
    sub = crud.reject_submission(db, submission_id, reason)
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found or not pending")
    return {"ok": True}