import { browser } from '$app/environment';

type RevealOpts = {
	/** Which direction the element enters from. Defaults to 'up'. */
	from?: 'left' | 'right' | 'up';
	/** Extra delay in ms before the transition starts (for stagger). */
	delay?: number;
	/** Total transition duration in ms. */
	duration?: number;
};

/**
 * Svelte action: reveal an element as it scrolls into view.
 * No-ops on the server, respects prefers-reduced-motion.
 * Content is visible by default; JS hides it synchronously on mount
 * (before the first paint) and reveals it via IntersectionObserver.
 */
export function reveal(node: HTMLElement, opts: RevealOpts = {}) {
	if (!browser) return {};
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return {};

	const { from = 'up', delay = 0, duration = 440 } = opts;
	const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

	const dx = from === 'left' ? '-22px' : from === 'right' ? '22px' : '0px';
	const dy = from === 'up' ? '16px' : from === 'left' || from === 'right' ? '8px' : '0px';

	// Hide synchronously on mount — before the browser paints
	node.style.opacity = '0';
	node.style.transform = `translate(${dx}, ${dy})`;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) return;
			observer.unobserve(node);
			// Double-rAF: first frame applies transition property,
			// second frame changes values to trigger it
			requestAnimationFrame(() => {
				node.style.transition = `opacity ${duration}ms ${ease} ${delay}ms, transform ${duration}ms ${ease} ${delay}ms`;
				requestAnimationFrame(() => {
					node.style.opacity = '1';
					node.style.transform = 'translate(0px, 0px)';
					node.addEventListener(
						'transitionend',
						() => {
							node.style.transition = '';
							node.style.opacity = '';
							node.style.transform = '';
						},
						{ once: true }
					);
				});
			});
		},
		// -64px bottom margin: element must be 64px into the viewport before revealing
		{ rootMargin: '0px 0px -64px 0px', threshold: 0.05 }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
