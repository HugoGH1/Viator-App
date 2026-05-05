import { Facebook, Instagram, Twitter, Globe } from "lucide-react";

interface SocialLinksProps {
  links: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

const socialConfig = [
  { key: "facebook", icon: Facebook, label: "Facebook" },
  { key: "instagram", icon: Instagram, label: "Instagram" },
  { key: "twitter", icon: Twitter, label: "Twitter" },
  { key: "website", icon: Globe, label: "Sitio Web" },
] as const;

export function SocialLinks({ links }: SocialLinksProps) {
  const activeLinks = socialConfig.filter(
    (social) => links[social.key as keyof typeof links]
  );

  if (activeLinks.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      {activeLinks.map((social) => {
        const url = links[social.key as keyof typeof links];
        return (
          <a
            key={social.key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-medium-blue text-very-light-beige hover:bg-medium-blue-accent hover:text-action-green transition-all duration-200"
            aria-label={social.label}
          >
            <social.icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}
