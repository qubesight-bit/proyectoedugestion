const REMEMBER_KEY = "ceac_remember";
const ACTIVE_KEY = "ceac_active";

/** Records the "remember me" choice when the user signs in. */
export function markSession(remember: boolean) {
  localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
  sessionStorage.setItem(ACTIVE_KEY, "1");
}

/** True when the session should be dropped (user opted out of remembering and this is a new browser session). */
export function shouldDropSession(): boolean {
  return localStorage.getItem(REMEMBER_KEY) === "0" && sessionStorage.getItem(ACTIVE_KEY) !== "1";
}

export function clearSessionMarks() {
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(ACTIVE_KEY);
}
