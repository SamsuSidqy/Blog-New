export default function FooterComponent() {
  return (
    <footer className="bg-zinc-600 py-6 text-center text-white">
      <div className="flex flex-col items-center gap-3">
        <nav className="flex gap-4">
          <a href="/privacy" className="text-sm hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="text-sm hover:underline">
            Terms & Conditions
          </a>
        </nav>
        <p className="text-sm text-gray-300">
          © 2024 Copyright <span className="font-semibold">Abi Samsu</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
