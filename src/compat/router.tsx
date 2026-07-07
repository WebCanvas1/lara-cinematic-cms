// Compatibility shim so existing components importing from `@tanstack/react-router`
// keep working on top of react-router-dom (HashRouter).
import { forwardRef, type ComponentProps } from "react";
import {
  Link as RRLink,
  NavLink,
  useNavigate as useRRNavigate,
  useLocation,
  useParams as useRRParams,
  Outlet,
} from "react-router-dom";

type LinkProps = Omit<ComponentProps<"a">, "href"> & {
  to: string;
  activeProps?: { className?: string };
  activeOptions?: { exact?: boolean };
  params?: Record<string, string>;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, activeProps, activeOptions, className, params: _params, children, ...rest },
  ref,
) {
  if (activeProps?.className) {
    return (
      <NavLink
        ref={ref}
        to={to}
        end={activeOptions?.exact}
        className={({ isActive }) =>
          [className, isActive ? activeProps.className : ""].filter(Boolean).join(" ")
        }
        {...rest}
      >
        {children}
      </NavLink>
    );
  }
  return (
    <RRLink ref={ref} to={to} className={className} {...rest}>
      {children}
    </RRLink>
  );
});

type NavArg = string | { to: string; replace?: boolean };
export function useNavigate() {
  const nav = useRRNavigate();
  return (arg: NavArg) => {
    if (typeof arg === "string") return nav(arg);
    return nav(arg.to, { replace: arg.replace });
  };
}

export { Outlet, useLocation };
export const useParams = useRRParams;

export function createFileRoute() {
  return () => ({});
}
export function redirect(): never {
  throw new Error("redirect() is not supported in this build");
}