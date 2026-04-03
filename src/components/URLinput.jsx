import { useState } from "react"
import { fetchPlaylistData } from "../services/playlistService"


export default function URLinput() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState(null)


  const handleSubmit = async () => {
    console.log("Button clicked")
    console.log("URL:", url)

    try {
        const data = await fetchPlaylistData(url)
        console.log("Fetched data:", data)
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

      {result && <p>Total videos: {result.videos.length}</p>}

      {result && <p>Total Duration: {result.totalDuration}</p>}

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
