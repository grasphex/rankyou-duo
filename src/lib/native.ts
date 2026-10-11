import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { Share } from "@capacitor/share";
import { SplashScreen } from "@capacitor/splash-screen";

/**
 * iOSアプリ（Capacitor）でだけ使うネイティブ機能のラッパー。
 * Web版では何もしないか、ブラウザの標準APIに安全にフォールバックする。
 */

const isNative = () => Capacitor.isNativePlatform();

export type HapticKind =
  /** 並べ替えで項目をつかんだとき */
  | "pick"
  /** 回答・予想を確定したとき */
  | "confirm"
  /** 結果の数字が出そろったとき */
  | "reveal"
  /** 高得点・最終結果など、うれしい結果が出たとき */
  | "success";

export function haptic(kind: HapticKind) {
  if (!isNative()) {
    // Web版は従来どおり、ドラッグ開始時だけ短く振動させる（対応端末のみ）
    if (kind === "pick") navigator.vibrate?.(8);
    return;
  }
  // 振動の失敗でゲームを止めない
  const run = {
    pick: () => Haptics.impact({ style: ImpactStyle.Light }),
    confirm: () => Haptics.impact({ style: ImpactStyle.Medium }),
    reveal: () => Haptics.impact({ style: ImpactStyle.Light }),
    success: () => Haptics.notification({ type: NotificationType.Success }),
  }[kind];
  run().catch(() => {});
}

export type ShareContent = { title: string; text: string; url: string };

/** 共有手段: ネイティブ共有シート / Web Share API / クリップボードへのコピー / なし */
export type ShareMethod = "native" | "web" | "copy" | null;

export function getShareMethod(): ShareMethod {
  if (isNative()) return "native";
  if (typeof navigator === "undefined") return null;
  if (typeof navigator.share === "function") return "web";
  if (typeof navigator.clipboard?.writeText === "function") return "copy";
  return null;
}

/**
 * 結果を共有する。キャンセルは失敗扱いにしない。
 * 戻り値はコピーで代替したときに "copied"、それ以外は "shared" / "cancelled" / "failed"。
 */
export async function shareResult(
  content: ShareContent,
): Promise<"shared" | "copied" | "cancelled" | "failed"> {
  const method = getShareMethod();
  try {
    if (method === "native") {
      await Share.share({ ...content, dialogTitle: content.title });
      return "shared";
    }
    if (method === "web") {
      await navigator.share(content);
      return "shared";
    }
    if (method === "copy") {
      await navigator.clipboard.writeText(`${content.text}\n${content.url}`);
      return "copied";
    }
    return "failed";
  } catch (e) {
    // iOS の共有シートを閉じた / Web Share をキャンセルした
    const message = e instanceof Error ? `${e.name} ${e.message}` : String(e);
    if (/abort|cancel/i.test(message)) return "cancelled";
    return "failed";
  }
}

/** 最初の画面の準備ができたら、iOSの起動画面をフェードで閉じる（Web版では何もしない） */
export function hideSplash() {
  if (!isNative()) return;
  const hide = () => {
    SplashScreen.hide({ fadeOutDuration: 300 }).catch(() => {});
  };
  // ネイティブ側で起動画面の表示が完了する前に hide() が届くと無視されるため、
  // 少し間をおいて呼び直す（すでに閉じていれば何も起きない）
  for (const delay of [0, 500, 1500]) setTimeout(hide, delay);
}
