import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

/**
 * ゲーム状態の保存先。
 * - iOSアプリ: Preferences（UserDefaults）。アプリを完全に終了しても残る
 * - Web版: sessionStorage。従来どおりタブを閉じると消える
 *
 * Preferences は非同期なので、書き込み・削除は呼び出し順に1本の列で実行し、
 * 「削除 → 新しい状態の保存」が逆順に届かないようにする。
 */

const isNative = () => Capacitor.isNativePlatform();

let queue: Promise<unknown> = Promise.resolve();

function enqueue(task: () => Promise<unknown> | void) {
  // 保存の失敗でゲームを止めない
  queue = queue.then(task).catch(() => {});
  return queue;
}

export async function readItem(key: string): Promise<string | null> {
  try {
    if (isNative()) return (await Preferences.get({ key })).value;
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeItem(key: string, value: string) {
  return enqueue(() =>
    isNative() ? Preferences.set({ key, value }) : sessionStorage.setItem(key, value),
  );
}

export function removeItem(key: string) {
  return enqueue(() => (isNative() ? Preferences.remove({ key }) : sessionStorage.removeItem(key)));
}
