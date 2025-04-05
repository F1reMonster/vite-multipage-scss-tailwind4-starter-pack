console.log("%cMade by FireMonster", "background:#8A2BE2;color:#fff;padding:4px 10px;font-weight:bold;border-radius:0.25rem;");

document.addEventListener("DOMContentLoaded", function () {
	const appHeight = () => {
		const doc = document.documentElement;
		doc.style.setProperty("--app-height", `${window.innerHeight}px`);
	};

	appHeight();
	window.addEventListener("resize", appHeight);
});
