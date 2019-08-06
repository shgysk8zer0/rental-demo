import {$} from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import './schema-postal-address.js';
import {
	getSlotContent,
	getSlotAttribute,
	getSlottedElement,
	removeSlottedElements
} from './slot-helpers.js';

customElements.define('rental-property', class HTMLRentalPropertyElement extends HTMLElement {
	constructor() {
		super();
		this.setAttribute('itemtype', 'https://schema.org/House');
		this.setAttribute('itemscope', '');
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

	toJSON() {
		const {identifier, description, floorSize, numberOfRooms, geo, petsAllowed} = this;
		return {
			'@type': 'House',
			'@context': 'https://schema.org',
			identifier,
			description,
			floorSize,
			numberOfRooms,
			geo,
			petsAllowed,
		};
	}

	get identifier() {
		return getSlotAttribute('identifier', this.shadowRoot, 'content');
	}

	set identifier(uuid) {
		const el = document.createElement('meta');
		el.slot = 'identifier';
		el.setAttribute('itemprop', 'identifier');
		el.content = uuid;
		this.append(el);
	}

	get description() {
		return getSlotContent('description', this.shadowRoot);
	}

	set description(val) {
		removeSlottedElements('description', this.shadowRoot);
		const el = document.createElement('blockquote');
		el.slot = 'description';
		el.setAttribute('itemprop', 'description');
		el.textContent = val;
		this.append(el);
	}

	get image() {
		return getSlotAttribute('image', this.shadowRoot, 'src');
	}

	set image(src) {
		const el = new Image();
		el.src = src;
		el.slot = 'image';
		el.decoding = 'async';
		el.crossOrigin = 'annonymous';
		this.append(el);
	}

	get address() {
		return getSlottedElement('address', this.shadowRoot);
	}

	set address({
		streetAddress = null,
		addressLocality = null,
		addressRegion = null,
		postalCode = null,
		addressCountry = 'US',
	}) {
		removeSlottedElements('address', this.shadowRoot);
		customElements.whenDefined('schema-postal-address').then(() => {
			const HTMLSchemaPostalAddressElement = customElements.get('schema-postal-address');
			const el = new HTMLSchemaPostalAddressElement();
			el.setAttribute('itemprop', 'address');
			el.slot = 'address';
			el.streetAddress = streetAddress;
			el.addressLocality = addressLocality;
			el.addressRegion = addressRegion;
			el.postalCode = postalCode;
			el.addressCountry = addressCountry;
			this.append(el);
		}).catch(console.error);
	}

	get floorSize() {
		const el = getSlottedElement('floorSize', this.shadowRoot);
		if (el instanceof HTMLElement) {
			const value = el.querySelector('[itemprop="value"]');
			const unitText = el.querySelector('[itemprop="unitText"]');
			return {
				'@type': 'QuantitativeValue',
				value: value instanceof HTMLElement ? parseFloat(value.textContent) : null,
				unitText: unitText instanceof HTMLElement ? unitText.textContent : 'FTK'
			};
		} else {
			return null;
		}
	}

	set floorSize({value, unitText = 'FTK'}) {
		removeSlottedElements('floorSize', this.shadowRoot);
		const el = document.createElement('span');
		el.slot = 'floorSize';
		el.setAttribute('itemtype', 'https://schema.org/QuantitativeValue');
		el.setAttribute('itemscope', '');
		const val = Intl.NumberFormat(navigator.language).format(value);
		const valueEl = document.createElement('span');
		const unitEl = document.createElement('meta');
		valueEl.setAttribute('itemprop', 'value');
		unitEl.setAttribute('itemprop', 'unitText');
		valueEl.textContent = val;
		unitEl.content = unitText;
		el.append(valueEl, unitEl);
		this.append(el);
	}

	get numberOfRooms() {
		return getSlotContent('numberOfRooms', this.shadowRoot);
	}

	set numberOfRooms(val) {
		removeSlottedElements('numberOfRooms', this.shadowRoot);
		const el = document.createElement('span');
		el.slot = 'numberOfRooms';
		el.setAttribute('itemprop', 'numberOfRooms');
		el.textContent = val;
		this.append(el);
	}

	get geo() {
		const el = getSlottedElement('geo', this.shadowRoot);
		if (el instanceof HTMLElement) {
			const longitude = parseFloat(el.querySelector('[itemprop="longitude"]').textContent);
			const latitude = parseFloat(el.querySelector('[itemprop="latitude"]').textContent);

			return {
				'@type': 'https://schema.org/GeoCoordinates',
				longitude,
				latitude,
			};
		} else {
			return null;
		}
	}

	set geo({longitude, latitude, altitude = null}) {
		const el = document.createElement('div');
		el.slot = 'geo';
		el.setAttribute('itemtype', 'https://schema.org/GeoCoordinates');
		el.setAttribute('itemscope', '');
		const lng = document.createElement('meta');
		const lat = document.createElement('meta');
		lng.setAttribute('itemprop', 'longitude');
		lat.setAttribute('itemprop', 'latitude');
		lng.content = Intl.NumberFormat(navigator.language).format(longitude);
		lat.content = Intl.NumberFormat(navigator.language).format(longitude);

		const els = [lng, lat];

		if (altitude) {
			const alt = document.createElement('meta');
			alt.setAttribute('itemprop', 'altitude');
			alt.content = Intl.NumberFormat(navigator.language).format(altitude);
			els.push(alt);
		}

		el.append(...els);
		this.append(el);
	}

	get petsAllowed() {
		return getSlotAttribute('petsAllowed', this.shadowRoot, 'content');
	}

	set petsAllowed(val) {
		removeSlottedElements('petsAllowed', this.shadowRoot);
		const el = document.createElement('meta');
		el.slot = 'petsAllowed';
		el.setAttribute('itemprop', 'petsAllowed');
		el.content = val;
	}

	get bathrooms() {
		return getSlotContent('bathrooms', this.shadowRoot);
	}

	set bathrooms(val) {
		removeSlottedElements('bathrooms', this.shadowRoot);
		const el = document.createElement('span');
		el.slot = 'bathrooms';
		el.textContent = val;
		this.append(el);
	}

	get rent() {
		return parseFloat(getSlotContent('rent', this.shadowRoot));
	}

	set rent({amount, currency = 'USD'}) {
		removeSlottedElements('rent', this.shadowRoot);
		const el = document.createElement('span');
		el.slot = 'rent';
		const val = Intl.NumberFormat(navigator.language, {style: 'currency', currency}).format(amount);
		el.textContent = val;
		// el.setAttribute('itemprop', 'description');
		this.append(el);
	}
});
