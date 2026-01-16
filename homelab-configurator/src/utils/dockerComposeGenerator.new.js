// homelab-configurator/src/utils/dockerComposeGenerator.new.js
import YAML from 'js-yaml';
import { SERVICE_MANIFEST } from '../services';

export const generateDockerCompose = (selectedServiceKeys, globalConfig) => {
  const compose = {
    version: '3.8',
    services: {},
    volumes: {},
    networks: {},
  };

  const projectBaseDir = globalConfig.PROJECT_BASE_DIR || '/opt/homelab';
  const configPath = globalConfig.CONFIG_PATH || `${projectBaseDir}/config`;
  const dataPath = globalConfig.DATA_PATH || `${projectBaseDir}/data`;
  const puid = globalConfig.PUID || '1000';
  const pgid = globalConfig.PGID || '1000';
  const timezone = globalConfig.TZ || 'Europe/Paris';
  const projectName = globalConfig.PROJECT_NAME || 'homelab';

  // Determine the base network name
  const baseNetworkName = `${projectName}_network`;
  compose.networks[baseNetworkName] = { driver: 'bridge' };

  const useTraefik = globalConfig.DOMAIN && globalConfig.ACME_EMAIL;
  if (useTraefik) {
    compose.services.traefik = {
      image: 'traefik:v2.10',
      container_name: 'traefik',
      restart: globalConfig.RESTART_POLICY || 'unless-stopped',
      command: [
        `--providers.docker.network=${baseNetworkName}`,
        '--log.level=INFO',
        '--api.dashboard=true',
        '--providers.docker=true',
        '--providers.docker.exposedbydefault=false',
        '--entrypoints.web.address=:80',
        '--entrypoints.websecure.address=:443',
        '--entrypoints.web.http.redirections.entrypoint.to=websecure',
        '--entrypoints.web.http.redirections.entrypoint.scheme=https',
        `--certificatesresolvers.myresolver.acme.email=${globalConfig.ACME_EMAIL}`,
        '--certificatesresolvers.myresolver.acme.storage=/etc/traefik/acme.json',
        '--certificatesresolvers.myresolver.acme.httpchallenge=true',
        '--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web',
      ],
      ports: ['80:80', '443:443', '8080:8080'],
      volumes: [
        '/var/run/docker.sock:/var/run/docker.sock:ro',
        `${configPath}/traefik/acme.json:/etc/traefik/acme.json`, // Use global CONFIG_PATH
      ],
      networks: [baseNetworkName],
    };
    compose.volumes[`${projectName}_acme_json`] = {
      name: `${projectName}_acme_json`,
      driver: 'local',
      // This refers to the external volume, Traefik uses its mount point
      // in its own config to know where to store the file
    };
  }

  // Set to keep track of all services to be included, including dependencies
  const servicesToGenerate = new Set();
  const addServiceAndDependencies = (serviceKey) => {
    if (!SERVICE_MANIFEST[serviceKey]) {
      console.warn(`Service manifest missing for: ${serviceKey}`);
      return;
    }
    if (servicesToGenerate.has(serviceKey)) return; // Already processed

    servicesToGenerate.add(serviceKey);
    if (SERVICE_MANIFEST[serviceKey].dependencies) {
      SERVICE_MANIFEST[serviceKey].dependencies.forEach(depKey => {
        addServiceAndDependencies(depKey);
      });
    }
  };

  selectedServiceKeys.forEach(key => addServiceAndDependencies(key));

  // Sort services to ensure dependencies are handled if order matters (docker-compose handles this, but for readability)
  const sortedServiceKeys = Array.from(servicesToGenerate).sort((a, b) => {
    const aDeps = SERVICE_MANIFEST[a]?.dependencies || [];
    const bDeps = SERVICE_MANIFEST[b]?.dependencies || [];
    if (aDeps.includes(b)) return 1; // b depends on a, so a should come before b
    if (bDeps.includes(a)) return -1; // a depends on b, so b should come before a
    return 0;
  });

  sortedServiceKeys.forEach(serviceKey => {
    const serviceDef = SERVICE_MANIFEST[serviceKey];
    // If it's a selected service or an internal dependency, process it
    // Internal services are only added if they are a dependency of a selected service
    if (!serviceDef || (serviceDef.internal && !Array.from(selectedServiceKeys).some(s => SERVICE_MANIFEST[s].dependencies?.includes(serviceKey)))) {
        return; // Skip if internal and not a dependency of a selected service
    }

    const serviceName = serviceKey;
    const serviceConfig = {
      image: `${serviceDef.image.name}:${serviceDef.image.tag}`,
      container_name: serviceName,
      restart: serviceDef.restart || globalConfig.RESTART_POLICY || 'unless-stopped',
      networks: serviceDef.networks || [baseNetworkName],
    };

    // Environment variables
    if (serviceDef.env_vars) {
      serviceConfig.environment = {};
      serviceDef.env_vars.forEach(envVar => {
        let value = envVar.value;
        if (envVar.type === 'secret') {
          value = `\${${envVar.link_to || envVar.name}}`; // Use shell variable for secrets
        } else if (envVar.value) {
          // Replace placeholders like PUID, PGID, Paths, Timezone
          value = value
            .replace('{PUID}', puid)
            .replace('{PGID}', pgid)
            .replace('{CONFIG_PATH}', configPath)
            .replace('{DATA_PATH}', dataPath)
            .replace('{TIMEZONE}', timezone);
        }
        
        // Check conditions for env vars
        if (envVar.condition) {
          try {
            // This is a simple condition check, can be expanded
            if (!envVar.condition(globalConfig)) { // Assuming globalConfig has what's needed
              return; // Skip this env var if condition is false
            }
          } catch (e) {
            console.warn(`Condition evaluation failed for ${serviceName} env var ${envVar.name}:`, e);
          }
        }
        
        if (value !== undefined) {
          serviceConfig.environment[envVar.name] = value;
        }
      });
    }

    // Ports
    if (serviceDef.ports) {
      serviceConfig.ports = serviceDef.ports.map(p => {
        let portMapping = `${p.host}:${p.container}`;
        if (p.protocol) portMapping += `/${p.protocol}`;
        return portMapping;
      });
    }

    // Volumes
    if (serviceDef.volumes) {
      serviceConfig.volumes = serviceDef.volumes.map(v => {
        // Replace placeholders
        let hostPath = v.host_path
          .replace('{CONFIG_PATH}', configPath)
          .replace('{DATA_PATH}', dataPath)
          .replace('{PUID}', puid)
          .replace('{PGID}', pgid);
        
        let volumeMapping = `${hostPath}:${v.container_path}`;
        if (v.read_only) volumeMapping += ':ro';
        return volumeMapping;
      });
    }

    // Other Docker specific options
    if (serviceDef.network_mode) {
      serviceConfig.network_mode = serviceDef.network_mode;
      delete serviceConfig.networks; // network_mode overrides networks
    }
    if (serviceDef.cap_add) serviceConfig.cap_add = serviceDef.cap_add;

    // Traefik Labels
    if (useTraefik && serviceDef.deployment?.expose) {
      const subdomain = globalConfig[`${serviceName}_custom_subdomain`] || serviceDef.deployment.default_subdomain || serviceName;
      const serviceDomain = `${subdomain}.${globalConfig.DOMAIN}`;
      const exposePort = serviceDef.deployment.expose_port || serviceDef.ports?.[0]?.container || 80;

      serviceConfig.labels = {
        'traefik.enable': 'true',
        [`traefik.http.routers.${serviceName}.rule`]: `Host('${serviceDomain}')`,
        [`traefik.http.routers.${serviceName}.entrypoints`]: 'websecure',
        [`traefik.http.routers.${serviceName}.tls.certresolver`]: 'myresolver',
        [`traefik.http.services.${serviceName}-service.loadbalancer.server.port`]: String(exposePort),
      };
    }

    compose.services[serviceName] = serviceConfig;
  });

  return YAML.dump(compose, { indent: 2 });
};