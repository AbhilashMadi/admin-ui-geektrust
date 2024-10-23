import { describe, expect, it } from "vitest";
import App from "@/App";
import { render, screen, waitFor } from "@testing-library/react";

describe("<AdminTable/>", () => {
  it("should have `search` input", async () => {
    const { container } = render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("search-input")).toBeInTheDocument();

      const searchIconEle = container.querySelector(".search-icon");
      expect(searchIconEle).toBeInTheDocument();
    });
  });

  it("should render edit functionality elements", async () => {
    const { container } = render(<App />);

    await waitFor(() => {
      const editElem = container.querySelector("button.edit");
      const deleteElem = container.querySelector("button.delete");
      expect(editElem).toBeInTheDocument();
      expect(deleteElem).toBeInTheDocument();
    });
  });

  it("should have pagination functionality elements", async () => {
    const { container } = render(<App />);

    await waitFor(() => {
      const paginationElems = [
        container.querySelector(".next-page"),
        container.querySelector(".previous-page"),
        container.querySelector(".first-page"),
        container.querySelector(".last-page"),
      ];

      paginationElems.forEach((elem) => {
        expect(elem).toBeInTheDocument();
        expect(elem?.tagName).toBe("BUTTON");
      });
    });
  });

  it("should have delete secleted rows button", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("delete-selected")).toBeInTheDocument();
    })
  })
});
