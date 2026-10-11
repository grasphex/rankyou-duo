import type { Metadata } from "next";
import { ContactEmail, InfoPage, SITE_URL, Section } from "@/components/InfoPage";

const title = "プライバシーポリシー | RankYou Duo";
const description = "RankYou Duo は個人情報を収集しません。端末内への保存のみで、外部への送信・広告・解析ツールはありません。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: { title, description, url: `${SITE_URL}/privacy` },
  twitter: { title, description },
};

const NOT_COLLECTED = [
  "氏名・メールアドレス・電話番号",
  "位置情報",
  "連絡先",
  "写真・カメラ・マイク",
  "広告ID（IDFA）などの端末識別子",
  "利用状況・行動履歴",
];

export default function PrivacyPage() {
  return (
    <InfoPage
      title="プライバシーポリシー"
      lead="RankYou Duo（以下「本アプリ」）は、ユーザーの個人情報を収集しません。本ページでは、本アプリ（iOSアプリおよびWeb版）における情報の取り扱いを説明します。"
    >
      <Section title="1. 収集する情報">
        <p>本アプリは、ユーザーの個人情報を一切収集しません。アカウント登録も不要です。</p>
        <p>以下を含む情報を、本アプリが取得・収集することはありません。</p>
        <ul className="flex flex-col gap-1.5 pl-1">
          {NOT_COLLECTED.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-good" aria-hidden>
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="2. 端末内に保存する情報">
        <p>
          ゲームを途中から再開できるよう、入力したプレイヤー名・回答・スコアなどのゲームの状態を、ご利用の端末内にのみ保存します（iOSアプリでは端末内の保存領域、Web版ではブラウザのセッションストレージ）。
        </p>
        <p>
          これらの情報が外部のサーバーへ送信されることはありません。ゲームを最初からやり直す、またはアプリを削除すると消去されます。
        </p>
      </Section>

      <Section title="3. 外部への送信・第三者提供">
        <p>本アプリは、ユーザーの情報を外部のサーバーへ送信しません。また、第三者へ提供・販売することもありません。</p>
        <p>
          結果の「シェア」機能は、ユーザーご自身が操作したときにだけ、端末の共有機能（共有シート）を呼び出すものです。共有先や共有内容はユーザーご自身が選択し、本アプリの運営者に送信されることはありません。
        </p>
      </Section>

      <Section title="4. 広告・解析ツール">
        <p>本アプリには広告を表示しません。また、アクセス解析ツール・トラッキングツールは使用していません。</p>
      </Section>

      <Section title="5. Web版のアクセスログについて">
        <p>
          Web版（{SITE_URL}）の配信にあたり、ホスティング事業者のサーバーが、通常のWebサイトと同様にIPアドレスなどの技術的なアクセスログを記録する場合があります。本アプリの運営者がこれを利用してユーザーを特定・追跡することはありません。iOSアプリはゲームに必要なデータをアプリ内に持っているため、遊ぶ際にこの通信は発生しません。
        </p>
      </Section>

      <Section title="6. お問い合わせ">
        <p>本ポリシーに関するお問い合わせは、以下までご連絡ください。</p>
        <ContactEmail />
      </Section>

      <Section title="7. 本ポリシーの改定">
        <p>本ポリシーの内容を改定する場合は、本ページを更新してお知らせします。改定後の内容は、本ページに掲載した時点から効力を生じます。</p>
        <p className="text-sm text-muted">制定日：2026年10月12日</p>
      </Section>
    </InfoPage>
  );
}
