using Microsoft.AspNetCore.Mvc.Razor;
using System.Collections.Generic;
using System.IO;
using System.Linq;

public static partial class ModFrame
{
    public class ViewExtender : IViewLocationExpander
    {
        public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
        {
            List<string> existing = viewLocations.ToList();
            existing.Clear();

            //Sets up the generic views
            List<string> allTheViewPaths = new List<string>();

            //Gets the directory names of the layout plugin folder
            string[] layoutFolders = Directory.GetDirectories(Path.Combine(theApplicationPath, "Layouts"));
            foreach (string folder in layoutFolders)
            {
                //Checks if the layout has views before adding it to the acception list
                if (Directory.Exists(Path.Combine(theApplicationPath, "layouts", folder, "views")))
                {
                    //Adds the layout plugin views to the acception list
                    allTheViewPaths.Add($"/Layouts/{Path.GetFileNameWithoutExtension(folder)}/views/{{1}}/{{0}}.cshtml");
                    allTheViewPaths.Add($"/Layouts/{Path.GetFileNameWithoutExtension(folder)}/views/{{0}}.cshtml");
                }
            }

            //Gets the group names of the modules folder
            string[] moduleBaseFolders = Directory.GetDirectories(Path.Combine(theApplicationPath, "Modules"));
            foreach(string group in moduleBaseFolders)
            {
                //Gets the module names within that group folder
                string[] moduleFolders = Directory.GetDirectories(Path.Combine(theApplicationPath, group));
                foreach(string module in moduleFolders)
                {
                    //Checks if the module has views before adding it to the acception list
                    if (Directory.Exists(Path.Combine(theApplicationPath, group, module, "views")))
                    {
                        //Adds the module views to the acception list
                        allTheViewPaths.Add($"/Modules/{Path.GetFileNameWithoutExtension(group)}/{Path.GetFileNameWithoutExtension(module)}/views/{{1}}/{{0}}.cshtml");
                        allTheViewPaths.Add($"/Modules/{Path.GetFileNameWithoutExtension(group)}/{Path.GetFileNameWithoutExtension(module)}/views/{{0}}.cshtml");
                    }
                }
            }

            //Updates the razor view locations
            existing.AddRange(allTheViewPaths);

            //Returns the new view locations
            return existing;
        }

        public void PopulateValues(ViewLocationExpanderContext context)
        {
            // do nothing.. not entirely needed for this 
        }
    }
}