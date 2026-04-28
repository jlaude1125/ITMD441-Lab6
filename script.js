// DOM elements
const locationSelect = document.getElementById('location-select');
const errorMessage = document.getElementById('error-message');
const todayElements = {
    sunrise: document.getElementById('today-sunrise'),
    sunset: document.getElementById('today-sunset'),
    dawn: document.getElementById('today-dawn'),
    dusk: document.getElementById('today-dusk'),
    'solar_noon': document.getElementById('today-solar-noon'),
    'day_length': document.getElementById('today-day-length')
};
const tomorrowElements = {
    sunrise: document.getElementById('tomorrow-sunrise'),
    sunset: document.getElementById('tomorrow-sunset'),
    dawn: document.getElementById('tomorrow-dawn'),
    dusk: document.getElementById('tomorrow-dusk'),
    'solar_noon': document.getElementById('tomorrow-solar-noon'),
    'day_length': document.getElementById('tomorrow-day-length')
};
const timezoneElement = document.getElementById('timezone');

// Event listener for location selection
locationSelect.addEventListener('change', async (event) => {
    const selectedValue = event.target.value;
    if (!selectedValue) return;

    const [lat, lng] = selectedValue.split(',');
    hideError();
    setLoadingState();

    try {
        // Fetch data for today and tomorrow
        const [todayData, tomorrowData] = await Promise.all([
            fetchSunData(lat, lng, 'today'),
            fetchSunData(lat, lng, 'tomorrow')
        ]);

        updateDashboard(todayData, tomorrowData);
    } catch (error) {
        showError('Failed to load data. Please try again.');
        console.error('Error:', error);
    }
});

// Function to fetch sunrise/sunset data
async function fetchSunData(lat, lng, date) {
    const url = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&date=${date}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
        throw new Error(`API Error: ${data.status}`);
    }

    return data.results;
}

// Function to update the dashboard
function updateDashboard(todayData, tomorrowData) {
    // Update today
    Object.keys(todayElements).forEach(key => {
        todayElements[key].textContent = todayData[key] || '--';
    });

    // Update tomorrow
    Object.keys(tomorrowElements).forEach(key => {
        tomorrowElements[key].textContent = tomorrowData[key] || '--';
    });

    // Update timezone (use today's timezone)
    timezoneElement.textContent = todayData.timezone || '--';
}

// Function to set loading state
function setLoadingState() {
    const allElements = { ...todayElements, ...tomorrowElements };
    Object.values(allElements).forEach(element => {
        element.textContent = 'Loading...';
    });
    timezoneElement.textContent = 'Loading...';
}

// Function to show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// Function to hide error message
function hideError() {
    errorMessage.classList.add('hidden');
}