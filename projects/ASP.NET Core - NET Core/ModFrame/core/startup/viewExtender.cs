using Microsoft.AspNetCore.Mvc.Razor;
using System.Collections.Generic;
using System.IO;
using System.Linq;

public static partial class ModFrame
{
    internal class ViewExtender : IViewLocationExpander
    {
        public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
        {
            List<string> existing = viewLocations.ToList();
            existing.Clear();

            //Sets up the generic views
            List<string> allTheViewPaths = new List<string>();

            //Gets the directory names of the layout plugin folder
            string[] layoutFolders = Directory.GetDirectories(Path.Combine(theApplicationPath, "Layouts", "structures"));

            foreach (string folder in layoutFolders)
            {
                //Adds the layout plugin views to the acception list
                allTheViewPaths.Add("/Layouts/structures/" + Path.GetFileNameWithoutExtension(folder) + "/views/{1}/{0}.cshtml");
                allTheViewPaths.Add("/Layouts/structures/" + Path.GetFileNameWithoutExtension(folder) + "/views/{0}.cshtml");
            }

            //Gets the directory names of the module plugin folder
            string[] folders = Directory.GetDirectories(Path.Combine(theApplicationPath, "Modules"));

            foreach (string folder in folders)
            {
                //Adds the module plugin views to the acception list
                allTheViewPaths.Add("/Modules/" + Path.GetFileNameWithoutExtension(folder) + "/views/{1}/{0}.cshtml");
                allTheViewPaths.Add("/Modules/" + Path.GetFileNameWithoutExtension(folder) + "/views/{0}.cshtml");
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