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

// Quote Form: Formspree AJAX Submission
const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
	const formCard = quoteForm.closest('.contact-form-card');
	const formHeader = formCard ? formCard.querySelector('.contact-form-header') : null;
	const formSuccess = document.getElementById('form-success');
	const formError = document.getElementById('form-error');
	const submitBtn = quoteForm.querySelector('.contact-submit-btn');
	const resetBtn = document.getElementById('btn-reset-form');

	quoteForm.addEventListener('submit', async function (e) {
		e.preventDefault();

		if (formError) {
			formError.style.display = 'none';
		}

		const originalBtnContent = submitBtn ? submitBtn.innerHTML : 'Submit Request <span>↗</span>';

		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.innerHTML = '<span class="spinner-icon" aria-hidden="true"></span> Sending Request...';
		}

		try {
			const formData = new FormData(quoteForm);

			const tel = formData.get('phone') || '';
			if (tel) {
				formData.set('Phone Number', tel);
			}

			const response = await fetch(quoteForm.action, {
				method: 'POST',
				body: formData,
				headers: {
					'Accept': 'application/json'
				}
			});

			if (response.ok) {
				quoteForm.reset();
				quoteForm.style.display = 'none';
				if (formHeader) {
					formHeader.style.display = 'none';
				}
				if (formSuccess) {
					formSuccess.style.display = 'block';
					formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
				}
			} else {
				let message = 'There was an issue submitting your request. Please try again.';
				try {
					const data = await response.json();
					if (data && data.errors && data.errors.length > 0) {
						message = data.errors.map(err => err.message).join(', ');
					}
				} catch (jsonErr) {
					// Fallback to default message
				}
				showError(message);
			}
		} catch (networkErr) {
			showError('Network error. Please check your internet connection or email info@raxwell.com directly.');
		} finally {
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.innerHTML = originalBtnContent;
			}
		}

		function showError(msg) {
			if (formError) {
				const errorSpan = formError.querySelector('.error-text');
				if (errorSpan) {
					errorSpan.textContent = msg;
				}
				formError.style.display = 'flex';
			} else {
				alert(msg);
			}
		}
	});

	if (resetBtn) {
		resetBtn.addEventListener('click', function () {
			if (formSuccess) {
				formSuccess.style.display = 'none';
			}
			if (formHeader) {
				formHeader.style.display = 'block';
			}
			quoteForm.style.display = 'block';
			quoteForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		});
	}

	// Auto pre-fill product from URL query param if present
	try {
		const urlParams = new URLSearchParams(window.location.search);
		const requestedProduct = urlParams.get('product');
		if (requestedProduct) {
			const inquirySelect = document.getElementById('contact-inquiry');
			if (inquirySelect) {
				inquirySelect.value = 'RFQ / Product Quote';
			}
			const messageBox = document.getElementById('contact-message');
			if (messageBox && !messageBox.value) {
				messageBox.value = `I would like to request an official quotation and technical specifications for: ${requestedProduct}`;
			}
		}
	} catch (e) {
		// Ignore URL search param errors
	}
}

