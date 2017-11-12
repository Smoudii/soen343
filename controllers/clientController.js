module.exports = {
    addToShoppingCart: function(req, res) {
        let modelNumber = req.body.model;
        let type = req.body.type;
        req.clientUser.shoppingcart.addToCart(modelNumber, type, function(err, data) {
        });
    },

    deleteFromShoppingCart: function(req, res) {
        let serialNumber = req.params.id;
        req.clientUser.shoppingcart.removeFromCart(serialNumber, function(err, data) {
            res.redirect(req.get('referer'));
        });
    },

    viewShoppingCart: function(req, res) {
        req.flash('error_msg',"TEST!");
        let data = req.clientUser.shoppingcart.cart;
        let total = req.clientUser.shoppingcart.getTotal();
        res.render('client/shoppingCart', {
            data: data,
            total: total,
        });
    },

    makePurchase: function(req, res) {
        req.clientUser.makePurchase(function(err, result) {
            res.redirect(req.get('referer'));
        });
    },

    confirmPurchase: function(req, res) {

    },

    viewOrders: function(req, res) {
        req.clientUser.orderCatalog.getOrders(req.clientUser.id, function(err, result) {
            res.render('client/orders', {
                data: result,
            });
        });
    },

    viewOrderDetails: function(req, res) {
        let orderId = req.params.id;
        req.clientUser.orderCatalog.getOrderDetails(orderId, function(err, result) {
            console.log(result);
            res.render('client/orderDetails', {
                data: result,
            });
        });
    },

    returnItem: function(req, res) {
        let orderItemId = req.params.id;
        req.clientUser.returnItem(orderItemId, function(err, result) {
            console.log(result);
            res.redirect(req.get('referer'));
        });
    },
};
