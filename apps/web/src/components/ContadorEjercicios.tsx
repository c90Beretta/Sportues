import { useEffect } from "react";
import { useEjerciciosStore } from "../stores/ejerciciosStore";

export default function ContadorEjercicios() {
  const count = useEjerciciosStore((s) => s.items.length);
  const fetchAll = useEjerciciosStore((s) => s.fetchAll);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return <span className="status-pill">{count} ejercicios</span>;
}