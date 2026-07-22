import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { clsx } from "clsx";

type FoundationProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function DesignSystemScope({ className, children, ...props }: FoundationProps) {
  return (
    <div data-design-system="step-3-foundation" className={clsx("ds-scope", className)} {...props}>
      {children}
    </div>
  );
}

export function Container({ className, ...props }: FoundationProps) {
  return <div className={clsx("ds-container", className)} {...props} />;
}

export function Stack({ className, ...props }: FoundationProps) {
  return <div className={clsx("ds-stack", className)} {...props} />;
}

export function Cluster({ className, ...props }: FoundationProps) {
  return <div className={clsx("ds-cluster", className)} {...props} />;
}

export function ResponsiveGrid({ className, ...props }: FoundationProps) {
  return <div className={clsx("ds-grid", className)} {...props} />;
}

type SurfaceElement = "div" | "section" | "article" | "aside";
type SurfaceVariant = "matte" | "glass" | "elevated";

type SurfaceProps = HTMLAttributes<HTMLElement> & {
  as?: SurfaceElement;
  variant?: SurfaceVariant;
  pill?: boolean;
  accentBorder?: boolean;
  children: ReactNode;
};

export function Surface({
  as: Element = "div",
  variant = "matte",
  pill = false,
  accentBorder = false,
  className,
  children,
  ...props
}: SurfaceProps) {
  return (
    <Element
      className={clsx(
        "ds-surface",
        `ds-surface--${variant}`,
        pill && "ds-surface--pill",
        accentBorder && "ds-surface--accent",
        className,
      )}
      {...props}
    >
      {children}
    </Element>
  );
}

type DockElement = "div" | "nav" | "section" | "aside" | "footer" | "ul" | "ol";
type DockItemElement = "div" | "li";
type DockVariant = "matte" | "glass";

type DockProps = HTMLAttributes<HTMLElement> & {
  as?: DockElement;
  variant?: DockVariant;
  children: ReactNode;
};

export function Dock({
  as: Element = "div",
  variant = "matte",
  className,
  children,
  ...props
}: DockProps) {
  return (
    <Element className={clsx("ds-dock", `ds-dock--${variant}`, className)} {...props}>
      {children}
    </Element>
  );
}

type DockItemProps = HTMLAttributes<HTMLElement> & {
  as?: DockItemElement;
  children: ReactNode;
};

export function DockItem({ as: Element = "div", className, children, ...props }: DockItemProps) {
  return (
    <Element className={clsx("ds-dock__item", className)} {...props}>
      {children}
    </Element>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx("ds-button", `ds-button--${variant}`, className)}
      {...props}
    />
  );
}

type ActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
};

export function ActionLink({ variant = "primary", className, ...props }: ActionLinkProps) {
  return <a className={clsx("ds-button", `ds-button--${variant}`, className)} {...props} />;
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  "aria-label": string;
};

export function IconButton({ className, type = "button", ...props }: IconButtonProps) {
  return <button type={type} className={clsx("ds-icon-button", className)} {...props} />;
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  helpText?: string;
  error?: string;
};

export function TextField({
  id,
  label,
  helpText,
  error,
  className,
  "aria-describedby": ariaDescribedBy,
  ...props
}: TextFieldProps) {
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedBy, helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="ds-field">
      <label className="ds-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={clsx("ds-field__control", className)}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {helpText ? (
        <span id={helpId} className="ds-field__help">
          {helpText}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className="ds-field__error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
