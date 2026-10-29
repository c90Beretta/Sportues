import { create } from "zustand";
import type { Ejercicio } from "@gimnasio/shared";
import { listEjercicios } from "../services/ejercicios";

type Status = "idle" | "loading" | "success" | "error";

interface EjerciciosState {
  items: Ejercicio[];
  status: Status;
  error: string | null;
  fetchAll: () => Promise<void>;
  getById: (id: string) => Ejercicio | undefined;
}

export const useEjerciciosStore = create<EjerciciosState>((set, get) => ({
  items: [],
  status: "idle",
  error: null,

  fetchAll: async () => {
    if (get().status !== "idle") return;
    set({ status: "loading", error: null });
    try {
      const items = await listEjercicios();
      set({ items, status: "success" });
    } catch (e) {
      set({
        status: "error",
        error: e instanceof Error ? e.message : "No se pudieron cargar los ejercicios",
      });
    }
  },

  getById: (id) => get().items.find((e) => e.id === id),
}));