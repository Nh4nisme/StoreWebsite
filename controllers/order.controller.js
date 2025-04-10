const Order = require('../models/orders.model');

// Tạo hóa đơn mới
exports.createOrder = async (req, res) => {
    try {
        const {
            invoiceCode,
            createdAt,
            employeeId,
            employeeName,
            items,
            totalAmount,
            paymentMethod,
            customerPaid,
            change
        } = req.body;

        if (!invoiceCode || !createdAt || !employeeId || !employeeName || !items || items.length === 0) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
        }

        const newOrder = new Order({
            invoiceCode,
            createdAt,
            employeeId,
            employeeName,
            items,
            totalAmount,
            paymentMethod,
            customerPaid,
            change
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ message: 'Tạo hóa đơn thành công.', order: savedOrder });
    } catch (err) {
        console.error('Lỗi khi tạo hóa đơn:', err);
        res.status(500).json({ message: 'Lỗi máy chủ.', error: err.message });
    }
};


exports.getOrder = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'An error occurred while fetching orders.' });
    }
};

exports.totalSale = async (req, res) => {
    try {
        const result = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: '$items.quantity' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalQuantity: 1
                }
            }
        ]);

        res.status(200).json(result[0] || { totalQuantity: 0 });
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: 'server error' });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const deleteOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deleteOrder) {
            return res.status(404).json({ message: 'order not found.' });
        }
        res.status(200).json({ message: 'order deleted successfully.' });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'An error occurred while deleting the order.' })
    }
}
