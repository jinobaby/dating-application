window.allowLocation = () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
    else {
        console.log("Geolocation is not supported by this browser.");
    }
}

const showPosition = (position) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    console.log(`Latitude: ${lat}, Longitude: ${long}`);   

    //send location to server
    fetch('/save-location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latitude: lat, longitude: long })
    })
    .then(res => res.json())
    .then(data => {
        if (data.redirect) {
            window.location.href = data.redirect
        } else {
            console.log(data.message || "Location saved!")
        }
    })
    .catch(err => {
        console.log("Error saving location")
    });
}

const showError = (error) => {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }
}