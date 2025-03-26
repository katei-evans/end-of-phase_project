document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("type").addEventListener("change", function () {
        const selectedType = this.value;
        document.body.style.background = selectedType === "manual" ? "#f0f8ff" : "#ffe4e1";
    });

    
    document.getElementById("terrain").addEventListener("change", function () {
        const terrain = this.value;
        fetchRecommendedSetup(terrain);
    });

    document.querySelector("button").addEventListener("click", saveConfiguration);
});

function fetchRecommendedSetup(terrain) {
    fetch("transmission-data.json")
        .then(response => response.json())
        .then(data => {
            const recommendation = data[terrain];
            if (recommendation) {
                document.getElementById("gears").value = recommendation.gears;
                document.getElementById("fluid").value = recommendation.fluid;
                document.getElementById("clutch").value = recommendation.clutch;
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}
