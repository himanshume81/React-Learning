export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem("app-theme");
        var resolved =
          stored === "dark"
            ? "dark"
            : stored === "light"
              ? "light"
              : window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        document.documentElement.classList.toggle("dark", resolved === "dark");
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
