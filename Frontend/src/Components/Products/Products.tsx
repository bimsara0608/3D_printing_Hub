import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "./../ProductCards/ProductCard";
import ProductDetails from "./../ProductDetails/ProductDetails";
import { useAuth } from "../../Hooks/AuthContext";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  const { authState } = useAuth();
  const { status } = authState;

  interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    sellerName: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/product/view");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        console.log("Fetched products:", data); // Log the response data
        setProducts(data); // Save the fetched data into `products` state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    if (status !== "customer") {
      navigate("/user/register");
    } else {
      setSelectedProduct(product);
    }
  };

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesPrice =
      product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (${priceRange.min} - ${priceRange.max})
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Freelancers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No products found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onShowDetails={() => handleProductClick(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default Products;
