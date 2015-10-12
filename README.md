# Particle Dev Profiles package

Package providing support for Particle CLI profiles and basic Particle Cloud authentication.

## Usage

This package provides [a service]() which other packages can consume:

`package.json`
```json
"consumedServices": {
  "particle-dev-profiles": {
    "versions": {
      "^0.0.1": "consumeProfiles"
    }
  }
}
```

`main.coffee`
```coffeescript
consumeProfiles: (@profileManager) ->
	console.log @profileManager.currentProfile
```

## API reference

When consuming console panel you'll get instance of `ConsoleManager` which has following methods/properties:

### Profiles
###### profiles
Holds an `array` of profiles.

###### currentProfile
Holds a `string` of current profile. Assigning new value will set it as current profile.

### Getting/setting keys
###### get(key)
Returns `key` value stored in current profile.

###### set(key, value)
Sets `key` to `value` in current profile.

###### getLocal(key)
Returns `key` value stored in current session (opened window).

###### setLocal(key, value)
Sets `key` to `value` in current session (opened window).

###### apiUrl
Holds Particle API endpoint URL for current profile.

### Current selected device
###### setCurrentDevice(id, name)
###### clearCurrentDevice()
###### hasCurrentDevice

### Current selected target platform
###### currentTargetPlatform
###### currentTargetPlatformName
###### knownTargetPlatforms
Holds `object` of known platforms.

### Events
###### on(event, callback)
###### onCurrentTargetPlatformChanged(callback)
