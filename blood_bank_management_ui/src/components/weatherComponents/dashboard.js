
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setProgress, setData, setPopupState } from "../../actions";
import OtherDetails from "./otherDetails";
import WeatherInfo from "./weatherInfo";
import LoadingBar from 'react-top-loading-bar'

var gettingData = false;
var prevCoordinates = { lat: 0, lon: 0 };

async function getDataFromCoord(dispatch, coordinates, setProgress) {
    try {
        gettingData = true;
        setProgress(10);
        var res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${process.env.REACT_APP_WEATHER_API}`);
        setProgress(65);
        const data = await res.json()
        setProgress(80);
        dispatch(setPopupState({ status: 'show', message: 'Successfully fetched data', type: 'success' }));
        dispatch(setData(data));
        setProgress(100);
    } catch (error) {
        dispatch(setPopupState({ status: 'show', message: `Something Went Wrong :(\n${error}`, type: 'error' }));
        setProgress(100);
    } finally {
        gettingData = false;
    }
}

const Dashboard = () => {
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);
    const mainData = useSelector(state => state.data);
    const country = useSelector(state => state.country);
    let city = useSelector(state => state.city);
    let cityOrLocality = "City:"
    if (city.includes("--resetCity--")) {
        city = city.slice(13);
        cityOrLocality = "Address: "
    }
    const coordinates = useSelector(state => state.coordinates);
    var sunrise = "-";
    var sunset = "-";
    useEffect(() => {
        if (coordinates.lat !== "-" && coordinates.lon !== '-' && prevCoordinates.lat != coordinates.lat && prevCoordinates.lon != coordinates.lon) {
            prevCoordinates.lat = coordinates.lat;
            prevCoordinates.lon = coordinates.lon;
            getDataFromCoord(dispatch, coordinates, setProgress);
        }
    }, [coordinates]);

    if (mainData && mainData.sys && mainData.sys.sunrise) {
        const riseDate = new Date(mainData.sys.sunrise * 1000);
        const time = (riseDate.getHours()) + ":" + riseDate.getMinutes();
        sunrise = time;
    }

    if (mainData && mainData.sys && mainData.sys.sunset) {
        const riseDate = new Date(mainData.sys.sunset * 1000);
        const time = (riseDate.getHours()) + ":" + riseDate.getMinutes();
        sunset = time;
    }
    const windSpeed = [
        { name: "SPEED", data: mainData.wind && mainData.wind.speed ? mainData.wind.speed : "-", unit: "m/s" },
        { name: "GUST", data: mainData.wind && mainData.wind.gust ? mainData.wind.gust : "-", unit: "m/s" },
        { name: "DEGREE", data: mainData.wind && mainData.wind.deg ? mainData.wind.deg : "-", unit: "deg" },]

    const pressure = [
        { name: "SEA LVL", data: mainData.main && mainData.main.sea_level ? mainData.main.sea_level : "-", unit: "hPa" },
        { name: "GROUND LVL", data: mainData.main && mainData.main.grnd_level ? mainData.main.grnd_level : "-", unit: "hPa" },]

    const clouds = [{ name: "CLOUDINESS", data: mainData.clouds && mainData.clouds.all ? mainData.clouds.all : "-", unit: "%" }]

    return (
        <div className="weather-details-cont">
            <div className="other-details-cont">
                <OtherDetails header="DONORS" elements={{value:100,desc:'Total Donors'}} />
                <OtherDetails header="DONATIONS" elements={{value:100,desc:'Total Donations'}} />
                <OtherDetails header="BLOOD BANKS" elements={{value:100,desc:'Total Banks Onboarded'}} />
                <OtherDetails header="HOSPITALS" elements={{value:100,desc:'Total Hospitals Onboarded'}} />
                <OtherDetails header="PATIENTS" elements={{value:100,desc:'Total Patients Reached'}} />
            </div>
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)} />
            <div className="weather-div">
                
            </div>
        </div>
    );
}

export default Dashboard;