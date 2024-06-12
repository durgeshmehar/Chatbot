from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from core.settings import settings

# Elephantsql
# DATABASE ="postgresql://vdpjdnij:j5OFZu7g9FyrSNnoNGQuDhZick1_CgW8@rain.db.elephantsql.com/vdpjdnij"
# DATABASE = "postgresql://postgres:postgres@localhost:5432/chatbot"
# DATABASE="postgresql://vdpjdnij:j5OFZu7g9FyrSNnoNGQuDhZick1_CgW8@rain.db.elephantsql.com/vdpjdnij"
DATABASE="postgresql://niwncmfs:hRe3VBBAogOX6chv9hUZt_Vr1Vji97ja@tiny.db.elephantsql.com/niwncmfs"

engine = create_engine(DATABASE )
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# db utility
def get_db():                                    
    dl = DATABASE
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()