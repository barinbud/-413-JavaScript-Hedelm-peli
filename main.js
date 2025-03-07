let raha = 100;
let panos = 1;
let locked = [false, false, false, false];

document.addEventListener("DOMContentLoaded", () => {
    const setBetBtn = document.getElementById("setBet");
    const playBtn = document.getElementById("play");

    setBetBtn.addEventListener("click", asetaPanos);
    playBtn.addEventListener("click", pelaa);

    
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`lock${i}`).addEventListener("click", () => toggleLock(i));
    }
});

function pelaa() {
    
    document.getElementById("voitto").textContent = "";
    document.getElementById("status").textContent = "";

    if (panos > raha || raha === 0) {
        document.getElementById("play").disabled = true;
        document.getElementById("status").textContent = "Ei tarpeeksi rahaa!";
        return;
    }

    raha -= panos;
    updateBalance();

    const reelIds = ["reel1", "reel2", "reel3", "reel4"];
    const spinPromises = reelIds.map((id, index) => {
        if (!locked[index]) {
            return spinReel(id);
        } else {
            return Promise.resolve();
        }
    });

    Promise.all(spinPromises).then(() => {
        voittoTarkistus();
    });

    
    locked = [false, false, false, false];
    enableLockButtons();
}

function spinReel(id) {
    const spinTime = 1000;
    const startTime = Date.now();

    return new Promise(resolve => {
        function update() {
            const elapsed = Date.now() - startTime;
            if (elapsed < spinTime) {
                document.getElementById(id).textContent = getRandomFruit();
                requestAnimationFrame(update);
            } else {
                
                document.getElementById(id).textContent = getRandomFruit();
                resolve();
            }
        }
        update();
    });
}

function getRandomFruit() {
    const fruits = ['🍎', '🍐', '🍒', '🍉', '7️⃣'];
    return fruits[Math.floor(Math.random() * fruits.length)];
}

function toggleLock(index) {
    locked[index - 1] = !locked[index - 1];
    document.getElementById(`lock${index}`).disabled = locked[index - 1];
}

function asetaPanos() {
    const uusiPanos = parseInt(document.getElementById("bet").value, 10);
    if (uusiPanos >= 1 && uusiPanos <= raha) {
        panos = uusiPanos;
        document.getElementById("play").disabled = false;
        document.getElementById("status").textContent = `Panos asetettu: ${panos}€`;
    } else {
        document.getElementById("status").textContent = "Virheellinen panos!";
    }
}

function voittoTarkistus() {
    const reelIds = ["reel1", "reel2", "reel3", "reel4"];
    const reels = reelIds.map(id => document.getElementById(id).textContent);

    if (reels.every(fruit => fruit === reels[0])) {
        let win = 0;
        switch (reels[0]) {
            case '🍎': win = panos * 6; break;
            case '🍒': win = panos * 3; break;
            case '🍐': win = panos * 4; break;
            case '🍉': win = panos * 5; break;
            case '7️⃣': win = panos * 10; break;
        }
        raha += win;
        document.getElementById("voitto").textContent = `Voitit ${win}€!`;
        updateBalance();
        disableLockButtons();
        return;
    }
    
    
    const count7 = reels.filter(fruit => fruit === '7️⃣').length;
    if (count7 === 3) {
        const win = panos * 5;
        raha += win;
        document.getElementById("voitto").textContent = `Voitit ${win}€! (3 x 7️⃣)`;
        updateBalance();
        disableLockButtons();
        return;
    }
}

function updateBalance() {
    document.getElementById("balance").textContent = raha;
}

function disableLockButtons() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`lock${i}`).disabled = true;
    }
}

function enableLockButtons() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`lock${i}`).disabled = false;
    }
}
