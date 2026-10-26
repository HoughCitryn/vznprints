import { StrictMode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Turnstile } from "@/components/Turnstile";

vi.mock("next/script", () => ({ default: () => null }));

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  delete window.turnstile;
});

describe("Turnstile verification", () => {
  it("keeps production forms disabled when the site key is missing", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    const onChange = vi.fn();
    render(<Turnstile onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText(/form is temporarily unavailable/)).toBeInTheDocument();
  });

  it("allows the local development bypass", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    const onChange = vi.fn();
    render(<Turnstile onChange={onChange} />);
    expect(onChange).toHaveBeenCalledWith("development-bypass");
  });

  it("recreates the widget after Strict Mode cleanup", () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
    const renderWidget = vi.fn().mockReturnValueOnce("widget-1").mockReturnValueOnce("widget-2");
    const removeWidget = vi.fn();
    window.turnstile = { render: renderWidget, remove: removeWidget };
    const { unmount } = render(<StrictMode><Turnstile onChange={vi.fn()} /></StrictMode>);
    expect(renderWidget).toHaveBeenCalledTimes(2);
    expect(removeWidget).toHaveBeenCalledWith("widget-1");
    unmount();
    expect(removeWidget).toHaveBeenCalledWith("widget-2");
  });
});
