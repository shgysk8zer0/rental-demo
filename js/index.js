import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import './share-button.js';
import './current-year.js';
// import './gravatar-img.js';
// import 'https://cdn.kernvalley.us/components/bacon-ipsum.js';
import './imgur-img.js';
import 'https://cdn.kernvalley.us/components/login-button.js';
import 'https://cdn.kernvalley.us/components/logout-button.js';
import 'https://cdn.kernvalley.us/components/register-button.js';
import 'https://cdn.kernvalley.us/components/login-form/login-form.js';
import 'https://cdn.kernvalley.us/components/registration-form/registration-form.js';
import {$, ready, registerServiceWorker} from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import {alert} from 'https://cdn.kernvalley.us/js/std-js/asyncDialog.js';

if (document.documentElement.dataset.hasOwnProperty('serviceWorker')) {
	registerServiceWorker(document.documentElement.dataset.serviceWorker).catch(console.error);
}

document.documentElement.classList.replace('no-js', 'js');
document.body.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);
document.body.classList.toggle('no-details', document.createElement('details') instanceof HTMLUnknownElement);

async function payInvoice() {
	const paymentRequest = new PaymentRequest([{
		supportedMethods: 'basic-card',
		data: {
			supportedNetworks: ['visa', 'mastercard','discover'],
			supportedTypes: ['credit', 'debit']
		}
	}], {
		total: {
			label: 'Total Cost',
			amount: {
				currency: 'USD',
				value: 2244.50
			}
		},
		displayItems: [{
			label: 'Rent',
			amount: {
				currency: 'USD',
				value: 1100.00
			}
		},{
			label: 'Deposit',
			amount: {
				currency: 'USD',
				value: 1100.00
			}
		}, {
			label: 'Insurance',
			amount: {
				currency: 'USD',
				value: 9.50
			}
		}, {
			label: 'Convenience Fee',
			amount: {
				currency: 'USD',
				value: 35.00
			}
		}],
	}, {
		requestPayerName: true,
		requestPayerEmail: true,
		requestPayerPhone: true,
	});

	if (await paymentRequest.canMakePayment()) {
		const paymentResponse = await paymentRequest.show();
		paymentResponse.complete('success');
	}
}

ready().then(async () => {
	$('[data-scroll-to]').click(event => {
		const target = document.querySelector(event.target.closest('[data-scroll-to]').dataset.scrollTo);
		target.scrollIntoView({
			bahavior: 'smooth',
			block: 'start',
		});
	});

	$('[data-show]').click(event => {
		const target = document.querySelector(event.target.closest('[data-show]').dataset.show);
		if (target instanceof HTMLElement) {
			target.show();
		}
	});

	$('[data-show-modal]').click(event => {
		const target = document.querySelector(event.target.closest('[data-show-modal]').dataset.showModal);
		if (target instanceof HTMLElement) {
			target.showModal();
		}
	});

	$('[data-close]').click(event => {
		const target = document.querySelector(event.target.closest('[data-close]').dataset.close);
		if (target instanceof HTMLElement) {
			target.tagName === 'DIALOG' ? target.close() : target.open = false;
		}
	});

	$('form[name="scheduleAppointment"]').submit(async event => {
		event.preventDefault();
		const data = Object.fromEntries(new FormData(event.target).entries());
		const dtime = new Date(`${data.date}T${data.time}`);
		event.target.reset();
		await alert(`Scheduled appointment for ${dtime.toLocaleString()} for ${data.givenName} ${data.familyName}`);
	});

	$('form[name="scheduleAppointment"]').reset(event => {
		event.target.closest('dialog').close();
	});

	if ('PaymentRequest' in window) {
		$('#notification-btn').click(payInvoice);
	} else {
		$('#notification-btn').remove();
	}
});

customElements.define('rental-property', class HTMLRentalPropertyElement extends HTMLElement
{
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		const tmp = document.getElementById('rental-property-template').content.cloneNode(true);
		$('[data-show-modal]', tmp).click(event => {
			const target = event.target.closest('[data-show-modal]');
			$(target.dataset.showModal).showModal();
		}, {
			passive: true,
		});

		this.shadowRoot.append(tmp);
	}
});
