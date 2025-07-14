// InfoZ-All - Sistema de Análise Completa
class SystemAnalyzer {
  constructor() {
    this.loadStartTime = performance.now();
    this.init();
  }

  async init() {
    await this.showLoadingScreen();
    await this.gatherSystemInfo();
    this.hideLoadingScreen();
    this.startRealTimeUpdates();
  }

  async showLoadingScreen() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000); // 3 segundos de loading
    });
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    const mainContent = document.getElementById("main-content");

    loadingScreen.style.opacity = "0";
    loadingScreen.style.visibility = "hidden";

    setTimeout(() => {
      mainContent.classList.remove("hidden");
      this.animateCards();
    }, 500);
  }

  animateCards() {
    const cards = document.querySelectorAll(".info-card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "all 0.6s ease";

        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 50);
      }, index * 150);
    });
  }

  async gatherSystemInfo() {
    // Informações básicas do sistema
    this.updateBasicInfo();

    // Informações de hardware
    this.updateHardwareInfo();

    // Informações de software
    this.updateSoftwareInfo();

    // Informações de rede
    await this.updateNetworkInfo();

    // Informações de performance
    this.updatePerformanceInfo();
  }

  updateBasicInfo() {
    // Sistema Operacional
    const osInfo = this.getOperatingSystem();
    document.getElementById("os-info").textContent = osInfo;
    document.getElementById("operating-system").textContent = osInfo;

    // CPU
    const cpuInfo = this.getCPUInfo();
    document.getElementById("cpu-info").textContent = cpuInfo;

    // RAM
    const ramInfo = this.getRAMInfo();
    document.getElementById("ram-info").textContent = ramInfo;
    document.getElementById("total-memory").textContent = ramInfo;

    // Navegador
    const browserInfo = this.getBrowserInfo();
    document.getElementById("browser-info").textContent = browserInfo.name;
    document.getElementById("browser-version").textContent =
      browserInfo.version;
  }

  updateHardwareInfo() {
    // Arquitetura
    document.getElementById("architecture").textContent =
      navigator.platform || "Não disponível";

    // Núcleos do CPU
    document.getElementById("cpu-cores").textContent =
      navigator.hardwareConcurrency || "Não disponível";

    // GPU
    const gpu = this.getGPUInfo();
    document.getElementById("gpu-info").textContent = gpu;

    // Resolução da tela
    const resolution = `${screen.width}x${screen.height}`;
    document.getElementById("screen-resolution").textContent = resolution;

    // Profundidade de cor
    document.getElementById(
      "color-depth"
    ).textContent = `${screen.colorDepth} bits`;
  }

  updateSoftwareInfo() {
    // User Agent
    document.getElementById("user-agent").textContent =
      navigator.userAgent.substring(0, 100) + "...";

    // Cookies
    document.getElementById("cookies-enabled").textContent =
      navigator.cookieEnabled ? "Sim" : "Não";

    // Local Storage
    const hasLocalStorage = this.checkLocalStorage();
    document.getElementById("local-storage").textContent = hasLocalStorage
      ? "Disponível"
      : "Não disponível";
  }

  async updateNetworkInfo() {
    try {
      // IP e localização
      const ipInfo = await this.getIPInfo();
      document.getElementById("public-ip").textContent =
        ipInfo.ip || "Não disponível";
      document.getElementById("location").textContent = `${
        ipInfo.city || "N/A"
      }, ${ipInfo.country || "N/A"}`;
      document.getElementById("isp").textContent =
        ipInfo.org || "Não disponível";
    } catch (error) {
      document.getElementById("public-ip").textContent = "Erro ao carregar";
      document.getElementById("location").textContent = "Erro ao carregar";
      document.getElementById("isp").textContent = "Erro ao carregar";
    }

    // Tipo de conexão
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    if (connection) {
      document.getElementById("connection-type").textContent =
        connection.effectiveType || "Não disponível";
      document.getElementById("connection-speed").textContent =
        connection.downlink ? `${connection.downlink} Mbps` : "Não disponível";
    } else {
      document.getElementById("connection-type").textContent = "Não disponível";
      document.getElementById("connection-speed").textContent =
        "Não disponível";
    }

    // Status online
    document.getElementById("online-status").textContent = navigator.onLine
      ? "Online"
      : "Offline";
  }

  updatePerformanceInfo() {
    // Tempo de carregamento
    const loadTime = ((performance.now() - this.loadStartTime) / 1000).toFixed(
      2
    );
    document.getElementById("load-time").textContent = `${loadTime}s`;

    // Memória (se disponível)
    if (performance.memory) {
      const memoryUsed = (
        performance.memory.usedJSHeapSize /
        1024 /
        1024
      ).toFixed(2);
      document.getElementById("memory-usage").textContent = `${memoryUsed} MB`;
    } else {
      document.getElementById("memory-usage").textContent = "Não disponível";
    }

    // Fuso horário
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById("timezone").textContent = timezone;

    // Idioma
    document.getElementById("system-language").textContent =
      navigator.language || "Não disponível";

    // Plugins
    document.getElementById("plugins-count").textContent =
      navigator.plugins.length.toString();

    // WebGL
    const webglSupport = this.checkWebGLSupport();
    document.getElementById("webgl-support").textContent = webglSupport
      ? "Sim"
      : "Não";
  }

  getOperatingSystem() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    if (userAgent.includes("Windows NT 10.0")) return "Windows 10/11";
    if (userAgent.includes("Windows NT 6.3")) return "Windows 8.1";
    if (userAgent.includes("Windows NT 6.2")) return "Windows 8";
    if (userAgent.includes("Windows NT 6.1")) return "Windows 7";
    if (userAgent.includes("Windows NT 6.0")) return "Windows Vista";
    if (userAgent.includes("Windows NT 5.1")) return "Windows XP";
    if (userAgent.includes("Mac OS X")) {
      const match = userAgent.match(/Mac OS X ([0-9_]+)/);
      if (match) {
        const version = match[1].replace(/_/g, ".");
        return `macOS ${version}`;
      }
      return "macOS";
    }
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
      return "iOS";

    return platform || "Sistema não identificado";
  }

  getCPUInfo() {
    const cores = navigator.hardwareConcurrency;
    if (cores) {
      return `${cores} núcleos lógicos`;
    }
    return "Informação não disponível";
  }

  getRAMInfo() {
    if (navigator.deviceMemory) {
      return `~${navigator.deviceMemory} GB`;
    }
    return "Informação não disponível";
  }

  getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let name = "Desconhecido";
    let version = "Desconhecida";

    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      name = "Google Chrome";
      const match = userAgent.match(/Chrome\/([0-9.]+)/);
      if (match) version = match[1];
    } else if (userAgent.includes("Firefox")) {
      name = "Mozilla Firefox";
      const match = userAgent.match(/Firefox\/([0-9.]+)/);
      if (match) version = match[1];
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      name = "Safari";
      const match = userAgent.match(/Version\/([0-9.]+)/);
      if (match) version = match[1];
    } else if (userAgent.includes("Edg")) {
      name = "Microsoft Edge";
      const match = userAgent.match(/Edg\/([0-9.]+)/);
      if (match) version = match[1];
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
      name = "Opera";
      const match = userAgent.match(/(Opera|OPR)\/([0-9.]+)/);
      if (match) version = match[2];
    }

    return { name, version };
  }

  getGPUInfo() {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          return renderer || "WebGL disponível";
        }
        return "WebGL disponível";
      }
      return "WebGL não disponível";
    } catch (error) {
      return "Erro ao detectar GPU";
    }
  }

  checkLocalStorage() {
    try {
      const test = "test";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getIPInfo() {
    try {
      const response = await fetch("https://ipapi.co/json/");
      return await response.json();
    } catch (error) {
      // Fallback para outro serviço
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return { ip: data.ip };
      } catch (fallbackError) {
        throw new Error("Não foi possível obter informações de IP");
      }
    }
  }

  checkWebGLSupport() {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      );
    } catch (error) {
      return false;
    }
  }

  startRealTimeUpdates() {
    // Atualizar status online/offline
    window.addEventListener("online", () => {
      document.getElementById("online-status").textContent = "Online";
    });

    window.addEventListener("offline", () => {
      document.getElementById("online-status").textContent = "Offline";
    });

    // Atualizar informações de performance a cada 5 segundos
    setInterval(() => {
      if (performance.memory) {
        const memoryUsed = (
          performance.memory.usedJSHeapSize /
          1024 /
          1024
        ).toFixed(2);
        document.getElementById(
          "memory-usage"
        ).textContent = `${memoryUsed} MB`;
      }
    }, 5000);
  }
}

// Função para atualizar dados
function refreshData() {
  const refreshBtn = document.querySelector(".refresh-btn i");
  refreshBtn.style.transform = "rotate(360deg)";

  setTimeout(() => {
    refreshBtn.style.transform = "rotate(0deg)";
  }, 500);

  // Reinicializar o analisador
  new SystemAnalyzer();
}

// Inicializar quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  new SystemAnalyzer();
});

// Adicionar efeitos visuais extras
document.addEventListener("mousemove", (e) => {
  const cards = document.querySelectorAll(".info-card");
  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    } else {
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    }
  });
});

// Efeito de partículas no fundo (opcional)
function createParticles() {
  const particlesContainer = document.createElement("div");
  particlesContainer.className = "particles-container";
  particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(233, 69, 96, 0.3);
            border-radius: 50%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
    particlesContainer.appendChild(particle);
  }

  document.body.appendChild(particlesContainer);
}

// CSS para animação das partículas
const particleStyles = document.createElement("style");
particleStyles.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyles);

// Inicializar partículas
createParticles();
