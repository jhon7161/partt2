const WeatherReport = ({ capital }) => {
    const [weather, setWeather] = useState(null);
  
    useEffect(() => {
      const api_key = import.meta.env.VITE_SOME_KEY
  
      axios
        .get(`http://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`)
        .then(response => {
          setWeather(response.data);
        });
    }, [capital]);
  
    if (!weather) {
      return <p>Loading weather...</p>;
    }
    const iconUrl = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  return (
    <div>
      <h3>Weather in {capital}</h3>
      <img src={iconUrl} alt="Weather icon" />
      <p><strong>temperature:</strong> {weather.main.temp} K</p>
      <p><strong>wind:</strong> {weather.wind.speed} m/s</p>
    </div>
  );
};
export default {WeatherReport,iconUrl}