import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "@/App";

describe("should render <App/> correctly", () => {

  it("lazy loading should work properly", async () => {
    render(<App />);
    expect(screen.getByTestId("suspense-loader")).toBeInTheDocument();
  });

  it("should render the admin-list after loading", async () => {
    render(<App />);

    waitFor(() => { expect(screen.getByTestId("admin-table")).toBeInTheDocument() })
  })

});
