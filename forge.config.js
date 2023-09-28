const githubTarget =
  process.env.NODE_ENV && process.env.NODE_ENV === 'production'
    ? 'nokori/nokori-desktop'
    : 'nokori/nokori-qa-desktop'

module.exports = {
  packagerConfig: {
    name: 'nokori',
    platform: 'darwin',
    asar: true,
    icon: './electron/icons/nokori-icon',
    osxSign: {
      optionsForFile: (fp) => {
        // Here, we keep it simple and return a single entitlements.plist file.
        // You can use this callback to map different sets of entitlements
        // to specific files in your packaged app.
        return {
          entitlements: './electron/makers/entitlements.plist'
        }
      }
    },
    osxNotarize: {
      teamId: '5Y883P6DH9',
      tool: 'notarytool',
      appleId: 'dev@nokori.com',
      appleIdPassword: 'rgbe-cysv-sbrr-zgus'
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        // background: './assets/dmg-background.png',
        format: 'ULFO',
        icon: './electron/icons/nokori-icon'
      },
      packagerConfig: {
        name: 'nokori',
        platform: 'darwin',
        asar: true,
        icon: './electron/icons/nokori-icon',
        osxSign: {
          optionsForFile: (fp) => {
            // Here, we keep it simple and return a single entitlements.plist file.
            // You can use this callback to map different sets of entitlements
            // to specific files in your packaged app.
            return {
              entitlements: './electron/makers/entitlements.plist'
            }
          }
        },
        osxNotarize: {
          teamId: '5Y883P6DH9',
          tool: 'notarytool',
          appleId: 'dev@nokori.com',
          appleIdPassword: 'rgbe-cysv-sbrr-zgus'
        }
      }
    }
    // {
    //   name: '@electron-forge/maker-zip',
    //   platforms: ['darwin'],
    //   config: {
    //     tagPrefix: 'v',
    //     hardenedRuntime: true,
    //     gatekeeperAssess: false
    //   }
    // }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'nokori',
          name: 'nokori-desktop'
        },
        authToken: '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',
        prerelease: true
        // tagPrefix: ''
      }
    }
  ]
}
