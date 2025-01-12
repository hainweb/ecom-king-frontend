import React, { useEffect, useState, useCallback, lazy } from 'react';
import axios from 'axios';
import { BASE_URL, IMG_URL } from '../Urls/Urls';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';

const Slider = lazy(() => import('./Slider'));
const BestOfElectronic = lazy(() => import('./BestOfElectronic'));
const ExploreMore = lazy(() => import('./ExploreMore'));
const Footer = lazy(() => import('../Footer/Footer'));

const ProductAndCategoryList = ({ setCartCount }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [errorCategories, setErrorCategories] = useState(null);
  const [addingToCartProductId, setAddingToCartProductId] = useState(null);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
  const [alreadycart, setAlreadycart] = useState('');
  const [alreadycartproduct, setAlreadycartproduct] = useState('');

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get-categories`);
        setCategories(response.data);
      } catch (err) {
        setErrorCategories('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products`, { withCredentials: true });
        const data = response.data.products;
        const userdata = response.data.user;
        setUser(userdata);

        // Shuffle and limit to 6 products
        setProducts(data.sort(() => Math.random() - 0.5).slice(0, 6));
      } catch (err) {
        setErrorProducts('Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleWishlist = useCallback(
    async (event, productId) => {
      event.preventDefault();
      setWishlistLoadingId(productId);

      try {
        const response = await axios.get(`${BASE_URL}/add-to-Wishlist/${productId}`, { withCredentials: true });
        if (response.data.status) {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === productId ? { ...product, isInWishlist: !product.isInWishlist } : product
            )
          );
        }
      } catch (err) {
        console.error('Error updating wishlist:', err);
      } finally {
        setWishlistLoadingId(null);
      }
    },
    []
  );

  const addToCart = useCallback(
    async (productId) => {
      setAlreadycart('');
      setAddingToCartProductId(productId);
      setAlreadycartproduct(productId);

      try {
        const response = await axios.get(`${BASE_URL}/add-to-cart/${productId}`, { withCredentials: true });
        if (response.data.status) {
          setCartCount((prevCount) => prevCount + 1);
        } else {
          setAlreadycart(response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setAddingToCartProductId(null);
      }
    },
    [setCartCount]
  );

  const truncateText = (text, length) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  return (
    <div className="transition-all duration-300 mt-5">
      <div className="py-2 mt-16 bg-gray-100 dark:bg-gray-800">
        <Slider />
      </div>

      {/* Category List */}
      <div className="category-list py-8 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="overflow-x-auto scrollbar-hidden">
            <div className="flex space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10 min-w-max">
              {categories.map((category) => (
                <Link
                  to={`category/${category.linkTo}`}
                  key={category.id} // Replace `id` with the actual unique identifier from the API
                  className="category-item text-center inline-block transition-transform transform hover:scale-105 hover:shadow-lg rounded-lg bg-white dark:bg-gray-700 p-4"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-contain mb-2 rounded-md"
                  />
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{category.name}</h4>
                </Link>
              ))}
            </div>
          </div>

          {loadingCategories ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            </div>
          ) : errorCategories ? (
            <div className="text-red-500 text-center">{errorCategories}</div>
          ) : (
            <div className="overflow-x-auto scrollbar-hidden">
              <div className="flex space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10 min-w-max">
                {categories.map((category) => (
                  <Link
                    to={`category/${category.linkTo}`}
                    key={category.id} // Replace `id` with the actual unique identifier from the API
                    className="category-item text-center inline-block transition-transform transform hover:scale-105 hover:shadow-lg rounded-lg bg-white dark:bg-gray-700 p-4"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="object-contain mb-2 rounded-md"
                    />
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{category.name}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Products */}
      <section className="bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 capitalize">
            Suggested Products
          </h1>

          {loadingProducts ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            </div>
          ) : errorProducts ? (
            <div className="text-red-500 text-center">{errorProducts}</div>
          ) : (
            <>
              {/* Desktop: Horizontal scroll */}
              <div className="hidden md:block overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                  {products.map((product) => (
                    <div
                      className="w-56 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                      key={product._id}
                    >
                      <Link to={`/product/${product._id}`}>
                        <div className="rounded-lg overflow-hidden">
                          <div className="relative pt-[100%]">
                            <img
                              className="absolute top-0 left-0 w-full h-full object-cover"
                              alt={product.Name}
                              src={product.thumbnailImage}
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                              {truncateText(product.Name, 20)}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                              {product.Description}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600 font-bold">₹{product.Price.toLocaleString()}</span>
                              {product.SellingPrice > product.Price && (
                                <span className="text-gray-500 line-through text-sm">
                                  ₹{product.SellingPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className="p-3">
                        <div className="flex justify-between items-center">
                          {user && (
                            <button
                              onClick={(event) => toggleWishlist(event, product._id)}
                              className="relative p-2 rounded-full transition-colors duration-300"
                            >
                              <i
                                className={`fas fa-heart text-lg ${product.isInWishlist
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-gray-600 dark:text-gray-400'}`}
                              />
                              {wishlistLoadingId === product._id && (
                                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-25 rounded-full"></div>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => addToCart(product._id)}
                            className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {addingToCartProductId === product._id ? (
                              <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-white"></div>
                            ) : (
                              <ShoppingCart size={18} />
                            )}
                          </button>
                        </div>
                        {alreadycartproduct === product._id && (
                          <div className="text-red-500 text-xs">{alreadycart}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile: Vertical scroll */}
              <div className="md:hidden overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                  {products.map((product) => (
                    <div
                      className="w-56 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                      key={product._id}
                    >
                      <Link to={`/product/${product._id}`}>
                        <div className="rounded-lg overflow-hidden">
                          <div className="relative pt-[100%]">
                            <img
                              className="absolute top-0 left-0 w-full h-full object-cover"
                              alt={product.Name}
                              src={product.thumbnailImage}
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                              {truncateText(product.Name, 20)}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                              {product.Description}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600 font-bold">₹{product.Price.toLocaleString()}</span>
                              {product.SellingPrice > product.Price && (
                                <span className="text-gray-500 line-through text-sm">
                                  ₹{product.SellingPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className="p-3">
                        <div className="flex justify-between items-center">
                          {user && (
                            <button
                              onClick={(event) => toggleWishlist(event, product._id)}
                              className="relative p-2 rounded-full transition-colors duration-300"
                            >
                              <i
                                className={`fas fa-heart text-lg ${product.isInWishlist
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-gray-600 dark:text-gray-400'}`}
                              />
                              {wishlistLoadingId === product._id && (
                                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-25 rounded-full"></div>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => addToCart(product._id)}
                            className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {addingToCartProductId === product._id ? (
                              <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-white"></div>
                            ) : (
                              <ShoppingCart size={18} />
                            )}
                          </button>
                        </div>
                        {alreadycartproduct === product._id && (
                          <div className="text-red-500 text-xs">{alreadycart}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <BestOfElectronic />
      <ExploreMore />
      <Footer />
    </div>
  );
};

export default ProductAndCategoryList;
