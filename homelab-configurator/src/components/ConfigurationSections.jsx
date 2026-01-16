import { useConfig } from '../hooks/useConfig';
import { Wand2, KeyRound, HelpCircle } from 'lucide-react';
import { SERVICE_MANIFEST } from '../services';

const ConfigurationSections = () => {
  const { configValues, selectedServices, handleInputChange, setRandomValue, pathMode, togglePathMode, defaultPaths } = useConfig();

  const renderGeneralConfig = () => {
    const commonFields = [
      { key: "DOMAIN", label: "Nom de domaine principal", type: "text", help: "Ex: monhomelab.com. Nécessaire pour l'accès externe et Traefik.", validation: (value) => value === '' || /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) },
      { key: "ACME_EMAIL", label: "Email pour les certificats SSL", type: "email", help: "Email pour l'émission des certificats SSL Let's Encrypt (via Traefik).", validation: (value) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
      { key: "TZ", label: "Fuseau horaire (ex: Europe/Paris)", type: "text", help: "Définissez votre fuseau horaire pour tous les conteneurs." },
      { key: "PUID", label: "User ID (PUID)", type: "text", help: "ID de l'utilisateur qui fera tourner les conteneurs (vérifiez 'id -u' sur votre système)." },
      { key: "PGID", label: "Group ID (PGID)", type: "text", help: "ID du groupe qui fera tourner les conteneurs (vérifiez 'id -g' sur votre système)." }
    ];

    return (
      <>
        {commonFields.map((field) => (
          <div key={field.key}>
            <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <div className="mt-1">
              <input
                type={field.type}
                name={field.key}
                id={field.key}
                className={`block w-full sm:text-sm rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-200 shadow-sm focus:ring-blue-500 focus:border-blue-500
                  ${field.validation && !field.validation(configValues[field.key]) ? 'border-red-500' : ''}`}
                value={configValues[field.key] || ''}
                onChange={handleInputChange}
              />
              {field.validation && !field.validation(configValues[field.key]) && (
                <p className="mt-2 text-sm text-red-600">Format invalide.</p>
              )}
              {field.help && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{field.help}</p>
              )}
            </div>
          </div>
        ))}
        
        <div className="md:col-span-2 border-t pt-4 dark:border-slate-700">
          <div className="flex items-center">
            <input
              id="custom-paths"
              name="custom-paths"
              type="checkbox"
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              checked={pathMode === 'custom'}
              onChange={togglePathMode}
            />
            <label htmlFor="custom-paths" className="ml-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
              Personnaliser les chemins des dossiers
            </label>
          </div>
        </div>

        {pathMode === 'default' ? (
          <div className="md:col-span-2">
            <label htmlFor="PROJECT_BASE_DIR" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dossier de base du projet</label>
            <div className="mt-1">
              <input type="text" name="PROJECT_BASE_DIR" id="PROJECT_BASE_DIR"
                className="block w-full sm:text-sm rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={configValues.PROJECT_BASE_DIR || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        ) : (
          Object.keys(defaultPaths).map(key => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{key}</label>
              <div className="mt-1">
                <input type="text" name={key} id={key}
                  className="block w-full sm:text-sm rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={configValues[key] || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ))
        )}
      </>
    );
  };


  const renderNetworkConfigFields = () => {
    const fieldsToRender = [];
    selectedServices.forEach(sKey => {
      const service = SERVICE_MANIFEST[sKey];
      if (service?.deployment?.expose) {
        fieldsToRender.push(
          <div key={`${sKey}-network-config`} className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 dark:border-slate-700">
            <div className="font-medium text-gray-800 dark:text-gray-200 md:col-span-2">{service.name}</div>
            <div>
              <label htmlFor={`${sKey}_custom_subdomain`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sous-domaine personnalisé
              </label>
              <input
                type="text"
                name={`${sKey}_custom_subdomain`}
                id={`${sKey}_custom_subdomain`}
                className="mt-1 block w-full sm:text-sm rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={configValues[`${sKey}_custom_subdomain`] || ''}
                onChange={handleInputChange}
                placeholder={sKey}
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center h-full">
                <input
                  id={`${sKey}_expose_traefik`}
                  name={`${sKey}_expose_traefik`}
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={configValues[`${sKey}_expose_traefik`] || false}
                  onChange={handleInputChange}
                />
                <label htmlFor={`${sKey}_expose_traefik`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Exposer via Traefik
                </label>
              </div>
            </div>
          </div>
        );
      }
    });
    return fieldsToRender;
  };

  const renderConfigFields = () => {
    const renderedFields = new Set();
    const fieldsToRender = [];

    selectedServices.forEach(sKey => {
      const service = SERVICE_MANIFEST[sKey];
      if (service?.env_vars) {
        service.env_vars.forEach(envVar => {
          const varName = envVar.link_to || envVar.name;
          if (!renderedFields.has(varName)) {
            fieldsToRender.push(
              <div key={varName}>
                <label htmlFor={varName} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {envVar.name}
                  <span className="text-xs text-gray-500 ml-2">
                    ({service.name})
                    {service.doc_url && (
                      <a href={service.doc_url} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-500 hover:text-blue-700 cursor-pointer">
                        <HelpCircle className="inline-block w-4 h-4" />
                      </a>
                    )}
                  </span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  {envVar.generator ? (
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyRound className="h-5 w-5 text-gray-400" />
                     </div>
                  ) : null}
                  <input
                    type={envVar.type === 'password' ? 'password' : 'text'}
                    name={varName}
                    id={varName}
                    className={`block w-full pr-10 sm:text-sm rounded-md ${envVar.generator ? 'pl-10' : 'pl-3'} border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-200 shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    value={configValues[varName] || ''}
                    onChange={handleInputChange}
                    placeholder={envVar.description}
                  />
                  {envVar.generator && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button type="button" onClick={() => setRandomValue(varName)} className="text-gray-500 hover:text-blue-600" title="Générer une valeur aléatoire">
                         <Wand2 className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
                 {envVar.description && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{envVar.description}</p>
                )}
              </div>
            );
            renderedFields.add(varName);
          }
        });
      }
    });
    return fieldsToRender;
  };

  const specificFields = renderConfigFields();
  const networkFields = renderNetworkConfigFields();

  return (
    <section className="mt-8 space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Étape 2: Configuration</h2>
        <p className="text-slate-500 dark:text-slate-400">Ajustez les paramètres globaux et ceux spécifiques aux services que vous avez choisis.</p>
      </div>
      
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-sm">
        <header className="p-4 border-b border-slate-200/80 dark:border-slate-700/80">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-200">Configuration Générale</h3>
        </header>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderGeneralConfig()}
        </div>
      </div>

      {specificFields.length > 0 && (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-sm">
            <header className="p-4 border-b border-slate-200/80 dark:border-slate-700/80">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-200">Configuration Spécifique aux Services</h3>
            </header>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {specificFields}
            </div>
          </div>
      )}

      {networkFields.length > 0 && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-sm">
          <header className="p-4 border-b border-slate-200/80 dark:border-slate-700/80">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-200">Configuration Réseau des Services</h3>
          </header>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {networkFields}
          </div>
        </div>
      )}

    </section>
  );
};

export default ConfigurationSections;
