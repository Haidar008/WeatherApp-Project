let userButton=document.querySelector(".user");
let SearchButton=document.querySelector(".search");
let searchContainer=document.querySelector(".search-container");
let submitButton=document.querySelector("[submitButton]");
let input=document.querySelector("[Inputval]");
let loader=document.querySelector("[loader]");
let ERROR=document.querySelector("[Err]");
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
let weatherContainer=document.querySelector("[WC]");
let grantAccess=document.querySelector("[GAS]");
let grantAccessButton=document.querySelector("[GB]");

init();

function init(){
    SearchButton.classList.remove("current-Tab");
    userButton.classList.add("current-Tab");
    searchContainer.classList.remove("active");
    ERROR.classList.remove("active");
    weatherContainer.classList.remove("active");
    getfromSessionStorage();
}

function showPosition(position) {
    console.log("Received coordinates:", position.coords.latitude, position.coords.longitude);

    const coordinates = {
        lat: position.coords.latitude,
        long: position.coords.longitude
    };

    
    sessionStorage.setItem("user-coordinates", JSON.stringify(coordinates));

    fetchUserWeatherInfo(coordinates);
}



function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        alert("Access Failed");
    }
}

grantAccessButton.addEventListener("click",()=>{
        grantAccess.classList.remove("active");
        getLocation();
})

function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccess.classList.add("active");
    }
    else{
        const parsedcoordinates=JSON.parse(localCoordinates)
        fetchUserWeatherInfo(parsedcoordinates);
    }
}

async function fetchUserWeatherInfo(mycoordinates){
    const{ lat ,long}=mycoordinates;
    loader.classList.add("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
        if(!response.ok){
            throw new Error("Error Occured");
        }
        const data=await response.json();
        loader.classList.remove("active");
        weatherContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch{
        loader.classList.remove("active");
        ERROR.classList.add("active");
    }
}

SearchButton.addEventListener("click",()=>{
    userButton.classList.remove("current-Tab");
    SearchButton.classList.add("current-Tab");
    searchContainer.classList.add("active");
    grantAccess.classList.remove("active");
    weatherContainer.classList.remove("active");
});

userButton.addEventListener("click" ,init);

function renderWeatherInfo(data){
    let cityName=document.querySelector("[cityName]");
    let flagImage=document.querySelector("[flagImage]");
    let weathInfo=document.querySelector("[weathInfo]");
    let WeathImage=document.querySelector("[WeathImage]");
    let temp=document.querySelector("[temp]");
    let windSpeed=document.querySelector("[windSpeed]");
    let Humidity=document.querySelector("[Humidity]");
    let cloud=document.querySelector("[cloud]");
    cityName.innerText=data?.name;
    weathInfo.innerText=data?.weather[0]?.description;
    temp.innerText=`${data?.main?.temp}°C`;
    windSpeed.innerText=`${data?.wind?.speed}m/s`;
    Humidity.innerText=`${data?.main?.humidity}%`;
    cloud.innerText=`${data?.clouds?.all}%`;
    flagImage.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    WeathImage.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
}

async function fetchSearchWeatherInfo(city){
    loader.classList.add("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if(!response.ok){
            throw new Error("Error Occured");
        }
        const data=await response.json();
        loader.classList.remove("active");
        weatherContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch{
        loader.classList.remove("active");
        ERROR.classList.add("active");
    }
}
input.addEventListener("keydown",(e)=>{
    if(input.value!="" && e.key == "Enter"){
        weatherContainer.classList.remove("active");
        ERROR.classList.remove("active");
            fetchSearchWeatherInfo(input.value);
    }
});
submitButton.addEventListener("click",()=>{
        const value=input.value;
        if(value!="")
            weatherContainer.classList.remove("active");
            ERROR.classList.remove("active");
            fetchSearchWeatherInfo(value);
});