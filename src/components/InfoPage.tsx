import Link from "next/link";

export const CONTACT_EMAIL = "grasphex.dev@gmail.com";
export const SITE_URL = "https://rankyou.grasphex.com";

/** サポート・プライバシーポリシーなど、ゲーム外の説明ページの共通レイアウト */
export function InfoPage({
  title,
  lead,
  children,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    // 説明ページはメールアドレスなどをコピーできるよう、文字選択を許可する
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 pt-[env(safe-area-inset-top)] pb-[calc(2.5rem+env(safe-area-inset-bottom))] select-text">
      <header className="pt-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span
            className="bg-brand flex h-9 w-9 flex-col justify-center gap-[3px] rounded-[11px] px-2"
            aria-hidden
          >
            <span className="h-[5px] w-full rounded-full bg-white" />
            <span className="h-[5px] w-4/5 rounded-full bg-white/85" />
            <span className="h-[5px] w-3/5 rounded-full bg-white/65" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">
            RankYou <span className="text-brand">Duo</span>
          </span>
        </Link>
      </header>

      <main className="mt-8 flex-1">
        <h1 className="text-[28px] leading-tight font-black min-[360px]:text-[32px]">{title}</h1>
        {lead && <p className="mt-3 text-[15px] leading-relaxed font-medium text-muted">{lead}</p>}
        <div className="mt-8 flex flex-col gap-5">{children}</div>
      </main>

      <footer className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5 text-sm font-bold text-muted">
        <Link href="/" className="active:text-ink">
          ゲームで遊ぶ
        </Link>
        <Link href="/support" className="active:text-ink">
          サポート
        </Link>
        <Link href="/privacy" className="active:text-ink">
          プライバシーポリシー
        </Link>
        <span className="ml-auto text-xs font-medium text-faint">© RankYou Duo</span>
      </footer>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] bg-surface p-5 ring-1 ring-line min-[360px]:p-6">
      <h2 className="text-lg font-extrabold">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-[15px] leading-relaxed text-ink/85">{children}</div>
    </section>
  );
}

export function ContactEmail() {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="inline-flex max-w-full items-center gap-2 self-start rounded-full bg-white/8 px-4 py-2.5 font-display text-[15px] font-bold break-all text-ink ring-1 ring-line active:bg-white/14"
    >
      <span aria-hidden>✉️</span>
      {CONTACT_EMAIL}
    </a>
  );
}
