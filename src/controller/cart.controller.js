
import User from '../models/user.js';
import Product from '../models/product.js';

export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex > -1) {
      // Product already in cart, update quantity
      user.cart[cartItemIndex].quantity += quantity || 1;
    } else {
      // Product not in cart, add it
      user.cart.push({ product: productId, quantity: quantity || 1 });
    }

    await user.save();
    await user.populate('cart.product');
    res.status(200).json({ message: 'Product added to cart successfully', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('cart.product');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = user.cart.filter(item => item.product.toString() !== productId);

    await user.save();
    await user.populate('cart.product');
    res.status(200).json({ message: 'Product removed from cart successfully', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateCartQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity = quantity;
      if (user.cart[cartItemIndex].quantity <= 0) {
        user.cart.splice(cartItemIndex, 1);
      }
    } else {
        return res.status(404).json({ message: 'Product not found in cart' });
    }

    await user.save();
    await user.populate('cart.product');
    res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
