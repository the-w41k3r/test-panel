import React from 'react';

/* blueprint/import *//* MinecraftpluginmanagerImportStart */import MinecraftpluginmanagerTuudlbijau from '@/blueprint/extensions/minecraftpluginmanager/MinecraftPluginContainer';/* MinecraftpluginmanagerImportEnd *//* McmodsImportStart */import McmodsGfizdddoaq from '@/blueprint/extensions/mcmods/ModsManagerContainer';/* McmodsImportEnd *//* ModpackinstallerImportStart */import ModpackinstallerJrkoxifcip from '@/blueprint/extensions/modpackinstaller/ModpackContainer';/* ModpackinstallerImportEnd *//* VersionchangerImportStart */import VersionchangerWyqkycmnvj from '@/blueprint/extensions/versionchanger/VersionChangerContainer';/* VersionchangerImportEnd */

interface RouteDefinition {
  path: string;
  name: string | undefined;
  component: React.ComponentType;
  exact?: boolean;
  adminOnly: boolean | false;
  identifier: string;
}
interface ServerRouteDefinition extends RouteDefinition {
  permission: string | string[] | null;
}
interface Routes {
  account: RouteDefinition[];
  server: ServerRouteDefinition[];
}

export default {
  account: [
    /* routes/account *//* MinecraftpluginmanagerAccountRouteStart *//* MinecraftpluginmanagerAccountRouteEnd *//* McmodsAccountRouteStart *//* McmodsAccountRouteEnd *//* ModpackinstallerAccountRouteStart *//* ModpackinstallerAccountRouteEnd *//* VersionchangerAccountRouteStart *//* VersionchangerAccountRouteEnd */
  ],
  server: [
    /* routes/server *//* MinecraftpluginmanagerServerRouteStart */{ path: '/minecraft-plugins', permission: null, name: 'Plugins', component: MinecraftpluginmanagerTuudlbijau, adminOnly: false, identifier: 'minecraftpluginmanager' },/* MinecraftpluginmanagerServerRouteEnd *//* McmodsServerRouteStart */{ path: '/mcmods', permission: null, name: 'Mods Installer', component: McmodsGfizdddoaq, adminOnly: false, identifier: 'mcmods' },/* McmodsServerRouteEnd *//* ModpackinstallerServerRouteStart */{ path: '/modpacks', permission: null, name: 'Modpacks', component: ModpackinstallerJrkoxifcip, adminOnly: false, identifier: 'modpackinstaller' },/* ModpackinstallerServerRouteEnd *//* VersionchangerServerRouteStart */{ path: '/versions', permission: 'file.read-content', name: 'Version Changer', component: VersionchangerWyqkycmnvj, adminOnly: false, identifier: 'versionchanger' },/* VersionchangerServerRouteEnd */
  ],
} as Routes;
