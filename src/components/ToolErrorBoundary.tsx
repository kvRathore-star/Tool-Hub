"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ToolErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Tool Workspace Crashed:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="bg-red-950/30 border border-red-500/20 rounded-3xl p-8 max-w-xl w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Workspace Crashed</h2>
            <p className="text-red-300/80 mb-8 font-mono text-xs break-words bg-black/20 p-4 rounded-xl">
              {this.state.error?.message || "An unexpected processing error occurred."}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg"
            >
              Reset Tool Workspace
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
