import { cn } from "@/lib/utils";

const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-8 h-8", className)}
      {...props}
    >
      <path d="M14 3V7C14 7.55228 14.4477 8 15 8H19" />
      <path d="M12 21H7.5C6.42438 21 5.51868 20.612 4.84639 19.9397C4.1741 19.2674 3.78613 18.3617 3.78613 17.2861V6.71387C3.78613 5.63825 4.1741 4.73255 4.84639 4.06026C5.51868 3.38797 6.42438 3 7.5 3H14L19.214 8.21401C19.7156 8.71556 20 9.40056 20 10.1213V15" />
      <path d="M8 17H12" />
      <path d="M8 13H16" />
      <path d="M16 21L21 16L16 11" />
      <path d="M21 16H11" />
    </svg>
  );
};

export default Logo;
