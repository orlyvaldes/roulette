class RuletaWheel {
    constructor(canvasId, segments, mode = 'normal') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.originalSegments = [...segments]; // Copia de segmentos originales
        this.segments = segments.filter(s => s.active !== false); // Solo segmentos activos
        this.mode = mode;
        this.angle = 0;
        this.spinning = false;
        this.spinVelocity = 0;
        this.friction = 0.995;
        this.minVelocity = 0.01;
        this.eliminationOrder = []; // Orden de eliminación
        this.currentRound = 1;
        
        // Configuración del canvas
        this.radius = Math.min(this.canvas.width, this.canvas.height) / 2 - 10;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        // Configuración de segmentos
        this.updateAngleStep();
        
        // Configuración de sonidos (opcional)
        this.setupSounds();
        
        // Dibujar ruleta inicial
        this.draw();
        
        // Actualizar UI si es modo eliminación
        if (this.mode === 'elimination') {
            this.updateEliminationUI();
        }
    }

    updateAngleStep() {
        this.angleStep = (2 * Math.PI) / this.segments.length;
    }

    setupSounds() {
        // Crear contexto de audio para efectos de sonido
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio no disponible');
        }
    }

    playTickSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    draw() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar sombra de la ruleta
        this.drawShadow();
        
        // Dibujar segmentos
        this.drawSegments();
        
        // Dibujar borde exterior
        this.drawBorder();
        
        // Dibujar centro
        this.drawCenter();
        
        // Dibujar flecha
        this.drawArrow();
    }

    drawShadow() {
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
        
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
        
        this.ctx.restore();
    }

    drawSegments() {
        for (let i = 0; i < this.segments.length; i++) {
            // Ajustar para que el primer segmento esté centrado en la parte superior
            // La flecha apunta hacia arriba (-π/2), así que centramos el primer segmento ahí
            const offsetAngle = -Math.PI / 2 - this.angleStep / 2;
            const startAngle = i * this.angleStep + this.angle + offsetAngle;
            const endAngle = startAngle + this.angleStep;
            
            // Dibujar segmento
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
            this.ctx.closePath();
            
            // Aplicar gradiente
            const gradient = this.ctx.createRadialGradient(
                this.centerX, this.centerY, 0,
                this.centerX, this.centerY, this.radius
            );
            gradient.addColorStop(0, this.lightenColor(this.segments[i].color, 20));
            gradient.addColorStop(1, this.segments[i].color);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Borde del segmento
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Dibujar texto
            this.drawText(i, startAngle, endAngle);
        }
    }

    drawText(segmentIndex, startAngle, endAngle) {
        const text = this.segments[segmentIndex].text;
        const midAngle = startAngle + this.angleStep / 2;
        
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(midAngle);
        
        // Configurar texto
        const fontSize = Math.max(12, Math.min(18, this.radius / this.segments.length * 0.8));
        this.ctx.font = `bold ${fontSize}px 'Poppins', sans-serif`;
        this.ctx.fillStyle = this.getContrastColor(this.segments[segmentIndex].color);
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';
        
        // Dibujar sombra del texto
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 2;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        
        // Truncar texto si es muy largo
        let displayText = text;
        const maxWidth = this.radius * 0.7;
        if (this.ctx.measureText(text).width > maxWidth) {
            displayText = text.substring(0, 15) + '...';
        }
        
        this.ctx.fillText(displayText, this.radius * 0.85, 0);
        
        this.ctx.restore();
    }

    drawBorder() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
    }

    drawCenter() {
        // Centro de la ruleta
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 20, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#333';
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }

    drawArrow() {
        // Flecha indicadora
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, -this.radius - 5);
        this.ctx.lineTo(-15, -this.radius - 25);
        this.ctx.lineTo(15, -this.radius - 25);
        this.ctx.closePath();
        
        // Gradiente para la flecha
        const arrowGradient = this.ctx.createLinearGradient(0, -this.radius - 25, 0, -this.radius - 5);
        arrowGradient.addColorStop(0, '#ff6b6b');
        arrowGradient.addColorStop(1, '#ff5252');
        
        this.ctx.fillStyle = arrowGradient;
        this.ctx.fill();
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    spin() {
        if (this.spinning) return;
        
        this.spinning = true;
        this.spinVelocity = 0.3 + Math.random() * 0.4; // Velocidad inicial aleatoria
        
        // Reproducir sonido de inicio
        this.playTickSound();
        
        // Deshabilitar botón de giro
        const spinButton = document.getElementById('spinButton');
        if (spinButton) {
            spinButton.disabled = true;
            const t = (key) => languageManager ? languageManager.t(key) : key;
            spinButton.textContent = t('spinning');
        }
        
        this.animate();
    }

    animate() {
        if (!this.spinning) return;
        
        // Actualizar ángulo
        this.angle += this.spinVelocity;
        
        // Aplicar fricción
        this.spinVelocity *= this.friction;
        
        // Dibujar frame actual
        this.draw();
        
        // Continuar animación o parar
        if (this.spinVelocity > this.minVelocity) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.stopSpin();
        }
    }

    stopSpin() {
        this.spinning = false;
        this.spinVelocity = 0;
        
        // Calcular ganador
        const winner = this.getWinner();
        
        // Habilitar botón de giro
        const spinButton = document.getElementById('spinButton');
        if (spinButton) {
            spinButton.disabled = false;
            const t = (key) => languageManager ? languageManager.t(key) : key;
            if (this.mode === 'elimination' && this.segments.length > 1) {
                spinButton.innerHTML = `🎲 ${t('round')} ${this.currentRound + 1}`;
            } else {
                spinButton.innerHTML = `🎲 ${t('spinButton')}`;
            }
        }
        
        // Procesar resultado según el modo
        if (this.mode === 'elimination') {
            this.processEliminationResult(winner);
        } else {
            this.showResult(winner);
        }
    }

    processEliminationResult(winner) {
        if (this.segments.length === 1) {
            // Es el ganador final
            this.showFinalWinner(winner);
            return;
        }

        // Calcular posición correcta (los eliminados van de último a segundo lugar)
        const totalSegments = this.originalSegments.length;
        const remainingSegments = this.segments.length - 1; // Después de eliminar este
        const position = remainingSegments + 1; // Posición final (último eliminado = posición más alta)

        // Agregar al orden de eliminación
        this.eliminationOrder.push({
            round: this.currentRound,
            position: position,
            segment: winner.segment,
            eliminated: true
        });

        // Eliminar el segmento ganador
        this.segments = this.segments.filter((_, index) => index !== winner.index);
        this.updateAngleStep();
        this.currentRound++;

        // Mostrar resultado de eliminación
        this.showEliminationResult(winner);

        // Redibujar ruleta sin el segmento eliminado
        setTimeout(() => {
            this.angle = 0; // Resetear ángulo
            this.draw();
            this.updateEliminationUI();
        }, 2000);
    }

    showEliminationResult(winner) {
        let resultDiv = document.getElementById('result');
        if (!resultDiv) {
            resultDiv = document.createElement('div');
            resultDiv.id = 'result';
            resultDiv.className = 'result-container';
            document.body.appendChild(resultDiv);
        }

        const remainingCount = this.segments.length - 1;
        const currentEliminated = this.eliminationOrder[this.eliminationOrder.length - 1];
        
        const t = (key) => languageManager ? languageManager.t(key) : key;
        
        let positionText;
        if (currentEliminated.position === 2) {
            positionText = `🥈 ${t('second_place')}`;
        } else if (currentEliminated.position === 3) {
            positionText = `🥉 ${t('third_place')}`;
        } else {
            positionText = `#${currentEliminated.position} - ${currentEliminated.position}º ${t('place')}`;
        }

        resultDiv.innerHTML = `
            <div class="result-content">
                <h2>${t('eliminated')}</h2>
                <div class="elimination-info">
                    <div class="eliminated-segment">
                        <div class="winner-color" style="background-color: ${winner.segment.color}"></div>
                        <div class="winner-text">${winner.segment.text}</div>
                    </div>
                    <div class="elimination-stats">
                        <div class="stat">
                            <span class="stat-label">${t('finalPosition')}</span>
                            <span class="stat-value">${positionText}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">${t('eliminatedIn')}</span>
                            <span class="stat-value">${t('round')} ${this.currentRound}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">${t('remaining')}</span>
                            <span class="stat-value">${remainingCount} ${remainingCount === 1 ? t('finalist') : t('options')}</span>
                        </div>
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.style.display='none'" class="close-result">
                    ${remainingCount > 0 ? (remainingCount === 1 ? `🏆 ${t('finalRound')}` : `➡️ ${t('continue')}`) : t('close')}
                </button>
            </div>
        `;

        resultDiv.style.display = 'flex';
        this.playEliminationSound();
    }

    showFinalWinner(winner) {
        // El último segmento es el ganador (posición 1)
        this.eliminationOrder.push({
            round: this.currentRound,
            position: 1,
            segment: winner.segment,
            eliminated: false
        });

        let resultDiv = document.getElementById('result');
        if (!resultDiv) {
            resultDiv = document.createElement('div');
            resultDiv.id = 'result';
            resultDiv.className = 'result-container';
            document.body.appendChild(resultDiv);
        }

        const t = (key) => languageManager ? languageManager.t(key) : key;

        // Crear tabla de resultados
        let orderTable = `<div class="final-order"><h3>${t('finalClassification')}</h3><div class="order-list">`;
        
        // Ordenar por posición (1 = ganador, números más altos = eliminados antes)
        const sortedOrder = [...this.eliminationOrder].sort((a, b) => a.position - b.position);
        
        sortedOrder.forEach((item, index) => {
            let medal, positionText;
            
            if (item.position === 1) {
                medal = '🥇';
                positionText = t('winner_pos');
            } else if (item.position === 2) {
                medal = '🥈';
                positionText = t('second_place');
            } else if (item.position === 3) {
                medal = '🥉';
                positionText = t('third_place');
            } else {
                medal = `#${item.position}`;
                positionText = `${item.position}º ${t('place')}`;
            }
            
            orderTable += `
                <div class="order-item ${item.position === 1 ? 'winner' : ''}">
                    <div class="order-position">${medal}</div>
                    <div class="order-color" style="background-color: ${item.segment.color}"></div>
                    <div class="order-text">${item.segment.text}</div>
                    <div class="order-position-text">${positionText}</div>
                    <div class="order-round">R${item.round}</div>
                </div>
            `;
        });
        
        orderTable += '</div></div>';

        resultDiv.innerHTML = `
            <div class="result-content final-result">
                <h2>${t('winner')}</h2>
                <div class="winner-display final-winner">
                    <div class="winner-color" style="background-color: ${winner.segment.color}"></div>
                    <div class="winner-text">${winner.segment.text}</div>
                </div>
                ${orderTable}
                <div class="final-actions">
                    <button onclick="this.parentElement.parentElement.parentElement.style.display='none'" class="close-result">
                        ${t('close')}
                    </button>
                    <button onclick="window.location.href='/'" class="new-game-btn">
                        ${t('newGame')}
                    </button>
                </div>
            </div>
        `;

        resultDiv.style.display = 'flex';
        this.playVictorySound();

        // Deshabilitar botón de giro
        const spinButton = document.getElementById('spinButton');
        if (spinButton) {
            spinButton.disabled = true;
            spinButton.textContent = `🏆 ${t('gameFinished')}`;
        }
    }

    updateEliminationUI() {
        let eliminationInfo = document.getElementById('elimination-info');
        if (!eliminationInfo) {
            eliminationInfo = document.createElement('div');
            eliminationInfo.id = 'elimination-info';
            eliminationInfo.className = 'elimination-info-panel';
            document.querySelector('.container').appendChild(eliminationInfo);
        }

        const t = (key) => languageManager ? languageManager.t(key) : key;

        let orderList = '';
        if (this.eliminationOrder.length > 0) {
            orderList = `<h4>${t('eliminatedOrder')}</h4><div class="eliminated-list">`;
            
            // Ordenar por posición descendente (último eliminado primero)
            const sortedEliminated = [...this.eliminationOrder].sort((a, b) => b.position - a.position);
            
            sortedEliminated.forEach((item, index) => {
                let positionText;
                if (item.position === 2) {
                    positionText = `🥈 ${t('2nd')}`;
                } else if (item.position === 3) {
                    positionText = `🥉 ${t('3rd')}`;
                } else {
                    positionText = `#${item.position}`;
                }
                
                orderList += `
                    <div class="eliminated-item">
                        <span class="eliminated-position">${positionText}</span>
                        <div class="eliminated-color" style="background-color: ${item.segment.color}"></div>
                        <span class="eliminated-name">${item.segment.text}</span>
                        <span class="eliminated-round">R${item.round}</span>
                    </div>
                `;
            });
            orderList += '</div>';
        }

        eliminationInfo.innerHTML = `
            <div class="elimination-status">
                <h3>🏆 ${t('eliminationMode_title')} ${this.currentRound}</h3>
                <div class="elimination-stats">
                    <div class="stat-item">
                        <span class="stat-number">${this.segments.length}</span>
                        <span class="stat-label">${t('remaining_count')}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.eliminationOrder.length}</span>
                        <span class="stat-label">${t('eliminated_count')}</span>
                    </div>
                </div>
                ${orderList}
            </div>
        `;
    }

    playEliminationSound() {
        if (!this.audioContext) return;
        
        // Sonido de eliminación (tono descendente)
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    getWinner() {
        // Enfoque simplificado: calcular directamente qué segmento está en la parte superior
        
        // Normalizar el ángulo de rotación actual
        let normalizedAngle = this.angle % (2 * Math.PI);
        if (normalizedAngle < 0) {
            normalizedAngle += 2 * Math.PI;
        }
        
        // Como aplicamos un offset de -π/2 - angleStep/2 en drawSegments,
        // necesitamos revertir este offset para el cálculo
        const offsetAngle = -Math.PI / 2 - this.angleStep / 2;
        
        // El ángulo efectivo donde está el primer segmento
        const effectiveAngle = normalizedAngle + offsetAngle;
        
        // Normalizar el ángulo efectivo
        let normEffectiveAngle = effectiveAngle % (2 * Math.PI);
        if (normEffectiveAngle < 0) {
            normEffectiveAngle += 2 * Math.PI;
        }
        
        // La flecha apunta hacia arriba (3π/2 en nuestro sistema)
        // Calcular qué segmento está en esa posición
        const arrowPosition = 3 * Math.PI / 2;
        
        // Calcular la diferencia angular desde el primer segmento
        let angleDiff = arrowPosition - normEffectiveAngle;
        if (angleDiff < 0) {
            angleDiff += 2 * Math.PI;
        }
        
        // Calcular el índice del segmento ganador
        const winnerIndex = Math.floor(angleDiff / this.angleStep) % this.segments.length;
        
        console.log(`Ángulo: ${this.angle.toFixed(3)}, Efectivo: ${normEffectiveAngle.toFixed(3)}, Diff: ${angleDiff.toFixed(3)}, Ganador: ${winnerIndex}, Segmento: "${this.segments[winnerIndex]?.text}"`);
        
        return {
            index: winnerIndex,
            segment: this.segments[winnerIndex]
        };
    }

    showResult(winner) {
        // Crear elemento de resultado si no existe
        let resultDiv = document.getElementById('result');
        if (!resultDiv) {
            resultDiv = document.createElement('div');
            resultDiv.id = 'result';
            resultDiv.className = 'result-container';
            document.body.appendChild(resultDiv);
        }
        
        // Mostrar resultado con animación
        resultDiv.innerHTML = `
            <div class="result-content">
                <h2>🎉 ¡Resultado!</h2>
                <div class="winner-display">
                    <div class="winner-color" style="background-color: ${winner.segment.color}"></div>
                    <div class="winner-text">${winner.segment.text}</div>
                </div>
                <button onclick="this.parentElement.parentElement.style.display='none'" class="close-result">
                    Cerrar
                </button>
            </div>
        `;
        
        resultDiv.style.display = 'flex';
        
        // Reproducir sonido de victoria
        this.playVictorySound();
    }

    playVictorySound() {
        if (!this.audioContext) return;
        
        // Secuencia de tonos para sonido de victoria
        const notes = [523.25, 659.25, 783.99]; // Do, Mi, Sol
        
        notes.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.3);
            }, index * 150);
        });
    }

    // Utilidades de color
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    getContrastColor(hexColor) {
        // Convertir hex a RGB
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        
        // Calcular luminancia
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }
}

// Variables globales
let ruletaWheel = null;

// Funciones de compatibilidad con el código anterior
function drawWheel(segments, mode = 'normal') {
    if (!ruletaWheel) {
        ruletaWheel = new RuletaWheel('wheel', segments, mode);
    }
}

function spin() {
    if (ruletaWheel) {
        ruletaWheel.spin();
    }
}

// Función para reiniciar la ruleta
function resetWheel() {
    if (ruletaWheel) {
        if (ruletaWheel.mode === 'elimination') {
            // En modo eliminación, reiniciar completamente
            ruletaWheel.segments = [...ruletaWheel.originalSegments];
            ruletaWheel.eliminationOrder = [];
            ruletaWheel.currentRound = 1;
            ruletaWheel.updateAngleStep();
            ruletaWheel.updateEliminationUI();
            
            // Habilitar botón de giro
            const spinButton = document.getElementById('spinButton');
            if (spinButton) {
                spinButton.disabled = false;
                const t = (key) => languageManager ? languageManager.t(key) : key;
                spinButton.innerHTML = `🎲 ${t('round')} 1`;
            }
        }
        ruletaWheel.angle = 0;
        ruletaWheel.draw();
    }
}
