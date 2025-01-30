import { motion } from "framer-motion";
import { Card, CardContent } from "./../Card/Card";
import PLA from "./../../assets/PLA_Material.jpg";
import ABS from "./../../assets/ABS_Material.jpg";
import PTEG from "./../../assets/PETG_Material.jpg";
import TPU from "./../../assets/TPU_Material.jpg";
import Resin from "./../../assets/Resian_Material.jpg";

interface MaterialPreviewProps {
  material: string;
}

const materialInfo = {
  PLA: {
    image: PLA,
    description:
      "Biodegradable and easy to print. Perfect for prototypes and decorative items.",
    properties: ["Biodegradable", "Strong", "Easy to print", "Low cost"],
    colors: ["Natural", "White", "Black", "Blue", "Red", "Green", "Yellow"],
    temperature: "180-220°C",
    strength: "Medium",
  },
  ABS: {
    image: ABS,
    description:
      "Durable and impact resistant. Ideal for functional parts and prototypes.",
    properties: [
      "Durable",
      "Heat resistant",
      "Impact resistant",
      "Acetone smoothing",
    ],
    colors: ["Natural", "White", "Black", "Custom colors"],
    temperature: "220-250°C",
    strength: "High",
  },
  PETG: {
    image: PTEG,
    description:
      "Food safe and water resistant. Great for containers and mechanical parts.",
    properties: [
      "Food safe",
      "Water resistant",
      "Chemical resistant",
      "Flexible",
    ],
    colors: ["Clear", "White", "Black", "Blue", "Custom colors"],
    temperature: "230-250°C",
    strength: "High",
  },
  TPU: {
    image: TPU,
    description:
      "Flexible and elastic. Perfect for parts that need to bend or compress.",
    properties: [
      "Flexible",
      "Elastic",
      "Abrasion resistant",
      "Chemical resistant",
    ],
    colors: ["Natural", "Black", "Custom colors"],
    temperature: "210-230°C",
    strength: "Medium",
  },
  Resin: {
    image: Resin,
    description:
      "High detail and smooth surface finish. Ideal for miniatures and jewelry.",
    properties: ["High detail", "Smooth finish", "UV resistant", "Isotropic"],
    colors: ["Clear", "White", "Black", "Custom colors"],
    temperature: "UV Curing",
    strength: "Medium to High",
  },
} as const;

export default function MaterialPreview({ material }: MaterialPreviewProps) {
  const info = materialInfo[material as keyof typeof materialInfo];

  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4"
    >
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={info.image}
                alt={`${material} material`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {material} Properties
                </h3>
                <p className="text-gray-600 mt-1">{info.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Key Features:</h4>
                <ul className="mt-2 grid grid-cols-2 gap-2">
                  {info.properties.map((property, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2" />
                      {property}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Print Temperature
                  </h4>
                  <p className="text-gray-600 mt-1">{info.temperature}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Strength</h4>
                  <p className="text-gray-600 mt-1">{info.strength}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Available Colors</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {info.colors.map((color, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
