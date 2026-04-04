import { useState } from "react"
import { fetchPlaylistData } from "../services/playlistService"

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${hours}h ${minutes}m ${seconds}s`
}

const speeds = [1, 1.25, 1.5, 1.75, 2]



export default function URLinput() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState(null)


  const handleSubmit = async () => {

    try {
        const data = await fetchPlaylistData(url)
        setResult(data)
      } catch (err) {
        console.error("Error:", err)
      }
    }
  
  return (
    <div>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2"
      />
      <button onClick={handleSubmit} className="border p-2">
        Calculate
      </button>

      {result && (
        <div>

          <p>Total Videos: {result.videos.length}</p>
          <p>Total Duration: {result.totalDuration}</p>

          <h3>Playback Speeds</h3>
          {speeds.map(speed => {
            const adjustedTime = Math.floor(result.totalSeconds / speed)

            return (
              <p key={speed}>
                {speed}x → {formatTime(adjustedTime)}
              </p>
            )
          })}

        </div>
      )}

      {result && (
        <div>
          {result.videos.map((item, index) => (
            <li
             key={index}>
              {index+1 + ". "}
                
              {item.snippet.title}
            </li>
          ))}
        </div>
      )}
    </div>
  )
}
