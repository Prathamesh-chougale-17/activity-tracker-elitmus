import Chart from "chart.js/auto"
import React, { useEffect, useState } from "react"

const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hrs < 10 ? "0" + hrs : hrs}:${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`
}

const Tracker = () => {
  const [timeSpent, setTimeSpent] = useState(0)
  const [domain, setDomain] = useState("")
  const [chart, setChart] = useState(null)
  const [chartData, setChartData] = useState({ labels: [], data: [] })
  useEffect(() => {
    const port = chrome.runtime.connect({ name: "popupPort" })
    port.onMessage.addListener((message) => {
      setTimeSpent(message.timeSpent)
      setDomain(message.domain)
      setChartData(message.chartData)
    })
    return () => {
      port.disconnect()
    }
  }, [])

  useEffect(() => {
    const ctx = document.getElementById("website-usage-chart")
    if (ctx && !chart) {
      const newChart = new Chart(ctx as HTMLCanvasElement, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Time Spent (seconds)",
              data: [],
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })

      setChart(newChart)
    }

    // Update chart data whenever timeSpent or domain changes
    if (chart) {
      chart.data.labels = chartData.labels
      chart.data.datasets[0].data = chartData.data
      chart.update()
    }

    // Clean up function
    return () => {
      if (chart) {
        chart.destroy()
        setChart(null)
      }
    }
  }, [domain])
  return (
    <div
      style={{
        padding: 16
      }}>
      <h1>You are currently at {domain}</h1>
      <h2>Time Spent: {formatTime(timeSpent)}</h2>
      <canvas id="website-usage-chart"></canvas>
      {chartData.labels.length > 0 && (
        <div>
          <h3>Website Usage</h3>
          <ul>
            {chartData.labels.map((label, index) => (
              <li key={index}>
                {label}: {formatTime(chartData.data[index])}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Tracker
