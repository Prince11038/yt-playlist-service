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
    <div className="p-5 m-2">
      
      <div className="flex justify-center p-4 gap-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your Playlist URL"
          className="border p-2 w-4/5 flex flex-col items-center gap-4 justify-center"

        />

        <button onClick={handleSubmit} className="border p-2 bg-blue-500 text-white rounded">
          Calculate
        </button>
      </div>
      
      

      {result && (
        <div>

          <p>Total Videos: {result.videos.length}</p>
          <p>Total Duration: {result.totalDuration}</p>
          
          <p> Average Duration: {formatTime(result.averageDuration)}</p>

          <h3 className="font-bold py-8 text-2xl">Time taken on Different Playback Speeds</h3>
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
          <h1 className="font-bold text-4xl p-8 flex justify-center">Videos Title</h1>
          {result.videos.map((item, index) => (
            <div className="font-bold"
             key={index}>
              {index+1 + ". "}
                
              {item.snippet.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
