"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useScreenSize } from "@/components/hooks/use-screen-size";
import { PixelTrail } from "@/components/ui/pixel-trail";
import { CopyTooltip } from "@/components/ui/copy-tooltip";

function getTimeBasedImage(): string {
  const hour = new Date().getHours();
  const pick = (a: string, b: string) => (Math.random() < 0.5 ? a : b);

  if (hour >= 7 && hour < 18) return pick("/snowytrees.jpeg", "/seabridge.jpeg");
  if (hour >= 19 || hour < 6) return pick("/parinights.jpeg", "/jamnight.jpeg");
  return "/crocsbeach.jpeg";
}

export default function Home() {
  const screenSize = useScreenSize();
  const imageSrc = useMemo(() => getTimeBasedImage(), []);

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 48 : 80}
          fadeDuration={0}
          delay={1200}
          pixelClassName="rounded-full bg-[var(--accent)]"
        />
      </div>

      <div className="relative z-10 pointer-events-none pt-[18vh] pb-24 pl-[8%] max-[700px]:pl-6">
        <p className="text-[2.5rem] leading-[1.5] max-[700px]:text-[1.75rem] max-w-[60%] max-[700px]:max-w-[90%]">
          I'm Darren and I like to build better experiences.
          <br /><br />
          Currently studying how to be better at design, product development, and leveraging AI tools. Product Manager and Microsoft alum, always learning. Based in Philadelphia, PA.
        </p>

        <div className="mt-[30vh] max-[700px]:mt-[20vh] flex gap-10 items-start max-[700px]:flex-col max-w-[85%] max-[700px]:max-w-[90%]">
          <div className="flex-1">
            <p className="text-[1.25rem] leading-[1.5] max-[700px]:text-[1.125rem]">Creators have the opportunity to change the world. Maybe even a responsibility.
              <br></br>
              I'm a product manager with four years of experience working on building complex platform capabilities with intuitive user experiences, and driving adoption at enterprise scale. <br></br>
              <br></br>
              I believe my work as a PM is about improving lives in ways small and large by way of providing value to people. This means staying empathetic, focusing on outcomes, and explicit validation mechanisms that include but are not limited to simply the adoption of a product.
            </p>
            <p className="mt-8 text-[1.25rem] leading-[1.5] max-[700px]:text-[1.125rem]">Reach out to me at <CopyTooltip text="me@darrengiles.com">me@darrengiles.com</CopyTooltip>. Or any of the social links provided below.</p>
          </div>
          <Image
            src={imageSrc}
            alt=""
            width={400}
            height={500}
            className="rounded-xl object-cover w-[350px] h-auto max-[700px]:w-full flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
