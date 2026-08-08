targetScope = 'subscription'

@description('Location for the Daily resource group.')
param location string = 'denmarkeast'

@description('Name of the Daily resource group.')
param resourceGroupName string = 'rg-daily'

resource dailyResourceGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
  tags: {
    application: 'daily'
    managedBy: 'bicep'
    scope: 'personal'
  }
}

output resourceGroupId string = dailyResourceGroup.id
