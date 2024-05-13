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

  useEffect(() => {
    const listener = (message: { timeSpent: number; domain: string }) => {
      setTimeSpent(message.timeSpent)
      setDomain(message.domain)
    }

    chrome.runtime.onMessage.addListener(listener)

    return () => {
      chrome.runtime.onMessage.removeListener(listener)
    }
  }, [])

  return (
    <div
      style={{
        padding: 16
      }}>
      <h1>You are currently at {domain}</h1>
      <h2>Time Spent: {formatTime(timeSpent)}</h2>
    </div>
  )
}

export default Tracker
