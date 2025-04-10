async function Checkout() {
    const employeeIdInput = document.getElementById("employeeIdInput").value.trim();
    if (!employeeIdInput) {
        alert("nhap ma nhan vien");
        return;
    }

    let employeeName = "";
    try {
        const res = await fetch(`http://localhost:3000/api/employees/check/${employeeIdInput}`);
        const data = await res.json();

        if (!res.ok || !data.exists) {
            alert("Khong tim thay nhan vien");
            return;
        }

        employeeName = data.employee.name;
    } catch (err) {
        console.error("loi ktra nv", err);
        alert("loi ktra nv");
        return;
    }

    const invoiceTableBody = document.getElementById("invoiceTableBody");
    const rows = invoiceTableBody.querySelectorAll("tr");

    const items = [];
    let totalAmount = 0;

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const productId = cells[0].innerText;
        const productName = cells[1].innerText;
        const unitPrice = parseFloat(cells[2].innerText);
        const quantity = parseInt(cells[3].innerText);
        const totalPrice = parseFloat(cells[4].innerText);

        items.push({ productId, productName, unitPrice, quantity, totalPrice });
        totalAmount += totalPrice;
    });

    const customerPaid = parseFloat(document.getElementById("customerPaidInput").value || 0);
    const date = new Date();

    const order = {
        invoiceCode: "HD" + Date.now(),
        createdAt: date,
        employeeId: employeeIdInput,
        employeeName: employeeName,
        items: items,
        totalAmount: totalAmount,
        paymentMethod: "Tiền mặt",
        customerPaid: customerPaid,
        change: customerPaid - totalAmount
    };

    try {
        const response = await fetch("http://localhost:3000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });

        const result = await response.json();

        if (response.ok) {
            alert("done");
            // Reset giao diện
            document.getElementById("invoiceTableBody").innerHTML = "";
            document.getElementById("customerPaidInput").value = "";
            document.getElementById("invoiceTotal").innerText = "0 VND";
            document.getElementById("invoiceTotalAction").innerText = "0";
            document.getElementById("invoiceDate").innerText = "";
            document.getElementById("employeeIdInput").value = "";
        } else {
            alert("Lỗi: " + result.message);
        }
    } catch (err) {
        console.error("Lỗi:", err);
        alert("loi tao hoa don");
    }
}