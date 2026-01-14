import React, { createContext, useState, useMemo, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SERVICE_MANIFEST } from '../services';

const ConfigContext = createContext();

const initialGlobalConfig = {
  DOMAIN: '',
  ACME_EMAIL: '',
  TZ: 'Europe/Paris',
  PUID: '1000',
  PGID: '1000',
  RESTART_POLICY: 'unless-stopped',
  PROJECT_BASE_DIR: '/opt/homelab',
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

  const defaultPaths = useMemo(() => {
    const baseDir = configValues.PROJECT_BASE_DIR || initialGlobalConfig.PROJECT_BASE_DIR;
    return {
      CONFIG_PATH: `${baseDir}/config`,
      DATA_PATH: `${baseDir}/data`,
      DOWNLOADS_PATH: `${baseDir}/downloads`,
      MEDIA_PATH: `${baseDir}/media`,
      UPLOAD_PATH: `${baseDir}/uploads`,
    };
  }, [configValues.PROJECT_BASE_DIR]);

  useEffect(() => {
    setConfigValues(prev => ({
      ...prev,
      ...defaultPaths
    }));
  }, [defaultPaths]);

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

  const updateSelection = (servicesToUpdate, isChecked) => {
    const newSelected = new Set(selectedServices);
    if (isChecked) {
      servicesToUpdate.forEach(key => {
        newSelected.add(key);
        getRequiredDependencies(key, SERVICE_MANIFEST).forEach(dep => newSelected.add(dep));
      });
    } else {
      const allDepsToKeep = new Set();
      newSelected.forEach(key => {
        if (!servicesToUpdate.has(key)) {
          getRequiredDependencies(key, SERVICE_MANIFEST).forEach(dep => allDepsToKeep.add(dep));
        }
      });
      servicesToUpdate.forEach(key => {
        newSelected.delete(key);
        const depsOfKey = getRequiredDependencies(key, SERVICE_MANIFEST);
        depsOfKey.forEach(depKey => {
          if (!allDepsToKeep.has(depKey)) {
            newSelected.delete(depKey);
          }
        });
      });
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

  useEffect(() => {
    const newValues = {};
    let needsUpdate = false;
    selectedServices.forEach(sKey => {
      const service = SERVICE_MANIFEST[sKey];
      if (service?.env_vars) {
        service.env_vars.forEach(envVar => {
          const varName = envVar.link_to || envVar.name;
          if (envVar.generator && !configValues[varName]) {
            newValues[varName] = generateRandomString();
            needsUpdate = true;
          }
        });
      }
      if (service?.expose) {
        const exposeKey = `${sKey}_expose_traefik`;
        if (configValues[exposeKey] === undefined) {
          newValues[exposeKey] = service.expose_traefik !== undefined ? service.expose_traefik : true;
          needsUpdate = true;
        }
        const subdomainKey = `${sKey}_custom_subdomain`;
        if (configValues[subdomainKey] === undefined) {
          newValues[subdomainKey] = service.custom_subdomain || '';
          needsUpdate = true;
        }
      }
    });

    const currentConfigKeys = Object.keys(configValues);
    for(const key of currentConfigKeys) {
        if (key.endsWith('_expose_traefik') || key.endsWith('_custom_subdomain')) {
            const sKey = key.split('_')[0];
            if (!selectedServices.has(sKey)) {
                delete configValues[key];
                needsUpdate = true;
            }
        }
    }

    if (needsUpdate) {
      setConfigValues(prev => ({ ...prev, ...newValues }));
    }
  }, [selectedServices]);

  const generateDockerComposeContent = (selectedServices, configValues) => {
    let dockerComposeContent = `version: '3.8'\n\nservices:\n`;
    let servicesBlock = '';
    let volumesBlock = '';
    let networksBlock = '';

    const requiredNetworks = new Set();
    const requiredVolumes = new Set();

    const baseNetworkName = configValues.PROJECT_BASE_DIR.replace(/\//g, '_').replace(/^_/, '') + '_network';
    requiredNetworks.add(baseNetworkName);

    // Check if Traefik is needed (if domain and email are provided for ACME)
    const useTraefik = configValues.DOMAIN && configValues.ACME_EMAIL;
    if (useTraefik) {
      servicesBlock += `  traefik:\n`;
      servicesBlock += `    image: traefik:v2.10\n`; // Using a stable Traefik v2 image
      servicesBlock += `    container_name: traefik\n`;
      servicesBlock += `    restart: unless-stopped\n`;
      servicesBlock += `    command:\n`;
      servicesBlock += `      - --providers.docker.network=${baseNetworkName}\n`;
      servicesBlock += `      - --log.level=INFO\n`;
      servicesBlock += `      - --api.dashboard=true\n`;
      servicesBlock += `      - --providers.docker=true\n`;
      servicesBlock += `      - --providers.docker.exposedbydefault=false\n`;
      servicesBlock += `      - --entrypoints.web.address=:80\n`;
      servicesBlock += `      - --entrypoints.websecure.address=:443\n`;
      servicesBlock += `      - --entrypoints.web.http.redirections.entrypoint.to=websecure\n`;
      servicesBlock += `      - --entrypoints.web.http.redirections.entrypoint.scheme=https\n`;
      servicesBlock += `      - --certificatesresolvers.myresolver.acme.email=${configValues.ACME_EMAIL}\n`;
      servicesBlock += `      - --certificatesresolvers.myresolver.acme.storage=/etc/traefik/acme.json\n`;
      servicesBlock += `      - --certificatesresolvers.myresolver.acme.httpchallenge=true\n`;
      servicesBlock += `      - --certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web\n`;
      servicesBlock += `    ports:\n`;
      servicesBlock += `      - "80:80"\n`;
      servicesBlock += `      - "443:443"\n`;
      servicesBlock += `      - "8080:8080" # Traefik dashboard\n`;
      servicesBlock += `    volumes:\n`;
      servicesBlock += `      - /var/run/docker.sock:/var/run/docker.sock:ro\n`;
      servicesBlock += `      - ${configValues.PROJECT_BASE_DIR}/acme.json:/etc/traefik/acme.json\n`; // Persistent ACME storage
      servicesBlock += `    networks:\n      - ${baseNetworkName}\n\n`;

      requiredVolumes.add('acme.json'); // This will be created as an empty file later
    }


    // Build services block for selected services
    selectedServices.forEach(sKey => {
      const serviceDef = SERVICE_MANIFEST[sKey];
      if (serviceDef) {
        servicesBlock += `  ${sKey}:\n`;
        servicesBlock += `    image: ${serviceDef.image || sKey}:latest\n`; // Assuming image name matches service key for now
        servicesBlock += `    container_name: ${sKey}\n`;
        servicesBlock += `    restart: unless-stopped\n`;

        // Add networks
        servicesBlock += `    networks:\n      - ${baseNetworkName}\n`;

        // Add environment variables
        if (serviceDef.env_vars && serviceDef.env_vars.length > 0) {
          servicesBlock += `    environment:\n`;
          serviceDef.env_vars.forEach(envVar => {
            const varName = envVar.link_to || envVar.name;
            const value = configValues[varName] || '';
            servicesBlock += `      - ${varName}=${value}\n`;
          });
        }

        // Add Traefik labels if Traefik is used and service is exposed via Traefik
        if (useTraefik && serviceDef.expose && configValues[`${sKey}_expose_traefik`]) {
          const subdomain = configValues[`${sKey}_custom_subdomain`] || sKey;
          const serviceDomain = `${subdomain}.${configValues.DOMAIN}`;
          servicesBlock += `    labels:\n`;
          servicesBlock += `      - "traefik.enable=true"\n`;
          servicesBlock += `      - "traefik.http.routers.${sKey}.rule=Host(\`${serviceDomain}\`)"\n`;
          servicesBlock += `      - "traefik.http.routers.${sKey}.entrypoints=websecure"\n`;
          servicesBlock += `      - "traefik.http.routers.${sKey}.service=${sKey}-service"\n`;
          servicesBlock += `      - "traefik.http.routers.${sKey}.tls=true"\n`;
          servicesBlock += `      - "traefik.http.routers.${sKey}.tls.certresolver=myresolver"\n`;
          servicesBlock += `      - "traefik.http.services.${sKey}-service.loadbalancer.server.port=${serviceDef.port || 80}"\n`; // Assuming port 80 if not specified
        }

        // Add volumes (placeholder for now, will refine later)
        const serviceConfigPath = `${configValues.PROJECT_BASE_DIR}/config/${sKey}`;
        const serviceDataPath = `${configValues.PROJECT_BASE_DIR}/data/${sKey}`;
        servicesBlock += `    volumes:\n`;
        servicesBlock += `      - ${serviceConfigPath}:/config\n`; // Placeholder: map to a generic /config
        servicesBlock += `      - ${serviceDataPath}:/data\n`; // Placeholder: map to a generic /data

      }
    });

    dockerComposeContent += servicesBlock;
    
    // Add networks definition
    networksBlock = `\nnetworks:\n`;
    requiredNetworks.forEach(net => {
      networksBlock += `  ${net}:\n    driver: bridge\n`;
    });
    dockerComposeContent += networksBlock;

    // Add volumes definition (for named volumes)
    if (requiredVolumes.size > 0) {
      volumesBlock = `\nvolumes:\n`;
      requiredVolumes.forEach(vol => {
        volumesBlock += `  ${vol}:\n    driver: local\n`;
      });
      dockerComposeContent += volumesBlock;
    }

    return dockerComposeContent;
  };

  const generateTraefikYamlContent = (configValues) => {
    return `api:
  dashboard: true
  insecure: true

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: "websecure"
          scheme: "https"
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
  file:
    directory: "/etc/traefik/dynamic/"
    watch: true

certificatesResolvers:
  myresolver:
    acme:
      email: "${configValues.ACME_EMAIL}"
      storage: "/etc/traefik/acme.json"
      httpChallenge:
        entryPoint: "web"
`;
  };



  const generatePackage = async () => {
    if (!configValues.DOMAIN || !configValues.ACME_EMAIL) {
      alert("Veuillez remplir le nom de domaine et l'email (Configuration Générale).");
      return;
    }
    const zip = new JSZip();
    const finalProfiles = Array.from(selectedServices).join(',');
    let envContent = "# Configuration generated by HomeLab Configurator\n";
    envContent += "# Date: " + new Date().toLocaleString() + "\n\n";
    envContent += `COMPOSE_PROFILES=${finalProfiles}\n\n`;
    for (const key in configValues) {
      if (!key.endsWith('_PATH') && key !== 'PROJECT_BASE_DIR') {
        envContent += `${key}=${configValues[key]}\n`;
      }
    }
    envContent += `\n# --- Paths ---\n`;
    for (const pathKey of Object.keys(defaultPaths)) {
      envContent += `${pathKey}=${configValues[pathKey] || defaultPaths[pathKey]}\n`;
    }
    zip.file('.env', envContent);
    zip.file('start.sh', "#!/bin/bash\necho \"Starting HomeLab Media Server...\"\ndocker compose -p homedia --env-file ./.env up -d\necho \"Stack started!\"\n", { unixPermissions: 0o755 });
    zip.file('start.bat', "@echo off\necho \"Starting HomeLab Media Server...\"\ndocker compose -p homedia --env-file ./.env up -d\npause\n");
    const readmeContent = `...`; // Full README content here
    const dockerComposeContent = generateDockerComposeContent(selectedServices, configValues);
    zip.file('docker-compose.yml', dockerComposeContent);

    // Generate Traefik static config and acme.json if Traefik is used
    if (configValues.DOMAIN && configValues.ACME_EMAIL) {
      const traefikYamlContent = generateTraefikYamlContent(configValues);
      zip.file('traefik.yml', traefikYamlContent);
      zip.file('acme.json', ''); // Empty file for ACME storage
    }

    zip.file('README.txt', readmeContent);
    try {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'configuration.zip');
    } catch (error) {
      console.error("ZIP Error:", error);
    }
  };

  const value = {
    selectedServices,
    configValues,
    servicesByGroup: useMemo(() => {
        const groups = {};
        for (const serviceKey in SERVICE_MANIFEST) {
          const service = SERVICE_MANIFEST[serviceKey];
          if (!service.internal) {
              if (!groups[service.group]) {
                  groups[service.group] = [];
              }
              groups[service.group].push({ key: serviceKey, ...service });
          }
        }
        return groups;
      }, []),
    updateSelection,
    handleInputChange,
    setRandomValue,
    generatePackage
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContext;
