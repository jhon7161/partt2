import { useState, useEffect } from 'react';
import axios from 'axios';

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

const CountryDetails = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>Capital: {country.capital}</p>
    <p>Population: {country.population}</p>
    <p>Languages: {Object.values(country.languages).join(', ')}</p>
    <img src={country.flags.png} alt="Country flag" />
    <WeatherReport capital={country.capital} />
  </div>
);
const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    const filtered = countries.filter(country =>
      country.name.common.toLowerCase().includes(event.target.value.toLowerCase())
    );
    if (filtered.length === 1) {
      setSelectedCountry(filtered[0]);
    } else {
      setSelectedCountry(null);
    }
  };

  const handleShowClick = (country) => {
    setSelectedCountry(country);
  };

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input value={search} onChange={handleSearchChange} />
      {selectedCountry ? (
        <CountryDetails country={selectedCountry} />
      ) : filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : (
        filteredCountries.map((country) => (
          <div key={country.cca3}>
            <span>{country.name.common}</span>
            <button onClick={() => handleShowClick(country)}>Show</button>
          </div>
        ))
      )}
    </div>
  );
};

export default App;



