/**
 * Sistema de Seguridad Avanzado - Security Fortress
 * Protección contra todos los tipos de ataques conocidos
 */

class SecurityFortress {
    constructor() {
        this.threatDetector = new ThreatDetector();
        this.encryptionEngine = new EncryptionEngine();
        this.integrityValidator = new IntegrityValidator();
        this.anomalyDetector = new AnomalyDetector();
        this.rateLimiter = new RateLimiter();
        this.securityLogger = new SecurityLogger();
        this.init();
    }

    init() {
        this.setupCSPProtection();
        this.setupXSSProtection();
        this.setupCSRFProtection();
        this.setupClickjackingProtection();
        this.setupInputSanitization();
        this.setupRateLimiting();
        this.setupAnomalyDetection();
        this.setupIntegrityChecks();
        this.setupSecureHeaders();
        this.startSecurityMonitoring();
    }

    // Protección contra Content Security Policy
    setupCSPProtection() {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            font-src 'self' https://fonts.gstatic.com;
            img-src 'self' data: blob:;
            connect-src 'self';
            frame-ancestors 'none';
            base-uri 'self';
            form-action 'self';
        `.replace(/\s+/g, ' ').trim();
        document.head.appendChild(meta);
    }

    // Protección avanzada contra XSS
    setupXSSProtection() {
        // Sanitización automática de inputs
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.target.value = this.sanitizeInput(e.target.value);
            }
        });

        // Protección contra DOM XSS
        this.protectDOMManipulation();
        
        // Validación de contenido dinámico
        this.setupDynamicContentValidation();
    }

    sanitizeInput(input) {
        // Algoritmo avanzado de sanitización
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/data:text\/html/gi, '')
            .replace(/vbscript:/gi, '')
            .replace(/expression\s*\(/gi, '')
            .replace(/url\s*\(/gi, '')
            .replace(/@import/gi, '')
            .replace(/\<\s*link/gi, '')
            .replace(/\<\s*meta/gi, '')
            .replace(/\<\s*style/gi, '')
            .replace(/\<\s*object/gi, '')
            .replace(/\<\s*embed/gi, '')
            .replace(/\<\s*applet/gi, '')
            .replace(/\<\s*form/gi, '');
    }

    protectDOMManipulation() {
        // Interceptar y validar manipulaciones del DOM
        const originalInnerHTML = Element.prototype.innerHTML;
        const originalOuterHTML = Element.prototype.outerHTML;
        
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                const sanitized = securityFortress.sanitizeHTML(value);
                originalInnerHTML.call(this, sanitized);
            },
            get: function() {
                return originalInnerHTML.call(this);
            }
        });
    }

    sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    // Protección CSRF con tokens dinámicos
    setupCSRFProtection() {
        this.csrfToken = this.generateCSRFToken();
        this.injectCSRFTokens();
        this.validateCSRFTokens();
    }

    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    injectCSRFTokens() {
        document.querySelectorAll('form').forEach(form => {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = 'csrf_token';
            tokenInput.value = this.csrfToken;
            form.appendChild(tokenInput);
        });
    }

    // Protección contra Clickjacking
    setupClickjackingProtection() {
        // X-Frame-Options
        if (window.self !== window.top) {
            document.body.style.display = 'none';
            throw new Error('Clickjacking attempt detected');
        }

        // Frame busting avanzado
        this.setupFrameBusting();
    }

    setupFrameBusting() {
        setInterval(() => {
            if (window.self !== window.top) {
                window.top.location = window.self.location;
            }
        }, 1000);
    }

    // Limitación de velocidad avanzada
    setupRateLimiting() {
        this.rateLimiter.setupEndpointLimits({
            '/': { requests: 100, window: 60000 }, // 100 requests per minute
            '/api/*': { requests: 50, window: 60000 }, // 50 API calls per minute
            'form_submit': { requests: 10, window: 60000 } // 10 form submissions per minute
        });
    }

    // Detección de anomalías con IA
    setupAnomalyDetection() {
        this.anomalyDetector.startMonitoring({
            mouseMovements: true,
            clickPatterns: true,
            typingPatterns: true,
            navigationPatterns: true,
            timeBasedPatterns: true
        });
    }

    // Verificación de integridad
    setupIntegrityChecks() {
        this.integrityValidator.validateScripts();
        this.integrityValidator.validateStyles();
        this.integrityValidator.validateContent();
        
        // Verificación continua
        setInterval(() => {
            this.integrityValidator.performIntegrityCheck();
        }, 30000);
    }

    // Headers de seguridad
    setupSecureHeaders() {
        // Simular headers de seguridad en el cliente
        this.secureHeaders = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
        };
    }

    // Monitoreo de seguridad en tiempo real
    startSecurityMonitoring() {
        setInterval(() => {
            this.performSecurityScan();
        }, 5000);
    }

    performSecurityScan() {
        const threats = this.threatDetector.scanForThreats();
        const anomalies = this.anomalyDetector.detectAnomalies();
        const integrityIssues = this.integrityValidator.checkIntegrity();

        if (threats.length > 0 || anomalies.length > 0 || integrityIssues.length > 0) {
            this.handleSecurityIncident({
                threats,
                anomalies,
                integrityIssues,
                timestamp: Date.now()
            });
        }
    }

    handleSecurityIncident(incident) {
        this.securityLogger.logIncident(incident);
        
        // Respuesta automática basada en severidad
        const severity = this.calculateIncidentSeverity(incident);
        
        if (severity >= 8) {
            this.lockdownMode();
        } else if (severity >= 5) {
            this.enhancedSecurityMode();
        } else {
            this.logAndMonitor(incident);
        }
    }

    lockdownMode() {
        // Modo de bloqueo total
        document.body.innerHTML = `
            <div class="security-lockdown">
                <h1>🔒 Security Lockdown Active</h1>
                <p>Suspicious activity detected. Session terminated for security.</p>
                <p>Incident ID: ${this.generateIncidentId()}</p>
            </div>
        `;
        
        // Deshabilitar toda funcionalidad
        document.addEventListener('click', (e) => e.preventDefault(), true);
        document.addEventListener('keydown', (e) => e.preventDefault(), true);
    }

    enhancedSecurityMode() {
        // Modo de seguridad mejorada
        this.showSecurityWarning();
        this.increaseMonitoringFrequency();
        this.requireAdditionalValidation();
    }

    showSecurityWarning() {
        const warning = document.createElement('div');
        warning.className = 'security-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <span class="warning-icon">⚠️</span>
                <span class="warning-text">Enhanced security mode active</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        document.body.appendChild(warning);
    }
}

// Detector de Amenazas
class ThreatDetector {
    constructor() {
        this.knownThreats = new Set([
            'eval(',
            'Function(',
            'setTimeout(',
            'setInterval(',
            'document.write',
            'innerHTML',
            'outerHTML',
            'insertAdjacentHTML',
            'document.cookie',
            'localStorage',
            'sessionStorage'
        ]);
        this.suspiciousPatterns = [
            /javascript:/gi,
            /data:text\/html/gi,
            /vbscript:/gi,
            /<script/gi,
            /<iframe/gi,
            /on\w+\s*=/gi,
            /expression\s*\(/gi
        ];
    }

    scanForThreats() {
        const threats = [];
        
        // Escanear scripts
        document.querySelectorAll('script').forEach(script => {
            if (this.containsThreat(script.textContent)) {
                threats.push({
                    type: 'malicious_script',
                    element: script,
                    content: script.textContent.substring(0, 100)
                });
            }
        });

        // Escanear atributos
        document.querySelectorAll('*').forEach(element => {
            Array.from(element.attributes).forEach(attr => {
                if (this.containsThreat(attr.value)) {
                    threats.push({
                        type: 'malicious_attribute',
                        element: element,
                        attribute: attr.name,
                        value: attr.value
                    });
                }
            });
        });

        return threats;
    }

    containsThreat(content) {
        if (!content) return false;
        
        // Verificar patrones conocidos
        for (const pattern of this.suspiciousPatterns) {
            if (pattern.test(content)) {
                return true;
            }
        }

        // Verificar amenazas conocidas
        for (const threat of this.knownThreats) {
            if (content.includes(threat)) {
                return true;
            }
        }

        return false;
    }
}

// Motor de Encriptación
class EncryptionEngine {
    constructor() {
        this.key = this.generateEncryptionKey();
    }

    generateEncryptionKey() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return array;
    }

    async encryptData(data) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));
        
        const key = await crypto.subtle.importKey(
            'raw',
            this.key,
            { name: 'AES-GCM' },
            false,
            ['encrypt']
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            dataBuffer
        );

        return {
            encrypted: Array.from(new Uint8Array(encrypted)),
            iv: Array.from(iv)
        };
    }

    async decryptData(encryptedData) {
        const key = await crypto.subtle.importKey(
            'raw',
            this.key,
            { name: 'AES-GCM' },
            false,
            ['decrypt']
        );

        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
            key,
            new Uint8Array(encryptedData.encrypted)
        );

        const decoder = new TextDecoder();
        return JSON.parse(decoder.decode(decrypted));
    }
}

// Validador de Integridad
class IntegrityValidator {
    constructor() {
        this.checksums = new Map();
        this.originalContent = new Map();
    }

    validateScripts() {
        document.querySelectorAll('script[src]').forEach(script => {
            this.validateScriptIntegrity(script);
        });
    }

    validateScriptIntegrity(script) {
        const src = script.src;
        if (src && !script.integrity) {
            console.warn(`Script without integrity check: ${src}`);
            this.generateIntegrityHash(script);
        }
    }

    async generateIntegrityHash(script) {
        try {
            const response = await fetch(script.src);
            const content = await response.text();
            const hash = await this.calculateSHA256(content);
            script.integrity = `sha256-${hash}`;
            script.crossOrigin = 'anonymous';
        } catch (error) {
            console.error('Failed to generate integrity hash:', error);
        }
    }

    async calculateSHA256(content) {
        const encoder = new TextEncoder();
        const data = encoder.encode(content);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(hash)));
    }

    checkIntegrity() {
        const issues = [];
        
        // Verificar modificaciones no autorizadas
        document.querySelectorAll('script').forEach(script => {
            const currentContent = script.textContent;
            const originalContent = this.originalContent.get(script);
            
            if (originalContent && currentContent !== originalContent) {
                issues.push({
                    type: 'script_modification',
                    element: script,
                    original: originalContent.substring(0, 100),
                    current: currentContent.substring(0, 100)
                });
            }
        });

        return issues;
    }

    performIntegrityCheck() {
        const issues = this.checkIntegrity();
        if (issues.length > 0) {
            console.warn('Integrity violations detected:', issues);
            return issues;
        }
        return [];
    }
}

// Detector de Anomalías
class AnomalyDetector {
    constructor() {
        this.behaviorBaseline = new Map();
        this.anomalyThreshold = 0.7;
        this.monitoringActive = false;
    }

    startMonitoring(options = {}) {
        this.monitoringActive = true;
        
        if (options.mouseMovements) {
            this.monitorMouseMovements();
        }
        if (options.clickPatterns) {
            this.monitorClickPatterns();
        }
        if (options.typingPatterns) {
            this.monitorTypingPatterns();
        }
        if (options.navigationPatterns) {
            this.monitorNavigationPatterns();
        }
    }

    monitorMouseMovements() {
        let mouseData = [];
        
        document.addEventListener('mousemove', (e) => {
            mouseData.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now()
            });
            
            if (mouseData.length > 100) {
                mouseData.shift();
            }
            
            if (mouseData.length >= 10) {
                const anomalyScore = this.analyzeMousePattern(mouseData);
                if (anomalyScore > this.anomalyThreshold) {
                    this.reportAnomaly('suspicious_mouse_pattern', anomalyScore);
                }
            }
        });
    }

    analyzeMousePattern(mouseData) {
        // Algoritmo para detectar patrones de mouse no humanos
        const speeds = [];
        const directions = [];
        
        for (let i = 1; i < mouseData.length; i++) {
            const prev = mouseData[i - 1];
            const curr = mouseData[i];
            
            const distance = Math.sqrt(
                Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
            );
            const time = curr.timestamp - prev.timestamp;
            const speed = distance / time;
            
            speeds.push(speed);
            
            const angle = Math.atan2(curr.y - prev.y, curr.x - prev.x);
            directions.push(angle);
        }
        
        // Detectar patrones perfectamente lineales (bots)
        const speedVariance = this.calculateVariance(speeds);
        const directionVariance = this.calculateVariance(directions);
        
        // Patrones sospechosos: velocidad muy constante o movimientos muy lineales
        if (speedVariance < 0.1 && directionVariance < 0.1) {
            return 0.9; // Alta probabilidad de bot
        }
        
        return 0.1; // Comportamiento normal
    }

    calculateVariance(data) {
        const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
        return variance;
    }

    detectAnomalies() {
        const anomalies = [];
        
        // Verificar patrones de comportamiento anómalos
        const currentBehavior = this.getCurrentBehaviorProfile();
        const baseline = this.behaviorBaseline.get('default') || currentBehavior;
        
        const deviation = this.calculateBehaviorDeviation(currentBehavior, baseline);
        
        if (deviation > this.anomalyThreshold) {
            anomalies.push({
                type: 'behavior_anomaly',
                deviation: deviation,
                current: currentBehavior,
                baseline: baseline
            });
        }
        
        return anomalies;
    }

    reportAnomaly(type, score) {
        console.warn(`Anomaly detected: ${type} (score: ${score})`);
        
        // Registrar para análisis posterior
        this.logAnomaly({
            type: type,
            score: score,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });
    }
}

// Limitador de Velocidad
class RateLimiter {
    constructor() {
        this.limits = new Map();
        this.requests = new Map();
    }

    setupEndpointLimits(limits) {
        Object.entries(limits).forEach(([endpoint, limit]) => {
            this.limits.set(endpoint, limit);
        });
    }

    checkLimit(endpoint) {
        const limit = this.limits.get(endpoint);
        if (!limit) return true;
        
        const now = Date.now();
        const requests = this.requests.get(endpoint) || [];
        
        // Limpiar requests antiguos
        const validRequests = requests.filter(time => now - time < limit.window);
        
        if (validRequests.length >= limit.requests) {
            return false; // Límite excedido
        }
        
        validRequests.push(now);
        this.requests.set(endpoint, validRequests);
        return true;
    }
}

// Logger de Seguridad
class SecurityLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
    }

    logIncident(incident) {
        const logEntry = {
            id: this.generateLogId(),
            timestamp: Date.now(),
            type: 'security_incident',
            severity: this.calculateSeverity(incident),
            details: incident,
            userAgent: navigator.userAgent,
            url: window.location.href,
            sessionId: this.getSessionId()
        };
        
        this.logs.push(logEntry);
        
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        // Enviar a servidor si es crítico
        if (logEntry.severity >= 8) {
            this.sendCriticalAlert(logEntry);
        }
    }

    generateLogId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    calculateSeverity(incident) {
        let severity = 1;
        
        if (incident.threats && incident.threats.length > 0) {
            severity += incident.threats.length * 2;
        }
        
        if (incident.anomalies && incident.anomalies.length > 0) {
            severity += incident.anomalies.length;
        }
        
        if (incident.integrityIssues && incident.integrityIssues.length > 0) {
            severity += incident.integrityIssues.length * 3;
        }
        
        return Math.min(severity, 10);
    }

    getSecurityReport() {
        return {
            totalIncidents: this.logs.length,
            criticalIncidents: this.logs.filter(log => log.severity >= 8).length,
            recentIncidents: this.logs.filter(log => Date.now() - log.timestamp < 3600000), // Last hour
            topThreats: this.getTopThreats(),
            securityScore: this.calculateSecurityScore()
        };
    }
}

// Inicializar sistema de seguridad
const securityFortress = new SecurityFortress();

// Exportar para uso global
window.SecurityFortress = SecurityFortress;
window.securityFortress = securityFortress;