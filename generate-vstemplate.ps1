# This function recursively loops over a given path to generate all the xml structure for the files and folders within the path supplied
function GetFiles($xmlWriter, $path, [string[]]$exclude) 
{
    foreach ($item in Get-ChildItem $path)
    {
        if ($exclude | Where {$item -like $_}) 
		{ 
			continue 
		}
		
        if (Test-Path $item.FullName -PathType Container) 
        {
			$xmlWriter.WriteStartElement('Folder')
			$xmlWriter.WriteAttributeString("Name", $item.Name)
			$xmlWriter.WriteAttributeString("TargetFolderName", $item.Name)
			
            GetFiles $xmlWriter $item.FullName $exclude
			
			$xmlWriter.WriteEndElement()
        } 
        else 
        { 
			$xmlWriter.WriteStartElement('ProjectItem')
				$xmlWriter.WriteAttributeString("ReplaceParameters", 'true')
				$xmlWriter.WriteAttributeString("TargetFileName", $item.Name)
				$xmlWriter.WriteString($item.Name)
			$xmlWriter.WriteEndElement()
        }
    } 
}

# This is the core vstemplate generator function which uses the parameters supplied to generate a clean .vstemplate file
function GenerateVSTemplate($name, $description, $defaultName, $target, $exclude, $generationPath, $outputPath)
{
	# Sets the xml writer up
	$xmlWriter = New-Object System.XMl.XmlTextWriter($outputPath,$Null)
    $xmlWriter.Formatting = 'Indented'
    $xmlWriter.Indentation = 1
    $XmlWriter.IndentChar = "`t"

	# Generates the heading section of the template file
	$xmlWriter.WriteStartElement('VSTemplate')
	$xmlWriter.WriteAttributeString("Version", "3.0.0") 
	$xmlWriter.WriteAttributeString("xmlns", "http://schemas.microsoft.com/developer/vstemplate/2005")
	$xmlWriter.WriteAttributeString("Type", "Project")

		# Generates the TemplateData section	
		$xmlWriter.WriteStartElement('TemplateData')
			$xmlWriter.WriteStartElement('CreateInPlace')
				$xmlWriter.WriteString("true")
			$xmlWriter.WriteEndElement()
			
			$xmlWriter.WriteStartElement('RequiredFrameworkVersion')
				$xmlWriter.WriteString("4.5")
			$xmlWriter.WriteEndElement()
			
			$xmlWriter.WriteStartElement('Name')
				$xmlWriter.WriteString($name)
			$xmlWriter.WriteEndElement()
			
			$xmlWriter.WriteStartElement('Description')
				$xmlWriter.WriteString($description)
			$xmlWriter.WriteEndElement()
			
			$xmlWriter.WriteStartElement('ProjectType')
				$xmlWriter.WriteString("CSharp")
			$xmlWriter.WriteEndElement()
			
			$xmlWriter.WriteStartElement('ProjectSubType')
			$xmlWriter.WriteEndElement()
			
			$xmlWriter.WriteStartElement('SortOrder')
				$xmlWriter.WriteString("1000")
			$xmlWriter.WriteEndElement()
			
			$xmlWriter.WriteStartElement('CreateNewFolder')
				$xmlWriter.WriteString("true")
			$xmlWriter.WriteEndElement()
			
			$xmlWriter.WriteStartElement('DefaultName')
				$xmlWriter.WriteString($defaultName)
			$xmlWriter.WriteEndElement()
			
			$xmlWriter.WriteStartElement('ProvideDefaultName')
				$xmlWriter.WriteString("true")
			$xmlWriter.WriteEndElement()
			
			$xmlWriter.WriteStartElement('LocationField')
				$xmlWriter.WriteString("Enabled")
			$xmlWriter.WriteEndElement()
			
			$xmlWriter.WriteStartElement('EnableLocationBrowseButton')
				$xmlWriter.WriteString("true")
			$xmlWriter.WriteEndElement()
			
			$xmlWriter.WriteStartElement('Icon')
				$xmlWriter.WriteString("__TemplateIcon.png")
			$xmlWriter.WriteEndElement()
		$xmlWriter.WriteEndElement()
		
		# Generates the TemplateContent section
		 $xmlWriter.WriteStartElement('TemplateContent')
		 
			$xmlWriter.WriteStartElement('Project')
			$xmlWriter.WriteAttributeString("File", $target) 
			$xmlWriter.WriteAttributeString("ReplaceParameters", "true")
		 
			GetFiles $xmlWriter $generationPath $exclude
		 
			$xmlWriter.WriteEndElement()
		$xmlWriter.WriteEndElement()
	
	$xmlWriter.WriteEndElement()
	
	# Flushes all the writing changes and closes the stream
	$xmlWriter.Flush()
    $xmlWriter.Close()
}   