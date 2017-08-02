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

# Stores the project folders for the two modframe project types
$fullProjectDir = $ScriptDir + "\projects\ASP.NET Core - Full Framework"
$CoreProjectDir = $ScriptDir + "\projects\ASP.NET Core - NET Core"

# Stores all the folders and items we want to delete before making a zip file template
$itemArray = "bin", "node_modules", "obj", "Properties", "*.user", "wwwroot\components", "wwwroot\lib\*", "*.log"

# Loops over all the items we want to remove from the projects
foreach ($item in $itemArray) 
{
    # Removes the full framework item that we do not require for the template
    $path = $fullProjectDir + "\" + $item
    Remove-Item $path -Recurse -ErrorAction Ignore

    # Removes the core item that we do not require for the template
    $path = $CoreProjectDir + "\" + $item
    Remove-Item $path -Recurse -ErrorAction Ignore
}

$licensePath = $ScriptDir + "\LICENSE"
Copy-Item $licensePath $fullProjectDir
Copy-Item $licensePath $CoreProjectDir

# Removes the old if any and builds the full framework template zip file
$fullOutput = $ScriptDir + "\projects\Installer\ProjectTemplates\ModFrame Full.zip"
Remove-Item $fullOutput -Recurse -ErrorAction Ignore
ZipFiles $fullProjectDir $fullOutput

# Removes the old if any and builds the core template zip file
$coreOutput = $ScriptDir + "\projects\Installer\ProjectTemplates\ModFrame Core.zip"
Remove-Item $coreOutput -Recurse -ErrorAction Ignore
ZipFiles $CoreProjectDir $coreOutput