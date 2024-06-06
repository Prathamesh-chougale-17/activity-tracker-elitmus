import Chart from "chart.js/auto"
import React, { useEffect, useRef, useState } from "react"

const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hrs < 10 ? "0" + hrs : hrs}:${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`
}

const Tracker: React.FC = () => {
  const [timeSpent, setTimeSpent] = useState<{ [key: string]: number }>({})
  const [currentDomain, setCurrentDomain] = useState<string>("")
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [chart, setChart] = useState<Chart | null>(null)

  useEffect(() => {
    const listener = (message: { domain: string; timeSpent: number }) => {
      setTimeSpent((prevTimeSpent) => ({
        ...prevTimeSpent,
        [message.domain]: message.timeSpent
      }))
      setCurrentDomain(message.domain)
    }

    chrome.runtime.onMessage.addListener(listener)

    return () => {
      chrome.runtime.onMessage.removeListener(listener)
    }
  }, [])

  useEffect(() => {
    if (chartRef.current && !chart) {
      const newChart = new Chart(chartRef.current, {
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

    if (chart) {
      chart.data.labels = Object.keys(timeSpent)
      chart.data.datasets[0].data = Object.values(timeSpent)
      chart.update()
    }
  }, [timeSpent, chart])

  return (
    <div style={{ padding: 16 }}>
      <h1>You are currently at {currentDomain}</h1>
      <h2>Time Spent: {formatTime(timeSpent[currentDomain] || 0)}</h2>
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

export default Tracker
