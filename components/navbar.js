"use client";

import { Fragment, useEffect, useState } from "react";
import { Menu, Transition, Disclosure } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import cx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import LogoImg from "@/public/img/logo.png";

export default function Navbar(props) {
  const categories = props.categories || [];

  const leftmenu = [
    {
      label: "Home",
      href: "/"
    },
    {
      label: "Categories",
      href: "/archive",
      children: [
        { title: "All Posts", path: "/archive" },
        ...categories
          .filter(cat => cat?.slug?.current)
          .map(cat => ({
            title: cat.title,
            path: `/category/${cat.slug.current}`
          }))
      ]
    }
  ];

  const rightmenu = [
    {
      label: "About",
      href: "/about"
    },
    {
      label: "Contact",
      href: "/contact"
    }
  ];

  const mobilemenu = [...leftmenu, ...rightmenu];

  // Transparent over the hero, solid once the page starts scrolling.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Disclosure
      as="header"
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled
          ? "border-b border-basalt-light bg-night/90 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-night/80 to-transparent"
      )}>
      {({ open }) => (
        <>
          <div className="container mx-auto max-w-screen-xl px-6 xl:px-5">
            <nav className="flex h-20 items-center justify-between gap-6">
              {/* Desktop — left cluster */}
              <div className="hidden flex-1 items-center md:flex">
                {leftmenu.map((item, index) => (
                  <Fragment key={`${item.label}${index}`}>
                    {item.children && item.children.length > 0 ? (
                      <DropdownMenu menu={item} items={item.children} />
                    ) : (
                      <NavLink item={item} />
                    )}
                  </Fragment>
                ))}
              </div>

              {/* Logo — centred on desktop, leading on mobile */}
              <div className="flex flex-1 items-center justify-between md:flex-none md:justify-center">
                <Logo logo={props.logoalt || props.logo} />

                <Disclosure.Button
                  aria-label="Toggle Menu"
                  className="-mr-2 ml-auto p-2 text-mist transition-colors hover:text-bronze focus:outline-none md:hidden">
                  <svg
                    className="h-6 w-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    {open && (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                      />
                    )}
                    {!open && (
                      <path
                        fillRule="evenodd"
                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                      />
                    )}
                  </svg>
                </Disclosure.Button>
              </div>

              {/* Desktop — right cluster */}
              <div className="hidden flex-1 items-center justify-end md:flex">
                {rightmenu.map((item, index) => (
                  <Fragment key={`${item.label}${index}`}>
                    {item.children && item.children.length > 0 ? (
                      <DropdownMenu menu={item} items={item.children} />
                    ) : (
                      <NavLink item={item} />
                    )}
                  </Fragment>
                ))}
              </div>
            </nav>
          </div>

          <Disclosure.Panel className="border-t border-basalt-light bg-night/95 backdrop-blur-md md:hidden">
            <div className="container mx-auto flex max-w-screen-xl flex-col px-6 py-4">
              {mobilemenu.map((item, index) => (
                <Fragment key={`${item.label}${index}`}>
                  {item.children && item.children.length > 0 ? (
                    <DropdownMenu
                      menu={item}
                      items={item.children}
                      mobile={true}
                    />
                  ) : (
                    <NavLink item={item} mobile />
                  )}
                </Fragment>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

function Logo({ logo }) {
  return (
    <Link
      href="/"
      className="block w-32 shrink-0 sm:w-36"
      aria-label="NRF.is — home">
      {logo ? (
        <Image
          {...urlForImage(logo)}
          alt="NRF.is"
          priority={true}
          sizes="(max-width: 640px) 128px, 144px"
        />
      ) : (
        // The bundled fallback mark is black artwork on a transparent
        // background, so it is inverted to read against the dark palette.
        // Sanity-supplied logos are rendered as authored.
        <Image
          src={LogoImg}
          alt="NRF.is"
          priority={true}
          sizes="(max-width: 640px) 128px, 144px"
          className="invert"
        />
      )}
    </Link>
  );
}

function NavLink({ item, mobile }) {
  return (
    <Link
      href={item.href}
      target={item.external ? "_blank" : ""}
      rel={item.external ? "noopener" : ""}
      className={cx(
        "text-[0.7rem] font-medium uppercase tracking-[0.18em] text-mist transition-colors duration-300 hover:text-bronze",
        mobile ? "w-full border-b border-basalt-light py-3.5" : "px-5 py-2"
      )}>
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-2 bg-bronze/20 px-2 py-0.5 text-[0.65rem] font-semibold text-bronze">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

const DropdownMenu = ({ menu, items, mobile }) => {
  return (
    <Menu as="div" className={cx("relative text-left", mobile && "w-full")}>
      {({ open }) => (
        <>
          <Menu.Button
            className={cx(
              "flex items-center gap-x-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] outline-none transition-colors duration-300",
              open ? "text-bronze" : "text-mist hover:text-bronze",
              mobile
                ? "w-full border-b border-basalt-light py-3.5"
                : "px-5 py-2"
            )}>
            <span>{menu.label}</span>
            <ChevronDownIcon
              className={cx(
                "h-3.5 w-3.5 transition-transform duration-300",
                open && "rotate-180"
              )}
            />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="md:transition md:ease-out md:duration-150"
            enterFrom="md:transform md:opacity-0 md:-translate-y-1"
            enterTo="md:transform md:opacity-100 md:translate-y-0"
            leave="md:transition md:ease-in md:duration-100"
            leaveFrom="md:transform md:opacity-100 md:translate-y-0"
            leaveTo="md:transform md:opacity-0 md:-translate-y-1">
            <Menu.Items
              className={cx(
                "z-20 origin-top-left focus:outline-none md:absolute md:left-3 md:mt-2 md:w-60",
                mobile
                  ? "block"
                  : "border border-basalt-lighter bg-basalt shadow-2xl shadow-night/60"
              )}>
              <div className={cx(mobile ? "py-1 pl-4" : "py-2")}>
                {items.map((item, index) => (
                  <Menu.Item as="div" key={`${item.title}${index}`}>
                    {({ active }) => (
                      <Link
                        href={item?.path ? item.path : "#"}
                        className={cx(
                          "flex items-center border-l-2 py-2.5 pl-4 pr-5 text-sm transition-colors duration-200",
                          active
                            ? "border-bronze bg-basalt-light/60 text-bronze"
                            : "border-transparent text-mist-dim hover:text-bronze"
                        )}>
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
