import psutil
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Cloud Cost Optimizer API",
    description="A cloud resource monitoring and cost optimization system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Cloud Cost Optimizer API is running!",
        "status": "success"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/metrics")
def get_metrics():
    cpu_usage = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()

    network = psutil.net_io_counters()

    return {
        "cpu_usage": cpu_usage,
        "memory_usage": memory.percent,
        "network_in": round(network.bytes_recv / (1024 * 1024), 2),
        "network_out": round(network.bytes_sent / (1024 * 1024), 2),
        "estimated_monthly_cost": 45.00
    }



# Analyze CPU utilization

@app.get("/analyze")
def analyze_resources():
    cpu_usage = psutil.cpu_percent(interval=1)
    memory_usage = psutil.virtual_memory().percent

    if cpu_usage > 75 or memory_usage > 80:
        status = "High Usage"
        recommendation = (
            "Resource usage is high. Consider scaling up "
            "or optimizing the application."
        )

    elif cpu_usage < 18 and memory_usage < 33:
        status = "Underutilized"
        recommendation = (
            "Resources may be oversized. Consider testing "
            "a smaller instance configuration."
        )

    else:
        status = "Normal"
        recommendation = (
            "Resource utilization is within a reasonable range."
        )

    return {
        "cpu_usage": cpu_usage,
        "memory_usage": memory_usage,
        "status": status,
        "recommendation": recommendation
    }

