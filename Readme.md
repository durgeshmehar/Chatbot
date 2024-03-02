# AI Chatbot Application 
AI Chatbot is an intelligent response-providing website. It build with latest technologies such as Next.js  & FastAPI. 
### Live link: [here](https://durgeshbot.vercel.app/)
#### Signup page
![signup page](./Images/signup.png)
#### Login page
![login page](./Images/login.png)
#### Chat page
![login page](./Images/chatbot.png)

## Installation Guide

### Requirements
- [Nextjs](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Postgres](https://www.postgresql.org/)


```shell
git clone https://github.com/durgeshmehar/Chatbot.git
cd Chatbot
```


Now installing dependencies on backend

 ```shell
cd chatbot_backend
pip install
uvicorn main:app --reload
```
Go to the file constant.js
```shell
Chatbot/chatbot_frontend/src/components/constant.js
```
Replace this line with your backend hosted URL.
```shell
export const BACKEND_URL ="YOUR_BACKEND_URL"
```
Now for run the development server:
 ```shell
cd chatbot_frontend
npm install
npm run dev
```
Done! Now open localhost:3000 in your browser.
