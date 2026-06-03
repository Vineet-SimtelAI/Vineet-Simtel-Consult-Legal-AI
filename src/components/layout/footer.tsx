import Link from "next/link"
import { Scale, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-ink text-ivory/40 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Scale className="h-5 w-5 text-ivory/60" />
              <span className="text-base font-medium text-ivory">Consult Legal</span>
            </Link>
            <p className="text-sm text-ivory/25 leading-relaxed">
              AI-powered legal document automation and consultation platform.
            </p>
            <div className="space-y-2 pt-2">
              <a href="mailto:contact@simtel.ai" className="flex items-center gap-2 text-sm text-ivory/25 hover:text-ivory/50 transition-colors">
                <Mail className="h-3.5 w-3.5" /> contact@simtel.ai
              </a>
              <a href="tel:+919513333471" className="flex items-center gap-2 text-sm text-ivory/25 hover:text-ivory/50 transition-colors">
                <Phone className="h-3.5 w-3.5" /> +91 95133 33471
              </a>
              <div className="flex items-start gap-2 text-sm text-ivory/25">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-ivory/60 font-medium text-sm mb-4 tracking-wide uppercase">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Documents", href: "/documents" },
                { name: "Resources", href: "/resources" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-ivory/25 hover:text-ivory/50 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-ivory/60 font-medium text-sm mb-4 tracking-wide uppercase">Products</h3>
            <ul className="space-y-3">
              {[
                { name: "Document Generation", href: "/products/documents" },
                { name: "Lawyer Marketplace", href: "/products/lawyers" },
                { name: "AI Legal Chat", href: "/products/ai-chat" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-ivory/25 hover:text-ivory/50 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-ivory/60 font-medium text-sm mb-4 tracking-wide uppercase">Legal</h3>
            <ul className="space-y-3">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms & Conditions", href: "/terms" },
                { name: "Payment Policy", href: "/payment" },
                { name: "Refunds Policy", href: "/refunds" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-ivory/25 hover:text-ivory/50 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ivory/20">
            &copy; 2023-2026 Simulate Intelligence Private Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-ivory/20">CIN: U62099KA2023PTC177253</span>
            <span className="text-xs text-ivory/20">GST: 29ABLCS4636F2ZY</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
