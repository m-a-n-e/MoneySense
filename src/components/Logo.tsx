import logoSvg from '../assets/logo.svg';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 24 }: LogoProps) {
    return (
            <img src={logoSvg} alt="Logo" className={className} style={{ width: size, height: size }} />
    );
}