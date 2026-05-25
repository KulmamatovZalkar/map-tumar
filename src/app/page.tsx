"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { stores } from "@/data/stores";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const grouped = useMemo(() => {
    const byCity = new Map<string, typeof stores>();
    stores.forEach((s) => {
      if (!byCity.has(s.city)) byCity.set(s.city, []);
      byCity.get(s.city)!.push(s);
    });
    return Array.from(byCity.entries());
  }, []);

  const handleSelect = (id: string) => {
    setActiveId(id);
    setDrawerOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      <header className="flex items-center gap-3 sm:gap-5 px-4 sm:px-8 py-4 sm:py-5 border-b border-stone-200 bg-white">
        <button
          type="button"
          aria-label="Открыть список магазинов"
          onClick={() => setDrawerOpen(true)}
          className="md:hidden p-2 -ml-2 rounded hover:bg-stone-100 text-[#39423E]"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <a href="https://tumar.com" target="_blank" rel="noopener noreferrer" className="shrink-0">
          <Image
            src="/tumar-logo.svg"
            alt="Tumar"
            width={120}
            height={40}
            priority
          />
        </a>
        <div className="border-l border-stone-200 pl-3 sm:pl-5">
          <h1 className="text-base sm:text-xl font-semibold tracking-tight text-stone-900">
            Где купить
          </h1>
          <p className="hidden sm:block text-sm text-stone-500 mt-0.5">
            Наши стенды и магазины-партнёры по Кыргызстану
          </p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {drawerOpen && (
          <button
            type="button"
            aria-label="Закрыть"
            onClick={() => setDrawerOpen(false)}
            className="md:hidden fixed inset-0 z-30 bg-black/40"
          />
        )}

        <aside
          className={`
            bg-white border-r border-stone-200 overflow-y-auto
            md:static md:w-[420px] md:translate-x-0 md:z-auto
            fixed top-0 left-0 z-40 w-[85%] max-w-[360px] h-full
            transition-transform duration-300 ease-out
            ${drawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-stone-200">
            <span className="font-semibold text-stone-900">Где купить</span>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={() => setDrawerOpen(false)}
              className="p-1 -mr-1 rounded hover:bg-stone-100 text-[#39423E]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <ul className="divide-y divide-stone-100">
            {grouped.map(([city, list]) => (
              <li key={city}>
                <div className="px-6 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
                  {city}
                </div>
                <ul>
                  {list.map((s) => {
                    const active = s.id === activeId;
                    return (
                      <li key={s.id}>
                        <button
                          onClick={() => handleSelect(s.id)}
                          className={`w-full text-left px-6 py-4 transition-colors border-l-4 ${
                            active
                              ? "bg-amber-50 border-amber-500"
                              : "border-transparent hover:bg-stone-50"
                          }`}
                        >
                          <div className="font-medium text-stone-900">
                            {s.name}
                          </div>
                          <div className="text-sm text-stone-600 mt-0.5">
                            {s.address}
                          </div>
                          <a
                            href={`tel:${s.phone.replace(/\s/g, "")}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-block text-sm text-amber-700 mt-1 hover:underline"
                          >
                            {s.phone}
                          </a>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
            <li className="px-6 py-5 text-sm text-stone-500">
              Онлайн:{" "}
              <a
                href="https://www.tumar.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 hover:underline"
              >
                www.tumar.com
              </a>
            </li>
          </ul>
        </aside>

        <main className="flex-1 relative">
          <MapView
            stores={stores}
            activeId={activeId}
            onMarkerClick={(id) => setActiveId(id || null)}
          />
        </main>
      </div>
    </div>
  );
}
