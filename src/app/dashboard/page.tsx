
"use client";

import { useState, useEffect } from "react";
import { OnboardingStepper } from "@/components/onboarding-stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUp, Users, CreditCard, Activity, Edit, PlusCircle, IndianRupee } from "lucide-react";
import { DashboardCharts } from "@/components/dashboard-charts";
import Link from "next/link";
import { SidebarTrigger } from "@/components/app-sidebar";
import { TopProducts, type Product } from "@/components/top-products";
import { Textarea } from "@/components/ui/textarea";

const initialProducts: Product[] = [
    { name: 'Blue Pottery Vase', sold: 45, revenue: 22500 },
    { name: 'Handwoven Silk Saree', sold: 25, revenue: 75000 },
    { name: 'Wooden Elephant Statue', sold: 60, revenue: 30000 },
    { name: 'Pattachitra Painting', sold: 15, revenue: 45000 },
    { name: 'Meenakari Earrings', sold: 80, revenue: 40000 },
];

export default function DashboardPage() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', sold: '', revenue: '' });
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // We assume a new user is one that hasn't completed onboarding.
        // In a real app, this would be determined from user data.
        if (typeof window !== 'undefined') {
            const isNewUser = !localStorage.getItem("hasCompletedOnboarding");
            setShowOnboarding(isNewUser);
        }
    }, []);

    const handleAddProduct = () => {
        if (newProduct.name && newProduct.sold && newProduct.revenue) {
            const productToAdd: Product = {
                name: newProduct.name,
                sold: parseInt(newProduct.sold, 10),
                revenue: parseInt(newProduct.revenue, 10)
            };
            setProducts(prevProducts => [...prevProducts, productToAdd]);
            setNewProduct({ name: '', sold: '', revenue: '' });
            setIsAddProductOpen(false);
        }
    };
    
    const handleOnboardingComplete = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("hasCompletedOnboarding", "true");
        }
        setShowOnboarding(false);
    };
    
    if (!isClient) {
        return null; // Or a loading spinner
    }

    if (showOnboarding) {
        return <OnboardingStepper onComplete={handleOnboardingComplete} />;
    }

  return (
    <div className="flex flex-col gap-8">
        <header className="flex items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
                <p className="text-muted-foreground">A quick overview of your business.</p>
            </div>
            <div className="flex gap-2">
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                         <Button>
                            <PlusCircle className="mr-2" />
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="font-headline">Add New Product</DialogTitle>
                            <DialogDescription>
                                Enter the details of the new product.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="product-name" className="text-right">
                                    Name
                                </Label>
                                <Input id="product-name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="product-sold" className="text-right">
                                    Sold
                                </Label>
                                <Input id="product-sold" type="number" value={newProduct.sold} onChange={(e) => setNewProduct({...newProduct, sold: e.target.value})} className="col-span-3" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="product-revenue" className="text-right">
                                    Revenue (₹)
                                </Label>
                                <Input id="product-revenue" type="number" value={newProduct.revenue} onChange={(e) => setNewProduct({...newProduct, revenue: e.target.value})} className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddProduct}>Save Product</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Edit className="mr-2" />
                            Update
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="font-headline">Daily Update</DialogTitle>
                            <DialogDescription>
                                Enter today's numbers to keep your dashboard up-to-date.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="revenue" className="text-right">
                                    Revenue (₹)
                                </Label>
                                <Input id="revenue" type="number" placeholder="e.g., 5000" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="product-sales" className="text-right pt-2">
                                    Today's Sales
                                </Label>
                                <Textarea id="product-sales" placeholder="e.g., 2 Silk Sarees, 5 Brass Lamps" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="sales" className="text-right">
                                    Sales
                                </Label>
                                <Input id="sales" type="number" placeholder="e.g., 25" className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹0.00</div>
                <p className="text-xs text-muted-foreground">+0% from last month</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Artisans</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+0</div>
                <p className="text-xs text-muted-foreground">+0% from last month</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+0</div>
                <p className="text-xs text-muted-foreground">+0% from last month</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+0</div>
                <p className="text-xs text-muted-foreground">+0 since last hour</p>
            </CardContent>
            </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <DashboardCharts />
        </div>
        <TopProducts products={products} />
      </div>
    </div>
  );
}
