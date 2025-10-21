import { Star, Truck, Shield, Heart, Factory, CheckCircle, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-500">
      {/* Header with yellow background */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-black mb-6">
              About Jeffy
            </h1>
            <p className="text-xl text-black/80 max-w-2xl mx-auto">
              We source the best quality items directly from factories. Everything is tried, tested, and compared before consideration of being sold to the public.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Our Process Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-neutral-800 mb-8 text-center">
              Our Quality Process
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Factory className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">Direct Factory Sourcing</h3>
                <p className="text-black">
                  We work directly with manufacturers to ensure the highest quality products at the best prices
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">Rigorous Testing</h3>
                <p className="text-black">
                  Every product undergoes extensive testing and comparison before being approved for sale
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">Customer First</h3>
                <p className="text-black">
                  We only sell products that meet our high standards and provide real value to our customers
                </p>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-neutral-800 mb-6 text-center">
              Our Mission
            </h2>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <p className="text-lg text-black leading-relaxed mb-6">
                At Jeffy, we believe that quality shouldn't be compromised for price. That's why we've built 
                direct relationships with factories around the world, cutting out middlemen to bring you 
                exceptional products at unbeatable prices.
              </p>
              <p className="text-lg text-black leading-relaxed mb-6">
                Our rigorous testing process ensures that every item we sell has been personally tried, 
                tested, and compared against competitors. We don't just sell products – we curate them. 
                Each item in our catalog has earned its place through quality, durability, and customer satisfaction.
              </p>
              <p className="text-lg text-black leading-relaxed">
                When you shop with Jeffy, you're not just buying a product – you're investing in something 
                that has been carefully selected and tested to meet our high standards. We're committed 
                to bringing you the best, because you deserve nothing less.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-neutral-800 mb-8 text-center">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">Quality First</h3>
                <p className="text-black">
                  We carefully test every product to ensure it meets our high standards
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Factory className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">Direct Sourcing</h3>
                <p className="text-black">
                  Working directly with factories to eliminate unnecessary markups
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">Tested & Proven</h3>
                <p className="text-black">
                  Every product undergoes rigorous testing before reaching our customers
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">Customer Trust</h3>
                <p className="text-black">
                  Your satisfaction is our success. We treat every customer like family
                </p>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-neutral-800 mb-6 text-center">
              Our Story
            </h2>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <p className="text-lg text-black leading-relaxed mb-6">
                Jeffy was founded on a simple principle: quality products shouldn't cost a fortune. 
                After years of frustration with overpriced, underperforming products, we decided 
                to take matters into our own hands.
              </p>
              <p className="text-lg text-black leading-relaxed mb-6">
                We started by building direct relationships with factories worldwide, cutting out 
                the middlemen who were inflating prices without adding value. But we didn't stop there – 
                we implemented a rigorous testing process where every product is personally tried, 
                tested, and compared against competitors.
              </p>
              <p className="text-lg text-black leading-relaxed">
                Today, Jeffy represents more than just a store – it's a promise. A promise that 
                every product you buy has been carefully selected, thoroughly tested, and proven 
                to deliver exceptional value. We're not just selling products; we're building trust, 
                one quality item at a time.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-yellow-400 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-black mb-4">
              Experience the Jeffy Difference
            </h2>
            <p className="text-lg text-black/80 mb-6">
              Shop with confidence knowing every product has been tested and approved by our team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-black text-yellow-400 font-semibold rounded-lg hover:bg-black/90 transition-colors"
              >
                Shop Tested Products
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-yellow-400 transition-colors"
              >
                Contact Our Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}