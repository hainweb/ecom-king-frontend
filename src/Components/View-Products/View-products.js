import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL, IMG_URL } from '../Urls/Urls';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Slider } from './Slider'
import BestOfElectronic from './BestOfElectronic';
import ExploreMore from './ExploreMore';
import Footer from '../Footer/Footer';

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
        setCategories(response.data); // Adjust based on API response structure
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
        let data = response.data.products;
        console.log('pro res', response);

        const userdata = response.data.user;
        setUser(userdata);

        // Shuffle and limit to 6 products
        data = data.sort(() => Math.random() - 0.5).slice(0, 6);
        setProducts(data);
      } catch (err) {
        setErrorProducts('Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleWishlist = useCallback((event, productId) => {
    
    event.preventDefault();
    event.stopPropagation();
setWishlistLoadingId(productId)
    axios
      .get(`${BASE_URL}/add-to-Wishlist/${productId}`, { withCredentials: true })
      .then((response) => {
        console.log('res wish', response);

        if (response.data.status) {
          // Toggle the wishlist state for the product
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === productId ? { ...product, isInWishlist: !product.isInWishlist } : product
            )
          );
        }
      })
      .catch((err) => {
        console.error('Error updating wishlist:', err);
      })
      .finally(() => {
        setWishlistLoadingId(null); // Reset loading state
      });
  }, []);


  const addToCart = useCallback(
    async (productId) => {
      setAlreadycart('');  // Reset 'alreadycart' state
      setAddingToCartProductId(productId);  // Set the loading state for the product
      setAlreadycartproduct(productId);  // Set the product ID in the cart state

      axios
        .get(`${BASE_URL}/add-to-cart/${productId}`, { withCredentials: true })
        .then((response) => {
          if (response.data.status) {
            setCartCount((prevCount) => prevCount + 1);
          } else {
            setAlreadycart(response.data.message)

          }
        })
        .catch((error) => {
          console.error('Error:', error);
        })
        .finally(() => {
          setAddingToCartProductId(null);
        });
    },
    []  // Empty dependency array, meaning this function will not change
  );



  const truncateText = (text, length) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  return (
    

    <div className="transition-all  duration-300 ">

      <div className="py-2 mt-16 md:mt-20 bg-gray-100 dark:bg-gray-800">
        <Slider />
      </div>

      {/* Category List */}
      <div className="category-list py-8 bg-gray-100 dark:bg-gray-800">

        <div className="container mx-auto px-4">


          {loadingCategories ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            </div>
          ) : errorCategories ? (
            <div className="text-red-500 text-center">{errorCategories}</div>
          ) : (
            <div className="overflow-x-auto scrollbar-hidden">
              <div className="flex space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10 min-w-[10px] md:min-w-max">
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
                    <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{category.name}</h5>
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
                              className={`p-1  ${product.isInWishlist
                                ? "text-red-500 border-red-500"
                                : "text-gray-500 border-gray-300 dark:border-gray-600"
                                } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                            >
                              {wishlistLoadingId === product._id ?
                                <Heart
                                  className={`w-4 h-4 transition-all duration-300 ease-in-out fill-red-500 scale-115 animate-fadeInOut
                                  `}
                                />

                                :
                                <Heart
                                  className={`w-4 h-4 transition-all duration-300 ease-in-out ${product.isInWishlist
                                    ? "fill-current scale-115"
                                    : "scale-100"
                                    }`}
                                />
                              }
                            </button>
                          )}

                          {product.Quantity > 0 ? (
                            user ? (
                              <button
                                onClick={() => addToCart(product._id)}
                                className="flex justify-center items-center w-36 bg-indigo-600 text-white py-1.5 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium"
                              >
                                <ShoppingCart className="w-5 h-5" />
                                {addingToCartProductId === product._id ? (
                                  <span className="animate-pulse">Adding...</span>
                                ) : alreadycart ? (
                                  alreadycartproduct === product._id ? (
                                    <div>{alreadycart}</div>
                                  ) : (
                                    "Add to cart"
                                  )
                                ) : (
                                  "Add to cart"
                                )}
                              </button>
                            ) : (
                              <Link to="/login">
                                <button
                                  className="flex justify-center items-center w-36 bg-indigo-600 text-white py-1.5 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium"
                                >
                                  <ShoppingCart className="w-5 h-5" />
                                  Add to cart
                                </button>
                              </Link>
                            )
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
                                {wishlistLoadingId === product._id ?
                                  <Heart className="w-8 h-8 text-red-500 transition-all duration-300 ease-in-out animate-pulse" />
    
                                  :
                                  <Heart
                                    className={`w-4 h-4 transition-all duration-300 ease-in-out ${product.isInWishlist
                                      ? "fill-current scale-115"
                                      : "scale-100"
                                      }`}
                                  />
                                }
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
                    {user ?
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
                                <div>{alreadycart}</div>
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
                      :
                      <div className="px-3 pb-3">
                        <Link to={'/login'} >
                          <button
                            className="flex justify-center items-center w-full bg-indigo-600 text-white py-1.5 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Add to cart
                          </button>
                        </Link>
                      </div>
                    }
                  </div>
                ))}
              </div>
            </>
          )}
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
