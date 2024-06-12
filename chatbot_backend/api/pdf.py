from fastapi.responses import JSONResponse
from fastapi import FastAPI, UploadFile, File, Form, APIRouter, status,Depends
from utils.file_handler import handle_file_upload
from utils.query_handler import handle_query
from db.db_setup import get_db
from api import deps
from db.models.user import User
from sqlalchemy.orm import Session

router = APIRouter()

@router.post('/upload')
async def upload_file(file: UploadFile = File(...) ,     
                current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)):
    response = await handle_file_upload(file)
    return JSONResponse(status_code=response.get("status_code", 200), content=response)

@router.post("/answer")
async def query_document(question: str = Form(...), current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)):
    response = await handle_query(question)
    return JSONResponse(content=response)