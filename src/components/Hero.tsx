import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-900/90 to-blue-800/90 py-20">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90" />
        <img
          src="/lovable-uploads/6b593ce8-c980-4fd5-97de-ca0087d30538.png"
          alt="Real estate background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl animate-fadeIn">
            Find Property in Your Area
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-white/90 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fadeIn">
            Whatever brought you here - whether buying, selling, renting, or simply looking for advice - you've come to the right place.
          </p>
          
          {/* Search Section */}
          <div className="mt-10 max-w-3xl mx-auto animate-fadeIn">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <Input
                  type="text"
                  placeholder="Search by Reference, Suburb, City, Province or Country"
                  className="w-full h-12 bg-white/95 border-0 focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
            
            {/* Property Filters */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-4">
              <select className="h-12 rounded-md border-0 bg-white/95 px-3">
                <option>Any Property Type</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Land</option>
              </select>
              <select className="h-12 rounded-md border-0 bg-white/95 px-3">
                <option>Min Price</option>
                <option>$100,000</option>
                <option>$200,000</option>
                <option>$300,000</option>
              </select>
              <select className="h-12 rounded-md border-0 bg-white/95 px-3">
                <option>Max Price</option>
                <option>$400,000</option>
                <option>$500,000</option>
                <option>$600,000</option>
              </select>
              <select className="h-12 rounded-md border-0 bg-white/95 px-3">
                <option>Beds</option>
                <option>1+</option>
                <option>2+</option>
                <option>3+</option>
              </select>
              <select className="h-12 rounded-md border-0 bg-white/95 px-3">
                <option>Baths</option>
                <option>1+</option>
                <option>2+</option>
                <option>3+</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;