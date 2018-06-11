# Adds the .NET compression library as we are using it
Add-Type -Assembly System.IO.Compression.FileSystem

# This function zips up a source directory to the output path supplied
function ZipFiles( $sourcedir, $fullZipPath )
{
   $compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
   [System.IO.Compression.ZipFile]::CreateFromDirectory($sourcedir, $fullZipPath, $compressionLevel, $false)
}

# Gets the current scripts full path location
$ScriptDir = Split-Path -parent $MyInvocation.MyCommand.Path

# Adds the vstemplate generation functions
. "$ScriptDir\generate-vstemplate.ps1"

$temp = "$ScriptDir\temp";

# Stores the project folders for the two modframe project types
$fullProjectDir = "$ScriptDir\projects\ASP.NET Core 2.1 - Full Framework"
$CoreProjectDir = "$ScriptDir\projects\ASP.NET Core 2.1 - NET Core"

# Stores the temp project locations
$tempfullProjectDir = "$temp\ASP.NET Core 2.1 - Full Framework"
$tempCoreProjectDir = "$temp\ASP.NET Core 2.1 - NET Core"

# Copies the project to the temp location so we can manipulate it without consequence
Copy-Item -Path $fullProjectDir -Recurse -Destination $tempfullProjectDir -Container
Copy-Item -Path $CoreProjectDir -Recurse -Destination $tempCoreProjectDir -Container

# Stores all the folders and items we want to delete before making a zip file template
$itemArray = "bin", "node_modules", "obj", "Properties", "*.user", "wwwroot\lib\*", "wwwroot\files", "*.log"

# Loops over all the items we want to remove from the projects
foreach ($item in $itemArray) 
{
    # Removes the full framework item that we do not require for the template
    $path = "$tempfullProjectDir\$item"
    Remove-Item $path -Recurse -ErrorAction Ignore

    # Removes the core item that we do not require for the template
    $path = "$tempCoreProjectDir\$item"
    Remove-Item $path -Recurse -ErrorAction Ignore
}

$licensePath = "$ScriptDir\LICENSE"
Copy-Item $licensePath "$tempfullProjectDir\ModFrame"
Copy-Item $licensePath "$tempCoreProjectDir\ModFrame"

# Sets up the file exclusion lists
[string[]]$exclude = "MyTemplate.vstemplate", "ASP.NET Core 2.1 - Full Framework.csproj", "ASP.NET Core 2.1 - NET Core.csproj", "__TemplateIcon.png"

# Generates the new .vstemplate file for .NET Full Framework version
$nameFull = "ModFrame ASP.NET Core 2.1 (Full Framework)"
$defaultNameFull = "ModFrame"
$targetFull = "ASP.NET Core 2.1 - Full Framework.csproj"
$outputPathFull = "$tempfullProjectDir\MyTemplate.vstemplate"
GenerateVSTemplate   $nameFull $nameFull $defaultNameFull $targetFull $exclude $tempfullProjectDir $outputPathFull

# Generates the new .vstemplate file for .NET Core version
$nameCore = "ModFrame ASP.NET Core 2.1 (.NET Core)"
$defaultNameCore = "ModFrame"
$targetCore = "ASP.NET Core 2.1 - NET Core.csproj"
$outputPathCore = "$tempCoreProjectDir\MyTemplate.vstemplate"
GenerateVSTemplate   $nameCore $nameCore $defaultNameCore $targetCore $exclude $tempCoreProjectDir $outputPathCore

# Removes the old if any and builds the full framework template zip file
$fullOutput = "$ScriptDir\projects\Installer\ProjectTemplates\ModFrame Full.zip"
Remove-Item $fullOutput -Recurse -ErrorAction Ignore
ZipFiles $tempfullProjectDir $fullOutput

# Removes the temp version
Remove-Item $tempfullProjectDir -Recurse -ErrorAction Ignore

# Removes the old if any and builds the core template zip file
$coreOutput = "$ScriptDir\projects\Installer\ProjectTemplates\ModFrame Core.zip"
Remove-Item $coreOutput -Recurse -ErrorAction Ignore
ZipFiles $tempCoreProjectDir $coreOutput

# Removes the temp version
Remove-Item $tempCoreProjectDir -Recurse -ErrorAction Ignore