document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("type").addEventListener("change", function () {
        const selectedType = this.value;
        document.body.style.background = selectedType === "manual" ? "#f0f8ff" : "#ffe4e1";
    });

    document.getElementById("terrain").addEventListener("change", function () {
        fetchRecommendedSetup(this.value);
    });

    fetchTransmissionFluids();

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
        .catch(error => console.error("Error fetching transmission data:", error));
}

function fetchTransmissionFluids() {
    fetch("transmission-fluids.json")
        .then(response => response.json())
        .then(data => {
            const fluidInput = document.getElementById("fluid");
            fluidInput.setAttribute("list", "fluid-options");

            let dataList = document.createElement("datalist");
            dataList.id = "fluid-options";

            data.fluids.forEach(fluid => {
                let option = document.createElement("option");
                option.value = fluid;
                dataList.appendChild(option);
            });

            document.body.appendChild(dataList);
        })
        .catch(error => console.error("Error fetching fluid options:", error));
}

function saveConfiguration() {
    const config = {
        transmissionType: document.getElementById("type").value,
        gears: document.getElementById("gears").value,
        terrain: document.getElementById("terrain").value,
        roadCondition: document.getElementById("condition").value,
        distance: document.getElementById("distance").value,
        clutch: document.getElementById("clutch").value,
        fluid: document.getElementById("fluid").value,
        modifications: document.getElementById("modifications").value.split(",").map(mod => mod.trim())
    };

    document.getElementById("output").textContent = JSON.stringify(config, null, 2);
}
