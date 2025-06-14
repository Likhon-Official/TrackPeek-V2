import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Terminal, Smartphone, Monitor, Cpu, HardDrive, Eye, Settings, ChevronDown, ChevronUp, Wifi, Battery, Globe, Clock, Shield, Zap, MousePointer, Keyboard, Camera, Mic } from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';

interface DeviceInfo {
  operatingSystem: string;
  deviceType: string;
  deviceModel: string;
  manufacturer: string;
  screenSize: string;
  viewportSize: string;
  devicePixelRatio: string;
  ram: string;
  cpuCores: string;
  touchSupport: string;
  orientation: string;
  colorDepth: string;
  pixelDensity: string;
}

interface BrowserInfo {
  browserName: string;
  browserVersion: string;
  browserEngine: string;
  language: string;
  languages: string;
  cookiesEnabled: string;
  doNotTrack: string;
  userAgent: string;
  platform: string;
  javaEnabled: string;
  onlineStatus: string;
}

interface WebGLInfo {
  gpuVendor: string;
  gpuRenderer: string;
  webglVersion: string;
  webgl2Support: string;
  maxTextureSize: string;
  shadingLanguageVersion: string;
  extensions: string;
}

interface NetworkPowerInfo {
  onlineStatus: string;
  batteryLevel: string;
  chargingStatus: string;
  connectionType: string;
  effectiveType: string;
  downlink: string;
  rtt: string;
  saveData: string;
}

interface EnvironmentInfo {
  timezone: string;
  timezoneOffset: string;
  currentTime: string;
  preferredColorScheme: string;
  referrerURL: string;
  documentTitle: string;
  windowSize: string;
  availableScreenSize: string;
  colorGamut: string;
}

interface SecurityInfo {
  httpsEnabled: string;
  secureContext: string;
  crossOriginIsolated: string;
  permissions: string;
  storageQuota: string;
  indexedDBSupport: string;
  localStorageSupport: string;
  sessionStorageSupport: string;
}

interface InteractionData {
  mouseX: string;
  mouseY: string;
  clickPosition: string;
  keyPressed: string;
  scrollPosition: string;
  focusedElement: string;
  lastActivity: string;
}

interface FingerprintData {
  deviceInfo: DeviceInfo;
  browserInfo: BrowserInfo;
  webglInfo: WebGLInfo;
  networkPowerInfo: NetworkPowerInfo;
  environmentInfo: EnvironmentInfo;
  securityInfo: SecurityInfo;
  interactionData: InteractionData;
}

const FingerprintScanner: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [fingerprintData, setFingerprintData] = useState<FingerprintData | null>(null);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [interactionData, setInteractionData] = useState<InteractionData>({
    mouseX: '0',
    mouseY: '0',
    clickPosition: 'None',
    keyPressed: 'None',
    scrollPosition: '0',
    focusedElement: 'None',
    lastActivity: new Date().toLocaleTimeString()
  });
  const [permissionsGranted, setPermissionsGranted] = useState({
    geolocation: false,
    camera: false,
    microphone: false,
    notifications: false
  });
  const terminalRef = useRef<HTMLDivElement>(null);

  // Enhanced device detection
  const getDetailedDeviceInfo = (): DeviceInfo => {
    const userAgent = navigator.userAgent;
    let deviceType = 'Unknown';
    let deviceModel = 'Unknown';
    let manufacturer = 'Unknown';
    let operatingSystem = 'Unknown';

    // Mobile device detection
    if (/Android/i.test(userAgent)) {
      operatingSystem = 'Android';
      deviceType = 'Mobile';
      
      // Android device detection
      const androidMatch = userAgent.match(/Android\s([0-9\.]+)/);
      if (androidMatch) {
        operatingSystem = `Android ${androidMatch[1]}`;
      }
      
      // Samsung devices
      if (/SM-/i.test(userAgent)) {
        manufacturer = 'Samsung';
        const samsungMatch = userAgent.match(/SM-([A-Z0-9]+)/);
        if (samsungMatch) {
          deviceModel = `Galaxy ${samsungMatch[1]}`;
        }
      }
      // Google Pixel
      else if (/Pixel/i.test(userAgent)) {
        manufacturer = 'Google';
        const pixelMatch = userAgent.match(/Pixel\s?([0-9a-zA-Z\s]+)/);
        if (pixelMatch) {
          deviceModel = `Pixel ${pixelMatch[1].trim()}`;
        }
      }
      // OnePlus
      else if (/OnePlus/i.test(userAgent)) {
        manufacturer = 'OnePlus';
        const onePlusMatch = userAgent.match(/OnePlus\s?([A-Z0-9]+)/);
        if (onePlusMatch) {
          deviceModel = onePlusMatch[1];
        }
      }
      // Huawei
      else if (/Huawei|HW-|Honor/i.test(userAgent)) {
        manufacturer = 'Huawei';
        const huaweiMatch = userAgent.match(/(Huawei|HW-|Honor)\s?([A-Z0-9\-]+)/);
        if (huaweiMatch) {
          deviceModel = huaweiMatch[2];
        }
      }
      // Xiaomi
      else if (/Mi\s|Redmi|POCO/i.test(userAgent)) {
        manufacturer = 'Xiaomi';
        const xiaomiMatch = userAgent.match(/(Mi\s|Redmi\s|POCO\s)([A-Z0-9\s]+)/);
        if (xiaomiMatch) {
          deviceModel = `${xiaomiMatch[1].trim()} ${xiaomiMatch[2].trim()}`;
        }
      }
    }
    // iPhone detection
    else if (/iPhone/i.test(userAgent)) {
      operatingSystem = 'iOS';
      deviceType = 'Mobile';
      manufacturer = 'Apple';
      
      const iOSMatch = userAgent.match(/OS\s([0-9_]+)/);
      if (iOSMatch) {
        operatingSystem = `iOS ${iOSMatch[1].replace(/_/g, '.')}`;
      }
      
      // iPhone model detection based on screen size and user agent
      const screenWidth = screen.width;
      const screenHeight = screen.height;
      const pixelRatio = window.devicePixelRatio;
      
      if (screenWidth === 428 && screenHeight === 926) deviceModel = 'iPhone 14 Pro Max';
      else if (screenWidth === 393 && screenHeight === 852) deviceModel = 'iPhone 14 Pro';
      else if (screenWidth === 390 && screenHeight === 844) deviceModel = 'iPhone 14/13/12';
      else if (screenWidth === 414 && screenHeight === 896) deviceModel = 'iPhone 11 Pro Max/XS Max';
      else if (screenWidth === 375 && screenHeight === 812) deviceModel = 'iPhone 13 mini/12 mini/X/XS';
      else if (screenWidth === 414 && screenHeight === 736) deviceModel = 'iPhone 8 Plus/7 Plus/6s Plus';
      else if (screenWidth === 375 && screenHeight === 667) deviceModel = 'iPhone SE/8/7/6s';
      else deviceModel = 'iPhone (Unknown Model)';
    }
    // iPad detection
    else if (/iPad/i.test(userAgent)) {
      operatingSystem = 'iPadOS';
      deviceType = 'Tablet';
      manufacturer = 'Apple';
      deviceModel = 'iPad';
      
      const iOSMatch = userAgent.match(/OS\s([0-9_]+)/);
      if (iOSMatch) {
        operatingSystem = `iPadOS ${iOSMatch[1].replace(/_/g, '.')}`;
      }
    }
    // Windows detection
    else if (/Windows/i.test(userAgent)) {
      deviceType = 'Desktop';
      
      if (/Windows NT 10.0/i.test(userAgent)) operatingSystem = 'Windows 10/11';
      else if (/Windows NT 6.3/i.test(userAgent)) operatingSystem = 'Windows 8.1';
      else if (/Windows NT 6.2/i.test(userAgent)) operatingSystem = 'Windows 8';
      else if (/Windows NT 6.1/i.test(userAgent)) operatingSystem = 'Windows 7';
      else operatingSystem = 'Windows';
      
      // Check for Surface devices
      if (/Surface/i.test(userAgent)) {
        manufacturer = 'Microsoft';
        deviceModel = 'Surface Device';
      }
    }
    // macOS detection
    else if (/Macintosh|Mac OS X/i.test(userAgent)) {
      operatingSystem = 'macOS';
      deviceType = 'Desktop';
      manufacturer = 'Apple';
      
      const macMatch = userAgent.match(/Mac OS X\s([0-9_]+)/);
      if (macMatch) {
        operatingSystem = `macOS ${macMatch[1].replace(/_/g, '.')}`;
      }
      
      // Mac model detection (limited)
      if (/Intel/i.test(userAgent)) deviceModel = 'Mac (Intel)';
      else deviceModel = 'Mac (Apple Silicon)';
    }
    // Linux detection
    else if (/Linux/i.test(userAgent)) {
      operatingSystem = 'Linux';
      deviceType = 'Desktop';
      
      if (/Ubuntu/i.test(userAgent)) operatingSystem = 'Ubuntu Linux';
      else if (/Fedora/i.test(userAgent)) operatingSystem = 'Fedora Linux';
      else if (/SUSE/i.test(userAgent)) operatingSystem = 'SUSE Linux';
      else if (/Debian/i.test(userAgent)) operatingSystem = 'Debian Linux';
    }

    // Touch support detection
    const touchSupport = navigator.maxTouchPoints > 0 ? 
      `Yes (${navigator.maxTouchPoints} points)` : 'No';

    // Screen orientation
    const orientation = screen.orientation ? 
      `${screen.orientation.type} (${screen.orientation.angle}°)` : 
      (window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait');

    return {
      operatingSystem,
      deviceType,
      deviceModel,
      manufacturer,
      screenSize: `${screen.width} × ${screen.height}`,
      viewportSize: `${window.innerWidth} × ${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio.toString(),
      ram: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Unknown',
      cpuCores: navigator.hardwareConcurrency?.toString() || 'Unknown',
      touchSupport,
      orientation,
      colorDepth: `${screen.colorDepth}-bit`,
      pixelDensity: `${Math.round(window.devicePixelRatio * 96)} DPI`
    };
  };

  // Enhanced browser detection
  const getDetailedBrowserInfo = (): BrowserInfo => {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    let browserEngine = 'Unknown';

    // Chrome detection
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browserName = 'Google Chrome';
      browserEngine = 'Blink';
      const match = userAgent.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    }
    // Edge detection
    else if (userAgent.includes('Edg')) {
      browserName = 'Microsoft Edge';
      browserEngine = 'Blink';
      const match = userAgent.match(/Edg\/(\d+\.\d+\.\d+\.\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    }
    // Firefox detection
    else if (userAgent.includes('Firefox')) {
      browserName = 'Mozilla Firefox';
      browserEngine = 'Gecko';
      const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    }
    // Safari detection
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browserName = 'Safari';
      browserEngine = 'WebKit';
      const match = userAgent.match(/Version\/(\d+\.\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    }
    // Opera detection
    else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
      browserName = 'Opera';
      browserEngine = 'Blink';
      const match = userAgent.match(/(OPR|Opera)\/(\d+\.\d+)/);
      browserVersion = match ? match[2] : 'Unknown';
    }

    return {
      browserName,
      browserVersion,
      browserEngine,
      language: navigator.language,
      languages: navigator.languages.join(', '),
      cookiesEnabled: navigator.cookieEnabled ? 'Yes' : 'No',
      doNotTrack: navigator.doNotTrack === '1' ? 'Enabled' : 'Disabled',
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      javaEnabled: (navigator as any).javaEnabled ? (navigator as any).javaEnabled() ? 'Yes' : 'No' : 'Unknown',
      onlineStatus: navigator.onLine ? 'Online' : 'Offline'
    };
  };

  // Enhanced WebGL detection
  const getDetailedWebGLInfo = (): WebGLInfo => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const gl2 = canvas.getContext('webgl2');
      
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const extensions = gl.getSupportedExtensions();
        
        return {
          gpuVendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
          gpuRenderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
          webglVersion: gl.getParameter(gl.VERSION),
          webgl2Support: gl2 ? 'Yes' : 'No',
          maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE).toString(),
          shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
          extensions: extensions ? `${extensions.length} extensions` : 'Unknown'
        };
      }
    } catch (e) {
      // WebGL not available
    }
    
    return {
      gpuVendor: 'Not Available',
      gpuRenderer: 'Not Available',
      webglVersion: 'Not Available',
      webgl2Support: 'No',
      maxTextureSize: 'Unknown',
      shadingLanguageVersion: 'Not Available',
      extensions: 'None'
    };
  };

  // Enhanced security info
  const getSecurityInfo = (): SecurityInfo => {
    return {
      httpsEnabled: location.protocol === 'https:' ? 'Yes' : 'No',
      secureContext: window.isSecureContext ? 'Yes' : 'No',
      crossOriginIsolated: window.crossOriginIsolated ? 'Yes' : 'No',
      permissions: 'permissions' in navigator ? 'Supported' : 'Not Supported',
      storageQuota: 'storage' in navigator && 'estimate' in navigator.storage ? 'Supported' : 'Not Supported',
      indexedDBSupport: 'indexedDB' in window ? 'Yes' : 'No',
      localStorageSupport: 'localStorage' in window ? 'Yes' : 'No',
      sessionStorageSupport: 'sessionStorage' in window ? 'Yes' : 'No'
    };
  };

  // Track user interactions in real-time
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setInteractionData(prev => ({
        ...prev,
        mouseX: e.clientX.toString(),
        mouseY: e.clientY.toString(),
        lastActivity: new Date().toLocaleTimeString()
      }));
    };

    const handleClick = (e: MouseEvent) => {
      setInteractionData(prev => ({
        ...prev,
        clickPosition: `${e.clientX}, ${e.clientY}`,
        lastActivity: new Date().toLocaleTimeString()
      }));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      setInteractionData(prev => ({
        ...prev,
        keyPressed: e.key === ' ' ? 'Space' : e.key,
        lastActivity: new Date().toLocaleTimeString()
      }));
    };

    const handleScroll = () => {
      setInteractionData(prev => ({
        ...prev,
        scrollPosition: `${window.scrollX}, ${window.scrollY}`,
        lastActivity: new Date().toLocaleTimeString()
      }));
    };

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      setInteractionData(prev => ({
        ...prev,
        focusedElement: target.tagName || 'Unknown',
        lastActivity: new Date().toLocaleTimeString()
      }));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('focusin', handleFocus);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('focusin', handleFocus);
    };
  }, []);

  const collectFingerprintData = async (): Promise<FingerprintData> => {
    // Device Information
    const deviceInfo = getDetailedDeviceInfo();

    // Browser Information
    const browserInfo = getDetailedBrowserInfo();

    // WebGL / GPU Info
    const webglInfo = getDetailedWebGLInfo();

    // Network & Power Info
    let batteryLevel = 'Unknown';
    let chargingStatus = 'Unknown';
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        batteryLevel = `${Math.round(battery.level * 100)}%`;
        chargingStatus = battery.charging ? 'Charging' : 'Not Charging';
      } catch (e) {
        batteryLevel = 'Access Denied';
        chargingStatus = 'Access Denied';
      }
    }

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    const networkPowerInfo: NetworkPowerInfo = {
      onlineStatus: navigator.onLine ? 'Online' : 'Offline',
      batteryLevel,
      chargingStatus,
      connectionType: connection?.type || 'Unknown',
      effectiveType: connection?.effectiveType || 'Unknown',
      downlink: connection?.downlink ? `${connection.downlink} Mbps` : 'Unknown',
      rtt: connection?.rtt ? `${connection.rtt}ms` : 'Unknown',
      saveData: connection?.saveData ? 'Enabled' : 'Disabled'
    };

    // Environment / Settings Info
    const environmentInfo: EnvironmentInfo = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: `UTC${new Date().getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(new Date().getTimezoneOffset() / 60)}`,
      currentTime: new Date().toLocaleString(),
      preferredColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light',
      referrerURL: document.referrer || 'Direct visit',
      documentTitle: document.title,
      windowSize: `${window.outerWidth} × ${window.outerHeight}`,
      availableScreenSize: `${screen.availWidth} × ${screen.availHeight}`,
      colorGamut: window.matchMedia('(color-gamut: p3)').matches ? 'P3' : window.matchMedia('(color-gamut: srgb)').matches ? 'sRGB' : 'Unknown'
    };

    // Security Information
    const securityInfo = getSecurityInfo();

    return {
      deviceInfo,
      browserInfo,
      webglInfo,
      networkPowerInfo,
      environmentInfo,
      securityInfo,
      interactionData
    };
  };

  const formatScanOutput = (data: FingerprintData): string[] => {
    return [
      'root@trackpeek:~$ ./advanced_fingerprint_scan --deep-analysis --comprehensive',
      '',
      '[INITIALIZING] Advanced Digital Fingerprint Collection Protocol...',
      '[STATUS] Establishing secure connection to target system...',
      '[STATUS] Bypassing browser security restrictions...',
      '[SUCCESS] Connection established - Beginning data extraction...',
      '',
      '╔══════════════════════════════════════════════════════════════════════════════╗',
      '║                           DEVICE INTELLIGENCE                               ║',
      '╚══════════════════════════════════════════════════════════════════════════════╝',
      '',
      '[EXTRACTING] Operating system fingerprint...',
      `[DATA] operating_system: ${data.deviceInfo.operatingSystem}`,
      `[DATA] device_type: ${data.deviceInfo.deviceType}`,
      `[DATA] device_model: ${data.deviceInfo.deviceModel}`,
      `[DATA] manufacturer: ${data.deviceInfo.manufacturer}`,
      '',
      '[EXTRACTING] Display and hardware specifications...',
      `[DATA] screen_resolution: ${data.deviceInfo.screenSize}`,
      `[DATA] viewport_size: ${data.deviceInfo.viewportSize}`,
      `[DATA] device_pixel_ratio: ${data.deviceInfo.devicePixelRatio}`,
      `[DATA] color_depth: ${data.deviceInfo.colorDepth}`,
      `[DATA] pixel_density: ${data.deviceInfo.pixelDensity}`,
      `[DATA] screen_orientation: ${data.deviceInfo.orientation}`,
      '',
      '[EXTRACTING] System resources and capabilities...',
      `[DATA] ram_memory: ${data.deviceInfo.ram}`,
      `[DATA] cpu_cores: ${data.deviceInfo.cpuCores}`,
      `[DATA] touch_support: ${data.deviceInfo.touchSupport}`,
      '',
      '╔══════════════════════════════════════════════════════════════════════════════╗',
      '║                          BROWSER INTELLIGENCE                               ║',
      '╚══════════════════════════════════════════════════════════════════════════════╝',
      '',
      '[EXTRACTING] Browser identification and version...',
      `[DATA] browser_name: ${data.browserInfo.browserName}`,
      `[DATA] browser_version: ${data.browserInfo.browserVersion}`,
      `[DATA] browser_engine: ${data.browserInfo.browserEngine}`,
      `[DATA] platform: ${data.browserInfo.platform}`,
      '',
      '[EXTRACTING] Language and localization settings...',
      `[DATA] primary_language: ${data.browserInfo.language}`,
      `[DATA] supported_languages: ${data.browserInfo.languages}`,
      `[DATA] java_enabled: ${data.browserInfo.javaEnabled}`,
      '',
      '[EXTRACTING] Privacy and security settings...',
      `[DATA] cookies_enabled: ${data.browserInfo.cookiesEnabled}`,
      `[DATA] do_not_track: ${data.browserInfo.doNotTrack}`,
      `[DATA] online_status: ${data.browserInfo.onlineStatus}`,
      '',
      '[EXTRACTING] Complete user agent string...',
      `[DATA] user_agent: ${data.browserInfo.userAgent.substring(0, 100)}...`,
      '',
      '╔══════════════════════════════════════════════════════════════════════════════╗',
      '║                         GRAPHICS INTELLIGENCE                               ║',
      '╚══════════════════════════════════════════════════════════════════════════════╝',
      '',
      '[EXTRACTING] GPU and graphics capabilities...',
      `[DATA] gpu_vendor: ${data.webglInfo.gpuVendor}`,
      `[DATA] gpu_renderer: ${data.webglInfo.gpuRenderer}`,
      `[DATA] webgl_version: ${data.webglInfo.webglVersion}`,
      `[DATA] webgl2_support: ${data.webglInfo.webgl2Support}`,
      `[DATA] max_texture_size: ${data.webglInfo.maxTextureSize}`,
      `[DATA] shading_language: ${data.webglInfo.shadingLanguageVersion}`,
      `[DATA] webgl_extensions: ${data.webglInfo.extensions}`,
      '',
      '╔══════════════════════════════════════════════════════════════════════════════╗',
      '║                        NETWORK & POWER ANALYSIS                             ║',
      '╚══════════════════════════════════════════════════════════════════════════════╝',
      '',
      '[EXTRACTING] Network connection details...',
      `[DATA] connection_status: ${data.networkPowerInfo.onlineStatus}`,
      `[DATA] connection_type: ${data.networkPowerInfo.connectionType}`,
      `[DATA] effective_type: ${data.networkPowerInfo.effectiveType}`,
      `[DATA] downlink_speed: ${data.networkPowerInfo.downlink}`,
      `[DATA] round_trip_time: ${data.networkPowerInfo.rtt}`,
      `[DATA] save_data_mode: ${data.networkPowerInfo.saveData}`,
      '',
      '[EXTRACTING] Power management information...',
      `[DATA] battery_level: ${data.networkPowerInfo.batteryLevel}`,
      `[DATA] charging_status: ${data.networkPowerInfo.chargingStatus}`,
      '',
      '╔══════════════════════════════════════════════════════════════════════════════╗',
      '║                       ENVIRONMENT INTELLIGENCE                              ║',
      '╚══════════════════════════════════════════════════════════════════════════════╝',
      '',
      '[EXTRACTING] Temporal and geographical data...',
      `[DATA] timezone: ${data.environmentInfo.timezone}`,
      `[DATA] timezone_offset: ${data.environmentInfo.timezoneOffset}`,
      `[DATA] current_timestamp: ${data.environmentInfo.currentTime}`,
      '',
      '[EXTRACTING] Display preferences and settings...',
      `[DATA] color_scheme_preference: ${data.environmentInfo.preferredColorScheme}`,
      `[DATA] color_gamut: ${data.environmentInfo.colorGamut}`,
      `[DATA] window_dimensions: ${data.environmentInfo.windowSize}`,
      `[DATA] available_screen_area: ${data.environmentInfo.availableScreenSize}`,
      '',
      '[EXTRACTING] Navigation and referrer data...',
      `[DATA] document_title: ${data.environmentInfo.documentTitle}`,
      `[DATA] referrer_url: ${data.environmentInfo.referrerURL}`,
      '',
      '╔══════════════════════════════════════════════════════════════════════════════╗',
      '║                        SECURITY INTELLIGENCE                                ║',
      '╚══════════════════════════════════════════════════════════════════════════════╝',
      '',
      '[EXTRACTING] Security context and capabilities...',
      `[DATA] https_enabled: ${data.securityInfo.httpsEnabled}`,
      `[DATA] secure_context: ${data.securityInfo.secureContext}`,
      `[DATA] cross_origin_isolated: ${data.securityInfo.crossOriginIsolated}`,
      `[DATA] permissions_api: ${data.securityInfo.permissions}`,
      '',
      '[EXTRACTING] Storage capabilities and quotas...',
      `[DATA] storage_quota_api: ${data.securityInfo.storageQuota}`,
      `[DATA] indexed_db_support: ${data.securityInfo.indexedDBSupport}`,
      `[DATA] local_storage_support: ${data.securityInfo.localStorageSupport}`,
      `[DATA] session_storage_support: ${data.securityInfo.sessionStorageSupport}`,
      '',
      '╔══════════════════════════════════════════════════════════════════════════════╗',
      '║                      REAL-TIME INTERACTION DATA                             ║',
      '╚══════════════════════════════════════════════════════════════════════════════╝',
      '',
      '[MONITORING] Live user interaction patterns...',
      `[LIVE] mouse_coordinates: ${data.interactionData.mouseX}, ${data.interactionData.mouseY}`,
      `[LIVE] last_click_position: ${data.interactionData.clickPosition}`,
      `[LIVE] last_key_pressed: ${data.interactionData.keyPressed}`,
      `[LIVE] scroll_position: ${data.interactionData.scrollPosition}`,
      `[LIVE] focused_element: ${data.interactionData.focusedElement}`,
      `[LIVE] last_activity_time: ${data.interactionData.lastActivity}`,
      '',
      '[SUCCESS] Advanced fingerprint collection completed successfully.',
      '[ANALYSIS] Digital identity profile has been compiled and analyzed.',
      `[SUMMARY] Total unique data points extracted: ${Object.keys(data).reduce((acc, section) => acc + Object.keys((data as any)[section]).length, 0)}`,
      '[WARNING] Target system has been completely profiled and catalogued.',
      '',
      '[SYSTEM] Fingerprint data ready for export and analysis...',
      '[STATUS] Maintaining persistent monitoring of target interactions...'
    ];
  };

  const startScan = async () => {
    setIsScanning(true);
    setDisplayedLines([]);
    setScanComplete(false);
    setCurrentLineIndex(0);
    
    const data = await collectFingerprintData();
    setFingerprintData(data);
    
    const lines = formatScanOutput(data);
    
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < lines.length) {
        setDisplayedLines(prev => [...prev, lines[lineIndex]]);
        setCurrentLineIndex(lineIndex);
        lineIndex++;
        
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setScanComplete(true);
      }
    }, 150); // Slower animation - 150ms per line for dramatic effect
  };

  // Update interaction data in real-time when scan is complete
  useEffect(() => {
    if (scanComplete && fingerprintData) {
      setFingerprintData(prev => prev ? {
        ...prev,
        interactionData
      } : null);
    }
  }, [interactionData, scanComplete]);

  const getLineColor = (line: string, index: number) => {
    if (typeof line !== 'string') {
      return '';
    }
    
    // Highlight current line being typed
    const isCurrentLine = index === currentLineIndex && isScanning;
    const baseClasses = isCurrentLine ? 'text-white bg-green-500/20' : '';
    
    if (line.startsWith('root@trackpeek:~$')) return `text-green-400 font-bold ${baseClasses}`;
    if (line.startsWith('╔') || line.startsWith('║') || line.startsWith('╚')) return `text-cyan-400 ${baseClasses}`;
    if (line.startsWith('[SUCCESS]')) return `text-green-300 font-bold ${baseClasses}`;
    if (line.startsWith('[WARNING]')) return `text-yellow-300 font-bold ${baseClasses}`;
    if (line.startsWith('[ERROR]')) return `text-red-300 font-bold ${baseClasses}`;
    if (line.startsWith('[INITIALIZING]') || line.startsWith('[STATUS]') || line.startsWith('[EXTRACTING]') || line.startsWith('[MONITORING]') || line.startsWith('[ANALYSIS]') || line.startsWith('[SUMMARY]') || line.startsWith('[SYSTEM]')) {
      return `text-blue-300 font-bold ${baseClasses}`;
    }
    if (line.startsWith('[DATA]') || line.startsWith('[LIVE]')) return `text-green-400 ${baseClasses}`;
    if (line === '') return '';
    if (line.includes('Unknown') || line.includes('denied') || line.includes('Denied') || line.includes('Access Denied') || line.includes('Not Available')) {
      return `text-red-400 ${baseClasses}`;
    }
    if (line.includes('Online') || line.includes('Enabled') || line.includes('Yes') || line.includes('Charging')) {
      return `text-green-300 ${baseClasses}`;
    }
    return `text-green-400 ${baseClasses}`;
  };

  const requestPermission = async (type: string) => {
    try {
      switch (type) {
        case 'geolocation':
          navigator.geolocation.getCurrentPosition(
            () => setPermissionsGranted(prev => ({ ...prev, geolocation: true })),
            () => {}
          );
          break;
        case 'camera':
          const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoStream.getTracks().forEach(track => track.stop());
          setPermissionsGranted(prev => ({ ...prev, camera: true }));
          break;
        case 'microphone':
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioStream.getTracks().forEach(track => track.stop());
          setPermissionsGranted(prev => ({ ...prev, microphone: true }));
          break;
        case 'notifications':
          const permission = await Notification.requestPermission();
          setPermissionsGranted(prev => ({ ...prev, notifications: permission === 'granted' }));
          break;
      }
    } catch (error) {
      console.log(`Permission denied: ${type}`);
    }
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  };

  const PermissionButton = ({ type, label, granted, icon: Icon }: { type: string, label: string, granted: boolean, icon: React.ComponentType<any> }) => (
    <button
      onClick={() => requestPermission(type)}
      className={`px-2 sm:px-3 py-1 sm:py-2 text-xs border rounded transition-all duration-300 flex items-center gap-1 sm:gap-2 ${
        granted 
          ? 'border-green-500 bg-green-500/20 text-green-300' 
          : 'border-yellow-500 text-yellow-400 hover:bg-yellow-500/10'
      }`}
      disabled={granted}
    >
      <Icon size={12} />
      <span className="hidden sm:inline">{granted ? `${label} ✓` : `Grant ${label}`}</span>
      <span className="sm:hidden">{granted ? '✓' : label}</span>
    </button>
  );

  const DataSection = ({ title, icon: Icon, data, live = false }: { 
    title: string, 
    icon: React.ComponentType<any>, 
    data: Record<string, string>,
    live?: boolean 
  }) => {
    const isExpanded = expandedSections.has(title);
    
    return (
      <div className="border border-green-500/30 rounded-lg bg-black/50 backdrop-blur-sm">
        <button
          onClick={() => toggleSection(title)}
          className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-green-500/5 transition-colors"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Icon size={16} className="text-green-400 flex-shrink-0 sm:w-5 sm:h-5" />
            <span className="text-green-300 font-bold text-sm sm:text-base">{title}</span>
            {live && <span className="text-xs bg-red-500 text-white px-1 sm:px-2 py-1 rounded-full animate-pulse">LIVE</span>}
          </div>
          {isExpanded ? <ChevronUp size={14} className="sm:w-4 sm:h-4" /> : <ChevronDown size={14} className="sm:w-4 sm:h-4" />}
        </button>
        
        {isExpanded && (
          <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 border-t border-green-500/20">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 gap-1 sm:gap-2">
                <span className="text-green-400 text-xs sm:text-sm font-mono">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                <span className={`text-xs sm:text-sm font-mono break-all ${
                  value.includes('Unknown') || value.includes('Not Available') || value.includes('Access Denied') 
                    ? 'text-red-400' 
                    : value.includes('Yes') || value.includes('Online') || value.includes('Enabled')
                    ? 'text-green-300'
                    : 'text-green-400'
                }`}>
                  {value.length > 50 ? `${value.substring(0, 50)}...` : value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    startScan();
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Terminal window header */}
      <div className="bg-gray-900 border-b border-green-500 p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 border border-green-500 rounded hover:bg-green-500/10 transition-colors text-sm"
          >
            <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Terminal size={16} className="sm:w-5 sm:h-5" />
            <span className="text-green-300 text-sm sm:text-base">Advanced Fingerprint Scanner</span>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Permission buttons */}
      <div className="bg-gray-900/50 border-b border-green-500/30 p-3 sm:p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-green-300 text-xs sm:text-sm mr-2 sm:mr-4 w-full sm:w-auto mb-2 sm:mb-0">Grant permissions for enhanced data collection:</span>
          <PermissionButton type="geolocation" label="Location" granted={permissionsGranted.geolocation} icon={Globe} />
          <PermissionButton type="camera" label="Camera" granted={permissionsGranted.camera} icon={Camera} />
          <PermissionButton type="microphone" label="Microphone" granted={permissionsGranted.microphone} icon={Mic} />
          <PermissionButton type="notifications" label="Notifications" granted={permissionsGranted.notifications} icon={Eye} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)]">
        {/* Terminal output */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-green-500/30 h-1/2 lg:h-full">
          <div 
            ref={terminalRef}
            className="h-full overflow-y-auto p-3 sm:p-6 bg-black text-xs sm:text-sm"
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,255,65,0.1) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}
          >
            <div className="space-y-1">
              {displayedLines.map((line, index) => (
                <div key={index} className={getLineColor(line, index)}>
                  <span className="font-mono break-all">
                    {line}
                    {index === displayedLines.length - 1 && isScanning && (
                      <span className="animate-pulse text-white">█</span>
                    )}
                  </span>
                </div>
              ))}
              
              {isScanning && (
                <div className="flex items-center gap-2 text-green-300 mt-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Extracting digital fingerprint data...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive data sections */}
        <div className="w-full lg:w-1/2 overflow-y-auto p-3 sm:p-6 bg-gray-900/20 h-1/2 lg:h-full">
          {!scanComplete ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-green-300 mb-2">Analyzing System...</h2>
                <p className="text-green-400 text-xs sm:text-sm">Please wait while we extract your comprehensive fingerprint data</p>
              </div>
              <SkeletonLoader type="card" count={7} />
            </div>
          ) : fingerprintData && (
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-green-300 mb-2">Interactive Data View</h2>
                <p className="text-green-400 text-xs sm:text-sm">Click sections to expand and explore your comprehensive fingerprint data</p>
              </div>

              <DataSection 
                title="Device Intelligence" 
                icon={Smartphone} 
                data={fingerprintData.deviceInfo} 
              />
              
              <DataSection 
                title="Browser Intelligence" 
                icon={Globe} 
                data={fingerprintData.browserInfo} 
              />
              
              <DataSection 
                title="Graphics Intelligence" 
                icon={Monitor} 
                data={fingerprintData.webglInfo} 
              />
              
              <DataSection 
                title="Network & Power Analysis" 
                icon={Wifi} 
                data={fingerprintData.networkPowerInfo} 
              />
              
              <DataSection 
                title="Environment Intelligence" 
                icon={Settings} 
                data={fingerprintData.environmentInfo} 
              />

              <DataSection 
                title="Security Intelligence" 
                icon={Shield} 
                data={fingerprintData.securityInfo} 
              />
              
              <DataSection 
                title="Real-time Interaction Data" 
                icon={MousePointer} 
                data={fingerprintData.interactionData} 
                live={true}
              />

              <div className="mt-6 sm:mt-8 p-3 sm:p-4 border border-green-500 rounded bg-green-500/5">
                <div className="flex items-center gap-2 text-green-300 mb-2">
                  <Shield size={14} className="sm:w-4 sm:h-4" />
                  <span className="font-bold text-sm sm:text-base">Advanced Scan Complete</span>
                </div>
                <p className="text-green-400 text-xs sm:text-sm mb-3 sm:mb-4">
                  Your comprehensive device fingerprint has been extracted and analyzed. This includes detailed 
                  device identification, browser capabilities, graphics hardware, network analysis, security context, 
                  and real-time interaction monitoring.
                </p>
                <div className="flex gap-2 sm:gap-4 flex-wrap">
                  <button
                    onClick={startScan}
                    className="px-3 sm:px-4 py-1 sm:py-2 border border-green-500 rounded hover:bg-green-500/10 transition-colors text-xs sm:text-sm"
                  >
                    Deep Rescan
                  </button>
                  <button
                    onClick={() => {
                      if (fingerprintData) {
                        const dataStr = JSON.stringify(fingerprintData, null, 2);
                        const blob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'advanced-device-fingerprint.json';
                        a.click();
                      }
                    }}
                    className="px-3 sm:px-4 py-1 sm:py-2 border border-green-500 rounded hover:bg-green-500/10 transition-colors text-xs sm:text-sm"
                  >
                    Export Data
                  </button>
                  <button
                    onClick={() => setExpandedSections(new Set(['Device Intelligence', 'Browser Intelligence', 'Graphics Intelligence', 'Network & Power Analysis', 'Environment Intelligence', 'Security Intelligence', 'Real-time Interaction Data']))}
                    className="px-3 sm:px-4 py-1 sm:py-2 border border-blue-500 text-blue-400 rounded hover:bg-blue-500/10 transition-colors text-xs sm:text-sm"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={() => setExpandedSections(new Set())}
                    className="px-3 sm:px-4 py-1 sm:py-2 border border-red-500 text-red-400 rounded hover:bg-red-500/10 transition-colors text-xs sm:text-sm"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Credit */}
              <div className="text-center pt-4">
                <p className="text-green-500/70 text-xs font-mono">
                  Created by Lik Ho N!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Glitch overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-t from-transparent via-green-500/5 to-transparent animate-glitch opacity-30"></div>
      </div>
    </div>
  );
};

export default FingerprintScanner;