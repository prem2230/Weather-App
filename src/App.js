import './App.css';
import clear_icon from "./Assets/clear.png";
import cloud_icon from "./Assets/cloud.png";
import drizzle_icon from "./Assets/drizzle.png";
import humidity_icon from "./Assets/humidityy.png";
import rain_icon from "./Assets/rain.png";
import snow_icon from "./Assets/snow.png";
import wind_icon from "./Assets/windd.png";
import search_icon from "./Assets/Searchicon.gif";
import night_cloud from "./Assets/nightcloud.png";
import night_rain from "./Assets/nightrain.png";
import night_drizzle from "./Assets/nightdrizzle.png";
import {useCallback, useEffect, useState} from "react"

function App() {
  const [search,setSearch]= useState("");
  const[icon,setIcon]=useState(cloud_icon);
  const[humidity,setHumidity]=useState("");
  const[windSpeed,setWindSpeed]=useState("");
  const[temperature,setTemperature]=useState("");
  const[location,setLocation]=useState("");
  const[day,setDay]=useState("");
  const [date,setDate]=useState("");

  const fetchWeatherData = useCallback(async()=>{
    const cityInput = document.getElementsByClassName("cityInput")[0]
    const userInput = cityInput.value.trim()
    const standardInput = userInput.toLowerCase();
    setSearch(standardInput)

    
    
    if(!search){
    setLocation('Enter Location'); 
    setHumidity('0%');
    setTemperature('0 \u00B0C')
    setWindSpeed('0 km/hr')
    }else{
    try{
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=Metric&appid=e17afc97f3ec7ab618f65edafbc9525c`;
    
      const response = await fetch(API_URL);
      const data = await response.json();

     
      if(data.weather && data.weather.length>0){
      setHumidity(`${data.main.humidity}%`)
      setTemperature(`${Math.floor(data.main.temp)}\u00B0C`)
      setWindSpeed(`${Math.floor(data.wind.speed)}km/hr`)
      setLocation(data.name || 'Unknown Location')

      const currentTime = new Date().getTime()/1000
      const isDayTime=()=>{
        if(data && data.sys){
          
          return currentTime> data.sys.sunrise && currentTime < data.sys.sunset
        }
        return true;
      }

      if(data.weather[0].icon==='01d'|| data.weather[0].icon==='01n'){
        setIcon(isDayTime()?clear_icon:night_cloud)
      }else if(data.weather[0].icon ==='02d'||data.weather[0].icon ==='02n'){
        setIcon(isDayTime()?cloud_icon:night_cloud)
      }else if(data.weather[0].icon ==='03d'||data.weather[0].icon ==='03n') {
        setIcon(isDayTime()?drizzle_icon:night_drizzle)
      }else if(data.weather[0].icon ==='04d'||data.weather[0].icon ==='04n'){
        setIcon(isDayTime()?drizzle_icon:night_drizzle)
      }else if(data.weather[0].icon ==='09d'||data.weather[0].icon ==='09n'){
        setIcon(isDayTime()?rain_icon:night_rain)
      }else if(data.weather[0].icon ==='10d'||data.weather[0].icon ==='10n'){
        setIcon(isDayTime()?rain_icon:night_rain)
      }
      else if(data.weather[0].icon==='13d'||data.weather[0].icon==='13n'){
        setIcon(snow_icon)
      }else{
        setIcon(clear_icon)
      }
      
     
      if(isDayTime()){
        const currentDate = new Date();
        const formatDate = `${currentDate.toLocaleDateString()}`
        setDay('Day')
        setDate(formatDate)
      }else{
        const currentDate = new Date();
        const formatDate = `${currentDate.toLocaleDateString()}`
        setDay('Night')
        setDate(formatDate)
      }


    }else{
      console.error('Invalid data structure:', data);
      setLocation('UnknownLocation')
    }
    }catch(error){
      console.log('Error fetching weather data',error)


    }}
  },[search]);
  const handleSearch =(e)=>{
    e.preventDefault();
    fetchWeatherData()
  }
  useEffect(()=>{
    fetchWeatherData();
  },[fetchWeatherData,search])

  
  return (
  <>  <div className="container">
      <form onSubmit={handleSearch}>
      <div className="navbar">
        <input
         type="text" 
         className="cityInput" 
         placeholder="search"
          />
        <div className="searchIcon" >
        <img src={search_icon} alt="" onClick={handleSearch} />
        </div>
      </div>
      </form>
      <div className="weather">
        <img src={icon} alt="" />
      </div>
      <div className="temp">{temperature}</div>
      <div className='day'>{date} <br/>{day}</div>
      <div className="location">{location}</div>
      <div className="data-container">
    <div className="element">
      <img src={humidity_icon} className="icon" alt="" />
      <div className="data">
        <div className="humidityPercent">{humidity}</div>
        <div className="text">Humidity</div>
      </div>
      <div className="element">
      <img src={wind_icon} className="icon" alt="" />
      <div className="data">
        <div className="windPercent">{windSpeed}</div>
        <div className="text">Wind Speed</div>
      </div>
    </div>
  </div>
</div>
    
  </div></>
  );
}

export default App;
