// USE THIS FILE TO DYNAMICALLY INJECT ANY EXTERNAL SCRIPTS INTO THE APP
import createState from "@jackcom/raphsducks";

/** Track page-session scripts (i.e. scripts that should be reloaded with the page) */
const InjectedScripts = createState({
  YouTube: false
});

/**
 * Inject a `<script />` tag with the supplied contents into the page's
 * html. This will execute `contents` immediately.
 * @param {string} contents Script tag contents
 */
export function injectScriptContents(contents: string) {
  const scrpt = document.createElement("script");
  scrpt.innerHTML = contents;
  const lastElem = document.head.lastChild;
  document.head.insertBefore(scrpt, lastElem);
}

/**
 * Inject a `<script />` tag by `src` attribute into the page's
 * html. This will execute `contents` immediately.
 */
export async function injectScriptBySrc(
  src: string,
  key: keyof ReturnType<typeof InjectedScripts.getState>
) {
  const scripts = InjectedScripts.getState();
  if (scripts[key]) return;

  const scrpt = document.createElement("script");
  scrpt.src = src;
  scrpt.id = `${key}-script`;
  const lastElem = document.head.lastChild;
  document.head.insertBefore(scrpt, lastElem);
  InjectedScripts[key](true);
}

export function unmountScript(
  key: keyof ReturnType<typeof InjectedScripts.getState>
) {
  const id = `${key}-script`;
  const script = document.getElementById(id);
  if (script) script.remove();
  InjectedScripts[key](false);
}
