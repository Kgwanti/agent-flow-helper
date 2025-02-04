import { Button } from "@/components/ui/button";
import { Home, Search, MapPin, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Home className="h-6 w-6 text-primary mr-2" />
              <span className="text-primary font-bold text-xl">RealFlow</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Button variant="ghost">BUY</Button>
            <Button variant="ghost">SELL</Button>
            <Button variant="ghost">RENT</Button>
            <Button variant="ghost">AGENTS</Button>
            <Button variant="ghost">OFFICES</Button>
            <Button variant="default">JOIN US</Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="sm:hidden pb-3 animate-fadeIn">
            <div className="pt-2 pb-3 space-y-1">
              <Button variant="ghost" className="w-full justify-start">BUY</Button>
              <Button variant="ghost" className="w-full justify-start">SELL</Button>
              <Button variant="ghost" className="w-full justify-start">RENT</Button>
              <Button variant="ghost" className="w-full justify-start">AGENTS</Button>
              <Button variant="ghost" className="w-full justify-start">OFFICES</Button>
              <Button variant="default" className="w-full">JOIN US</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;