/* eslint-disable react/jsx-no-bind */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function Pagination({
  pageIndex,
  isFirstPage,
  isLastPage
}) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  // Define functions for navigating to the next and previous pages
  // These functions update the page query parameter in the URL
  const handleNextPage = () => {
    params.set("page", (pageIndex + 1).toString());
    const query = params.toString();

    router.push(`/archive?${query}`);
  };

  const handlePrevPage = () => {
    params.set("page", (pageIndex - 1).toString());
    const query = params.toString();

    router.push(`/archive?${query}`);
  };

  return (
    <div className="mt-16 flex items-center justify-center">
      <nav className="isolate inline-flex" aria-label="Pagination">
        <button
          disabled={isFirstPage}
          onClick={handlePrevPage}
          className="btn-outline gap-2 px-6 py-3">
          <ChevronLeftIcon className="h-3 w-3" aria-hidden="true" />
          <span>Previous</span>
        </button>
        <button
          onClick={handleNextPage}
          disabled={isLastPage}
          className="btn-outline -ml-px gap-2 px-6 py-3">
          <span>Next</span>
          <ChevronRightIcon className="h-3 w-3" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
