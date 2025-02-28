import { Hero } from "@/components/hero";
import { Installation } from "@/components/installation";

export default function Page() {
  return (
    <>
      <Hero />
      <section className="content mt-10 flex flex-col gap-8 md:mt-16">
        <Installation />
      </section>
    </>
  );
}
