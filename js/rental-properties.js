import './rental-property.js';
customElements.define('rental-properties', class HTMLRentalPropertiesElement extends HTMLElement {
	set src(src) {
		this.setAttribute('src', src);
	}

	toJSON() {
		return this.listings;
	}

	get src() {
		return new URL(this.getAttribute('src'), document.baseURI).href;
	}

	get listings() {
		return [...this.children];
	}

	set listings(listings) {
		if (Array.isArray(listings)) {
			// this.listings.forEach(el => el.remove());
			Promise.all(listings.map(async listing => {
				await customElements.whenDefined('rental-property');
				const HTMLRentalPropertyElement = customElements.get('rental-property');
				const prop = new HTMLRentalPropertyElement();
				prop.identifier = listing.identifier;
				prop.description = listing.description;
				prop.rent = listing.rent;
				prop.floorSize = listing.floorSize;
				prop.numberOfRooms = listing.numberOfRooms;
				prop.bathrooms = listing.bathrooms;
				prop.address = listing.address;
				prop.geo = listing.geo;
				prop.image = listing.image;
				prop.classList.add('card', 'shadow', 'card', 'shadow', 'animation-speed-slow', 'animation-fade-in-out', 'fadeInUp');
				return prop;
			})).then(els => this.append(...els));
		}
	}

	async connectedCallback() {
		const resp = await fetch(this.src);
		if (resp.ok) {
			const listings = await resp.json();
			this.listings = listings;
		}
	}
});
