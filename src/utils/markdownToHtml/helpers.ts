const escapeTest = /[&<>"']/;
const escapeReplace = new RegExp(escapeTest.source, "g");
const escapeReplacements: { [index: string]: string } = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const getEscapeReplacement = (ch: string) => escapeReplacements[ch];

export function escape(code: string) {
  if (escapeTest.test(code)) {
    return code.replace(escapeReplace, getEscapeReplacement);
  }

  return code;
}
