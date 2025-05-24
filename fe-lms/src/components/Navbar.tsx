import { Link } from "react-router-dom";

export default function Navbar() {
  const menuItems = [
    { link: "#", text: "Home" },
    { link: "#", text: "Pricing" },
    { link: "#", text: "Features" },
    { link: "#", text: "Testimonials" },
  ];
  return (
    <div className="flex items-center gap-[60px]">
      <img
        src="/assets/images/logos/logo.svg"
        className="flex shrink-0"
        alt="logo"
      />
      <ul className="flex items-center gap-10">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="font-semibold transition-all duration-300 hover:text-[#662FFF] text-white"
          >
            <Link to={item.link}>{item.text}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
