"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Search, Sparkles, Zap, Layout, Sun, Moon, Home, CornerDownLeft } from "lucide-react";
import { toolsRegistry } from "@/registry/tools";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Toggle the menu when Cmd+K or Ctrl+K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  // Group tools by category
  const categories = React.useMemo(() => {
    const groups: Record<string, typeof toolsRegistry> = {};
    toolsRegistry.forEach((tool) => {
      if (!groups[tool.category]) {
        groups[tool.category] = [];
      }
      groups[tool.category].push(tool);
    });
    return groups;
  }, []);

  if (!open) {
    // We register the global trigger button check inside other components.
    // The dialog itself only mounts or registers here.
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors cursor-pointer w-48 justify-between"
      >
        <span className="flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5" />
          <span>Search tools...</span>
        </span>
        <kbd className="font-mono text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Search Button for display */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors cursor-pointer w-48 justify-between"
      >
        <span className="flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5" />
          <span>Search tools...</span>
        </span>
        <kbd className="font-mono text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">
          ⌘K
        </kbd>
      </button>

      {/* Cmdk Dialog Overlay */}
      <div 
        className="fixed inset-0 z-[100] bg-zinc-950/40 dark:bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-4"
        onClick={() => setOpen(false)}
      >
        <div 
          className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <Command className="flex flex-col h-full">
            <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 px-4">
              <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
              <Command.Input
                autoFocus
                placeholder="Search tools, categories, or actions..."
                className="w-full py-4 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 bg-transparent border-none outline-none focus:ring-0 text-base"
              />
              <button 
                onClick={() => setOpen(false)}
                className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ESC
              </button>
            </div>

            <Command.List className="overflow-y-auto p-2 flex-1 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
              <Command.Empty className="py-12 text-center text-sm text-zinc-500">
                No matching tools or settings found.
              </Command.Empty>

              <Command.Group heading="Actions" className="px-2 py-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/"))}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 cursor-pointer data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800/60 data-[selected=true]:text-zinc-950 dark:data-[selected=true]:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-zinc-400" />
                    <span>Go to Home Page</span>
                  </span>
                  <kbd className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                    <span>Enter</span>
                    <CornerDownLeft className="w-2.5 h-2.5" />
                  </kbd>
                </Command.Item>

                <Command.Item
                  onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 cursor-pointer data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800/60 data-[selected=true]:text-zinc-950 dark:data-[selected=true]:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <Moon className="w-4 h-4 text-zinc-400" />
                    )}
                    <span>Switch to {theme === "dark" ? "Light" : "Dark"} Mode</span>
                  </span>
                  <span className="text-[11px] text-zinc-400">Theme</span>
                </Command.Item>
              </Command.Group>

              {Object.entries(categories).map(([category, items]) => (
                <Command.Group
                  key={category}
                  heading={category === "indian-utilities" ? "Indian Utilities" : category}
                  className="mt-2 px-2 py-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider"
                >
                  {items.map((tool) => (
                    <Command.Item
                      key={tool.id}
                      onSelect={() =>
                        runCommand(() =>
                          router.push(
                            `/${tool.category.toLowerCase().replace(/\s+/g, "-")}/${tool.slug}`
                          )
                        )
                      }
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 cursor-pointer data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800/60 data-[selected=true]:text-zinc-950 dark:data-[selected=true]:text-white transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        {tool.category === "AI" ? (
                          <Sparkles className="w-4 h-4 text-violet-500" />
                        ) : tool.category === "indian-utilities" ? (
                          <Zap className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Layout className="w-4 h-4 text-blue-500" />
                        )}
                        <span className="font-medium">{tool.name}</span>
                        <span className="text-xs text-zinc-400 truncate max-w-[250px] font-normal">
                          &mdash; {tool.description}
                        </span>
                      </span>
                      <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded uppercase">
                        {tool.dependencies === "None" ? "local" : "api/wasm"}
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>

            <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between text-xs text-zinc-400 font-sans">
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="bg-zinc-200 dark:bg-zinc-850 px-1 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">↑↓</kbd>
                  <span>to navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-zinc-200 dark:bg-zinc-850 px-1 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">enter</kbd>
                  <span>to select</span>
                </span>
              </div>
              <div>
                <span>Press <kbd className="bg-zinc-200 dark:bg-zinc-850 px-1 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">esc</kbd> to close</span>
              </div>
            </div>
          </Command>
        </div>
      </div>
    </>
  );
}
