import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchInput({
  q,
  handleChange,
  placeholder
}) {
  return (
    <div className="relative">
      <input
        type="text"
        defaultValue={q}
        onChange={handleChange}
        placeholder={placeholder}
        name="q"
        id="q"
        className="field py-2.5 pr-10"
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <MagnifyingGlassIcon className="h-4 w-4 text-mist-dim" />
      </div>
    </div>
  );
}
