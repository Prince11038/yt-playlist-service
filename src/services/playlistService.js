const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

function extractPlaylistId(url){
  const match = url.match(/[?&]list=([^&]+)/)
  return match ? match[1] : null
}

export async function fetchPlaylistData(url) {
  const playlistId = extractPlaylistId(url)

  if (!playlistId) {
    throw new Error("Invalid playlist URL")
  }

  let allVideos = []
  let nextPageToken = ""

  do {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&pageToken=${nextPageToken}&key=${API_KEY}`
    )

    const data = await response.json()

    allVideos = [...allVideos, ...data.items]

    nextPageToken = data.nextPageToken || null

  } while (nextPageToken)

  const videoIds = allVideos.map(items=>items.contentDetails.videoId)

  // ✅ FIX STARTS HERE (batching)
  function chunkArray(array, size) {
    const result = []
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size))
    }
    return result
  }

  const videoIdChunks = chunkArray(videoIds, 50)

  let durations = []

  for (const chunk of videoIdChunks) {
    const idString = chunk.join(",")

    const durationRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${idString}&key=${API_KEY}`
    )

    const durationData = await durationRes.json()

    const chunkDurations = durationData.items.map(
      item => item.contentDetails.duration
    )

    durations = [...durations, ...chunkDurations]
  }
  // ✅ FIX ENDS HERE


  function convertToSeconds(duration){
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    const hours = parseInt(match[1] || 0)
    const minutes = parseInt(match[2] || 0)
    const seconds = parseInt(match[3] || 0)
    return hours * 3600 + minutes * 60 + seconds
  }

  const secondsArray = durations.map(vid => convertToSeconds(vid))

  const totalSeconds = secondsArray.reduce((acc, curr) => acc + curr, 0)

  function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
  
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const formattedTime = formatTime(totalSeconds)

  const averageDuration = totalSeconds / allVideos.length

  return {
    videos: allVideos,
    totalDuration: formattedTime,
    totalSeconds: totalSeconds,
    averageDuration: averageDuration,
  }
}