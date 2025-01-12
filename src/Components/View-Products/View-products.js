import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Urls/Urls';
import { Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

const Slider = lazy(() => import('./Slider'));
const BestOfElectronic = lazy(() => import('./BestOfElectronic'));
const ExploreMore = lazy(() => import('./ExploreMore'));
const Footer = lazy(() => import('../Footer/Footer'));

const ProductAndCategoryList = ({ setCartCount }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState({ products: true, categories: true });
  const [errors, setErrors] = useState({ products: null, categories: null });
  const [addingToCartProductId, setAddingToCartProductId] = useState(null);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
  const [alreadycart, setAlreadycart] = useState('');
  const [alreadycartproduct, setAlreadycartproduct] = useState('');

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, productRes] = await Promise.all([
          axios.get(`${BASE_URL}/get-categories`),
          axios.get(`${BASE_URL}/products`, { withCredentials: true }),
        ]);

        setCategories(categoryRes.data);
        setUser(productRes.data.user);
        setProducts(
          productRes.data.products.sort(() => Math.random() - 0.5).slice(0, 6)
        );
      } catch (err) {
        setErrors({
          categories: 'Failed to load categories',
          products: 'Failed to load products',
        });
      } finally {
        setLoading({ products: false, categories: false });
      }
    };

    fetchData();
  }, []);

  const toggleWishlist = useCallback(
    async (event, productId) => {
      event.preventDefault();
      setWishlistLoadingId(productId); // Optional: show loading for specific product

      try {
        const response = await axios.get(`${BASE_URL}/add-to-Wishlist/${productId}`, { withCredentials: true });
        if (response.data.status) {
          // Toggle the wishlist state for the product
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === productId
                ? { ...product, isInWishlist: !product.isInWishlist }
                : product
            )
          );
        }
      } catch (err) {
        console.error('Error updating wishlist:', err);
      } finally {
        setWishlistLoadingId(null); // Reset loading state
      }
    },
    []
  );


  const addToCart = useCallback(
    async (productId) => {
      setAlreadycart('')
      setAddingToCartProductId(productId);

      setAlreadycartproduct(productId);
      try {
        const response = await axios.get(`${BASE_URL}/add-to-cart/${productId}`, { withCredentials: true });
        if (response.data.status) {
          setCartCount((prevCount) => prevCount + 1);
        } else {
          setAlreadycart(response.data.message)
        }
      } catch (err) {
        console.error('Error adding to cart:', err);
      } finally {
        setAddingToCartProductId(null);
      }
    },
    [setCartCount]
  );

  const truncateText = (text, length) => (text.length > length ? `${text.substring(0, length)}...` : text);

  const loadingPlaceholder = useMemo(
    () => (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    ),
    []
  );

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

        </div>
      </div>

      {/* Suggested Products */}

      <section className="bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 capitalize">
            Suggested Products
          </h1>


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
                            className={`p-1  ${product.isInWishlist
                              ? "text-red-500 border-red-500"
                              : "text-gray-500 border-gray-300 dark:border-gray-600"
                              } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                          >
                            <Heart
                              className={`w-4 h-4 transition-all duration-300 ease-in-out ${product.isInWishlist
                                ? "fill-current scale-115"
                                : "scale-100"
                                }`}
                            />
                          </button>

                        )}

                        {product.Quantity > 0 ? (
                          <button
                            onClick={() => addToCart(product._id)}
                            className="flex justify-center items-center w-36 bg-indigo-600 text-white py-1.5 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium"
                          >
                            <ShoppingCart className="w-5 h-5" />
                            {addingToCartProductId === product._id ? (
                              <span className="animate-pulse">Adding...</span>
                            ) : alreadycart ? (
                              alreadycartproduct === product._id ? (
                                <div > {alreadycart}</div>
                              ) : (
                                'Add to cart'
                              )
                            ) : (
                              'Add to Cart'
                            )}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-gray-300 text-gray-600 py-2 px-4 rounded-lg cursor-not-allowed text-sm"
                          >
                            Out of Stock
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile: 2 column grid */}
            <div className="md:hidden grid grid-cols-2 gap-4">
              {products.map((product) => (
                <div
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
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
                        {/* Wishlist button overlay on image for mobile */}
                        {user && (
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              toggleWishlist(event, product._id);
                            }}
                            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 transition-colors duration-300 shadow-md"
                          >
                            <div className={`p-1  ${product.isInWishlist
                              ? "text-red-500 border-red-500"
                              : "text-gray-500 border-gray-300 dark:border-gray-600"
                              } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
                              <Heart
                                className={`w-4 h-4 transition-all duration-300 ease-in-out ${product.isInWishlist
                                  ? "fill-current scale-115"
                                  : "scale-100"
                                  }`}
                              />
                            </div>
                          </button>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          {truncateText(product.Name, 20)}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                          {product.Description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-bold text-sm">₹{product.Price.toLocaleString()}</span>
                          {product.SellingPrice > product.Price && (
                            <span className="text-gray-500 line-through text-xs">
                              ₹{product.SellingPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="px-3 pb-3">
                    {product.Quantity > 0 ? (
                      <button
                        onClick={() => addToCart(product._id)}
                        className="flex justify-center items-center w-full bg-indigo-600 text-white py-1.5 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        {addingToCartProductId === product._id ? (
                          <span className="animate-pulse">Adding...</span>
                        ) : alreadycart ? (
                          alreadycartproduct === product._id ? (
                            <div> {alreadycart}</div>
                          ) : (
                            'Add to cart'
                          )
                        ) : (
                          'Add to Cart'
                        )}
                      </button>

                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-600 py-1.5 px-3 rounded-lg cursor-not-allowed text-xs font-medium"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>


        </div>
      </section>

      <BestOfElectronic />

      <section className="bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 capitalize">
            Expolre products
          </h1>
          <ExploreMore />
        </div>
      </section>

      <Footer />

    </div>
  );
};

export default ProductAndCategoryList;
