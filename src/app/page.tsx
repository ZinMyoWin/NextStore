import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Zap,
  Shield,
  Truck,
  Star,
  ChevronRight,
  Quote,
} from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  // If user is admin, redirect to products page
  if (
    session?.user &&
    "role" in session.user &&
    session.user.role === "admin"
  ) {
    redirect("/products");
  }

  const features = [
    {
      icon: <Zap className='w-5 h-5' />,
      title: "Fast Shipping",
      description: "Get your items quickly with our expedited shipping options",
    },
    {
      icon: <Shield className='w-5 h-5' />,
      title: "Secure Payments",
      description: "Shop with confidence using our secure payment system",
    },
    {
      icon: <Truck className='w-5 h-5' />,
      title: "Free Returns",
      description: "Easy returns within 30 days of purchase",
    },
  ];

  const categories = [
    {
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=60",
      description: "Latest gadgets and tech accessories",
    },
    {
      name: "Clothing",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&auto=format&fit=crop&q=60",
      description: "Trendy fashion for everyone",
    },
    {
      name: "Home & Garden",
      image:
        "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=60",
      description: "Beautiful items for your home",
    },
  ];

  const featuredProducts = [
    {
      name: "Premium Wireless Headphones",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
      price: 199.99,
      rating: 4.8,
    },
    {
      name: "Smart Watch Pro",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60",
      price: 299.99,
      rating: 4.9,
    },
    {
      name: "Eco-Friendly Water Bottle",
      image:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=60",
      price: 24.99,
      rating: 4.7,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Customer",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
      content:
        "I've been shopping here for months and the quality of products and service is consistently excellent!",
    },
    {
      name: "Michael Chen",
      role: "Tech Enthusiast",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
      content:
        "The electronics selection is amazing and the prices are very competitive. Highly recommended!",
    },
    {
      name: "Emily Davis",
      role: "Fashion Blogger",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
      content:
        "Love the trendy clothing collection! Fast shipping and great customer service.",
    },
  ];

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <section className='relative h-[85vh] flex items-center justify-center overflow-hidden'>
        {/* Background Image */}
        <div className='absolute inset-0 z-0'>
          <Image
            src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800&auto=format&fit=crop&q=80'
            alt='Background'
            fill
            priority
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-background/60 via-background/50 to-background' />
        </div>
        <div className='container mx-auto px-4 relative z-10'>
          <div className='max-w-4xl mx-auto text-center space-y-8'>
            <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-white animate-in fade-in slide-in-from-bottom-4 duration-700'>
              Welcome to{" "}
              <span className='text-primary'>
                Next
                <span className='text-white'>Store</span>
              </span>
            </h1>
            <p className='text-xl md:text-2xl text-black font-semibold max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000'>
              Discover our amazing collection of products at great prices
            </p>
            <div className='flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000'>
              <Link
                href='/products'
                className='inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 transition-all hover:gap-4 hover:shadow-lg'
              >
                Shop Now
                <ArrowRight className='w-4 h-4' />
              </Link>
              {!session?.user && (
                <Link
                  href='/auth/signin'
                  className='inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-all hover:shadow-lg font-medium'
                >
                  Sign In
                  <ShoppingBag className='w-4 h-4' />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-gradient-to-b from-background to-background/50'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:bg-card/80 transition-all duration-300'
              >
                <div className='w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                  {feature.icon}
                </div>
                <h3 className='text-lg font-semibold mb-2'>{feature.title}</h3>
                <p className='text-muted-foreground'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className='py-20 bg-gradient-to-b from-background/50 to-background'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between mb-12'>
            <h2 className='text-3xl font-bold'>Featured Products</h2>
            <Link
              href='/products'
              className='inline-flex items-center text-primary hover:text-primary/80 transition-colors'
            >
              View All
              <ChevronRight className='w-4 h-4 ml-1' />
            </Link>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {featuredProducts.map((product, index) => (
              <div
                key={index}
                className='group bg-card rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300'
              >
                <div className='relative h-[300px] overflow-hidden'>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                </div>
                <div className='p-6'>
                  <h3 className='text-lg font-semibold mb-2'>{product.name}</h3>
                  <div className='flex items-center justify-between'>
                    <p className='text-xl font-bold text-primary'>
                      ${product.price}
                    </p>
                    <div className='flex items-center gap-1 text-yellow-500'>
                      <Star className='w-4 h-4 fill-current' />
                      <span className='text-sm font-medium'>
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='py-20 bg-gradient-to-b from-background to-background/50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Shop by Category
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {categories.map((category, index) => (
              <Link
                href={`/products?category=${category.name.toLowerCase()}`}
                key={index}
                className='group relative h-[300px] rounded-2xl overflow-hidden'
              >
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 z-10' />
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-500'
                />
                <div className='absolute bottom-0 left-0 right-0 p-6 z-20'>
                  <h3 className='text-xl font-semibold text-white mb-2'>
                    {category.name}
                  </h3>
                  <p className='text-white/80 text-sm'>
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-20 bg-gradient-to-b from-background/50 to-background'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            What Our Customers Say
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className='p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:bg-card/80 transition-all duration-300'
              >
                <Quote className='w-10 h-10 text-primary/20 mb-4' />
                <p className='text-muted-foreground mb-6'>
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className='flex items-center gap-4'>
                  <div className='relative w-12 h-12 rounded-full overflow-hidden'>
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <h4 className='font-semibold'>{testimonial.name}</h4>
                    <p className='text-sm text-muted-foreground'>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
