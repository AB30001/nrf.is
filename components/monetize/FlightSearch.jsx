"use client";

import { useEffect, useRef, useState } from "react";
import { campaignLabel } from "@/lib/monetize/campaign";
import { affiliateProps, stay22Link } from "@/lib/monetize/links";

const FIELD =
  "w-full border border-basalt-lighter bg-night px-4 py-3 text-sm text-mist placeholder:text-mist-dim/70 outline-none transition-colors focus:border-bronze [color-scheme:dark]";

const DEFAULT_TO = { code: "REK", city: "Reykjavík", name: "Reykjavík", country: "Iceland" };

function today() {
  return new Date().toISOString().slice(0, 10);
}

/** City/airport input with suggestions from /api/places (our own proxy). */
function PlaceInput({ label, value, onChange, placeholder, autoFocus }) {
  const [text, setText] = useState(value ? `${value.city} (${value.code})` : "");
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const timer = useRef();

  useEffect(() => {
    if (!open || text.length < 2 || (value && text === `${value.city} (${value.code})`)) {
      setOptions([]);
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places?term=${encodeURIComponent(text)}`);
        setOptions(await res.json());
        setActive(0);
      } catch {
        setOptions([]);
      }
    }, 250);
    return () => clearTimeout(timer.current);
  }, [text, open, value]);

  const choose = place => {
    onChange(place);
    setText(`${place.city} (${place.code})`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="sr-only">{label}</label>
      <input
        type="text"
        value={text}
        placeholder={placeholder}
        autoComplete="off"
        autoFocus={autoFocus}
        aria-label={label}
        className={FIELD}
        onFocus={event => {
          setOpen(true);
          event.target.select();
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={event => {
          setText(event.target.value);
          onChange(null);
          setOpen(true);
        }}
        onKeyDown={event => {
          if (!options.length) return;
          if (event.key === "ArrowDown") setActive(i => Math.min(i + 1, options.length - 1));
          else if (event.key === "ArrowUp") setActive(i => Math.max(i - 1, 0));
          else if (event.key === "Enter") choose(options[active]);
          else return;
          event.preventDefault();
        }}
      />
      {open && options.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto border border-basalt-lighter bg-basalt shadow-2xl shadow-night">
          {options.map((place, index) => (
            <li key={`${place.type}-${place.code}-${index}`}>
              <button
                type="button"
                onMouseDown={event => event.preventDefault()}
                onClick={() => choose(place)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  index === active ? "bg-basalt-light text-frost-light" : "text-mist"
                }`}>
                <span className="min-w-0 truncate">
                  {place.name}
                  <span className="text-mist-dim">, {place.country}</span>
                </span>
                <span className="shrink-0 text-xs text-mist-dim">{place.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Flight search box. Search opens real Kiwi.com results (Aviasales as a
 * fallback) in a new tab through /api/go/flights, which mints the tracked
 * link server-side. Nothing loads from partners until the reader searches.
 */
export default function FlightSearch({ slug, placement = "search", heading, kicker = "Find flights" }) {
  const label = campaignLabel(slug, placement);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(DEFAULT_TO);
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [adults, setAdults] = useState(1);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(null);

  const submit = event => {
    event.preventDefault();
    if (!from || !to) return setError("Pick both cities from the suggestions.");
    if (!depart) return setError("Choose a departure date.");
    if (ret && ret < depart) return setError("The return date is before the departure date.");
    setError("");

    const params = new URLSearchParams({ from: from.code, to: to.code, depart, adults, label });
    if (ret) params.set("return", ret);
    window.open(`/api/go/flights?${params}`, "_blank");
    window.goatcounter?.count?.({ path: `aff/kiwi/${label}`, title: "Flight search", event: true });
    setSearched({ to, depart, ret, adults });
  };

  return (
    <section
      aria-label={heading || "Flight search"}
      data-monetize="flight-search"
      className="not-prose border border-basalt-light bg-basalt p-5 sm:p-6">
      <p className="kicker">{kicker}</p>
      {heading && (
        <h2 className="mt-2 font-serif text-2xl font-normal text-frost-light">{heading}</h2>
      )}

      <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <PlaceInput label="From" value={from} onChange={setFrom} placeholder="From: city or airport" />
        </div>
        <div className="lg:col-span-3">
          <PlaceInput label="To" value={to} onChange={setTo} placeholder="To: city or airport" />
        </div>
        <input
          type="date"
          aria-label="Departure date"
          min={today()}
          value={depart}
          onChange={event => setDepart(event.target.value)}
          className={`${FIELD} lg:col-span-2`}
        />
        <input
          type="date"
          aria-label="Return date (optional)"
          min={depart || today()}
          value={ret}
          onChange={event => setRet(event.target.value)}
          className={`${FIELD} lg:col-span-2`}
        />
        <select
          aria-label="Passengers"
          value={adults}
          onChange={event => setAdults(Number(event.target.value))}
          className={`${FIELD} lg:col-span-1`}>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <option key={n} value={n}>
              {n} {n === 1 ? "adult" : "adults"}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-bronze px-4 lg:col-span-1">
          Search
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-bronze-light">{error}</p>}

      {searched ? (
        <p className="mt-4 text-sm text-mist-dim">
          Results open in a new tab. Need somewhere to stay?{" "}
          <a
            href={stay22Link({
              address: searched.to.city,
              checkin: searched.depart,
              checkout: searched.ret || undefined,
              adults: searched.adults,
              campaign: label
            })}
            {...affiliateProps("stay22", label)}
            className="text-bronze underline underline-offset-2 hover:text-bronze-light">
            See places to stay in {searched.to.city}
          </a>
        </p>
      ) : (
        <p className="mt-4 text-xs text-mist-dim">
          Searches Kiwi.com for the best combination of airlines. We may earn a commission if you
          book. Return date optional.
        </p>
      )}
    </section>
  );
}
