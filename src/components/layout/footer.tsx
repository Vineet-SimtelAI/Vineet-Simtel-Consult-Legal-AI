import Link from "next/link"
import { Scale, Mail, Phone, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-navy text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-teal" />
              <span className="text-lg font-bold text-white">Consult Legal</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted partner for legal automation and AI-powered legal consultation.
            </p>
            <div className="space-y-2">
              <a href="mailto:contact@simtel.ai" className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal transition-colors">
                <Mail className="h-4 w-4" /> contact@simtel.ai
              </a>
              <a href="tel:+919513333471" className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal transition-colors">
                <Phone className="h-4 w-4" /> +91 95133 33471
              </a>
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Documents", href: "/documents" },
                { name: "Resources", href: "/resources" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-teal transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-3">
              {[
                { name: "Document Generation", href: "/products/documents" },
                { name: "Lawyer Marketplace", href: "/products/lawyers" },
                { name: "AI Legal Chat", href: "/products/ai-chat" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-teal transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms & Conditions", href: "/terms" },
                { name: "Payment Policy", href: "/payment" },
                { name: "Refunds Policy", href: "/refunds" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-teal transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2023-2026 Simulate Intelligence Private Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">CIN: U62099KA2023PTC177253</span>
            <span className="text-xs text-gray-500">GST: 29ABLCS4636F2ZY</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
