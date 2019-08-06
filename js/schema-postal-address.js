import {getSlotContent, removeSlottedElements} from './slot-helpers.js';

customElements.define('schema-postal-address', class HTMLSchemaPostalAddressElement extends HTMLElement {
	constructor() {
		super();
		this.setAttribute('itemtype', 'https://schema.org/PostalAddress');
		this.setAttribute('itemscope', '');
		this.attachShadow({mode: 'open'});
		const tmp = document.getElementById('postal-address-template').content.cloneNode(true);
		this.shadowRoot.append(tmp);
	}

	toJSON() {
		const {streetAddress, addressLocality, addressRegion, postalCode, addressCountry} = this;
		return {
			'@type': 'PostalAddress',
			streetAddress,
			addressLocality,
			addressRegion,
			postalCode,
			addressCountry,
		};
	}

	get streetAddress() {
		return getSlotContent('streetAddress', this.shadowRoot);
	}

	set streetAddress(val) {
		removeSlottedElements('streetAddress', this.shadowRoot);
		const el = document.createElement('div');
		el.slot = 'streetAddress';
		el.setAttribute('itemprop', 'streetAddress');
		el.textContent = val;
		this.append(el);
	}

	get addressLocality() {
		return getSlotContent('addressLocality', this.shadowRoot);
	}

	set addressLocality(val) {
		removeSlottedElements('addressLocality', this.shadowRoot);
		const el = document.createElement('span');
		el.slot = 'addressLocality';
		el.setAttribute('itemprop', 'addressLocality');
		el.textContent = val;
		this.append(el);
	}

	get addressRegion() {
		return getSlotContent('addressRegion', this.shadowRoot);
	}

	set addressRegion(val) {
		removeSlottedElements('addressRegion', this.shadowRoot);
		const el = document.createElement('span');
		el.slot = 'addressRegion';
		el.setAttribute('itemprop', 'addressRegion');
		el.textContent = val;
		this.append(el);
	}
});
