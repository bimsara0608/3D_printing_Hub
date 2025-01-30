import { User } from "lucide-react";

interface ProductCardProps {
    product: any;
    onShowDetails: (product: any) => void;
}

export default function ProductCard({
    product,
    onShowDetails,
}: ProductCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden group">
            <div
                className="relative cursor-pointer"
                onClick={() => onShowDetails(product)}
            >
                <img
                    src={
                        "http://localhost:3000/product/image/" +
                        product.id +
                        "." +
                        product.format
                    }
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-md">
                        View Details
                    </span>
                </div>
            </div>
            <div className="p-4">
                <h1
                    className="text-lg font-semibold cursor-pointer hover:text-indigo-600"
                    onClick={() => onShowDetails(product)}
                >
                    {product.name}
                </h1>
                
                <h5 className="font-semibold flex items-center">
                <span className="mr-2 py-2">
                    <User />
                </span>
                {product.sellerName}
                </h5>
                <p className="text-gray-600 mt-1">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-indigo-600">
                        ${product.price.toFixed(2)}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onShowDetails(product);
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Inquire Now
                    </button>
                </div>
            </div>
        </div>
    );
}
