let allProducts = []; // lưu toàn bộ sản phẩm để lọc lại

async function fetchAndRenderProducts() {
    try {
        const res = await fetch('http://localhost:3000/api/products');
        const products = await res.json();
        allProducts = products; // lưu toàn bộ sản phẩm ban đầu
        console.log('products Fetch', allProducts);

        renderTable(products);
        renderCategories(products);
        renderOnboard(products);
        renderOnboardCategory(products);

    } catch (err) {
        console.error('Error fetching products:', err);
    }
}

//Hien thi san pham
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

//Hien thi danh muc
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

function renderOnboard(products) {
    const tableBody = document.getElementById('tableBodyOnboard');
    tableBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td><input type="checkbox"></td>
      <td>${product.productId}</td>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td>${product.stock}</td>
    `;
        tableBody.appendChild(row);
    });
}

function renderOnboardCategory(products) {
    const categoryContainer = document.getElementById('categoryOnboard');
    categoryContainer.innerHTML = '';

    const categorySet = new Set(products.map(p => p.category).filter(Boolean));

    // Thêm nút "All"
    const allBtn = document.createElement('button');
    allBtn.textContent = 'All';
    allBtn.className = 'category-btn';
    allBtn.addEventListener('click', () => renderOnboard(allProducts));
    categoryContainer.appendChild(allBtn);

    categorySet.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.className = 'category-btn';
        btn.addEventListener('click', () => {
            const filtered = allProducts.filter(p => p.category === cat);
            renderOnboard(filtered);
        });
        categoryContainer.appendChild(btn);
    });
}

document.addEventListener('DOMContentLoaded', fetchAndRenderProducts);

//Them san pham moi vao DB
function addProduct() {
    const productId = document.getElementById('productId').value.trim();
    const name = document.getElementById('name').value.trim();
    const category = document.getElementById('categoryForm').value.trim();
    const price = parseFloat(document.getElementById('price').value.trim());
    const stock = parseInt(document.getElementById('stock').value.trim());
    const supplier = document.getElementById('supplier').value.trim();
    const expirationDate = document.getElementById('expirationDate').value.trim();

    if(!productId || !name || !category || isNaN(price) || isNaN(stock) || !supplier || !expirationDate) {
        alert('all fields are required');
    }
    fetch('http://localhost:3000/api/products', {
        method : 'POST',
        headers: { "Content-Type": "application/json" },
        body : JSON.stringify({productId, name, category, price, stock, supplier, expirationDate}),
    })
    .then(response => {
        if(response.ok) {
            document.getElementById('productId').value = '';
            document.getElementById('name').value = '';
            document.getElementById('category').value = '';
            document.getElementById('price').value = '';
            document.getElementById('stock').value = '';
            document.getElementById('supplier').value = '';
            document.getElementById('expirationDate').value = '';
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalProducts"));
            modal.hide();
            fetchAndRenderProducts();
            alert('add success!');
        } else {
            alert("Failed to add account.");
        }
    });
}

