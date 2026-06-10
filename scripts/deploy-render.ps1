# Despliegue automático a Render via API
# Uso: $env:RENDER_API_KEY="rnd_..."; $env:MONGODB_URI="mongodb+srv://..."; .\scripts\deploy-render.ps1

param(
  [string]$RenderApiKey = $env:RENDER_API_KEY,
  [string]$MongoUri = $env:MONGODB_URI
)

if (-not $RenderApiKey -or -not $MongoUri) {
  Write-Error "Faltan RENDER_API_KEY y/o MONGODB_URI"
  exit 1
}

$headers = @{
  Authorization = "Bearer $RenderApiKey"
  Accept        = "application/json"
  "Content-Type" = "application/json"
}

$owners = Invoke-RestMethod -Uri "https://api.render.com/v1/owners?limit=1" -Headers $headers
$ownerId = $owners[0].owner.id

$body = @{
  type         = "web_service"
  name         = "nexus-store-a390155"
  ownerId      = $ownerId
  repo         = "https://github.com/a390155-gif/Nexus-store"
  branch       = "main"
  rootDir      = "ecommerce/backend"
  buildCommand = "npm install"
  startCommand = "npm start"
  plan         = "free"
  region       = "oregon"
  serviceDetails = @{
    runtime         = "node"
    healthCheckPath = "/api/health"
    envVars         = @(
      @{ key = "NODE_ENV"; value = "production" }
      @{ key = "MONGODB_URI"; value = $MongoUri }
      @{ key = "JWT_SECRET"; generateValue = $true }
    )
  }
} | ConvertTo-Json -Depth 6

try {
  $service = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Method Post -Headers $headers -Body $body
  $url = $service.serviceDetails.url
  Write-Output "Servicio creado: $url"
  Write-Output "Espera 2-5 min y abre $url"
} catch {
  $existing = Invoke-RestMethod -Uri "https://api.render.com/v1/services?limit=20" -Headers $headers
  $match = $existing | Where-Object { $_.service.name -eq "nexus-store-a390155" }
  if ($match) {
    $serviceId = $match[0].service.id
    $envBody = @{ envVars = @(@{ key = "MONGODB_URI"; value = $MongoUri }) } | ConvertTo-Json -Depth 4
    Invoke-RestMethod -Uri "https://api.render.com/v1/services/$serviceId/env-vars" -Method Put -Headers $headers -Body $envBody
    Invoke-RestMethod -Uri "https://api.render.com/v1/services/$serviceId/deploys" -Method Post -Headers $headers -Body "{}"
    Write-Output "Servicio existente actualizado. Revisa: https://dashboard.render.com"
  } else {
    throw $_
  }
}
