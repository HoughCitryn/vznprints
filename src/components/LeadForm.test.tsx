import { useEffect } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LeadForm } from "@/components/LeadForm";

const mocks = vi.hoisted(() => ({ fetch: vi.fn(), tokenNumber: 0 }));

vi.mock("@/components/Turnstile", () => ({
  Turnstile: ({ onChange }: { onChange: (token: string) => void }) => {
    useEffect(() => { onChange(`token-${++mocks.tokenNumber}`); }, [onChange]);
    return <div>Security check</div>;
  },
}));

function fillContact() {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Website test" } });
  fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "661-555-0100" } });
  fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: "This is a form delivery test." } });
}

describe("LeadForm submission", () => {
  beforeEach(() => {
    mocks.fetch.mockReset();
    mocks.tokenNumber = 0;
    vi.stubGlobal("fetch", mocks.fetch);
    window.gtag = vi.fn();
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    delete window.gtag;
  });

  it("retains the message and uses a fresh token after delivery failure", async () => {
    mocks.fetch.mockResolvedValueOnce(Response.json({ status: "delivery_error" }, { status: 500 }));
    mocks.fetch.mockResolvedValueOnce(Response.json({ status: "success" }));
    render(<LeadForm type="contact" />);
    fillContact();
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));
    await screen.findByText(/Something went wrong/);
    expect(screen.getByLabelText("Message")).toHaveValue("This is a form delivery test.");
    expect(window.gtag).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByRole("button", { name: "Send Message" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));
    await screen.findByText("Thanks! Your message has been sent.");
    const payloads = mocks.fetch.mock.calls.map(([, options]) => JSON.parse(options.body));
    expect(payloads[0].turnstileToken).not.toBe(payloads[1].turnstileToken);
    expect(payloads[1].message).toBe(payloads[0].message);
    expect(screen.getByLabelText("Message")).toHaveValue("");
    expect(window.gtag).toHaveBeenCalledTimes(1);
  });

  it("recovers from network failures with a new verification token", async () => {
    mocks.fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    render(<LeadForm type="contact" />);
    fillContact();
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));
    await screen.findByText(/Something went wrong/);
    expect(mocks.tokenNumber).toBe(2);
    expect(screen.getByRole("button", { name: "Send Message" })).toBeEnabled();
  });

  it("announces validation errors and focuses the invalid field", async () => {
    mocks.fetch.mockResolvedValue(Response.json({ status: "validation_error", fieldErrors: { email: ["Enter a valid email address."] } }, { status: 400 }));
    render(<LeadForm type="contact" />);
    fillContact();
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));
    await screen.findByText("Please check the highlighted fields and submit again.");
    expect(screen.getByLabelText("Email Address")).toHaveFocus();
    expect(screen.getByLabelText("Email Address")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Email Address")).toHaveAccessibleDescription("Enter a valid email address.");
  });

  it("sends quote fields to the quote endpoint", async () => {
    mocks.fetch.mockResolvedValue(Response.json({ status: "success" }));
    render(<LeadForm type="quote" />);
    fireEvent.change(screen.getByLabelText("Service"), { target: { value: "Apparel Printing" } });
    fireEvent.change(screen.getByLabelText("Estimated Quantity"), { target: { value: "50" } });
    fireEvent.change(screen.getByLabelText("Project Details"), { target: { value: "Please quote fifty printed shirts." } });
    fireEvent.click(screen.getByRole("button", { name: "Request My Quote" }));
    await screen.findByText("Thanks! Your quote request has been sent.");
    expect(mocks.fetch).toHaveBeenCalledWith("/api/quote", expect.objectContaining({ method: "POST" }));
    expect(JSON.parse(mocks.fetch.mock.calls[0][1].body)).toMatchObject({ service: "Apparel Printing", quantity: "50", projectDetails: "Please quote fifty printed shirts." });
  });

  it("prevents duplicate submissions while a request is pending", async () => {
    let finish!: (response: Response) => void;
    mocks.fetch.mockReturnValue(new Promise<Response>((resolve) => { finish = resolve; }));
    const { container } = render(<LeadForm type="contact" />);
    fillContact();
    fireEvent.submit(container.querySelector("form")!);
    fireEvent.submit(container.querySelector("form")!);
    expect(mocks.fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Sending..." })).toBeDisabled();
    finish(Response.json({ status: "success" }));
    await waitFor(() => expect(screen.getByText("Thanks! Your message has been sent.")).toBeInTheDocument());
  });
});
