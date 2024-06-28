import Image from "next/image";

export default function MobileBanner() {
  return (
    <div className="MobileBanner">
      <div>
        <Image src="/icon-no-bg.png" alt="logo" width={320} height={320} />
      </div>
      <div>
        P5ai is a p5js editor with an AI assistant, but sadly only works on
        desktop
      </div>
    </div>
  );
}
