let OrderItemMapper = require('../mappers/OrderItemMapper');

/**
 * Class describes a Order.
 * @class Order
 * @export
 */

class Order {
    /**
     * @constructor
     * @param {object} Instance of ShoppingCart
     */
    
    constructor(orderId, userId, orderDate, total) {
       this.orderId = orderId;
       this.userId = userId;
       this.orderDate = orderDate;
       this.total = total;
       this.isCompleted = false;
       this.orderItems = null;
    }

    getOrderItems(callback) {
        let self = this;
        OrderItemMapper.findAll(this.orderId, function(err, result) {
            self.orderItems = result;
            return callback(err, result);
        });
    }
}

module.exports = Order;
