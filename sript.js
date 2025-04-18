const baseUrl = 'https://project-server-psi.vercel.app/'

document.addEventListener('DOMContentLoaded', function() {
  loadFluidOptions();

  document.getElementById('transmissionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    saveConfiguration();
  });

  document.getElementById('terrain').addEventListener('change', function() {
    updateRecommendations(this.value);
  });

  document.getElementById('add-mod-btn').addEventListener('click', addModificationField);
});

function loadFluidOptions() {
  fetch(baseUrl)
    .then(response => response.json())
    .then(data => {
      const fluids = new Set();
      Object.values(data).forEach(item => {
        if (item.fluid) fluids.add(item.fluid);
      });

      const datalist = document.getElementById('fluid-options');
      fluids.forEach(fluid => {
        const option = document.createElement('option');
        option.value = fluid;
        datalist.appendChild(option);
      });
    })
    .catch(error => console.error('Error loading fluids:', error));
}

function updateRecommendations(terrain) {
  fetch(baseUrl)
    .then(response => response.json())
    .then(data => {
      const recommendation = data[terrain];
      if (recommendation) {
        document.getElementById('gears').value = recommendation.gears;
        document.getElementById('fluid').value = recommendation.fluid;
      }
    })
    .catch(error => console.error('Error loading recommendations:', error));
}

function addModificationField() {
  const container = document.getElementById('modifications-container');
  const fieldWrapper = document.createElement('div');
  fieldWrapper.className = 'mod-field';

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'modification';
  input.placeholder = 'Enter a modification';
  input.className = 'modification';

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = 'Remove';
  removeBtn.onclick = function () {
    container.removeChild(fieldWrapper);
  };

  fieldWrapper.appendChild(input);
  fieldWrapper.appendChild(removeBtn);
  container.appendChild(fieldWrapper);
}

function saveConfiguration() {
  const mods = Array.from(document.querySelectorAll('.modification'))
                    .map(input => input.value)
                    .filter(val => val.trim() !== '');

  const config = {
    vehicle: {
      make: document.getElementById('car-make').value,
      model: document.getElementById('car-model').value
    },
    transmission: {
      type: document.getElementById('type').value,
      gears: document.getElementById('gears').value,
      fluid: document.getElementById('fluid').value
    },
    usage: {
      terrain: document.getElementById('terrain').value,
      distance: document.getElementById('distance').value + ' km'
    },
    modifications: mods
  };

  document.getElementById('output').innerHTML = `
    <h3>Your Configuration</h3>
    <pre>${JSON.stringify(config, null, 2)}</pre>
    <p>Thank you for your submission!</p>
  `;
}
