document.addEventListener("DOMContentLoaded", () => {
    // Elements for dynamic injection
    const categoryFilter = document.getElementById("categoryFilter");
    const productGrid = document.getElementById("productGrid");
  
    // Fetch the product data from the JSON file
    fetch("products.json")
      .then((response) => response.json())
      .then((data) => {
        // Get unique categories for the filter
        const categories = [...new Set(data.map((item) => item.category))];
  
        // Inject category filters
        categories.forEach((category) => {
          const listItem = document.createElement("li");
          listItem.textContent = category;
          listItem.classList.add("filter_item");
          listItem.dataset.category = category;
          listItem.addEventListener("click", () => filterByCategory(category));
          categoryFilter.appendChild(listItem);
        });
  
        // Display all products initially
        displayProducts(data);
  
        // Filter function
        function filterByCategory(category) {
          const filteredData = data.filter(
            (item) => item.category === category
          );
          displayProducts(filteredData);
        }
  
        // Function to display products
        function displayProducts(products) {
          productGrid.innerHTML = ""; // Clear existing content
          products.forEach((product) => {
            const productCard = `
              <div class="featured_card">
                <img src="${product.image}" alt="${product.dishName}" class="featured_img" />
                <h3 class="featured_name">${product.dishName}</h3>
                <span class="featured_price">$${product.price}</span>
              </div>
            `;
            productGrid.insertAdjacentHTML("beforeend", productCard);
          });
        }
      })
      .catch((error) => console.error("Error fetching product data:", error));
  });
  