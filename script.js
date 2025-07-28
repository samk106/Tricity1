let propertiesData = [];

// Fetch properties from JSON
fetch('properties.json')
  .then(response => response.json())
  .then(data => {
    propertiesData = data;
    displayProperties(data);
  });

// Render properties to DOM
function displayProperties(properties) {
  const container = document.getElementById('property-list');
  container.innerHTML = '';

  properties.forEach(property => {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.innerHTML = `
      <div class="property-image">
        <img src="${property.image}" alt="${property.title}">
      </div>
      <div class="property-details">
        <h3 class="property-title">${property.title}</h3>
        <p class="property-location"><span class="material-icons">location_on</span> ${property.location}</p>
        <div class="property-meta">
          <span><span class="material-icons">home</span> ${property.type}</span>
          <span><span class="material-icons">currency_rupee</span> ${property.price}</span>
        </div>
        <button class="btn-details">View Details</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Handle filters
document.getElementById('search').addEventListener('input', applyFilters);
document.getElementById('type-filter').addEventListener('change', applyFilters);
document.getElementById('location-filter').addEventListener('change', applyFilters);

function applyFilters() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const typeFilter = document.getElementById('type-filter').value;
  const locationFilter = document.getElementById('location-filter').value;

  const filtered = propertiesData.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm) || p.location.toLowerCase().includes(searchTerm);
    const matchesType = !typeFilter || p.type === typeFilter;
    const matchesLocation = !locationFilter || p.location === locationFilter;
    return matchesSearch && matchesType && matchesLocation;
  });

  displayProperties(filtered);
}
