using System;
using System.Collections.Generic;
using System.Reflection;

public static partial class ModFrame
{
    /// <summary>
    /// This function gets a list of all the layout filter names and their full action filter names
    /// </summary>
    /// <returns>returns the full filter class path and the filter names</returns>
    public static Dictionary<string, string> GetLayouts()
    {
        //Holds the list
        Dictionary<string, string> temp = new Dictionary<string, string>();

        //Gets the type of class main Layout class
        Type type = typeof(ModFrameLayouts);

        //Gets all the classes within ModFrameLayouts
        //Note: all layout filter must follow this pattern
        var internalClasses = type.GetNestedTypes(BindingFlags.Public);

        //Checks its found some layout instances inside the ModFrameLayouts
        if (internalClasses.Length > 0)
        {
            //Loops over all the classes inside the static ModFrameLayouts class
            foreach (var internalClass in internalClasses)
            {
                //Checks it is a class
                TypeInfo info = internalClass.GetTypeInfo();
                if (info != null && info.IsClass)
                {
                    //Creates an instance of the class
                    var createdObject = (dynamic)Activator.CreateInstance(internalClass);

                    //Gets the layout name from the initiate class
                    var layoutName = createdObject.layoutName;

                    //Replaces the plus with a dot so we can use the name properly
                    var fullClassName = internalClass.FullName.Replace('+', '.');

                    //Adds the filter name and the lauout name to the list
                    temp.Add(fullClassName, layoutName);
                }
            }
        }

        //Returns the list
        return temp;
    }

    /// <summary>
    /// This function gets a list of all the layouts and then checks if one of them has the specified filter class
    /// Note: This requires the full class path, for example, ModFrameLayouts.DefaultLayout
    /// </summary>
    /// <param name="filterName"></param>
    /// <returns></returns>
    public static bool ContainsLayoutFilter(string filterName)
    {
        var temp = GetLayouts();
        return temp.ContainsKey(filterName);
    }

    /// <summary>
    /// This function gets a list of all the layouts and then checks if one of them has the supplied name
    /// </summary>
    /// <param name="name"></param>
    /// <returns></returns>
    public static bool ContainsLayoutName(string name)
    {
        var temp = GetLayouts();
        return temp.ContainsValue(name);
    }
}