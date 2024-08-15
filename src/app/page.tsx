import { ExpandableCard } from "@/components/ui/ExpandableCard";
import Image from "next/image";
import Login from "./auth/Login";

export default function Home() {
  return (
    <main className="min-h-screen flex-col items-center justify-between">
      {/* <ExpandableCard /> */}
      
      <Login />
    
    </main>
  );
}
