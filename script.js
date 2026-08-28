document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------------- Mobile tabs toggle ---------------- */
  const tabsToggle = document.getElementById("tabsToggle");
  const tabsList = document.getElementById("tabsList");

  if (tabsToggle && tabsList) {
    tabsToggle.addEventListener("click", () => {
      const isOpen = tabsList.classList.toggle("is-open");
      tabsToggle.setAttribute("aria-expanded", String(isOpen));
    });

    tabsList.querySelectorAll(".tab").forEach((link) => {
      link.addEventListener("click", () => {
        tabsList.classList.remove("is-open");
        tabsToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Active tab highlighting ---------------- */
  const sections = document.querySelectorAll("main .section");
  const tabLinks = document.querySelectorAll(".tab");

  const setActiveTab = (id) => {
    tabLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${id}`,
      );
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");

  if (
    "IntersectionObserver" in window &&
    !prefersReducedMotion &&
    revealEls.length
  ) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------- Hero terminal typing effect ---------------- */
  const staticEl = document.getElementById("terminalStatic");
  const typedEl = document.getElementById("terminalTyped");

  if (staticEl && typedEl) {
    if (prefersReducedMotion) {
      staticEl.hidden = false;
      typedEl.remove();
      return;
    }

    const lines = [
      { text: "visitor@portfolio:~$ whoami", type: "prompt" },
      { text: "Jetzan Azael Esquivel", type: "out" },
      { text: "", type: "blank" },
      { text: "visitor@portfolio:~$ cat role.txt", type: "prompt" },
      {
        text: "Computer Systems Engineering Student",
        type: "out",
      },
      {
        text: "Full Stack Developer — web, backend, and databases",
        type: "out",
      },
      { text: "", type: "blank" },
      { text: "visitor@portfolio:~$ cat approach.txt", type: "prompt" },
      { text: "I learn by installing, configuring, and building.", type: "out" },
      {
        text: "I do not just read about a technology: I use it until it breaks",
        type: "out",
      },
      { text: "and find out why.", type: "out" },
      { text: "", type: "blank" },
      { text: "visitor@portfolio:~$ _", type: "prompt" },
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let currentLineNode = null;

    const typeSpeed = 16;
    const lineDelay = 90;

    function typeNextChar() {
      if (lineIndex >= lines.length) return;

      const line = lines[lineIndex];

      if (!currentLineNode) {
        currentLineNode = document.createElement("span");
        currentLineNode.className =
          line.type === "out" ? "line-out" : "line-prompt";
        typedEl.appendChild(currentLineNode);
      }

      if (charIndex < line.text.length) {
        currentLineNode.textContent += line.text[charIndex];
        charIndex++;
        setTimeout(typeNextChar, typeSpeed);
      } else {
        typedEl.appendChild(document.createTextNode("\n"));
        lineIndex++;
        charIndex = 0;
        currentLineNode = null;
        setTimeout(typeNextChar, lineDelay);
      }
    }

    typeNextChar();
  }
});
