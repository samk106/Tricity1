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

  function createImageSlider(images) {
    const basePath = `${window.location.origin}${window.location.pathname.replace(/\/[^\/]*$/, '/')}`;

    const slider = document.createElement("div");
    slider.className = "image-slider";

    const img = document.createElement("img");
    img.src = basePath + 'images' + images[0];
    img.alt = "Property image";
    slider.appendChild(img);

    let currentIndex = 0;

    const prevButton = document.createElement("button");
    prevButton.className = "slider-btn prev";
    prevButton.innerHTML = "&#10094;";
    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      img.src = basePath + 'images' + images[currentIndex];
    });

    const nextButton = document.createElement("button");
    nextButton.className = "slider-btn next";
    nextButton.innerHTML = "&#10095;";
    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % images.length;
      img.src = basePath + 'images' + images[currentIndex];
    });

    slider.appendChild(prevButton);
    slider.appendChild(nextButton);

    return slider;
  }

  function displayProperties(props) {
    listingsGrid.innerHTML = "";

    if (props.length === 0) {
      listingsGrid.innerHTML = "<p>No properties match the selected criteria.</p>";
      return;
    }

    props.forEach((property) => {
      const card = document.createElement("div");
      card.className = "property-card";

      const imageSlider = createImageSlider(property.images);

      const details = document.createElement("div");
      details.className = "property-details";
      details.innerHTML = `
        <div class="title">${property.title}</div>
        <div class="location">
          <span class="material-symbols-outlined">location_on</span>
          ${property.project}, ${property.location}
        </div>
        <div class="price">
          <span class="material-symbols-outlined">currency_rupee</span>
          ${property.price}
        </div>
        <div class="details">
          <div class="detail-item"><span class="material-symbols-outlined">straighten</span> Carpet: ${property.carpet}</div>
          <div class="detail-item"><span class="material-symbols-outlined">square_foot</span> Super: ${property.superarea}</div>
          <div class="detail-item"><span class="material-symbols-outlined">apartment</span> ${property.type}</div>
          <div class="detail-item"><span class="material-symbols-outlined">bed</span> ${property.size}</div>
          <div class="detail-item"><span class="material-symbols-outlined">bathtub</span> ${property.bathrooms} Baths</div>
        </div>
        <div class="tags">
          ${(property.tags || []).map(tag => `<div class="tag">${tag}</div>`).join('')}
        </div>
      `;

      card.appendChild(imageSlider);
      card.appendChild(details);
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
        prop.title.toLowerCase().includes(query) ||
        prop.location.toLowerCase().includes(query);
      const matchesLocation = !location || prop.location === location;
      const matchesType = !type || prop.type === type;
      const matchesPrice = !maxPrice || parseInt(prop.price.replace(/,/g, '')) <= maxPrice;
      return matchesQuery && matchesLocation && matchesType && matchesPrice;
    });

    displayProperties(filtered);
  }

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
