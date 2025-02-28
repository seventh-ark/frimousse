import { Hero } from "@/components/sections/hero";
import { Installation } from "@/components/sections/installation";
import { Usage } from "@/components/sections/usage";

export default function Page() {
  return (
    <>
      <Hero />
      <section className="content mt-10 flex flex-col gap-8 md:mt-16">
        <Installation />
        <Usage />
      </section>
    </>
  );
}
