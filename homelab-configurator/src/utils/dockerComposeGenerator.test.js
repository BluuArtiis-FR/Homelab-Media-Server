// dockerComposeGenerator.test.js
import { describe, it, expect } from 'vitest';
import { generateDockerComposeContent } from './dockerComposeGenerator';
import { SERVICE_MANIFEST } from '../services';

// Mock SERVICE_MANIFEST for consistent testing
const mockServiceManifest = {
  ...SERVICE_MANIFEST,
  jellyfin: {
    ...SERVICE_MANIFEST.jellyfin,
    image: 'lscr.io/linuxserver/jellyfin:latest',
    expose: true,
    port: 8096,
  },
  qbittorrent: {
    ...SERVICE_MANIFEST.qbittorrent,
    image: 'lscr.io/linuxserver/qbittorrent:latest',
    dependencies: [], // Simplify for this test
  },
};

describe('generateDockerComposeContent', () => {
  it('should generate an empty services block if no services are selected', () => {
    const selectedServices = new Set();
    const configValues = { PROJECT_BASE_DIR: '/test' };
    const result = generateDockerComposeContent(selectedServices, configValues, mockServiceManifest);
    
    // Should only contain version, services, and network definition
    expect(result).toContain("version: '3.8'");
    expect(result).toContain('services:');
    expect(result).toContain('networks:');
    expect(result).not.toContain('jellyfin:');
  });

  it('should generate a docker-compose file with selected services', () => {
    const selectedServices = new Set(['jellyfin', 'qbittorrent']);
    const configValues = { PROJECT_BASE_DIR: '/test' };
    const result = generateDockerComposeContent(selectedServices, configValues, mockServiceManifest);

    // Check for service names
    expect(result).toContain('jellyfin:');
    expect(result).toContain('qbittorrent:');

    // Check for image names
    expect(result).toContain('image: lscr.io/linuxserver/jellyfin:latest');
    expect(result).toContain('image: lscr.io/linuxserver/qbittorrent:latest');
  });

  it('should include Traefik and labels when domain is provided', () => {
    const selectedServices = new Set(['jellyfin']);
    const configValues = {
      PROJECT_BASE_DIR: '/test',
      DOMAIN: 'example.com',
      ACME_EMAIL: 'test@example.com',
      jellyfin_expose_traefik: true,
    };
    const result = generateDockerComposeContent(selectedServices, configValues, mockServiceManifest);

    // Check for Traefik service
    expect(result).toContain('traefik:');
    expect(result).toContain('image: traefik:v2.10');

    // Check for Jellyfin service with Traefik labels
    expect(result).toContain('jellyfin:');
    expect(result).toContain('traefik.enable=true');
    expect(result).toContain('rule=Host(`jellyfin.example.com`)');
    expect(result).toContain('loadbalancer.server.port=8096');
  });

  it('should not include Traefik if domain is missing', () => {
    const selectedServices = new Set(['jellyfin']);
    const configValues = { PROJECT_BASE_DIR: '/test' };
    const result = generateDockerComposeContent(selectedServices, configValues, mockServiceManifest);

    // Should NOT contain Traefik
    expect(result).not.toContain('traefik:');

    // Jellyfin should exist but without labels
    expect(result).toContain('jellyfin:');
    expect(result).not.toContain('traefik.enable=true');
  });
});
