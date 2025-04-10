document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('checkoutBtn').addEventListener("click", async () => {
        try {
            // 🔹 Lấy danh sách sản phẩm từ bảng HTML
            let items = [];
            document.querySelectorAll("#productTable tbody tr").forEach(row => {
                let productId = row.cells[0].innerText.trim();
                let productName = row.cells[1].innerText.trim();
                let unitPrice = parseFloat(row.cells[2].innerText.replace(/[^0-9.-]+/g, ""));
                let quantity = parseInt(row.cells[3].innerText);
                let totalPrice = parseFloat(row.cells[4].innerText.replace(/[^0-9.-]+/g, ""));

                if (productId && productName && !isNaN(unitPrice) && !isNaN(quantity) && !isNaN(totalPrice)) {
                    items.push({ productId, productName, unitPrice, quantity, totalPrice });
                }
            });

            // 🔹 Lấy thông tin thanh toán từ giao diện
            let totalAmount = parseFloat(document.getElementById("totalAmountText").innerText.replace(/[^0-9.-]+/g, ""));
            let customerPaid = parseFloat(document.getElementById("customerPaidText").innerText.replace(/[^0-9.-]+/g, ""));
            let createdAt = new Date(document.getElementById("dateText").innerText.trim());

            // 🔹 Lấy thông tin nhân viên từ localStorage hoặc API backend (giả định đã lưu khi đăng nhập)
            let employeeId = localStorage.getItem("employeeId"); // Thay bằng cách lấy từ backend nếu cần
            let employeeName = localStorage.getItem("employeeName");

            // 🔹 Tính tiền thối lại
            let change = customerPaid - totalAmount;

            // 🔹 Tạo object hóa đơn
            let invoiceData = {
                invoiceCode: "HD" + new Date().getTime(), // Tạo mã hóa đơn tự động
                createdAt,
                employeeId,
                employeeName,
                items,
                totalAmount,
                paymentMethod: "Chuyển khoản", // Có thể thay đổi theo UI
                customerPaid,
                change
            };

            // 🔹 Gửi dữ liệu lên API
            let response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(invoiceData)
            });

            let result = await response.json();

            if (response.ok) {
                alert("✅ Hóa đơn đã được lưu thành công!");
                console.log(result);
            } else {
                alert("❌ Lỗi khi lưu hóa đơn: " + result.message);
            }
        } catch (error) {
            console.error("❌ Lỗi xử lý hóa đơn:", error);
            alert("❌ Đã xảy ra lỗi, vui lòng thử lại.");
        }
    });

})
