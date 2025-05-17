from http import HTTPStatus

import dashscope
from dashscope import Application
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# User request model
class PromptRequest(BaseModel):
    prompt: str


# API key & endpoint
API_KEY = "sk-e698e1d5ba504c82a214c3250fc17646"
dashscope.base_http_api_url = "https://dashscope-intl.aliyuncs.com/api/v1"

# Agents config
AGENT_CONFIGS = [
    {
        "name": "default",
        "app_id": "a2bc39502d0f4bdebcd4c57f6e7d88cf",
        "pipeline_ids": ["pq3gfaz9bh"],
    },
    {
        "name": "custom_agent",
        "app_id": "670ec79380fe475498874f612e295d25",
        "pipeline_ids": ["pq3gfaz9bh"],
    },
]


# Function to call Qwen app
def query_agent(prompt: str, app_id: str, pipeline_ids: list):
    try:
        response = Application.call(
            api_key=API_KEY,
            app_id=app_id,
            prompt=prompt,
            rag_options={"pipeline_ids": pipeline_ids},
        )
        return response
    except Exception as e:
        return {"error": str(e)}


# Endpoint: send prompt to both agents and return best response
@app.post("/api/qwen")
async def get_best_response(request: PromptRequest):
    prompt = request.prompt
    results = []

    for config in AGENT_CONFIGS:
        res = query_agent(prompt, config["app_id"], config["pipeline_ids"])

        if isinstance(res, dict) and "error" in res:
            results.append(
                {"agent": config["name"], "success": False, "error": res["error"]}
            )
        elif res.status_code == HTTPStatus.OK:
            results.append(
                {"agent": config["name"], "success": True, "output": dict(res.output)}
            )
        else:
            results.append(
                {
                    "agent": config["name"],
                    "success": False,
                    "error": res.message,
                    "status": res.status_code,
                    "request_id": res.request_id,
                }
            )

    # Choose best response: for now, longest answer wins
    valid_responses = [r for r in results if r["success"]]
    if not valid_responses:
        return {
            "error": "Both agents failed to return valid responses.",
            "details": results,
        }

    # Pick the one with the longest response text
    best = max(valid_responses, key=lambda x: len(str(x["output"])))

    return {"output": best["output"], "source_agent": best["agent"]}
