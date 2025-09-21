
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";


export type Product = {
  name: string;
  sold: number;
  revenue: number;
};

interface TopProductsProps {
    products: Product[];
}

const productColors = [
    "bg-[#9b59b6]",
    "bg-[#e91e63]",
    "bg-[#3498db]",
    "bg-[#2980b9]",
    "bg-[#1abc9c]",
]

export function TopProducts({ products }: TopProductsProps) {
  const sortedProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const maxSold = sortedProducts.length > 0 ? Math.max(...sortedProducts.map(p => p.sold)) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Clock className="h-5 w-5" />
          Top Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedProducts.map((product, index) => (
          <div key={product.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <p className="font-medium">{product.name}</p>
              <p className="text-muted-foreground">{product.sold} sold</p>
            </div>
            <div className="flex items-center gap-4">
              <Progress 
                value={maxSold > 0 ? (product.sold / maxSold) * 100 : 0} 
                className="h-2 flex-1"
                indicatorClassName={cn(productColors[index % productColors.length])}
              />
              <p className="text-sm font-semibold text-right w-20">₹{product.revenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
