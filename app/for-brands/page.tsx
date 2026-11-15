import type {Metadata} from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'For Brands | Collaborate With Toronto Discounts',
  description: 'Partner with Toronto Discounts for Toronto-focused brand campaigns, restaurant openings, events and social media collaborations. Explore our previous work.',
  alternates: {canonical: '/for-brands'},
}

const campaigns = [
  {
    "title": "CBC — North of North",
    "category": "Entertainment · Event coverage",
    "description": "On-location coverage of CBC’s immersive Toronto experience.",
    "url": "https://www.instagram.com/reel/DdK5NfxOsh5/"
  },
  {
    "title": "Rosso Pasta Bar — The Well",
    "category": "Food · Restaurant collaboration",
    "description": "Dining content highlighting build-your-own pasta, gelato and tiramisu.",
    "url": "https://www.instagram.com/reel/DfKimw2Sb4a/"
  },
  {
    "title": "Toronto Santa Claus Parade",
    "category": "Entertainment · Media preview",
    "description": "Behind-the-scenes coverage of Santa’s workshop, preparations and the 2026 route.",
    "url": "https://www.instagram.com/reel/DfaHgLzSH3w/"
  },
  {
    "title": "EGA Experience — Candlelight Concert",
    "category": "Entertainment · Affiliate partnership",
    "description": "Content promoting a Toronto candlelit string quartet experience and audience discount.",
    "url": "https://www.instagram.com/reel/DeX3HuUSurF/"
  },
  {
    "title": "H Mart — Cummer Grand Opening",
    "category": "Retail · Grand opening",
    "description": "On-location coverage of the store launch, Korean food and shopping experience.",
    "url": "https://www.instagram.com/reel/DdXpdgFu-Mn/"
  },
  {
    "title": "Grace of Earth",
    "category": "Lifestyle · Brand collaboration",
    "description": "Content showcasing Grace of Earth Morel Mushrooms.",
    "url": "https://www.instagram.com/reel/DeVVzrySJO-/"
  },
  {
    "title": "Casa Loma — Legends of Horror",
    "category": "Entertainment · Seasonal coverage",
    "description": "On-location content showcasing the Halloween experience at Casa Loma.",
    "url": "https://www.instagram.com/reel/DenRIe0S0RA/"
  },
  {
    "title": "DJI",
    "category": "Technology · Brand partnership",
    "description": "Sponsored content created for DJI and shared with the Toronto community.",
    "url": "https://www.instagram.com/reel/Dany6O8yC2V/"
  },
  {
    "title": "Fresh Burger — Queen Street West",
    "category": "Food · Grand opening",
    "description": "Launch promotion featuring free burgers and a BOGO offer.",
    "url": "https://www.instagram.com/p/Dd6rcQyy5sk/"
  },
  {
    "title": "HEAL Wellness",
    "category": "Wellness · Grand opening",
    "description": "Coverage of a new location, menu and opening experience.",
    "url": "https://www.instagram.com/reel/Daq6NXgSCLL/"
  },
  {
    "title": "Ajisen Ramen",
    "category": "Food · Brand partnership",
    "description": "Sponsored Instagram content promoting Ajisen Ramen.",
    "url": "https://www.instagram.com/p/DbbAs9Vulem/"
  },
  {
    "title": "Juice Dudez — The Well",
    "category": "Food · Invited coverage",
    "description": "Grand-opening content highlighting desserts and the launch giveaway.",
    "url": "https://www.instagram.com/reel/DX-bChwBlMY/"
  },
  {
    "title": "Egg Club",
    "category": "Food · Brand partnership",
    "description": "Social content showcasing the restaurant’s new menu.",
    "url": "https://www.instagram.com/reel/DdCgd1VSV-6/"
  },
  {
    "title": "Bather",
    "category": "Fashion · Brand partnership",
    "description": "On-location coverage of a Toronto retail moving sale.",
    "url": "https://www.instagram.com/reel/DcTnUDrO9Eg/"
  },
  {
    "title": "Fuwa Fuwa Pancakes",
    "category": "Food · Brand partnership",
    "description": "Content promoting a limited-time mango soufflé pancake and smoothie offer.",
    "url": "https://www.instagram.com/reel/DboPXCmSvax/"
  }
]
const partners = ["DJI","Casa Loma","H Mart","Bather","Egg Club","HEAL Wellness","Ajisen Ramen","Playa Bowls","CBC","EGA Experience","Toronto Santa Claus Parade","Fresh Burger","Grace of Earth","Rosso Pasta Bar"]

export default function ForBrandsPage() {
  return (
    <main className="bg-[#080808] text-white">
      <section className="relative overflow-hidden border-b border-[#ff6a00]/20 px-6 py-20 md:py-28" style={{background:'radial-gradient(circle at 90% 10%,rgba(255,106,0,.18),transparent 40%),#080808'}}>
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.2fr_.8fr] md:items-center">
          <div>
            <p className="mb-5 text-xs font-extrabold uppercase tracking-[.2em] text-[#ffb800]">Toronto local discovery · @torontodiscounts</p>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">Helping brands get discovered in <span className="text-[#ffc400]">Toronto.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">Toronto Discounts connects brands with a local community looking for restaurants, experiences, launches, promotions and things to do across Toronto and the GTA.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="mailto:discountstoronto@gmail.com?subject=Toronto%20Discounts%20Collaboration" className="rounded-full bg-[#ffc400] px-7 py-3 font-bold text-black hover:bg-[#ffb800]">Collaborate with us</a>
              <a href="#our-work" className="rounded-full border border-[#ffc400] px-7 py-3 font-bold hover:bg-white/10">Explore our work</a>
            </div>
          </div>
          <div className="rounded-3xl border border-[#ffc400]/25 bg-gradient-to-br from-[#1b1b1b] to-[#0d0d0d] p-10 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#ffc400]">Toronto Discounts</p>
            <p className="mt-7 text-4xl font-extrabold leading-tight">Local stories. Real experiences. Shareable discoveries.</p>
            <p className="mt-6 text-white/60">Restaurants · Events · Retail · Experiences</p>
            <a href="https://www.instagram.com/torontodiscounts/" target="_blank" rel="noopener noreferrer" className="mt-8 inline-block text-sm font-bold text-[#ffc400] underline underline-offset-4">Visit @torontodiscounts</a>
          </div>
        </div>
      </section>
      <section className="border-b border-white/10 bg-[#101010] px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 text-center sm:grid-cols-3">
          <div><p className="text-4xl font-extrabold text-[#ffc400]">26K+</p><p className="mt-2 text-sm text-white/60">Instagram community · Nov 2026</p></div>
          <div><p className="text-4xl font-extrabold text-[#ffc400]">Toronto & GTA</p><p className="mt-2 text-sm text-white/60">Local discovery audience</p></div>
          <div><p className="text-4xl font-extrabold text-[#ffc400]">3.1M+</p><p className="mt-2 text-sm text-white/60">Views in a 30-day period · supplied snapshot</p></div>
        </div>
      </section>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#ffb800]">Selected brands and collaborators</h2>
          <div className="mt-6 flex flex-wrap gap-3">{partners.map(name=><span key={name} className="rounded-full border border-white/15 bg-[#161616] px-4 py-2 text-sm font-semibold text-white/85">{name}</span>)}</div>
        </div>
      </section>
      <section id="our-work" className="bg-[#101010] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#ffb800]">Selected collaborations</p>
          <h2 className="mt-3 text-4xl font-extrabold md:text-5xl">Content we've created with brands.</h2>
          <p className="mt-4 max-w-2xl text-white/60">A selection of restaurant launches, brand partnerships, media previews and Toronto experiences from our portfolio.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map(campaign=>(
              <article key={campaign.url} className="flex flex-col rounded-2xl border border-white/10 bg-[#191919] p-6 transition hover:border-[#ffc400]/60">
                <p className="text-xs font-extrabold uppercase tracking-wide text-[#ffb800]">{campaign.category}</p>
                <h3 className="mt-4 text-xl font-bold">{campaign.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-white/60">{campaign.description}</p>
                <a href={campaign.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex self-start rounded-full border border-[#ffc400]/50 px-4 py-2 text-sm font-bold text-[#ffc400] hover:bg-[#ffc400] hover:text-black">View Instagram campaign ↗</a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#ffb800]">Partner with us</p>
          <h2 className="mt-3 text-4xl font-extrabold">Different ways we can work together.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['01','Instagram Reels','Short-form content showcasing your product, location, event or experience.'],
              ['02','Feed Posts','Branded posts and carousels built for local discovery.'],
              ['03','Instagram Stories','Timely promotion for openings, offers and activations.'],
              ['04','Event Coverage','On-location storytelling that brings audiences into the experience.'],
            ].map(([number,title,description])=><div key={number} className="rounded-2xl border border-white/10 bg-[#151515] p-6"><span className="text-sm font-bold text-[#ffb800]">{number}</span><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/60">{description}</p></div>)}
          </div>
        </div>
      </section>
      <section className="border-y border-white/10 bg-[#101010] px-6 py-20">
        <div className="mx-auto max-w-7xl md:grid md:grid-cols-2 md:gap-16">
          <div><p className="text-xs font-extrabold uppercase tracking-widest text-[#ffb800]">Why Toronto Discounts</p><h2 className="mt-3 text-4xl font-extrabold">Local content built around discovery.</h2><p className="mt-5 text-white/60">Our audience comes to us for new places, experiences, openings and promotions around Toronto.</p></div>
          <div className="mt-8 space-y-4 md:mt-0">{[['Toronto-focused community','Reach people interested in exploring their own city.'],['Social-first storytelling','Content designed for how people discover and share on Instagram.'],['Built for launches','A fit for restaurants, pop-ups, seasonal campaigns and brand activations.']].map(([title,description])=><div key={title} className="rounded-xl border border-white/10 bg-[#191919] p-5"><h3 className="font-bold text-[#ffc400]">{title}</h3><p className="mt-2 text-sm text-white/60">{description}</p></div>)}</div>
        </div>
      </section>
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#ffc400]/40 bg-[#141414] px-6 py-16">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#ffb800]">Let's collaborate</p>
          <h2 className="mt-4 text-4xl font-extrabold">Planning something exciting in Toronto?</h2>
          <p className="mx-auto mt-5 max-w-xl text-white/60">We'd love to hear about your upcoming launch, campaign, event or brand activation.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="mailto:discountstoronto@gmail.com?subject=Toronto%20Discounts%20Collaboration" className="rounded-full bg-[#ffc400] px-6 py-3 font-bold text-black">Start a collaboration</a>
            <a href="https://www.instagram.com/torontodiscounts/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#ffc400] px-6 py-3 font-bold">View Instagram</a>
          </div>
        </div>
      </section>
      <div className="px-6 pb-8 text-center text-xs text-white/45">Toronto Discounts is the social media community behind this portfolio. <Link href="/" className="underline">Explore Toronto Finds</Link>.</div>
    </main>
  )
}
