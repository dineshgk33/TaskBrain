const Footer = () => {
  return (
    <footer>
      {/* CTA Strip */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-center py-4 text-sm font-medium">
        Available on Web • Built for students, developers & teams
      </div>

      {/* Main Footer */}
      <div className="bg-slate-900 text-gray-300 px-6 py-16">
        <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-pink-500 mb-4">
              TaskBrain
            </h2>
            <p className="text-sm leading-relaxed">
              Smart AI-powered project management to allocate tasks,
              track progress, and communicate efficiently — all in one platform.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-pink-400 cursor-pointer">Features</li>
              <li className="hover:text-pink-400 cursor-pointer">How It Works</li>
              <li className="hover:text-pink-400 cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-pink-400 cursor-pointer">Help Center</li>
              <li className="hover:text-pink-400 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-pink-400 cursor-pointer">Terms of Use</li>
            </ul>
          </div>

          {/* Join */}
          <div>
            <h3 className="text-white font-semibold mb-4">Join TaskBrain</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-pink-400 cursor-pointer">Careers</li>
              <li className="hover:text-pink-400 cursor-pointer">Become a Partner</li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 mt-12 pt-6 text-center text-sm">
          © {new Date().getFullYear()} TaskBrain. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
