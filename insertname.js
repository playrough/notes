// ==UserScript==
// @name         Insert Image - Pokédex - STV
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Try to take over the world!
// @run-at       document-end
// @author       @FutureSight & @RenjiYuusei
// @match        *://sangtacviet.vip/truyen/*
// @license      GPL-3.0
// @icon64       https://i.postimg.cc/8kqyjRg7/pokeball.png

// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function () {
	'use strict';

	class NotificationBox {
		constructor() {
			this.notificationBox = this.createNotificationBox();
		}

		createNotificationBox() {
			const notificationBox = document.createElement('div');
			notificationBox.id = 'notification';
			Object.assign(notificationBox.style, {
				display: 'none',
				position: 'fixed',
				top: '0',
				right: '0',
                margin: '10px',
				padding: '10px',
				backgroundColor: '#333',
				color: '#fff',
				borderRadius: '5px',
				zIndex: '1000',
				cursor: 'pointer',
			});
			document.body.appendChild(notificationBox);
			notificationBox.addEventListener('click', () => this.hideNotification());
			return notificationBox;
		}

		showNotification(message) {
			this.notificationBox.innerHTML = message;
			this.notificationBox.style.display = 'block';
		}

		hideNotification() {
			this.notificationBox.style.display = 'none';
		}
	}

	const statsUrl = 'https://raw.githubusercontent.com/playrough/stv-pokemon-name/main/pokemon-stats.json';
	const movesUrl = 'https://raw.githubusercontent.com/playrough/stv-pokemon-name/main/pokemon-moves.json';
	const abilitiesUrl = 'https://raw.githubusercontent.com/playrough/stv-pokemon-name/main/pokemon-abilities.json';

	const ICON_COLOR = '#a8a8a8';
	const svgCode = /* HTML */ `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
		<g id="icomoon-ignore" />
		<path
			fill="${ICON_COLOR}"
			d="M15.803 4.567c-1.68 0.192 -3.71 0.892 -5.215 1.768 -1.47 0.858 -3.955 3.308 -4.795 4.76 -0.787 1.313 -1.575 3.57 -1.715 4.865l-0.105 1.015h8.732l0.402 -0.963c0.49 -1.173 1.768 -2.38 2.94 -2.783 1.365 -0.472 2.643 -0.368 3.92 0.298 1.19 0.613 2.258 1.785 2.555 2.817l0.158 0.542 4.147 0.052C31.605 16.992 31.185 17.22 30.625 14.875c-1.61 -6.668 -8.015 -11.113 -14.822 -10.307"
		/>
		<path
			fill="${ICON_COLOR}"
			d="M16.293 15.61c-1.015 0.682 -1.33 1.26 -1.33 2.415s0.315 1.733 1.33 2.415c1.19 0.823 3.255 0.263 3.955 -1.067 0.63 -1.208 0.245 -2.87 -0.858 -3.64 -0.84 -0.613 -2.328 -0.665 -3.097 -0.122"
		/>
		<path
			fill="${ICON_COLOR}"
			d="M4.078 20.09c0.14 1.295 0.927 3.553 1.715 4.865 0.84 1.453 3.325 3.902 4.795 4.76C18.41 34.3 28.508 29.995 30.625 21.175c0.56 -2.345 0.98 -2.117 -3.797 -2.065l-4.13 0.052 -0.245 0.718c-0.333 0.998 -1.225 1.995 -2.345 2.607 -0.84 0.472 -1.103 0.525 -2.433 0.525 -1.19 0 -1.627 -0.088 -2.188 -0.385 -0.927 -0.49 -2.117 -1.785 -2.537 -2.765l-0.333 -0.787H3.973z"
		/>
	</svg>`;
	/* CSS */
	GM_addStyle(`
        .normal {
            color: #a8a8a8;
        }
        .fire {
            color: #ff972f;
        }
        .water {
            color: #5aafdb;
        }
        .electric {
            color: #f1b700;
        }
        .grass {
            color: #2b9734;
        }
        .ice {
            color: #59c0c1;
        }
        .fighting {
            color: #c44353;
        }
        .poison {
            color: #db52c5;
        }
        .ground {
            color: #cd7b40;
        }
        .flying {
            color: #c44652;
        }
        .psychic {
            color: #ff5c56;
        }
        .bug {
            color: #76bc00;
        }
        .rock {
            color: #b59f5a;
        }
        .ghost {
            color: #7048b6;
        }
        .dragon {
            color: #1876c5;
        }
        .dark {
            color: #4c495a;
        }
        .steel {
            color: #2b7a8e;
        }
        .fairy {
            color: #d258ad;
        }

        .pokemon-ability {
            color: #555555;
        }

        .pokemon-ability,
        .pokemon-move {
            font-weight: bold;
        }

        .pokemon-type {
            width: 25px;
            height: 25px;
            margin-top: 0px !important;
        }

        .pokemon-ball {
            width: 35px;
            height: 35px;
        }

        .icon-pokemon {
        }

        .icon-pokemon svg {
            width: 20px;
            height: 20px;
            margin-top: -2px;
            margin-left: 2px;
            transition: transform 0.3s ease;
        }

        /*.icon-pokemon svg:hover {
            transform: rotate(90deg);
        }

        .icon-pokemon svg:active {
            transform: rotate(90deg);
        }*/

        i:has(img),
        i:has(span) {
            white-space: nowrap;
        }

        .contentbox > i > img {
            display: inline-block;
            margin-top: -5px;
        }

        button-control {
            background-color: #f0f0f0;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #e0e0e0;
        }
    `);

	const BUTTON_STYLES = {
		fontSize: '14px',
		outline: 'none',
		borderRadius: '100%',
		height: '50px',
		width: '50px',
		marginBottom: '10px',
		cursor: 'pointer',
		border: '1px solid #ccc',
		backgroundColor: '#f0f0f0',
		transition: 'background-color 0.3s',
	};

	const INPUT_STYLE = {
		width: '200px',
		height: '8px',
		borderRadius: '5px',
		outline: 'none',
		marginLeft: '5px',
	};

	const RESIZE_INPUT_MIN_SIZE = 20;
	const RESIZE_INPUT_MAX_SIZE = 80;
	const RESIZE_INPUT_STEP = 10;

	let imageSize = '50';

	const DEFAULT_CONFIG = {
		showCopyButton: true,
		showNamesButton: true,
		showReloadButton: true,
		showResizeSlider: true,
	};

	let config = { ...DEFAULT_CONFIG };

	function loadConfig() {
		const savedConfig = GM_getValue('controlsConfig');
		if (savedConfig) {
			config = { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) };
		}
	}

	function saveConfig() {
		GM_setValue('controlsConfig', JSON.stringify(config));
	}

	function loadImageSize() {
		const savedImageSize = GM_getValue('imageSize');
		if (savedImageSize) {
			imageSize = JSON.parse(savedImageSize);
		}
	}

	function saveImageSize() {
		GM_setValue('imageSize', JSON.stringify(imageSize));
	}

	function createInput({ name, type, event, handler }) {
		const input = document.createElement('input');
		Object.assign(input.style, INPUT_STYLE);

		input.name = name;
		input.type = type;
		input.addEventListener(event, handler);

		return input;
	}

	function createButton({ label, onClickFunction }) {
		const button = document.createElement('button');
		Object.assign(button.style, BUTTON_STYLES);
		button.textContent = label;

		button.addEventListener('mouseover', () => (button.style.backgroundColor = '#e0e0e0'));
		button.addEventListener('mouseout', () => (button.style.backgroundColor = '#f0f0f0'));

		button.addEventListener('touchstart', () => (button.style.backgroundColor = '#e0e0e0'));
		button.addEventListener('touchend', () => (button.style.backgroundColor = '#f0f0f0'));

		button.addEventListener('click', onClickFunction);
		return button;
	}

	function createBoxConfigControls() {
		const boxConfigControls = document.createElement('div');
		Object.assign(boxConfigControls.style, {
			position: 'fixed',
			bottom: '100px',
			right: '10px',
			display: 'flex',
			alignItems: 'end',
			flexDirection: 'column',
			zIndex: '1',
			width: '0',
		});
		return boxConfigControls;
	}

	function createModal() {
		const modal = document.createElement('div');
		Object.assign(modal.style, {
			position: 'fixed',
			top: '0',
			left: '0',
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: '1000',
		});

		return modal;
	}

	function createMenuContent() {
		const menuContent = document.createElement('div');
		Object.assign(menuContent.style, {
			backgroundColor: 'white',
			padding: '20px',
			borderRadius: '10px',
			maxWidth: '300px',
			width: '90%',
		});

		const title = document.createElement('h2');
		title.textContent = 'Configuration';
		title.style.marginTop = '0';
		menuContent.appendChild(title);

		return menuContent;
	}

	function setupMenuControls(menuContent) {
		Object.entries(config).forEach(([control, checked]) => {
			const label = document.createElement('label');
			label.style.display = 'block';
			label.style.marginBottom = '10px';

			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.id = control;
			checkbox.style.appearance = 'auto';
			checkbox.checked = checked;
			checkbox.addEventListener('change', event => {
				config[control] = event.target.checked;
			});

			label.append(checkbox, ` ${createLabelName(control)}`);
			menuContent.appendChild(label);
		});
	}

	function createLabelName(key) {
		return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
	}

	function createActionButtons(modal, menuContent) {
		const buttonContainer = document.createElement('div');
		Object.assign(buttonContainer.style, {
			display: 'flex',
			justifyContent: 'space-between',
			marginTop: '20px',
		});

		const saveButton = createButton({
			label: 'Save',
			onClickFunction: () => {
				saveConfig();
				modal.remove();
				location.reload();
			},
		});
		Object.assign(saveButton.style, {
			borderRadius: '5px',
			marginRight: '10px',
			flex: '1',
		});

		const cancelButton = createButton({ label: 'Cancel', onClickFunction: () => modal.remove() });
		cancelButton.style.borderRadius = '5px';
		cancelButton.style.flex = '1';

		buttonContainer.append(saveButton, cancelButton);
		menuContent.appendChild(buttonContainer);
	}

	function createConfigMenu() {
		const modal = createModal();
		const menuContent = createMenuContent();

		setupMenuControls(menuContent);
		createActionButtons(modal, menuContent);

		modal.appendChild(menuContent);
		document.body.appendChild(modal);
	}

	function createResizeSlider(input) {
		const dataList = document.createElement('datalist');
		dataList.id = 'size-list';

		for (let i = RESIZE_INPUT_MIN_SIZE; i <= RESIZE_INPUT_MAX_SIZE; i += RESIZE_INPUT_STEP) {
			const option = document.createElement('option');
			option.value = i;
			dataList.appendChild(option);
		}

		input.setAttribute('list', 'size-list');
		input.value = imageSize;
		input.min = RESIZE_INPUT_MIN_SIZE;
		input.max = RESIZE_INPUT_MAX_SIZE;
		input.step = RESIZE_INPUT_STEP;
		input.style.appearance = 'auto';
		input.style.display = 'flex';

		const resizeSlider = document.createElement('label');
		resizeSlider.append(`Resize:`, dataList, input);
		return resizeSlider;
	}

	function setupConfigControls() {
		const boxConfigControls = createBoxConfigControls();

		const buttons = [
			{ condition: 'showCopyButton', label: 'Copy', onClickFunction: copyToClipboard },
			{ condition: 'showNamesButton', label: 'Names', onClickFunction: () => clickButton('showNS()') },
			{ condition: 'showReloadButton', label: 'Reload', onClickFunction: () => clickButton('excute()') },
			{ condition: true, label: 'Config', onClickFunction: createConfigMenu },
		];

		buttons.forEach(({ condition, ...props }) => {
			if (config[condition] || condition === true) {
				boxConfigControls.appendChild(createButton(props));
			}
		});

		if (config.showResizeSlider) {
			const props = {
				name: 'resize',
				type: 'range',
				event: 'input',
				handler: event => {
					imageSize = event.target.value;
					saveImageSize();
					changeSizeImage();
				},
			};

			const input = createInput(props);
			const resizeSlider = createResizeSlider(input);

			boxConfigControls.appendChild(resizeSlider);
		}

		document.body.appendChild(boxConfigControls);
	}

	function contentReplacer() {
		document.querySelectorAll('i').forEach(tag => {
			if (/<img|<span/.test(tag.textContent)) {
				tag.innerHTML = tag.textContent;
			}
		});
	}

	function changeSizeImage() {
		const images = document.querySelectorAll('.pokemon-image');
		images.forEach(image => {
			image.style.width = imageSize;
			image.style.height = imageSize;
		});
	}

	async function copyToClipboard(e) {
		try {
			const copyText = document.querySelector('#namewd')?.value || '';
			await navigator.clipboard.writeText(copyText);
			e.target.textContent = 'Copied!';
		} catch (err) {
			e.target.textContent = 'Error!';
		} finally {
			setTimeout(() => {
				e.target.textContent = 'Copy';
			}, 2000);
		}
	}

	function clickButton(selector) {
		document.querySelector(`button[onclick='${selector}']`)?.click();
	}

	function autoReload() {
		const actions = [
			"addSuperName('hv','z')",
			"addSuperName('hv','f')",
			"addSuperName('hv','s')",
			"addSuperName('hv','l')",
			"addSuperName('hv','a')",
			"addSuperName('el')",
			"addSuperName('vp')",
			"addSuperName('kn')",
			"addSuperName('el')",
			"addSuperName('hv','a')",
			'saveNS();excute();',
			'excute()',
		];

		actions.forEach(action => {
			const button = document.querySelector(`[onclick="${action}"]`);
			if (button) {
				button.addEventListener('click', () => {
					contentReplacer();
					changeSizeImage();
				});
			}
		});
	}

	function createIcon() {
		const spanElement = document.createElement('span');
		spanElement.className = 'icon-pokemon';
		spanElement.innerHTML = svgCode;
		return spanElement;
	}

	async function fetchPokemonData(url) {
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
			return await response.json();
		} catch (error) {
			console.error('Error fetching data:', error);
			return null;
		}
	}

	async function setupData() {
		const statsData = await fetchPokemonData(statsUrl);
		const movesData = await fetchPokemonData(movesUrl);
		const abilitiesData = await fetchPokemonData(abilitiesUrl);

		return [
			{ data: statsData, print: printStats, selector: '.pokemon-image' },
			{ data: movesData, print: printMove, selector: '.pokemon-move' },
			{ data: abilitiesData, print: printAbility, selector: '.pokemon-ability' },
		];
	}

	function createPokedex(data, pokedexSpecsHtml, selector, notification) {
		const targets = document.querySelectorAll(selector);

		targets.forEach(target => {
			const parent = target.parentElement;
			let icon;

			if (selector !== '.pokemon-image') {
				icon = createIcon();
				parent.appendChild(icon);
			}

			const key = parent.innerText.trim();
			const found = data[key];

			if (found) {
                (icon || target).addEventListener('click', event => {
					event.stopPropagation();
                    if(icon) icon.style.transform = 'rotate(90deg)';
					notification.showNotification(pokedexSpecsHtml(found));
				});
			}
		});
	}

	function printStats(target) {
		return /* HTML */ `<p class="pokedex-specs">Name: <span>${target.name}</span></p>
			<p class="pokedex-specs">Ndex: <span>${target.number}</span></p>
			<p class="pokedex-specs">Type: <span>${target.type.join(', ')}</span></p>
			<p class="pokedex-specs">Abilities: <span>${target.abilities.join(', ')}</span></p>
			<p class="pokedex-specs">HP: <span>${target.hp}</span></p>
			<p class="pokedex-specs">Attack: <span>${target.attack}</span></p>
			<p class="pokedex-specs">Defense: <span>${target.defense}</span></p>
			<p class="pokedex-specs">Sp. Atk: <span>${target.spAttack}</span></p>
			<p class="pokedex-specs">Sp. Def: <span>${target.spDefense}</span></p>
			<p class="pokedex-specs">Speed: <span>${target.speed}</span></p>
			<p class="pokedex-specs">Total: <span>${target.total}</span></p>`;
	}

	function printMove(target) {
		return /* HTML */ `<p class="pokedex-specs">Name: <span>${target.name}</span></p>
			<p class="pokedex-specs">Type: <span>${target.type}</span></p>
			<p class="pokedex-specs">Category: <span>${target.category}</span></p>
			<p class="pokedex-specs">Power: <span>${target.power}</span></p>
			<p class="pokedex-specs">Accuracy: <span>${target.accuracy}</span></p>
			<p class="pokedex-specs">PP: <span>${target.pp}</span></p>
			<p class="pokedex-specs">Effect: <span>${target.effect || 'None'}</span></p>`;
	}

	function printAbility(target) {
		return /* HTML */ `<p class="pokedex-specs">Ability: <span>${target.ability}</span></p>
			<p class="pokedex-specs">Description: <span>${target.description}</span></p>`;
	}

	async function startPokedex(notification) {
		const pokemonData = await setupData();

		pokemonData.forEach(({ data, print, selector }) => {
			createPokedex(data, print, selector, notification);
		});
	}

	function init() {
		const notification = new NotificationBox();

		loadConfig();
		loadImageSize();
		contentReplacer();
		changeSizeImage();
		setupConfigControls();
		autoReload();

		startPokedex(notification);
	}

	setTimeout(init, 2000);
})();
