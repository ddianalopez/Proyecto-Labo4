const minTempDiv = document.getElementById("min-temp");
const maxTempDiv = document.getElementById("max-temp");
const tempDiv = document.getElementById("temp");
const stateDiv = document.getElementById("state");
const humidityDiv = document.getElementById("humidity");
const APIkey = "c555b0f45c0e863ca0cd5a31f4878957";
const province = document.getElementById("province");
const selectedProvinceLongitude = document.getElementById("coordinates-selected-longitude")
const selectedProvinceLatitude = document.getElementById("coordinates-selected-latitude")
const localLocalization = document.getElementById("localization")

changeSelectedProvince()

getCoordinates().then((coordinates)=>{
  localLocalization.innerHTML=`Latitud Local:${coordinates.latitude}<br>
  Longitud Local:${coordinates.longitude}` 


})
function mapData (response){
  tempDiv.innerHTML=response.main.temp;
      
      minTempDiv.innerHTML=response.main.temp_min;
      
      maxTempDiv.innerHTML=response.main.temp_max;
      
      humidityDiv.innerHTML=response.main.humidity;
      stateDiv.innerHTML=response.name;

}



function setCoordenatesLocal(){

  
}



function calcularLocal(){
    getCoordinates().then((coordinates)=>{ 
    const path = setPath(coordinates.latitude,coordinates.longitude,APIkey);
    fetchData(path).then((response)=>{
    mapData(response)
    }
    );


  })

}

function calcularPorProvincia(){
    getSelectedProvincesValues().then((coordinates)=>{ 
    const path = setPath(coordinates.latitude,coordinates.longitude,APIkey);
    fetchData(path).then((response)=>{
    mapData(response)
    }
    );
  })

}




function changeSelectedProvince(){
  
  let selectedOption = province.options[province.selectedIndex];
  selectedProvinceLongitude.innerHTML= selectedOption.getAttribute('longitude'); 
  selectedProvinceLatitude.innerHTML =selectedOption.getAttribute('latitude')

}



function getSelectedProvincesValues() {
  return new Promise((resolve) => {

         resolve({ latitude: selectedProvinceLatitude.innerHTML, longitude: selectedProvinceLongitude.innerHTML });
    
  });
}


function setPath(latitude, longitude, APIkey){
  return `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIkey}&units=metric`
}

function getCoordinates() {
  return new Promise((resolve, reject) => {

    if ("geolocation" in navigator) {

      navigator.geolocation.getCurrentPosition(
        (position) => {
    
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
       
          reject("Error getting coordinates: " + error.message);
        }
      );
    } else {
     
      reject("Geolocation is not supported by your browser");
    }
  });
}


function fetchData(endpoint) {

  return new Promise((resolve, reject) => {
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
 
        resolve(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
    
        reject(error);
      });
  });
}

  


