import type { Metadata } from "next";
import { ContactEmail, InfoPage, SITE_URL, Section } from "@/components/InfoPage";

const title = "RankYou Duo サポート";
const description = "RankYou Duo のお問い合わせ先とよくある質問です。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/support` },
  openGraph: { title, description, url: `${SITE_URL}/support` },
  twitter: { title, description },
};

const FAQ = [
  {
    q: "アカウント登録は必要ですか？",
    a: "不要です。アプリを開いてプレイヤー名を入力するだけで、すぐに遊べます。",
  },
  {
    q: "オフラインで使えますか？",
    a: "基本的に利用できます。iOSアプリはゲームに必要なデータをすべてアプリ内に持っているため、インターネットに接続していなくても遊べます。Web版は最初にページを開くときだけ通信が必要です。",
  },
  {
    q: "ゲーム途中の状態は保存されますか？",
    a: "iOSアプリでは、ゲームの進行状況が端末内に自動で保存され、アプリを終了・再起動しても途中から再開できます。Web版では、ブラウザのタブを開いている間だけ保存されます。",
  },
  {
    q: "個人情報は収集しますか？",
    a: "収集しません。入力したプレイヤー名やゲームの結果は端末内にのみ保存され、外部のサーバーに送信されることはありません。詳しくはプライバシーポリシーをご覧ください。",
  },
];

export default function SupportPage() {
  return (
    <InfoPage
      title={
        <>
          RankYou Duo <span className="inline-block">サポート</span>
        </>
      }
      lead="RankYou Duo をご利用いただきありがとうございます。"
    >
      <Section title="お問い合わせ">
        <p>不具合のご報告、操作方法についてのご質問、その他のお問い合わせは、以下のメールアドレスまでご連絡ください。</p>
        <ContactEmail />
        <p className="text-sm text-muted">
          お問い合わせの際は、ご利用の端末（例：iPhone 15）・iOSのバージョン・発生した状況をお書き添えいただくと、スムーズにご案内できます。返信には数日かかる場合があります。あらかじめご了承ください。
        </p>
      </Section>

      <Section title="よくある質問">
        <dl className="flex flex-col gap-3">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="rounded-2xl bg-surface-2 p-4">
              <dt className="font-extrabold text-ink">
                <span className="text-brand font-display mr-1.5">Q.</span>
                {q}
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-ink/80">{a}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </InfoPage>
  );
}
