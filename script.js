// Header glass effect on scroll
const header = document.querySelector('.site-header');
if (header) {
	const handleScroll = () => {
		if (window.scrollY > 30) {
			header.classList.add('scrolled');
		} else {
			header.classList.remove('scrolled');
		}
	};
	window.addEventListener('scroll', handleScroll, { passive: true });
	handleScroll();
}

