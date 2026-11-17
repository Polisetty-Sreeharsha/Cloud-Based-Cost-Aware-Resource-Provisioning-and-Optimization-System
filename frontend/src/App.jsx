
import { useEffect, useState } from "react";
import {
  Activity,
  Cpu,
  MemoryStick,
  Network,
  DollarSign,
  RefreshCw,
  Cloud,
  Server,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./App.css";

function App() {
  const [metrics, setMetrics] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError("");

      const [metricsResponse, analysisResponse] = await Promise.all([
        fetch("http://127.0.0.1:8000/metrics"),
        fetch("http://127.0.0.1:8000/analyze"),
      ]);

      if (!metricsResponse.ok || !analysisResponse.ok) {
        throw new Error("Unable to fetch dashboard data");
      }

      const metricsData = await metricsResponse.json();
      const analysisData = await analysisResponse.json();

      setMetrics(metricsData);
      setAnalysis(analysisData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const chartData = [
    { time: "9 AM", cpu: 12, memory: 35 },
    { time: "10 AM", cpu: 16, memory: 38 },
    { time: "11 AM", cpu: 14, memory: 40 },
    { time: "12 PM", cpu: 21, memory: 42 },
    { time: "1 PM", cpu: 18, memory: 41 },
    { time: "2 PM", cpu: 18.5, memory: 42 },
  ];

  if (loading) {
    return <div className="loading">Loading Cloud Cost Optimizer...</div>;
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Cloud size={24} /></div>
          <div>
            <h2>CloudOpt</h2>
            <span>RESOURCE OPTIMIZER</span>
          </div>
        </div>

        <nav>
          <div className="nav-item active">
            <Activity size={19} /> Overview
          </div>
          <div className="nav-item">
            <Server size={19} /> Resources
          </div>
          <div className="nav-item">
            <DollarSign size={19} /> Cost Analysis
          </div>
        </nav>

        <div className="sidebar-bottom">
          <span className="status-dot"></span>
          Local Demo Environment
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">CLOUD INFRASTRUCTURE</p>
            <h1>Dashboard Overview</h1>
            <p className="subtitle">
              Monitor resources and optimize cloud spending.
            </p>
          </div>

          <button className="refresh-btn" onClick={fetchDashboardData}>
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        {error && (
          <div className="error-message">
            {error}. Make sure your FastAPI backend is running.
          </div>
        )}

        {metrics && (
          <>
            <section className="metric-grid">
              <MetricCard
                title="CPU Utilization"
                value={`${metrics.cpu_usage}%`}
                icon={<Cpu />}
                description="Sample resource metric"
              />

              <MetricCard
                title="Memory Usage"
                value={`${metrics.memory_usage}%`}
                icon={<MemoryStick />}
                description="Sample resource metric"
              />

              <MetricCard
                title="Network In"
                value={`${metrics.network_in} MB`}
                icon={<ArrowDownRight />}
                description="Sample network metric"
              />

              <MetricCard
                title="Estimated Monthly Cost"
                value={`$${metrics.estimated_monthly_cost}`}
                icon={<DollarSign />}
                description="Illustrative estimate"
              />
            </section>

            <section className="content-grid">
              <div className="panel chart-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Resource Utilization</h3>
                    <p>Illustrative CPU and memory history</p>
                  </div>
                  <span className="live-label">DEMO DATA</span>
                </div>

                <div className="chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="cpu"
                        name="CPU"
                        stroke="#6366f1"
                        strokeWidth={3}
                      />
                      <Line
                        type="monotone"
                        dataKey="memory"
                        name="Memory"
                        stroke="#06b6d4"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-legend">
                  <span><i className="cpu-dot"></i> CPU</span>
                  <span><i className="memory-dot"></i> Memory</span>
                </div>
              </div>

              <div className="panel recommendation-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Optimization Insights</h3>
                    <p>Backend analysis</p>
                  </div>
                  <Activity color="#6366f1" />
                </div>

                {analysis && (
                  <div className="recommendation">
                    <div className="recommendation-icon">
                      {metrics.cpu_usage < 20
                        ? <AlertTriangle />
                        : <CheckCircle />}
                    </div>
                    <div>
                      <strong>Resource Recommendation</strong>
                      <p>{analysis.recommendation}</p>
                    </div>
                  </div>
                )}

                <div className="resource-summary">
                  <div>
                    <span>CPU Usage</span>
                    <strong>{metrics.cpu_usage}%</strong>
                  </div>
                  <div className="progress">
                    <div style={{ width: `${metrics.cpu_usage}%` }}></div>
                  </div>
                  <div>
                    <span>Memory Usage</span>
                    <strong>{metrics.memory_usage}%</strong>
                  </div>
                  <div className="progress memory-progress">
                    <div style={{ width: `${metrics.memory_usage}%` }}></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel network-panel">
              <div className="panel-heading">
                <div>
                  <h3>Network Activity</h3>
                  <p>Current sample network metrics</p>
                </div>
                <Network color="#6366f1" />
              </div>
              <div className="network-values">
                <div>
                  <ArrowDownRight color="#06b6d4" />
                  <span>Incoming Traffic</span>
                  <strong>{metrics.network_in} MB</strong>
                </div>
                <div>
                  <ArrowUpRight color="#6366f1" />
                  <span>Outgoing Traffic</span>
                  <strong>{metrics.network_out} MB</strong>
                </div>
              </div>
            </section>
          </>
        )}

        <footer>
          Cloud Cost Optimizer · Development Version 1.0 · Sample metrics
        </footer>
      </main>
    </div>
  );
}

function MetricCard({ title, value, icon, description }) {
  return (
    <div className="panel metric-card">
      <div className="metric-top">
        <span>{title}</span>
        <div className="metric-icon">{icon}</div>
      </div>
      <h2>{value}</h2>
      <p>{description}</p>
    </div>
  );
}

export default App;
