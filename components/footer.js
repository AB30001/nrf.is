import Container from "@/components/container";
import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

export default function Footer(props) {
  return (
    <Container className="mt-10 border-t border-gray-100 dark:border-gray-800">
      <div className="text-center text-sm">
        Copyright © {new Date().getFullYear()} {props?.copyright || SITE_NAME}. All
        rights reserved.
      </div>
      <div className="mt-1 text-center text-sm text-gray-500 dark:text-gray-600">
        Your guide to the Land of Fire and Ice.
      </div>
      <div className="mt-2 text-center text-xs text-gray-400 dark:text-gray-700">
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
      </div>
    </Container>
  );
}
