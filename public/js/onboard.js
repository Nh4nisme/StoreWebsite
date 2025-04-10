function searchOnboard() {
    const searchTerm = document.getElementById("searchOnboardText").value.toLowerCase().trim();
    const tableRows = document.querySelectorAll("#tableBodyOnboard tr");

    // Hiển thị lại tất cả các dòng trước khi tìm
    tableRows.forEach(row => {
        row.style.display = "";
    });

    // Nếu không nhập gì thì thoát
    if (searchTerm === "") return;

    tableRows.forEach(row => {
        const productId = row.cells[0].textContent.toLowerCase();
        const name = row.cells[1].textContent.toLowerCase();
        const dateExp = row.cells[2].textContent.toLowerCase();
        const stock = row.cells[3].textContent.toLowerCase();

        const matchesSearch =
            productId.includes(searchTerm) ||
            name.includes(searchTerm) ||
            dateExp.includes(searchTerm) ||
            stock.includes(searchTerm);

        row.style.display = matchesSearch ? "" : "none";
    });
}
// Cập nhật tổng tiền hóa đơn
function updateInvoiceTotal() {
    const invoiceTableBody = document.getElementById('invoiceTableBody');
    let total = 0;

    Array.from(invoiceTableBody.rows).forEach(row => {
        const rowTotal = parseFloat(row.cells[4].textContent);
        total += rowTotal;
    });

    document.getElementById('invoiceTotal').textContent = total.toFixed(2) + ' VND';
}

// Cập nhật tổng số lượng hóa đơn
function updateInvoiceAmount() {
    const invoiceTableBody = document.getElementById('invoiceTableBody');
    let amount = 0;

    Array.from(invoiceTableBody.rows).forEach(row => {
        const rowAmount = parseInt(row.cells[3].textContent); // Số lượng
        amount += rowAmount;
    });

    document.getElementById('invoiceTotalAction').textContent = amount;
}

// Hiển thị ngày hóa đơn
function displayInvoiceDate() {
    const now = new Date();

    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    document.getElementById('invoiceDate').textContent = formattedDate;
}

// Thêm sản phẩm vào hóa đơn
function addToInvoice(productId, name, price, quantity, total) {
    const invoiceTableBody = document.getElementById('invoiceTableBody');

    // Kiểm tra nếu sản phẩm đã có trong hóa đơn
    const existingRow = Array.from(invoiceTableBody.rows).find(row => row.cells[0].textContent === productId);

    if (existingRow) {
        // Nếu sản phẩm đã có, cập nhật số lượng và tổng tiền
        const currentQty = parseInt(existingRow.cells[3].textContent);
        const newQty = currentQty + quantity;
        existingRow.cells[3].textContent = newQty;
        existingRow.cells[4].textContent = newQty * price;
    } else {
        // Nếu sản phẩm chưa có trong hóa đơn, thêm mới
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${productId}</td>
            <td>${name}</td>
            <td>${price}</td>
            <td>${quantity}</td>
            <td>${total}</td>
            <td><button class="btn btn-sm btn-danger remove-from-invoice-btn" data-id="${productId}">Remove</button></td>
        `;
        invoiceTableBody.appendChild(row);
    }

    // Cập nhật tổng tiền và số lượng
    updateInvoiceTotal();
    updateInvoiceAmount();
    displayInvoiceDate();

    // Đảm bảo nút Remove hoạt động sau khi thêm sản phẩm
    attachRemoveEvent();
}

// Gắn sự kiện cho các nút Remove trong bảng hóa đơn
function attachRemoveEvent() {
    document.querySelectorAll('.remove-from-invoice-btn').forEach(button => {
        button.addEventListener('click', event => {
            const row = event.target.closest('tr');
            row.remove(); // Xóa dòng khỏi bảng hóa đơn

            // Cập nhật lại tổng tiền và số lượng sau khi xóa
            updateInvoiceTotal();
            updateInvoiceAmount();
        });
    });
}