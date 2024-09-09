// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-09-09
// @description  try to take over the world!
// @author       You
// @match        https://pokemondb.net/pokedex/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokemondb.net
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Tạo nút bấm
    const button = document.createElement('button');
    button.textContent = 'Get Pokemon Data';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    document.body.appendChild(button);

    button.addEventListener('click', async () => {
        try {
            // Tên của tab đang hoạt động
            const activeTab = document.querySelector('.sv-tabs-tab.active');
            if (!activeTab) throw new Error('No active tab found.');
            const name = activeTab.innerText.trim();

            // ID của tab để lấy dữ liệu
            const id = activeTab.href.split('#')[1];
            if (!id) throw new Error('No ID found in URL.');

            // Lấy dữ liệu từ bảng
            const data = document.querySelector(`#${id} .vitals-table`);
            if (!data) throw new Error('Vitals table not found.');

            const rows = data.querySelectorAll('tr');

            // Số hiệu Pokémon
            const number = rows[0].querySelector('td strong')?.innerText.trim();

            // Loại Pokémon
            const type = [];
            rows[1].querySelectorAll('td a').forEach(a => {
                type.push(a.innerText.trim().charAt(0).toUpperCase() + a.innerText.trim().slice(1).toLowerCase());
            });

            // Kỹ năng của Pokémon
            const abilityTD = rows[5].querySelector('td');
            const abilityA = abilityTD.querySelectorAll('span a');
            const abilitySmall = abilityTD.querySelector('small a') || null;
            const abilities = {
                ability1: abilityA[0]?.innerText.trim() || null,
                ability2: abilityA[1]?.innerText.trim() || null,
                hidden: abilitySmall?.innerText.trim() || null,
            };

            // Thống kê của Pokémon
            const stats = [];
            const rows2 = data.querySelectorAll('tr:nth-child(n+2)'); // Bỏ qua hàng tiêu đề
            rows2.forEach(tr => {
                const cells = tr.querySelectorAll('td');
                stats.push(Number(cells[1]?.innerText.trim()) || 0);
            });

            const [hp, attack, defense, spAttack, spDefense, speed, total] = stats;

            // Tạo đối tượng Pokémon
            const pokemon = {
                [name]: {
                    number,
                    name,
                    type,
                    abilities,
                    hp,
                    attack,
                    defense,
                    spAttack,
                    spDefense,
                    speed,
                    total,
                },
            };

            console.log(pokemon);

            // Sao chép dữ liệu vào clipboard
            await navigator.clipboard.writeText(JSON.stringify(pokemon, null, 2));
            alert('Pokemon data copied to clipboard!');

        } catch (error) {
            console.error('Error:', error.message);
            alert('An error occurred. Check console for details.');
        }
    });
})();
