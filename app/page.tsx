import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/molecules/Card";
import { WelcomeBanner } from "@/components/molecules/WelcomeBanner";
import { AppLayout } from "@/components/templates/AppLayout";

export default function Home() {
  return (
    <AppLayout>
      <section className="space-y-6">
        <WelcomeBanner />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Learn React"
            description="Build UI with reusable components and props."
            footer={<Button>Get Started</Button>}
          />
          <Card
            title="Atomic Design"
            description="Organize components from atoms to pages."
            footer={<Button variant="secondary">Read More</Button>}
          />
          <Card
            title="Next.js App Router"
            description="Use layouts, pages, and server components."
            footer={<Button variant="ghost">Explore</Button>}
          />
        </div>
      </section>
    </AppLayout>
  );
}
