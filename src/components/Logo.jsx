import { Link } from "react-router-dom";

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className={`flex items-center ${compact ? "" : "shrink-0"}`} aria-label="ACoupon home">
      <img
        src="/acoupon-logo.jpg"
        alt="ACoupon"
        className={`${compact ? "h-9" : "h-11"} w-auto max-w-[180px] object-contain`}
      />
    </Link>
  );
}
