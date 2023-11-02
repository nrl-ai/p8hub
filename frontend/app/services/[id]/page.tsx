import Link from 'next/link'
import { useRouter } from 'next/router'

export default function ServicePage({ params }: { params: { id: number } }) {

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
      <Link href={`/`} className="text-xl">
          ◄ Back
          </Link>
        <h1 className="text-2xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
        Host and use your own AI Services. Keep everything simple and private.
        </p>
      </div>
    </section>
  )
}
