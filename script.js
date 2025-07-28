document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById("search-field");
  const locationFilter = document.getElementById("filter-location");
  const typeFilter = document.getElementById("filter-type");
  const priceFilter = document.getElementById("filter-price");
  const listingsGrid = document.getElementById("listings-grid");

  let properties = [];

  function populateLocationFilter() {
    const uniqueLocations = [...new Set(properties.map(p => p.location))];
    uniqueLocations.forEach(loc => {
      const option = document.createElement("option");
      option.value = loc;
      option.textContent = loc;
      locationFilter.appendChild(option);
    });
  }

  function displayProperties(props) {
    listingsGrid.innerHTML = "";

    if (props.length === 0) {
      listingsGrid.innerHTML = "<p>No properties match the selected criteria.</p>";
      return;
    }

    props.forEach((property) => {
      const card = document.createElement("div");
      card.className = "listing-card";
      card.innerHTML = `
        <img src="${property.image}" alt="${property.name}" />
        <div class="listing-details">
          <h3>${property.name}</h3>
          <p><strong>Location:</strong> ${property.location}</p>
          <p><strong>Type:</strong> ${property.type}</p>
          <p><strong>Price:</strong> ₹${property.price.toLocaleString()}</p>
        </div>
      `;
      listingsGrid.appendChild(card);
    });
  }

  function filterProperties() {
    const query = searchInput.value.toLowerCase();
    const location = locationFilter.value;
    const type = typeFilter.value;
    const maxPrice = parseInt(priceFilter.value, 10);

    const filtered = properties.filter((prop) => {
      const matchesQuery =
        prop.name.toLowerCase().includes(query) ||
        prop.location.toLowerCase().includes(query);
      const matchesLocation = !location || prop.location === location;
      const matchesType = !type || prop.type === type;
      const matchesPrice = !maxPrice || prop.price <= maxPrice;
      return matchesQuery && matchesLocation && matchesType && matchesPrice;
    });

    displayProperties(filtered);
  }

  // Load data from listings.json
  fetch('listings.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load listings.json");
      }
      return response.json();
    })
    .then((data) => {
      properties = data;
      populateLocationFilter();
      displayProperties(properties);

      // Enable filters after loading
      searchInput.addEventListener("input", filterProperties);
      locationFilter.addEventListener("change", filterProperties);
      typeFilter.addEventListener("change", filterProperties);
      priceFilter.addEventListener("change", filterProperties);
    })
    .catch((error) => {
      listingsGrid.innerHTML = `<p>Error loading listings: ${error.message}</p>`;
      console.error(error);
    });
});
