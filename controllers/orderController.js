class OrderController {
  constructor(
    orderModel,
    userModel,
    orderedDesignModel,
    userAddressModel,
    designModel,
    colourModel
  ) {
    this.orderModel = orderModel;
    this.userModel = userModel;
    this.orderedDesignModel = orderedDesignModel;
    this.userAddressModel = userAddressModel;
    this.designModel = designModel;
    this.colourModel = colourModel;
  }

  // //Retrieve all orders
  async getAllOrders(req, res) {
    console.log(this.orderModel);
    try {
      const output = await this.orderModel.findAll({
        include: [{ model: this.userAddressModel, as: delivery_address }],
      });
      return res.json(output);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Retrieve specific order
  async getOneOrder(req, res) {
    const { orderId } = req.params;
    try {
      const order = await this.orderModel.findByPk(orderId);
      return res.json(order);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  //Add one order, function to add to order_designs still required
  async addOneOrder(req, res) {
    const { userId, totalPrice, deliveryAddress } = req.body;

    try {
      const [userAddress, created] = await this.userAddressModel.findOrCreate({
        where: { address: deliveryAddress, user_id: userId },
        defaults: {
          type: "mailing",
        },
      });
      const order = await this.orderModel.create({
        total_price: totalPrice,
        delivery_address: userAddress.id,
        user_id: userId,
        status: "pending",
      });

      // this updates ordered_design table with design_id = 1, colour_id = 2, quantity = 3
      await order.setDesigns(1, {
        through: { colourId: 2, quantity: 3 },
      });

      return res.json(order);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = OrderController;
