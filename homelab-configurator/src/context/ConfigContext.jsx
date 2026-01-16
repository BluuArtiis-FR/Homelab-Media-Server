import { createContext, useState, useMemo, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SERVICE_GROUPS, SERVICE_MANIFEST } from '../services';
import { generateDockerCompose } from '../utils/dockerComposeGenerator.new.js';

const ConfigContext = createContext();

const initialGlobalConfig = {
  DOMAIN: 'example.com', // Valeur par défaut plus pertinente
  ACME_EMAIL: 'votre_email@example.com', // Valeur par défaut
  TZ: 'Europe/Paris',
  PUID: '1000',
  PGID: '1000',
  RESTART_POLICY: 'unless-stopped',
  PROJECT_BASE_DIR: '/opt/homelab',
  // Placeholders for new path management
  CONFIG_PATH: '/opt/homelab/config', // Valeur par défaut
  DATA_PATH: '/opt/homelab/data', // Valeur par défaut
  PROJECT_NAME: 'homelab',
};

const generateRandomString = (length = 32) => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const ConfigProvider = ({ children }) => {
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [configValues, setConfigValues] = useState(initialGlobalConfig);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Dependency resolution ---
  const getRequiredDependencies = (serviceKey, manifest) => {
    let deps = new Set();
    const toCheck = [serviceKey];
    const checked = new Set();
    while (toCheck.length > 0) {
      const currentKey = toCheck.pop();
      if (checked.has(currentKey)) continue;
      checked.add(currentKey);
      if (manifest[currentKey]?.dependencies) {
        for (const depKey of manifest[currentKey].dependencies) {
          if (!deps.has(depKey)) {
            deps.add(depKey);
            toCheck.push(depKey);
          }
        }
      }
    }
    return deps;
  };

  // --- State updaters ---
  const updateSelection = (servicesToUpdate, isChecked) => {
    const newSelected = new Set(selectedServices);
    if (isChecked) {
      servicesToUpdate.forEach(key => {
        newSelected.add(key);
        // Dependencies are now resolved at generation time, but we can still pre-select them for UI feedback
        getRequiredDependencies(key, SERVICE_MANIFEST).forEach(dep => newSelected.add(dep));
      });
    } else {
      servicesToUpdate.forEach(key => {
        newSelected.delete(key);
      });
      // Simplified unselection logic: unselect only the specified service. 
      // Dependencies will be automatically removed at generation time if no other service requires them.
    }
    setSelectedServices(newSelected);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfigValues(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const setRandomValue = (fieldName) => {
    setConfigValues(prev => ({ ...prev, [fieldName]: generateRandomString() }));
  };

  // --- Effects for automatic configuration ---
  useEffect(() => {
    const newValues = {};
    let needsUpdate = false;

    const allServicesInStack = new Set(selectedServices);
    selectedServices.forEach(sKey => {
        getRequiredDependencies(sKey, SERVICE_MANIFEST).forEach(dep => allServicesInStack.add(dep));
    });

    allServicesInStack.forEach(sKey => {
      const service = SERVICE_MANIFEST[sKey];
      if (!service) return;

      // Auto-generate secrets
      if (service.env_vars) {
        service.env_vars.forEach(envVar => {
          if (envVar.type === 'secret' && !configValues[envVar.link_to]) {
            newValues[envVar.link_to] = generateRandomString();
            needsUpdate = true;
          }
        });
      }

      // Set default deployment values for selected (non-internal) services
      if (!service.internal && service.deployment?.expose) {
        const exposeKey = `${sKey}_expose_traefik`;
        if (configValues[exposeKey] === undefined) {
          newValues[exposeKey] = true; // Default to exposed if exposable
          needsUpdate = true;
        }
        const subdomainKey = `${sKey}_custom_subdomain`;
        if (configValues[subdomainKey] === undefined) {
          newValues[subdomainKey] = service.deployment.default_subdomain || sKey;
          needsUpdate = true;
        }
      }
    });

    if (needsUpdate) {
      setConfigValues(prev => ({ ...prev, ...newValues }));
    }
  }, [selectedServices]);


  // --- Package Generation ---
  const generatePackage = async () => {
    if (selectedServices.size === 0) {
        alert("Veuillez sélectionner au moins un service.");
        return;
    }
    if (configValues.DOMAIN && !configValues.ACME_EMAIL) {
      alert("Un email est requis pour le SSL (ACME) lorsque vous spécifiez un domaine.");
      return;
    }

    const zip = new JSZip();
    
    // --- Collect all required secrets ---
    const requiredSecrets = new Set();
    const allServicesToGenerate = new Set(selectedServices);
    selectedServices.forEach(key => {
        getRequiredDependencies(key, SERVICE_MANIFEST).forEach(dep => allServicesToGenerate.add(dep));
    });

    allServicesToGenerate.forEach(serviceKey => {
        const serviceDef = SERVICE_MANIFEST[serviceKey];
        if (serviceDef?.env_vars) {
            serviceDef.env_vars.forEach(env => {
                if(env.type === 'secret' && env.link_to) {
                    requiredSecrets.add(env.link_to);
                }
            });
        }
    });
    
    // --- Generate .env file ---
    let envContent = `# Configuration generated by Homelab Configurator\n`;
    envContent += `# Date: ${new Date().toLocaleString()}\n\n`;
    envContent += `### Global Settings ###\n`;
    envContent += `TZ=${configValues.TZ}\n`;
    envContent += `PUID=${configValues.PUID}\n`;
    envContent += `PGID=${configValues.PGID}\n`;
    envContent += `PROJECT_BASE_DIR=${configValues.PROJECT_BASE_DIR}\n`;
    envContent += `CONFIG_PATH=${configValues.CONFIG_PATH}\n`;
    envContent += `DATA_PATH=${configValues.DATA_PATH}\n`;
    
    if (configValues.DOMAIN) {
      envContent += `DOMAIN=${configValues.DOMAIN}\n`;
    }
    if (configValues.ACME_EMAIL) {
      envContent += `ACME_EMAIL=${configValues.ACME_EMAIL}\n`;
    }

    envContent += `\n### Generated Secrets ###\n`;
    requiredSecrets.forEach(secretKey => {
        envContent += `${secretKey}=${configValues[secretKey] || ''}\n`;
    });

    zip.file('.env', envContent);

    // --- Generate docker-compose.yml ---
    const dockerComposeContent = generateDockerCompose(Array.from(selectedServices), configValues); // Convert Set to Array
    zip.file('docker-compose.yml', dockerComposeContent);

    // --- Add helper scripts ---
    const projectName = configValues.PROJECT_NAME || 'homelab';
    zip.file('start.sh', `#!/bin/bash\necho "Starting ${projectName} stack..."\ndocker compose -p ${projectName} --env-file ./.env up -d\necho "Stack started!"\n`, { unixPermissions: 0o755 });
    zip.file('stop.sh', `#!/bin/bash\necho "Stopping ${projectName} stack..."\ndocker compose -p ${projectName} down\necho "Stack stopped."\n`, { unixPermissions: 0o755 });
    
    // --- Generate and Download ZIP ---
    try {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${projectName}_configuration.zip`);
    } catch (error) {
      console.error("ZIP Error:", error);
      alert("Une erreur est survenue lors de la création de l'archive ZIP.");
    }
  };

  // --- Configuration Management (Save/Load) ---
  const saveConfig = () => {
    const configToSave = {
      selectedServices: Array.from(selectedServices),
      configValues: configValues,
    };
    const blob = new Blob([JSON.stringify(configToSave, null, 2)], { type: 'application/json' });
    saveAs(blob, 'homelab_config.json');
  };

  const loadConfig = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedConfig = JSON.parse(event.target.result);
        if (loadedConfig.selectedServices && loadedConfig.configValues) {
          setSelectedServices(new Set(loadedConfig.selectedServices));
          setConfigValues(loadedConfig.configValues);
          alert("Configuration chargée avec succès !");
        } else {
          alert("Fichier de configuration invalide.");
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la configuration:", error);
        alert("Erreur lors de la lecture du fichier de configuration.");
      }
    };
    reader.readAsText(file);
  };

  // --- Memoized Values for Provider ---
  const servicesByGroup = useMemo(() => {
    const groups = {};
    for (const groupKey in SERVICE_GROUPS) {
      groups[groupKey] = {
        ...SERVICE_GROUPS[groupKey],
        services: []
      };
    }
    for (const serviceKey in SERVICE_MANIFEST) {
      const service = SERVICE_MANIFEST[serviceKey];
      if (!service.internal && groups[service.group]) {
          groups[service.group].services.push({ key: serviceKey, ...service });
      }
    }
    return groups;
  }, []);

  const value = {
    selectedServices,
    configValues,
    servicesByGroup,
    isDarkMode,
    toggleDarkMode,
    updateSelection,
    handleInputChange,
    setRandomValue,
    generatePackage,
    saveConfig,
    loadConfig,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContext;
