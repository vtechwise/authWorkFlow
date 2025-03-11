const { NotFoundError, BadRequestError } = require("../errors");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const { StatusCodes } = require("http-status-codes");
const {checkPermission} = require('../utils')


const fakeStripAPI = async ({ amount, currency })=>{
    const clientSecret = 'someRandom'
    return {clientSecret, amount }
}

const createOrder = async (req, res) => {
  const { items: cartItems, shippingFee, tax } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new NotFoundError("   No cart item found");
  }
  if (!shippingFee) {
    throw new BadRequestError("Please provide shipping fee");
  }
  if (!tax) {
    throw new BadRequestError("Please provide tax amount");
  }

  let orderItems = [];
  let subTotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new NotFoundError(`No product withe the given id: ${item.product}`);
    }
    const { name, image, price, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
      orderItems = [...orderItems, singleOrderItem];
      subTotal += price * item.amount
    }
     const total = shippingFee + tax + subTotal
      const paymentIntentId = await fakeStripAPI({
          amount: total,
          currency:'usd'
      })
    const order =await Order.create({
        tax,
        shippingFee,
        total,
        subTotal,
        orderItems,
        user: req.user.userId,
        clientSecret:paymentIntentId.clientSecret,
    })
  res.status(StatusCodes.CREATED).json({order,clientSecret:order.clientSecret});
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({orders})
  res.send("get all orders");
};
const getSingleOrder = async (req, res) => {
  const { id: OrderId } = req.params
  const order = await Order.findOne({ _ud: OrderId })
  if (!order) {
    throw new NotFoundError(`no order with the given id ${OrderId}`)
  }
  checkPermission(req.user, order.user)
  res.status(StatusCodes.OK).json({order});
};
const getCurrentUserOrders = async (req, res) => {
  const id = req.user.userId
  const orders = await Order.find({ user: id })
  
  res.status(StatusCodes.OK).json({orders,count:orders.length});
};

const updateOrders = async (req, res) => {
  const { id: orderId } = req.params
  const { paymentIntentId } = req.body
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new NotFoundError(`No order with the given id ${orderId}`)
  }
  checkPermission(req.user, order.user)
  order.paymentIntentId = paymentIntentId 
  order.status = 'Paid'

  await order.save()
  res.status(StatusCodes.OK).json({order});
};

module.exports = {
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  createOrder,
  updateOrders,
};
