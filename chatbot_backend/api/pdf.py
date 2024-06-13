from fastapi.responses import JSONResponse
from fastapi import FastAPI, UploadFile, File, Form, APIRouter, status,Depends
from utils.file_handler import handle_file_upload
from utils.query_handler import handle_query
from db.db_setup import get_db
from api import deps
from db.models.user import User
from sqlalchemy.orm import Session
from db.models.user import Chat

router = APIRouter()

@router.post('/upload')
async def upload_file(file: UploadFile = File(...) ,     
                current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)):
    try:
        response = await handle_file_upload(file)
        return JSONResponse(status_code=response.get("status_code", 200), content=response)
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Internal server error", "error": str(e)})

@router.post("/answer")
async def query_document(message: str = Form(...), current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)):
    try:
        response = await handle_query(message)
        response_text = response.get('response')
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error", "error": str(e)})
    print("Res :" ,response_text)
    chat = Chat(
        user_id=current_user.id,
        user_message=message,
        ai_message= response_text
    )
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return {"ai_message": str(response_text.lstrip('\n'))}