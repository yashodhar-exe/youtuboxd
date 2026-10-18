import githubLogo from '../../assets/github.png';
import githubHoverLogo from '../../assets/github-hover.png';

const Footer = () => {
  return (
    <footer className="bg-[#14181c] text-[#667788] py-8 text-xs text-center mt-auto border-t border-[#2c3440]">
      <div className="container mx-auto max-w-5xl px-4 flex justify-center">
        <a
          href="https://github.com/yashodhar-exe"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-white transition-colors duration-300 group"
        >
          <div className="relative w-7 h-7 transform translate-y-[1px]">
            <img
              src={githubLogo}
              alt="GitHub"
              className="absolute inset-0 w-7 h-7 object-contain opacity-70 group-hover:opacity-0 transition-opacity duration-300"
            />
            <img
              src={githubHoverLogo}
              alt="GitHub Hover"
              className="absolute inset-0 w-7 h-7 object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <span className="text-base">yashodhar-exe</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
