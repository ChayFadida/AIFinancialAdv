# from fastapi import APIRouter, Depends, HTTPException, Request
# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# import jwt
# from config.app_contex import TOKEN_ALGORITHM, JWT_SECRET_KEY
# import bcrypt
# from datetime import datetime, timedelta
# from pydantic import BaseModel
# from config.logger_config import log
# from dependency.dependencies import dependency_container
# preflix = "/authentication"
# hours_expired = 1

# # Define a FastAPI router
# router = APIRouter(prefix=preflix)
# # Create an OAuth2 password bearer scheme for token-based authentication
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{preflix}/login")

# # Utility functions for password handling
# def hash_password(password: str) -> str:
#     return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12))

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# # Utility functions for JWT
# def create_access_token(data: dict):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + timedelta(minutes=60)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=TOKEN_ALGORITHM)
#     return encoded_jwt

# def create_refresh_token(data: dict):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + timedelta(days=1)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=TOKEN_ALGORITHM)
#     return encoded_jwt

# # Pydantic models for user-related data
# class Token(BaseModel):
#     access_token: str
#     refresh_token: str
#     token_type: str

# # Dependency to get the current user
# async def get_current_user(token: str = Depends(oauth2_scheme)):
#     try:
#         payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[TOKEN_ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None:
#             raise HTTPException(status_code=401, detail="Invalid credentials")
#         user = dependency_container.userHandler.get_user_by_username(username)
#         if user is None:
#             raise HTTPException(status_code=401, detail="Invalid credentials")
#         return user
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token expired")
#     except jwt.JWTError:
#         raise HTTPException(status_code=401, detail="Invalid credentials")

# @router.post("/register", summary="User Registration Endpoint", tags=["User"], response_model=dict)
# async def register_user(username: str, password: str, role: str):
#     log.info(f'{username} registered as {role}')

#     # Check if the user already exists
#     if dependency_container.userHandler.get_user_by_username(username):
#         log.warning(f'User {username} already exists')
#         raise HTTPException(status_code=400, detail="User already exists")

#     # Ensure the provided role is valid
#     valid_roles = ["user", "admin", "developer"]
#     if role not in valid_roles:
#         log.warning(f'Invalid role. Choose from {valid_roles}')
#         raise HTTPException(status_code=400, detail="Invalid role. Choose from user, admin, or developer.")

#     # Hash the user's password
#     hashed_password = hash_password(password)

#     # Store user data with the hashed password
#     dependency_container.userHandler.create_user(username, hashed_password, role=role, status="pending")
#     return {"message": "User registered successfully"}