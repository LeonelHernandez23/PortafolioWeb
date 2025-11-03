const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let scrollPosition = 0;
let targetScroll = 0;
const maxScroll = 5000;
const scrollSpeed = 5;

const character = {
    x: 150,
    y: canvas.height - 150,
    width: 40,
    height: 60,
    speed: 3,
    isJumping: false,
    jumpPower: 0,
    gravity: 0.5
};

const objects = [
    { x: 500, y: canvas.height - 200, width: 80, height: 80, type: 'about', emoji: '👤', found: false, title: 'Sobre Mí', content: '<h2>Sobre Mí</h2><p>Desarrollador web apasionado por crear experiencias digitales únicas. Con experiencia en tecnologías modernas y un enfoque en código limpio y eficiente.</p><h3>Objetivo</h3><p>Crear soluciones web innovadoras que combinen funcionalidad, estética y experiencia de usuario excepcional.</p>' },
    { x: 1200, y: canvas.height - 180, width: 80, height: 80, type: 'skills', emoji: '⚡', found: false, title: 'Habilidades', content: '<h2>Habilidades Técnicas</h2><ul class="skill-list"><li>HTML5 & CSS3 - 89%</li><li>JavaScript ES6+ - 87%</li><li>React & Vue - 80%</li><li>Node.js - 50%</li><li>UI/UX Design - 20%</li></ul>' },
    { x: 2000, y: canvas.height - 220, width: 80, height: 80, type: 'education', emoji: '🎓', found: false, title: 'Educación', content: '<h2>Educación</h2><h3>Certificaciones</h3><p>• CCNA Switching & Routing<br>• CCNA Introduction to Networks<br>• Networking Academy 2023</p><h3>Formación</h3><p>Formación continua en desarrollo web y tecnologías emergentes.</p>' },
    { x: 2800, y: canvas.height - 190, width: 80, height: 80, type: 'projects', emoji: '🚀', found: false, title: 'Proyectos', content: '<h2>Proyectos Destacados</h2><p><strong>Paginas Web</strong><br>HTML CSS JS C#<br>Sistema completo </p><p><strong>Task Manager App</strong><br>Vue.js + Firebase<br>Gestión de tareas en tiempo real</p><p><strong>Weather Dashboard</strong><br>JavaScript + API<br>Dashboard interactivo del clima</p>' },
    { x: 3600, y: canvas.height - 210, width: 80, height: 80, type: 'experience', emoji: '💼', found: false, title: 'Experiencia', content: '<h2>Experiencia</h2><h3>Desarrollador Frontend</h3><p>Proyectos académicos y personales enfocados en crear interfaces modernas y funcionales.</p><h3>Especialización</h3><p>• Desarrollo de SPAs<br>• Responsive Design<br>• Animaciones CSS<br>• Integración de APIs</p>' },
    { x: 4500, y: canvas.height - 200, width: 80, height: 80, type: 'contact', emoji: '📧', found: false, title: 'Contacto', content: '<h2>¡Contáctame!</h2><p>¿Tienes un proyecto en mente? ¡Hablemos!</p><h3>Redes Sociales</h3><p>📧 Email: leoasper23@gmail.com.com<br>💼 LinkedIn: /leonel-hernandez<br>🐙 GitHub: /leonel<br>📷 Instagram: @leonel</p><p><strong>¿Listo para trabajar juntos?</strong><br>Envíame un mensaje y comencemos a crear algo increíble.</p>' }
];

let foundObjects = 0;

const platforms = [];
const groundY = canvas.height - 120;
for (let i = 0; i < 25; i++) {
    platforms.push({
        x: i * 200,
        y: groundY,
        width: 200,
        height: 20
    });
}

const clouds = [];
for (let i = 0; i < 15; i++) {
    clouds.push({
        x: Math.random() * maxScroll,
        y: 50 + Math.random() * 200,
        width: 100 + Math.random() * 100,
        speed: 0.2 + Math.random() * 0.3
    });
}

window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) {
        targetScroll = Math.min(targetScroll + 50, maxScroll);
    } else {
        targetScroll = Math.max(targetScroll - 50, 0);
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Down') {
        targetScroll = Math.min(targetScroll + 100, maxScroll);
    } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        targetScroll = Math.max(targetScroll - 100, 0);
    } else if (e.key === ' ' && !character.isJumping) {
        character.isJumping = true;
        character.jumpPower = 15;
    }
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left + scrollPosition;
    const clickY = e.clientY - rect.top;

    objects.forEach(obj => {
        if (clickX >= obj.x && clickX <= obj.x + obj.width &&
            clickY >= obj.y && clickY <= obj.y + obj.height) {
            showPanel(obj);
        }
    });
});

function showPanel(obj) {
    if (!obj.found) {
        obj.found = true;
        foundObjects++;
        updateUI();
    }
    document.getElementById('panelContent').innerHTML = obj.content;
    document.getElementById('infoPanel').classList.add('active');
}

function closePanel() {
    document.getElementById('infoPanel').classList.remove('active');
}
window.closePanel = closePanel;

function updateUI() {
    document.getElementById('found').textContent = foundObjects;
    document.getElementById('position').textContent = Math.floor(scrollPosition) + 'm';
    document.getElementById('level').textContent = Math.floor(scrollPosition / 1000) + 1;
    
    const progress = (foundObjects / objects.length) * 100;
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = progress + '%';
    progressBar.textContent = Math.floor(progress) + '%';
}

function drawCharacter() {
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(character.x, character.y, character.width, character.height * 0.6);
    
    ctx.fillStyle = '#ffdbac';
    ctx.beginPath();
    ctx.arc(character.x + character.width / 2, character.y - 10, 15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.fillRect(character.x + 12, character.y - 12, 3, 3);
    ctx.fillRect(character.x + 25, character.y - 12, 3, 3);
    
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(character.x + 5, character.y + character.height * 0.6, 12, character.height * 0.4);
    ctx.fillRect(character.x + 23, character.y + character.height * 0.6, 12, character.height * 0.4);
    
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(character.x + 5, character.y - 20, 30, 8);
    ctx.fillRect(character.x + 10, character.y - 25, 20, 5);
}

function drawPlatforms() {
    platforms.forEach(platform => {
        const screenX = platform.x - scrollPosition;
        if (screenX > -platform.width && screenX < canvas.width + platform.width) {
            const gradient = ctx.createLinearGradient(screenX, platform.y, screenX, platform.y + platform.height);
            gradient.addColorStop(0, '#6d4c41');
            gradient.addColorStop(1, '#4e342e');
            ctx.fillStyle = gradient;
            ctx.fillRect(screenX, platform.y, platform.width, platform.height);
            
            ctx.fillStyle = '#8bc34a';
            ctx.fillRect(screenX, platform.y - 5, platform.width, 5);
            
            ctx.fillStyle = '#9ccc65';
            for (let i = 0; i < platform.width; i += 15) {
                ctx.fillRect(screenX + i, platform.y - 7, 2, 2);
                ctx.fillRect(screenX + i + 7, platform.y - 6, 2, 1);
            }
        }
    });
}

function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x < -cloud.width) cloud.x = maxScroll + cloud.width;
        
        const screenX = cloud.x - scrollPosition * 0.5;
        
        if (screenX > -cloud.width && screenX < canvas.width + cloud.width) {
            ctx.beginPath();
            ctx.arc(screenX, cloud.y, 25, 0, Math.PI * 2);
            ctx.arc(screenX + 30, cloud.y - 5, 35, 0, Math.PI * 2);
            ctx.arc(screenX + 60, cloud.y, 25, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
            ctx.beginPath();
            ctx.ellipse(screenX + 30, cloud.y + 10, 40, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        }
    });
}

function drawObjects() {
    objects.forEach(obj => {
        const screenX = obj.x - scrollPosition;
        if (screenX > -obj.width && screenX < canvas.width + obj.width) {
            ctx.fillStyle = obj.found ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.7)';
            ctx.fillRect(screenX, obj.y, obj.width, obj.height);
            
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.strokeRect(screenX, obj.y, obj.width, obj.height);
            
            ctx.font = '40px Arial';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(obj.emoji, screenX + obj.width / 2, obj.y + obj.height / 2);
            
            if (!obj.found) {
                ctx.font = '14px Arial';
                ctx.fillStyle = '#fff';
                ctx.fillText('Click!', screenX + obj.width / 2, obj.y - 10);
            } else {
                ctx.font = '12px Arial';
                ctx.fillStyle = '#4ade80';
                ctx.fillText('✓ Visto', screenX + obj.width / 2, obj.y - 10);
            }
            
            if (!obj.found) {
                const time = Date.now() * 0.005;
                const alpha = (Math.sin(time) + 1) / 2;
                ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.3})`;
                ctx.fillRect(screenX - 5, obj.y - 5, obj.width + 10, obj.height + 10);
            }
        }
    });
}

function drawSky() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
    
    ctx.fillStyle = 'rgba(100, 100, 150, 0.3)';
    ctx.beginPath();
    for (let i = -1; i < 10; i++) {
        const x = i * 300 - (scrollPosition * 0.1) % 300;
        ctx.moveTo(x, canvas.height * 0.6);
        ctx.lineTo(x + 150, canvas.height * 0.3);
        ctx.lineTo(x + 300, canvas.height * 0.6);
    }
    ctx.fill();
    
    const groundGradient = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
    groundGradient.addColorStop(0, '#a0d468');
    groundGradient.addColorStop(0.3, '#8bc34a');
    groundGradient.addColorStop(1, '#689f38');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
}

function drawGround() {
    ctx.fillStyle = '#7cb342';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    
    ctx.fillStyle = '#8bc34a';
    for (let i = 0; i < canvas.width; i += 10) {
        const offset = (i + scrollPosition * 0.5) % 20;
        ctx.fillRect(i, canvas.height - 102, 8, 2);
    }
    
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    
    ctx.fillStyle = '#4e342e';
    for (let i = 0; i < canvas.width; i += 50) {
        const x = (i + scrollPosition * 0.3) % canvas.width;
        ctx.fillRect(x, canvas.height - 25, 3, 3);
        ctx.fillRect(x + 20, canvas.height - 15, 2, 2);
    }
}

function drawTrees() {
    for (let i = 0; i < 40; i++) {
        const baseX = i * 180;
        const treeX = baseX - (scrollPosition * 0.3) % (180 * 40);
        
        if (treeX > -100 && treeX < canvas.width + 100) {
            ctx.fillStyle = '#5d4037';
            ctx.fillRect(treeX, canvas.height - 150, 20, 60);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(treeX + 15, canvas.height - 150, 5, 60);
            
            ctx.fillStyle = '#2e7d32';
            ctx.beginPath();
            ctx.arc(treeX + 10, canvas.height - 165, 35, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#388e3c';
            ctx.beginPath();
            ctx.arc(treeX + 10, canvas.height - 155, 30, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#43a047';
            ctx.beginPath();
            ctx.arc(treeX + 10, canvas.height - 145, 25, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(treeX + 5, canvas.height - 160, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function updateCharacter() {
    scrollPosition += (targetScroll - scrollPosition) * 0.1;

    if (character.isJumping) {
        character.y -= character.jumpPower;
        character.jumpPower -= character.gravity;
        
        if (character.y >= canvas.height - 150) {
            character.y = canvas.height - 150;
            character.isJumping = false;
            character.jumpPower = 0;
        }
    }

    const walkCycle = Math.sin(Date.now() * 0.01) * 2;
    character.y += walkCycle * 0.5;
}

function drawProgress() {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 250);
    ctx.lineTo(canvas.width, canvas.height - 250);
    ctx.stroke();
    ctx.setLineDash([]);
}

function gameLoop() {
    updateCharacter();
    updateUI();
    
    drawSky();
    drawClouds();
    drawTrees();
    drawGround();
    drawPlatforms();
    drawProgress();
    drawObjects();
    drawCharacter();
    
    requestAnimationFrame(gameLoop);
}

gameLoop();

setInterval(() => {
    if (foundObjects === objects.length && !document.querySelector('.congrats')) {
        const congrats = document.createElement('div');
        congrats.className = 'congrats';
        congrats.innerHTML = '<h1>🎉 ¡Felicitaciones! 🎉</h1><p>Has completado el portafolio interactivo</p><p>Conoces toda mi información ahora</p>';
        congrats.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);padding:40px;border-radius:20px;text-align:center;color:white;z-index:200;border:3px solid #ef4444;';
        document.body.appendChild(congrats);
        
        setTimeout(() => {
            congrats.remove();
        }, 5000);
    }
}, 1000);