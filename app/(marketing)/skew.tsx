// "use client";
// // import { Logo } from '@/components/logo'
// import Link from "next/link";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Menu, X } from "lucide-react";
// import Image from "next/image";

// export default function Skew() {
//   return (
//     <section className="overflow-hidden bg-white dark:bg-transparent">
//       <div className="mx-auto -mt-16 max-w-7xl">
//         <div className="perspective-distant -mr-16 pl-16 lg:-mr-56 lg:pl-56">
//           <div className="[transform:rotateX(20deg);]">
//             <div className="lg:h-176 relative skew-x-[.36rad]">
//               <div
//                 aria-hidden
//                 className="bg-linear-to-b from-background to-background z-1 absolute -inset-16 via-transparent sm:-inset-32"
//               />
//               <div
//                 aria-hidden
//                 className="bg-linear-to-r from-background to-background z-1 absolute -inset-16 bg-white/50 via-transparent sm:-inset-32 dark:bg-transparent"
//               />

//               <div
//                 aria-hidden
//                 className="absolute -inset-16 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] [--color-border:var(--color-zinc-400)] sm:-inset-32 dark:[--color-border:color-mix(in_oklab,var(--color-white)_20%,transparent)]"
//               />
//               <div
//                 aria-hidden
//                 className="from-background z-11 absolute inset-0 bg-gradient-to-l"
//               />
//               <div
//                 aria-hidden
//                 className="z-2 absolute inset-0 size-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,var(--color-background)_100%)]"
//               />
//               <div
//                 aria-hidden
//                 className="z-2 absolute inset-0 size-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,var(--color-background)_100%)]"
//               />

//               <div className="h-150 shrink-0 overflow-hidden [mask-image:radial-gradient(white_30%,transparent_90%)] perspective-[4000px] perspective-origin-center">
//                 <div className="-translate-y-10 -translate-z-10 rotate-x-10 rotate-y-20 -rotate-z-10 transform-3d">
//                   <Image
//                     className="rounded-(--radius) z-1 relative border dark:hidden"
//                     src="/analytics.png"
//                     alt="Tailark hero section"
//                     width={2880}
//                     height={2074}
//                   />
//                 </div>
//               </div>
//               {/* <Image
//                 className="rounded-(--radius) z-1 relative hidden border dark:block"
//                 src="/dark-card.webp"
//                 alt="Tailark hero section"
//                 width={2880}
//                 height={2074}
//               /> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
