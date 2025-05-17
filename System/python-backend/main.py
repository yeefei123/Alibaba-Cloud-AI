from http import HTTPStatus

import dashscope
from dashscope import Application
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# ✅ CORS Middleware - add this BEFORE any routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # Replace with ["http://localhost:3000"] if you know your frontend port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptRequest(BaseModel):
    prompt: str


@app.post("/api/qwen")
async def get_qwen_response(request: PromptRequest):
    dashscope.base_http_api_url = "https://dashscope-intl.aliyuncs.com/api/v1"
    response = Application.call(
        api_key="sk-e698e1d5ba504c82a214c3250fc17646",
        app_id="a2bc39502d0f4bdebcd4c57f6e7d88cf",
        prompt=request.prompt,
        rag_options={"pipeline_ids": ["pq3gfaz9bh"]},
    )

    if response.status_code != HTTPStatus.OK:
        return {
            "error": {
                "request_id": response.request_id,
                "code": response.status_code,
                "message": response.message,
                "help": "https://www.alibabacloud.com/help/en/model-studio/developer-reference/error-code",
            }
        }

    # Return output directly
    return {"output": dict(response.output)}
