let allProducts = []; // lưu toàn bộ sản phẩm để lọc lại

async function fetchAndRenderProducts() {
    try {
        const res = await fetch('http://localhost:3000/api/products');
        const products = await res.json();
        allProducts = products; // lưu toàn bộ sản phẩm ban đầu

        renderTable(products);
        renderCategories(products);

    } catch (err) {
        console.error('Error fetching products:', err);
    }
}

function renderTable(products) {
    const tableBody = document.getElementById('tableBodyProducts');
    tableBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td><input type="checkbox"></td>
      <td>${product.productId}</td>
      <td>${product.name}</td>
      <td>${new Date(product.expirationDate).toLocaleDateString()}</td>
      <td>${product.stock}</td>
      <td class="d-flex">
        <span class="general-icon"><img src="../img/edit.svg" alt="Edit"></span>
        <span class="general-icon"><img src="../img/delete.svg" alt="Delete"></span>
      </td>
    `;
        tableBody.appendChild(row);
    });
}

function renderCategories(products) {
    const categoryContainer = document.getElementById('category');
    categoryContainer.innerHTML = '';

    const categorySet = new Set(products.map(p => p.category).filter(Boolean));

    // Thêm nút "All"
    const allBtn = document.createElement('button');
    allBtn.textContent = 'All';
    allBtn.className = 'category-btn';
    allBtn.addEventListener('click', () => renderTable(allProducts));
    categoryContainer.appendChild(allBtn);

    categorySet.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.className = 'category-btn';
        btn.addEventListener('click', () => {
            const filtered = allProducts.filter(p => p.category === cat);
            renderTable(filtered);
        });
        categoryContainer.appendChild(btn);
    });
}

document.addEventListener('DOMContentLoaded', fetchAndRenderProducts);
