const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            position: relative;
            display: block;
            background-size: cover;
            /* image-rendering: pixelated; */
        }

            :host::before {
                content: '';
                display: block;
                padding-top: calc(9 / 16 * 100%);
                padding-top: calc(var(--h) / var(--w) * 100%);
            }

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            vertical-align: top;
            animation: fade-in 2s;
        }

        @keyframes fade-in {
            0% { opacity: 0; }
        }
    </style>
`;

const io = new IntersectionObserver(entries => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.setAttribute('full', '');
        }
    }
});

class SCImg extends HTMLElement {
    static get observedAttributes() {
        return ['full'];
    }

    get full() {
        return this.hasAttribute('full');
    }

    get src() {
        return this.getAttribute('src');
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        io.observe(this);
    }

    disconnectedCallback() {
        io.unobserve(this);
    }

    attributeChangedCallback() {
        if (this.loaded) return;
        const img = document.createElement('img');
        img.onload = _ => {
            this.loaded = true;
            this.shadowRoot.appendChild(img);
            io.unobserve(this);
        };
        img.src = this.src;
    }
}

customElements.define('sc-img', SCImg);