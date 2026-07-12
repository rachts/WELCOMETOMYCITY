export async function getWeather(lat: number, lon: number) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  
  if (!apiKey) {
    console.warn("OpenWeather API key is missing.")
    return null
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch weather")
    
    const data = await res.json()
    return {
      condition: data.weather[0].main, // e.g., "Rain", "Clear", "Clouds"
      description: data.weather[0].description,
      temperature: data.main.temp
    }
  } catch (error) {
    console.error("Error fetching weather:", error)
    return null
  }
}
