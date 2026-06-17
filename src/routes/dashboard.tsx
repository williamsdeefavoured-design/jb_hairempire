import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  Star,
  Users,
  Search,
  Edit3,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  Check,
  X,
  Eye,
} from "lucide-react";
import { getDbProducts, saveDbProducts, formatNGN, type Product, type Category } from "@/lib/products";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — JB HAIRMPIRE" },
      { name: "description", content: "JB HAIRMPIRE Store Administration, Inventory Control and Analytics Portal." },
    ],
  }),
  component: DashboardPage,
});

// Seed data for simulated orders
const INITIAL_ORDERS = [
  {
    id: "ord-001",
    customerName: "Chioma Nwachukwu",
    email: "chioma.n@yahoo.com",
    productId: "caramel-ombre-straight-28",
    qty: 1,
    amount: 958400,
    reference: "pstk_9028a381b",
    date: "2026-06-15T14:32:00Z",
    status: "Delivered" as const,
  },
  {
    id: "ord-002",
    customerName: "Adebayo Adesina",
    email: "adebayo.adesina@gmail.com",
    productId: "brazilian-body-wave-26",
    qty: 1,
    amount: 782400,
    reference: "pstk_1192d773c",
    date: "2026-06-15T18:15:00Z",
    status: "Shipped" as const,
  },
  {
    id: "ord-003",
    customerName: "Fatima Abubakar",
    email: "fatima.abubakar@gamil.com",
    productId: "gold-elixir",
    qty: 3,
    amount: 326400,
    reference: "pstk_0982f127e",
    date: "2026-06-16T09:44:00Z",
    status: "Processing" as const,
  },
  {
    id: "ord-004",
    customerName: "Olumide Awosika",
    email: "olumide.a@outlook.com",
    productId: "rose-airflow",
    qty: 1,
    amount: 462400,
    reference: "pstk_7625c192d",
    date: "2026-06-16T11:05:00Z",
    status: "Processing" as const,
  },
  {
    id: "ord-005",
    customerName: "Sade Olamide",
    email: "sade.olamide@gmail.com",
    productId: "burgundy-body-wave-24",
    qty: 1,
    amount: 862400,
    reference: "pstk_3345e882a",
    date: "2026-06-16T13:21:00Z",
    status: "Delivered" as const,
  },
];

function DashboardPage() {
  const [productsList, setProductsList] = React.useState<Product[]>([]);
  const [orders, setOrders] = React.useState(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = React.useState<"analytics" | "inventory" | "orders" | "customers">("analytics");
  
  // State for search and edit
  const [searchQuery, setSearchQuery] = React.useState("");
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  
  // Loading dynamic product state
  React.useEffect(() => {
    setProductsList(getDbProducts());
    
    const handleUpdate = () => {
      setProductsList(getDbProducts());
    };
    window.addEventListener("jb_products_updated", handleUpdate);
    return () => window.removeEventListener("jb_products_updated", handleUpdate);
  }, []);

  // Initialize order database logic (store in localStorage so it persists with sales)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrders = localStorage.getItem("jb_orders");
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        localStorage.setItem("jb_orders", JSON.stringify(INITIAL_ORDERS));
      }
    }
  }, []);

  const saveOrders = (updatedOrders: typeof INITIAL_ORDERS) => {
    setOrders(updatedOrders);
    if (typeof window !== "undefined") {
      localStorage.setItem("jb_orders", JSON.stringify(updatedOrders));
    }
  };

  // Reset to original factory settings
  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all store data to default? This will clear custom pricing, inventory changes, and images.")) {
      localStorage.removeItem("jb_products_v2");
      localStorage.removeItem("jb_orders");
      window.location.reload();
    }
  };

  // Handle product edit form
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    const updatedList = productsList.map((p) => 
      p.id === editingProduct.id ? editingProduct : p
    );
    saveDbProducts(updatedList);
    setEditingProduct(null);
  };

  // Add new product placeholder
  const handleAddProduct = () => {
    const newId = `new-product-${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: "New Custom Lace Wig",
      price: 650000,
      image: productsList[0]?.image || "",
      category: "wigs",
      badge: "New",
      description: "Premium handcrafted virgin hair wig customized to perfection.",
      details: ["100% Virgin Remy hair", "Undetectable HD lace", "Density: 180%"],
      rating: 5.0,
      reviews: 1,
    };
    const updatedList = [newProduct, ...productsList];
    saveDbProducts(updatedList);
    setEditingProduct(newProduct);
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updatedList = productsList.filter((p) => p.id !== id);
      saveDbProducts(updatedList);
    }
  };

  // Compute stats
  const totalRevenue = React.useMemo(() => {
    return orders.reduce((sum, order) => sum + order.amount, 0);
  }, [orders]);

  const totalInventoryValue = React.useMemo(() => {
    return productsList.reduce((sum, product) => sum + product.price * 15, 0); // Assuming average stock of 15 units
  }, [productsList]);

  const avgRating = React.useMemo(() => {
    if (productsList.length === 0) return 0;
    return productsList.reduce((sum, p) => sum + p.rating, 0) / productsList.length;
  }, [productsList]);

  const filteredProducts = React.useMemo(() => {
    return productsList.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [productsList, searchQuery]);

  // Group items by category for simple charting
  const categoryStats = React.useMemo(() => {
    const counts = { wigs: 0, equipment: 0, treatment: 0 };
    productsList.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });
    return counts;
  }, [productsList]);

  // Order status update
  const handleUpdateOrderStatus = (orderId: string, newStatus: "Delivered" | "Shipped" | "Processing") => {
    const updated = orders.map((o) => o.id === orderId ? { ...o, status: newStatus } : o);
    saveOrders(updated);
  };

  // Customer metrics
  const customers = React.useMemo(() => {
    const map: Record<string, { name: string; email: string; totalSpent: number; ordersCount: number }> = {};
    orders.forEach((o) => {
      if (!map[o.email]) {
        map[o.email] = { name: o.customerName, email: o.email, totalSpent: 0, ordersCount: 0 };
      }
      map[o.email].totalSpent += o.amount;
      map[o.email].ordersCount += o.qty;
    });
    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  return (
    <div className="bg-background min-h-screen pt-8 pb-24 text-foreground">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-border/60 pb-8 mb-10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Atelier Administration</span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-wide">Control Center</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleResetData}
              className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-xs uppercase tracking-[0.2em] hover:bg-cream/40 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Store Data
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border/40 mb-10 overflow-x-auto gap-8">
          {[
            { id: "analytics", label: "Store Analytics", icon: TrendingUp },
            { id: "inventory", label: "Catalog & Stock", icon: Package },
            { id: "orders", label: "Paystack Orders", icon: ShoppingBag },
            { id: "customers", label: "Customer LTV", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setEditingProduct(null);
                }}
                className={`flex items-center gap-2.5 pb-4 text-xs uppercase tracking-[0.2em] font-medium transition-colors border-b-2 whitespace-nowrap -mb-[2px] ${
                  active 
                    ? "border-foreground text-foreground" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="space-y-10">
            {/* KPI Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border border-border/80 bg-cream/10 p-6 flex flex-col justify-between h-36">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] uppercase tracking-[0.25em]">Total Revenue</span>
                  <DollarSign className="h-4.5 w-4.5 text-gold" />
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-2xl md:text-3xl font-medium">{formatNGN(totalRevenue)}</h3>
                  <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +14.2% this week
                  </p>
                </div>
              </div>

              <div className="border border-border/80 bg-cream/10 p-6 flex flex-col justify-between h-36">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] uppercase tracking-[0.25em]">Paystack Orders</span>
                  <ShoppingBag className="h-4.5 w-4.5 text-gold" />
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-2xl md:text-3xl font-medium">{orders.length} Completed</h3>
                  <p className="text-[10px] text-emerald-500 mt-1">100% verified status</p>
                </div>
              </div>

              <div className="border border-border/80 bg-cream/10 p-6 flex flex-col justify-between h-36">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] uppercase tracking-[0.25em]">Est. Stock Value</span>
                  <Package className="h-4.5 w-4.5 text-gold" />
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-2xl md:text-3xl font-medium">{formatNGN(totalInventoryValue)}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">Based on {productsList.length} items</p>
                </div>
              </div>

              <div className="border border-border/80 bg-cream/10 p-6 flex flex-col justify-between h-36">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] uppercase tracking-[0.25em]">Client Rating</span>
                  <Star className="h-4.5 w-4.5 fill-gold text-gold" />
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-2xl md:text-3xl font-medium">{avgRating.toFixed(2)} / 5.00</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">Aggregated across all products</p>
                </div>
              </div>
            </div>

            {/* Custom Visualizations */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Category Breakdown Progress Bars */}
              <div className="border border-border/80 p-8 space-y-6 lg:col-span-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg tracking-wide">Category Share</h3>
                  <p className="text-xs text-muted-foreground mt-1">Distribution of custom items in inventory</p>
                </div>
                
                <div className="space-y-5">
                  {[
                    { cat: "Wigs", count: categoryStats.wigs, color: "bg-amber-400" },
                    { cat: "Treatments", count: categoryStats.treatment, color: "bg-rose-400" },
                    { cat: "Equipment", count: categoryStats.equipment, color: "bg-blue-400" },
                  ].map((item) => {
                    const total = productsList.length || 1;
                    const percentage = Math.round((item.count / total) * 100);
                    return (
                      <div key={item.cat} className="space-y-2">
                        <div className="flex justify-between text-xs font-medium uppercase tracking-wider">
                          <span>{item.cat}</span>
                          <span className="text-muted-foreground">{item.count} items ({percentage}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-cream/35 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.color} transition-all duration-1000`} 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="text-[10px] text-muted-foreground leading-relaxed pt-4 border-t border-border/40">
                  Luxury wig extensions dominate the store catalog representation at {Math.round((categoryStats.wigs / (productsList.length || 1)) * 100)}%.
                </div>
              </div>

              {/* simulated growth metrics chart */}
              <div className="border border-border/80 p-8 lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg tracking-wide">Revenue Progression</h3>
                  <p className="text-xs text-muted-foreground mt-1">Weekly sales accumulation pattern</p>
                </div>
                
                {/* Simulated Chart Bars */}
                <div className="h-48 flex items-end justify-between gap-4 pt-8 border-b border-border/40 pb-2">
                  {[
                    { label: "Mon", val: 526400, percent: "h-[30%]" },
                    { label: "Tue", val: 0, percent: "h-[0%]" },
                    { label: "Wed", val: 782400, percent: "h-[50%]" },
                    { label: "Thu", val: 622400, percent: "h-[40%]" },
                    { label: "Fri", val: 1054400, percent: "h-[75%]" },
                    { label: "Sat", val: 1872800, percent: "h-[100%]" },
                    { label: "Sun", val: 958400, percent: "h-[65%]" },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-foreground text-background text-[10px] py-1 px-2 uppercase tracking-widest whitespace-nowrap z-10">
                        {formatNGN(bar.val)}
                      </div>
                      <div className={`w-full ${bar.val > 0 ? "bg-gold/80 hover:bg-gold" : "bg-border/20"} ${bar.percent} transition-all duration-700`} />
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{bar.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-4">
                  <span>Showing daily performance breakdown (NGN)</span>
                  <span className="flex items-center gap-1.5 font-medium text-emerald-500 uppercase tracking-widest">
                    <TrendingUp className="h-3.5 w-3.5" /> High volume: Saturday
                  </span>
                </div>
              </div>
            </div>
            
            {/* Top Products */}
            <div className="border border-border/80 p-8">
              <h3 className="font-display text-lg tracking-wide mb-6">Top Selling Atelier Items</h3>
              <div className="divide-y divide-border/40">
                {productsList.slice(0, 4).map((p) => (
                  <div key={p.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={p.image} alt={p.name} className="w-10 h-12 object-cover bg-cream shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium">{p.name}</h4>
                        <span className="text-xs text-muted-foreground capitalize">{p.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">{formatNGN(p.price)}</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Rating: {p.rating} ({p.reviews} reviews)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search catalog by name, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-cream/15 border border-border pl-10 pr-4 py-2.5 text-xs uppercase tracking-[0.15em] focus:outline-none focus:border-foreground"
                />
              </div>
              <button 
                onClick={handleAddProduct}
                className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-foreground/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create New Product
              </button>
            </div>

            {/* List and Editor */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              
              {/* Table List */}
              <div className="lg:col-span-2 border border-border/80 overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-cream/10 border-b border-border text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      <th className="p-4">Item details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-sm">
                    {filteredProducts.map((p) => (
                      <tr 
                        key={p.id} 
                        className={`hover:bg-cream/5 transition-colors ${
                          editingProduct?.id === p.id ? "bg-cream/20" : ""
                        }`}
                      >
                        <td className="p-4 flex items-center gap-4 min-w-[240px]">
                          <img src={p.image} alt={p.name} className="w-10 h-12 object-cover bg-cream shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium truncate">{p.name}</p>
                            {p.badge && (
                              <span className="inline-block bg-background text-foreground text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-border mt-1">
                                {p.badge}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 capitalize text-xs text-muted-foreground">{p.category}</td>
                        <td className="p-4 text-xs font-mono">{formatNGN(p.price)}</td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-2 hover:text-gold transition-colors inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold mr-2"
                            title="Edit"
                          >
                            <Edit3 className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 hover:text-destructive transition-colors inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-10 text-center text-muted-foreground text-xs">
                          No matching items in directory catalog.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Edit Sidebar Panel */}
              <div className="lg:col-span-1">
                {editingProduct ? (
                  <form onSubmit={handleSaveProduct} className="border border-border/85 p-6 bg-cream/10 space-y-5">
                    <div className="flex justify-between items-center border-b border-border/40 pb-4">
                      <h3 className="font-display text-sm uppercase tracking-[0.2em] font-semibold">Modify Wig/Item</h3>
                      <button 
                        type="button" 
                        onClick={() => setEditingProduct(null)} 
                        className="p-1 hover:text-muted-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Product Identifier</label>
                      <input 
                        type="text" 
                        disabled
                        value={editingProduct.id} 
                        className="w-full bg-background/50 border border-border px-3 py-2 text-xs font-mono text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={editingProduct.name} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full bg-background border border-border px-3 py-2 text-xs focus:outline-none focus:border-foreground"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Price (₦)</label>
                        <input 
                          type="number" 
                          required
                          value={editingProduct.price} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                          className="w-full bg-background border border-border px-3 py-2 text-xs focus:outline-none focus:border-foreground font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Category</label>
                        <select 
                          value={editingProduct.category} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as Category })}
                          className="w-full bg-background border border-border px-3 py-2 text-xs focus:outline-none focus:border-foreground"
                        >
                          <option value="wigs">Wigs</option>
                          <option value="equipment">Equipment</option>
                          <option value="treatment">Treatment</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Badge (Label)</label>
                        <select 
                          value={editingProduct.badge || ""} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, badge: (e.target.value || undefined) as any })}
                          className="w-full bg-background border border-border px-3 py-2 text-xs focus:outline-none focus:border-foreground"
                        >
                          <option value="">None</option>
                          <option value="New">New</option>
                          <option value="Sale">Sale</option>
                          <option value="Bestseller">Bestseller</option>
                        </select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Wig Texture</label>
                        <input 
                          type="text" 
                          value={editingProduct.texture || ""} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, texture: e.target.value || undefined })}
                          className="w-full bg-background border border-border px-3 py-2 text-xs focus:outline-none focus:border-foreground"
                          placeholder="e.g. Bone Straight"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Product Description</label>
                      <textarea 
                        rows={3}
                        value={editingProduct.description} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        className="w-full bg-background border border-border px-3 py-2 text-xs focus:outline-none focus:border-foreground"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Technical Details (comma-separated)</label>
                      <textarea 
                        rows={2}
                        value={editingProduct.details.join(", ")} 
                        onChange={(e) => setEditingProduct({ ...editingProduct, details: e.target.value.split(",").map(s => s.trim()) })}
                        className="w-full bg-background border border-border px-3 py-2 text-xs focus:outline-none focus:border-foreground"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        type="submit" 
                        className="flex-1 bg-foreground text-background py-3 text-xs uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        <Save className="h-3.5 w-3.5" /> Save Changes
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditingProduct(null)}
                        className="border border-border px-4 hover:bg-cream/45 text-xs uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="border border-dashed border-border p-10 text-center bg-cream/5 flex flex-col items-center justify-center">
                    <Edit3 className="h-8 w-8 text-muted-foreground/60 mb-4 stroke-[1.2]" />
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Select a product to view or modify details</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1 max-w-[200px]">Changes made here immediately persist on the shop display pages.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="border border-border/80 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-cream/10 border-b border-border text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="p-4">Paystack Ref</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Purchased Item</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Delivery Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm">
                  {orders.map((o) => {
                    const matchedProduct = productsList.find((p) => p.id === o.productId);
                    return (
                      <tr key={o.id} className="hover:bg-cream/5 transition-colors">
                        <td className="p-4 text-xs font-mono">{o.reference}</td>
                        <td className="p-4">
                          <p className="font-medium">{o.customerName}</p>
                          <span className="text-xs text-muted-foreground">{o.email}</span>
                        </td>
                        <td className="p-4 max-w-[220px]">
                          <p className="font-medium truncate">{matchedProduct?.name || o.productId}</p>
                          <span className="text-xs text-muted-foreground capitalize">Qty: {o.qty}</span>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {new Date(o.date).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="p-4 text-xs font-mono font-medium">{formatNGN(o.amount)}</td>
                        <td className="p-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border focus:outline-none bg-background ${
                              o.status === "Delivered" 
                                ? "border-emerald-500/40 text-emerald-500" 
                                : o.status === "Shipped" 
                                  ? "border-blue-500/40 text-blue-500" 
                                  : "border-amber-500/40 text-amber-500"
                            }`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="bg-cream/15 p-6 border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xs uppercase tracking-[0.25em]">Payment Verification System</h4>
                <p className="text-[10px] text-muted-foreground mt-1">Paystack hooks verify the signatures server-side on Route `/api/paystack-verify`.</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 uppercase tracking-widest font-semibold">
                <Check className="h-4 w-4" /> Endpoint operational
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            <div className="border border-border/80 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-cream/10 border-b border-border text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="p-4">Client profile</th>
                    <th className="p-4">Contact email</th>
                    <th className="p-4">Transactions count</th>
                    <th className="p-4 text-right">Lifetime Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm">
                  {customers.map((c, index) => (
                    <tr key={c.email} className="hover:bg-cream/5 transition-colors">
                      <td className="p-4 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-cream border border-border flex items-center justify-center text-xs uppercase tracking-widest font-semibold">
                          {c.name.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium">{c.name}</p>
                          {index === 0 && (
                            <span className="text-[9px] uppercase tracking-widest bg-gold/25 text-foreground px-2 py-0.5 border border-gold/40">
                              Top Valued Client
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-xs font-mono text-muted-foreground">{c.email}</td>
                      <td className="p-4 text-xs">{c.ordersCount} items ordered</td>
                      <td className="p-4 text-right text-xs font-mono font-medium">{formatNGN(c.totalSpent)}</td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-muted-foreground text-xs">
                        No transactions registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
