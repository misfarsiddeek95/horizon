import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
} from "react";

type ButtonBaseProps = {
  children: ReactNode;
  className?: string;
  behavior?: "button" | "link";
  variant?: "primary" | "secondary" | "outline" | "text";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
};

type ButtonButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    behavior?: "button";
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
  };

type ButtonLinkProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    behavior: "link";
    href: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
    download?: boolean | string;
    rel?: string;
  };

export type ButtonProps = ButtonButtonProps | ButtonLinkProps;

const variantStyles: Record<string, string> = {
  primary:
    "bg-brand-main text-white shadow-sm hover:bg-brand-hover hover:shadow-md focus-visible:ring-brand-main",
  secondary:
    "bg-surface-muted text-content-primary hover:bg-surface-muted/80 focus-visible:ring-content-primary/20",
  outline:
    "border-2 border-brand-main text-brand-main bg-transparent hover:bg-brand-main/10 focus-visible:ring-brand-main",
  text: "text-brand-main bg-transparent hover:bg-brand-main/10 focus-visible:ring-brand-main",
};

const radiusStyles: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

export default function Button({
  children,
  className = "",
  behavior = "button",
  variant = "primary",
  radius = "full",
  icon,
  iconPosition = "right",
  ...props
}: ButtonProps) {
  const baseClasses =
    "group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const classes = `${baseClasses} ${variantStyles[variant]} ${radiusStyles[radius]} ${className}`;

  const iconElement = icon ? (
    <span className="h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover:translate-y-0.5">
      {icon}
    </span>
  ) : null;

  const content = (
    <>
      {iconPosition === "left" && iconElement}
      <span>{children}</span>
      {iconPosition === "right" && iconElement}
    </>
  );

  if (behavior === "link") {
    const { href, target, download, rel, ...rest } = props as ButtonLinkProps;
    const isExternal =
      href.startsWith("http") || download || target === "_blank";

    if (isExternal) {
      return (
        <a
          href={href}
          target={target}
          download={download}
          rel={rel}
          className={classes}
          {...rest}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonButtonProps)}>
      {content}
    </button>
  );
}
